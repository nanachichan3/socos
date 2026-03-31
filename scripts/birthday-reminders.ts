/**
 * Birthday Reminder Automation
 * 
 * Scans contacts with birthdays in Socos, checks for upcoming birthdays
 * in the next N days, and creates "birthday" Reminder records if none exist.
 * 
 * This replaces manual heartbeat checks — instead of me (Nanachi) checking
 * every day, this script handles it automatically.
 * 
 * Usage (run as a cron inside Socos Docker network):
 *   npx ts-node scripts/birthday-reminders.ts
 * 
 * Or configure via env:
 *   BIRTHDAY_REMINDER_DAYS=14   # How many days ahead to create reminders
 *   BIRTHDAY_REMINDER_OWNER_ID=test_user_001
 */

import { Client } from 'pg';

const DAYS_AHEAD = parseInt(process.env.BIRTHDAY_REMINDER_DAYS || '14');
const OWNER_ID = process.env.BIRTHDAY_REMINDER_OWNER_ID || 'test_user_001';
const SOCOS_DB_URL = process.env.SOCOS_DB_URL || process.env.DATABASE_URL;

if (!SOCOS_DB_URL) {
  console.error('❌ Set SOCOS_DB_URL environment variable');
  process.exit(1);
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string | null;
  birthday: Date;
  labels: string[];
}

async function runBirthdayReminders() {
  const db = new Client({ connectionString: SOCOS_DB_URL });
  await db.connect();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get contacts with birthdays set
  const contactsResult = await db.query<Contact>(`
    SELECT id, "firstName", "lastName", birthday, labels
    FROM "Contact"
    WHERE birthday IS NOT NULL
    AND "vaultId" IN (SELECT id FROM "Vault" WHERE "ownerId" = $1)
  `, [OWNER_ID]);

  console.log(`\n🎂 Birthday Reminder Check`);
  console.log(`   Owner: ${OWNER_ID}`);
  console.log(`   Looking ${DAYS_AHEAD} days ahead`);
  console.log(`   Contacts with birthdays: ${contactsResult.rows.length}\n`);

  let remindersCreated = 0;
  let remindersSkipped = 0;

  for (const contact of contactsResult.rows) {
    if (!contact.birthday) continue;

    // Calculate next occurrence of this birthday
    const bday = new Date(contact.birthday);
    bday.setFullYear(today.getFullYear());

    // If birthday already passed this year, set to next year
    if (bday < today) {
      bday.setFullYear(today.getFullYear() + 1);
    }

    const daysUntil = Math.ceil((bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil > DAYS_AHEAD) {
      continue; // Not in our window
    }

    // Check if a reminder already exists for this birthday
    const existing = await db.query(`
      SELECT id FROM "Reminder"
      WHERE "contactId" = $1
      AND type = 'birthday'
      AND EXTRACT(MONTH FROM "scheduledAt") = $2
      AND EXTRACT(DAY FROM "scheduledAt") = $3
      AND status != 'completed'
    `, [contact.id, bday.getMonth() + 1, bday.getDate()]);

    if (existing.rows.length > 0) {
      remindersSkipped++;
      console.log(`   ⏭️  ${contact.firstName} ${contact.lastName || ''} — reminder already exists`);
      continue;
    }

    // Create reminder — schedule for 9 AM on the birthday
    const reminderDate = new Date(bday);
    reminderDate.setHours(9, 0, 0, 0);

    const reminderId = 'cmmu' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    const name = `${contact.firstName} ${contact.lastName || ''}`.trim();

    await db.query(`
      INSERT INTO "Reminder" (id, "contactId", "ownerId", type, title, description, "scheduledAt", "repeatInterval", "isRecurring", status, "createdAt", "updatedAt")
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    `, [
      reminderId,
      contact.id,
      OWNER_ID,
      'birthday',
      `🎂 ${name}'s birthday`,
      `It's ${name}'s birthday! Time to reach out and wish them well.`,
      reminderDate.toISOString(),
      'yearly',
      true,
      'pending',
      new Date().toISOString(),
      new Date().toISOString(),
    ]);

    remindersCreated++;
    console.log(`   ✅ Created reminder for ${name} (${daysUntil} days away — ${bday.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })})`);
  }

  console.log(`\n📊 Birthday Reminder Summary:`);
  console.log(`   • Reminders created: ${remindersCreated}`);
  console.log(`   • Reminders already existed: ${remindersSkipped}`);

  await db.end();
}

runBirthdayReminders().catch(err => {
  console.error('❌ Birthday reminder job failed:', err.message);
  process.exit(1);
});
