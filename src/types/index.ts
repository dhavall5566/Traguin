export type TravelMood =
  | "luxury"
  | "adventure"
  | "romantic"
  | "family"
  | "solo"
  | "cultural"
  | "wildlife"
  | "beach"
  | "nature"
  | "spiritual";

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: "domestic" | "international";
  image: string;
  video?: string;
  description: string;
  packageCount: number;
  hotelCount: number;
  moods: TravelMood[];
  lat: number;
  lng: number;
}

export interface TravelPackage {
  id: string;
  title: string;
  destination: string;
  region: "domestic" | "international";
  duration: string;
  price: number;
  image: string;
  video?: string;
  highlights: string[];
  mood: TravelMood[];
  rating: number;
  featured?: boolean;
}

export interface NearbyAttraction {
  name: string;
  distance: string;
}

export interface Hotel {
  id: string;
  name: string;
  /** Resolved destination name; omitted when CMS destination_id is missing or unpublished */
  destination?: string;
  region: "domestic" | "international";
  stars: number;
  price: number;
  image: string;
  /** CMS gallery URLs; when set, overrides hardcoded hotel-galleries lookup */
  gallery?: string[];
  amenities: string[];
  nearbyAttractions: NearbyAttraction[];
  rating: number;
  /** Number of guest reviews; generated when omitted */
  reviewCount?: number;
  description?: string;
}

