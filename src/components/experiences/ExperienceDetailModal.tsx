"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { ExperienceDetail } from "@/data/experienceDetails";
import { ExperienceDetailModalContent } from "@/components/experiences/ExperienceDetailModalContent";
import { useModalScrollLock } from "@/lib/use-modal-scroll-lock";

type ExperienceDetailModalProps = {
  experience: ExperienceDetail;
  onClose: () => void;
};

export function ExperienceDetailModal({ experience, onClose }: ExperienceDetailModalProps) {
  useModalScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/55 p-2 backdrop-blur-[10px] sm:p-3 md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="experience-detail-title"
      data-lenis-prevent
    >
      <div
        className="relative flex h-[min(96dvh,100%)] w-full max-w-[min(96vw,90rem)] flex-col overflow-hidden rounded-[1.25rem] border border-glass-border bg-surface shadow-[0_40px_100px_rgba(0,0,0,0.35)] sm:rounded-[1.5rem] md:rounded-[1.75rem]"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-surface/95 text-foreground shadow-md transition-colors hover:border-gold/45 hover:text-gold md:top-5 md:right-5"
          aria-label="Close"
        >
          <X size={18} aria-hidden />
        </button>

        <ExperienceDetailModalContent experience={experience} />
      </div>
    </div>
  );
}
