import Reveal from "@/components/ui/Reveal";
import type { SkillCategory } from "@/types";

export default function Skills({
  categories,
  currentFocus,
}: {
  categories: SkillCategory[];
  currentFocus: string;
}) {
  return (
    <section id="skills" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Skills
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Tools of the trade
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 80}>
              <div className="border-t-2 border-ink pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                  {cat.name}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {currentFocus && (
            <Reveal delay={(categories.length % 3) * 80}>
              <div className="border-t-2 border-dashed border-accent pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-deep">
                  Currently exploring
                </h3>
                <p className="mt-4 font-display text-lg italic leading-relaxed text-muted">
                  {currentFocus.replaceAll(" • ", ", ")}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
