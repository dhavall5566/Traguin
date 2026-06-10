import { destinationCategories } from "@/data/destinationCategories";
import { destinations } from "@/data/destinations";
import {
  getItineraryByDestinationId,
  getItineraryRating,
  getItineraryReviewCount,
} from "@/lib/itineraries";
import type { TravelMood } from "@/types";

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

export type DestinationCategoryRef = {
  id: string;
  title: string;
};

export type IndiaRegion = "north" | "east" | "south" | "west";

export type DestinationListing = {
  id: string;
  name: string;
  description: string;
  image: string;
  startingPrice: number;
  categoryId: string;
  categoryTitle: string;
  categories: DestinationCategoryRef[];
  region: "domestic" | "international";
  indiaRegion?: IndiaRegion;
  moods: TravelMood[];
  hasItinerary: boolean;
};

const INDIA_REGION_BY_DESTINATION: Partial<Record<string, IndiaRegion>> = {
  kashmir: "north",
  himachal: "north",
  ladakh: "north",
  kerala: "south",
  goa: "west",
};

export const INDIA_REGION_FILTERS = [
  { id: "all", label: "All areas" },
  { id: "north", label: "North" },
  { id: "east", label: "East" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
] as const;

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
        indiaRegion: INDIA_REGION_BY_DESTINATION[dest.id],
        moods: meta?.moods ?? [],
        hasItinerary: !!getItineraryByDestinationId(dest.id),
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
