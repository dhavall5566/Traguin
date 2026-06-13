"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-xl border border-glass-border">
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
