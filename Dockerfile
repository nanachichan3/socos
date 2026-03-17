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

# Copy source including prisma
COPY services/api/ ./services/api/

# Skip prisma generate for now - use prisma client directly
# Generate Prisma client
RUN cd /app/services/api && npm install prisma --save-dev && npx prisma generate

EXPOSE 3001

CMD ["npx", "tsx", "services/api/src/server.ts"]
