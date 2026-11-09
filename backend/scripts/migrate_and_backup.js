const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

process.env.DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function main() {
  const migrationPath = path.resolve(__dirname, '../prisma/migrations/20261108070000_sync_schema_fields/migration.sql');
  let migrationSql = fs.readFileSync(migrationPath, 'utf8');
  
  // Remove SQL comments
  migrationSql = migrationSql.replace(/--.*$/gm, '');

  // Split statements by semicolon
  const statements = migrationSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute.`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    try {
      await prisma.$executeRawUnsafe(stmt);
      console.log(`Statement ${i + 1} SUCCESS.`);
    } catch (err) {
      console.error(`Statement ${i + 1} FAILED:`, err.message);
    }
  }

  // Also check if personnel table has first_name, last_name
  console.log('Ensuring personnel has first_name, last_name if needed...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "personnel" 
      ADD COLUMN IF NOT EXISTS "first_name" VARCHAR(100),
      ADD COLUMN IF NOT EXISTS "last_name" VARCHAR(100);
  `);

  // Check columns in user_roles
  const userRoleCols = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'user_roles'
  `);
  console.log('user_roles columns:', userRoleCols.map(c => c.column_name));

  // Check columns in research_projects
  const researchCols = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'research_projects'
  `);
  console.log('research_projects columns (count):', researchCols.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
