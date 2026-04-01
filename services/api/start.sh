#!/bin/sh
set -e

echo "[startup] === Starting SOCOS API ==="

# ─── Step 1: Ensure the 'socos' database exists ─────────────────────────────────
# The db container starts with 'postgres' as the default database.
# We need to create 'socos' DB if it doesn't exist yet.
echo "[startup] Ensuring socos database exists..."
node -e "
const { Client } = require('pg');

// First connect to default 'postgres' database to create 'socos' DB
const adminClient = new Client({
  connectionString: process.env.DATABASE_URL.replace('/socos?', '/postgres?'),
  ssl: false,
  connectionTimeoutMillis: 10000
});

async function main() {
  try {
    await adminClient.connect();
    console.log('[startup] Connected to postgres database');
    
    // Check if socos DB exists
    const result = await adminClient.query(
      \"SELECT 1 FROM pg_database WHERE datname = 'socos'\"
    );
    if (result.rows.length === 0) {
      console.log('[startup] Creating socos database...');
      await adminClient.query('CREATE DATABASE socos');
      console.log('[startup] socos database created');
    } else {
      console.log('[startup] socos database already exists');
    }
  } catch(e) {
    console.error('[startup] Error creating database:', e.message);
    throw e; // Re-throw to fail startup
  } finally {
    try { await adminClient.end(); } catch(e) {}
  }
}

main().then(() => process.exit(0)).catch(() => process.exit(1));
"

