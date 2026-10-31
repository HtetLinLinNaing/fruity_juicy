# Engineering process

## 2026-10-31 — Narrow screenshots and card cleanup

User supplied narrow hero/collection screenshots showing shared-orange transition missing, then requested removal of dark card-bottom strip and page1 scrollbar line. Confirmed main transition currently desktop-only atwidth>=901. Keep prior orange/wave goals while removing box-shadow and preventing horizontal overflow; preserve normal vertical scrollbar.

Plan: regression test at572×827 requires a connected scroll scene, not compact normalflow. For narrow mode, temporarily pin the shared scene for its transition, preserving the full collection height so normal scrolling after pin release reaches every card. Animate collection upward gently and carry shared orange to a visible near-top mobile decoration anchor. Keep reduced-motion static, use smaller movement, refresh heights on resize/fonts, and retain cleanup. Source main orange stable in all connected modes. Test realGSAP dimensions/reverse/teardown with controlled DOM; browser control remains unavailable.

Latest cleanup: removed card box-shadow (the18px solid dark strip) and clipped horizontal page overflow. These reversible CSS changes use visual inspection rather than implementation-mirroring tests. No assets/dependencies/commit/push.

### Narrow transition verification — 2026-10-31

- RED: realpage572×827 and375×812 tests created zero pins while1280×650 passed. Full-height test failed because oldscene fixed oneviewport. GREEN:46 tests after connected compactmode.
- RealGSAP helper test reserves2400px for tallcollection, finishes collection y0, verifies sharedorange finaly690 with moving-parent geometry accounted for, then refreshes collection2900px and restores layout on contextrevert. RealScrollTrigger page cases create onepin and remove it on unmount atall three sizes. Media/image/rectangle/overlay are controlled substitutes, so no native-browser/physicaldevice claim.
- Compact scene rises gently while background blends; rotation/translation follow the existing sharedsprite. Root retains max(viewport,hero,collection) height, and pinSpacing preserves reachability after shortpin. Wholecollection transform clears atsettle so individual header/frame z4 remains aboveorange z3. Mainorange idle/entrance policy matches connectedmode to avoid sourcejump.
- Reduced motion unchanged; viewportheight<400 remains normalflow; other narrow/shortscreen motion uses smaller amplitudes and scrub. Dark18px cardbottomshadow removed perlatestuserimage; horizontal overflowclipped only, verticalnative scrollbarretained.
- Browser retry still disabled in Worksettings. Cannot claim the exact turn-up feel, layoutfit, pinrelease under browserchrome resizing or native touch performance are visually verified. Fresh tests/build/status/review recorded below.

## 2026-10-31 — Screenshot: stacked section boundary after loading

User screenshot shows normal-flow cream hero above green collection. Diagnosed two concrete code paths that can produce this: desktop motion was disabled below700 CSS pixels tall; loading preserved any prior/restored scroll position. Exact browser viewport/preference could not be read because browser control remains disabled, so these are verified code gaps rather than a claimed measurement of the screenshot. Both3000 development and3001 production responded200 with current shared-orange markup; the development badge in the screenshot is consistent with3000.

Expected outcomes: fresh loading begins at hero top, no repeated scroll resets on readiness/reveal; restored browser scroll cannot reveal a midpage seam during loader fade; connected desktop mode works at1280×650, with static reduced-motion/mobile/very-short fallback and readable short-screen collection.

Test-first: new restored-scroll test failed (zero scrollTo calls), and realGSAP/ScrollTrigger page integration at1280×650 failed (zero pin spacers). After correction fullsuite43 passed. These tests control viewport/media/image readiness and visual preloader completion in HappyDOM; realGSAP creates/removes the pin. They do not prove browser layout, picture alignment or native media matching.

Changes: loading sets scroll top once before paint and temporarily owns manual history restoration, restoring previous setting on unmount; desktop pin/source policy now width>=901,height>=560. CSS adds short-desktop grid/card/type sizing at560–699, matching the motion policy. Narrow/reduced/under560 remain normalflow for readability. Existing approval covers these continuity fixes, no design reset/extra dependencies/assets.

Fresh verification recorded below. Browser screenshot reproduction and physical responsiveness remain pending. No commit/push/deployment.

