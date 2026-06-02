"use client";

import { testimonials } from "@/data/moods";

const marqueeItems = [...testimonials, ...testimonials];

export function CustomerStories() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="mb-4 text-xs tracking-[0.3em] text-gold uppercase">Testimonials</p>
          <h2 className="font-display text-4xl text-foreground md:text-6xl">
            Customer Stories
          </h2>
        </div>
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-24" />

        <div className="customer-stories-track flex w-max gap-6 px-6 md:px-12">
          {marqueeItems.map((story, i) => (
            <article
              key={`${story.id}-${i}`}
              className="glass w-[min(85vw,22rem)] shrink-0 rounded-2xl border border-glass-border p-6 md:w-96 md:p-8"
            >
              <div className="mb-4 h-1 w-8 rounded-full bg-gold/60" />
              <blockquote className="text-sm leading-relaxed text-foreground md:text-base">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 border-t border-glass-border pt-4">
                <p className="font-medium text-foreground">{story.name}</p>
                <p className="mt-1 text-xs tracking-wide text-gold uppercase">
                  {story.destination}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
