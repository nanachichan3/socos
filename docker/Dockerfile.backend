# ---- Stage 1: Dependencies ----
FROM node:22-alpine AS deps

WORKDIR /app

RUN apk add --no-cache python3 make g++

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY services/api/package.json services/api/
COPY packages/shared/package.json packages/shared/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/typescript-config/package.json packages/typescript-config/

RUN pnpm install --frozen-lockfile

# ---- Stage 2: Builder ----
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/api/node_modules ./services/api/node_modules
COPY --from=deps /app/packages ./packages

COPY package.json pnpm-workspace.yaml ./
COPY services/api/ services/api/
COPY packages/ packages/

WORKDIR /app/services/api

RUN pnpm prisma generate
RUN pnpm build

# ---- Stage 3: Production runner ----
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder /app/services/api/dist ./dist
COPY --from=builder /app/services/api/package.json ./
COPY --from=builder /app/services/api/node_modules ./node_modules
COPY --from=builder /app/node_modules/.pnpm node_modules/.pnpm
COPY --from=builder /app/services/api/prisma ./prisma

USER nestjs

EXPOSE 3001

ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=10s --retries=5 \
  CMD wget -q --spider http://localhost:3001/health/check || exit 1

CMD ["node", "dist/main.js"]