## 2026-10-31 — Waving cards and continuous scroll orange

**Approved scope:** user requests wavy collection cards and orange rolling between hero and collection, delegating curtain choice to our recommendation. Chosen remove sliding curtain: blend scene backgrounds while one visible travelling orange connects scenes, reverse with scroll. Preserve loader handoff, current images and normal scrollbar.
**Architecture:** root scene backdrop and orange visual on separate layers; semantic sections remain siblings. Only while scrolling on desktop, hide original main/foreground copies and show shared sprite measured between existing reserved anchors; root sprite sits above background but below card frames. From normal static hero to shared sprite at start, reverse restores source. Card wave gets nested wrapper separate from scroll and hover. Reduced/static keep original artwork, no pin/wave; compact uses smaller waves and normalflow.
**Plan / native execution:**
- [x] RED real-page test requires one scroll orange and three wave layers with ordered semantic sections; scope scene-child assertion to sections. Retain readiness/asset tests.
- [x] Implement nested wave wrappers and shared sprite/backdrop in FruityLanding, add destination anchor in Collection. Replace green panel yPercent curtain with opacity blend, hero fade/fruit exit, measured orange x/y/scale plus rolling rotation. Desktop invalidates geometry on refresh; reveal context unchanged. Pause wave before visible/when page hidden and clean up on mode/unmount.
- [ ] Fulltests/lint/type/build/diff, realGSAP tests for reverse/cleanup if feasible, independentreview, previewrestart and accurate docs. Browser acceptance required for visualcontinuity/hover/fit; previous browsercontrol disabled, retry availability once. No commits/push/dependency/assets.
**Failures / checks:** no duplicate visible orange during handoff; reverse returns source without replayloader; wave/hover/scroll transforms isolated; failed sharedimage uses original layers; fonts/resize refresh measuredtargets; no permanent hidden content after media change; reduced/static readable.

### Waving-card / scroll-orange verification — 2026-10-31

- RED realpage: missing wave/sprite expectations failed,33 existing tests passed. RED choreography helper: three tests failed for absent timeline. GREEN after implementation37 tests. Added refresh/reverse/hover/error checks; final results recorded below.
- New tests use realGSAP, controlled DOM rectangles/image states and direct timeline progression. They check one shared orange midflight/end, reverse source restoration, context teardown of layout/visibility, failed initial image fallback and updated destination measurement after reset/invalidate (matching ScrollTrigger refresh ordering). They do not simulate real native scroll, media breakpoints, frame rendering, network or browser stacking.
- Independent read-only review identified source-pose and late-error risks. Source main orange now stays free of idle/entrance movement on pinned desktop; its hover settles over first0.2 timeline units before shared-sprite takeover. Hover is recaptured for repeated forward/reverse cycles (parseTransform + invalidate) and cleared back to CSS at reverse completion. Main/foreground originals hide during shared travel.
- Late sprite errors revert only the nested orange transfer, restoring original source/destination paths while the main content timeline continues. Error listener removed on cleanup. Added tests failed for hover/latefailure/foreground behavior before correction and passed after. A repeated-hover test detected stale starting values and passed after invalidation.
- Initial invalidation test attempted invalidate at unchanged progress1, which did not render a new frame; corrected to reset0→invalidate→progress1 as documented for ScrollTrigger refresh. Added missing hero-art layer to the fixture to remove null-target warning.
- Browser retry still returned local browser use disabled in Work settings. Actual handoff alignment, wave feel, layer stacking, responsive fit, hover, keyboard, live reduced motion and performance remain NOT browser verified. No60fps/fidelity claim or screenshot artifact.
- Chosen remove curtain under user-delegated recommendation; normal scrollbar and backward-scroll reversal retained. Same assets/dependencies; no commit/push/deployment. Current checkout retained to preserve shared edits (cost: less isolation).

## 2026-10-31 — Approved rolling-orange handoff

