# Build with the repo root as context (see docker-compose.yml) — the pnpm
# workspace lockfile lives there.
FROM node:24-alpine
RUN npm install -g pnpm@11
WORKDIR /repo
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY server/package.json server/
RUN pnpm install --frozen-lockfile --filter dorm-hub-api --prod
COPY server server
WORKDIR /repo/server
# post-images is written at runtime; make it writable for the non-root user
RUN mkdir -p post-images && chown -R node:node /repo/server
USER node
ENV NODE_ENV=production
CMD ["node", "app.js"]
