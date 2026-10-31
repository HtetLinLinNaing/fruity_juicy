// @vitest-environment happy-dom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import Home from "../src/app/page";
import { ScrollTrigger } from "gsap/ScrollTrigger";

vi.mock("../src/components/Preloader", () => ({
  default: ({ ready, onComplete }: { ready: boolean; onComplete: () => void }) =>
    <button data-finish-loader disabled={!ready} onClick={onComplete}>Finish</button>,
}));

const originalAct = Object.getOwnPropertyDescriptor(globalThis, "IS_REACT_ACT_ENVIRONMENT");
afterEach(() => {
  vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers();
  if (originalAct) Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", originalAct);
  else Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
});

test.each([[1280, 650], [572, 827], [375, 812]])("a %i by %i viewport connects its scenes with one real ScrollTrigger pin", async (width, height) => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  vi.stubGlobal("innerWidth", width); vi.stubGlobal("innerHeight", height);
  // Evaluate the media-query dimensions against this controlled viewport. This
  // substitutes browser media matching, not GSAP or ScrollTrigger success.
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.split(",").some(part => {
      if (part.includes("prefers-reduced-motion: reduce")) return false;
      return Array.from(part.matchAll(/\((min|max)-(width|height):\s*(\d+)px\)/g)).every(([, bound, axis, value]) => {
        const size = axis === "width" ? width : height;
        return bound === "min" ? size >= Number(value) : size <= Number(value);
      });
    }), media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
  }));
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(1280);
  const container = document.createElement("div"); document.body.append(container);
  const root = createRoot(container);
  let stageHeight = 2400;
  try {
    await act(async () => root.render(<Home />));
    const sceneRoot = container.querySelector<HTMLElement>("[data-landing-scene]")!;
    if (width <= 900) {
      const stage = container.querySelector<HTMLElement>("[data-collection-stage]")!;
      Object.defineProperty(stage, "offsetHeight", { configurable: true, get: () => stageHeight });
      const readHeight = () => {
        const value = sceneRoot.style.height;
        return Number.parseFloat(value.startsWith("var(") ? sceneRoot.style.getPropertyValue("--scene-content-height") : value) || stageHeight;
      };
      Object.defineProperties(sceneRoot, {
        offsetHeight: { configurable: true, get: readHeight },
        getBoundingClientRect: { configurable: true, value: () => new DOMRect(0, 0, width, readHeight()) },
      });
    }
    act(() => vi.advanceTimersByTime(5000));
    const finish = container.querySelector<HTMLButtonElement>("[data-finish-loader]")!;
    expect(finish.disabled).toBe(false);
    await act(async () => finish.click());
    expect(container.querySelectorAll(".pin-spacer")).toHaveLength(1);
    expect(container.querySelector<HTMLElement>('[aria-labelledby="collection-title"]')!.style.position).toBe("absolute");
    if (width <= 900) {
      stageHeight = 2900;
      act(() => { ScrollTrigger.refresh(); });
      expect(sceneRoot.offsetHeight).toBeGreaterThanOrEqual(2900);
    }
  } finally {
    act(() => root.unmount());
    expect(container.querySelector(".pin-spacer")).toBeNull();
    container.remove();
  }
});
