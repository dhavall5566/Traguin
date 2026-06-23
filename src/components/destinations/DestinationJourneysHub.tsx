"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import type { DestinationListing } from "@/lib/destination-listing-types";
import type { Itinerary } from "@/types/itinerary";
import { SafeImage } from "@/components/ui/SafeImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

type DestinationJourneysHubProps = {
  destination: DestinationListing;
  journeys: Itinerary[];
};

export function DestinationJourneysHub({ destination, journeys }: DestinationJourneysHubProps) {
  return (
    <article>
      <section className="relative min-h-[40svh] w-full md:min-h-[48svh]">
        <SafeImage
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 z-[1] bg-black/45" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/80 to-transparent" />

        <div className="page-x-padding relative z-10 flex min-h-[40svh] flex-col justify-end pb-10 pt-28 md:min-h-[48svh] md:pb-14 md:pt-32">
          <div className="site-container">
            <Link
              href="/destinations"
              className="mb-6 inline-flex w-fit items-center gap-2 text-xs tracking-wide text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} />
              All Destinations
            </Link>
            <p className="text-xs tracking-[0.3em] text-gold uppercase">{destination.categoryTitle}</p>
            <h1 className="mt-2 font-display text-4xl text-white md:text-5xl">{destination.name}</h1>
            <p className="mt-4 max-w-2xl text-white/85">{destination.description}</p>
            <p className="mt-6 text-sm tracking-wide text-white/70">
              {journeys.length} curated {journeys.length === 1 ? "journey" : "journeys"} available
            </p>
          </div>
        </div>
      </section>

      <section className="page-x-padding py-14 md:py-20">
        <div className="site-container">
          <div className="grid gap-6 md:grid-cols-2">
            {journeys.map((journey) => (
              <Link
                key={journey.slug}
                href={`/destinations/${destination.id}?journey=${encodeURIComponent(journey.slug)}`}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-gold/35 hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.45)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <SafeImage
                    src={journey.heroImage}
                    alt={journey.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] tracking-[0.22em] text-gold-light uppercase">
                      {journey.duration}
                    </p>
                    <h2 className="mt-1 font-display text-2xl text-white">{journey.title}</h2>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{journey.tagline}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={14} aria-hidden />
                      {journey.days.length} days
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} aria-hidden />
                      {destination.name}
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-4 border-t border-border/50 pt-4">
                    <PriceDisplay amount={journey.startingPrice} label="From" size="sm" />
                    <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.16em] text-gold uppercase transition-transform group-hover:translate-x-0.5">
                      View journey
                      <ArrowRight size={14} aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
