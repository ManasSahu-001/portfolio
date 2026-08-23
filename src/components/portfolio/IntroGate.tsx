"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProfilePhoto from "./ProfilePhoto";
import { ChevronDownIcon } from "@/components/ui/icons";

export default function IntroGate({
  name,
  tagline,
  photo,
  children,
}: {
  name: string;
  tagline: string;
  photo: string;
  children: React.ReactNode;
}) {
  const [entered, setEntered] = useState(false);
  const [removed, setRemoved] = useState(false);
  const entering = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      entering.current = true;
      setEntered(true);
      setRemoved(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const enter = useCallback(() => {
    if (entering.current) return;
    entering.current = true;
    setEntered(true);
    document.documentElement.style.overflow = "";
    window.setTimeout(() => setRemoved(true), 1200);
  }, []);

  useEffect(() => {
    if (!entered) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY > 5) enter();
      };
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) enter();
      };
      const onKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === "ArrowDown" ||
          e.key === "PageDown" ||
          e.key === " " ||
          e.key === "Enter"
        ) {
          enter();
        }
      };
      window.addEventListener("wheel", onWheel, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [entered, enter]);

  if (removed) return <>{children}</>;

  return (
    <>
      <div
        aria-hidden={entered}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-coal transition-transform duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          entered ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`flex flex-col items-center px-6 text-center transition-all duration-700 ease-out ${
            entered ? "scale-90 opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative mb-8">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-full border border-coal-line"
            />
            <ProfilePhoto
              src={photo}
              name={name}
              className="h-28 w-28 rounded-full object-cover ring-2 ring-coal-line sm:h-32 sm:w-32"
            />
          </div>

          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-faint">
            Welcome to my portfolio
          </p>
          <h1 className="font-display text-4xl font-normal italic text-paper sm:text-6xl">
            {name}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-coal-text sm:text-base">
            {tagline}
          </p>

          <button
            type="button"
            onClick={enter}
            className="group mt-12 flex cursor-pointer flex-col items-center gap-2 text-faint transition-colors hover:text-paper"
            aria-label="Scroll down to enter"
          >
            <span className="text-xs font-medium uppercase tracking-[0.3em]">
              Scroll to enter
            </span>
            <ChevronDownIcon className="h-5 w-5 animate-bounce" />
          </button>
        </div>

        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-700 ${
            entered ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <div
        className={`transition-opacity duration-700 ${
          entered ? "opacity-100" : "pointer-events-none opacity-0 select-none"
        }`}
      >
        {children}
      </div>
    </>
  );
}
