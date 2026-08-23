import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/portfolio/Navbar";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon, ExternalLinkIcon, GithubIcon } from "@/components/ui/icons";
import { getData, publishedProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getData();
  const project = publishedProjects(data).find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — Manas Sahu`,
      description: project.shortDescription,
      type: "article",
    },
  };
}

const CASE_SECTIONS = [
  { key: "fullDescription", label: "Overview" },
  { key: "problem", label: "Problem" },
  { key: "approach", label: "Approach" },
  { key: "architecture", label: "Architecture" },
  { key: "implementation", label: "Implementation" },
  { key: "challenges", label: "Challenges" },
  { key: "learnings", label: "What I Learned" },
] as const;

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const data = await getData();
  const projects = publishedProjects(data);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const sections = CASE_SECTIONS.filter(
    (s) => project[s.key] && (project[s.key] as string).trim().length > 0
  );

  const paragraphs = (text?: string) =>
    text
      ?.split(/\n\s*\n|\r\n\r\n/)
      .map((t) => t.trim())
      .filter(Boolean) ?? [];

  return (
    <>
      <Navbar name={data.profile.name} githubUrl={data.socials.github} />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8">
        <Reveal>
          <Link
            href="/#work"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
            All work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.status && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-emerald-700">
                {project.status}
              </span>
            )}
            {project.category && (
              <span className="rounded-full border border-line px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted">
                {project.category}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {project.shortDescription}
          </p>

          {project.technologies.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
              {project.technologies.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}

          {(project.githubUrl || project.liveUrl) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-coal"
                >
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
                >
                  Live demo <ExternalLinkIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </Reveal>

        <div className="mt-14 space-y-12 border-t border-line pt-12">
          {sections.map((section, i) => (
            <Reveal key={section.key} delay={Math.min(i * 60, 180)}>
              <section aria-labelledby={`sec-${section.key}`}>
                <h2
                  id={`sec-${section.key}`}
                  className="text-xs font-semibold uppercase tracking-[0.22em] text-accent"
                >
                  {section.label}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
                  {paragraphs(project[section.key]).map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}

          {sections.length === 0 && (
            <Reveal>
              <p className="font-display text-lg italic text-faint">
                A detailed case study for this project is in the works.
              </p>
            </Reveal>
          )}
        </div>
      </main>
    </>
  );
}
