"use client";

import { useState } from "react";

export default function StreakBanner({
  image,
  label,
}: {
  image: string;
  label: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className="overflow-hidden rounded-2xl border border-coal-line bg-coal-soft">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={label}
        loading="lazy"
        onError={() => setFailed(true)}
        className="max-h-96 w-full object-cover object-top"
      />
      <figcaption className="flex items-center gap-2 border-t border-coal-line px-5 py-3.5 text-sm text-coal-text">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
        {label}
      </figcaption>
    </figure>
  );
}
