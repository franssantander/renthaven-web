# Repository Guidelines

## Project Structure & Module Organization

RentHaven is a Next.js 16 frontend for rental property management. Routes and layouts live in `src/app/`; keep them focused on composing feature code. Domain modules belong in `src/features/<feature>/`, commonly divided into `components/`, `hooks/`, `queries/`, `services/`, `schemas/`, and `config/`. Reusable primitives are in `src/components/ui/`, shared application components in `src/components/shared/`, providers in `src/providers/`, and API infrastructure in `src/lib/`. Static files belong in `public/`.

Use the `@/*` alias for imports from `src`, for example `@/lib/axios`. Before changing Next.js routing, layouts, server/client components, or configuration, read the relevant bundled guide in `node_modules/next/dist/docs/`; this pinned version includes breaking changes.

## Build, Test, and Development Commands

- `npm install` installs the exact dependencies recorded in `package-lock.json`.
- `npm run dev` starts the local development server at `http://localhost:3000`.
- `npm run lint` runs ESLint with Next.js Core Web Vitals and TypeScript rules.
- `npm run build` creates and type-checks a production build.
- `npm run start` serves an existing production build.

## Coding Style & Naming Conventions

Write strict TypeScript and functional React components. Follow the existing two-space indentation, double quotes, semicolons, and trailing commas. Use kebab-case filenames (`property-form-dialog.tsx`), PascalCase component exports, and `use-` prefixes for hook files and functions. Default to Server Components; add `"use client"` only when browser state, effects, or client-only libraries require it. Keep API calls in services, TanStack Query behavior in queries, and presentation-facing logic in hooks. Use Tailwind CSS classes and existing shadcn/ui primitives.

## Testing Guidelines

No automated test framework or coverage threshold is configured. Until one is added, validate every change with `npm run lint` and `npm run build`, then manually exercise affected routes and loading, empty, success, and error states. If introducing tests, colocate them as `*.test.ts` or `*.test.tsx` and add the runner command to `package.json`.

## Commit & Pull Request Guidelines

Recent commits follow Conventional Commit prefixes such as `feat:` and `refactor:` with concise, imperative summaries. Keep commits focused and avoid mixing unrelated cleanup. Pull requests should explain the user-visible change, identify affected routes, link relevant issues, list validation performed, and include screenshots or recordings for UI changes. Never commit `.env` files; local development requires `NEXT_PUBLIC_API_URL` for the backend endpoint.
