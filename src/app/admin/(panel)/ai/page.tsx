"use client";

import { useCallback, useEffect, useState } from "react";
import { ErrorNote } from "@/components/admin/ui";

interface KnowledgeStatus {
  lastSync: string | null;
  docCount: number;
  publishedProjects: number;
  draftProjects: number;
  sources: Record<string, number>;
  embeddingProvider: string;
  llmProvider: string;
}

const SOURCE_LABELS: Record<string, string> = {
  profile: "About",
  project: "Projects",
  skills: "Skills",
  achievement: "Achievements",
  community: "Communities",
  competitive: "Competitive Programming / Education",
};

export default function AdminAiPage() {
  const [status, setStatus] = useState<KnowledgeStatus | null>(null);
  const [rebuilding, setRebuilding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/knowledge/rebuild")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setError("Failed to load knowledge base status"));
  }, []);

  useEffect(load, [load]);

  async function rebuild() {
    setRebuilding(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/knowledge/rebuild", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Rebuild failed");
      setMessage(json.message);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rebuild failed");
    } finally {
      setRebuilding(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        AI Knowledge
      </h1>
      <p className="mt-1 text-sm text-muted">
        The knowledge base is generated automatically from published portfolio
        content. Drafts are never indexed.
      </p>

      {error && (
        <div className="mt-4">
          <ErrorNote message={error} />
        </div>
      )}
      {message && (
        <p
          role="status"
          className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {message}
        </p>
      )}

      {!status ? (
        <p className="mt-8 text-sm text-muted">Loading…</p>
      ) : (
        <>
          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-surface p-5">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                Indexed documents
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {status.docCount}
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                Published projects
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-ink">
                {status.publishedProjects}
                <span className="ml-2 text-sm font-normal text-faint">
                  ({status.draftProjects} draft{status.draftProjects === 1 ? "" : "s"})
                </span>
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                Last sync
              </dt>
              <dd className="mt-2 text-sm font-medium leading-snug text-ink">
                {status.lastSync
                  ? new Date(status.lastSync).toLocaleString()
                  : "Never"}
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-xl border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold text-ink">Indexed sources</h2>
            {Object.keys(status.sources).length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                Nothing indexed yet — save any content or rebuild below.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {Object.entries(status.sources).map(([source, count]) => (
                  <li
                    key={source}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <span className="text-ink">
                      {SOURCE_LABELS[source] ?? source}
                    </span>
                    <span className="text-muted">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 space-y-2 rounded-xl border border-line bg-surface p-5 text-sm">
            <p>
              <span className="font-medium text-ink">Embedding provider:</span>{" "}
              <span className="text-muted">{status.embeddingProvider}</span>
            </p>
            <p>
              <span className="font-medium text-ink">Chat model:</span>{" "}
              <span className="text-muted">{status.llmProvider}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => void rebuild()}
            disabled={rebuilding}
            className="mt-8 rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-coal disabled:opacity-50"
          >
            {rebuilding ? "Rebuilding…" : "Rebuild Knowledge Base"}
          </button>
          <p className="mt-3 text-xs text-faint">
            Manual recovery only — normal edits keep this in sync automatically.
          </p>
        </>
      )}
    </div>
  );
}
