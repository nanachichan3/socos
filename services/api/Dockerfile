FROM node:22-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy just the api folder
COPY services/api/package.json services/api/pnpm-lock.yaml* ./
COPY services/api/ ./services/api/
COPY packages/ ./packages/

# Install deps
RUN pnpm install

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3001

CMD ["pnpm", "exec", "tsx", "src/server.ts"]
