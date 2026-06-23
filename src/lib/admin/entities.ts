import { ALL_ADMIN_ENTITIES } from "@/lib/admin/all-entities";
import { formValueToSections, sectionsToFormValue } from "@/lib/admin/legal-sections";
import { formValueToNestedList, nestedListToFormValue } from "@/lib/admin/nested-list";
import { formValueToStats, statsToFormValue } from "@/lib/admin/stat-list";
import type { AdminEntityDef, AdminEntityGroup, AdminFieldDef } from "@/lib/admin/types";

export type {
  AdminEntityDef,
  AdminEntityGroup,
  AdminFieldDef,
  AdminFieldType,
  AdminRelationConfig,
} from "@/lib/admin/types";
export { ADMIN_ENTITY_GROUPS } from "@/lib/admin/types";

const PILOT_ENTITIES: Record<string, AdminEntityDef> = {
  specializations: {
    key: "specializations",
    label: "Specialization",
    pluralLabel: "Specializations",
    group: "content",
    endpoint: "/specializations",
    nameField: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, showInList: true },
      { name: "slug", label: "Slug", type: "slug", required: true, showInList: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "icon_key", label: "Icon key", type: "text", required: true, helpText: "Lucide icon key, e.g. compass, sparkles" },
      { name: "sort_order", label: "Sort order", type: "number", required: true, showInList: true },
    ],
  },
  destinations: {
    key: "destinations",
    label: "Destination",
    pluralLabel: "Destinations",
    group: "catalog",
    endpoint: "/destinations",
    nameField: "name",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, showInList: true },
      { name: "slug", label: "Slug", type: "slug", required: true, showInList: true },
      {
        name: "region",
        label: "Region",
        type: "select",
        required: true,
        showInList: true,
        options: [
          { value: "domestic", label: "Domestic" },
          { value: "international", label: "International" },
        ],
      },
      {
        name: "india_region",
        label: "India region",
        type: "select",
        options: [
          { value: "", label: "— None —" },
          { value: "north", label: "North" },
          { value: "east", label: "East" },
          { value: "south", label: "South" },
          { value: "west", label: "West" },
        ],
      },
      { name: "country", label: "Country", type: "text" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "starting_price", label: "Starting price", type: "number", required: true, showInList: true },
      {
        name: "category_ids",
        label: "Categories",
        type: "relation-multi",
        relation: { endpoint: "/destination-categories", valueKey: "id", labelKey: "title" },
        readFrom: (record) =>
          Array.isArray(record.categories)
            ? (record.categories as { id: string }[]).map((c) => c.id)
            : [],
        showInList: true,
        listLabel: "Categories",
        listFormat: (_v, record) =>
          Array.isArray(record.categories)
            ? (record.categories as { title: string }[]).map((c) => c.title).join(", ") || "—"
            : "—",
      },
      {
        name: "hero_media_id",
        label: "Hero media",
        type: "relation",
        relation: { endpoint: "/media", valueKey: "id", labelKeys: ["slug", "url"] },
      },
      {
        name: "gallery_media_ids",
        label: "Gallery media",
        type: "relation-multi",
        relation: { endpoint: "/media", valueKey: "id", labelKeys: ["slug", "url"] },
        readFrom: (record) =>
          Array.isArray(record.gallery_media)
            ? (record.gallery_media as { id: string }[]).map((m) => m.id)
            : [],
      },
      { name: "moods", label: "Moods", type: "tags", helpText: "Comma-separated tags" },
      { name: "is_featured", label: "Featured", type: "boolean" },
      { name: "featured_sort_order", label: "Featured sort order", type: "number" },
      { name: "is_published", label: "Published", type: "boolean", showInList: true, listFormat: (v) => (v ? "Yes" : "No") },
      { name: "package_count", label: "Package count", type: "number" },
      { name: "hotel_count", label: "Hotel count", type: "number" },
      { name: "meta_title", label: "Meta title", type: "text" },
      { name: "meta_description", label: "Meta description", type: "textarea" },
    ],
  },
  "company-stats": {
    key: "company-stats",
    label: "Company Stats",
    pluralLabel: "Company Stats",
    group: "site-config",
    endpoint: "/company-stats",
    isSingleton: true,
    fields: [
      {
        name: "homepage_stats",
        label: "Homepage stats",
        type: "stat-list",
        helpText: "Stat blocks shown on the homepage (label + value pairs).",
        readFrom: (record) => statsToFormValue(record.homepage_stats),
        writeValue: (value) => formValueToStats(value as Parameters<typeof formValueToStats>[0]),
      },
      {
        name: "trust_bar_stats",
        label: "Trust bar stats",
        type: "stat-list",
        readFrom: (record) => statsToFormValue(record.trust_bar_stats),
        writeValue: (value) => formValueToStats(value as Parameters<typeof formValueToStats>[0]),
      },
      {
        name: "gallery_stats",
        label: "Gallery stats",
        type: "stat-list",
        readFrom: (record) => statsToFormValue(record.gallery_stats),
        writeValue: (value) => formValueToStats(value as Parameters<typeof formValueToStats>[0]),
      },
    ],
  },
  "legal-pages": {
    key: "legal-pages",
    label: "Legal Page",
    pluralLabel: "Legal Pages",
    group: "careers-legal",
    endpoint: "/legal-pages",
    nameField: "title",
    fields: [
      { name: "slug", label: "Slug", type: "slug", required: true, showInList: true },
      { name: "eyebrow", label: "Eyebrow", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true, showInList: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "effective_date", label: "Effective date", type: "text", required: true, showInList: true },
      {
        name: "hero_media_id",
        label: "Hero media",
        type: "relation",
        relation: { endpoint: "/media", valueKey: "id", labelKeys: ["slug", "url"] },
      },
      { name: "hero_image_alt", label: "Hero image alt", type: "text" },
      {
        name: "sections",
        label: "Sections",
        type: "legal-sections",
        readFrom: (record) => sectionsToFormValue(record.sections),
        writeValue: (value) => formValueToSections(value as Parameters<typeof formValueToSections>[0]),
        listFormat: (_v, record) => {
          const count = Array.isArray(record.sections) ? record.sections.length : 0;
          return `${count} section${count === 1 ? "" : "s"}`;
        },
        showInList: true,
        listLabel: "Sections",
      },
      { name: "meta_title", label: "Meta title", type: "text" },
    ],
  },
};

