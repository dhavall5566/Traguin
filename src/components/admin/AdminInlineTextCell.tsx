"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AdminInlineTextCellProps = {
  value: string;
  placeholder?: string;
  onSave: (nextValue: string) => void;
};

export function AdminInlineTextCell({
  value,
  placeholder = "Untitled",
  onSave,
}: AdminInlineTextCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [editing, value]);

  useEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(value);
      setEditing(false);
      return;
    }
    setEditing(false);
    if (trimmed !== value.trim()) onSave(trimmed);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        className="admin-inline-text-cell__input"
        value={draft}
        placeholder={placeholder}
        aria-label="Edit name"
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            cancel();
          }
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "admin-inline-text-cell",
        !value.trim() && "admin-inline-text-cell--empty",
      )}
      onClick={(event) => {
        event.stopPropagation();
        setEditing(true);
      }}
    >
      {value.trim() || placeholder}
    </button>
  );
}
