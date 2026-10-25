const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.intellectualProperty.findMany({ where: { registrationNumber: { contains: '000033' } } }).then(r => {
  console.log('Existing IP:', r);
  prisma.$disconnect();
});
