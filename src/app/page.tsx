"use client";

import { Suspense, lazy } from "react";
import { SlidingPackages } from "@/components/home/SlidingPackages";
<<<<<<< HEAD
=======
import { LuxuryStatsBar } from "@/components/home/LuxuryStatsBar";
import { DestinationMarquee } from "@/components/home/DestinationMarquee";
>>>>>>> dhaval
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
<<<<<<< HEAD
import { PlanMyJourneyCTA } from "@/components/home/PlanMyJourneyCTA";
=======
const JourneyProcess = lazy(() =>
  import("@/components/home/JourneyProcess").then((m) => ({ default: m.JourneyProcess }))
);
const Specializations = lazy(() =>
  import("@/components/home/Specializations").then((m) => ({ default: m.Specializations }))
);
import { PlanMyJourneyCTA } from "@/components/home/PlanMyJourneyCTA";
import { HomePromoBanner } from "@/components/home/HomePromoBanner";
>>>>>>> dhaval

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
<<<<<<< HEAD
    <main>
      <SlidingPackages />
=======
    <main className="home-page home-3d-stage">
      <SlidingPackages />
      <LuxuryStatsBar />
      <DestinationMarquee />
>>>>>>> dhaval

      <Suspense fallback={<SectionFallback minHeight="50vh" />}>
        <DomesticInternationalSplit />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="80vh" />}>
        <FeaturedDestinations />
      </Suspense>

<<<<<<< HEAD
=======
      <HomePromoBanner />

>>>>>>> dhaval
      <Suspense fallback={<SectionFallback minHeight="70vh" />}>
        <ExperienceShowcase />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
<<<<<<< HEAD
=======
        <JourneyProcess />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <Specializations />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
>>>>>>> dhaval
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
