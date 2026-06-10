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
  /** Links to a property in the luxury stays catalog */
  hotelId?: string;
  /** Package tier label, e.g. "Option 01 — Deluxe" */
  category?: string;
  /** Room category from the proposal */
  roomType?: string;
  /** Assigned meal plan */
  mealPlan?: string;
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
  /** Guest rating out of 5; generated when omitted */
  rating?: number;
  /** Number of guest reviews; generated when omitted */
  reviewCount?: number;
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
