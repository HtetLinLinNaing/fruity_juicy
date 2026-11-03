# Fruity Juicy

A single-page, fruit-themed landing page for the UI Animation Challenge, inspired by [Fluffy Hugs](https://nft.fluffyhugs.io/) and its [reference recording](https://www.youtube.com/watch?v=74r7-WEB4lo).

- **Live demo:** [fruityjuicy.vercel.app](https://fruityjuicy.vercel.app/)
- **Public repository:** [HtetLinLinNaing/fruity_juicy](https://github.com/HtetLinLinNaing/fruity_juicy)
- **Engineering decisions and verification history:** [PROCESS.md](./PROCESS.md)

The project implements three connected experiences: a loading screen, an animated hero, and a scroll-driven fruit collection. The current `refactor/cleanup-and-bugfixes` branch includes newer fixes and animation improvements. Its parity with the deployed demo has not been confirmed.

## Getting started

Use **Node.js 24.x** and **npm 11.x**. The project records `npm@11.13.0` as its package manager and pins dependencies in `package.json` and `package-lock.json`.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000), or the URL printed by the server. To use another port, run `npm run dev -- --port 3001`.

No environment variables, credentials, backend, or external media service are required. Fruit artwork and the Fredoka font are stored locally; the font licence is in `src/app/fonts/OFL.txt`.

For a production build:

```sh
npm run build
npm run start
```

## Implemented experiences

| Experience | Behavior |
| --- | --- |
| Loading screen | Nine fruits wave in alternating directions while the centre orange rolls. Once ready, the orange travels into its hero position. |
| Hero | Headline and artwork entrances, independently floating fruit, individual fruit hover, and button hover and keyboard focus. Reloading returns to the top. |
| Collection | Framed Strawberry, Pear, and Grapefruit portraits. Scrolling transfers the orange, blends the background, and reveals the heading and cards in sequence. Cards wave gently and respond to hover. |

These experiences share one page. The “Meet the fruits” button is a visual interaction with no navigation action, as permitted by the brief. Authentication, backend features, and real navigation are outside the project scope.

## Stack and design choices

| Tool | Purpose |
| --- | --- |
| Next.js 16.4.3 and React 19.3.0 | App Router foundation, server-rendered content, and client-side readiness and animation coordination. |
| TypeScript | Component contracts, image readiness, and loading phases. |
| GSAP 3.15.0 and ScrollTrigger | Entrance, idle, and reversible scroll timelines, with responsive cleanup. |
| Tailwind CSS 4 and CSS Modules | Utility styling alongside detailed component compositions and responsive rules. Shared tokens live in `src/app/globals.css`. |
| Vitest and Happy DOM | Controlled tests for readiness, timing, cleanup, scene coordination, and resize regressions. |

Existing dependencies are reused. Scrolling stays native, with no additional smooth-scroll library.

## Loading and animation behavior

The loader waits for hero images to settle, including errors, and has an **800 ms minimum** after its client effect starts. An independent **eight-second readiness deadline** starts the exit if requests stall. These timers exclude application JavaScript download and startup time; the deadline starts the exit rather than guaranteeing dismissal within eight seconds of navigation. Collection images do not gate loading.

When the orange artwork and destination are available, a fixed sprite travels into the hero over 1.25 seconds. Missing artwork, an unavailable target, reduced motion, or interruption uses a fade fallback. Content stays inert and scrolling remains locked until the visual exit completes.

Entrance, floating, hover, and scroll transforms use separate nested elements. A shared orange replaces its source and destination copies during the scene transfer. Fruit exit paths are keyed by name, and named timeline milestones coordinate collection reveals and card waves in both scroll directions.

| Viewport | Scroll behavior |
| --- | --- |
| Above 900 px wide and at least 560 px tall | Pinned transition lasting two viewport heights. |
| At least 400 px tall, with width at most 900 px or height below 560 px | Shorter pin lasting 1.25 viewport heights, followed by normal scrolling through the collection. |
| Below 400 px tall | Ordinary card reveals without pinning. |

Scrolling upward reverses the connected timeline. The visible scrollbar is hidden while native vertical scrolling remains enabled.

## Responsive layout and fallbacks

- The hero rearranges its text and artwork on smaller screens. Collection cards form a desktop row and stack at tablet and phone widths.
- Layout measurements refresh after fonts settle and on viewport changes. Compact refresh measures the collection at its current containing width to keep the final card and footer reachable.
- The CTA has a visible keyboard-focus outline.
- `prefers-reduced-motion` disables repeating motion and pinned choreography, leaving content in normal flow.
- A `noscript` fallback hides the loader and exposes static content when JavaScript is disabled.
- Failed images are hidden while their reserved spaces and readable captions remain.

## Performance approach

Motion primarily animates transforms and opacity. Layout is measured during setup and refresh, and animation updates stay in GSAP rather than React state each frame. Images reserve dimensions and use responsive Next.js image delivery; hero artwork loads eagerly and collection media loads lazily.

Animation contexts, listeners, and timers are cleaned up. Hero idle motion pauses when the hero is out of view or the document is hidden; card waves pause before collection entry and while the document is hidden.

Historical Chrome traces at normal speed and 4× CPU slowdown both reported CLS 0, but the slowdown trace showed substantial main-thread activity. Sustained 60fps and performance on low-powered physical devices have not been established.

## Validation and delivery status

Run the available checks with:

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

Tests use real React components and GSAP/ScrollTrigger where relevant, with controlled geometry, media matching, image readiness, and clocks. Wrapper/page tests substitute the visual preloader; dedicated preloader tests use real GSAP. These checks protect coordination and failure cases but do not establish native browser layout, networking, or frame performance.

Historical browser checks on 2026-10-31 covered representative responsive sizes, reverse scrolling, keyboard interaction, slow or failed image requests, reduced motion, and JavaScript-disabled fallback. Detailed evidence and its limits are in [PROCESS.md](./PROCESS.md).

Physical-phone touch and rotation, Safari/Firefox, continuous loader-to-hero reference fidelity, seamless intermediate resize frames, and sustained 60fps remain unverified. Changing reduced-motion preference during the loader flight is also unverified. Browser emulation does not replace physical-device checks.

No deployment was performed for the latest branch improvements. The live demo and public repository links are provided above; latest source-to-live parity and final submission status have not been confirmed.

## Project structure

```text
src/app/                         Page, layout, global styles, and local font
src/components/
  FruityLanding.tsx              Scene coordination and ScrollTrigger lifecycle
  sceneMotion.ts                 Orange transfer and collection choreography
  LandingExperience.tsx          Readiness, loading phases, and interaction lock
  Preloader.tsx                  Fruit wave, rolling orange, and exit fallback
  Hero.tsx                       Hero composition, readiness, and entrance
  Collection.tsx                 Framed portraits and decorative artwork
  *.module.css                   Colocated component styles
public/fruits/                   Local fruit artwork
tests/                           Loading, readiness, motion, and resize regressions
PROCESS.md                       Decisions and dated verification evidence
```
