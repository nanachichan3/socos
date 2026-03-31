#!/bin/sh
set -e

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
