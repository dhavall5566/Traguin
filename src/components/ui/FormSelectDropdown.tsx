"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormSelectDropdownOption = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

type FormSelectDropdownProps = {
  id?: string;
  label: string;
  value: string;
  options: FormSelectDropdownOption[];
  onChange: (value: string) => void;
  invalid?: boolean;
  className?: string;
};

export function FormSelectDropdown({
  id: idProp,
  label,
  value,
  options,
  onChange,
  invalid = false,
  className,
}: FormSelectDropdownProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = options.find((opt) => opt.value === value) ?? options[0];
  const SelectedIcon = selected?.icon;
  const selectedIndex = Math.max(0, options.findIndex((opt) => opt.value === value));

  const selectOption = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt) return;
      onChange(opt.value);
      setIsOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    },
    [onChange, options]
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
      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((i) => (i + 1) % options.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((i) => (i - 1 + options.length) % options.length);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) {
          selectOption(highlightedIndex);
        } else {
          setIsOpen(true);
        }
        break;
      case "Home":
        if (isOpen) {
          event.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      case "End":
        if (isOpen) {
          event.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div ref={ref} className={cn("relative min-w-0", className)}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? `${id}-listbox` : undefined}
        aria-invalid={invalid}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
          invalid && "border-red-400/70",
          isOpen
            ? "border-gold/50 bg-gold/8 text-foreground"
            : "border-glass-border bg-input text-foreground hover:border-gold/35",
          invalid && !isOpen && "border-red-400/60"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {SelectedIcon ? (
            <SelectedIcon size={15} className="shrink-0 text-gold" aria-hidden />
          ) : null}
          <span className="truncate">{selected?.label}</span>
        </span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 text-muted transition-transform", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>
      <span className="sr-only">{label}</span>

      {isOpen && mounted
        ? createPortal(
            <ul
              ref={menuRef}
              id={`${id}-listbox`}
              role="listbox"
              aria-label={label}
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
                      {OptionIcon ? (
                        <OptionIcon
                          size={15}
                          className={cn("shrink-0", active || highlighted ? "text-gold" : "text-muted")}
                          aria-hidden
                        />
                      ) : null}
                      <span className="min-w-0 truncate">{opt.label}</span>
                      {active ? (
                        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body
          )
        : null}
    </div>
  );
}
