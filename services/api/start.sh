#!/bin/sh
cd /app

echo "[startup] SOCOS API starting..."

# Run prisma db push if prisma CLI is available
if [ -f "/usr/local/bin/prisma" ]; then
  echo "[startup] Running prisma db push..."
  set +e
  /usr/local/bin/prisma db push --accept-data-loss --skip-generate 2>&1 | sed 's/^/[prisma] /'
  PRISMA_EXIT=$?
  set -e
  if [ $PRISMA_EXIT -eq 0 ]; then
    echo "[startup] prisma db push succeeded"
  else
    echo "[startup] prisma db push failed (exit $PRISMA_EXIT), continuing anyway"
  fi
fi

echo "[startup] Starting NestJS..."
exec node dist/main.js
