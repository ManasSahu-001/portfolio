import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon, GithubIcon } from "@/components/ui/icons";
import type { Project } from "@/types";

export function ProjectCard({
  project,
  delay = 0,
}: {
  project: Project;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_20px_45px_-25px_rgba(28,27,24,0.3)]"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight text-ink group-hover:text-accent-deep transition-colors">
            {project.title}
          </h3>
          {project.status && (
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider ${
                /building/i.test(project.status)
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-line bg-paper text-muted"
              }`}
            >
              {project.status}
            </span>
          )}
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {project.shortDescription}
        </p>

        {project.technologies.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-md bg-paper px-2 py-1 text-[11px] font-medium text-muted ring-1 ring-line"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-6 inline-flex items-center gap-1.5 border-t border-line pt-4 text-sm font-medium text-ink">
          Read case study
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  );
}

export default function Work({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section id="work" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Work
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Selected projects
              </h2>
            </div>
            <a
              href="https://github.com/ManasSahu-001"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink sm:inline-flex"
            >
              <GithubIcon className="h-4 w-4" /> All repositories
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} delay={(i % 2) * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
