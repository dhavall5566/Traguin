import type { IndiaRegion } from "@/lib/destination-listing-types";

/** Canonical India sub-region by CMS destination slug (overrides stale CMS values). */
const INDIA_REGION_BY_SLUG: Partial<Record<string, IndiaRegion>> = {
  kashmir: "north",
  himachal: "north",
  haryana: "north",
  ladakh: "north",
  uttarakhand: "north",
  punjab: "north",
  delhi: "north",
  "uttar-pradesh": "north",
  chhattisgarh: "central",
  jharkhand: "central",
  "madhya-pradesh": "central",
  kerala: "south",
  "andaman-and-nicobar": "south",
  lakshadweep: "south",
  "tamil-nadu": "south",
  "andhra-pradesh": "south",
  karnataka: "south",
  puducherry: "south",
  goa: "west",
  gujarat: "west",
  maharashtra: "west",
  rajasthan: "west",
  "dadra-and-nagar-haveli": "west",
  "daman-and-diu": "west",
  "west-bengal": "east",
  odisha: "east",
  assam: "east",
  sikkim: "east",
  bihar: "east",
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
