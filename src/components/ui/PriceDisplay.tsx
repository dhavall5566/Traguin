import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type PriceSize = "sm" | "md" | "lg";

const labelClass: Record<PriceSize, string> = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-xs",
};

const amountClass: Record<PriceSize, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

export interface PriceDisplayProps {
  amount: number;
  /** Uppercased label above the price. Omit for amount-only. */
  label?: string | null;
  suffix?: string;
  note?: string;
  size?: PriceSize;
  className?: string;
}

export function PriceDisplay({
  amount,
  label = "From",
  suffix,
  note,
  size = "md",
  className,
}: PriceDisplayProps) {
  const showLabel = label != null && label.length > 0;

  return (
    <div className={cn("font-body", className)}>
      {showLabel ? (
        <p
          className={cn(
            "font-semibold tracking-wide text-foreground/70 uppercase",
            labelClass[size]
          )}
        >
          {label}
        </p>
      ) : null}
      <p
        className={cn(
          "font-bold tracking-tight text-gold",
          amountClass[size],
          showLabel && "mt-0.5"
        )}
      >
        {formatPrice(amount)}
        {suffix ? (
          <span className="ml-1 text-xs font-medium text-muted">{suffix}</span>
        ) : null}
      </p>
      {note ? (
        <p className="mt-1 text-xs font-medium text-muted">{note}</p>
      ) : null}
    </div>
  );
}

/** Inline price text matching project price typography (filters, compact rows). */
export function PriceAmount({
  amount,
  size = "md",
  className,
}: {
  amount: number;
  size?: PriceSize;
  className?: string;
}) {
  return (
    <span className={cn("font-body font-bold tracking-tight text-gold", amountClass[size], className)}>
      {formatPrice(amount)}
    </span>
  );
}
