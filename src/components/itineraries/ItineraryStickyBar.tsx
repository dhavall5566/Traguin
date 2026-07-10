"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import type { Itinerary } from "@/types/itinerary";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { itineraryPrimaryCta } from "@/data/site";
import { buildPlanMyJourneyHref } from "@/lib/plan-my-journey";

type ItineraryStickyBarProps = {
  itinerary: Itinerary;
  whatsappHref: string;
};

export function ItineraryStickyBar({ itinerary, whatsappHref }: ItineraryStickyBarProps) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const bar = barRef.current;

    if (!visible || !bar) {
      root.classList.remove("itinerary-sticky-active");
      root.style.removeProperty("--itinerary-sticky-bar-height");
      return;
    }

    root.classList.add("itinerary-sticky-active");

    const syncHeight = () => {
      root.style.setProperty("--itinerary-sticky-bar-height", `${bar.offsetHeight}px`);
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(bar);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
      root.classList.remove("itinerary-sticky-active");
      root.style.removeProperty("--itinerary-sticky-bar-height");
    };
  }, [visible]);

  const planHref = buildPlanMyJourneyHref({
    itinerary_id: itinerary.cmsId,
    itinerary_slug: itinerary.slug,
    itinerary_title: itinerary.title,
    destination: itinerary.destination,
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={barRef}
          initial={{ y: 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 72, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="itinerary-sticky-bar fixed inset-x-0 bottom-0 z-40 border-t border-glass-border bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:px-6"
        >
          <div className="site-container flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-sm text-foreground sm:text-base">{itinerary.title}</p>
              <div className="mt-0.5 hidden sm:block">
                <PriceDisplay amount={itinerary.startingPrice} label="Onwards" size="sm" />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <MagneticButton as="a" href={whatsappHref} variant="secondary" className="!px-3 !py-2.5 sm:!px-4">
                <WhatsAppIcon size={16} className="sm:mr-1.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </MagneticButton>
              <MagneticButton as="a" href={planHref} variant="primary" className="!px-4 !py-2.5 !text-xs">
                {itineraryPrimaryCta.label}
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
