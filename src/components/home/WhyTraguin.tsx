"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { stats } from "@/data/moods";
import { formatNumber, cn } from "@/lib/utils";
import { Globe, Award, Users, Calendar } from "lucide-react";

const icons = [Globe, Award, Users, Calendar];

export function WhyTraguin() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setRevealed(true);
      setCounts(stats.map((s) => s.value));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCounts(stats.map((s) => s.value));
      return;
    }

    const tweens = stats.map((stat, i) => {
      const obj = { value: 0 };
      return gsap.to(obj, {
        value: stat.value,
        duration: 2.5,
        ease: "power2.out",
        delay: i * 0.08,
        onUpdate: () => {
          setCounts((prev) => {
            const next = [...prev];
            next[i] = Math.round(obj.value);
            return next;
          });
        },
      });
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [revealed]);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <FloatingIcons />

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">Our Legacy</p>
          <h2 className="font-display text-4xl text-foreground md:text-6xl">
            Why Traguin
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Eighteen years of crafting journeys that transcend ordinary travel.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = icons[i];
            return (
              <div
                key={stat.label}
                className={cn(
                  "stat-card glass group rounded-2xl p-8 text-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold/30",
                  revealed ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: revealed ? `${i * 120}ms` : "0ms" }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 transition-colors group-hover:bg-gold/20">
                  <Icon size={24} className="text-gold" />
                </div>
                <p className="font-display text-4xl text-gold md:text-5xl">
                  {formatNumber(counts[i])}
                  {stat.suffix}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse text-gold/30"
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 15}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <Globe size={20 + i * 4} />
        </div>
      ))}
    </div>
  );
}
