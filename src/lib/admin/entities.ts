import { ALL_ADMIN_ENTITIES } from "@/lib/admin/all-entities";
import { formValueToSections, sectionsToFormValue } from "@/lib/admin/legal-sections";
import { formValueToNestedList, nestedListToFormValue } from "@/lib/admin/nested-list";
import { coerceAdminNumberPayload, clampAdminNumber } from "@/lib/admin/number-input";
import { formValueToStats, statsToFormValue } from "@/lib/admin/stat-list";
import type { AdminEntityDef, AdminEntityGroup, AdminFieldDef } from "@/lib/admin/types";
import { uniqueStringsPreservingOrder } from "@/lib/utils";

function slugifyGalleryName(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 128);
  return slug || `gallery-item-${Date.now()}`;
}

function enrichGalleryItemPayload(
  payload: Record<string, unknown>,
  mode: "create" | "edit"
): Record<string, unknown> {
  if (mode !== "create") return payload;

  const name = String(payload.place ?? "").trim();
  return {
    ...payload,
    slug: slugifyGalleryName(name),
    region_label: name,
    layout: "card",
    label_style: "stack",
  };
}

export type {
  AdminEntityDef,
  AdminEntityGroup,
  AdminFieldDef,
  AdminFieldType,
  AdminRelationConfig,
} from "@/lib/admin/types";
export { ADMIN_ENTITY_GROUPS } from "@/lib/admin/types";
export {
  CMS_NAV_SECTIONS,
  CMS_DEFAULT_LANDING_PATH,
  getCustomLinkNavSectionId,
  getEntityNavSectionId,
  getNavSectionLabel,
} from "@/lib/admin/cms-nav-sections";

const PILOT_ENTITIES: Record<string, AdminEntityDef> = {
  specializations: {
    key: "specializations",
    label: "Specialization",
    pluralLabel: "Specializations",
    group: "content",
    endpoint: "/specializations",
    nameField: "title",
    hideFromNav: true,
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
          { value: "central", label: "Central" },
          { value: "east", label: "East" },
          { value: "south", label: "South" },
          { value: "west", label: "West" },
          { value: "north-east", label: "North East" },
          { value: "islands", label: "Islands" },
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
        mediaUploadOnly: true,
      },
      {
        name: "gallery_media_ids",
        label: "Gallery media",
        type: "relation-multi",
        relation: { endpoint: "/media", valueKey: "id", labelKeys: ["slug", "url"] },
        mediaUploadOnly: true,
        readFrom: (record) =>
          Array.isArray(record.gallery_media)
            ? (record.gallery_media as { id: string }[]).map((m) => m.id)
            : [],
      },
      { name: "moods", label: "Moods", type: "tags", helpText: "Comma-separated tags" },
      {
        name: "is_published",
        label: "Visible on destinations",
        type: "boolean",
        showInList: true,
        listLabel: "Visible",
        listToggle: true,
        listToggleOnLabel: "Visible",
        listToggleOffLabel: "Hidden",
        helpText: "When enabled, this destination appears on the public destinations page.",
      },
      {
        name: "is_featured",
        label: "Featured on homepage",
        type: "boolean",
        showInList: false,
        helpText: "When enabled, this destination can appear in the homepage featured destinations section.",
      },
      {
        name: "featured_sort_order",
        label: "Featured sort order",
        type: "number",
        showInList: false,
        helpText: "Lower numbers appear first among featured destinations on the homepage.",
      },
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
    hideFromNav: true,
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
      { name: "effective_date", label: "Effective date", type: "date", required: true, showInList: true },
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

export function getFormFields(entity: AdminEntityDef): AdminFieldDef[] {
  const allowed = entity.formFields ?? entity.writableFields;
  const fields = allowed
    ? entity.fields.filter((field) => allowed.includes(field.name))
    : entity.fields;
  return fields.filter((field) => !field.listHomepageVisibility && !field.hideFromForm);
}

export function getListColumns(entity: AdminEntityDef) {
  return entity.fields.filter((f) => f.showInList);
}

export function buildInlineEditPatch(
  entity: AdminEntityDef,
  field: AdminFieldDef,
  value: string,
): Record<string, unknown> {
  const trimmed = value.trim();
  const patch: Record<string, unknown> = { [field.name]: trimmed };

  if (entity.key === "gallery-items" && field.name === "place") {
    patch.region_label = trimmed;
  }

  return patch;
}

export { getListFilters } from "@/lib/admin/list-filters";

export function recordToFormValues(
  entity: AdminEntityDef,
  record: Record<string, unknown>
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of entity.fields) {
    if (field.listHomepageVisibility || field.hideFromForm) continue;
    if (field.readFrom) {
      let value = field.readFrom(record);
      if (field.type === "relation-multi" && Array.isArray(value)) {
        value = uniqueStringsPreservingOrder(value.map(String));
      }
      values[field.name] = value;
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
      values[field.name] = uniqueStringsPreservingOrder(
        (Array.isArray(raw) ? raw : []).map(String),
      );
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
    } else if (field.type === "number") {
      if (raw == null || raw === "") {
        values[field.name] = "";
      } else {
        const parsed = Number(raw);
        values[field.name] = Number.isNaN(parsed) ? "" : String(clampAdminNumber(parsed));
      }
    } else {
      values[field.name] = raw ?? "";
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
    if (field.listHomepageVisibility || field.hideFromForm) continue;
    let value = values[field.name];
    if (field.writeValue) {
      value = field.writeValue(value);
    } else if (field.type === "tags") {
      value =
        typeof value === "string"
          ? value.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
    } else if (field.type === "number") {
      value = coerceAdminNumberPayload(value, mode === "create" && field.required);
      if (value === null && mode === "edit") continue;
    } else if (field.type === "relation") {
      value = value === "" || value == null ? null : value;
    } else if (field.type === "relation-multi") {
      value = uniqueStringsPreservingOrder(
        (Array.isArray(value) ? value : []).map(String).filter(Boolean),
      );
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

  if (entity.key === "gallery-items") {
    return enrichGalleryItemPayload(payload, mode);
  }

  return payload;
}

export function defaultFormValues(entity: AdminEntityDef): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of entity.fields) {
    if (field.listHomepageVisibility || field.hideFromForm) continue;
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
  if (entity.key === "about-client-logos") values.is_published = true;
  if (entity.key === "form-submissions") values.status = "new";
  if (entity.key === "homepage-region-panels") values.is_active = true;
  return values;
}
