"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { adminGetOne, adminUploadMedia, type AdminMediaAsset } from "@/lib/admin/api-client";
import type { AdminMediaOption } from "@/lib/admin/media-field-options";
import { cn } from "@/lib/utils";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

type MediaOption = { value: string; label: string; url?: string; displayName?: string };

function displayNameFromFilename(filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, "").trim();
  if (!stem) return "Image";
  return stem.replace(/[-_]+/g, " ");
}

function cardDisplayName(
  opt: MediaOption | undefined,
  fallbackCaption: string | undefined,
  index: number,
  total: number,
): string {
  const caption = fallbackCaption?.trim();
  if (caption) return total > 1 ? `${caption} (${index + 1})` : caption;
  if (opt?.displayName?.trim()) return opt.displayName.trim();
  const fromLabel = opt?.label.split(" · ")[0]?.trim();
  if (fromLabel && !fromLabel.startsWith("http")) return fromLabel;
  return `Image ${index + 1}`;
}

function formatMediaLabel(slug: string | null | undefined, url: string): string {
  return [slug, url].filter(Boolean).join(" · ") || url;
}

function urlFromLabel(label: string): string | null {
  const parts = label.split(" · ");
  const candidate = parts[parts.length - 1]?.trim();
  return candidate?.startsWith("http") ? candidate : null;
}

function optionUrl(opt: MediaOption): string | null {
  const raw = opt.url ?? urlFromLabel(opt.label);
  return resolvePreviewUrl(raw);
}

function resolvePreviewUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = (process.env.NEXT_PUBLIC_CMS_API_URL ?? "http://127.0.0.1:8001").replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

/** Renders the full image scaled to its column — never cropped. */
function UncroppedMediaPreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="admin-media-field__card-img-frame">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="admin-media-field__card-img"
        decoding="async"
      />
    </div>
  );
}

type AdminMediaFieldBaseProps = {
  id?: string;
  error?: string;
  relationOptions: { value: string; label: string }[];
  seedOptions?: AdminMediaOption[];
  /** Shared caption for each image card (e.g. gallery item name). */
  imageCaption?: string;
  compact?: boolean;
  /** Hide the existing-asset dropdown; upload + preview grid only. */
  hideSelect?: boolean;
};

type AdminMediaFieldSingleProps = AdminMediaFieldBaseProps & {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
};

type AdminMediaFieldMultiProps = AdminMediaFieldBaseProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
};

export type AdminMediaFieldProps = AdminMediaFieldSingleProps | AdminMediaFieldMultiProps;

