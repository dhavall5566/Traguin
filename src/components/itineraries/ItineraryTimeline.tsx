"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Check, ChevronRight, Sparkles, X } from "lucide-react";
import type { ItineraryDay } from "@/types/itinerary";
import { cn } from "@/lib/utils";

type ItineraryTimelineProps = {
  days: ItineraryDay[];
  durationDays: number;
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const PANEL_MS = 600;
const FLIP_PERSPECTIVE = 1200;
const FLIP_ORIGIN = "center right";

export function ItineraryTimeline({ days, durationDays }: ItineraryTimelineProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [displayedDay, setDisplayedDay] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const isSwitchingRef = useRef(false);

  const selected = days.find((d) => d.day === displayedDay) ?? null;
  const hasSelection = selectedDay !== null;

  const selectDay = useCallback((dayNum: number) => {
    if (isClosing) return;
    setSelectedDay((prev) => {
      if (prev === dayNum) return prev;
      if (prev === null) setDisplayedDay(dayNum);
      return dayNum;
    });
  }, [isClosing]);

  const closeDetail = useCallback(() => {
    if (selectedDay === null || isClosing) return;
    setIsClosing(true);
    setPanelOpen(false);
    window.setTimeout(() => {
      setSelectedDay(null);
      setDisplayedDay(null);
      setIsClosing(false);
    }, PANEL_MS);
  }, [selectedDay, isClosing]);

  useEffect(() => {
    if (!hasSelection) {
      setPanelOpen(false);
      return;
    }
    setPanelOpen(false);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setPanelOpen(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [hasSelection]);

  useEffect(() => {
    if (!hasSelection || selectedDay === null) return;
    const el = sectionRef.current?.querySelector('[data-nav-day][aria-current="true"]');
    el?.scrollIntoView({ block: "nearest", behavior: "smooth", inline: "nearest" });
  }, [selectedDay, hasSelection]);

  useEffect(() => {
    if (selectedDay === null || displayedDay === null) return;
    if (selectedDay === displayedDay || isSwitchingRef.current) return;

    const panel = detailPanelRef.current;
    if (!panel) {
      setDisplayedDay(selectedDay);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isSwitchingRef.current = true;
    gsap.killTweensOf(panel);

    const flipIn = (target: HTMLDivElement) => {
      gsap.killTweensOf(target);
      gsap.set(target, {
        rotateY: -68,
        x: 44,
        opacity: 0,
        transformPerspective: FLIP_PERSPECTIVE,
        transformOrigin: FLIP_ORIGIN,
      });
      gsap.to(target, {
        rotateY: 0,
        x: 0,
        opacity: 1,
        duration: prefersReducedMotion ? 0.32 : 0.58,
        ease: "power3.out",
        transformPerspective: FLIP_PERSPECTIVE,
        transformOrigin: FLIP_ORIGIN,
        onComplete: () => {
          isSwitchingRef.current = false;
        },
      });
    };

    if (prefersReducedMotion) {
      gsap.to(panel, {
        opacity: 0,
        y: -10,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          setDisplayedDay(selectedDay);
          requestAnimationFrame(() => {
            const next = detailPanelRef.current;
            if (!next) {
              isSwitchingRef.current = false;
              return;
            }
            gsap.set(next, { opacity: 0, y: 12 });
            gsap.to(next, {
              opacity: 1,
              y: 0,
              duration: 0.34,
              ease: "power3.out",
              onComplete: () => {
                isSwitchingRef.current = false;
              },
            });
          });
        },
      });
      return;
    }

    gsap.to(panel, {
      rotateY: 10,
      x: -22,
      opacity: 0,
      duration: 0.24,
      ease: "power2.in",
      transformPerspective: FLIP_PERSPECTIVE,
      transformOrigin: FLIP_ORIGIN,
      onComplete: () => {
        setDisplayedDay(selectedDay);
        requestAnimationFrame(() => {
          const next = detailPanelRef.current;
          if (!next) {
            isSwitchingRef.current = false;
            return;
          }
          flipIn(next);
        });
      },
    });
  }, [selectedDay, displayedDay]);

  return (
    <section ref={sectionRef} className="section-padding bg-surface">
      <div className="mx-auto max-w-6xl">
        <header className="text-center md:text-left">
          <p className="text-xs tracking-[0.35em] text-gold uppercase">Your Journey</p>
          <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl lg:text-5xl">
            Day-by-Day
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            {durationDays} days · {days.length} curated chapters
            {!hasSelection && (
              <span className="text-foreground/45"> · Select a day to unfold the full plan</span>
            )}
          </p>
        </header>

        <div
          className={cn(
            "mt-12 flex flex-col gap-8 lg:mt-14",
            hasSelection && "lg:flex-row lg:items-start lg:gap-10 xl:gap-14"
          )}
        >
          {/* Day navigator */}
          <nav
            className={cn(
              "shrink-0 transition-[width] duration-[600ms]",
              hasSelection && "lg:sticky lg:top-28 lg:w-72 xl:w-80"
            )}
            style={{ transitionTimingFunction: EASE }}
            aria-label="Itinerary days"
          >
            {hasSelection ? (
              <>
                {/* Mobile: horizontal pills when a day is open */}
                <div
                  className={cn(
                    "flex gap-2 overflow-x-auto pb-1 lg:hidden",
                    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  )}
                  role="tablist"
                >
                  {days.map((day) => (
                    <DayPill
                      key={day.day}
                      day={day}
                      isActive={selectedDay === day.day}
                      onSelect={() => selectDay(day.day)}
                    />
                  ))}
                </div>

                {/* Desktop: chapter index rail */}
                <ol className="hidden lg:flex lg:flex-col lg:gap-2.5" role="tablist">
                  {days.map((day) => (
                    <DayRailItem
                      key={day.day}
                      day={day}
                      isActive={selectedDay === day.day}
                      onSelect={() => selectDay(day.day)}
                    />
                  ))}
                </ol>
              </>
            ) : (
              <ol className="flex flex-col gap-3">
                {days.map((day, index) => (
                  <DayBrowseCard
                    key={day.day}
                    day={day}
                    index={index}
                    onSelect={() => selectDay(day.day)}
                  />
                ))}
              </ol>
            )}
          </nav>

          {/* Detail stage — only when a day is selected */}
          {hasSelection && selected && (
            <div className="min-w-0 flex-1">
              <article
                className={cn(
                  "relative overflow-hidden rounded-3xl border border-gold/20 bg-glass shadow-[0_32px_80px_-24px_rgba(212,175,55,0.18)] [perspective:1200px]",
                  "transition-[opacity,transform] duration-[600ms]",
                  panelOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                  isClosing && "pointer-events-none"
                )}
                style={{ transitionTimingFunction: EASE }}
                aria-live="polite"
              >
                <button
                  type="button"
                  onClick={closeDetail}
                  className="absolute top-4 right-4 z-20 rounded-full p-2 text-muted transition-colors hover:bg-gold/10 hover:text-gold md:top-5 md:right-5"
                  aria-label="Close day details"
                >
                  <X size={18} />
                </button>

                <div
                  ref={detailPanelRef}
                  className="[transform-style:preserve-3d] will-change-transform"
                >
                  <div className="relative border-b border-gold/10 bg-gradient-to-br from-gold/[0.08] via-transparent to-transparent px-6 py-6 md:px-10 md:py-7">
                    <div className="pr-10">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[10px] tracking-[0.25em] text-gold uppercase">
                          <Sparkles size={11} />
                          Day {String(selected.day).padStart(2, "0")}
                        </span>
                        {selected.activities.length > 0 && (
                          <span className="text-xs text-muted">
                            {selected.activities.length} moments planned
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 font-display text-2xl leading-tight text-foreground md:text-4xl lg:text-[2.75rem]">
                        {selected.title}
                      </h3>

                      {selected.description && (
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                          {selected.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-8 md:px-10 md:py-10">
                    <p className="text-xs tracking-[0.3em] text-gold uppercase">Today&apos;s plan</p>

                    {selected.activities.length > 0 ? (
                      <ul className="mt-6 space-y-3">
                        {selected.activities.map((activity, index) => {
                          const parsed = parseActivityLine(activity);
                          return (
                            <li
                              key={`${activity}-${index}`}
                              className="group flex gap-4 rounded-2xl border border-glass-border bg-surface/50 p-4 transition-colors duration-300 hover:border-gold/25 hover:bg-surface/80 md:p-5"
                            >
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 font-display text-sm text-gold transition-colors group-hover:bg-gold/20">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <div className="min-w-0 flex-1 pt-0.5">
                                {parsed.label ? (
                                  <>
                                    <p className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">
                                      {parsed.label}
                                    </p>
                                    <p className="mt-1.5 font-display text-base leading-relaxed text-foreground md:text-lg">
                                      {parsed.detail}
                                    </p>
                                  </>
                                ) : (
                                  <p className="font-display text-base leading-relaxed text-foreground md:text-lg">
                                    {parsed.detail}
                                  </p>
                                )}
                              </div>
                              <Check
                                size={16}
                                className="mt-2 shrink-0 text-gold/50 transition-colors group-hover:text-gold"
                                aria-hidden
                              />
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-4 text-sm text-muted">Leisure day — pace set by you.</p>
                    )}
                  </div>
                </div>
              </article>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type DayPillProps = {
  day: ItineraryDay;
  isActive: boolean;
  onSelect: () => void;
};

function DayPill({ day, isActive, onSelect }: DayPillProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-nav-day
      aria-current={isActive ? "true" : undefined}
      onClick={onSelect}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2.5 transition-all duration-500",
        isActive
          ? "border-gold/50 bg-gold/15 text-gold shadow-[0_0_20px_-4px_rgba(212,175,55,0.4)]"
          : "border-glass-border bg-glass text-muted hover:border-gold/30 hover:text-foreground"
      )}
      style={{ transitionTimingFunction: EASE }}
    >
      <span className="text-[10px] tracking-[0.2em] uppercase">Day</span>
      <span className="ml-1.5 font-display text-base">{String(day.day).padStart(2, "0")}</span>
    </button>
  );
}

type DayRailItemProps = {
  day: ItineraryDay;
  isActive: boolean;
  onSelect: () => void;
};

function DayRailItem({ day, isActive, onSelect }: DayRailItemProps) {
  return (
    <li>
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        data-nav-day
        aria-current={isActive ? "true" : undefined}
        onClick={onSelect}
        className={cn(
          "group relative flex w-full items-stretch overflow-hidden rounded-2xl border text-left transition-all duration-500",
          isActive
            ? "border-gold/35 bg-gold/[0.08] shadow-[0_12px_32px_-20px_rgba(212,175,55,0.45)]"
            : "border-glass-border/80 bg-glass/40 hover:border-gold/25 hover:bg-gold/[0.04]"
        )}
        style={{ transitionTimingFunction: EASE }}
      >
        <span
          className={cn(
            "absolute inset-y-2 left-0 w-1 rounded-r-full transition-all duration-500",
            isActive ? "bg-gold" : "bg-gold/25 group-hover:bg-gold/45"
          )}
          aria-hidden
        />

        <span
          className={cn(
            "flex w-[4.5rem] shrink-0 flex-col items-center justify-center border-r py-4 transition-colors duration-500",
            isActive
              ? "border-gold/20 bg-gold/10"
              : "border-gold/10 bg-gold/[0.03] group-hover:border-gold/18"
          )}
          style={{ transitionTimingFunction: EASE }}
        >
          <span
            className={cn(
              "text-[9px] font-bold tracking-[0.32em] uppercase transition-colors duration-500",
              isActive ? "text-gold" : "text-gold/80 group-hover:text-gold"
            )}
          >
            Day
          </span>
          <span
            className={cn(
              "mt-1 font-display text-[1.75rem] font-bold leading-none transition-colors duration-500",
              isActive ? "text-gold" : "text-gold/85 group-hover:text-gold"
            )}
          >
            {String(day.day).padStart(2, "0")}
          </span>
        </span>

        <span className="flex min-w-0 flex-1 items-center py-3.5 pr-3 pl-1">
          <span
            className={cn(
              "line-clamp-2 font-display text-[0.9375rem] leading-snug transition-colors duration-500 md:text-base",
              isActive ? "font-semibold text-foreground" : "font-medium text-foreground/78 group-hover:text-foreground/92"
            )}
          >
            {day.title}
          </span>
        </span>
      </button>
    </li>
  );
}

type DayBrowseCardProps = {
  day: ItineraryDay;
  index: number;
  onSelect: () => void;
};

function DayBrowseCard({ day, index, onSelect }: DayBrowseCardProps) {
  return (
    <li
      className="animate-fade-in opacity-0"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <button
        type="button"
        onClick={onSelect}
        className="group flex w-full items-center gap-5 rounded-2xl border border-glass-border bg-glass p-5 text-left transition-all duration-500 hover:border-gold/35 hover:bg-gold/[0.04] hover:shadow-[0_16px_48px_-20px_rgba(212,175,55,0.2)]"
        style={{ transitionTimingFunction: EASE }}
      >
        <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-gold/20 bg-gold/[0.06]">
          <span className="text-[9px] tracking-[0.2em] text-gold/70 uppercase">Day</span>
          <span className="font-display text-2xl leading-none text-gold">
            {String(day.day).padStart(2, "0")}
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg text-foreground transition-colors group-hover:text-gold md:text-xl">
            {day.title}
          </h3>
          {day.activities.length > 0 && (
            <p className="mt-1.5 text-xs tracking-wide text-muted">
              {day.activities.length} moments · View plan
            </p>
          )}
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/20 text-gold transition-all duration-300 group-hover:border-gold/40 group-hover:bg-gold/10">
          <ChevronRight size={16} />
        </span>
      </button>
    </li>
  );
}

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
