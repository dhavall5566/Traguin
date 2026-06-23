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
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className="admin-list-toolbar">
      <div className="admin-search-field">
        <Search aria-hidden className="admin-search-field__icon" />
        <input
          type="search"
          className="admin-search-field__input"
          placeholder={`Search ${entityLabel.toLowerCase()}…`}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label={`Search ${entityLabel.toLowerCase()}`}
        />
      </div>

      <div className="admin-list-filters">
        {filters.map((filter) => {
          const options =
            filter.type === "relation"
              ? [
                  { value: "", label: `All ${filter.label.toLowerCase()}s` },
                  ...(relationOptions[filter.field] ?? []),
                ]
              : filter.type === "dynamic"
                ? buildDynamicFilterOptions(safeItems, filter.field)
                : (filter.options ?? []);

          return (
            <label key={filter.field} className="admin-list-filter">
              <Filter aria-hidden className="admin-list-filter__icon" />
              <span className="admin-list-filter__label">{filter.label}</span>
              <select
                className="admin-list-filter__select"
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

        <label className="admin-list-filter">
          <SlidersHorizontal aria-hidden className="admin-list-filter__icon" />
          <span className="admin-list-filter__label">Sort</span>
          <select
            className="admin-list-filter__select"
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
          <button type="button" className="admin-list-clear" onClick={onClear}>
            <X aria-hidden className="admin-list-clear__icon" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
