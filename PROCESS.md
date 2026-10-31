# Engineering process

## 2026-10-31 — Unblock blueberry hover under the decorative footer

**Cause reproduced in the production browser:** element hit-testing at the visible center of blueberryTwo returned the full-width footer at 1280×720, 1280×600 and 320×568. Its higher layer intercepted hover even away from the visible footer text. Other blueberry centers received their own image targets.

**Focused fix / expected outcomes:** make the decorative footer ignore pointer events so blueberryTwo receives hover. Keep visual layering, dimensions, copy, animation and reduced-motion behavior unchanged. Real-browser hit testing and hover transforms are the regression checks; DOM mocks cannot reproduce paint-order hit testing, so no source-text or mock-only test is added. Run the existing suite and standard checks.

**Verified:** `npm test` passed all 17 tests; lint, type checking, production build and diff formatting passed. After rebuilding, the same blueberryTwo center hit its image at 1280×720, 1280×600 and 320×568. All three desktop blueberries received real hover and produced the scale/tilt transform; blueberryTwo also hovered on the 320px phone view with footer pointer-events none. One immediate drag after viewport resize was rejected because rendering had not settled; a fresh screenshot and retry at the observed target succeeded. These are real-browser interaction checks, not mock evidence. Reduced-motion switching, other engines and frame-rate profiling were not repeated.


## 2026-10-31 — Restore scoped hero styling for readability

**Approved direction:** keep the simple loader in Tailwind and put complex hero composition, typography, responsive rules, and hover/focus styles in src/components/Hero.module.css beside Hero.tsx. The developer approved this hybrid after reviewing the verbose Tailwind-only version.

**Plan / expected outcomes:** replace hero utility strings with scoped class names, remove its now-unused custom Tailwind variants from globals.css, and keep all loading/image/GSAP code and asset files unchanged. Compare eight viewport computed-style baselines and real hover/focus/reveal; run existing tests/lint/types/build. No new dependency or implementation-mirroring tests, no commit/push/deployment.

**Verified:** `npm test` passed all 17 component tests; lint, type checking, production build and diff formatting passed. Pre/post browser computed styles and fixed fruit placement matched at 320×568, 375×812, 768×1024, 900×620, 1280×720, 1440×900, 1920×1080 and 1280×600. Real loading hid hero copy until reveal; completion reached complete. Orange hover remained independent of floating transforms, and keyboard activation showed a solid focus outline. No captured browser warnings/errors. Loader source and assets were not changed. Live reduced-motion switching, JavaScript-disabled browser execution, real network failure scenarios, other engines and frame-rate profiling were not repeated. Computed-style equality does not establish pixel-perfect screenshots.


## 2026-10-31 — Tailwind-only component styling

**Approved scope:** convert Hero and Preloader CSS Modules to Tailwind utilities and remove the two module files. Preserve exact breakpoints, layered transforms, nine-fruit loading wave, five-second minimum, image readiness, local Fredoka, hover/focus, and responsive appearance. GSAP retains animation ownership. Shared theme tokens and loading scroll lock remain in globals.css.

**Approach / plan:** use direct Tailwind classes and a typed fruit-position class map; define reusable Tailwind responsive variants for the existing exact-width/height queries in globals.css rather than copying component selectors there. Capture current browser layout measurements, translate styles, run existing tests/lint/types/build, compare responsive browser measurements and inspect wave/hover. This is a styling refactor, so browser equivalence and existing behavioral tests provide evidence; no implementation-mirroring tests. No new dependency, asset changes, commit, push, or deployment.

**Checked:** all 17 existing component tests, lint, type checking, production build, and diff formatting passed. No module.css files/imports or styles-object references remain in src. Compared browser computed styles for hero/header/copy/title/description/button/artwork/footer and fixed fruit placement against the pre-conversion page at 320×568, 375×812, 768×1024, 900×620, 1280×720, 1440×900, 1920×1080, and 1280×600: no measured differences. Real loader rendered nine fruits and hid copy before reveal; real completion reached complete. Orange hover scaled/tilted on its own layer while float transforms continued. Keyboard activation showed a solid focus outline. A fresh read-only review confirmed compiled custom variant ordering, data selectors, no-JavaScript fallback, and animation-layer compatibility; its minor hovered/active button precedence finding was corrected to retain previous behavior.

**Limits:** computed-style comparison is not a pixel-perfect screenshot assertion or frame-rate profile. Live reduced-motion switching, JavaScript-disabled browser execution, physical devices, other engines, and real failed/stalled network requests were not rerun. Existing component tests still substitute the visual loader and control image outcomes. Final production rebuild includes the precedence correction.


