// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, test } from "vitest";
import { gsap } from "gsap";
import { createSceneTransition } from "../src/components/sceneMotion";

let main: HTMLElement;
let context: gsap.Context;
let scene: gsap.core.Timeline | null;
let dispose = () => {};
let refreshLayout = () => {};
function element(selector: string) { return main.querySelector<HTMLElement>(selector)!; }
function imageReady(image: HTMLImageElement, ready: boolean) {
  Object.defineProperties(image, { complete: { configurable: true, value: ready }, naturalWidth: { configurable: true, value: ready ? 1280 : 0 } });
}
beforeEach(() => {
  main = document.createElement("main");
  main.innerHTML = `<div data-landing-scene><div data-scene-backdrop></div>
    <div data-scene-orange><div data-scene-orange-roll><img /></div></div>
    <section aria-labelledby="hero-title"><header></header><div data-hero-scroll-copy></div>
      <div data-hero-scroll-art><div data-hero-orange-anchor><div data-fruit-scroll="orange"><div data-hero-orange-hover><img /></div></div></div>
      <div data-fruit-scroll="foreground"></div>
      <div data-fruit-scroll="pear"></div></div><footer></footer></section>
    <section aria-labelledby="collection-title"><div data-collection-stage>
      <header data-collection-heading></header><div data-collection-gallery>
        <div data-collection-card></div><div data-collection-card></div><div data-collection-card></div>
      </div><div data-collection-orange-anchor><div data-collection-depth></div></div>
      <div data-collection-depth></div><p data-collection-signoff></p>
    </div></section></div>`;
  document.body.append(main);
  for (const image of main.querySelectorAll("img")) imageReady(image, true);
  const boxes: Array<[HTMLElement, DOMRect, number]> = [
    [element("[data-landing-scene]"), new DOMRect(0, 0, 1200, 800), 1200],
    [element("[data-hero-orange-anchor]"), new DOMRect(700, 180, 300, 300), 300],
    [element("[data-collection-orange-anchor]"), new DOMRect(-180, 540, 400, 400), 400],
  ];
  for (const [node, box, size] of boxes) Object.defineProperties(node, {
    getBoundingClientRect: { configurable: true, value: () => box },
    offsetWidth: { configurable: true, value: size }, offsetHeight: { configurable: true, value: size },
  });
});
afterEach(() => { dispose(); context?.revert(); main.remove(); });
function start(compact = false) { context = gsap.context(() => {
  const result = createSceneTransition(main, compact);
  scene = result?.timeline ?? null;
  dispose = result?.dispose ?? (() => {});
  refreshLayout = result?.refreshLayout ?? (() => {});
}, main); }

test("one orange replaces the originals during travel and reverses to the hero", () => {
  start();
  expect(scene).not.toBeNull();
  scene!.progress(0.5);
  expect(element('[data-fruit-scroll="orange"]').style.visibility).toBe("hidden");
  expect(element('[data-fruit-scroll="foreground"]').style.visibility).toBe("hidden");
  expect(element("[data-scene-orange]").style.visibility).toBe("inherit");
  expect(Number(gsap.getProperty(element("[data-scene-orange]"), "x"))).toBeGreaterThan(-30);
  expect(Number(gsap.getProperty(element("[data-scene-orange]"), "x"))).toBeLessThan(800);
  scene!.progress(1);
  expect(element('[data-fruit-scroll="orange"]').style.visibility).toBe("hidden");
  expect(element("[data-collection-orange-anchor]").style.visibility).toBe("hidden");
  expect(element("[data-scene-orange]").style.visibility).toBe("inherit");
  expect(Number(gsap.getProperty(element("[data-scene-orange]"), "x"))).toBeCloseTo(-30);
  expect(Number(gsap.getProperty(element("[data-scene-orange]"), "y"))).toBeCloseTo(690);
  expect(Number(gsap.getProperty(element("[data-scene-orange]"), "scaleX"))).toBeCloseTo(4);
  expect(Number(gsap.getProperty(element("[data-scene-orange-roll]"), "rotation"))).toBeGreaterThan(350);
  scene!.progress(0);
  expect(element('[data-fruit-scroll="orange"]').style.visibility).not.toBe("hidden");
  expect(element("[data-scene-orange]").style.visibility).toBe("hidden");
});

