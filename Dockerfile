FROM node:22-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files from root
COPY pnpm-lock.yaml package.json ./
COPY services/api/package.json services/api/
COPY packages/ ./packages/

# Install deps
RUN pnpm install

# Copy source
COPY services/api/ ./services/api/

# Generate Prisma client
RUN cd services/api && npx prisma generate

EXPOSE 3001

CMD ["pnpm", "exec", "tsx", "services/api/src/server.ts"]
