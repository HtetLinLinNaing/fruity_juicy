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
- **Loading safeguards:** wait for hero images to settle, with an 800 ms minimum and an eight-second readiness deadline after client effects start. Missing artwork or interrupted travel uses a fade fallback.

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


## Review improvements — 2026-11-02

Approved scope: apply the hiring-review recommendations in this chat. Keep the current fruit composition and choreography; improve how their intent is expressed. Reuse this clean feature checkout and existing dependencies; do not commit, push or deploy.

Implementation checklist:
- [x] Replace order-dependent hero exit arrays with settings keyed by fruit name; protect reordered artwork with a real GSAP regression.
- [x] Name collection reveal/wave milestones in the timeline and use the wave label in the scene coordinator; check forward and reverse wave activation.
- [x] Consolidate desktop collection sizing into one grid formula with named row/height constraints, preserving breakpoint dimensions; inspect in Chrome.
- [x] Apply the approved 800 ms loading minimum, reconcile README status, run tests/lint/typecheck/build, and record fresh evidence separately from historical checks.

Expected outcomes: reordering fruit markup preserves each fruit's exit path; card waves follow the reveal milestone in both scroll directions; desktop/tablet/mobile compositions and footer reachability remain intact. Existing missing-image, reduced-motion, deadline and cleanup behavior must remain protected. Browser checks supplement controlled DOM geometry; they do not establish sustained 60fps.


Fresh verification for these review improvements (2026-11-02):
- `npm test -- tests/scene-motion.test.ts`: the new reordered-fruit regression failed before the fix (strawberry received x=280 instead of -190), then all 11 scene tests passed after the fix.
- Loading tests were updated first and failed against the previous five-second minimum; after changing the minimum to 800 ms, `npm test` passed all 49 tests across five files. The existing deadline, image-failure and exit-completion cases remain in the suite.
- The wave test moves the timeline milestone and checks pause/resume/reverse with real GSAP/ScrollTrigger. Temporarily restoring the old 0.9-second cutoff made all three viewport scenarios fail at the expected pause assertion. The correct implementation was restored and `npm test` passed all 49 tests again.
- `npm run lint`, `npm run typecheck` and `npm run build` passed. Build generated the static home page successfully.
- Local development Chrome at 1440x900 and 1280x650: collection row, captions and footer visible; no horizontal document overflow. At 375x812: hero composition and single-column collection inspected; no horizontal document overflow. Phone-to-tablet resize to 768x1024 preserved the single-column collection and a reachable footer (bottom approximately 976px within the 1024px viewport).
- Separate read-only review of code and test changes found no concrete regressions. It did not run additional checks.
- Not rechecked: production deployment parity, physical phones, Safari/Firefox, slow-network and reduced-motion behavior in a real browser, continuous loading-to-hero reference fidelity, seamless intermediate resize frames and sustained 60fps. Existing controlled tests and historical browser observations do not replace these checks. No commit, push or deployment performed.

## README refresh — 2026-11-03

Documentation-only update: reorganized README around setup, implemented experiences, animation behavior, fallbacks, and delivery status. Checked descriptions against package.json and the page, loading, hero, and collection source. Consolidated historical verification details into links to this file and removed the dated implementation-check paragraph as requested. Source-to-live parity and final submission status remain unconfirmed.

Verification: reviewed the documentation diff, checked README local links and referenced project paths, and ran `git diff --check`. No application tests, build, browser checks, or deployment were run for this documentation-only update. Existing unrelated edits to next-env.d.ts were preserved.
