"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Preloader from "./Preloader";

type LandingExperienceProps = {
  ready: boolean;
  children: ReactNode;
};

type LoadingPhase = "loading" | "revealing" | "complete";

export default function LandingExperience({ ready, children }: LandingExperienceProps) {
  const [phase, setPhase] = useState<LoadingPhase>(ready ? "revealing" : "loading");
  const contentRef = useRef<HTMLDivElement>(null);
  const loading = phase !== "complete";

  useEffect(() => {
    if (phase !== "loading") return;

    const timeout = setTimeout(() => setPhase("revealing"), 8000);
    return () => clearTimeout(timeout);
  }, [phase]);

  // This page owns interaction while the loading overlay covers its content.
  useEffect(() => {
    const content = contentRef.current;
    if (!loading || !content) return;

    const root = document.documentElement;
    const wasLocked = root.classList.contains("page-loading");
    const wasInert = content.inert;
    const focused = document.activeElement;
    const restoreFocus = focused instanceof HTMLElement && content.contains(focused) && !wasInert;

    root.classList.add("page-loading");
    if (restoreFocus) focused.blur();
    content.inert = true;

    return () => {
      if (!wasLocked) root.classList.remove("page-loading");
      content.inert = wasInert;
      if (restoreFocus && focused.isConnected && document.activeElement === document.body) {
        focused.focus({ preventScroll: true });
      }
    };
  }, [loading]);

  // Readiness is one-way: a later prop change must not restart the loader.
  if (ready && phase === "loading") {
    setPhase("revealing");
  }

  return (
    <>
      {loading && <Preloader ready={phase === "revealing"} onComplete={() => setPhase("complete")} />}
      <div ref={contentRef} data-page-content data-loading-phase={phase}>
        {children}
      </div>
    </>
  );
}
