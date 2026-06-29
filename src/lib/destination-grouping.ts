import type { DestinationListing, IndiaRegion } from "@/lib/destination-listing-types";
import { INDIA_REGION_FILTERS } from "@/lib/destination-listing-types";

export type DestinationSubgroup = {
  id: string;
  title: string;
  destinations: DestinationListing[];
};

export type DestinationDisplaySection = {
  id: "domestic" | "international";
  title: string;
  description: string;
  subgroups: DestinationSubgroup[];
};

const INDIA_REGION_ORDER: IndiaRegion[] = ["north", "west", "south", "east"];

const INDIA_REGION_TITLES: Record<IndiaRegion, string> = {
  north: "North India",
  west: "West India",
  south: "South India",
  east: "East India",
};

export function slugifyDestinationGroup(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function countryFilterId(country: string): string {
  return slugifyDestinationGroup(country);
}

export function destinationCountryLabel(dest: DestinationListing): string | undefined {
  if (dest.country?.trim()) return dest.country.trim();
  if (dest.region === "domestic") return "India";
  return undefined;
}

export function buildInternationalCountryFilters(
  listings: DestinationListing[]
): { id: string; label: string }[] {
  const countries = new Set<string>();
  for (const dest of listings) {
    if (dest.region !== "international") continue;
    const label = destinationCountryLabel(dest);
    if (label) countries.add(label);
  }
  return Array.from(countries)
    .sort((a, b) => a.localeCompare(b))
    .map((label) => ({ id: countryFilterId(label), label }));
}

function sortDestinations(list: DestinationListing[]): DestinationListing[] {
  return [...list].sort((a, b) => {
    if (a.hasItinerary !== b.hasItinerary) return a.hasItinerary ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function buildIndiaSubgroups(destinations: DestinationListing[]): DestinationSubgroup[] {
  const byRegion = new Map<string, DestinationListing[]>();
  const unassigned: DestinationListing[] = [];

  for (const dest of destinations) {
    if (dest.region !== "domestic") continue;
    if (dest.indiaRegion && INDIA_REGION_ORDER.includes(dest.indiaRegion)) {
      const bucket = byRegion.get(dest.indiaRegion) ?? [];
      bucket.push(dest);
      byRegion.set(dest.indiaRegion, bucket);
    } else {
      unassigned.push(dest);
    }
  }

  const subgroups: DestinationSubgroup[] = [];

  for (const region of INDIA_REGION_ORDER) {
    const items = byRegion.get(region);
    if (!items?.length) continue;
    subgroups.push({
      id: region,
      title: INDIA_REGION_TITLES[region],
      destinations: sortDestinations(items),
    });
  }

  if (unassigned.length > 0) {
    subgroups.push({
      id: "other",
      title: "Other Regions",
      destinations: sortDestinations(unassigned),
    });
  }

  return subgroups;
}

function buildInternationalSubgroups(destinations: DestinationListing[]): DestinationSubgroup[] {
  const byCountry = new Map<string, DestinationListing[]>();

  for (const dest of destinations) {
    if (dest.region !== "international") continue;
    const label = destinationCountryLabel(dest) ?? dest.name;
    const id = countryFilterId(label);
    const bucket = byCountry.get(id) ?? [];
    bucket.push(dest);
    byCountry.set(id, bucket);
  }

  return Array.from(byCountry.entries())
    .sort(([idA], [idB]) => {
      const labelA = byCountry.get(idA)?.[0];
      const labelB = byCountry.get(idB)?.[0];
      const nameA = destinationCountryLabel(labelA!) ?? labelA?.name ?? idA;
      const nameB = destinationCountryLabel(labelB!) ?? labelB?.name ?? idB;
      return nameA.localeCompare(nameB);
    })
    .map(([id, items]) => ({
      id,
      title: destinationCountryLabel(items[0]!) ?? items[0]!.name,
      destinations: sortDestinations(items),
    }));
}

export function totalPackagesInDestinations(destinations: DestinationListing[]): number {
  return destinations.reduce((total, dest) => total + dest.journeyCount, 0);
}

export function buildDestinationDisplaySections(
  destinations: DestinationListing[],
  options?: {
    region?: "all" | "domestic" | "international";
    subregionId?: string;
  }
): DestinationDisplaySection[] {
  const region = options?.region ?? "all";
  const subregionId = options?.subregionId?.trim();
  const sections: DestinationDisplaySection[] = [];

  if (region === "all" || region === "domestic") {
    let subgroups = buildIndiaSubgroups(destinations);
    if (subregionId && subregionId !== "all") {
      subgroups = subgroups.filter((group) => group.id === subregionId);
    }
    if (subgroups.length > 0) {
      sections.push({
        id: "domestic",
        title: "India",
        description: "Diverse landscapes woven into singular luxury journeys — explore by region.",
        subgroups,
      });
    }
  }

  if (region === "all" || region === "international") {
    let subgroups = buildInternationalSubgroups(destinations);
    if (subregionId && subregionId !== "all") {
      subgroups = subgroups.filter((group) => group.id === subregionId);
    }
    if (subgroups.length > 0) {
      sections.push({
        id: "international",
        title: "International",
        description: "Curated journeys across the world — browse by country.",
        subgroups,
      });
    }
  }

  return sections;
}

export function isIndiaSubregionFilter(filterId: string): filterId is IndiaRegion | "other" {
  if (filterId === "other") return true;
  return INDIA_REGION_FILTERS.some((region) => region.id === filterId && region.id !== "all");
}

export function matchesDestinationSubregion(
  dest: DestinationListing,
  filterId: string,
  regionFilter: "all" | "domestic" | "international"
): boolean {
  if (filterId === "all") return true;

  if (isIndiaSubregionFilter(filterId)) {
    if (filterId === "other") {
      return dest.region === "domestic" && !dest.indiaRegion;
    }
    return dest.region === "domestic" && dest.indiaRegion === filterId;
  }

  if (dest.region !== "international") return false;
  const countryLabel = destinationCountryLabel(dest) ?? dest.name;
  return countryFilterId(countryLabel) === filterId;
}
