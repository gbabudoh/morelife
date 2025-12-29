import { prisma } from './lib/prisma';

async function checkUser() {
  try {
    const patient = await prisma.patient.findUnique({
      where: { email: 'gbabudoh@gmail.com' }
    });
    
    if (patient) {
      console.log('User found:', {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        hasPassword: !!patient.password,
        passwordLength: patient.password?.length
      });
    } else {
      console.log('User not found with email: gbabudoh@gmail.com');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
