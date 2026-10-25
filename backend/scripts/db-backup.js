const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const backupDir = path.resolve(__dirname, '../../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const now = new Date();
const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
const filename = `ku_warehouse_backup_${timestamp}.sql`;
const filepath = path.join(backupDir, filename);

const dbUser = process.env.POSTGRES_USER || 'ku_owner';
const dbName = process.env.POSTGRES_DB || 'ku_warehouse';

console.log(`📦 Starting database backup of [${dbName}]...`);
try {
  // Using docker exec pg_dump
  const cmd = `docker exec ku_warehouse_db pg_dump -U ${dbUser} -d ${dbName} --clean --if-exists`;
  const dump = execSync(cmd, { maxBuffer: 100 * 1024 * 1024 });
  fs.writeFileSync(filepath, dump);

  const stats = fs.statSync(filepath);
  console.log(`✅ Backup successfully created!`);
  console.log(`   File: ${filepath}`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (err) {
  console.error('❌ Backup failed:', err.message);
  process.exit(1);
}
