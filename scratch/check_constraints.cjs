const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../backend/node_modules/@prisma/client'));
const prisma = new PrismaClient();
async function main() {
  const cons1 = await prisma.$queryRawUnsafe(`
    SELECT conname, pg_get_constraintdef(c.oid) as def
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'user_roles';
  `);
  console.log('Constraints on user_roles:', cons1);

  const cons2 = await prisma.$queryRawUnsafe(`
    SELECT conname, pg_get_constraintdef(c.oid) as def
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'role_audit_logs';
  `);
  console.log('Constraints on role_audit_logs:', cons2);
  await prisma.$disconnect();
}
main().catch(console.error);
