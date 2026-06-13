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
          title="Why TRAGUIN"
          description="Crafting extraordinary journeys since 2024, with the polish of a global brand and the intimacy of a private studio."
        />
      </Reveal3D>

      <div ref={gridRef} className="home-grid mt-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 [perspective:1400px]">
        {valueProps.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} data-reveal-item className="[transform-style:preserve-3d]">
              <Tilt3DCard max={11}>
                <div className="home-value-card glass group rounded-2xl border border-glass-border p-7 sm:p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 transition-colors group-hover:bg-gold/20">
                    <Icon size={24} className="text-gold" />
                  </div>
                  <h3 className="font-body text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
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
