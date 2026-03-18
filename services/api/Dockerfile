FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root package files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Copy packages
COPY packages/ ./packages/

# Copy service package files
COPY services/api/package.json services/api/tsconfig.json services/api/turbo.json services/api/nest-cli.json ./

# Install all deps
RUN pnpm install

# Copy API source
COPY services/api/ ./services/api/

# Generate Prisma client
RUN cd services/api && pnpm prisma generate

EXPOSE 3001

WORKDIR /app/services/api
CMD ["pnpm", "exec", "tsx", "src/server.ts"]
