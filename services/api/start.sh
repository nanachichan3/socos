#!/bin/sh
set -e

echo "[startup] === SOCOS API starting ==="
echo "[startup] DATABASE_URL: ${DATABASE_URL:-not set}"

# Wait for postgres to be truly ready
echo "[startup] Waiting for postgres to be ready..."
for i in $(seq 1 30); do
  if pg_isready -h db -U postgres > /dev/null 2>&1; then
    echo "[startup] PostgreSQL is ready!"
    break
  fi
  echo "[startup] Waiting for postgres... attempt $i/30"
  sleep 2
done

# Create socos database if missing
echo "[startup] Ensuring socos database exists..."
node -e "
const { Client } = require('pg');
const dbUrl = process.env.DATABASE_URL;
const defaultUrl = dbUrl.replace('/socos', '/postgres');
console.log('[db-check] Connecting to default DB at:', defaultUrl.split('@')[1]);

const admin = new Client({ connectionString: defaultUrl, ssl: false, connectionTimeoutMillis: 30000 });

async function main() {
  try {
    await admin.connect();
    const r = await admin.query(\"SELECT 1 FROM pg_database WHERE datname = 'socos'\");
    if (r.rows.length === 0) {
      console.log('[db-check] Creating socos database...');
      await admin.query('CREATE DATABASE socos');
      console.log('[db-check] socos created');
    } else {
      console.log('[db-check] socos already exists');
    }
    await admin.end();
  } catch(e) {
    console.error('[db-check] Error:', e.message);
    process.exit(1);
  }
}
main();
"

echo "[startup] Running Prisma migrations..."
npx prisma migrate deploy || echo "[startup] Migration done or no migrations"

echo "[startup] Starting NestJS..."
exec node dist/main.js
