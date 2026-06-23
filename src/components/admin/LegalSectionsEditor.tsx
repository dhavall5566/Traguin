"use client";

import type { LegalSectionFormItem } from "@/lib/admin/legal-sections";

type LegalSectionsEditorProps = {
  id: string;
  value: LegalSectionFormItem[];
  onChange: (value: LegalSectionFormItem[]) => void;
};

export function LegalSectionsEditor({ id, value, onChange }: LegalSectionsEditorProps) {
  const sections = Array.isArray(value) ? value : [];

  const updateSection = (index: number, patch: Partial<LegalSectionFormItem>) => {
    const next = sections.map((section, i) => (i === index ? { ...section, ...patch } : section));
    onChange(next);
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  };

  return (
    <div id={id} className="admin-section-list">
      {sections.length === 0 && (
        <p className="text-sm text-muted">No sections yet. Add one below.</p>
      )}
      {sections.map((section, index) => (
        <div key={index} className="admin-section-card">
          <div className="admin-section-card__header">
            <span className="text-xs font-semibold tracking-wide text-muted uppercase">
              Section {index + 1}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--icon"
                disabled={index === 0}
                onClick={() => moveSection(index, -1)}
                aria-label="Move section up"
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--icon"
                disabled={index === sections.length - 1}
                onClick={() => moveSection(index, 1)}
                aria-label="Move section down"
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--secondary admin-btn--icon"
                onClick={() => onChange(sections.filter((_, i) => i !== index))}
                aria-label="Remove section"
              >
                ×
              </button>
            </div>
          </div>
          <label className="admin-field-label mt-2">Title</label>
          <input
            type="text"
            className="admin-input"
            value={section.title}
            onChange={(e) => updateSection(index, { title: e.target.value })}
          />
          <label className="admin-field-label mt-3">Paragraphs</label>
          <textarea
            className="admin-textarea"
            rows={4}
            placeholder="One paragraph per line"
            value={section.paragraphs}
            onChange={(e) => updateSection(index, { paragraphs: e.target.value })}
          />
          <label className="admin-field-label mt-3">Bullet list</label>
          <textarea
            className="admin-textarea"
            rows={4}
            placeholder="One bullet per line"
            value={section.list}
            onChange={(e) => updateSection(index, { list: e.target.value })}
          />
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn--secondary mt-2"
        onClick={() =>
          onChange([...sections, { title: "", paragraphs: "", list: "" }])
        }
      >
        + Add section
      </button>
    </div>
  );
}
