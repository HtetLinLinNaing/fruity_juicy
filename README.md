# Fruity Juicy

A fruit-themed landing page for an animation-focused technical interview challenge, inspired by [Fluffy Hugs](https://nft.fluffyhugs.io/). The assignment emphasizes motion, responsive layout, performance, and maintainable code.

**Status:** In progress. The fruit wave preloader and responsive animated hero use only the supplied images in public/fruits. The locally hosted Fredoka font is retained. The collection showcase is implemented; deployed on Vercel; final browser acceptance remains pending.

- Repository: [fruity_juicy](https://github.com/HtetLinLinNaing/fruity_juicy)
- Live website: [fruityjuicy.vercel.app](https://fruityjuicy.vercel.app/).
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
| Content / collection section with scroll animation | Implemented: three framed fruit portraits, desktop pin and layered scroll reveal, stacked mobile reveals, hover and static reduced-motion fallback; final browser acceptance pending |

The loader transitions into the hero after image readiness or the loading deadline. The collection completes the three implemented experiences. Deployment is available. Final browser acceptance and performance profiling remain before submission.

## Technology choices

- **Next.js and React:** retain the existing App Router foundation. Page and layout are Server Components; the hero is server-rendered through a client boundary for image readiness and animation.
- **TypeScript:** strict checking for component inputs and loading phases.
- **Tailwind CSS and component CSS Modules:** Tailwind keeps the simple loader concise. Hero.module.css sits beside Hero.tsx and contains the detailed fruit composition, responsive layout, typography, and hover/focus styles. Shared tokens and the page loading lock stay in globals.css; GSAP owns animation on separate nested layers.
- **GSAP:** synchronized repeating fruit transforms and the overlay opacity fade, with scoped cleanup.
- **Vitest and Happy DOM (development only):** render the loading wrapper with React DOM and test readiness, exact timeout boundaries, and cleanup. The visual preloader is mocked so these tests do not depend on animation frames.

Installed versions are recorded in package.json. The existing lint stack uses ESLint 9 because the original setup recorded compatibility constraints with ESLint 10; recheck compatibility before upgrading it.

## Animation and loading

All nine current local fruit images (including pear and grapefruit) share equal-width slots in one centered row. Adjacent fruits move vertically in opposite directions, reversing together every 0.7 seconds with a 12px displacement and no stagger. The orange occupies the centre slot and also rolls on a separate transform layer. The dark-green LOADING… label stays stationary. Reduced motion keeps the row still.

Hero imports orange, strawberry, pear, grapefruit, and blueberry from public/fruits. Loader assets are imported from the same folder. Static imports give replaced artwork new content-hashed URLs on rebuild, avoiding stale optimized images under reused filenames.

Hero owns image readiness and reports it through FruityLanding to LandingExperience. Each of the eight hero image instances settles on load or error; duplicate events are ignored and cached results are checked after hydration. The wrapper keeps the loading deadline and content interaction separate from the visual Preloader, which receives `ready` and calls `onComplete` after its fade. The loader stays visible for at least five seconds; settled hero images and the minimum duration must both be satisfied before exit begins. With loaded, visible hero/source artwork and no reduced-motion preference, one fixed orange sprite travels from the loading row into the measured hero orange position over1.25 seconds while other loading layers fade. A successful landing skips only the main hero orange entrance. Reduced motion, failed/pending artwork or an unavailable/offscreen target uses a short fade instead; resize/live reduced motion or image failure during travel aborts safely to a fade. An independent 8-second deadline also starts exit if requests stall. Decorative loader fruits do not gate page readiness. Failed images are hidden without removing their slots; heading and button remain available even if every image fails. Future below-the-fold collection media must not block readiness.

LandingExperience exposes completed reveal state through a small context. Hero copy and fruit entrance layers stay hidden until the overlay finishes; then a GSAP timeline reveals the heading, supporting copy, button, and fruit layers. Separate nested layers own entrance, idle movement, and fixed composition rotations so their transforms do not overwrite each other. Desktop floating is reduced on smaller screens. Idle animation pauses when the hero leaves view or the document is hidden; media-query changes and unmount revert scoped animations and listeners. Crossing a breakpoint does not replay the entrance. Reduced motion skips hero entrance and floating; the noscript fallback displays the static hero.

Reduced motion disables repeating movement and uses a0.15-second fade instead of the orange flight. Preference changes are handled during loading. Scrolling and covered-content interaction are restored after dismissal or cleanup. With JavaScript disabled, a fallback hides the overlay.

**Scrolling:** native browser scrolling with GSAP ScrollTrigger. After loading completes, above900px wide and at least560px tall, one shared hero/collection scene pins for two viewport-heights with scrub0.6. Hero copy exits while individual fruit spreads outward on separate scroll layers; the background blends from cream into green without a sliding curtain. A shared orange rolls from the hero anchor into the collection foreground and back when scrolling reverses; its original copies remain hidden during travel. Portraits arrive from distinct directions with different scale/rotation, and the foreground orange travels farther than background blueberries. Scrolling backward reverses the desktop timeline. Collection frames gently wave on nested layers separate from scroll and hover; mobile uses smaller movement, and reduced motion is static. The wave pauses before its scene is visible and when the document is hidden. Narrow and short viewports at least400px tall also use a connected upward transition and shared rolling orange: pin for1.25 viewport-heights with lighter scrub, then release so the full stacked collection scrolls naturally. Only very short viewports under400px use ordinary reveals without pinning. Reduced motion leaves static content. Scoped matchMedia teardown restores styles and pin spacing on mode changes/unmount. Measurements refresh after fonts settle. No smoothing dependency is added.

## Responsiveness and performance

The loader row scales to the viewport with at least 24px horizontal padding and a maximum width of 480px. The hero uses a side-by-side composition above 900px and stacks text above artwork at tablet/mobile widths, with additional spacing/type adjustments below 480px. Compact tablets use a side-by-side layout. Normal phone and desktop screens fit the viewport; unusually short screens retain scrolling to keep content readable. The eight hero image layers keep reserved square slots; the cropped foreground orange is hidden on smaller screens. The collection uses three framed portraits on desktop and a stacked layout at tablet/mobile widths. Its pinned composition scales with available viewport height. The page now scrolls vertically to reach the collection.

- Animate transforms and opacity rather than layout dimensions.
- Reserve square image slots to avoid movement as images arrive.
- Serve optimized, responsive Next.js images instead of full-resolution PNGs. Hero and loader images load eagerly because they belong to the initial experience; only the main orange has high fetch priority. Collection media is lazy-loaded and never gates the loader.
- Keep frame updates inside GSAP rather than React state.
- Dispose of animation contexts, timers, and event listeners on cleanup.

A 60fps target still needs profiling on the completed page and representative mobile devices. Responsive screenshots alone do not establish frame-rate performance.

## Project structure

```text
src/app/                         Layout, metadata, shared tokens, page entry
src/components/FruityLanding.tsx Page coordination and scoped scroll choreography
src/components/FruityLanding.module.css
                                 Shared scene with static normal-flow fallback
src/components/sceneMotion.ts   Shared orange/background/card choreography
src/components/Collection.tsx    Named fruit portraits, wave layers and lazy media
src/components/Collection.module.css
                                 Framed composition, mobile layout and hover
src/components/Hero.tsx          Hero readiness, composition, entrance and idle animation
src/components/Hero.module.css   Scoped hero layout, fruit placement and interactions
src/components/LandingExperience.tsx
                                 Page readiness, loading phase, content interaction
src/components/Preloader.tsx     Fruit wave/roll, shared orange flight and exit fallback
src/components/Preloader.module.css
                                 Fixed sprite and independent transform layers
tests/preloader.test.tsx         RealGSAP completion/fallback/cleanup with controlled DOM geometry
tests/landing-experience.test.tsx
                                 Loading phase, deadline, and interaction tests
tests/hero.test.tsx              Real page/image settlement with controlled overlay completion
public/fruits/                   Current loader/hero/collection fruit source images
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

The loader and hero use only the developer's original public/fruits artwork. The page makes no requests to public/hero-fruits. Loading / hero / collection follows the brief's recommended set. The hero uses the approved pale-yellow/green concept; a locally hosted Fredoka variable font provides rounded lettering without runtime font-service requests. The font and OFL license come from the official Google Fonts repository (https://github.com/google/fonts/tree/main/ofl/fredoka). The collection adapts the framed display scene in the official reference recording around 11 seconds; it does not reproduce the full 3D sequence. The CTA intentionally performs no navigation and has hover and keyboard-focus states. No backend, authentication, or additional application routes are planned. Public repository visibility and the final live URL must be verified before submission.

## Collection verification — 2026-10-31

`npm test` passed 20 tests; lint, type checking and production build passed. New real-page integration tests first failed for missing collection content, then passed after implementation: one main and ordered sections, three named portraits, pending collection media excluded from loader readiness at 4999/5000ms, explicit overlay completion before interaction, and failed portrait recovery. Only the visual overlay is substituted; media events and reduced motion are controlled in Happy DOM. These tests do not prove real motion or networking.

The initial static composition was checked at 320×568, 375×812, 768×1024, 900×620, 1280×720, 1440×900 and 1920×1080 without horizontal overflow. Production desktop checks observed real loader completion, one pin spacer, hidden cards before entry and visible cards during the pinned interval. Resize checks observed spacer removal at compact sizes. Browser inspection then exposed oversized pinned-stage height and transient scrollbar-width overflow; viewport-height sizing and a stable scrollbar gutter were added. **Those final visual corrections still require browser rechecking:** browser access became disabled in Work settings. Final reverse/hover, keyboard, live reduced-motion, no-JavaScript, real delayed/failed media, unmount cleanup and performance profiling remain pending. No 60fps or complete fidelity claim is made.

Continuous scene revision (2026-10-31): user approved overlapping hero/collection choreography. The new shared-scene test failed before implementation and passed afterward; npm test passed21 tests, lint/typecheck/build passed. The new motion has NOT been visually checked because browser use remains disabled in Work settings. Earlier collection screenshots/observations describe the previous separate-section timeline, not this revision. Final fidelity, screen fit, breakpoint cleanup, keyboard/reduced-motion behavior and performance require browser acceptance.

Rolling-orange handoff (2026-10-31): the loader and hero share one visible travelling orange, using the existing orange asset. New tests exercise realGSAP timelines with explicit progress and simulated image readiness, rectangle sizes and media preference. They protect completion ordering, missing/failed/pending/offscreen fallback, interrupted travel and cleanup; they do not verify real frame motion, endpoint alignment, networking or rendering. Browser access remains disabled in Work settings, so this handoff still needs visual acceptance on desktop/mobile and during resize.

Waving-card/scroll-orange revision (2026-10-31): removed the full-panel curtain after the developer delegated that choice. RealGSAP tests cover single-visible-orange swaps, forward/reverse travel, invalidated destination measurements, context cleanup and failed shared-image fallback using controlled DOM geometry. They do not establish browser stacking, responsive visual fit, native scrolling or actual frame performance. Browser use still reports disabled in Work settings; visual acceptance remains pending.

The main hero orange stays steady on pinned desktop so scroll travel has a stable source pose. Its hover settles before takeover and returns to CSS when scrolling back. A shared-image error during travel restores the original artwork paths. Other hero fruits retain idle movement. Source hover, late error and foreground-copy behavior are covered by realGSAP tests with the same geometry/rendering limitations above.

Screenshot-driven startup/short-desktop fix (2026-10-31): the loader resets restored scrolling to the hero top before paint, without resetting it again on readiness. It restores the previous history setting on unmount. Connected desktop motion now includes560–699px tall browser viewports with a smaller collection composition. A realGSAP/ScrollTrigger test at1280×650 and a one-time scroll/reset cleanup test failed before the fix and passed afterward. Reduced-motion/mobile/very-short fallback remains static or normalflow. Browser visual verification remains pending.

Narrow-screen follow-up (2026-10-31): screenshots exposed that the prior implementation omitted the connected transition below901px. Connected motion now includes572×827 and375×812 with reduced travel and a brief pin. The pinned root reserves the entire stacked collection height, including the lower cards, then releases for native scrolling. Its height refreshes after fonts/resize; the shared orange ends near the first collection view rather than the bottom of the long list. Reduced motion stays static and under400px height falls back to normalflow. The dark card-bottom shadow was removed, and horizontal overflow is clipped while preserving vertical scrolling. RealGSAP tests cover activation, retained full height, destination geometry and cleanup; actual layout/visual verification is still pending because browser control is disabled.

The page scrollbar is visually hidden at the developer’s request. Scrolling still uses native wheel, touch and keyboard input; no custom scrolling dependency is used.
