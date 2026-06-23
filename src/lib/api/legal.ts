import { images } from "@/lib/images";
import type { LegalPageContent, LegalSection } from "@/data/legal";
import { privacyPolicy, termsOfService } from "@/data/legal";
import {
  buildMediaUrlMap,
  getLegalPageBySlug,
  getMediaAssets,
  resolveMediaUrl,
} from "./cms";

const LEGAL_FALLBACKS: Record<string, LegalPageContent> = {
  "privacy-policy": privacyPolicy,
  "terms-of-service": termsOfService,
};

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

/** Normalize untyped JSONB section objects from the CMS. */
export function mapCmsLegalSection(raw: unknown): LegalSection | null {
  if (!raw || typeof raw !== "object") return null;

  const section = raw as Record<string, unknown>;
  const title = String(section.title ?? "").trim();
  if (!title) return null;

  let paragraphs = asStringArray(section.paragraphs);
  if (paragraphs.length === 0 && typeof section.body === "string" && section.body.trim()) {
    paragraphs = [section.body.trim()];
  }
  if (paragraphs.length === 0 && typeof section.paragraph === "string" && section.paragraph.trim()) {
    paragraphs = [section.paragraph.trim()];
  }

  let list = asStringArray(section.list);
  if (list.length === 0) list = asStringArray(section.bullets);
  if (list.length === 0) list = asStringArray(section.items);

  return {
    title,
    paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
    list: list.length > 0 ? list : undefined,
  };
}

export async function getLegalPageData(slug: string): Promise<LegalPageContent | null> {
  const fallback = LEGAL_FALLBACKS[slug] ?? null;

  const [cmsPage, mediaAssets] = await Promise.all([
    getLegalPageBySlug(slug),
    getMediaAssets(),
  ]);

  if (!cmsPage) return fallback;

  const mediaMap = buildMediaUrlMap(mediaAssets);
  const sections = cmsPage.sections
    .map(mapCmsLegalSection)
    .filter((section): section is LegalSection => section !== null);

  if (sections.length === 0 && fallback) {
    return fallback;
  }

  const heroImage =
    resolveMediaUrl(mediaMap, cmsPage.hero_media_id, "") ||
    fallback?.heroImage ||
    images.travel;

  return {
    eyebrow: cmsPage.eyebrow,
    title: cmsPage.title,
    description: cmsPage.description,
    effectiveDate: cmsPage.effective_date,
    heroImage,
    heroImageAlt: cmsPage.hero_image_alt ?? fallback?.heroImageAlt ?? cmsPage.title,
    sections: sections.length > 0 ? sections : (fallback?.sections ?? []),
  };
}
