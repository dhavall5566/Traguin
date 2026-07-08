"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AdminListToggleProps = {
  checked: boolean;
  label: string;
  onLabel?: string;
  offLabel?: string;
  disabled?: boolean;
  onChange: (next: boolean) => void;
};

export function AdminListToggle({
  checked,
  label,
  onLabel = "Active",
  offLabel = "Inactive",
  disabled = false,
  onChange,
}: AdminListToggleProps) {
  const [displayChecked, setDisplayChecked] = useState(checked);

  useEffect(() => {
    setDisplayChecked(checked);
  }, [checked]);

  return (
    <label
      className={cn("admin-visibility-toggle", disabled && "admin-visibility-toggle--disabled")}
      onClick={(event) => event.stopPropagation()}
    >
      <input
        type="checkbox"
        className="admin-visibility-toggle__input"
        checked={displayChecked}
        disabled={disabled}
        aria-label={`${displayChecked ? offLabel : onLabel}: ${label}`}
        onChange={(event) => {
          if (disabled) return;
          const next = event.target.checked;
          setDisplayChecked(next);
          onChange(next);
        }}
      />
      <span
        className={cn(
          "admin-visibility-toggle__track",
          displayChecked && "admin-visibility-toggle__track--on",
          disabled && !displayChecked && "admin-visibility-toggle__track--disabled",
        )}
      >
        <span className="admin-visibility-toggle__thumb" />
      </span>
      <span className="admin-visibility-toggle__label">
        {displayChecked ? onLabel : offLabel}
      </span>
    </label>
  );
}
