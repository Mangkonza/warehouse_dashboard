const { PrismaClient } = require('../backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
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
  console.log('BASELINE_ROW_COUNTS:', JSON.stringify(counts, null, 2));
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
