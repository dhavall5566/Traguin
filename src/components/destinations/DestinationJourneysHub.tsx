"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DestinationListing } from "@/lib/destination-listing-types";
import { INDIA_REGION_FILTERS } from "@/lib/destination-listing-types";
import type { Itinerary } from "@/types/itinerary";
import { DestinationListingCard } from "@/components/ui/DestinationListingCard";
import { destinationCountryLabel } from "@/lib/destination-grouping";
import { SafeImage } from "@/components/ui/SafeImage";

type DestinationJourneysHubProps = {
  destination: DestinationListing;
  journeys: Itinerary[];
};

function destinationRegionLabel(destination: DestinationListing): string {
  if (destination.region === "domestic") {
    const region = destination.indiaRegion
      ? INDIA_REGION_FILTERS.find((item) => item.id === destination.indiaRegion)?.label
      : undefined;
    return region ? `${region} · India` : "India";
  }
  return destinationCountryLabel(destination) ?? "International";
}

function JourneyCard({
  journey,
  destinationId,
  regionLabel,
}: {
  journey: Itinerary;
  destinationId: string;
  regionLabel?: string;
}) {
  return (
    <DestinationListingCard
      name={journey.title}
      description={journey.tagline || journey.highlights.slice(0, 3).join(" ")}
      image={journey.heroImage}
      destinationId={destinationId}
      galleryImages={journey.heroImage ? [journey.heroImage] : undefined}
      startingPrice={journey.startingPrice}
      href={`/destinations/${destinationId}?journey=${encodeURIComponent(journey.slug)}`}
      cta="Explore Journey"
      duration={journey.duration}
      location={journey.destination}
      regionLabel={regionLabel}
      rating={5}
      journeyCount={1}
    />
  );
}

export function DestinationJourneysHub({ destination, journeys }: DestinationJourneysHubProps) {
  const regionLabel = destinationRegionLabel(destination);

  return (
    <article className="journeys-hub">
      <section className="journeys-hub__hero">
        <SafeImage
          src={destination.image}
          alt={destination.name}
          className="journeys-hub__hero-image"
          loading="eager"
        />
        <div className="journeys-hub__hero-scrim" aria-hidden />

        <div className="journeys-hub__hero-inner page-x-padding">
          <div className="site-container">
            <p className="journeys-hub__eyebrow">{destination.categoryTitle}</p>
            <h1 className="journeys-hub__title">{destination.name}</h1>
            <p className="journeys-hub__description">{destination.description}</p>

            <dl className="journeys-hub__stats">
              <div className="journeys-hub__stat">
                <dt className="journeys-hub__stat-label">Available journeys</dt>
                <dd className="journeys-hub__stat-value">{journeys.length}</dd>
              </div>
              <div className="journeys-hub__stat">
                <dt className="journeys-hub__stat-label">Region</dt>
                <dd className="journeys-hub__stat-value">{regionLabel}</dd>
              </div>
              <div className="journeys-hub__stat">
                <dt className="journeys-hub__stat-label">Collection</dt>
                <dd className="journeys-hub__stat-value">Curated</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="journeys-hub__toolbar-wrap page-x-padding">
        <div className="site-container">
          <nav className="journeys-hub__toolbar" aria-label="Destination navigation">
            <div className="journeys-hub__breadcrumb">
              <Link href="/destinations" className="journeys-hub__breadcrumb-link">
                <ArrowLeft size={14} aria-hidden />
                All Destinations
              </Link>
              <span className="journeys-hub__breadcrumb-separator" aria-hidden>
                /
              </span>
              <span className="journeys-hub__breadcrumb-current">{destination.name}</span>
            </div>
            <p className="journeys-hub__toolbar-meta">
              {journeys.length} {journeys.length === 1 ? "itinerary" : "itineraries"}
            </p>
          </nav>
        </div>
      </div>

      <section className="journeys-hub__catalog page-x-padding" aria-labelledby="journeys-catalog-heading">
        <div className="site-container">
          <header className="journeys-hub__catalog-header">
            <div>
              <p className="journeys-hub__catalog-eyebrow">Itinerary catalog</p>
              <h2 id="journeys-catalog-heading" className="journeys-hub__catalog-title">
                Select your journey
              </h2>
            </div>
            <p className="journeys-hub__catalog-note">
              Each itinerary is independently curated with distinct pacing, stays, and experiences.
            </p>
          </header>

          <div className="destination-grid grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
            {journeys.map((journey) => (
              <JourneyCard
                key={journey.slug}
                journey={journey}
                destinationId={destination.id}
                regionLabel={regionLabel}
              />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
