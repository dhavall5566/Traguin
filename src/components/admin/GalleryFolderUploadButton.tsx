"use client";

import { useRef, useState } from "react";
import { FolderUp } from "lucide-react";
import { adminCreate, adminUploadMedia } from "@/lib/admin/api-client";
import { prependCachedAdminListItem, revalidateAdminListInBackground } from "@/lib/admin/admin-data-cache";
import { formValuesToPayload, getEntityDef } from "@/lib/admin/entities";
import { useAdminToast } from "@/components/admin/AdminToast";

const IMAGE_ACCEPT = /\.(jpe?g|png|webp|gif)$/i;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type FolderUploadPhase = "preparing" | "uploading" | "creating" | "done" | "error";

export type FolderUploadStatus = {
  phase: FolderUploadPhase;
  folderName: string;
  completed: number;
  total: number;
  folderIndex?: number;
  folderCount?: number;
  publishedCount?: number;
  message?: string;
};

type GalleryFolderUploadButtonProps = {
  onCreated: (record: Record<string, unknown>) => void;
  onStatusChange: (status: FolderUploadStatus | null) => void;
  disabled?: boolean;
};

type FileWithPath = { file: File; relativePath: string };
type FolderBatch = { name: string; files: File[] };

function isImageFile(file: File): boolean {
  const type = (file.type || "").split(";", 1)[0].trim().toLowerCase();
  return IMAGE_TYPES.has(type) || IMAGE_ACCEPT.test(file.name);
}

function sortFilesByPath(files: File[]): File[] {
  return [...files].sort((a, b) =>
    (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name),
  );
}

