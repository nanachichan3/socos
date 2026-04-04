#!/bin/sh
set +e
cd /app
exec 2>&1
echo "=== SOCOS API STARTUP $(date) ==="
echo "pwd: $(pwd)"
echo "node: $(node --version 2>&1)"
echo "dist: $(ls dist/ 2>&1)"
echo "DB: ${DATABASE_URL:0:50}..."
node dist/main.js
echo "EXIT: $?"
sleep 9999
