const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
if (nodeEnv === 'production') {
  console.error('❌ ERROR: db:reset cannot be run in production environment!');
  process.exit(1);
}

const args = process.argv.slice(2);
const autoConfirm = args.includes('-y') || args.includes('--yes') || args.includes('--force');

async function confirmReset() {
  if (autoConfirm) return true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      '⚠️  WARNING: This will permanently DELETE the database volume and all data!\nAre you sure you want to proceed? (yes/no): ',
      (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'yes');
      }
    );
  });
}

async function run() {
  const confirmed = await confirmReset();
  if (!confirmed) {
    console.log('Reset cancelled.');
    process.exit(0);
  }

  console.log('🔄 Resetting database...');
  try {
    console.log('1. Stopping container and removing persistent volume...');
    execSync('docker compose down -v', { stdio: 'inherit', cwd: path.resolve(__dirname, '../..') });

    console.log('2. Starting fresh PostgreSQL container...');
    execSync('docker compose up -d postgres', { stdio: 'inherit', cwd: path.resolve(__dirname, '../..') });

    console.log('3. Waiting for PostgreSQL to be healthy...');
    let healthy = false;
    for (let i = 0; i < 30; i++) {
      try {
        const out = execSync('docker inspect --format="{{.State.Health.Status}}" ku_warehouse_db', {
          encoding: 'utf8',
        }).trim();
        if (out === 'healthy') {
          healthy = true;
          break;
        }
      } catch (_) {}
      execSync('node -e "setTimeout(() => {}, 1000)"');
    }

    if (!healthy) {
      console.warn('⚠️ Warning: Container did not reach healthy state in 30s, continuing anyway.');
    }

    console.log('4. Running initial migration with Prisma...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

    console.log('✅ Database reset complete!');
  } catch (err) {
    console.error('❌ Reset failed:', err.message);
    process.exit(1);
  }
}

run();
