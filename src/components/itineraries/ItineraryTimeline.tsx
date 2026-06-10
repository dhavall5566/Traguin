"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, Clock, X } from "lucide-react";
import type { ItineraryDay } from "@/types/itinerary";
import { cn } from "@/lib/utils";

type ItineraryTimelineProps = {
  days: ItineraryDay[];
  durationDays: number;
};

export function ItineraryTimeline({ days, durationDays }: ItineraryTimelineProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const detailInnerRef = useRef<HTMLDivElement>(null);
  const prevDayRef = useRef<number | null>(null);

  const selected = days.find((d) => d.day === selectedDay) ?? null;
  const isExpanded = selectedDay !== null;

  const selectDay = useCallback((dayNum: number) => {
    setSelectedDay((prev) => (prev === dayNum ? prev : dayNum));
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedDay(null);
    prevDayRef.current = null;
  }, []);

  useEffect(() => {
    if (!isExpanded || selectedDay === null) return;
    const selectedEl = sectionRef.current?.querySelector(
      '[data-day-card][aria-selected="true"]'
    );
    selectedEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedDay, isExpanded]);

  useGSAP(
    () => {
      const detail = detailRef.current;
      const inner = detailInnerRef.current;
      if (!detail || !inner || selectedDay === null) return;

      const isSwitch = prevDayRef.current !== null && prevDayRef.current !== selectedDay;
      prevDayRef.current = selectedDay;

      gsap.killTweensOf([detail, inner]);

      if (isSwitch) {
        gsap
          .timeline()
          .to(inner, {
            rotateY: 12,
            x: -24,
            opacity: 0,
            duration: 0.22,
            ease: "power2.in",
            transformPerspective: 1200,
            transformOrigin: "center right",
          })
          .set(inner, { rotateY: -72, x: 48, opacity: 0 })
          .to(inner, {
            rotateY: 0,
            x: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            transformPerspective: 1200,
            transformOrigin: "center right",
          });
      } else {
        gsap.fromTo(
          detail,
          { opacity: 0, height: 0 },
          { opacity: 1, height: "auto", duration: 0.35, ease: "power2.out" }
        );
        gsap.fromTo(
          inner,
          {
            rotateY: -78,
            x: 56,
            opacity: 0,
            scale: 0.94,
            transformPerspective: 1200,
            transformOrigin: "center right",
          },
          {
            rotateY: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.75,
            ease: "power3.out",
            transformPerspective: 1200,
            transformOrigin: "center right",
          }
        );
      }
    },
    { dependencies: [selectedDay], scope: sectionRef }
  );

  useGSAP(
    () => {
      if (!isExpanded) return;
      const items = sectionRef.current?.querySelectorAll("[data-day-card]");
      if (!items?.length) return;
      gsap.fromTo(
        items,
        { x: -28, opacity: 0.6 },
        { x: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "power2.out" }
      );
    },
    { dependencies: [isExpanded], scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="section-padding overflow-visible bg-surface">
      <div
        className={cn(
          "mx-auto transition-[max-width] duration-500",
          isExpanded ? "max-w-7xl" : "max-w-4xl"
        )}
      >
        <div className="text-center md:text-left">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">Your Journey</p>
          <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">Day-by-Day</h2>
          <p className="mt-2 text-sm text-muted">
            {durationDays} days · {days.length} carefully planned chapters
            {!isExpanded && (
              <span className="text-foreground/50"> · Tap a day to explore the full plan</span>
            )}
          </p>
        </div>

        <div
          className={cn(
            "mt-10",
            isExpanded &&
              "grid min-h-0 gap-6 lg:grid-cols-[minmax(260px,36%)_1fr] lg:items-start lg:gap-8"
          )}
        >
          {/* Day list — scrollable when taller than viewport; extra bottom padding so last day isn't clipped */}
          <ol
            className={cn(
              "flex flex-col gap-3 md:gap-4",
              isExpanded &&
                "lg:sticky lg:top-28 lg:min-h-0 lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto lg:overscroll-y-contain lg:pb-6 lg:pr-1"
            )}
            role="listbox"
            aria-label="Itinerary days"
          >
            {days.map((day) => (
              <DayListCard
                key={day.day}
                day={day}
                isSelected={selectedDay === day.day}
                isExpanded={isExpanded}
                onSelect={() => selectDay(day.day)}
              />
            ))}
          </ol>

          {/* Detail panel — right side with 3D entrance */}
          {isExpanded && selected && (
            <div
              ref={detailRef}
              className="min-h-[280px] [perspective:1200px] lg:min-h-[420px]"
              aria-live="polite"
            >
              <div
                ref={detailInnerRef}
                className="relative overflow-hidden rounded-2xl border border-gold/25 bg-glass shadow-[0_24px_80px_-20px_rgba(212,175,55,0.15)] [transform-style:preserve-3d] will-change-transform"
              >
                <button
                  type="button"
                  onClick={closeDetail}
                  className="absolute top-4 right-4 z-10 rounded-full p-2 text-muted transition-colors hover:bg-gold/10 hover:text-gold"
                  aria-label="Close day details"
                >
                  <X size={18} />
                </button>

                <div className="border-b border-gold/15 bg-gold/[0.06] px-6 py-8 md:px-10 md:py-10">
                  <p className="text-xs tracking-[0.3em] text-gold uppercase">Day {selected.day}</p>
                  <h3 className="mt-2 font-display text-2xl text-foreground md:text-4xl">
                    {selected.title}
                  </h3>
                  {selected.description && (
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                      {selected.description}
                    </p>
                  )}
                </div>

                <div className="px-6 py-8 md:px-10 md:py-10">
                  <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-gold uppercase">
                    <Clock size={14} />
                    Today&apos;s plan
                  </div>

                  {selected.activities.length > 0 ? (
                    <ul className="mt-6 space-y-4">
                      {selected.activities.map((activity, index) => {
                        const parsed = parseActivityLine(activity);
                        return (
                          <li
                            key={`${activity}-${index}`}
                            className="flex gap-4 rounded-xl border border-glass-border bg-surface/80 p-4 transition-colors hover:border-gold/20"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-sm text-gold">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0 flex-1 pt-1">
                              {parsed.label ? (
                                <>
                                  <p className="text-xs font-semibold tracking-wide text-gold uppercase">
                                    {parsed.label}
                                  </p>
                                  <p className="mt-1 font-display text-base leading-relaxed text-foreground md:text-lg">
                                    {parsed.detail}
                                  </p>
                                </>
                              ) : (
                                <p className="font-display text-base leading-relaxed text-foreground md:text-lg">
                                  {parsed.detail}
                                </p>
                              )}
                            </div>
                            <Check size={16} className="mt-2 shrink-0 text-gold/70" aria-hidden />
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-muted">Leisure day — pace set by you.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type DayListCardProps = {
  day: ItineraryDay;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
};

function parseActivityLine(activity: string) {
  const colonIndex = activity.indexOf(":");
  if (colonIndex > 0 && colonIndex <= 48) {
    return {
      label: activity.slice(0, colonIndex).trim(),
      detail: activity.slice(colonIndex + 1).trim(),
    };
  }
  return { label: null, detail: activity };
}

function DayListCard({ day, isSelected, isExpanded, onSelect }: DayListCardProps) {
  return (
    <li data-day-card role="option" aria-selected={isSelected}>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full overflow-hidden rounded-2xl border text-left transition-all duration-300",
          "border-glass-border bg-glass hover:border-gold/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
          isSelected && isExpanded && "border-gold/40 shadow-[0_0_0_1px_rgba(212,175,55,0.2)]",
          isExpanded ? "items-center" : "flex-col sm:flex-row"
        )}
      >
        <div
          className={cn(
            "flex shrink-0 flex-col items-center justify-center border-gold/15 bg-gold/[0.06]",
            isExpanded
              ? "w-[4.25rem] border-r py-4 md:w-20"
              : "w-full border-b py-5 sm:w-[4.25rem] sm:border-b-0 sm:border-r md:w-24 md:py-6"
          )}
        >
          <span className="text-[9px] font-medium tracking-[0.25em] text-gold/80 uppercase md:text-[10px]">
            Day
          </span>
          <span className="font-display text-2xl leading-none text-gold md:text-4xl">
            {String(day.day).padStart(2, "0")}
          </span>
        </div>

        <div
          className={cn(
            "min-w-0 flex-1",
            isExpanded ? "px-4 py-3.5 md:px-5" : "px-4 py-4 md:px-7 md:py-5"
          )}
        >
          <h3
            className={cn(
              "font-display leading-tight text-foreground",
              isExpanded ? "text-base md:text-lg" : "text-lg md:text-xl"
            )}
          >
            {day.title}
          </h3>
          {!isExpanded && day.activities.length > 0 && (
            <p className="mt-3 text-[10px] tracking-wide text-gold/80 uppercase md:text-[11px]">
              {day.activities.length} activities · Tap to view
            </p>
          )}
        </div>
      </button>
    </li>
  );
}
