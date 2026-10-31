# Fruity Juicy

A single-page, fruit-themed landing page for the UI Animation Challenge, inspired by [Fluffy Hugs](https://nft.fluffyhugs.io/) and its [reference recording](https://www.youtube.com/watch?v=74r7-WEB4lo).

- **Live website:** [fruityjuicy.vercel.app](https://fruityjuicy.vercel.app/)
- **Public repository:** [HtetLinLinNaing/fruity_juicy](https://github.com/HtetLinLinNaing/fruity_juicy)
- **Decisions and dated verification:** [PROCESS.md](./PROCESS.md)

The three requested experiences are implemented and deployed. A collection resize correction has also been verified in a local production build; confirmation on the live production deployment is still pending.

## Setup

Use **Node.js 24.x** and **npm 11.x**, as specified in package.json.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000), or the URL printed by the server. To choose another port:

```sh
npm run dev -- --port 3001
```

To run the production build:

```sh
npm run build
npm run start
```

Validation commands:

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

Dependencies are pinned in package.json and package-lock.json. No environment variables, credentials, backend or external media service are needed.

## Three implemented experiences

| Experience | Implementation |
| --- | --- |
| Loading screen | Nine local fruits wave in alternating directions while the centre orange rolls. The stationary loading label uses the hero's green colour. When ready, the orange travels into its hero position. |
| Hero | Headline and artwork entrance, independently floating fruit, individual fruit hover, button hover and keyboard focus. Reloading returns to the top. |
| Collection | Three framed portraits: Strawberry, Pear and Grapefruit. Scrolling carries the orange into the collection, blends the background and reveals the heading and cards in sequence. Cards gently wave and respond to hover. |

These are three experiences within one page. The CTA intentionally has no navigation action, in keeping with the brief.

## Libraries and styling

| Choice | Reason |
| --- | --- |
| Next.js and React | Retain the existing App Router foundation, server-render the page and coordinate client-side readiness and animation. |
| TypeScript | Check component contracts, image readiness and loading phases. |
| GSAP and ScrollTrigger | Coordinate entrance, idle and scroll-driven timelines, reversible orange travel and responsive cleanup. |
| Tailwind CSS and CSS Modules | Use utilities for simple styling and colocated modules for detailed compositions, responsive rules and hover states. Shared tokens live in globals.css. |
| Vitest and Happy DOM | Test readiness, deadlines, cleanup and animation coordination without relying on network timing. |

Current versions are recorded in package.json. The rounded Fredoka font is hosted locally, with its OFL licence in src/app/fonts. All fruit artwork comes from public/fruits.

## Animation and scrolling

The loading wrapper waits for hero images to settle, successfully or with an error, and enforces a five-second minimum after the client loading effect starts. An independent eight-second deadline starts the exit if hero requests stall. Neither timer includes the time needed to download and start the application JavaScript.

When the orange artwork and destination are available, a fixed sprite travels from the loader into the hero over 1.25 seconds. Missing artwork, an unavailable target, reduced motion or interruption uses a fade fallback. Content remains inert and scrolling stays locked until the visual exit completes. Collection images do not gate the loader.

Entrance, floating, scroll and hover transforms use separate nested elements so they can work together. One visible shared orange replaces its source and destination copies during the scene transfer.

Scrolling remains native; no additional smooth-scroll library is used. ScrollTrigger's scrubbed timeline gives the animation a gradual response while retaining wheel and keyboard scrolling.

- Wide viewports above 900px and at least 560px tall use a pinned scene lasting two viewport heights.
- Compact viewports at least 400px tall use a shorter pin, an upward collection reveal and then normal scrolling through the stacked cards.
- Viewports below 400px tall use ordinary reveals without pinning.
- Scrolling upward reverses the connected timeline.
- The visible scrollbar is hidden, while native vertical scrolling remains enabled.

## Responsiveness and accessibility

The hero uses a desktop composition and rearranges text and artwork for smaller screens. Collection cards form a row on desktop and stack on tablet and phone widths. Card dimensions and typography adapt to the available space.

Measurements refresh after fonts settle and on viewport changes. During compact refresh, collection height is measured at the current containing width rather than the previous pinned width, keeping the last card and footer reachable.

The button has a visible keyboard-focus outline. With prefers-reduced-motion enabled, repeating motion and pinned choreography are disabled and content remains in normal flow. A noscript fallback hides the loader and exposes static content when JavaScript is disabled. Failed images are hidden while preserving their reserved spaces and readable captions.

## Performance approach

- Animate transform and opacity for motion; measure layout during setup and refresh rather than every animation frame.
- Keep animation updates inside GSAP instead of updating React state each frame.
- Reserve image dimensions to limit layout movement.
- Use responsive Next.js images with content-hashed source assets.
- Load initial artwork eagerly and collection media lazily.
- Revert animation contexts and remove listeners and timers on cleanup.
- Pause idle movement when its scene is out of view or the document is hidden; pause card waves before collection entry and while the document is hidden.

Normal and 4× CPU-slowdown scrolling traces were recorded in Chrome. Content remained navigable and both traces reported CLS 0. The slowdown trace showed substantial main-thread activity. Continuous 60fps, low-powered physical-device performance and complete reference fidelity are not claimed.

## Verification — 2026-10-31

| Check | Evidence and limits |
| --- | --- |
| Automated checks | 47 tests passed; lint and production build, including TypeScript, passed. |
| Responsive layout | Browser checks at 320×568, 375×812, 572×827, 768×1024, 1280×650 and 1440×900. No horizontal document overflow at measured widths. |
| Scene interaction | Orange transfer, reverse and rapid direction changes, keyboard scrolling, visible CTA focus and representative fruit/card hover checked. |
| Resize correction | Reproduced clipped collection footer after phone-to-tablet resize; added a failing regression, fixed the measurement and confirmed footer reachability in local development and production builds. Live production recheck is pending. |
| Slow network | Deployed site completed loading with Chrome's 3G profile and cache disabled. |
| Failed artwork | Blocked real optimized-image requests. Loading completed, failed images stayed hidden, captions and reserved card spaces remained usable, and the footer stayed reachable. |
| Reduced motion | Live preference change and reload checked in Chrome: no pin spacers or repeating card transforms, with content reachable. Changing preference during the loader flight remains unverified. |
| JavaScript disabled | Reloaded with JavaScript disabled: static hero, collection and footer remained readable and scrollable, with the loader hidden. |
| Performance | Recorded 18.32 seconds at normal speed and 16.05 seconds with 4× CPU slowdown. Frame-rate distribution and continuous 60fps were not quantified. |
| Delivery | Repository opened signed out. Vercel's current production deployment was verified against main commit f0b8df3; the newer resize correction still needs production confirmation. |

Automated suites use real React components and GSAP/ScrollTrigger where relevant. Happy DOM geometry, image completion, media matching and clocks are controlled. Wrapper/page tests substitute the visual preloader to exercise its completion contract; dedicated preloader tests use real GSAP. These tests protect coordination and failure cases but do not prove native browser layout, networking or frame performance.

Remaining checks are physical-phone touch and rotation, Safari/Firefox, a continuous loader-to-hero fidelity review, seamless intermediate resize frames, and representative low-powered-device frame performance. Browser emulation is not a physical-device test. Detailed observations and historical results are retained in [PROCESS.md](./PROCESS.md).

## Assumptions

- The reference guides motion and transitions; the brief permits original fruit artwork and branding.
- Loader, hero and collection satisfy the requested three experiences.
- This is one page with no real navigation, working CTA, authentication or backend.
- Static, readable content is the fallback for reduced motion, failed artwork and disabled JavaScript.
- The five-second loader minimum is an intentional presentation choice; the eight-second deadline starts exit rather than guaranteeing dismissal eight seconds after navigation.
- No full 3D reconstruction of the reference or verified 60fps claim is made.

## Project structure

```text
src/app/                         Page, layout, global styles and local font
src/components/
  FruityLanding.tsx              Scene coordination and ScrollTrigger lifecycle
  sceneMotion.ts                Orange transfer and collection choreography
  LandingExperience.tsx         Readiness, loading phases and interaction lock
  Preloader.tsx                 Fruit wave, rolling orange and exit fallback
  Hero.tsx                      Hero composition, readiness and entrance
  Collection.tsx                Framed portraits and decorative artwork
  *.module.css                  Colocated component styles
public/fruits/                   Local fruit artwork
tests/                           Loading, readiness, motion and resize regressions
PROCESS.md                       Decisions and dated verification evidence
```
