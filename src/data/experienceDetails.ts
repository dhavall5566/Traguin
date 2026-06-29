import type { LucideIcon } from "lucide-react";
import { Map, Plus, ShieldCheck, Zap, Users, Building2, GraduationCap, Route } from "lucide-react";
import { images } from "@/lib/images";

export type ExperienceOffer = {
  icon: LucideIcon;
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

export const experienceDetails: ExperienceDetail[] = [
  {
    slug: "group-tours",
    eyebrow: "Group travel",
    headline: "One group, every detail in rhythm",
    intro:
      "Reunions, celebrations, and shared adventures, we align guides, stays, and timing so your whole circle travels without friction.",
    heroImage: images.experienceGroupTours,
    offers: [
      {
        icon: Users,
        title: "Dedicated host",
        description: "A single travel designer owns your trip from the first call through homecoming.",
      },
      {
        icon: Route,
        title: "Aligned logistics",
        description: "Transfers, reservations, and schedules kept in step for parties of any size.",
      },
      {
        icon: ShieldCheck,
        title: "Curated moments",
        description: "Private tours and access shaped around what your group actually enjoys.",
      },
      {
        icon: Zap,
        title: "On-trip support",
        description: "Changes handled in real time while you stay focused on the people you're with.",
      },
    ],
    stats: [
      { value: "50+", label: "Groups each year" },
      { value: "2–120", label: "Travelers per trip" },
      { value: "2 hrs", label: "First proposal" },
    ],
    quote:
      "Every reunion deserves the same rhythm, arrivals aligned, dinners reserved, and no one chasing logistics.",
    process: [
      { step: "01", title: "Discovery", detail: "Dates, headcount, and the moments your group cares about most." },
      { step: "02", title: "Blueprint", detail: "A shared itinerary with stays, transfers, and reservations in sync." },
      { step: "03", title: "Confirmation", detail: "Final approvals, payments, and pre-trip brief for every guest." },
      { step: "04", title: "On ground", detail: "Your host coordinates live, changes absorbed before anyone notices." },
    ],
    ctaTitle: "Shape your group trip",
    ctaDescription: "Share your dates and headcount, we respond within 2 working hours.",
  },
  {
    slug: "private-luxe",
    eyebrow: "Private travel",
    headline: "Built around you, not a brochure",
    intro:
      "Custom itineraries with discreet support, rare access, and the freedom to reshape your day whenever the mood shifts.",
    heroImage: images.experiencePrivateLuxe,
    offers: [
      {
        icon: Plus,
        title: "Personal concierge",
        description: "One manager on call for reservations, changes, and anything unexpected.",
      },
      {
        icon: Map,
        title: "Premium transfers",
        description: "Chauffeurs, charters, and yacht connections arranged as one seamless chain.",
      },
      {
        icon: ShieldCheck,
        title: "Private access",
        description: "After-hours entries and closed-door experiences reserved only for your party.",
      },
      {
        icon: Zap,
        title: "Instant replans",
        description: "Swap the schedule on a whim, our team absorbs the logistics behind the scenes.",
      },
    ],
    stats: [
      { value: "100%", label: "Bespoke routes" },
      { value: "40+", label: "Destinations" },
      { value: "24/7", label: "Concierge line" },
    ],
    quote:
      "Luxury is the freedom to change your mind, we replan the day while you stay in the moment.",
    process: [
      { step: "01", title: "Listen", detail: "How you travel, what you avoid, and the experiences you chase." },
      { step: "02", title: "Design", detail: "A private route with transfers, access, and downtime built in." },
      { step: "03", title: "Refine", detail: "Adjust pacing, properties, and reservations until it feels right." },
      { step: "04", title: "Depart", detail: "Your concierge stays on call from wheels-up through homecoming." },
    ],
    ctaTitle: "Design your private escape",
    ctaDescription: "Tell us how you like to travel, we'll draft a route that fits your pace.",
  },
  {
    slug: "corporate-events",
    eyebrow: "Corporate programs",
    headline: "Retreats and incentives, run with precision",
    intro:
      "Board offsites, leadership gatherings, and reward travel delivered with premium venues, sharp logistics, and calm on-ground coordination.",
    heroImage: images.experienceCorporate,
    offers: [
      {
        icon: Building2,
        title: "Program design",
        description: "Venue sourcing, agenda flow, and hospitality tuned to executive expectations.",
      },
      {
        icon: Map,
        title: "Unified logistics",
        description: "Flights, transfers, rooms, and events managed as a single operating plan.",
      },
      {
        icon: ShieldCheck,
        title: "Brand-ready settings",
        description: "Activations and environments aligned with how your company presents itself.",
      },
      {
        icon: Zap,
        title: "Agile operations",
        description: "Last-minute pivots absorbed by our team without disrupting the room.",
      },
    ],
    stats: [
      { value: "200+", label: "Programs delivered" },
      { value: "12–500", label: "Attendees per event" },
      { value: "End-to-end", label: "Single ops team" },
    ],
    quote:
      "Boardrooms and ballrooms should feel effortless, we run the logistics so leadership stays present.",
    process: [
      { step: "01", title: "Brief", detail: "Objectives, audience profile, budget guardrails, and success metrics." },
      { step: "02", title: "Architecture", detail: "Venue shortlist, agenda flow, hospitality, and travel connections." },
      { step: "03", title: "Vetting", detail: "Site visits, vendor contracts, and brand-ready environment checks." },
      { step: "04", title: "Delivery", detail: "On-ground coordinators manage pivots without disrupting the room." },
    ],
    ctaTitle: "Plan your next corporate program",
    ctaDescription: "Outline your objectives and team size, we'll build a proposal around them.",
  },
  {
    slug: "school-trips",
    eyebrow: "Student travel",
    headline: "Learning journeys with safety first",
    intro:
      "Educational itineraries for student groups with vetted partners, clear guardian communication, and coordinators who stay with the cohort throughout.",
    heroImage: images.experienceSchool,
    offers: [
      {
        icon: GraduationCap,
        title: "Learning focus",
        description: "Routes built around curriculum goals, cultural exposure, and age-appropriate pacing.",
      },
      {
        icon: ShieldCheck,
        title: "Safety protocols",
        description: "Audited partners, emergency plans, and guardian updates at every stage.",
      },
      {
        icon: Users,
        title: "Trip coordinators",
        description: "On-ground experts managing the group from departure through return.",
      },
      {
        icon: Zap,
        title: "Live adjustments",
        description: "Weather, timing, and group needs handled without slowing the program down.",
      },
    ],
    stats: [
      { value: "100+", label: "Institutions served" },
      { value: "Grades 6–12", label: "Age range" },
      { value: "Live", label: "Guardian updates" },
    ],
    quote:
      "Learning should feel adventurous and controlled, every route is vetted, every guardian kept in the loop.",
    process: [
      { step: "01", title: "Consult", detail: "Curriculum goals, student count, chaperone needs, and safety requirements." },
      { step: "02", title: "Draft", detail: "Age-appropriate itinerary with audited partners and emergency protocols." },
      { step: "03", title: "Review", detail: "Faculty walkthrough, guardian communication plan, and final approvals." },
      { step: "04", title: "Guide", detail: "Coordinators stay with the cohort from departure through safe return." },
    ],
    ctaTitle: "Start your school expedition",
    ctaDescription: "Share your institution, dates, and student count, we'll take it from there.",
  },
];

export function getExperienceDetail(slug: string): ExperienceDetail | undefined {
  return experienceDetails.find((item) => item.slug === slug);
}

export function getAllExperienceSlugs(): string[] {
  return experienceDetails.map((item) => item.slug);
}
