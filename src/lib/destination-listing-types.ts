import type { TravelMood } from "@/types";

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

/** Card-level itinerary fields for the destinations listing (not full detail). */
export type DestinationItineraryPreview = {
  destination: string;
  highlights: string[];
  heroImage: string;
  startingPrice: number;
  duration: string;
};

export const INDIA_REGION_FILTERS = [
  { id: "all", label: "All areas" },
  { id: "north", label: "North" },
  { id: "east", label: "East" },
  { id: "south", label: "South" },
  { id: "west", label: "West" },
] as const;
