import { images } from "@/lib/images";

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

export const experienceShowcase: ExperienceShowcaseItem[] = [
  {
    id: "group-tours",
    number: "01",
    title: "Group Tours",
    description:
      "Expertly curated group journeys with seamless logistics, private guides, and experiences designed for families, friends, and milestone celebrations.",
    image: images.experienceGroupTours,
    href: "/experiences/group-tours",
    layout: "wide-split-right",
    variant: "warm",
  },
  {
    id: "private-luxe",
    number: "02",
    title: "Private Luxe",
    description:
      "Bespoke one-to-one travel with white-glove service, exclusive access, and itineraries shaped entirely around your pace and preferences.",
    image: images.experiencePrivateLuxe,
    imageCaption:
      "Private villas, personal guides, and unhurried luxury across the world's finest destinations.",
    href: "/experiences/private-luxe",
    layout: "tall-stack",
    variant: "light",
  },
  {
    id: "corporate-events",
    number: "03",
    title: "Corporate Events",
    description:
      "Executive retreats, incentive travel, and offsites executed with precision — from venue selection to on-ground coordination.",
    image: images.experienceCorporate,
    imageCaption:
      "Boardroom to beach — seamless corporate travel and event management worldwide.",
    href: "/experiences/corporate-events",
    layout: "tall-stack",
    variant: "light",
  },
  {
    id: "school-trips",
    number: "04",
    title: "School Tours",
    description:
      "Educational and adventure programs for student groups with safety-first planning, enriching itineraries, and dedicated travel experts.",
    image: images.experienceSchool,
    href: "/experiences/school-trips",
    layout: "wide-split-left",
    variant: "warm",
  },
];