test("compact transition preserves the complete collection height after its pin releases", () => {
  const stage = element("[data-collection-stage]");
  Object.defineProperty(stage, "offsetHeight", { configurable: true, value: 2400 });
  const collection = element('[aria-labelledby="collection-title"]');
  Object.defineProperty(element("[data-collection-orange-anchor]"), "getBoundingClientRect", {
    configurable: true, value: () => new DOMRect(-180, 540 + Number(gsap.getProperty(collection, "y")), 400, 400),
  });
  start(true);
  expect(scene).not.toBeNull();
  scene!.progress(1);
  expect(element("[data-landing-scene]").style.height).toBe("var(--scene-content-height)");
  expect(element("[data-landing-scene]").style.getPropertyValue("--scene-content-height")).toBe("2400px");
  expect(Number(gsap.getProperty(element('[aria-labelledby="collection-title"]'), "y"))).toBeCloseTo(0);
  expect(collection.style.transform).toBe("");
  expect(Number(gsap.getProperty(element("[data-scene-orange]"), "y"))).toBeCloseTo(690);
  Object.defineProperty(stage, "offsetHeight", { configurable: true, value: 2900 });
  refreshLayout();
  expect(element("[data-landing-scene]").style.getPropertyValue("--scene-content-height")).toBe("2900px");
  context.revert();
  expect(element("[data-landing-scene]").style.height).toBe("");
  expect(element("[data-landing-scene]").style.getPropertyValue("--scene-content-height")).toBe("");
});

test("an active source hover settles before the shared orange takes over", () => {
  gsap.set(element("[data-hero-orange-hover]"), { scale: 1.09, rotation: 5 });
  start();
  expect(scene).not.toBeNull();
  scene!.time(0.2);
  expect(Number(gsap.getProperty(element("[data-hero-orange-hover]"), "scaleX"))).toBeCloseTo(1);
  expect(Number(gsap.getProperty(element("[data-hero-orange-hover]"), "rotation"))).toBeCloseTo(0);
});

test("hover changes after scene setup are captured when scrolling starts", () => {
  start();
  expect(scene).not.toBeNull();
  scene!.progress(0);
  gsap.set(element("[data-hero-orange-hover]"), { scale: 1.09, rotation: 5 });
  scene!.time(0.1);
  const scale = Number(gsap.getProperty(element("[data-hero-orange-hover]"), "scaleX"));
  expect(scale).toBeGreaterThan(1);
  expect(scale).toBeLessThan(1.09);
  scene!.progress(0);
  expect(element("[data-hero-orange-hover]").style.transform).toBe("");
  gsap.set(element("[data-hero-orange-hover]"), { scale: 1.2, rotation: 5 });
  scene!.time(0.1);
  expect(Number(gsap.getProperty(element("[data-hero-orange-hover]"), "scaleX"))).toBeGreaterThan(1.04);
});

test("a shared image error during travel restores original layers and reverse remains usable", () => {
  start();
  expect(scene).not.toBeNull();
  scene!.progress(0.6);
  element("[data-scene-orange] img").dispatchEvent(new Event("error"));
  expect(element("[data-scene-orange]").style.visibility).toBe("hidden");
  expect(element("[data-collection-orange-anchor]").style.visibility).not.toBe("hidden");
  scene!.progress(0);
  expect(element('[data-fruit-scroll="orange"]').style.visibility).not.toBe("hidden");
});

test("invalidating geometry remeasures the orange destination", () => {
  start();
  expect(scene).not.toBeNull();
  scene!.progress(1);
  Object.defineProperties(element("[data-collection-orange-anchor]"), {
    getBoundingClientRect: { configurable: true, value: () => new DOMRect(50, 450, 300, 300) },
    offsetWidth: { configurable: true, value: 300 },
  });
  // ScrollTrigger refresh resets scrubbed progress before invalidating/reapplying.
  scene!.progress(0).invalidate().progress(1);
  expect(Number(gsap.getProperty(element("[data-scene-orange]"), "x"))).toBeCloseTo(150);
  expect(Number(gsap.getProperty(element("[data-scene-orange]"), "y"))).toBeCloseTo(550);
  expect(Number(gsap.getProperty(element("[data-scene-orange]"), "scaleX"))).toBeCloseTo(3);
});

test("context teardown restores static document flow and original oranges", () => {
  start();
  expect(scene).not.toBeNull();
  scene!.progress(1);
  context.revert();
  expect(element('[aria-labelledby="collection-title"]').style.position).toBe("");
  expect(element('[data-fruit-scroll="orange"]').style.visibility).toBe("");
  expect(element("[data-collection-orange-anchor]").style.visibility).toBe("");
  expect(element("[data-scene-backdrop]").style.opacity).toBe("");
});

test("failed shared image keeps original fruit paths available", () => {
  imageReady(element("[data-scene-orange] img") as HTMLImageElement, false);
  start();
  expect(scene).not.toBeNull();
  scene!.progress(1);
  expect(element("[data-scene-orange]").style.visibility).not.toBe("inherit");
  expect(element('[data-fruit-scroll="orange"]').style.visibility).not.toBe("hidden");
  expect(element("[data-collection-orange-anchor]").style.visibility).not.toBe("hidden");
});