## 2026-10-31 — Match wave to remaining nine fruits

**Requested change:** the developer deleted cherry.png. Remove its static import and loader entry; use all nine remaining files. Preserve their order, alternating wave, five-second minimum, hero assets, and current user formatting. Expected result: no missing-file build error or cherry request, and nine equal-width wave slots. This is an asset-list correction; no new dependency or behavior test is needed. Verification: `npm test` passed 17 tests; lint, typecheck, build and diff formatting passed. Production-browser observation at 459×668 showed all nine images loaded, no cherry instance, opposite transforms on adjacent fruits, and no page overflow. Timing, live reduced-motion switching, other viewport sizes and failure-network scenarios were not rechecked for this asset-list-only change.


## 2026-10-31 — Restore the previous loading wave

**Requested direction:** replace the disliked circle with the previous single-row alternating vertical wave. Include all ten current public/fruits files: apple, avocado, pear, blueberry, cherry, coconut, grapefruit, orange, strawberry, watermelon. Keep five-second minimum, eight-second safeguard, green stationary text, current artwork imports, reduced-motion handling, and hero behavior.

**Plan / expected outcomes:** restore GSAP ±12px opposite neighboring movement at 0.7 seconds per direction, no stagger; equal-width responsive slots in one row from 320px; verify real browser transforms and loaded images, then existing component tests/lint/type/build. No new dependency or asset changes.

**Checked:** `npm test` passed all 17 component tests; `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` passed. Real production browser at 320×568 showed all ten loaded images, opposite adjacent vertical transforms, and no page overflow. Desktop 1440×900 showed a single ten-fruit row and green rgb(16,63,41) text. Browser control initially failed; resetting its session restored access. Live reduced-motion switching and real image failure/network conditions were not repeated.


## 2026-10-31 — Correct hero fruit selection and stale image cache

**Correction:** the prior folder swap incorrectly substituted avocado/apple for pear/grapefruit. Restore the intended pear and grapefruit from public/fruits. The orange file on disk was the new natural textured artwork, but the browser displayed the old orange through a cached optimized URL for the unchanged filename.

**Approach:** static imports from the same public/fruits source files for both hero and loader. Next.js hashes imported image contents into asset URLs; a rebuild after replacing an image uses a new URL. Keep existing timing, hover layers, typography, and layout. No artwork files changed or deleted, and no new dependency.

**Verification:** regression test first failed because the intended pear/grapefruit image instances were absent; after restoring them, all 17 component tests passed. An initial production build caught banana/grapes no longer present in the concurrently updated folder; the loader now uses the current ten files, including pear/grapefruit. Final `npm run lint`, `npm run typecheck`, and `npm run build` passed. Production-browser observation confirmed all eight hero instances loaded from new hashed URLs, the natural textured orange plus pear and grapefruit were visible, completed loader handoff, no overflow at the current 459×668 viewport, and no captured warnings/errors. Built orange/strawberry/pear/grapefruit PNGs were compared byte-for-byte with public/fruits originals and matched. `git diff --check` passed with normal line-ending warnings. Broader responsive, live reduced-motion, and failure-network checks were not repeated. DOM tests use controlled image events and a visual-overlay substitute; the real browser must establish current artwork and actual optimized requests.


## 2026-10-31 — Loader orbit and original-fruit hero revisions

**Design / scope:** user requested a five-second loading display, fruits circling stationary green LOADING… text, original public/fruits artwork throughout, individual hero-fruit hover, and a screen-fitting hero; user confirmed retaining local Fredoka. Use the existing GSAP stack rather than adding another animation dependency. Keep the five-second minimum plus existing eight-second deadline and completion-gated interaction restoration. Original artwork replaces generated hero references without deleting asset files. Nested image transforms isolate hover from entrance/idle motion. Responsive viewport sizing replaces the hard 740px minimum; short screens may scroll to preserve readable content.

**Plan:**
- [x] Update timing and image integration tests; observe failures before implementation. Protect 4999/5000ms, delayed readiness, one-way completion, 7999/8000ms deadline, and cleanup.
- [x] Implement the minimum display in LandingExperience; circular GSAP motion and green text in Preloader with scoped reduced-motion cleanup.
- [x] Swap hero sources to original fruits, add independent hover transforms, and adapt hero height/composition to screen sizes; retain Fredoka.
- [x] Run tests, lint, typecheck, build, browser checks and focused review; update README and record evidence/limits.

**Review focus:** cached/failed/stalled image settlement; parent rerenders cannot restart timers; pending unmount clears timers; reduced motion stops orbit/hover; small and short screens retain readable controls. Test overlay completion is controlled and does not prove real GSAP integration. No commits, push, deployment, new dependencies, or unrelated asset deletion.

