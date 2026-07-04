import { ABOUT_PAGE_HEADER, ABOUT_STORY_SECTIONS } from "@/data/about-content";
import { getAboutPageHeader, getAboutStorySections } from "./cms";
import type { CmsAboutStorySection } from "./types";

export type AboutPageHeader = {
  eyebrow: string;
  title: string;
  description: string;
};

export type AboutStorySection = {
  id: string;
  title: string;
  body: string;
};

export type AboutPageData = {
  header: AboutPageHeader;
  storySections: AboutStorySection[];
};

const DEFAULT_HEADER: AboutPageHeader = { ...ABOUT_PAGE_HEADER };

const DEFAULT_STORY_SECTIONS: AboutStorySection[] = ABOUT_STORY_SECTIONS.map(
  (section, index) => ({
    id: `fallback-about-${index}`,
    title: section.title,
    body: section.body,
  }),
);

function mapStorySection(section: CmsAboutStorySection): AboutStorySection {
  return {
    id: section.id,
    title: section.title,
    body: section.body,
  };
}

export async function getAboutPageData(): Promise<AboutPageData> {
  const [headerRow, storyRows] = await Promise.all([
    getAboutPageHeader(),
    getAboutStorySections(),
  ]);

  const header: AboutPageHeader = headerRow
    ? {
        eyebrow: headerRow.eyebrow,
        title: headerRow.title,
        description: headerRow.description,
      }
    : DEFAULT_HEADER;

  const storySections =
    storyRows.length > 0
      ? storyRows
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(mapStorySection)
      : DEFAULT_STORY_SECTIONS;

  return { header, storySections };
}
