import { images } from "@/lib/images";
import type {
  GalleryCategory,
  GalleryClientWallItem,
  GalleryFilmMoment,
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
  filmMoments: GalleryFilmMoment[];
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
    destination: story.destination_label ?? "Journey",
    tripType: story.trip_type ?? "Luxury Travel",
    image,
    rotate: COLLAGE_ROTATIONS[index % COLLAGE_ROTATIONS.length],
  };
}

export function mapCmsClientStoryToFilmMoment(
  story: CmsClientStory,
  mediaMap: Map<string, string>
): GalleryFilmMoment | null {
  if (!story.video_url?.trim()) return null;

  const poster = resolveMediaUrl(
    mediaMap,
    story.poster_media_id ?? story.portrait_media_id,
    images.bali
  );

  return {
    id: story.id,
    title: story.title ?? story.client_name,
    destination: story.destination_label ?? "Journey",
    caption: story.caption ?? "",
    poster,
    src: story.video_url,
  };
}

export function mapCmsGalleryItemToGalleryItem(
  item: CmsGalleryItem,
  mediaMap: Map<string, string>,
  altMap: Map<string, string>
): GalleryItem | null {
  const image = resolveMediaUrl(mediaMap, item.media_id, "");
  if (!image) return null;

  const alt =
    resolveMediaAlt(altMap, item.media_id, "") ||
    `${item.place}, ${item.region_label}`;

  return {
    id: item.slug,
    place: item.place,
    region: item.region_label,
    image,
    alt,
    categorySlugs: item.categories.map((category) => category.slug),
    layout: item.layout,
    labelStyle: item.label_style,
  };
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
    .filter((story) => !story.is_film)
    .map((story, index) => mapCmsClientStoryToWallItem(story, mediaMap, index))
    .filter((item): item is GalleryClientWallItem => item != null);

  const filmMoments = galleryStories
    .filter((story) => story.is_film)
    .map((story) => mapCmsClientStoryToFilmMoment(story, mediaMap))
    .filter((item): item is GalleryFilmMoment => item != null);

  const galleryItems = cmsItems
    .filter((item) => item.is_published)
    .sort(
      (a, b) =>
        (a.sort_order ?? 999) - (b.sort_order ?? 999) || a.place.localeCompare(b.place)
    )
    .map((item) => mapCmsGalleryItemToGalleryItem(item, mediaMap, altMap))
    .filter((item): item is GalleryItem => item != null);

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
    filmMoments,
  };
}
