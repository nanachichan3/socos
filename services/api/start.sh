#!/bin/sh
set -e

echo "[startup] === SOCOS API starting ==="

# ─── Step 1: Create socos database if missing ──────────────────────────────────
# The db container's default DB is 'postgres'. We need 'socos'.
# Connect to 'postgres' DB and create 'socos' if it doesn't exist.
echo "[startup] Ensuring socos database exists..."
node -e "
const { Client } = require('pg');
const dbUrl = process.env.DATABASE_URL;
const socosUrl = dbUrl; // Already points to /socos since we set POSTGRES_DB=socos

// Connect to postgres default DB first
const defaultUrl = dbUrl.replace('/socos?', '/postgres?');
console.log('[db-check] Connecting to:', defaultUrl.split('@')[1]);

const admin = new Client({ connectionString: defaultUrl, ssl: false, connectionTimeoutMillis: 10000 });

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
  } finally {
    try { await admin.end(); } catch(e) {}
  }
}
main().then(() => process.exit(0)).catch(e => { console.error('[db-check] FATAL:', e.message); process.exit(1); });
"

# ─── Step 2: Run prisma db push to create tables ────────────────────────────────
echo "[startup] Running prisma db push..."
node node_modules/.bin/prisma db push --accept-data-loss --skip-generate

# ─── Step 3: Seed system celebration packs ──────────────────────────────────────
echo "[startup] Seeding celebration packs..."
node -e "
const { Client } = require('pg');
async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });
  try {
    await client.connect();
    
    // Check if already seeded
    const packs = await client.query(\`SELECT id FROM \"CelebrationPack\" LIMIT 1\`);
    if (packs.rows.length > 0) {
      console.log('[seed] Packs already exist, skipping');
      await client.end();
      return;
    }
    
    console.log('[seed] Seeding system packs...');
    const inserts = [
      // Buddhism
      \`INSERT INTO \"CelebrationPack\" (id, \"ownerId\", name, description, \"isDefault\") VALUES ('sys-buddhism', NULL, 'Buddhism Celebrations', 'Observances from Buddhist traditions', true)\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-vesak','sys-buddhism',NULL,'Vesak','Birth, enlightenment & passing of Gautama Buddha','05-15','🪷','religious','lunar') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-magha','sys-buddhism',NULL,'Magha Puja','Gathering of 1,250 enlightened monks','02-15','🕉️','religious','lunar') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-asalha','sys-buddhism',NULL,'Asalha Puja',\"Buddha's first sermon\",'07-15','☸️','religious','lunar') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-buddhist-ny','sys-buddhism',NULL,'Buddhist New Year','Theravada tradition, mid-April','04-14','🎊','religious','lunar') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-dhamma','sys-buddhism',NULL,'Dhamma Day','Reflection on impermanence','08-15','🕯️','religious','lunar') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-kathina','sys-buddhism',NULL,'Kathina Ceremony','Robe offering to monks','10-01','👔','religious','lunar') ON CONFLICT (id) DO NOTHING\`],
      // Global
      \`INSERT INTO \"CelebrationPack\" (id, \"ownerId\", name, description, \"isDefault\") VALUES ('sys-global', NULL, 'Global Holidays', 'Internationally recognized holidays', true)\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-nyd','sys-global',NULL,\"New Year's Day\",'Beginning of the Gregorian year','01-01','🎆','secular','gregorian') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-val','sys-global',NULL,\"Valentine's Day\",'Day of love and affection','02-14','💝','secular','gregorian') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-april-fools','sys-global',NULL,\"April Fools' Day\",'Day of pranks','04-01','🃏','secular','gregorian') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-earth-day','sys-global',NULL,'Earth Day','Environmental awareness','04-22','🌍','secular','gregorian') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-friendship','sys-global',NULL,'Int''l Day of Friendship','Celebrating friendship','07-30','🤝','secular','gregorian') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-halloween','sys-global',NULL,'Halloween','Costumes and spooky celebrations','10-31','🎃','cultural','gregorian') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-thanks','sys-global',NULL,'Thanksgiving','Day of gratitude (US)','11-27','🦃','cultural','gregorian') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-xmas','sys-global',NULL,'Christmas',\"Christ's birth celebration\",'12-25','🎄','religious','gregorian') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-nye','sys-global',NULL,\"New Year's Eve\",'Last day of the year','12-31','🥂','secular','gregorian') ON CONFLICT (id) DO NOTHING\`],
      // Cultural
      \`INSERT INTO \"CelebrationPack\" (id, \"ownerId\", name, description, \"isDefault\") VALUES ('sys-cultural', NULL, 'Cultural Celebrations', 'Festivals from various traditions', true)\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-cny','sys-cultural',NULL,'Lunar New Year','Chinese New Year','01-29','🐉','cultural','chinese') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-diwali','sys-cultural',NULL,'Diwali','Hindu festival of lights','10-20','🪔','cultural','lunar') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-hanukkah','sys-cultural',NULL,'Hanukkah','Jewish festival of lights','12-18','🕎','cultural','lunar') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-eid','sys-cultural',NULL,'Eid al-Fitr','End of Ramadan','03-30','🌙','cultural','lunar') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-easter','sys-cultural',NULL,'Easter','Christian resurrection celebration','04-20','🐰','cultural','lunar') ON CONFLICT (id) DO NOTHING\`],
      \`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, icon, category, \"calendarType\") VALUES ('sys-nowruz','sys-cultural',NULL,'Nowruz','Persian New Year','03-20','🌸','cultural','gregorian') ON CONFLICT (id) DO NOTHING\`],
    ];
    
    for (const sql of inserts) {
      await client.query(sql);
    }
    
    console.log('[seed] Done!');
    await client.end();
  } catch(e) {
    console.error('[seed] Error:', e.message);
    try { await client.end(); } catch(e2) {}
  }
}
seed();
"

# ─── Step 4: Seed achievements and test user ───────────────────────────────────
echo "[startup] Running seed.sql..."
node -e "
const { Client } = require('pg');
const fs = require('fs');
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });
client.connect()
  .then(() => client.query(fs.readFileSync(__dirname + '/prisma/seed.sql', 'utf8')))
  .then(() => { console.log('[seed.sql] Done!'); client.end(); })
  .catch(e => { console.error('[seed.sql] Error:', e.message); client.end(); });
"

echo "[startup] Starting NestJS..."
exec node dist/main.js
