export const ADMIN_NUMBER_MIN = 0;

export function isAllowedAdminNumberDraft(raw: string): boolean {
  return raw === "" || !raw.startsWith("-");
}

export function normalizeAdminNumberDraft(raw: string): string {
  if (raw.trim() === "") return "";
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) return "";
  if (parsed < ADMIN_NUMBER_MIN) return String(ADMIN_NUMBER_MIN);
  return raw;
}

export function clampAdminNumber(value: number): number {
  if (!Number.isFinite(value)) return ADMIN_NUMBER_MIN;
  return Math.max(ADMIN_NUMBER_MIN, value);
}

export function coerceAdminNumberPayload(raw: unknown, required = false): number | null {
  if (raw === "" || raw == null) {
    return required ? ADMIN_NUMBER_MIN : null;
  }

  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    return required ? ADMIN_NUMBER_MIN : null;
  }

  return clampAdminNumber(parsed);
}
