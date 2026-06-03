import itinerariesJson from "@/data/itineraries.json";
import type { Itinerary } from "@/types/itinerary";

/** All itineraries — add entries to `src/data/itineraries.json` with matching `destinationId`. Shown at /destinations/[destinationId]. */
export const itineraries: Itinerary[] = itinerariesJson as Itinerary[];

export function getAllItineraries(): Itinerary[] {
  return itineraries;
}

export function getItineraryBySlug(slug: string): Itinerary | undefined {
  return itineraries.find((i) => i.slug === slug);
}

export function getItineraryByDestinationId(destinationId: string): Itinerary | undefined {
  return itineraries.find((i) => i.destinationId === destinationId);
}

export function getItineraryByPackageId(packageId: string): Itinerary | undefined {
  return itineraries.find((i) => i.packageId === packageId);
}

export function getAllItinerarySlugs(): string[] {
  return itineraries.map((i) => i.slug);
}

/** Inquiry form + WhatsApp block on destination pages */
export function getItineraryInquiryHref(destinationId: string): string {
  return `/destinations/${destinationId}#inquiry`;
}

export function getDefaultItineraryInquiryHref(): string {
  const featured = itineraries.find((i) => i.featured) ?? itineraries[0];
  return featured ? getItineraryInquiryHref(featured.destinationId) : "/destinations";
}

export function getFeaturedItineraries(limit = 4): Itinerary[] {
  return itineraries
    .filter((i) => i.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
    .slice(0, limit);
}
