"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection, HomeSectionActions } from "@/components/home/HomeSection";
import { Tilt3DCard } from "@/components/itineraries/Tilt3DCard";
import { useStaggerReveal3D } from "@/hooks/useStaggerReveal3D";
import { useMotionLite } from "@/hooks/useMotionLite";
import { primaryCta } from "@/data/site";
import { iconFromKey } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { HomeJourneyStep } from "@/lib/api/homepage";

export function JourneyProcess({ steps }: { steps: HomeJourneyStep[] }) {
  const motionLite = useMotionLite();
  const gridRef = useRef<HTMLOListElement>(null);
  useStaggerReveal3D(gridRef, { variant: "up", stagger: 0.13 });

  if (steps.length === 0) return null;

  return (
    <HomeSection tone="muted">
      <div className="relative">
        <div
          className="pointer-events-none absolute -right-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-gold/[0.04] blur-3xl"
          aria-hidden
        />

        <Reveal3D variant="up">
          <SectionHeader
            eyebrow="The TRAGUIN Method"
            title="How Your Journey Takes Shape"
            description="From first conversation to final toast, a refined, transparent process designed around you."
          />
        </Reveal3D>

        <div className="relative mt-10 lg:mt-12">
          <div
            className="pointer-events-none absolute top-[3.25rem] right-[12.5%] left-[12.5%] hidden h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent lg:block"
            aria-hidden
          />

          <ol
            ref={gridRef}
            className={cn("home-grid sm:grid-cols-2 lg:grid-cols-4", !motionLite && "[perspective:1400px]")}
          >
            {steps.map((step) => {
              const Icon = iconFromKey(step.iconKey, Compass);
              return (
                <li
                  key={step.id}
                  data-reveal-item
                  className={cn("list-none", !motionLite && "[transform-style:preserve-3d]")}
                >
                  <Tilt3DCard max={10}>
                    <div className="home-journey-card group relative glass rounded-2xl border border-glass-border p-7 sm:p-8">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-display text-3xl leading-none text-gold/35 transition-colors group-hover:text-gold/55">
                          {step.step}
                        </span>
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/8 transition-colors group-hover:border-gold/35 group-hover:bg-gold/12">
                          <Icon size={18} className="text-gold" aria-hidden />
                        </div>
                      </div>

                      <h3 className="mt-5 font-body text-lg font-bold text-foreground">{step.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>

                      <p className="home-journey-card__detail mt-4 border-t border-glass-border pt-4 text-xs leading-relaxed text-gold/90">
                        {step.detail}
                      </p>
                    </div>
                  </Tilt3DCard>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal3D variant="scale" delay={0.1}>
          <HomeSectionActions>
            <MagneticButton as="a" href={primaryCta.href} variant="primary">
              Start Planning Free
              <ArrowUpRight size={14} />
            </MagneticButton>
            <Link
              href="/#planner"
              className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-gold uppercase transition-colors hover:text-foreground"
            >
              Use Journey Planner
              <ArrowUpRight size={14} />
            </Link>
          </HomeSectionActions>
        </Reveal3D>
      </div>
    </HomeSection>
  );
}
