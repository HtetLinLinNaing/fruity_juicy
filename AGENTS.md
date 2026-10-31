<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project working agreement

- Read README.md, PROCESS.md, and the relevant code before proposing changes.
- Clarify unclear behavior and confirm substantial design or refactor scope before implementation. Continue within an already approved scope without repeated approval prompts.
- Explain significant choices so the developer can defend them in an interview. Do not claim the developer understands or reviewed generated code without evidence.
- Keep changes focused. Preserve unrelated edits, assets, and tests. Do not commit, push, or deploy without authorization.
- Prefer existing tools and dependencies; explain why a new dependency is necessary.
- Use Context7 for current library, framework, SDK, API, CLI, or cloud-service documentation: resolve the library ID first, then query the selected library with the full question. General business logic and documentation-only cleanup do not require library lookup.
- Follow the bundled Next.js guidance referenced above before changing framework code.
- Animate transform and opacity where possible; clean up animations, listeners, and timers. Account for reduced motion, asset failure, keyboard access, and small screens.
- Use tests for meaningful behavior and browser checks for visual and interaction behavior. Report actual commands, results, and untested limits before claiming completion.
- Keep README.md accurate about implemented features and submission status. Record significant decisions and dated verification in PROCESS.md, distinguishing historical evidence from new checks.
- Keep planning proportionate. Prefer a short checklist in the discussion or PROCESS.md over new PRD/plan/report folders unless the developer asks for them.

## Verification rules

- Before a meaningful behavior change, list the expected observable outcomes and important failure cases.
- Choose the smallest effective checks for those outcomes. Do not use test count or coverage percentage as a completion target.
- Each test must have a clear purpose and assert a useful result. Explain which behavior it protects.
- Identify mocked dependencies and what those mocks exclude from verification. A mock is a controlled substitute, not an assumption of success; simulate relevant success, failure, delay, or missing-response cases where they affect the behavior under test.
- Do not claim a real dependency or integration works solely because its mocked substitute passed. Check real components working together where the integration matters.
- Use real-browser checks for animation, interaction between components, responsive layout, and browser-specific behavior. Use profiling before claiming performance targets.
- For a critical safeguard, selectively confirm that its test detects a relevant mistake. Restore the correct implementation afterward. Do not require this exercise for every test.
- Report checked, failed, and not-checked items separately. Include the actual command or observation and relevant limitations. Record significant verification evidence in PROCESS.md.
- Do not claim complete coverage, animation fidelity, accessibility, or performance from unrelated passing tests.
- If meaningful behavior remains unverified, state that clearly rather than adding weak tests to increase the count.
