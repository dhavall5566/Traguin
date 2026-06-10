"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterDropdownOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

type FilterDropdownProps = {
  id: string;
  label: string;
  value: string;
  options: FilterDropdownOption[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: (id: string | null) => void;
  className?: string;
};

export function FilterDropdown({
  id,
  label,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  className,
}: FilterDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = options.find((opt) => opt.value === value) ?? options[0];
  const SelectedIcon = selected?.icon;

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const updatePosition = () => {
      const trigger = ref.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const menuHeight = 224;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < menuHeight && rect.top > spaceBelow;

      setMenuStyle({
        position: "fixed",
        left: rect.left,
        width: rect.width,
        top: openUpward ? undefined : rect.bottom + 6,
        bottom: openUpward ? window.innerHeight - rect.top + 6 : undefined,
        zIndex: 9999,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ref.current?.contains(target) || menuRef.current?.contains(target)) return;
      onToggle(null);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onToggle(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onToggle]);

  return (
    <div ref={ref} className={cn("relative min-w-0", className)}>
      <p className="mb-2 text-[10px] font-medium tracking-[0.22em] text-gold uppercase">{label}</p>
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        onClick={() => onToggle(isOpen ? null : id)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
          isOpen
            ? "border-gold/50 bg-gold/8 text-foreground"
            : "border-glass-border bg-background/40 text-foreground hover:border-gold/35"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {SelectedIcon && (
            <SelectedIcon size={15} className="shrink-0 text-gold" aria-hidden />
          )}
          <span className="truncate">{selected.label}</span>
        </span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 text-muted transition-transform", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <ul
            ref={menuRef}
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby={`${id}-trigger`}
            style={menuStyle}
            className="max-h-56 overflow-y-auto rounded-xl border border-glass-border bg-surface py-1 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              const OptionIcon = opt.icon;
              return (
                <li key={opt.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(opt.value);
                      onToggle(null);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-gold/12 text-foreground"
                        : "text-muted hover:bg-surface-elevated hover:text-foreground"
                    )}
                  >
                    {OptionIcon && (
                      <OptionIcon
                        size={15}
                        className={cn("shrink-0", active ? "text-gold" : "text-muted")}
                        aria-hidden
                      />
                    )}
                    <span className="min-w-0 truncate">{opt.label}</span>
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </div>
  );
}
