"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, MessageCircle } from "lucide-react";
import type { DestinationListing } from "@/lib/destinations";
import { DestinationHotelsSlider } from "@/components/hotels/DestinationHotelsSlider";
import { SafeImage } from "@/components/ui/SafeImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ItineraryInquiryForm } from "@/components/itineraries/ItineraryInquiryForm";
import { contactInfo } from "@/data/contact";
import { itineraryPrimaryCta, itinerarySecondaryCta, primaryCta } from "@/data/site";
import type { Hotel } from "@/types";
import { getHotelsByDestinationName, resolveCatalogHotelCard } from "@/lib/hotels";
import { isHotelContentVisible } from "@/lib/site-features";
import { scrollToInquirySection } from "@/lib/scroll-to-inquiry";

type DestinationDetailProps = {
  destination: DestinationListing;
  hotelsCatalog?: Hotel[];
};

export function DestinationDetail({ destination, hotelsCatalog }: DestinationDetailProps) {
  const hotelCards = useMemo(
    () =>
      getHotelsByDestinationName(destination.name, 12, hotelsCatalog).map(resolveCatalogHotelCard),
    [destination.name, hotelsCatalog]
  );

  const whatsappMessage = encodeURIComponent(
    `Hello TRAGUIN, I'm interested in a luxury journey to ${destination.name}.`
  );
  const whatsappHref = `${contactInfo.whatsappHref}?text=${whatsappMessage}`;

  useEffect(() => {
    scrollToInquirySection();
    window.addEventListener("hashchange", scrollToInquirySection);
    return () => window.removeEventListener("hashchange", scrollToInquirySection);
  }, []);

  return (
    <article>
      <section className="relative min-h-[45svh] w-full md:min-h-[55svh]">
        <SafeImage
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="destination-hero__scrim pointer-events-none absolute inset-0 z-[1]" aria-hidden />
        <div className="destination-hero__fade pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20" aria-hidden />

        <div className="page-x-padding pointer-events-none absolute inset-0 z-10">
          <div className="site-container destination-hero__copy flex h-full flex-col justify-end pb-10 pt-28 md:pb-14 md:pt-32">
            <div className="pointer-events-auto">
              <Link
                href="/destinations"
                className="destination-hero__back mb-6 inline-flex w-fit items-center gap-2 text-xs tracking-wide text-white/90 transition-colors"
              >
                <ArrowLeft size={14} />
                All Destinations
              </Link>
              <p className="text-xs tracking-[0.3em] text-gold uppercase">{destination.categoryTitle}</p>
              <h1 className="mt-2 font-display text-4xl text-white md:text-6xl">
                {destination.name}
              </h1>
              <p className="mt-4 max-w-2xl text-white/90">{destination.description}</p>
              <div className="mt-6">
                <PriceDisplay
                  amount={destination.startingPrice}
                  label="From"
                  size="lg"
                  variant="overlay"
                />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton as="a" href="#inquiry" variant="primary">
                  {itineraryPrimaryCta.label}
                </MagneticButton>
                <MagneticButton as="a" href={whatsappHref} variant="secondary" className="inline-flex items-center gap-2">
                  <MessageCircle size={18} />
                  WhatsApp
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="site-container site-container--content text-center">
          <MapPin size={32} className="mx-auto text-gold/60" />
          <h2 className="mt-4 font-display text-2xl text-foreground md:text-3xl">
            Bespoke {destination.name} Journey
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Our travel designers are crafting a detailed day-by-day itinerary for this destination.
            Request a personalized quote and we&apos;ll share a program tailored to your dates, style, and budget.
          </p>
          <MagneticButton as="a" href={primaryCta.href} variant="ghost" className="mt-6">
            {primaryCta.label}
          </MagneticButton>
        </div>
      </section>

      {isHotelContentVisible() && hotelCards.length > 0 && (
        <section className="section-padding bg-surface pt-0">
          <div className="site-container">
            <DestinationHotelsSlider
              destinationName={destination.name}
              hotels={hotelCards}
            />
          </div>
        </section>
      )}

      <section className="section-padding bg-surface pt-0">
        <div className="site-container">
          <ItineraryInquiryForm
            itineraryTitle={`${destination.name} Journey`}
            itinerarySlug={destination.id}
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="site-container flex justify-center">
          <MagneticButton as="a" href={itinerarySecondaryCta.href} variant="secondary">
            {itinerarySecondaryCta.label}
          </MagneticButton>
        </div>
      </section>
    </article>
  );
}
