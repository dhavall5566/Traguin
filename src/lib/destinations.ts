import { destinationCategories } from "@/data/destinationCategories";
import { destinations } from "@/data/destinations";
import {
  getItineraryByDestinationId,
  getItineraryRating,
  getItineraryReviewCount,
} from "@/lib/itineraries";
import type {
  DestinationCategoryRef,
  DestinationItineraryPreview,
  DestinationListing,
} from "@/lib/destination-listing-types";
import { resolveIndiaRegion } from "@/lib/india-region";
import type { TravelMood } from "@/types";

export type {
  DestinationCategoryRef,
  DestinationItineraryPreview,
  DestinationListing,
  IndiaRegion,
} from "@/lib/destination-listing-types";
export { INDIA_REGION_FILTERS } from "@/lib/destination-listing-types";

function destinationHash(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getDestinationRating(destinationId: string, fallback = 5): number {
  const itinerary = getItineraryByDestinationId(destinationId);
  if (itinerary) return getItineraryRating(itinerary);
  return fallback;
}

export function getDestinationReviewCount(destinationId: string, rating?: number): number {
  const itinerary = getItineraryByDestinationId(destinationId);
  if (itinerary) return getItineraryReviewCount(itinerary);

  const resolvedRating = rating ?? getDestinationRating(destinationId);
  const hash = destinationHash(destinationId);
  return 42 + (hash % 120) + Math.round(resolvedRating * 8);
}

export const INTERNATIONAL_COLLECTION_FILTERS = destinationCategories
  .filter((category) => category.id !== "indian-escapes")
  .map((category) => ({
    id: category.id,
    label: category.title,
  }));

function getDestinationMeta(id: string) {
  return destinations.find((d) => d.id === id);
}

export function getAllDestinations(): DestinationListing[] {
  const map = new Map<string, DestinationListing>();

  for (const category of destinationCategories) {
    for (const dest of category.destinations) {
      const existing = map.get(dest.id);
      const categoryRef = { id: category.id, title: category.title };

      if (existing) {
        existing.categories.push(categoryRef);
        continue;
      }

      const meta = getDestinationMeta(dest.id);
      map.set(dest.id, {
        ...dest,
        categoryId: category.id,
        categoryTitle: category.title,
        categories: [categoryRef],
        region: meta?.region ?? "international",
        indiaRegion: resolveIndiaRegion(dest.id),
        moods: meta?.moods ?? [],
        hasItinerary: !!getItineraryByDestinationId(dest.id),
        journeyCount: getItineraryByDestinationId(dest.id) ? 1 : 0,
      });
    }
  }

  return Array.from(map.values());
}

export function getDestinationById(id: string): DestinationListing | undefined {
  return getAllDestinations().find((d) => d.id === id);
}

export function getAllDestinationIds(): string[] {
  return getAllDestinations().map((d) => d.id);
}
