import { filterLuxuryStaysNavLinks } from "@/lib/site-features";

export const primaryCta = {
  label: "Plan My Journey",
  href: "/plan-my-journey",
} as const;

export const secondaryCta = {
  label: "Speak With Travel Expert",
  href: "/contact#consultation",
} as const;

export const itineraryPrimaryCta = {
  label: "Get Custom Quote",
  /** Overridden per-destination via getItineraryInquiryHref(); fallback for generic links */
  href: "/destinations/bali#inquiry",
} as const;

export const itinerarySecondaryCta = {
  label: "Speak With Travel Expert",
  href: "/contact#consultation",
} as const;

const allNavLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/luxury-stays", label: "Luxury Stays" },
  { href: "/travel-expert", label: "Travel Expert" },
  { href: "/client-stories", label: "Client Stories" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const navLinks = filterLuxuryStaysNavLinks(allNavLinks);

const allFooterExploreLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/luxury-stays", label: "Luxury Stays" },
  { href: "/travel-expert", label: "Travel Expert" },
  { href: "/gallery", label: "Gallery" },
] as const;

export const footerExploreLinks = filterLuxuryStaysNavLinks(allFooterExploreLinks);

export const footerCompanyLinks = [
  { href: "/about", label: "About" },
  { href: "/client-stories", label: "Client Stories" },
  { href: "/gallery", label: "Gallery" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Client Portal" },
] as const;
