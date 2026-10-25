const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../backend/node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.userRole.findMany({ orderBy: { username: 'asc' } });
  console.log('User Roles in DB:');
  console.table(roles);
  await prisma.$disconnect();
}

main().catch(console.error);
