# Loading Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkboxes for tracking. The user selected native execution.

**Goal:** Implement the alternating fruit loading screen and every acceptance criterion in PRD 02.

**Architecture:** Keep the root layout and placeholder page as Server Components. Render a scoped client Preloader alongside a server-rendered content container. Separate loading deadlines and single-completion behavior from the DOM animation so they can be tested deterministically using Node's built-in test runner; verify visual and accessibility behavior in a real browser.

**Tech Stack:** Existing Next.js, TypeScript and Tailwind CSS; GSAP as the sole new runtime dependency. Node's built-in tests require no test framework dependency.

**Spec:** [PRD 02 - Loading Screen](./prd.md)

## Global Constraints

- All 10 existing fruit files stay in the PRD's exact order, with original filenames, proportions and transparency.
- One horizontal row, white overlay, stationary blue #2845B8 LOADING.. label, centered group.
- Neighboring fruits move in opposite directions simultaneously, with no stagger.
- Full cycle 1.4 seconds; each direction 0.7 seconds; displacement at most 12px either side of the slot center; smooth ease-in-out.
- Minimum normal display 1200ms; begin dismissal by 8000ms regardless of asset readiness; normal fade 500ms.
- Reduced motion: no repeating movement, fade at most 150ms, minimum may be skipped.
- Keep at least 24px horizontal viewport padding and row maximum approximately 480px. Fit at 320, 375, 768 and 1440px.
- No new hero, content sections, scroll libraries, routing, external assets or deployment.
- Preserve the user's existing uncommitted docs, fruit assets and empty src/components/Preloader.tsx file; implementation fills that file.
- Use the selected Desktop checkout. Create a local feature branch for implementation rather than changing main; do not push or rewrite history.

## Review Focus

- Cached images completing before effects attach must still settle and respect the normal minimum.
- A never-settling image or decode promise must not prevent the independent 8000ms deadline.
- Reduced-motion preference changes during loading or fading must stop repeating motion and honor the short exit.
- Early unmount and React development effect cleanup must restore prior scroll/inert state and prevent stale completion.
- Server HTML and JavaScript-disabled browsing must expose the underlying page without a permanent overlay or inert content.

## File Responsibilities

- src/components/Preloader.tsx: client overlay markup, exact asset order, image readiness, accessibility, scoped GSAP animation and teardown.
- src/components/preloader-lifecycle.ts: timer/readiness state controller, single dismissal and cancellation; no DOM or GSAP dependency.
- tests/preloader-lifecycle.test.mjs: meaningful deterministic tests using Node's runner and controlled timers, importing the TypeScript controller with Node 24 type stripping.
- src/app/layout.tsx: integrate the loader, stable content target and no-JavaScript fallback while remaining server-rendered.
- src/app/globals.css: only any required no-JavaScript fallback styling; use Tailwind for loader layout.
- package.json / package-lock.json: pinned GSAP dependency and a portable Node-based test command; no test framework dependency.
- README.md / docs/README.md: loader behavior, verification commands and layer links/status.
- docs/02-loading-screen/verification.md: actual commands, browser evidence and any remaining limitations.

### Task 1: Tested Loading Lifecycle

**Interfaces:**
- Export createLoadingLifecycle(options: { onDismiss: () => void; reducedMotion: boolean; minDurationMs?: number; maxWaitMs?: number }): { ready(): void; setReducedMotion(reduced: boolean): void; dispose(): void }.
- Defaults are 1200ms minimum and 8000ms maximum; dismissal is a one-shot signal to begin the view's fade. The controller starts when mounted and retains no work after dispose.
- ready() means document readiness plus every image decode/load/error has settled. Reduced motion skips the minimum, but does not bypass pending readiness; the maximum remains independent.

- [x] Record Git baseline and preserve uncommitted work, create the feature branch in place, and run baseline lint/type checks. Review bundled Next.js guidance and current GSAP docs already identified for this task.
- [x] Write lifecycle tests first. Use Node's built-in mock timers or a small test-local controlled clock; keep time injection out of the production API unless unavoidable.
- [x] Assert: early ready does not dismiss at 1199ms and dismisses once at 1200ms; ready at 3000ms dismisses then; no ready dismisses at 8000ms; repeated ready/deadline calls do not repeat dismissal; reduced motion with ready dismisses without the minimum; changing reduced motion releases a ready loader; dispose before readiness/deadline prevents every callback. Test the exact boundary values.
- [x] Run the tests and observe the expected failure from the absent controller.
- [x] Implement the minimal controller and test script, then rerun the full suite until every lifecycle assertion passes. Run lint and typecheck for the changed files.
- [x] Record outcomes and decisions in the plan's ignored progress ledger. Commit only task-owned changes if appropriate; never stage the user's unrelated work.

