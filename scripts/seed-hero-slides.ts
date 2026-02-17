import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding hero slides...');

  // Clear existing slides
  await prisma.heroSlide.deleteMany();
  console.log('Cleared existing hero slides');

  // Create 3 hero slides for PN Nanga Bulik
  const slides = await Promise.all([
    prisma.heroSlide.create({
      data: {
        title: 'Pengadilan Negeri Nanga Bulik',
        subtitle: 'Melayani Dengan Integritas dan Profesionalisme',
        description: 'Memberikan pelayanan hukum yang transparan, akuntabel, dan mudah diakses untuk mewujudkan kepastian hukum dan keadilan bagi seluruh masyarakat Kabupaten Lamandau.',
        tag: 'Resmi & Terpercaya',
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        overlayColor: 'rgba(139, 0, 0, 0.75)',
        buttonText: 'Daftarkan Perkara',
        buttonUrl: 'https://ecourt.mahkamahagung.go.id/',
        order: 0,
        isActive: true,
      },
    }),
    prisma.heroSlide.create({
      data: {
        title: 'Zona Integritas Menuju WBK',
        subtitle: 'Wilayah Bebas dari Korupsi',
        description: 'PN Nanga Bulik berkomitmen membangun zona integritas menuju Wilayah Bebas dari Korupsi (WBK) dan Wilayah Birokrasi Bersih dan Melayani (WBBM). Bersama kita wujudkan peradilan yang bersih, transparan, dan profesional.',
        tag: 'Zona Integritas',
        imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        overlayColor: 'rgba(0, 102, 51, 0.7)',
        buttonText: 'Informasi Zona Integritas',
        buttonUrl: '/admin/reports',
        order: 1,
        isActive: true,
      },
    }),
    prisma.heroSlide.create({
      data: {
        title: 'Layanan E-Court Mahkamah Agung',
        subtitle: 'Kemudahan Digital di Ujung Jari',
        description: 'Akses layanan peradilan secara online: pendaftaran perkara, pembayaran panjar elektronik, dan persidangan virtual. Mendukung transformasi digital peradilan untuk kemudahan akses keadilan.',
        tag: 'Layanan Digital',
        imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        overlayColor: 'rgba(0, 51, 153, 0.7)',
        buttonText: 'Akses E-Court',
        buttonUrl: 'https://ecourt.mahkamahagung.go.id/',
        order: 2,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Successfully created ${slides.length} hero slides:`);
  slides.forEach((slide, index) => {
    console.log(`   ${index + 1}. ${slide.title}`);
  });
}

main()
  .catch((e) => {
    console.error('Error seeding hero slides:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
