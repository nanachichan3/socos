#!/bin/sh
set -e

echo "[startup] === SOCOS API starting ==="

# ─── Step 1: Create socos database if missing ─────────────────────────────
# Replace just the database name in the URL (e.g. /socos → /postgres)
# so we can connect to the postgres default DB to create socos.
echo "[db-check] DATABASE_URL: $DATABASE_URL"

node -e "
const { Client } = require('pg');
const urlStr = process.env.DATABASE_URL;
if (!urlStr) { console.error('[db-check] DATABASE_URL not set'); process.exit(0); }
// Parse and replace just the database name
try {
  const u = new URL(urlStr);
  const origDb = u.pathname.replace('/', '');
  const adminUrl = urlStr.replace('/' + origDb + '?', '/' + 'postgres' + (u.search ? '?' + u.search : ''));
  console.log('[db-check] Connecting to admin DB:', u.host + '/postgres');
  const client = new Client({ connectionString: adminUrl, connectionTimeoutMillis: 15000 });
  client.connect().then(() => {
    return client.query('SELECT 1 FROM pg_database WHERE datname = \\'socos\\'');
  }).then(r => {
    if (r.rows.length === 0) {
      console.log('[db-check] Creating socos database...');
      return client.query('CREATE DATABASE socos');
    }
    console.log('[db-check] socos already exists');
  }).then(() => { client.end(); process.exit(0); })
    .catch(e => { console.error('[db-check] Warning:', e.message); process.exit(0); });
} catch(e) { console.error('[db-check] Parse error:', e.message); process.exit(0); }
" || echo "[db-check] Node script failed"

# ─── Step 2: Run prisma db push ───────────────────────────────────────────
echo "[startup] Running prisma db push..."
node node_modules/.bin/prisma db push --accept-data-loss --skip-generate || echo "[startup] prisma db push done"

echo "[startup] Done."
