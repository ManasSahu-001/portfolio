import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function DashboardIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function UsersIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3.5 20c.7-3.2 2.9-5 5.5-5s4.8 1.8 5.5 5" />
      <path d="M15.5 4.6a3.5 3.5 0 0 1 0 6.8M17 15.2c2 .6 3.3 2.2 3.8 4.8" />
    </svg>
  );
}

export function FolderIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M3 11h18" />
    </svg>
  );
}

export function WrenchIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6l-2.9 2.9-2.5-.5-.5-2.5 2.9-2.9Z" />
    </svg>
  );
}

export function MedalIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="14.5" r="5.5" />
      <path d="m9 10-3-6h12l-3 6M12 12.5v2l1.5 1" />
    </svg>
  );
}

export function BookIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5Z" />
      <path d="M20 19v2H6a2 2 0 0 1-2-2M8 7h8M8 10.5h5" />
    </svg>
  );
}

export function SettingsIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="m13.5 3-.4 2.3a7 7 0 0 0-2 .8L9 5l-2.1 2.1 1.1 2.1a7 7 0 0 0-.8 2L5 11.5v3l2.2.4c.2.7.4 1.4.8 2L6.9 19 9 21.1l2.1-1.1c.6.4 1.3.6 2 .8l.4 2.2h3l.4-2.2c.7-.2 1.4-.4 2-.8l2.1 1.1 2.1-2.1-1.1-2.1c.4-.6.6-1.3.8-2l2.2-.4v-3l-2.2-.4a7 7 0 0 0-.8-2l1.1-2.1L21.1 5 19 6.1a7 7 0 0 0-2-.8L16.5 3h-3Z" />
      <circle cx="15" cy="13" r="2.5" />
    </svg>
  );
}

export function BotIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M12 8V4m-4 9h.01M16 13h.01M9.5 16.5h5M3 12v3M21 12v3" />
    </svg>
  );
}

export function ExternalLinkIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4h6v6M20 4l-9 9M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    </svg>
  );
}

export function LogoutIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9M15 8l4 4-4 4M19 12H9" />
    </svg>
  );
}
