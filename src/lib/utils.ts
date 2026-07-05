import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isPriceOnRequest(amount: number, onRequest?: boolean) {
  return onRequest ?? amount <= 0;
}

export function formatPriceLabel(amount: number, onRequest?: boolean) {
  return isPriceOnRequest(amount, onRequest) ? "Inquire for price" : formatPrice(amount);
}

/** Ensures titles like Mr/Mr,/Mr. render consistently as "Mr." */
export function formatHonorificName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;

  // Longer honorifics first — "Mr" must not match inside "Mrs", nor "Ms" inside "Miss".
  return trimmed.replace(
    /^(Miss|Mrs|Mr|Ms|Dr|Prof|Shri|Smt)\.?\s*,?\s*/i,
    (_, honorific: string) =>
      `${honorific.charAt(0).toUpperCase()}${honorific.slice(1).toLowerCase()}. `,
  );
}

/** Keeps the first occurrence of each string (skips empty values). */
export function uniqueStringsPreservingOrder(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

export function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/** Dedupe admin/CMS list rows by id field (first occurrence wins). */
export function dedupeRowsByField<T extends Record<string, unknown>>(
  rows: T[],
  field: string,
): T[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const id = String(row[field] ?? "");
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}
