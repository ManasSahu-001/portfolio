import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import {
  ArrowRightIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
} from "@/components/ui/icons";
import type { SocialLinks } from "@/types";

export function GithubCta({ githubUrl }: { githubUrl?: string }) {
  if (!githubUrl) return null;
  return (
    <section className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-line bg-surface px-8 py-8 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_20px_45px_-25px_rgba(28,27,24,0.3)] sm:px-10"
          >
            <div className="flex items-center gap-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-coal text-paper">
                <GithubIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-ink">
                  Explore my code
                </h2>
                <p className="text-sm text-muted">
                  Experiments, coursework and works in progress live on GitHub.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
              Visit GitHub
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case "GitHub":
      return <GithubIcon className="h-4 w-4" />;
    case "LinkedIn":
      return <LinkedinIcon className="h-4 w-4" />;
    case "Instagram":
      return <InstagramIcon className="h-4 w-4" />;
    default:
      return null;
  }
}

export function Contact({ socials }: { socials: SocialLinks }) {
  const links = [
    { label: "GitHub", url: socials.github },
    { label: "LinkedIn", url: socials.linkedin },
    { label: "Instagram", url: socials.instagram },
  ].filter((l): l is { label: string; url: string } => Boolean(l.url));

  return (
    <footer id="contact" className="scroll-mt-24 bg-coal py-16 text-coal-text sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Contact
            </p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Let&apos;s build something{" "}
              <span className="font-display italic font-normal">
                interesting.
              </span>
            </h2>
            {socials.email && (
              <a
                href={`mailto:${socials.email}`}
                className="mt-6 inline-flex items-center gap-2 text-base text-coal-text underline decoration-coal-line underline-offset-4 transition-colors hover:text-white hover:decoration-coal-text"
              >
                <MailIcon className="h-4 w-4" />
                {socials.email}
              </a>
            )}
          </div>

          <ul className="flex flex-wrap items-center gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-coal-line px-4 py-2 text-sm text-coal-text transition-colors hover:border-coal-text/50 hover:text-white"
                >
                  <SocialIcon label={link.label} />
                  {link.label}
                </a>
              </li>
            ))}
            {socials.others.map((o) => (
              <li key={o.label}>
                <a
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-coal-line px-4 py-2 text-sm text-coal-text transition-colors hover:border-coal-text/50 hover:text-white"
                >
                  {o.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-coal-line pt-7 text-xs text-coal-text/50">
          <p>© {new Date().getFullYear()} Manas Sahu. All rights reserved.</p>
          <Link href="/ask" className="transition-colors hover:text-coal-text">
            Ask Manas AI
          </Link>
          <Link
            href="/admin"
            className="transition-colors hover:text-coal-text"
            aria-label="Admin dashboard"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
