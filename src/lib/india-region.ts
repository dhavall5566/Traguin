import type { IndiaRegion } from "@/lib/destination-listing-types";

/** Canonical India sub-region by CMS destination slug (overrides stale CMS values). */
const INDIA_REGION_BY_SLUG: Partial<Record<string, IndiaRegion>> = {
  kashmir: "north",
  himachal: "north",
  ladakh: "north",
  uttarakhand: "north",
  punjab: "north",
  delhi: "north",
  "uttar-pradesh": "north",
  chhattisgarh: "central",
  jharkhand: "central",
  kerala: "south",
  "andaman-and-nicobar": "south",
  goa: "west",
  gujarat: "west",
  maharashtra: "west",
  rajasthan: "west",
  "arunachal-pradesh": "east",
};

/** Normalize CMS india_region aliases into listing regions. */
const CMS_INDIA_REGION_ALIASES: Record<string, IndiaRegion> = {
  north: "north",
  central: "central",
  east: "east",
  south: "south",
  west: "west",
  northeast: "east",
  "north-east": "east",
  islands: "south",
};

export function normalizeIndiaRegion(value?: string | null): IndiaRegion | undefined {
  if (!value?.trim()) return undefined;
  return CMS_INDIA_REGION_ALIASES[value.trim().toLowerCase()];
}

export function resolveIndiaRegion(
  slug: string,
  cmsRegion?: string | null
): IndiaRegion | undefined {
  return INDIA_REGION_BY_SLUG[slug] ?? normalizeIndiaRegion(cmsRegion);
}
