"use client";

import { useEffect, useState } from "react";
import {
  ErrorNote,
  Field,
  TextInput,
  useEntitySave,
} from "@/components/admin/ui";
import type { SkillCategory } from "@/types";

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[] | null>(null);
  const { saving, saved, error, save, setError } = useEntitySave();

  useEffect(() => {
    fetch("/api/admin/skills")
      .then((r) => r.json())
      .then((j) => setCategories(j.data))
      .catch(() => setError("Failed to load skills"));
  }, [setError]);

  if (!categories) return <p className="text-sm text-muted">Loading…</p>;

  async function persist(next: SkillCategory[]) {
    if (await save("/api/admin/skills", next)) setCategories(next);
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Skills
          </h1>
          <p className="mt-1 text-sm text-muted">
            Grouped technology lists. No percentages — just what you work with.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            void persist([
              ...categories,
              { id: `cat-${Date.now().toString(36)}`, name: "New category", skills: [] },
            ])
          }
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-coal"
        >
          + Add Category
        </button>
      </div>

      <ErrorNote message={error} />

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await persist(categories);
        }}
        className="mt-8 space-y-4"
      >
        {categories.map((cat, i) => (
          <div
            key={i}
            className="rounded-xl border border-line bg-surface p-5"
          >
            <div className="flex items-end gap-3">
              <div className="min-w-0 flex-1">
                <Field label={`Category ${i + 1}`}>
                  <TextInput
                    value={cat.name}
                    onChange={(e) =>
                      setCategories(
                        categories.map((c, idx) =>
                          idx === i ? { ...c, name: e.target.value } : c
                        )
                      )
                    }
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={() =>
                  void persist(categories.filter((_, idx) => idx !== i))
                }
                className="mb-0.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            <div className="mt-4">
              <Field label="Skills" hint="Comma separated">
                <TextInput
                  value={cat.skills.join(", ")}
                  onChange={(e) =>
                    setCategories(
                      categories.map((c, idx) =>
                        idx === i
                          ? {
                              ...c,
                              skills: e.target.value.split(",").map((s) => s.trim()),
                            }
                          : c
                      )
                    )
                  }
                />
              </Field>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save skills"}
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
