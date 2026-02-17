import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Simple password hashing function
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  // Check if admin user exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@pn-nangabulik.go.id' },
  });

  if (!existingAdmin) {
    // Create default admin user
    const hashedPassword = hashPassword('admin123');
    await prisma.user.create({
      data: {
        email: 'admin@pn-nangabulik.go.id',
        name: 'Administrator',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('Default admin user created:');
    console.log('Email: admin@pn-nangabulik.go.id');
    console.log('Password: admin123');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
