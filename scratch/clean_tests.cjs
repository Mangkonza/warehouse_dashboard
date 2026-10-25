const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../backend/node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function clean() {
  await prisma.researchProjectMember.deleteMany({ where: { project: { name: { contains: 'TEST' } } } });
  await prisma.researchProjectDepartment.deleteMany({ where: { project: { name: { contains: 'TEST' } } } });
  const r = await prisma.researchProject.deleteMany({ where: { name: { contains: 'TEST' } } });
  const a = await prisma.academicDevProject.deleteMany({ where: { name: { contains: 'TEST' } } });
  await prisma.publicationAuthor.deleteMany({ where: { publication: { title: { contains: 'TEST' } } } });
  const p = await prisma.publication.deleteMany({ where: { title: { contains: 'TEST' } } });
  const s = await prisma.academicService.deleteMany({ where: { name: { contains: 'TEST' } } });
  const ip = await prisma.intellectualProperty.deleteMany({ where: { title: { contains: 'TEST' } } });
  const per = await prisma.personnel.deleteMany({ where: { email: { contains: 'test.auto' } } });
  console.log('Cleaned test items:', { research: r.count, academic: a.count, pub: p.count, service: s.count, ip: ip.count, personnel: per.count });
  await prisma.$disconnect();
}

clean().catch(console.error);