**Design / approval:** user confirmed orange rolls from the centre of loading into its existing hero position on the right, grows during travel, then copy/other fruit enter. This is our fruit-artwork adaptation, not a claim of an exact reference transition.
**Approaches:** chosen one fixed orange sprite positioned over a centre loading-row slot and carried to the hero, preserving one visible moving element; separate fading images would break continuity; reparenting React-owned DOM imperatively risks cleanup problems. Keep all nine fruit assets; move orange to centre of row.
**Architecture:** Preloader owns sprite/flight; LandingExperience passes a scoped hero target getter and latches successful orange landing in context. Hero skips only the main orange entrance after successful handoff; other entrance/idle/scroll layers stay independent. No new dependencies.
**Native implementation plan:**
- [x] Task1 RED: real Preloader tests with realGSAP and controlled image readiness/geometry: completion withheld until actual handoff timeline completes; reduced/missing/failed-target fallback reports completion without landing; resize/live reduced preference abort restores fallback; unmount cancels callbacks. These do not prove actual frames or real network/geometry.
- [x] Task2 GREEN: centre orange slot plus shared fixed sprite, loading roll/wave, measured transform/scale flight (~1.25s) ending at target orientation; fade backdrop/otherfruits while sprite remains. Preserve five-second minimum/eight-second readiness deadline, inert content until exit completes. Failed/pending assets or offscreen target use fade; resize/preference changes abort safely, cleanup timers/listeners/animations. Files Preloader.tsx/Preloader.module.css/LandingExperience.tsx/Hero.tsx.
- [ ] Task3 retain fullsuite; lint/type/build/diff; browsercheck continuity/resizing/reduced/errors if enabled; freshreview; README/PROCESS truthful evidence. Browser currently disabled, do not claim visual success without recheck.
**Expected observable outcomes / failure cases:** exactly one visible orange while travelling; no duplicate orange entrance; remaining fruit/copy enter afterward; fallback always unlocks; currentcollection/hero paths unchanged. Test focus: callback order/failure/cleanup; browser focus: endpoint alignment, correctart, resize, no jump/overflow, visualhandshake. Current featurecheckout/no commits/push/deploy retained.

### Rolling-orange verification — 2026-10-31

- Initial new Preloader suite failed7/7 because sprite/flight/fallback contract was absent. After implementation, fullsuite passed33 tests. RealGSAP timeline progress is controlled directly; geometry, image readiness and preference are controlled HappyDOM substitutes. No GSAP success mock. These tests exclude actual rendered frames, real network/decode, native resize/media events and browser layout.
- Safeguards checked: landing before completion; no early completion midflight; reduced/missing/failed/pending/offscreen fallback; resize/reduced/source-error/target-error abort; no callbacks after unmount. Existing loading/image/collection tests retained.
- Endpoint test uses a rotated target rectangle and asserts x167.2/y-162.8, scale7.5 and final rotation353 degrees (equivalent to-7). Intentional temporary25px endpoint error made this test fail; restored correct calculation and fullsuite passed33.
- Test debugging: arrow-returned GSAP timelines were thenables consumed by React act, so progress calls now use void block bodies. A target-instance geometry spy initially changed the prototype substitute for all rectangles; a local instance fixture corrected that. Neither issue required changing product behavior.
- Fresh independent read-only review found no important implementation defect. Its endpoint-test gap was addressed with the assertions/mutation check above; README now describes flight and realGSAP test limits.
- Browser availability check returned no enabled browsers and error local browser use disabled in Work settings. Orange continuity, actual endpoint/pixel alignment, breakpoint/resize geometry, live reduced motion and mobile performance are NOT visually verified. No exact-fidelity/60fps claim or screenshot artifact.
- Existing feature checkout and native execution retained under approved scope; no dependencies/assets/commits/pushes/deployment. Preloader.module.css is limited to shared sprite layers; Tailwind still handles the loader layout.

## 2026-10-31 — Approved continuous scene revision

**Design:** user approved a continuous layered transition: hero text exits and hero fruits spread at different speeds; green collection rises before hero disappears; strawberry/pear/grapefruit arrive from different directions with scale and rotation; foreground orange travels faster than background blueberries; desktop scroll reverses, compact motion is smaller, reduced motion is static. Existing fruit files and loading timings remain.

**Approaches:** retain a flat stagger (too little depth for requested feel); use full3D (larger asset/rendering scope); chosen layered HTML/CSS with existing GSAP. No new dependencies or assets, commit/push/deploy.

