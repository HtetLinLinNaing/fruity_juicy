# Engineering process

This file records decisions and evidence from the work. AI assistance is part of the workflow; generated code and claims still need review and verification.

## How changes are made

1. Inspect the existing implementation and clarify the intended result.
2. Compare meaningful alternatives and agree on scope before substantial changes.
3. Make a focused change that can be reviewed and explained.
4. Verify the behavior with appropriate tests or browser checks.
5. Record the result, tradeoffs, and remaining limitations here; use focused commits when committing.

Keep this record short. Add entries for significant decisions, not every prompt or tool call. Attribute AI work accurately and distinguish code inspection, automated tests, and manual checks.

## Decisions carried forward

| Decision | Reason and tradeoff |
| --- | --- |
| Retain Next.js, TypeScript, and Tailwind | Build on the existing foundation. A single-page challenge could use a smaller stack, but replacing the foundation is outside this cleanup. |
| Use GSAP for the loader | One animation system controls both the synchronized movement and fade. It requires explicit lifecycle cleanup. |
| Separate loading timing from the component | The controller can be tested without a browser; DOM, animation, and accessibility integration still need browser checks. |
| Keep an independent loading deadline | Failed or stalled assets cannot block interaction indefinitely. The page may be revealed before every image settles. |
| Use local fruit assets and system fonts | Avoid external media/font requests in the current implementation. |
| Defer smooth-scrolling dependencies | The current placeholder does not need them. Choose after the remaining motion design is agreed. |

## 2026-10-30 — Earlier implementation evidence

The previous setup and loading-screen reports recorded the following results. These are historical reports consolidated during the documentation cleanup, not newly reproduced browser evidence:

- Setup: installation, lint, type checking, production build, development and production serving passed. Responsive checks covered 375, 768, and 1440px.
- Loader: 10 lifecycle tests passed. Development and production browser scenarios covered 320, 375, 768, and 1440px, alternating transforms, cached/delayed/failed/stalled images, decode failures, live reduced-motion changes, and the no-JavaScript fallback.
- A temporary unmount harness checked animation cleanup, scroll/inert restoration, and focus restoration. The reports recorded a scroll-restoration defect found in review, reproduced, and corrected.
- The old reports recorded no application errors or hydration warnings in those scenarios, and an audit result of zero vulnerabilities at that time.

**Limits:** temporary browser scripts and harnesses were removed, so these checks are not a committed, repeatable browser suite. Physical screen-reader announcement behavior was not tested. Historical audit results do not describe current dependency security. No completed-page frame-rate profile or deployment verification is recorded.

The detailed original documents remain available in Git history.

## 2026-10-31 — Documentation consolidation

**Intent:** make the repository easier for an interviewer to assess while retaining an honest record of engineering decisions and AI collaboration.

**Alternatives:** README only; README plus this short process record; or separate requirements, plans, and verification reports. The developer selected the middle option and approved documentation cleanup before code refactoring.

**Approved scope:** consolidate useful documentation into README.md, PROCESS.md, and AGENTS.md; remove redundant tracked documents; preserve application behavior, tests, assets, and Git history.

**Execution plan:** inspect tracked files and existing evidence; rewrite the three documents; remove only the seven superseded Markdown files; check links and scope; run the existing lifecycle tests and record the observed result.

**AI contribution:** inspected the implementation and prior reports, proposed the documentation options, and performed the approved consolidation. The developer directed the goal, selected the approach, and approved the scope. This entry does not claim a developer code review or interview understanding that has not occurred.

**Verification:** `npm test` passed all 10 lifecycle tests on 2026-10-31. `git diff --check` passed. Local Markdown link targets were checked. The final diff contains no changes to application source, tests, dependencies, or assets. The pre-existing modification to generated next-env.d.ts was preserved. Browser checks, lint, type checking, and production build were not rerun for this documentation-only change.

**Next:** agree on the next code change and explain its behavior and tradeoffs before implementation. Hero, collection, hover effects, scroll animation, final performance profiling, and deployment remain pending.

## 2026-10-31 — Remove artificial loading delay

**Decision:** the developer chose to start the loader exit as soon as required content is ready, without a minimum display duration. The independent 8-second maximum wait remains. Tradeoff: cached loads may show the loader only briefly.

**Change:** removed the minimum timer, elapsed-time tracking, and motion preference from the loading controller. Reduced motion still controls movement and fade duration in Preloader.tsx. The controller now handles readiness, a single dismissal, the maximum wait, and disposal.

**Verification:** updated tests first; three assertions failed against the old minimum-delay behavior. After implementation, all 7 updated lifecycle tests passed. Lint, type checking, production build, and diff formatting checks passed. The first type check caught two obsolete controller calls; these were removed before the successful checks. Browser behavior was not rechecked in this change.

**Remaining integration:** readiness currently means the document and loader fruit images have settled. Connect essential hero assets to readiness when the hero is built; do not wait for below-the-fold collection media. The maximum wait must reveal usable content or an asset fallback. No hero, fallback artwork, or entrance animation was added in this change.

## 2026-10-31 — Preloader readability and readiness boundary

**Approved design:** the page determines essential content readiness; Preloader receives `ready` and `onComplete`, displays loading while pending, and reports completion after its fade. Keep the independent deadline and reduced motion. Decorative loader fruits do not gate hero readiness. No hero is introduced by this refactor.

**Plan:** exercise the readiness contract against the old component; replace DOM asset observation with caller readiness and declarative image failure handling; let a small page-level client wrapper own content interaction and loader removal while preserving server-rendered page content; run lifecycle, browser, lint, type, and build checks; remove the temporary browser-check route; update documentation.

