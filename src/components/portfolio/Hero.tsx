import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ProfilePhoto from "./ProfilePhoto";
import { ArrowRightIcon, SparkleIcon } from "@/components/ui/icons";
import type { Profile } from "@/types";

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-16 sm:px-8 md:pt-24 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {profile.statusNote}
          </p>

          <h1 className="text-5xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {profile.heroLine1}
            <br />
            <span className="font-display italic font-normal text-accent-deep">
              {profile.heroLine2}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.heroSub}
          </p>
          <p className="mt-2 text-sm font-medium text-faint">
            {profile.affiliation}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/#work"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-coal"
            >
              View My Work
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/ask"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              <SparkleIcon className="h-4 w-4 text-accent" />
              Ask Manas AI
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150} className="mx-auto w-full max-w-xs lg:max-w-sm">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-3xl border border-line"
            />
            <ProfilePhoto
              src={profile.photo}
              name={profile.name}
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[0_24px_60px_-24px_rgba(28,27,24,0.35)] ring-1 ring-line"
            />
            <div className="absolute -bottom-4 -left-4 rounded-xl border border-line bg-surface px-4 py-2.5 shadow-sm">
              <p className="text-xs font-semibold text-ink">{profile.batch}</p>
              <p className="text-[11px] text-muted">{profile.collegeShort}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
