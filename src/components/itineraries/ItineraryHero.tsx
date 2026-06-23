"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import type { Itinerary } from "@/types/itinerary";
import { HotelImageSlider } from "@/components/hotels/HotelImageSlider";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { itineraryPrimaryCta, itinerarySecondaryCta } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

type ItineraryHeroProps = {
  itinerary: Itinerary;
  destinationName?: string;
  gallery: string[];
  whatsappHref: string;
  backHref?: string;
  backLabel?: string;
};

export function ItineraryHero({
  itinerary,
  destinationName,
  gallery,
  whatsappHref,
  backHref = "/destinations",
  backLabel = "All Destinations",
}: ItineraryHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLAnchorElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        backRef.current,
        { y: -16, opacity: 0, rotateX: 20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.7, transformPerspective: 1200 }
      )
        .fromTo(
          copyRef.current,
          { y: 56, opacity: 0, rotateX: 14 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.05, transformPerspective: 1400 },
          "-=0.35"
        )
        .fromTo(
          priceRef.current,
          { y: 40, opacity: 0, rotateY: -28, x: 24 },
          { y: 0, opacity: 1, rotateY: 0, x: 0, duration: 0.9, transformPerspective: 1200 },
          "-=0.75"
        );

      if (imageWrapRef.current && sectionRef.current) {
        gsap.to(imageWrapRef.current, {
          y: 90,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.4,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="itinerary-hero relative min-h-[78svh] w-full overflow-hidden md:min-h-[88svh]"
    >
      <div ref={imageWrapRef} className="absolute inset-0 overflow-hidden will-change-transform">
        <HotelImageSlider
          images={gallery}
          alt={itinerary.title}
          className="h-full w-full"
          imageClassName="h-full w-full scale-105 object-cover"
          intervalMs={5500}
          showIndicators
          indicatorsClassName="bottom-[8.5rem] sm:bottom-[9.5rem] md:bottom-[10.5rem]"
        />
      </div>

      <div className="itinerary-hero__scrim pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div className="page-x-padding relative z-10 flex min-h-[78svh] flex-col md:min-h-[88svh]">
        <div className="site-container flex flex-1 flex-col pt-28 pb-10 md:pt-32 md:pb-14">
          <Link
            ref={backRef}
            href={backHref}
            className="itinerary-hero__back inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-[10px] tracking-[0.16em] text-white/90 uppercase backdrop-blur-md transition-colors hover:border-white/40 hover:bg-black/35 hover:text-white"
          >
            <ArrowLeft size={13} />
            {backLabel}
          </Link>

          <div className="mt-auto grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-14">
            <div ref={copyRef} className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <p className="text-xs tracking-[0.28em] text-gold-light uppercase">
                  {destinationName ?? itinerary.destination}
                </p>
                <span className="hidden h-3 w-px bg-white/25 sm:block" aria-hidden />
                <p className="text-[10px] tracking-[0.2em] text-white/65 uppercase">
                  {itinerary.region === "domestic" ? "India" : "International"}
                </p>
                {itinerary.featured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-gold/15 px-3 py-1 text-[10px] tracking-[0.16em] text-gold-light uppercase backdrop-blur-sm">
                    <Sparkles size={11} aria-hidden />
                    Signature
                  </span>
                )}
              </div>

              <h1 className="mt-5 font-display text-[clamp(2.625rem,7.5vw,5rem)] leading-[1.02] tracking-tight text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.5)]">
                {itinerary.title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/88 sm:text-lg">
                {itinerary.tagline}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <MagneticButton as="a" href="#inquiry" variant="primary">
                  {itineraryPrimaryCta.label}
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href={whatsappHref}
                  variant="secondary"
                  className="inline-flex items-center gap-2 !border-white/30 !bg-white/10 !text-white backdrop-blur-sm hover:!border-gold/45 hover:!bg-white/15"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href={itinerarySecondaryCta.href}
                  variant="ghost"
                  className="!text-xs !text-white/80 hover:!text-white"
                >
                  {itinerarySecondaryCta.label}
                </MagneticButton>
              </div>
            </div>

            <div ref={priceRef} className="itinerary-hero__price shrink-0 lg:min-w-[16rem]">
              <PriceDisplay
                amount={itinerary.startingPrice}
                label="Starting from"
                size="lg"
                note={itinerary.priceNote}
                variant="overlay"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
