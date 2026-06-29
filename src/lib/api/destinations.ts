import { cache } from "react";
import type { DestinationListing, DestinationItineraryPreview, IndiaRegion, DestinationCategoryRef } from "@/lib/destination-listing-types";
import { buildInternationalCountryFilters } from "@/lib/destination-grouping";
import { resolveDestinationHeroImage } from "@/lib/destination-images";
import type { Itinerary } from "@/types/itinerary";
import { normalizeTravelMoods } from "@/lib/travel-moods";
import {
  buildMediaUrlMap,
  getDestinationBySlug,
  getDestinations,
  getFaqs,
  getItineraries,
  getItinerariesForDestinationSlug,
  getMediaAssets,
  getPackages,
  resolveMediaUrl,
} from "./cms";
import { loadCmsDetailContext } from "./detail-context";
import {
  buildItineraryLookupByDestinationSlug,
  buildMinStartingPriceByDestinationId,
  buildPublishedItineraryCountsByDestinationId,
  mapCmsItineraryToItinerary,
} from "./itineraries";
import { buildHotelsByUuidMap } from "./hotels";
import type { CmsDestination, CmsPackage } from "./types";
import type { Hotel } from "@/types";

export type DestinationCategoryGroup = {
  id: string;
  title: string;
  description: string;
  destinations: DestinationListing[];
};

export type DestinationsPageData = {
  destinations: DestinationListing[];
  categories: DestinationCategoryGroup[];
  internationalCountryFilters: { id: string; label: string }[];
  itineraryByDestinationSlug: Map<string, DestinationItineraryPreview>;
};

function toItineraryPreview(itinerary: Itinerary): DestinationItineraryPreview {
  return {
    destination: itinerary.destination,
    highlights: itinerary.highlights,
    heroImage: itinerary.heroImage,
    startingPrice: itinerary.startingPrice,
    duration: itinerary.duration,
  };
}

export type DestinationDetailData = {
  destination: DestinationListing;
  itinerary: Itinerary | null;
  journeys: Itinerary[];
  hotelsCatalog: Hotel[];
};

export function buildPackagesByDestinationIdMap(
  packages: CmsPackage[]
): Map<string, CmsPackage[]> {
  const map = new Map<string, CmsPackage[]>();
  for (const pkg of packages) {
    const existing = map.get(pkg.destination_id) ?? [];
    existing.push(pkg);
    map.set(pkg.destination_id, existing);
  }
  return map;
}

const INDIAN_ESCAPES_CATEGORY = {
  id: "indian-escapes",
  title: "Indian Escapes",
} as const;

const INDIAN_ESCAPES_DESCRIPTION =
  "Diverse landscapes woven into singular luxury journeys.";

function categoriesForListing(dest: CmsDestination): { id: string; title: string }[] {
  const mapped = [...dest.categories]
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
    .map((category) => ({ id: category.slug, title: category.title }));

  if (mapped.length > 0) return mapped;
  if (dest.region === "domestic") return [INDIAN_ESCAPES_CATEGORY];
  return [];
}

function categoriesForGrouping(destination: DestinationListing): DestinationCategoryRef[] {
  if (destination.categories.length > 0) return destination.categories;
  if (destination.region === "domestic") return [INDIAN_ESCAPES_CATEGORY];
  return [];
}

export function buildDestinationCategoriesFromListings(
  listings: DestinationListing[]
): DestinationCategoryGroup[] {
  const categoryMap = new Map<string, DestinationCategoryGroup>();

  for (const destination of listings) {
    for (const category of categoriesForGrouping(destination)) {
      const existing = categoryMap.get(category.id);
      if (!existing) {
        categoryMap.set(category.id, {
          id: category.id,
          title: category.title,
          description:
            category.id === INDIAN_ESCAPES_CATEGORY.id
              ? INDIAN_ESCAPES_DESCRIPTION
              : `Curated luxury journeys across ${category.title}.`,
          destinations: [],
        });
      }
      const group = categoryMap.get(category.id)!;
      if (!group.destinations.some((item) => item.id === destination.id)) {
        group.destinations.push(destination);
      }
    }
  }

  return Array.from(categoryMap.values()).sort((a, b) => a.title.localeCompare(b.title));
}

/** Legacy CMS collection filters — prefer country filters for international destinations. */
export function buildInternationalCollectionFilters(
  categories: DestinationCategoryGroup[]
): { id: string; label: string }[] {
  return categories
    .filter((category) => category.id !== "indian-escapes")
    .map((category) => ({ id: category.id, label: category.title }));
}

