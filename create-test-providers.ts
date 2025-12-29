import { prisma } from './lib/prisma';
import * as bcrypt from 'bcryptjs';

async function createBasicTestProviders() {
  try {
    console.log('Creating test provider accounts (basic fields only)...\n');

    // Test Provider 1: Nigeria
    const nigeriaPassword = await bcrypt.hash('Test123456', 10);
    
    // Check if already exists
    const existingNigeria = await prisma.healthcareProvider.findUnique({
      where: { email: 'lagos.general@test.com' }
    });

    if (!existingNigeria) {
      await prisma.healthcareProvider.create({
        data: {
          providerName: 'Lagos General Hospital',
          contactPerson: 'Dr. Adebayo Okonkwo',
          email: 'lagos.general@test.com',
          password: nigeriaPassword,
          category: 'HOSPITAL',
          providerType: 'GENERAL_HOSPITAL',
          location: 'Lagos, Lagos, Nigeria',
          contactTelephone: '+2348012345678',
        },
      });

      console.log('✅ Nigeria Provider Created:');
      console.log('   Email: lagos.general@test.com');
      console.log('   Password: Test123456');
      console.log('   Provider: Lagos General Hospital');
      console.log('   Location: Lagos, Nigeria\n');
    } else {
      console.log('⚠️  Nigeria provider already exists\n');
    }

    // Test Provider 2: South Africa
    const saPassword = await bcrypt.hash('Test123456', 10);
    
    const existingSA = await prisma.healthcareProvider.findUnique({
      where: { email: 'capetown.medical@test.com' }
    });

    if (!existingSA) {
      await prisma.healthcareProvider.create({
        data: {
          providerName: 'Cape Town Medical Centre',
          contactPerson: 'Dr. Thabo Mbeki',
          email: 'capetown.medical@test.com',
          password: saPassword,
          category: 'CLINIC',
          providerType: 'MEDICAL_CENTRE',
          location: 'Cape Town, Western Cape, South Africa',
          contactTelephone: '+27211234567',
        },
      });

      console.log('✅ South Africa Provider Created:');
      console.log('   Email: capetown.medical@test.com');
      console.log('   Password: Test123456');
      console.log('   Provider: Cape Town Medical Centre');
      console.log('   Location: Cape Town, South Africa\n');
    } else {
      console.log('⚠️  South Africa provider already exists\n');
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
