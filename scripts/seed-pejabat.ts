import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding pejabat data...');

  // Clear existing pejabat
  await prisma.pejabat.deleteMany();
  console.log('Cleared existing pejabat');

  // Create sample pejabat data
  const pejabat = await Promise.all([
    prisma.pejabat.create({
      data: {
        name: 'Evan Setiawan Dese, S.H., M.H.',
        title: 'Ketua Pengadilan Negeri Nanga Bulik',
        imageUrl: null,
        order: 0,
        isActive: true,
      },
    }),
    prisma.pejabat.create({
      data: {
        name: 'Aang Sutopo, S.H.',
        title: 'Sekretaris Pengadilan Negeri Nanga Bulik',
        imageUrl: null,
        order: 1,
        isActive: true,
      },
    }),
    prisma.pejabat.create({
      data: {
        name: 'H. Ahmad Fauzi, S.H., M.H.',
        title: 'Hakim Pengadilan Negeri Nanga Bulik',
        imageUrl: null,
        order: 2,
        isActive: true,
      },
    }),
    prisma.pejabat.create({
      data: {
        name: 'Dewi Kartika, S.H.',
        title: 'Panitera Pengadilan Negeri Nanga Bulik',
        imageUrl: null,
        order: 3,
        isActive: true,
      },
    }),
    prisma.pejabat.create({
      data: {
        name: 'Budi Santoso, S.H.',
        title: 'Panitera Muda Perdata',
        imageUrl: null,
        order: 4,
        isActive: true,
      },
    }),
    prisma.pejabat.create({
      data: {
        name: 'Siti Nurhaliza, S.H.',
        title: 'Panitera Muda Pidana',
        imageUrl: null,
        order: 5,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Successfully created ${pejabat.length} pejabat:`);
  pejabat.forEach((p, index) => {
    console.log(`   ${index + 1}. ${p.name} - ${p.title}`);
  });
}

main()
  .catch((e) => {
    console.error('Error seeding pejabat:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