export function mapCmsDestinationToListing(
  dest: CmsDestination,
  mediaMap: Map<string, string>,
  hasItinerary: boolean,
  journeyCount = hasItinerary ? 1 : 0
): DestinationListing {
  const cmsImage =
    resolveMediaUrl(mediaMap, dest.hero_media_id, "") ||
    dest.gallery_media[0]?.url ||
    "";

  const image = resolveDestinationHeroImage(dest.slug, {
    cmsImage,
    indiaRegion: (dest.india_region as IndiaRegion | null) ?? undefined,
    region: dest.region,
  });

  const categories = categoriesForListing(dest);

  const primaryCategory = categories[0];

  return {
    id: dest.slug,
    name: dest.name,
    description: dest.description,
    image,
    startingPrice: dest.starting_price,
    categoryId: primaryCategory?.id ?? "uncategorized",
    categoryTitle: primaryCategory?.title ?? "Destinations",
    categories,
    region: dest.region,
    country: dest.country?.trim() || (dest.region === "domestic" ? "India" : undefined),
    indiaRegion: (dest.india_region as IndiaRegion | null) ?? undefined,
    moods: normalizeTravelMoods(dest.moods),
    hasItinerary,
    journeyCount,
  };
}

export async function getDestinationsPageData(): Promise<DestinationsPageData> {
  const [cmsDestinations, cmsItineraries, mediaAssets, faqs, cmsHotels] = await Promise.all([
    getDestinations(),
    getItineraries(),
    getMediaAssets(),
    getFaqs("itinerary"),
    import("./cms").then(({ getHotels }) => getHotels()),
  ]);

  const mediaMap = buildMediaUrlMap(mediaAssets);
  const hotelsByUuid = buildHotelsByUuidMap(cmsHotels, cmsDestinations, mediaMap);
  const itineraryCounts = buildPublishedItineraryCountsByDestinationId(cmsItineraries);
  const minItineraryPrices = buildMinStartingPriceByDestinationId(cmsItineraries);

  const destinations = cmsDestinations
    .filter((dest) => dest.is_published)
    .map((dest) => {
      const journeyCount = itineraryCounts.get(dest.id) ?? 0;
      const listing = mapCmsDestinationToListing(
        dest,
        mediaMap,
        journeyCount > 0,
        journeyCount
      );
      if (journeyCount > 1) {
        const minPrice = minItineraryPrices.get(dest.id);
        if (minPrice != null) listing.startingPrice = minPrice;
      }
      return listing;
    });

  const categories = buildDestinationCategoriesFromListings(destinations);
  const internationalCountryFilters = buildInternationalCountryFilters(destinations);
  const itineraryByDestinationSlug = await buildItineraryLookupByDestinationSlug(
    cmsDestinations,
    cmsItineraries,
    mediaMap,
    faqs,
    hotelsByUuid
  );

  const itineraryPreviews = new Map<string, DestinationItineraryPreview>();
  for (const [slug, itinerary] of itineraryByDestinationSlug) {
    itineraryPreviews.set(slug, toItineraryPreview(itinerary));
  }

  return {
    destinations,
    categories,
    internationalCountryFilters,
    itineraryByDestinationSlug: itineraryPreviews,
  };
}

export const getDestinationDetailData = cache(async (
  slug: string,
  options?: { journeySlug?: string | null },
): Promise<DestinationDetailData | null> => {
  const journeySlug = options?.journeySlug?.trim() || null;
  const [destination, context, cmsItineraries] = await Promise.all([
    getDestinationBySlug(slug),
    loadCmsDetailContext(),
    getItinerariesForDestinationSlug(slug),
  ]);

  if (!destination?.is_published) return null;

  const journeys = (cmsItineraries ?? [])
    .filter((item) => item.is_published)
    .map((cmsItinerary) =>
      mapCmsItineraryToItinerary(
        cmsItinerary,
        destination,
        context.mediaMap,
        context.faqs,
        context.hotelsByUuid,
      )
    );

  const itinerary =
    journeys.length === 1
      ? journeys[0]
      : journeySlug
        ? journeys.find((item) => item.slug === journeySlug) ?? null
        : null;

  return {
    destination: mapCmsDestinationToListing(
      destination,
      context.mediaMap,
      journeys.length > 0,
      journeys.length,
    ),
    itinerary,
    journeys,
    hotelsCatalog: context.hotelsCatalog,
  };
});

/** Prefetch packages map for future listing enhancements; fetched alongside other CMS data when needed. */
export async function prefetchPackagesByDestinationId(): Promise<Map<string, CmsPackage[]>> {
  const packages = await getPackages();
  return buildPackagesByDestinationIdMap(packages);
}

// Re-export for callers that already import the mapper from this module.
export { mapCmsItineraryToItinerary };
