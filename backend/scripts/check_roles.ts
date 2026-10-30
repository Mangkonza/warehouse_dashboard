import { prisma } from '../src/db/prisma.js';

async function main() {
  const roles = await prisma.userRole.findMany();
  console.log('Current user_roles in DB:', roles);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
