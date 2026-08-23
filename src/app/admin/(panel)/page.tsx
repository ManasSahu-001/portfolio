import Link from "next/link";
import { getData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const data = await getData();
  const published = data.projects.filter((p) => p.published).length;
  const drafts = data.projects.length - published;

  const stats = [
    {
      label: "Projects",
      value: `${published} published${drafts > 0 ? ` · ${drafts} draft${drafts > 1 ? "s" : ""}` : ""}`,
      href: "/admin/projects",
    },
    {
      label: "Skill categories",
      value: `${data.skills.length}`,
      href: "/admin/skills",
    },
    {
      label: "Achievements",
      value: `${data.achievements.filter((a) => a.published).length} published`,
      href: "/admin/achievements",
    },
    {
      label: "Communities",
      value: `${data.communities.length}`,
      href: "/admin/communities",
    },
    {
      label: "AI knowledge docs",
      value: `${data.knowledgeDocs.length}`,
      href: "/admin/ai",
    },
    {
      label: "Last knowledge sync",
      value: data.syncMeta.lastSync
        ? new Date(data.syncMeta.lastSync).toLocaleString()
        : "Never — save any content or rebuild",
      href: "/admin/ai",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted">
        Manage your portfolio content. Publishing here updates the public site
        and the AI knowledge base automatically.
      </p>

      <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-strong"
          >
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              {s.label}
            </dt>
            <dd className="mt-2 text-lg font-medium text-ink">{s.value}</dd>
          </Link>
        ))}
      </dl>

      <div className="mt-10 rounded-xl border border-line bg-surface p-6">
        <h2 className="text-sm font-semibold text-ink">Quick start</h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted">
          <li>
            Add a project under{" "}
            <Link href="/admin/projects" className="text-accent-deep hover:underline">
              Projects
            </Link>{" "}
            and toggle it to Published — it appears on the site instantly.
          </li>
          <li>
            The RAG knowledge base re-syncs automatically on every save; drafts
            are never indexed.
          </li>
          <li>
            Update your photo at{" "}
            <code className="rounded bg-paper px-1 py-0.5 text-xs">
              /public/images/profile.jpg
            </code>{" "}
            (or set a different path in{" "}
            <Link href="/admin/about" className="text-accent-deep hover:underline">
              About
            </Link>
            ).
          </li>
        </ul>
      </div>
    </div>
  );
}
