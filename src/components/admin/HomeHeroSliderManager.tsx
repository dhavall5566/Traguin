"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { useAdminToast } from "@/components/admin/AdminToast";
import { adminFetch, adminList, adminUpdate } from "@/lib/admin/api-client";
import { hasActiveFilters, rowMatchesFilter } from "@/lib/admin/list-filters";
import { parseAdminPaginatedList } from "@/lib/admin/list-response";
import type { AdminListFilterDef } from "@/lib/admin/types";
import {
  clampHeroSliderMaxItems,
  HERO_SLIDER_DEFAULT_MAX_ITEMS,
  HERO_SLIDER_MAX_ITEMS,
  HERO_SLIDER_MIN_ITEMS,
  type AdminHomepageHeroSliderSettings,
} from "@/lib/api/homepage-hero-settings";
import { cn } from "@/lib/utils";

type PackageRow = {
  id: string;
  title: string;
  slug: string;
  destination_name?: string;
  is_featured: boolean;
  featured_sort_order: number | null;
  is_published: boolean;
};

const PAGE_SIZE = 100;

const SLIDER_FILTERS: AdminListFilterDef[] = [
  { type: "dynamic", field: "destination_name", label: "Destination" },
  {
    type: "select",
    field: "is_published",
    label: "Published",
    options: [
      { value: "", label: "All" },
      { value: "true", label: "Published" },
      { value: "false", label: "Draft" },
    ],
  },
  {
    type: "select",
    field: "homepage_visible",
    label: "Homepage",
    options: [
      { value: "", label: "All" },
      { value: "true", label: "Visible" },
      { value: "false", label: "Hidden" },
    ],
  },
];

const SLIDER_SORT_OPTIONS = [{ value: "order", label: "Slider order" }];

