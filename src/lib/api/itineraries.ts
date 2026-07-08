import { images } from "@/lib/images";
import type { Itinerary } from "@/types/itinerary";
import {
  getDestinationBySlug,
  getItineraryByDestinationId,
  getItineraryBySlug,
  getRedirectByPath,
  resolveMediaUrl,
} from "./cms";
import type { CmsDestination, CmsFaq, CmsItinerary, CmsRedirect } from "./types";
import type { Hotel } from "@/types";
import { cleanPackageTitle } from "@/lib/package-title";
import { loadCmsDetailContext } from "./detail-context";

function uniqueGalleryUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const url of urls) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    unique.push(url);
  }
  return unique;
}

export type ItineraryDetailData = {
  itinerary: Itinerary;
  destinationName: string;
  hotelsCatalog: Hotel[];
};

function mapFaqsForItinerary(faqs: CmsFaq[], itineraryId: string) {
  return faqs
    .filter((faq) => faq.itinerary_id === itineraryId)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));
}

function resolveItineraryHeroImage(
  itinerary: CmsItinerary,
  destination: CmsDestination,
  mediaMap: Map<string, string>,
  linkedPackage?: { hero_media_id: string | null } | null,
): string {
  if (itinerary.slug === "gj-005-divine-statue-of-unity-itinerary") {
    return images.statueOfUnityCircuit;
  }

  const packageHeroMediaId =
    itinerary.package_hero_media_id ?? linkedPackage?.hero_media_id ?? null;

  return (
    resolveMediaUrl(mediaMap, itinerary.hero_media_id, "") ||
    resolveMediaUrl(mediaMap, packageHeroMediaId, "") ||
    resolveMediaUrl(mediaMap, destination.hero_media_id, "") ||
    destination.gallery_media[0]?.url ||
    images.bali
  );
}

export function mapCmsItineraryToItinerary(
  itinerary: CmsItinerary,
  destination: CmsDestination,
  mediaMap: Map<string, string>,
  faqs: CmsFaq[] = [],
  hotelsByUuid?: Map<string, Hotel>,
  linkedPackage?: { hero_media_id: string | null } | null,
): Itinerary {
  const heroImage = resolveItineraryHeroImage(
    itinerary,
    destination,
    mediaMap,
    linkedPackage,
  );

  const gallery = uniqueGalleryUrls(
    itinerary.gallery_media.length
      ? itinerary.gallery_media
          .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
          .map((item) => item.url)
      : destination.gallery_media
          .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
          .map((item) => item.url)
  );

  const included = itinerary.inclusions
    .filter((item) => item.kind === "included")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => item.text);

  const excluded = itinerary.inclusions
    .filter((item) => item.kind === "excluded")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => item.text);

  const startingPrice =
    typeof itinerary.starting_price === "number" && !Number.isNaN(itinerary.starting_price)
      ? itinerary.starting_price
      : 0;

  const durationDays =
    typeof itinerary.duration_days === "number" && itinerary.duration_days > 0
      ? itinerary.duration_days
      : Math.max(itinerary.days.length, 1);

  return {
    cmsId: itinerary.id,
    slug: itinerary.slug,
    packageId: itinerary.package_id ?? "",
    destinationId: destination.slug,
    title: cleanPackageTitle(itinerary.title),
    destination: destination.name,
    region: destination.region,
    duration: itinerary.duration_label || `${durationDays} days`,
    durationDays,
    startingPrice,
    priceNote: itinerary.price_note ?? undefined,
    rating: itinerary.rating != null ? Number(itinerary.rating) : undefined,
    reviewCount: itinerary.review_count ?? undefined,
    heroImage,
    tagline: itinerary.tagline,
    overview: itinerary.overview,
    highlights: itinerary.highlights
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => item.text),
    featured: itinerary.is_featured,
    featuredOrder: itinerary.featured_sort_order ?? undefined,
    days: itinerary.days
      .sort((a, b) => a.sort_order - b.sort_order || a.day_number - b.day_number)
      .map((day) => ({
        day: day.day_number,
        title: day.title,
        description: day.description,
        activities: day.activities ?? [],
      })),
    hotels: itinerary.hotels
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((hotel) => ({
        name: hotel.name,
        location: hotel.location,
        nights: hotel.nights_label,
        image: resolveMediaUrl(mediaMap, hotel.image_media_id, heroImage),
        description: hotel.description ?? "",
        stars: hotel.stars ?? undefined,
        hotelId: hotel.hotel_id
          ? (hotelsByUuid?.get(hotel.hotel_id)?.id ?? hotel.hotel_id)
          : undefined,
        category: hotel.category_label ?? undefined,
        roomType: hotel.room_type ?? undefined,
        mealPlan: hotel.meal_plan ?? undefined,
      })),
    included,
    excluded,
    gallery,
    faq: mapFaqsForItinerary(faqs, itinerary.id),
    seo:
      itinerary.seo_title || itinerary.seo_description
        ? {
            title: itinerary.seo_title ?? undefined,
            description: itinerary.seo_description ?? undefined,
          }
        : undefined,
  };
}

