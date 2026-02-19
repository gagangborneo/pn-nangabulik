import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Enabling maintenance mode...\n');

  await prisma.siteSetting.update({
    where: { key: 'maintenance_mode' },
    data: { value: 'true' },
  });

  console.log('✓ Maintenance mode is now ON');
  
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'maintenance_mode' },
  });
  
  console.log('Current value:', setting?.value);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
