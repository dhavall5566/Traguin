export type GalleryCategory = {
  id: string;
  label: string;
};

export type GalleryItem = {
  id: string;
  place: string;
  region: string;
  image: string;
  alt: string;
  categorySlugs: string[];
  layout: string;
  labelStyle: string;
};

export type GalleryClientWallItem = {
  id: string;
  name: string;
  destination: string;
  image: string;
  portraitMediaId: string;
  rotate: number;
};

export function filterGalleryItems(items: GalleryItem[], categoryId: string): GalleryItem[] {
  if (categoryId === "all") return items;
  return items.filter((item) => item.categorySlugs.includes(categoryId));
}

export function normalizeGalleryLabel(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function looksLikeClientName(value: string): boolean {
  return /^(mr|mrs|ms|dr)\.?\s/i.test(value.trim());
}

function stripHonorific(value: string): string {
  return value.trim().replace(/^(mr|mrs|ms|dr)\.?\s+/i, "");
}

/** Show region subtitle only for destination-style cards, not duplicate client names. */
export function shouldShowGalleryRegion(place: string, region: string): boolean {
  const placeLabel = place.trim();
  const regionLabel = region.trim();
  if (!regionLabel) return false;
  if (looksLikeClientName(placeLabel) || looksLikeClientName(regionLabel)) return false;

  const placeKey = normalizeGalleryLabel(stripHonorific(placeLabel));
  const regionKey = normalizeGalleryLabel(stripHonorific(regionLabel));
  if (!placeKey || placeKey === regionKey) return false;

  return normalizeGalleryLabel(placeLabel) !== normalizeGalleryLabel(regionLabel);
}
