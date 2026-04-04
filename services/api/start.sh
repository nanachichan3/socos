#!/bin/sh
set -e
cd /app
echo "[startup] === SOCOS API starting ==="
echo "[startup] Starting NestJS..."
exec node dist/main.js
