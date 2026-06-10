"use client";

import { useRef, useEffect, useState } from "react";
import { valueProps } from "@/data/valueProps";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

export function WhyTraguin() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-[clamp(1.5rem,5vw,4rem)] pb-[clamp(4rem,10vw,8rem)] pt-6"
    >
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          title="Why TRAGUIN"
          description="Crafting extraordinary journeys since 2024."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {valueProps.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={cn(
                  "glass group rounded-2xl border border-glass-border p-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-gold/30",
                  revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                style={{ transitionDelay: revealed ? `${i * 100}ms` : "0ms" }}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 transition-colors group-hover:bg-gold/20">
                  <Icon size={24} className="text-gold" />
                </div>
                <h3 className="font-body text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
