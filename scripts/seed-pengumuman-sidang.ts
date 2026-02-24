import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding pengumuman sidang data...');

  // Clear existing data
  await prisma.pengumumanSidang.deleteMany();

  // Sample data
  const pengumumanSidangData = [
    {
      title: 'Pengumuman Sidang - Kasus Perdata No. 01/Pdt.G/2024/PN.Ngb',
      url: 'https://example.com/documents/pengumuman-01.pdf',
      description: 'Pengumuman jadwal dan pemanggilan untuk sidang pertama perkara perdata',
    },
    {
      title: 'Pengumuman Sidang - Kasus Pidana No. 02/Pid.B/2024/PN.Ngb',
      url: 'https://example.com/documents/pengumuman-02.pdf',
      description: 'Pemanggilan para pihak dan saksi untuk menghadiri persidangan',
    },
    {
      title: 'Pengumuman Sidang - Kasus Perdata No. 03/Pdt.G/2024/PN.Ngb',
      url: 'https://example.com/documents/pengumuman-03.pdf',
      description: 'Pengumuman perubahan jadwal sidang perkara perdata',
    },
    {
      title: 'Pengumuman Sidang - Kasus Pidana No. 04/Pid.B/2024/PN.Ngb',
      url: 'https://example.com/documents/pengumuman-04.pdf',
      description: 'Pengumuman jadwal sidang kedua dengan agenda pembacaan tuntutan',
    },
    {
      title: 'Pengumuman Sidang - Kasus Perdata No. 05/Pdt.G/2024/PN.Ngb',
      url: 'https://example.com/documents/pengumuman-05.pdf',
      description: 'Pemanggilan untuk sidang ketiga dalam perkara perdata',
    },
    {
      title: 'Pengumuman Sidang - Kasus Pidana No. 06/Pid.B/2024/PN.Ngb',
      url: 'https://example.com/documents/pengumuman-06.pdf',
      description: 'Pengumuman sidang lanjutan dan pembaran keputusan',
    },
  ];

  for (let i = 0; i < pengumumanSidangData.length; i++) {
    await prisma.pengumumanSidang.create({
      data: {
        title: pengumumanSidangData[i].title,
        url: pengumumanSidangData[i].url,
        description: pengumumanSidangData[i].description,
        order: i,
        isActive: true,
      },
    });
  }

  console.log(`Successfully seeded ${pengumumanSidangData.length} pengumuman sidang records`);
  
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
