"use client";

import { useId } from "react";
import {
  BUDGET_SLIDER_MAX,
  BUDGET_SLIDER_MIN,
  BUDGET_SLIDER_STEP,
  formatInrBudgetRange,
  formatInrBudgetShort,
} from "@/data/price-ranges";
import { cn } from "@/lib/utils";

type BudgetRangeSliderProps = {
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  invalid?: boolean;
  className?: string;
};

export function BudgetRangeSlider({
  id,
  min = BUDGET_SLIDER_MIN,
  max = BUDGET_SLIDER_MAX,
  step = BUDGET_SLIDER_STEP,
  valueMin,
  valueMax,
  onChange,
  invalid = false,
  className,
}: BudgetRangeSliderProps) {
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const minPercent = ((valueMin - min) / (max - min)) * 100;
  const maxPercent = ((valueMax - min) / (max - min)) * 100;

  const handleMinChange = (nextMin: number) => {
    const clamped = Math.max(min, Math.min(nextMin, valueMax - step));
    onChange(clamped, valueMax);
  };

  const handleMaxChange = (nextMax: number) => {
    const clamped = Math.min(max, Math.max(nextMax, valueMin + step));
    onChange(valueMin, clamped);
  };

  return (
    <div
      className={cn(
        "budget-range-slider rounded-2xl border border-glass-border bg-input-bg px-4 py-4",
        invalid && "border-red-400/70",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-foreground">{formatInrBudgetShort(valueMin)}</span>
        <span className="text-xs tracking-wide text-muted uppercase">to</span>
        <span className="font-medium text-foreground">{formatInrBudgetShort(valueMax)}</span>
      </div>
      <p className="mt-1 text-center text-xs text-gold">{formatInrBudgetRange(valueMin, valueMax)}</p>

      <div className="budget-range-slider__track relative mx-1 mt-5 h-8">
        <div className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-surface-elevated" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gold"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          id={`${sliderId}-min`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="budget-range-slider__thumb budget-range-slider__thumb--min"
          aria-label="Minimum budget"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueMin}
          aria-valuetext={formatInrBudgetShort(valueMin)}
        />
        <input
          id={`${sliderId}-max`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="budget-range-slider__thumb budget-range-slider__thumb--max"
          aria-label="Maximum budget"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueMax}
          aria-valuetext={formatInrBudgetShort(valueMax)}
        />
      </div>

      <div className="mt-2 flex justify-between text-[0.65rem] text-muted">
        <span>{formatInrBudgetShort(min)}</span>
        <span>{formatInrBudgetShort(max)}+</span>
      </div>
    </div>
  );
}
