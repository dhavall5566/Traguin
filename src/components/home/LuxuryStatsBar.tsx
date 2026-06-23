"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HomeSection } from "@/components/home/HomeSection";
import type { HomeStat } from "@/lib/api/homepage";

gsap.registerPlugin(ScrollTrigger);

function StatItem({
  stat,
  active,
}: {
  stat: HomeStat;
  active: boolean;
}) {
  const decimals = stat.decimals ?? 0;
  const display = useCountUp(stat.value, active, 1400, decimals);

  return (
    <div className="flex flex-col items-center gap-1 px-4 py-2 text-center sm:px-6">
      <p className="font-display text-3xl leading-none tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
        {display}
        <span className="text-gold">{stat.suffix}</span>
      </p>
      <p className="text-[10px] tracking-[0.22em] text-muted uppercase sm:text-[11px]">
        {stat.label}
      </p>
    </div>
  );
}

function useCountUp(
  target: number,
  active: boolean,
  duration = 1400,
  decimals = 0
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, duration, target]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
}

export function LuxuryStatsBar({ stats }: { stats: HomeStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const strip = stripRef.current;
      if (!strip) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.fromTo(
        strip,
        { y: 40, rotateX: 18, opacity: 0, transformPerspective: 1100 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: strip, start: "top 92%", once: true },
        }
      );

      const cells = strip.querySelectorAll("[data-stat-cell]");
      gsap.fromTo(
        cells,
        { y: 28, rotateY: -10, opacity: 0, transformPerspective: 900 },
        {
          y: 0,
          rotateY: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: strip, start: "top 90%", once: true },
        }
      );
    },
    { scope: ref }
  );

  if (stats.length === 0) return null;

  return (
    <HomeSection
      spacing="compact"
      tone="muted"
      className="relative border-y border-glass-border"
      aria-label="TRAGUIN at a glance"
    >
      <div ref={ref} className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
      <div
        ref={stripRef}
        className="grid grid-cols-2 divide-x divide-glass-border [transform-style:preserve-3d] md:grid-cols-4"
      >
        {stats.map((stat) => (
          <div key={stat.id} data-stat-cell className="[transform-style:preserve-3d]">
            <StatItem stat={stat} active={active} />
          </div>
        ))}
      </div>
    </HomeSection>
  );
}
