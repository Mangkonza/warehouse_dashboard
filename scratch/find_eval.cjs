const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.evaluation.findMany({ orderBy: { id: 'desc' }, take: 4 }).then(r => {
  console.log('Last evaluations:', r);
  prisma.$disconnect();
});
