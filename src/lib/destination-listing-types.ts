import type { TravelMood } from "@/types";

export type DestinationCategoryRef = {
  id: string;
  title: string;
};

export type IndiaRegion = "north" | "central" | "east" | "south" | "west";

export type DestinationListing = {
  id: string;
  name: string;
  description: string;
  image: string;
  /** CMS gallery URLs when linked in admin */
  galleryImages?: string[];
  startingPrice: number;
  categoryId: string;
  categoryTitle: string;
  categories: DestinationCategoryRef[];
  region: "domestic" | "international";
  /** ISO-style country name from CMS (e.g. India, Indonesia). */
  country?: string;
  indiaRegion?: IndiaRegion;
  moods: TravelMood[];
  hasItinerary: boolean;
  /** Published itinerary count for this destination (0 if none). */
  journeyCount: number;
};

/** Card-level itinerary fields for the destinations listing (not full detail). */
export type DestinationItineraryPreview = {
  destination: string;
  highlights: string[];
  heroImage: string;
  startingPrice: number;
  duration: string;
};

/** Individual package card on the destinations listing (multi-journey destinations). */
export type DestinationPackagePreview = DestinationItineraryPreview & {
  slug: string;
  title: string;
};

export const INDIA_REGION_FILTERS = [
  { id: "all", label: "All areas" },
  { id: "north", label: "North" },
  { id: "central", label: "Central" },
  { id: "west", label: "West" },
  { id: "south", label: "South" },
  { id: "east", label: "East" },
] as const;
