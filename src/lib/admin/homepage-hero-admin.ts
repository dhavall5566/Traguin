import { adminFetch } from "@/lib/admin/api-client";
import {
  clampHeroSliderMaxItems,
  type AdminHomepageHeroSliderSettings,
} from "@/lib/api/homepage-hero-settings";

export async function fetchHomepageHeroSliderSettings(): Promise<AdminHomepageHeroSliderSettings> {
  const { data, error } = await adminFetch<AdminHomepageHeroSliderSettings>(
    "/homepage-hero-slider/settings",
  );
  if (error) throw new Error(error.message);
  return {
    hero_slider_max_items: clampHeroSliderMaxItems(data?.hero_slider_max_items),
    visible_package_ids: data?.visible_package_ids?.map(String) ?? [],
  };
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
  return {
    hero_slider_max_items: clampHeroSliderMaxItems(data?.hero_slider_max_items),
    visible_package_ids: data?.visible_package_ids?.map(String) ?? [],
  };
}

export async function saveHomepageHeroSliderOrder(
  packageIds: string[],
): Promise<AdminHomepageHeroSliderSettings> {
  const { data, error } = await adminFetch<AdminHomepageHeroSliderSettings>(
    "/homepage-hero-slider/order",
    {
      method: "PUT",
      body: JSON.stringify({ package_ids: packageIds }),
    },
  );
  if (error) throw new Error(error.message);
  return {
    hero_slider_max_items: clampHeroSliderMaxItems(data?.hero_slider_max_items),
    visible_package_ids: data?.visible_package_ids?.map(String) ?? [],
  };
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
