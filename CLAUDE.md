# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

dorm-hub is a pnpm-workspace monorepo: a Vue 3 SPA in `client/` (package name `dorm-hub`) and an Express/MongoDB REST API in `server/` (package name `dorm-hub-api`). Run `pnpm install` once at the repo root — it installs both packages. Node 24+ (see `.nvmrc`), pnpm 11+. Packages with install scripts must be approved in `pnpm-workspace.yaml` (`allowBuilds`).

A modernization effort is in progress (see git history). Done so far: pnpm workspace, Node 24 pin, dependency purge + security upgrades (jsonwebtoken 9, passport 0.7, sharp 0.34, Mongoose 8, Express 5, passport-local-mongoose 8), JWT secret/port moved to env vars, route prefixes normalized to `/<domain>/secure`, server test suite (Vitest + supertest + mongodb-memory-server), Docker rework, CI, and the client toolchain (Vite 7, Vitest, ESLint 9 flat config, Cypress 14). Zero `pnpm audit` findings across prod and dev. Still planned: Vuex→Pinia, `<script setup>` standardization, central API client, optional TypeScript.

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
- Features are organized per domain under `routes/` (`blackboard/`, `news/`, `wiki/`, `general/`, plus `auth.js`). Each domain has a public `index.js` router on `/<domain>` and a `secure.js` router behind `auth.requireJWT` on `/<domain>/secure`. Secure routers are mounted before public ones in `app.js` — the public blackboard router's catch-all `/:hub` would otherwise swallow `/secure/...` paths. Note: several mutating wiki routes (add/remove/rename category, removeArticle) are in the PUBLIC router — unauthenticated by design of the original code; flagged for hardening.
- Auth lives in `utils/auth.js`: Passport local strategy + JWT (bearer token). `passport-local-mongoose` on the User model handles password hashing and adds `email` as the username field — the User schema itself only declares `firstName`/`lastName`. The JWT secret comes from the `JWT_SECRET` env var (startup throws if unset). `utils/checkConfirmation.js` blocks users whose `status` isn't "Active" (email verification). Registration is currently deactivated (see commit "deactivate registering account for security").
- Mongoose models in `models/`: `Hub` (has admins/members/posts refs), `Post`, `Comment`, `News`, `Wiki`, `User`. The blackboard domain is Hubs → Posts → Comments. Mongoose 8 — no callback-style calls, `new` required for `Types.ObjectId`.
- Uploaded post images are stored on disk in `post-images/` and served statically from the app root; uploads go through `express-fileupload` and are processed with `sharp` (filenames via `node:crypto` `randomUUID`).

### Client
- Vue 3 with Options and Composition API mixed; Bootstrap 5 for styling (CSS from npm in `main.js`, JS bundle + icons from CDN in `index.html`). Vite 7 (`vite.config.mjs`, which also holds the Vitest config); `index.html` lives at the client root. Imports of `.vue` files must include the extension — Vite does not resolve extensionless `.vue` imports.
- State: Vuex 4 with one module per domain (`store/auth`, `store/blackboard`, `store/news`, `store/wiki`), each split into `index.js`/`actions.js`/`mutations.js`/`getters.js`. API calls happen in the actions via `fetch`.
- Routing: `src/router.js`. The blackboard section uses nested routes (`/blackboard/:id/:postId`) with `props: true`.
- The backend base URL is read from `import.meta.env.VITE_HOST`, defaulting to `http://localhost:8081/` — read inline at every call site (a central API client is planned). Note: the Docker client build has no `.env`, so it bakes in the localhost default.
- Domain components live in `src/components/<domain>/`, shared UI in `src/components/UI/`, route-level pages in `src/pages/`.
