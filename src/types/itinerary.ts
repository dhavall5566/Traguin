export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface ItineraryHotel {
  name: string;
  location: string;
  nights: string;
  image: string;
  description: string;
  stars?: number;
}

export interface ItineraryFaq {
  question: string;
  answer: string;
}

export interface Itinerary {
  slug: string;
  /** Matches TravelPackage.id in packages.ts */
  packageId: string;
  /** Links to destination id in destinationCategories — used for /destinations/[id] */
  destinationId: string;
  title: string;
  destination: string;
  region: "domestic" | "international";
  duration: string;
  durationDays: number;
  startingPrice: number;
  priceNote?: string;
  heroImage: string;
  tagline: string;
  overview: string;
  highlights: string[];
  featured: boolean;
  featuredOrder?: number;
  days: ItineraryDay[];
  hotels: ItineraryHotel[];
  included: string[];
  excluded: string[];
  gallery: string[];
  faq: ItineraryFaq[];
  seo?: {
    title?: string;
    description?: string;
  };
}
