# Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Deliver the minimal working foundation approved in PRD 01.

**Architecture:** Use the existing Desktop project directory, with Next.js App Router under src/app. Keep the root layout and placeholder page as Server Components. Tailwind supplies styling through globals.css and PostCSS; no external resources or application features are introduced.

**Tech Stack:** Next.js, TypeScript, App Router, Tailwind CSS, npm, ESLint.

**Spec:** ../../../01_project_setup.md

## Global Constraints

- TypeScript strict mode.
- A src/ directory with the @/* import alias mapped to src/*.
- Use compatible stable releases at initialization.
- Record installed dependency versions in package.json and preserve package-lock.json.
- The lint script must run ESLint directly. The type-check script must run tsc --noEmit.
- Keep the initial page independent of external fonts, media, APIs, and credentials.
- GSAP, Lenis, application features, testing infrastructure, CI, and deployment are deferred.
- Preserve 01_project_setup.md and this plan.

## Review Focus

- Fresh install: npm ci must reproduce dependencies without manual changes.
- Direct typecheck: npm run typecheck must work before a production build.
- Small screens: the placeholder must not overflow at 375, 768, and 1440 pixel viewport widths.
- Offline page resources: initial rendering must not require external fonts or media.
- Production behavior: npm run start must serve the same placeholder after a successful build.

## File Responsibilities

- package.json / package-lock.json: dependencies, reproducible installation, scripts, supported runtime.
- tsconfig.json / next-env.d.ts: strict typing, Next.js types, src import alias.
- next.config.ts: minimal framework configuration.
- eslint.config.mjs: Next.js Core Web Vitals and TypeScript rules, generated-file exclusions.
- postcss.config.mjs: Tailwind PostCSS integration.
- src/app/layout.tsx: English document, metadata, global stylesheet, children.
- src/app/page.tsx: server-rendered Fruity Juicy placeholder with responsive Tailwind utilities.
- src/app/globals.css: Tailwind import and minimal global styles.
- public/: reserved static assets directory; no production assets yet.
- .gitignore: dependencies, build artifacts, environment files, logs, local tooling scratch.
- README.md: prerequisites, exact installed tool versions, installation, commands, structure, verification.

### Task 1: Initialize and Verify the Project Foundation

**Files:** All files listed above.

**Interfaces:**
- Consumes: approved PRD and existing empty Desktop project directory.
- Produces: root route /; npm scripts dev, build, start, lint, typecheck; @/* resolving src/*.

- [x] Inspect Node.js/npm versions and check the selected stable Next.js release's engine requirements. Verify Git repository status with appropriate access. Use the user-selected Desktop folder; do not relocate the application without consent.
- [x] Establish baseline evidence: package.json and src/app/page.tsx are absent. Setup/configuration work uses executable acceptance checks, without introducing automated test infrastructure deferred by the PRD.
- [x] Initialize the project using explicit TypeScript, App Router, Tailwind, ESLint, npm, src directory and @/* choices. If the initializer rejects the existing PRD, scaffold in a temporary child directory and transfer only new scaffold files without overwriting existing documents. Use current stable versions compatible with the runtime and keep unrelated opt-in features disabled.
- [x] Set scripts: dev = next dev; build = next build; start = next start; lint = eslint . --max-warnings=0; typecheck = tsc --noEmit. Enable strict mode and src alias. Keep Next.js and eslint-config-next versions compatible.
- [x] Implement default export RootLayout({ children }: Readonly<{ children: React.ReactNode }>) in src/app/layout.tsx, with html lang="en", title "Fruity Juicy", description "Fruity Juicy project foundation.", and globals.css imported. Do not add use client or external font loading.
- [x] Implement default export Home() in src/app/page.tsx as a main element containing the heading "Fruity Juicy". Use Tailwind utilities for responsive padding, centered layout and text sizing. Do not add navigation, animation or content sections.
- [x] Configure Tailwind through @tailwindcss/postcss and the global CSS import, using the supported configuration of the selected release. Keep default system fonts and remove starter promotional assets.
- [x] Document Node.js/npm requirements, installed versions, npm ci, all six scripts, folder responsibilities and verification steps in README.md. Add .gitignore exclusions and preserve the PRD.
- [x] Run npm ci, npm run lint, npm run typecheck, npm run build. Expected: every command exits 0; lint has zero warnings. Run typecheck before build to detect generated-type dependencies.
- [x] Start npm run dev on an available local port; inspect / in a browser at viewport widths 375, 768, 1440. Expected: visible Fruity Juicy heading, computed Tailwind styling, document scrollWidth <= viewport width, no application errors or hydration warnings, no external font/media/API requests. Stop the verification server afterward.
- [x] Start npm run start after the build; inspect /. Expected: HTTP 200 and the same styled placeholder. Stop the verification server afterward.
- [x] Review all SET-01 through SET-09 requirements and acceptance criteria against observed evidence. Record verification results and any limitations, without marking unperformed checks as passed.
- [x] Review the complete changes against the PRD. Commit setup files, README and lockfile only if Git is initialized and a local commit is appropriate; never publish or push as part of setup.

## Plan Self-Review

The single task covers every setup requirement, README requirement and acceptance criterion in PRD 01. Browser and command checks exercise all five review-focus conditions. No new application design decisions, animation dependencies, testing framework or deployment are included.
