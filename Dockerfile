FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy all files
COPY . .

# Install deps and setup
RUN pnpm install && \
    cd services/api && \
    pnpm install && \
    pnpm prisma generate

EXPOSE 3001

CMD cd services/api && pnpm exec tsx src/server.ts
