const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.evaluation.deleteMany({ where: { id: { in: [47, 48] } } }).then(r => {
  console.log('Cleaned evaluations:', r);
  prisma.$disconnect();
});
