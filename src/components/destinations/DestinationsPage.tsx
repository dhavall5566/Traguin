"use client";

import { destinationCategories } from "@/data/destinationCategories";
import { getItineraryByDestinationId } from "@/lib/itineraries";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { primaryCta, secondaryCta } from "@/data/site";

export function DestinationsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 md:pt-28">
      <div className="section-padding pt-0">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            align="left"
            eyebrow="Worldwide Collection"
            title="Destinations"
            description="Explore curated regions — each destination opens a full day-by-day itinerary when available."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton as="a" href={primaryCta.href} variant="primary" className="!text-xs">
              {primaryCta.label}
            </MagneticButton>
            <MagneticButton as="a" href={secondaryCta.href} variant="secondary" className="!text-xs">
              {secondaryCta.label}
            </MagneticButton>
          </div>

          <div className="mt-16 space-y-20">
            {destinationCategories.map((category) => (
              <section key={category.id} id={category.id} className="scroll-mt-28">
                <h2 className="font-display text-3xl text-foreground md:text-4xl">{category.title}</h2>
                <p className="mt-2 max-w-2xl text-muted">{category.description}</p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.destinations.map((dest) => {
                    const itinerary = getItineraryByDestinationId(dest.id);
                    return (
                      <DestinationCard
                        key={`${category.id}-${dest.id}`}
                        name={dest.name}
                        description={
                          itinerary
                            ? itinerary.highlights.slice(0, 2).join(" · ")
                            : dest.description
                        }
                        image={itinerary?.heroImage ?? dest.image}
                        startingPrice={itinerary?.startingPrice ?? dest.startingPrice}
                        href={`/destinations/${dest.id}`}
                        cta={itinerary ? "View Itinerary" : "View Destination"}
                        duration={itinerary?.duration}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
