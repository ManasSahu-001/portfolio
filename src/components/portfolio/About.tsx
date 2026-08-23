import Reveal from "@/components/ui/Reveal";
import ProfilePhoto from "./ProfilePhoto";
import type { Community, Competitive, Profile } from "@/types";

export default function About({
  profile,
  communities,
  competitive,
}: {
  profile: Profile;
  communities: Community[];
  competitive: Competitive;
}) {
  const blocks = [
    { top: profile.collegeShort, bottom: profile.branch },
    ...communities.slice(0, 2).map((c) => ({
      top: c.name,
      bottom: c.institution,
    })),
    {
      top: `${competitive.problemsSolved ?? 400}+`,
      bottom: "Problems solved",
    },
  ];

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            About
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A builder&apos;s curiosity,{" "}
            <span className="font-display italic font-normal">
              grounded in engineering.
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <Reveal delay={100}>
            <div className="max-w-2xl space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              {profile.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {blocks.map((b) => (
                <div key={b.top + b.bottom} className="bg-surface px-5 py-5">
                  <dt className="order-2 mt-1 block text-xs text-muted">
                    {b.bottom}
                  </dt>
                  <dd className="text-lg font-semibold tracking-tight text-ink">
                    {b.top}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative hidden lg:block">
              <ProfilePhoto
                src={profile.photo}
                name={profile.name}
                className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-line"
              />
              <p className="mt-4 flex items-baseline justify-between text-sm">
                <span className="font-medium text-ink">{profile.name}</span>
                <span className="text-muted">{profile.batch}</span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
