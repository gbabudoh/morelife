const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding healthcare packages...');

  // 1. Ensure we have at least one provider
  let provider = await prisma.healthcareProvider.findFirst();

  if (!provider) {
    console.log('No provider found. Creating a default provider...');
    provider = await prisma.healthcareProvider.create({
      data: {
        email: 'hospital@morelife.com',
        password: 'password123', // Demo password
        providerName: 'City General Hospital',
        contactPerson: 'Dr. Smith',
        category: 'HOSPITAL',
        providerType: 'GENERAL_HOSPITAL',
        location: 'Lagos, Nigeria',
        contactTelephone: '+2348000000000',
        verificationStatus: 'APPROVED'
      }
    });
  }

  const packages = [
    {
      name: "Maternity Care Package",
      description: "Complete antenatal care, delivery, and post-natal care for expecting mothers",
      price: 150000,
      duration: "9 months",
      treatmentType: "Maternity",
      isFree: false,
      providerId: provider.id,
      isActive: true
    },
    {
      name: "Malaria Treatment Package",
      description: "Complete malaria treatment including consultation, tests, and medication",
      price: 5000,
      duration: "2 weeks",
      treatmentType: "Malaria",
      isFree: false,
      providerId: provider.id,
      isActive: true
    },
    {
      name: "Dental Check-up Package",
      description: "Comprehensive dental examination, cleaning, and X-rays",
      price: 15000,
      duration: "1 day",
      treatmentType: "Dental",
      isFree: false,
      providerId: provider.id,
      isActive: true
    },
    {
      name: "Eye Treatment Package",
      description: "Complete eye examination, vision test, and consultation",
      price: 20000,
      duration: "1 day",
      treatmentType: "Eye Treatment",
      isFree: false,
      providerId: provider.id,
      isActive: true
    },
    {
      name: "General Health Check-up Package",
      description: "Complete health screening including blood tests, vitals, and consultation",
      price: 15000,
      duration: "1 day",
      treatmentType: "General Check-up",
      isFree: false,
      providerId: provider.id,
      isActive: true
    },
    {
      name: "Free Vaccination Drive",
      description: "Free vaccination program for children and adults",
      price: 0,
      duration: "1 day",
      treatmentType: "Vaccination",
      isFree: true,
      providerId: provider.id,
      isActive: true
    }
  ];

  for (const pkg of packages) {
    await prisma.healthcarePackage.create({
      data: pkg
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
