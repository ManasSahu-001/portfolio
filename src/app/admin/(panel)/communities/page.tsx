"use client";

import { useEffect, useState } from "react";
import {
  ErrorNote,
  Field,
  TextInput,
  useEntitySave,
} from "@/components/admin/ui";
import type { Community } from "@/types";

export default function AdminCommunitiesPage() {
  const [items, setItems] = useState<Community[] | null>(null);
  const { saving, saved, error, save, setError } = useEntitySave();

  useEffect(() => {
    fetch("/api/admin/communities")
      .then((r) => r.json())
      .then((j) => setItems(j.data))
      .catch(() => setError("Failed to load communities"));
  }, [setError]);

  if (!items) return <p className="text-sm text-muted">Loading…</p>;

  const persist = async (next: Community[]) => {
    if (await save("/api/admin/communities", next)) setItems(next);
  };

  const update = (i: number, patch: Partial<Community>) => {
    setItems(items.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  };

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Communities
          </h1>
          <p className="mt-1 text-sm text-muted">
            Clubs and communities you are part of.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            void persist([
              ...items,
              {
                id: `com-${Date.now().toString(36)}`,
                name: "",
                institution: "NIT Rourkela",
                order: items.length,
              },
            ])
          }
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-coal"
        >
          + Add Community
        </button>
      </div>

      <ErrorNote message={error} />

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await persist(items);
        }}
        className="mt-8 space-y-4"
      >
        {items.map((c, i) => (
          <div key={i} className="rounded-xl border border-line bg-surface p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr]">
              <Field label="Name">
                <TextInput
                  value={c.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                />
              </Field>
              <Field label="Institution">
                <TextInput
                  value={c.institution}
                  onChange={(e) => update(i, { institution: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Short description (optional)">
                <TextInput
                  value={c.description ?? ""}
                  onChange={(e) => update(i, { description: e.target.value })}
                />
              </Field>
            </div>
            <button
              type="button"
              onClick={() => void persist(items.filter((_, idx) => idx !== i))}
              className="mt-3 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save communities"}
        </button>
        {saved && !saving && (
          <span role="status" className="ml-2 text-sm font-medium text-emerald-700">
            Saved ✓
          </span>
        )}
      </form>
    </div>
  );
}
