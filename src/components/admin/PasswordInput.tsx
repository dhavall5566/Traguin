"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  required?: boolean;
  minLength?: number;
  hasError?: boolean;
};

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  required = true,
  minLength,
  hasError = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="admin-password-field">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        className={`admin-input mt-1 w-full admin-password-field__input${hasError ? " admin-input--error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        className="admin-password-field__toggle"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
      </button>
    </div>
  );
}
