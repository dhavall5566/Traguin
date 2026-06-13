const pexels4k = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=3840&h=2160&fit=crop`;

const unsplash4k = (id: string) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.1.0&auto=format&fit=crop&w=3840&q=80`;

export type PlannerCtaBackground = {
  src: string;
  alt: string;
};

export const plannerCtaBackgrounds: PlannerCtaBackground[] = [
  {
    src: pexels4k(1365425),
    alt: "Sunlit mountain peaks reflected in a turquoise alpine lake",
  },
  {
    src: pexels4k(6720718),
    alt: "Travelers on a mountain trail above dramatic peaks",
  },
  {
    src: unsplash4k("1506905925346-21bda4d32df4"),
    alt: "Snow-capped mountains rising above a sea of clouds",
  },
  {
    src: pexels4k(1179225),
    alt: "Dramatic mountain range under open sky",
  },
  {
    src: pexels4k(2166711),
    alt: "Deep Nordic fjord surrounded by forested cliffs",
  },
  {
    src: pexels4k(1010657),
    alt: "Whitewashed villages overlooking the Aegean caldera",
  },
  {
    src: pexels4k(1285626),
    alt: "Overwater villas above clear turquoise lagoon water",
  },
  {
    src: pexels4k(2387873),
    alt: "High-altitude road through rugged mountain terrain",
  },
  {
    src: pexels4k(417074),
    alt: "Waterfall cascading through moss-covered cliffs",
  },
  {
    src: pexels4k(2901209),
    alt: "Coastal windmills above the Aegean at golden hour",
  },
];

export function pickPlannerCtaBackground(excludeIndex = -1): number {
  if (plannerCtaBackgrounds.length <= 1) return 0;

  let index = Math.floor(Math.random() * plannerCtaBackgrounds.length);
  let attempts = 0;

  while (index === excludeIndex && attempts < 12) {
    index = Math.floor(Math.random() * plannerCtaBackgrounds.length);
    attempts += 1;
  }

  return index;
}
