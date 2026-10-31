"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useEffectEvent, useRef } from "react";


type PreloaderProps = {
  ready: boolean;
  onComplete: () => void;
};

import apple from "../../public/fruits/apple-fruit.png";
import avocado from "../../public/fruits/avocado.png";
import pear from "../../public/fruits/pear.png";
import blueberry from "../../public/fruits/blueberry.png";
import coconut from "../../public/fruits/coconut.png";
import grapefruit from "../../public/fruits/grapefruit.png";
import orange from "../../public/fruits/orange.png";
import strawberry from "../../public/fruits/strawberry.png";
import watermelon from "../../public/fruits/watermelon.png";

const FRUITS = [
  { id: "apple-fruit", src: apple },
  { id: "avocado", src: avocado },
  { id: "pear", src: pear },
  { id: "blueberry", src: blueberry },
  { id: "coconut", src: coconut },
  { id: "grapefruit", src: grapefruit },
  { id: "orange", src: orange },
  { id: "strawberry", src: strawberry },
  { id: "watermelon", src: watermelon },
] as const;

export default function Preloader({ ready, onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const complete = useEffectEvent(onComplete);

  // Keep the alternating wave running through the minimum display and image wait.
  useEffect(() => {
    if (ready) return;

    const motion = gsap.matchMedia();
    motion.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.fromTo(
          "[data-fruit]",
          { y: (index: number) => (index % 2 === 0 ? 12 : -12) },
          {
            y: (index: number) => (index % 2 === 0 ? -12 : 12),
            duration: 0.7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      },
      overlayRef,
    );

    return () => motion.revert();
  }, [ready]);

  // Report completion after the overlay is gone, so the page can enter next.
  useEffect(() => {
    if (!ready) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fade = gsap.to(overlayRef.current, {
      opacity: 0,
      duration: motion.matches ? 0.15 : 0.5,
      ease: "power1.out",
      onComplete: () => complete(),
    });
    const shortenFade = () => {
      if (motion.matches) fade.duration(Math.min(fade.duration(), 0.15));
    };
    motion.addEventListener("change", shortenFade);

    return () => {
      motion.removeEventListener("change", shortenFade);
      fade.kill();
    };
  }, [ready]);

  return (
    <div
      ref={overlayRef}
      data-preloader
      data-phase={ready ? "exiting" : "loading"}
      className="fixed inset-0 z-100 flex min-h-svh items-center justify-center bg-fruit-cream px-6"
    >
      <div className="flex w-full max-w-[480px] flex-col items-center gap-6">
        <div aria-hidden="true" className="flex w-full items-center gap-1 py-4 sm:gap-2">
          {FRUITS.map(({ id, src }) => (
            <span key={id} data-fruit={id} className="block aspect-square min-w-0 flex-1">
              <Image
                className="block h-full w-full select-none object-contain"
                src={src}
                alt=""
                width={94}
                height={94}
                sizes="(max-width: 640px) 7vw, 42px"
                loading="eager"
                draggable={false}
                onLoad={({ currentTarget }) => {
                  currentTarget.style.visibility = "";
                }}
                onError={({ currentTarget }) => {
                  currentTarget.style.visibility = "hidden";
                }}
              />
            </span>
          ))}
        </div>
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="m-0 text-center font-playful text-xs leading-normal font-semibold tracking-[0.3em] text-fruit-green sm:text-sm"
        >
          LOADING…
        </p>
      </div>
    </div>
  );
}
