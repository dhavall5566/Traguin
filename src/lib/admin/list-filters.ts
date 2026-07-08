import type { AdminEntityDef, AdminListFilterDef } from "@/lib/admin/types";

const ALL_OPTION = { value: "", label: "All" };

const PUBLISHED_OPTIONS = [
  ALL_OPTION,
  { value: "true", label: "Published" },
  { value: "false", label: "Draft" },
];

const FEATURED_OPTIONS = [
  ALL_OPTION,
  { value: "true", label: "Featured" },
  { value: "false", label: "Not featured" },
];

const VISIBLE_OPTIONS = [
  ALL_OPTION,
  { value: "true", label: "Visible" },
  { value: "false", label: "Hidden" },
];

const PERMANENT_OPTIONS = [
  ALL_OPTION,
  { value: "true", label: "Permanent" },
  { value: "false", label: "Temporary" },
];

function fieldByName(entity: AdminEntityDef, name: string) {
  return entity.fields.find((field) => field.name === name);
}

export function buildDefaultListFilters(entity: AdminEntityDef): AdminListFilterDef[] {
  const filters: AdminListFilterDef[] = [];
  const names = new Set(entity.fields.map((field) => field.name));

  const destinationField = fieldByName(entity, "destination_id");
  if (destinationField?.relation) {
    filters.push({
      type: "relation",
      field: "destination_id",
      label: "Destination",
      relation: destinationField.relation,
    });
  }

  if (names.has("region")) {
    const regionField = fieldByName(entity, "region");
    if (regionField?.options?.length) {
      filters.push({
        type: "select",
        field: "region",
        label: "Region",
        options: [{ value: "", label: "All regions" }, ...regionField.options],
      });
    }
  }

  if (names.has("is_published")) {
    filters.push({
      type: "select",
      field: "is_published",
      label: "Published",
      options: PUBLISHED_OPTIONS,
    });
  }

  if (names.has("is_featured") && entity.key === "packages") {
    filters.push({
      type: "select",
      field: "is_featured",
      label: "Hero slider",
      options: [
        ALL_OPTION,
        { value: "true", label: "On hero slider" },
        { value: "false", label: "Off hero slider" },
      ],
    });
  } else if (names.has("is_featured")) {
    filters.push({
      type: "select",
      field: "is_featured",
      label: "Featured",
      options: FEATURED_OPTIONS,
    });
  }

  if (names.has("show_on_homepage")) {
    filters.push({
      type: "select",
      field: "show_on_homepage",
      label: "Homepage",
      options: [
        ALL_OPTION,
        { value: "true", label: "On homepage" },
        { value: "false", label: "Not on homepage" },
      ],
    });
  }

  if (names.has("show_on_home")) {
    filters.push({
      type: "select",
      field: "show_on_home",
      label: "Home",
      options: [
        ALL_OPTION,
        { value: "true", label: "On home" },
        { value: "false", label: "Not on home" },
      ],
    });
  }

  if (names.has("is_visible")) {
    filters.push({
      type: "select",
      field: "is_visible",
      label: "Visibility",
      options: VISIBLE_OPTIONS,
    });
  }

  if (names.has("is_permanent")) {
    filters.push({
      type: "select",
      field: "is_permanent",
      label: "Redirect",
      options: PERMANENT_OPTIONS,
    });
  }

  const statusField = fieldByName(entity, "status");
  if (statusField?.options?.length) {
    filters.push({
      type: "select",
      field: "status",
      label: "Status",
      options: [ALL_OPTION, ...statusField.options],
    });
  }

  if (names.has("menu_group")) {
    filters.push({ type: "dynamic", field: "menu_group", label: "Menu group" });
  }

  if (entity.key === "media" && names.has("usage")) {
    filters.push({ type: "dynamic", field: "usage", label: "Usage" });
  }

  if (entity.key === "job-openings" && names.has("employment_type")) {
    filters.push({ type: "dynamic", field: "employment_type", label: "Employment" });
  }

  if (entity.key === "form-submissions" && names.has("form_type")) {
    filters.push({ type: "dynamic", field: "form_type", label: "Form type" });
  }

  if (entity.key === "hotels" && names.has("stars")) {
    filters.push({
      type: "select",
      field: "stars",
      label: "Stars",
      options: [
        ALL_OPTION,
        { value: "3", label: "3 star" },
        { value: "4", label: "4 star" },
        { value: "5", label: "5 star" },
      ],
    });
  }

  return filters;
}

export function getListFilters(entity: AdminEntityDef): AdminListFilterDef[] {
  return entity.listFilters ?? buildDefaultListFilters(entity);
}

function normalizeFilterValue(raw: unknown): string {
  if (typeof raw === "boolean") return raw ? "true" : "false";
  if (raw == null) return "";
  return String(raw);
}

export function rowMatchesFilter(
  row: Record<string, unknown>,
  filter: AdminListFilterDef,
  value: string,
): boolean {
  if (!value) return true;

  const raw = row[filter.field];
  if (filter.type === "select" || filter.type === "relation" || filter.type === "dynamic") {
    return normalizeFilterValue(raw) === value;
  }
  return true;
}

export function buildDynamicFilterOptions(
  items: Record<string, unknown>[],
  field: string,
): { value: string; label: string }[] {
  const seen = new Set<string>();
  const options: { value: string; label: string }[] = [ALL_OPTION];

  for (const row of items) {
    const raw = row[field];
    if (raw == null || raw === "") continue;
    const value = String(raw);
    if (seen.has(value)) continue;
    seen.add(value);
    options.push({ value, label: value.replace(/_/g, " ") });
  }

  return options.sort((a, b) => {
    if (!a.value) return -1;
    if (!b.value) return 1;
    return a.label.localeCompare(b.label);
  });
}

export function buildServerListQuery(
  entity: AdminEntityDef | null | undefined,
  filterValues: Record<string, string>,
  search: string,
  listFilters: AdminListFilterDef[],
): Record<string, string> {
  if (!usesServerListFilters(entity)) return {};

  const query: Record<string, string> = {};
  for (const filter of listFilters) {
    const value = filterValues[filter.field]?.trim();
    if (!value) continue;
    if (filter.field === "destination_name") {
      query.destination_name = value;
      continue;
    }
    query[filter.field] = value;
  }
  if (search.trim()) query.search = search.trim();
  return query;
}

export function usesServerListFilters(entity: AdminEntityDef | null | undefined): boolean {
  return Boolean(entity && !entity.isSingleton);
}

export function hasActiveFilters(
  search: string,
  filterValues: Record<string, string>,
): boolean {
  if (search.trim()) return true;
  return Object.values(filterValues).some(Boolean);
}
