const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.intellectualProperty.deleteMany({ where: { id: 71 } }).then(r => {
  console.log('Deleted id 71:', r);
  prisma.$disconnect();
});
