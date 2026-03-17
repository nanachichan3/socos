FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY services/api/package.json services/api/pnpm-lock.yaml* ./
COPY packages/ ./packages/
COPY services/api/ ./services/api/

# Install dependencies
RUN cd services/api && pnpm install --frozen-lockfile

# Generate Prisma client
RUN cd services/api && npx prisma generate

EXPOSE 3001

CMD cd services/api && pnpm exec tsx src/server.ts
