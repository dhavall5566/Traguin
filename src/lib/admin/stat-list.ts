export type StatListItem = {
  label: string;
  value: string;
};

export function statsToFormValue(raw: unknown): StatListItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const stat = (item ?? {}) as Record<string, unknown>;
    return {
      label: String(stat.label ?? ""),
      value: stat.value == null ? "" : String(stat.value),
    };
  });
}

export function formValueToStats(items: StatListItem[]): { label: string; value: string }[] {
  return items
    .map((item) => ({
      label: item.label.trim(),
      value: item.value.trim(),
    }))
    .filter((item) => item.label.length > 0);
}
