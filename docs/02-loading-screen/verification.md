# Loading Screen Verification

**PRD:** [Loading screen](./prd.md)

**Plan:** [Implementation plan](./implementation-plan.md)

**Date:** 2026-10-30 (Asia/Bangkok)

**Status:** Complete

## Evidence

- Lifecycle tests: 10/10 passed. Eight assertions were observed failing against the empty implementation before behavior was added; disposal tests also exercise real scheduled timers after implementation.
- Development browser scenarios: 13/13 passed with controlled time and real rendering at 320, 375, 768 and 1440px.
- The ten fruits load in the exact specified order and remain in one row. Screenshots confirm the centered white layout, blue stationary label and uncropped images.
- Transform samples prove adjacent fruits have opposite translations, same-parity fruits share translation, both groups reverse together and displacement stays within 12px.
- Image/deadline scenarios passed: cached reload, delayed asset, failed asset, decode rejection, never-settling image request and never-settling decode. Deadline tests verify the loader releases the page after the independent timeout and fade.
- Motion preference checks passed: initially reduced motion, live enable/disable, reduced-motion short exit and preference change during fade. Browser tests wait for the actual MediaQueryList change event before measuring behavior.
- With JavaScript disabled the placeholder remains visible and interactive, without a blocking overlay.
- A temporary isolated route exercised actual React mount/unmount cleanup: one repeating tween after development effect setup; zero after unmount; prior overflow values and !important priorities restored; prior inert true/false restored; keyboard focus blocked and restored; no late timeout effects after unmount. The route was removed.
- No uncaught application errors or hydration warnings occurred in these checks. The failed-image case intentionally generated an HTTP 404 resource error.

## Final Gates

- npm test: 10/10 passed after the final fix.
- npm run lint: passed, zero warnings/errors.
- npm run typecheck: passed.
- npm run build: passed; / remains statically rendered.
- Production browser scenarios: 13/13 passed after the final fix, including console-error and hydration-warning capture.
- npm audit --audit-level=moderate: 0 vulnerabilities.
- Temporary production server stopped; the user's existing development server was preserved.
- Independent review found one Important issue in scroll restoration. A real browser regression failed before the fix and passed afterward for both normal dismissal and early unmount. Each overflow axis's value and priority is now restored independently. No Critical or Minor findings.
- Both temporary test routes were removed; the production route list contains only / and the framework not-found page.

## Implementation Decisions

- Use the selected Desktop checkout on feature branch feat/loading-screen; preserve existing uncommitted documents and assets. No worktree relocation, push, merge or deployment.
- Track execution in a plan-specific ignored PowerShell/Node ledger because the skill helper scripts target POSIX shells. Test and review evidence is summarized here for portability.
- Declare package type module for the existing ESM-based code and configuration, allowing Node 24 to import the TypeScript lifecycle directly without module-reparse warnings. The package test command uses supported native type stripping.
- Use GSAP alone for animation, a small framework-independent lifecycle controller for timers and readiness, and the existing Next.js Image component for eager local assets. No ScrollTrigger, Lenis or additional test-framework dependency.
- A stalled image or decode may outlive the deadline; abort and disposed guards prevent it from touching the unmounted overlay. Reduced motion skips the normal minimum after readiness, while retaining the independent maximum.

## Verification Limits

The accessible status semantics and absence of repeated status-text mutations were inspected, but announcement behavior was not manually tested with a physical screen reader. The single static status uses standard live-region markup; screen-reader behavior can vary by browser and assistive technology. Unit tests cover deterministic lifecycle behavior; browser checks used temporary local scripts and captures rather than an installed browser-test framework. Their results are recorded above.
