"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import {
  countryDialCodes,
  defaultCountryCode,
  getCountryByCode,
  type CountryDialCode,
} from "@/data/country-codes";
import { cn } from "@/lib/utils";

type PhoneCountrySelectProps = {
  value: string;
  onChange: (code: string) => void;
  className?: string;
};

export function PhoneCountrySelect({ value, onChange, className }: PhoneCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; minWidth: number } | null>(
    null
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = getCountryByCode(value || defaultCountryCode);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setMenuStyle({
      top: rect.bottom + 8,
      left: rect.left,
      minWidth: Math.max(rect.width, 248),
    });
  };

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if ((e.target as HTMLElement).closest?.(`[data-country-menu="${listboxId}"]`)) return;
      setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleReposition = () => updateMenuPosition();
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, listboxId]);

  const selectCountry = (country: CountryDialCode) => {
    onChange(country.code);
    setOpen(false);
  };

  const menu =
    open && menuStyle
      ? createPortal(
          <ul
            id={listboxId}
            data-country-menu={listboxId}
            role="listbox"
            aria-label="Country code"
            style={{
              position: "fixed",
              top: menuStyle.top,
              left: menuStyle.left,
              minWidth: menuStyle.minWidth,
              zIndex: 200,
            }}
            className="max-h-56 overflow-y-auto rounded-xl border border-white/20 bg-black/92 py-1 shadow-2xl backdrop-blur-xl"
          >
            {countryDialCodes.map((country) => {
              const isSelected = country.code === selected.code;
              return (
                <li key={country.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-white transition-colors hover:bg-white/10",
                      isSelected && "bg-white/10"
                    )}
                    onClick={() => selectCountry(country)}
                  >
                    <span className="text-lg leading-none" aria-hidden>
                      {country.flag}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{country.name}</span>
                    <span className="shrink-0 text-xs text-white/55 tabular-nums">{country.dial}</span>
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body
        )
      : null;

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        ref={triggerRef}
        type="button"
        className="flex h-9 min-w-[4.75rem] items-center gap-1 rounded-full bg-white/10 px-2 text-white transition-colors hover:bg-white/18 sm:min-w-[5.5rem] sm:gap-1.5 sm:px-2.5"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-base leading-none sm:text-lg" aria-hidden>
          {selected.flag}
        </span>
        <span className="text-xs font-semibold whitespace-nowrap text-white tabular-nums sm:text-sm">
          {selected.dial}
        </span>
        <ChevronDown
          size={14}
          className={cn("shrink-0 text-white/80 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {menu}
    </div>
  );
}
