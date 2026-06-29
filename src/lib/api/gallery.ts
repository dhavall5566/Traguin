import type {
  GalleryCategory,
  GalleryClientWallItem,
  GalleryItem,
} from "@/lib/gallery-types";
import {
  buildMediaUrlMap,
  getGalleryCategories,
  getGalleryClientStories,
  getGalleryItems,
  getMediaAssets,
  resolveMediaUrl,
} from "./cms";
import type { CmsClientStory, CmsGalleryItem, CmsMediaAsset } from "./types";

export type GalleryPageData = {
  clientWall: GalleryClientWallItem[];
  galleryItems: GalleryItem[];
  galleryCategories: GalleryCategory[];
};

const COLLAGE_ROTATIONS = [-3, 2, -1, 3, -2, 1] as const;

function buildMediaAltMap(assets: CmsMediaAsset[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const asset of assets) {
    if (asset.alt_text?.trim()) {
      map.set(asset.id, asset.alt_text.trim());
    }
  }
  return map;
}

function resolveMediaAlt(
  altMap: Map<string, string>,
  mediaId: string | null | undefined,
  fallback: string
): string {
  if (!mediaId) return fallback;
  return altMap.get(mediaId) ?? fallback;
}

function sortGalleryStories(stories: CmsClientStory[]): CmsClientStory[] {
  return [...stories].sort(
    (a, b) =>
      (a.gallery_sort_order ?? 999) - (b.gallery_sort_order ?? 999) ||
      a.client_name.localeCompare(b.client_name)
  );
}

export function mapCmsClientStoryToWallItem(
  story: CmsClientStory,
  mediaMap: Map<string, string>,
  index: number
): GalleryClientWallItem | null {
  const image = resolveMediaUrl(mediaMap, story.portrait_media_id, "");
  if (!image) return null;

  return {
    id: story.id,
    name: story.client_name,
    destination: story.destination_name?.trim() || story.client_name,
    image,
    rotate: COLLAGE_ROTATIONS[index % COLLAGE_ROTATIONS.length],
  };
}

export function mapCmsGalleryItemToGalleryItems(
  item: CmsGalleryItem,
  mediaMap: Map<string, string>,
  altMap: Map<string, string>
): GalleryItem[] {
  const mediaEntries =
    item.media.length > 0
      ? [...item.media].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      : item.media_id
        ? [{ id: item.media_id, url: "", alt_text: null, sort_order: 0 }]
        : [];

  return mediaEntries
    .map((media) => {
      const image = media.url || resolveMediaUrl(mediaMap, media.id, "");
      if (!image) return null;

      const alt =
        resolveMediaAlt(altMap, media.id, "") || `${item.place}, ${item.region_label}`;

      return {
        id: `${item.slug}-${media.id}`,
        place: item.place,
        region: item.region_label,
        image,
        alt,
        categorySlugs: item.categories.map((category) => category.slug),
        layout: item.layout,
        labelStyle: item.label_style,
      };
    })
    .filter((entry): entry is GalleryItem => entry != null);
}

export async function getGalleryPageData(): Promise<GalleryPageData> {
  const [cmsItems, cmsCategories, cmsStories, mediaAssets] = await Promise.all([
    getGalleryItems(),
    getGalleryCategories(),
    getGalleryClientStories(),
    getMediaAssets(),
  ]);

  const mediaMap = buildMediaUrlMap(mediaAssets);
  const altMap = buildMediaAltMap(mediaAssets);
  const galleryStories = sortGalleryStories(cmsStories.filter((story) => story.is_published));

  const clientWall = galleryStories
    .map((story, index) => mapCmsClientStoryToWallItem(story, mediaMap, index))
    .filter((item): item is GalleryClientWallItem => item != null);

  const galleryItems = cmsItems
    .filter((item) => item.is_published)
    .sort(
      (a, b) =>
        (a.sort_order ?? 999) - (b.sort_order ?? 999) || a.place.localeCompare(b.place)
    )
    .flatMap((item) => mapCmsGalleryItemToGalleryItems(item, mediaMap, altMap));

  const galleryCategories: GalleryCategory[] = [
    { id: "all", label: "All" },
    ...cmsCategories
      .sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label))
      .map((category) => ({ id: category.slug, label: category.label })),
  ];

  return {
    clientWall,
    galleryItems,
    galleryCategories,
  };
}
