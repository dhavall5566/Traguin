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

const DEFAULT_HEADER: AboutPageHeader = {
  eyebrow: "Who We Are",
  title: "Crafted for discerning travelers",
  description:
    "Like the world's finest travel houses, we combine deep destination knowledge with white-glove service, so every journey feels effortless and entirely yours.",
};

const DEFAULT_STORY_SECTIONS: AboutStorySection[] = [
  {
    id: "fallback-our-story",
    title: "Our Story",
    body: "Founded in Ahmedabad, TRAGUIN began with a simple belief: luxury travel should feel personal, not transactional. What started as bespoke domestic journeys has grown into a global travel expert practice trusted by families, executives, and celebrants alike.",
  },
  {
    id: "fallback-since-2024",
    title: "Since 2024",
    body: "We refined our craft from day one, pairing discerning travelers with properties, experiences, and specialists that reflect their standards, never a catalogue.",
  },
  {
    id: "fallback-philosophy",
    title: "Philosophy",
    body: "We design around how you wish to feel. Every itinerary balances beauty, comfort, and authenticity, never overcrowded schedules or generic packages.",
  },
  {
    id: "fallback-team",
    title: "Team",
    body: "Travel designers, travel expert leads, and on-ground partners operate as one studio. You work with specialists who know your preferences before you need to repeat them.",
  },
  {
    id: "fallback-partnerships",
    title: "Partnerships",
    body: "Preferred relationships with leading hotel groups, DMCs, and aviation partners give our clients access, upgrades, and experiences rarely available to the public.",
  },
  {
    id: "fallback-expertise",
    title: "Expertise",
    body: "From Indian heritage circuits to Alpine retreats and Indian Ocean sanctuaries, regional depth with international polish on every journey we craft.",
  },
];

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
