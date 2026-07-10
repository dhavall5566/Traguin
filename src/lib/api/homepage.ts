import { cache } from "react";
import type { TravelMood, TravelPackage } from "@/types";
import { normalizeTravelMoods } from "@/lib/travel-moods";
import type { ExperienceShowcaseItem } from "@/lib/experience-types";
import {
  mapCmsExperienceToShowcaseItem,
} from "./experiences";
import {
  buildItineraryByDestinationIdMap,
  buildMinPublishedPackagePriceByDestinationId,
  buildPublishedPackageCountsByDestinationId,
  buildPublishedPackageIds,
} from "./itineraries";
import { resolveIndiaRegion } from "@/lib/india-region";
import { resolveDestinationHeroImage } from "@/lib/destination-images";
import { images } from "@/lib/images";
import { cleanPackageTitle } from "@/lib/package-title";
import { defaultHomepagePromo, defaultRegionPanels, defaultSpecializations } from "@/data/pageContent";
import { humanizeCopy, humanizeCopyList } from "@/lib/copy";
import { selectHomeClientStories } from "@/lib/client-stories";
import { mapClientStoryReview } from "@/lib/api/client-stories-page";
import { uniqueById } from "@/lib/utils";

export { HERO_SLIDER_DEFAULT_MAX_ITEMS } from "@/lib/api/homepage-hero-settings";
import {
  hasHomepageHeroVisibilityConfigured,
  readHomepageHeroSettings,
  selectHomepageHeroPackages,
} from "@/lib/api/homepage-hero-settings";
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
  /** Non-numeric headline, e.g. "Since 2024" */
  textValue?: string;
  /** Prose-style cell instead of a large number */
  style?: "number" | "quote";
};

const DEFAULT_GROWTH_STAT: HomeStat = {
  id: "customer-growth",
  value: 0,
  suffix: "",
  label: "",
  textValue: "We didn't add customers, we multiplied them over the last two years.",
  style: "quote",
};

const DEFAULT_HOMEPAGE_STATS: HomeStat[] = [
  { id: "bespoke", textValue: "Bespoke", value: 0, suffix: "", label: "Every route, yours alone" },
  DEFAULT_GROWTH_STAT,
  { id: "trips", value: 500, suffix: "+", label: "Trips designed" },
  { id: "destinations", value: 130, suffix: "+", label: "Curated destinations" },
  { id: "draft-time", textValue: "48 hrs", value: 0, suffix: "", label: "First itinerary draft" },
];

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
  journeyCount: number;
};

export type HomeTravelPackage = TravelPackage & {
  journeyHref: string;
  reviewCount: number;
  soldLastMonth: number;
};

export type HomeTestimonial = {
  id: string;
  name: string;
  destination: string | null;
  quote: string;
  image: string;
};

export type HomePromoData = {
  eyebrow: string;
  studioLabel: string;
  title: string;
  titleAccent: string;
  description: string;
  assurancesHeading: string;
  assurances: { iconKey: string; title?: string; label: string }[];
  consultation: {
    badge: string;
    title: string;
    description: string;
  };
  consultationSteps: string[];
};

const PROMO_PLACEHOLDER_PATTERNS = [
  /homepage promo title/i,
  /homepate promo title/i,
  /verified eyebrow/i,
  /tailor-made journeys/i,
  /your world, perfectly planned/i,
  /since 2024/i,
  /created via admin ui/i,
  /lorem ipsum/i,
  /^test$/i,
  /^placeholder$/i,
];

