"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import type { FolderUploadStatus } from "@/components/admin/GalleryFolderUploadButton";

type GalleryFolderUploadBannerProps = {
  status: FolderUploadStatus;
  onDismiss?: () => void;
};

export function GalleryFolderUploadBanner({ status, onDismiss }: GalleryFolderUploadBannerProps) {
  const busy = status.phase === "preparing" || status.phase === "uploading" || status.phase === "creating";
  const progress = status.total > 0 ? Math.round((status.completed / status.total) * 100) : 0;
  const multi = (status.folderCount ?? 1) > 1;
  const batchLabel =
    multi && status.folderIndex
      ? `Folder ${status.folderIndex} of ${status.folderCount}`
      : null;

  return (
    <div
      className={`folder-upload-banner folder-upload-banner--${status.phase}`}
      role="status"
      aria-live="polite"
      aria-busy={busy}
    >
      <div className="folder-upload-banner__icon">
        {status.phase === "done" && <CheckCircle aria-hidden />}
        {status.phase === "error" && <XCircle aria-hidden />}
        {busy && <Loader2 aria-hidden className="folder-upload-banner__spin" />}
      </div>

      <div className="folder-upload-banner__body">
        {batchLabel && (
          <p className="folder-upload-banner__batch">{batchLabel}</p>
        )}
        <p className="folder-upload-banner__title">{status.folderName}</p>
        {status.phase === "preparing" && (
          <p className="folder-upload-banner__text">
            Preparing {status.total} photo{status.total === 1 ? "" : "s"}…
          </p>
        )}
        {status.phase === "uploading" && (
          <>
            <p className="folder-upload-banner__text">
              Uploading photos — {status.completed} of {status.total}
            </p>
            <div className="folder-upload-banner__progress">
              <div className="folder-upload-banner__progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </>
        )}
        {status.phase === "creating" && (
          <p className="folder-upload-banner__text">Creating gallery item…</p>
        )}
        {status.phase === "done" && (
          <>
            <p className="folder-upload-banner__text folder-upload-banner__text--success">
              {multi
                ? `${status.publishedCount ?? status.completed} of ${status.folderCount} folders published`
                : `Published with ${status.completed} photo${status.completed === 1 ? "" : "s"}`}
            </p>
            {status.message && (
              <p className="folder-upload-banner__text folder-upload-banner__text--warn">{status.message}</p>
            )}
          </>
        )}
        {status.phase === "error" && (
          <p className="folder-upload-banner__text folder-upload-banner__text--error">{status.message}</p>
        )}
      </div>

      {status.phase === "error" && onDismiss && (
        <button type="button" className="folder-upload-banner__dismiss" onClick={onDismiss}>
          Dismiss
        </button>
      )}
    </div>
  );
}
