import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  // Add seed data. Example:
  // await prisma.user.upsert({
  //   where: { email: 'test@example.com' },
  //   update: {},
  //   create: { email: 'test@example.com', name: 'Test User', password: 'hashed' },
  // });
  console.log('Seed complete.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
