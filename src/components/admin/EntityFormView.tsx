"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminCreate,
  adminGetOne,
  adminGetSingleton,
  adminPatchSingleton,
  adminRelationOptions,
  adminUpdate,
} from "@/lib/admin/api-client";
import type { AdminFieldDef } from "@/lib/admin/entities";
import {
  defaultFormValues,
  formValuesToPayload,
  getEntityDef,
  recordToFormValues,
} from "@/lib/admin/entities";
import { LegalSectionsEditor } from "@/components/admin/LegalSectionsEditor";
import { NestedListEditor } from "@/components/admin/NestedListEditor";
import { StatListEditor } from "@/components/admin/StatListEditor";
import { collectNestedRelations } from "@/lib/admin/nested-list";
import { cn } from "@/lib/utils";

type EntityFormViewProps = {
  entityKey: string;
  recordId?: string;
  singleton?: boolean;
};

function FieldControl({
  field,
  value,
  error,
  relationOptions,
  nestedRelationOptions,
  onChange,
}: {
  field: AdminFieldDef;
  value: unknown;
  error?: string;
  relationOptions: { value: string; label: string }[];
  onChange: (value: unknown) => void;
  nestedRelationOptions: Record<string, { value: string; label: string }[]>;
}) {
  const errorClass = error ? "admin-input--error" : "";

  if (field.readOnly) {
    if (field.type === "json-display") {
      return (
        <pre className="admin-json-display">{JSON.stringify(value ?? {}, null, 2)}</pre>
      );
    }
    if (field.type === "textarea") {
      return <textarea className="admin-textarea" value={String(value ?? "")} readOnly disabled />;
    }
    return <input className="admin-input" value={String(value ?? "")} readOnly disabled />;
  }

  if (field.type === "nested-list" && field.nestedList) {
    return (
      <NestedListEditor
        id={field.name}
        configId={field.nestedList}
        value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
        relationOptions={nestedRelationOptions}
        onChange={onChange}
      />
    );
  }

  if (field.type === "stat-list") {
    return (
      <StatListEditor
        id={field.name}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
      />
    );
  }

  if (field.type === "legal-sections") {
    return (
      <LegalSectionsEditor
        id={field.name}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        id={field.name}
        className={cn("admin-textarea", error && "admin-textarea--error")}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-foreground">
        <input
          id={field.name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-glass-border accent-[var(--gold)]"
        />
        <span>{Boolean(value) ? "Yes" : "No"}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select
        id={field.name}
        className={cn("admin-select", errorClass)}
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
        id={field.name}
        className={cn("admin-select", errorClass)}
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

  if (field.type === "relation-multi") {
    const selected = Array.isArray(value) ? (value as string[]) : [];
    return (
      <select
        id={field.name}
        multiple
        className={cn("admin-multi-select", errorClass)}
        value={selected}
        onChange={(e) => {
          const next = Array.from(e.target.selectedOptions).map((o) => o.value);
          onChange(next);
        }}
      >
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
      <input
        id={field.name}
        type="number"
        className={cn("admin-input", errorClass)}
        value={value === "" || value == null ? "" : String(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    );
  }

  return (
    <input
      id={field.name}
      type="text"
      className={cn("admin-input", errorClass)}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
    />
  );
}

export function EntityFormView({ entityKey, recordId, singleton }: EntityFormViewProps) {
  const entity = getEntityDef(entityKey);
  const router = useRouter();
  const isSingleton = singleton ?? entity?.isSingleton ?? false;
  const mode = isSingleton || recordId ? "edit" : "create";
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const def = getEntityDef(entityKey);
    return def ? defaultFormValues(def) : {};
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [singletonUninitialized, setSingletonUninitialized] = useState(false);
  const [relationOptions, setRelationOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});
  const [nestedRelationOptions, setNestedRelationOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});

  useEffect(() => {
    if (!entity) return;
    const relationFields = entity.fields.filter(
      (f) => (f.type === "relation" || f.type === "relation-multi") && f.relation && !f.readOnly
    );
    const nestedIds = entity.fields
      .filter((f) => f.type === "nested-list" && f.nestedList)
      .map((f) => f.nestedList!);
    const nestedRels = collectNestedRelations(nestedIds);

    void (async () => {
      const entries = await Promise.all(
        relationFields.map(async (field) => {
          const rel = field.relation!;
          const options = await adminRelationOptions(
            rel.endpoint,
            rel.valueKey,
            rel.labelKey,
            rel.labelKeys
          );
          return [field.name, options] as const;
        })
      );
      setRelationOptions(Object.fromEntries(entries));

      const nestedEntries = await Promise.all(
        nestedRels.map(async ({ key, config }) => {
          const options = await adminRelationOptions(
            config.endpoint,
            config.valueKey,
            config.labelKey,
            config.labelKeys
          );
          return [key, options] as const;
        })
      );
      setNestedRelationOptions(Object.fromEntries(nestedEntries));
    })();
  }, [entity]);

  useEffect(() => {
    if (!entity || mode !== "edit") return;
    void (async () => {
      setLoading(true);
      const { data, error } = isSingleton
        ? await adminGetSingleton<Record<string, unknown>>(entity.endpoint)
        : await adminGetOne<Record<string, unknown>>(entity.endpoint, recordId!);
      setLoading(false);
      if (isSingleton) {
        if (error && error.status !== 404) {
          setFormError(error.message);
          return;
        }
        if (!data) {
          setSingletonUninitialized(true);
          setValues(defaultFormValues(entity));
          setFormError(null);
          return;
        }
        setSingletonUninitialized(false);
        setValues(recordToFormValues(entity, data));
        return;
      }
      if (error || !data) {
        setFormError(error?.message ?? "Record not found");
        return;
      }
      setValues(recordToFormValues(entity, data));
    })();
  }, [entity, isSingleton, mode, recordId]);

  const updateField = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entity) return;
    setSaving(true);
    setFormError(null);
    setSuccess(null);
    setFieldErrors({});

    const payloadMode = isSingleton && singletonUninitialized ? "create" : mode;
    const payload = formValuesToPayload(entity, values, payloadMode);

    const result = isSingleton
      ? await adminPatchSingleton<Record<string, unknown>>(entity.endpoint, payload)
      : mode === "create"
        ? await adminCreate<Record<string, unknown>>(entity.endpoint, payload)
        : await adminUpdate<Record<string, unknown>>(entity.endpoint, recordId!, payload);

    setSaving(false);

    if (result.error) {
      setFormError(result.error.message);
      setFieldErrors(result.error.fieldErrors);
      return;
    }

    if (!isSingleton && mode === "create" && result.data?.id) {
      router.push(`/admin/cms/${entity.key}/${result.data.id}`);
      router.refresh();
      return;
    }

    if (result.data) {
      setValues(recordToFormValues(entity, result.data));
      setSingletonUninitialized(false);
    }
    setSuccess("Saved successfully.");
  };

  if (loading) {
    return <div className="admin-page-state">Loading…</div>;
  }

  if (!entity) {
    return <p className="admin-page-muted">Unknown entity.</p>;
  }

  return (
    <div className="admin-page admin-form-page">
      <header className="admin-page-header">
        <div className="admin-page-header__copy">
          {!isSingleton && (
            <p className="admin-form-eyebrow">{mode === "create" ? "Create" : "Edit"}</p>
          )}
          <h1 className="admin-page-title">
            {isSingleton
              ? entity.label
              : mode === "create"
                ? `New ${entity.label}`
                : `Edit ${entity.label}`}
          </h1>
          <p className="admin-page-subtitle">
            {isSingleton
              ? `Manage ${entity.label.toLowerCase()} settings for the public site.`
              : mode === "create"
                ? `Add a new ${entity.label.toLowerCase()} to the CMS catalog.`
                : `Update this ${entity.label.toLowerCase()} and save your changes.`}
          </p>
        </div>
        {!isSingleton && (
          <div className="admin-page-header__actions">
            <Link href={`/admin/cms/${entity.key}`} className="admin-btn admin-btn--secondary admin-btn--page">
              ← Back to list
            </Link>
          </div>
        )}
      </header>

      <div className="admin-form-card">
        {formError && <div className="admin-alert admin-alert--error admin-form-card__alert">{formError}</div>}
        {success && <div className="admin-alert admin-alert--success admin-form-card__alert">{success}</div>}

        <form onSubmit={(e) => void handleSubmit(e)} className="admin-form-panel__form">
          {entity.fields.map((field) => (
            <div key={field.name} className="admin-form-field">
              {field.type !== "boolean" && (
                <label htmlFor={field.name} className="admin-field-label">
                  {field.label}
                  {field.required && <span className="admin-field-required"> *</span>}
                </label>
              )}
              <FieldControl
                field={field}
                value={values[field.name]}
                error={fieldErrors[field.name]}
                relationOptions={relationOptions[field.name] ?? []}
                nestedRelationOptions={nestedRelationOptions}
                onChange={(v) => updateField(field.name, v)}
              />
              {field.helpText && !fieldErrors[field.name] && (
                <p className="admin-form-field__help">{field.helpText}</p>
              )}
              {fieldErrors[field.name] && (
                <p className="admin-field-error">{fieldErrors[field.name]}</p>
              )}
            </div>
          ))}

          <div className="admin-form-panel__actions">
            <button type="submit" className="admin-btn admin-btn--primary admin-btn--page" disabled={saving}>
              {saving ? "Saving…" : isSingleton || mode === "edit" ? "Save changes" : "Create"}
            </button>
            {!isSingleton && (
              <Link href={`/admin/cms/${entity.key}`} className="admin-btn admin-btn--secondary admin-btn--page">
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
