import type { PaginatedResponse } from "./types";

const DEFAULT_BASE = "http://127.0.0.1:8001";

export function getCmsBaseUrl(): string {
  return (process.env.CMS_API_URL ?? DEFAULT_BASE).replace(/\/$/, "");
}

/**
 * Server-side CMS fetch. Uses CMS_API_URL (not NEXT_PUBLIC_) because homepage
 * data is loaded in Server Components — the browser never calls the CMS directly.
 */
export async function cmsFetch<T>(
  path: string,
  init?: RequestInit & { fresh?: boolean }
): Promise<T | null> {
  const url = `${getCmsBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  const { fresh, ...requestInit } = init ?? {};

  try {
    const response = await fetch(url, {
      ...requestInit,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...requestInit.headers,
      },
      ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[cms] ${response.status} ${url}`);
      }
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[cms] fetch failed ${url}`, error);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function cmsFetchPaginated<T>(
  path: string,
  options?: {
    limit?: number;
    fresh?: boolean;
    searchParams?: Record<string, string | boolean | undefined>;
  }
): Promise<T[]> {
  const limit = options?.limit ?? 100;
  const params = new URLSearchParams({ limit: String(limit), offset: "0" });

  if (options?.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    }
  }

  const separator = path.includes("?") ? "&" : "?";
  const data = await cmsFetch<PaginatedResponse<T>>(
    `${path}${separator}${params.toString()}`,
    { fresh: options?.fresh }
  );
  return data?.items ?? [];
}
