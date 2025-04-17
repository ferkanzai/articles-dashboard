FROM node:20.18.1-alpine AS base

FROM base AS builder
ENV SHELL=/bin/sh
ENV PNPM_HOME=/usr/local/bin
ENV PATH="${PNPM_HOME}:${PATH}"

RUN apk update
RUN apk add --no-cache libc6-compat gcompat git python3 make g++

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

FROM base AS runner

WORKDIR /app

RUN npm i -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["serve", "-s", "-l", "8000", "dist"]