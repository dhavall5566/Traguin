/** Destination listing filter tiers (starting price in INR). */
export const DESTINATION_PRICE_FILTERS = [
  { id: "all", label: "All budgets" },
  { id: "budget-friendly", label: "Budget friendly" },
  { id: "1L-3L", label: "1L – 3L" },
  { id: "over3L", label: "3L+" },
] as const;

export type DestinationPriceFilterId = (typeof DESTINATION_PRICE_FILTERS)[number]["id"];

/** Lead / planner forms — representative INR ceiling per tier. */
export const FORM_BUDGET_RANGES = [
  { value: "75000", label: "Budget friendly", hint: "Under ₹1L" },
  { value: "200000", label: "₹1L – ₹3L" },
  { value: "400000", label: "₹3L – ₹5L" },
  { value: "750000", label: "₹5L – ₹10L" },
  { value: "1000001", label: "₹10L+" },
] as const;

/** Dual-handle budget slider bounds (INR). */
export const BUDGET_SLIDER_MIN = 50_000;
export const BUDGET_SLIDER_MAX = 2_000_000;
export const BUDGET_SLIDER_STEP = 25_000;
export const BUDGET_SLIDER_DEFAULT_MIN = 100_000;
export const BUDGET_SLIDER_DEFAULT_MAX = 300_000;

export function formatInrBudgetShort(amount: number): string {
  if (amount >= 100_000) {
    const lakhs = amount / 100_000;
    const rounded = Math.round(lakhs * 10) / 10;
    return Number.isInteger(rounded) ? `₹${rounded}L` : `₹${rounded.toFixed(1)}L`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return `₹${Math.round(thousands)}K`;
  }
  return `₹${amount}`;
}

export function formatInrBudgetRange(min: number, max: number): string {
  if (max >= BUDGET_SLIDER_MAX) {
    return `${formatInrBudgetShort(min)} – ${formatInrBudgetShort(BUDGET_SLIDER_MAX)}+`;
  }
  return `${formatInrBudgetShort(min)} – ${formatInrBudgetShort(max)}`;
}

export function matchesDestinationPriceFilter(
  startingPrice: number,
  filterId: DestinationPriceFilterId
): boolean {
  if (filterId === "all") return true;
  if (filterId === "budget-friendly") return startingPrice < 100_000;
  if (filterId === "1L-3L") return startingPrice >= 100_000 && startingPrice <= 300_000;
  if (filterId === "over3L") return startingPrice > 300_000;
  return true;
}
