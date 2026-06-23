import { formatPriceLabel, isPriceOnRequest } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type PriceSize = "sm" | "md" | "lg";
export type PriceVariant = "default" | "overlay";

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

const variantStyles: Record<
  PriceVariant,
  { label: string; amount: string; note: string; suffix: string }
> = {
  default: {
    label: "text-foreground/70",
    amount: "text-gold",
    note: "text-muted",
    suffix: "text-muted",
  },
  overlay: {
    label: "text-white/85",
    amount: "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]",
    note: "text-white/75",
    suffix: "text-white/70",
  },
};

export interface PriceDisplayProps {
  amount: number;
  /** Uppercased label above the price. Omit for amount-only. */
  label?: string | null;
  /** When true, or when amount is 0/missing, shows "Inquire for price". */
  onRequest?: boolean;
  suffix?: string;
  note?: string;
  size?: PriceSize;
  variant?: PriceVariant;
  className?: string;
}

const inquireClass: Record<PriceSize, string> = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

export function PriceDisplay({
  amount,
  label = "From",
  onRequest,
  suffix,
  note,
  size = "md",
  variant = "default",
  className,
}: PriceDisplayProps) {
  const showLabel = label != null && label.length > 0;
  const tones = variantStyles[variant];
  const priceOnRequest = isPriceOnRequest(amount, onRequest);

  return (
    <div className={cn("font-body", className)}>
      {showLabel ? (
        <p
          className={cn(
            "font-semibold tracking-[0.18em] uppercase",
            labelClass[size],
            tones.label
          )}
        >
          {label}
        </p>
      ) : null}
      <p
        className={cn(
          priceOnRequest ? "font-semibold tracking-tight" : "font-bold tracking-tight",
          priceOnRequest ? inquireClass[size] : amountClass[size],
          tones.amount,
          showLabel && "mt-0.5"
        )}
      >
        {formatPriceLabel(amount, onRequest)}
        {!priceOnRequest && suffix ? (
          <span className={cn("ml-1 text-xs font-medium", tones.suffix)}>{suffix}</span>
        ) : null}
      </p>
      {note ? (
        <p className={cn("mt-1 text-xs font-medium", tones.note)}>{note}</p>
      ) : null}
    </div>
  );
}

/** Inline price text matching project price typography (filters, compact rows). */
export function PriceAmount({
  amount,
  onRequest,
  size = "md",
  className,
}: {
  amount: number;
  onRequest?: boolean;
  size?: PriceSize;
  className?: string;
}) {
  const priceOnRequest = isPriceOnRequest(amount, onRequest);

  return (
    <span
      className={cn(
        "font-body tracking-tight text-gold",
        priceOnRequest ? "font-semibold" : "font-bold",
        priceOnRequest ? inquireClass[size] : amountClass[size],
        className
      )}
    >
      {formatPriceLabel(amount, onRequest)}
    </span>
  );
}