async function fetchAllPackages(): Promise<PackageRow[]> {
  const rows: PackageRow[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await adminList<Record<string, unknown>>("/packages", PAGE_SIZE, offset);
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

async function fetchHeroSliderSettings(): Promise<AdminHomepageHeroSliderSettings> {
  const { data, error } = await adminFetch<AdminHomepageHeroSliderSettings>(
    "/homepage-hero-slider/settings",
  );
  if (error) throw new Error(error.message);
  return {
    hero_slider_max_items: clampHeroSliderMaxItems(data?.hero_slider_max_items),
    visible_package_ids: data?.visible_package_ids?.map(String) ?? [],
  };
}

async function saveHeroSliderSettings(
  payload: Partial<AdminHomepageHeroSliderSettings>,
): Promise<AdminHomepageHeroSliderSettings> {
  const { data, error } = await adminFetch<AdminHomepageHeroSliderSettings>(
    "/homepage-hero-slider/settings",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  if (error) throw new Error(error.message);
  return {
    hero_slider_max_items: clampHeroSliderMaxItems(data?.hero_slider_max_items),
    visible_package_ids: data?.visible_package_ids?.map(String) ?? [],
  };
}

async function saveHeroSliderOrder(packageIds: string[]): Promise<void> {
  const { error } = await adminFetch<AdminHomepageHeroSliderSettings>(
    "/homepage-hero-slider/order",
    {
      method: "PUT",
      body: JSON.stringify({ package_ids: packageIds }),
    },
  );
  if (error) throw new Error(error.message);
}

function sortFeaturedPackages(packages: PackageRow[]): PackageRow[] {
  return packages
    .filter((pkg) => pkg.is_featured)
    .sort(
      (a, b) =>
        (a.featured_sort_order ?? 999) - (b.featured_sort_order ?? 999) ||
        a.title.localeCompare(b.title),
    );
}

function normalizeFeaturedOrder(packages: PackageRow[]): PackageRow[] {
  return packages.map((pkg, index) => ({
    ...pkg,
    is_featured: true,
    featured_sort_order: index + 1,
  }));
}

function mergeFeaturedPackages(
  packages: PackageRow[],
  featuredOrdered: PackageRow[],
): PackageRow[] {
  const featuredById = new Map(featuredOrdered.map((pkg) => [pkg.id, pkg]));
  return packages.map((pkg) => featuredById.get(pkg.id) ?? pkg);
}

export function HomeHeroSliderManager() {
  const { showToast } = useAdminToast();
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [maxItems, setMaxItems] = useState(HERO_SLIDER_DEFAULT_MAX_ITEMS);
  const [savedMaxItems, setSavedMaxItems] = useState(HERO_SLIDER_DEFAULT_MAX_ITEMS);
  const [visiblePackageIds, setVisiblePackageIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState("order");
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const syncGeneration = useRef(0);
  const orderGeneration = useRef(0);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [allPackages, settings] = await Promise.all([
        fetchAllPackages(),
        fetchHeroSliderSettings(),
      ]);

      setPackages(allPackages);
      setMaxItems(settings.hero_slider_max_items);
      setSavedMaxItems(settings.hero_slider_max_items);
      setVisiblePackageIds(settings.visible_package_ids);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load homepage hero slider settings.");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const featuredPackages = useMemo(() => sortFeaturedPackages(packages), [packages]);
  const visibleIdSet = useMemo(() => new Set(visiblePackageIds), [visiblePackageIds]);
  const visibleCount = visiblePackageIds.length;

  const toolbarItems = useMemo(
    () =>
      featuredPackages.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        slug: pkg.slug,
        destination_name: pkg.destination_name ?? "",
        is_published: pkg.is_published ? "true" : "false",
        homepage_visible: visibleIdSet.has(pkg.id) ? "true" : "false",
      })),
    [featuredPackages, visibleIdSet],
  );

  const filteredFeaturedPackages = useMemo(() => {
    const filtered = featuredPackages.filter((pkg) => {
      const row = {
        destination_name: pkg.destination_name ?? "",
        is_published: pkg.is_published ? "true" : "false",
        homepage_visible: visibleIdSet.has(pkg.id) ? "true" : "false",
      };

      for (const filter of SLIDER_FILTERS) {
        if (!rowMatchesFilter(row, filter, filterValues[filter.field] ?? "")) {
          return false;
        }
      }

      if (!search.trim()) return true;

      const query = search.trim().toLowerCase();
      return [pkg.title, pkg.slug, pkg.destination_name ?? ""].some((part) =>
        part.toLowerCase().includes(query),
      );
    });

    return filtered;
  }, [featuredPackages, filterValues, search, visibleIdSet]);

  const filtersActive = hasActiveFilters(search, filterValues);
  const clampedMaxItems = clampHeroSliderMaxItems(maxItems);
  const maxItemsDirty = clampedMaxItems !== savedMaxItems;

  const queueSettingsSave = useCallback(
    (nextVisibleIds: string[], previousVisibleIds: string[]) => {
      const generation = ++syncGeneration.current;

      void saveHeroSliderSettings({
        hero_slider_max_items: savedMaxItems,
        visible_package_ids: nextVisibleIds,
      })
        .then((saved) => {
          if (generation !== syncGeneration.current) return;
          setVisiblePackageIds(saved.visible_package_ids);
          showToast("Homepage visibility updated.");
        })
        .catch((err) => {
          if (generation !== syncGeneration.current) return;
          setVisiblePackageIds(previousVisibleIds);
          setError(err instanceof Error ? err.message : "Failed to update package visibility.");
        });
    },
    [savedMaxItems, showToast],
  );

  const handleSaveSettings = async () => {
    if (!maxItemsDirty) return;

    setSavingSettings(true);
    setError(null);

    const previousVisible = visiblePackageIds;

    try {
      const clampedMax = clampHeroSliderMaxItems(maxItems);
      const trimmedVisible = visiblePackageIds.slice(0, clampedMax);
      setMaxItems(clampedMax);
      setSavedMaxItems(clampedMax);
      setVisiblePackageIds(trimmedVisible);

      const saved = await saveHeroSliderSettings({
        hero_slider_max_items: clampedMax,
        visible_package_ids: trimmedVisible,
      });

      setMaxItems(saved.hero_slider_max_items);
      setSavedMaxItems(saved.hero_slider_max_items);
      setVisiblePackageIds(saved.visible_package_ids);

      if (trimmedVisible.length !== previousVisible.length) {
        showToast(
          `Slider settings saved. ${previousVisible.length - trimmedVisible.length} package(s) were hidden because they exceeded the new maximum.`,
        );
      } else {
        showToast("Slider settings saved.");
      }
    } catch (err) {
      setVisiblePackageIds(previousVisible);
      setError(err instanceof Error ? err.message : "Failed to save slider settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleVisibility = (packageId: string, makeVisible: boolean) => {
    setError(null);

    if (makeVisible) {
      if (visibleCount >= savedMaxItems) {
        setError(
          `You can only show up to ${savedMaxItems} packages on the homepage. Hide another package first.`,
        );
        return;
      }
      if (visibleIdSet.has(packageId)) return;

      const nextVisible = [...visiblePackageIds, packageId];
      setVisiblePackageIds(nextVisible);
      queueSettingsSave(nextVisible, visiblePackageIds);
      return;
    }

    if (!visibleIdSet.has(packageId)) return;

    const nextVisible = visiblePackageIds.filter((id) => id !== packageId);
    setVisiblePackageIds(nextVisible);
    queueSettingsSave(nextVisible, visiblePackageIds);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= featuredPackages.length) return;

    setError(null);
    setSortBy("order");

    const nextFeatured = [...featuredPackages];
    [nextFeatured[index], nextFeatured[targetIndex]] = [nextFeatured[targetIndex], nextFeatured[index]];
    const normalized = normalizeFeaturedOrder(nextFeatured);
    const previousPackages = packages;
    const orderedIds = normalized.map((pkg) => pkg.id);
    const generation = ++orderGeneration.current;

    setPackages((current) => mergeFeaturedPackages(current, normalized));

    void (async () => {
      setSavingOrder(true);
      try {
        await saveHeroSliderOrder(orderedIds);
        if (generation !== orderGeneration.current) return;
        showToast("Slider order saved.");
      } catch (err) {
        if (generation !== orderGeneration.current) return;
        setPackages(previousPackages);
        setError(err instanceof Error ? err.message : "Failed to update slider order.");
      } finally {
        if (generation === orderGeneration.current) {
          setSavingOrder(false);
        }
      }
    })();
  };

  const handleRemove = async (packageId: string) => {
    setError(null);

    const previousPackages = packages;
    const previousVisible = visiblePackageIds;
    const nextVisible = visiblePackageIds.filter((id) => id !== packageId);

    setPackages((current) =>
      current.map((pkg) =>
        pkg.id === packageId
          ? { ...pkg, is_featured: false, featured_sort_order: null }
          : pkg,
      ),
    );
    setVisiblePackageIds(nextVisible);

    try {
      const { error: removeError } = await adminUpdate("/packages", packageId, {
        is_featured: false,
        featured_sort_order: null,
      });
      if (removeError) throw new Error(removeError.message);

      await saveHeroSliderSettings({
        hero_slider_max_items: savedMaxItems,
        visible_package_ids: nextVisible,
      });
      showToast("Package removed from homepage hero slider.");
    } catch (err) {
      setPackages(previousPackages);
      setVisiblePackageIds(previousVisible);
      setError(err instanceof Error ? err.message : "Failed to remove package from slider.");
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
                Choose slider packages, set their order, and control homepage visibility.
              </p>
            </div>
            <div className="admin-page-stats">
              <span className="admin-stat-chip admin-stat-chip--accent">
                <span className="admin-stat-chip__value">{visibleCount}</span>
                <span className="admin-stat-chip__label">visible</span>
              </span>
              <span className="admin-stat-chip">
                <span className="admin-stat-chip__value">{featuredPackages.length}</span>
                <span className="admin-stat-chip__label">in slider</span>
              </span>
              <span className="admin-stat-chip">
                <span className="admin-stat-chip__value">{savedMaxItems}</span>
                <span className="admin-stat-chip__label">max visible</span>
              </span>
            </div>
          </div>

          {(error) && (
            <div className="admin-settings-panel__alerts">
              {error && <div className="admin-alert admin-alert--error">{error}</div>}
            </div>
          )}

          <div className="admin-settings-panel__body">
            <h2 className="admin-settings-panel__section-title">Slider settings</h2>
            <p className="admin-page-muted">
              Set how many packages can be visible at once. Use the toggles below to choose which
              featured packages appear on the homepage. To add packages, enable{" "}
              <strong>Homepage hero slider</strong> on a package under{" "}
              <Link href="/admin/cms/packages" className="admin-inline-link">
                Packages
              </Link>
              .
            </p>
            <div className="admin-hero-slider-settings">
              <div className="admin-form-field">
                <label htmlFor="hero-slider-max-items" className="admin-field-label">
                  Maximum visible packages
                </label>
                <input
                  id="hero-slider-max-items"
                  className="admin-input admin-hero-slider-settings__input"
                  type="number"
                  min={HERO_SLIDER_MIN_ITEMS}
                  max={HERO_SLIDER_MAX_ITEMS}
                  value={maxItems}
                  disabled={initialLoading || savingSettings}
                  onChange={(event) => setMaxItems(Number(event.target.value))}
                />
              </div>
              <button
                type="button"
                className="admin-btn admin-btn--primary admin-btn--page"
                disabled={initialLoading || savingSettings || !maxItemsDirty}
                onClick={() => void handleSaveSettings()}
              >
                Save max items
              </button>
            </div>
          </div>
        </div>

        <div className="admin-list-panel">
          <header className="admin-list-panel__head admin-list-panel__head--compact">
            <div className="admin-list-panel__intro">
              <h2 className="admin-list-panel__title admin-list-panel__title--sm">Slider packages</h2>
              <p className="admin-list-panel__subtitle">
                Reorder packages and toggle which ones appear on the homepage hero.
              </p>
            </div>
          </header>

          {!initialLoading && featuredPackages.length > 0 && (
            <div className="admin-list-panel__toolbar">
              <AdminListToolbar
                entityLabel="Slider packages"
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
          )}

          <div className="admin-list-panel__body">
            {initialLoading ? (
              <div className="admin-list-panel__state">Loading slider packages…</div>
            ) : featuredPackages.length === 0 ? (
              <div className="admin-list-panel__state admin-list-panel__state--empty">
                <p className="admin-page-empty__title">No packages in the homepage hero slider yet</p>
                <p className="admin-page-empty__text">
                  Open a package under{" "}
                  <Link href="/admin/cms/packages" className="admin-inline-link">
                    Packages
                  </Link>{" "}
                  and enable <strong>Homepage hero slider</strong> to include it here.
                </p>
              </div>
            ) : filteredFeaturedPackages.length === 0 ? (
              <div className="admin-list-panel__state admin-list-panel__state--empty">
                <p className="admin-page-empty__title">No slider packages match your filters</p>
                <p className="admin-page-empty__text">Try adjusting search or filter options.</p>
              </div>
            ) : (
              <div className="admin-table-scroll admin-list-panel__table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Package</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>On homepage</th>
                    <th className="admin-table__col--actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeaturedPackages.map((pkg) => {
                    const index = featuredPackages.findIndex((item) => item.id === pkg.id);
                    const isVisible = visibleIdSet.has(pkg.id);
                    const canEnable = isVisible || visibleCount < savedMaxItems;

                    return (
                      <tr key={pkg.id} className="admin-table__row">
                        <td className="admin-table__muted">{index + 1}</td>
                        <td>
                          <div className="admin-table__primary">{pkg.title}</div>
                          <div className="admin-table__secondary">{pkg.slug}</div>
                        </td>
                        <td>{pkg.destination_name ?? "—"}</td>
                        <td>
                          <span
                            className={cn(
                              "admin-status-pill",
                              pkg.is_published
                                ? "admin-status-pill--published"
                                : "admin-status-pill--draft",
                            )}
                          >
                            {pkg.is_published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td>
                          <label className="admin-visibility-toggle">
                            <input
                              type="checkbox"
                              className="admin-visibility-toggle__input"
                              checked={isVisible}
                              disabled={!isVisible && !canEnable}
                              aria-label={`${isVisible ? "Hide" : "Show"} ${pkg.title} on homepage`}
                              onChange={(event) =>
                                handleToggleVisibility(pkg.id, event.target.checked)
                              }
                            />
                            <span
                              className={cn(
                                "admin-visibility-toggle__track",
                                isVisible && "admin-visibility-toggle__track--on",
                                !canEnable && !isVisible && "admin-visibility-toggle__track--disabled",
                              )}
                            >
                              <span className="admin-visibility-toggle__thumb" />
                            </span>
                            <span className="admin-visibility-toggle__label">
                              {isVisible ? "Visible" : "Hidden"}
                            </span>
                          </label>
                        </td>
                        <td className="admin-table__col--actions">
                          <div className="admin-table__actions">
                            <button
                              type="button"
                              className="admin-table__action"
                              aria-label={`Move ${pkg.title} up`}
                              disabled={index === 0 || savingOrder}
                              onClick={() => handleMove(index, -1)}
                            >
                              <ArrowUp aria-hidden className="admin-table__action-icon" />
                            </button>
                            <button
                              type="button"
                              className="admin-table__action"
                              aria-label={`Move ${pkg.title} down`}
                              disabled={index === featuredPackages.length - 1 || savingOrder}
                              onClick={() => handleMove(index, 1)}
                            >
                              <ArrowDown aria-hidden className="admin-table__action-icon" />
                            </button>
                            <Link href={`/admin/cms/packages/${pkg.id}`} className="admin-table__action">
                              Edit
                            </Link>
                            <button
                              type="button"
                              className="admin-table__action admin-table__action--danger"
                              aria-label={`Remove ${pkg.title} from slider`}
                              onClick={() => void handleRemove(pkg.id)}
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