# ─── Step 2: Create all tables via raw SQL ──────────────────────────────────────
echo "[startup] Setting up schema..."
node -e "
const { Client } = require('pg');
async function setupDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('[startup] DATABASE_URL host:', dbUrl.split('@')[1]);
  
  const client = new Client({ connectionString: dbUrl, ssl: false, connectionTimeoutMillis: 10000 });
  
  try {
    await client.connect();
    console.log('[startup] Connected to socos database');
    
    const existing = await client.query(\`SELECT table_name FROM information_schema.tables WHERE table_schema='public'\`);
    const tables = existing.rows.map(r => r.table_name);
    console.log('[startup] Existing tables:', tables.join(', ') || '(none)');
    
    // Create User table
    if (!tables.includes('User')) {
      console.log('[startup] Creating User...');
      await client.query(\`CREATE TABLE \"User\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"email\" TEXT UNIQUE NOT NULL, \"name\" TEXT, \"avatar\" TEXT, \"passwordHash\" TEXT, \"xp\" INTEGER NOT NULL DEFAULT 0, \"level\" INTEGER NOT NULL DEFAULT 1, \"streakDays\" INTEGER NOT NULL DEFAULT 0, \"lastActiveAt\" TIMESTAMP(3), \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] User created');
    } else { console.log('[startup] User exists'); }
    
    // Session
    if (!tables.includes('Session')) {
      await client.query(\`CREATE TABLE \"Session\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"token\" TEXT NOT NULL, \"expiresAt\" TIMESTAMP(3) NOT NULL, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Session created');
    } else { console.log('[startup] Session exists'); }
    
    // Vault
    if (!tables.includes('Vault')) {
      await client.query(\`CREATE TABLE \"Vault\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"name\" TEXT NOT NULL, \"description\" TEXT, \"isShared\" BOOLEAN NOT NULL DEFAULT false, \"ownerId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Vault created');
    } else { console.log('[startup] Vault exists'); }
    
    // VaultMember
    if (!tables.includes('VaultMember')) {
      await client.query(\`CREATE TABLE \"VaultMember\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"vaultId\" TEXT NOT NULL REFERENCES \"Vault\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"role\" TEXT NOT NULL DEFAULT 'editor', \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(\"vaultId\", \"userId\"))\`);
      console.log('[startup] VaultMember created');
    } else { console.log('[startup] VaultMember exists'); }
    
    // Contact
    if (!tables.includes('Contact')) {
      await client.query(\`CREATE TABLE \"Contact\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"vaultId\" TEXT NOT NULL REFERENCES \"Vault\"(id) ON DELETE CASCADE, \"ownerId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"name\" TEXT NOT NULL, \"birthday\" TIMESTAMP(3), \"timezone\" TEXT DEFAULT 'UTC', \"tags\" TEXT[], \"avatar\" TEXT, \"notes\" TEXT, \"xp\" INTEGER NOT NULL DEFAULT 0, \"level\" INTEGER NOT NULL DEFAULT 1, \"lastInteractionAt\" TIMESTAMP(3), \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Contact created');
    } else { console.log('[startup] Contact exists'); }
    
    // ContactField
    if (!tables.includes('ContactField')) {
      await client.query(\`CREATE TABLE \"ContactField\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"type\" TEXT NOT NULL, \"value\" TEXT NOT NULL, \"label\" TEXT, \"isPublic\" BOOLEAN NOT NULL DEFAULT false, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] ContactField created');
    } else { console.log('[startup] ContactField exists'); }
    
    // Interaction
    if (!tables.includes('Interaction')) {
      await client.query(\`CREATE TABLE \"Interaction\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"type\" TEXT NOT NULL, \"content\" TEXT, \"metadata\" JSONB, \"xpEarned\" INTEGER NOT NULL DEFAULT 0, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Interaction created');
    } else { console.log('[startup] Interaction exists'); }
    
    // Reminder
    if (!tables.includes('Reminder')) {
      await client.query(\`CREATE TABLE \"Reminder\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"title\" TEXT NOT NULL, \"description\" TEXT, \"dueDate\" TIMESTAMP(3) NOT NULL, \"recurring\" TEXT, \"isCompleted\" BOOLEAN NOT NULL DEFAULT false, \"isAI\" BOOLEAN NOT NULL DEFAULT false, \"xpReward\" INTEGER NOT NULL DEFAULT 50, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Reminder created');
    } else { console.log('[startup] Reminder exists'); }
    
    // Task
    if (!tables.includes('Task')) {
      await client.query(\`CREATE TABLE \"Task\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"title\" TEXT NOT NULL, \"description\" TEXT, \"dueDate\" TIMESTAMP(3), \"priority\" TEXT NOT NULL DEFAULT 'medium', \"isCompleted\" BOOLEAN NOT NULL DEFAULT false, \"xpReward\" INTEGER NOT NULL DEFAULT 50, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Task created');
    } else { console.log('[startup] Task exists'); }
    
    // Gift
    if (!tables.includes('Gift')) {
      await client.query(\`CREATE TABLE \"Gift\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"name\" TEXT NOT NULL, \"description\" TEXT, \"giftDate\" TIMESTAMP(3), \"costCents\" INTEGER, \"currency\" TEXT, \"occasion\" TEXT, \"isPurchased\" BOOLEAN NOT NULL DEFAULT false, \"notes\" TEXT, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Gift created');
    } else { console.log('[startup] Gift exists'); }
    
    // Activity
    if (!tables.includes('Activity')) {
      await client.query(\`CREATE TABLE \"Activity\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"name\" TEXT NOT NULL, \"description\" TEXT, \"activityDate\" TIMESTAMP(3), \"duration\" INTEGER, \"notes\" TEXT, \"xpEarned\" INTEGER NOT NULL DEFAULT 0, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Activity created');
    } else { console.log('[startup] Activity exists'); }
    
    // Achievement
    if (!tables.includes('Achievement')) {
      await client.query(\`CREATE TABLE \"Achievement\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"slug\" TEXT UNIQUE NOT NULL, \"name\" TEXT NOT NULL, \"description\" TEXT NOT NULL, \"icon\" TEXT, \"xpReward\" INTEGER NOT NULL DEFAULT 100, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Achievement created');
    } else { console.log('[startup] Achievement exists'); }
    
    // UserAchievement
    if (!tables.includes('UserAchievement')) {
      await client.query(\`CREATE TABLE \"UserAchievement\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"achievementId\" TEXT NOT NULL REFERENCES \"Achievement\"(id) ON DELETE CASCADE, \"earnedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(\"userId\", \"achievementId\"))\`);
      console.log('[startup] UserAchievement created');
    } else { console.log('[startup] UserAchievement exists'); }
    
    // Celebration tables
    if (!tables.includes('CelebrationPack')) {
      await client.query(\`CREATE TABLE \"CelebrationPack\" (\"id\" TEXT PRIMARY KEY, \"ownerId\" TEXT, \"name\" TEXT NOT NULL, \"description\" TEXT, \"isDefault\" BOOLEAN NOT NULL DEFAULT false, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] CelebrationPack created');
    } else { console.log('[startup] CelebrationPack exists'); }
    
    if (!tables.includes('Celebration')) {
      await client.query(\`CREATE TABLE \"Celebration\" (\"id\" TEXT PRIMARY KEY, \"packId\" TEXT NOT NULL REFERENCES \"CelebrationPack\"(id) ON DELETE CASCADE, \"ownerId\" TEXT, \"name\" TEXT NOT NULL, \"description\" TEXT, \"date\" TEXT NOT NULL, \"fullDate\" TIMESTAMP(3), \"icon\" TEXT, \"category\" TEXT NOT NULL, \"calendarType\" TEXT NOT NULL DEFAULT 'gregorian', \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Celebration created');
    } else { console.log('[startup] Celebration exists'); }
    
    if (!tables.includes('ContactCelebration')) {
      await client.query(\`CREATE TABLE \"ContactCelebration\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"celebrationId\" TEXT NOT NULL REFERENCES \"Celebration\"(id) ON DELETE CASCADE, \"ownerId\" TEXT NOT NULL, \"customDate\" TIMESTAMP(3), \"status\" TEXT NOT NULL DEFAULT 'active', \"shouldRemind\" BOOLEAN NOT NULL DEFAULT true, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(\"contactId\", \"celebrationId\"))\`);
      console.log('[startup] ContactCelebration created');
    } else { console.log('[startup] ContactCelebration exists'); }
    
    // Seed system packs
    const packs = await client.query(\`SELECT id FROM \"CelebrationPack\" WHERE \"ownerId\" IS NULL\`);
    if (packs.rows.length === 0) {
      console.log('[startup] Seeding system packs...');
      await client.query(\`INSERT INTO \"CelebrationPack\" (id, \"ownerId\", name, description, \"isDefault\") VALUES ('sys-buddhism', NULL, 'Buddhism Celebrations', 'Observances from Buddhist traditions', true)\`);
      const b = [['sys-buddhism-vesak','sys-buddhism',NULL,'Vesak','Birth, enlightenment & passing of Gautama Buddha','05-15',NULL,'🪷','religious','lunar'],['sys-buddhism-magha','sys-buddhism',NULL,'Magha Puja','Gathering of 1,250 enlightened monks','02-15',NULL,'🕉️','religious','lunar'],['sys-buddhism-asalha','sys-buddhism',NULL,'Asalha Puja','Buddha''s first sermon','07-15',NULL,'☸️','religious','lunar'],['sys-buddhism-ny','sys-buddhism',NULL,'Buddhist New Year','Theravada tradition, mid-April','04-14',NULL,'🎊','religious','lunar'],['sys-buddhism-dhamma','sys-buddhism',NULL,'Dhamma Day','Reflection on impermanence','08-15',NULL,'🕯️','religious','lunar'],['sys-buddhism-kathina','sys-buddhism',NULL,'Kathina Ceremony','Robe offering to monks','10-01',NULL,'👔','religious','lunar']];
      for (const c of b) { await client.query(\`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, \"fullDate\", icon, category, \"calendarType\") VALUES (\$1,\$2,\$3,\$4,\$5,\$6,\$7,\$8,\$9,\$10) ON CONFLICT (id) DO NOTHING\`, c); }
      
      await client.query(\`INSERT INTO \"CelebrationPack\" (id, \"ownerId\", name, description, \"isDefault\") VALUES ('sys-global', NULL, 'Global Holidays', 'Internationally recognized holidays', true)\`);
      const g = [['sys-global-nyd','sys-global',NULL,'New Year''s Day','Beginning of the Gregorian year','01-01',NULL,'🎆','secular','gregorian'],['sys-global-val','sys-global',NULL,'Valentine''s Day','Day of love and affection','02-14',NULL,'💝','secular','gregorian'],['sys-global-af','sys-global',NULL,'April Fools'' Day','Day of pranks','04-01',NULL,'🃏','secular','gregorian'],['sys-global-earth','sys-global',NULL,'Earth Day','Environmental awareness','04-22',NULL,'🌍','secular','gregorian'],['sys-global-friend','sys-global',NULL,'Int''l Day of Friendship','Celebrating friendship','07-30',NULL,'🤝','secular','gregorian'],['sys-global-halloween','sys-global',NULL,'Halloween','Costumes and spooky celebrations','10-31',NULL,'🎃','cultural','gregorian'],['sys-global-thanks','sys-global',NULL,'Thanksgiving','Day of gratitude (US)','11-27',NULL,'🦃','cultural','gregorian'],['sys-global-xmas','sys-global',NULL,'Christmas','Christ''s birth celebration','12-25',NULL,'🎄','religious','gregorian'],['sys-global-nye','sys-global',NULL,'New Year''s Eve','Last day of the year','12-31',NULL,'🥂','secular','gregorian']];
      for (const c of g) { await client.query(\`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, \"fullDate\", icon, category, \"calendarType\") VALUES (\$1,\$2,\$3,\$4,\$5,\$6,\$7,\$8,\$9,\$10) ON CONFLICT (id) DO NOTHING\`, c); }
      
      await client.query(\`INSERT INTO \"CelebrationPack\" (id, \"ownerId\", name, description, \"isDefault\") VALUES ('sys-cultural', NULL, 'Cultural Celebrations', 'Festivals from various traditions', true)\`);
      const cu = [['sys-cultural-cny','sys-cultural',NULL,'Lunar New Year','Chinese New Year','01-29',NULL,'🐉','cultural','chinese'],['sys-cultural-diwali','sys-cultural',NULL,'Diwali','Hindu festival of lights','10-20',NULL,'🪔','cultural','lunar'],['sys-cultural-hanukkah','sys-cultural',NULL,'Hanukkah','Jewish festival of lights','12-18',NULL,'🕎','cultural','lunar'],['sys-cultural-eid','sys-cultural',NULL,'Eid al-Fitr','End of Ramadan','03-30',NULL,'🌙','cultural','lunar'],['sys-cultural-easter','sys-cultural',NULL,'Easter','Christian resurrection celebration','04-20',NULL,'🐰','cultural','lunar'],['sys-cultural-nowruz','sys-cultural',NULL,'Nowruz','Persian New Year','03-20',NULL,'🌸','cultural','gregorian']];
      for (const c of cu) { await client.query(\`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, \"fullDate\", icon, category, \"calendarType\") VALUES (\$1,\$2,\$3,\$4,\$5,\$6,\$7,\$8,\$9,\$10) ON CONFLICT (id) DO NOTHING\`, c); }
      
      console.log('[startup] System packs seeded');
    } else {
      console.log('[startup] System packs already exist');
    }
    
    const final = await client.query(\`SELECT table_name FROM information_schema.tables WHERE table_schema='public'\`);
    console.log('[startup] Final tables:', final.rows.map(r => r.table_name).join(', '));
    
  } catch(e) {
    console.error('[startup] FATAL ERROR:', e.message);
    process.exit(1);
  } finally {
    try { await client.end(); } catch(e) {}
  }
}
setupDatabase();
"

# ─── Step 3: Run seed.sql ─────────────────────────────────────────────────────
echo "[startup] Running seed.sql..."
node -e "
const { Client } = require('pg');
const fs = require('fs');
async function seed() {
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: false });
  try {
    await client.connect();
    const sql = fs.readFileSync(__dirname + '/prisma/seed.sql', 'utf8');
    await client.query(sql);
    console.log('[startup] Seed complete');
  } catch(e) {
    console.error('[startup] Seed error:', e.message);
  } finally {
    try { await client.end(); } catch(e) {}
  }
}
seed();
"

echo "[startup] Starting NestJS..."
exec node dist/main.js
