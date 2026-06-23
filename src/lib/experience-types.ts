import type { LucideIcon } from "lucide-react";

export type ExperienceCardLayout = "wide-split-right" | "tall-stack" | "wide-split-left";

export type ExperienceShowcaseItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageCaption?: string;
  href: string;
  layout: ExperienceCardLayout;
  variant: "warm" | "light";
};

export type ExperienceOffer = {
  iconKey: string;
  title: string;
  description: string;
};

export type ExperienceStat = {
  value: string;
  label: string;
};

export type ExperienceDetail = {
  slug: string;
  eyebrow: string;
  headline: string;
  intro: string;
  heroImage: string;
  offers: ExperienceOffer[];
  stats: ExperienceStat[];
  quote: string;
  process: { step: string; title: string; detail: string }[];
  ctaTitle: string;
  ctaDescription: string;
};
