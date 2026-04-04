#!/bin/sh
set -e
cd /app
echo "[startup] Starting SOCOS API..."
exec node dist/main.js
