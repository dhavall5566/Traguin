import type { AdminFieldDef } from "@/lib/admin/types";

/** Joined label fields returned by admin list endpoints (snake_case). */
const JOINED_LABEL_FIELDS: Record<string, string> = {
  destination_id: "destination_name",
  package_id: "package_title",
  related_destination_id: "related_destination_name",
  related_itinerary_id: "related_itinerary_title",
  related_hotel_id: "related_hotel_name",
};

function joinedLabelField(fieldName: string): string | null {
  if (fieldName in JOINED_LABEL_FIELDS) {
    return JOINED_LABEL_FIELDS[fieldName];
  }
  if (fieldName.endsWith("_id")) {
    return fieldName.replace(/_id$/, "_name");
  }
  return null;
}

export function formatAdminListCell(
  col: AdminFieldDef,
  raw: unknown,
  row: Record<string, unknown>,
  relationLabelsByField?: Record<string, Record<string, string>>,
): string {
  if (col.listFormat) {
    return col.listFormat(raw, row);
  }

  if (col.type === "relation" && raw != null && raw !== "") {
    const joinedKey = joinedLabelField(col.name);
    if (joinedKey) {
      const joined = row[joinedKey];
      if (joined != null && joined !== "") {
        return String(joined);
      }
    }

    const labelMap = relationLabelsByField?.[col.name];
    const resolved = labelMap?.[String(raw)];
    if (resolved) {
      return resolved;
    }
  }

  if (raw == null || raw === "") return "";
  return String(raw);
}
