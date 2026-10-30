const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const backupDir = path.resolve(__dirname, '../../backups');
const args = process.argv.slice(2);
let targetFile = args[0];

if (!targetFile) {
  // Pick the latest backup file in backups/
  if (!fs.existsSync(backupDir)) {
    console.error('❌ No backups directory found at:', backupDir);
    process.exit(1);
  }
  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('❌ No .sql backup files found in:', backupDir);
    process.exit(1);
  }
  targetFile = path.join(backupDir, files[0]);
  console.log(`ℹ️  No backup file specified. Using most recent: ${files[0]}`);
} else if (!path.isAbsolute(targetFile)) {
  targetFile = path.resolve(process.cwd(), targetFile);
}

if (!fs.existsSync(targetFile)) {
  console.error(`❌ Backup file does not exist: ${targetFile}`);
  process.exit(1);
}

const dbUser = process.env.POSTGRES_USER || 'ku_owner';
const dbName = process.env.POSTGRES_DB || 'ku_warehouse';

console.log(`🔄 Restoring database [${dbName}] from: ${targetFile}...`);
try {
  const content = fs.readFileSync(targetFile, 'utf8');
  execSync(`docker exec -i ku_warehouse_db psql -U ${dbUser} -d ${dbName}`, {
    input: content,
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  console.log('✅ Database restore complete!');
} catch (err) {
  console.error('❌ Restore failed:', err.message);
  process.exit(1);
}
