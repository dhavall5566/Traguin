"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { valueProps } from "@/data/valueProps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection, HomeSectionActions } from "@/components/home/HomeSection";
import { Tilt3DCard } from "@/components/itineraries/Tilt3DCard";
import { useStaggerReveal3D } from "@/hooks/useStaggerReveal3D";
import { secondaryCta } from "@/data/site";

export function WhyTraguin() {
  const gridRef = useRef<HTMLDivElement>(null);
  useStaggerReveal3D(gridRef, { variant: "flip", stagger: 0.11 });

  return (
    <HomeSection tone="muted">
      <Reveal3D variant="up">
        <SectionHeader
          title="WHY TRAGUIN"
          description="Crafting extraordinary journeys since 2024, with the polish of a global brand and the intimacy of a private studio."
        />
      </Reveal3D>

      <div ref={gridRef} className="home-value-grid home-grid mt-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 [perspective:1400px]">
        {valueProps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} data-reveal-item className="flex min-h-0 flex-col [transform-style:preserve-3d]">
              <Tilt3DCard max={11} className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
                <article className="home-value-card glass group flex h-full min-h-[17.5rem] flex-col p-7 sm:min-h-[18.5rem] sm:p-8">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-3xl leading-none text-gold/35 transition-colors group-hover:text-gold/55">
                      {item.step}
                    </span>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/8 transition-colors group-hover:border-gold/35 group-hover:bg-gold/12">
                      <Icon size={20} className="text-gold" aria-hidden />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-1 flex-col">
                    <h3 className="font-body text-lg font-bold text-foreground sm:text-xl">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.description}</p>
                    <p className="home-value-card__highlight mt-5 border-t border-glass-border pt-4 text-xs leading-relaxed text-gold/90">
                      {item.highlight}
                    </p>
                  </div>
                </article>
              </Tilt3DCard>
            </div>
          );
        })}
      </div>

      <Reveal3D variant="scale" delay={0.08}>
        <HomeSectionActions>
          <MagneticButton as="a" href={secondaryCta.href} variant="primary">
            {secondaryCta.label}
            <ArrowUpRight size={14} />
          </MagneticButton>
          <MagneticButton as="a" href="/about" variant="secondary">
            Our Story
          </MagneticButton>
        </HomeSectionActions>
      </Reveal3D>
    </HomeSection>
  );
}
