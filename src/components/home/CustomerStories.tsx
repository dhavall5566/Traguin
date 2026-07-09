"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SafeImage } from "@/components/ui/SafeImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HomeSection, HomeSectionActions } from "@/components/home/HomeSection";
import { primaryCta } from "@/data/site";
import { cn } from "@/lib/utils";
import type { HomeTestimonial } from "@/lib/api/homepage";
import { getMotionLite } from "@/lib/motion-profile";
import { useMotionLite } from "@/hooks/useMotionLite";

const AUTO_ADVANCE_MS = 4000;

export function CustomerStories({ testimonials }: { testimonials: HomeTestimonial[] }) {
  const motionLite = useMotionLite();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const directionRef = useRef(1);
  const prevIndexRef = useRef(-1);
  const innerRef = useRef<HTMLDivElement>(null);
  const story = testimonials[index];

  const goTo = useCallback((nextIndex: number, direction: number) => {
    if (nextIndex === index) return;
    directionRef.current = direction;
    setIndex(nextIndex);
  }, [index]);

  const prev = useCallback(() => {
    const nextIndex = index === 0 ? testimonials.length - 1 : index - 1;
    goTo(nextIndex, -1);
  }, [goTo, index]);

  const next = useCallback(() => {
    const nextIndex = index === testimonials.length - 1 ? 0 : index + 1;
    goTo(nextIndex, 1);
  }, [goTo, index]);

  useEffect(() => {
    if (getMotionLite() || paused || testimonials.length <= 1) return;
    const timer = window.setInterval(next, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused, next, testimonials.length]);

  useGSAP(
    () => {
      if (motionLite) return;

      const inner = innerRef.current;
      if (!inner) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const isFirst = prevIndexRef.current === -1;
      const isSwitch = !isFirst && prevIndexRef.current !== index;

      if (!isFirst && !isSwitch) return;

      gsap.killTweensOf(inner);

      if (prefersReducedMotion || motionLite) {
        gsap.set(inner, { clearProps: "all", opacity: 1 });
        prevIndexRef.current = index;
        return;
      }

      if (isSwitch) {
        gsap
          .timeline()
          .to(inner, {
            opacity: 0,
            y: 8,
            duration: 0.2,
            ease: "power2.in",
          })
          .set(inner, {
            y: -8,
          })
          .to(inner, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          });
      } else {
        gsap.fromTo(
          inner,
          {
            opacity: 0,
            y: 12,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
          }
        );
      }

      prevIndexRef.current = index;
    },
    { dependencies: [index, motionLite] }
  );

  if (testimonials.length === 0) return null;

  return (
    <HomeSection>
      <SectionHeader
        eyebrow="Client Stories"
        title="Journeys That Inspire"
        description="Real experiences from travelers who entrusted us with their most meaningful moments."
      />

      <div
        className="relative mt-10 lg:mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="w-full">
            <article
              className="glass overflow-hidden rounded-2xl border border-gold/20 shadow-[0_16px_48px_-20px_rgba(206,169,50,0.14)]"
              aria-live="polite"
              aria-atomic="true"
            >
              <div ref={innerRef} className="px-8 py-10 md:px-12 md:py-12">
                <blockquote className="text-base leading-relaxed text-foreground md:text-lg">
                  &ldquo;{story.quote.replace(/^[“"']+|[”"']+$/g, "").trim()}&rdquo;
                </blockquote>
                <footer className="mt-8 flex items-center gap-4 pt-2">
                  {story.image ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <SafeImage
                        src={story.image}
                        alt={story.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold"
                      aria-hidden
                    >
                      {story.name.trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{story.name}</p>
                    {story.destination ? (
                      <p className="mt-1 text-sm text-gold">{story.destination}</p>
                    ) : null}
                  </div>
                </footer>
              </div>
            </article>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full glass transition-colors hover:border-gold/40"
              aria-label="Previous story"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2" role="tablist" aria-label="Client stories">
              {testimonials.map((t, i) => (
                <button
                  key={`${t.id}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-8 bg-gold" : "w-2 bg-glass-border hover:bg-gold/40"
                  )}
                  aria-label={`View story ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full glass transition-colors hover:border-gold/40"
              aria-label="Next story"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      <HomeSectionActions className="!mt-10 lg:!mt-12">
        <MagneticButton as="a" href={primaryCta.href} variant="primary">
          Plan Your Journey
          <ArrowUpRight size={14} />
        </MagneticButton>
        <MagneticButton as="a" href="/client-stories" variant="secondary">
          Read All Stories
          <ArrowUpRight size={14} />
        </MagneticButton>
      </HomeSectionActions>
    </HomeSection>
  );
}
