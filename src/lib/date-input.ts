export function getLocalDateIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateRangeForPayload(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return "";
  if (startDate && endDate && startDate !== endDate) {
    return `${startDate} to ${endDate}`;
  }
  return startDate || endDate;
}
