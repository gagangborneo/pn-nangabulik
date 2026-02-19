import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking maintenance mode setting...\n');

  const maintenanceSetting = await prisma.siteSetting.findUnique({
    where: { key: 'maintenance_mode' },
  });

  const titleSetting = await prisma.siteSetting.findUnique({
    where: { key: 'maintenance_title' },
  });

  console.log('Maintenance Mode:', maintenanceSetting?.value || 'NOT SET');
  console.log('Maintenance Title:', titleSetting?.value || 'NOT SET');
  console.log('\nAll settings:');
  
  const allSettings = await prisma.siteSetting.findMany();
  allSettings.forEach(s => {
    console.log(`  ${s.key}: ${s.value}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
