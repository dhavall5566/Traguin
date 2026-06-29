"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export type DatePickerInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  inputClassName?: string;
};

export function DatePickerInput({
  className,
  inputClassName,
  disabled,
  id,
  onClick,
  ...props
}: DatePickerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input || disabled) return;
    input.focus();
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        /* Safari may throw if not triggered by user gesture */
      }
    }
  };

  return (
    <div className={cn("date-picker-input relative", className)}>
      <input
        ref={inputRef}
        id={id}
        type="date"
        disabled={disabled}
        className={cn("date-picker-input__field", inputClassName)}
        onClick={(event) => {
          onClick?.(event);
          openPicker();
        }}
        {...props}
      />
    </div>
  );
}
