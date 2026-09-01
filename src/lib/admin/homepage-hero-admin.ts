import { adminFetch } from "@/lib/admin/api-client";
import {
  clampHeroSliderMaxItems,
  type AdminHomepageHeroSliderSettings,
} from "@/lib/api/homepage-hero-settings";

function normalizeSettings(
  data: Partial<AdminHomepageHeroSliderSettings> | null | undefined,
): AdminHomepageHeroSliderSettings {
  return {
    hero_slider_max_items: clampHeroSliderMaxItems(data?.hero_slider_max_items),
    visible_package_ids: data?.visible_package_ids?.map(String) ?? [],
    visible_itinerary_ids: data?.visible_itinerary_ids?.map(String) ?? [],
  };
}

export async function fetchHomepageHeroSliderSettings(): Promise<AdminHomepageHeroSliderSettings> {
  const { data, error } = await adminFetch<AdminHomepageHeroSliderSettings>(
    "/homepage-hero-slider/settings",
  );
  if (error) throw new Error(error.message);
  return normalizeSettings(data);
}

export async function saveHomepageHeroSliderSettings(
  payload: Partial<AdminHomepageHeroSliderSettings>,
): Promise<AdminHomepageHeroSliderSettings> {
  const { data, error } = await adminFetch<AdminHomepageHeroSliderSettings>(
    "/homepage-hero-slider/settings",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  if (error) throw new Error(error.message);
  return normalizeSettings(data);
}

export type HeroSliderOrderItem = {
  kind: "package" | "itinerary";
  id: string;
};

export async function saveHomepageHeroSliderOrder(options: {
  items?: HeroSliderOrderItem[];
  packageIds?: string[];
  itineraryIds?: string[];
}): Promise<AdminHomepageHeroSliderSettings> {
  const { data, error } = await adminFetch<AdminHomepageHeroSliderSettings>(
    "/homepage-hero-slider/order",
    {
      method: "PUT",
      body: JSON.stringify({
        items: options.items,
        package_ids: options.packageIds,
        itinerary_ids: options.itineraryIds,
      }),
    },
  );
  if (error) throw new Error(error.message);
  return normalizeSettings(data);
}

/** Keep package featured flag and hero slider visibility list in sync with the public homepage. */
export async function setPackageHomepageVisibility(options: {
  packageId: string;
  makeVisible: boolean;
  currentVisibleIds: string[];
  featuredCount: number;
}): Promise<AdminHomepageHeroSliderSettings> {
  const { packageId, makeVisible, currentVisibleIds } = options;

  const nextVisibleIds = makeVisible
    ? currentVisibleIds.includes(packageId)
      ? currentVisibleIds
      : [...currentVisibleIds, packageId]
    : currentVisibleIds.filter((id) => id !== packageId);

  return saveHomepageHeroSliderSettings({ visible_package_ids: nextVisibleIds });
}

/** Keep itinerary featured flag and hero slider visibility list in sync. */
export async function setItineraryHomepageVisibility(options: {
  itineraryId: string;
  makeVisible: boolean;
  currentVisibleIds: string[];
}): Promise<AdminHomepageHeroSliderSettings> {
  const { itineraryId, makeVisible, currentVisibleIds } = options;

  const nextVisibleIds = makeVisible
    ? currentVisibleIds.includes(itineraryId)
      ? currentVisibleIds
      : [...currentVisibleIds, itineraryId]
    : currentVisibleIds.filter((id) => id !== itineraryId);

  return saveHomepageHeroSliderSettings({ visible_itinerary_ids: nextVisibleIds });
}
