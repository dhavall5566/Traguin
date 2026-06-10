"use client";

import { useEffect, useMemo, type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  MessageCircle,
  Star,
  X,
} from "lucide-react";
import type { Itinerary } from "@/types/itinerary";
import { DestinationHotelsSlider } from "@/components/hotels/DestinationHotelsSlider";
import { HotelImageSlider } from "@/components/hotels/HotelImageSlider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getDestinationGalleryImages } from "@/lib/destination-images";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ItineraryInquiryForm } from "@/components/itineraries/ItineraryInquiryForm";
import { ItineraryTimeline } from "@/components/itineraries/ItineraryTimeline";
import { contactInfo } from "@/data/contact";
import { itineraryPrimaryCta, itinerarySecondaryCta } from "@/data/site";
import { resolveItineraryHotelCard } from "@/lib/hotels";
import { getItineraryRating, getItineraryReviewCount } from "@/lib/itineraries";
import { scrollToInquirySection } from "@/lib/scroll-to-inquiry";

type ItineraryDetailProps = {
  itinerary: Itinerary;
  destinationName?: string;
};

export function ItineraryDetail({ itinerary, destinationName }: ItineraryDetailProps) {
  const destinationGallery = getDestinationGalleryImages(
    itinerary.destinationId,
    itinerary.heroImage
  );

  const hotelCards = useMemo(
    () => itinerary.hotels.map(resolveItineraryHotelCard),
    [itinerary.hotels]
  );

  const hotelSubtitle = itinerary.hotels.some((h) => h.category)
    ? "Handpicked accommodation tiers included in this journey — explore each property in detail."
    : "Handpicked properties our travel experts recommend for this journey.";

  const rating = getItineraryRating(itinerary);
  const reviewCount = getItineraryReviewCount(itinerary);

  const whatsappMessage = encodeURIComponent(
    `Hello TRAGUIN, I'm interested in the ${itinerary.title} itinerary (${itinerary.duration}).`
  );
  const whatsappHref = `${contactInfo.whatsappHref}?text=${whatsappMessage}`;

  useEffect(() => {
    scrollToInquirySection();
    window.addEventListener("hashchange", scrollToInquirySection);
    return () => window.removeEventListener("hashchange", scrollToInquirySection);
  }, []);

  return (
    <article>
      {/* Hero slider */}
      <section className="relative w-full">
        <div className="relative aspect-[16/9] max-h-[58svh] w-full overflow-hidden sm:aspect-[21/9] md:max-h-[68svh]">
          <HotelImageSlider
            images={destinationGallery}
            alt={itinerary.title}
            className="h-full w-full"
            intervalMs={4000}
            showIndicators
            indicatorsClassName="bottom-4 sm:bottom-5"
          />
        </div>

        <div className="absolute bottom-4 left-4 z-10 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8">
          <div className="glass rounded-2xl border border-glass-border bg-surface/90 px-4 py-3 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-5 sm:py-4">
            <PriceDisplay
              amount={itinerary.startingPrice}
              label="Starting from"
              size="lg"
              note={itinerary.priceNote}
            />
          </div>
        </div>
      </section>

      {/* Title, price, actions & meta */}
      <section className="border-b border-glass-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
          <Link
            href="/destinations"
            className="inline-flex w-fit items-center gap-2 text-xs tracking-wide text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft size={14} />
            All Destinations
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs tracking-[0.3em] text-gold uppercase">
              {destinationName ?? itinerary.destination}
            </p>
            <h1 className="mt-2 font-display text-4xl text-foreground md:text-5xl lg:text-6xl xl:text-7xl">
              {itinerary.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{itinerary.tagline}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-glass-border pt-8">
            <MagneticButton as="a" href="#inquiry" variant="primary">
              {itineraryPrimaryCta.label}
            </MagneticButton>
            <MagneticButton as="a" href={whatsappHref} variant="secondary" className="inline-flex items-center gap-2">
              <MessageCircle size={18} />
              WhatsApp
            </MagneticButton>
            <MagneticButton as="a" href={itinerarySecondaryCta.href} variant="ghost" className="!text-xs">
              {itinerarySecondaryCta.label}
            </MagneticButton>
          </div>

          <div className="mt-8 grid gap-8 border-t border-glass-border pt-8 sm:grid-cols-3">
            <MetaItem icon={Clock} label="Duration" value={itinerary.duration} />
            <MetaItem
              icon={MapPin}
              label="Destination"
              value={`${itinerary.destination} · ${itinerary.region === "domestic" ? "India" : "International"}`}
            />
            <ReviewMetaItem rating={rating} reviewCount={reviewCount} />
          </div>
        </div>
      </section>

      {/* Overview & Highlights */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl text-foreground md:text-4xl">Overview</h2>
              <p className="mt-4 leading-relaxed text-muted">{itinerary.overview}</p>
            </div>
            <div>
              <h2 className="font-display text-3xl text-foreground md:text-4xl">Highlights</h2>
              <ul className="mt-6 space-y-3">
                {itinerary.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15">
                      <Check size={12} className="text-gold" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ItineraryTimeline days={itinerary.days} durationDays={itinerary.durationDays} />

      {/* Hotels */}
      {hotelCards.length > 0 && (
        <section className="section-padding">
          <div className="mx-auto max-w-7xl">
            <DestinationHotelsSlider
              destinationName={destinationName ?? itinerary.destination}
              hotels={hotelCards}
              subtitle={hotelSubtitle}
            />
          </div>
        </section>
      )}

      {/* Included / Excluded */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <InclusionList title="Included" items={itinerary.included} positive />
            <InclusionList title="Excluded" items={itinerary.excluded} />
          </div>
        </div>
      </section>

      {/* Inquiry + WhatsApp */}
      <section className="section-padding">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <ItineraryInquiryForm itineraryTitle={itinerary.title} itinerarySlug={itinerary.slug} />
          </div>
          <div className="flex flex-col justify-center lg:col-span-2">
            <div className="glass rounded-3xl border border-glass-border p-8 text-center">
              <MessageCircle size={40} className="mx-auto text-gold" />
              <h3 className="mt-4 font-display text-2xl text-foreground">WhatsApp Travel Expert</h3>
              <p className="mt-2 text-sm text-muted">
                Prefer to chat? Message our travel expert directly about {itinerary.title}.
              </p>
              <MagneticButton
                as="a"
                href={whatsappHref}
                variant="primary"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </MagneticButton>
              <MagneticButton as="a" href={itinerarySecondaryCta.href} variant="secondary" className="mt-3 w-full sm:w-auto">
                {itinerarySecondaryCta.label}
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
        <Icon size={20} className="text-gold" />
      </div>
      <div>
        <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
        <p className="mt-1 font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ReviewMetaItem({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  const stars = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10">
        <Star size={20} className="fill-gold text-gold" aria-hidden />
      </div>
      <div>
        <p className="text-xs tracking-wide text-muted uppercase">Guest Reviews</p>
        <div
          className="mt-1 flex flex-wrap items-center gap-1.5"
          aria-label={`${rating.toFixed(1)} out of 5 from ${reviewCount} guest reviews`}
        >
          <div className="flex items-center gap-0.5">
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} size={12} className="fill-gold text-gold" aria-hidden />
            ))}
          </div>
          <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>
    </div>
  );
}

function InclusionList({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div className="glass rounded-2xl border border-glass-border p-6 md:p-8">
      <h3 className="font-display text-xl text-foreground">{title}</h3>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-muted">
            {positive ? (
              <Check size={16} className="mt-0.5 shrink-0 text-gold" />
            ) : (
              <X size={16} className="mt-0.5 shrink-0 text-muted" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