function buildFolderBatchesFromInput(files: File[]): FolderBatch[] {
  if (files.length === 0) return [];

  const entries: FileWithPath[] = files.map((file) => ({
    file,
    relativePath: file.webkitRelativePath || file.name,
  }));

  const hasSubpaths = entries.some((entry) => entry.relativePath.includes("/"));
  if (!hasSubpaths) {
    const name = entries[0]?.relativePath.replace(/\.[^.]+$/, "") || "Gallery item";
    return [{ name, files: sortFilesByPath(files) }];
  }

  const groups = new Map<string, File[]>();
  const rootFiles: File[] = [];

  for (const { file, relativePath } of entries) {
    const parts = relativePath.split("/").filter(Boolean);
    if (parts.length > 1) {
      const key = parts[0];
      const list = groups.get(key) ?? [];
      list.push(file);
      groups.set(key, list);
    } else {
      rootFiles.push(file);
    }
  }

  const batches = [...groups.entries()]
    .map(([name, batchFiles]) => ({ name, files: sortFilesByPath(batchFiles) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (rootFiles.length > 0) {
    batches.push({
      name: batches.length === 0 ? "Gallery item" : "Other photos",
      files: sortFilesByPath(rootFiles),
    });
  }

  return batches.length > 0 ? batches : [{ name: "Gallery item", files: sortFilesByPath(files) }];
}

export function GalleryFolderUploadButton({ onCreated, onStatusChange, disabled }: GalleryFolderUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showCreatedToast, showErrorToast } = useAdminToast();

  const processFolderBatch = async (batches: FolderBatch[]) => {
    if (uploading || disabled || batches.length === 0) return;

    const entity = getEntityDef("gallery-items");
    if (!entity) {
      showErrorToast("Gallery items are not configured.");
      return;
    }

    const folderCount = batches.length;
    let publishedCount = 0;
    const failures: string[] = [];

    setUploading(true);

    try {
      for (let folderIndex = 0; folderIndex < batches.length; folderIndex += 1) {
        const batch = batches[folderIndex];
        const imageFiles = batch.files.filter(isImageFile);
        const place = batch.name;

        if (imageFiles.length === 0) {
          failures.push(`${place} (no supported images)`);
          continue;
        }

        onStatusChange({
          phase: "preparing",
          folderName: place,
          completed: 0,
          total: imageFiles.length,
          folderIndex: folderIndex + 1,
          folderCount,
          publishedCount,
        });

        const mediaIds: string[] = [];
        let completed = 0;
        let uploadFailures = 0;
        let lastError = "";

        onStatusChange({
          phase: "uploading",
          folderName: place,
          completed: 0,
          total: imageFiles.length,
          folderIndex: folderIndex + 1,
          folderCount,
          publishedCount,
        });

        for (const file of imageFiles) {
          const { data, error } = await adminUploadMedia(file);
          completed += 1;
          onStatusChange({
            phase: "uploading",
            folderName: place,
            completed,
            total: imageFiles.length,
            folderIndex: folderIndex + 1,
            folderCount,
            publishedCount,
          });
          if (error || !data) {
            uploadFailures += 1;
            if (error?.message) lastError = error.message;
            continue;
          }
          mediaIds.push(data.id);
        }

        if (mediaIds.length === 0) {
          failures.push(`${place} (${lastError || "upload failed"})`);
          continue;
        }

        onStatusChange({
          phase: "creating",
          folderName: place,
          completed: mediaIds.length,
          total: imageFiles.length,
          folderIndex: folderIndex + 1,
          folderCount,
          publishedCount,
        });

        const payload = formValuesToPayload(
          entity,
          {
            place,
            media_ids: mediaIds,
            category_ids: [],
            sort_order: 0,
            is_published: true,
          },
          "create",
        );

        const { data, error } = await adminCreate<Record<string, unknown>>(entity.endpoint, payload);

        if (error || !data) {
          failures.push(`${place} (${error?.message ?? "could not create"})`);
          continue;
        }

        publishedCount += 1;
        prependCachedAdminListItem(entity.endpoint, data, entity.idField ?? "id");
        onCreated(data);

        if (uploadFailures > 0) {
          failures.push(`${place} (${uploadFailures} photo${uploadFailures === 1 ? "" : "s"} skipped)`);
        }
      }

      revalidateAdminListInBackground(entity.endpoint, 20, 0);

      if (publishedCount === 0) {
        onStatusChange({
          phase: "error",
          folderName: batches[0]?.name ?? "Upload",
          completed: 0,
          total: 0,
          folderCount,
          message: failures[0] ?? "No gallery items could be created.",
        });
        showErrorToast(failures[0] ?? "No gallery items could be created.");
        return;
      }

      const lastBatch = batches[Math.min(publishedCount, batches.length) - 1];
      onStatusChange({
        phase: "done",
        folderName: folderCount > 1 ? `${publishedCount} folders published` : lastBatch?.name ?? "Done",
        completed: publishedCount,
        total: folderCount,
        folderIndex: folderCount,
        folderCount,
        publishedCount,
        message:
          failures.length > 0
            ? `${failures.length} folder${failures.length === 1 ? "" : "s"} skipped: ${failures.slice(0, 2).join("; ")}${failures.length > 2 ? "…" : ""}`
            : undefined,
      });

      if (folderCount > 1) {
        showCreatedToast(
          `Published ${publishedCount} gallery item${publishedCount === 1 ? "" : "s"} from ${folderCount} folder${folderCount === 1 ? "" : "s"}.`,
        );
      } else {
        showCreatedToast(`"${lastBatch?.name}" published.`);
      }

      window.setTimeout(() => onStatusChange(null), 2500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong during upload.";
      onStatusChange({
        phase: "error",
        folderName: batches[0]?.name ?? "Upload",
        completed: publishedCount,
        total: folderCount,
        folderCount,
        publishedCount,
        message,
      });
      showErrorToast(message);
    } finally {
      setUploading(false);
    }
  };

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    event.target.value = "";
    if (!fileList?.length) return;
    const batches = buildFolderBatchesFromInput(Array.from(fileList));
    void processFolderBatch(batches);
  };

  const openFolderPicker = () => {
    if (uploading || disabled) return;
    inputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        className="admin-btn admin-btn--secondary admin-btn--add"
        disabled={disabled || uploading}
        onClick={openFolderPicker}
        title="Select one folder, or a parent folder with multiple subfolders"
      >
        <FolderUp aria-hidden className="admin-btn__icon" />
        Upload folders
      </button>

      <input
        ref={inputRef}
        id="gallery-folder-upload-input"
        type="file"
        className="sr-only"
        multiple
        // @ts-expect-error — non-standard directory picker attributes
        webkitdirectory=""
        directory=""
        onChange={handleFolderChange}
      />
    </>
  );
}
