export const primaryCta = {
  label: "Plan My Journey",
  href: "/#planner",
} as const;

export const secondaryCta = {
  label: "Speak With Concierge",
  href: "/contact",
} as const;

export const itineraryPrimaryCta = {
  label: "Get Custom Quote",
  /** Overridden per-destination via getItineraryInquiryHref(); fallback for generic links */
  href: "/destinations/bali#inquiry",
} as const;

export const itinerarySecondaryCta = {
  label: "Speak With Travel Expert",
  href: "/contact",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/luxury-stays", label: "Luxury Stays" },
  { href: "/concierge", label: "Travel Concierge" },
  { href: "/client-stories", label: "Client Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerExploreLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/luxury-stays", label: "Luxury Stays" },
  { href: "/concierge", label: "Travel Concierge" },
] as const;

export const footerCompanyLinks = [
  { href: "/about", label: "About" },
  { href: "/client-stories", label: "Client Stories" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Client Portal" },
] as const;
