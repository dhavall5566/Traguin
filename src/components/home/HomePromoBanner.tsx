"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection } from "@/components/home/HomeSection";
import { Tilt3DCard } from "@/components/itineraries/Tilt3DCard";
import { primaryCta, secondaryCta } from "@/data/site";
import { iconFromKey } from "@/lib/icons";
import type { HomePromoData } from "@/lib/api/homepage";

export function HomePromoBanner({ promo }: { promo: HomePromoData | null }) {
  if (!promo) return null;

  return (
    <HomeSection spacing="compact" tone="muted">
      <Reveal3D variant="scale">
        <Tilt3DCard max={5} scale={1.006}>
          <div className="home-promo-banner relative overflow-hidden rounded-[1.75rem] border border-gold/25">
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold/[0.10] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gold/[0.06] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
              aria-hidden
            />

            <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_20rem] md:items-center md:p-10 lg:p-12">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.22em] text-gold uppercase">
                  <Sparkles size={14} aria-hidden />
                  {promo.eyebrow}
                </p>
                <h2 className="mt-5 max-w-xl font-display text-[clamp(2rem,4.4vw,3.35rem)] leading-[1.03] tracking-tight text-foreground">
                  {promo.title}
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                  {promo.description}
                </p>

                {promo.assurances.length > 0 && (
                  <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                    {promo.assurances.map(({ iconKey, label }) => {
                      const Icon = iconFromKey(iconKey);
                      return (
                      <li
                        key={label}
                        className="flex items-center gap-2 rounded-2xl border border-glass-border bg-surface/55 px-3.5 py-3 text-xs font-medium text-foreground/80"
                      >
                        <Icon size={15} className="shrink-0 text-gold" aria-hidden />
                        <span>{label}</span>
                      </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="rounded-[1.35rem] border border-glass-border bg-surface/70 p-4 shadow-[0_20px_50px_-34px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-5">
                <div className="rounded-2xl border border-gold/20 bg-gold/[0.06] p-4">
                  <p className="text-xs tracking-[0.18em] text-gold uppercase">Start here</p>
                  <p className="mt-2 font-display text-2xl leading-tight text-foreground">
                    Private planning call
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    A focused conversation with a travel expert to shape the first draft of your
                    journey.
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                <MagneticButton
                  as="a"
                  href={primaryCta.href}
                  variant="primary"
                  className="w-full !justify-center"
                >
                  {primaryCta.label}
                  <ArrowUpRight size={14} />
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href={secondaryCta.href}
                  variant="secondary"
                  className="w-full !justify-center"
                >
                  {secondaryCta.label}
                </MagneticButton>
                <Link
                  href="/destinations"
                  className="inline-flex items-center justify-center gap-2 py-2 text-xs tracking-[0.18em] text-gold uppercase transition-colors hover:text-foreground"
                >
                  Browse Destinations
                  <ArrowUpRight size={14} />
                </Link>
                </div>
              </div>
            </div>
          </div>
        </Tilt3DCard>
      </Reveal3D>
    </HomeSection>
  );
}
