"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "@/data/moods";
import { formatNumber } from "@/lib/utils";
import { Globe, Award, Users, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const icons = [Globe, Award, Users, Calendar];

export function WhyTraguin() {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const ctx = gsap.context(() => {
      stats.forEach((stat, i) => {
        const obj = { value: 0 };
        gsap.to(obj, {
          value: stat.value,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
          onUpdate: () => {
            setCounts((prev) => {
              const next = [...prev];
              next[i] = Math.round(obj.value);
              return next;
            });
          },
        });
      });

      gsap.from(".stat-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
                className="stat-card glass group rounded-2xl p-8 text-center transition-all duration-500 hover:border-gold/30"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 transition-colors group-hover:bg-gold/20">
                  <Icon size={24} className="text-gold" />
                </div>
                <p className="font-display text-4xl text-gold md:text-5xl">
                  {formatNumber(counts[i])}{stat.suffix}
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
