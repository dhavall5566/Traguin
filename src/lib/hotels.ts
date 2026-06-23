import { hotels as fallbackHotels } from "@/data/hotels";
import { getHotelGalleryImages } from "@/lib/hotel-images";
import type { ItineraryHotel } from "@/types/itinerary";
import type { Hotel } from "@/types";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Itinerary hotel names → luxury stays catalog slugs (legacy hardcoded fallback) */
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

function resolveCatalog(catalog?: Hotel[]): Hotel[] {
  return catalog && catalog.length > 0 ? catalog : fallbackHotels;
}

/** Display label for destination/location; null when nothing to show */
export function getHotelDestinationLabel(
  hotel: Pick<Hotel, "destination">
): string | null {
  const label = hotel.destination?.trim();
  return label ? label : null;
}

export function getHotelImageAlt(hotel: Pick<Hotel, "name" | "destination">): string {
  const destination = getHotelDestinationLabel(hotel);
  return destination ? `${hotel.name}, ${destination}` : hotel.name;
}

export function getHotelById(id: string, catalog?: Hotel[]): Hotel | undefined {
  return resolveCatalog(catalog).find((h) => h.id === id);
}

export function getHotelByUuid(uuid: string, hotelsByUuid?: Map<string, Hotel>): Hotel | undefined {
  return hotelsByUuid?.get(uuid);
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

/** Properties in the same destination, then region, excludes the current hotel */
export function getSimilarHotels(hotel: Hotel, catalog?: Hotel[], limit = 8): Hotel[] {
  const hotels = resolveCatalog(catalog);
  const others = hotels.filter((h) => h.id !== hotel.id);

  const hotelDestination = getHotelDestinationLabel(hotel);
  const sameDestination = hotelDestination
    ? others.filter((h) => getHotelDestinationLabel(h) === hotelDestination)
    : [];
  const sameRegion = others.filter(
    (h) =>
      h.region === hotel.region &&
      getHotelDestinationLabel(h) !== hotelDestination
  );

  const ranked = [...sameDestination, ...sameRegion].sort((a, b) => {
    const destBoost =
      (getHotelDestinationLabel(a) === hotelDestination ? 1 : 0) -
      (getHotelDestinationLabel(b) === hotelDestination ? 1 : 0);
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

export function findHotelForItineraryHotel(
  itineraryHotel: ItineraryHotel,
  catalog?: Hotel[],
  hotelsByUuid?: Map<string, Hotel>
): Hotel | undefined {
  if (itineraryHotel.hotelId) {
    const bySlug = getHotelById(itineraryHotel.hotelId, catalog);
    if (bySlug) return bySlug;
    const byUuid = getHotelByUuid(itineraryHotel.hotelId, hotelsByUuid);
    if (byUuid) return byUuid;
  }

  const hotels = resolveCatalog(catalog);
  const key = normalize(itineraryHotel.name);
  const aliasId = NAME_TO_ID[key];
  if (aliasId) return getHotelById(aliasId, hotels);

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

export function getHotelsByDestinationName(
  name: string,
  limit = 12,
  catalog?: Hotel[]
): Hotel[] {
  const key = normalize(name);
  return resolveCatalog(catalog)
    .filter((hotel) => {
      const dest = getHotelDestinationLabel(hotel);
      if (!dest) return false;
      const destKey = normalize(dest);
      return destKey === key || destKey.includes(key) || key.includes(destKey);
    })
    .sort((a, b) => b.rating - a.rating || a.price - b.price)
    .slice(0, limit);
}

export function getLuxuryStayHrefForHotel(hotel: Hotel): string {
  return `/luxury-stays/${encodeURIComponent(hotel.id)}`;
}

export function resolveItineraryHotelCard(
  itineraryHotel: ItineraryHotel,
  catalog?: Hotel[],
  hotelsByUuid?: Map<string, Hotel>
): DestinationHotelCard {
  const catalogMatch = findHotelForItineraryHotel(itineraryHotel, catalog, hotelsByUuid);
  const href = getLuxuryStayHrefForItineraryHotel(itineraryHotel, catalog, hotelsByUuid);
  const destination =
    getHotelDestinationLabel(catalogMatch ?? {}) ??
    itineraryHotel.location.split(",").pop()?.trim() ??
    itineraryHotel.location.split("·")[0]?.trim() ??
    itineraryHotel.location;

  const rating = catalogMatch?.rating ?? 4.8;
  const reviewSeed = catalogMatch ?? {
    id: normalize(itineraryHotel.name),
    rating,
    reviewCount: undefined,
  };

  return {
    key:
      itineraryHotel.hotelId ??
      [itineraryHotel.name, itineraryHotel.category, itineraryHotel.location]
        .filter(Boolean)
        .join(" · "),
    href,
    name: itineraryHotel.name,
    destination,
    description: itineraryHotel.description,
    images: catalogMatch ? getHotelGalleryImages(catalogMatch) : [itineraryHotel.image],
    stars: itineraryHotel.stars ?? catalogMatch?.stars ?? 5,
    rating,
    reviewCount: getHotelReviewCount(reviewSeed),
    amenities: catalogMatch?.amenities.slice(0, 4) ?? [],
    price: catalogMatch?.price,
    category: itineraryHotel.category,
  };
}

export function resolveCatalogHotelCard(hotel: Hotel): DestinationHotelCard {
  return {
    key: hotel.id,
    href: getLuxuryStayHrefForHotel(hotel),
    name: hotel.name,
    destination: hotel.destination ?? "",
    description: hotel.description ?? "",
    images: getHotelGalleryImages(hotel),
    stars: hotel.stars,
    rating: hotel.rating,
    reviewCount: getHotelReviewCount(hotel),
    amenities: hotel.amenities.slice(0, 4),
    price: hotel.price,
  };
}

/** Deep link to luxury stays detail when matched */
export function getLuxuryStayHrefForItineraryHotel(
  itineraryHotel: ItineraryHotel,
  catalog?: Hotel[],
  hotelsByUuid?: Map<string, Hotel>
): string {
  const match = findHotelForItineraryHotel(itineraryHotel, catalog, hotelsByUuid);
  if (match) {
    return getLuxuryStayHrefForHotel(match);
  }

  const destination =
    itineraryHotel.location.split(",").pop()?.trim() ||
    itineraryHotel.location.split("·")[0]?.trim() ||
    itineraryHotel.location;

  return `/luxury-stays?destination=${encodeURIComponent(destination)}`;
}
