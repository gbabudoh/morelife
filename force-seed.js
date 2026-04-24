const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Test123456', 10);
  
  const providers = [
    {
      email: 'lagos.general@test.com',
      providerName: 'Lagos General Hospital',
      contactPerson: 'Dr. Adebayo Okonkwo',
      password: password,
      category: 'HOSPITAL',
      providerType: 'GENERAL_HOSPITAL',
      location: 'Lagos, Nigeria',
      contactTelephone: '+2348012345678',
    },
    {
      email: 'capetown.medical@test.com',
      providerName: 'Cape Town Medical Centre',
      contactPerson: 'Dr. Thabo Mbeki',
      password: password,
      category: 'CLINIC',
      providerType: 'MEDICAL_CENTRE',
      location: 'Cape Town, South Africa',
      contactTelephone: '+27211234567',
    }
  ];

  console.log('Force seeding provider accounts...');

  for (const p of providers) {
    await prisma.healthcareProvider.upsert({
      where: { email: p.email },
      update: { password: p.password },
      create: p,
    });
    console.log(`✅ ${p.providerName} processed.`);
  }

  console.log('Done.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
