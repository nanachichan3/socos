#!/bin/sh

echo "[startup] DB setup starting..."

# ─── Create all tables with raw SQL ─────────────────────────────────────────────
# This replaces prisma db push to avoid any Prisma-specific issues.
# Safe to re-run (uses CREATE TABLE IF NOT EXISTS).
node -e "
const { Client } = require('pg');
async function setupDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.error('[startup] DATABASE_URL not set!'); return; }
  
  const client = new Client({ connectionString: dbUrl, ssl: false, connectionTimeoutMillis: 10000 });
  
  try {
    await client.connect();
    console.log('[startup] Connected to database');
    
    // Check existing tables
    const existing = await client.query(\`SELECT table_name FROM information_schema.tables WHERE table_schema='public'\`);
    const tableNames = existing.rows.map(r => r.table_name);
    console.log('[startup] Existing tables:', tableNames.join(', '));
    
    // Create User table (base for everything)
    if (!tableNames.includes('User')) {
      console.log('[startup] Creating User table...');
      await client.query(\`
        CREATE TABLE \"User\" (
          \"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          \"email\" TEXT UNIQUE NOT NULL,
          \"name\" TEXT,
          \"avatar\" TEXT,
          \"passwordHash\" TEXT,
          \"xp\" INTEGER NOT NULL DEFAULT 0,
          \"level\" INTEGER NOT NULL DEFAULT 1,
          \"streakDays\" INTEGER NOT NULL DEFAULT 0,
          \"lastActiveAt\" TIMESTAMP(3),
          \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      \`);
      console.log('[startup] User table created');
    } else {
      console.log('[startup] User table already exists');
    }
    
    // Create other base tables if missing
    const neededTables = [
      ['Session', \`CREATE TABLE \"Session\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"token\" TEXT NOT NULL, \"expiresAt\" TIMESTAMP(3) NOT NULL, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['Vault', \`CREATE TABLE \"Vault\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"name\" TEXT NOT NULL, \"description\" TEXT, \"isShared\" BOOLEAN NOT NULL DEFAULT false, \"ownerId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['VaultMember', \`CREATE TABLE \"VaultMember\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"vaultId\" TEXT NOT NULL REFERENCES \"Vault\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"role\" TEXT NOT NULL DEFAULT 'editor', \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(\"vaultId\", \"userId\"))\`],
      ['Contact', \`CREATE TABLE \"Contact\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"vaultId\" TEXT NOT NULL REFERENCES \"Vault\"(id) ON DELETE CASCADE, \"ownerId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"name\" TEXT NOT NULL, \"birthday\" TIMESTAMP(3), \"timezone\" TEXT DEFAULT 'UTC', \"tags\" TEXT[], \"avatar\" TEXT, \"notes\" TEXT, \"xp\" INTEGER NOT NULL DEFAULT 0, \"level\" INTEGER NOT NULL DEFAULT 1, \"lastInteractionAt\" TIMESTAMP(3), \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['ContactField', \`CREATE TABLE \"ContactField\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"type\" TEXT NOT NULL, \"value\" TEXT NOT NULL, \"label\" TEXT, \"isPublic\" BOOLEAN NOT NULL DEFAULT false, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['Interaction', \`CREATE TABLE \"Interaction\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"type\" TEXT NOT NULL, \"content\" TEXT, \"metadata\" JSONB, \"xpEarned\" INTEGER NOT NULL DEFAULT 0, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['Reminder', \`CREATE TABLE \"Reminder\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"title\" TEXT NOT NULL, \"description\" TEXT, \"dueDate\" TIMESTAMP(3) NOT NULL, \"recurring\" TEXT, \"isCompleted\" BOOLEAN NOT NULL DEFAULT false, \"isAI\" BOOLEAN NOT NULL DEFAULT false, \"xpReward\" INTEGER NOT NULL DEFAULT 50, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['Task', \`CREATE TABLE \"Task\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"title\" TEXT NOT NULL, \"description\" TEXT, \"dueDate\" TIMESTAMP(3), \"priority\" TEXT NOT NULL DEFAULT 'medium', \"isCompleted\" BOOLEAN NOT NULL DEFAULT false, \"xpReward\" INTEGER NOT NULL DEFAULT 50, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['Gift', \`CREATE TABLE \"Gift\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"name\" TEXT NOT NULL, \"description\" TEXT, \"giftDate\" TIMESTAMP(3), \"costCents\" INTEGER, \"currency\" TEXT, \"occasion\" TEXT, \"isPurchased\" BOOLEAN NOT NULL DEFAULT false, \"notes\" TEXT, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['Activity', \`CREATE TABLE \"Activity\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"name\" TEXT NOT NULL, \"description\" TEXT, \"activityDate\" TIMESTAMP(3), \"duration\" INTEGER, \"notes\" TEXT, \"xpEarned\" INTEGER NOT NULL DEFAULT 0, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['Achievement', \`CREATE TABLE \"Achievement\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"slug\" TEXT UNIQUE NOT NULL, \"name\" TEXT NOT NULL, \"description\" TEXT NOT NULL, \"icon\" TEXT, \"xpReward\" INTEGER NOT NULL DEFAULT 100, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`],
      ['UserAchievement', \`CREATE TABLE \"UserAchievement\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"userId\" TEXT NOT NULL REFERENCES \"User\"(id) ON DELETE CASCADE, \"achievementId\" TEXT NOT NULL REFERENCES \"Achievement\"(id) ON DELETE CASCADE, \"earnedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(\"userId\", \"achievementId\"))\`],
    ];
    
    for (const [name, sql] of neededTables) {
      if (!tableNames.includes(name)) {
        console.log('[startup] Creating ' + name + ' table...');
        await client.query(sql);
        console.log('[startup] ' + name + ' created');
      } else {
        console.log('[startup] ' + name + ' already exists');
      }
    }
    
    // Celebration tables
    if (!tableNames.includes('CelebrationPack')) {
      console.log('[startup] Creating CelebrationPack...');
      await client.query(\`CREATE TABLE \"CelebrationPack\" (\"id\" TEXT PRIMARY KEY, \"ownerId\" TEXT, \"name\" TEXT NOT NULL, \"description\" TEXT, \"isDefault\" BOOLEAN NOT NULL DEFAULT false, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] CelebrationPack created');
    } else {
      console.log('[startup] CelebrationPack already exists');
    }
    
    if (!tableNames.includes('Celebration')) {
      console.log('[startup] Creating Celebration...');
      await client.query(\`CREATE TABLE \"Celebration\" (\"id\" TEXT PRIMARY KEY, \"packId\" TEXT NOT NULL REFERENCES \"CelebrationPack\"(id) ON DELETE CASCADE, \"ownerId\" TEXT, \"name\" TEXT NOT NULL, \"description\" TEXT, \"date\" TEXT NOT NULL, \"fullDate\" TIMESTAMP(3), \"icon\" TEXT, \"category\" TEXT NOT NULL, \"calendarType\" TEXT NOT NULL DEFAULT 'gregorian', \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)\`);
      console.log('[startup] Celebration created');
    } else {
      console.log('[startup] Celebration already exists');
    }
    
    if (!tableNames.includes('ContactCelebration')) {
      console.log('[startup] Creating ContactCelebration...');
      await client.query(\`CREATE TABLE \"ContactCelebration\" (\"id\" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, \"contactId\" TEXT NOT NULL REFERENCES \"Contact\"(id) ON DELETE CASCADE, \"celebrationId\" TEXT NOT NULL REFERENCES \"Celebration\"(id) ON DELETE CASCADE, \"ownerId\" TEXT NOT NULL, \"customDate\" TIMESTAMP(3), \"status\" TEXT NOT NULL DEFAULT 'active', \"shouldRemind\" BOOLEAN NOT NULL DEFAULT true, \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(\"contactId\", \"celebrationId\"))\`);
      console.log('[startup] ContactCelebration created');
    } else {
      console.log('[startup] ContactCelebration already exists');
    }
    
    // Seed system packs if empty
    const packs = await client.query(\`SELECT id FROM \"CelebrationPack\" WHERE \"ownerId\" IS NULL\`);
    if (packs.rows.length === 0) {
      console.log('[startup] Seeding system packs...');
      
      // Buddhism
      await client.query(\`INSERT INTO \"CelebrationPack\" (id, \"ownerId\", name, description, \"isDefault\") VALUES ('sys-buddhism', NULL, 'Buddhism Celebrations', 'Observances from Buddhist traditions', true)\`);
      const buddhist = [
        ['sys-buddhism-vesak', 'sys-buddhism', NULL, 'Vesak', 'Birth, enlightenment & passing of Gautama Buddha', '05-15', NULL, '🪷', 'religious', 'lunar'],
        ['sys-buddhism-magha', 'sys-buddhism', NULL, 'Magha Puja', 'Gathering of 1,250 enlightened monks', '02-15', NULL, '🕉️', 'religious', 'lunar'],
        ['sys-buddhism-asalha', 'sys-buddhism', NULL, 'Asalha Puja', 'Buddha''s first sermon and Sangha founding', '07-15', NULL, '☸️', 'religious', 'lunar'],
        ['sys-buddhism-ny', 'sys-buddhism', NULL, 'Buddhist New Year', 'Theravada tradition, mid-April (13th-15th)', '04-14', NULL, '🎊', 'religious', 'lunar'],
        ['sys-buddhism-dhamma', 'sys-buddhism', NULL, 'Dhamma Day', 'Reflection on impermanence', '08-15', NULL, '🕯️', 'religious', 'lunar'],
        ['sys-buddhism-kathina', 'sys-buddhism', NULL, 'Kathina Ceremony', 'Robe offering to monks', '10-01', NULL, '👔', 'religious', 'lunar'],
      ];
      for (const c of buddhist) {
        await client.query(\`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, \"fullDate\", icon, category, \"calendarType\") VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10) ON CONFLICT (id) DO NOTHING\`, c);
      }
      
      // Global
      await client.query(\`INSERT INTO \"CelebrationPack\" (id, \"ownerId\", name, description, \"isDefault\") VALUES ('sys-global', NULL, 'Global Holidays', 'Internationally recognized holidays', true)\`);
      const global = [
        ['sys-global-nyd', 'sys-global', NULL, 'New Year''s Day', 'Beginning of the Gregorian calendar year', '01-01', NULL, '🎆', 'secular', 'gregorian'],
        ['sys-global-val', 'sys-global', NULL, 'Valentine''s Day', 'Day of love and affection', '02-14', NULL, '💝', 'secular', 'gregorian'],
        ['sys-global-af', 'sys-global', NULL, 'April Fools'' Day', 'Day of pranks and humor', '04-01', NULL, '🃏', 'secular', 'gregorian'],
        ['sys-global-earth', 'sys-global', NULL, 'Earth Day', 'Environmental awareness and protection', '04-22', NULL, '🌍', 'secular', 'gregorian'],
        ['sys-global-friend', 'sys-global', NULL, 'International Day of Friendship', 'Celebrating friendship and human bonding', '07-30', NULL, '🤝', 'secular', 'gregorian'],
        ['sys-global-halloween', 'sys-global', NULL, 'Halloween', 'Costumes and spooky celebrations', '10-31', NULL, '🎃', 'cultural', 'gregorian'],
        ['sys-global-thanks', 'sys-global', NULL, 'Thanksgiving', 'Day of gratitude (US)', '11-27', NULL, '🦃', 'cultural', 'gregorian'],
        ['sys-global-xmas', 'sys-global', NULL, 'Christmas', 'Christian celebration of Christ''s birth', '12-25', NULL, '🎄', 'religious', 'gregorian'],
        ['sys-global-nye', 'sys-global', NULL, 'New Year''s Eve', 'Last day of the year', '12-31', NULL, '🥂', 'secular', 'gregorian'],
      ];
      for (const c of global) {
        await client.query(\`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, \"fullDate\", icon, category, \"calendarType\") VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10) ON CONFLICT (id) DO NOTHING\`, c);
      }
      
      // Cultural
      await client.query(\`INSERT INTO \"CelebrationPack\" (id, \"ownerId\", name, description, \"isDefault\") VALUES ('sys-cultural', NULL, 'Cultural Celebrations', 'Festivals from various traditions', true)\`);
      const cultural = [
        ['sys-cultural-cny', 'sys-cultural', NULL, 'Lunar New Year', 'Chinese New Year across Asian cultures', '01-29', NULL, '🐉', 'cultural', 'chinese'],
        ['sys-cultural-diwali', 'sys-cultural', NULL, 'Diwali', 'Hindu festival of lights', '10-20', NULL, '🪔', 'cultural', 'lunar'],
        ['sys-cultural-hanukkah', 'sys-cultural', NULL, 'Hanukkah', 'Jewish festival of lights', '12-18', NULL, '🕎', 'cultural', 'lunar'],
        ['sys-cultural-eid', 'sys-cultural', NULL, 'Eid al-Fitr', 'Islamic holiday marking end of Ramadan', '03-30', NULL, '🌙', 'cultural', 'lunar'],
        ['sys-cultural-easter', 'sys-cultural', NULL, 'Easter', 'Christian resurrection celebration (Western)', '04-20', NULL, '🐰', 'cultural', 'lunar'],
        ['sys-cultural-nowruz', 'sys-cultural', NULL, 'Nowruz', 'Persian New Year', '03-20', NULL, '🌸', 'cultural', 'gregorian'],
      ];
      for (const c of cultural) {
        await client.query(\`INSERT INTO \"Celebration\" (id, \"packId\", \"ownerId\", name, description, date, \"fullDate\", icon, category, \"calendarType\") VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10) ON CONFLICT (id) DO NOTHING\`, c);
      }
      
      console.log('[startup] System packs seeded');
    } else {
      console.log('[startup] System packs already exist');
    }
    
    // Final table check
    const final = await client.query(\`SELECT table_name FROM information_schema.tables WHERE table_schema='public'\`);
    console.log('[startup] Final tables:', final.rows.map(r => r.table_name).join(', '));
    
  } catch(e) {
    console.error('[startup] FATAL ERROR:', e.message);
  } finally {
    try { await client.end(); } catch(e) {}
  }
}

setupDatabase();
"

# ─── Seed ──────────────────────────────────────────────────────────────────────
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
