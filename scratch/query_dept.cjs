const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.department.findMany().then(d => {
  console.log('Departments:', d.map(x => ({ code: x.code, nameTh: x.nameTh })));
  prisma.$disconnect();
});
