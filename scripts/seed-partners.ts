import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding partners data...');

  // Clear existing partners
  await prisma.partner.deleteMany();
  console.log('Cleared existing partners');

  // Create sample partners data - "Lembaga & Institusi Terkait"
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: 'Mahkamah Agung RI',
        logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
        websiteUrl: 'https://www.mahkamahagung.go.id',
        order: 0,
        isActive: true,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Kepaniteraan MA RI',
        logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
        websiteUrl: 'https://kepaniteraan.mahkamahagung.go.id/',
        order: 1,
        isActive: true,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Badan Peradilan Umum MA RI',
        logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
        websiteUrl: 'http://badilum.mahkamahagung.go.id/',
        order: 2,
        isActive: true,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Badan Urusan Administrasi MA RI',
        logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
        websiteUrl: 'http://bua.mahkamahagung.go.id/',
        order: 3,
        isActive: true,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Pengadilan Tinggi Palangkaraya',
        logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/logo_ma.png',
        websiteUrl: 'http://pt-palangkaraya.go.id/',
        order: 4,
        isActive: true,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Pemerintah Kabupaten Lamandau',
        logoUrl: 'https://web.pn-nangabulik.go.id/wp-content/uploads/2026/02/LOGO-KABUPATEN-LAMANDAU-1.png',
        websiteUrl: 'https://lamandaukab.go.id',
        order: 5,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Successfully created ${partners.length} partners:`);
  partners.forEach((p, index) => {
    console.log(`   ${index + 1}. ${p.name}`);
  });
}

main()
  .catch((e) => {
    console.error('Error seeding partners:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
