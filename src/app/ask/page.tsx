import type { Metadata } from "next";
import Link from "next/link";
import ChatPanel from "@/components/chat/ChatPanel";
import Navbar from "@/components/portfolio/Navbar";
import { getData } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ask Manas AI",
  description:
    "Chat with an AI assistant grounded entirely in Manas Sahu's portfolio — his projects, skills and what he's currently building.",
};

export default async function AskPage() {
  const data = await getData();

  return (
    <>
      <Navbar name={data.profile.name} githubUrl={data.socials.github} />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8">
        <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Don&apos;t just read about me.
          <br />
          <span className="font-display italic font-normal text-accent-deep">
            Talk to my portfolio.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
          This assistant answers only from the content of this portfolio. If
          something isn&apos;t in here, it will say so.
        </p>

        <div className="mt-10">
          <ChatPanel />
        </div>

        <p className="mt-6 text-center text-sm text-faint">
          Prefer the human version?{" "}
          <a
            href={`mailto:${data.socials.email}`}
            className="text-accent-deep hover:underline"
          >
            Email Manas
          </a>{" "}
          or{" "}
          <Link href="/#contact" className="text-accent-deep hover:underline">
            reach out
          </Link>
          .
        </p>
      </main>
    </>
  );
}
