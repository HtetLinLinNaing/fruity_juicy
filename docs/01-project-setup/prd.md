# PRD 01 — Project Setup

**Project:** Fruity Juicy  
**Status:** Approved  
**Layer:** Project foundation

## 1. Objective

Establish a minimal, working Next.js project that provides a consistent foundation for later development layers.

This PRD defines setup requirements only. It does not authorize implementation of page designs or features.

## 2. Technology Stack

| Area | Choice |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Routing architecture | App Router |
| Styling | Tailwind CSS |
| Package manager | npm |
| Linting | ESLint |

Use compatible stable releases at initialization. Record the installed versions in `package.json` and commit `package-lock.json` for reproducible installations.

## 3. Scope

The project setup must include:

- Application initialization and dependency installation.
- TypeScript strict mode.
- Tailwind CSS configuration and global stylesheet.
- ESLint configuration using Next.js recommendations.
- A `src/` directory with the `@/*` import alias mapped to `src/*`.
- A minimal root layout and placeholder home page.
- Development, build, production, lint, and type-check commands.
- A README with local setup and verification instructions.
- A `.gitignore` covering dependencies, build output, local environment files, and logs.

## 4. Initial Structure

```text
fruity-juicy/
├── public/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

Additional folders should be introduced when a later layer needs them.

## 5. Setup Requirements

| ID | Requirement |
|---|---|
| SET-01 | Initialize Next.js with TypeScript and App Router using npm. |
| SET-02 | Enable TypeScript strict mode and configure the `@/*` alias. |
| SET-03 | Configure Tailwind CSS and import the global stylesheet through the root layout. |
| SET-04 | Configure ESLint with Next.js recommendations and TypeScript support. |
| SET-05 | Keep the root layout and home page as Server Components unless client behavior becomes necessary. |
| SET-06 | Replace starter promotional content with a simple “Fruity Juicy” placeholder. |
| SET-07 | Set the document language to English and provide a basic page title and description. |
| SET-08 | Keep the initial page independent of external fonts, media, APIs, and credentials. |
| SET-09 | Document the required Node.js and npm versions based on the selected Next.js release. |

## 6. Project Commands

| Command | Purpose |
|---|---|
| `npm ci` | Install dependencies from the lockfile. |
| `npm run dev` | Start the local development server. |
| `npm run build` | Generate a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run TypeScript checks without emitting files. |

The lint script must run ESLint directly. The type-check script must run `tsc --noEmit`.

## 7. README Requirements

The README must explain:

- The purpose and scope of this setup layer.
- Required Node.js and npm versions.
- Dependency installation and local startup.
- Available project commands.
- The initial folder structure.
- How to check linting, types, and the production build.

## 8. Acceptance Criteria

- [x] A fresh checkout installs successfully using `npm ci`.
- [x] `npm run dev` serves the placeholder home page.
- [x] Tailwind utility classes visibly apply to the placeholder.
- [x] The page has no horizontal overflow at mobile, tablet, and desktop widths.
- [x] The browser reports no application errors or hydration warnings.
- [x] `npm run lint` completes without warnings or errors.
- [x] `npm run typecheck` completes without errors.
- [x] `npm run build` completes successfully.
- [x] `npm run start` serves the production build successfully.
- [x] The README provides enough information to repeat these checks.

## 9. Deferred to Later PRDs

- Visual identity, design tokens, and reusable UI components.
- Loading screen, hero, and content sections.
- GSAP, ScrollTrigger, Framer Motion, Lenis, and Locomotive Scroll.
- Animation behavior and smooth scrolling.
- Images, illustrations, and other production assets.
- Additional routes, backend services, authentication, and databases.
- Automated testing infrastructure, CI, and deployment.

## 10. Completion Definition

This layer is complete when the minimal application runs locally, all setup checks pass, and another developer can reproduce the setup using the README.
