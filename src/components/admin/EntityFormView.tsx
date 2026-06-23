"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
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
import {
  adminRecordCacheKey,
  fetchAdminRecordCached,
  invalidateAdminListCache,
  invalidateAdminRecordCache,
  peekCachedAdminRecord,
  setCachedAdminRecord,
} from "@/lib/admin/admin-data-cache";
import { LegalSectionsEditor } from "@/components/admin/LegalSectionsEditor";
import { NestedListEditor } from "@/components/admin/NestedListEditor";
import { StatListEditor } from "@/components/admin/StatListEditor";
import { collectNestedRelations } from "@/lib/admin/nested-list";
import { cn } from "@/lib/utils";

type EntityFormViewProps = {
  entityKey: string;
  recordId?: string;
  singleton?: boolean;
  /** When set to modal, renders a create dialog instead of a full page (create mode only). */
  variant?: "page" | "modal";
  open?: boolean;
  onClose?: () => void;
  onCreated?: () => void;
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

export function EntityFormView({
  entityKey,
  recordId,
  singleton,
  variant = "page",
  open = false,
  onClose,
  onCreated,
}: EntityFormViewProps) {
  const entity = getEntityDef(entityKey);
  const router = useRouter();
  const formId = useId();
  const isModal = variant === "modal";
  const isSingleton = singleton ?? entity?.isSingleton ?? false;
  const mode = isSingleton || recordId ? "edit" : "create";
  const recordCacheKey =
    entity && mode === "edit"
      ? adminRecordCacheKey(entity.endpoint, isSingleton ? "singleton" : recordId!)
      : null;
  const cachedRecord = recordCacheKey ? peekCachedAdminRecord(recordCacheKey) : null;

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const def = getEntityDef(entityKey);
    if (!def) return {};
    if (cachedRecord) return recordToFormValues(def, cachedRecord);
    return defaultFormValues(def);
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit" && !cachedRecord);
  const [refreshing, setRefreshing] = useState(false);
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
    if (!isModal || !open || !entity) return;
    setValues(defaultFormValues(entity));
    setFieldErrors({});
    setFormError(null);
    setSuccess(null);
    setSaving(false);
  }, [entity, isModal, open]);

  useEffect(() => {
    if (!isModal || !open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isModal, onClose, open, saving]);

  useEffect(() => {
    if (!entity || mode !== "edit" || !recordCacheKey) return;

    const cached = peekCachedAdminRecord(recordCacheKey);
    if (cached) {
      setValues(recordToFormValues(entity, cached));
      setLoading(false);
      setRefreshing(true);
    }

    void (async () => {
      if (isSingleton) {
        const { data, error } = await adminGetSingleton<Record<string, unknown>>(entity.endpoint);
        setLoading(false);
        setRefreshing(false);

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
        setCachedAdminRecord(recordCacheKey, data);
        return;
      }

      const result = await fetchAdminRecordCached(recordCacheKey, () =>
        adminGetOne<Record<string, unknown>>(entity.endpoint, recordId!),
      );

      setLoading(false);
      setRefreshing(false);

      if ("error" in result) {
        setFormError(result.error);
        return;
      }

      setValues(recordToFormValues(entity, result.record));
    })();
  }, [entity, isSingleton, mode, recordCacheKey, recordId]);

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

    if (!isSingleton && mode === "create" && result.data) {
      invalidateAdminListCache(entity.endpoint);
      if (isModal) {
        onCreated?.();
        return;
      }
      if (result.data.id) {
        router.push(`/admin/cms/${entity.key}/${result.data.id}`);
        router.refresh();
        return;
      }
    }

    if (result.data) {
      setValues(recordToFormValues(entity, result.data));
      setSingletonUninitialized(false);
      const cacheKey = adminRecordCacheKey(
        entity.endpoint,
        isSingleton ? "singleton" : String(result.data.id ?? recordId),
      );
      setCachedAdminRecord(cacheKey, result.data);
      invalidateAdminListCache(entity.endpoint);
      invalidateAdminRecordCache(entity.endpoint);
    }
    setSuccess("Saved successfully.");
  };

  if (isModal && (!open || mode !== "create")) {
    return null;
  }

  if (loading && !isModal) {
    return <div className="admin-page-state">Loading…</div>;
  }

  if (!entity) {
    return <p className="admin-page-muted">Unknown entity.</p>;
  }

  const isComplexForm = entity.fields.some(
    (field) =>
      field.type === "nested-list" ||
      field.type === "legal-sections" ||
      field.type === "stat-list",
  );

  const submitLabel =
    saving ? "Saving…" : isSingleton || mode === "edit" ? "Save changes" : "Create";

  const formFields = (
    <>
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
            onChange={(value) => updateField(field.name, value)}
          />
          {field.helpText && !fieldErrors[field.name] && (
            <p className="admin-form-field__help">{field.helpText}</p>
          )}
          {fieldErrors[field.name] && (
            <p className="admin-field-error">{fieldErrors[field.name]}</p>
          )}
        </div>
      ))}
    </>
  );

  if (isModal) {
    return (
      <div
        className="admin-modal-backdrop"
        role="presentation"
        onClick={() => {
          if (!saving) onClose?.();
        }}
      >
        <div
          className={cn(
            "admin-modal admin-modal--form",
            isComplexForm && "admin-modal--form-wide",
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${formId}-title`}
          onClick={(event) => event.stopPropagation()}
        >
          <header className="admin-modal__head">
            <div className="admin-modal__head-copy">
              <p className="admin-modal__eyebrow">Create</p>
              <h2 id={`${formId}-title`} className="admin-modal__title">
                New {entity.label}
              </h2>
              <p className="admin-modal__subtitle">
                Add a new {entity.label.toLowerCase()} to the CMS catalog.
              </p>
            </div>
            <button
              type="button"
              className="admin-modal__close"
              aria-label="Close"
              disabled={saving}
              onClick={() => onClose?.()}
            >
              <X aria-hidden className="admin-modal__close-icon" />
            </button>
          </header>

          <div className="admin-modal__body">
            {formError && (
              <div className="admin-alert admin-alert--error admin-modal__alert">{formError}</div>
            )}
            <form
              id={formId}
              onSubmit={(event) => void handleSubmit(event)}
              className="admin-form-panel__form admin-form-panel__form--modal"
            >
              {formFields}
            </form>
          </div>

          <footer className="admin-modal__footer">
            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-btn--page"
              disabled={saving}
              onClick={() => onClose?.()}
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formId}
              className="admin-btn admin-btn--primary admin-btn--page"
              disabled={saving}
            >
              {submitLabel}
            </button>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-form-page">
      <div className="admin-workspace admin-workspace--narrow">
        <div className={cn("admin-form-panel", refreshing && "admin-form-panel--refreshing")}>
          <header className="admin-form-panel__head">
            <div className="admin-form-panel__intro">
              {!isSingleton && (
                <p className="admin-workspace-eyebrow">
                  CMS · {mode === "create" ? "Create" : "Edit"}
                </p>
              )}
              {isSingleton && <p className="admin-workspace-eyebrow">CMS · Site Config</p>}
              <h1 className="admin-form-panel__title">
                {isSingleton
                  ? entity.label
                  : mode === "create"
                    ? `New ${entity.label}`
                    : `Edit ${entity.label}`}
              </h1>
              <p className="admin-form-panel__subtitle">
                {isSingleton
                  ? `Manage ${entity.label.toLowerCase()} settings for the public site.`
                  : mode === "create"
                    ? `Add a new ${entity.label.toLowerCase()} to the CMS catalog.`
                    : `Update this ${entity.label.toLowerCase()} and save your changes.`}
              </p>
            </div>
            {!isSingleton && (
              <div className="admin-form-panel__head-actions">
                <Link href={`/admin/cms/${entity.key}`} className="admin-btn admin-btn--secondary admin-btn--page">
                  ← Back to list
                </Link>
              </div>
            )}
          </header>

          <div className="admin-form-panel__body">
            {formError && <div className="admin-alert admin-alert--error admin-form-panel__alert">{formError}</div>}
            {success && <div className="admin-alert admin-alert--success admin-form-panel__alert">{success}</div>}

            <form onSubmit={(e) => void handleSubmit(e)} className="admin-form-panel__form">
              {formFields}

          <div className="admin-form-panel__actions">
            <button type="submit" className="admin-btn admin-btn--primary admin-btn--page" disabled={saving}>
              {submitLabel}
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
      </div>
    </div>
  );
}
