"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, MessageCircle } from "lucide-react";
import type { DestinationListing } from "@/lib/destinations";
import { SafeImage } from "@/components/ui/SafeImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ItineraryInquiryForm } from "@/components/itineraries/ItineraryInquiryForm";
import { contactInfo } from "@/data/contact";
import { itineraryPrimaryCta, itinerarySecondaryCta, primaryCta } from "@/data/site";
import { scrollToInquirySection } from "@/lib/scroll-to-inquiry";

type DestinationDetailProps = {
  destination: DestinationListing;
};

export function DestinationDetail({ destination }: DestinationDetailProps) {
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
      <section className="relative min-h-[45svh] md:min-h-[55svh]">
        <SafeImage
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-background/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

        <div className="relative mx-auto flex min-h-[45svh] max-w-7xl flex-col justify-end px-4 pb-10 pt-4 sm:px-6 md:min-h-[55svh] md:pb-14">
          <Link
            href="/destinations"
            className="mb-6 inline-flex w-fit items-center gap-2 text-xs tracking-wide text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft size={14} />
            All Destinations
          </Link>
          <p className="text-xs tracking-[0.3em] text-gold uppercase">{destination.categoryTitle}</p>
          <h1 className="mt-2 font-display text-4xl text-foreground md:text-6xl">{destination.name}</h1>
          <p className="mt-4 max-w-2xl text-muted">{destination.description}</p>
          <div className="mt-6">
            <PriceDisplay amount={destination.startingPrice} label="From" size="lg" />
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
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-3xl text-center">
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

      <section className="section-padding bg-surface pt-0">
        <div className="mx-auto max-w-7xl">
          <ItineraryInquiryForm
            itineraryTitle={`${destination.name} Journey`}
            itinerarySlug={destination.id}
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="mx-auto flex max-w-7xl justify-center">
          <MagneticButton as="a" href={itinerarySecondaryCta.href} variant="secondary">
            {itinerarySecondaryCta.label}
          </MagneticButton>
        </div>
      </section>
    </article>
  );
}
