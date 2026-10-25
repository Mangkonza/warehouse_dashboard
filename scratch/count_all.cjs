const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../backend/node_modules/@prisma/client'));
const prisma = new PrismaClient();
async function count() {
  const r = await prisma.researchProject.count();
  const a = await prisma.academicDevProject.count();
  const p = await prisma.publication.count();
  const s = await prisma.academicService.count();
  const i = await prisma.intellectualProperty.count();
  const per = await prisma.personnel.count();
  const e = await prisma.evaluation.count();
  const u = await prisma.userRole.count();
  console.log('Current DB Counts:', { research: r, academic: a, publications: p, service: s, ip: i, personnel: per, evaluation: e, user_roles: u });
  await prisma.$disconnect();
}
count();
