/**
 * Public-site toggles — keep data and routes in place; flip to `true` to show again.
 */
export const LUXURY_STAYS_VISIBLE = false;

export function isLuxuryStaysVisible(): boolean {
  return LUXURY_STAYS_VISIBLE;
}

/** Hide hotel sliders, luxury-stays links, and partner-property stats. */
export function isHotelContentVisible(): boolean {
  return LUXURY_STAYS_VISIBLE;
}

const LUXURY_STAYS_HREF = "/luxury-stays";

export function isLuxuryStaysHref(href: string): boolean {
  return href === LUXURY_STAYS_HREF || href.startsWith(`${LUXURY_STAYS_HREF}/`);
}

export function filterLuxuryStaysNavLinks<T extends { href: string }>(links: readonly T[]): T[] {
  if (isLuxuryStaysVisible()) return [...links];
  return links.filter((link) => !isLuxuryStaysHref(link.href));
}
