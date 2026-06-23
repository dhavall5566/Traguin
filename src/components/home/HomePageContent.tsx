"use client";

import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { ExperienceShowcase } from "@/components/home/ExperienceShowcase";
import { WhyTraguin } from "@/components/home/WhyTraguin";
import { TravelPlannerForm } from "@/components/home/TravelPlannerForm";
import { CustomerStories } from "@/components/home/CustomerStories";
import { JourneyProcess } from "@/components/home/JourneyProcess";
import { Specializations } from "@/components/home/Specializations";
import { SlidingPackages } from "@/components/home/SlidingPackages";
import { LuxuryStatsBar } from "@/components/home/LuxuryStatsBar";
import { DestinationMarquee } from "@/components/home/DestinationMarquee";
import { DomesticInternationalSplit } from "@/components/home/DomesticInternationalSplit";
import { HomePromoBanner } from "@/components/home/HomePromoBanner";
import { PlanMyJourneyCTA } from "@/components/home/PlanMyJourneyCTA";
import type { HomepageData } from "@/lib/api/homepage";

export function HomePageContent({ data }: { data: HomepageData }) {
  return (
    <main className="home-page home-3d-stage">
      <SlidingPackages packages={data.featuredPackages} />
      <LuxuryStatsBar stats={data.stats} />
      <DestinationMarquee names={data.marqueeNames} />
      <DomesticInternationalSplit panels={data.regionPanels} />
      <FeaturedDestinations destinations={data.featuredDestinations} />
      <HomePromoBanner promo={data.promo} />
      <ExperienceShowcase
        items={data.experiences}
        experienceDetailsBySlug={data.experienceDetailsBySlug}
      />
      <JourneyProcess steps={data.journeySteps} />
      <Specializations items={data.specializations} />
      <WhyTraguin items={data.valueProps} />
      <TravelPlannerForm />
      <CustomerStories testimonials={data.testimonials} />
      <PlanMyJourneyCTA />
    </main>
  );
}
