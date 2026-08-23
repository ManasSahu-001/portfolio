"use client";

import { useEffect, useState } from "react";
import {
  ErrorNote,
  Field,
  SaveButton,
  TextArea,
  TextInput,
  useEntitySave,
} from "@/components/admin/ui";
import type { Profile } from "@/types";

export default function AdminAboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { saving, saved, error, save, setError } = useEntitySave();

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((j) => setProfile(j.data))
      .catch(() => setError("Failed to load profile"));
  }, [setError]);

  if (!profile) return <p className="text-sm text-muted">Loading…</p>;

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => (p ? { ...p, [key]: value } : p));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">About</h1>
      <p className="mt-1 text-sm text-muted">
        Core identity shown across the hero, about section and AI assistant.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          await save("/api/admin/profile", profile);
        }}
      >
        <Field label="Name">
          <TextInput
            value={profile.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Hero line 1">
            <TextInput
              value={profile.heroLine1}
              onChange={(e) => set("heroLine1", e.target.value)}
            />
          </Field>
          <Field label="Hero line 2">
            <TextInput
              value={profile.heroLine2}
              onChange={(e) => set("heroLine2", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Focus line" hint="Shown under the hero headline">
          <TextInput
            value={profile.heroSub}
            onChange={(e) => set("heroSub", e.target.value)}
          />
        </Field>

        <Field label="Affiliation">
          <TextInput
            value={profile.affiliation}
            onChange={(e) => set("affiliation", e.target.value)}
          />
        </Field>

        <Field label="Status note">
          <TextInput
            value={profile.statusNote}
            onChange={(e) => set("statusNote", e.target.value)}
          />
        </Field>

        <Field
          label="Bio"
          hint="Separate paragraphs with a blank line"
        >
          <TextArea
            rows={6}
            value={profile.bio.join("\n\n")}
            onChange={(e) =>
              set(
                "bio",
                e.target.value
                  .split(/\n\s*\n/)
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="College (full)">
            <TextInput
              value={profile.college}
              onChange={(e) => set("college", e.target.value)}
            />
          </Field>
          <Field label="College (short)">
            <TextInput
              value={profile.collegeShort}
              onChange={(e) => set("collegeShort", e.target.value)}
            />
          </Field>
          <Field label="Branch">
            <TextInput
              value={profile.branch}
              onChange={(e) => set("branch", e.target.value)}
            />
          </Field>
          <Field label="Batch">
            <TextInput
              value={profile.batch}
              onChange={(e) => set("batch", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Currently exploring" hint="Comma or bullet separated focus areas">
          <TextInput
            value={profile.currentFocus}
            onChange={(e) => set("currentFocus", e.target.value)}
          />
        </Field>

        <Field
          label="Profile photo path"
          hint="Place the image at /public/images/profile.jpg or update this path"
        >
          <TextInput
            value={profile.photo}
            onChange={(e) => set("photo", e.target.value)}
          />
        </Field>

        <ErrorNote message={error} />
        <SaveButton saving={saving} saved={saved} />
      </form>
    </div>
  );
}
