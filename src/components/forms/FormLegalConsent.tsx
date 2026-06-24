"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { FORM_LEGAL_DISCLOSURE_TEXT } from "@/lib/form-legal-consent";
import { useModalScrollLock } from "@/lib/use-modal-scroll-lock";
import { cn } from "@/lib/utils";

type DisclosureKind = "privacy" | "terms";

type FormLegalConsentProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  variant?: "default" | "light";
  className?: string;
};

function FormLegalDisclosureModal({
  open,
  kind,
  onClose,
}: {
  open: boolean;
  kind: DisclosureKind | null;
  onClose: () => void;
}) {
  useModalScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !kind) return null;

  const title = kind === "privacy" ? "Privacy Policy" : "Website Terms of Use";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center overflow-hidden bg-background/90 p-0 backdrop-blur-md sm:items-center sm:p-4 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-legal-disclosure-title"
      data-lenis-prevent
    >
      <div
        className="relative w-full max-w-lg rounded-t-3xl border border-gold/20 bg-surface p-6 shadow-2xl sm:rounded-3xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 glass transition-colors hover:text-gold"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2
          id="form-legal-disclosure-title"
          className="pr-10 font-display text-xl text-foreground sm:text-2xl"
        >
          {title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
          {FORM_LEGAL_DISCLOSURE_TEXT}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/20"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function FormLegalConsent({
  id,
  checked,
  onChange,
  error,
  variant = "default",
  className,
}: FormLegalConsentProps) {
  const generatedId = useId();
  const checkboxId = id ?? `legal-consent-${generatedId}`;
  const errorId = `${checkboxId}-error`;
  const [disclosure, setDisclosure] = useState<DisclosureKind | null>(null);

  const isLight = variant === "light";

  const openDisclosure = (kind: DisclosureKind) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDisclosure(kind);
  };

  return (
    <>
      <div className={cn("space-y-1.5", className)}>
        <label
          htmlFor={checkboxId}
          className={cn(
            "flex cursor-pointer items-start gap-3 text-left",
            isLight ? "text-white/90" : "text-foreground/80"
          )}
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className={cn(
              "mt-0.5 size-4 shrink-0 cursor-pointer rounded border accent-gold",
              isLight ? "border-white/40 bg-white/10" : "border-glass-border bg-surface",
              error && (isLight ? "border-red-400/70" : "border-red-400/60")
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
          <span className="text-xs leading-relaxed sm:text-sm">
            By Submitting the form, I agree to the{" "}
            <button
              type="button"
              onClick={openDisclosure("privacy")}
              className="font-medium text-gold underline decoration-gold/40 underline-offset-2 transition-colors hover:text-gold/80"
            >
              Privacy Policy
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={openDisclosure("terms")}
              className={cn(
                "font-medium underline underline-offset-2 transition-colors",
                isLight
                  ? "text-sky-300 decoration-sky-300/40 hover:text-sky-200"
                  : "text-sky-600 decoration-sky-600/40 hover:text-sky-700"
              )}
            >
              Website Terms of Use
            </button>
          </span>
        </label>
        {error && (
          <p
            id={errorId}
            className={cn("text-xs", isLight ? "text-red-300" : "text-red-400")}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <FormLegalDisclosureModal
        open={disclosure !== null}
        kind={disclosure}
        onClose={() => setDisclosure(null)}
      />
    </>
  );
}
