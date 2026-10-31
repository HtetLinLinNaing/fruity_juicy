"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero";
import Collection from "./Collection";
import LandingExperience, { useLandingRevealed } from "./LandingExperience";
import { createSceneTransition } from "./sceneMotion";
import orange from "../../public/fruits/orange.png";
import styles from "./FruityLanding.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function FruityLanding() {
  const [ready, setReady] = useState(false);
  const markHeroReady = useCallback(() => setReady(true), []);
  return <LandingExperience ready={ready}><LandingSections onHeroReady={markHeroReady} /></LandingExperience>;
}

function LandingSections({ onHeroReady }: { onHeroReady: () => void }) {
  const mainRef = useRef<HTMLElement>(null);
  const revealed = useLandingRevealed();

  useLayoutEffect(() => {
    if (!revealed || !mainRef.current) return;
    const main = mainRef.current;
    const motion = gsap.matchMedia();
    motion.add({
      pinned: "(min-height: 400px)",
      compact: "(max-width: 900px), (max-height: 559px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reduced) return;
      const sceneRoot = main.querySelector<HTMLElement>("[data-landing-scene]");
      const collection = main.querySelector<HTMLElement>('[aria-labelledby="collection-title"]');
      if (!sceneRoot || !collection) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-collection-card]", main);
      const compact = !!context.conditions?.compact;
      const amplitude = compact ? 3 : 6;
      const cardWave = gsap.fromTo(main.querySelectorAll("[data-card-wave]"), {
        y: (index: number) => index % 2 ? amplitude : -amplitude,
        rotation: (index: number) => index % 2 ? 1 : -1,
      }, {
        y: (index: number) => index % 2 ? -amplitude : amplitude,
        rotation: (index: number) => index % 2 ? -1 : 1,
        duration: 2.2, stagger: 0.18, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true,
      });
      let activity = () => {};
      let observer: IntersectionObserver | undefined;
      let disposeDesktop = () => {};
      if (context.conditions?.pinned) {
        const desktop = createSceneTransition(main, compact);
        if (!desktop) return;
        const scene = desktop.timeline;
        disposeDesktop = desktop.dispose;
        activity = () => { cardWave.paused(document.hidden || scene.time() < 0.9); };
        scene.eventCallback("onUpdate", activity);
        ScrollTrigger.create({
          trigger: sceneRoot, animation: scene, start: "top top", end: () => "+=" + window.innerHeight * (compact ? 1.25 : 2),
          pin: true, pinSpacing: true, scrub: compact ? 0.35 : 0.6, invalidateOnRefresh: true, anticipatePin: 1,
          onRefreshInit: desktop.refreshLayout,
        });
      } else {
        cards.forEach((card, index) => {
          gsap.fromTo(card, { x: index % 2 ? 18 : -18, y: 28, rotation: index % 2 ? 3 : -3, autoAlpha: 0 }, {
            x: 0, y: 0, rotation: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 95%", once: true },
          });
        });
        let inView = false;
        activity = () => { cardWave.paused(document.hidden || !inView); };
        observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; activity(); });
        observer.observe(collection);
      }
      document.addEventListener("visibilitychange", activity);
      activity();
      return () => {
        observer?.disconnect();
        disposeDesktop();
        document.removeEventListener("visibilitychange", activity);
      };
    }, mainRef);

    let disposed = false;
    let frame = 0;
    document.fonts?.ready.then(() => {
      if (!disposed) frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      motion.revert();
    };
  }, [revealed]);

  return <main ref={mainRef}><div className={styles.scene} data-landing-scene>
    <div className={styles.backdrop} data-scene-backdrop aria-hidden="true" />
    <div className={styles.orange} data-scene-orange aria-hidden="true">
      <div className={styles.roll} data-scene-orange-roll>
        <Image src={orange} alt="" width={1280} height={1280} sizes="(max-width: 900px) 68vw, (min-width: 1800px) 680px, 48vw"
          loading="eager" draggable={false}
          onLoad={({ currentTarget }) => { currentTarget.style.visibility = ""; }}
          onError={({ currentTarget }) => { currentTarget.style.visibility = "hidden"; }} />
      </div>
    </div>
    <Hero onReady={onHeroReady} /><Collection />
  </div></main>;
}