**Goal / architecture:** use one desktop timeline pinned on a shared scene wrapper around the two semantic sections. Layer the collection over hero during desktop motion only. Keep static/mobile document flow, separate composition/entrance/idle/hover/scroll layers, and use scoped matchMedia cleanup. Existing hero readiness contract is unchanged.

**Implementation plan (native execution, already approved scope):**
- [x] Task1: add real-page test for the shared scene containing hero and collection in order; observe RED, introduce scene wrapper and distinct per-fruit scroll wrappers, retain existing integration cases; npm test → green. Files FruityLanding.tsx, Hero.tsx, Hero.module.css, tests/hero.test.tsx.
- [x] Task2: replace separate hero-exit/pinned-gallery animations with one shared-scene desktop timeline. Pin only width>=901 and height>=700; ~2viewport-height interval. Hero exits during first part, collection rises from yPercent100 to0 overlapping hero, portraits enter from x[-180,0,180], y[100,180,100], scales[.72,.62,.72], rotation[-18,12,18] to identity; orange travels x[-22vw,0], y[160,-20], blueberries smaller offsets. Move outgoing hero fruits individually on independent wrappers. Compact devices keep normal sections, smaller distinct card reveals; reduced motion no animated styles or pin. Static CSS readable. Browser RED is current separate vertical sections/uniform card/decor movement documented in previous checks.
- [ ] Task3: npm test, lint, typecheck, build, diffcheck; browser production start/middle/end/reverse and breakpoint cleanup/hover/keyboard/reduced/static/asset failures where supported. Record unavailable checks honestly; final independent read-only review and focused corrections. Update README/PROCESS only with evidence.

**Review focus:** shared pin must not clip tall content; breakpoint changes remove inline positions/transforms/spacers; initial-load/hero entrance unchanged; outgoing hidden CTA not focusable; scroll/idle/hover layers remain independent. Tests protect semantic order/readiness/failure but browser needed for actual choreography and performance.

**Self-review:** interfaces preserve onReady/onHeroReady/reveal context; no loading coupling. Wrapper changes main direct-child test selector; query semantic sections inside main. No extra font/assets/new routes.

### Continuous scene verification and review

- Automated RED→GREEN: new real-page shared-scene test initially failed (null wrapper;20 other tests passed), then21 tests passed after wrapper/independent hero scroll layers were implemented. Existing pending-media/timing/error/recovery cases retained.
- Fresh npm test21 passed; npm run lint, npm run typecheck and npm run build exited0. git diff --check exited0 (normal Windows line-ending notices).
- Production server returned200; server-rendered HTML has one main, hero and collection headings, shared scene and six lazy collection images. This HTTP check establishes content response only, not browser layout or motion.
- Fresh independent read-only review found one important fit issue: fixed shared-scene viewport could clip content at700px desktop height. Replaced min-height-only stage composition with a bounded three-row grid, dedicated heading/footer rows and portrait width bounded by available viewport height. Source issue addressed; no browser RED→GREEN evidence available.
- Minor deferred: geometric hero intersection keeps idle fruit movement running behind covering collection. No physical-device performance claim; optimization can pause the hidden loop after real profiling. README shared-scene description updated. Existing collection Arial typography remains deferred from prior review.
- Browser reconnect returned local browser use disabled in Work settings. New overlap, reverse scrolling, fit, hover, resize/media cleanup, keyboard/reduced/noJS behavior and visual reference fidelity NOT verified for this revision. No screenshot/profiling artifact available; earlier browser observations apply only to the former timeline.
- Plan choice: preserve current native execution/feature checkout and integration suite. Cost: less edit isolation/larger test file; no commits, pushes, new dependencies or asset changes.

## 2026-10-31 — Collection execution and current verification

