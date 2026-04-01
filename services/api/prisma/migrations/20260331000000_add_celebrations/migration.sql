-- Migration: Add celebrations feature
-- Creates CelebrationPack, Celebration, and ContactCelebration tables

CREATE TABLE IF NOT EXISTS "CelebrationPack" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CelebrationPack_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CelebrationPack_ownerId_idx" ON "CelebrationPack"("ownerId");

CREATE TABLE IF NOT EXISTS "Celebration" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TEXT NOT NULL,
    "fullDate" TIMESTAMP(3),
    "icon" TEXT,
    "category" TEXT NOT NULL,
    "calendarType" TEXT NOT NULL DEFAULT 'gregorian',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Celebration_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Celebration_packId_idx" ON "Celebration"("packId");
CREATE INDEX IF NOT EXISTS "Celebration_ownerId_idx" ON "Celebration"("ownerId");

CREATE TABLE IF NOT EXISTS "ContactCelebration" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "celebrationId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "customDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "shouldRemind" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ContactCelebration_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ContactCelebration_contactId_celebrationId_key" ON "ContactCelebration"("contactId", "celebrationId");
CREATE INDEX IF NOT EXISTS "ContactCelebration_contactId_idx" ON "ContactCelebration"("contactId");
CREATE INDEX IF NOT EXISTS "ContactCelebration_celebrationId_idx" ON "ContactCelebration"("celebrationId");
CREATE INDEX IF NOT EXISTS "ContactCelebration_ownerId_idx" ON "ContactCelebration"("ownerId");

-- Foreign keys
ALTER TABLE "Celebration" ADD CONSTRAINT "Celebration_packId_fkey" FOREIGN KEY ("packId") REFERENCES "CelebrationPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContactCelebration" ADD CONSTRAINT "ContactCelebration_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContactCelebration" ADD CONSTRAINT "ContactCelebration_celebrationId_fkey" FOREIGN KEY ("celebrationId") REFERENCES "Celebration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add inverse relation to Contact model (for Prisma client)
-- The Contact model needs: contactCelebrations ContactCelebration[]
-- This is handled by Prisma client at query time, not via SQL
