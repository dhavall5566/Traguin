import type { TravelMood, TravelPackage } from "@/types";
import type { ExperienceShowcaseItem } from "@/lib/experience-types";
import {
  mapCmsExperienceToShowcaseItem,
} from "./experiences";
import { buildItineraryByDestinationIdMap } from "./itineraries";
import { images } from "@/lib/images";
import { cleanPackageTitle } from "@/lib/package-title";

export { HERO_SLIDER_DEFAULT_MAX_ITEMS } from "@/lib/api/homepage-hero-settings";
import { readHomepageHeroSettings } from "@/lib/api/homepage-hero-settings";
import {
  buildMediaUrlMap,
  getCompanyStats,
  getDestinations,
  getExperiences,
  getHomeClientStories,
  getHomepageBundle,
  getHomepagePromo,
  getHomepageRegionPanels,
  getItineraries,
  getJourneyProcessSteps,
  getMediaAssets,
  getPackages,
  getSpecializations,
  getValuePropositions,
  resolveMediaUrl,
} from "./cms";
import type {
  CmsClientStory,
  CmsDestination,
  CmsItinerary,
  CmsPackage,
  CmsStatJson,
} from "./types";

export type HomeStat = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
};

export type HomeRegionPanel = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  imageClass: string;
  href: string;
  highlights: string[];
  stat: string;
  mood: "warm" | "cool";
};

export type HomeFeaturedDestination = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  startingPrice: number;
  duration?: string;
  regionLabel?: string;
  href: string;
  cta: string;
};

export type HomeTravelPackage = TravelPackage & {
  journeyHref: string;
  reviewCount: number;
};

export type HomeTestimonial = {
  id: string;
  name: string;
  destination: string;
  tripType: string;
  quote: string;
  image: string;
};

export type HomePromoData = {
  eyebrow: string;
  title: string;
  description: string;
  assurances: { iconKey: string; label: string }[];
};

export type HomeJourneyStep = {
  id: string;
  step: string;
  title: string;
  description: string;
  detail: string;
  iconKey: string;
};

export type HomeSpecialization = {
  id: string;
  title: string;
  description: string;
  iconKey: string;
};

export type HomeValueProp = {
  id: string;
  step: string;
  title: string;
  description: string;
  highlight: string;
  iconKey: string;
};

export type HomepageData = {
  featuredPackages: HomeTravelPackage[];
  stats: HomeStat[];
  marqueeNames: string[];
  regionPanels: HomeRegionPanel[];
  featuredDestinations: HomeFeaturedDestination[];
  promo: HomePromoData | null;
  experiences: ExperienceShowcaseItem[];
  journeySteps: HomeJourneyStep[];
  specializations: HomeSpecialization[];
  valueProps: HomeValueProp[];
  testimonials: HomeTestimonial[];
};

function parseStat(raw: CmsStatJson, index: number): HomeStat | null {
  const label = raw.label?.trim();
  if (!label) return null;

  if (typeof raw.value === "number") {
    return {
      id: raw.id ?? `stat-${index}`,
      value: raw.value,
      suffix: raw.suffix ?? "",
      label,
      decimals: raw.decimals,
    };
  }

  if (typeof raw.value === "string") {
    const match = raw.value.trim().match(/^([\d.]+)\s*(.*)$/);
    if (match) {
      const numeric = Number(match[1]);
      if (!Number.isNaN(numeric)) {
        const hasDecimal = match[1].includes(".");
        return {
          id: raw.id ?? `stat-${index}`,
          value: numeric,
          suffix: raw.suffix ?? match[2] ?? "",
          label,
          decimals: raw.decimals ?? (hasDecimal ? 1 : 0),
        };
      }
    }
  }

  return null;
}

function firstGalleryUrl(
  items: { url: string; sort_order: number | null }[] | undefined
): string {
  if (!items?.length) return "";
  return (
    [...items]
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))[0]?.url ?? ""
  );
}

