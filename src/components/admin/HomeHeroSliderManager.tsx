"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { useAdminToast } from "@/components/admin/AdminToast";
import { adminList } from "@/lib/admin/api-client";
import { hasActiveFilters, rowMatchesFilter } from "@/lib/admin/list-filters";
import { parseAdminPaginatedList } from "@/lib/admin/list-response";
import type { AdminListFilterDef } from "@/lib/admin/types";
import {
  fetchHomepageHeroSliderSettings,
  saveHomepageHeroSliderOrder,
  setItineraryHomepageVisibility,
  setPackageHomepageVisibility,
  type HeroSliderOrderItem,
} from "@/lib/admin/homepage-hero-admin";
import {
  clampHeroSliderMaxItems,
  HERO_SLIDER_DEFAULT_MAX_ITEMS,
} from "@/lib/api/homepage-hero-settings";
import { cn } from "@/lib/utils";

type CatalogRow = {
  id: string;
  title: string;
  slug: string;
  destination_name?: string;
  is_featured: boolean;
  featured_sort_order: number | null;
  is_published: boolean;
};

type SliderKind = "package" | "itinerary";

type SliderRow = CatalogRow & {
  kind: SliderKind;
  key: string;
};

const PAGE_SIZE = 100;

const SLIDER_FILTERS: AdminListFilterDef[] = [
  {
    type: "select",
    field: "kind",
    label: "Type",
    options: [
      { value: "", label: "All" },
      { value: "package", label: "Package" },
      { value: "itinerary", label: "Itinerary" },
    ],
  },
  { type: "dynamic", field: "destination_name", label: "Destination" },
];

const SLIDER_SORT_OPTIONS = [{ value: "order", label: "Slider order" }];

async function fetchCatalog(endpoint: "/packages" | "/itineraries"): Promise<CatalogRow[]> {
  const rows: CatalogRow[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await adminList<Record<string, unknown>>(endpoint, PAGE_SIZE, offset);
    if (error) throw new Error(error.message);

    const { items: pageItems, total } = parseAdminPaginatedList(data);
    if (pageItems.length === 0 && offset === 0 && total === 0) break;
    if (pageItems.length === 0 && offset > 0) break;

    for (const item of pageItems) {
      rows.push({
        id: String(item.id),
        title: String(item.title ?? "Untitled"),
        slug: String(item.slug ?? ""),
        destination_name: item.destination_name ? String(item.destination_name) : undefined,
        is_featured: Boolean(item.is_featured),
        featured_sort_order:
          item.featured_sort_order == null || item.featured_sort_order === ""
            ? null
            : Number(item.featured_sort_order),
        is_published: Boolean(item.is_published),
      });
    }

    if (offset + PAGE_SIZE >= total) break;
    offset += PAGE_SIZE;
  }

  return rows;
}

function toSliderRows(
  packages: CatalogRow[],
  itineraries: CatalogRow[],
  visiblePackageIds: string[],
  visibleItineraryIds: string[],
): SliderRow[] {
  const packageById = new Map(packages.map((row) => [row.id, row]));
  const itineraryById = new Map(itineraries.map((row) => [row.id, row]));

  const packageRows: SliderRow[] = visiblePackageIds
    .map((id) => packageById.get(id))
    .filter((row): row is CatalogRow => Boolean(row?.is_published))
    .map((row) => ({
      ...row,
      kind: "package" as const,
      key: `package:${row.id}`,
    }));

  const itineraryRows: SliderRow[] = visibleItineraryIds
    .map((id) => itineraryById.get(id))
    .filter((row): row is CatalogRow => Boolean(row?.is_published))
    .map((row) => ({
      ...row,
      kind: "itinerary" as const,
      key: `itinerary:${row.id}`,
    }));

  return [...packageRows, ...itineraryRows].sort(
    (a, b) =>
      (a.featured_sort_order ?? 999) - (b.featured_sort_order ?? 999) ||
      a.title.localeCompare(b.title),
  );
}

