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

export const curatedDestinationCount = 130;

/** "The TRAGUIN Standard" row — icon + promise copy */
export const traguinStandardHighlights = [
  { iconKey: "clock", label: "48-Hour Custom Proposal" },
  { iconKey: "user", label: "One Expert. One Point of Contact." },
  { iconKey: "globe", label: "India & Global Holidays" },
] as const;

export const trustHighlights = [
  { value: "Bespoke", label: "Every route, yours alone" },
  { value: "100+", label: "More than 100 travelers monthly" },
  { value: "130+", label: "Curated destinations" },
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
    primaryAction: { label: "Plan My Journey", href: "/plan-my-journey" },
    secondaryAction: { label: "Speak With Expert", href: "/contact#consultation" },
  },
  travelExpert: {
    eyebrow: "Expert Services",
    badge: "Always On Call",
    title: "Travel Expert",
    description:
      "Bespoke itineraries, visa support, private aviation, and on-ground coordination from one dedicated team, from first conversation to homecoming.",
    image: images.travelExpertHero,
    imageAlt: "Travel expert planning a bespoke luxury journey",
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
  gallery: {
    eyebrow: "Travel Gallery",
    badge: "Photos & Films",
    title: "Gallery",
    description:
      "A visual wall of client moments, destination photography, and short films from journeys designed by TRAGUIN.",
    image: images.experiencePrivateLuxe,
    imageAlt: "Luxury travel moment captured on a curated journey",
    primaryAction: primaryCta,
    secondaryAction: { label: "View Stories", href: "/client-stories" },
  },
  about: {
    eyebrow: "Luxury · Corporate · Experiential",
    badge: "Headquartered in India",
    title: "About TRAGUIN",
    description:
      "A luxury-led, corporate-ready travel brand headquartered in India—delivering domestic and international journeys with global service standards, deep regional expertise, and experiences that are seamless, meaningful, and impeccably managed.",
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

export const defaultHomepagePromo = {
  eyebrow: "Bespoke",
  studioLabel: "Ahmedabad luxury studio",
  title: "Journeys shaped around you,",
  titleAccent: "not a template.",
  description:
    "We listen first, then design: handpicked stays, unhurried routes, and the small details that turn a good trip into the one you talk about for years.",
  assurancesHeading: "Connect | Personalize | Travel",
  assurances: [
    { iconKey: "clock", title: "Connect", label: "48-Hour Custom Proposal" },
    { iconKey: "calendar-check", title: "Personalize", label: "One Expert. One Point of Contact." },
    { iconKey: "shield-check", title: "Travel", label: "India & Global Holidays" },
  ],
  consultation: {
    badge: "Complimentary",
    title: "Start with a planning call",
    description:
      "Twenty minutes to understand your dates, pace, and priorities. We follow up with a tailored first itinerary, with no obligation.",
  },
  consultationSteps: [
    "Share your dates & travel style",
    "120 min first draft",
    "Refine until it feels right",
  ],
} as const;

export const defaultSpecializations = [
  {
    id: "bespoke-leisure",
    title: "Bespoke Leisure",
    description:
      "Custom holidays across India and abroad with handpicked stays, unhurried routes, and the details that match how you travel.",
    iconKey: "compass",
  },
  {
    id: "honeymoons-celebrations",
    title: "Honeymoons & Celebrations",
    description:
      "Romantic escapes and milestone journeys with private transfers, curated dining, and moments worth remembering.",
    iconKey: "sparkles",
  },
  {
    id: "family-group-travel",
    title: "Family & Group Travel",
    description:
      "Multi-generational trips planned with comfort, safety, and activities that work for every age in your group.",
    iconKey: "users",
  },
  {
    id: "corporate-mice",
    title: "Corporate & MICE",
    description:
      "Leadership retreats, incentive travel, and offsites coordinated end to end, including venues, logistics, and on-ground support.",
    iconKey: "briefcase",
  },
  {
    id: "visa-documentation",
    title: "Visa & Documentation",
    description:
      "Visa applications, insurance guidance, and travel paperwork handled before you pack, so there are fewer surprises at departure.",
    iconKey: "file-check",
  },
] as const;

export const defaultRegionPanels = [
  {
    id: "domestic",
    label: "India",
    title: "India & Beyond",
    description:
      "Heritage circuits, Himalayan escapes, and coastal retreats across the subcontinent. Each journey is designed from our Ahmedabad studio with white-glove attention to detail.",
    stat: "22+ States",
    highlights: ["Rajasthan", "Kerala", "Himalayas", "Goa"],
    href: "/destinations?region=domestic",
    mood: "warm" as const,
    image: images.homeRegionDomestic,
    imageClass:
      "object-cover object-[center_40%] saturate-[1.08] group-hover:saturate-[1.18]",
  },
  {
    id: "international",
    label: "International",
    title: "Worldwide Journeys",
    description:
      "Thailand, Bali, Singapore, Australia, Canada, and beyond. Island escapes, alpine lodges, and iconic cities planned with the same precision we bring to India.",
    stat: "40+ Countries",
    highlights: ["Thailand", "Bali", "Singapore", "Australia", "Canada"],
    href: "/destinations?region=international",
    mood: "cool" as const,
    image: images.homeRegionInternational,
    imageClass:
      "object-cover object-center saturate-[1.06] group-hover:saturate-[1.16]",
  },
] as const;

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
