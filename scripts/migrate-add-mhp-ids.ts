/**
 * Migration Script: Add MHP IDs to Existing Providers
 * 
 * Run this after updating the database schema to add MHP IDs
 * to all existing providers who don't have one yet.
 * 
 * Usage:
 * npx tsx scripts/migrate-add-mhp-ids.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

function generateMHPNumber(): string {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `MHP${digits}`;
}

async function migrateProviders() {
  console.log('Starting MHP ID migration...\n');

  try {
    // Get all providers
    const providers = await prisma.healthcareProvider.findMany({
      select: {
        id: true,
        providerName: true,
        mhpNumber: true,
      },
    });

    console.log(`Found ${providers.length} providers\n`);

    let updated = 0;
    let skipped = 0;

    for (const provider of providers) {
      // Skip if already has MHP number
      if (provider.mhpNumber && provider.mhpNumber !== 'MHP0000000000') {
        console.log(`✓ ${provider.providerName} - Already has MHP ID: ${provider.mhpNumber}`);
        skipped++;
        continue;
      }

      // Generate unique MHP number
      let mhpNumber = generateMHPNumber();
      let exists = await prisma.healthcareProvider.findUnique({
        where: { mhpNumber },
      });

      // Ensure uniqueness
      while (exists) {
        mhpNumber = generateMHPNumber();
        exists = await prisma.healthcareProvider.findUnique({
          where: { mhpNumber },
        });
      }

      // Update provider
      await prisma.healthcareProvider.update({
        where: { id: provider.id },
        data: { mhpNumber },
      });

      console.log(`✓ ${provider.providerName} - Assigned MHP ID: ${mhpNumber}`);
      updated++;
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Updated: ${updated} providers`);
    console.log(`   Skipped: ${skipped} providers (already had MHP ID)`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateProviders()
  .then(() => {
    console.log('\n✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
