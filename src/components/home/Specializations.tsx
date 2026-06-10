"use client";

import Link from "next/link";
import { specializations } from "@/data/specializations";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Specializations() {
  return (
    <section className="relative px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,8vw,5rem)]">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Our Expertise"
          title="Specializations"
          description="Beyond leisure travel — bespoke programs for every kind of journey you lead."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {specializations.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href="/contact"
                className="group glass rounded-2xl border border-glass-border p-6 transition-colors hover:border-gold/35"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/15">
                  <Icon size={20} className="text-gold" aria-hidden />
                </div>
                <h3 className="mt-4 font-body text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
