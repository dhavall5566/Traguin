import { navLinks } from "@/data/site";
import type { AdminEntityGroup } from "@/lib/admin/types";

/** CMS sidebar sections ordered to match public site navigation tabs. */
export const CMS_NAV_SECTIONS: AdminEntityGroup[] = [
  { id: "home", label: "Home" },
  ...navLinks
    .filter((link) => link.href !== "/")
    .map((link) => ({
      id: link.href.slice(1).replace(/\//g, "-") || link.label.toLowerCase(),
      label: link.label,
    })),
  { id: "careers", label: "Careers" },
  { id: "legal", label: "Legal" },
  { id: "media", label: "Media Library" },
];

/** First CMS screen after login — matches the primary homepage content workflow. */
export const CMS_DEFAULT_LANDING_PATH = "/admin/cms/homepage-hero-slider";

const ENTITY_NAV_SECTION: Record<string, string> = {
  // Home
  "homepage-region-panels": "home",
  experiences: "home",

  // Destinations
  destinations: "destinations",
  "destination-categories": "destinations",
  packages: "destinations",
  itineraries: "destinations",

  // Luxury Stays
  hotels: "luxury-stays",

  // Travel Expert
  "concierge-services": "travel-expert",
  "travel-expert-settings": "travel-expert",

  // Client Stories
  "client-stories": "client-stories",

  // Gallery
  "gallery-categories": "gallery",
  "gallery-items": "gallery",

  // About
  "about-page-header": "about",
  "about-story-sections": "about",
  faqs: "about",

  // Careers
  "job-openings": "careers",
  "careers-page-extras": "careers",

  // Legal
  "legal-pages": "legal",

  // Media Library
  media: "media",
};

const CUSTOM_LINK_NAV_SECTION: Record<string, string> = {
  "homepage-hero-slider": "home",
};

export function getEntityNavSectionId(entityKey: string): string {
  return ENTITY_NAV_SECTION[entityKey] ?? "site-wide";
}

export function getCustomLinkNavSectionId(linkKey: string): string {
  return CUSTOM_LINK_NAV_SECTION[linkKey] ?? "site-wide";
}

export function getNavSectionLabel(sectionId: string): string {
  return CMS_NAV_SECTIONS.find((section) => section.id === sectionId)?.label ?? "CMS";
}
