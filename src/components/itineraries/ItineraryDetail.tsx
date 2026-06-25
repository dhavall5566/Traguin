"use client";

import { useEffect, useMemo } from "react";
import { Check, MessageCircle, X } from "lucide-react";
import type { Itinerary } from "@/types/itinerary";
import { DestinationHotelsSlider } from "@/components/hotels/DestinationHotelsSlider";
import { ItineraryGalleryMosaic } from "@/components/itineraries/ItineraryGalleryMosaic";
import { ItineraryHero } from "@/components/itineraries/ItineraryHero";
import { ItineraryInquiryForm } from "@/components/itineraries/ItineraryInquiryForm";
import { ItineraryMetaStrip } from "@/components/itineraries/ItineraryMetaStrip";
import { ItineraryReveal3D } from "@/components/itineraries/ItineraryReveal3D";
import { ItinerarySectionHeader } from "@/components/itineraries/ItinerarySectionHeader";
import { ItineraryStickyBar } from "@/components/itineraries/ItineraryStickyBar";
import { ItineraryTimeline } from "@/components/itineraries/ItineraryTimeline";
import { PageCTA } from "@/components/layout/PageCTA";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { contactInfo } from "@/data/contact";
import { itinerarySecondaryCta } from "@/data/site";
import { getDestinationGalleryImages } from "@/lib/destination-images";
import type { Hotel } from "@/types";
import { resolveItineraryHotelCard } from "@/lib/hotels";
import { isHotelContentVisible } from "@/lib/site-features";
import { getItineraryRating, getItineraryReviewCount } from "@/lib/itineraries";
import { scrollToInquirySection } from "@/lib/scroll-to-inquiry";

type ItineraryDetailProps = {
  itinerary: Itinerary;
  destinationName?: string;
  hotelsCatalog?: Hotel[];
  backHref?: string;
  backLabel?: string;
};

