const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load backend/.env
const envPath = path.resolve(__dirname, '../.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const directUrl = envConfig.DIRECT_URL || envConfig.DATABASE_URL;

console.log('Connecting with owner URL for migration...');
const { PrismaClient } = require(path.resolve(__dirname, '../node_modules/@prisma/client'));
const prisma = new PrismaClient({
  datasources: {
    db: { url: directUrl },
  },
});

async function runMigration() {
  console.log('Running A2 Migration: 2-tier role system...');

  const sqlPath = path.resolve(__dirname, '../prisma/migrations/20261025141000_two_tier_roles/migration.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Strip comments, then split by semicolon
  const cleanSql = sql.replace(/--.*$/gm, '');
  const statements = cleanSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    console.log('Executing:', statement.substring(0, 70).replace(/\s+/g, ' ') + '...');
    await prisma.$executeRawUnsafe(statement);
  }

  // Grant privileges to ku_app on user_roles if needed
  await prisma.$executeRawUnsafe(`GRANT ALL ON TABLE user_roles TO ku_app;`);
  await prisma.$executeRawUnsafe(`GRANT ALL ON TABLE role_audit_logs TO ku_app;`);

  console.log('\nMigration executed successfully!');

  // Verify user_roles
  const updatedRoles = await prisma.userRole.findMany({ orderBy: { username: 'asc' } });
  console.log('\nUpdated user_roles:');
  console.table(updatedRoles);

  // Verify audit logs
  const latestAudit = await prisma.roleAuditLog.findMany({
    take: 5,
    orderBy: { id: 'desc' },
  });
  console.log('\nLatest role_audit_logs:');
  console.table(
    latestAudit.map((a) => ({
      id: a.id.toString(),
      actor: a.actorUsername,
      action: a.action,
      target: a.targetUsername,
      oldRole: a.oldRole,
      newRole: a.newRole,
      createdAt: a.createdAt,
    }))
  );

  await prisma.$disconnect();
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
