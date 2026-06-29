import type { PaginatedResponse } from "@/lib/api/types";
import { ADMIN_LOGIN_PATH } from "@/lib/admin/auth";
import {
  adminRelationCacheKey,
  getCachedRelationOptions,
  setCachedRelationOptions,
} from "@/lib/admin/admin-data-cache";
import { parseAdminPaginatedList } from "@/lib/admin/list-response";

export type AdminApiError = {
  status: number;
  message: string;
  fieldErrors: Record<string, string>;
};

export type AdminListResult<T> = PaginatedResponse<T>;

function flattenFieldErrors(errors: unknown): Record<string, string> {
  if (!Array.isArray(errors)) return {};
  const out: Record<string, string> = {};
  for (const err of errors as { loc?: unknown[]; msg?: string }[]) {
    const loc = err.loc ?? [];
    const key = loc.length > 1 ? String(loc[loc.length - 1]) : "form";
    if (!out[key]) out[key] = err.msg ?? "Invalid value";
  }
  return out;
}

async function parseError(response: Response): Promise<AdminApiError> {
  let body: { detail?: unknown; errors?: unknown; message?: string } = {};
  try {
    body = await response.json();
  } catch {
    /* empty */
  }
  const fieldErrors = flattenFieldErrors(body.errors ?? (typeof body.detail === "object" && body.detail !== null && "errors" in body.detail ? (body.detail as { errors?: unknown }).errors : undefined));
  let message = "Request failed";
  if (Object.keys(fieldErrors).length > 0) {
    message = "Please fix the highlighted fields.";
  } else if (typeof body.detail === "string") message = body.detail;
  else if (body.message) message = body.message;
  return { status: response.status, message, fieldErrors };
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit
): Promise<{ data: T | null; error: AdminApiError | null }> {
  const url = `/api/admin${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (!headers.has("Content-Type") && init?.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });

  if (response.status === 401 && typeof window !== "undefined") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `${ADMIN_LOGIN_PATH}?next=${next}`;
    return { data: null, error: { status: 401, message: "Session expired.", fieldErrors: {} } };
  }

  if (!response.ok) {
    return { data: null, error: await parseError(response) };
  }

  if (response.status === 204) {
    return { data: null, error: null };
  }

  const data = (await response.json()) as T;
  return { data, error: null };
}

export async function adminList<T>(
  endpoint: string,
  limit: number,
  offset: number
): Promise<{ data: AdminListResult<T> | null; error: AdminApiError | null }> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  return adminFetch<AdminListResult<T>>(`${endpoint}?${params.toString()}`);
}

export async function adminGetOne<T>(
  endpoint: string,
  id: string
): Promise<{ data: T | null; error: AdminApiError | null }> {
  return adminFetch<T>(`${endpoint}/${id}`);
}

export async function adminCreate<T>(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<{ data: T | null; error: AdminApiError | null }> {
  return adminFetch<T>(endpoint, { method: "POST", body: JSON.stringify(payload) });
}

export type AdminMediaAsset = {
  id: string;
  slug: string | null;
  url: string;
  alt_text: string | null;
  mime_type: string | null;
  source: string;
  usage: string | null;
};

export async function adminUploadMedia(
  file: File,
  altText?: string
): Promise<{ data: AdminMediaAsset | null; error: AdminApiError | null }> {
  const form = new FormData();
  form.append("file", file);
  if (altText?.trim()) form.append("alt_text", altText.trim());
  return adminFetch<AdminMediaAsset>("/media/upload", { method: "POST", body: form });
}

export async function adminUpdate<T>(
  endpoint: string,
  id: string,
  payload: Record<string, unknown>
): Promise<{ data: T | null; error: AdminApiError | null }> {
  return adminFetch<T>(`${endpoint}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function adminPatchSingleton<T>(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<{ data: T | null; error: AdminApiError | null }> {
  return adminFetch<T>(endpoint, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function adminGetSingleton<T>(
  endpoint: string
): Promise<{ data: T | null; error: AdminApiError | null }> {
  return adminFetch<T>(endpoint);
}

export async function adminDelete(
  endpoint: string,
  id: string
): Promise<{ error: AdminApiError | null }> {
  const { error } = await adminFetch<null>(`${endpoint}/${id}`, { method: "DELETE" });
  return { error };
}

export async function adminChangePassword(payload: {
  current_password: string;
  new_password: string;
}): Promise<{ data: { message: string } | null; error: AdminApiError | null }> {
  return adminFetch<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminRelationOptions(
  relationEndpoint: string,
  valueKey = "id",
  labelKey = "title",
  labelKeys?: string[]
): Promise<{ value: string; label: string }[]> {
  const cacheKey = adminRelationCacheKey(relationEndpoint, valueKey, labelKey, labelKeys);
  const cached = getCachedRelationOptions(cacheKey);
  if (cached) return cached;

  const { data } = await adminList<Record<string, unknown>>(relationEndpoint, 100, 0);
  const { items } = parseAdminPaginatedList(data);
  if (items.length === 0) return [];
  const options = items.map((item) => {
    let label = "";
    if (labelKeys) {
      label = labelKeys.map((k) => String(item[k] ?? "")).filter(Boolean).join(" · ") || String(item[valueKey]);
    } else {
      label = String(item[labelKey] ?? item.slug ?? item[valueKey] ?? "");
    }
    return { value: String(item[valueKey]), label };
  });
  setCachedRelationOptions(cacheKey, options);
  return options;
}
