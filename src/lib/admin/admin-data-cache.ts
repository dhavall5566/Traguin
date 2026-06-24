import { parseAdminPaginatedList } from "@/lib/admin/list-response";

const LIST_CACHE_TTL_MS = 60_000;
const RECORD_CACHE_TTL_MS = 60_000;
const RELATION_CACHE_TTL_MS = 120_000;

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

export function adminListCacheKey(endpoint: string, limit: number, offset: number) {
  return `${endpoint}:${limit}:${offset}`;
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
  options?: { force?: boolean },
): Promise<{ items: Record<string, unknown>[]; total: number; fromCache: boolean } | { error: string }> {
  const key = adminListCacheKey(endpoint, limit, offset);
  const cached = options?.force ? null : getCachedAdminList(key);

  if (cached) {
    void refreshAdminListInBackground(endpoint, limit, offset, key);
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
      const data = await fetchAdminListRaw(endpoint, limit, offset);
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
) {
  if (inflightLists.has(key)) return;

  const request = (async () => {
    const data = await fetchAdminListRaw(endpoint, limit, offset);
    inflightLists.delete(key);
    if (!data) return null;
    setCachedAdminList(key, data.items, data.total);
    return listCache.get(key) ?? null;
  })();

  inflightLists.set(key, request);
  await request;
}

export function prefetchAdminList(endpoint: string, limit = 20, offset = 0) {
  const key = adminListCacheKey(endpoint, limit, offset);
  if (getCachedAdminList(key) || inflightLists.has(key)) return;
  void refreshAdminListInBackground(endpoint, limit, offset, key);
}

async function fetchAdminListRaw(
  endpoint: string,
  limit: number,
  offset: number,
): Promise<{ items: Record<string, unknown>[]; total: number } | null> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
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
