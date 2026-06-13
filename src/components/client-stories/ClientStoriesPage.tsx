"use client";

import { testimonials } from "@/data/moods";
<<<<<<< HEAD
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { primaryCta, secondaryCta } from "@/data/site";

export function ClientStoriesPage() {
  return (
    <div className="pb-16 md:pb-20 pt-12 md:pt-8">
      <div className="page-x-padding">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            align="left"
            eyebrow="Testimonials"
            title="Client Stories"
            description="Gallery of journeys, reviews, and case studies from travelers who chose TRAGUIN."
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <MagneticButton as="a" href={primaryCta.href} variant="primary" className="!text-xs">
              {primaryCta.label}
            </MagneticButton>
            <MagneticButton as="a" href={secondaryCta.href} variant="secondary" className="!text-xs">
              {secondaryCta.label}
            </MagneticButton>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {testimonials.map((t) => (
              <div key={t.id} className="relative aspect-square overflow-hidden rounded-xl">
                <SafeImage src={t.image} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent p-3 flex flex-col justify-end">
                  <p className="text-xs font-medium text-foreground">{t.destination}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {testimonials.map((story) => (
              <article key={story.id} className="glass rounded-2xl border border-glass-border p-6 md:p-8">
                <blockquote className="text-sm leading-relaxed text-foreground md:text-base">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <footer className="mt-6 flex items-center gap-4 border-t border-glass-border pt-6">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <SafeImage src={story.image} alt={story.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{story.name}</p>
                    <p className="text-xs text-gold">{story.destination} · {story.tripType}</p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
=======
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/layout/PageHero";
import { TrustBar } from "@/components/layout/TrustBar";
import { PageCTA } from "@/components/layout/PageCTA";
import { SafeImage } from "@/components/ui/SafeImage";
import { pageHeroes } from "@/data/pageContent";

export function ClientStoriesPage() {
  return (
    <>
      <PageHero {...pageHeroes.clientStories} />
      <TrustBar />
      <PageShell noPaddingTop>
        <div className="page-content-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.id} className="relative aspect-square overflow-hidden rounded-xl">
              <SafeImage src={t.image} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 to-transparent p-3">
                <p className="text-xs font-medium text-foreground">{t.destination}</p>
                <p className="text-[10px] text-muted">{t.tripType}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="page-content-grid mt-16 md:grid-cols-2">
          {testimonials.map((story) => (
            <article key={story.id} className="glass rounded-2xl border border-glass-border p-6 md:p-8">
              <blockquote className="text-sm leading-relaxed text-foreground md:text-base">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 flex items-center gap-4 border-t border-glass-border pt-6">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <SafeImage src={story.image} alt={story.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{story.name}</p>
                  <p className="text-xs text-gold">
                    {story.destination} · {story.tripType}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>

        <PageCTA />
      </PageShell>
    </>
>>>>>>> dhaval
  );
}
