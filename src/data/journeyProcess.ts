import { Compass, PenLine, Sparkles, PlaneTakeoff, type LucideIcon } from "lucide-react";

export type JourneyStep = {
  id: string;
  step: string;
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
};

export const journeySteps: JourneyStep[] = [
  {
    id: "discover",
    step: "01",
    title: "Share Your Vision",
    description:
      "Tell us how you wish to feel, pace, passions, companions, and the moments that matter most.",
    detail: "Complimentary 30-minute design call with a senior travel specialist.",
    icon: Compass,
  },
  {
    id: "design",
    step: "02",
    title: "Receive Your Blueprint",
    description:
      "We craft a day-by-day itinerary with handpicked stays, private transfers, and curated experiences.",
    detail: "First draft delivered within 2 hrs of your consultation.",
    icon: PenLine,
  },
  {
    id: "refine",
    step: "03",
    title: "Refine Every Detail",
    description:
      "Adjust dining reservations, room categories, and excursions until the journey feels unmistakably yours.",
    detail: "Unlimited revisions until you approve the final program.",
    icon: Sparkles,
  },
  {
    id: "depart",
    step: "04",
    title: "Travel With Confidence",
    description:
      "Dedicated support before departure, on-ground coordination, and post-trip follow-up, always one message away.",
    detail: "24/7 travel expert desk for active journeys.",
    icon: PlaneTakeoff,
  },
];
