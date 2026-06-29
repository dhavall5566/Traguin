"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import type { DestinationListing } from "@/lib/destination-listing-types";
import type { Itinerary } from "@/types/itinerary";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatPriceLabel, isPriceOnRequest } from "@/lib/utils";

type DestinationJourneysHubProps = {
  destination: DestinationListing;
  journeys: Itinerary[];
};

function destinationRegionLabel(destination: DestinationListing): string {
  if (destination.region === "domestic") {
    return destination.country ?? "India";
  }
  return destination.country ?? "International";
}

function JourneyCard({
  journey,
  destinationName,
  destinationId,
}: {
  journey: Itinerary;
  destinationName: string;
  destinationId: string;
}) {
  const priceOnRequest = isPriceOnRequest(journey.startingPrice);

  return (
    <Link
      href={`/destinations/${destinationId}?journey=${encodeURIComponent(journey.slug)}`}
      className="journey-card group flex h-full flex-col"
    >
      <div className="journey-card__media">
        <SafeImage
          src={journey.heroImage}
          alt={journey.title}
          className="journey-card__image"
        />
        <span className="journey-card__duration">{journey.duration}</span>
      </div>

      <div className="journey-card__body">
        <h2 className="journey-card__title">{journey.title}</h2>
        <p className="journey-card__tagline">{journey.tagline}</p>

        <ul className="journey-card__facts" aria-label="Journey details">
          <li>
            <CalendarDays size={12} aria-hidden />
            {journey.days.length} days
          </li>
          <li>
            <MapPin size={12} aria-hidden />
            {destinationName}
          </li>
        </ul>

        <div className="journey-card__action">
          <div className="journey-card__price">
            <span className="journey-card__price-label">Onwards</span>
            <span
              className={
                priceOnRequest ? "journey-card__price-inquire" : "journey-card__price-value"
              }
            >
              {formatPriceLabel(journey.startingPrice)}
            </span>
          </div>
          <span className="journey-card__cta">
            Explore journey
            <ArrowRight size={14} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
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

          <div className="journeys-hub__grid">
            {journeys.map((journey) => (
              <JourneyCard
                key={journey.slug}
                journey={journey}
                destinationName={destination.name}
                destinationId={destination.id}
              />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
