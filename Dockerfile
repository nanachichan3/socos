FROM node:22-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for caching
COPY services/api/package.json services/api/pnpm-lock.yaml ./

# Install deps
RUN pnpm install

# Copy rest of files
COPY services/api/ ./services/api/
COPY packages/ ./packages/

# Generate Prisma client
RUN pnpm prisma generate

EXPOSE 3001

CMD ["pnpm", "exec", "tsx", "services/api/src/server.ts"]