export async function getItineraryDetailBySlug(
  slug: string
): Promise<ItineraryDetailData | null> {
  const [cmsItinerary, context] = await Promise.all([
    getItineraryBySlug(slug),
    loadCmsDetailContext(),
  ]);

  if (!cmsItinerary?.is_published) return null;

  const matchedDestination = context.cmsDestinations.find(
    (item) => item.id === cmsItinerary.destination_id,
  );
  if (!matchedDestination?.is_published) return null;

  return {
    itinerary: mapCmsItineraryToItinerary(
      cmsItinerary,
      matchedDestination,
      context.mediaMap,
      context.faqs,
      context.hotelsByUuid,
      cmsItinerary.package_id ? context.packagesById.get(cmsItinerary.package_id) : undefined,
    ),
    destinationName: matchedDestination.name,
    hotelsCatalog: context.hotelsCatalog,
  };
}

export async function getItineraryDetailForDestinationSlug(
  destinationSlug: string
): Promise<ItineraryDetailData | null> {
  const destination = await getDestinationBySlug(destinationSlug);
  if (!destination?.is_published) return null;

  const [context, cmsItinerary] = await Promise.all([
    loadCmsDetailContext(),
    getItineraryByDestinationId(destination.id),
  ]);

  if (!cmsItinerary?.is_published) return null;

  return {
    itinerary: mapCmsItineraryToItinerary(
      cmsItinerary,
      destination,
      context.mediaMap,
      context.faqs,
      context.hotelsByUuid,
      cmsItinerary.package_id ? context.packagesById.get(cmsItinerary.package_id) : undefined,
    ),
    destinationName: destination.name,
    hotelsCatalog: context.hotelsCatalog,
  };
}

export async function resolveLegacyItineraryRedirect(
  itinerarySlug: string
): Promise<string | null> {
  const legacyPath = `/itineraries/${itinerarySlug}`;
  const redirect = await getRedirectByPath(legacyPath);
  if (redirect) {
    return resolveRedirectTarget(redirect);
  }

  const detail = await getItineraryDetailBySlug(itinerarySlug);
  if (detail) {
    return `/destinations/${detail.itinerary.destinationId}`;
  }

  return null;
}

export function resolveRedirectTarget(redirect: CmsRedirect): string | null {
  if (redirect.target_path) {
    return redirect.target_path.startsWith("/")
      ? redirect.target_path
      : `/${redirect.target_path}`;
  }
  return null;
}

function pickPrimaryItineraryPerDestination(itineraries: CmsItinerary[]): Map<string, CmsItinerary> {
  const grouped = new Map<string, CmsItinerary[]>();

  for (const itinerary of itineraries) {
    if (!itinerary.is_published) continue;
    const list = grouped.get(itinerary.destination_id) ?? [];
    list.push(itinerary);
    grouped.set(itinerary.destination_id, list);
  }

  const map = new Map<string, CmsItinerary>();
  for (const [destinationId, list] of grouped) {
    const sorted = [...list].sort(
      (a, b) =>
        (a.featured_sort_order ?? 999) - (b.featured_sort_order ?? 999) ||
        a.title.localeCompare(b.title),
    );
    map.set(destinationId, sorted[0]);
  }

  return map;
}

export function buildPublishedItineraryCountsByDestinationId(
  itineraries: CmsItinerary[]
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const itinerary of itineraries) {
    if (!itinerary.is_published) continue;
    counts.set(
      itinerary.destination_id,
      (counts.get(itinerary.destination_id) ?? 0) + 1
    );
  }
  return counts;
}

export function buildMinStartingPriceByDestinationId(
  itineraries: CmsItinerary[]
): Map<string, number> {
  const mins = new Map<string, number>();
  for (const itinerary of itineraries) {
    if (!itinerary.is_published) continue;
    const price = itinerary.starting_price;
    if (price == null) continue;
    const existing = mins.get(itinerary.destination_id);
    if (existing == null || price < existing) {
      mins.set(itinerary.destination_id, price);
    }
  }
  return mins;
}

export function buildItineraryByDestinationIdMap(
  itineraries: CmsItinerary[]
): Map<string, CmsItinerary> {
  return pickPrimaryItineraryPerDestination(itineraries);
}

export async function buildItineraryLookupByDestinationSlug(
  destinations: CmsDestination[],
  cmsItineraries: CmsItinerary[],
  mediaMap: Map<string, string>,
  faqs: CmsFaq[] = [],
  hotelsByUuid?: Map<string, Hotel>,
  packagesById?: Map<string, import("./types").CmsPackage>,
): Promise<Map<string, Itinerary>> {
  const destinationById = new Map(destinations.map((dest) => [dest.id, dest]));
  const primaryByDestinationId = pickPrimaryItineraryPerDestination(cmsItineraries);
  const lookup = new Map<string, Itinerary>();

  for (const cmsItinerary of primaryByDestinationId.values()) {
    const destination = destinationById.get(cmsItinerary.destination_id);
    if (!destination?.is_published) continue;
    lookup.set(
      destination.slug,
      mapCmsItineraryToItinerary(
        cmsItinerary,
        destination,
        mediaMap,
        faqs,
        hotelsByUuid,
        cmsItinerary.package_id ? packagesById?.get(cmsItinerary.package_id) : undefined,
      )
    );
  }

  return lookup;
}
