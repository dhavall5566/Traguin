import { cmsFetch, cmsFetchPaginated } from "./client";
import { toPublicMediaUrl } from "./media-url";
import type {
  CmsClientStory,
  CmsCompanyStats,
  CmsConciergeService,
  CmsDestination,
  CmsExperience,
  CmsFaq,
  CmsGalleryCategory,
  CmsGalleryItem,
  CmsHotel,
  CmsHomepagePromo,
  CmsHomepageRegionPanel,
  CmsAboutPageHeader,
  CmsAboutStorySection,
  CmsCareersPageExtras,
  CmsItinerary,
  CmsJobOpening,
  CmsJourneyProcessStep,
  CmsLegalPage,
  CmsMediaAsset,
  CmsPackage,
  CmsRedirect,
  CmsSpecialization,
  CmsTravelExpertSettings,
  CmsValueProposition,
} from "./types";

export function getHomepageBundle() {
  return cmsFetch<import("./types").CmsHomepageBundle>("/api/cms/public/homepage");
}

export function getPackages() {
  return cmsFetchPaginated<CmsPackage>("/api/cms/public/packages", { limit: 100 });
}

export function getDestinations() {
  return cmsFetchPaginated<CmsDestination>("/api/cms/public/destinations", { limit: 100 });
}

export function getDestinationBySlug(slug: string) {
  return cmsFetch<CmsDestination>(
    `/api/cms/public/destinations/slug/${encodeURIComponent(slug)}`
  );
}

export function getItineraries() {
  return cmsFetchPaginated<CmsItinerary>("/api/cms/public/itineraries", { limit: 100 });
}

export function getItinerariesFresh() {
  return cmsFetchPaginated<CmsItinerary>("/api/cms/public/itineraries", {
    limit: 100,
    fresh: true,
  });
}

export function getItineraryBySlug(slug: string) {
  return cmsFetch<CmsItinerary>(
    `/api/cms/public/itineraries/slug/${encodeURIComponent(slug)}`
  );
}

export function getItineraryByDestinationId(destinationId: string) {
  return cmsFetch<CmsItinerary>(
    `/api/cms/public/itineraries/by-destination/${encodeURIComponent(destinationId)}`
  );
}

export function getItineraryByDestinationSlug(destinationSlug: string) {
  return cmsFetch<CmsItinerary>(
    `/api/cms/public/itineraries/by-destination/slug/${encodeURIComponent(destinationSlug)}`
  );
}

export function getItinerariesForDestinationSlug(destinationSlug: string) {
  return cmsFetch<CmsItinerary[]>(
    `/api/cms/public/itineraries/by-destination/slug/${encodeURIComponent(destinationSlug)}/all`,
  );
}

export function getHotels() {
  return cmsFetchPaginated<CmsHotel>("/api/cms/public/hotels", { limit: 100 });
}

export function getHotelBySlug(slug: string) {
  return cmsFetch<CmsHotel>(
    `/api/cms/public/hotels/slug/${encodeURIComponent(slug)}`,
    { fresh: true }
  );
}

export function getFaqs(scope: "about" | "itinerary" | "all" = "about") {
  return cmsFetchPaginated<CmsFaq>("/api/cms/public/faqs", {
    limit: 100,
    searchParams: { scope },
  });
}

export function getRedirectByPath(path: string) {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return cmsFetch<CmsRedirect>(`/api/cms/public/redirects/path/${encodeURIComponent(normalized)}`);
}

export function getMediaAssets() {
  return cmsFetchPaginated<CmsMediaAsset>("/api/cms/public/media", { limit: 100 });
}

export function getMediaAssetsFresh() {
  return cmsFetchPaginated<CmsMediaAsset>("/api/cms/public/media", { limit: 100, fresh: true });
}

export function getCompanyStats() {
  return cmsFetch<CmsCompanyStats>("/api/cms/public/company-stats");
}

