# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

RentHaven is a rental property management web app (landlords/property managers collect rent, manage tenants, track leases, handle maintenance requests). Frontend only — talks to a separate backend API.

## Important: non-standard Next.js version

This project pins a Next.js version (`16.2.10`) that is newer than this model's training data and has breaking changes vs. the Next.js you may know — APIs, conventions, and file structure may differ. **Before writing any Next.js-specific code (routing, layouts, server/client components, config), check `node_modules/next/dist/docs/`** (`01-app/`, `02-pages/`, `03-architecture/`, `04-community/`) for the current API rather than relying on prior knowledge. Heed any deprecation notices found there.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint
```

There is no test runner configured in this repo yet.

## Environment

Requires a `.env` with `NEXT_PUBLIC_API_URL` pointing at the backend API (e.g. `http://localhost:81/api/v1`). The axios client sends credentials (`withCredentials: true`), so auth is cookie/session based, not token-in-header based.

## Architecture

Feature-based structure under `src/`:

- `src/app/` — Next.js App Router routes only (pages, layouts). Route groups like `(auth)` organize URL-less layout scoping (e.g. `src/app/(auth)/login`, `src/app/(auth)/magic-link`). Keep business logic out of these files — they should compose feature components/hooks.
- `src/features/<feature>/` — one directory per domain feature (currently `auth`, `landing`), each internally split into:
  - `components/` — UI for the feature
  - `hooks/` — thin presentation-facing hooks (e.g. `use-login.ts`) that wrap query hooks and expose a simple interface (`onSubmit`, `isPending`, etc.) to components
  - `queries/` — TanStack Query hooks (`useQuery`/`useMutation`) that call into `services/`, own `queryKey`s and cache invalidation
  - `services/` — plain functions calling `axiosClient`, no React/query code
  - `schemas/` — Zod schemas + inferred types for form/input validation
  - This layering is consistent — when adding a feature, follow the same split rather than putting API calls or query logic directly in components.
- `src/components/ui/` — shadcn/ui primitives (managed via `shadcn` CLI, see `components.json`; style `base-nova`, base color `neutral`, icons from `lucide-react`).
- `src/components/shared/` — cross-feature layout components (site header/footer).
- `src/lib/axios/` — shared axios instance and error handling:
  - `client.ts` defines the single `axiosClient` (baseURL from `NEXT_PUBLIC_API_URL`, credentials, 30s timeout).
  - `interceptors.ts` normalizes every error into `ApiError` and logs by status code (401/403/422/429/5xx) — imported for side effects via `src/lib/axios/index.ts`.
  - `errors.ts` defines `ApiError` (status, code, field-level `validationErrors`, raw `data`) and `parseApiError`. Always go through this rather than handling raw axios errors in feature code.
  - Import the client via the barrel: `import { axiosClient } from "@/lib/axios"`.
- `src/providers/query-provider.tsx` — wraps the app in a single `QueryClient` (`staleTime` 60s, no refetch-on-focus, mutations don't retry). Mounted once in the root `src/app/layout.tsx`.
- `src/lib/utils/utils.ts` — shadcn's `cn()` helper etc.
- Path alias `@/*` maps to `src/*` (see `tsconfig.json` / `components.json` aliases: `@/components`, `@/lib`, `@/hooks`, `@/features` follow the same convention even though not all are declared explicitly).

## Conventions observed in this codebase

- Client components are marked explicitly with `"use client"` (e.g. `query-provider.tsx`); default to Server Components otherwise per the App Router model.
- Query keys are plain string arrays (e.g. `["current-user"]`) co-located with the query hook that owns them; mutations invalidate the relevant key in `onSuccess`.
- Styling uses Tailwind v4 (`@tailwindcss/postcss`) with shadcn's CSS variables approach (`src/app/globals.css`), no separate `tailwind.config`.
