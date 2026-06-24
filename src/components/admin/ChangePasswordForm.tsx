"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAdminToast } from "@/components/admin/AdminToast";
import { adminChangePassword } from "@/lib/admin/api-client";
import {
  getPasswordStrength,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS,
  passwordRequirementsMet,
  validatePasswordStrength,
} from "@/lib/password-validation";
import { PasswordInput } from "@/components/admin/PasswordInput";

type ChangePasswordFormProps = {
  onSuccess?: () => void;
};

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const { showToast } = useAdminToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const requirementsMet = useMemo(() => passwordRequirementsMet(newPassword), [newPassword]);
  const confirmMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isDirty =
    currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0;
  const canSubmit =
    isDirty &&
    currentPassword.length > 0 &&
    requirementsMet &&
    !confirmMismatch &&
    confirmPassword.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!canSubmit) return;

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      setError(strengthError);
      return;
    }

    setSubmitting(true);
    const result = await adminChangePassword({
      current_password: currentPassword,
      new_password: newPassword,
    });
    setSubmitting(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    showToast(result.data?.message ?? "Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="admin-account-form space-y-4">
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div>
        <label htmlFor="current_password" className="admin-label">
          Current password
        </label>
        <PasswordInput
          id="current_password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
      </div>

      <div>
        <label htmlFor="new_password" className="admin-label">
          New password
        </label>
        <PasswordInput
          id="new_password"
          autoComplete="new-password"
          value={newPassword}
          onChange={setNewPassword}
          minLength={PASSWORD_MIN_LENGTH}
          hasError={newPassword.length > 0 && !requirementsMet}
        />

        <div className="admin-password-guidance" aria-live="polite">
          <p className="admin-password-guidance__intro">
            Use a strong password with letters, numbers, and symbols.
          </p>

          {newPassword.length > 0 && (
            <div className="admin-password-strength">
              <div className="admin-password-strength__bar" aria-hidden>
                <span
                  className={`admin-password-strength__fill admin-password-strength__fill--${strength.score}`}
                  style={{ width: `${(strength.score / 3) * 100}%` }}
                />
              </div>
              <span className="admin-password-strength__label">{strength.label}</span>
            </div>
          )}

          <ul className="admin-password-requirements">
            {PASSWORD_REQUIREMENTS.map((requirement) => {
              const met = requirement.test(newPassword);
              return (
                <li
                  key={requirement.id}
                  className={`admin-password-requirements__item${met ? " admin-password-requirements__item--met" : ""}`}
                >
                  {requirement.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div>
        <label htmlFor="confirm_password" className="admin-label">
          Confirm new password
        </label>
        <PasswordInput
          id="confirm_password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          minLength={PASSWORD_MIN_LENGTH}
          hasError={confirmMismatch}
        />
        {confirmMismatch && (
          <p className="admin-field-error" role="alert">
            Passwords do not match.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="admin-btn admin-btn--primary"
        disabled={submitting || !canSubmit}
      >
        {submitting ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