**Verification on 2026-10-31:** updated component tests failed against the original immediate-exit behavior and generated image mapping, then passed after implementation. `npm test`: 16 passed; `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` passed (Git reports normal LF/CRLF conversion warnings). Controlled tests cover exact five-second minimum, readiness latching and delayed readiness, 7999/8000ms stalled-content deadline, duplicate/cache/error/recovery outcomes, withheld completion, focus/scroll-lock restoration, and early-unmount timer cleanup. A fresh read-only review found no important correctness issue.

**Browser evidence:** production preview showed the real circular loader with green rgb(16,63,41) text, equal/opposite ring and image rotations, and completed handoff. All eight hero instances loaded from public/fruits. Measured normal layouts include 320×568, 375×812, 768×1024, 1280×720, and 1440×900 with viewport-height content after the short-phone adjustment. Orange hover produced a scale/rotation matrix on its isolated hover layer. Compact 768×620 and 900×620 checks exposed a zero-height absolutely positioned art container; specifying its height corrected that layout. No captured warning/error logs. This task did not edit original image files or delete unused artwork. Concurrent workspace changes moved pear/grapefruit into public/fruits and removed the untracked hero-fruits directory; those changes were left as found.

**Limits:** exact timing and simulated image failure/deadline scenarios are component evidence, not real-network throttling evidence. Live reduced-motion changes, every individual fruit hover, JavaScript-disabled browsing, physical devices, other browser engines, frame-rate profiling, and screen-reader behavior were not rechecked. Screens shorter than the readable minimum may still scroll intentionally. No commit, push, deployment, or new dependency.

## 2026-10-31 — Match hero artwork to the approved visual concept

**Authorized direction:** the developer selected generated matching fruit artwork after comparing the implemented hero with the approved concept. Keep the ten original loader assets; replace hero artwork with natural textured fruit, tighten the composition, and use rounded display lettering. Four transparent assets (orange, strawberry, pear, grapefruit) were generated with the built-in ImageGen tool using the original mockup as a style reference. Blueberry generation failed because application network permission was revoked; use the existing blueberry for small accents. No substitute image service or CLI was used.

**Expected outcomes:** new focal artwork has true transparency, natural texture, and a coherent light direction; desktop composition layers a large orange, strawberry, pear and grapefruit with small blueberry accents and a cropped foreground orange; mobile keeps a readable heading and compact fruit group. Each displayed image still settles independently before loader exit, including reused assets. Cached/error/stalled behavior and reduced-motion cleanup retain their existing contracts. No source asset replacement or new dependency.

**Short plan:** save new cutouts separately in public/hero-fruits with provenance/prompts; adapt the existing readiness tests to the revised artwork count; update image mapping, CSS composition, and a locally hosted OFL-licensed Fredoka display font; run component checks, build, and responsive production-browser checks. No commit, push, or deployment.

**Result:** four generated cutouts are saved in public/hero-fruits with the exact shared and subject prompts in its README. Each is 1254×1254; inspected corner alpha is zero. The hero has eight independently tracked image instances: the four focal fruits, three reused blueberry accents, and a foreground instance of the generated orange. Loader assets remain untouched. Fredoka is self-hosted from the official Google Fonts repository with its OFL license; no runtime dependency or external font request was introduced. Headline sizing, fruit grouping, edge cropping and foreground depth now follow the approved concept more closely. The foreground is hidden on mobile while preserving loading/failure safeguards.

**Verification on 2026-10-31:** the revised eight-image tests first failed against the old ten-image composition. After updating the mapping, `npm test` passed all 15 component tests. `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` passed. Production browser checks at 320, 375, 768, and 1440px showed all eight image instances loaded, no horizontal overflow, readable headline lines, the Fredoka font family applied, and no captured console warnings/errors. Desktop/mobile screenshots saved outside the repository. A focused read-only review found no important code regression and identified stale README descriptions, which were corrected.

**Limits:** only four new assets generated; the blueberry request failed after application network permission was revoked and was not retried through another service. Existing small blueberry accents are retained. Reduced-motion switching, no-JavaScript browsing, real network failure recovery, other browser engines and frame-rate profiling were not rechecked. New component tests continue to control image outcomes and mock visual loader completion; they do not establish animation fidelity or network performance. Original assets, dependencies, and unrelated edits were preserved. No commit, push or deployment.

## 2026-10-31 — Approved fruit hero: design and implementation checklist

