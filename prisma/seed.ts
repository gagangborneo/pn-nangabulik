import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Simple password hashing function
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function seedLayanan() {
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

async function seedPartners() {
  console.log('Seeding partners data...');

  // Clear existing partners
  await prisma.partner.deleteMany();
  console.log('Cleared existing partners');

  // Create partners data - "Lembaga & Institusi Terkait"
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
  partners.forEach((p) => {
    console.log(`   - ${p.name}`);
  });
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

  // Seed layanan data
  await seedLayanan();

  // Seed partners data
  await seedPartners();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
