import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding information slides...');

  // Clear existing slides
  await prisma.informationSlide.deleteMany();
  console.log('Cleared existing information slides');

  // Create 6 information slides
  const slides = await Promise.all([
    prisma.informationSlide.create({
      data: {
        title: 'Layanan Digital SIPP',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Akses informasi perkara dengan mudah melalui Sistem Informasi Penelusuran Perkara (SIPP) kami yang tersedia 24/7.',
        order: 0,
        isActive: true,
      },
    }),
    prisma.informationSlide.create({
      data: {
        title: 'E-Court Mahkamah Agung',
        imageUrl: 'https://images.unsplash.com/photo-1553531088-df340ca884ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Daftarkan perkara, lakukan pembayaran, dan ikuti persidangan secara online dengan mudah dan aman.',
        order: 1,
        isActive: true,
      },
    }),
    prisma.informationSlide.create({
      data: {
        title: 'Zona Integritas WBK',
        imageUrl: 'https://images.unsplash.com/photo-1542744173-8e90f385b863?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'PN Nanga Bulik berkomitmen membangun Wilayah Bebas dari Korupsi (WBK) untuk pelayanan yang lebih baik.',
        order: 2,
        isActive: true,
      },
    }),
    prisma.informationSlide.create({
      data: {
        title: 'Direktori Putusan Pengadilan',
        imageUrl: 'https://images.unsplash.com/photo-1507842725593-f2e4a4787e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Telusuri dan akses salinan putusan pengadilan melalui direktori putusan yang transparan dan mudah diakses.',
        order: 3,
        isActive: true,
      },
    }),
    prisma.informationSlide.create({
      data: {
        title: 'Jadwal Sidang Terbuka',
        imageUrl: 'https://images.unsplash.com/photo-1523875335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Jadwal sidang disusun dan diumumkan secara terbuka untuk memastikan transparansi proses peradilan kami.',
        order: 4,
        isActive: true,
      },
    }),
    prisma.informationSlide.create({
      data: {
        title: 'Survey Kepuasan Masyarakat',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Berikan masukan Anda tentang kualitas layanan kami melalui survey kepuasan masyarakat secara elektronik.',
        order: 5,
        isActive: true,
      },
    }),
  ]);

  console.log(`Seeded ${slides.length} information slides`);
}

main()
  .catch((e) => {
    console.error('Error seeding information slides:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
