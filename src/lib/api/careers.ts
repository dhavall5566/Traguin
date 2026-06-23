import { getCareersPageExtras, getJobOpenings } from "./cms";
import type { CmsJobOpening } from "./types";

export type CareersCultureChip = {
  label: string;
};

export type CareersJobOpening = {
  id: string;
  slug: string;
  title: string;
  location: string;
  employmentType: string;
  description: string;
};

export type CareersFallback = {
  title: string;
  description: string;
};

export type CareersPageData = {
  cultureChips: CareersCultureChip[];
  openings: CareersJobOpening[];
  fallback: CareersFallback;
};

const DEFAULT_CULTURE_CHIPS: CareersCultureChip[] = [
  { label: "Bespoke travel studio" },
  { label: "Collaborative expert team" },
  { label: "Ahmedabad headquarters" },
];

const DEFAULT_FALLBACK: CareersFallback = {
  title: "Don't see your role?",
  description:
    "Send your résumé and a short note on what you would bring to TRAGUIN. We review every application personally.",
};

function mapJobOpening(opening: CmsJobOpening): CareersJobOpening {
  return {
    id: opening.id,
    slug: opening.slug,
    title: opening.title,
    location: opening.location,
    employmentType: opening.employment_type,
    description: opening.description,
  };
}

export async function getCareersPageData(): Promise<CareersPageData> {
  const [extras, openings] = await Promise.all([getCareersPageExtras(), getJobOpenings()]);

  const cultureChips =
    extras?.culture_chips?.length
      ? extras.culture_chips.map((label) => ({ label }))
      : DEFAULT_CULTURE_CHIPS;

  const fallback: CareersFallback = extras
    ? {
        title: extras.fallback_title,
        description: extras.fallback_description,
      }
    : DEFAULT_FALLBACK;

  return {
    cultureChips,
    openings: openings
      .filter((item) => item.is_published)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapJobOpening),
    fallback,
  };
}
