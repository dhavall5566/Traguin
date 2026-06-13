"use client";

<<<<<<< HEAD
=======
import { useRef } from "react";
>>>>>>> dhaval
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredDestinations } from "@/data/featuredDestinations";
import { getItineraryByDestinationId } from "@/lib/itineraries";
<<<<<<< HEAD
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DestinationCard } from "@/components/ui/DestinationCard";

export function FeaturedDestinations() {
  return (
    <section
      id="destinations"
      className="relative px-[clamp(1.5rem,5vw,4rem)] pt-[clamp(1rem,2.5vw,1.75rem)] pb-6"
    >
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
=======
import { getDestinationById } from "@/lib/destinations";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection, HomeSectionActions } from "@/components/home/HomeSection";
import { useStaggerReveal3D } from "@/hooks/useStaggerReveal3D";
import { primaryCta } from "@/data/site";

export function FeaturedDestinations() {
  const gridRef = useRef<HTMLDivElement>(null);
  useStaggerReveal3D(gridRef, { variant: "flip", stagger: 0.12 });

  return (
    <HomeSection id="destinations">
      <Reveal3D variant="up">
        <SectionHeader
          eyebrow="Curated Collection"
          title="Featured Destinations"
          description="Handpicked journeys with full day-by-day itineraries, tap any destination to explore the complete program."
        />
      </Reveal3D>
      <div ref={gridRef} className="home-grid mt-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 [perspective:1400px]">
        {featuredDestinations.map((dest) => {
          const itinerary = getItineraryByDestinationId(dest.id);
          const listing = getDestinationById(dest.id);
          const regionLabel =
            listing?.region === "domestic" ? "India" : listing ? "International" : undefined;
          return (
            <div key={dest.id} data-reveal-item className="[transform-style:preserve-3d]">
              <DestinationCard
                destinationId={dest.id}
                name={itinerary?.title ?? dest.name}
                location={itinerary?.destination ?? dest.name}
                regionLabel={regionLabel}
                description={
                  itinerary ? itinerary.highlights.slice(0, 3).join(" ") : dest.description
>>>>>>> dhaval
                }
                image={itinerary?.heroImage ?? dest.image}
                startingPrice={itinerary?.startingPrice ?? dest.startingPrice}
                href={`/destinations/${dest.id}`}
<<<<<<< HEAD
                cta={itinerary ? "View Itinerary" : "View Journey"}
                duration={itinerary?.duration}
              />
            );
          })}
        </div>
        <div className="mt-10 flex justify-center sm:justify-end">
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
=======
                cta={itinerary ? "Discover Journey" : "View Journey"}
                duration={itinerary?.duration}
                tilt
              />
            </div>
          );
        })}
      </div>
      <Reveal3D variant="scale" delay={0.1}>
        <HomeSectionActions className="mt-10 lg:mt-12">
        <MagneticButton as="a" href={primaryCta.href} variant="primary">
          {primaryCta.label}
          <ArrowUpRight size={14} />
        </MagneticButton>
        <MagneticButton as="a" href="/destinations" variant="secondary">
          View All Destinations
        </MagneticButton>
        <Link
          href="/luxury-stays"
          className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-gold uppercase transition-colors hover:text-foreground"
        >
          Explore Luxury Stays
          <ArrowUpRight size={14} />
        </Link>
      </HomeSectionActions>
      </Reveal3D>
    </HomeSection>
>>>>>>> dhaval
  );
}
