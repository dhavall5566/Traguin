import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceDetailPage } from "@/components/experiences/ExperienceDetailPage";
import { getExperienceDetailData } from "@/lib/api/experiences";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperienceDetailData(slug);
  if (!experience) return { title: "Experience" };

  const title = experience.headline.split(".").slice(0, 1)[0].trim();

  return {
    title,
    description: experience.intro,
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  const { slug } = await params;
  const experience = await getExperienceDetailData(slug);
  if (!experience) notFound();

  return <ExperienceDetailPage experience={experience} />;
}
