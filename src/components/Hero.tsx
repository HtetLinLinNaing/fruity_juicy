"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLandingRevealed, useOrangeLanded } from "./LandingExperience";
import styles from "./Hero.module.css";

import orange from "../../public/fruits/orange.png";
import strawberry from "../../public/fruits/strawberry.png";
import pear from "../../public/fruits/pear.png";
import grapefruit from "../../public/fruits/grapefruit.png";
import blueberry from "../../public/fruits/blueberry.png";

const FRUITS = [
  { id: "orange", src: orange },
  { id: "strawberry", src: strawberry },
  { id: "pear", src: pear },
  { id: "grapefruit", src: grapefruit },
  { id: "blueberryOne", src: blueberry },
  { id: "blueberryTwo", src: blueberry },
  { id: "blueberryThree", src: blueberry },
  { id: "foreground", src: orange },
] as const;
type Fruit = typeof FRUITS[number]["id"];

export default function Hero({ onReady }: { onReady: () => void }) {
  const [settled, setSettled] = useState<ReadonlySet<Fruit>>(() => new Set());
  const settle = useCallback((fruit: Fruit) => {
    setSettled((previous) => previous.has(fruit) ? previous : new Set([...previous, fruit]));
  }, []);

  useEffect(() => {
    if (settled.size === FRUITS.length) onReady();
  }, [settled, onReady]);
  return <HeroScene onImageSettled={settle} />;
}

function HeroScene({ onImageSettled }: { onImageSettled: (fruit: Fruit) => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const entrancePlayed = useRef(false);
  const revealed = useLandingRevealed();
  const orangeLanded = useOrangeLanded();

  // Covers images that finished loading (or failed) before hydration.
  useEffect(() => {
    heroRef.current?.querySelectorAll<HTMLImageElement>("img[data-hero-image]").forEach((image) => {
      if (!image.complete) return;
      if (!image.naturalWidth) image.style.visibility = "hidden";
      onImageSettled(image.dataset.heroImage as Fruit);
    });
  }, [onImageSettled]);

  useLayoutEffect(() => {
    if (!revealed || !heroRef.current) return;
    const hero = heroRef.current;
    const motion = gsap.matchMedia();
    motion.add({
      desktop: "(min-width: 901px)",
      sharedOrange: "(min-height: 400px)",
      mobile: "(max-width: 900px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reduced) {
        entrancePlayed.current = true;
        return;
      }
      const desktop = context.conditions?.desktop;
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      const firstEntrance = !entrancePlayed.current;
      if (firstEntrance) {
        entrance.fromTo("[data-hero-copy]", { y: 28, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
        });
        entrance.fromTo(orangeLanded || context.conditions?.sharedOrange ? "[data-fruit-enter]:not([data-hero-orange-enter])" : "[data-fruit-enter]", { y: desktop ? 90 : 35, scale: 0.78, opacity: 0 }, {
          y: 0, scale: 1, opacity: 1, duration: 1.1, stagger: 0.045,
        }, 0.12);
        entrancePlayed.current = true;
      }

      // Separate transform layers keep entrance and idle movements independent.
      const floats = gsap.to(context.conditions?.sharedOrange ? '[data-fruit-scroll]:not([data-fruit-scroll="orange"]) [data-fruit-float]' : "[data-fruit-float]", {
        y: (index: number) => (index % 2 ? -1 : 1) * (desktop ? 12 : 5),
        rotation: (index: number) => index % 2 ? 2 : -2,
        duration: (index: number) => 2.4 + index * 0.13,
        delay: firstEntrance ? 1.3 : 0, ease: "sine.inOut", repeat: -1, yoyo: true,
      });
      let inView = true;
      const updateActivity = () => {
        const paused = !inView || document.hidden;
        entrance.paused(paused);
        floats.paused(paused);
      };
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        updateActivity();
      });
      observer.observe(hero);
      document.addEventListener("visibilitychange", updateActivity);
      updateActivity();
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", updateActivity);
      };
    }, heroRef);
    return () => motion.revert();
  }, [revealed, orangeLanded]);

  return (
      <section ref={heroRef} className={styles.hero} data-hero-ready={revealed} aria-labelledby="hero-title">
        <header className={styles.header}>
          <span className={styles.wordmark} aria-label="Fruity Juicy">FRUITY<br />JUICY</span>
          <span className={styles.tagline}>Fresh by nature <span aria-hidden="true">—</span></span>
        </header>
        <div className={styles.copy} data-hero-scroll-copy>
          <h1 id="hero-title" data-hero-copy className={styles.title}>
            <span>A little fresh.</span><span>A lot of fun.</span>
          </h1>
          <p data-hero-copy className={styles.description}>Meet your daily dose of happy.</p>
          <div data-hero-copy>
            <button type="button" className={styles.button}>
              Meet the fruits <span aria-hidden="true">⟶</span>
            </button>
          </div>
        </div>
        <div className={styles.artwork} data-hero-scroll-art aria-hidden="true">
          {FRUITS.map(({ id: fruit, src }) => (
            <div key={fruit} className={`${styles.fruit} ${styles[fruit]}`} data-hero-orange-anchor={fruit === "orange" ? "" : undefined}>
              <div data-fruit-scroll={fruit} className={styles.scroll}>
              <div data-fruit-enter data-hero-orange-enter={fruit === "orange" ? "" : undefined} className={styles.enter}>
                <div data-fruit-float className={styles.float}>
                  <div className={styles.hover} data-hero-orange-hover={fruit === "orange" ? "" : undefined}>
                    <Image
                      src={src}
                      alt="" width={1280} height={1280}
                      sizes={fruit === "orange" || fruit === "foreground"
                        ? "(max-width: 900px) 68vw, (min-width: 1800px) 680px, 42vw"
                        : fruit.startsWith("blueberry")
                          ? "(max-width: 900px) 16vw, 9vw"
                          : "(max-width: 900px) 48vw, 32vw"}
                      loading="eager"
                      fetchPriority={fruit === "orange" ? "high" : "auto"}
                      draggable={false}
                      data-hero-image={fruit}
                      onLoad={({ currentTarget }) => {
                        currentTarget.style.visibility = "";
                        onImageSettled(fruit);
                      }}
                      onError={({ currentTarget }) => {
                        currentTarget.style.visibility = "hidden";
                        onImageSettled(fruit);
                      }}
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>
          ))}
          <span className={`${styles.spark} ${styles.sparkOne}`}>✦</span>
          <span className={`${styles.spark} ${styles.sparkTwo}`}>✦</span>
          <span className={`${styles.spark} ${styles.sparkThree}`}>✦</span>
        </div>
        <footer className={styles.footer}>
          <span aria-hidden="true">↓</span>
          <span>FRESH BY NATURE</span>
        </footer>
      </section>
  );
}
