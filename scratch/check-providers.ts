import { prisma } from '../lib/prisma';

async function checkProviders() {
  try {
    const providers = await prisma.healthcareProvider.findMany({
      where: {
        email: {
          in: ['lagos.general@test.com', 'capetown.medical@test.com']
        }
      },
      select: {
        email: true,
        providerName: true
      }
    });
    console.log('Found providers:', JSON.stringify(providers, null, 2));
  } catch (error) {
    console.error('Error checking providers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProviders();
