// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { gsap } from "gsap";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Preloader from "../src/components/Preloader";

let container: HTMLDivElement;
let root: Root;
let reduced = false;
let target: HTMLDivElement;
let changeListeners: Set<() => void>;
const originalAct = Object.getOwnPropertyDescriptor(globalThis, "IS_REACT_ACT_ENVIRONMENT");
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  reduced = false;
  changeListeners = new Set();
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() { return query.includes("no-preference") ? !reduced : reduced; }, media: query,
    addListener() {}, removeListener() {},
    addEventListener(_: string, listener: () => void) { changeListeners.add(listener); },
    removeEventListener(_: string, listener: () => void) { changeListeners.delete(listener); },
  }));
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(1280);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    return this.hasAttribute("data-hero-orange-anchor")
      ? new DOMRect(650, 180, 300, 300) : new DOMRect(480, 340, 40, 40);
  });
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
    return this.hasAttribute("data-hero-orange-anchor") ? 300 : 40;
  });
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
    return this.hasAttribute("data-hero-orange-anchor") ? 300 : 40;
  });
  container = document.createElement("div");
  document.body.append(container);
  target = document.createElement("div");
  target.setAttribute("data-hero-orange-anchor", "");
  target.append(document.createElement("img"));
  document.body.append(target);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove(); target.remove();
  vi.restoreAllMocks(); vi.unstubAllGlobals();
  if (originalAct) Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", originalAct);
  else Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
});

function render(ready: boolean, complete: () => void, landed: () => void) {
  act(() => root.render(<Preloader ready={ready} onComplete={complete} getOrangeTarget={() => target} onOrangeLanded={landed} />));
}

test("orange handoff reports landing before completion and only after travel", () => {
  target.style.transform = "matrix(0.992546, -0.121869, 0.121869, 0.992546, 0, 0)";
  Object.defineProperty(target, "getBoundingClientRect", { configurable: true, value: () => new DOMRect(630, 160, 334.4, 334.4) });
  const events: string[] = [];
  const complete = () => events.push("complete");
  const landed = () => events.push("landed");
  render(false, complete, landed);
  expect(container.querySelectorAll('[data-orange-sprite] img')).toHaveLength(1);
  render(true, complete, landed);
  expect(events).toEqual([]);
  const flight = gsap.getById("orange-handoff");
  expect(flight).toBeDefined();
  act(() => { flight!.progress(0.5); });
  expect(events).toEqual([]);
  act(() => { flight!.progress(1); });
  expect(events).toEqual(["landed", "complete"]);
  const sprite = container.querySelector<HTMLElement>("[data-orange-sprite]")!;
  expect(Number(gsap.getProperty(sprite, "x"))).toBeCloseTo(167.2, 1);
  expect(Number(gsap.getProperty(sprite, "y"))).toBeCloseTo(-162.8, 1);
  expect(Number(gsap.getProperty(sprite, "scaleX"))).toBeCloseTo(7.5);
  expect(Number(gsap.getProperty(sprite, "scaleY"))).toBeCloseTo(7.5);
  const roll = sprite.querySelector("img")!.parentElement!;
  expect(Number(gsap.getProperty(roll, "rotation")) % 360).toBeCloseTo(353, 1);
});

test.each(["reduced", "failed", "missing", "pending-source", "failed-source", "offscreen"])("%s target uses fade without claiming an orange landing", mode => {
  reduced = mode === "reduced";
  if (mode === "failed") Object.defineProperty(target.querySelector("img"), "naturalWidth", { value: 0 });
  if (mode === "missing") target.remove();
  if (mode === "offscreen") Object.defineProperty(target, "getBoundingClientRect", { configurable: true, value: () => new DOMRect(0, -800, 300, 300) });
  const complete = vi.fn(); const landed = vi.fn();
  render(false, complete, landed);
  const source = container.querySelector<HTMLImageElement>("[data-orange-sprite] img")!;
  if (mode === "pending-source") Object.defineProperty(source, "complete", { configurable: true, value: false });
  if (mode === "failed-source") Object.defineProperty(source, "naturalWidth", { configurable: true, value: 0 });
  render(true, complete, landed);
  expect(gsap.getById("orange-handoff")).toBeUndefined();
  const fade = gsap.getById("loader-fade");
  expect(fade).toBeDefined();
  act(() => { fade!.progress(1); });
  expect(complete).toHaveBeenCalledTimes(1);
  expect(landed).not.toHaveBeenCalled();
});

test.each(["resize", "reduced", "source-error", "target-error"])("%s during travel aborts safely to fade", event => {
  const complete = vi.fn(); const landed = vi.fn();
  render(false, complete, landed); render(true, complete, landed);
  expect(gsap.getById("orange-handoff")).toBeDefined();
  act(() => {
    if (event === "resize") window.dispatchEvent(new Event("resize"));
    else if (event === "reduced") { reduced = true; changeListeners.forEach(listener => listener()); }
    else if (event === "source-error") container.querySelector("[data-orange-sprite] img")!.dispatchEvent(new Event("error"));
    else target.querySelector("img")!.dispatchEvent(new Event("error"));
  });
  expect(gsap.getById("orange-handoff")).toBeUndefined();
  act(() => { gsap.getById("loader-fade")!.progress(1); });
  expect(complete).toHaveBeenCalledTimes(1);
  expect(landed).not.toHaveBeenCalled();
});

test("unmount cancels handoff callbacks", () => {
  const complete = vi.fn(); const landed = vi.fn();
  render(false, complete, landed); render(true, complete, landed);
  const flight = gsap.getById("orange-handoff");
  expect(flight).toBeDefined();
  act(() => root.unmount());
  expect(gsap.getById("orange-handoff")).toBeUndefined();
  act(() => { flight!.progress(1); });
  expect(complete).not.toHaveBeenCalled();
  expect(landed).not.toHaveBeenCalled();
  root = createRoot(container);
});
