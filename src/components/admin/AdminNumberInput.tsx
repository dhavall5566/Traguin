import { cn } from "@/lib/utils";
import {
  ADMIN_NUMBER_MIN,
  isAllowedAdminNumberDraft,
  normalizeAdminNumberDraft,
} from "@/lib/admin/number-input";

type AdminNumberInputProps = {
  id?: string;
  value: unknown;
  onChange: (value: unknown) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  step?: number | string;
};

export function AdminNumberInput({
  id,
  value,
  onChange,
  className,
  placeholder,
  disabled,
  min = ADMIN_NUMBER_MIN,
  step,
}: AdminNumberInputProps) {
  return (
    <input
      id={id}
      type="number"
      min={min}
      step={step}
      disabled={disabled}
      className={cn("admin-input", className)}
      value={value === "" || value == null ? "" : String(value)}
      onChange={(event) => {
        const next = event.target.value;
        if (!isAllowedAdminNumberDraft(next)) return;
        onChange(next);
      }}
      onBlur={(event) => {
        onChange(normalizeAdminNumberDraft(event.target.value));
      }}
      placeholder={placeholder}
    />
  );
}
