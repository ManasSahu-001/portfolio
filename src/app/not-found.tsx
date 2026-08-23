import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl italic text-accent-deep">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
        This page wandered off.
      </h1>
      <p className="mt-2 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-coal"
      >
        Back to portfolio
      </Link>
    </main>
  );
}
