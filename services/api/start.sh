#!/bin/sh
set -e

echo "[startup] === SOCOS API starting ==="

# ─── Step 1: Try to ensure socos database exists ─────────────────────────────
# Coolify managed Postgres has sslmode=allow in DATABASE_URL which makes pg try SSL.
# Strip the query string so our explicit ssl: false is respected.
if echo "$DATABASE_URL" | grep -q '?'; then
  cleanUrl=$(echo "$DATABASE_URL" | sed 's/?.*//')
else
  cleanUrl="$DATABASE_URL"
fi
defaultUrl="${cleanUrl}/postgres"
echo "[db-check] DB: ${defaultUrl##*@}"

node -e "
const { Client } = require('pg');
const url = '$defaultUrl';
const admin = new Client({ connectionString: url, ssl: false, connectionTimeoutMillis: 10000 });
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

# ─── Step 2: Run prisma db push (non-fatal) ─────────────────────────────────
echo "[startup] Running prisma db push..."
node node_modules/.bin/prisma db push --accept-data-loss --skip-generate || echo "[startup] prisma db push done or skipped"

# ─── Step 3: Seed celebration packs (non-fatal) ───────────────────────────────
echo "[startup] Seeding celebration packs..."
node -e "
const { Client } = require('pg');
const rawUrl = process.env.DATABASE_URL;
const dbUrl = rawUrl.includes('?') ? rawUrl.replace(/\?.*/, '') : rawUrl;
const client = new Client({ connectionString: dbUrl, ssl: false });
client.connect().then(() => client.query(\`SELECT id FROM \"CelebrationPack\" LIMIT 1\`))
  .then(r => { if (r.rows.length > 0) console.log('[seed] Already seeded'); else console.log('[seed] Need to seed'); client.end(); })
  .catch(e => { console.error('[seed] Warning:', e.message); try { client.end(); } catch(e2) {} });
" || echo "[startup] seed skipped"

echo "[startup] Starting NestJS..."
exec node dist/main.js