- Approved implementation completed in the existing feature checkout; no dependency or asset changes, commits, pushes or deployments. FruityLanding owns the single main/loading wrapper; Hero reports only its eight image instances. Collection uses the existing strawberry/pear/grapefruit portraits, orange and two blueberries with lazy media, reserved slots and failure recovery.
- Expected outcomes: collection requests cannot delay the loader; one main contains hero then labelled collection; named portraits survive failed artwork; desktop scroll pins briefly with separate scroll/hover layers; compact and reduced-motion modes remain readable. Important failure cases are stalled media, failed→successful image events, resize during pinning and animation cleanup.
- Test-first evidence: initial npm test had 17 passing and three new tests failing because the collection was absent. After implementation, all20 passed. New assertions protect semantic order, below-fold readiness isolation at4999/5000ms, completion-gated interaction and portrait failure recovery. Only Preloader is substituted; real page/components/Next Image render, simulated DOM/clock/media events and reduced-motion preference exclude real fetching/layout/motion.
- Fresh commands: npm test (20 passed), npm run lint (exit0), npm run typecheck (exit0), npm run build (exit0). Initial git diff --check passed with Windows line-ending notices only; final diff check recorded below.
- Browser RED for motion: static1440×900 showed zero pin spacers and no transformed card wrappers. Static checks at320×568,375×812,768×1024,900×620,1280×720,1440×900,1920×1080 found readable caption slots and no horizontal overflow.
- Production motion evidence before final CSS corrections: real overlay completed, all eight hero images loaded, one pin spacer, cards hidden before entry, stage top0 and all three cards visible at scroll1547px in1440×900. Resize samples removed the pin spacer at short/mobile sizes. Browser console returned no warnings/errors at that sample.
- Found failures: pinned stage measured912px at800px-tall desktop; scrollbar-width mismatch appeared while pinning. Corrective CSS now scales the gallery with viewport height and reserves a stable root scrollbar gutter. These fixes pass automated checks but need browser RED→GREEN confirmation.
- Independent fresh read-only review identified the same important pin-fit defect, addressed by viewport-height sizing. Minor deferred: collection typography currently inherits Arial instead of applying Fredoka; existing hero/font files remain intact. README's pending-section text was corrected.
- Browser access subsequently became disabled in Work settings. User selected enabling access, but tool still returned disabled. Final CSS browser recheck, exact pin-boundary stabilization, reverse/hover, keyboard, noJS, live reduced motion, real delay/failure, unmount and Performance profiling are NOT verified. Physical mobile performance and60fps are not claimed. No screenshot artifact could be saved after access was disabled.
- Ruling: use existing feature checkout instead of a new worktree to retain shared preview and follow project preference. Cost: less isolation from concurrent edits.
- Ruling: keep collection tests in existing real-page integration suite rather than duplicating its clock/overlay setup in a separate file. Cost: larger test file.

## 2026-10-31 — Collection showcase implementation plan

> **For agentic workers:** after plan approval, use superpowers:executing-plans (recommended here) or superpowers:subagent-driven-development task by task. Follow test-driven-development and verification-before-completion. Do not implement before the developer confirms this plan.

**Status:** Design and implementation plan approved in chat. Implementation and automated checks complete; final browser acceptance pending.

