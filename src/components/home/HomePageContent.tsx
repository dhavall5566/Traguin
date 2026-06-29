"use client";

import dynamic from "next/dynamic";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { SlidingPackages } from "@/components/home/SlidingPackages";
import { LuxuryStatsBar } from "@/components/home/LuxuryStatsBar";
import { DestinationMarquee } from "@/components/home/DestinationMarquee";
import { DomesticInternationalSplit } from "@/components/home/DomesticInternationalSplit";
import { HomePromoBanner } from "@/components/home/HomePromoBanner";
import { LazyHomeSection } from "@/components/home/LazyHomeSection";
import type { HomepageData } from "@/lib/api/homepage";

const ExperienceShowcase = dynamic(
  () =>
    import("@/components/home/ExperienceShowcase").then((mod) => mod.ExperienceShowcase),
  { ssr: false, loading: () => <div className="min-h-[28rem]" aria-hidden /> },
);
const JourneyProcess = dynamic(
  () => import("@/components/home/JourneyProcess").then((mod) => mod.JourneyProcess),
  { ssr: false, loading: () => <div className="min-h-[24rem]" aria-hidden /> },
);
const Specializations = dynamic(
  () => import("@/components/home/Specializations").then((mod) => mod.Specializations),
  { ssr: false, loading: () => <div className="min-h-[20rem]" aria-hidden /> },
);
const WhyTraguin = dynamic(
  () => import("@/components/home/WhyTraguin").then((mod) => mod.WhyTraguin),
  { ssr: false, loading: () => <div className="min-h-[20rem]" aria-hidden /> },
);
const TravelPlannerForm = dynamic(
  () => import("@/components/home/TravelPlannerForm").then((mod) => mod.TravelPlannerForm),
  { ssr: false, loading: () => <div className="min-h-[32rem]" aria-hidden /> },
);
const CustomerStories = dynamic(
  () => import("@/components/home/CustomerStories").then((mod) => mod.CustomerStories),
  { ssr: false, loading: () => <div className="min-h-[24rem]" aria-hidden /> },
);
const PlanMyJourneyCTA = dynamic(
  () => import("@/components/home/PlanMyJourneyCTA").then((mod) => mod.PlanMyJourneyCTA),
  { ssr: false, loading: () => <div className="min-h-[20rem]" aria-hidden /> },
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
      <LazyHomeSection minHeight="28rem">
        <ExperienceShowcase items={data.experiences} />
      </LazyHomeSection>
      <LazyHomeSection minHeight="24rem">
        <JourneyProcess steps={data.journeySteps} />
      </LazyHomeSection>
      <LazyHomeSection minHeight="20rem">
        <Specializations items={data.specializations} />
      </LazyHomeSection>
      <LazyHomeSection minHeight="20rem">
        <WhyTraguin items={data.valueProps} />
      </LazyHomeSection>
      <LazyHomeSection minHeight="32rem">
        <TravelPlannerForm />
      </LazyHomeSection>
      <LazyHomeSection minHeight="24rem">
        <CustomerStories testimonials={data.testimonials} />
      </LazyHomeSection>
      <LazyHomeSection minHeight="20rem">
        <PlanMyJourneyCTA />
      </LazyHomeSection>
    </main>
  );
}
