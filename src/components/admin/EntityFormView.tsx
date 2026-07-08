"use client";

import { useEffect, useId, useMemo, useState } from "react";
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
  getFormFields,
  getEntityNavSectionId,
  getNavSectionLabel,
  recordToFormValues,
} from "@/lib/admin/entities";
import {
  adminRecordCacheKey,
  fetchAdminRecordCached,
  invalidateAdminListCache,
  peekCachedAdminRecord,
  prependCachedAdminListItem,
  revalidateAdminListInBackground,
  setCachedAdminRecord,
  upsertCachedAdminListItem,
} from "@/lib/admin/admin-data-cache";
import { formValuesEqual } from "@/lib/admin/form-dirty";
import { LegalSectionsEditor } from "@/components/admin/LegalSectionsEditor";
import { AdminNumberInput } from "@/components/admin/AdminNumberInput";
import { AdminMediaField } from "@/components/admin/AdminMediaField";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { NestedListEditor } from "@/components/admin/NestedListEditor";
import { StatListEditor } from "@/components/admin/StatListEditor";
import { useAdminToast } from "@/components/admin/AdminToast";
import { collectNestedRelations } from "@/lib/admin/nested-list";
import { groupEntityFormSections, type FormSectionDef } from "@/lib/admin/form-sections";
import { mediaSeedOptionsForField } from "@/lib/admin/media-field-options";
import { cn } from "@/lib/utils";

function isFullWidthFormField(field: AdminFieldDef): boolean {
  return (
    field.type === "nested-list" ||
    field.type === "textarea" ||
    field.type === "legal-sections" ||
    field.type === "stat-list" ||
    (field.type === "relation" && field.relation?.endpoint === "/media") ||
    (field.type === "relation-multi" && field.relation?.endpoint === "/media") ||
    (field.type === "boolean" && Boolean(field.helpText))
  );
}

function formFieldClassName(field: AdminFieldDef): string {
  return cn(
    "admin-form-field",
    isFullWidthFormField(field) && "admin-form-field--full",
    field.type === "boolean" && "admin-form-field--boolean",
    field.type === "nested-list" && "admin-form-field--nested",
  );
}

type EntityFormViewProps = {
  entityKey: string;
  recordId?: string;
  singleton?: boolean;
  /** When set to modal, renders a create dialog instead of a full page (create mode only). */
  variant?: "page" | "modal";
  open?: boolean;
  onClose?: () => void;
  onCreated?: (record: Record<string, unknown>) => void;
};

