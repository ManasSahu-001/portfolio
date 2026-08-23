import Reveal from "@/components/ui/Reveal";
import StreakBanner from "./StreakBanner";
import type { Competitive, Community } from "@/types";

function StatCard({
  value,
  platform,
  note,
  href,
}: {
  value: string;
  platform: string;
  note?: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="font-display text-4xl italic text-white">{value}</span>
      <span className="mt-2 block text-sm font-medium text-coal-text">
        {platform}
      </span>
      {note && (
        <span className="mt-0.5 block text-xs text-coal-text/60">{note}</span>
      )}
    </>
  );

  const cls =
    "flex h-full min-w-0 flex-col rounded-2xl border border-coal-line bg-coal-soft px-7 py-8 text-center transition-colors" +
    (href ? " hover:border-coal-text/40" : "");

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      aria-label={`${platform} profile`}
    >
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export default function CompetitiveSection({
  competitive,
  communities,
}: {
  competitive: Competitive;
  communities: Community[];
}) {
  const hasCp =
    Boolean(competitive.codechefStars || competitive.codeforcesRank) ||
    Boolean(competitive.problemsSolved);
  if (!hasCp && communities.length === 0) return null;

  return (
    <section id="competitive" className="scroll-mt-24 pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="rounded-3xl bg-coal p-8 sm:p-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  Competitive Programming
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Sharpening problem solving
                </h2>
              </div>
            </div>

            {hasCp && (
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {competitive.codechefStars && (
                  <StatCard
                    value={competitive.codechefStars}
                    platform="CodeChef"
                    href={competitive.codechefUrl || undefined}
                  />
                )}
                {competitive.codeforcesRank && (
                  <StatCard
                    value={competitive.codeforcesRank}
                    platform="Codeforces"
                    href={competitive.codeforcesUrl || undefined}
                  />
                )}
                {Boolean(competitive.problemsSolved) && (
                  <StatCard
                    value={`${competitive.problemsSolved}+`}
                    platform="Problems solved"
                    note={competitive.problemsNote}
                  />
                )}
              </div>
            )}

            {competitive.streakImage && (
              <Reveal>
                <div className="mt-8">
                  <StreakBanner
                    image={competitive.streakImage}
                    label={competitive.streakLabel ?? "Streak"}
                  />
                </div>
              </Reveal>
            )}

            {communities.length > 0 && (
              <div className="mt-8 border-t border-coal-line pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                  Communities
                </p>
                <div className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
                  {communities.map((c) => (
                    <div key={c.id}>
                      <p className="text-base font-medium text-white">{c.name}</p>
                      <p className="text-sm text-coal-text/60">
                        {c.institution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
