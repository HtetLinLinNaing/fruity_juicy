"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useEffectEvent, useRef } from "react";

type PreloaderProps = {
  ready: boolean;
  onComplete: () => void;
};

const FRUITS = [
  "apple-fruit", "avocado", "banana", "blueberry", "cherry",
  "coconut", "grapes", "orange", "strawberry", "watermelon",
] as const;

export default function Preloader({ ready, onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const complete = useEffectEvent(onComplete);

  // The fruit loop only runs while the page is waiting for essential content.
  useEffect(() => {
    if (ready) return;

    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo("[data-fruit]",
        { y: (index: number) => index % 2 === 0 ? 12 : -12 },
        {
          y: (index: number) => index % 2 === 0 ? -12 : 12,
          duration: 0.7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
    }, overlayRef);

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
      className="fixed inset-0 z-[100] flex min-h-svh items-center justify-center bg-white px-6"
    >
      <div className="flex w-full max-w-[480px] flex-col items-center gap-6">
        <div aria-hidden="true" className="flex w-full items-center gap-1 py-4 sm:gap-2">
          {FRUITS.map((fruit) => (
            <span key={fruit} data-fruit className="block aspect-square min-w-0 flex-1">
              <Image
                src={`/fruits/${fruit}.png`}
                alt=""
                width={94}
                height={94}
                unoptimized
                loading="eager"
                draggable={false}
                onError={({ currentTarget }) => { currentTarget.style.visibility = "hidden"; }}
                className="h-full w-full select-none object-contain"
              />
            </span>
          ))}
        </div>
        <p role="status" aria-live="polite" aria-atomic="true"
          className="text-center text-xs font-bold tracking-[0.45em] text-[#2845B8] sm:text-sm">
          LOADING..
        </p>
      </div>
    </div>
  );
}
