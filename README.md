# Fruity Juicy

Project foundation for PRD 01: Next.js, TypeScript, App Router, Tailwind CSS, npm and ESLint.

## Requirements

- Node.js 24.x (verified with 24.16.0).
- npm 11.x (verified with 11.13.0).
- The selected Next.js release requires at least Node.js 20.9.0; this project standardizes on Node.js 24.x.

Dependency versions are recorded in package.json and package-lock.json. Use npm to preserve the lockfile.

## Local setup

Open a terminal in this folder:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. If that port is occupied, use the URL printed by Next.js or choose a port with `npm run dev -- --port 3001`.

The initial page displays only the Fruity Juicy heading. It uses system fonts and local styles; no credentials, environment files, external media or API services are required.

## Commands

| Command | Purpose |
| --- | --- |
| npm ci | Reproduce dependencies from the committed lockfile. |
| npm run dev | Start development with automatic refresh. |
| npm run build | Create the production build. |
| npm run start | Serve an existing production build. |
| npm run lint | Check Next.js and TypeScript lint rules; warnings fail the check. |
| npm run typecheck | Check strict TypeScript without emitting files. |

## Structure

```text
public/                         Reserved local static assets
src/app/layout.tsx              English document, metadata and global styles
src/app/page.tsx                Server-rendered placeholder at /
src/app/globals.css             Tailwind import and system font
eslint.config.mjs               Next.js and TypeScript lint rules
next.config.ts                  Minimal framework configuration
next-env.d.ts                   Framework-generated TypeScript references
postcss.config.mjs              Tailwind PostCSS integration
tsconfig.json                   Strict mode and @/* -> src/* alias
package.json                    Dependencies, scripts and runtime requirements
package-lock.json               Reproducible npm dependency tree
docs/README.md                  Documentation index
docs/01-project-setup/          Setup PRD, implementation plan and verification
```

Keep the root layout and placeholder as Server Components. Introduce client boundaries only when later features need them. Next.js generates or updates next-env.d.ts; do not hand-edit it.

Documentation is grouped by project layer. See the [documentation index](./docs/README.md) for the [setup PRD](./docs/01-project-setup/prd.md), [implementation plan](./docs/01-project-setup/implementation-plan.md), and [verification report](./docs/01-project-setup/verification.md).

## Verification

From a fresh installation, before starting a server:

```powershell
npm ci
npm run lint
npm run typecheck
npm run build
npm run start
```

Open http://localhost:3000 and confirm the Fruity Juicy heading appears with centered layout and responsive text. Stop the server with Ctrl+C. Then run `npm run dev` and repeat the visual checks at viewport widths 375, 768 and 1440 pixels. Confirm no horizontal scrolling, browser application errors or hydration warnings. The initial render should request no external fonts, media or APIs.

A production build must finish before `npm run start`. Linting and type checking are separate explicit checks. Automated test infrastructure, animation libraries, page sections, design tokens, CI and deployment belong to later PRDs.

## Installed versions

| Package | Version |
| --- | --- |
| next | 16.4.3 |
| react | 19.3.0 |
| react-dom | 19.3.0 |
| @tailwindcss/postcss | 4.3.3 |
| @types/node | 24.19.2 |
| @types/react | 19.3.0 |
| @types/react-dom | 19.3.0 |
| eslint | 9.39.5 |
| eslint-config-next | 16.4.3 |
| tailwindcss | 4.3.3 |
| typescript | 5.9.3 |

## Dependency compatibility note

ESLint is pinned to 9.39.5 because the React, accessibility and import plugins bundled by eslint-config-next 16.4.3 do not declare ESLint 10 compatibility. npm may show an upstream deprecation warning for ESLint 9; lint checks still run with zero warnings. Upgrade the lint stack together when those plugins support ESLint 10.
