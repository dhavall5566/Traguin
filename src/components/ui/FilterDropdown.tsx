"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterDropdownOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

function focusWithoutScroll(element: HTMLElement | null | undefined) {
  element?.focus({ preventScroll: true });
}

type FilterDropdownProps = {
  id: string;
  label: string;
  value: string;
  options: FilterDropdownOption[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: (id: string | null) => void;
  className?: string;
  /** Ordered sibling filter ids for ArrowLeft / ArrowRight navigation */
  siblingIds?: string[];
  onActivateSibling?: (id: string) => void;
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
  siblingIds,
  onActivateSibling,
}: FilterDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = options.find((opt) => opt.value === value) ?? options[0];
  const SelectedIcon = selected?.icon;

  const selectedIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );

  const setHighlighted = useCallback(
    (index: number) => {
      const clamped = ((index % options.length) + options.length) % options.length;
      setHighlightedIndex(clamped);
    },
    [options.length]
  );

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
    [id, onActivateSibling, onToggle, siblingIds]
  );

  const selectOption = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt) return;
      onChange(opt.value);
      onToggle(null);
      focusWithoutScroll(triggerRef.current);
    },
    [onChange, onToggle, options]
  );

  useEffect(() => {
    if (!isOpen) return;
    setHighlightedIndex(selectedIndex);
  }, [isOpen, selectedIndex]);

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
        event.preventDefault();
        if (!isOpen) {
          onToggle(id);
        } else {
          setHighlighted(highlightedIndex + 1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          onToggle(id);
        } else {
          setHighlighted(highlightedIndex - 1);
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        navigateSibling("left");
        break;
      case "ArrowRight":
        event.preventDefault();
        navigateSibling("right");
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) {
          selectOption(highlightedIndex);
        } else {
          onToggle(id);
        }
        break;
      case "Home":
        if (isOpen) {
          event.preventDefault();
          setHighlighted(0);
        }
        break;
      case "End":
        if (isOpen) {
          event.preventDefault();
          setHighlighted(options.length - 1);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div ref={ref} className={cn("relative min-w-0", className)}>
      <p className="mb-2 text-[10px] font-medium tracking-[0.22em] text-gold uppercase">{label}</p>
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? `${id}-listbox` : undefined}
        aria-activedescendant={isOpen ? `${id}-option-${highlightedIndex}` : undefined}
        onClick={() => onToggle(isOpen ? null : id)}
        onKeyDown={handleTriggerKeyDown}
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
            data-lenis-prevent
            className="max-h-56 overflow-y-auto rounded-xl border border-glass-border bg-surface py-1 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]"
          >
            {options.map((opt, index) => {
              const active = opt.value === value;
              const highlighted = index === highlightedIndex;
              const OptionIcon = opt.icon;
              return (
                <li key={opt.value} role="presentation">
                  <button
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    id={`${id}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    tabIndex={-1}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => selectOption(index)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-gold/12 text-foreground"
                        : "text-muted hover:bg-surface-elevated hover:text-foreground",
                      highlighted && "bg-surface-elevated text-foreground ring-1 ring-inset ring-gold/25"
                    )}
                  >
                    {OptionIcon && (
                      <OptionIcon
                        size={15}
                        className={cn("shrink-0", active || highlighted ? "text-gold" : "text-muted")}
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