function resolvePackageHeroImage(
  pkg: CmsPackage,
  destination: CmsDestination | undefined,
  itinerary: CmsItinerary | undefined,
  mediaMap: Map<string, string>
): string {
  return (
    resolveMediaUrl(mediaMap, pkg.hero_media_id, "") ||
    resolveMediaUrl(mediaMap, itinerary?.hero_media_id, "") ||
    resolveMediaUrl(mediaMap, destination?.hero_media_id, "") ||
    firstGalleryUrl(itinerary?.gallery_media) ||
    firstGalleryUrl(destination?.gallery_media) ||
    images.bali
  );
}

function mapPackage(
  pkg: CmsPackage,
  destinationById: Map<string, CmsDestination>,
  itineraryByPackageId: Map<string, CmsItinerary>,
  mediaMap: Map<string, string>
): HomeTravelPackage {
  const destination = destinationById.get(pkg.destination_id);
  const itinerary = pkg.id ? itineraryByPackageId.get(pkg.id) : undefined;
  const rating = pkg.rating != null ? Number(pkg.rating) : itinerary?.rating != null ? Number(itinerary.rating) : 4.8;
  const reviewCount =
    itinerary?.review_count ??
    48 + (pkg.id.charCodeAt(0) % 130) + Math.round(rating * 10);

  const journeyHref =
    itinerary && destination
      ? `/destinations/${destination.slug}?journey=${encodeURIComponent(itinerary.slug)}`
      : destination
        ? `/destinations/${destination.slug}`
        : "/destinations";

  return {
    id: pkg.id,
    title: cleanPackageTitle(pkg.title),
    destination: destination?.name ?? "Destination",
    region: destination?.region ?? "international",
    duration: pkg.duration_label,
    price: pkg.price,
    image: resolvePackageHeroImage(pkg, destination, itinerary, mediaMap),
    highlights: pkg.highlights
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((h) => h.text),
    mood: (pkg.moods.length ? pkg.moods : ["luxury"]) as TravelMood[],
    rating,
    featured: pkg.is_featured,
    journeyHref,
    reviewCount,
  };
}

function mapFeaturedDestination(
  dest: CmsDestination,
  itinerary: CmsItinerary | undefined,
  mediaMap: Map<string, string>
): HomeFeaturedDestination {
  const image =
    resolveMediaUrl(mediaMap, itinerary?.hero_media_id, "") ||
    resolveMediaUrl(mediaMap, dest.hero_media_id, "") ||
    dest.gallery_media[0]?.url ||
    images.bali;

  return {
    id: dest.id,
    slug: dest.slug,
    name: dest.name,
    description: dest.description,
    image,
    startingPrice: itinerary?.starting_price ?? dest.starting_price,
    duration: itinerary?.duration_label,
    regionLabel: dest.region === "domestic" ? "India" : "International",
    href: `/destinations/${dest.slug}`,
    cta: itinerary ? "Discover Journey" : "View Journey",
  };
}

function resolveRegionPanelHref(panel: import("./types").CmsHomepageRegionPanel): string {
  const href = panel.href?.trim() ?? "";
  if (/^\/destinations\?region=(domestic|international)$/.test(href)) {
    return href;
  }

  const key = panel.key.trim().toLowerCase();

  if (key === "domestic" || key === "india" || key.includes("domestic")) {
    return "/destinations?region=domestic";
  }

  if (key === "international" || key.includes("international")) {
    return "/destinations?region=international";
  }

  if (panel.mood === "warm") {
    return "/destinations?region=domestic";
  }

  if (panel.mood === "cool") {
    return "/destinations?region=international";
  }

  return "/destinations";
}

