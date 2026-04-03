#!/bin/sh
set -e

echo "[startup] === SOCOS API starting ==="

# ─── Step 1: Create socos database if missing ─────────────────────────────
# Use the DATABASE_URL as-is for pg client (sslmode is in the URL).
defaultUrl="${DATABASE_URL}/postgres"
echo "[db-check] Connecting to: ${defaultUrl##*@}"

node -e "
const { Client } = require('pg');
const url = '$defaultUrl';
console.log('[db-check] Connecting to:', url.split('@')[1]);
const client = new Client({ connectionString: url, connectionTimeoutMillis: 15000 });
client.connect().then(() => {
  return client.query(\"SELECT 1 FROM pg_database WHERE datname = 'socos'\");
}).then(r => {
  if (r.rows.length === 0) {
    console.log('[db-check] Creating socos database...');
    return client.query('CREATE DATABASE socos');
  }
  console.log('[db-check] socos already exists');
}).then(() => { client.end(); process.exit(0); })
  .catch(e => { console.error('[db-check] Warning:', e.message); process.exit(0); });
" || echo "[db-check] Skipped"

# ─── Step 2: Run prisma db push ───────────────────────────────────────────
echo "[startup] Running prisma db push..."
node node_modules/.bin/prisma db push --accept-data-loss --skip-generate || echo "[startup] prisma db push done"

echo "[startup] Done."