function isPromoPlaceholder(text: string | null | undefined): boolean {
  const value = text?.trim() ?? "";
  if (!value) return true;
  return PROMO_PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

function resolveHomePromo(
  homepagePromo: import("./types").CmsHomepagePromo | null
): HomePromoData {
  if (!homepagePromo) {
    return {
      ...defaultHomepagePromo,
      assurances: [...defaultHomepagePromo.assurances],
      consultationSteps: [...defaultHomepagePromo.consultationSteps],
    };
  }

  const useDefaultTitle = isPromoPlaceholder(homepagePromo.title);

  return {
    eyebrow: humanizeCopy(
      isPromoPlaceholder(homepagePromo.eyebrow) || /since 2024/i.test(homepagePromo.eyebrow)
        ? defaultHomepagePromo.eyebrow
        : homepagePromo.eyebrow
    ),
    studioLabel: defaultHomepagePromo.studioLabel,
    title: humanizeCopy(useDefaultTitle ? defaultHomepagePromo.title : homepagePromo.title),
    titleAccent: useDefaultTitle ? defaultHomepagePromo.titleAccent : "",
    description: humanizeCopy(
      isPromoPlaceholder(homepagePromo.description)
        ? defaultHomepagePromo.description
        : homepagePromo.description
    ),
    assurancesHeading: defaultHomepagePromo.assurancesHeading,
    assurances: [...defaultHomepagePromo.assurances],
    consultation: {
      ...defaultHomepagePromo.consultation,
      description: humanizeCopy(defaultHomepagePromo.consultation.description),
    },
    consultationSteps: [...defaultHomepagePromo.consultationSteps],
  };
}

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

const SPECIALIZATION_PLACEHOLDER_PATTERNS = [
  /^specialization\s*\d+$/i,
  /^spec\s*\d+$/i,
  /lorem ipsum/i,
  /^test$/i,
  /^placeholder$/i,
  /^description\s*\d+$/i,
];

function isSpecializationPlaceholder(title: string, description: string): boolean {
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();
  if (!trimmedTitle || !trimmedDescription) return true;
  return SPECIALIZATION_PLACEHOLDER_PATTERNS.some(
    (pattern) => pattern.test(trimmedTitle) || pattern.test(trimmedDescription)
  );
}

function resolveSpecializations(
  specializations: import("./types").CmsSpecialization[]
): HomeSpecialization[] {
  const mapped = specializations
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      id: item.id,
      title: humanizeCopy(item.title.trim()),
      description: humanizeCopy(item.description.trim()),
      iconKey: item.icon_key || "compass",
    }))
    .filter((item) => !isSpecializationPlaceholder(item.title, item.description));

  if (mapped.length >= 4) {
    return mapped;
  }

  return defaultSpecializations.map((item) => ({ ...item }));
}

const REGION_PLACEHOLDER_PATTERNS = [
  /^india\s*description$/i,
  /^international\s*description$/i,
  /stat\s*text/i,
  /^description$/i,
  /^title$/i,
  /^placeholder$/i,
  /^lorem ipsum/i,
  /^test$/i,
];

