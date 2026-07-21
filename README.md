# dorm-hub

## Requirements
- Node.js 24+ (see `.nvmrc`)
- pnpm 11+
- MongoDB

If you want to use Docker
- docker
- docker compose

## First steps

Install all dependencies from the repo root (pnpm workspace covers client and server):
```
pnpm install
```

Copy `server/.env.example` to `server/.env` and set `JWT_SECRET` (e.g. `openssl rand -hex 48`).

Start the back-end (reachable under localhost:8081 by default):
```
pnpm dev:server
```

For seeding the DB, have MongoDB running and run:
```
pnpm seed
```

In the client folder copy `.env.dev` to `.env`, so the client knows where to reach the backend, then run
```
pnpm dev:client
```
to start the dev environment. The site will be reachable under localhost:8082 by default.

## Docker
Copy `.env.example` to `.env` at the repo root and set `JWT_SECRET`, then run
```
docker compose up --build
```
and test if everything is working correctly.

For seeding the DB inside the mongo container uncomment the seed section in the docker-compose.yml before executing.
Since we are also using a mongo-express container, you can use the GUI under localhost:8085 to interact with the DB.
