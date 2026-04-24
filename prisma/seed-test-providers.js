const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const password = await bcrypt.hash('Test123456', 10);

  const providers = [
    {
      email: 'lagos.general@test.com',
      providerName: 'Lagos General Hospital',
      contactPerson: 'Dr. Adebayo Okafor',
      category: 'HOSPITAL',
      providerType: 'GENERAL_HOSPITAL',
      location: 'Lagos, Nigeria',
      contactTelephone: '+2348012345678',
      mhpNumber: 'MHP-LGH-001',
    },
    {
      email: 'capetown.medical@test.com',
      providerName: 'Cape Town Medical Centre',
      contactPerson: 'Dr. Amara Dlamini',
      category: 'MEDICAL_CENTRE',
      providerType: 'MEDICAL_CENTRE',
      location: 'Cape Town, South Africa',
      contactTelephone: '+27211234567',
      mhpNumber: 'MHP-CTM-001',
    },
  ];

  for (const p of providers) {
    const existing = await client.query(
      'SELECT id FROM "HealthcareProvider" WHERE email = $1',
      [p.email]
    );

    if (existing.rows.length > 0) {
      await client.query(
        `UPDATE "HealthcareProvider"
         SET password = $1, "verificationStatus" = 'APPROVED', "isActive" = true, "isRevoked" = false
         WHERE email = $2`,
        [password, p.email]
      );
      console.log(`Updated: ${p.email}`);
    } else {
      await client.query(
        `INSERT INTO "HealthcareProvider"
          (id, email, password, "providerName", "contactPerson", category, "providerType",
           location, "contactTelephone", "mhpNumber", "verificationStatus", "isActive", "isRevoked",
           "createdAt", "updatedAt")
         VALUES
          (gen_random_uuid(), $1, $2, $3, $4, $5::\"ProviderCategory\", $6::\"ProviderType\",
           $7, $8, $9, 'APPROVED', true, false, NOW(), NOW())`,
        [p.email, password, p.providerName, p.contactPerson, p.category,
         p.providerType, p.location, p.contactTelephone, p.mhpNumber]
      );
      console.log(`Created: ${p.email}`);
    }
  }

  await client.end();
  console.log('Done. Test providers ready with password: Test123456');
}

main().catch(e => { console.error(e.message); process.exit(1); });
