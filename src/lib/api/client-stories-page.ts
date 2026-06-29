import { cache } from "react";
import { images } from "@/lib/images";
import {
  buildMediaUrlMap,
  getMediaAssets,
  resolveMediaUrl,
} from "@/lib/api/cms";
import { cmsFetchPaginated } from "@/lib/api/client";
import type { CmsClientStory } from "@/lib/api/types";
import type { GalleryClientWallItem } from "@/lib/gallery-types";
import { mapCmsClientStoryToWallItem } from "@/lib/api/gallery";

export type ClientStoryReview = {
  id: string;
  name: string;
  destination: string | null;
  quote: string;
  image: string;
};

export type ClientStoriesPageData = {
  photos: GalleryClientWallItem[];
  reviews: ClientStoryReview[];
};

function sortForPage(stories: CmsClientStory[]): CmsClientStory[] {
  return [...stories].sort(
    (a, b) =>
      (a.gallery_sort_order ?? a.home_sort_order ?? 999) -
        (b.gallery_sort_order ?? b.home_sort_order ?? 999) ||
      a.client_name.localeCompare(b.client_name),
  );
}

function mapReview(
  story: CmsClientStory,
  mediaMap: Map<string, string>,
): ClientStoryReview | null {
  const quote = story.quote?.trim();
  if (!quote) return null;

  return {
    id: story.id,
    name: story.client_name,
    destination: story.destination_name?.trim() || null,
    quote,
    image: resolveMediaUrl(mediaMap, story.portrait_media_id, images.couple1),
  };
}

export const getClientStoriesPageData = cache(async function getClientStoriesPageData(): Promise<ClientStoriesPageData> {
  const [stories, mediaAssets] = await Promise.all([
    cmsFetchPaginated<CmsClientStory>("/api/cms/public/client-stories", {
      limit: 100,
    }),
    getMediaAssets(),
  ]);

  const mediaMap = buildMediaUrlMap(mediaAssets);
  const published = sortForPage(stories.filter((story) => story.is_published));

  let photoIndex = 0;
  const photos = published
    .filter((story) => story.show_in_gallery)
    .map((story) => mapCmsClientStoryToWallItem(story, mediaMap, photoIndex++))
    .filter((item): item is GalleryClientWallItem => item != null);

  const reviews = published
    .map((story) => mapReview(story, mediaMap))
    .filter((item): item is ClientStoryReview => item != null);

  return { photos, reviews };
});
