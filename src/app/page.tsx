"use client";

import { Suspense, lazy } from "react";
import { SlidingPackages } from "@/components/home/SlidingPackages";
import { DomesticInternationalSplit } from "@/components/home/DomesticInternationalSplit";

const FeaturedDestinations = lazy(() =>
  import("@/components/home/FeaturedDestinations").then((m) => ({ default: m.FeaturedDestinations }))
);
const ExperienceShowcase = lazy(() =>
  import("@/components/home/ExperienceShowcase").then((m) => ({ default: m.ExperienceShowcase }))
);
const WhyTraguin = lazy(() =>
  import("@/components/home/WhyTraguin").then((m) => ({ default: m.WhyTraguin }))
);
const TravelPlannerForm = lazy(() =>
  import("@/components/home/TravelPlannerForm").then((m) => ({ default: m.TravelPlannerForm }))
);
const CustomerStories = lazy(() =>
  import("@/components/home/CustomerStories").then((m) => ({ default: m.CustomerStories }))
);
import { PlanMyJourneyCTA } from "@/components/home/PlanMyJourneyCTA";

function SectionFallback({ minHeight = "40vh" }: { minHeight?: string }) {
  return (
    <div
      className="w-full animate-pulse bg-surface"
      style={{ minHeight }}
      aria-hidden
    />
  );
}

export default function HomePage() {
  return (
    <main>
      <SlidingPackages />

      <Suspense fallback={<SectionFallback minHeight="50vh" />}>
        <DomesticInternationalSplit />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="80vh" />}>
        <FeaturedDestinations />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="70vh" />}>
        <ExperienceShowcase />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <WhyTraguin />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="70vh" />}>
        <TravelPlannerForm />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CustomerStories />
      </Suspense>

      <PlanMyJourneyCTA />
    </main>
  );
}
