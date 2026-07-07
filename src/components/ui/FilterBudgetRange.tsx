"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, IndianRupee } from "lucide-react";
import { BudgetRangeSlider } from "@/components/ui/BudgetRangeSlider";
import {
  BUDGET_SLIDER_MAX,
  BUDGET_SLIDER_MIN,
  formatInrBudgetRange,
  isFullBudgetRange,
} from "@/data/price-ranges";
import { cn } from "@/lib/utils";

function focusWithoutScroll(element: HTMLElement | null | undefined) {
  element?.focus({ preventScroll: true });
}

type FilterBudgetRangeProps = {
  id: string;
  label: string;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  isOpen: boolean;
  onToggle: (id: string | null) => void;
  className?: string;
  siblingIds?: string[];
  onActivateSibling?: (id: string) => void;
};

export function FilterBudgetRange({
  id,
  label,
  valueMin,
  valueMax,
  onChange,
  isOpen,
  onToggle,
  className,
  siblingIds,
  onActivateSibling,
}: FilterBudgetRangeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const summaryLabel = isFullBudgetRange(valueMin, valueMax)
    ? "All budgets"
    : formatInrBudgetRange(valueMin, valueMax);

  const navigateSibling = useCallback(
    (direction: "left" | "right") => {
      if (!siblingIds?.length || !onActivateSibling) return;
      const currentIndex = siblingIds.indexOf(id);
      if (currentIndex < 0) return;

      const nextIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex < 0 || nextIndex >= siblingIds.length) return;

      onToggle(null);
      onActivateSibling(siblingIds[nextIndex]);
    },
    [id, onActivateSibling, onToggle, siblingIds],
  );

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const updatePosition = () => {
      const trigger = ref.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const panelHeight = 220;
      const panelWidth = Math.max(rect.width, 300);
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < panelHeight && rect.top > spaceBelow;

      setMenuStyle({
        position: "fixed",
        left: Math.min(rect.left, window.innerWidth - panelWidth - 12),
        width: panelWidth,
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
      if (ref.current?.contains(target) || panelRef.current?.contains(target)) return;
      onToggle(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onToggle(null);
      focusWithoutScroll(triggerRef.current);
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

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        event.preventDefault();
        onToggle(isOpen ? null : id);
        break;
      case "ArrowLeft":
        event.preventDefault();
        navigateSibling("left");
        break;
      case "ArrowRight":
        event.preventDefault();
        navigateSibling("right");
        break;
      default:
        break;
    }
  };

  const resetRange = () => {
    onChange(BUDGET_SLIDER_MIN, BUDGET_SLIDER_MAX);
  };

  return (
    <div ref={ref} className={cn("relative min-w-0", className)}>
      <p className="mb-2 text-[10px] font-medium tracking-[0.22em] text-gold uppercase">{label}</p>
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? `${id}-panel` : undefined}
        onClick={() => onToggle(isOpen ? null : id)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
          isOpen
            ? "border-gold/50 bg-gold/8 text-foreground"
            : "border-glass-border bg-background/40 text-foreground hover:border-gold/35",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <IndianRupee size={15} className="shrink-0 text-gold" aria-hidden />
          <span className="truncate">{summaryLabel}</span>
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
          <div
            ref={panelRef}
            id={`${id}-panel`}
            role="dialog"
            aria-labelledby={`${id}-trigger`}
            style={menuStyle}
            data-lenis-prevent
            className="rounded-xl border border-glass-border bg-surface p-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]"
          >
            <BudgetRangeSlider
              id={`${id}-slider`}
              valueMin={valueMin}
              valueMax={valueMax}
              onChange={onChange}
              className="border-0 bg-transparent px-2 py-2"
            />
            <div className="mt-1 flex justify-end border-t border-glass-border/70 pt-2">
              <button
                type="button"
                onClick={resetRange}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                Reset to all budgets
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
