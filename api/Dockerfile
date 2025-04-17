FROM node:20.18.1-alpine AS base

FROM base AS builder
ENV SHELL=/bin/sh
ENV PNPM_HOME=/usr/local/bin
ENV PATH="${PNPM_HOME}:${PATH}"

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY . .

RUN apk add --no-cache gcompat
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

USER hono
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .

CMD ["node", "dist/index.js"]