function mapRegionPanel(
  panel: import("./types").CmsHomepageRegionPanel,
  mediaMap: Map<string, string>
): HomeRegionPanel {
  const mood = panel.mood === "cool" ? "cool" : "warm";
  return {
    id: panel.id,
    label: panel.label,
    title: panel.title,
    description: panel.description,
    image: resolveMediaUrl(
      mediaMap,
      panel.hero_media_id,
      mood === "warm" ? images.homeRegionDomestic : images.homeRegionInternational
    ),
    imageClass:
      mood === "warm"
        ? "object-cover object-[center_40%] saturate-[1.08] group-hover:saturate-[1.18]"
        : "object-cover object-center saturate-[1.06] group-hover:saturate-[1.16]",
    href: resolveRegionPanelHref(panel),
    highlights: panel.highlights,
    stat: panel.stat_text,
    mood,
  };
}

function mapExperience(
  exp: import("./types").CmsExperience,
  mediaMap: Map<string, string>
): ExperienceShowcaseItem {
  return mapCmsExperienceToShowcaseItem(exp, mediaMap);
}

function mapTestimonial(story: CmsClientStory, mediaMap: Map<string, string>): HomeTestimonial | null {
  if (!story.quote?.trim()) return null;
  return {
    id: story.id,
    name: story.client_name,
    destination: story.destination_label ?? "Journey",
    tripType: story.trip_type ?? "Luxury Travel",
    quote: story.quote,
    image: resolveMediaUrl(mediaMap, story.portrait_media_id, images.couple1),
  };
}

export async function getHomepageData(): Promise<HomepageData> {
  const bundle = await getHomepageBundle();
  if (bundle) {
    return mapHomepageBundle(bundle);
  }

  const [
    packages,
    destinations,
    itineraries,
    mediaAssets,
    companyStats,
    regionPanels,
    homepagePromo,
    experiences,
    journeySteps,
    specializations,
    valuePropositions,
    clientStories,
  ] = await Promise.all([
    getPackages(),
    getDestinations(),
    getItineraries(),
    getMediaAssets(),
    getCompanyStats(),
    getHomepageRegionPanels(),
    getHomepagePromo(),
    getExperiences(),
    getJourneyProcessSteps(),
    getSpecializations(),
    getValuePropositions(),
    getHomeClientStories(),
  ]);

  return mapHomepageSources({
    packages,
    destinations,
    itineraries,
    mediaAssets,
    companyStats,
    regionPanels,
    homepagePromo,
    experiences,
    journeySteps,
    specializations,
    valuePropositions,
    clientStories,
  });
}

type HomepageSourceData = {
  packages: CmsPackage[];
  destinations: CmsDestination[];
  itineraries: CmsItinerary[];
  mediaAssets: import("./types").CmsMediaAsset[];
  companyStats: import("./types").CmsCompanyStats | null;
  regionPanels: import("./types").CmsHomepageRegionPanel[];
  homepagePromo: import("./types").CmsHomepagePromo | null;
  experiences: import("./types").CmsExperience[];
  journeySteps: import("./types").CmsJourneyProcessStep[];
  specializations: import("./types").CmsSpecialization[];
  valuePropositions: import("./types").CmsValueProposition[];
  clientStories: CmsClientStory[];
};

function mapHomepageBundle(bundle: import("./types").CmsHomepageBundle): HomepageData {
  return mapHomepageSources({
    packages: bundle.packages,
    destinations: bundle.destinations,
    itineraries: bundle.itineraries,
    mediaAssets: bundle.media,
    companyStats: bundle.company_stats,
    regionPanels: bundle.region_panels,
    homepagePromo: bundle.homepage_promo,
    experiences: bundle.experiences,
    journeySteps: bundle.journey_process_steps,
    specializations: bundle.specializations,
    valuePropositions: bundle.value_propositions,
    clientStories: bundle.client_stories,
  });
}

