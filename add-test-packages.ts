import { prisma } from './lib/prisma';

async function addTestPackages() {
  try {
    const provider = await prisma.healthcareProvider.findUnique({
      where: { email: 'capetown.medical@test.com' }
    });

    if (!provider) {
      console.error('Provider not found!');
      return;
    }

    const packages = [
      {
        name: 'Comprehensive Health Screening',
        description: 'Full body checkup including cardio, respiratory, and metabolic screening.',
        price: 2500, // ZAR
        duration: '1 day',
        treatmentType: 'General Check-up',
        providerId: provider.id,
      },
      {
        name: 'Premium Wellness Protocol',
        description: 'Exclusive health optimization and wellness membership.',
        price: 8500, // ZAR
        duration: '12 months',
        treatmentType: 'Wellness',
        providerId: provider.id,
      }
    ];

    for (const pkg of packages) {
      await prisma.healthcarePackage.create({
        data: pkg
      });
    }

    console.log('✅ Added test packages for Cape Town Medical Centre');
  } catch (error) {
    console.error('Error adding packages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestPackages();
