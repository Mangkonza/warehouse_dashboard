const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.personnel.findMany({ select: { id: true, nameTh: true, createdAt: true }, orderBy: { id: 'desc' }, take: 5 });
  console.log('Last personnel:', p);
  await prisma.$disconnect();
}

main().catch(console.error);
