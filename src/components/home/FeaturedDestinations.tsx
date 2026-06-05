"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredDestinations } from "@/data/featuredDestinations";
import { getDefaultItineraryInquiryHref, getItineraryByDestinationId } from "@/lib/itineraries";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { itineraryPrimaryCta, itinerarySecondaryCta } from "@/data/site";

export function FeaturedDestinations() {
  return (
    <section id="destinations" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Curated Collection"
          title="Featured Destinations"
          description="Handpicked journeys with full day-by-day itineraries — tap any destination to explore the complete program."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDestinations.map((dest) => {
            const itinerary = getItineraryByDestinationId(dest.id);
            return (
              <DestinationCard
                key={dest.id}
                destinationId={dest.id}
                name={dest.name}
                location={itinerary?.destination ?? dest.name}
                description={
                  itinerary
                    ? itinerary.highlights.slice(0, 3).join(" ")
                    : dest.description
                }
                image={itinerary?.heroImage ?? dest.image}
                startingPrice={itinerary?.startingPrice ?? dest.startingPrice}
                href={`/destinations/${dest.id}`}
                cta={itinerary ? "View Itinerary" : "View Journey"}
                duration={itinerary?.duration}
              />
            );
          })}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-wrap justify-center gap-3">
            <MagneticButton as="a" href={getDefaultItineraryInquiryHref()} variant="primary">
              {itineraryPrimaryCta.label}
            </MagneticButton>
            <MagneticButton as="a" href={itinerarySecondaryCta.href} variant="secondary">
              {itinerarySecondaryCta.label}
            </MagneticButton>
          </div>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-gold uppercase transition-colors hover:text-foreground"
          >
            View All Destinations
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
