"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { specializations } from "@/data/specializations";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal3D } from "@/components/ui/Reveal3D";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection, HomeSectionActions } from "@/components/home/HomeSection";
import { Tilt3DCard } from "@/components/itineraries/Tilt3DCard";
import { useStaggerReveal3D } from "@/hooks/useStaggerReveal3D";

export function Specializations() {
  const gridRef = useRef<HTMLDivElement>(null);
  useStaggerReveal3D(gridRef, { variant: "flip", stagger: 0.08 });

  return (
    <HomeSection>
      <Reveal3D variant="left">
        <SectionHeader
          eyebrow="Our Expertise"
          title="Specializations"
          description="Beyond leisure travel, bespoke programs for every kind of journey you lead."
        />
      </Reveal3D>
      <div ref={gridRef} className="home-grid mt-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:grid-cols-5 [perspective:1400px]">
        {specializations.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} data-reveal-item className="[transform-style:preserve-3d]">
              <Tilt3DCard max={12}>
                <Link
                  href="/contact"
                  className="home-spec-card group glass block rounded-2xl border border-glass-border p-6 sm:p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/15">
                    <Icon size={20} className="text-gold" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-body text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                </Link>
              </Tilt3DCard>
            </div>
          );
        })}
      </div>
      <Reveal3D variant="scale" delay={0.08}>
        <HomeSectionActions>
          <MagneticButton as="a" href="/contact#consultation" variant="primary">
            Request a Custom Program
            <ArrowUpRight size={14} />
          </MagneticButton>
          <MagneticButton as="a" href="/travel-expert" variant="secondary">
            Meet Our Travel Experts
          </MagneticButton>
        </HomeSectionActions>
      </Reveal3D>
    </HomeSection>
  );
}
