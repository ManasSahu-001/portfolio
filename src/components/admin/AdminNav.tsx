"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookIcon,
  BotIcon,
  DashboardIcon,
  ExternalLinkIcon,
  FolderIcon,
  LogoutIcon,
  MedalIcon,
  SettingsIcon,
  UsersIcon,
  WrenchIcon,
} from "./adminIcons";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon, exact: true },
  { href: "/admin/about", label: "About", icon: UsersIcon },
  { href: "/admin/projects", label: "Projects", icon: FolderIcon },
  { href: "/admin/skills", label: "Skills", icon: WrenchIcon },
  { href: "/admin/achievements", label: "Achievements", icon: MedalIcon },
  { href: "/admin/communities", label: "Communities", icon: BookIcon },
  { href: "/admin/socials", label: "Social Links", icon: SettingsIcon },
  { href: "/admin/ai", label: "AI Knowledge", icon: BotIcon },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav aria-label="Admin navigation" className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 pb-6 pt-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-coal text-xs font-bold text-paper">
          MS
        </span>
        <span className="text-sm font-semibold tracking-tight text-ink">
          Portfolio Admin
        </span>
      </div>

      <ul className="flex gap-1 overflow-x-auto pb-1 md:flex-1 md:flex-col md:gap-0.5 md:overflow-visible">
        {ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-ink text-paper"
                    : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 hidden gap-0.5 border-t border-line pt-4 md:block">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <ExternalLinkIcon className="h-4 w-4 shrink-0" />
          View site
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <LogoutIcon className="h-4 w-4 shrink-0" />
          Log out
        </button>
      </div>
    </nav>
  );
}
