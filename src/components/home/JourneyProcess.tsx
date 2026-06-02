"use client";

import {
  Compass,
  MessageCircle,
  Sliders,
  CheckCircle,
  Plane,
  HeartHandshake,
} from "lucide-react";
import { journeySteps } from "@/data/moods";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  compass: Compass,
  "message-circle": MessageCircle,
  sliders: Sliders,
  "check-circle": CheckCircle,
  plane: Plane,
  "heart-handshake": HeartHandshake,
};

export function JourneyProcess() {
  return (
    <section className="section-padding relative bg-surface">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">How It Works</p>
          <h2 className="font-display text-4xl text-foreground md:text-6xl">
            The Journey Process
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {journeySteps.map((step, i) => {
          const Icon = iconMap[step.icon] || Compass;
          return (
            <div key={step.id} className="group relative">
              <div className="glass h-full rounded-2xl p-8 transition-all duration-500 group-hover:border-gold/30 group-hover:-translate-y-2">
                <span className="text-xs tracking-[0.2em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="my-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-gold/20">
                  <Icon size={28} className="text-gold" />
                </div>
                <h3 className="font-display text-2xl text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
