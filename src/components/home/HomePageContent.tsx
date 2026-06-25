"use client";

import dynamic from "next/dynamic";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { SlidingPackages } from "@/components/home/SlidingPackages";
import { LuxuryStatsBar } from "@/components/home/LuxuryStatsBar";
import { DestinationMarquee } from "@/components/home/DestinationMarquee";
import { DomesticInternationalSplit } from "@/components/home/DomesticInternationalSplit";
import { HomePromoBanner } from "@/components/home/HomePromoBanner";
import type { HomepageData } from "@/lib/api/homepage";

const ExperienceShowcase = dynamic(
  () =>
    import("@/components/home/ExperienceShowcase").then((mod) => mod.ExperienceShowcase),
  { ssr: true }
);
const JourneyProcess = dynamic(
  () => import("@/components/home/JourneyProcess").then((mod) => mod.JourneyProcess),
  { ssr: true }
);
const Specializations = dynamic(
  () => import("@/components/home/Specializations").then((mod) => mod.Specializations),
  { ssr: true }
);
const WhyTraguin = dynamic(
  () => import("@/components/home/WhyTraguin").then((mod) => mod.WhyTraguin),
  { ssr: true }
);
const TravelPlannerForm = dynamic(
  () => import("@/components/home/TravelPlannerForm").then((mod) => mod.TravelPlannerForm),
  { ssr: true }
);
const CustomerStories = dynamic(
  () => import("@/components/home/CustomerStories").then((mod) => mod.CustomerStories),
  { ssr: true }
);
const PlanMyJourneyCTA = dynamic(
  () => import("@/components/home/PlanMyJourneyCTA").then((mod) => mod.PlanMyJourneyCTA),
  { ssr: true }
);

export function HomePageContent({ data }: { data: HomepageData }) {
  return (
    <main className="home-page home-3d-stage">
      <SlidingPackages packages={data.featuredPackages} />
      <LuxuryStatsBar stats={data.stats} />
      <DestinationMarquee names={data.marqueeNames} />
      <DomesticInternationalSplit panels={data.regionPanels} />
      <FeaturedDestinations destinations={data.featuredDestinations} />
      <HomePromoBanner promo={data.promo} />
      <ExperienceShowcase items={data.experiences} />
      <JourneyProcess steps={data.journeySteps} />
      <Specializations items={data.specializations} />
      <WhyTraguin items={data.valueProps} />
      <TravelPlannerForm />
      <CustomerStories testimonials={data.testimonials} />
      <PlanMyJourneyCTA />
    </main>
  );
}
