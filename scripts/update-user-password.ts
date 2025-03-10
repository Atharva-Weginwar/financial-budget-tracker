import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

// Define the hashPassword function directly in this file
async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Please provide an email and password');
    process.exit(1);
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log(`Password updated for user ${email}`);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 