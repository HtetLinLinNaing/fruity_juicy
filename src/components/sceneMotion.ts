import { gsap } from "gsap";

// Build choreography independently of its ScrollTrigger driver so reverse and
// teardown can be checked with the real animation engine and controlled geometry.
export function createSceneTransition(main: HTMLElement, compact = false): {
  timeline: gsap.core.Timeline; refreshLayout: () => void; dispose: () => void;
} | null {
  const sceneRoot = main.querySelector<HTMLElement>("[data-landing-scene]");
  const hero = main.querySelector<HTMLElement>('[aria-labelledby="hero-title"]');
  const collection = main.querySelector<HTMLElement>('[aria-labelledby="collection-title"]');
  const stage = main.querySelector<HTMLElement>("[data-collection-stage]");
  if (!sceneRoot || !hero || !collection || !stage) return null;
  const select = <T extends Element = HTMLElement>(selector: string) => main.querySelector<T>(selector);
  const all = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, main);
  const source = select<HTMLElement>("[data-hero-orange-anchor]");
  const sourceLayer = select('[data-fruit-scroll="orange"]');
  const destination = select<HTMLElement>("[data-collection-orange-anchor]");
  const sprite = select<HTMLElement>("[data-scene-orange]");
  const roll = select("[data-scene-orange-roll]");
  const spriteImage = sprite?.querySelector("img");
  const sourceImage = source?.querySelector("img");
  const canShare = !!(source && destination && sourceLayer && sprite && roll &&
    spriteImage?.complete && spriteImage.naturalWidth && sourceImage?.complete && sourceImage.naturalWidth);

  const compactHeight = () => Math.max(window.innerHeight, hero.offsetHeight, stage.offsetHeight);
  if (compact) gsap.set(sceneRoot, { "--scene-content-height": compactHeight() + "px" });
  gsap.set(sceneRoot, { height: compact ? "var(--scene-content-height)" : "100svh", overflow: "clip" });
  if (compact) gsap.set(hero, { position: "absolute", top: 0, left: 0, width: "100%" });
  gsap.set(hero, { backgroundColor: "transparent" });
  gsap.set(collection, { position: "absolute", inset: 0, backgroundColor: "transparent", autoAlpha: 0 });
  const refreshLayout = () => {
    // Only measure during refresh, never on animation frames. The scene retains
    // the tall collection's full height so all cards can scroll after unpinning.
    // ScrollTrigger restores captured pin styles during refresh. Keep its saved
    // height as an expression; updating the custom property survives that restore.
    if (compact) gsap.set(sceneRoot, { "--scene-content-height": compactHeight() + "px" });
  };
  gsap.set(stage, { isolation: "auto" });
  gsap.set(all("[data-collection-gallery], [data-collection-heading], [data-collection-signoff]"), { zIndex: 4 });
  gsap.set(sprite, { autoAlpha: 0 });
  const scene = gsap.timeline({ paused: true });
  let dispose = () => {};
  scene.fromTo(select("[data-scene-backdrop]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.05, ease: "power1.inOut" }, 0.12);
  scene.to(select("[data-hero-scroll-copy]"), { y: -100, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 0);
  scene.to(hero.querySelectorAll("header, footer"), { autoAlpha: 0, duration: 0.45 }, 0.1);
  scene.to(select("[data-hero-scroll-art]"), { autoAlpha: 0, duration: 0.6 }, canShare ? 0.2 : 0.1);
  scene.to(all('[data-fruit-scroll]:not([data-fruit-scroll="orange"])'), {
    x: (index: number) => [-190, 240, 280, -160, -80, 200, -320][index],
    y: (index: number) => [-260, -220, 180, 150, 240, -130, 140][index],
    rotation: (index: number) => index % 2 ? -24 : 28,
    scale: 0.85, duration: 1.1, ease: "power1.inOut",
  }, 0.05);
  // Reveal content after the hero controls have faded; the background blends
  // in place, without moving a full-height green panel over the hero.
  scene.set(collection, { autoAlpha: 1 }, 0.65);
  if (compact) scene.fromTo(collection, { y: () => Math.min(140, window.innerHeight * 0.18) }, {
    y: 0, duration: 1.1, ease: "power2.out", clearProps: "transform",
  }, 0.45);
  scene.fromTo(select("[data-collection-heading]"), { y: 40, autoAlpha: 0 }, {
    y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out",
  }, 0.65);
  all("[data-collection-card]").forEach((card, index) => {
    scene.fromTo(card, { x: [-180, 0, 180][index], y: [100, 180, 100][index],
      scale: [0.72, 0.62, 0.72][index], rotation: [-18, 12, 18][index], autoAlpha: 0,
    }, { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, 0.8 + index * 0.12);
  });
  scene.fromTo(select("[data-collection-signoff]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 1.6);

  if (canShare && source && destination && sprite) {
    const transfer = gsap.timeline();
    const hover = select("[data-hero-orange-hover]");
    if (hover) {
      const settleHover = gsap.to(hover, { scale: 1, rotation: 0, parseTransform: true, duration: 0.2, ease: "power1.out" });
      transfer.add(settleHover, 0);
      transfer.eventCallback("onStart", () => { settleHover.invalidate(); });
      transfer.eventCallback("onReverseComplete", () => { gsap.set(hover, { clearProps: "transform" }); });
    }
    // Coordinates use the centres of rotated anchors and their unrotated sizes.
    // Functions are reevaluated when ScrollTrigger invalidates on refresh.
    const pose = (anchor: HTMLElement) => {
      const box = anchor.getBoundingClientRect();
      const rootBox = sceneRoot.getBoundingClientRect();
      const enteringOffset = compact && destination.contains(anchor) ? Number(gsap.getProperty(collection, "y")) || 0 : 0;
      return { x: box.left + box.width / 2 - rootBox.left - 50,
        y: box.top + box.height / 2 - rootBox.top - 50 - enteringOffset, scale: anchor.offsetWidth / 100 };
    };
    transfer.set(destination, { autoAlpha: 0 }, 0);
    transfer.set(all('[data-fruit-scroll="orange"], [data-fruit-scroll="foreground"]'), { autoAlpha: 0 }, 0.2);
    transfer.set(sprite, { autoAlpha: 1 }, 0.2);
    transfer.fromTo(sprite, { x: () => pose(source).x, y: () => pose(source).y, scale: () => pose(source).scale }, {
      x: () => pose(destination).x, y: () => pose(destination).y, scale: () => pose(destination).scale,
      transformOrigin: "50% 50%", duration: 1.8, ease: "power1.inOut", immediateRender: true,
    }, 0.2);
    transfer.fromTo(roll, { rotation: () => Number(gsap.getProperty(source, "rotation")) || 0 }, {
      rotation: () => 720 + (Number(gsap.getProperty(destination, "rotation")) || 0),
      duration: 1.8, ease: "power1.inOut",
    }, 0.2);
    scene.add(transfer, 0);
    const restoreOriginals = () => { transfer.revert(); };
    spriteImage!.addEventListener("error", restoreOriginals, { once: true });
    dispose = () => spriteImage!.removeEventListener("error", restoreOriginals);
  }
  all("[data-collection-depth]").filter(layer => !canShare || !destination?.contains(layer)).forEach((layer, index) => {
    scene.fromTo(layer, { xPercent: index % 2 ? -20 : 20, y: 45, scale: 0.85, rotation: 12 }, {
      xPercent: 0, y: 0, scale: 1, rotation: 0, duration: 1.1, ease: "power1.out",
    }, 0.7 + index * 0.16);
  });
  scene.to({}, { duration: 0.3 });
  return { timeline: scene, refreshLayout, dispose };
}