function isRegionFieldPlaceholder(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return REGION_PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function isRegionPanelPlaceholder(panel: HomeRegionPanel): boolean {
  if (isRegionFieldPlaceholder(panel.title)) return true;
  if (isRegionFieldPlaceholder(panel.description)) return true;
  if (isRegionFieldPlaceholder(panel.stat)) return true;
  if (panel.title.trim().toLowerCase() === panel.label.trim().toLowerCase()) return true;

  const validHighlights = panel.highlights.filter(
    (item) => item.trim() && !isRegionFieldPlaceholder(item) && item.trim().toLowerCase() !== panel.label.trim().toLowerCase()
  );
  return validHighlights.length < 2;
}

function inferRegionMoodFromCms(panel: import("./types").CmsHomepageRegionPanel): "warm" | "cool" {
  const key = panel.key.trim().toLowerCase();
  const label = panel.label.trim().toLowerCase();
  const href = panel.href?.trim().toLowerCase() ?? "";

  if (
    key === "international" ||
    key.includes("international") ||
    label.includes("international") ||
    href.includes("region=international")
  ) {
    return "cool";
  }

  if (
    key === "domestic" ||
    key === "india" ||
    key.includes("domestic") ||
    label.includes("india") ||
    href.includes("region=domestic")
  ) {
    return "warm";
  }

  return panel.mood === "cool" ? "cool" : "warm";
}

function inferRegionKind(panel: HomeRegionPanel): "domestic" | "international" {
  const label = panel.label.trim().toLowerCase();
  const href = panel.href.trim().toLowerCase();

  if (label.includes("international") || href.includes("region=international")) {
    return "international";
  }

  if (label.includes("india") || href.includes("region=domestic")) {
    return "domestic";
  }

  return panel.mood === "cool" ? "international" : "domestic";
}

function defaultRegionForPanel(panel: HomeRegionPanel): (typeof defaultRegionPanels)[number] {
  const kind = inferRegionKind(panel);
  return (
    defaultRegionPanels.find((item) => item.id === kind) ??
    (kind === "international" ? defaultRegionPanels[1] : defaultRegionPanels[0])
  );
}

function mergeRegionPanel(panel: HomeRegionPanel): HomeRegionPanel {
  const kind = inferRegionKind(panel);
  const fallback = defaultRegionForPanel(panel);
  const highlights = panel.highlights.filter(
    (item) =>
      item.trim() &&
      !isRegionFieldPlaceholder(item) &&
      item.trim().toLowerCase() !== panel.label.trim().toLowerCase()
  );

  const usesDomesticDefaults =
    kind === "international" &&
    (panel.title === defaultRegionPanels[0].title ||
      panel.highlights.some((item) =>
        defaultRegionPanels[0].highlights.some(
          (domestic) => domestic.toLowerCase() === item.trim().toLowerCase()
        )
      ));

  const shouldUseFallbackContent =
    isRegionPanelPlaceholder(panel) || usesDomesticDefaults;

  const merged: HomeRegionPanel = {
    ...panel,
    label: isRegionFieldPlaceholder(panel.label) ? fallback.label : panel.label,
    title:
      shouldUseFallbackContent ||
      isRegionFieldPlaceholder(panel.title) ||
      panel.title.trim().toLowerCase() === panel.label.trim().toLowerCase()
        ? fallback.title
        : panel.title,
    description:
      shouldUseFallbackContent ||
      isRegionFieldPlaceholder(panel.description) ||
      panel.description.trim().toLowerCase() === panel.label.trim().toLowerCase()
        ? fallback.description
        : panel.description,
    stat:
      shouldUseFallbackContent ||
      isRegionFieldPlaceholder(panel.stat) ||
      panel.stat.trim().toLowerCase() === panel.label.trim().toLowerCase() ||
      (kind === "domestic" && /12\+?\s*states?/i.test(panel.stat))
        ? fallback.stat
        : panel.stat,
    highlights:
      shouldUseFallbackContent || highlights.length < 2 ? [...fallback.highlights] : highlights,
    href: panel.href || fallback.href,
    image: shouldUseFallbackContent || isRegionPanelPlaceholder(panel) ? fallback.image : panel.image,
    imageClass: panel.imageClass || fallback.imageClass,
    mood: kind === "international" ? "cool" : "warm",
  };

  return {
    ...merged,
    label: humanizeCopy(merged.label),
    title: humanizeCopy(merged.title),
    description: humanizeCopy(merged.description),
    stat: humanizeCopy(merged.stat),
    highlights: humanizeCopyList(merged.highlights),
  };
}

function resolveRegionPanels(
  regionPanels: import("./types").CmsHomepageRegionPanel[],
  mediaMap: Map<string, string>
): HomeRegionPanel[] {
  const mapped = regionPanels
    .filter((panel) => panel.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((panel) => mapRegionPanel(panel, mediaMap))
    .map((panel) => mergeRegionPanel(panel));

  if (mapped.length >= 2) {
    return uniqueById(mapped);
  }

  return defaultRegionPanels.map((item) => ({
    ...item,
    id: item.id,
    highlights: [...item.highlights],
  }));
}

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
    const trimmed = raw.value.trim();
    const match = trimmed.match(/^([\d.]+)\s*(.*)$/);
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

    if (trimmed) {
      return {
        id: raw.id ?? `stat-${index}`,
        value: 0,
        textValue: trimmed,
        suffix: raw.suffix ?? "",
        label,
      };
    }
  }

  return null;
}

