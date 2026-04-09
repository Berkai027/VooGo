const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Example search log entries
  await prisma.searchLog.createMany({
    data: [
      { origin: 'GRU', destination: 'LIS', city: 'Lisboa' },
      { origin: 'GRU', destination: 'MAD', city: 'Madrid' },
      { origin: 'GRU', destination: 'MIA', city: 'Miami' },
    ],
  });

  console.log('✅ Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
