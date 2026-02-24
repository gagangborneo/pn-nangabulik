import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding pojok info slides...');

  await prisma.pojokInfoSlide.deleteMany();
  console.log('Cleared existing pojok info slides');

  const slides = await Promise.all([
    prisma.pojokInfoSlide.create({
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80',
        order: 0,
        isActive: true,
      },
    }),
    prisma.pojokInfoSlide.create({
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80',
        order: 1,
        isActive: true,
      },
    }),
    prisma.pojokInfoSlide.create({
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80',
        order: 2,
        isActive: true,
      },
    }),
    prisma.pojokInfoSlide.create({
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80',
        order: 3,
        isActive: false,
      },
    }),
  ]);

  console.log(`Seeded ${slides.length} pojok info slides`);
}

main()
  .catch((e) => {
    console.error('Error seeding pojok info slides:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
