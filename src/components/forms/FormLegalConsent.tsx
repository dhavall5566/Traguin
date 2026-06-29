"use client";

import { useId, useState } from "react";
import { privacyPolicy, termsOfService } from "@/data/legal";
import { LegalDocumentModal } from "@/components/legal/LegalDocumentModal";
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

const LEGAL_DOCUMENTS = {
  privacy: {
    content: privacyPolicy,
    href: "/privacy-policy",
  },
  terms: {
    content: termsOfService,
    href: "/terms-of-service",
  },
} as const;

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
  const activeDocument = disclosure ? LEGAL_DOCUMENTS[disclosure] : null;

  const openDisclosure = (kind: DisclosureKind) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
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
            onChange={(event) => onChange(event.target.checked)}
            className={cn(
              "mt-0.5 size-4 shrink-0 cursor-pointer rounded border accent-gold",
              isLight ? "border-white/40 bg-white/10" : "border-glass-border bg-surface",
              error && (isLight ? "border-red-400/70" : "border-red-400/60")
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
          <span className="text-xs leading-relaxed sm:text-sm">
            I agree to TRAGUIN&apos;s{" "}
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
              Terms of Service
            </button>
            , and consent to being contacted about my inquiry.
          </span>
        </label>
        {error ? (
          <p
            id={errorId}
            className={cn("text-xs", isLight ? "text-red-300" : "text-red-400")}
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>

      <LegalDocumentModal
        open={disclosure !== null}
        content={activeDocument?.content ?? null}
        pageHref={activeDocument?.href ?? "/privacy-policy"}
        onClose={() => setDisclosure(null)}
      />
    </>
  );
}
