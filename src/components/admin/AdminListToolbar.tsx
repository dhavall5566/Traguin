"use client";

import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import type { AdminListFilterDef } from "@/lib/admin/types";
import { buildDynamicFilterOptions } from "@/lib/admin/list-filters";

type SortOption = {
  value: string;
  label: string;
};

type AdminListToolbarProps = {
  entityLabel: string;
  search: string;
  onSearchChange: (value: string) => void;
  filters: AdminListFilterDef[];
  filterValues: Record<string, string>;
  onFilterChange: (field: string, value: string) => void;
  relationOptions: Record<string, { value: string; label: string }[]>;
  items: Record<string, unknown>[];
  onClear: () => void;
  showClear: boolean;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
};

export function AdminListToolbar({
  entityLabel,
  search,
  onSearchChange,
  filters,
  filterValues,
  onFilterChange,
  relationOptions,
  items,
  onClear,
  showClear,
  sortBy,
  onSortChange,
  sortOptions,
}: AdminListToolbarProps) {
  return (
    <div className="admin-page-toolbar">
      <div className="admin-page-search">
        <Search aria-hidden className="admin-page-search__icon" />
        <input
          type="search"
          className="admin-page-search__input"
          placeholder={`Search ${entityLabel.toLowerCase()} by name, slug, or ID…`}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      {filters.map((filter) => {
        const options =
          filter.type === "relation"
            ? [{ value: "", label: `All ${filter.label.toLowerCase()}s` }, ...(relationOptions[filter.field] ?? [])]
            : filter.type === "dynamic"
              ? buildDynamicFilterOptions(items, filter.field)
              : filter.options;

        return (
          <label key={filter.field} className="admin-page-filter">
            <Filter aria-hidden className="admin-page-filter__icon" />
            <span className="admin-page-filter__label">{filter.label}:</span>
            <select
              className="admin-page-filter__select"
              value={filterValues[filter.field] ?? ""}
              onChange={(event) => onFilterChange(filter.field, event.target.value)}
            >
              {options.map((option) => (
                <option key={`${filter.field}-${option.value || "all"}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        );
      })}

      <label className="admin-page-filter">
        <SlidersHorizontal aria-hidden className="admin-page-filter__icon" />
        <span className="admin-page-filter__label">Sort by:</span>
        <select
          className="admin-page-filter__select"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {showClear && (
        <button type="button" className="admin-page-clear" onClick={onClear}>
          <X aria-hidden className="admin-page-clear__icon" />
          Clear
        </button>
      )}
    </div>
  );
}