function FieldControl({
  field,
  value,
  error,
  relationOptions,
  nestedRelationOptions,
  loadedRecord,
  imageCaption,
  onChange,
}: {
  field: AdminFieldDef;
  value: unknown;
  error?: string;
  relationOptions: { value: string; label: string }[];
  onChange: (value: unknown) => void;
  nestedRelationOptions: Record<string, { value: string; label: string }[]>;
  loadedRecord: Record<string, unknown> | null;
  imageCaption?: string;
}) {
  const errorClass = error ? "admin-input--error" : "";
  const mediaSeedOptions =
    field.relation?.endpoint === "/media" ? mediaSeedOptionsForField(field.name, loadedRecord) : [];

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
      <label className="admin-boolean-field inline-flex items-center gap-2.5 text-sm text-foreground">
        <input
          id={field.name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="admin-boolean-field__input h-4 w-4 rounded border-glass-border accent-[var(--gold)]"
        />
        <span className="admin-boolean-field__label">{field.label}</span>
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
    if (field.relation?.endpoint === "/media") {
      return (
        <AdminMediaField
          id={field.name}
          value={String(value ?? "")}
          error={error}
          relationOptions={relationOptions}
          seedOptions={mediaSeedOptions}
          hideSelect={Boolean(field.mediaUploadOnly)}
          deleteOnRemove={Boolean(field.mediaUploadOnly)}
          imageCaption={imageCaption}
          onChange={(next) => onChange(next || null)}
        />
      );
    }
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
    if (field.relation?.endpoint === "/media") {
      return (
        <AdminMediaField
          multiple
          id={field.name}
          value={selected}
          error={error}
          relationOptions={relationOptions}
          seedOptions={mediaSeedOptions}
          hideSelect={Boolean(field.mediaUploadOnly)}
          deleteOnRemove={false}
          imageCaption={imageCaption}
          onChange={onChange}
        />
      );
    }
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
      <AdminNumberInput
        id={field.name}
        value={value}
        onChange={onChange}
        className={errorClass}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "date") {
    return (
      <DatePickerInput
        id={field.name}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        inputClassName={cn("admin-input", errorClass)}
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
  const { showCreatedToast, showUpdatedToast, showErrorToast } = useAdminToast();
  const formId = useId();
  const isModal = variant === "modal";
  const isSingleton = singleton ?? entity?.isSingleton ?? false;
  const mode = isSingleton || recordId ? "edit" : "create";
  const recordCacheKey =
    entity && mode === "edit"
      ? adminRecordCacheKey(entity.endpoint, isSingleton ? "singleton" : recordId!)
      : null;
  const cachedRecord = recordCacheKey ? peekCachedAdminRecord(recordCacheKey) : null;

  const [loadedRecord, setLoadedRecord] = useState<Record<string, unknown> | null>(
    () => cachedRecord ?? null,
  );
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const def = getEntityDef(entityKey);
    if (!def) return {};
    if (cachedRecord) return recordToFormValues(def, cachedRecord);
    return defaultFormValues(def);
  });
  const [baselineValues, setBaselineValues] = useState<Record<string, unknown>>(() => {
    const def = getEntityDef(entityKey);
    if (!def) return {};
    if (cachedRecord) return recordToFormValues(def, cachedRecord);
    return defaultFormValues(def);
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
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
    if (isModal && !open) return;

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
  }, [entity, isModal, open]);

  useEffect(() => {
    if (!isModal || !open || !entity) return;
    const defaults = defaultFormValues(entity);
    setValues(defaults);
    setBaselineValues(defaults);
    setLoadedRecord(null);
    setFieldErrors({});
    setFormError(null);
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
      const cachedValues = recordToFormValues(entity, cached);
      setValues(cachedValues);
      setBaselineValues(cachedValues);
      setLoadedRecord(cached);
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
          const defaults = defaultFormValues(entity);
          setValues(defaults);
          setBaselineValues(defaults);
          setFormError(null);
          return;
        }

        setSingletonUninitialized(false);
        const nextValues = recordToFormValues(entity, data);
        setValues(nextValues);
        setBaselineValues(nextValues);
        setLoadedRecord(data);
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

      const nextValues = recordToFormValues(entity, result.record);
      setValues(nextValues);
      setBaselineValues(nextValues);
      setLoadedRecord(result.record);
    })();
  }, [entity, isSingleton, mode, recordCacheKey, recordId]);

  const isDirty = useMemo(
    () => !formValuesEqual(values, baselineValues),
    [baselineValues, values],
  );

  const formSections = useMemo(() => {
    if (!entity) return [];
    return groupEntityFormSections(getFormFields(entity), entity.key);
  }, [entity]);
  const mainSections = formSections.filter((section) => section.variant !== "sidebar");
  const sidebarSections = formSections.filter((section) => section.variant === "sidebar");

  const updateField = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entity || !isDirty) return;
    setSaving(true);
    setFormError(null);
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
      showErrorToast(result.error.message);
      return;
    }

    if (!isSingleton && mode === "create" && result.data) {
      prependCachedAdminListItem(
        entity.endpoint,
        result.data,
        entity.idField ?? "id",
      );
      revalidateAdminListInBackground(entity.endpoint, 20, 0);
      const createdMessage = `${entity.label} created successfully.`;
      if (isModal) {
        showCreatedToast(createdMessage);
        onCreated?.(result.data);
        onClose?.();
        return;
      }
      showCreatedToast(createdMessage);
      router.push(`/admin/cms/${entity.key}`);
      return;
    }

    if (result.data) {
      const nextValues = recordToFormValues(entity, result.data);
      setValues(nextValues);
      setBaselineValues(nextValues);
      setLoadedRecord(result.data);
      setSingletonUninitialized(false);
      const cacheKey = adminRecordCacheKey(
        entity.endpoint,
        isSingleton ? "singleton" : String(result.data.id ?? recordId),
      );
      setCachedAdminRecord(cacheKey, result.data);
      if (!isSingleton && mode === "edit") {
        upsertCachedAdminListItem(
          entity.endpoint,
          entity.idField ?? "id",
          result.data,
        );
        revalidateAdminListInBackground(entity.endpoint, 20, 0);
      } else if (isSingleton) {
        invalidateAdminListCache(entity.endpoint);
      }
    }

    showUpdatedToast(
      mode === "create" ? `${entity.label} created successfully.` : "Changes saved successfully.",
    );

    if (!isSingleton && !isModal) {
      router.push(`/admin/cms/${entity.key}`);
    }
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
  const saveDisabled = saving || !isDirty;
  const sectionLabel = getNavSectionLabel(getEntityNavSectionId(entity.key));

  const renderFormField = (field: AdminFieldDef) => (
    <div key={field.name} className={formFieldClassName(field)}>
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
        loadedRecord={loadedRecord}
        imageCaption={
          field.name === "media_ids" ? String(values.place ?? "").trim() || undefined : undefined
        }
        onChange={(value) => updateField(field.name, value)}
      />
      {field.helpText && !fieldErrors[field.name] && (
        <p className="admin-form-field__help">{field.helpText}</p>
      )}
      {fieldErrors[field.name] && (
        <p className="admin-field-error">{fieldErrors[field.name]}</p>
      )}
    </div>
  );

  const renderFormSection = (section: FormSectionDef, compact?: boolean) => (
    <section
      key={section.id}
      className={cn("admin-form-section", compact && "admin-form-section--compact")}
      aria-labelledby={`${formId}-${section.id}-title`}
    >
      <header className="admin-form-section__head">
        <h2 id={`${formId}-${section.id}-title`} className="admin-form-section__title">
          {section.title}
        </h2>
        {section.description && (
          <p className="admin-form-section__desc">{section.description}</p>
        )}
      </header>
      <div
        className={cn(
          "admin-form-section__grid",
          `admin-form-section__grid--${entity.key}`,
        )}
      >
        {section.fields.map(renderFormField)}
      </div>
    </section>
  );

  const formFields = (
    <>
      {formSections.map((section) => renderFormSection(section))}
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
              className="admin-form-panel__form admin-form-panel__form--modal admin-form-panel__form--sectioned"
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
              disabled={saveDisabled}
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
      <div className="admin-workspace admin-workspace--form">
        <div className={cn("admin-form-shell", refreshing && "admin-form-shell--refreshing")}>
          <header className="admin-form-toolbar">
            <div className="admin-form-toolbar__copy">
              <p className="admin-form-toolbar__breadcrumb">
                CMS
                <span aria-hidden> / </span>
                {sectionLabel}
                {!isSingleton && (
                  <>
                    <span aria-hidden> / </span>
                    {mode === "create" ? "Create" : "Edit"}
                  </>
                )}
              </p>
              <h1 className="admin-form-toolbar__title">
                {isSingleton
                  ? entity.label
                  : mode === "create"
                    ? `New ${entity.label}`
                    : `Edit ${entity.label}`}
              </h1>
            </div>
            <div className="admin-form-toolbar__actions">
              {!isSingleton && (
                <Link
                  href={`/admin/cms/${entity.key}`}
                  className="admin-btn admin-btn--ghost admin-btn--toolbar"
                >
                  Cancel
                </Link>
              )}
              <button
                type="submit"
                form={formId}
                className="admin-btn admin-btn--primary admin-btn--toolbar"
                disabled={saveDisabled}
              >
                {submitLabel}
              </button>
            </div>
          </header>

          <div className="admin-form-shell__body">
            {formError && (
              <div className="admin-alert admin-alert--error admin-form-shell__alert">{formError}</div>
            )}

            <form
              id={formId}
              onSubmit={(e) => void handleSubmit(e)}
              className={cn(
                "admin-form-layout",
                sidebarSections.length > 0 && "admin-form-layout--with-sidebar",
              )}
            >
              <div className="admin-form-layout__main">
                {mainSections.map((section) => renderFormSection(section))}
              </div>
              {sidebarSections.length > 0 && (
                <aside className="admin-form-layout__sidebar">
                  {sidebarSections.map((section) => renderFormSection(section, true))}
                </aside>
              )}
            </form>
          </div>

          <footer className="admin-form-shell__footer">
            <span
              className={cn(
                "admin-form-shell__status",
                isDirty && "admin-form-shell__status--dirty",
              )}
            >
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </span>
            <div className="admin-form-shell__footer-actions">
              {!isSingleton && (
                <Link href={`/admin/cms/${entity.key}`} className="admin-btn admin-btn--ghost admin-btn--toolbar">
                  Cancel
                </Link>
              )}
              <button
                type="submit"
                form={formId}
                className="admin-btn admin-btn--primary admin-btn--toolbar"
                disabled={saveDisabled}
              >
                {submitLabel}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
