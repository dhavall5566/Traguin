import { hotels } from "@/data/hotels";
import { getHotelGalleryImages } from "@/lib/hotel-images";
import type { ItineraryHotel } from "@/types/itinerary";
import type { Hotel } from "@/types";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Itinerary hotel names → luxury stays catalog ids */
const NAME_TO_ID: Record<string, string> = {
  "amandari ubud": "amandari-ubud",
  "bulgari resort bali": "bulgari-bali",
  "mont cervin palace": "mont-cervin-palace",
  "brunton boatyard": "brunton-boatyard",
  "luxury houseboat": "luxury-houseboat",
  "heritage houseboat": "heritage-houseboat",
  "burj al arab jumeirah": "burj-al-arab",
  "mandarin oriental bangkok": "mandarin-oriental-bangkok",
  "beachfront luxury resort": "beachfront-luxury-resort",
  "ahilya by the sea": "ahilya-by-the-sea",
  "the grand dragon ladakh": "the-grand-dragon",
  "pangong lake luxury camp": "pangong-lake-camp",
  "sofitel legend metropole hanoi": "sofitel-metropole-hanoi",
  "anantara hoi an resort": "anantara-hoi-an",
  "marina bay sands": "marina-bay-sands",
  "badrutts palace": "badrutt-palace",
  "hotel willow banks": "willow-banks-shimla",
  "toshali royal resort": "willow-banks-shimla",
  "radisson jass shimla": "radisson-jass-shimla",
  "the gateway resort": "radisson-jass-shimla",
  "the orchid hotel": "welcomhotel-itc-shimla",
  "welcomhotel by itc shimla": "welcomhotel-itc-shimla",
  "wildflower hall an oberoi resort": "wildflower-hall-shimla",
  "taj the trees": "wildflower-hall-shimla",
  "aman tokyo": "aman-tokyo",
  "gora kadan": "gora-kadan",
  "suiran kyoto": "suiran-kyoto",
};

export function getHotelById(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

/** Stable guest review count for display when not set on the hotel record */
export function getHotelReviewCount(hotel: Pick<Hotel, "id" | "rating" | "reviewCount">): number {
  if (hotel.reviewCount != null) return hotel.reviewCount;

  let hash = 0;
  for (let i = 0; i < hotel.id.length; i++) {
    hash = (hash * 31 + hotel.id.charCodeAt(i)) >>> 0;
  }

  const base = 48 + (hash % 180);
  const ratingBoost = Math.round(hotel.rating * 12);
  return base + ratingBoost;
}

<<<<<<< HEAD
/** Properties in the same destination, then region — excludes the current hotel */
=======
/** Properties in the same destination, then region, excludes the current hotel */
>>>>>>> dhaval
export function getSimilarHotels(hotel: Hotel, limit = 8): Hotel[] {
  const others = hotels.filter((h) => h.id !== hotel.id);

  const sameDestination = others.filter((h) => h.destination === hotel.destination);
  const sameRegion = others.filter(
    (h) => h.region === hotel.region && h.destination !== hotel.destination
  );

  const ranked = [...sameDestination, ...sameRegion].sort((a, b) => {
    const destBoost =
      (a.destination === hotel.destination ? 1 : 0) -
      (b.destination === hotel.destination ? 1 : 0);
    if (destBoost !== 0) return -destBoost;

    const ratingDiff = b.rating - a.rating;
    if (ratingDiff !== 0) return ratingDiff;

    return Math.abs(a.price - hotel.price) - Math.abs(b.price - hotel.price);
  });

  const seen = new Set<string>();
  const unique: Hotel[] = [];
  for (const item of ranked) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
    if (unique.length >= limit) break;
  }

  return unique;
}

export function findHotelForItineraryHotel(itineraryHotel: ItineraryHotel): Hotel | undefined {
  const key = normalize(itineraryHotel.name);
  const aliasId = NAME_TO_ID[key];
  if (aliasId) return getHotelById(aliasId);

  return hotels.find((hotel) => {
    const hotelKey = normalize(hotel.name);
    return hotelKey === key || hotelKey.includes(key) || key.includes(hotelKey);
  });
}

export type DestinationHotelCard = {
  key: string;
  href: string;
  name: string;
  destination: string;
  description: string;
  images: string[];
  stars: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  price?: number;
  category?: string;
};

export function getHotelsByDestinationName(name: string, limit = 12): Hotel[] {
  const key = normalize(name);
  return hotels
    .filter((hotel) => {
      const dest = normalize(hotel.destination);
      return dest === key || dest.includes(key) || key.includes(dest);
    })
    .sort((a, b) => b.rating - a.rating || a.price - b.price)
    .slice(0, limit);
}

export function getLuxuryStayHrefForHotel(hotel: Hotel): string {
  return `/luxury-stays?hotel=${encodeURIComponent(hotel.id)}`;
}

export function resolveItineraryHotelCard(itineraryHotel: ItineraryHotel): DestinationHotelCard {
  const catalog = findHotelForItineraryHotel(itineraryHotel);
  const href = getLuxuryStayHrefForItineraryHotel(itineraryHotel);
  const destination =
    catalog?.destination ??
    itineraryHotel.location.split(",").pop()?.trim() ??
    itineraryHotel.location.split("·")[0]?.trim() ??
    itineraryHotel.location;

  const rating = catalog?.rating ?? 4.8;
  const reviewSeed = catalog ?? { id: normalize(itineraryHotel.name), rating, reviewCount: undefined };

  return {
    key: itineraryHotel.hotelId ?? itineraryHotel.category ?? itineraryHotel.name,
    href,
    name: itineraryHotel.name,
    destination,
    description: itineraryHotel.description,
    images: catalog ? getHotelGalleryImages(catalog) : [itineraryHotel.image],
    stars: itineraryHotel.stars ?? catalog?.stars ?? 5,
    rating,
    reviewCount: getHotelReviewCount(reviewSeed),
    amenities: catalog?.amenities.slice(0, 4) ?? [],
    price: catalog?.price,
    category: itineraryHotel.category,
  };
}

export function resolveCatalogHotelCard(hotel: Hotel): DestinationHotelCard {
  return {
    key: hotel.id,
    href: getLuxuryStayHrefForHotel(hotel),
    name: hotel.name,
    destination: hotel.destination,
    description: hotel.description ?? "",
    images: getHotelGalleryImages(hotel),
    stars: hotel.stars,
    rating: hotel.rating,
    reviewCount: getHotelReviewCount(hotel),
    amenities: hotel.amenities.slice(0, 4),
    price: hotel.price,
  };
}

<<<<<<< HEAD
/** Deep link to luxury stays — opens property detail when matched */
=======
/** Deep link to luxury stays, opens property detail when matched */
>>>>>>> dhaval
export function getLuxuryStayHrefForItineraryHotel(itineraryHotel: ItineraryHotel): string {
  if (itineraryHotel.hotelId) {
    const byId = getHotelById(itineraryHotel.hotelId);
    if (byId) {
      return `/luxury-stays?hotel=${encodeURIComponent(byId.id)}`;
    }
  }

  const match = findHotelForItineraryHotel(itineraryHotel);
  if (match) {
    return `/luxury-stays?hotel=${encodeURIComponent(match.id)}`;
  }

  const destination =
    itineraryHotel.location.split(",").pop()?.trim() ||
    itineraryHotel.location.split("·")[0]?.trim() ||
    itineraryHotel.location;

  return `/luxury-stays?destination=${encodeURIComponent(destination)}`;
}