function isYearsCraftingStat(stat: HomeStat): boolean {
  const label = stat.label.trim().toLowerCase();
  return (
    stat.id === "years-active" ||
    label.includes("years crafting") ||
    (label.includes("year") && stat.value === 2 && stat.suffix === "+")
  );
}

function mergeHomeStats(stats: HomeStat[]): HomeStat[] {
  const cleaned = stats
    .filter((item) => !item.textValue?.toLowerCase().includes("since 2024"))
    .filter((item) => !isYearsCraftingStat(item));

  if (cleaned.length === 0) {
    return DEFAULT_HOMEPAGE_STATS;
  }

  const labelKey = (stat: HomeStat) => stat.label.trim().toLowerCase();
  const founding: HomeStat[] = [];

  const hasStudioHighlight = cleaned.some(
    (item) =>
      item.textValue?.toLowerCase().includes("bespoke") === true ||
      labelKey(item).includes("yours alone") ||
      labelKey(item).includes("luxury travel studio")
  );

  const hasGrowthMessage = cleaned.some(
    (item) =>
      item.id === "customer-growth" ||
      item.style === "quote" ||
      item.textValue?.toLowerCase().includes("multiplied them")
  );

  if (!hasStudioHighlight) founding.push(DEFAULT_HOMEPAGE_STATS[0]);
  if (!hasGrowthMessage) founding.push(DEFAULT_GROWTH_STAT);

  return uniqueById([...founding, ...cleaned]).slice(0, 5);
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
  if (
    pkg.slug === "gj-005-divine-statue-of-unity-circuit" ||
    itinerary?.slug === "gj-005-divine-statue-of-unity-itinerary"
  ) {
    return images.statueOfUnityCircuit;
  }

  return (
    resolveMediaUrl(mediaMap, pkg.hero_media_id, "") ||
    resolveMediaUrl(mediaMap, itinerary?.hero_media_id, "") ||
    resolveMediaUrl(mediaMap, destination?.hero_media_id, "") ||
    firstGalleryUrl(itinerary?.gallery_media) ||
    firstGalleryUrl(destination?.gallery_media) ||
    images.bali
  );
}

function soldLastMonthForPackage(pkg: CmsPackage): number {
  if (typeof pkg.sold_last_month === "number" && pkg.sold_last_month > 0) {
    return pkg.sold_last_month;
  }
  return 0;
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
    mood: normalizeTravelMoods(pkg.moods.length ? pkg.moods : ["luxury"]),
    rating,
    featured: pkg.is_featured,
    journeyHref,
    reviewCount,
    soldLastMonth: soldLastMonthForPackage(pkg),
  };
}

