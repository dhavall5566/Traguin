import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const formLabelClass = "mb-1.5 block text-xs tracking-wide text-muted uppercase";

export const formInputClass =
  "w-full rounded-xl border border-glass-border bg-input px-4 py-3 text-sm text-foreground outline-none focus:border-gold/50";

export const formSelectClass = cn(
  formInputClass,
  "h-12 appearance-none py-0 leading-normal planner-wizard__select"
);

export const formInputInvalidClass = "border-red-400/70 focus:border-red-400";

export function fieldInputClass(field: string, errors: Record<string, string | undefined>) {
  return cn(formInputClass, errors[field] && formInputInvalidClass);
}

export function fieldSelectClass(field: string, errors: Record<string, string | undefined>) {
  return cn(formSelectClass, errors[field] && formInputInvalidClass);
}

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  children: ReactNode;
  className?: string;
};

export function FormField({ label, htmlFor, error, icon: Icon, children, className }: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className={cn(formLabelClass, Icon && "flex items-center gap-2")}
      >
        {Icon && <Icon size={14} className="shrink-0 text-gold" aria-hidden />}
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
