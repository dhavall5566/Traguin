"use client";

import { useEffect, useMemo } from "react";
import { Check, MessageCircle, X } from "lucide-react";
import type { Itinerary } from "@/types/itinerary";
import { DestinationHotelsSlider } from "@/components/hotels/DestinationHotelsSlider";
import { ItineraryGalleryMosaic } from "@/components/itineraries/ItineraryGalleryMosaic";
import { ItineraryHero } from "@/components/itineraries/ItineraryHero";
import { ItineraryMetaStrip } from "@/components/itineraries/ItineraryMetaStrip";
import { ItineraryReveal3D } from "@/components/itineraries/ItineraryReveal3D";
import { ItineraryStickyBar } from "@/components/itineraries/ItineraryStickyBar";
import { Tilt3DCard } from "@/components/itineraries/Tilt3DCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ItineraryInquiryForm } from "@/components/itineraries/ItineraryInquiryForm";
import { ItineraryTimeline } from "@/components/itineraries/ItineraryTimeline";
import { PageCTA } from "@/components/layout/PageCTA";
import { contactInfo } from "@/data/contact";
import { itinerarySecondaryCta } from "@/data/site";
import { getDestinationGalleryImages } from "@/lib/destination-images";
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
    ? "Handpicked accommodation tiers included in this journey, explore each property in detail."
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
    <article className="itinerary-3d-stage pb-20 md:pb-24">
      <ItineraryHero
        itinerary={itinerary}
        destinationName={destinationName}
        gallery={destinationGallery}
        whatsappHref={whatsappHref}
      />

      <ItineraryMetaStrip itinerary={itinerary} rating={rating} reviewCount={reviewCount} />

      <section className="section-padding">
        <div className="site-container">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-20">
            <ItineraryReveal3D variant="left">
              <p className="text-xs tracking-[0.28em] text-gold uppercase">The journey</p>
              <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl lg:text-[2.75rem]">
                Overview
              </h2>
              <p className="mt-6 text-base leading-[1.85] text-muted md:text-lg">{itinerary.overview}</p>
              <blockquote className="itinerary-pull-quote mt-8 border-l-2 border-gold/50 pl-6">
                <p className="font-display text-xl leading-snug text-foreground md:text-2xl">
                  &ldquo;{itinerary.tagline}&rdquo;
                </p>
                <footer className="mt-3 text-xs tracking-[0.2em] text-muted uppercase">
                  {destinationName ?? itinerary.destination} · TRAGUIN Signature
                </footer>
              </blockquote>
            </ItineraryReveal3D>

            <ItineraryReveal3D variant="right" delay={0.08}>
              <p className="text-xs tracking-[0.28em] text-gold uppercase">Curated moments</p>
              <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">Highlights</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {itinerary.highlights.map((highlight, index) => (
                  <ItineraryReveal3D
                    key={highlight}
                    as="li"
                    variant="flip"
                    delay={index * 0.06}
                    className="list-none"
                  >
                    <Tilt3DCard
                      max={12}
                      className="itinerary-highlight-card group relative overflow-hidden rounded-2xl border border-glass-border bg-surface/60 p-5 transition-shadow duration-500 hover:border-gold/30 hover:shadow-[0_20px_50px_-28px_color-mix(in_srgb,var(--gold)_35%,transparent)]"
                    >
                      <span className="font-display text-3xl leading-none text-gold/25 transition-colors group-hover:text-gold/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-3 text-sm leading-relaxed text-foreground">{highlight}</p>
                    </Tilt3DCard>
                  </ItineraryReveal3D>
                ))}
              </ul>
            </ItineraryReveal3D>
          </div>
        </div>
      </section>

      <ItineraryGalleryMosaic
        images={itinerary.gallery.length >= 3 ? itinerary.gallery : destinationGallery}
        destination={destinationName ?? itinerary.destination}
      />

      <ItineraryReveal3D variant="up">
        <ItineraryTimeline days={itinerary.days} durationDays={itinerary.durationDays} />
      </ItineraryReveal3D>

      {hotelCards.length > 0 && (
        <section className="section-padding pt-0">
          <div className="site-container">
            <ItineraryReveal3D variant="scale">
              <DestinationHotelsSlider
                destinationName={destinationName ?? itinerary.destination}
                hotels={hotelCards}
                subtitle={hotelSubtitle}
              />
            </ItineraryReveal3D>
          </div>
        </section>
      )}

      <section className="section-padding bg-surface">
        <div className="site-container">
          <ItineraryReveal3D variant="up" className="mb-8 max-w-2xl">
            <p className="text-xs tracking-[0.28em] text-gold uppercase">Transparent planning</p>
            <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">
              What&apos;s included
            </h2>
          </ItineraryReveal3D>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <ItineraryReveal3D variant="left" delay={0.05}>
              <Tilt3DCard max={8}>
                <InclusionList title="Included" items={itinerary.included} positive />
              </Tilt3DCard>
            </ItineraryReveal3D>
            <ItineraryReveal3D variant="right" delay={0.1}>
              <Tilt3DCard max={8}>
                <InclusionList title="Excluded" items={itinerary.excluded} />
              </Tilt3DCard>
            </ItineraryReveal3D>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="site-container grid gap-10 lg:grid-cols-5 lg:gap-12">
          <ItineraryReveal3D variant="left" className="lg:col-span-3">
            <ItineraryInquiryForm itineraryTitle={itinerary.title} itinerarySlug={itinerary.slug} />
          </ItineraryReveal3D>
          <ItineraryReveal3D variant="right" delay={0.08} className="flex flex-col justify-center lg:col-span-2">
            <Tilt3DCard max={9} scale={1.015}>
              <div className="itinerary-expert-card relative overflow-hidden rounded-3xl border border-gold/20 p-8 text-center">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/[0.08] blur-2xl"
                aria-hidden
              />
              <MessageCircle size={40} className="relative mx-auto text-gold" />
              <h3 className="relative mt-4 font-display text-2xl text-foreground">
                WhatsApp Travel Expert
              </h3>
              <p className="relative mt-2 text-sm text-muted">
                Prefer to chat? Message our travel expert directly about {itinerary.title}.
              </p>
              <MagneticButton
                as="a"
                href={whatsappHref}
                variant="primary"
                className="relative mt-6 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </MagneticButton>
              <MagneticButton
                as="a"
                href={itinerarySecondaryCta.href}
                variant="secondary"
                className="relative mt-3 w-full sm:w-auto"
              >
                {itinerarySecondaryCta.label}
              </MagneticButton>
              </div>
            </Tilt3DCard>
          </ItineraryReveal3D>
        </div>

        <ItineraryReveal3D variant="scale" className="site-container">
          <PageCTA />
        </ItineraryReveal3D>
      </section>

      <ItineraryStickyBar itinerary={itinerary} whatsappHref={whatsappHref} />
    </article>
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
