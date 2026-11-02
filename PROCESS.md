# Engineering process

Updated: 2026-11-02. This is the short project summary.

## Scope

Build one fruit-themed page with three experiences: loading screen, hero, and collection. Focus on load, scroll, hover, and responsive behavior. Real navigation and working CTAs are outside the assessment scope.

## Workflow and AI assistance

Superpowers skills guided planning, debugging, testing, and review. AI assisted implementation and verification; these notes do not imply that the developer has personally reviewed or understood every generated line.

The useful workflow for this project is:

1. Describe the expected behavior and important failure cases.
2. Choose the smallest change that meets the brief.
3. For meaningful logic changes, reproduce the problem or add a focused failing test before implementing the fix.
4. Run relevant checks and inspect visual behavior in a real browser.
5. Record the decision, evidence, and remaining limits briefly.

Keep future planning to a short checklist here. Record significant decisions and verification results rather than every tool call or intermediate attempt.

## Main decisions and reasons

- **GSAP and ScrollTrigger:** coordinate loading, entrance, and reversible scroll timelines using the existing dependencies.
- **Separate animation layers:** let entrance, floating, hover, and scroll effects move independently without overwriting each other's transforms.
- **One travelling orange:** hide the original copies during transfer so the page shows one continuous moving object.
- **Native scrolling:** keep normal wheel and keyboard behavior without adding a smooth-scroll dependency.
- **Responsive fallback:** shorten the pinned transition on compact screens; use normal flow for very short screens and reduced motion.
- **Loading safeguards:** wait for hero images to settle, with a five-second minimum and an eight-second readiness deadline after client effects start. Missing artwork or interrupted travel uses a fade fallback.

## Two useful debugging examples

**Orange hover:** a scroll tween left an inline transform that blocked the CSS hover rule. CSS now owns the hover transform; GSAP changes only its strength before transfer. A regression test reproduces the callback-suppressed rewind that exposed the conflict.

**Resize clipping:** collection height was measured using an old pinned width. Measuring at the new containing width during refresh keeps the final card and footer reachable. A controlled regression and local browser checks verified the correction.

Optional typing and blueberry drop/float effects were removed at the user's request to keep the scope focused.

## Verification and delivery status

- **2026-11-02, after removing optional effects:** `npm test` passed 48 tests; `npm run lint` and `npm run typecheck` passed. Before the branch commit, `npm test` passed 48 tests again, `npm run lint` passed, and `npm run build` passed including TypeScript.
- **2026-11-02, local Chrome:** orange hover, pointer exit, sprite takeover, and hover after scrolling back were checked.
- **2026-10-31, historical browser checks:** representative desktop/tablet/phone sizes, footer reachability after resize, keyboard behavior, slow or failed image requests, reduced motion, and JavaScript-disabled fallback were checked. These observations are not a fresh check of today's checkout.
- Tests use real React/GSAP where relevant, with controlled image readiness, timing, media matching, and geometry. Passing them does not prove native layout or animation smoothness.
- Physical-phone behavior, Safari/Firefox, seamless intermediate resize frames, complete reference fidelity, and sustained 60fps remain unverified.
- The orange hover fix and documentation cleanup are included on `refactor/cleanup-and-bugfixes`. Main and production deployment are outside this branch update; latest source-to-live parity has not been confirmed. See README for demo and repository links.