export function AdminMediaField(props: AdminMediaFieldProps) {
  const {
    id,
    error,
    relationOptions,
    seedOptions = [],
    imageCaption,
    compact = false,
    multiple = false,
    hideSelect = false,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [localOptions, setLocalOptions] = useState<MediaOption[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fetchedIdsRef = useRef<Set<string>>(new Set());

  const multiValue = multiple ? props.value : [];

  const previewIds = (multiple ? multiValue : props.value ? [props.value] : [])
    .map((mediaId) => String(mediaId))
    .filter(Boolean);

  const options = useMemo(() => {
    const map = new Map<string, MediaOption>();
    for (const opt of relationOptions) {
      map.set(String(opt.value), { ...opt, value: String(opt.value), url: urlFromLabel(opt.label) ?? undefined });
    }
    for (const opt of seedOptions) {
      map.set(String(opt.value), {
        ...opt,
        value: String(opt.value),
        url: opt.url ?? urlFromLabel(opt.label) ?? undefined,
      });
    }
    for (const opt of localOptions) {
      map.set(String(opt.value), { ...opt, value: String(opt.value) });
    }
    return Array.from(map.values());
  }, [relationOptions, seedOptions, localOptions]);

  const optionsById = useMemo(
    () => new Map(options.map((opt) => [opt.value, opt])),
    [options],
  );

  useEffect(() => {
    const missing = previewIds.filter(
      (mediaId) => mediaId && !optionsById.has(mediaId) && !fetchedIdsRef.current.has(mediaId),
    );
    if (missing.length === 0) return;

    for (const mediaId of missing) {
      fetchedIdsRef.current.add(mediaId);
    }

    void (async () => {
      const results = await Promise.all(
        missing.map((mediaId) => adminGetOne<AdminMediaAsset>("/media", mediaId)),
      );

      const fetched = results.flatMap(({ data }) =>
        data
          ? [
              {
                value: data.id,
                label: formatMediaLabel(data.slug, data.url),
                url: data.url,
                displayName: data.alt_text?.trim() || data.slug || "Image",
              },
            ]
          : [],
      );

      if (fetched.length > 0) {
        setLocalOptions((prev) => {
          const map = new Map(prev.map((opt) => [opt.value, opt]));
          for (const opt of fetched) {
            map.set(opt.value, opt);
          }
          return Array.from(map.values());
        });
      }
    })();
  }, [optionsById, previewIds]);

  const removePreview = (optionId: string) => {
    if (multiple) {
      props.onChange(multiValue.filter((id) => id !== optionId));
      return;
    }
    props.onChange("");
  };

  const handleUpload = async (files: FileList | null) => {
    const list = files ? Array.from(files) : [];
    if (list.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setUploadProgress(`Uploading 0 of ${list.length}…`);

    let completed = 0;
    const results = await Promise.all(
      list.map(async (file) => {
        const { data, error: apiError } = await adminUploadMedia(file);
        completed += 1;
        setUploadProgress(`Uploading ${completed} of ${list.length}…`);

        if (apiError || !data) {
          return {
            ok: false as const,
            message: apiError?.message ?? `Failed to upload ${file.name}.`,
          };
        }

        return {
          ok: true as const,
          option: {
            value: data.id,
            label: formatMediaLabel(data.slug, data.url),
            url: data.url,
            displayName: data.alt_text?.trim() || data.slug || displayNameFromFilename(file.name),
          },
        };
      }),
    );

    const uploaded = results.flatMap((result) => (result.ok ? [result.option] : []));
    const failures = results.flatMap((result) => (!result.ok ? [result.message] : []));

    if (failures.length > 0) {
      setUploadError(
        failures.length === list.length
          ? failures[0] ?? "Upload failed."
          : `${failures.length} of ${list.length} uploads failed. ${uploaded.length} image(s) added.`,
      );
    }

    if (uploaded.length === 0) {
      setUploading(false);
      setUploadProgress(null);
      return;
    }

    setLocalOptions((prev) => [...prev, ...uploaded]);
    const uploadedIds = uploaded.map((opt) => opt.value);

    if (multiple) {
      props.onChange([...new Set([...multiValue, ...uploadedIds])]);
    } else {
      props.onChange(uploadedIds[uploaded.length - 1] ?? props.value);
    }

    setUploading(false);
    setUploadProgress(null);
  };

  const showPicker = multiple && !hideSelect;
  const uploadLabel = multiple || hideSelect ? "Upload images" : "Upload image";
  const useFullCards = multiple || hideSelect;

  return (
    <div
      className={cn(
        "admin-media-field",
        compact && "admin-media-field--compact",
        (multiple || hideSelect) && "admin-media-field--multi",
        useFullCards && "admin-media-field--full-cards",
      )}
    >
      <div className="admin-media-field__toolbar">
        <button
          type="button"
          className="admin-btn admin-btn--secondary admin-media-field__upload"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="admin-media-field__upload-icon" aria-hidden />
          {uploading ? uploadProgress ?? "Uploading…" : uploadLabel}
        </button>
        {hideSelect || multiple ? (
          <p className="admin-media-field__hint">
            Upload one or more images. Use the × on a preview to remove it.
          </p>
        ) : null}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(e) => {
            void handleUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {!multiple && !hideSelect ? (
        <select
          className={cn("admin-select", error && "admin-select--error")}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={uploading}
        >
          <option value="">— None —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : null}

      {showPicker ? (
        <div className="admin-media-field__picker" role="listbox" aria-multiselectable="true">
          {options.length === 0 ? (
            <p className="admin-media-field__empty">No media assets yet. Upload images to get started.</p>
          ) : (
            options.map((opt) => {
              const isSelected = multiValue.includes(opt.value);
              const preview = optionUrl(opt);
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn("admin-media-field__option", isSelected && "admin-media-field__option--selected")}
                  onClick={() => {
                    const next = isSelected
                      ? multiValue.filter((id) => id !== opt.value)
                      : [...multiValue, opt.value];
                    props.onChange(next);
                  }}
                >
                  <span className="admin-media-field__option-check" aria-hidden>
                    {isSelected ? "✓" : ""}
                  </span>
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="" className="admin-media-field__option-image" />
                  ) : (
                    <span className="admin-media-field__option-placeholder">No preview</span>
                  )}
                  <span className="admin-media-field__option-label">{opt.label}</span>
                </button>
              );
            })
          )}
        </div>
      ) : null}

      {previewIds.length > 0 ? (
        <div className="admin-media-field__selected">
          <span className="admin-media-field__selected-label">
            {multiple || hideSelect ? `Images (${previewIds.length})` : "Preview"}
          </span>
          <div className="admin-media-field__selected-grid">
            {previewIds.map((optionId, index) => {
              const opt = optionsById.get(optionId);
              const preview = opt ? optionUrl(opt) : null;
              const name = cardDisplayName(opt, imageCaption, index, previewIds.length);

              if (useFullCards) {
                return (
                  <figure key={optionId} className="admin-media-field__card">
                    <div className="admin-media-field__card-image">
                      {preview ? (
                        <UncroppedMediaPreview src={preview} alt={name} />
                      ) : (
                        <span className="admin-media-field__option-placeholder">No preview</span>
                      )}
                      <button
                        type="button"
                        className="admin-media-field__remove"
                        aria-label={`Remove ${name}`}
                        onClick={() => removePreview(optionId)}
                      >
                        <X aria-hidden />
                      </button>
                    </div>
                    <figcaption className="admin-media-field__card-name">{name}</figcaption>
                  </figure>
                );
              }

              return (
                <div key={optionId} className="admin-media-field__selected-item">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt={name} />
                  ) : (
                    <span className="admin-media-field__option-placeholder">No preview</span>
                  )}
                  <button
                    type="button"
                    className="admin-media-field__remove"
                    aria-label={`Remove ${name}`}
                    onClick={() => removePreview(optionId)}
                  >
                    <X aria-hidden />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {uploadError ? <p className="admin-media-field__error">{uploadError}</p> : null}
    </div>
  );
}
