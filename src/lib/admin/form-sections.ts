import type { AdminFieldDef } from "@/lib/admin/types";

export type FormSectionDef = {
  id: string;
  title: string;
  description?: string;
  /** Sidebar sections render in the right rail on wide screens. */
  variant?: "main" | "sidebar";
  fields: AdminFieldDef[];
};

function isMediaField(field: AdminFieldDef): boolean {
  return (
    (field.type === "relation" || field.type === "relation-multi") &&
    field.relation?.endpoint === "/media"
  );
}

function isRichContentField(field: AdminFieldDef): boolean {
  return (
    field.type === "textarea" ||
    field.type === "nested-list" ||
    field.type === "legal-sections" ||
    field.type === "stat-list" ||
    field.type === "json-display"
  );
}

function isSettingsField(field: AdminFieldDef): boolean {
  if (field.type === "boolean") return true;
  if (field.name === "sort_order" || field.name.endsWith("_sort_order")) return true;
  if (field.name.startsWith("is_") || field.name.startsWith("show_")) return true;
  return false;
}

export function groupEntityFormSections(
  fields: AdminFieldDef[],
  entityKey?: string,
): FormSectionDef[] {
  if (entityKey === "client-stories") {
    const pick = (names: string[]) =>
      fields.filter((field) => names.includes(field.name));

    const sections: FormSectionDef[] = [
      {
        id: "story",
        title: "Story",
        description: "Client details and review.",
        fields: pick(["client_name", "destination_id", "quote"]),
      },
      {
        id: "media",
        title: "Media",
        description: "Portrait photo for the client stories grid.",
        fields: pick(["portrait_media_id"]),
      },
      {
        id: "settings",
        title: "Publishing",
        description: "Visibility and display order on the site.",
        variant: "sidebar",
        fields: pick([
          "show_on_home",
          "show_in_gallery",
          "is_featured_in_gallery",
          "home_sort_order",
          "gallery_sort_order",
          "is_published",
        ]),
      },
    ];

    return sections.filter((section) => section.fields.length > 0);
  }

  const assigned = new Set<string>();
  const sections: FormSectionDef[] = [];

  const take = (predicate: (field: AdminFieldDef) => boolean) => {
    const picked = fields.filter((field) => !assigned.has(field.name) && predicate(field));
    picked.forEach((field) => assigned.add(field.name));
    return picked;
  };

  const general = take(
    (field) => !isMediaField(field) && !isRichContentField(field) && !isSettingsField(field),
  );
  if (general.length > 0) {
    sections.push({
      id: "general",
      title: "General",
      description: "Core identifiers and linked records.",
      fields: general,
    });
  }

  const content = take(isRichContentField);
  if (content.length > 0) {
    sections.push({
      id: "content",
      title: "Content",
      description: "Long-form copy and structured content blocks.",
      fields: content,
    });
  }

  const media = take(isMediaField);
  if (media.length > 0) {
    sections.push({
      id: "media",
      title: "Media",
      description: "Images and gallery assets for this record.",
      fields: media,
    });
  }

  const settings = take(isSettingsField);
  if (settings.length > 0) {
    sections.push({
      id: "settings",
      title: "Publishing",
      description: "Visibility and display order on the site.",
      variant: "sidebar",
      fields: settings,
    });
  }

  const remaining = take(() => true);
  if (remaining.length > 0) {
    if (sections.length === 0) {
      sections.push({ id: "details", title: "Details", fields: remaining });
    } else {
      sections[sections.length - 1].fields.push(...remaining);
    }
  }

  return sections;
}