### Task 2: Fruit Overlay and Page Integration

**Interfaces:**
- Consume createLoadingLifecycle from Task 1.
- Export default Preloader({ contentId }: { contentId: string }): React.ReactNode from src/components/Preloader.tsx.
- layout.tsx supplies contentId="page-content" and wraps existing children in an element with id="page-content". Do not import the page into the client component.
- The overlay has a stable data attribute for browser selection, one accessible loading status and decorative fruit images. Keep fixed layout slots while images translate.

- [x] Write browser checks before integration: the current page must fail the assertion that a loader with 10 ordered fruit images is initially visible. Keep browser verification scripts in ignored scratch rather than adding a browser-test framework.
- [x] Install and pin the compatible stable GSAP release using npm. Build the overlay in the existing empty Preloader.tsx with next/image eager, unoptimized local PNGs and reserved dimensions. Image failure or decode rejection hides the affected visual while preserving its slot; cached complete images settle correctly.
- [x] Create a GSAP context scoped to this loader. Use a single synchronized from/to animation with opposite per-index y values, repeat indefinitely and yoyo; use GSAP for the opacity exit. Target every fruit simultaneously. At most one repeating animation and one exit may be active per loader.
- [x] Start the controller independently of image promises. Track required document readiness and all image settlements; call ready only when both are satisfied. Guard stale asynchronous callbacks after cleanup.
- [x] Respect live reduced-motion preference changes: kill/reset the repeating animation, retain stationary fruits, and shorten any active exit to at most 150ms. Restore movement only if reduced motion is disabled before dismissal begins.
- [x] During the client loading lifecycle preserve and block scrolling and the content target's interaction with inert. On completion/unmount restore previous values rather than assuming blank styles or false inert. Clean up GSAP contexts, listeners, timers and abortable image handling.
- [x] Render the overlay consistently in server/client markup. Include a no-JavaScript fallback that hides the overlay without relying on JavaScript to remove inert; apply interaction blocking only after hydration. Ensure decorative images do not duplicate status announcements.
- [x] Integrate without replacing the placeholder or making the root layout/page client components. Use responsive equal-width slots, at least 24px viewport padding, a maximum row width near 480px and sufficient movement/text clearance.
- [x] Browser checks at 320/375/768/1440: ten images in exact order, one row, no overflow/clipping, white background, blue stationary text. Hold readiness when sampling two motion phases: same-parity fruit transforms agree, adjacent transforms oppose, and they reverse together with no stagger.
- [x] Browser lifecycle checks: cached reload; controlled slow asset; failed asset/decode; asset request that never settles (dismiss by 8500ms including normal fade, with a small browser scheduling tolerance); repeated completion signals; document readiness; blocked keyboard/pointer content and restored scrolling afterward.
- [x] Browser accessibility/cleanup checks: reduced motion initially and toggled while loading/fading, JavaScript disabled, development effect cleanup without duplicated loops, early unmount with old overflow/inert restored. Use an isolated temporary harness for unmount checks if necessary; ship no test-only route or runtime debug API.
- [x] Run full Node tests, npm run lint, npm run typecheck and npm run build. Verify the loader and placeholder in development and production. Stop only servers started for verification.
- [x] Update README, documentation index and verification.md with observed results. Check every PRD criterion against evidence; leave unperformed checks explicitly pending.
- [x] Request one fresh read-only review of the complete implementation and evidence. Fix Important/Critical findings with a failing regression test and a passing full suite; record any minor deferrals and rulings. Do not publish or merge without authorization.

## Plan Self-Review

Task 1 owns minimum/maximum timing, reduced-motion readiness and single completion. Task 2 owns rendering, assets, GSAP, integration, browser behavior and documentation. Each review-focus condition is covered by the named lifecycle or browser checks. No external reference site, staggered wave, or additional scrolling dependency is part of implementation.
