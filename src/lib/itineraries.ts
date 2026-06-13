import itinerariesJson from "@/data/itineraries.json";
import type { Itinerary } from "@/types/itinerary";

const itineraries: Itinerary[] = itinerariesJson as Itinerary[];

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

function slugHash(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getItineraryRating(itinerary: Pick<Itinerary, "slug" | "rating">): number {
  if (itinerary.rating != null) return itinerary.rating;
  const hash = slugHash(itinerary.slug);
  return Math.round((4.7 + (hash % 4) * 0.1) * 10) / 10;
}

export function getItineraryReviewCount(
  itinerary: Pick<Itinerary, "slug" | "rating" | "reviewCount">
): number {
  if (itinerary.reviewCount != null) return itinerary.reviewCount;
  const hash = slugHash(itinerary.slug);
  const rating = getItineraryRating(itinerary);
  return 36 + (hash % 140) + Math.round(rating * 10);
}
