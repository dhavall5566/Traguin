"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AdminListToggleProps = {
  checked: boolean;
  label: string;
  onLabel?: string;
  offLabel?: string;
  onChange: (next: boolean) => void;
};

export function AdminListToggle({
  checked,
  label,
  onLabel = "Active",
  offLabel = "Inactive",
  onChange,
}: AdminListToggleProps) {
  const [displayChecked, setDisplayChecked] = useState(checked);

  useEffect(() => {
    setDisplayChecked(checked);
  }, [checked]);

  return (
    <label
      className="admin-visibility-toggle"
      onClick={(event) => event.stopPropagation()}
    >
      <input
        type="checkbox"
        className="admin-visibility-toggle__input"
        checked={displayChecked}
        aria-label={`${displayChecked ? "Deactivate" : "Activate"} ${label}`}
        onChange={(event) => {
          const next = event.target.checked;
          setDisplayChecked(next);
          onChange(next);
        }}
      />
      <span
        className={cn(
          "admin-visibility-toggle__track",
          displayChecked && "admin-visibility-toggle__track--on",
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
