import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding maklumat slides...');

  await prisma.maklumatSlide.deleteMany();
  console.log('Cleared existing maklumat slides');

  const slides = await Promise.all([
    prisma.maklumatSlide.create({
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80',
        order: 0,
        isActive: true,
      },
    }),
    prisma.maklumatSlide.create({
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80',
        order: 1,
        isActive: true,
      },
    }),
    prisma.maklumatSlide.create({
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80',
        order: 2,
        isActive: true,
      },
    }),
    prisma.maklumatSlide.create({
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200&q=80',
        order: 3,
        isActive: false,
      },
    }),
  ]);

  console.log(`Seeded ${slides.length} maklumat slides`);
}

main()
  .catch((e) => {
    console.error('Error seeding maklumat slides:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
