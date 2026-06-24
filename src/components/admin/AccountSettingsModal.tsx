"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

type AccountSettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AccountSettingsModal({ open, onClose }: AccountSettingsModalProps) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="admin-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="admin-modal admin-modal--form admin-modal--account"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin-modal__head">
          <div className="admin-modal__head-copy">
            <p className="admin-modal__eyebrow">Account</p>
            <h2 id="account-settings-title" className="admin-modal__title">
              Change password
            </h2>
            <p className="admin-modal__subtitle">
              Update your CMS admin password. You will stay signed in after a successful change.
            </p>
          </div>
          <button
            type="button"
            className="admin-modal__close"
            aria-label="Close account settings"
            onClick={onClose}
          >
            <X aria-hidden className="admin-modal__close-icon" />
          </button>
        </header>

        <div className="admin-modal__body admin-modal__body--account">
          <ChangePasswordForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
