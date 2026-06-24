"use client";

import {
  NESTED_LIST_CONFIGS,
  type NestedListConfigId,
  type NestedSubFieldDef,
} from "@/lib/admin/nested-list-configs";
import { AdminNumberInput } from "@/components/admin/AdminNumberInput";
import { cn } from "@/lib/utils";

type NestedListEditorProps = {
  id: string;
  configId: NestedListConfigId;
  value: Record<string, unknown>[];
  relationOptions: Record<string, { value: string; label: string }[]>;
  onChange: (value: Record<string, unknown>[]) => void;
};

function SubField({
  field,
  value,
  relationOptions,
  onChange,
}: {
  field: NestedSubFieldDef;
  value: unknown;
  relationOptions: { value: string; label: string }[];
  onChange: (value: unknown) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        className="admin-textarea"
        rows={3}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "tags") {
    return (
      <textarea
        className="admin-textarea"
        rows={3}
        value={String(value ?? "")}
        placeholder={field.placeholder ?? "One item per line"}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "select") {
    return (
      <select
        className="admin-select"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      >
        {(field.options ?? []).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "relation") {
    return (
      <select
        className="admin-select"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">— None —</option>
        {relationOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "number") {
    return (
      <AdminNumberInput
        value={value}
        onChange={onChange}
      />
    );
  }
  return (
    <input
      type="text"
      className="admin-input"
      value={String(value ?? "")}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function NestedListEditor({
  id,
  configId,
  value,
  relationOptions,
  onChange,
}: NestedListEditorProps) {
  const config = NESTED_LIST_CONFIGS[configId];
  const items = Array.isArray(value) ? value : [];
  const isCompactGrid = config.layout === "compact-grid";

  const updateItem = (index: number, fieldName: string, fieldValue: unknown) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [fieldName]: fieldValue } : item
    );
    onChange(next);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    onChange(next);
  };

  const newItem = () => {
    const row: Record<string, unknown> = {};
    for (const field of config.fields) {
      if (field.type === "select") row[field.name] = field.options?.[0]?.value ?? "";
      else if (field.type === "number") row[field.name] = field.name === "sort_order" ? items.length : "";
      else row[field.name] = "";
    }
    return row;
  };

  return (
    <div
      id={id}
      className={cn("admin-section-list", isCompactGrid && "admin-section-list--compact-grid")}
    >
      {items.length === 0 && (
        <p className="admin-section-list__empty text-sm text-muted">
          No {config.itemLabel.toLowerCase()}s yet.
        </p>
      )}
      {items.map((item, index) => (
        <div key={index} className="admin-section-card">
          <div className="admin-section-card__header">
            <span className="admin-section-card__label">
              {config.itemLabel} {index + 1}
            </span>
            <div className="admin-section-card__actions">
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--icon"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--icon"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--icon"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          </div>
          <div
            className={cn(
              "admin-section-card__fields",
              isCompactGrid && "admin-section-card__fields--compact",
            )}
          >
            {config.fields.map((field) => {
              const relKey = `${configId}:${field.name}`;
              return (
                <div
                  key={field.name}
                  className={cn(
                    "admin-section-card__field",
                    field.name === "sort_order" && "admin-section-card__field--sort",
                  )}
                >
                  <label className="admin-field-label">
                    {field.label}
                    {"required" in field && field.required ? (
                      <span className="admin-field-required"> *</span>
                    ) : null}
                  </label>
                  <SubField
                    field={field}
                    value={item[field.name]}
                    relationOptions={relationOptions[relKey] ?? []}
                    onChange={(v) => updateItem(index, field.name, v)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button
        type="button"
        className={cn(
          "admin-btn admin-btn--secondary admin-section-list__add",
          isCompactGrid && "admin-section-list__add--compact",
        )}
        onClick={() => onChange([...items, newItem()])}
      >
        + Add {config.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
