"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminDelete, adminList, adminRelationOptions } from "@/lib/admin/api-client";
import { getEntityDef, getListColumns, getListFilters, type AdminFieldDef } from "@/lib/admin/entities";
import { hasActiveFilters, rowMatchesFilter } from "@/lib/admin/list-filters";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { PackageImportModal } from "@/components/admin/PackageImportModal";

const PAGE_SIZE = 20;

type EntityTableViewProps = {
  entityKey: string;
};

type SortMode = "date" | "name" | "updated";

function formatCell(col: AdminFieldDef, raw: unknown, row: Record<string, unknown>) {
  const text = col.listFormat
    ? col.listFormat(raw, row)
    : raw == null || raw === ""
      ? ""
      : String(raw);
  return text;
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
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortMode>("date");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [relationOptions, setRelationOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});
  const [importOpen, setImportOpen] = useState(false);

  const columns = entity ? getListColumns(entity) : [];
  const listFilters = useMemo(() => (entity ? getListFilters(entity) : []), [entity]);
  const idField = entity?.idField ?? "id";

  const load = useCallback(async () => {
    if (!entity) return;
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await adminList<Record<string, unknown>>(
      entity.endpoint,
      PAGE_SIZE,
      offset,
    );
    setLoading(false);
    if (apiError) {
      setError(apiError.message);
      return;
    }
    setItems(data?.items ?? []);
    setTotal(data?.total ?? 0);
  }, [entity, offset]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (entityKey !== "packages" || searchParams.get("import") !== "1") return;
    setImportOpen(true);
    router.replace("/admin/cms/packages", { scroll: false });
  }, [entityKey, router, searchParams]);

  useEffect(() => {
    setSearch("");
    setFilterValues({});
    setSortBy("date");
  }, [entityKey]);

  useEffect(() => {
    if (!entity) return;

    const relationFilters = listFilters.filter((filter) => filter.type === "relation");
    if (relationFilters.length === 0) {
      setRelationOptions({});
      return;
    }

    let cancelled = false;

    void (async () => {
      const entries = await Promise.all(
        relationFilters.map(async (filter) => {
          const rel = filter.relation;
          const options = await adminRelationOptions(
            rel.endpoint,
            rel.valueKey,
            rel.labelKey,
            rel.labelKeys,
          );
          return [filter.field, options] as const;
        }),
      );

      if (cancelled) return;
      setRelationOptions(Object.fromEntries(entries));
    })();

    return () => {
      cancelled = true;
    };
  }, [entity, listFilters]);

  const handleDelete = async () => {
    if (!deleteTarget || !entity) return;
    setDeleting(true);
    const { error: apiError } = await adminDelete(entity.endpoint, String(deleteTarget[idField]));
    setDeleting(false);
    if (apiError) {
      setError(apiError.message);
      setDeleteTarget(null);
      return;
    }
    setDeleteTarget(null);
    void load();
    router.refresh();
  };

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
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
        ...columns.map((col) => formatCell(col, row[col.name], row)),
      ];
      return parts.some((p) => p.toLowerCase().includes(q));
    });

    return sortRows(filtered, sortBy, nameField);
  }, [columns, filterValues, items, listFilters, nameField, search, sortBy]);

  const filtersActive = hasActiveFilters(search, filterValues);

  const handleClearFilters = () => {
    setSearch("");
    setFilterValues({});
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilterValues((current) => ({ ...current, [field]: value }));
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

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-header__copy">
          <h1 className="admin-page-title">{entity.pluralLabel}</h1>
          <p className="admin-page-subtitle">
            Search, filter, and manage {entity.pluralLabel.toLowerCase()} for the public site.
            {total > 0 && (
              <>
                {" "}
                {total} {total === 1 ? "entry" : "entries"}
                {filtersActive && filteredItems.length !== total
                  ? ` · ${filteredItems.length} shown`
                  : ""}
              </>
            )}
          </p>
        </div>

        {(showCreate || entity.key === "packages") && (
          <div className="admin-page-header__actions">
            {entity.key === "packages" && (
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--page"
                onClick={() => setImportOpen(true)}
              >
                Upload PDF
              </button>
            )}
            {showCreate && (
              <Link href={`/admin/cms/${entity.key}/new`} className="admin-btn admin-btn--primary admin-btn--page">
                <Plus aria-hidden className="admin-btn__icon" />
                New {entity.label}
              </Link>
            )}
          </div>
        )}
      </header>

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

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      {loading && items.length === 0 ? (
        <div className="admin-page-state">Loading {entity.pluralLabel.toLowerCase()}…</div>
      ) : filteredItems.length === 0 ? (
        <div className="admin-page-empty">
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
            <Link href={`/admin/cms/${entity.key}/new`} className="admin-btn admin-btn--primary admin-btn--page">
              <Plus aria-hidden className="admin-btn__icon" />
              Create {entity.label.toLowerCase()}
            </Link>
          )}
        </div>
      ) : (
        <div className={cn("admin-table-wrap", loading && items.length > 0 && "admin-table-wrap--refreshing")}>
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{titleColumn?.listLabel ?? titleColumn?.label ?? "Name"}</th>
                  {tableColumns.map((col) => (
                    <th
                      key={col.name}
                      className={cn(col.name === "is_published" && "admin-table__col--status")}
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
                    ? formatCell(titleColumn, row[titleColumn.name], row) || "Untitled"
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
                        const value = formatCell(col, row[col.name], row);
                        const isPublished = col.name === "is_published";

                        return (
                          <td
                            key={col.name}
                            className={cn(isPublished && "admin-table__col--status")}
                          >
                            {isPublished ? (
                              <span
                                className={cn(
                                  "admin-status-pill",
                                  value === "Yes" ? "admin-status-pill--published" : "admin-status-pill--draft",
                                )}
                              >
                                {value === "Yes" ? "Published" : "Draft"}
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

          <footer className="admin-table-footer">
            <span className="admin-table-footer__meta">
              Page {page} of {totalPages}
            </span>
            <div className="admin-table-footer__pager">
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

      {entity.key === "packages" && (
        <PackageImportModal
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onCommitted={() => {
            void load();
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
