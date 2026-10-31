"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useEffectEvent, useLayoutEffect, useRef } from "react";
import styles from "./Preloader.module.css";

import apple from "../../public/fruits/apple-fruit.png";
import avocado from "../../public/fruits/avocado.png";
import pear from "../../public/fruits/pear.png";
import blueberry from "../../public/fruits/blueberry.png";
import coconut from "../../public/fruits/coconut.png";
import grapefruit from "../../public/fruits/grapefruit.png";
import orange from "../../public/fruits/orange.png";
import strawberry from "../../public/fruits/strawberry.png";
import watermelon from "../../public/fruits/watermelon.png";


type PreloaderProps = {
  ready: boolean;
  onComplete: () => void;
  getOrangeTarget?: () => HTMLElement | null;
  onOrangeLanded?: () => void;
};

const FRUITS = [
  { id: "apple-fruit", src: apple }, { id: "avocado", src: avocado },
  { id: "pear", src: pear }, { id: "blueberry", src: blueberry },
  { id: "orange", src: orange }, { id: "grapefruit", src: grapefruit },
  { id: "coconut", src: coconut }, { id: "strawberry", src: strawberry },
  { id: "watermelon", src: watermelon },
] as const;

export default function Preloader({ ready, onComplete, getOrangeTarget, onOrangeLanded }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<gsap.core.Tween[]>([]);
  const complete = useEffectEvent(onComplete);
  const landed = useEffectEvent(() => onOrangeLanded?.());
  const target = useEffectEvent(() => getOrangeTarget?.() ?? null);

  // One sprite stays above the row and then travels to the hero. Read layout
  // only on setup/resize; animation frames change transforms and opacity.
  useLayoutEffect(() => {
    if (ready) return;
    const place = () => {
      if (!slotRef.current || !spriteRef.current) return;
      const box = slotRef.current.getBoundingClientRect();
      gsap.set(spriteRef.current, { left: box.left, top: box.top, width: box.width, height: box.height, opacity: 1 });
    };
    place();
    window.addEventListener("resize", place);
    const observer = new ResizeObserver(place);
    if (slotRef.current) observer.observe(slotRef.current);
    return () => { observer.disconnect(); window.removeEventListener("resize", place); };
  }, [ready]);

  useEffect(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const wave = gsap.fromTo("[data-fruit]", {
        y: (_: number, element: HTMLElement) => FRUITS.findIndex(fruit => fruit.id === element.dataset.fruit) % 2 ? -12 : 12,
      }, {
        y: (_: number, element: HTMLElement) => FRUITS.findIndex(fruit => fruit.id === element.dataset.fruit) % 2 ? 12 : -12,
        duration: 0.7, ease: "sine.inOut", repeat: -1, yoyo: true,
      });
      const roll = gsap.to(rollRef.current, { rotation: 360, duration: 1.6, ease: "none", repeat: -1 });
      idleRef.current = [wave, roll];
    }, overlayRef);
    return () => { idleRef.current = []; motion.revert(); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    idleRef.current.forEach(tween => tween.pause());
    const overlay = overlayRef.current;
    const sprite = spriteRef.current;
    const hero = target();
    const sourceImage = sprite?.querySelector("img");
    const heroImage = hero?.querySelector("img");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let exit: gsap.core.Animation | undefined;
    let finished = false;
    let disposed = false;
    const finish = (arrived: boolean) => {
      if (disposed || finished) return;
      finished = true;
      if (arrived) landed();
      complete();
    };
    const fade = (short = false) => {
      exit?.eventCallback("onComplete", null);
      exit?.kill();
      exit = gsap.to(overlay, {
        id: "loader-fade", opacity: 0, duration: short || preference.matches ? 0.15 : 0.5,
        onComplete: () => finish(false),
      });
    };
    const box = hero?.getBoundingClientRect();
    const source = sprite?.getBoundingClientRect();
    const usable = hero?.isConnected && sourceImage?.complete && sourceImage.naturalWidth &&
      heroImage?.complete && heroImage.naturalWidth && box && box.width > 0 &&
      box.bottom > 0 && box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth &&
      source && source.width > 0 && source.height > 0;

    if (!preference.matches && usable && sprite && hero) {
      const width = hero.offsetWidth;
      const height = hero.offsetHeight;
      // The target's bounding box includes its fixed rotation; offset sizes
      // preserve the image's square and its centre matches that rotated box.
      const x = box.left + box.width / 2 - width / 2 - source.left;
      const y = box.top + box.height / 2 - height / 2 - source.top;
      const rotation = Number(gsap.getProperty(hero, "rotation")) || 0;
      const currentRoll = Number(gsap.getProperty(rollRef.current, "rotation")) || 0;
      const flight = gsap.timeline({ id: "orange-handoff", onComplete: () => finish(true) });
      exit = flight;
      flight.to(overlay?.querySelectorAll("[data-loader-background], [data-loader-content]") ?? [], { opacity: 0, duration: 0.55 }, 0);
      flight.to(waveRef.current, { y: 0, duration: 0.35, ease: "power2.out" }, 0);
      flight.to(sprite, { x, y, scaleX: width / source.width, scaleY: height / source.height,
        transformOrigin: "top left", duration: 1.25, ease: "power2.inOut" }, 0);
      flight.to(rollRef.current, { rotation: Math.ceil(currentRoll / 360) * 360 + 360 + rotation,
        duration: 1.25, ease: "power2.inOut" }, 0);
    } else fade();

    const abort = () => { if (!finished && !disposed) fade(true); };
    const reduce = () => { if (preference.matches) abort(); };
    const assetFailed = () => abort();
    window.addEventListener("resize", abort);
    preference.addEventListener("change", reduce);
    sourceImage?.addEventListener("error", assetFailed);
    heroImage?.addEventListener("error", assetFailed);
    return () => {
      disposed = true;
      window.removeEventListener("resize", abort);
      preference.removeEventListener("change", reduce);
      sourceImage?.removeEventListener("error", assetFailed);
      heroImage?.removeEventListener("error", assetFailed);
      exit?.eventCallback("onComplete", null);
      exit?.kill();
    };
  }, [ready]);

  return (
    <div ref={overlayRef} data-preloader data-phase={ready ? "exiting" : "loading"}
      className="fixed inset-0 z-100 flex min-h-svh items-center justify-center px-6">
      <div data-loader-background className="absolute inset-0 bg-fruit-cream" />
      <div data-loader-content className="relative flex w-full max-w-[480px] flex-col items-center gap-6">
        <div aria-hidden="true" className="flex w-full items-center gap-1 py-4 sm:gap-2">
          {FRUITS.map(({ id, src }) => id === "orange" ? (
            <span ref={slotRef} key={id} data-orange-slot className="block aspect-square min-w-0 flex-1" />
          ) : (
            <span key={id} data-fruit={id} className="block aspect-square min-w-0 flex-1">
              <Image className="block h-full w-full select-none object-contain" src={src} alt="" width={94} height={94}
                sizes="(max-width: 640px) 7vw, 42px" loading="eager" draggable={false}
                onLoad={({ currentTarget }) => { currentTarget.style.visibility = ""; }}
                onError={({ currentTarget }) => { currentTarget.style.visibility = "hidden"; }} />
            </span>
          ))}
        </div>
        <p role="status" aria-live="polite" aria-atomic="true"
          className="m-0 text-center font-playful text-xs leading-normal font-semibold tracking-[0.3em] text-fruit-green sm:text-sm">LOADING…</p>
      </div>
      <div ref={spriteRef} data-orange-sprite aria-hidden="true" className={styles.sprite}>
        <div ref={waveRef} data-fruit="orange" className={styles.layer}>
          <div ref={rollRef} className={styles.layer}>
            <Image className={styles.image} src={orange} alt="" width={1280} height={1280}
              sizes="(max-width: 900px) 68vw, (min-width: 1800px) 680px, 42vw" loading="eager" draggable={false}
              onLoad={({ currentTarget }) => { currentTarget.style.visibility = ""; }}
              onError={({ currentTarget }) => { currentTarget.style.visibility = "hidden"; }} />
          </div>
        </div>
      </div>
    </div>
  );
}
