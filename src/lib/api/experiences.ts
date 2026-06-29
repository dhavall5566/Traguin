import { images } from "@/lib/images";
import type {
  ExperienceDetail,
  ExperienceShowcaseItem,
} from "@/lib/experience-types";
import {
  buildMediaUrlMap,
  getExperienceBySlug,
  getExperiences,
  getMediaAssets,
  resolveMediaUrl,
} from "./cms";
import type { CmsExperience } from "./types";
import { humanizeCopy } from "@/lib/copy";

const SHOWCASE_IMAGE_BY_SLUG: Record<string, string> = {
  "group-tours": images.experienceGroupTours,
  "private-luxe": images.experiencePrivateLuxe,
  "corporate-events": images.experienceCorporate,
  "school-trips": images.experienceSchool,
};

function showcaseImageForSlug(slug: string): string {
  return SHOWCASE_IMAGE_BY_SLUG[slug] ?? images.experienceGroupTours;
}

export function mapCmsExperienceToShowcaseItem(
  exp: CmsExperience,
  mediaMap: Map<string, string>
): ExperienceShowcaseItem {
  const layout = (exp.layout ?? "wide-split-right") as ExperienceShowcaseItem["layout"];
  const variant = (exp.variant === "light" ? "light" : "warm") as ExperienceShowcaseItem["variant"];

  return {
    id: exp.slug,
    number: exp.card_number ?? "01",
    title: humanizeCopy(exp.card_title ?? exp.headline),
    description: humanizeCopy(exp.card_description ?? exp.intro),
    image: showcaseImageForSlug(exp.slug),
    imageCaption: exp.image_caption ? humanizeCopy(exp.image_caption) : undefined,
    href: "/contact#consultation",
    layout,
    variant,
  };
}

export function mapCmsExperienceToDetail(
  exp: CmsExperience,
  mediaMap: Map<string, string>
): ExperienceDetail {
  return {
    slug: exp.slug,
    eyebrow: exp.eyebrow,
    headline: exp.headline,
    intro: exp.intro,
    heroImage: resolveMediaUrl(mediaMap, exp.hero_media_id, images.experienceGroupTours),
    offers: exp.offers
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((offer) => ({
        iconKey: offer.icon_key,
        title: offer.title,
        description: offer.description,
      })),
    stats: exp.stats
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((stat) => ({
        value: stat.value,
        label: stat.label,
      })),
    quote: exp.quote?.trim() ?? "",
    process: exp.process_steps
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((step) => ({
        step: step.step_label,
        title: step.title,
        detail: step.detail,
      })),
    ctaTitle: exp.cta_title ?? "Start planning",
    ctaDescription:
      exp.cta_description ?? "Tell us about your journey and we'll respond within 2 working hours.",
  };
}

export async function getExperienceDetailData(slug: string): Promise<ExperienceDetail | null> {
  const [cmsExperience, mediaAssets] = await Promise.all([
    getExperienceBySlug(slug),
    getMediaAssets(),
  ]);

  if (!cmsExperience?.is_published) return null;

  const mediaMap = buildMediaUrlMap(mediaAssets);
  return mapCmsExperienceToDetail(cmsExperience, mediaMap);
}

export async function getPublishedExperiencesContext() {
  const [experiences, mediaAssets] = await Promise.all([getExperiences(), getMediaAssets()]);
  const mediaMap = buildMediaUrlMap(mediaAssets);
  const published = experiences.filter((exp) => exp.is_published);

  const showcaseItems = published
    .filter((exp) => exp.show_on_homepage)
    .sort((a, b) => (a.homepage_sort_order ?? 999) - (b.homepage_sort_order ?? 999))
    .map((exp) => mapCmsExperienceToShowcaseItem(exp, mediaMap));

  const detailsBySlug = Object.fromEntries(
    published.map((exp) => [exp.slug, mapCmsExperienceToDetail(exp, mediaMap)])
  ) as Record<string, ExperienceDetail>;

  return { showcaseItems, detailsBySlug };
}
