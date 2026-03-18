# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

TypeScript monorepo (SOCOS — gamified personal CRM) using **pnpm 10.10.0** workspaces + **Turborepo 2**. Three runnable services and shared packages. See `README.md` for structure and `package.json` for available root scripts (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`, etc.).

### Services

| Service | Port | Dev command (from root) |
|---|---|---|
| Next.js 16 app (Turbopack) | 3000 | `pnpm --filter @socos/web dev` |
| React + Vite 8 platform app | 5173 (or via `/platform/*` on port 3000) | `pnpm --filter @socos/platform dev` |
| NestJS 11 backend | 3001 | See NestJS note below |

### Non-obvious gotchas

- **PostgreSQL required**: The NestJS API uses Prisma with PostgreSQL. Start a Postgres instance (e.g. `sudo docker run -d --name socos-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=socos -p 5432:5432 postgres:15-alpine`). Then copy `services/api/.env.example` to `services/api/.env` and run `cd services/api && npx prisma db push` to sync the schema.
- **NestJS `ts-node/esm` broken on Node 22**: The package.json `start` script uses `node --loader ts-node/esm` which crashes on Node 22. Instead, build first with `cd services/api && ./node_modules/.bin/nest build` then run `node dist/main.js`. Alternatively use `npx tsx ./src/main.ts` (starts but NestJS DI won't fully work due to missing `emitDecoratorMetadata` support in esbuild). The compiled `dist/main.js` approach is the reliable one.
- **API build: exclude `server.ts`**: `src/server.ts` is an alternative Express server with pre-existing type errors. It's excluded from `tsconfig.json` so `nest build` succeeds. Don't re-include it.
- **Auth controller is a stub**: The `AuthController` returns placeholder responses. To use authenticated endpoints (contacts, interactions, etc.), create a user directly via Prisma and generate a base64 token manually (see `JwtService` for the format).
- **ESLint legacy config**: All packages use `.eslintrc.cjs` (legacy format) but depend on ESLint 9+. You must set `ESLINT_USE_FLAT_CONFIG=false` before running `pnpm lint`, otherwise ESLint will fail looking for `eslint.config.js`. Example: `ESLINT_USE_FLAT_CONFIG=false pnpm lint`.
- **pnpm build scripts**: pnpm 10 blocks build scripts by default. After `pnpm install`, run `pnpm rebuild esbuild @nestjs/core unrs-resolver bcrypt prisma @prisma/client` to ensure platform-specific binaries are available.
- **Tailwind CSS 4**: Uses CSS-first config (`@import "tailwindcss"` + `@theme` blocks in CSS). No `tailwind.config.ts` files. Next.js uses `@tailwindcss/postcss`, React app uses `@tailwindcss/vite`.
- **No test files**: No `.spec.ts` or `.test.ts` files exist yet. The API's Jest config has `--passWithNoTests`. Vitest in other packages will exit with no tests found.
- **Platform reverse proxy**: The Next.js app proxies `/platform/*` requests to the Vite dev server at `localhost:5173`. The Vite app's `base` is set to `/platform/` so assets resolve correctly. Both the Next.js web and platform Vite servers must be running for the proxy to work.
- **`@vercel/style-guide` removed**: The archived package was replaced with `eslint-config-next` directly in the eslint-config package.
