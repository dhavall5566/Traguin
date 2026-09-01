import type { CmsCompanyStats, CmsItinerary, CmsPackage, CmsStatJson } from "@/lib/api/types";

export const HERO_SLIDER_META_ID = "__hero_slider_settings";
export const HERO_SLIDER_DEFAULT_MAX_ITEMS = 8;
export const HERO_SLIDER_MIN_ITEMS = 1;
export const HERO_SLIDER_MAX_ITEMS = 20;

export type HomepageHeroSliderSettings = {
  hero_slider_max_items: number;
  visible_package_ids: string[];
  visible_itinerary_ids: string[];
};

function metaEntry(homepageStats: CmsStatJson[] | undefined): CmsStatJson | null {
  if (!homepageStats?.length) return null;
  return homepageStats.find((item) => item.id === HERO_SLIDER_META_ID) ?? null;
}

export function clampHeroSliderMaxItems(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return HERO_SLIDER_DEFAULT_MAX_ITEMS;
  return Math.min(HERO_SLIDER_MAX_ITEMS, Math.max(HERO_SLIDER_MIN_ITEMS, Math.round(parsed)));
}

function parseIdList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((id) => String(id)).filter(Boolean);
}

export function readHomepageHeroSettings(
  companyStats: CmsCompanyStats | null | undefined,
): HomepageHeroSliderSettings {
  const meta = metaEntry(companyStats?.homepage_stats);

  return {
    hero_slider_max_items: clampHeroSliderMaxItems(meta?.hero_slider_max_items),
    visible_package_ids: parseIdList(meta?.visible_package_ids),
    visible_itinerary_ids: parseIdList(meta?.visible_itinerary_ids),
  };
}

export function hasHomepageHeroVisibilityConfigured(
  companyStats: CmsCompanyStats | null | undefined,
): boolean {
  if (!companyStats?.homepage_stats?.length) return false;
  return companyStats.homepage_stats.some((item) => item?.id === HERO_SLIDER_META_ID);
}

function sortByFeaturedOrder<T extends { featured_sort_order: number | null; title: string }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) =>
      (a.featured_sort_order ?? 999) - (b.featured_sort_order ?? 999) ||
      a.title.localeCompare(b.title),
  );
}

export function selectHomepageHeroPackages(
  packages: CmsPackage[],
  companyStats: CmsCompanyStats | null | undefined,
): CmsPackage[] {
  const published = packages.filter((pkg) => pkg.is_published);
  const settings = readHomepageHeroSettings(companyStats);

  if (hasHomepageHeroVisibilityConfigured(companyStats)) {
    const visibleSet = new Set(settings.visible_package_ids);
    return sortByFeaturedOrder(published.filter((pkg) => visibleSet.has(pkg.id)));
  }

  let featured = sortByFeaturedOrder(published.filter((pkg) => pkg.is_featured));

  if (settings.visible_package_ids.length > 0) {
    const visibleSet = new Set(settings.visible_package_ids);
    featured = featured.filter((pkg) => visibleSet.has(pkg.id));
  } else if (featured.length > 0) {
    featured = featured.slice(0, settings.hero_slider_max_items);
  }

  return featured;
}

export function selectHomepageHeroItineraries(
  itineraries: CmsItinerary[],
  companyStats: CmsCompanyStats | null | undefined,
): CmsItinerary[] {
  const published = itineraries.filter((item) => item.is_published);
  const settings = readHomepageHeroSettings(companyStats);

  if (hasHomepageHeroVisibilityConfigured(companyStats)) {
    const visibleSet = new Set(settings.visible_itinerary_ids);
    return sortByFeaturedOrder(published.filter((item) => visibleSet.has(item.id)));
  }

  let featured = sortByFeaturedOrder(published.filter((item) => item.is_featured));

  if (settings.visible_itinerary_ids.length > 0) {
    const visibleSet = new Set(settings.visible_itinerary_ids);
    featured = featured.filter((item) => visibleSet.has(item.id));
  }

  return featured;
}

export type AdminHomepageHeroSliderSettings = HomepageHeroSliderSettings;
