const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const d25 = await prisma.academicDevProject.findUnique({ where: { id: 25 } });
  console.log('DB ID 25:', d25);
}
run().finally(() => prisma.$disconnect());
