import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Clear existing data
  await prisma.reportLinkView.deleteMany();
  await prisma.reportView.deleteMany();
  await prisma.reportLink.deleteMany();
  await prisma.reportCategory.deleteMany();
  await prisma.heroSlide.deleteMany();

  // Create Report Categories
  const categories = await Promise.all([
    prisma.reportCategory.create({
      data: {
        title: 'DIPA',
        slug: 'dipa',
        description: 'Dokumen Isian Pelaksanaan Anggaran',
        icon: 'FileText',
        order: 0,
        isActive: true,
      },
    }),
    prisma.reportCategory.create({
      data: {
        title: 'Renstra',
        slug: 'renstra',
        description: 'Rencana Strategis jangka menengah',
        icon: 'TrendingUp',
        order: 1,
        isActive: true,
      },
    }),
    prisma.reportCategory.create({
      data: {
        title: 'IKU',
        slug: 'iku',
        description: 'Indikator Kinerja Utama',
        icon: 'BarChart3',
        order: 2,
        isActive: true,
      },
    }),
    prisma.reportCategory.create({
      data: {
        title: 'RKT',
        slug: 'rkt',
        description: 'Rencana Kerja Tahunan',
        icon: 'Calendar',
        order: 3,
        isActive: true,
      },
    }),
    prisma.reportCategory.create({
      data: {
        title: 'PKT',
        slug: 'pkt',
        description: 'Perjanjian Kinerja Tahunan',
        icon: 'FileText',
        order: 4,
        isActive: true,
      },
    }),
    prisma.reportCategory.create({
      data: {
        title: 'LKJIP',
        slug: 'lkjip',
        description: 'Laporan Kinerja Instansi Pemerintah',
        icon: 'BookOpen',
        order: 5,
        isActive: true,
      },
    }),
    prisma.reportCategory.create({
      data: {
        title: 'Laptah',
        slug: 'laptah',
        description: 'Laporan Tahunan Pelaksanaan Kegiatan',
        icon: 'FolderOpen',
        order: 6,
        isActive: true,
      },
    }),
    prisma.reportCategory.create({
      data: {
        title: 'Laporan Keuangan',
        slug: 'laporan-keuangan',
        description: 'Rincian Laporan Keuangan Tahunan',
        icon: 'PieChart',
        order: 7,
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create Sample Links for each category
  const dipa = categories.find(c => c.slug === 'dipa')!;
  const renstra = categories.find(c => c.slug === 'renstra')!;
  const iku = categories.find(c => c.slug === 'iku')!;
  const rkt = categories.find(c => c.slug === 'rkt')!;
  const pkt = categories.find(c => c.slug === 'pkt')!;
  const lkjip = categories.find(c => c.slug === 'lkjip')!;
  const laptah = categories.find(c => c.slug === 'laptah')!;
  const laporanKeuangan = categories.find(c => c.slug === 'laporan-keuangan')!;

  // DIPA Links
  await Promise.all([
    prisma.reportLink.create({ data: { categoryId: dipa.id, title: 'DIPA PN Nanga Bulik Tahun 2025', url: 'https://silapor.pn-nangabulik.go.id/dipa/2025', order: 0, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: dipa.id, title: 'DIPA PN Nanga Bulik Tahun 2024', url: 'https://silapor.pn-nangabulik.go.id/dipa/2024', order: 1, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: dipa.id, title: 'DIPA PN Nanga Bulik Tahun 2023', url: 'https://silapor.pn-nangabulik.go.id/dipa/2023', order: 2, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: dipa.id, title: 'DIPA PN Nanga Bulik Tahun 2022', url: 'https://silapor.pn-nangabulik.go.id/dipa/2022', order: 3, isActive: true } }),
  ]);

  // Renstra Links
  await Promise.all([
    prisma.reportLink.create({ data: { categoryId: renstra.id, title: 'Rencana Strategis 2020-2025', url: 'https://silapor.pn-nangabulik.go.id/laporan-sakip/renstra', order: 0, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: renstra.id, title: 'Rencana Strategis 2015-2019', url: 'https://silapor.pn-nangabulik.go.id/laporan-sakip/renstra-old', order: 1, isActive: true } }),
  ]);

  // IKU Links
  await Promise.all([
    prisma.reportLink.create({ data: { categoryId: iku.id, title: 'Indikator Kinerja Utama Tahun 2024', url: 'https://silapor.pn-nangabulik.go.id/sakip/iku', order: 0, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: iku.id, title: 'Indikator Kinerja Utama Tahun 2023', url: 'https://silapor.pn-nangabulik.go.id/sakip/iku-2023', order: 1, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: iku.id, title: 'Indikator Kinerja Utama Tahun 2022', url: 'https://silapor.pn-nangabulik.go.id/sakip/iku-2022', order: 2, isActive: true } }),
  ]);

  // RKT Links
  await Promise.all([
    prisma.reportLink.create({ data: { categoryId: rkt.id, title: 'Rencana Kerja Tahunan 2025', url: 'https://silapor.pn-nangabulik.go.id/rkt/2025', order: 0, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: rkt.id, title: 'Rencana Kerja Tahunan 2024', url: 'https://silapor.pn-nangabulik.go.id/rkt/2024', order: 1, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: rkt.id, title: 'Rencana Kerja Tahunan 2023', url: 'https://silapor.pn-nangabulik.go.id/rkt/2023', order: 2, isActive: true } }),
  ]);

  // PKT Links
  await Promise.all([
    prisma.reportLink.create({ data: { categoryId: pkt.id, title: 'Perjanjian Kinerja Tahunan 2024', url: 'https://silapor.pn-nangabulik.go.id/pkt/2024', order: 0, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: pkt.id, title: 'Perjanjian Kinerja Tahunan 2023', url: 'https://silapor.pn-nangabulik.go.id/pkt/2023', order: 1, isActive: true } }),
  ]);

  // LKJIP Links
  await Promise.all([
    prisma.reportLink.create({ data: { categoryId: lkjip.id, title: 'LKJIP Tahun 2024', url: 'https://silapor.pn-nangabulik.go.id/sakip/lkjip', order: 0, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: lkjip.id, title: 'LKJIP Tahun 2023', url: 'https://silapor.pn-nangabulik.go.id/sakip/lkjip-2023', order: 1, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: lkjip.id, title: 'LKJIP Tahun 2022', url: 'https://silapor.pn-nangabulik.go.id/sakip/lkjip-2022', order: 2, isActive: true } }),
  ]);

  // Laptah Links
  await Promise.all([
    prisma.reportLink.create({ data: { categoryId: laptah.id, title: 'Laporan Tahunan 2024', url: 'https://silapor.pn-nangabulik.go.id/laporan-tahunan', order: 0, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: laptah.id, title: 'Laporan Tahunan 2023', url: 'https://silapor.pn-nangabulik.go.id/laporan-tahunan-2023', order: 1, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: laptah.id, title: 'Laporan Tahunan 2022', url: 'https://silapor.pn-nangabulik.go.id/laporan-tahunan-2022', order: 2, isActive: true } }),
  ]);

  // Laporan Keuangan Links
  await Promise.all([
    prisma.reportLink.create({ data: { categoryId: laporanKeuangan.id, title: 'Laporan Keuangan Tahun 2024', url: 'https://silapor.pn-nangabulik.go.id/laporan-keuangan', order: 0, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: laporanKeuangan.id, title: 'Laporan Keuangan Tahun 2023', url: 'https://silapor.pn-nangabulik.go.id/laporan-keuangan-2023', order: 1, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: laporanKeuangan.id, title: 'Laporan Realisasi Anggaran 2024', url: 'https://silapor.pn-nangabulik.go.id/lra', order: 2, isActive: true } }),
    prisma.reportLink.create({ data: { categoryId: laporanKeuangan.id, title: 'Laporan Realisasi Anggaran 2023', url: 'https://silapor.pn-nangabulik.go.id/lra-2023', order: 3, isActive: true } }),
  ]);

  console.log('Created sample links for all categories');

  // Create Sample Slides
  const slides = await Promise.all([
    prisma.heroSlide.create({
      data: {
        title: 'Melayani Dengan Integritas dan Profesionalisme',
        description: 'Pengadilan Negeri Nanga Bulik berkomitmen memberikan pelayanan hukum yang transparan, akuntabel, dan mudah diakses oleh seluruh masyarakat Indonesia.',
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
        title: 'Zona Integritas WBK-WBBM',
        description: 'Menuju Wilayah Bebas dari Korupsi dan Wilayah Birokrasi Bersih dan Melayani. Bersama kita wujudkan pengadilan yang bersih dan profesional.',
        tag: 'Zona Integritas',
        imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        overlayColor: 'rgba(139, 0, 0, 0.7)',
        buttonText: 'Pelajari Lebih Lanjut',
        buttonUrl: 'https://zi.pn-nangabulik.go.id/',
        order: 1,
        isActive: true,
      },
    }),
    prisma.heroSlide.create({
      data: {
        title: 'Layanan E-Court',
        description: 'Daftar perkara online, bayar panjar secara elektronik, dan ikuti persidangan secara virtual. Kemudahan akses keadilan di ujung jari Anda.',
        tag: 'Layanan Digital',
        imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        overlayColor: 'rgba(139, 0, 0, 0.65)',
        buttonText: 'Akses E-Court',
        buttonUrl: 'https://ecourt.mahkamahagung.go.id/',
        order: 2,
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${slides.length} slides`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
