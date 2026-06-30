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
  kerala: "south",
  goa: "west",
  gujarat: "west",
  maharashtra: "west",
  rajasthan: "west",
};

export function resolveIndiaRegion(
  slug: string,
  cmsRegion?: IndiaRegion | null
): IndiaRegion | undefined {
  return INDIA_REGION_BY_SLUG[slug] ?? cmsRegion ?? undefined;
}