export function getHomepageRegionPanels() {
  return cmsFetchPaginated<CmsHomepageRegionPanel>("/api/cms/public/homepage-region-panels", {
    limit: 20,
  });
}

export function getHomepagePromo() {
  return cmsFetch<CmsHomepagePromo>("/api/cms/public/homepage-promo");
}

export function getExperiences() {
  return cmsFetchPaginated<CmsExperience>("/api/cms/public/experiences", { limit: 100 });
}

export function getExperienceBySlug(slug: string) {
  return cmsFetch<CmsExperience>(
    `/api/cms/public/experiences/slug/${encodeURIComponent(slug)}`,
    { fresh: true }
  );
}

export function getJourneyProcessSteps() {
  return cmsFetchPaginated<CmsJourneyProcessStep>("/api/cms/public/journey-process-steps", {
    limit: 20,
  });
}

export function getSpecializations() {
  return cmsFetchPaginated<CmsSpecialization>("/api/cms/public/specializations", { limit: 20 });
}

export function getConciergeServices() {
  return cmsFetchPaginated<CmsConciergeService>("/api/cms/public/concierge-services", {
    limit: 50,
  });
}

export function getConciergeServiceBySlug(slug: string) {
  return cmsFetch<CmsConciergeService>(
    `/api/cms/public/concierge-services/slug/${encodeURIComponent(slug)}`,
    { fresh: true }
  );
}

export function getTravelExpertSettings() {
  return cmsFetch<CmsTravelExpertSettings>("/api/cms/public/travel-expert-settings");
}

export function getValuePropositions() {
  return cmsFetchPaginated<CmsValueProposition>("/api/cms/public/value-propositions", {
    limit: 20,
  });
}

export function getHomeClientStories() {
  return cmsFetchPaginated<CmsClientStory>("/api/cms/public/client-stories", {
    limit: 100,
  });
}

export function getGalleryClientStories() {
  return cmsFetchPaginated<CmsClientStory>("/api/cms/public/client-stories", {
    limit: 100,
    searchParams: { show_in_gallery: true },
  });
}

export function getGalleryCategories() {
  return cmsFetchPaginated<CmsGalleryCategory>("/api/cms/public/gallery-categories", {
    limit: 50,
  });
}

export function getGalleryItems() {
  return cmsFetchPaginated<CmsGalleryItem>("/api/cms/public/gallery-items", { limit: 100 });
}

export function getAboutPageHeader() {
  return cmsFetch<CmsAboutPageHeader>("/api/cms/public/about-page-header");
}

export function getAboutStorySections() {
  return cmsFetchPaginated<CmsAboutStorySection>("/api/cms/public/about-story-sections", {
    limit: 50,
  });
}

export function getCareersPageExtras() {
  return cmsFetch<CmsCareersPageExtras>("/api/cms/public/careers-page-extras");
}

export function getJobOpenings() {
  return cmsFetchPaginated<CmsJobOpening>("/api/cms/public/job-openings", { limit: 50 });
}

export function getJobOpeningBySlug(slug: string) {
  return cmsFetch<CmsJobOpening>(
    `/api/cms/public/job-openings/slug/${encodeURIComponent(slug)}`,
    { fresh: true }
  );
}

export function getLegalPageBySlug(slug: string) {
  return cmsFetch<CmsLegalPage>(
    `/api/cms/public/legal-pages/slug/${encodeURIComponent(slug)}`,
    { fresh: true }
  );
}

export function buildMediaUrlMap(assets: CmsMediaAsset[]): Map<string, string> {
  return new Map(assets.map((asset) => [asset.id, toPublicMediaUrl(asset.url)]));
}

export function resolveMediaUrl(
  mediaMap: Map<string, string>,
  mediaId: string | null | undefined,
  fallback = ""
): string {
  if (!mediaId) return fallback;
  return toPublicMediaUrl(mediaMap.get(mediaId) ?? fallback);
}
