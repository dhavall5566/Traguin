"use client";

import { Suspense, lazy } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { DomesticInternationalSplit } from "@/components/home/DomesticInternationalSplit";

const DestinationShowcase = lazy(() =>
  import("@/components/home/DestinationShowcase").then((m) => ({ default: m.DestinationShowcase }))
);
const FeaturedExperiences = lazy(() =>
  import("@/components/home/FeaturedExperiences").then((m) => ({ default: m.FeaturedExperiences }))
);
const WhyTraguin = lazy(() =>
  import("@/components/home/WhyTraguin").then((m) => ({ default: m.WhyTraguin }))
);
const JourneyProcess = lazy(() =>
  import("@/components/home/JourneyProcess").then((m) => ({ default: m.JourneyProcess }))
);
const CustomerStories = lazy(() =>
  import("@/components/home/CustomerStories").then((m) => ({ default: m.CustomerStories }))
);
const AITravelPlanner = lazy(() =>
  import("@/components/home/AITravelPlanner").then((m) => ({ default: m.AITravelPlanner }))
);
const FinalCTA = lazy(() =>
  import("@/components/home/FinalCTA").then((m) => ({ default: m.FinalCTA }))
);

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
      <HeroSection />
      <DomesticInternationalSplit />

      <Suspense fallback={<SectionFallback minHeight="100vh" />}>
        <DestinationShowcase />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="100vh" />}>
        <FeaturedExperiences />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <WhyTraguin />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="60vh" />}>
        <JourneyProcess />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CustomerStories />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="70vh" />}>
        <AITravelPlanner />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="100vh" />}>
        <FinalCTA />
      </Suspense>
    </main>
  );
}
