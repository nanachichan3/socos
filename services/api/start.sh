#!/bin/sh

# ─── Wait for database to be ready ─────────────────────────────────────────────
echo "[startup] waiting for database..."
MAX_RETRIES=30
RETRY=0
until node -e "
const { Client } = require('pg');
new Client({ connectionString: process.env.DATABASE_URL, ssl: false })
  .connect().then(c => { console.log('DB connected'); c.end(); process.exit(0); })
  .catch(() => { console.log('DB not ready, retry...'); process.exit(1); });
" 2>/dev/null; do
  RETRY=$((RETRY+1))
  echo "[startup] DB not ready (attempt $RETRY/$MAX_RETRIES)"
  if [ $RETRY -ge $MAX_RETRIES ]; then
    echo "[startup] DB never became ready — continuing anyway"
    break
  fi
  sleep 2
done

# ─── Check existing tables ──────────────────────────────────────────────────────
echo "[startup] checking existing tables..."
node -e "
const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });
  try {
    await client.connect();
    const tables = await client.query(\`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'\`);
    console.log('[startup] existing tables:', tables.rows.map(r => r.table_name).join(', '));
    await client.end();
  } catch(e) {
    console.error('[startup] error:', e.message);
  }
}
check();
"

# ─── Prisma db push ─────────────────────────────────────────────────────────────
echo "[startup] running prisma db push..."
DB_PUSH_OUTPUT=$(node node_modules/.bin/prisma db push --accept-data-loss 2>&1) || true
echo "$DB_PUSH_OUTPUT"
echo "[startup] db push done"

# ─── Verify tables ─────────────────────────────────────────────────────────────
echo "[startup] verifying tables..."
node -e "
const { Client } = require('pg');
async function verify() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });
  try {
    await client.connect();
    const tables = await client.query(\`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'\`);
    console.log('[startup] tables after db push:', tables.rows.map(r => r.table_name).join(', '));
    await client.end();
  } catch(e) {
    console.error('[startup] error:', e.message);
  }
}
verify();
"

# ─── Seed ──────────────────────────────────────────────────────────────────────
echo "[startup] running seed..."
node -e "
const { Client } = require('pg');
const fs = require('fs');
async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });
  try {
    await client.connect();
    const sql = fs.readFileSync(__dirname + '/prisma/seed.sql', 'utf8');
    await client.query(sql);
    console.log('[startup] seed complete');
    await client.end();
  } catch(e) {
    console.error('[startup] seed error:', e.message);
  }
}
seed();
"

# ─── Start NestJS ─────────────────────────────────────────────────────────────
echo "[startup] starting NestJS..."
exec node dist/main.js
