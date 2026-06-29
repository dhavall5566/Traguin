export type AdminMediaOption = {
  value: string;
  label: string;
  url?: string;
  displayName?: string;
};

function formatMediaLabel(slug: string | null | undefined, url: string): string {
  return [slug, url].filter(Boolean).join(" · ") || url;
}

function displayNameFromAsset(row: Record<string, unknown>, slug: string | null): string {
  const alt = typeof row.alt_text === "string" ? row.alt_text.trim() : "";
  if (alt) return alt;
  if (slug) return slug;
  const url = typeof row.url === "string" ? row.url : "";
  if (url) {
    const filename = url.split("/").pop()?.split("?")[0] ?? "";
    if (filename) return filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  }
  return "Image";
}

export function mediaOptionsFromAssets(media: unknown): AdminMediaOption[] {
  if (!Array.isArray(media)) return [];

  return media.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const id = row.id != null ? String(row.id) : "";
    const url = typeof row.url === "string" ? row.url : "";
    if (!id || !url) return [];
    const slug = row.slug != null ? String(row.slug) : null;
    return [{
      value: id,
      label: formatMediaLabel(slug, url),
      url,
      displayName: displayNameFromAsset(row, slug),
    }];
  });
}

/** Map admin media relation field names to nested media arrays on API records. */
export function mediaSeedOptionsForField(
  fieldName: string,
  record: Record<string, unknown> | null | undefined,
): AdminMediaOption[] {
  if (!record) return [];

  if (fieldName === "media_ids") {
    return mediaOptionsFromAssets(record.media);
  }
  if (fieldName === "gallery_media_ids") {
    return mediaOptionsFromAssets(record.gallery_media);
  }
  if (fieldName.endsWith("_media_id")) {
    const mediaId = record[fieldName];
    const nestedKey = fieldName.replace(/_id$/, "");
    const nested = record[nestedKey];
    if (Array.isArray(nested)) {
      const match = mediaOptionsFromAssets(nested).find((opt) => opt.value === String(mediaId ?? ""));
      return match ? [match] : mediaOptionsFromAssets(nested);
    }
  }

  return mediaOptionsFromAssets(record.media ?? record.gallery_media);
}