**Goal:** finish the third experience in the interview assignment: loader → existing fruit hero → an animated collection showcase inspired by the framed display scene around 11 seconds in the [official reference recording](https://www.youtube.com/watch?v=74r7-WEB4lo&t=11s).

**Spec / approved design:** one deep-green collection scene headed “Meet the fresh bunch.” with framed strawberry, pear and grapefruit portraits, a large cropped foreground orange, and blueberry accents. Scroll fades the hero and brings the collection layers into place; desktop briefly pins the showcase, mobile uses stacked portraits and simpler reveals, and reduced motion shows static content. Portrait hover gently lifts the frame and tilts its fruit. Keep the current fruit artwork, Fredoka, hero styling module and Tailwind loader. This adapts the reference's layered motion, without claiming an exact reproduction of its entire 3D sequence.

**Approaches:** a plain grid would be cheaper but would weakly demonstrate the reference's scene transitions; a full 3D recreation adds assets, rendering and performance work beyond this three-section task. The approved approach uses layered HTML/CSS artwork with GSAP ScrollTrigger, already included in the installed GSAP dependency.

**Architecture:** add FruityLanding as page coordinator, moving the existing loading-wrapper ownership out of Hero. Hero keeps its image-settlement and entrance/idle behavior and reports readiness upward. A small LandingSections component inside FruityLanding owns the main element and scroll choreography across the two sibling sections, using the existing reveal context. Collection renders its static semantic content and scoped styles; scroll and hover use separate nested layers.

**Tech stack:** existing Next.js 16.4.3, React 19.3.0, TypeScript, GSAP 3.15.0 plus its ScrollTrigger plugin, CSS Modules, Tailwind, and current Vitest/Happy DOM suite. No dependency additions.

### Constraints and acceptance boundaries

- Keep one page and one main landmark. No new routes, navigation, NFT filters, backend, generated artwork, or working CTA.
- Preserve the nine-fruit loading wave, five-second minimum, independent eight-second deadline, completion-gated interaction, and image error/cache/recovery safeguards.
- Only the eight existing hero image instances gate initial loading. Collection media uses lazy loading, reserved image dimensions, and static imports from public/fruits.
- The existing landing page was deliberately one screen tall; adding the approved third section now requires vertical scrolling. Continue preventing horizontal overflow.
- Proposed tuning for approval: pin only with viewport width >=901px and height >=700px and no reduced-motion preference, for one additional viewport-height of scroll. Shorter desktops/tablets use an unpinned layout; mobile <=900px stacks cards. Desktop timeline uses scrub 0.6; figures enter from roughly 80px lower and scale 0.9. These values may be tuned during visual checks without changing scope.
- Hero exit targets the existing copy/artwork containers through new data attributes; the entrance, idle fruit movement and hover retain their own transform layers. Use visibility-aware opacity for fully hidden copy so invisible controls do not receive keyboard focus.
- Default CSS stays readable with no JavaScript, reduced motion, failed media or animation setup failure. Decorative layers must not intercept pointer input.
- Preserve current edits and asset files. No commit, push or deployment in this implementation approval.

### Review focus

1. New below-fold images must not extend or restart the loader: component integration test with all collection images left pending.
2. Pinning must clean up on resize, reduced-motion changes and unmount: real-browser checks at 900/901px and 699/700px heights, scrolling in both directions.
3. Scroll transforms must not overwrite hero entrance/float or portrait hover: sample their distinct layers in the browser before and after resizing.
4. Lazy/failed media must leave named, stable card slots and usable content: controlled component image-error tests plus a real browser request-failure check.
5. All copy and controls must remain reachable: static/reduced-motion/no-JavaScript browser checks and keyboard traversal through the transition.

### Task 1 — Add the static collection and page coordination

**Files:** create src/components/FruityLanding.tsx, Collection.tsx, Collection.module.css; modify src/app/page.tsx and src/components/Hero.tsx; update tests/hero.test.tsx and add tests/collection.test.tsx.

**Interfaces:** Home remains a Server Component returning FruityLanding. FruityLanding owns ready=false, a stable markHeroReady callback, and LandingExperience. LandingSections({ onHeroReady }: { onHeroReady: () => void }) renders one main containing Hero and Collection. Hero({ onReady }: { onReady: () => void }) reports when its distinct image set settles and renders its section instead of owning LandingExperience/main. Collection() renders a section labelled by its h2, with data-collection-stage, three outer data-collection-card layers, and inner CSS hover layers. The existing reveal context remains unchanged.

- [ ] Write page tests that require one main, hero followed by the labelled collection, and the three named portraits. Scope existing hero image queries to [data-hero-image], so collection images cannot satisfy hero assertions. Run npm test and observe the new integration expectations fail before implementing.
- [ ] Implement coordinator and static collection. Keep three cream/pastel framed figures on green #103f29, cream typography, fruit-name captions and short supporting copy. Reuse the original portrait images plus orange/two blueberry decorative instances; retain their labels when artwork fails. No new animation behavior yet.
- [ ] Add a readiness test: leave collection requests pending, settle all hero instances, assert the page remains covered at 4999ms, permits exit at 5000ms, and becomes interactive only after controlled overlay completion. Retain duplicate/error/cache/stall/cleanup scenarios.
- [ ] Run npm test; expect the full suite green. Check static layout at 320×568, 375×812, 768×1024, 900×620, 1280×720, 1440×900 and 1920×1080. All headings/captions remain readable and page width does not exceed the viewport.

### Task 2 — Add reference-inspired scroll choreography

**Files:** FruityLanding.tsx, Collection.tsx, Collection.module.css, Hero.tsx, Hero.module.css. Read the bundled Next.js client-boundary/image guides before framework changes and current GSAP ScrollTrigger/matchMedia documentation before implementation.

**Interfaces:** LandingSections uses its main ref and useLandingRevealed to initialize effects only after loader completion. Add data-hero-scroll-copy and data-hero-scroll-art to existing outer hero containers. Pin only data-collection-stage, keeping the pinned element free of animated transforms; animate its child card/depth layers. No new readiness signal from Collection.

- [ ] Before adding motion, demonstrate that the static page has no pinned scroll interval or moving collection layers. Record the browser observations as the failing acceptance evidence; no mocked GSAP success test.
- [ ] Register ScrollTrigger from the installed GSAP package. In scoped gsap.matchMedia, fade/translate outgoing hero containers as the hero scrolls out, then pin the desktop collection stage from top/top for one viewport-height while frames reveal with staggered transforms and foreground artwork moves at a different rate. Scrolling upward reverses the desktop sequence. Keep native scrolling; add no smoothing library.
- [ ] On mobile/short screens, use short, one-time per-card reveals without pinning. Reduced motion skips scroll transforms/pinning and leaves all content visible. Scope teardown to this page; restore inline styles and pin spacing when mode changes/unmounts. Refresh measurements after fonts settle and cancel deferred refresh work on unmount.
- [ ] Verify visible progress at the start, middle and end of the pinned interval, reverse scrolling, preserved portrait hover, real loader completion, and original hero entrance after a reload. Cross both pin breakpoints while mid-scroll; confirm no orphan pin spacers, hidden cards, extra scroll lock, horizontal overflow or replayed hero entrance.

### Task 3 — Verify and document the completed third section

**Files:** tests/collection.test.tsx, tests/hero.test.tsx, README.md, PROCESS.md; focused corrections only in the above application files.

- [ ] Exercise collection error-to-success recovery with controlled image events. Tests keep the real page/wrapper/components and substitute only visual overlay completion; they do not prove network loading, ScrollTrigger or browser layout.
- [ ] Run npm test, npm run lint, npm run typecheck, npm run build and git diff --check. Resolve failures and record actual commands/results. No test-count or coverage target.
- [ ] On the production build, check listed phone/tablet/desktop sizes; 900/901px and 699/700px pin boundaries; fast reverse scrolling; keyboard focus; no-JavaScript and reduced motion including live preference changes; delayed/failed collection media; resize/unmount cleanup; and browser warnings/errors. Save representative screenshots and compare the collection choreography with the recording around 11 seconds. Report any tool-limited checks explicitly.
- [ ] Profile scrolling in browser Performance tools and inspect long frames/layout work before making frame-rate claims. Desktop browser profiling does not establish 60fps on physical low-powered phones; state that limit if those devices are unavailable.
- [ ] Request one fresh read-only review of the final change, address important findings, and rerun affected checks. Update README to say three experiences are implemented only after verification; describe native scrolling/desktop pin/mobile fallback and remaining deployment work. Record fresh evidence separately from historical entries in PROCESS.md.

**Plan self-review:** the tasks cover the approved layout, scroll/pin/hover behavior, responsive fallback, failure handling and verification. The readiness callback is consistently onReady / onHeroReady; loading timings/context remain owned by the existing wrapper. Proposed desktop tuning and orchestration changes are explicit above. No code or tests have been changed or run during planning.

**Execution recommendation:** native execution in this chat, with one independent final review. This keeps the tightly connected page/hero/collection changes together and avoids a new implementer/reviewer cycle for each small task. Subagent-driven execution is available if the developer prefers per-task reviews.

---

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

Final collection diff check: git diff --check exited0 on2026-10-31; only normal LF/CRLF notices. Production preview restarted on3001 with latest build.

Latest orange-handoff checks: npm test33 passed, lint/typecheck/build/diff exit0; production restarted3001, HTTP200, one main and sprite/hero target present in server HTML. This confirms server response only.

Latest wave/scroll-orange verification: npm test41 passed; lint/typecheck/build/diff exit0. Latest production server restarted3001 and returned200, one main, three wave layers and scroll-orange markup. HTTP checks do not verify visual behavior.

Latest screenshot-fix checks:43 tests passed; lint/typecheck/build/diff checks exit0. Updated production preview restarted3001 and returned200. Initial screenshot reproduction not browser-verified; current tests establish policy/startup behavior, not pixel fit.

Focused independent screenshot-fix review: no important findings in startup restoration, matching560px activation, short-screen sizing or regression-test scope. Native restoration timing, pixel fit, orange alignment and exact screenshot cause still require browser acceptance.

Latest narrow/cleanup checks:46 tests passed; lint/typecheck/build/diff exit0. Updated production preview restarted3001 and HTTP200; these are automated/server checks, not visual acceptance.

Narrow final review/correction: independent review found that onRefreshInit numeric height could be overwritten by ScrollTrigger restoring captured pin styles. RealScrollTrigger integration reproduced stale2400px after collection grew2900px at both narrow sizes. Switched captured height to var(--scene-content-height), updating its custom property onrefresh; both regression cases passed. Helper test also checks expression/property cleanup. Remaining review limitation: compact transform settling changes stacking order; actual forward/reverse overlap still needs browser acceptance.

Final narrow/cleanup verification:46 tests passed, lint/typecheck/build/diff exit0 after resize correction. Production preview restarted3001 withHTTP200. Visual/native touch/resize/stacking acceptance remains pending because browsercontrol disabled.

## 2026-10-31 — Smaller collection cards

User requested smaller cards from screenshot. Reduced card width to80% across base, desktop-height and short-desktop rules, keeping centered columns, caption font sizes and separate wave/hover layers. Width changes avoid competing with GSAP transforms. Expected result: roughly20% narrower portraits with more surrounding space; captions can wrap on phones. No new tests for this reversible CSS-only sizing change; build/lint/diff and browser limits recorded with final result. Browser visual acceptance remains pending.

Card sizing checks: npm run lint, npm run build (includes TypeScript) and git diff --check exited0. Production preview restarted3001. No fresh browser measurement; previous46 tests concern behavior and were not rerun for this CSS-only change.

## 2026-10-31 — Hide the visible page scrollbar

User explicitly requested removal of the vertical scrollbar shown in screenshot. Hid its visual track/thumb with scrollbar-width:none and WebKit scrollbar display:none, removing the reserved gutter. Native vertical overflow remains enabled, so wheel/touch/keyboard and ScrollTrigger keep their existing scrolling mechanism. No tests added for this reversible CSS-only adjustment; production build/diff verification recorded below. Browser visual checks remain unavailable.

Scrollbar CSS verification: npm run build (including TypeScript) and git diff --check exited0; updated production preview restarted3001. Visual and native scrolling confirmation still require browser access.

## 2026-10-31 — Tighter collection spacing

User requested less space between the smaller cards. Desktop grid tracks now match actual reduced card widths (including height limits) instead of leaving20% empty inside each column; tracks are centered with32px gap. Mobile/tablet vertical gaps reduced to24/28px. This preserves card width, caption type and animation transforms. No tests added for reversible CSS spacing; production build/diff check recorded below, browser visual acceptance pending.

Tighter-spacing validation: npm run build (including TypeScript) and git diff --check exited0; latest preview restarted3001. No fresh browser measurement of spacing available.

## 2026-10-31 — Deployment URL supplied

Developer reports deployment at https://fruityjuicy.vercel.app/. README live link and current deployment status updated. Web reader could not access the URL; HTTP check result is recorded separately. This does not establish deployed animation/responsiveness/performance or source/deployment parity. No deployment, commit or push performed by the agent.

Deployment HTTP verification: Node fetch also failed with a network error; reachability and deployed behavior remain unverified from this environment.

## 2026-10-31 — Authorized commit and push

User requested feat-prefixed commit and push. Reused previously approved Git identity HtetLinLinNaing <htetlinlinnaing.myanmar@gmail.com>; latest typed address was not a valid email. Fresh npm test passed46 tests; lint/typecheck/build and git diff --check exited0. Fetched origin/feat/loading-screen: no ahead/behind commits before this commit. Live browser verification remains blocked by disabled browser access. No claim of verified animation fidelity or60fps.
