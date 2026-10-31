"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Preloader from "./Preloader";

type LandingExperienceProps = {
  ready: boolean;
  children: ReactNode;
};

type LoadingPhase = "loading" | "revealing" | "complete";

const LandingRevealed = createContext(false);
const OrangeLanded = createContext(false);

export function useOrangeLanded() { return useContext(OrangeLanded); }

export function useLandingRevealed() {
  return useContext(LandingRevealed);
}

export default function LandingExperience({ ready, children }: LandingExperienceProps) {
  const [phase, setPhase] = useState<LoadingPhase>("loading");
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [contentReady, setContentReady] = useState(ready);
  const [orangeLanded, setOrangeLanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const startedAtTop = useRef(false);
  const getOrangeTarget = useCallback(() => contentRef.current?.querySelector<HTMLElement>("[data-hero-orange-anchor]") ?? null, []);
  const loading = phase !== "complete";

  // This always starts with a loader, so browser-restored scroll must not expose
  // the seam between sections while its backdrop fades into the hero.
  useLayoutEffect(() => {
    const restoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    if (!startedAtTop.current) {
      startedAtTop.current = true;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    return () => { window.history.scrollRestoration = restoration; };
  }, []);

  useEffect(() => {
    const minimum = setTimeout(() => setMinimumElapsed(true), 5000);
    return () => clearTimeout(minimum);
  }, []);

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
  if (ready && !contentReady) setContentReady(true);
  if (contentReady && minimumElapsed && phase === "loading") {
    setPhase("revealing");
  }

  return (
    <>
      {loading && <Preloader ready={phase === "revealing"} getOrangeTarget={getOrangeTarget}
        onOrangeLanded={() => setOrangeLanded(true)} onComplete={() => setPhase("complete")} />}
      <div ref={contentRef} data-page-content data-loading-phase={phase}>
        <LandingRevealed.Provider value={phase === "complete"}>
          <OrangeLanded.Provider value={orangeLanded}>{children}</OrangeLanded.Provider>
        </LandingRevealed.Provider>
      </div>
    </>
  );
}
