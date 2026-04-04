#!/bin/sh
cd /app

echo "[startup] SOCOS API starting..."

# Run prisma db push
if [ -f "/usr/local/bin/prisma" ]; then
  echo "[startup] prisma found, running db push..."
  set +e
  /usr/local/bin/prisma db push --accept-data-loss --skip-generate 2>&1 | while IFS= read -r line; do echo "[prisma] $line"; done
  PRISMA_EXIT=$?
  set -e
  if [ $PRISMA_EXIT -eq 0 ]; then
    echo "[startup] prisma db push succeeded"
  else
    echo "[startup] prisma db push failed (exit $PRISMA_EXIT)"
  fi
else
  echo "[startup] prisma not found"
fi

echo "[startup] Starting NestJS..."
exec node dist/main.js
