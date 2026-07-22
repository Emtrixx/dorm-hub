# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

dorm-hub is a pnpm-workspace monorepo: a Vue 3 SPA in `client/` (package name `dorm-hub`) and an Express/MongoDB REST API in `server/` (package name `dorm-hub-api`). Run `pnpm install` once at the repo root — it installs both packages. Node 24+ (see `.nvmrc`), pnpm 11+. Packages with install scripts must be approved in `pnpm-workspace.yaml` (`allowBuilds`).

A modernization effort was completed in 2026-07 (see git history): pnpm workspace, Node 24 pin, dependency purge + security upgrades (jsonwebtoken 9, passport 0.7, sharp 0.34, Mongoose 8, Express 5, passport-local-mongoose 8), JWT secret/port moved to env vars, route prefixes normalized to `/<domain>/secure`, server test suite (Vitest + supertest + mongodb-memory-server), Docker rework, CI, client toolchain (Vite 7, Vitest, ESLint 9 flat config, Cypress 14), Pinia stores, and a central API client. Zero `pnpm audit` findings across prod and dev. Optional leftovers: TypeScript, `<script setup>` standardization (convert opportunistically), re-enabling registration.

## Commands

All commands can be run from the repo root via pnpm filters, or inside the package folder.

### Server (`server/`)
- Copy `server/.env.example` to `server/.env` and set `JWT_SECRET` first — `utils/auth.js` throws at startup without it
- `pnpm dev:server` (root) or `pnpm dev` (in `server/`) — start API with nodemon on port 8081 (`PORT` env overrides)
- `pnpm --filter dorm-hub-api start` — start API without reload
- `pnpm seed` (root) — seed the database (MongoDB must be running)
- Requires a local MongoDB at `mongodb://localhost:27017/dorm-hub` unless `DB_URL` is set
- `pnpm --filter dorm-hub-api test` — Vitest + supertest API tests (`tests/app.test.js`) against an in-memory MongoDB; no local mongo needed. In tests, get models via `mongoose.model('Name')` instead of importing model files (double registration through vitest's module graph).

### Client (`client/`)
- Copy `client/.env.dev` to `client/.env` first so the client knows the backend URL (`VITE_HOST`, must end with a trailing slash — call sites concatenate paths directly)
- `pnpm dev:client` (root) or `pnpm serve` (in `client/`) — Vite dev server on port 8082
- `pnpm --filter dorm-hub build` — production build (Vite)
- `pnpm lint` (root) — ESLint 9 flat config (`eslint.config.mjs`); `vue/multi-word-component-names` is off for the existing single-word pages
- `pnpm test:unit` (root) — Vitest unit tests (in `tests/unit/*.spec.js`, jsdom, globals enabled)
- `pnpm --filter dorm-hub test:unit base-card.spec.js` — run a single unit test file
- `pnpm --filter dorm-hub test:e2e` — starts the dev server, then runs Cypress headless (`test:e2e:open` for the GUI); needs the API + seeded DB running

### Docker
- Copy `.env.example` to `.env` at the repo root and set `JWT_SECRET` (compose fails fast without it)
- `docker compose up --build` — full stack: client (:8082), server (:8081), mongo 8, mongo-express GUI (:8085). To seed inside Docker, uncomment the `seeds` service in `docker-compose.yml`.
- All images build with the **repo root** as context (the workspace lockfile lives there); Dockerfiles stay in `client/` and `server/`.

### CI
- `.github/workflows/ci.yml` — client lint + unit tests + build, and a server boot smoke test, on pushes to main and PRs.

## Architecture

### Server
- `app.js` exports the express app; when run directly (`require.main === module`) it connects mongoose and listens on `PORT` (default 8081). Tests import the app without a listener. Loads dotenv only when `NODE_ENV !== "production"`.
- Features are organized per domain under `routes/` (`blackboard/`, `news/`, `wiki/`, `general/`, plus `auth.js`). Each domain has a public `index.js` router on `/<domain>` and a `secure.js` router behind `auth.requireJWT` on `/<domain>/secure`. Secure routers are mounted before public ones in `app.js` — the public blackboard router's catch-all `/:hub` would otherwise swallow `/secure/...` paths. All wiki mutations and news authoring are role-gated on the secure routers; hub create/delete lives at the top of `routes/blackboard/secure.js` (fixed paths must stay above the `/:hub` catch-alls in that file too).
- Auth lives in `utils/auth.js`: Passport local strategy + JWT (bearer token). `passport-local-mongoose` on the User model handles password hashing and adds `email` as the username field — the User schema itself declares `firstName`/`lastName`/`roles`. The JWT secret comes from the `JWT_SECRET` env var (startup throws if unset). `utils/checkConfirmation.js` blocks users whose `status` isn't "Active" (email verification). Registration is currently deactivated (see commit "deactivate registering account for security").
- Roles: `User.roles` is an array of domain roles (`news`, `wiki`, `hubs`; `admin` implies all). `auth.requireRole('<role>')` goes after `requireJWT` — app.js applies it router-wide for `/wiki/secure`; the news and blackboard secure routers apply it per-route so plain logged-in users can still comment. On both, comment deletion and post edit/delete use an author-or-moderator check inside the handler (`hubs` role moderates the blackboard, `news` moderates news comments). Author fields are always stamped from the JWT (`req.user._id`), never taken from the request body. Roles are re-read from the DB on every request (the JWT strategy loads the user), so changes apply without re-login. Assign roles via the admin UI at `/admin` (backed by `routes/admin/secure.js`, mounted behind `requireRole('admin')`: list users, set roles; an admin cannot revoke their own admin role) or with `node scripts/set-roles.js <email> <role,role|none>` (both validate against `utils/roles.js`). The login response includes `roles` for client UI gating (`useAuthStore().hasRole(role)` — display only, never enforcement).
- Mongoose models in `models/`: `Hub` (has admins/members/posts refs), `Post`, `Comment`, `News`, `Wiki`, `User`. The blackboard domain is Hubs → Posts → Comments. Mongoose 8 — no callback-style calls, `new` required for `Types.ObjectId`.
- Uploaded post images are stored on disk in `post-images/` and served statically from the app root; uploads go through `express-fileupload` and are processed with `sharp` (filenames via `node:crypto` `randomUUID`).

### Client
- Vue 3 with Options and Composition API mixed; Bootstrap 5 for styling — CSS, JS bundle, and icons all imported from npm in `main.js` (no CDN). The visual theme lives in `src/assets/theme.css` (design tokens as `--dh-*` CSS vars, Bootstrap overrides, shared classes like `dh-card`, `dh-pills`, `dh-page-head`, `dh-chip`); fonts are self-hosted via Fontsource (Bricolage Grotesque for display, Instrument Sans for body — no Google Fonts CDN, deliberate for GDPR). Vite 7 (`vite.config.mjs`, which also holds the Vitest config); `index.html` lives at the client root. Imports of `.vue` files must include the extension — Vite does not resolve extensionless `.vue` imports.
- State: Pinia stores in `src/stores/` (`auth`, `blackboard`, `news`). Components call `useXStore()` directly inside computed/methods. The auth store mirrors the token to localStorage (the API client reads it from there).
- All HTTP goes through `src/api.js` (`api.get/post/delete(path, body?, { auth })`): prepends the base URL, JSON-encodes non-FormData bodies, attaches the Bearer token when `auth: true`, throws on non-2xx (callers that tolerate failure wrap in try/catch), and returns parsed JSON or raw text. `BASE_URL` is exported for building asset URLs (post images).
- Routing: `src/router.js`. The blackboard section uses nested routes (`/blackboard/:id/:postId`) with `props: true`.
- The backend base URL comes from `import.meta.env.VITE_HOST` (only read in `src/api.js`), defaulting to `http://localhost:8081/`. The Docker client build bakes it in via the `VITE_HOST` build arg — compose sets `/api/` (same-origin). The client image's nginx (`client/nginx.conf`) forwards `/api/` to the server container over the compose network (the server publishes no host port) and serves the SPA with an `index.html` fallback for deep links; the deployment only exposes the client's port 8082.
- Domain components live in `src/components/<domain>/`, shared UI in `src/components/UI/`, route-level pages in `src/pages/`.
