export type TravelMood =
  | "luxury"
  | "adventure"
  | "romantic"
  | "family"
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

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  region: "domestic" | "international";
  stars: number;
  price: number;
  image: string;
  amenities: string[];
  rating: number;
}

export interface Testimonial {
  id: string;
  name: string;
  destination: string;
  quote: string;
  image: string;
  video?: string;
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface MoodOption {
  id: TravelMood;
  label: string;
  description: string;
  image: string;
}
