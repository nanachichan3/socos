/**
 * SOCOS Migration Script
 * 
 * Migrates contacts from Monica CRM to SOCOS
 * 
 * Usage:
 * 1. Start SOCOS API locally
 * 2. Set AUTH_TOKEN below
 * 3. Run: npx ts-node scripts/migrate-contacts.ts
 * 
 * Or use the API directly:
 * curl -X POST http://localhost:3001/contacts \
 *   -H "Authorization: Bearer TOKEN" \
 *   -H "Content-Type: application/json" \
 *   -d '{...}'
 */

// Sample contacts from Monica (to be extracted manually or via API)
// These are placeholder examples - extract real data from Monica

export const monicaContactsToMigrate = [
  {
    // Sun Sachs - Business Owner
    firstName: "Sun",
    lastName: "Sachs",
    company: "",
    jobTitle: "Business Owner",
    labels: ["Networking"],
    tags: [],
  },
  {
    // Vriti Saraf
    firstName: "Vriti",
    lastName: "Saraf",
    labels: ["Networking"],
    tags: [],
  },
  {
    // Jordan Berke
    firstName: "Jordan",
    lastName: "Berke",
    labels: ["Networking"],
    tags: [],
  },
  {
    // Connor Billing
    firstName: "Connor",
    lastName: "Billing",
    labels: ["Networking"],
    tags: [],
  },
  {
    // Jack Boudreau
    firstName: "Jack",
    lastName: "Boudreau",
    labels: ["Networking"],
    tags: [],
  },
  {
    // Maria Duduman
    firstName: "Maria",
    lastName: "Duduman",
    labels: ["Networking"],
    tags: [],
  },
  {
    // Mitchella Gilbert
    firstName: "Mitchella",
    lastName: "Gilbert",
    company: "",
    jobTitle: "Millionare",
    labels: ["Networking"],
    tags: [],
  },
  {
    // Ruslan Kovalenko
    firstName: "Ruslan",
    lastName: "Kovalenko",
    company: "",
    jobTitle: "Business Owner",
    labels: ["Networking"],
    tags: [],
  },
  {
    // Michaela Maris
    firstName: "Michaela",
    lastName: "Maris",
    labels: ["Networking"],
    tags: [],
  },
  {
    // Logan Merriam
    firstName: "Logan",
    lastName: "Merriam",
    labels: ["Networking"],
    tags: [],
  },
];

/**
 * Field mapping from Monica to SOCOS
 */
export const fieldMapping = {
  // Monica → SOCOS
  first_name: 'firstName',
  last_name: 'lastName',
  companies: (c: any) => c?.[0]?.name,
  jobs: (c: any) => c?.[0]?.title,
  labels: 'labels',
  tags: 'tags',
  birthday: 'birthday',
  first_met_details: 'firstMetContext',
  first_met_date: 'firstMetDate',
  // Contact fields (emails, phones)
  contactFields: 'contactFields',
};

/**
 * Migrate a single contact
 */
export async function migrateContact(contact: any, apiUrl: string, token: string) {
  const response = await fetch(`${apiUrl}/contacts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to migrate contact: ${error}`);
  }

  return response.json();
}

/**
 * Batch migrate contacts
 */
export async function migrateAll(
  contacts: any[],
  apiUrl: string = 'http://localhost:3001',
  token: string
) {
  console.log(`Starting migration of ${contacts.length} contacts...\n`);
  
  const results = [];
  
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    try {
      console.log(`Migrating: ${contact.firstName} ${contact.lastName}...`);
      const result = await migrateContact(contact, apiUrl, token);
      results.push({ success: true, contact, result });
      console.log(`  ✅ Success!`);
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
      results.push({ success: false, contact, error: error.message });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nMigration complete: ${successCount}/${contacts.length} succeeded`);
  
  return results;
}
