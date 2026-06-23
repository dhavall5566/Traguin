"use client";

import type { StatListItem } from "@/lib/admin/stat-list";

type StatListEditorProps = {
  id: string;
  value: StatListItem[];
  onChange: (value: StatListItem[]) => void;
};

export function StatListEditor({ id, value, onChange }: StatListEditorProps) {
  const items = Array.isArray(value) ? value : [];

  const updateItem = (index: number, patch: Partial<StatListItem>) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange(next);
  };

  return (
    <div id={id} className="admin-stat-list">
      {items.length === 0 && (
        <p className="text-sm text-muted">No stats yet. Add one below.</p>
      )}
      {items.map((item, index) => (
        <div key={index} className="admin-stat-list__row">
          <input
            type="text"
            className="admin-input"
            placeholder="Label"
            value={item.label}
            onChange={(e) => updateItem(index, { label: e.target.value })}
          />
          <input
            type="text"
            className="admin-input"
            placeholder="Value"
            value={item.value}
            onChange={(e) => updateItem(index, { value: e.target.value })}
          />
          <button
            type="button"
            className="admin-btn admin-btn--secondary admin-btn--icon"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            aria-label="Remove stat"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn--secondary mt-2"
        onClick={() => onChange([...items, { label: "", value: "" }])}
      >
        + Add stat
      </button>
    </div>
  );
}
