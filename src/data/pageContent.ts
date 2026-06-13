import { images } from "@/lib/images";
import { primaryCta, secondaryCta } from "@/data/site";
import { contactInfo } from "@/data/contact";

export type PageHeroContent = {
  eyebrow: string;
  badge?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

export const trustHighlights = [
  { value: "Since 2024", label: "Luxury travel studio" },
  { value: "15+", label: "Curated destinations" },
  { value: "28+", label: "Partner properties" },
  { value: "48 hrs", label: "First itinerary draft" },
] as const;

export const pageHeroes = {
  destinations: {
    eyebrow: "Worldwide Collection",
    badge: "Curated Journeys",
    title: "Destinations",
    description:
      "Discover handpicked destinations with immersive itineraries crafted for every journey.",
    image: images.switzerland,
    imageAlt: "Alpine peaks above a turquoise lake",
    primaryAction: primaryCta,
    secondaryAction: secondaryCta,
  },
  luxuryStays: {
    eyebrow: "Accommodations",
    badge: "Preferred Partners",
    title: "Luxury Stays",
    description:
      "Palace hotels, cliffside resorts, and private villas. Each property is vetted for service, setting, and the quiet excellence discerning travelers expect.",
    image: images.bali,
    imageAlt: "Luxury resort overlooking tropical landscape",
    primaryAction: { label: "Plan My Journey", href: "/#plan-my-journey" },
    secondaryAction: { label: "Speak With Expert", href: "/contact#consultation" },
  },
  travelExpert: {
    eyebrow: "Expert Services",
    badge: "Always On Call",
    title: "Travel Expert",
    description:
      "Bespoke itineraries, visa support, private aviation, and on-ground coordination from one dedicated team, from first conversation to homecoming.",
    image: images.experiencePrivateLuxe,
    imageAlt: "Private luxury travel experience",
    primaryAction: { label: "Request Consultation", href: "/travel-expert#consultation" },
    secondaryAction: secondaryCta,
  },
  clientStories: {
    eyebrow: "Testimonials",
    badge: "Real Journeys",
    title: "Client Stories",
    description:
      "Families, couples, and executives who trusted TRAGUIN with their most meaningful journeys, in their own words.",
    image: images.kerala,
    imageAlt: "Scenic Kerala backwaters",
    primaryAction: primaryCta,
    secondaryAction: { label: "View Destinations", href: "/destinations" },
  },
  about: {
    eyebrow: "Our Studio",
    badge: "Ahmedabad · Global Reach",
    title: "About TRAGUIN",
    description:
      "A luxury travel practice devoted to extraordinary journeys that are personal, precise, and never pulled from a brochure.",
    image: images.hero,
    imageAlt: "Travel landscape at golden hour",
    primaryAction: primaryCta,
    secondaryAction: secondaryCta,
  },
  contact: {
    eyebrow: "Get in Touch",
    badge: "Complimentary Consultation",
    title: "Contact Us",
    description:
      "Share your vision with a senior travel designer. We respond within two working hours with thoughtful next steps, never a generic quote.",
    image: images.plannerCta,
    imageAlt: "Mountain lake at sunrise",
    primaryAction: { label: "WhatsApp Expert", href: contactInfo.whatsappHref },
    secondaryAction: primaryCta,
  },
  careers: {
    eyebrow: "Join the Team",
    badge: "Now Hiring",
    title: "Careers",
    description:
      "Help shape the future of bespoke travel with craftsmanship, empathy, and impeccable service in every itinerary we design.",
    image: images.vietnam,
    imageAlt: "Scenic travel destination",
    primaryAction: { label: "View Open Roles", href: "#open-roles" },
    secondaryAction: { label: "Contact HR", href: "/contact" },
  },
} satisfies Record<string, PageHeroContent>;

export type RegionHeroFilter = "all" | "domestic" | "international";

export function getDestinationsHeroContent(region: RegionHeroFilter): PageHeroContent {
  const base = pageHeroes.destinations;

  if (region === "domestic") {
    return {
      ...base,
      eyebrow: "Domestic Collection",
      badge: "India Escapes",
      description:
        "Explore curated destinations across India, each featuring detailed day-by-day itineraries where available.",
      image: images.homeRegionDomestic,
      imageAlt: "Amber fort at golden hour in Rajasthan",
    };
  }

  if (region === "international") {
    return {
      ...base,
      eyebrow: "International Collection",
      badge: "Global Journeys",
      description:
        "Discover handpicked destinations worldwide with immersive itineraries crafted for every journey.",
      image: images.homeRegionInternational,
      imageAlt: "Tropical luxury destination abroad",
    };
  }

  return base;
}

export function getLuxuryStaysHeroContent(region: RegionHeroFilter): PageHeroContent {
  const base = pageHeroes.luxuryStays;

  if (region === "domestic") {
    return {
      ...base,
      eyebrow: "Domestic Collection",
      badge: "India Stays",
      description:
        "Palace hotels, houseboats, and hillside retreats across India. Each property is vetted for service, setting, and quiet excellence.",
      image: images.kerala,
      imageAlt: "Luxury stay in India",
    };
  }

  if (region === "international") {
    return {
      ...base,
      eyebrow: "International Collection",
      badge: "Global Stays",
      description:
        "Cliffside resorts, overwater villas, and city landmarks abroad. Partner properties chosen for impeccable hospitality and setting.",
      image: images.bali,
      imageAlt: "International luxury resort",
    };
  }

  return base;
}

export const pageCta = {
  default: {
    eyebrow: "Begin Your Journey",
    title: "Every great trip starts with a conversation",
    description:
      "Tell us where you wish to go and how you wish to feel. Our designers craft a bespoke itinerary with transparent pricing and a complimentary consultation.",
    primary: primaryCta,
    secondary: secondaryCta,
  },
} as const;
