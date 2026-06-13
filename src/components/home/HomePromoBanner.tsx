"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection } from "@/components/home/HomeSection";
import { Tilt3DCard } from "@/components/itineraries/Tilt3DCard";
import { primaryCta, secondaryCta } from "@/data/site";

export function HomePromoBanner() {
  return (
    <HomeSection spacing="compact" tone="muted">
      <Reveal3D variant="scale">
        <Tilt3DCard max={6} scale={1.008}>
          <div className="home-promo-banner relative overflow-hidden rounded-[1.75rem] border border-gold/25 px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/[0.08] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-gold/[0.05] blur-3xl"
              aria-hidden
            />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-xs tracking-[0.28em] text-gold uppercase">
                  <Sparkles size={14} aria-hidden />
                  Complimentary Consultation
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-foreground">
                  Ready for a journey designed entirely around you?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                  Share your dates and travel style, our designers respond with a bespoke itinerary
                  and transparent pricing within 48 hours.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <MagneticButton as="a" href={primaryCta.href} variant="primary">
                  {primaryCta.label}
                  <ArrowUpRight size={14} />
                </MagneticButton>
                <MagneticButton as="a" href={secondaryCta.href} variant="secondary">
                  {secondaryCta.label}
                </MagneticButton>
                <Link
                  href="/destinations"
                  className="inline-flex items-center justify-center gap-2 px-2 py-3 text-xs tracking-[0.18em] text-gold uppercase transition-colors hover:text-foreground sm:justify-start lg:justify-center xl:justify-start"
                >
                  Browse Destinations
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Tilt3DCard>
      </Reveal3D>
    </HomeSection>
  );
}
