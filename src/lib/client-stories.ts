import type { CmsClientStory } from "@/lib/api/types";

export const HOME_CLIENT_STORIES_LIMIT = 6;

export function clientStorySortKey(story: CmsClientStory): number {
  return story.gallery_sort_order ?? story.home_sort_order ?? 999;
}

/** Shared ordering for client-stories page and homepage carousel. */
export function sortClientStoriesForDisplay(stories: CmsClientStory[]): CmsClientStory[] {
  return [...stories].sort(
    (a, b) =>
      clientStorySortKey(a) - clientStorySortKey(b) ||
      a.client_name.localeCompare(b.client_name),
  );
}

export function isPublishableClientStory(story: CmsClientStory): boolean {
  return Boolean(story.is_published && story.quote?.trim());
}

/** Top N published reviews — same pool and order as /client-stories. */
export function selectHomeClientStories(
  stories: CmsClientStory[],
  limit = HOME_CLIENT_STORIES_LIMIT,
): CmsClientStory[] {
  return sortClientStoriesForDisplay(stories.filter(isPublishableClientStory)).slice(0, limit);
}
