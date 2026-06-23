import { images } from "@/lib/images";
import type { Hotel } from "@/types";
import {
  buildMediaUrlMap,
  getDestinations,
  getHotelBySlug,
  getHotels,
  getMediaAssets,
  resolveMediaUrl,
} from "./cms";
import type { CmsDestination, CmsHotel } from "./types";

export type HotelsPageData = {
  hotels: Hotel[];
};

export type HotelDetailData = {
  hotel: Hotel;
  allHotels: Hotel[];
};

export function buildDestinationByIdMap(
  destinations: CmsDestination[]
): Map<string, CmsDestination> {
  return new Map(destinations.map((dest) => [dest.id, dest]));
}

export function mapCmsHotelToHotel(
  hotel: CmsHotel,
  destination: CmsDestination | null | undefined,
  mediaMap: Map<string, string>
): Hotel {
  const gallery = hotel.gallery_media
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
    .map((item) => item.url)
    .filter(Boolean);

  const image =
    resolveMediaUrl(mediaMap, hotel.hero_media_id, "") ||
    gallery[0] ||
    images.bali;

  return {
    id: hotel.slug,
    name: hotel.name,
    destination: destination?.name || undefined,
    region: destination?.region ?? "international",
    stars: hotel.stars,
    price: hotel.price,
    image,
    gallery: gallery.length > 0 ? gallery : undefined,
    amenities: hotel.amenities ?? [],
    nearbyAttractions: hotel.nearby_attractions
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        name: item.name,
        distance: item.distance_label,
      })),
    rating: hotel.rating != null ? Number(hotel.rating) : 4.5,
    reviewCount: hotel.review_count ?? undefined,
    description: hotel.description ?? undefined,
  };
}

export function mapCmsHotelsToHotels(
  cmsHotels: CmsHotel[],
  destinations: CmsDestination[],
  mediaMap: Map<string, string>
): Hotel[] {
  const destinationById = buildDestinationByIdMap(destinations);
  return cmsHotels
    .filter((hotel) => hotel.is_published)
    .map((hotel) =>
      mapCmsHotelToHotel(hotel, destinationById.get(hotel.destination_id), mediaMap)
    );
}

export function buildHotelsByUuidMap(
  cmsHotels: CmsHotel[],
  destinations: CmsDestination[],
  mediaMap: Map<string, string>
): Map<string, Hotel> {
  const destinationById = buildDestinationByIdMap(destinations);
  const map = new Map<string, Hotel>();
  for (const hotel of cmsHotels) {
    if (!hotel.is_published) continue;
    map.set(
      hotel.id,
      mapCmsHotelToHotel(hotel, destinationById.get(hotel.destination_id), mediaMap)
    );
  }
  return map;
}

async function loadHotelsMappingContext() {
  const [destinations, mediaAssets] = await Promise.all([getDestinations(), getMediaAssets()]);
  return {
    destinations,
    mediaMap: buildMediaUrlMap(mediaAssets),
  };
}

export async function getHotelsPageData(): Promise<HotelsPageData> {
  const [cmsHotels, context] = await Promise.all([getHotels(), loadHotelsMappingContext()]);
  return {
    hotels: mapCmsHotelsToHotels(cmsHotels, context.destinations, context.mediaMap),
  };
}

export async function getHotelDetailData(slug: string): Promise<HotelDetailData | null> {
  const [cmsHotel, context, cmsHotelsList] = await Promise.all([
    getHotelBySlug(slug),
    loadHotelsMappingContext(),
    getHotels(),
  ]);

  if (!cmsHotel?.is_published) return null;

  const destinationById = buildDestinationByIdMap(context.destinations);
  const hotel = mapCmsHotelToHotel(
    cmsHotel,
    destinationById.get(cmsHotel.destination_id),
    context.mediaMap
  );
  const allHotels = mapCmsHotelsToHotels(cmsHotelsList, context.destinations, context.mediaMap);

  return { hotel, allHotels };
}

/** Cached hotels list for itinerary/destination card resolution */
export async function getHotelsCatalog(): Promise<Hotel[]> {
  const [cmsHotels, context] = await Promise.all([getHotels(), loadHotelsMappingContext()]);
  return mapCmsHotelsToHotels(cmsHotels, context.destinations, context.mediaMap);
}
