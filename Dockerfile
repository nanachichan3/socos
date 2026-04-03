# Combined SOCOS: Next.js web + NestJS API in one container
# API runs on :3001, Next.js on :3000 (proxies /api/* → :3001)
FROM node:22-alpine AS deps

WORKDIR /app

RUN apk add --no-cache python3 make g++

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY services/api/package.json services/api/
COPY packages/shared/package.json packages/shared/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/typescript-config/package.json packages/typescript-config/

RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

COPY --from=deps /app/ ./

COPY apps/web/ apps/web/
COPY services/api/ services/api/
COPY packages/ packages/

# Build Next.js
WORKDIR /app/apps/web
RUN pnpm build

# Build NestJS
WORKDIR /app/services/api
RUN pnpm prisma generate
RUN pnpm build

# Copy Prisma client
RUN cp -r /app/node_modules/.pnpm/@prisma+client*/node_modules/@prisma/client /app/services/api/node_modules/@prisma/client || true
RUN cp -r /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma /app/services/api/node_modules/.prisma || true

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache tini && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Next.js standalone build
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Copy NestJS API
COPY --from=builder /app/services/api/dist ./services/api/dist
COPY --from=builder /app/services/api/prisma ./services/api/prisma
COPY --from=builder /app/services/api/node_modules ./services/api/node_modules
COPY --from=builder /app/services/api/package.json ./services/api/package.json
COPY --from=builder /app/services/api/start.sh ./services/api/start.sh

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV API_INTERNAL_URL=http://localhost:3001

HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=30s \
  CMD node -e "const http = require('http'); http.get('http://localhost:3000/', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Run both: API on 3001, Next.js on 3000
CMD ["tini", "--", "sh", "-c", "node /app/services/api/dist/main.js & node /app/apps/web/server.js"]