function mapFeaturedDestination(
  dest: CmsDestination,
  itinerary: CmsItinerary | undefined,
  mediaMap: Map<string, string>,
  journeyCount: number,
  minItineraryPrice?: number
): HomeFeaturedDestination {
  const isHub = journeyCount > 1;
  const cmsImage =
    resolveMediaUrl(mediaMap, isHub ? dest.hero_media_id : itinerary?.hero_media_id, "") ||
    resolveMediaUrl(mediaMap, dest.hero_media_id, "") ||
    dest.gallery_media[0]?.url ||
    "";

  const image = resolveDestinationHeroImage(dest.slug, {
    cmsImage,
    indiaRegion: resolveIndiaRegion(dest.slug, dest.india_region),
    region: dest.region,
  });

  return {
    id: dest.id,
    slug: dest.slug,
    name: dest.name,
    description: humanizeCopy(dest.description),
    image,
    startingPrice: isHub
      ? (minItineraryPrice ?? dest.starting_price)
      : (itinerary?.starting_price ?? dest.starting_price),
    duration: isHub ? undefined : itinerary?.duration_label,
    regionLabel: dest.region === "domestic" ? "India" : "International",
    href: `/destinations/${dest.slug}`,
    cta: isHub ? "Browse journeys" : itinerary ? "Discover Journey" : "View Journey",
    journeyCount,
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
  const mood = inferRegionMoodFromCms(panel);
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
  const review = mapClientStoryReview(story, mediaMap);
  if (!review) return null;
  return {
    id: review.id,
    name: review.name,
    destination: review.destination,
    quote: review.quote,
    image: review.image ?? "",
  };
}

export const getHomepageData = cache(async function getHomepageData(): Promise<HomepageData> {
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
});

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

function buildMarqueeNames(destinations: CmsDestination[]): string[] {
  const byName = (a: CmsDestination, b: CmsDestination) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

  const domestic = destinations
    .filter((d) => d.region === "domestic")
    .sort(byName)
    .map((d) => d.name);
  const international = destinations
    .filter((d) => d.region === "international")
    .sort(byName)
    .map((d) => d.name);

  return [...domestic, ...international];
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
  const publishedPackageIds = buildPublishedPackageIds(packages);
  const itineraryByDestinationId = buildItineraryByDestinationIdMap(
    itineraries,
    publishedPackageIds,
  );
  const packageCounts = buildPublishedPackageCountsByDestinationId(packages);
  const minPackagePrices = buildMinPublishedPackagePriceByDestinationId(packages);

  const heroSettings = readHomepageHeroSettings(companyStats);
  const heroSliderMaxItems = heroSettings.hero_slider_max_items;
  const cmsFeatured = selectHomepageHeroPackages(packages, companyStats);

  let featuredPackages = uniqueById(
    cmsFeatured.map((pkg) =>
      mapPackage(pkg, destinationById, itineraryByPackageId, mediaMap),
    )
  );

  if (featuredPackages.length === 0 && !hasHomepageHeroVisibilityConfigured(companyStats)) {
    featuredPackages = uniqueById(
      packages
        .filter((pkg) => pkg.is_published)
        .slice(0, heroSliderMaxItems)
        .map((pkg) => mapPackage(pkg, destinationById, itineraryByPackageId, mediaMap))
    );
  }

  const statsSource =
    companyStats?.trust_bar_stats?.length
      ? companyStats.trust_bar_stats
      : companyStats?.homepage_stats ?? [];

  const stats = mergeHomeStats(
    statsSource
      .map((raw, index) => parseStat(raw as CmsStatJson, index))
      .filter((item): item is HomeStat => item !== null)
  );

  const marqueeNames = buildMarqueeNames(destinations);

  const mappedRegionPanels = uniqueById(resolveRegionPanels(regionPanels, mediaMap));

  const featuredDestinations = uniqueById(
    destinations
      .filter((d) => d.is_featured)
      .sort((a, b) => (a.featured_sort_order ?? 999) - (b.featured_sort_order ?? 999))
      .map((dest) =>
        mapFeaturedDestination(
          dest,
          itineraryByDestinationId.get(dest.id),
          mediaMap,
          packageCounts.get(dest.id) ?? 0,
          minPackagePrices.get(dest.id)
        )
      )
  );

  const promo = resolveHomePromo(homepagePromo);

  const mappedExperiences = uniqueById(
    experiences
      .filter((exp) => exp.is_published && exp.show_on_homepage)
      .sort((a, b) => (a.homepage_sort_order ?? 999) - (b.homepage_sort_order ?? 999))
      .map((exp) => mapExperience(exp, mediaMap))
  );

  const mappedJourneySteps = uniqueById(
    journeySteps
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((step) => ({
        id: step.id,
        step: humanizeCopy(step.step_label),
        title: humanizeCopy(step.title),
        description: humanizeCopy(step.description),
        detail: humanizeCopy(step.detail),
        iconKey: step.icon_key || "compass",
      }))
  );

  const mappedSpecializations = uniqueById(resolveSpecializations(specializations));

  const mappedValueProps = uniqueById(
    valuePropositions
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        id: item.id,
        step: humanizeCopy(item.step_label),
        title: humanizeCopy(item.title),
        description: humanizeCopy(item.description),
        highlight: humanizeCopy(item.highlight),
        iconKey: item.icon_key || "sparkles",
      }))
  );

  const testimonials = uniqueById(
    selectHomeClientStories(clientStories)
      .map((story) => mapTestimonial(story, mediaMap))
      .filter((item): item is HomeTestimonial => item !== null),
  );

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
