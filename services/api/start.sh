#!/bin/sh

# ─── Prisma Migration Bootstrap ─────────────────────────────────────────────
# The existing tables were created via `prisma db push` (no migration history).
# We must create the _prisma_migrations table and mark the initial migration
# as already applied before running deploy, otherwise deploy will fail trying
# to re-create existing tables.
echo "Bootstrapping Prisma migration history..."

# Create _prisma_migrations table if it doesn't exist (from db push setups)
node -e "
const { Client } = require('pg');
const path = require('path');
async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.log('No DATABASE_URL'); return; }
  const client = new Client({ connectionString: dbUrl, ssl: false });
  await client.connect();
  // Create _prisma_migrations if not exists
  await client.query(\`
    CREATE TABLE IF NOT EXISTS \"_prisma_migrations\" (
      \"id\"                    VARCHAR(36) PRIMARY KEY,
      \"checksum\"              VARCHAR(64),
      \"finished_at\"           TIMESTAMP(3),
      \"migration_name\"        VARCHAR(255),
      \"logs\"                  TEXT,
      \"rolled_back_at\"        TIMESTAMP(3),
      \"started_at\"            TIMESTAMP(3) NOT NULL DEFAULT NOW(),
      \"applied_steps_count\"   INTEGER NOT NULL DEFAULT 0
    )
  \`);
  // Mark the baseline migration as applied
  await client.query(\`
    INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, applied_steps_count)
    VALUES ('bootstrap-initial', '00000000', NOW(), '20260327000000_initial_schema', 1)
    ON CONFLICT (id) DO NOTHING
  \`);
  await client.end();
  console.log('Migration history bootstrapped');
}
main().catch(e => { console.error('Bootstrap error:', e.message); process.exit(0); });
"

echo "Applying new migrations..."
node node_modules/.bin/prisma migrate deploy 2>&1 || {
  echo "Migration deploy exited with $? — checking status..."
  node node_modules/.bin/prisma migrate status 2>/dev/null || true
}
echo "Migration step complete."

# Run seed migration
echo "Running database seed..."
node -e "
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.log('No DATABASE_URL, skipping seed'); return; }
  
  const client = new Client({ connectionString: dbUrl, ssl: false });
  await client.connect();
  
  const sql = fs.readFileSync(path.join(__dirname, 'prisma', 'seed.sql'), 'utf8');
  await client.query(sql);
  
  console.log('Seed complete');
  await client.end();
}

seed().catch(e => { console.error('Seed failed:', e.message); process.exit(0); });
"

# Start NestJS
echo "Starting NestJS..."
exec node dist/main.js
