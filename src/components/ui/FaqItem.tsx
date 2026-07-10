"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItemProps = {
  question: string;
  answer: string;
  variant?: "card" | "embedded";
  index?: number;
  className?: string;
};

export function FaqItem({
  question,
  answer,
  variant = "card",
  index,
  className,
}: FaqItemProps) {
  const [open, setOpen] = useState(false);

  if (variant === "embedded") {
    const itemId = `faq-${index ?? question.slice(0, 24).replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <div className={cn("about-faq__item", open && "about-faq__item--open", className)}>
        <button
          type="button"
          id={`${itemId}-trigger`}
          onClick={() => setOpen(!open)}
          className="about-faq__trigger"
          aria-expanded={open}
          aria-controls={`${itemId}-panel`}
        >
          {typeof index === "number" ? (
            <span className="about-faq__index" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
          <span className="about-faq__question">{question}</span>
          <ChevronDown
            size={17}
            strokeWidth={1.75}
            aria-hidden
            className={cn("about-faq__chevron", open && "about-faq__chevron--open")}
          />
        </button>

        <div
          id={`${itemId}-panel`}
          role="region"
          aria-labelledby={`${itemId}-trigger`}
          className={cn(
            "about-faq__answer-panel grid transition-[grid-template-rows] duration-300 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <p className="about-faq__answer">{answer}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("glass rounded-xl border border-glass-border", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-foreground">{question}</span>
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-gold transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <p className="border-t border-glass-border px-5 pb-4 text-sm leading-relaxed text-muted">
          {answer}
        </p>
      )}
    </div>
  );
}
