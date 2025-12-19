# Repository Guidelines

## Project Structure & Module Organization

- `src/`: React + TypeScript app with feature-first organization.
  - `routes/`: application routes.
  - `features/`: feature modules (can include `components/`, `utils/`, `hooks/`, `api/`, `types/`, `stores/` as needed).
  - `components/`, `hooks/`, `types/`, `utils/`: shared cross-feature modules.
  - Entry points: `App.tsx`, `index.tsx`.
- `public/`: static assets served by Vite.
- `pocketbase/`: backend assets (`pb_migrations/`, `pb_data/`, hooks). Treat as generated/stateful.
- `auth/`: standalone OAuth/OpenID shim used by PocketBase.
- Root configs: `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.yml`.

## Build, Test, and Development Commands

- Install: `pnpm install`
- Dev server: `pnpm start` — runs Vite at `http://localhost:5173`.
- Build: `pnpm run build` — type-checks and outputs to `build/`.
- PocketBase (dev): `pnpm run pocketbase` — serves with migrations enabled.
- Migrations: `pnpm run pocketbase:migration` — snapshot schema to `pocketbase/pb_migrations`.
- Typegen: `pnpm run pocketbase:typegen` — writes `src/types/pocketbase-types.ts`.
- Lint: `pnpm exec eslint .`
- Format: `pnpm exec prettier --write .`
- Docker (PB alt): `docker-compose -f docker-compose.yml up -d`

## Coding Style & Naming Conventions

- TypeScript, 2-space indent (Prettier). Imports auto-sorted (prettier-plugin-sort-imports).
- Components: PascalCase (`QuestList.tsx`); hooks: `useXxx`; utilities: camelCase.
- Prefer function components and named exports. Keep files focused and colocate styles.
- ESLint Flat config with React + TS; Prettier integration resolves style rules.

## Commit & Pull Request Guidelines

- Conventional Commit style observed: `feat(scope): …`, `fix(scope): …`, `refactor(scope): …`.
- PRs should include: concise description, linked issues, screenshots/GIFs for UI, and steps to verify.
- If you change PocketBase collections, commit the updated files from `pocketbase/pb_migrations/` and regenerate `src/types/pocketbase-types.ts`.

## Security & Configuration Tips

- Common envs: `PUBLIC_URL`, `VITE_POCKETBASE_URL`, plus `auth/` service vars (see `auth/README.md`).
- Do not commit secrets. Treat `pocketbase/pb_data/` as local state; avoid sharing production data.
