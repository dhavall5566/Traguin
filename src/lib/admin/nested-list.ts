import {
  NESTED_LIST_CONFIGS,
  type NestedListConfigId,
  type NestedSubFieldDef,
} from "@/lib/admin/nested-list-configs";
import { coerceAdminNumberPayload, clampAdminNumber } from "@/lib/admin/number-input";

const META_KEYS = new Set(["id", "created_at", "updated_at"]);

export function stripNestedItem(item: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(item)) {
    if (!META_KEYS.has(key)) out[key] = value;
  }
  return out;
}

function formifySubField(field: NestedSubFieldDef, raw: unknown): unknown {
  if (field.type === "tags") {
    return Array.isArray(raw) ? (raw as string[]).join("\n") : "";
  }
  if (field.type === "number") {
    if (raw == null || raw === "") return "";
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? "" : String(clampAdminNumber(parsed));
  }
  if (field.type === "relation") {
    return raw == null ? "" : String(raw);
  }
  if (field.type === "select") {
    return raw ?? (field.options?.[0]?.value ?? "");
  }
  return raw ?? "";
}

function payloadifySubField(field: NestedSubFieldDef, raw: unknown): unknown {
  if (field.type === "tags") {
    return typeof raw === "string"
      ? raw.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];
  }
  if (field.type === "number") {
    return coerceAdminNumberPayload(raw, field.required);
  }
  if (field.type === "relation") {
    return raw === "" || raw == null ? null : raw;
  }
  return raw;
}

export function nestedListToFormValue(
  configId: NestedListConfigId,
  raw: unknown
): Record<string, unknown>[] {
  const config = NESTED_LIST_CONFIGS[configId];
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const record = stripNestedItem((item ?? {}) as Record<string, unknown>);
    const formItem: Record<string, unknown> = {};
    for (const field of config.fields) {
      formItem[field.name] = formifySubField(field, record[field.name]);
    }
    return formItem;
  });
}

export function formValueToNestedList(
  configId: NestedListConfigId,
  items: unknown
): Record<string, unknown>[] {
  const config = NESTED_LIST_CONFIGS[configId];
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>;
      const payload: Record<string, unknown> = {};
      for (const field of config.fields) {
        let value = payloadifySubField(field, record[field.name]);
        if (field.type === "relation" && value === null && !field.required) {
          /* keep null */
        }
        if (field.required && (value === "" || value == null)) {
          if (field.type === "text" || field.type === "textarea") return null;
        }
        if (value === "" && field.type !== "number") continue;
        if (value === null && !field.required) {
          payload[field.name] = null;
          continue;
        }
        payload[field.name] = value;
      }
      const requiredMissing = config.fields.some(
        (f) => f.required && (payload[f.name] == null || payload[f.name] === "")
      );
      if (requiredMissing) return null;
      return payload;
    })
    .filter((item): item is Record<string, unknown> => item !== null);
}

export function collectNestedRelations(configIds: NestedListConfigId[]) {
  const relations: { key: string; config: NonNullable<NestedSubFieldDef["relation"]> }[] = [];
  for (const id of configIds) {
    for (const field of NESTED_LIST_CONFIGS[id].fields) {
      if (field.type === "relation" && field.relation) {
        relations.push({ key: `${id}:${field.name}`, config: field.relation });
      }
    }
  }
  return relations;
}
