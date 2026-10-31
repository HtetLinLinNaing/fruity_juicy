# Fruity Juicy

A fruit-themed landing page for an animation-focused technical interview challenge, inspired by [Fluffy Hugs](https://nft.fluffyhugs.io/). The assignment emphasizes motion, responsive layout, performance, and maintainable code.

**Status:** In progress. The fruit preloader is implemented; the page behind it is currently a placeholder.

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
npm test              # Loading wrapper component tests
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
| Loading screen | Implemented: ten alternating fruit animations and overlay fade |
| Hero with entrance reveal | Pending; design and behavior still to be agreed |
| Content / collection section with scroll animation | Pending; design and behavior still to be agreed |

Hover interactions, scroll animation, and the transition into the final hero are still pending. This repository is not yet a complete challenge submission.

## Technology choices

- **Next.js and React:** retain the existing App Router foundation. Layout and page content remain Server Components; browser-dependent loading behavior has its own client boundary.
- **TypeScript:** strict checking for component inputs and loading phases.
- **Tailwind CSS:** responsive spacing, sizing, and layout without a separate stylesheet per component.
- **GSAP:** synchronized repeating fruit transforms and the overlay opacity fade, with scoped cleanup.
- **Vitest and Happy DOM (development only):** render the loading wrapper with React DOM and test readiness, exact timeout boundaries, and cleanup. The visual preloader is mocked so these tests do not depend on animation frames.

Installed versions are recorded in package.json. The existing lint stack uses ESLint 9 because the original setup recorded compatibility constraints with ESLint 10; recheck compatibility before upgrading it.

## Animation and loading

Ten local fruit images share equally sized slots in a single centered row. Adjacent fruits move in opposite directions simultaneously, using a 0.7-second movement in each direction, a 12px displacement, and no stagger. The label stays still.

The page owns readiness and passes it to LandingExperience. That wrapper keeps the loading deadline and content interaction separate from the visual Preloader, which receives `ready` and calls `onComplete` after its fade. There is no minimum display time: readiness starts the 0.5-second fade immediately. An independent 8-second deadline also starts the fade if readiness never arrives. Decorative loader fruits do not gate page readiness; failed fruits are hidden while their slots remain. The current text-only placeholder is immediately ready. When a hero is built, its essential assets must supply the readiness signal; below-the-fold collection images should not block it.

Reduced motion disables repeating movement and limits the exit fade to 0.15 seconds. Preference changes are handled during loading. Scrolling and covered-content interaction are restored after dismissal or cleanup. With JavaScript disabled, a fallback hides the overlay.

**Smooth scrolling:** no smoothing library is installed. The placeholder uses native browser scrolling; the scroll-animation approach will be chosen with the remaining sections.

## Responsiveness and performance

The loader keeps one fruit row from 320px upward, with at least 24px horizontal padding and a maximum row width of 480px. Smaller screens shrink the slots and gaps. The final hero and collection layouts remain pending.

- Animate transforms and opacity rather than layout dimensions.
- Reserve square image slots to avoid movement as images arrive.
- Request loader images eagerly because they are needed immediately; heavy content media and lazy loading will be considered when those sections exist.
- Keep frame updates inside GSAP rather than React state.
- Dispose of animation contexts, timers, and event listeners on cleanup.

A 60fps target still needs profiling on the completed page and representative mobile devices. Responsive screenshots alone do not establish frame-rate performance.

## Project structure

```text
src/app/                         Layout, metadata, global styles, placeholder page
src/components/LandingExperience.tsx
                                 Page readiness, loading phase, content interaction
src/components/Preloader.tsx     Fruit rendering, reduced motion, GSAP loop and exit
tests/landing-experience.test.tsx
                                 Loading phase, deadline, and interaction tests
public/fruits/                   Ten local fruit images
AGENTS.md                        Instructions for AI-assisted contributions
PROCESS.md                       Decisions, collaboration, verification evidence
```

## Test scope

Run `npm test`. The suite renders the real LandingExperience under React Strict Mode with a simulated DOM and clock. Only the visual Preloader is replaced: its test button receives `ready`, and each test explicitly decides when to call `onComplete`. The mock does not assume the real animation succeeded.

| Expected behavior | Component evidence |
| --- | --- |
| Pending content stays protected; already-ready content can reveal immediately | Readiness tests check the preloader's input and page interaction state |
| Readiness starts a one-way reveal and cancels the deadline | Readiness-change test includes a later false signal |
| The page waits for exit completion before unlocking | Withheld-completion test advances time without invoking the callback, then explicitly finishes |
| Missing readiness cannot block beyond the eight-second wait | Deadline test checks 7999/8000ms, including an unrelated parent rerender |
| Unmount cancels scheduled work and restores interaction | Cleanup test checks timers, inert state, and the scroll-lock class |
| Completion restores prior focus without stealing newly moved focus | Dedicated focus scenarios |
| A pre-existing scroll lock remains owned by its caller | Lock-preservation scenario |

These tests check the wrapper's contract, not actual GSAP fades, image loading/failure, live reduced-motion behavior, browser-enforced keyboard/inert behavior, responsive layout, or frame rate. A missing real animation-completion callback could still leave content blocked; a passing mock test does not rule that out. Use real-browser integration checks for the visual preloader and page working together, and profiling for performance claims. Dated verification evidence and intentional failure checks are recorded in PROCESS.md.
## Verification and assumptions

Run the checks above before submitting. Browser acceptance checks should cover 320, 375, 768, and 1440px; cached, delayed, failed, and stalled assets; reduced motion; JavaScript disabled; restored scrolling; and absence of application errors. See [PROCESS.md](./PROCESS.md) for dated evidence and its limits.

The brief permits original artwork and branding, so this project uses fruit assets. The proposed loading / hero / collection selection follows the brief's recommended set; final section designs need confirmation. CTAs may remain non-navigating but need hover and keyboard-focus states. No backend, authentication, or additional application routes are planned. Public repository visibility and the final live URL must be verified before submission.