export function ItineraryDetail({
  itinerary,
  destinationName,
  hotelsCatalog,
  backHref,
  backLabel,
}: ItineraryDetailProps) {
  const destinationGallery = getDestinationGalleryImages(
    itinerary.destinationId,
    itinerary.heroImage
  );

  const hotelCards = useMemo(
    () =>
      itinerary.hotels.map((hotel) => resolveItineraryHotelCard(hotel, hotelsCatalog)),
    [itinerary.hotels, hotelsCatalog]
  );

  const hotelSubtitle = itinerary.hotels.some((h) => h.category)
    ? "Handpicked accommodation tiers included in this journey."
    : "Properties our travel experts recommend for this journey.";

  const rating = getItineraryRating(itinerary);
  const reviewCount = getItineraryReviewCount(itinerary);
  const displayDestination = destinationName ?? itinerary.destination;

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
    <article className="itinerary-page">
      <ItineraryHero
        itinerary={itinerary}
        destinationName={destinationName}
        gallery={destinationGallery}
        whatsappHref={whatsappHref}
        backHref={backHref}
        backLabel={backLabel}
      />

      <ItineraryMetaStrip itinerary={itinerary} rating={rating} reviewCount={reviewCount} />

      <section className="itinerary-section overflow-visible">
        <div className="site-container overflow-visible">
          <div className="grid gap-12 overflow-visible lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
            <ItineraryReveal3D variant="up">
              <ItinerarySectionHeader eyebrow="The journey" title="Overview" />
              <p className="itinerary-prose mt-8">{itinerary.overview}</p>
              <blockquote className="itinerary-quote mt-10">
                <p className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-snug text-foreground">
                  &ldquo;{itinerary.tagline}&rdquo;
                </p>
                <footer className="mt-4 text-[10px] tracking-[0.22em] text-muted uppercase">
                  {displayDestination} · TRAGUIN Signature
                </footer>
              </blockquote>
            </ItineraryReveal3D>

            <ItineraryReveal3D variant="up" delay={0.06}>
              <ItinerarySectionHeader
                eyebrow="Curated moments"
                title="Highlights"
                description="The experiences that define this itinerary."
              />
              <ul className="mt-8 space-y-3">
                {itinerary.highlights.map((highlight, index) => (
                  <li key={highlight} className="itinerary-highlight-card flex gap-4 p-5 sm:p-6">
                    <span
                      className="shrink-0 font-display text-2xl leading-none text-gold/30"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="min-w-0 flex-1 pt-0.5 text-sm leading-relaxed text-foreground sm:text-[0.9375rem]">
                      {highlight}
                    </p>
                  </li>
                ))}
              </ul>
            </ItineraryReveal3D>
          </div>
        </div>
      </section>

      <ItineraryGalleryMosaic
        images={itinerary.gallery.length >= 3 ? itinerary.gallery : destinationGallery}
        destination={displayDestination}
      />

      <ItineraryReveal3D variant="up">
        <ItineraryTimeline days={itinerary.days} durationDays={itinerary.durationDays} />
      </ItineraryReveal3D>

      {isHotelContentVisible() && hotelCards.length > 0 && (
        <section className="itinerary-section itinerary-section--compact">
          <div className="site-container">
            <ItineraryReveal3D variant="up">
              <DestinationHotelsSlider
                destinationName={displayDestination}
                hotels={hotelCards}
                subtitle={hotelSubtitle}
              />
            </ItineraryReveal3D>
          </div>
        </section>
      )}

      <section className="itinerary-section itinerary-section--surface">
        <div className="site-container">
          <ItinerarySectionHeader
            eyebrow="Transparent planning"
            title="What's included"
            description="Every detail accounted for, so you travel with complete clarity."
            className="mb-10"
          />
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <ItineraryReveal3D variant="left" delay={0.04}>
              <InclusionList title="Included" items={itinerary.included} positive />
            </ItineraryReveal3D>
            <ItineraryReveal3D variant="right" delay={0.08}>
              <InclusionList title="Excluded" items={itinerary.excluded} />
            </ItineraryReveal3D>
          </div>
        </div>
      </section>

      <section className="itinerary-section">
        <div className="site-container">
          <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-12">
            <ItineraryReveal3D variant="left" className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start">
              <ItineraryInquiryForm
                itineraryTitle={itinerary.title}
                itinerarySlug={itinerary.slug}
                relatedItineraryId={itinerary.cmsId}
              />
            </ItineraryReveal3D>

            <ItineraryReveal3D variant="right" delay={0.06} className="lg:col-span-2">
              <aside className="itinerary-expert-card relative overflow-hidden rounded-[1.75rem] border border-gold/20 p-8 text-center md:p-10">
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/[0.08] blur-2xl"
                  aria-hidden
                />
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
                  <MessageCircle size={28} className="text-gold" />
                </div>
                <h3 className="relative mt-5 font-display text-2xl text-foreground">
                  WhatsApp Travel Expert
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-foreground/72">
                  Prefer to chat? Message our travel expert directly about {itinerary.title}.
                </p>
                <MagneticButton
                  as="a"
                  href={whatsappHref}
                  variant="primary"
                  className="relative mt-7 inline-flex w-full items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href={itinerarySecondaryCta.href}
                  variant="secondary"
                  className="relative mt-3 w-full"
                >
                  {itinerarySecondaryCta.label}
                </MagneticButton>
              </aside>
            </ItineraryReveal3D>
          </div>

          <ItineraryReveal3D variant="up" className="mt-14 overflow-visible md:mt-16">
            <PageCTA />
          </ItineraryReveal3D>
        </div>
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
    <div className="itinerary-inclusion-card h-full rounded-[1.25rem] border border-glass-border p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${positive ? "bg-gold/10" : "bg-surface-elevated"}`}
        >
          {positive ? (
            <Check size={18} className="text-gold" />
          ) : (
            <X size={18} className="text-muted" />
          )}
        </span>
        <h3 className="font-display text-xl text-foreground">{title}</h3>
      </div>
      <ul className="mt-6 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/78">
            {positive ? (
              <Check size={15} className="mt-0.5 shrink-0 text-gold" />
            ) : (
              <X size={15} className="mt-0.5 shrink-0 text-muted" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
