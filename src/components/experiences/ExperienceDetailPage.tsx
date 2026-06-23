"use client";

import type { ExperienceDetail } from "@/lib/experience-types";
import { ExperienceDetailContent } from "@/components/experiences/ExperienceDetailContent";

type ExperienceDetailPageProps = {
  experience: ExperienceDetail;
};

export function ExperienceDetailPage({ experience }: ExperienceDetailPageProps) {
  return (
    <article className="bg-[var(--bento-warm)]">
      <ExperienceDetailContent experience={experience} />
    </article>
  );
}