export function HomeHeroSliderManager() {
  const { showUpdatedToast, showDeletedToast } = useAdminToast();
  const [packages, setPackages] = useState<CatalogRow[]>([]);
  const [itineraries, setItineraries] = useState<CatalogRow[]>([]);
  const [maxVisibleItems, setMaxVisibleItems] = useState(HERO_SLIDER_DEFAULT_MAX_ITEMS);
  const [visiblePackageIds, setVisiblePackageIds] = useState<string[]>([]);
  const [visibleItineraryIds, setVisibleItineraryIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState("order");
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orderGeneration = useRef(0);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [allPackages, allItineraries, settings] = await Promise.all([
        fetchCatalog("/packages"),
        fetchCatalog("/itineraries"),
        fetchHomepageHeroSliderSettings(),
      ]);

      setPackages(allPackages);
      setItineraries(allItineraries);
      setMaxVisibleItems(clampHeroSliderMaxItems(settings.hero_slider_max_items));
      setVisiblePackageIds(settings.visible_package_ids);
      setVisibleItineraryIds(settings.visible_itinerary_ids);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load homepage hero slider settings.");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const slides = useMemo(
    () => toSliderRows(packages, itineraries, visiblePackageIds, visibleItineraryIds),
    [packages, itineraries, visiblePackageIds, visibleItineraryIds],
  );

  const visibleCount = slides.length;

  const toolbarItems = useMemo(
    () =>
      slides.map((row) => ({
        id: row.key,
        title: row.title,
        slug: row.slug,
        destination_name: row.destination_name ?? "",
        kind: row.kind,
      })),
    [slides],
  );

  const filteredSlides = useMemo(() => {
    return slides.filter((row) => {
      const filterRow = {
        destination_name: row.destination_name ?? "",
        kind: row.kind,
      };

      for (const filter of SLIDER_FILTERS) {
        if (!rowMatchesFilter(filterRow, filter, filterValues[filter.field] ?? "")) {
          return false;
        }
      }

      if (!search.trim()) return true;
      const query = search.trim().toLowerCase();
      return [row.title, row.slug, row.destination_name ?? "", row.kind].some((part) =>
        part.toLowerCase().includes(query),
      );
    });
  }, [slides, filterValues, search]);

  const filtersActive = hasActiveFilters(search, filterValues);

  const persistOrder = async (nextSlides: SliderRow[]) => {
    const items: HeroSliderOrderItem[] = nextSlides.map((row) => ({
      kind: row.kind,
      id: row.id,
    }));
    const generation = ++orderGeneration.current;
    setSavingOrder(true);
    try {
      const saved = await saveHomepageHeroSliderOrder({ items });
      if (generation !== orderGeneration.current) return;
      setVisiblePackageIds(saved.visible_package_ids);
      setVisibleItineraryIds(saved.visible_itinerary_ids);
      setMaxVisibleItems(clampHeroSliderMaxItems(saved.hero_slider_max_items));

      const orderByKey = new Map(
        nextSlides.map((row, index) => [row.key, index + 1] as const),
      );
      setPackages((current) =>
        current.map((row) => {
          const order = orderByKey.get(`package:${row.id}`);
          return order == null
            ? row
            : { ...row, is_featured: true, featured_sort_order: order };
        }),
      );
      setItineraries((current) =>
        current.map((row) => {
          const order = orderByKey.get(`itinerary:${row.id}`);
          return order == null
            ? row
            : { ...row, is_featured: true, featured_sort_order: order };
        }),
      );
      showUpdatedToast("Slider order saved.");
    } catch (err) {
      if (generation !== orderGeneration.current) return;
      setError(err instanceof Error ? err.message : "Failed to update slider order.");
      await load();
    } finally {
      if (generation === orderGeneration.current) {
        setSavingOrder(false);
      }
    }
  };

  const handleMove = (indexInFullList: number, direction: -1 | 1) => {
    const targetIndex = indexInFullList + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    setError(null);
    setSortBy("order");
    const next = [...slides];
    [next[indexInFullList], next[targetIndex]] = [next[targetIndex], next[indexInFullList]];
    void persistOrder(next);
  };

  const handleRemove = async (row: SliderRow) => {
    setError(null);
    const previousPackages = visiblePackageIds;
    const previousItineraries = visibleItineraryIds;

    try {
      if (row.kind === "package") {
        const saved = await setPackageHomepageVisibility({
          packageId: row.id,
          makeVisible: false,
          currentVisibleIds: visiblePackageIds,
          featuredCount: 0,
        });
        setVisiblePackageIds(saved.visible_package_ids);
        setVisibleItineraryIds(saved.visible_itinerary_ids);
        setPackages((current) =>
          current.map((item) =>
            item.id === row.id
              ? { ...item, is_featured: false, featured_sort_order: null }
              : item,
          ),
        );
      } else {
        const saved = await setItineraryHomepageVisibility({
          itineraryId: row.id,
          makeVisible: false,
          currentVisibleIds: visibleItineraryIds,
        });
        setVisiblePackageIds(saved.visible_package_ids);
        setVisibleItineraryIds(saved.visible_itinerary_ids);
        setItineraries((current) =>
          current.map((item) =>
            item.id === row.id
              ? { ...item, is_featured: false, featured_sort_order: null }
              : item,
          ),
        );
      }
      showDeletedToast("Removed from homepage hero slider.");
    } catch (err) {
      setVisiblePackageIds(previousPackages);
      setVisibleItineraryIds(previousItineraries);
      setError(err instanceof Error ? err.message : "Failed to remove item from slider.");
    }
  };

  return (
    <div className="admin-page admin-list-page">
      <div className="admin-workspace">
        <div className="admin-settings-panel">
          <div className="admin-settings-panel__head">
            <div>
              <p className="admin-workspace-eyebrow">CMS · Home</p>
              <h1 className="admin-settings-panel__title">Homepage Hero Slider</h1>
              <p className="admin-settings-panel__subtitle">
                One list for packages and itineraries — reorder the homepage hero here.
              </p>
            </div>
            <div className="admin-page-stats">
              <span className="admin-stat-chip admin-stat-chip--accent">
                <span className="admin-stat-chip__value">{visibleCount}</span>
                <span className="admin-stat-chip__label">on homepage</span>
              </span>
              <span className="admin-stat-chip">
                <span className="admin-stat-chip__value">{maxVisibleItems}</span>
                <span className="admin-stat-chip__label">max</span>
              </span>
            </div>
          </div>

          {error ? (
            <div className="admin-settings-panel__alerts">
              <div className="admin-alert admin-alert--error">{error}</div>
            </div>
          ) : null}
        </div>

        <div className="admin-list-panel">
          <header className="admin-list-panel__head admin-list-panel__head--compact">
            <div className="admin-list-panel__intro">
              <h2 className="admin-list-panel__title admin-list-panel__title--sm">Hero slides</h2>
              <p className="admin-list-panel__subtitle">
                Showing published items currently visible on the homepage. Add more from{" "}
                <Link href="/admin/cms/packages" className="admin-inline-link">
                  Packages
                </Link>{" "}
                or{" "}
                <Link href="/admin/cms/itineraries" className="admin-inline-link">
                  Itineraries
                </Link>{" "}
                (Hero slider toggle).
              </p>
            </div>
          </header>

          {!initialLoading && slides.length > 0 ? (
            <div className="admin-list-panel__toolbar">
              <AdminListToolbar
                entityLabel="Hero slides"
                search={search}
                onSearchChange={setSearch}
                filters={SLIDER_FILTERS}
                filterValues={filterValues}
                onFilterChange={(field, value) =>
                  setFilterValues((current) => ({ ...current, [field]: value }))
                }
                relationOptions={{}}
                items={toolbarItems}
                onClear={() => {
                  setSearch("");
                  setFilterValues({});
                }}
                showClear={filtersActive}
                sortBy={sortBy}
                onSortChange={setSortBy}
                sortOptions={SLIDER_SORT_OPTIONS}
              />
            </div>
          ) : null}

          <div className="admin-list-panel__body">
            {initialLoading ? (
              <div className="admin-list-panel__state">Loading hero slides…</div>
            ) : slides.length === 0 ? (
              <div className="admin-list-panel__state admin-list-panel__state--empty">
                <p className="admin-page-empty__title">Nothing on the homepage hero yet</p>
                <p className="admin-page-empty__text">
                  Enable <strong>Hero slider</strong> on a published package or itinerary to add it
                  here.
                </p>
              </div>
            ) : filteredSlides.length === 0 ? (
              <div className="admin-list-panel__state admin-list-panel__state--empty">
                <p className="admin-page-empty__title">No slides match your filters</p>
              </div>
            ) : (
              <div className="admin-table-scroll admin-list-panel__table">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th className="admin-table__col--actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSlides.map((row) => {
                      const index = slides.findIndex((item) => item.key === row.key);
                      const editHref =
                        row.kind === "package"
                          ? `/admin/cms/packages/${row.id}`
                          : `/admin/cms/itineraries/${row.id}`;

                      return (
                        <tr key={row.key} className="admin-table__row">
                          <td className="admin-table__muted">{index + 1}</td>
                          <td>
                            <span className="admin-status-pill">
                              {row.kind === "package" ? "Package" : "Itinerary"}
                            </span>
                          </td>
                          <td>
                            <div className="admin-table__primary">{row.title}</div>
                            <div className="admin-table__secondary">{row.slug}</div>
                          </td>
                          <td>{row.destination_name ?? "—"}</td>
                          <td>
                            <span className="admin-status-pill admin-status-pill--published">
                              Published · Visible
                            </span>
                          </td>
                          <td className="admin-table__col--actions">
                            <div className="admin-table__actions">
                              <button
                                type="button"
                                className="admin-table__action"
                                aria-label={`Move ${row.title} up`}
                                disabled={index === 0 || savingOrder}
                                onClick={() => handleMove(index, -1)}
                              >
                                <ArrowUp aria-hidden className="admin-table__action-icon" />
                              </button>
                              <button
                                type="button"
                                className="admin-table__action"
                                aria-label={`Move ${row.title} down`}
                                disabled={index === slides.length - 1 || savingOrder}
                                onClick={() => handleMove(index, 1)}
                              >
                                <ArrowDown aria-hidden className="admin-table__action-icon" />
                              </button>
                              <Link href={editHref} className="admin-table__action">
                                Edit
                              </Link>
                              <button
                                type="button"
                                className="admin-table__action admin-table__action--danger"
                                aria-label={`Remove ${row.title} from slider`}
                                onClick={() => void handleRemove(row)}
                              >
                                <Trash2 aria-hidden className="admin-table__action-icon" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
