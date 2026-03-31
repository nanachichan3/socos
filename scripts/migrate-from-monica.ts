/**
 * Monica CRM → Socos Migration Script (v2)
 * 
 * Migrates contacts from Monica CRM to Socos via direct DB access.
 * This is a one-time migration — run once, then delete or archive.
 * 
 * Prerequisites:
 *   npm install pg
 * 
 * Environment variables:
 *   MONICA_DB_URL=postgresql://user:pass@host:5432/monica
 *   SOCOS_DB_URL=postgresql://user:pass@host:5432/socos
 *   SOCOS_OWNER_ID=test_user_001
 *   SOCOS_VAULT_ID=vault_001
 * 
 * Usage:
 *   npx ts-node scripts/migrate-from-monica.ts
 */

import { Client } from 'pg';

// =====================
// CUID2 Generator — Socos uses Prisma cuid() which produces IDs like cmmu1lnxr0001p13dfaj2fq1h
// =====================
let _counter = Math.floor(Math.random() * 10000);
function generateCuid(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  const prefix = 'cmmu';
  const ts = Date.now().toString(36);
  const ctr = (++_counter).toString(36).padStart(4, '0');
  let rand = '';
  for (let i = 0; i < 8; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return (prefix + ts + ctr + rand).slice(0, 24);
}

// =====================
// Types
// =====================
interface MonicaContact {
  id: string;
  first_name: string;
  last_name: string | null;
  nickname: string | null;
  gender_id: number | null;
  created_at: Date;
  updated_at: Date;
}

// =====================
// Main migration
// =====================
async function migrate(options: {
  monicaDbUrl: string;
  socosDbUrl: string;
  socosOwnerId: string;
  socasVaultId: string;
}) {
  const { monicaDbUrl, socosDbUrl, socosOwnerId, socosVaultId } = options;

  const monica = new Client({ connectionString: monicaDbUrl });
  const socas = new Client({ connectionString: socosDbUrl });

  await Promise.all([monica.connect(), socas.connect()]);
  console.log('✅ Connected to both databases\n');

  // --- Step 1: Extract Monica contacts ---
  console.log('📤 Reading Monica contacts...');
  const result = await monica.query<MonicaContact>(
    'SELECT id, first_name, last_name, nickname, gender_id, created_at, updated_at FROM contacts WHERE deleted_at IS NULL ORDER BY id'
  );
  const contacts = result.rows;
  console.log(`   • ${contacts.length} contacts found\n`);

  // --- Step 2: Check which contacts already exist in Socos ---
  const existing = await socas.query<{ firstname: string; lastname: string | null }>(
    'SELECT firstName, lastName FROM \"Contact\" WHERE \"vaultId\" = $1',
    [socosVaultId]
  );
  const existingKeys = new Set(
    existing.rows.map(c => `${c.firstname.toLowerCase()}||${(c.lastname || '').toLowerCase()}`)
  );

  // --- Step 3: Insert new contacts ---
  console.log('👥 Migrating contacts...');
  let inserted = 0;
  let skipped = 0;

  for (const c of contacts) {
    const key = `${c.first_name.toLowerCase()}||${(c.last_name || '').toLowerCase()}`;
    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }

    const id = generateCuid();
    const created = c.created_at.toISOString().split('T')[0];

    await socas.query(
      `INSERT INTO "Contact" (id, "vaultId", "ownerId", "firstName", "lastName", "nickname", "relationshipScore", labels, tags, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        id,
        socosVaultId,
        socosOwnerId,
        c.first_name,
        c.last_name ?? null,
        c.nickname ?? null,
        50,
        ['Monica Migration'],
        [],
        created,
        created,
      ]
    );
    inserted++;
    console.log(`   ✅ ${c.first_name} ${c.last_name || ''}`.trim());
  }

  console.log(`\n   → ${inserted} inserted, ${skipped} already existed (skipped)`);
  console.log(`\n✅ Migration complete!`);

  await Promise.all([monica.end(), socas.end()]);
}

// =====================
// CLI runner
// =====================
const monicaDbUrl = process.env.MONICA_DB_URL || process.env.MONICA_URL;
const socasDbUrl = process.env.SOCOS_DB_URL || process.env.DATABASE_URL;
const ownerId = process.env.SOCOS_OWNER_ID || 'test_user_001';
const vaultId = process.env.SOCOS_VAULT_ID || 'vault_001';

if (!monicaDbUrl || !socasDbUrl) {
  console.error('❌ Missing environment variables:');
  if (!monicaDbUrl) console.error('   Set MONICA_DB_URL (or MONICA_URL)');
  if (!socasDbUrl) console.error('   Set SOCOS_DB_URL (or DATABASE_URL)');
  console.error('\nExample:');
  console.error('   MONICA_DB_URL="postgresql://user:pass@monica-host:5432/monica" \\');
  console.error('   SOCOS_DB_URL="postgresql://user:pass@socos-host:5432/socos" \\');
  console.error('   npx ts-node scripts/migrate-from-monica.ts');
  process.exit(1);
}

migrate({ monicaDbUrl, socosDbUrl, socosOwnerId: ownerId, socosVaultId: vaultId }).catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
