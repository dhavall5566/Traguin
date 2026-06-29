"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type DestinationAccordionItem = {
  id: string;
  title: string;
  /** Total published packages across all destinations in this group. */
  packageCount: number;
  content: ReactNode;
};

type DestinationRegionAccordionProps = {
  sectionId: string;
  items: DestinationAccordionItem[];
};

function AccordionRow({
  id,
  title,
  packageCount,
  open,
  onToggle,
  isLast,
  children,
}: {
  id: string;
  title: string;
  packageCount: number;
  open: boolean;
  onToggle: () => void;
  isLast: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "destination-accordion__item",
        open && "destination-accordion__item--open",
        !isLast && "destination-accordion__item--divider"
      )}
    >
      <button
        type="button"
        id={`${id}-trigger`}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="destination-accordion__trigger group"
      >
        <span className="min-w-0 flex-1 text-left">
          <span className="destination-accordion__title">
            {title}
            <span className="destination-accordion__count">
              {" "}
              ({packageCount} {packageCount === 1 ? "package" : "packages"})
            </span>
          </span>
        </span>

        <span className="destination-accordion__chevron" aria-hidden>
          <ChevronDown size={14} strokeWidth={2} />
        </span>
      </button>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className={cn(
          "destination-accordion__panel grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="destination-accordion__content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function DestinationRegionAccordion({
  sectionId,
  items,
}: DestinationRegionAccordionProps) {
  const itemKeys = useMemo(
    () => items.map((item) => `${sectionId}-${item.id}`),
    [items, sectionId]
  );

  const [openKeys, setOpenKeys] = useState<Set<string>>(() => new Set(itemKeys));

  useEffect(() => {
    setOpenKeys(new Set(itemKeys));
  }, [itemKeys]);

  const toggleItem = useCallback((key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setOpenKeys(new Set(itemKeys));
  }, [itemKeys]);

  const collapseAll = useCallback(() => {
    setOpenKeys(new Set());
  }, []);

  const openCount = openKeys.size;
  const allOpen = openCount === items.length;
  const allClosed = openCount === 0;

  if (items.length === 0) return null;

  return (
    <div className="destination-accordion mt-10">
      <div className="destination-accordion__toolbar">
        <p className="destination-accordion__summary">
          {openCount} of {items.length} {items.length === 1 ? "section" : "sections"} open
        </p>
        <div className="destination-accordion__toolbar-actions">
          <button
            type="button"
            onClick={expandAll}
            disabled={allOpen}
            className="destination-accordion__toolbar-btn"
          >
            <Plus size={14} aria-hidden />
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            disabled={allClosed}
            className="destination-accordion__toolbar-btn"
          >
            <Minus size={14} aria-hidden />
            Collapse all
          </button>
        </div>
      </div>

      <div className="destination-accordion__panel-shell">
        {items.map((item, index) => {
          const key = itemKeys[index]!;
          return (
            <AccordionRow
              key={key}
              id={key}
              title={item.title}
              packageCount={item.packageCount}
              open={openKeys.has(key)}
              onToggle={() => toggleItem(key)}
              isLast={index === items.length - 1}
            >
              {item.content}
            </AccordionRow>
          );
        })}
      </div>
    </div>
  );
}
