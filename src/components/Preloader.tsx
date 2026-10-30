"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { createLoadingLifecycle } from "./preloader-lifecycle";

const FRUITS = [
  "apple-fruit", "avocado", "banana", "blueberry", "cherry",
  "coconut", "grapes", "orange", "strawberry", "watermelon",
] as const;

function waitForImage(image: HTMLImageElement, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    let settled = false;

    function finish(loaded: boolean) {
      if (settled) return;
      settled = true;
      image.removeEventListener("load", loadedImage);
      image.removeEventListener("error", failedImage);
      signal.removeEventListener("abort", aborted);
      if (!signal.aborted) image.style.visibility = loaded ? "visible" : "hidden";
      resolve();
    }

    function loadedImage() {
      image.decode().then(() => finish(true), () => finish(false));
    }

    function failedImage() { finish(false); }
    function aborted() { finish(false); }

    if (signal.aborted) {
      finish(false);
    } else {
      signal.addEventListener("abort", aborted, { once: true });
      image.addEventListener("load", loadedImage, { once: true });
      image.addEventListener("error", failedImage, { once: true });
      if (image.complete) {
        if (image.naturalWidth > 0) loadedImage();
        else failedImage();
      }
    }
  });
}

export default function Preloader({ contentId }: { contentId: string }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (dismissed || !overlay) return;

    const abort = new AbortController();
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const content = document.getElementById(contentId);
    const focused = document.activeElement;
    const previousInert = content?.inert ?? false;
    const scrollTargets = [document.documentElement, document.body];
    const previousOverflow = scrollTargets.map((element) =>
      ["overflow-x", "overflow-y"].map((property) => ({
        property,
        value: element.style.getPropertyValue(property),
        priority: element.style.getPropertyPriority(property),
      })),
    );
    let disposed = false;
    let exiting = false;
    let restored = false;
    let wave: gsap.core.Tween | undefined;
    let exit: gsap.core.Tween | undefined;
    const fruitSlots = Array.from(overlay.querySelectorAll<HTMLElement>("[data-fruit]"));
    const context = gsap.context(() => {}, overlay);

    function restoreInteraction() {
      if (restored) return;
      restored = true;
      scrollTargets.forEach((element, index) => {
        element.style.removeProperty("overflow");
        previousOverflow[index].forEach(({ property, value, priority }) => {
          if (value) element.style.setProperty(property, value, priority);
        });
      });
      if (content) content.inert = previousInert;
      if (focused instanceof HTMLElement && focused.isConnected &&
          !previousInert && content?.contains(focused) && document.activeElement === document.body) {
        focused.focus({ preventScroll: true });
      }
    }

    function updateMotion() {
      wave?.kill();
      wave = undefined;
      if (motionPreference.matches || exiting) {
        gsap.set(fruitSlots, { y: 0 });
      } else {
        wave = gsap.fromTo(fruitSlots,
          { y: (index: number) => index % 2 === 0 ? 12 : -12 },
          {
            y: (index: number) => index % 2 === 0 ? -12 : 12,
            duration: 0.7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      }
    }

    function fadeOut(duration: number) {
      exit?.kill();
      context.add(() => {
        exit = gsap.to(overlay, {
          opacity: 0,
          duration,
          ease: "power1.out",
          onComplete() {
            if (disposed) return;
            restoreInteraction();
            setDismissed(true);
          },
        });
      });
    }

    const lifecycle = createLoadingLifecycle({
      reducedMotion: motionPreference.matches,
      onDismiss() {
        if (disposed || exiting) return;
        exiting = true;
        overlay.dataset.phase = "exiting";
        wave?.kill();
        wave = undefined;
        fadeOut(motionPreference.matches ? 0.15 : 0.5);
      },
    });

    function handleMotionChange() {
      if (disposed) return;
      context.add(updateMotion);
      lifecycle.setReducedMotion(motionPreference.matches);
      if (exiting && motionPreference.matches && exit && exit.duration() > 0.15) {
        fadeOut(0.15);
      }
    }

    scrollTargets.forEach((element) => element.style.setProperty("overflow", "hidden"));
    if (focused instanceof HTMLElement && content?.contains(focused)) focused.blur();
    if (content) content.inert = true;
    context.add(updateMotion);
    motionPreference.addEventListener("change", handleMotionChange);

    const documentReady = document.readyState !== "loading"
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          document.addEventListener("DOMContentLoaded", () => resolve(), {
            once: true, signal: abort.signal,
          });
        });
    const imagesReady = Promise.all(
      Array.from(overlay.querySelectorAll("img"), (image) => waitForImage(image, abort.signal)),
    );
    Promise.all([documentReady, imagesReady]).then(() => {
      if (!disposed) lifecycle.ready();
    });

    return () => {
      disposed = true;
      lifecycle.dispose();
      abort.abort();
      motionPreference.removeEventListener("change", handleMotionChange);
      context.revert();
      restoreInteraction();
    };
  }, [contentId, dismissed]);

  if (dismissed) return null;

  return (
    <div
      ref={overlayRef}
      data-preloader
      data-phase="loading"
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
                className="h-full w-full select-none object-contain"
                style={{ visibility: "hidden" }}
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
