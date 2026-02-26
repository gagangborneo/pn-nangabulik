import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Layanan data...');

  // Clear existing layanan
  await prisma.layanan.deleteMany();
  console.log('Cleared existing layanan');

  // Create layanan data
  const layanan = await Promise.all([
    prisma.layanan.create({
      data: {
        title: 'SIPP',
        description: 'Layanan digital untuk mengakses informasi perkara dengan mudah.',
        icon: 'FileText',
        url: 'https://sipp.pn-nangabulik.go.id/',
        order: 0,
        isActive: true,
      },
    }),
    prisma.layanan.create({
      data: {
        title: 'Jadwal Sidang',
        description: 'Jadwal sidang disusun dan diumumkan secara terbuka.',
        icon: 'Calendar',
        url: 'http://sipp.pn-nangabulik.go.id/list_jadwal_sidang/',
        order: 1,
        isActive: true,
      },
    }),
    prisma.layanan.create({
      data: {
        title: 'Direktori Putusan',
        description: 'Akses publik terhadap salinan putusan pengadilan.',
        icon: 'BookOpen',
        url: 'https://putusan3.mahkamahagung.go.id/search.html?&court=29e34643d20beb9e89ceec68971fb933',
        order: 2,
        isActive: true,
      },
    }),
    prisma.layanan.create({
      data: {
        title: 'Survey Elektronik',
        description: 'Sarana penilaian kualitas layanan secara online.',
        icon: 'ClipboardList',
        url: 'http://esurvey.badilum.mahkamahagung.go.id/index.php/pengadilan/402028',
        order: 3,
        isActive: true,
      },
    }),
    prisma.layanan.create({
      data: {
        title: 'SIWAS',
        description: 'Sistem pelaporan pelanggaran di lingkungan pengadilan.',
        icon: 'AlertCircle',
        url: 'https://siwas.mahkamahagung.go.id/',
        order: 4,
        isActive: true,
      },
    }),
    prisma.layanan.create({
      data: {
        title: 'E-Court',
        description: 'Layanan pendaftaran, pembayaran, dan persidangan online.',
        icon: 'Gavel',
        url: 'https://ecourt.mahkamahagung.go.id/',
        order: 5,
        isActive: true,
      },
    }),
    prisma.layanan.create({
      data: {
        title: 'e-Berpadu',
        description: 'Integrasi berkas pidana antar penegak hukum.',
        icon: 'FolderSync',
        url: 'https://eberpadu.mahkamahagung.go.id/',
        order: 6,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Successfully created ${layanan.length} layanan:`);
  layanan.forEach((item) => {
    console.log(`   - ${item.title}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding layanan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
