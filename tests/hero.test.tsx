// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Home from "../src/app/page";

// Keep the page, image components, and loading wrapper real. Only the visual
// overlay is controlled: DOM tests cannot establish actual GSAP completion.
vi.mock("../src/components/Preloader", () => ({
  default: ({ ready, onComplete }: { ready: boolean; onComplete: () => void }) => (
    <button data-finish-loader disabled={!ready} onClick={onComplete}>Finish fade</button>
  ),
}));

let container: HTMLDivElement;
let root: Root;
const originalAct = Object.getOwnPropertyDescriptor(globalThis, "IS_REACT_ACT_ENVIRONMENT");

beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("prefers-reduced-motion: reduce"), media: query,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
  }));
  // Happy DOM does not fetch images. Start with pending network requests;
  // each scenario explicitly supplies load/error outcomes below.
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(false);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(<Home />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
  if (originalAct) Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", originalAct);
  else Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
});

function loader() {
  const button = container.querySelector<HTMLButtonElement>("[data-finish-loader]");
  if (!button) throw new Error("Expected the loading overlay");
  return button;
}

function images() { return Array.from(container.querySelectorAll<HTMLImageElement>("main img")); }

async function settle(image: HTMLImageElement, failed = false) {
  Object.defineProperty(image, "naturalWidth", { configurable: true, value: failed ? 0 : 1280 });
  Object.defineProperty(image, "complete", { configurable: true, value: true });
  await act(async () => image.dispatchEvent(new Event(failed ? "error" : "load")));
}

test("does not reveal before every distinct hero image settles, including duplicate events", async () => {
  expect(images()).toHaveLength(8);
  expect(images().every(image => decodeURIComponent(image.src).includes("/fruits/"))).toBe(true);
  act(() => vi.advanceTimersByTime(5000));
  expect(loader().disabled).toBe(true);
  for (const image of images().slice(0, -1)) await settle(image, true);
  await settle(images()[0], true);
  expect(loader().disabled).toBe(true);
  await settle(images()[images().length - 1], true);
  expect(loader().disabled).toBe(false);
  expect(container.querySelector<HTMLElement>("[data-page-content]")?.inert).toBe(true);
  expect(images().every(image => image.style.visibility === "hidden")).toBe(true);
  act(() => loader().click());
  expect(container.querySelector("[data-finish-loader]")).toBeNull();
  expect(Boolean(container.querySelector<HTMLElement>("[data-page-content]")?.inert)).toBe(false);
  expect(container.querySelector("h1")?.textContent).toContain("A little fresh.");
  expect(container.querySelector("main button")?.textContent).toContain("Meet the fruits");
});

test("successful images still wait five seconds before reveal", async () => {
  expect(images()).toHaveLength(8);
  for (const image of images()) await settle(image);
  act(() => vi.advanceTimersByTime(4999));
  expect(loader().disabled).toBe(true);
  act(() => vi.advanceTimersByTime(1));
  expect(loader().disabled).toBe(false);
});

test("a fruit becomes visible when a failed image later loads successfully", async () => {
  const image = images()[0];
  await settle(image, true);
  expect(image.style.visibility).toBe("hidden");
  await settle(image);
  expect(image.style.visibility).not.toBe("hidden");
});

test("cached hero images can dismiss the loader without another load event", async () => {
  act(() => root.unmount());
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(1280);
  root = createRoot(container);
  await act(async () => root.render(<Home />));
  act(() => vi.advanceTimersByTime(5000));
  expect(loader().disabled).toBe(false);
});

test("a stalled hero image cannot prevent the existing loading deadline", async () => {
  act(() => root.unmount());
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  root = createRoot(container);
  await act(async () => root.render(<Home />));
  for (const image of images().slice(0, -1)) await settle(image, true);
  act(() => vi.advanceTimersByTime(7999));
  expect(loader().disabled).toBe(true);
  act(() => vi.advanceTimersByTime(1));
  expect(loader().disabled).toBe(false);
  act(() => loader().click());
  expect(container.querySelector("h1")?.textContent).toContain("A little fresh.");
  expect(Boolean(container.querySelector<HTMLElement>("[data-page-content]")?.inert)).toBe(false);
});

test("preserves the requested pear and grapefruit from the fruit folder", () => {
  const pear = container.querySelector<HTMLImageElement>('[data-hero-image="pear"]');
  const grapefruit = container.querySelector<HTMLImageElement>('[data-hero-image="grapefruit"]');
  expect(pear).not.toBeNull();
  expect(grapefruit).not.toBeNull();
  expect(decodeURIComponent(pear!.src)).toContain("/fruits/pear.png");
  expect(decodeURIComponent(grapefruit!.src)).toContain("/fruits/grapefruit.png");
});
