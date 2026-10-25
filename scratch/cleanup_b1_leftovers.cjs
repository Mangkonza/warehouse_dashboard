const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning B1 leftovers...');
  const delR = await prisma.researchProject.deleteMany({ where: { id: 139 } });
  console.log('Deleted research:', delR);
  const delS = await prisma.academicService.deleteMany({ where: { id: 1237 } });
  console.log('Deleted service:', delS);
  const delP = await prisma.personnel.deleteMany({ where: { id: { in: [1236, 1237] } } });
  console.log('Deleted personnel:', delP);

  const counts = {
    research: await prisma.researchProject.count(),
    academic: await prisma.academicDevProject.count(),
    publications: await prisma.publication.count(),
    service: await prisma.academicService.count(),
    ip: await prisma.intellectualProperty.count(),
    personnel: await prisma.personnel.count(),
    evaluation: await prisma.evaluation.count(),
    user_roles: await prisma.userRole.count(),
  };
  console.log('CLEANED_BASELINE_COUNTS:', JSON.stringify(counts, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
