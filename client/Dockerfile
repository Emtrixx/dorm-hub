# Build with the repo root as context (see docker-compose.yml) — the pnpm
# workspace lockfile lives there.
FROM node:24-alpine AS build-stage
RUN npm install -g pnpm@11
WORKDIR /repo
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY client/package.json client/
RUN pnpm install --frozen-lockfile --filter dorm-hub
COPY client client
# Base URL the SPA calls the API on. "/api/" keeps it same-origin behind a
# reverse proxy (no CORS); defaults to the local dev API for bare builds.
ARG VITE_HOST=http://localhost:8081/
ENV VITE_HOST=$VITE_HOST
RUN pnpm --filter dorm-hub build

FROM nginx:stable-alpine AS production-stage
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /repo/client/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
