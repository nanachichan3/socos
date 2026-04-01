import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Client } from 'pg';

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  @Get('ping')
  @HttpCode(HttpStatus.OK)
  ping() {
    return { ok: true, ts: new Date().toISOString() };
  }

  // Run: curl https://socos.rachkovan.com/api/debug/db-push
  @Get('db-push')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create all DB tables using raw SQL' })
  async dbPush() {
    console.log('[db-push] Starting at', new Date().toISOString());
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
      connectionTimeoutMillis: 10000,
    });

    try {
      console.log('[db-push] Connecting to DB...');
      await client.connect();
      console.log('[db-push] Connected!');

      const results: string[] = [];

      // Check if User table exists
      const tableCheck = await client.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'User'
      `);

      if (tableCheck.rows.length > 0) {
        return { message: 'Tables already exist', tables: tableCheck.rows.map(r => r.table_name) };
      }

      // Create pg_crypto extension first
      await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

      // Create cuid() function (used by Prisma defaults)
      await client.query(`
        CREATE OR REPLACE FUNCTION cuid() RETURNS TEXT AS $$
        DECLARE
          c VARCHAR(62) := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          buf TEXT := '';
          i INT;
        BEGIN
          FOR i IN 1..24 LOOP
            buf := buf || substr(c, floor(random() * 62 + 1)::int, 1);
          END LOOP;
          RETURN 'c' || buf;
        END;
        $$ LANGUAGE plpgsql VOLATILE;
      `);

      // Create all tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS "User" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          avatar TEXT,
          "passwordHash" TEXT,
          xp INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          "streakDays" INTEGER DEFAULT 0,
          "lastActiveAt" TIMESTAMPTZ,
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "Vault" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          name TEXT NOT NULL,
          description TEXT,
          "isShared" BOOLEAN DEFAULT FALSE,
          "ownerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "VaultMember" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "vaultId" TEXT NOT NULL REFERENCES "Vault"(id) ON DELETE CASCADE,
          "userId" TEXT NOT NULL,
          role TEXT DEFAULT 'member',
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE("vaultId", "userId")
        );

        CREATE TABLE IF NOT EXISTS "Contact" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "vaultId" TEXT NOT NULL REFERENCES "Vault"(id) ON DELETE CASCADE,
          "ownerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          "firstName" TEXT NOT NULL,
          "lastName" TEXT,
          "middleName" TEXT,
          "nickname" TEXT,
          "photo" TEXT,
          "bio" TEXT,
          "company" TEXT,
          "jobTitle" TEXT,
          "birthday" TIMESTAMPTZ,
          "anniversary" TIMESTAMPTZ,
          "relationshipScore" INTEGER DEFAULT 50,
          "labels" TEXT[] DEFAULT '{}',
          "tags" TEXT[] DEFAULT '{}',
          "socialLinks" JSONB,
          "firstMetDate" TIMESTAMPTZ,
          "firstMetContext" TEXT,
          "lastContactedAt" TIMESTAMPTZ,
          "nextReminderAt" TIMESTAMPTZ,
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS "Contact_vaultId_idx" ON "Contact"("vaultId");
        CREATE INDEX IF NOT EXISTS "Contact_ownerId_idx" ON "Contact"("ownerId");
        CREATE INDEX IF NOT EXISTS "Contact_lastContactedAt_idx" ON "Contact"("lastContactedAt");
        CREATE INDEX IF NOT EXISTS "Contact_nextReminderAt_idx" ON "Contact"("nextReminderAt");

        CREATE TABLE IF NOT EXISTS "ContactField" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          value TEXT NOT NULL,
          label TEXT,
          "isPrimary" BOOLEAN DEFAULT FALSE,
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS "ContactField_contactId_idx" ON "ContactField"("contactId");

        CREATE TABLE IF NOT EXISTS "Interaction" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE,
          "ownerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          title TEXT,
          content TEXT,
          summary TEXT,
          "occurredAt" TIMESTAMPTZ DEFAULT NOW(),
          duration INTEGER,
          location TEXT,
          "xpEarned" INTEGER DEFAULT 10,
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS "Interaction_contactId_idx" ON "Interaction"("contactId");
        CREATE INDEX IF NOT EXISTS "Interaction_ownerId_idx" ON "Interaction"("ownerId");
        CREATE INDEX IF NOT EXISTS "Interaction_occurredAt_idx" ON "Interaction"("occurredAt");

        CREATE TABLE IF NOT EXISTS "Reminder" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE,
          "ownerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          "scheduledAt" TIMESTAMPTZ NOT NULL,
          "completedAt" TIMESTAMPTZ,
          "repeatInterval" TEXT,
          "isRecurring" BOOLEAN DEFAULT FALSE,
          status TEXT DEFAULT 'pending',
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS "Reminder_contactId_idx" ON "Reminder"("contactId");
        CREATE INDEX IF NOT EXISTS "Reminder_ownerId_idx" ON "Reminder"("ownerId");
        CREATE INDEX IF NOT EXISTS "Reminder_scheduledAt_idx" ON "Reminder"("scheduledAt");
        CREATE INDEX IF NOT EXISTS "Reminder_status_idx" ON "Reminder"(status);

        CREATE TABLE IF NOT EXISTS "Task" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "contactId" TEXT REFERENCES "Contact"(id) ON DELETE SET NULL,
          "ownerId" TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          "dueDate" TIMESTAMPTZ,
          priority TEXT DEFAULT 'medium',
          status TEXT DEFAULT 'pending',
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
          "completedAt" TIMESTAMPTZ
        );

        CREATE INDEX IF NOT EXISTS "Task_ownerId_idx" ON "Task"("ownerId");
        CREATE INDEX IF NOT EXISTS "Task_contactId_idx" ON "Task"("contactId");
        CREATE INDEX IF NOT EXISTS "Task_status_idx" ON "Task"(status);

        CREATE TABLE IF NOT EXISTS "Gift" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "contactId" TEXT NOT NULL REFERENCES "Contact"(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT,
          price NUMERIC(10,2),
          url TEXT,
          "imageUrl" TEXT,
          status TEXT DEFAULT 'idea',
          "givenAt" TIMESTAMPTZ,
          occasion TEXT,
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS "Gift_contactId_idx" ON "Gift"("contactId");

        CREATE TABLE IF NOT EXISTS "Achievement" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          icon TEXT,
          "xpReward" INTEGER DEFAULT 100,
          requirement JSONB NOT NULL,
          "createdAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "UserAchievement" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          "achievementId" TEXT NOT NULL REFERENCES "Achievement"(id) ON DELETE CASCADE,
          "unlockedAt" TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE("userId", "achievementId")
        );

        CREATE INDEX IF NOT EXISTS "UserAchievement_userId_idx" ON "UserAchievement"("userId");

        CREATE TABLE IF NOT EXISTS "Activity" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "contactId" TEXT REFERENCES "Contact"(id) ON DELETE SET NULL,
          "ownerId" TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          date TIMESTAMPTZ NOT NULL,
          category TEXT NOT NULL,
          "createdAt" TIMESTAMPTZ DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS "Activity_ownerId_idx" ON "Activity"("ownerId");
        CREATE INDEX IF NOT EXISTS "Activity_contactId_idx" ON "Activity"("contactId");

        CREATE TABLE IF NOT EXISTS "Session" (
          id TEXT PRIMARY KEY DEFAULT cuid(),
          "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          token TEXT UNIQUE NOT NULL,
          "expiresAt" TIMESTAMPTZ NOT NULL,
          "createdAt" TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
        CREATE INDEX IF NOT EXISTS "Session_token_idx" ON "Session"(token);
      `);

      results.push('All tables created successfully');

      // List all tables
      const tables = await client.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      return {
        message: 'DB schema created',
        tables: tables.rows.map(r => r.table_name),
      };
    } catch (e: any) {
      return { error: e.message, code: e.code };
    } finally {
      try { await client.end(); } catch {}
    }
  }
}
