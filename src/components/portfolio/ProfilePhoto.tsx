"use client";

import { useState } from "react";

export default function ProfilePhoto({
  src,
  name,
  className = "",
}: {
  src: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`Portrait of ${name}`}
        className={`flex items-center justify-center bg-coal text-paper ${className}`}
      >
        <span className="font-display text-6xl italic">{initials}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Portrait of ${name}`}
      className={className}
      onError={() => setFailed(true)}
      loading="eager"
    />
  );
}
