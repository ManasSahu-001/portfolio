"use client";

import { useEffect, useState } from "react";
import {
  ErrorNote,
  Field,
  TextInput,
  useEntitySave,
} from "@/components/admin/ui";
import type { SocialLinks } from "@/types";

export default function AdminSocialsPage() {
  const [socials, setSocials] = useState<SocialLinks | null>(null);
  const { saving, saved, error, save, setError } = useEntitySave();

  useEffect(() => {
    fetch("/api/admin/socials")
      .then((r) => r.json())
      .then((j) => setSocials(j.data))
      .catch(() => setError("Failed to load social links"));
  }, [setError]);

  if (!socials) return <p className="text-sm text-muted">Loading…</p>;

  const update = (patch: Partial<SocialLinks>) => {
    setSocials((s) =>
      s ? { ...s, ...patch, others: patch.others ?? s.others } : s
    );
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Social Links
      </h1>
      <p className="mt-1 text-sm text-muted">
        Used across the navbar, contact footer and hero.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          await save("/api/admin/socials", socials);
        }}
      >
        <Field label="GitHub">
          <TextInput
            type="url"
            value={socials.github ?? ""}
            onChange={(e) => update({ github: e.target.value })}
          />
        </Field>
        <Field label="LinkedIn">
          <TextInput
            type="url"
            value={socials.linkedin ?? ""}
            onChange={(e) => update({ linkedin: e.target.value })}
          />
        </Field>
        <Field label="Instagram">
          <TextInput
            type="url"
            value={socials.instagram ?? ""}
            onChange={(e) => update({ instagram: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={socials.email ?? ""}
            onChange={(e) => update({ email: e.target.value })}
          />
        </Field>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Other links
          </p>
          {socials.others.map((o, i) => (
            <div key={i} className="mb-3 flex gap-3">
              <TextInput
                placeholder="Label"
                value={o.label}
                onChange={(e) =>
                  update({
                    others: socials.others.map((x, idx) =>
                      idx === i ? { ...x, label: e.target.value } : x
                    ),
                  })
                }
                className="w-40"
              />
              <TextInput
                placeholder="https://…"
                type="url"
                value={o.url}
                onChange={(e) =>
                  update({
                    others: socials.others.map((x, idx) =>
                      idx === i ? { ...x, url: e.target.value } : x
                    ),
                  })
                }
              />
              <button
                type="button"
                onClick={() =>
                  update({ others: socials.others.filter((_, idx) => idx !== i) })
                }
                aria-label={`Remove link ${o.label || i + 1}`}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              update({ others: [...socials.others, { label: "", url: "" }] })
            }
            className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink hover:border-ink"
          >
            + Add link
          </button>
        </div>

        <ErrorNote message={error} />

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save social links"}
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
