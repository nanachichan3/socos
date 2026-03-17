FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm turbo

# Copy all files
COPY . .

# Install deps
RUN pnpm install

# Generate Prisma client
RUN cd services/api && pnpm prisma generate

EXPOSE 3001

CMD cd services/api && pnpm exec tsx src/server.ts
