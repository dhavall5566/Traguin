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
  { ssr: false, loading: () => <div className="min-h-px" aria-hidden /> },
);
const JourneyProcess = dynamic(
  () => import("@/components/home/JourneyProcess").then((mod) => mod.JourneyProcess),
  { ssr: false, loading: () => <div className="min-h-px" aria-hidden /> },
);
const Specializations = dynamic(
  () => import("@/components/home/Specializations").then((mod) => mod.Specializations),
  { ssr: false, loading: () => <div className="min-h-px" aria-hidden /> },
);
const WhyTraguin = dynamic(
  () => import("@/components/home/WhyTraguin").then((mod) => mod.WhyTraguin),
  { ssr: false, loading: () => <div className="min-h-px" aria-hidden /> },
);
const TravelPlannerForm = dynamic(
  () => import("@/components/home/TravelPlannerForm").then((mod) => mod.TravelPlannerForm),
  { ssr: false, loading: () => <div className="min-h-px" aria-hidden /> },
);
const CustomerStories = dynamic(
  () => import("@/components/home/CustomerStories").then((mod) => mod.CustomerStories),
  { ssr: false, loading: () => <div className="min-h-px" aria-hidden /> },
);
const PlanMyJourneyCTA = dynamic(
  () => import("@/components/home/PlanMyJourneyCTA").then((mod) => mod.PlanMyJourneyCTA),
  { ssr: false, loading: () => <div className="min-h-px" aria-hidden /> },
);

export function HomePageContent({ data }: { data: HomepageData }) {
  return (
    <main className="home-page home-3d-stage">
      <SlidingPackages packages={data.featuredPackages} />
      <LuxuryStatsBar />
      <LazyHomeSection rootMargin="160px 0px">
        <DestinationMarquee names={data.marqueeNames} />
      </LazyHomeSection>
      <LazyHomeSection rootMargin="200px 0px">
        <DomesticInternationalSplit panels={data.regionPanels} />
      </LazyHomeSection>
      <LazyHomeSection rootMargin="200px 0px">
        <FeaturedDestinations destinations={data.featuredDestinations} />
      </LazyHomeSection>
      <LazyHomeSection>
        <HomePromoBanner promo={data.promo} />
      </LazyHomeSection>
      <LazyHomeSection>
        <ExperienceShowcase items={data.experiences} />
      </LazyHomeSection>
      {data.journeySteps.length > 0 ? (
        <LazyHomeSection>
          <JourneyProcess steps={data.journeySteps} />
        </LazyHomeSection>
      ) : null}
      <LazyHomeSection>
        <Specializations items={data.specializations} />
      </LazyHomeSection>
      <LazyHomeSection>
        <WhyTraguin items={data.valueProps} />
      </LazyHomeSection>
      <LazyHomeSection>
        <TravelPlannerForm />
      </LazyHomeSection>
      <LazyHomeSection>
        <CustomerStories testimonials={data.testimonials} />
      </LazyHomeSection>
      <LazyHomeSection>
        <PlanMyJourneyCTA />
      </LazyHomeSection>
    </main>
  );
}
