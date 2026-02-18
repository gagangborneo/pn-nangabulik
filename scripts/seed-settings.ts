import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default settings...');

  const defaultSettings = [
    {
      key: 'wordpress_url',
      value: 'https://web.pn-nangabulik.go.id/wp-json/wp/v2',
    },
    {
      key: 'site_name',
      value: 'Pengadilan Negeri Nanga Bulik',
    },
    {
      key: 'site_description',
      value: 'Website resmi Pengadilan Negeri Nanga Bulik',
    },
    {
      key: 'logo_url',
      value: '',
    },
    {
      key: 'favicon_url',
      value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Lambang_Mahkamah_Agung.svg/32px-Lambang_Mahkamah_Agung.svg.png',
    },
    {
      key: 'contact_email',
      value: 'info@pn-nangabulik.go.id',
    },
    {
      key: 'contact_phone',
      value: '',
    },
    {
      key: 'contact_address',
      value: '',
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
    console.log(`✓ Settings ${setting.key} created/updated`);
  }

  console.log('Settings seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
