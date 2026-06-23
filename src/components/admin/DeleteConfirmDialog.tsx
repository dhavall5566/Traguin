"use client";

type DeleteConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmDialog({
  open,
  title,
  message,
  loading,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="admin-modal"
        role="alertdialog"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="delete-dialog-title" className="font-display text-lg font-semibold text-foreground">
          {title}
        </h2>
        <p id="delete-dialog-desc" className="mt-2 text-sm text-muted">
          {message}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="admin-btn admin-btn--secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="admin-btn admin-btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
