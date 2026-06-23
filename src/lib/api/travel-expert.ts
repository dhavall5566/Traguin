import { images } from "@/lib/images";
import {
  buildMediaUrlMap,
  getConciergeServices,
  getMediaAssets,
  getTravelExpertSettings,
  resolveMediaUrl,
} from "./cms";
import type { CmsConciergeService } from "./types";

export type TravelExpertService = {
  id: string;
  slug: string;
  iconKey: string;
  title: string;
  description: string;
  image: string;
  number: string;
  featured: boolean;
  wide: boolean;
};

export type TravelExpertDeskSettings = {
  deskHeadline: string;
  hoursValue: string;
  hoursLabel: string;
  liveDeskValue: string;
  liveDeskLabel: string;
};

export type TravelExpertPageData = {
  services: TravelExpertService[];
  desk: TravelExpertDeskSettings;
};

const DEFAULT_SERVICES: TravelExpertService[] = [
  {
    id: "fallback-bespoke",
    slug: "bespoke-journeys",
    iconKey: "sparkles",
    title: "Bespoke Journeys",
    description:
      "Routes shaped around your rhythm, stays, pacing, and moments no brochure can offer.",
    image: images.experiencePrivateLuxe,
    number: "01",
    featured: true,
    wide: false,
  },
  {
    id: "fallback-visa",
    slug: "visa-documentation",
    iconKey: "file-check",
    title: "Visa & Documentation",
    description: "Paperwork, appointments, and approvals cleared before you ever pack a bag.",
    image: images.singapore,
    number: "02",
    featured: false,
    wide: false,
  },
  {
    id: "fallback-sky",
    slug: "sky-charter",
    iconKey: "plane-takeoff",
    title: "Sky & Charter",
    description: "Jets, helicopters, and aerial transfers stitched into one seamless arrival.",
    image: images.switzerland,
    number: "03",
    featured: false,
    wide: false,
  },
  {
    id: "fallback-yacht",
    slug: "yacht-sea",
    iconKey: "ship",
    title: "Yacht & Sea",
    description: "Crewed charters across the Med, Caribbean, and Indian Ocean.",
    image: images.beach,
    number: "04",
    featured: false,
    wide: false,
  },
  {
    id: "fallback-chauffeur",
    slug: "chauffeur-arrivals",
    iconKey: "car",
    title: "Chauffeur Arrivals",
    description:
      "Private transfers, meet-and-greet, and city-to-city ease from tarmac to threshold.",
    image: images.dubai,
    number: "05",
    featured: false,
    wide: false,
  },
  {
    id: "fallback-access",
    slug: "private-access",
    iconKey: "crown",
    title: "Private Access",
    description: "After-hours entries, closed-door tables, and invitations reserved for your circle.",
    image: images.bali,
    number: "06",
    featured: false,
    wide: false,
  },
  {
    id: "fallback-corporate",
    slug: "corporate-mice",
    iconKey: "briefcase",
    title: "Corporate & MICE",
    description:
      "Leadership retreats, incentive travel, and board-level programs without a single loose end.",
    image: images.experienceCorporate,
    number: "07",
    featured: false,
    wide: true,
  },
];

const DEFAULT_DESK: TravelExpertDeskSettings = {
  deskHeadline: "Always here for you",
  hoursValue: "2",
  hoursLabel: "Working hours",
  liveDeskValue: "24·7·365",
  liveDeskLabel: "Live desk",
};

function mapConciergeService(
  service: CmsConciergeService,
  mediaMap: Map<string, string>
): TravelExpertService {
  const imageFallback =
    DEFAULT_SERVICES.find((item) => item.slug === service.slug)?.image ??
    images.experiencePrivateLuxe;

  return {
    id: service.id,
    slug: service.slug,
    iconKey: service.icon_key,
    title: service.title,
    description: service.description,
    image: resolveMediaUrl(mediaMap, service.image_media_id, imageFallback),
    number: service.number_label,
    featured: service.is_featured,
    wide: service.is_wide,
  };
}

export async function getTravelExpertPageData(): Promise<TravelExpertPageData> {
  const [services, settings, mediaAssets] = await Promise.all([
    getConciergeServices(),
    getTravelExpertSettings(),
    getMediaAssets(),
  ]);

  const mediaMap = buildMediaUrlMap(mediaAssets);
  const mappedServices =
    services.length > 0
      ? services.sort((a, b) => a.sort_order - b.sort_order).map((s) => mapConciergeService(s, mediaMap))
      : DEFAULT_SERVICES;

  const desk: TravelExpertDeskSettings = settings
    ? {
        deskHeadline: settings.desk_headline,
        hoursValue: settings.hours_value,
        hoursLabel: settings.hours_label,
        liveDeskValue: settings.live_desk_value,
        liveDeskLabel: settings.live_desk_label,
      }
    : DEFAULT_DESK;

  return { services: mappedServices, desk };
}
