// @ts-ignore - pg types not available in web workspace
import { Client } from 'pg';

export async function POST(req: Request) {
  // Security: only in development or with a secret
  const secret = req.headers.get('x-setup-secret');
  if (process.env.SETUP_SECRET && secret !== process.env.SETUP_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbHost = process.env.DB_HOST || 'db';
  const dbPort = parseInt(process.env.DB_PORT || '5432');
  const dbUser = process.env.POSTGRES_USER || 'postgres';
  const dbPass = process.env.POSTGRES_PASSWORD || 'postgres';
  const dbName = process.env.POSTGRES_DB || 'socos';

  const results: string[] = [];

  async function query(conn: Client, sql: string, label: string) {
    try {
      await conn.query(sql);
      results.push(`✅ ${label}`);
    } catch(e: any) {
      results.push(`❌ ${label}: ${e.message}`);
    }
  }

  try {
    // Step 1: Connect to postgres default DB and create socos DB if needed
    const admin = new Client({
      host: dbHost, port: dbPort,
      user: dbUser, password: dbPass,
      database: 'postgres',
      connectionTimeoutMillis: 10000,
      ssl: false as any
    });
    await admin.connect();
    results.push('✅ Connected to postgres DB');

    const dbCheck = await admin.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (dbCheck.rows.length === 0) {
      await admin.query(`CREATE DATABASE ${dbName}`);
      results.push(`✅ Created database: ${dbName}`);
    } else {
      results.push(`ℹ️  Database ${dbName} already exists`);
    }
    await admin.end();

    // Step 2: Connect to socos DB and create tables
    const client = new Client({
      host: dbHost, port: dbPort,
      user: dbUser, password: dbPass,
      database: dbName,
      connectionTimeoutMillis: 10000,
      ssl: false as any
    });
    await client.connect();
    results.push(`✅ Connected to ${dbName}`);

    // Check existing tables
    const tables = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    const existingTables = tables.rows.map(r => r.table_name);
    results.push(`ℹ️  Existing tables: ${existingTables.join(', ') || 'none'}`);

    // Create User table
    if (!existingTables.includes('User')) {
      await query(client, `
        CREATE TABLE "User" (
          "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "email" TEXT UNIQUE NOT NULL, "name" TEXT, "avatar" TEXT,
          "passwordHash" TEXT, "xp" INTEGER NOT NULL DEFAULT 0,
          "level" INTEGER NOT NULL DEFAULT 1, "streakDays" INTEGER NOT NULL DEFAULT 0,
          "lastActiveAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `, 'User table');
    } else {
      results.push('ℹ️  User table already exists');
    }

    // Create Session table
    if (!existingTables.includes('Session')) {
      await query(client, `
        CREATE TABLE "Session" (
          "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          "token" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `, 'Session table');
    } else {
      results.push('ℹ️  Session table already exists');
    }

    // Create other base tables
    const baseTables = [
      ['Vault', `"Vault" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "name" TEXT NOT NULL, "description" TEXT, "isShared" BOOLEAN NOT NULL DEFAULT false, "ownerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`],
      ['VaultMember', `"VaultMember" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "vaultId" TEXT NOT NULL REFERENCES "Vault"(id) ON DELETE CASCADE, "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "role" TEXT NOT NULL DEFAULT 'editor', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE("vaultId", "userId"))`],
      ['Contact', `"Contact" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "vaultId" TEXT NOT NULL REFERENCES "Vault"(id) ON DELETE CASCADE, "ownerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "name" TEXT NOT NULL, "birthday" TIMESTAMP(3), "timezone" TEXT DEFAULT 'UTC', "tags" TEXT[], "avatar" TEXT, "notes" TEXT, "xp" INTEGER NOT NULL DEFAULT 0, "level" INTEGER NOT NULL DEFAULT 1, "lastInteractionAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`],
      ['ContactField', `"ContactField" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE, "type" TEXT NOT NULL, "value" TEXT NOT NULL, "label" TEXT, "isPublic" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`],
      ['Interaction', `"Interaction" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE, "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "type" TEXT NOT NULL, "content" TEXT, "metadata" JSONB, "xpEarned" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`],
      ['Reminder', `"Reminder" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE, "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "title" TEXT NOT NULL, "description" TEXT, "dueDate" TIMESTAMP(3) NOT NULL, "recurring" TEXT, "isCompleted" BOOLEAN NOT NULL DEFAULT false, "isAI" BOOLEAN NOT NULL DEFAULT false, "xpReward" INTEGER NOT NULL DEFAULT 50, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`],
      ['Task', `"Task" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE, "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "title" TEXT NOT NULL, "description" TEXT, "dueDate" TIMESTAMP(3), "priority" TEXT NOT NULL DEFAULT 'medium', "isCompleted" BOOLEAN NOT NULL DEFAULT false, "xpReward" INTEGER NOT NULL DEFAULT 50, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`],
      ['Gift', `"Gift" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE, "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "name" TEXT NOT NULL, "description" TEXT, "giftDate" TIMESTAMP(3), "costCents" INTEGER, "currency" TEXT, "occasion" TEXT, "isPurchased" BOOLEAN NOT NULL DEFAULT false, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`],
      ['Activity', `"Activity" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE, "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "name" TEXT NOT NULL, "description" TEXT, "activityDate" TIMESTAMP(3), "duration" INTEGER, "notes" TEXT, "xpEarned" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`],
      ['Achievement', `"Achievement" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "slug" TEXT UNIQUE NOT NULL, "name" TEXT NOT NULL, "description" TEXT NOT NULL, "icon" TEXT, "xpReward" INTEGER NOT NULL DEFAULT 100, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)`],
      ['UserAchievement', `"UserAchievement" ("id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text, "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE, "achievementId" TEXT NOT NULL REFERENCES "Achievement"(id) ON DELETE CASCADE, "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE("userId", "achievementId"))`],
    ];

    for (const [name, sql] of baseTables) {
      if (!existingTables.includes(name)) {
        await query(client, `CREATE TABLE ${sql}`, `${name} table`);
      } else {
        results.push(`ℹ️  ${name} table already exists`);
      }
    }

    // Create celebration tables
    if (!existingTables.includes('CelebrationPack')) {
      await query(client, `
        CREATE TABLE "CelebrationPack" (
          "id" TEXT PRIMARY KEY, "ownerId" TEXT, "name" TEXT NOT NULL,
          "description" TEXT, "isDefault" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `, 'CelebrationPack table');
    } else {
      results.push('ℹ️  CelebrationPack already exists');
    }

    if (!existingTables.includes('Celebration')) {
      await query(client, `
        CREATE TABLE "Celebration" (
          "id" TEXT PRIMARY KEY, "packId" TEXT NOT NULL REFERENCES "CelebrationPack"(id) ON DELETE CASCADE,
          "ownerId" TEXT, "name" TEXT NOT NULL, "description" TEXT,
          "date" TEXT NOT NULL, "fullDate" TIMESTAMP(3), "icon" TEXT,
          "category" TEXT NOT NULL, "calendarType" TEXT NOT NULL DEFAULT 'gregorian',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `, 'Celebration table');
    } else {
      results.push('ℹ️  Celebration already exists');
    }

    if (!existingTables.includes('ContactCelebration')) {
      await query(client, `
        CREATE TABLE "ContactCelebration" (
          "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE,
          "celebrationId" TEXT NOT NULL REFERENCES "Celebration"(id) ON DELETE CASCADE,
          "ownerId" TEXT NOT NULL, "customDate" TIMESTAMP(3),
          "status" TEXT NOT NULL DEFAULT 'active', "shouldRemind" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE("contactId", "celebrationId")
        )
      `, 'ContactCelebration table');
    } else {
      results.push('ℹ️  ContactCelebration already exists');
    }

    // Seed system celebration packs
    const packCount = await client.query(`SELECT id FROM "CelebrationPack" WHERE "ownerId" IS NULL`);
    if (packCount.rows.length === 0) {
      results.push('🌱 Seeding system packs...');

      await client.query(`
        INSERT INTO "CelebrationPack" (id, "ownerId", name, description, "isDefault") VALUES
        ('sys-buddhism', NULL, 'Buddhism Celebrations', 'Observances from Buddhist traditions', true),
        ('sys-global', NULL, 'Global Holidays', 'Internationally recognized holidays', true),
        ('sys-cultural', NULL, 'Cultural Celebrations', 'Festivals from various traditions', true)
        ON CONFLICT (id) DO NOTHING
      `);

      const celebrations = [
        ['sys-buddhism-vesak','sys-buddhism','Vesak','Birth, enlightenment & passing of Gautama Buddha','05-15','🪷','religious','lunar'],
        ['sys-buddhism-magha','sys-buddhism','Magha Puja','Gathering of 1,250 enlightened monks','02-15','🕉️','religious','lunar'],
        ['sys-buddhism-asalha','sys-buddhism','Asalha Puja',"Buddha's first sermon and Sangha founding",'07-15','☸️','religious','lunar'],
        ['sys-buddhism-ny','sys-buddhism','Buddhist New Year','Theravada tradition, mid-April','04-14','🎊','religious','lunar'],
        ['sys-buddhism-dhamma','sys-buddhism','Dhamma Day','Reflection on impermanence','08-15','🕯️','religious','lunar'],
        ['sys-buddhism-kathina','sys-buddhism','Kathina Ceremony','Robe offering to monks','10-01','👔','religious','lunar'],
        ['sys-global-nyd','sys-global',"New Year's Day",'Beginning of the Gregorian year','01-01','🎆','secular','gregorian'],
        ['sys-global-val','sys-global',"Valentine's Day",'Day of love and affection','02-14','💝','secular','gregorian'],
        ['sys-global-aprilfools','sys-global',"April Fools' Day",'Day of pranks','04-01','🃏','secular','gregorian'],
        ['sys-global-earth','sys-global','Earth Day','Environmental awareness','04-22','🌍','secular','gregorian'],
        ['sys-global-friend','sys-global','International Day of Friendship','Celebrating friendship','07-30','🤝','secular','gregorian'],
        ['sys-global-halloween','sys-global','Halloween','Costumes and spooky celebrations','10-31','🎃','cultural','gregorian'],
        ['sys-global-thanks','sys-global','Thanksgiving','Day of gratitude (US)','11-27','🦃','cultural','gregorian'],
        ['sys-global-xmas','sys-global','Christmas',"Christ's birth celebration",'12-25','🎄','religious','gregorian'],
        ['sys-global-nye','sys-global',"New Year's Eve",'Last day of the year','12-31','🥂','secular','gregorian'],
        ['sys-cultural-cny','sys-cultural','Lunar New Year','Chinese New Year','01-29','🐉','cultural','chinese'],
        ['sys-cultural-diwali','sys-cultural','Diwali','Hindu festival of lights','10-20','🪔','cultural','lunar'],
        ['sys-cultural-hanukkah','sys-cultural','Hanukkah','Jewish festival of lights','12-18','🕎','cultural','lunar'],
        ['sys-cultural-eid','sys-cultural','Eid al-Fitr','End of Ramadan','03-30','🌙','cultural','lunar'],
        ['sys-cultural-easter','sys-cultural','Easter','Christian resurrection celebration','04-20','🐰','cultural','lunar'],
        ['sys-cultural-nowruz','sys-cultural','Nowruz','Persian New Year','03-20','🌸','cultural','gregorian'],
      ];

      for (const [id, packId, name, desc, date, icon, cat, cal] of celebrations) {
        await client.query(`
          INSERT INTO "Celebration" (id, "packId", "ownerId", name, description, date, icon, category, "calendarType")
          VALUES ($1, $2, NULL, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [id, packId, name, desc, date, icon, cat, cal]);
      }
      results.push('✅ System celebration packs seeded');
    } else {
      results.push('ℹ️  System packs already seeded');
    }

    // Verify tables
    const finalTables = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    );
    results.push(`✅ Final tables: ${finalTables.rows.map(r => r.table_name).join(', ')}`);

    await client.end();
    return Response.json({ success: true, results });

  } catch(e: any) {
    return Response.json({ error: e.message, results }, { status: 500 });
  }
}
