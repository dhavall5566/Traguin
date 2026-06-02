"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  MessageCircle,
  Sliders,
  CheckCircle,
  Plane,
  HeartHandshake,
} from "lucide-react";
import { journeySteps } from "@/data/moods";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  compass: Compass,
  "message-circle": MessageCircle,
  sliders: Sliders,
  "check-circle": CheckCircle,
  plane: Plane,
  "heart-handshake": HeartHandshake,
};

export function JourneyProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 80),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          pin: true,
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-surface">
      <div className="section-padding pb-8">
        <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">How It Works</p>
        <h2 className="font-display text-4xl text-foreground md:text-6xl">
          The Journey Process
        </h2>
      </div>

      <div ref={trackRef} className="flex gap-8 px-6 pb-16 md:px-12">
        {journeySteps.map((step, i) => {
          const Icon = iconMap[step.icon] || Compass;
          return (
            <div
              key={step.id}
              className="group relative w-[300px] shrink-0 md:w-[350px]"
            >
              <div className="glass rounded-2xl p-8 transition-all duration-500 group-hover:border-gold/30 group-hover:-translate-y-2">
                <span className="text-xs tracking-[0.2em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="my-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 transition-all duration-500 group-hover:bg-gold/20 group-hover:scale-110">
                  <Icon size={28} className="text-gold" />
                </div>
                <h3 className="font-display text-2xl text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