export const ADMIN_ENTITIES: Record<string, AdminEntityDef> = {
  ...ALL_ADMIN_ENTITIES,
  ...PILOT_ENTITIES,
};

export const ADMIN_ENABLED_ENTITY_KEYS = Object.keys(ADMIN_ENTITIES) as (keyof typeof ADMIN_ENTITIES)[];

export const PILOT_ENTITY_KEYS = ADMIN_ENABLED_ENTITY_KEYS;

export function isEnabledEntityKey(key: string): boolean {
  return key in ADMIN_ENTITIES;
}

export function getEnabledEntities(): AdminEntityDef[] {
  return ADMIN_ENABLED_ENTITY_KEYS.map((key) => ADMIN_ENTITIES[key]).filter(Boolean);
}

export function getPilotEntities(): AdminEntityDef[] {
  return getEnabledEntities();
}

export function getEntityDef(key: string): AdminEntityDef | undefined {
  return ADMIN_ENTITIES[key];
}

export function getListColumns(entity: AdminEntityDef) {
  return entity.fields.filter((f) => f.showInList);
}

export { getListFilters } from "@/lib/admin/list-filters";

export function recordToFormValues(
  entity: AdminEntityDef,
  record: Record<string, unknown>
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of entity.fields) {
    if (field.readFrom) {
      values[field.name] = field.readFrom(record);
      continue;
    }
    const raw = record[field.name];
    if (field.type === "tags") {
      values[field.name] = Array.isArray(raw) ? (raw as string[]).join(", ") : "";
    } else if (field.type === "boolean") {
      values[field.name] = Boolean(raw);
    } else if (field.type === "relation" && raw != null) {
      values[field.name] = String(raw);
    } else if (field.type === "relation-multi") {
      values[field.name] = Array.isArray(raw) ? raw : [];
    } else if (field.type === "stat-list") {
      values[field.name] = statsToFormValue(raw);
    } else if (field.type === "legal-sections") {
      values[field.name] = sectionsToFormValue(raw);
    } else if (field.type === "nested-list" && field.nestedList) {
      values[field.name] = nestedListToFormValue(field.nestedList, raw);
    } else if (field.type === "json-display") {
      values[field.name] = raw ?? {};
    } else if (field.type === "select" && (field.name === "india_region" || field.options)) {
      values[field.name] = raw ?? "";
    } else {
      values[field.name] = raw ?? (field.type === "number" ? "" : "");
    }
  }
  return values;
}

export function formValuesToPayload(
  entity: AdminEntityDef,
  values: Record<string, unknown>,
  mode: "create" | "edit"
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const fields = entity.writableFields
    ? entity.fields.filter((f) => entity.writableFields!.includes(f.name))
    : entity.fields;

  for (const field of fields) {
    let value = values[field.name];
    if (field.writeValue) {
      value = field.writeValue(value);
    } else if (field.type === "tags") {
      value =
        typeof value === "string"
          ? value.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
    } else if (field.type === "number") {
      if (value === "" || value === null || value === undefined) {
        if (mode === "edit") continue;
        value = field.required ? 0 : null;
      } else {
        value = Number(value);
      }
    } else if (field.type === "relation") {
      value = value === "" || value == null ? null : value;
    } else if (field.type === "relation-multi") {
      value = Array.isArray(value) ? value : [];
    } else if (field.type === "select" && field.name === "india_region") {
      value = value === "" ? null : value;
    } else if (field.type === "boolean") {
      value = Boolean(value);
    } else if (field.type === "nested-list" && field.nestedList) {
      value = formValueToNestedList(field.nestedList, value);
    }

    if (mode === "edit" && (value === "" || value === undefined)) {
      if (
        !field.required &&
        field.type !== "boolean" &&
        field.type !== "stat-list" &&
        field.type !== "legal-sections" &&
        field.type !== "nested-list"
      ) {
        continue;
      }
    }
    payload[field.name] = value;
  }
  return payload;
}

export function defaultFormValues(entity: AdminEntityDef): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of entity.fields) {
    if (field.type === "boolean") values[field.name] = false;
    else if (field.type === "relation-multi") values[field.name] = [];
    else if (field.type === "stat-list" || field.type === "legal-sections" || field.type === "nested-list") {
      values[field.name] = [];
    } else if (field.type === "number") values[field.name] = field.name === "sort_order" ? 0 : "";
    else if (field.type === "select" && field.name === "region") values[field.name] = "international";
    else if (field.type === "select" && field.options?.length) values[field.name] = field.options[0].value;
    else if (field.type === "select") values[field.name] = "";
    else if (field.type === "json-display") values[field.name] = {};
    else values[field.name] = "";
  }
  if (entity.key === "destinations") values.is_published = true;
  if (entity.key === "form-submissions") values.status = "new";
  return values;
}
