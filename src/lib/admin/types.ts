import type { NestedListConfigId } from "@/lib/admin/nested-list-configs";

export type AdminFieldType =
  | "text"
  | "textarea"
  | "slug"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "tags"
  | "relation"
  | "relation-multi"
  | "stat-list"
  | "legal-sections"
  | "nested-list"
  | "json-display";

export type AdminRelationConfig = {
  endpoint: string;
  valueKey?: string;
  labelKey?: string;
  labelKeys?: string[];
};

export type AdminListFilterDef =
  | {
      type: "select";
      field: string;
      label: string;
      options: { value: string; label: string }[];
    }
  | {
      type: "relation";
      field: string;
      label: string;
      relation: AdminRelationConfig;
    }
  | {
      type: "dynamic";
      field: string;
      label: string;
    };

export type AdminFieldDef = {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helpText?: string;
  /** Media relation: upload-only UI (no asset library picker). Also deletes file on remove. */
  mediaUploadOnly?: boolean;
  options?: { value: string; label: string }[];
  relation?: AdminRelationConfig;
  nestedList?: NestedListConfigId;
  readFrom?: (record: Record<string, unknown>) => unknown;
  writeValue?: (value: unknown) => unknown;
  showInList?: boolean;
  listLabel?: string;
  /** Render boolean list column as an inline active/inactive toggle. */
  listToggle?: boolean;
  /** Toggle labels when listToggle is enabled. */
  listToggleOnLabel?: string;
  listToggleOffLabel?: string;
  /** Package list: controls homepage hero visibility via slider settings. */
  listHomepageVisibility?: boolean;
  /** Exclude from create/edit forms (e.g. managed via list toggles). */
  hideFromForm?: boolean;
  /** Allow inline editing of this column in the list table. */
  listInlineEdit?: boolean;
  listFormat?: (value: unknown, record: Record<string, unknown>) => string;
};

export type AdminEntityDef = {
  key: string;
  label: string;
  pluralLabel: string;
  group: string;
  endpoint: string;
  idField?: string;
  nameField?: string;
  isSingleton?: boolean;
  hideCreate?: boolean;
  hideDelete?: boolean;
  /** Hide from CMS sidebar navigation without disabling the entity or API. */
  hideFromNav?: boolean;
  /** When set, only these fields are sent on PATCH (e.g. form-submissions). */
  writableFields?: string[];
  /** When set, only these fields appear on create/edit forms (list columns unchanged). */
  formFields?: string[];
  /** Toolbar filters shown beside search on list pages. Omit to auto-derive from fields. */
  listFilters?: AdminListFilterDef[];
  /** Clicking a list row opens the edit page (toggle/action cells still isolated). */
  listRowClickEdit?: boolean;
  fields: AdminFieldDef[];
};

export type AdminEntityGroup = {
  id: string;
  label: string;
};

export const ADMIN_ENTITY_GROUPS: AdminEntityGroup[] = [
  { id: "catalog", label: "Catalog" },
  { id: "content", label: "Content" },
  { id: "marketing", label: "Marketing" },
  { id: "site-config", label: "Site Config" },
  { id: "careers-legal", label: "Careers & Legal" },
  { id: "chat-agent", label: "Chat Agent" },
  { id: "submissions", label: "Submissions" },
];