function mapHomepageSources({
  packages,
  destinations,
  itineraries,
  mediaAssets,
  companyStats,
  regionPanels,
  homepagePromo,
  experiences,
  journeySteps,
  specializations,
  valuePropositions,
  clientStories,
}: HomepageSourceData): HomepageData {

  const mediaMap = buildMediaUrlMap(mediaAssets);
  const destinationById = new Map(destinations.map((d) => [d.id, d]));
  const itineraryByPackageId = new Map(
    itineraries
      .filter((itinerary) => itinerary.package_id)
      .map((itinerary) => [itinerary.package_id as string, itinerary])
  );
  const itineraryByDestinationId = buildItineraryByDestinationIdMap(itineraries);

  let cmsFeatured = packages
    .filter((pkg) => pkg.is_featured)
    .sort((a, b) => (a.featured_sort_order ?? 999) - (b.featured_sort_order ?? 999));

  const heroSettings = readHomepageHeroSettings(companyStats);
  const heroSliderMaxItems = heroSettings.hero_slider_max_items;
  const visibleIdSet = new Set(heroSettings.visible_package_ids);

  if (visibleIdSet.size > 0) {
    cmsFeatured = cmsFeatured.filter((pkg) => visibleIdSet.has(pkg.id));
  } else if (cmsFeatured.length > 0) {
    cmsFeatured = cmsFeatured.slice(0, heroSliderMaxItems);
  }

  let featuredPackages = cmsFeatured.map((pkg) =>
    mapPackage(pkg, destinationById, itineraryByPackageId, mediaMap),
  );

  if (featuredPackages.length === 0) {
    featuredPackages = packages
      .slice(0, heroSliderMaxItems)
      .map((pkg) => mapPackage(pkg, destinationById, itineraryByPackageId, mediaMap));
  }

  const statsSource =
    companyStats?.trust_bar_stats?.length
      ? companyStats.trust_bar_stats
      : companyStats?.homepage_stats ?? [];

  const stats = statsSource
    .map((raw, index) => parseStat(raw as CmsStatJson, index))
    .filter((item): item is HomeStat => item !== null);

  const marqueeNames = destinations.map((d) => d.name);

  const mappedRegionPanels = regionPanels
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((panel) => mapRegionPanel(panel, mediaMap));

  const featuredDestinations = destinations
    .filter((d) => d.is_featured)
    .sort((a, b) => (a.featured_sort_order ?? 999) - (b.featured_sort_order ?? 999))
    .map((dest) => mapFeaturedDestination(dest, itineraryByDestinationId.get(dest.id), mediaMap));

  const promo: HomePromoData | null = homepagePromo
    ? {
        eyebrow: homepagePromo.eyebrow,
        title: homepagePromo.title,
        description: homepagePromo.description,
        assurances: (homepagePromo.assurances ?? []).map((item) => ({
          iconKey: item.icon_key ?? "sparkles",
          label: item.label ?? "",
        })).filter((a) => a.label),
      }
    : null;

  const mappedExperiences = experiences
    .filter((exp) => exp.is_published && exp.show_on_homepage)
    .sort((a, b) => (a.homepage_sort_order ?? 999) - (b.homepage_sort_order ?? 999))
    .map((exp) => mapExperience(exp, mediaMap));

  const mappedJourneySteps = journeySteps
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((step) => ({
      id: step.id,
      step: step.step_label,
      title: step.title,
      description: step.description,
      detail: step.detail,
      iconKey: step.icon_key || "compass",
    }));

  const mappedSpecializations = specializations
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      iconKey: item.icon_key || "user",
    }));

  const mappedValueProps = valuePropositions
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      id: item.id,
      step: item.step_label,
      title: item.title,
      description: item.description,
      highlight: item.highlight,
      iconKey: item.icon_key || "sparkles",
    }));

  const testimonials = clientStories
    .sort((a, b) => (a.home_sort_order ?? 999) - (b.home_sort_order ?? 999))
    .map((story) => mapTestimonial(story, mediaMap))
    .filter((item): item is HomeTestimonial => item !== null);

  return {
    featuredPackages,
    stats,
    marqueeNames,
    regionPanels: mappedRegionPanels,
    featuredDestinations,
    promo,
    experiences: mappedExperiences,
    journeySteps: mappedJourneySteps,
    specializations: mappedSpecializations,
    valueProps: mappedValueProps,
    testimonials,
  };
}
