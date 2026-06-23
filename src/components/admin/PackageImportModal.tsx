"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ExtractedPackageBundle,
  PackageImportExtractResponse,
  PackageImportReviewCommit,
} from "@/lib/admin/package-import-types";

const ADMIN_API = "/api/admin/package-import";

function parseApiError(body: unknown, status: number, fallback: string): string {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail?: unknown }).detail;
    if (typeof detail === "string" && detail.trim()) {
      if (status === 404 && detail.toLowerCase() === "not found") {
        return "Import service unavailable. Make sure the API server is running on port 8001.";
      }
      return detail;
    }
  }
  if (status === 404) {
    return "Import service not found. Restart the API server and try again.";
  }
  if (status === 401 || status === 403) {
    return "Session expired. Sign in again and retry.";
  }
  return fallback;
}

async function extractPdf(file: File): Promise<PackageImportExtractResponse> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${ADMIN_API}/extract`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseApiError(body, response.status, "Extraction failed."));
  }
  return body as PackageImportExtractResponse;
}

async function commitImport(payload: PackageImportReviewCommit) {
  const response = await fetch(`${ADMIN_API}/commit`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(parseApiError(body, response.status, "Save failed."));
  }
  return body as {
    destination_id: string;
    package_id: string;
    itinerary_id: string;
    destination_slug: string;
    package_slug: string;
    itinerary_slug: string;
  };
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="admin-import-field">
      <span className="admin-field-label">{label}</span>
      {multiline ? (
        <textarea className="admin-textarea" value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      ) : (
        <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

type PackageImportModalProps = {
  open: boolean;
  onClose: () => void;
  onCommitted?: () => void;
};

export function PackageImportModal({ open, onClose, onCommitted }: PackageImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PackageImportExtractResponse | null>(null);
  const [draft, setDraft] = useState<ExtractedPackageBundle | null>(null);
  const [commitResult, setCommitResult] = useState<string | null>(null);

  const mediaIds = useMemo(
    () => (result?.images ?? []).map((img) => img.media_asset_id).filter(Boolean) as string[],
    [result],
  );

  const heroMediaId = mediaIds[0] ?? null;

  const reset = () => {
    setFile(null);
    setLoading(false);
    setSaving(false);
    setError(null);
    setResult(null);
    setDraft(null);
    setCommitResult(null);
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading && !saving) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, loading, saving, onClose]);

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setCommitResult(null);
    try {
      const data = await extractPdf(file);
      setResult(data);
      setDraft(structuredClone(data.extracted));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      const payload: PackageImportReviewCommit = {
        destination: draft.destination,
        package: draft.package,
        itinerary: draft.itinerary,
        gallery_media_ids: mediaIds,
        hero_media_id: heroMediaId,
        package_hero_media_id: heroMediaId,
        itinerary_hero_media_id: heroMediaId,
        category_ids: [],
      };
      await commitImport(payload);
      onCommitted?.();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (loading || saving) return;
    onClose();
  };

  const handleFileSelect = (next: File | null) => {
    if (!next || next.type === "application/pdf" || next.name.toLowerCase().endsWith(".pdf")) {
      setFile(next);
      setError(null);
      setCommitResult(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  if (!open) return null;

  const showReview = Boolean(draft);

  return (
    <div className="admin-modal-backdrop" role="presentation" onClick={handleClose}>
      <div
        className={cn("admin-modal admin-modal--import", showReview && "admin-modal--import-expanded")}
        role="dialog"
        aria-labelledby="package-import-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="admin-modal__head">
          <div className="admin-modal__head-copy">
            <p className="admin-modal__eyebrow">Package import</p>
            <h2 id="package-import-title" className="admin-modal__title">
              Upload PDF
            </h2>
            {!showReview && (
              <p className="admin-modal__subtitle">
                We&apos;ll extract the destination, package, and itinerary for you to review.
              </p>
            )}
          </div>
          <button
            type="button"
            className="admin-modal__close"
            aria-label="Close"
            disabled={loading || saving}
            onClick={handleClose}
          >
            <X aria-hidden className="admin-modal__close-icon" />
          </button>
        </header>

        <div className="admin-modal__body">
          {error && <div className="admin-alert admin-alert--error admin-modal__alert">{error}</div>}
          {commitResult && (
            <div className="admin-alert admin-alert--success admin-modal__alert">{commitResult}</div>
          )}

          {!showReview && (
            <div className="admin-import-dropzone-wrap">
              <p className="admin-import-progress-label">Step 1 of 3 · Choose a PDF file</p>

              <div
                className={cn(
                  "admin-import-dropzone",
                  dragActive && "admin-import-dropzone--active",
                  file && "admin-import-dropzone--selected",
                )}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Choose package PDF"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="admin-import-dropzone__input"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                />

                <span className="admin-import-dropzone__icon-wrap" aria-hidden>
                  {file ? <FileText className="admin-import-dropzone__icon" /> : <Upload className="admin-import-dropzone__icon" />}
                </span>

                <span className="admin-import-dropzone__title">
                  {file ? file.name : "Drop your PDF here"}
                </span>
                <span className="admin-import-dropzone__hint">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Click to replace` : "or click to browse files"}
                </span>
              </div>
            </div>
          )}

          {showReview && (
            <div className="admin-import-review-banner">
              <FileText aria-hidden className="admin-import-review-banner__icon" />
              <div>
                <p className="admin-import-review-banner__title">{file?.name ?? "Imported PDF"}</p>
                <p className="admin-import-review-banner__meta">Review extracted content before saving to CMS</p>
              </div>
              <button
                type="button"
                className="admin-import-review-banner__change"
                disabled={loading || saving}
                onClick={reset}
              >
                Change file
              </button>
            </div>
          )}

          {result && (
            <>
              <details className="admin-import-details">
                <summary>Raw extracted JSON (LLM output)</summary>
                <pre className="admin-json-display">{JSON.stringify(result.llm_raw_json, null, 2)}</pre>
              </details>

              <details className="admin-import-details">
                <summary>Raw PDF text ({result.raw_text_char_count} chars)</summary>
                <pre className="admin-json-display admin-import-raw-text">{result.raw_text}</pre>
              </details>

              {result.warnings.length > 0 && (
                <div className="admin-import-warnings">
                  {result.warnings.map((w, index) => (
                    <p key={`warning-${index}`}>{w}</p>
                  ))}
                </div>
              )}

              <section className="admin-import-section">
                <h3 className="admin-import-section__title">Sourced images</h3>
                <div className="admin-import-images">
                  {result.images.map((img, index) => (
                    <div key={`image-${index}-${img.place}`} className="admin-import-image-card">
                      <p className="admin-import-image-card__place">{img.place}</p>
                      {img.preview_url || img.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img.preview_url ?? img.url ?? ""} alt={img.place} />
                      ) : (
                        <p className="admin-import-image-card__error">{img.error ?? "No image"}</p>
                      )}
                      {img.url && (
                        <a href={img.url} target="_blank" rel="noreferrer" className="admin-import-image-card__link">
                          Full image
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {draft && (
            <>
              <section className="admin-import-section">
                <h3 className="admin-import-section__title">Destination</h3>
                <Field label="Name" value={draft.destination.name} onChange={(v) => setDraft({ ...draft, destination: { ...draft.destination, name: v } })} />
                <Field label="Slug" value={draft.destination.slug ?? ""} onChange={(v) => setDraft({ ...draft, destination: { ...draft.destination, slug: v } })} />
                <Field label="Country" value={draft.destination.country ?? ""} onChange={(v) => setDraft({ ...draft, destination: { ...draft.destination, country: v } })} />
                <Field label="Region (domestic/international)" value={draft.destination.region} onChange={(v) => setDraft({ ...draft, destination: { ...draft.destination, region: v as "domestic" | "international" } })} />
                <Field label="India region" value={draft.destination.india_region ?? ""} onChange={(v) => setDraft({ ...draft, destination: { ...draft.destination, india_region: v as "north" | "east" | "south" | "west" | null } })} />
                <Field label="Description" multiline value={draft.destination.description} onChange={(v) => setDraft({ ...draft, destination: { ...draft.destination, description: v } })} />
              </section>

              <section className="admin-import-section">
                <h3 className="admin-import-section__title">Package</h3>
                <Field label="Title" value={draft.package.title} onChange={(v) => setDraft({ ...draft, package: { ...draft.package, title: v } })} />
                <Field label="Slug" value={draft.package.slug ?? ""} onChange={(v) => setDraft({ ...draft, package: { ...draft.package, slug: v } })} />
                <Field label="Duration label" value={draft.package.duration_label} onChange={(v) => setDraft({ ...draft, package: { ...draft.package, duration_label: v } })} />
                <Field label="Highlights (one per line)" multiline value={draft.package.highlights.join("\n")} onChange={(v) => setDraft({ ...draft, package: { ...draft.package, highlights: v.split("\n").filter(Boolean) } })} />
              </section>

              <section className="admin-import-section">
                <h3 className="admin-import-section__title">Itinerary</h3>
                <Field label="Title" value={draft.itinerary.title} onChange={(v) => setDraft({ ...draft, itinerary: { ...draft.itinerary, title: v } })} />
                <Field label="Tagline" value={draft.itinerary.tagline} onChange={(v) => setDraft({ ...draft, itinerary: { ...draft.itinerary, tagline: v } })} />
                <Field label="Overview" multiline value={draft.itinerary.overview} onChange={(v) => setDraft({ ...draft, itinerary: { ...draft.itinerary, overview: v } })} />
                <Field label="Duration label" value={draft.itinerary.duration_label} onChange={(v) => setDraft({ ...draft, itinerary: { ...draft.itinerary, duration_label: v } })} />

                <h4 className="admin-import-subtitle">Days ({draft.itinerary.days.length})</h4>
                {draft.itinerary.days.map((day, index) => (
                  <div key={`day-${day.day_number}-${index}`} className="admin-import-nested-card">
                    <Field label={`Day ${day.day_number} title`} value={day.title} onChange={(v) => {
                      const days = [...draft.itinerary.days];
                      days[index] = { ...day, title: v };
                      setDraft({ ...draft, itinerary: { ...draft.itinerary, days } });
                    }} />
                    <Field label="Description" multiline value={day.description} onChange={(v) => {
                      const days = [...draft.itinerary.days];
                      days[index] = { ...day, description: v };
                      setDraft({ ...draft, itinerary: { ...draft.itinerary, days } });
                    }} />
                  </div>
                ))}

                <h4 className="admin-import-subtitle">Hotels ({draft.itinerary.hotels.length})</h4>
                {draft.itinerary.hotels.map((hotel, index) => (
                  <div key={`hotel-${index}-${hotel.category_label ?? "option"}-${hotel.name}`} className="admin-import-nested-card">
                    <p className="admin-import-nested-card__meta">{hotel.category_label ?? "Option"} · {hotel.location}</p>
                    <Field label="Name" value={hotel.name} onChange={(v) => {
                      const hotels = [...draft.itinerary.hotels];
                      hotels[index] = { ...hotel, name: v };
                      setDraft({ ...draft, itinerary: { ...draft.itinerary, hotels } });
                    }} />
                  </div>
                ))}

                <h4 className="admin-import-subtitle">Inclusions ({draft.itinerary.inclusions.length})</h4>
                <Field
                  label="Included / excluded (prefix with + or -)"
                  multiline
                  value={draft.itinerary.inclusions.map((i) => `${i.kind === "included" ? "+" : "-"} ${i.text}`).join("\n")}
                  onChange={(v) => {
                    const inclusions = v
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, sort_order) => {
                        const included = line.startsWith("+");
                        const text = line.replace(/^[-+]\s*/, "");
                        return { kind: included ? "included" as const : "excluded" as const, text, sort_order };
                      });
                    setDraft({ ...draft, itinerary: { ...draft.itinerary, inclusions } });
                  }}
                />
              </section>
            </>
          )}
        </div>

        {!showReview ? (
          <footer className="admin-modal__footer">
            <button type="button" className="admin-btn admin-btn--secondary" disabled={loading} onClick={handleClose}>
              Cancel
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary admin-btn--add"
              disabled={!file || loading}
              onClick={() => void handleExtract()}
            >
              {loading ? "Extracting…" : "Extract from PDF"}
            </button>
          </footer>
        ) : (
          <footer className="admin-modal__footer">
            <button type="button" className="admin-btn admin-btn--secondary" disabled={loading || saving} onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className="admin-btn admin-btn--primary admin-btn--add" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "Saving…" : "Save to CMS"}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
