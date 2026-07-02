import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { PlanMyJourneyLandingForm } from "@/components/plan-my-journey/PlanMyJourneyLandingForm";
import { parsePlanMyJourneySearchParams } from "@/lib/plan-my-journey";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Plan My Journey",
  description:
    "Tell TRAGUIN about your dates, rooms, guests, and travel style. We create a bespoke itinerary and follow up within 48 hours.",
};

type PlanMyJourneyPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlanMyJourneyPage({ searchParams }: PlanMyJourneyPageProps) {
  const params = parsePlanMyJourneySearchParams(await searchParams);

  return (
    <main className="plan-journey-page">
      <PageHero
        eyebrow="Bespoke travel studio"
        title="Plan My Journey"
        description="Share your dates, party size, and preferences. Our experts will craft a tailored itinerary with handpicked stays and seamless coordination."
        image={images.plannerCta}
        imageAlt=""
        primaryAction={{ label: "Browse destinations", href: "/destinations" }}
        secondaryAction={{ label: "Speak with travel expert", href: "/contact#consultation" }}
      />

      <section className="home-section">
        <div className="site-container py-10 sm:py-14">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.28em] text-gold uppercase">Lead request</p>
              <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
                Tell us how you travel
              </h2>
            </div>
            <Link
              href="/contact#consultation"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-foreground"
            >
              Prefer a call instead?
              <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          <PlanMyJourneyLandingForm context={params} />
        </div>
      </section>
    </main>
  );
}
