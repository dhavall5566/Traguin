"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import type { LegalPageContent } from "@/data/legal";
import { LegalDocumentBody } from "@/components/legal/LegalDocumentBody";
import { useModalScrollLock } from "@/lib/use-modal-scroll-lock";

type LegalDocumentModalProps = {
  open: boolean;
  content: LegalPageContent | null;
  pageHref: string;
  onClose: () => void;
};

export function LegalDocumentModal({
  open,
  content,
  pageHref,
  onClose,
}: LegalDocumentModalProps) {
  const [mounted, setMounted] = useState(false);

  useModalScrollLock(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open || !content) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-document-modal-title"
      data-lenis-prevent
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[6px]"
        aria-hidden
      />

      <div
        className="legal-document-modal relative flex w-full max-w-[min(94vw,56rem)] flex-col overflow-hidden rounded-2xl border border-glass-border bg-background shadow-[0_32px_80px_rgba(0,0,0,0.28)] sm:rounded-[1.35rem] md:max-h-[min(88dvh,820px)]"
        onClick={(event) => event.stopPropagation()}
        data-lenis-prevent
      >
        <header className="legal-document-modal__header shrink-0 border-b border-glass-border bg-background/95 px-5 py-4 backdrop-blur-md sm:px-6 sm:py-5 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 pr-2">
              <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-gold uppercase sm:text-xs">
                {content.eyebrow}
              </p>
              <h2
                id="legal-document-modal-title"
                className="mt-1 font-display text-xl leading-tight text-foreground sm:text-2xl md:text-3xl"
              >
                {content.title}
              </h2>
              <p className="mt-1 text-xs tracking-[0.16em] text-muted uppercase">
                Effective {content.effectiveDate}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-glass-border bg-surface transition-colors hover:border-gold/40 hover:text-gold"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="legal-document-modal__body min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6 sm:py-7 md:px-8 md:py-8">
          <LegalDocumentBody content={content} />
        </div>

        <footer className="legal-document-modal__footer shrink-0 border-t border-glass-border bg-background/95 px-5 py-3 backdrop-blur-md sm:px-6 sm:py-4 md:px-8">
          <div className="flex justify-end">
            <Link
              href={pageHref}
              className="inline-flex h-11 items-center justify-center rounded-full border border-gold/30 bg-gold px-8 text-xs font-bold tracking-[0.14em] text-on-gold uppercase transition-colors hover:bg-gold-light"
              onClick={onClose}
            >
              Read
            </Link>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}
