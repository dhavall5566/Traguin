"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection, HomeSectionActions } from "@/components/home/HomeSection";
import { useStaggerReveal3D } from "@/hooks/useStaggerReveal3D";
import { primaryCta } from "@/data/site";
import type { HomeFeaturedDestination } from "@/lib/api/homepage";

export function FeaturedDestinations({ destinations }: { destinations: HomeFeaturedDestination[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  useStaggerReveal3D(gridRef, { variant: "flip", stagger: 0.12 });

  if (destinations.length === 0) return null;

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
        {destinations.map((dest) => (
          <div key={dest.id} data-reveal-item className="[transform-style:preserve-3d]">
            <DestinationCard
              destinationId={dest.slug}
              name={dest.name}
              location={dest.name}
              regionLabel={dest.regionLabel}
              description={dest.description}
              image={dest.image}
              startingPrice={dest.startingPrice}
              href={dest.href}
              cta={dest.cta}
              duration={dest.duration}
              tilt
            />
          </div>
        ))}
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
  );
}
