"use client";

import { useEffect, useState } from "react";
import {
  ErrorNote,
  Field,
  TextInput,
  Toggle,
  useEntitySave,
} from "@/components/admin/ui";
import type { Achievement } from "@/types";

function blank(): Achievement {
  return {
    id: `ach-${Date.now().toString(36)}`,
    title: "",
    description: "",
    date: "",
    link: "",
    order: 0,
    published: false,
  };
}

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<Achievement[] | null>(null);
  const { saving, saved, error, save, setError } = useEntitySave();

  useEffect(() => {
    fetch("/api/admin/achievements")
      .then((r) => r.json())
      .then((j) => setItems(j.data))
      .catch(() => setError("Failed to load achievements"));
  }, [setError]);

  if (!items) return <p className="text-sm text-muted">Loading…</p>;

  const persist = async (next: Achievement[]) => {
    if (await save("/api/admin/achievements", next)) setItems(next);
  };

  const update = (i: number, patch: Partial<Achievement>) => {
    setItems(items.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    void persist(next);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Achievements
          </h1>
          <p className="mt-1 text-sm text-muted">
            Published achievements show on the site and feed the AI assistant.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void persist([...items, blank()])}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-coal"
        >
          + Add Achievement
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
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-line bg-surface px-5 py-8 text-center text-sm text-muted">
            No achievements yet.
          </p>
        )}
        {items.map((a, i) => (
          <div key={i} className="rounded-xl border border-line bg-surface p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
              <Field label="Title">
                <TextInput
                  value={a.title}
                  onChange={(e) => update(i, { title: e.target.value })}
                />
              </Field>
              <Field label="Date" hint='e.g. "Aug 2026"'>
                <TextInput
                  value={a.date ?? ""}
                  onChange={(e) => update(i, { date: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description">
                <TextInput
                  value={a.description ?? ""}
                  onChange={(e) => update(i, { description: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Link (optional)">
                <TextInput
                  type="url"
                  value={a.link ?? ""}
                  onChange={(e) => update(i, { link: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Toggle
                checked={a.published}
                onChange={(v) => update(i, { published: v })}
                label="Published"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded-md px-2 py-1 text-sm text-muted hover:bg-paper disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                  className="rounded-md px-2 py-1 text-sm text-muted hover:bg-paper disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void persist(items.filter((_, idx) => idx !== i))
                  }
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save achievements"}
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
