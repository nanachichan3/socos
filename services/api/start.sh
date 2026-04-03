#!/bin/sh
set -e

echo "[startup] === SOCOS API starting ==="

# ─── Step 1: Create socos database if missing ─────────────────────────────
# Strip sslmode from URL so pg client respects our ssl: false setting.
if echo "$DATABASE_URL" | grep -q '?'; then
  cleanUrl=$(echo "$DATABASE_URL" | sed 's/?.*//')
else
  cleanUrl="$DATABASE_URL"
fi
defaultUrl="${cleanUrl}/postgres"
echo "[db-check] Connecting to: ${defaultUrl##*@}"

node -e "
const { Client } = require('pg');
const url = '$defaultUrl';
console.log('[db-check] Connecting to:', url.split('@')[1]);
const admin = new Client({ connectionString: url, ssl: false, connectionTimeoutMillis: 15000 });
admin.connect().then(() => {
  return admin.query(\"SELECT 1 FROM pg_database WHERE datname = 'socos'\");
}).then(r => {
  if (r.rows.length === 0) {
    console.log('[db-check] Creating socos database...');
    return admin.query('CREATE DATABASE socos');
  }
}).then(() => { console.log('[db-check] DB ready'); admin.end(); })
  .catch(e => { console.error('[db-check] Warning:', e.message); process.exit(0); });
" || echo "[db-check] Skipped"

# ─── Step 2: Run prisma db push (non-fatal) ────────────────────────────────
echo "[startup] Running prisma db push..."
node node_modules/.bin/prisma db push --accept-data-loss --skip-generate || echo "[startup] prisma db push skipped or failed (continuing)"

echo "[startup] Done. NestJS will start..."
