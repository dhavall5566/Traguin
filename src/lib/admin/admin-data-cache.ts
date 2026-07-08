import { parseAdminPaginatedList } from "@/lib/admin/list-response";

const LIST_CACHE_TTL_MS = 120_000;
const RECORD_CACHE_TTL_MS = 120_000;
const RELATION_CACHE_TTL_MS = 300_000;

type ListCacheEntry = {
  items: Record<string, unknown>[];
  total: number;
  fetchedAt: number;
};

type ListCacheListener = (key: string, entry: ListCacheEntry) => void;

type RecordCacheEntry = {
  record: Record<string, unknown>;
  fetchedAt: number;
};

type RelationCacheEntry = {
  options: { value: string; label: string }[];
  fetchedAt: number;
};

const listCache = new Map<string, ListCacheEntry>();
const listCacheListeners = new Set<ListCacheListener>();
const recordCache = new Map<string, RecordCacheEntry>();
const relationCache = new Map<string, RelationCacheEntry>();
const inflightLists = new Map<string, Promise<ListCacheEntry | null>>();
const inflightRecords = new Map<string, Promise<Record<string, unknown> | null>>();

function isFresh(fetchedAt: number, ttl: number) {
  return Date.now() - fetchedAt < ttl;
}

export function adminListCacheKey(
  endpoint: string,
  limit: number,
  offset: number,
  query: Record<string, string> = {},
) {
  const queryKey =
    Object.keys(query).length > 0
      ? `:${new URLSearchParams(query).toString()}`
      : "";
  return `${endpoint}:${limit}:${offset}${queryKey}`;
}

export function adminRecordCacheKey(endpoint: string, recordId: string | "singleton") {
  return `${endpoint}:${recordId}`;
}

export function adminRelationCacheKey(
  endpoint: string,
  valueKey: string,
  labelKey: string,
  labelKeys?: string[],
) {
  return `${endpoint}:${valueKey}:${labelKey}:${labelKeys?.join("|") ?? ""}`;
}

export function getCachedAdminList(key: string): ListCacheEntry | null {
  const entry = listCache.get(key);
  if (!entry) return null;
  if (!isFresh(entry.fetchedAt, LIST_CACHE_TTL_MS)) return null;
  return entry;
}

export function peekCachedAdminList(key: string): ListCacheEntry | null {
  return listCache.get(key) ?? null;
}

export function setCachedAdminList(
  key: string,
  items: Record<string, unknown>[] | null | undefined,
  total: number | null | undefined,
) {
  const entry = {
    items: Array.isArray(items) ? items : [],
    total: total ?? 0,
    fetchedAt: Date.now(),
  };
  listCache.set(key, entry);
  for (const listener of listCacheListeners) {
    listener(key, entry);
  }
}

export function subscribeAdminListCache(listener: ListCacheListener) {
  listCacheListeners.add(listener);
  return () => {
    listCacheListeners.delete(listener);
  };
}

export function invalidateAdminListCache(endpoint?: string) {
  if (!endpoint) {
    listCache.clear();
    inflightLists.clear();
    return;
  }

  for (const key of listCache.keys()) {
    if (key.startsWith(`${endpoint}:`)) {
      listCache.delete(key);
      inflightLists.delete(key);
    }
  }
}

export function patchCachedAdminListItem(
  endpoint: string,
  idField: string,
  recordId: string,
  patch: Record<string, unknown>,
) {
  for (const [key, entry] of listCache.entries()) {
    if (!key.startsWith(`${endpoint}:`)) continue;

    const items = entry.items.map((item) =>
      String(item[idField]) === recordId ? { ...item, ...patch } : item,
    );
    setCachedAdminList(key, items, entry.total);
  }

  const recordKey = adminRecordCacheKey(endpoint, recordId);
  const record = peekCachedAdminRecord(recordKey);
  if (record) {
    setCachedAdminRecord(recordKey, { ...record, ...patch });
  }
}

export function prependCachedAdminListItem(
  endpoint: string,
  item: Record<string, unknown>,
  idField = "id",
) {
  const itemId = String(item[idField] ?? "");
  let touched = false;

  for (const [key, entry] of listCache.entries()) {
    if (!key.startsWith(`${endpoint}:`)) continue;

    const parts = key.split(":");
    const offset = Number(parts[parts.length - 1] ?? 0);
    if (offset !== 0) continue;

    const limit = Number(parts[parts.length - 2] ?? entry.items.length);
    const withoutDup = entry.items.filter((row) => String(row[idField] ?? "") !== itemId);
    const items = [item, ...withoutDup].slice(0, limit > 0 ? limit : withoutDup.length + 1);
    const total = entry.items.some((row) => String(row[idField] ?? "") === itemId)
      ? entry.total
      : entry.total + 1;
    setCachedAdminList(key, items, total);
    touched = true;
  }

  if (!touched) {
    setCachedAdminList(`${endpoint}:20:0`, [item], 1);
  }

  if (itemId) {
    setCachedAdminRecord(adminRecordCacheKey(endpoint, itemId), item);
  }
}

export function upsertCachedAdminListItem(
  endpoint: string,
  idField: string,
  record: Record<string, unknown>,
) {
  const recordId = String(record[idField] ?? "");
  if (!recordId) return;

  let found = false;
  for (const entry of listCache.values()) {
    if (entry.items.some((item) => String(item[idField] ?? "") === recordId)) {
      found = true;
      break;
    }
  }

  if (found) {
    patchCachedAdminListItem(endpoint, idField, recordId, record);
  } else {
    prependCachedAdminListItem(endpoint, record, idField);
  }

  setCachedAdminRecord(adminRecordCacheKey(endpoint, recordId), record);
}

