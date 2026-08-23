import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Project } from "@/types";

export default function Now({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section id="now" className="scroll-mt-24 bg-coal py-20 text-coal-text sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Now
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Currently building
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-coal-text/70">
              Things under active construction — ideas turning into products,
              one commit at a time.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <Link
                href={`/projects/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-coal-line bg-coal-soft p-7 transition-colors hover:border-coal-text/40"
              >
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-coal-line px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-coal-text/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {p.status ?? "In progress"}
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-coal-text/70">
                  {p.shortDescription}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-white opacity-80 transition-opacity group-hover:opacity-100">
                  Follow along
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
