import type { ExperienceDetail } from "@/lib/experience-types";
import { mapCmsExperienceToDetail } from "@/lib/api/experiences";
import type { CmsExperience, CmsMediaAsset } from "@/lib/api/types";

function getPublicCmsBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_CMS_API_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${getPublicCmsBaseUrl()}${path}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchExperienceDetailClient(
  slug: string
): Promise<ExperienceDetail | null> {
  const experience = await fetchJson<CmsExperience>(
    `/api/cms/public/experiences/slug/${encodeURIComponent(slug)}`
  );
  if (!experience?.is_published) return null;

  let heroUrl = "";
  if (experience.hero_media_id) {
    const media = await fetchJson<CmsMediaAsset>(
      `/api/cms/public/media/${encodeURIComponent(experience.hero_media_id)}`
    );
    heroUrl = media?.url ?? "";
  }

  const mediaMap = new Map<string, string>();
  if (experience.hero_media_id && heroUrl) {
    mediaMap.set(experience.hero_media_id, heroUrl);
  }

  return mapCmsExperienceToDetail(experience, mediaMap);
}
