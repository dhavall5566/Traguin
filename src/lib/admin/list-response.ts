/** Safely normalize admin paginated list JSON (handles null / malformed bodies). */
export function parseAdminPaginatedList<T extends Record<string, unknown> = Record<string, unknown>>(
  data: unknown,
): { items: T[]; total: number } {
  if (!data || typeof data !== "object") {
    return { items: [], total: 0 };
  }

  const record = data as { items?: unknown; total?: unknown };
  const items = Array.isArray(record.items) ? (record.items as T[]) : [];
  const totalRaw = record.total;
  const total =
    typeof totalRaw === "number" && Number.isFinite(totalRaw)
      ? totalRaw
      : Number(totalRaw) || items.length;

  return { items, total };
}