**Approved design:** implement the sampled pale-yellow (#FFF3A6) hero with dark-green typography, the headline “A little fresh. A lot of fun.”, supporting copy, a non-navigating “Meet the fruits” button, and all ten existing local fruit images. Orange is the focal point. Desktop places text beside the fruit scene; tablet/mobile stack the content and artwork. The developer approved the sample, requested their existing images, and instructed implementation. This scope is the hero; the collection remains future work.

**Approaches:** a single flattened illustration would be simple but cannot animate fruits independently; separate image layers preserve the supplied artwork and enable independent movement, so that is the selected approach. Keep native scrolling and the existing GSAP/Next.js/Tailwind stack. No dependencies or asset replacement. Scope and plan stay in this file per the project agreement; no commits or deployment.

**Observable outcomes / review focus:** wait for hero images to load or fail before exiting the loader, with the existing eight-second deadline for stalled requests; begin hero motion only after the overlay finishes; keep readable content if images fail or JavaScript is disabled; stop decorative movement for reduced motion and when off-screen/hidden; preserve layout at 320, 375, 768, and 1440px. Cache hits and repeated image events must not prematurely finish loading. Existing fruit files have user modifications and must be preserved.

**Plan:**
- [x] Add meaningful tests for image settlement and loader-to-hero handoff; demonstrate failure before implementation.
- [x] Build Hero.tsx with image readiness, accessible content, independent artwork layers, and scoped entrance/idle effects. Expose completion through LandingExperience context without changing its timing contract.
- [x] Add scoped responsive hero styles and shared color tokens. Optimize loader image requests now that source photos are much larger; preserve originals.
- [x] Run component tests, lint, type checking, build, and browser checks; document results and remaining limits. Update README to reflect actual scope.

**Implementation and choices:** Hero owns the ten-image readiness set; LandingExperience shares overlay completion through context. Entrance opacity is held at zero until completion, then a layout effect initializes the GSAP reveal before paint. Nested elements separate fixed composition rotation, entrance, and idle transforms. Breakpoint changes adapt floating amplitude without replaying the entrance. Reduced motion skips hero animation; scoped GSAP matchMedia and observer/listener cleanup handle preference changes and unmount. Visibility/intersection pause off-screen work. Native scrolling remains. Next.js responsive image optimization now applies to loader photos as well as hero photos because the developer's replacement originals total roughly 13 MB. Original assets and package files were not modified by this work.

**Test-first evidence:** the two initial page tests failed against the placeholder (zero hero images). After implementation, controlled pending/success/error scenarios passed. An initial test-environment mismatch treated Happy DOM's non-fetched images as complete; the tests now explicitly control image completion and await Next.js load callbacks. Additional scenarios check cached images, a stalled image at 7999/8000ms, and duplicate events. A fresh read-only review identified hidden images failing to recover after a later successful request; a dedicated error-then-load test reproduced that failure before the onLoad visibility reset was added. The same reset is applied to the loader. The reviewer reported no other important issue in the inspected changes.

**Checked on 2026-10-31:** `npm test` passed all 15 tests; `npm run lint`, `npm run typecheck`, and `npm run build` passed. Production build still has only the page and framework not-found route. `git diff --check` passed (Git also reports normal LF/CRLF conversion warnings). Local production preview uses `npm run start -- --port 3001`.

**Real-browser observations:** at 320, 375, 768, and 1440px the production page had no horizontal overflow, readable heading lines, and all ten loaded hero images. The initial 320px text-fit observation prompted a smaller minimum headline size; the final check showed no internal heading-line overflow. During the real loader fade, hero readiness was false and copy opacity was zero; after exit, readiness was true and the page scroll lock was removed. Fruit transform samples confirmed idle motion. Crossing mobile/tablet/desktop breakpoints left the headline visible. Button hover produced a -4px transform; Enter focus showed a visible solid outline. No browser warning/error messages were recorded. Desktop, tablet, and mobile screenshots were saved outside the repository for preview.

**Not checked / limits:** real browser network throttling/failures/retry, actual live reduced-motion changes, JavaScript-disabled browsing, sustained hidden-tab/off-screen pausing, other browser engines, physical low-powered devices, and frame-rate profiling were not exercised in this hero task. Image success/error/cache/stall/recovery scenarios are controlled component tests, not proof of a real network. Noscript and reduced-motion branches were inspected in source; no 60fps claim is made. The system font stack approximates the mockup rather than matching its generated lettering. Collection, scroll-driven section transition, repository visibility, and deployment remain pending. No commit or push was made.

## 2026-10-31 — Loader background color

Changed the loader background from white to pale yellow (#FFF3A6), selected to match the approved hero concept. This changes only its background color. The hero remains a pending implementation. Checked the diff and formatting; browser appearance was not rechecked.

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
