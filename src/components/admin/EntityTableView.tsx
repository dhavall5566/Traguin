"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminDelete, adminRelationOptions, adminUpdate } from "@/lib/admin/api-client";
import {
  adminListCacheKey,
  fetchAdminListCached,
  invalidateAdminListCache,
  patchCachedAdminListItem,
  peekCachedAdminList,
  prependCachedAdminListItem,
  removeCachedAdminListItem,
  revalidateAdminListInBackground,
  subscribeAdminListCache,
} from "@/lib/admin/admin-data-cache";
import {
  getEntityDef,
  getEntityNavSectionId,
  getListColumns,
  getListFilters,
  getNavSectionLabel,
  type AdminFieldDef,
} from "@/lib/admin/entities";
import { hasActiveFilters, rowMatchesFilter } from "@/lib/admin/list-filters";
import { formatAdminListCell } from "@/lib/admin/list-cell-format";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { AdminListToggle } from "@/components/admin/AdminListToggle";
import { useAdminToast } from "@/components/admin/AdminToast";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { EntityFormView } from "@/components/admin/EntityFormView";
import { GalleryFolderUploadButton, type FolderUploadStatus } from "@/components/admin/GalleryFolderUploadButton";
import { GalleryFolderUploadBanner } from "@/components/admin/GalleryFolderUploadBanner";

const PAGE_SIZE = 20;

type EntityTableViewProps = {
  entityKey: string;
};

type SortMode = "date" | "name" | "updated";

function buildRelationLabelMaps(
  fields: AdminFieldDef[],
  optionsByField: Record<string, { value: string; label: string }[]>,
): Record<string, Record<string, string>> {
  const maps: Record<string, Record<string, string>> = {};
  for (const field of fields) {
    const options = optionsByField[field.name];
    if (!options?.length) continue;
    maps[field.name] = Object.fromEntries(options.map((option) => [option.value, option.label]));
  }
  return maps;
}

function sortRows(
  rows: Record<string, unknown>[],
  sortBy: SortMode,
  nameField: string,
): Record<string, unknown>[] {
  const sorted = [...rows];

  sorted.sort((a, b) => {
    if (sortBy === "name") {
      return String(a[nameField] ?? "").localeCompare(String(b[nameField] ?? ""), undefined, {
        sensitivity: "base",
      });
    }

    const dateField = sortBy === "updated" ? "updated_at" : "created_at";
    const aTime = a[dateField] ? new Date(String(a[dateField])).getTime() : 0;
    const bTime = b[dateField] ? new Date(String(b[dateField])).getTime() : 0;
    return bTime - aTime;
  });

  return sorted;
}

