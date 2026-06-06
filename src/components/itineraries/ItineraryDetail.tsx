"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Star,
  X,
} from "lucide-react";
import type { Itinerary } from "@/types/itinerary";
import { HotelImageSlider } from "@/components/hotels/HotelImageSlider";
import { SafeImage } from "@/components/ui/SafeImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getDestinationGalleryImages } from "@/lib/destination-images";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ItineraryInquiryForm } from "@/components/itineraries/ItineraryInquiryForm";
import { ItineraryTimeline } from "@/components/itineraries/ItineraryTimeline";
import { contactInfo } from "@/data/contact";
import { itineraryPrimaryCta, itinerarySecondaryCta } from "@/data/site";
import { getLuxuryStayHrefForItineraryHotel } from "@/lib/hotels";
import { scrollToInquirySection } from "@/lib/scroll-to-inquiry";
import { cn } from "@/lib/utils";

type ItineraryDetailProps = {
  itinerary: Itinerary;
  destinationName?: string;
};

export function ItineraryDetail({ itinerary, destinationName }: ItineraryDetailProps) {
  const destinationGallery = getDestinationGalleryImages(
    itinerary.destinationId,
    itinerary.heroImage
  );

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
      {/* Hero */}
      <section className="relative min-h-[50svh] md:min-h-[60svh]">
        <div className="absolute inset-0 overflow-hidden">
          <HotelImageSlider
            images={destinationGallery}
            alt={itinerary.title}
            className="h-full w-full"
            intervalMs={4000}
            showIndicators={false}
          />
        </div>
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="relative mx-auto flex min-h-[50svh] max-w-7xl flex-col justify-end px-4 pb-10 pt-4 sm:px-6 md:min-h-[60svh] md:pb-14">
          <Link
            href="/destinations"
            className="mb-6 inline-flex w-fit items-center gap-2 text-xs tracking-wide text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft size={14} />
            All Destinations
          </Link>
          <p className="text-xs tracking-[0.3em] text-gold uppercase">
            {destinationName ?? itinerary.destination}
          </p>
          <h1 className="mt-2 font-display text-4xl text-foreground md:text-6xl lg:text-7xl">
            {itinerary.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">{itinerary.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
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
        </div>
      </section>

      {/* Duration & Pricing bar */}
      <section className="border-y border-glass-border bg-surface">
        <div className="section-padding py-8">
          <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
            <MetaItem icon={Clock} label="Duration" value={itinerary.duration} />
            <MetaItem
              icon={MapPin}
              label="Destination"
              value={`${itinerary.destination} · ${itinerary.region === "domestic" ? "India" : "International"}`}
            />
            <div>
              <p className="text-xs tracking-wide text-muted uppercase">Starting Price</p>
              <div className="mt-2">
                <PriceDisplay amount={itinerary.startingPrice} label="From" size="lg" note={itinerary.priceNote} />
              </div>
            </div>
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
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl text-foreground md:text-4xl">Hotel Information</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {itinerary.hotels.map((hotel) => (
              <Link
                key={hotel.name}
                href={getLuxuryStayHrefForItineraryHotel(hotel)}
                className="group block overflow-hidden rounded-2xl border border-glass-border glass transition-all duration-300 hover:border-gold/35 hover:shadow-[0_16px_40px_-16px_rgba(212,175,55,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <SafeImage
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl text-foreground transition-colors group-hover:text-gold">
                      {hotel.name}
                    </h3>
                    {hotel.stars && (
                      <div className="flex gap-0.5">
                        {[...Array(hotel.stars)].map((_, i) => (
                          <Star key={i} size={12} className="fill-gold text-gold" />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gold">{hotel.location} · {hotel.nights}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{hotel.description}</p>
                  <p className="mt-4 text-xs font-medium tracking-wide text-gold uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View property →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Included / Excluded */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <InclusionList title="Included" items={itinerary.included} positive />
            <InclusionList title="Excluded" items={itinerary.excluded} />
          </div>
        </div>
      </section>

      {/* Gallery */}
      {destinationGallery.length > 0 && (
        <section className="section-padding">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-3xl text-foreground md:text-4xl">Gallery</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {destinationGallery.map((src, i) => (
                <div key={src} className={cn("relative overflow-hidden rounded-xl", i === 0 && "col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[280px]")}>
                  <SafeImage
                    src={src}
                    alt={`${itinerary.title} gallery ${i + 1}`}
                    className="h-full min-h-[120px] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {itinerary.faq.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl text-foreground md:text-4xl">FAQ</h2>
            <div className="mt-8 space-y-3">
              {itinerary.faq.map((item) => (
                <FaqItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry + WhatsApp */}
      <section className="section-padding">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <ItineraryInquiryForm itineraryTitle={itinerary.title} itinerarySlug={itinerary.slug} />
          </div>
          <div className="flex flex-col justify-center lg:col-span-2">
            <div className="glass rounded-3xl border border-glass-border p-8 text-center">
              <MessageCircle size={40} className="mx-auto text-gold" />
              <h3 className="mt-4 font-display text-2xl text-foreground">WhatsApp Concierge</h3>
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

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-xl border border-glass-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-foreground">{question}</span>
        <ChevronDown size={18} className={cn("shrink-0 text-gold transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <p className="border-t border-glass-border px-5 pb-4 text-sm leading-relaxed text-muted">{answer}</p>
      )}
    </div>
  );
}
