"use client";

import { Suspense, lazy } from "react";
import { HeroSection } from "@/components/home/HeroSection";

const FeaturedDestinations = lazy(() =>
  import("@/components/home/FeaturedDestinations").then((m) => ({ default: m.FeaturedDestinations }))
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

      <Suspense fallback={<SectionFallback minHeight="80vh" />}>
        <FeaturedDestinations />
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

      <Suspense fallback={<SectionFallback minHeight="80vh" />}>
        <FinalCTA />
      </Suspense>
    </main>
  );
}