export function EntityTableView({ entityKey }: EntityTableViewProps) {
  const entity = getEntityDef(entityKey);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortMode>("date");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [folderUploadStatus, setFolderUploadStatus] = useState<FolderUploadStatus | null>(null);
  const [relationOptions, setRelationOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});
  const { showUpdatedToast, showDeletedToast, showErrorToast } = useAdminToast();

  const columns = useMemo(() => (entity ? getListColumns(entity) : []), [entity]);
  const listFilters = useMemo(() => (entity ? getListFilters(entity) : []), [entity]);
  const listRelationFields = useMemo(
    () => columns.filter((col) => col.type === "relation" && col.relation),
    [columns],
  );
  const idField = entity?.idField ?? "id";
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const load = useCallback(async () => {
    if (!entity) return;

    const cacheKey = adminListCacheKey(entity.endpoint, PAGE_SIZE, offset);
    const cached = peekCachedAdminList(cacheKey);

    if (cached) {
      setItems(cached.items ?? []);
      setTotal(cached.total ?? 0);
      setInitialLoading(false);
      setRefreshing(false);
    } else {
      setInitialLoading(itemsRef.current.length === 0);
      setRefreshing(itemsRef.current.length > 0);
    }

    setError(null);
    const result = await fetchAdminListCached(entity.endpoint, PAGE_SIZE, offset);
    setInitialLoading(false);

    if ("error" in result) {
      if (!cached) setError(result.error);
      setRefreshing(false);
      return;
    }

    setItems(result.items ?? []);
    setTotal(result.total ?? 0);
    setRefreshing(false);
  }, [entity, offset]);

  useEffect(() => {
    if (searchParams.get("create") !== "1") return;
    setCreateOpen(true);
    router.replace(`/admin/cms/${entityKey}`, { scroll: false });
  }, [entityKey, router, searchParams]);

  const handleCreated = useCallback(
    (record: Record<string, unknown>) => {
      setCreateOpen(false);
      if (!entity) return;

      setOffset(0);
      setSearch("");
      setFilterValues({});
      setError(null);

      const idField = entity.idField ?? "id";
      prependCachedAdminListItem(entity.endpoint, record, idField);

      void (async () => {
        invalidateAdminListCache(entity.endpoint);
        const result = await fetchAdminListCached(entity.endpoint, PAGE_SIZE, 0, { force: true });
        if ("error" in result) {
          const cacheKey = adminListCacheKey(entity.endpoint, PAGE_SIZE, 0);
          const cached = peekCachedAdminList(cacheKey);
          if (cached) {
            setItems(cached.items);
            setTotal(cached.total);
          }
          return;
        }
        setItems(result.items ?? []);
        setTotal(result.total ?? 0);
      })();
    },
    [entity],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!entity) return undefined;

    const cacheKey = adminListCacheKey(entity.endpoint, PAGE_SIZE, offset);
    return subscribeAdminListCache((key, entry) => {
      if (key !== cacheKey) return;
      setItems(entry.items ?? []);
      setTotal(entry.total ?? 0);
      setRefreshing(false);
    });
  }, [entity, offset]);

  useEffect(() => {
    setSearch("");
    setFilterValues({});
    setSortBy("date");
    setOffset(0);
    setError(null);

    const nextEntity = getEntityDef(entityKey);
    if (!nextEntity) return;

    const cached = peekCachedAdminList(adminListCacheKey(nextEntity.endpoint, PAGE_SIZE, 0));
    if (cached) {
      setItems(cached.items ?? []);
      setTotal(cached.total ?? 0);
      setInitialLoading(false);
    } else {
      setItems([]);
      setTotal(0);
      setInitialLoading(true);
    }
  }, [entityKey]);

  useEffect(() => {
    setOffset(0);
  }, [search, filterValues]);

  useEffect(() => {
    if (!entity) return;

    const relationFields = [
      ...listFilters.filter((filter) => filter.type === "relation"),
      ...listRelationFields.map((field) => ({
        field: field.name,
        relation: field.relation!,
      })),
    ];

    const uniqueFields = Array.from(
      new Map(relationFields.map((item) => [item.field, item])).values(),
    );

    if (uniqueFields.length === 0) {
      setRelationOptions({});
      return;
    }

    let cancelled = false;

    void (async () => {
      const entries = await Promise.all(
        uniqueFields.map(async (item) => {
          const rel = item.relation;
          const options = await adminRelationOptions(
            rel.endpoint,
            rel.valueKey,
            rel.labelKey,
            rel.labelKeys,
          );
          return [item.field, options] as const;
        }),
      );

      if (cancelled) return;
      setRelationOptions(Object.fromEntries(entries));
    })();

    return () => {
      cancelled = true;
    };
  }, [entity, listFilters, listRelationFields]);

  const relationLabelMaps = useMemo(
    () => buildRelationLabelMaps(listRelationFields, relationOptions),
    [listRelationFields, relationOptions],
  );

  const handleDelete = async () => {
    if (!deleteTarget || !entity) return;

    const deletedRecord = deleteTarget;
    const deletedId = String(deletedRecord[idField]);
    const deletedName = String(deletedRecord[nameField] ?? entity.label);
    const previousItems = items;
    const previousTotal = total;

    setDeleting(true);
    setDeleteTarget(null);
    setItems((current) => current.filter((row) => String(row[idField]) !== deletedId));
    setTotal((current) => Math.max(0, current - 1));
    removeCachedAdminListItem(entity.endpoint, idField, deletedId);
    showDeletedToast(`${deletedName} deleted.`);

    const { error: apiError } = await adminDelete(entity.endpoint, deletedId);
    setDeleting(false);

    if (apiError) {
      setItems(previousItems);
      setTotal(previousTotal);
      prependCachedAdminListItem(entity.endpoint, deletedRecord, idField);
      setError(apiError.message);
      showErrorToast(apiError.message);
      return;
    }

    revalidateAdminListInBackground(entity.endpoint, PAGE_SIZE, offset);
  };

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + PAGE_SIZE, total);
  const nameField = entity?.nameField ?? "title";
  const showCreate = entity && !entity.isSingleton && !entity.hideCreate;
  const showDelete = entity && !entity.hideDelete;

  const filteredItems = useMemo(() => {
    const filtered = items.filter((row) => {
      for (const filter of listFilters) {
        if (!rowMatchesFilter(row, filter, filterValues[filter.field] ?? "")) {
          return false;
        }
      }

      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      const parts = [
        String(row[nameField] ?? ""),
        String(row.slug ?? ""),
        String(row.id ?? ""),
        ...columns.map((col) =>
          formatAdminListCell(col, row[col.name], row, relationLabelMaps),
        ),
      ];
      return parts.some((p) => p.toLowerCase().includes(q));
    });

    return sortRows(filtered, sortBy, nameField);
  }, [columns, filterValues, items, listFilters, nameField, relationLabelMaps, search, sortBy]);

  const filtersActive = hasActiveFilters(search, filterValues);

  const handleClearFilters = () => {
    setSearch("");
    setFilterValues({});
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilterValues((current) => ({ ...current, [field]: value }));
  };

  const handleListToggle = (
    row: Record<string, unknown>,
    field: AdminFieldDef,
    nextValue: boolean,
  ) => {
    if (!entity) return;

    const recordId = String(row[idField]);
    const previousValue = Boolean(row[field.name]);
    const patch = { [field.name]: nextValue };

    setItems((current) =>
      current.map((item) =>
        String(item[idField]) === recordId ? { ...item, ...patch } : item,
      ),
    );
    patchCachedAdminListItem(entity.endpoint, idField, recordId, patch);

    const toggleLabel = field.listLabel ?? field.label;
    showUpdatedToast(
      field.name === "is_published"
        ? nextValue
          ? "Story activated."
          : "Story deactivated."
        : nextValue
          ? `${toggleLabel} enabled.`
          : `${toggleLabel} disabled.`,
    );

    void adminUpdate(entity.endpoint, recordId, patch).then((result) => {
      if (!result.error) {
        revalidateAdminListInBackground(entity.endpoint, PAGE_SIZE, offset);
        return;
      }

      setItems((current) =>
        current.map((item) =>
          String(item[idField]) === recordId ? { ...item, [field.name]: previousValue } : item,
        ),
      );
      patchCachedAdminListItem(entity.endpoint, idField, recordId, {
        [field.name]: previousValue,
      });
      setError(result.error.message);
      showErrorToast(result.error.message);
    });
  };

  if (!entity) {
    return <p className="admin-page-muted">Unknown entity.</p>;
  }

  const titleColumn = columns.find((col) => col.name === nameField) ?? columns[0];
  const tableColumns = columns.filter((col) => col !== titleColumn);
  const hasUpdatedAt = items.some((row) => row.updated_at);
  const dateColumnLabel = hasUpdatedAt ? "Updated" : "Added";

  const sortOptions = [
    { value: "date", label: "Date added" },
    { value: "updated", label: "Last updated" },
    { value: "name", label: "Name A–Z" },
  ];

  const sectionLabel = getNavSectionLabel(getEntityNavSectionId(entity.key));

  return (
    <div className="admin-page admin-list-page">
      <div className="admin-workspace">
        <div className="admin-list-panel">
          <header className="admin-list-panel__head">
            <div className="admin-list-panel__intro">
              <p className="admin-workspace-eyebrow">CMS · {sectionLabel}</p>
              <h1 className="admin-list-panel__title">{entity.pluralLabel}</h1>
              <p className="admin-list-panel__subtitle">
                Search, filter, and manage {entity.pluralLabel.toLowerCase()} for the public site.
              </p>
              {total > 0 && (
                <div className="admin-page-stats">
                  <span className="admin-stat-chip">
                    <span className="admin-stat-chip__value">{total}</span>
                    <span className="admin-stat-chip__label">{total === 1 ? "entry" : "entries"}</span>
                  </span>
                  {filtersActive && filteredItems.length !== total && (
                    <span className="admin-stat-chip admin-stat-chip--accent">
                      <span className="admin-stat-chip__value">{filteredItems.length}</span>
                      <span className="admin-stat-chip__label">shown</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {showCreate && (
              <div className="admin-list-panel__head-actions">
                {entityKey === "gallery-items" && (
                  <GalleryFolderUploadButton
                    onCreated={handleCreated}
                    onStatusChange={setFolderUploadStatus}
                    disabled={
                      folderUploadStatus !== null
                      && folderUploadStatus.phase !== "done"
                      && folderUploadStatus.phase !== "error"
                    }
                  />
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn--primary admin-btn--add"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus aria-hidden className="admin-btn__icon" />
                  New {entity.label}
                </button>
              </div>
            )}
          </header>

          {folderUploadStatus && (
            <GalleryFolderUploadBanner
              status={folderUploadStatus}
              onDismiss={() => setFolderUploadStatus(null)}
            />
          )}

          <div className="admin-list-panel__toolbar">
            <AdminListToolbar
              entityLabel={entity.pluralLabel}
              search={search}
              onSearchChange={setSearch}
              filters={listFilters}
              filterValues={filterValues}
              onFilterChange={handleFilterChange}
              relationOptions={relationOptions}
              items={items}
              onClear={handleClearFilters}
              showClear={filtersActive}
              sortBy={sortBy}
              onSortChange={(value) => setSortBy(value as SortMode)}
              sortOptions={sortOptions}
            />
          </div>

          {error && (
            <div className="admin-list-panel__alert">
              <div className="admin-alert admin-alert--error">{error}</div>
            </div>
          )}

          {initialLoading && items.length === 0 ? (
            <div className="admin-list-panel__state">Loading {entity.pluralLabel.toLowerCase()}…</div>
          ) : filteredItems.length === 0 ? (
            <div className="admin-list-panel__state admin-list-panel__state--empty">
              <p className="admin-page-empty__title">
                {filtersActive
                  ? `No ${entity.pluralLabel.toLowerCase()} match your filters`
                  : `No ${entity.pluralLabel.toLowerCase()} yet`}
              </p>
              <p className="admin-page-empty__text">
                {filtersActive
                  ? "Try adjusting search or filter options."
                  : `Create your first ${entity.label.toLowerCase()} to get started.`}
              </p>
              {showCreate && !filtersActive && (
                <button
                  type="button"
                  className="admin-btn admin-btn--primary admin-btn--page"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus aria-hidden className="admin-btn__icon" />
                  Create {entity.label.toLowerCase()}
                </button>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "admin-list-panel__body",
                refreshing && "admin-list-panel__body--refreshing",
              )}
            >
              <div className="admin-table-scroll admin-list-panel__table">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{titleColumn?.listLabel ?? titleColumn?.label ?? "Name"}</th>
                      {tableColumns.map((col) => (
                        <th
                          key={col.name}
                          className={cn(
                            (col.name === "is_published" || col.listToggle) && "admin-table__col--status",
                          )}
                        >
                          {col.listLabel ?? col.label}
                        </th>
                      ))}
                      <th className="admin-table__col--date">{dateColumnLabel}</th>
                      {showDelete && <th className="admin-table__col--actions">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((row) => {
                      const recordId = String(row[idField]);
                      const editHref = `/admin/cms/${entity.key}/${recordId}`;
                      const title = titleColumn
                        ? formatAdminListCell(
                            titleColumn,
                            row[titleColumn.name],
                            row,
                            relationLabelMaps,
                          ) || "Untitled"
                        : String(row[nameField] ?? "Untitled");
                      const slug = row.slug ? String(row.slug) : null;
                      const dateValue = row.updated_at ?? row.created_at;
                      const formattedDate = dateValue
                        ? new Date(String(dateValue)).toLocaleDateString()
                        : "—";

                      return (
                        <tr
                          key={recordId}
                          className="admin-table__row"
                          onClick={() => router.push(editHref)}
                        >
                          <td>
                            <div className="admin-table__primary">{title}</div>
                            {(slug || recordId) && (
                              <div className="admin-table__secondary">{slug ?? recordId}</div>
                            )}
                          </td>

                          {tableColumns.map((col) => {
                            const value = formatAdminListCell(
                              col,
                              row[col.name],
                              row,
                              relationLabelMaps,
                            );
                            const isPublished = col.name === "is_published";
                            const isListToggle = Boolean(col.listToggle && col.type === "boolean");

                            return (
                              <td
                                key={col.name}
                                className={cn(
                                  (isPublished || isListToggle) && "admin-table__col--status",
                                )}
                                onClick={isListToggle ? (event) => event.stopPropagation() : undefined}
                              >
                                {isListToggle ? (
                                  <AdminListToggle
                                    checked={Boolean(row[col.name])}
                                    label={title}
                                    onChange={(next) => handleListToggle(row, col, next)}
                                  />
                                ) : isPublished ? (
                                  <span
                                    className={cn(
                                      "admin-status-pill",
                                      Boolean(row[col.name])
                                        ? "admin-status-pill--published"
                                        : "admin-status-pill--draft",
                                    )}
                                  >
                                    {Boolean(row[col.name]) ? "Published" : "Draft"}
                                  </span>
                                ) : (
                                  value || "—"
                                )}
                              </td>
                            );
                          })}

                          <td className="admin-table__col--date admin-table__muted">{formattedDate}</td>

                          {showDelete && (
                            <td
                              className="admin-table__col--actions"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <div className="admin-table__actions">
                                <Link href={editHref} className="admin-table__action">
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  className="admin-table__action admin-table__action--danger"
                                  aria-label={`Delete ${title}`}
                                  onClick={() => setDeleteTarget(row)}
                                >
                                  <Trash2 aria-hidden className="admin-table__action-icon" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <footer className="admin-list-panel__footer">
                <span className="admin-list-panel__page">
                  Showing {rangeStart}–{rangeEnd} of {total}
                  {totalPages > 1 && (
                    <>
                      {" "}
                      · Page {page} of {totalPages}
                    </>
                  )}
                </span>
                <div className="admin-list-panel__pager">
                  <button
                    type="button"
                    className="admin-pager-btn"
                    disabled={offset === 0}
                    aria-label="Previous page"
                    onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                  >
                    <ChevronLeft aria-hidden className="admin-pager-btn__icon" />
                    Previous
                  </button>
                  <button
                    type="button"
                    className="admin-pager-btn"
                    disabled={offset + PAGE_SIZE >= total}
                    aria-label="Next page"
                    onClick={() => setOffset(offset + PAGE_SIZE)}
                  >
                    Next
                    <ChevronRight aria-hidden className="admin-pager-btn__icon" />
                  </button>
                </div>
              </footer>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${entity.label}?`}
        message={
          deleteTarget
            ? `This will permanently remove "${String(deleteTarget[nameField] ?? deleteTarget[idField])}". This action cannot be undone.`
            : ""
        }
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />

      {showCreate && createOpen ? (
        <EntityFormView
          entityKey={entityKey}
          variant="modal"
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={handleCreated}
        />
      ) : null}
    </div>
  );
}
