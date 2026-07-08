import type { CmsCompanyStats, CmsStatJson } from "@/lib/api/types";

export const HERO_SLIDER_META_ID = "__hero_slider_settings";
export const HERO_SLIDER_DEFAULT_MAX_ITEMS = 8;
export const HERO_SLIDER_MIN_ITEMS = 1;
export const HERO_SLIDER_MAX_ITEMS = 20;

export type HomepageHeroSliderSettings = {
  hero_slider_max_items: number;
  visible_package_ids: string[];
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

export function readHomepageHeroSettings(
  companyStats: CmsCompanyStats | null | undefined,
): HomepageHeroSliderSettings {
  const meta = metaEntry(companyStats?.homepage_stats);
  const visibleRaw = meta?.visible_package_ids;
  const visible_package_ids = Array.isArray(visibleRaw)
    ? visibleRaw.map((id) => String(id)).filter(Boolean)
    : [];

  return {
    hero_slider_max_items: clampHeroSliderMaxItems(meta?.hero_slider_max_items),
    visible_package_ids,
  };
}

export function hasHomepageHeroVisibilityConfigured(
  companyStats: CmsCompanyStats | null | undefined,
): boolean {
  if (!companyStats?.homepage_stats?.length) return false;
  return companyStats.homepage_stats.some((item) => item?.id === HERO_SLIDER_META_ID);
}

export function selectHomepageHeroPackages(
  packages: import("@/lib/api/types").CmsPackage[],
  companyStats: CmsCompanyStats | null | undefined,
): import("@/lib/api/types").CmsPackage[] {
  const published = packages.filter((pkg) => pkg.is_published);
  const settings = readHomepageHeroSettings(companyStats);

  if (hasHomepageHeroVisibilityConfigured(companyStats)) {
    const visibleSet = new Set(settings.visible_package_ids);
    return published
      .filter((pkg) => visibleSet.has(pkg.id))
      .sort(
        (a, b) =>
          (a.featured_sort_order ?? 999) - (b.featured_sort_order ?? 999) ||
          a.title.localeCompare(b.title),
      );
  }

  let featured = published
    .filter((pkg) => pkg.is_featured)
    .sort(
      (a, b) =>
        (a.featured_sort_order ?? 999) - (b.featured_sort_order ?? 999) ||
        a.title.localeCompare(b.title),
    );

  if (settings.visible_package_ids.length > 0) {
    const visibleSet = new Set(settings.visible_package_ids);
    featured = featured.filter((pkg) => visibleSet.has(pkg.id));
  } else if (featured.length > 0) {
    featured = featured.slice(0, settings.hero_slider_max_items);
  }

  return featured;
}

export type AdminHomepageHeroSliderSettings = HomepageHeroSliderSettings;
