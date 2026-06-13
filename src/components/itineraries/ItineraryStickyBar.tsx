"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import type { Itinerary } from "@/types/itinerary";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { itineraryPrimaryCta } from "@/data/site";

type ItineraryStickyBarProps = {
  itinerary: Itinerary;
  whatsappHref: string;
};

export function ItineraryStickyBar({ itinerary, whatsappHref }: ItineraryStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, rotateX: 18, opacity: 0 }}
          animate={{ y: 0, rotateX: 0, opacity: 1 }}
          exit={{ y: 80, rotateX: 12, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1200, transformOrigin: "center bottom" }}
          className="itinerary-sticky-bar fixed inset-x-0 bottom-0 z-40 border-t border-glass-border bg-surface/92 px-4 py-3 backdrop-blur-xl sm:px-6 [transform-style:preserve-3d]"
        >
          <div className="site-container flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-sm text-foreground sm:text-base">{itinerary.title}</p>
              <div className="mt-0.5 hidden sm:block">
                <PriceDisplay amount={itinerary.startingPrice} label="From" size="sm" />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <MagneticButton as="a" href={whatsappHref} variant="secondary" className="!px-3 !py-2.5 sm:!px-4">
                <MessageCircle size={16} className="sm:mr-1.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </MagneticButton>
              <MagneticButton as="a" href="#inquiry" variant="primary" className="!px-4 !py-2.5 !text-xs">
                {itineraryPrimaryCta.label}
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
