/** CMS legal page section shape (matches public mapCmsLegalSection input). */
export type LegalSectionPayload = {
  title: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalSectionFormItem = {
  title: string;
  paragraphs: string;
  list: string;
};

export function sectionsToFormValue(raw: unknown): LegalSectionFormItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const section = (item ?? {}) as Record<string, unknown>;
    const paragraphs = Array.isArray(section.paragraphs)
      ? (section.paragraphs as string[])
      : typeof section.body === "string"
        ? [section.body]
        : [];
    const list = Array.isArray(section.list)
      ? (section.list as string[])
      : Array.isArray(section.bullets)
        ? (section.bullets as string[])
        : [];
    return {
      title: String(section.title ?? ""),
      paragraphs: paragraphs.join("\n"),
      list: list.join("\n"),
    };
  });
}

export function formValueToSections(items: LegalSectionFormItem[]): LegalSectionPayload[] {
  return items
    .map((item) => {
      const title = item.title.trim();
      if (!title) return null;
      const paragraphs = item.paragraphs
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const list = item.list
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const payload: LegalSectionPayload = { title };
      if (paragraphs.length > 0) payload.paragraphs = paragraphs;
      if (list.length > 0) payload.list = list;
      return payload;
    })
    .filter((section): section is LegalSectionPayload => section !== null);
}
