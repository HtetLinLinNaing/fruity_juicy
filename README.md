# Fruity Juicy

A fruit-themed landing page for an animation-focused technical interview challenge, inspired by [Fluffy Hugs](https://nft.fluffyhugs.io/). The assignment emphasizes motion, responsive layout, performance, and maintainable code.

**Status:** In progress. The fruit wave preloader and responsive animated hero use only the supplied images in public/fruits. The locally hosted Fredoka font is retained. The collection section and deployment remain pending.

- Repository: [fruity_juicy](https://github.com/HtetLinLinNaing/fruity_juicy)
- Live website: not deployed yet.
- Engineering decisions and AI collaboration: [PROCESS.md](./PROCESS.md).

## Run locally

Use Node.js 24.x and npm 11.x, as specified in package.json.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000), or the address printed by the development server. If needed, choose another port with `npm run dev -- --port 3001`.

```sh
npm test              # Loading wrapper and hero-readiness component tests
npm run lint          # ESLint; warnings fail the check
npm run typecheck     # TypeScript without emitted files
npm run build         # Production build
npm run start         # Serve a completed production build
```

Dependencies are pinned in package.json and package-lock.json. Use npm to preserve the lockfile. No credentials or external media services are required.

## Challenge scope

One page, with no additional application routes or functional navigation required. The proposed three-part experience is:

| Part | Current state |
| --- | --- |
| Loading screen | Implemented: nine alternating fruit images and overlay fade |
| Hero with entrance reveal | Implemented: fruit scene, headline reveal, floating artwork, individual fruit hover and button hover/focus |
| Content / collection section with scroll animation | Pending; design and behavior still to be agreed |

The loader transitions into the hero after image readiness or the loading deadline. Scroll-driven animation and the collection remain pending. This repository is not yet a complete challenge submission.

## Technology choices

- **Next.js and React:** retain the existing App Router foundation. Page and layout are Server Components; the hero is server-rendered through a client boundary for image readiness and animation.
- **TypeScript:** strict checking for component inputs and loading phases.
- **Tailwind CSS and a hero CSS Module:** Tailwind keeps the simple loader concise. Hero.module.css sits beside Hero.tsx and contains the detailed fruit composition, responsive layout, typography, and hover/focus styles. Shared tokens and the page loading lock stay in globals.css; GSAP owns animation on separate nested layers.
- **GSAP:** synchronized repeating fruit transforms and the overlay opacity fade, with scoped cleanup.
- **Vitest and Happy DOM (development only):** render the loading wrapper with React DOM and test readiness, exact timeout boundaries, and cleanup. The visual preloader is mocked so these tests do not depend on animation frames.

Installed versions are recorded in package.json. The existing lint stack uses ESLint 9 because the original setup recorded compatibility constraints with ESLint 10; recheck compatibility before upgrading it.

## Animation and loading

All nine current local fruit images (including pear and grapefruit) share equal-width slots in one centered row. Adjacent fruits move vertically in opposite directions, reversing together every 0.7 seconds with a 12px displacement and no stagger. The dark-green LOADING… label stays stationary. Reduced motion keeps the row still.

Hero imports orange, strawberry, pear, grapefruit, and blueberry from public/fruits. Loader assets are imported from the same folder. Static imports give replaced artwork new content-hashed URLs on rebuild, avoiding stale optimized images under reused filenames.

Hero owns image readiness and passes it to LandingExperience. Each of the eight hero image instances settles on load or error; duplicate events are ignored and cached results are checked after hydration. The wrapper keeps the loading deadline and content interaction separate from the visual Preloader, which receives `ready` and calls `onComplete` after its fade. The loader stays visible for at least five seconds; settled hero images and the minimum duration must both be satisfied before the 0.5-second fade starts. An independent 8-second deadline also starts the fade if requests stall. Decorative loader fruits do not gate page readiness. Failed images are hidden without removing their slots; heading and button remain available even if every image fails. Future below-the-fold collection media must not block readiness.

LandingExperience exposes completed reveal state through a small context. Hero copy and fruit entrance layers stay hidden until the overlay finishes; then a GSAP timeline reveals the heading, supporting copy, button, and fruit layers. Separate nested layers own entrance, idle movement, and fixed composition rotations so their transforms do not overwrite each other. Desktop floating is reduced on smaller screens. Idle animation pauses when the hero leaves view or the document is hidden; media-query changes and unmount revert scoped animations and listeners. Crossing a breakpoint does not replay the entrance. Reduced motion skips hero entrance and floating; the noscript fallback displays the static hero.

Reduced motion disables repeating movement and limits the exit fade to 0.15 seconds. Preference changes are handled during loading. Scrolling and covered-content interaction are restored after dismissal or cleanup. With JavaScript disabled, a fallback hides the overlay.

**Smooth scrolling:** native browser scrolling; no smoothing library or scroll-driven animation is introduced for this hero. Choose the collection transition when that section is designed.

## Responsiveness and performance

The loader row scales to the viewport with at least 24px horizontal padding and a maximum width of 480px. The hero uses a side-by-side composition above 900px and stacks text above artwork at tablet/mobile widths, with additional spacing/type adjustments below 480px. Compact tablets use a side-by-side layout. Normal phone and desktop screens fit the viewport; unusually short screens retain scrolling to keep content readable. The eight hero image layers keep reserved square slots; the cropped foreground orange is hidden on smaller screens. The collection layout remains pending.

- Animate transforms and opacity rather than layout dimensions.
- Reserve square image slots to avoid movement as images arrive.
- Serve optimized, responsive Next.js images instead of full-resolution PNGs. Hero and loader images load eagerly because they belong to the initial experience; only the main orange has high fetch priority. Future collection media should be lazy-loaded.
- Keep frame updates inside GSAP rather than React state.
- Dispose of animation contexts, timers, and event listeners on cleanup.

A 60fps target still needs profiling on the completed page and representative mobile devices. Responsive screenshots alone do not establish frame-rate performance.

## Project structure

```text
src/app/                         Layout, metadata, shared tokens, page entry
src/components/Hero.tsx          Hero readiness, composition, entrance and idle animation
src/components/Hero.module.css   Scoped hero layout, fruit placement and interactions
src/components/LandingExperience.tsx
                                 Page readiness, loading phase, content interaction
src/components/Preloader.tsx     Fruit rendering, reduced motion, GSAP loop and exit
tests/landing-experience.test.tsx
                                 Loading phase, deadline, and interaction tests
tests/hero.test.tsx              Real page/image settlement with controlled overlay completion
public/fruits/                   Current loader/hero fruit source images
src/app/fonts/                  Locally hosted Fredoka variable font and OFL license
AGENTS.md                        Instructions for AI-assisted contributions
PROCESS.md                       Decisions, collaboration, verification evidence
```

## Test scope

Run `npm test`. The loading suite renders the real LandingExperience under React Strict Mode with a simulated DOM and clock. The hero suite renders the real page, hero, wrapper, and Next.js image components with controlled image completion. Only the visual Preloader is replaced: its test button receives `ready`, and each test explicitly decides when to call `onComplete`. The mock does not assume the real animation succeeded. Image network outcomes and reduced-motion preference are controlled in the simulated DOM; real fetch, decode, and motion still need browser checks.

| Expected behavior | Component evidence |
| --- | --- |
| Pending content stays protected; already-ready content waits at least five seconds | Readiness tests check the preloader's input and page interaction state |
| Readiness starts a one-way reveal and cancels the deadline | Readiness-change test includes a later false signal |
| The page waits for exit completion before unlocking | Withheld-completion test advances time without invoking the callback, then explicitly finishes |
| Missing readiness cannot block beyond the eight-second wait | Deadline test checks 7999/8000ms, including an unrelated parent rerender |
| Unmount cancels scheduled work and restores interaction | Cleanup test checks timers, inert state, and the scroll-lock class |
| Completion restores prior focus without stealing newly moved focus | Dedicated focus scenarios |
| A pre-existing scroll lock remains owned by its caller | Lock-preservation scenario |
| All distinct hero images must settle; duplicate events cannot reveal early | Failed-image and duplicate-event scenario |
| Successful or cached images can start reveal immediately | Load and pre-hydration cache scenarios |
| Failed artwork recovers when a later request succeeds | Error-then-load visibility scenario |
| Stalled hero media cannot prevent usable content | Page-level eight-second deadline scenario |

These tests check the wrapper's contract, not actual GSAP fades, image loading/failure, live reduced-motion behavior, browser-enforced keyboard/inert behavior, responsive layout, or frame rate. A missing real animation-completion callback could still leave content blocked; a passing mock test does not rule that out. Use real-browser integration checks for the visual preloader and page working together, and profiling for performance claims. Dated verification evidence and intentional failure checks are recorded in PROCESS.md.
## Verification and assumptions

2026-10-31 hero checks: all 15 component tests, lint, type checking, production build, and diff formatting passed. Production-browser observations covered 320, 375, 768, and 1440px, loaded artwork, loader handoff, keyboard focus, button hover, and resize visibility. No horizontal overflow or browser warnings/errors were observed. These checks do not establish 60fps, cross-browser behavior, real network failure recovery, live reduced-motion switching, or JavaScript-disabled behavior. See PROCESS.md for precise evidence and limits.

Latest loader/hero revision (2026-10-31): 17 component tests, lint, type checking, production build, and diff checks passed. The restored alternating wave with all nine current fruits, current artwork requests, orange hover, and responsive screen fit were observed in the production browser; see PROCESS.md for limits.

Run the checks above before submitting. Browser acceptance checks should cover 320, 375, 768, and 1440px; cached, delayed, failed, and stalled assets; reduced motion; JavaScript disabled; restored scrolling; and absence of application errors. See [PROCESS.md](./PROCESS.md) for dated evidence and its limits.

The loader and hero use only the developer's original public/fruits artwork. The page makes no requests to public/hero-fruits. Loading / hero / collection follows the brief's recommended set. The hero uses the approved pale-yellow/green concept; a locally hosted Fredoka variable font provides rounded lettering without runtime font-service requests. The font and OFL license come from the official Google Fonts repository (https://github.com/google/fonts/tree/main/ofl/fredoka). The collection design is still pending. The CTA intentionally performs no navigation and has hover and keyboard-focus states. No backend, authentication, or additional application routes are planned. Public repository visibility and the final live URL must be verified before submission.
