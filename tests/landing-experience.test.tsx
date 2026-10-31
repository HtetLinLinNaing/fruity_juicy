// @vitest-environment happy-dom

import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import LandingExperience from "../src/components/LandingExperience";

// Replace only the visual preloader. Completion is deliberately controlled by
// each test, so readiness alone cannot make a test report a successful fade.
// These tests exclude GSAP motion, images, real-browser focus/inert behavior,
// reduced motion, responsive layout, and performance.
vi.mock("../src/components/Preloader", () => ({
  default: ({ ready, onComplete }: { ready: boolean; onComplete: () => void }) => (
    <button data-testid="preloader" disabled={!ready} onClick={onComplete}>
      Finish mock fade
    </button>
  ),
}));

const originalActEnvironment = Object.getOwnPropertyDescriptor(globalThis, "IS_REACT_ACT_ENVIRONMENT");
let root: Root | null;
let container: HTMLDivElement;
let originalScrollLock: boolean;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  originalScrollLock = document.documentElement.classList.contains("page-loading");
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  try {
    unmountPage();
  } finally {
    container.remove();
    document.documentElement.classList.toggle("page-loading", originalScrollLock);
    vi.clearAllTimers();
    vi.useRealTimers();
    if (originalActEnvironment) {
      Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", originalActEnvironment);
    } else {
      Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
    }
  }
});

function renderPage(ready: boolean, autoFocus = false) {
  if (!root) throw new Error("Cannot render after the test page has been unmounted");
  const mountedRoot = root;
  act(() => mountedRoot.render(
    <StrictMode>
      <LandingExperience ready={ready}>
        <input aria-label="Page content" autoFocus={autoFocus} />
      </LandingExperience>
    </StrictMode>,
  ));
}

function getElement<T extends HTMLElement>(selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) throw new Error(`Expected test page element: ${selector}`);
  return element;
}

function finishFade() {
  advanceTime(5000);
  const preloader = getElement<HTMLButtonElement>('[data-testid="preloader"]');
  expect(preloader.disabled).toBe(false);
  act(() => preloader.click());
}

function advanceTime(milliseconds: number) {
  act(() => vi.advanceTimersByTime(milliseconds));
}

function unmountPage() {
  if (!root) return;
  const mountedRoot = root;
  act(() => mountedRoot.unmount());
  root = null;
}

describe("readiness and completion", () => {
  test("pending content stays covered under Strict Mode", () => {
    renderPage(false);

    expect(getElement<HTMLButtonElement>('[data-testid="preloader"]').disabled).toBe(true);
    expect(getElement<HTMLDivElement>("[data-page-content]").inert).toBe(true);
    expect(document.documentElement.classList.contains("page-loading")).toBe(true);
  });

  test("loading starts at the top instead of revealing a restored section boundary", () => {
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const restoration = window.history.scrollRestoration;
    try {
      renderPage(false);
      expect(window.history.scrollRestoration).toBe("manual");
      expect(scroll).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
      expect(scroll).toHaveBeenCalledTimes(1);
      renderPage(true);
      advanceTime(5000);
      expect(scroll).toHaveBeenCalledTimes(1);
      unmountPage();
      expect(window.history.scrollRestoration).toBe(restoration);
    } finally { scroll.mockRestore(); }
  });

  test("already-ready content stays covered until exactly five seconds", () => {
    renderPage(true);
    advanceTime(4999);
    expect(getElement<HTMLButtonElement>('[data-testid="preloader"]').disabled).toBe(true);
    expect(getElement<HTMLDivElement>("[data-page-content]").inert).toBe(true);
    advanceTime(1);

    expect(getElement<HTMLButtonElement>('[data-testid="preloader"]').disabled).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("early readiness stays latched through the minimum and cancels the deadline", () => {
    renderPage(false);
    advanceTime(500);

    renderPage(true);
    renderPage(false);
    advanceTime(4500);

    expect(getElement<HTMLButtonElement>('[data-testid="preloader"]').disabled).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("keeps content protected until the preloader reports completion", () => {
    renderPage(true);
    const content = getElement<HTMLDivElement>("[data-page-content]");

    // Withhold completion: the mock does not assume an animation succeeded.
    advanceTime(10000);
    expect(getElement<HTMLButtonElement>('[data-testid="preloader"]').disabled).toBe(false);
    expect(content.inert).toBe(true);
    expect(document.documentElement.classList.contains("page-loading")).toBe(true);

    finishFade();

    expect(container.querySelector('[data-testid="preloader"]')).toBeNull();
    expect(Boolean(content.inert)).toBe(false);
    expect(document.documentElement.classList.contains("page-loading")).toBe(false);
  });

  test("late readiness changes cannot reopen a completed loader", () => {
    renderPage(true);
    finishFade();

    renderPage(false);
    advanceTime(10000);
    renderPage(true);

    expect(container.querySelector('[data-testid="preloader"]')).toBeNull();
    expect(Boolean(getElement<HTMLDivElement>("[data-page-content]").inert)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("deadline and cleanup", () => {
  test("waits for content that becomes ready after the minimum", () => {
    renderPage(false);
    advanceTime(6000);
    expect(getElement<HTMLButtonElement>('[data-testid="preloader"]').disabled).toBe(true);
    renderPage(true);
    expect(getElement<HTMLButtonElement>('[data-testid="preloader"]').disabled).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("reveals at the original eight-second deadline despite a parent rerender", () => {
    renderPage(false);
    advanceTime(4000);
    renderPage(false);

    advanceTime(3999);
    expect(getElement<HTMLButtonElement>('[data-testid="preloader"]').disabled).toBe(true);
    advanceTime(1);
    expect(getElement<HTMLButtonElement>('[data-testid="preloader"]').disabled).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  test("cancels the deadline and restores page interaction on unmount", () => {
    renderPage(false);
    const content = getElement<HTMLDivElement>("[data-page-content]");

    unmountPage();

    expect(vi.getTimerCount()).toBe(0);
    expect(Boolean(content.inert)).toBe(false);
    expect(document.documentElement.classList.contains("page-loading")).toBe(false);
    advanceTime(10000);
    expect(container.childElementCount).toBe(0);
  });
});

describe("interaction restoration", () => {
  test("completion restores focus to content covered during loading", () => {
    renderPage(false, true);
    const input = getElement<HTMLInputElement>("input");
    expect(document.activeElement).not.toBe(input);

    renderPage(true, true);
    finishFade();

    expect(document.activeElement).toBe(input);
  });

  test("completion does not steal focus moved to another control", () => {
    const otherControl = document.createElement("button");
    document.body.append(otherControl);
    try {
      renderPage(false, true);
      renderPage(true, true);
      otherControl.focus();

      finishFade();

      expect(document.activeElement).toBe(otherControl);
    } finally {
      otherControl.remove();
    }
  });

  test("completion preserves a scroll lock already owned by another caller", () => {
    document.documentElement.classList.add("page-loading");
    renderPage(true);

    finishFade();

    expect(document.documentElement.classList.contains("page-loading")).toBe(true);
  });
});