export function removeCachedAdminListItem(
  endpoint: string,
  idField: string,
  recordId: string,
) {
  let removed = false;

  for (const [key, entry] of listCache.entries()) {
    if (!key.startsWith(`${endpoint}:`)) continue;

    const items = entry.items.filter((item) => String(item[idField] ?? "") !== recordId);
    if (items.length === entry.items.length) continue;

    removed = true;
    setCachedAdminList(key, items, Math.max(0, entry.total - 1));
  }

  recordCache.delete(adminRecordCacheKey(endpoint, recordId));

  return removed;
}

export function revalidateAdminListInBackground(
  endpoint: string,
  limit: number,
  offset: number,
  query: Record<string, string> = {},
) {
  const key = adminListCacheKey(endpoint, limit, offset, query);
  void refreshAdminListInBackground(endpoint, limit, offset, key, query);
}

export function getCachedAdminRecord(key: string): Record<string, unknown> | null {
  const entry = recordCache.get(key);
  if (!entry) return null;
  if (!isFresh(entry.fetchedAt, RECORD_CACHE_TTL_MS)) return null;
  return entry.record;
}

export function peekCachedAdminRecord(key: string): Record<string, unknown> | null {
  return recordCache.get(key)?.record ?? null;
}

export function setCachedAdminRecord(key: string, record: Record<string, unknown>) {
  recordCache.set(key, { record, fetchedAt: Date.now() });
}

export function invalidateAdminRecordCache(endpoint?: string) {
  if (!endpoint) {
    recordCache.clear();
    inflightRecords.clear();
    return;
  }

  for (const key of recordCache.keys()) {
    if (key.startsWith(`${endpoint}:`)) {
      recordCache.delete(key);
      inflightRecords.delete(key);
    }
  }
}

export function getCachedRelationOptions(key: string) {
  const entry = relationCache.get(key);
  if (!entry) return null;
  if (!isFresh(entry.fetchedAt, RELATION_CACHE_TTL_MS)) return null;
  return entry.options;
}

export function setCachedRelationOptions(
  key: string,
  options: { value: string; label: string }[],
) {
  relationCache.set(key, { options, fetchedAt: Date.now() });
}

export async function fetchAdminListCached(
  endpoint: string,
  limit: number,
  offset: number,
  options?: { force?: boolean; query?: Record<string, string> },
): Promise<{ items: Record<string, unknown>[]; total: number; fromCache: boolean } | { error: string }> {
  const query = options?.query ?? {};
  const key = adminListCacheKey(endpoint, limit, offset, query);
  const cached = options?.force ? null : getCachedAdminList(key);

  if (cached) {
    void refreshAdminListInBackground(endpoint, limit, offset, key, query);
    return {
      items: cached.items ?? [],
      total: cached.total ?? 0,
      fromCache: true,
    };
  }

  const stale = peekCachedAdminList(key);
  const inflight = inflightLists.get(key);
  const request =
    inflight ??
    (async () => {
      const data = await fetchAdminListRaw(endpoint, limit, offset, query);
      inflightLists.delete(key);
      if (!data) return null;
      setCachedAdminList(key, data.items, data.total);
      return listCache.get(key) ?? null;
    })();

  if (!inflight) inflightLists.set(key, request);

  const result = await request;
  if (result) {
    return {
      items: result.items ?? [],
      total: result.total ?? 0,
      fromCache: false,
    };
  }

  if (stale) {
    return {
      items: stale.items ?? [],
      total: stale.total ?? 0,
      fromCache: true,
    };
  }

  return { error: "Request failed" };
}

async function refreshAdminListInBackground(
  endpoint: string,
  limit: number,
  offset: number,
  key: string,
  query: Record<string, string> = {},
) {
  if (inflightLists.has(key)) return;

  const request = (async () => {
    const data = await fetchAdminListRaw(endpoint, limit, offset, query);
    inflightLists.delete(key);
    if (!data) return null;
    setCachedAdminList(key, data.items, data.total);
    return listCache.get(key) ?? null;
  })();

  inflightLists.set(key, request);
  await request;
}

export function prefetchAdminList(
  endpoint: string,
  limit = 20,
  offset = 0,
  query: Record<string, string> = {},
) {
  const key = adminListCacheKey(endpoint, limit, offset, query);
  if (getCachedAdminList(key) || inflightLists.has(key)) return;
  void refreshAdminListInBackground(endpoint, limit, offset, key, query);
}

async function fetchAdminListRaw(
  endpoint: string,
  limit: number,
  offset: number,
  query: Record<string, string> = {},
): Promise<{ items: Record<string, unknown>[]; total: number } | null> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  for (const [field, value] of Object.entries(query)) {
    if (value) params.set(field, value);
  }
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`/api/admin${path}?${params.toString()}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) return null;

  try {
    const json: unknown = await response.json();
    return parseAdminPaginatedList(json);
  } catch {
    return null;
  }
}

export async function fetchAdminRecordCached(
  key: string,
  loader: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>,
  options?: { force?: boolean },
): Promise<{ record: Record<string, unknown>; fromCache: boolean } | { error: string }> {
  const cached = options?.force ? null : getCachedAdminRecord(key);
  if (cached) {
    void fetchAdminRecordCached(key, loader, { force: true });
    return { record: cached, fromCache: true };
  }

  const stale = peekCachedAdminRecord(key);
  const inflight = inflightRecords.get(key);
  const request =
    inflight ??
    (async () => {
      const { data, error } = await loader();
      inflightRecords.delete(key);
      if (error || !data) return null;
      setCachedAdminRecord(key, data);
      return data;
    })();

  if (!inflight) inflightRecords.set(key, request);

  const result = await request;
  if (result) return { record: result, fromCache: false };
  if (stale) return { record: stale, fromCache: true };
  return { error: "Request failed" };
}