**Constraints:** no new dependencies, no generic helper hierarchy, preserve fruit order/layout/motion and no-JavaScript access, no commit/push/deployment. Keep the page wrapper because it owns a different responsibility; do not conceal the old effect in a custom hook.

**Implementation:** Preloader now has only visual responsibilities: fruit markup, a motion-preference-aware GSAP loop, and an exit fade that calls the latest `onComplete`. The page-level LandingExperience owns loading / revealing / complete phases, the independent deadline, interaction protection, and loader removal. Page and layout remain Server Components. The placeholder passes ready immediately because it has no essential media. Removed manual DOM image readiness, document readiness listeners, and the loader's content-ID dependency. Native image error handling hides failed decorative fruits.

**Fresh evidence:** the temporary browser harness first reproduced the old component beginning exit while parent readiness was false. After refactoring, pending readiness kept the animation active; readiness triggered one completion with the latest callback. Opposite fruit transforms were sampled. Normal completion, deadline completion without readiness, early wrapper unmount, and direct-loader unmount during its fade were checked. Normal and timeout completion removed inert and the scroll-lock class. Fruit slots fit within the viewport at 320, 375, 768, and 1440px (fractional layout measurements require subpixel tolerance).

**Final checks:** all 7 lifecycle tests, ESLint, TypeScript, production build, and diff formatting passed. The production browser reached the complete phase with no loader, inert content, scroll lock, or console warnings/errors. Page widths 320, 375, 768, and 1440px had no horizontal overflow. Server HTML inspection confirmed content is not initially inert and the noscript fallback hides the overlay. The temporary route was removed; the production build lists only / and the framework not-found page. A fresh read-only reviewer found no Important/Critical issue.

**Limits and tradeoffs:** live reduced-motion changes and JavaScript-disabled browsing were inspected in code/HTML but not rerun in a browser in this refactor. The dedicated page-loading class owns scrolling for this page and preserves inline styles without rewriting them; a future integration that sets conflicting inline overflow with !important would need a coordinated lock. Browser checks used a temporary harness, not a committed browser-test suite. Essential hero readiness, actual hero entrance, and fallback artwork remain future work. No dependencies, commits, pushes, or deployments were added.

## 2026-10-31 — Consolidate loading timing into the page wrapper

**Approved scope:** remove the separate loading controller and keep its eight-second safeguard in LandingExperience. Keep readiness and completion one-way, cancel pending timers on readiness/unmount, and preserve interaction restoration. Leave the visual preloader and noscript placement unchanged.

**Approach and plan:** render the real wrapper in component tests; establish its current behavior; move the timer into a loading-phase effect with cleanup; remove the controller/ref and obsolete controller tests; rerun component tests, lint, type checking, and production build. This replaces two coordination effects with one timeout effect. A guarded render-time state update handles a newly ready prop before children render, following React's documented pattern for adjusting a component's own state from props.

**Testing decision:** use development-only Vitest and Happy DOM instead of keeping tests of a removed controller. No existing DOM test environment was installed. The new suite uses the existing React DOM renderer, mocks only visual animation, and tests the actual wrapper under Strict Mode. Ten tests passed before and after consolidation: initial readiness, pending readiness, readiness updates, exact 7999/8000ms deadline, unrelated rerenders, late readiness, one-way reveal, early unmount, focus restoration, and preserving a pre-existing scroll-lock class. Component tests do not establish animation fidelity or browser layout.

**Dependency note:** installation reported 16 moderate audit entries in the existing ESLint/minimatch dependency tree; the new test packages are not listed in those entries. The suggested automated fixes include unrelated breaking version changes, so no audit fix was applied during this focused refactor.

**Final verification:** `npm test` passed 10/10 component tests; `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` passed. A fresh read-only review found no Important/Critical issue. No controller references remain in application source, tests, or README. Historical PROCESS entries retain old filenames to accurately describe earlier work. No new browser check was run for this consolidation; DOM behavior is covered by the component suite, while visual preloader code is unchanged.

## 2026-10-31 — Refactor tests around observable behavior

**Intent and scope:** apply the verification rules without increasing test count as a goal. Refactor the existing wrapper suite and explain its evidence boundaries. Application behavior and dependencies remain unchanged.

**Changes:** grouped cases by readiness/completion, deadline/cleanup, and interaction restoration. Required elements now fail clearly instead of optional chaining silently skipping an action. Completion is explicitly controlled by the preloader substitute. Added a withheld-completion scenario and protection against stealing focus moved to another control; combined related readiness-latching and deadline/rerender cases. Autofocus is enabled only in focus scenarios. Cleanup restores test-owned global settings, timers, and the prior scroll-lock state. README maps expected outcomes to evidence and states what mocking excludes.

**Checked:** the original suite passed before editing. After refactoring, all 10 component tests, lint, and type checking passed. The test count is incidental; the assertions and behavior map define scope.

**Intentional failure:** temporarily removed only the timeout cleanup line in LandingExperience and ran the unmount-cleanup test. It failed with two pending timers instead of zero under Strict Mode. Restored the production file byte-for-byte in a finally block, confirmed restoration, then reran the full suite: all 10 passed. This demonstrates sensitivity to missing timeout cancellation, not sensitivity to every possible defect.

**Not checked in this task:** actual preloader/GSAP integration, image behavior, live reduced motion, browser-enforced interaction, responsive layout, and performance. The suite substitutes Preloader and uses a simulated DOM/clock. A missing real completion callback is not ruled out by these tests. No new browser checks or production build were needed for this test/documentation-only change.
