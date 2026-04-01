#!/bin/sh
set -e

# ─── Prisma DB Push ─────────────────────────────────────────────────────────────
# Use db push instead of migrate deploy since the database was originally set up
# via db push (no migration history). db push syncs schema without needing files.
echo "[db-push] syncing schema..."
node node_modules/.bin/prisma db push --accept-data-loss --skip-generate 2>&1 || {
  echo "[db-push] failed with $? — continuing anyway"
}

# ─── Seed ──────────────────────────────────────────────────────────────────────
echo "[seed] running..."
node -e "
const { Client } = require('pg');
const fs = require('fs');
async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });
  await client.connect();
  const sql = fs.readFileSync(__dirname + '/prisma/seed.sql', 'utf8');
  await client.query(sql);
  await client.end();
  console.log('[seed] complete');
}
seed().catch(e => { console.error('[seed] failed:', e.message); process.exit(0); });
"

# ─── Start NestJS ─────────────────────────────────────────────────────────────
echo "[api] starting NestJS..."
exec node dist/main.js
