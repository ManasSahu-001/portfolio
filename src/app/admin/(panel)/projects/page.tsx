"use client";

import { useEffect, useState } from "react";
import {
  ErrorNote,
  Field,
  TextArea,
  TextInput,
  Toggle,
  useEntitySave,
} from "@/components/admin/ui";
import type { Project } from "@/types";

const EMPTY: Project = {
  id: "",
  title: "",
  slug: "",
  shortDescription: "",
  status: "",
  technologies: [],
  category: "",
  featured: false,
  githubUrl: "",
  liveUrl: "",
  coverImage: "",
  fullDescription: "",
  problem: "",
  approach: "",
  architecture: "",
  implementation: "",
  challenges: "",
  learnings: "",
  order: 0,
  published: false,
  createdAt: "",
  updatedAt: "",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const { saving, saved, error, save, setError } = useEntitySave();

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((j) => setProjects(j.data))
      .catch(() => setError("Failed to load projects"));
  }, [setError]);

  if (!projects) return <p className="text-sm text-muted">Loading…</p>;

  const persist = async (next: Project[]) => {
    const ok = await save("/api/admin/projects", next);
    if (ok) setProjects(next);
    return ok;
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= projects.length) return;
    const next = [...projects];
    [next[i], next[j]] = [next[j], next[i]];
    void persist(next);
  };

  const remove = async (i: number) => {
    if (!confirm(`Delete "${projects[i].title}"? This cannot be undone.`)) return;
    await persist(projects.filter((_, idx) => idx !== i));
  };

  const toggleField = async (i: number, key: "published" | "featured") => {
    await persist(
      projects.map((p, idx) =>
        idx === i ? { ...p, [key]: !p[key], updatedAt: new Date().toISOString() } : p
      )
    );
  };

  const startEdit = (i: number) => {
    setError(null);
    setEditing(i);
  };

  const startNew = () => {
    setError(null);
    setEditing("new");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Projects
          </h1>
          <p className="mt-1 text-sm text-muted">
            Publishing a project updates the site and the AI knowledge base.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-coal"
        >
          + Add Project
        </button>
      </div>

      <ErrorNote message={error} />

      {editing === null ? (
        <ul className="mt-8 divide-y divide-line rounded-xl border border-line bg-surface">
          {projects.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-muted">
              No projects yet. Add your first one.
            </li>
          )}
          {projects.map((p, i) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4"
            >
              <span className="text-xs text-faint">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {p.title || "Untitled"}
                  {p.featured && (
                    <span className="ml-2 text-[11px] uppercase tracking-wide text-accent">
                      Featured
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-muted">
                  /projects/{p.slug}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  p.published
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-paper text-muted ring-1 ring-line"
                }`}
              >
                {p.published ? "Published" : "Draft"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${p.title} up`}
                  className="rounded-md px-2 py-1 text-sm text-muted hover:bg-paper disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === projects.length - 1}
                  aria-label={`Move ${p.title} down`}
                  className="rounded-md px-2 py-1 text-sm text-muted hover:bg-paper disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => toggleField(i, "featured")}
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-paper hover:text-ink"
                >
                  {p.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleField(i, "published")}
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-paper hover:text-ink"
                >
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(i)}
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-paper"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ProjectEditor
          initial={
            editing === "new"
              ? { ...EMPTY }
              : projects[editing]
          }
          saving={saving}
          saved={saved}
          onCancel={() => setEditing(null)}
          onSubmit={async (project) => {
            const next =
              editing === "new"
                ? [...projects, project]
                : projects.map((p, i) => (i === editing ? project : p));
            if (await persist(next)) setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProjectEditor({
  initial,
  saving,
  saved,
  onSubmit,
  onCancel,
}: {
  initial: Project;
  saving: boolean;
  saved: boolean;
  onSubmit: (p: Project) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Project>(initial);

  function set<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <form
      className="mt-8 max-w-2xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit(form);
      }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Title">
          <TextInput
            value={form.title}
            required
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>
        <Field label="Slug" hint="Auto-generated from title if left blank">
          <TextInput
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="ai-timetable-maker"
          />
        </Field>
      </div>

      <Field label="Short description">
        <TextArea
          rows={2}
          value={form.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Status" hint='e.g. "Currently Building"'>
          <TextInput
            value={form.status ?? ""}
            onChange={(e) => set("status", e.target.value)}
          />
        </Field>
        <Field label="Category">
          <TextInput
            value={form.category ?? ""}
            onChange={(e) => set("category", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Technologies" hint="Comma separated">
        <TextInput
          value={form.technologies.join(", ")}
          onChange={(e) =>
            set(
              "technologies",
              e.target.value.split(",").map((t) => t.trim())
            )
          }
        />
      </Field>

      <div className="flex flex-wrap gap-6">
        <Toggle
          checked={form.published}
          onChange={(v) => set("published", v)}
          label="Published"
        />
        <Toggle
          checked={form.featured}
          onChange={(v) => set("featured", v)}
          label="Featured"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="GitHub URL">
          <TextInput
            type="url"
            value={form.githubUrl ?? ""}
            onChange={(e) => set("githubUrl", e.target.value)}
          />
        </Field>
        <Field label="Live URL">
          <TextInput
            type="url"
            value={form.liveUrl ?? ""}
            onChange={(e) => set("liveUrl", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Cover image path" hint="e.g. /images/projects/orbital.jpg">
        <TextInput
          value={form.coverImage ?? ""}
          onChange={(e) => set("coverImage", e.target.value)}
        />
      </Field>

      {(
        [
          ["fullDescription", "Overview"],
          ["problem", "Problem"],
          ["approach", "Approach"],
          ["architecture", "Architecture"],
          ["implementation", "Implementation"],
          ["challenges", "Challenges"],
          ["learnings", "What I Learned"],
        ] as const
      ).map(([key, label]) => (
        <Field key={key} label={`${label} (case study)`} hint="Optional — leave blank to hide this section">
          <TextArea
            rows={3}
            value={form[key] ?? ""}
            onChange={(e) => set(key, e.target.value)}
          />
        </Field>
      ))}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Cancel
        </button>
        {saved && !saving && (
          <span role="status" className="text-sm font-medium text-emerald-700">
            Saved ✓
          </span>
        )}
      </div>
    </form>
  );
}
