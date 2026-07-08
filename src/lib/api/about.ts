import { ABOUT_PAGE_HEADER, ABOUT_STORY_SECTIONS } from "@/data/about-content";
import {
  buildMediaUrlMap,
  getAboutClientLogos,
  getAboutPageHeader,
  getAboutStorySections,
  getMediaAssets,
  resolveMediaUrl,
} from "./cms";
import type { CmsAboutClientLogo, CmsAboutStorySection } from "./types";

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

export type AboutClientLogo = {
  id: string;
  name: string;
  logoSrc: string;
};

export type AboutPageData = {
  header: AboutPageHeader;
  storySections: AboutStorySection[];
  clientLogos: AboutClientLogo[];
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

function mapClientLogo(
  logo: CmsAboutClientLogo,
  mediaMap: Map<string, string>,
): AboutClientLogo | null {
  const logoSrc = resolveMediaUrl(mediaMap, logo.logo_media_id, "");
  if (!logoSrc) return null;
  return {
    id: logo.id,
    name: logo.name,
    logoSrc,
  };
}

export async function getAboutPageData(): Promise<AboutPageData> {
  const [headerRow, storyRows, clientLogoRows, mediaAssets] = await Promise.all([
    getAboutPageHeader(),
    getAboutStorySections(),
    getAboutClientLogos(),
    getMediaAssets(),
  ]);

  const mediaMap = buildMediaUrlMap(mediaAssets);

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

  const clientLogos = clientLogoRows
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((logo) => mapClientLogo(logo, mediaMap))
    .filter((logo): logo is AboutClientLogo => logo !== null);

  return { header, storySections, clientLogos };
}
