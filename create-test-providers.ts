import { prisma } from './lib/prisma';
import * as bcrypt from 'bcryptjs';
import { ProviderCategory, ProviderType } from '@prisma/client';

async function createBasicTestProviders() {
  try {
    console.log('Creating test provider accounts (basic fields only)...\n');

    const providers = [
      {
        email: 'lagos.general@test.com',
        providerName: 'Lagos General Hospital',
        contactPerson: 'Dr. Adebayo Okonkwo',
        password: await bcrypt.hash('Test123456', 10),
        category: ProviderCategory.HOSPITAL,
        providerType: ProviderType.GENERAL_HOSPITAL,
        location: 'Lagos, Lagos, Nigeria',
        contactTelephone: '+2348012345678',
        latitude: 6.5244,
        longitude: 3.3792,
      },
      {
        email: 'capetown.medical@test.com',
        providerName: 'Cape Town Medical Centre',
        contactPerson: 'Dr. Thabo Mbeki',
        password: await bcrypt.hash('Test123456', 10),
        category: ProviderCategory.CLINIC,
        providerType: ProviderType.MEDICAL_CENTRE,
        location: 'Cape Town, Western Cape, South Africa',
        contactTelephone: '+27211234567',
        latitude: -33.9249,
        longitude: 18.4241,
      }
    ];

    for (const p of providers) {
      await prisma.healthcareProvider.upsert({
        where: { email: p.email },
        update: { password: p.password, isActive: true },
        create: p,
      });
      console.log(`✅ Processed ${p.providerName} (${p.email})`);
    }

    console.log('🎉 Test accounts ready!');
    console.log('\nYou can now login at: http://localhost:3001/provider/login');

  } catch (error) {
    console.error('Error creating test providers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBasicTestProviders();
