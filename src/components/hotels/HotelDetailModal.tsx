"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Hotel } from "@/types";
import { HotelDetailContent } from "@/components/hotels/HotelDetailContent";
import { useModalScrollLock } from "@/lib/use-modal-scroll-lock";

type HotelDetailModalProps = {
  hotel: Hotel;
  allHotels?: Hotel[];
  onClose: () => void;
  onSelectHotel?: (hotel: Hotel) => void;
};

export function HotelDetailModal({
  hotel,
  allHotels,
  onClose,
  onSelectHotel,
}: HotelDetailModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useModalScrollLock(true);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [hotel.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden bg-background/90 p-0 backdrop-blur-md sm:items-center sm:p-4 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotel-detail-title"
      data-lenis-prevent
    >
      <div
        className="relative flex max-h-[94vh] min-h-0 w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-gold/20 bg-surface shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full p-2 glass transition-colors hover:text-gold"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]"
          data-lenis-prevent
        >
          <HotelDetailContent
            hotel={hotel}
            allHotels={allHotels}
            onSelectHotel={onSelectHotel}
            similarLinkMode="select"
          />
        </div>
      </div>
    </div>
  );
}
