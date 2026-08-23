import Reveal from "@/components/ui/Reveal";
import { ExternalLinkIcon } from "@/components/ui/icons";
import type { Achievement } from "@/types";

export default function Achievements({
  achievements,
}: {
  achievements: Achievement[];
}) {
  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="scroll-mt-24 pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Milestones
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Achievements
          </h2>
        </Reveal>

        <ol className="mt-10 divide-y divide-line border-y border-line">
          {achievements.map((a, i) => (
            <li key={a.id}>
              <Reveal delay={Math.min(i * 60, 240)}>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5">
                  {a.date && (
                    <span className="w-24 shrink-0 text-sm text-faint">
                      {a.date}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium text-ink">
                      {a.title}
                    </h3>
                    {a.description && (
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {a.description}
                      </p>
                    )}
                  </div>
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent-deep hover:underline"
                    >
                      Link <ExternalLinkIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
