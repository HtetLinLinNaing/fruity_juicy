# PRD 02 - Loading Screen

**Project:** Fruity Juicy

**Status:** Implemented and verified

**Layer:** Loading experience

**Depends on:** [PRD 01 - Project Setup](../01-project-setup/prd.md)

## 1. Objective

Create a loading screen with all 10 local fruit images in one horizontal row. Neighboring fruits move vertically in opposite directions and reverse together, producing a continuous alternating up-and-down motion.

This PRD defines the loading layer. Saving it does not start implementation.

## 2. Design Decisions

- Cover the page with a full-screen white background.
- Center the complete loading group horizontally and vertically.
- Display all 10 fruits in one horizontal row, retaining their listed order.
- Place stationary, blue, widely spaced `LOADING..` text below the row.
- Animate neighboring fruits in opposite directions at the same time.
- Fade out the complete overlay when loading finishes, revealing the underlying page.

## 3. Fruit Assets and Order

Use these existing files without cropping, stretching, renaming, or replacing them:

| Position | File |
| --- | --- |
| 1 | `public/fruits/apple-fruit.png` |
| 2 | `public/fruits/avocado.png` |
| 3 | `public/fruits/banana.png` |
| 4 | `public/fruits/blueberry.png` |
| 5 | `public/fruits/cherry.png` |
| 6 | `public/fruits/coconut.png` |
| 7 | `public/fruits/grapes.png` |
| 8 | `public/fruits/orange.png` |
| 9 | `public/fruits/strawberry.png` |
| 10 | `public/fruits/watermelon.png` |

Preserve proportions and transparency within equally sized image slots.

## 4. Animation Behavior

All fruits start together. Odd positions share one motion; even positions share its opposite. Reverse both groups together and repeat smoothly. Do not stagger starts or create a traveling wave. Keep the row's layout slots fixed while the fruit images move.

Use GSAP for the repeating vertical motion and overlay fade-out. Use its repeat/reverse controls rather than a hand-written animation loop or CSS keyframe animation.

### Initial Tuning Values

These defaults may be adjusted during visual review while preserving the agreed motion.

| Property | Initial value |
| --- | --- |
| Full repeat cycle | 1.4 seconds, including forward and reverse movement |
| Time per direction | 0.7 seconds |
| Delay between neighboring fruits | None |
| Maximum vertical displacement from each slot's center | 12px in either direction |
| Easing | Smooth ease-in-out |
| Loading text color | Blue, initially `#2845B8` |
| Minimum loading-screen duration | 1.2 seconds |
| Maximum wait before dismissal starts | 8 seconds |
| Normal exit fade | 0.5 seconds |

Reserve enough space for the full vertical movement so no fruit overlaps the text or clips against its container. Animate transforms and opacity without changing layout dimensions on each frame.

## 5. Responsive Layout

- Keep all fruits in one row on mobile, tablet, and desktop.
- Limit the row to approximately 480px on large screens.
- Maintain at least 24px of horizontal viewport padding.
- Shrink image slots and gaps as needed on smaller screens; do not wrap or hide fruits to fit.
- Keep fruit slots equally sized and preserve the images' aspect ratios.
- Keep the row and label centered with sufficient separation for the movement.
- Avoid horizontal overflow, layout shifts, and clipped animation.
- Support at least 320px-wide viewports; verify at 320, 375, 768, and 1440px.

## 6. Loading Lifecycle

1. Display the loading screen on a full document open or reload.
2. Request the local fruit images and track each image until it has loaded and decoded or failed.
3. Treat the underlying page as ready when its document and required initial content are ready. In this layer the underlying content is the existing Fruity Juicy placeholder; no hero content is introduced.
4. Begin dismissal when readiness conditions are met and the 1.2-second minimum has elapsed.
5. If loading has not settled after 8 seconds, begin dismissal anyway so the overlay cannot block the page indefinitely. This deadline must not depend on a successful image response.
6. Fade out the entire overlay, remove it, and restore normal scrolling and interaction.

The normal maximum includes an 8-second wait followed by the 0.5-second fade. Readiness, failure and timeout signals must converge on one dismissal, without duplicate completion callbacks.

Cached assets must still satisfy the minimum display time. Do not use a fixed delay as the only completion condition. Do not display a percentage or imply measurable loading progress.

## 7. Accessibility and Failure Handling

- Announce an accessible loading status once; avoid repeating announcements on animation cycles.
- Treat the fruit images as decorative and keep the visible label readable.
- Prevent interaction with covered content while the overlay is active.
- Under reduced-motion preferences, show the fruit row without repeated movement and dismiss immediately or with a fade of at most 0.15 seconds. The minimum display duration may be skipped in this mode.
- Handle preference changes while loading without leaving a movement loop active.
- A failed image must settle its loading state, retain its layout slot, and show no broken-image symbol. Other fruits continue normally.
- Restore scrolling and interaction after dismissal or component cleanup, including early unmount.
- If JavaScript is unavailable, keep the underlying page accessible rather than leaving a blocking overlay.

## 8. Technical Boundaries

- Keep Next.js, TypeScript, App Router and Tailwind CSS from the existing project.
- Add GSAP as the animation dependency for this layer.
- Keep loading state and animation isolated from the underlying page content.
- Use a client boundary only where loading state, browser events, and GSAP require it.
- Scope animation targets to the loader instance.
- Clean up animations, timers and loading listeners on unmount; React development behavior must not create duplicate loops.
- Preserve the existing Server Component page/layout architecture wherever client behavior is unnecessary.
- ScrollTrigger, Framer Motion, Lenis and Locomotive Scroll are deferred. Scroll-driven animation and smooth scrolling belong to later layers.

## 9. Acceptance Criteria

- [x] All 10 local fruits appear in the listed order in one horizontal row.
- [x] Odd-position fruits move up while even-position fruits move down, then reverse together.
- [x] No staggered start delay or traveling wave is present.
- [x] GSAP controls the repeating motion and the exit fade.
- [x] The white background, centered group and blue `LOADING..` label match the agreed direction.
- [x] The label stays still while fruits animate.
- [x] The layout fits at 320, 375, 768 and 1440px without wrapping, cropping, clipping or horizontal overflow.
- [x] Cached images and delayed image responses both complete correctly.
- [x] A failed image neither displays a broken-image symbol nor blocks dismissal.
- [x] Loading begins dismissal by the 8-second deadline even if an image never settles.
- [x] Dismissal occurs once and reveals the existing placeholder.
- [x] Reduced-motion users receive a stationary fruit row and a brief or immediate dismissal.
- [x] The underlying page remains accessible when JavaScript is disabled.
- [x] Scrolling and interaction work after dismissal and early unmount.
- [x] No hydration warnings, browser errors, leaked timers or duplicate animation loops occur.
- [x] Existing lint, type-check and production-build commands pass.

## 10. Out of Scope

Hero design, content sections, scroll animations, smooth scrolling, navigation, backend services, new production artwork, CI, and deployment.

See the [implementation plan](./implementation-plan.md) and [verification report](./verification.md) for the completed work and verification limits.
