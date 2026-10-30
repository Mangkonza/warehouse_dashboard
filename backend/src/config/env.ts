import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from backend/ and root fallback
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string({
    required_error: '❌ กรุณากำหนด DATABASE_URL ในไฟล์ .env สำหรับเชื่อมต่อฐานข้อมูล',
  }),
  DIRECT_URL: z.string().optional(),
  AUTH_SESSION_SECRET: z.string().default('ku_warehouse_auth_session_secret_2026_dev_key'),
  AUTH_SESSION_VERSION: z.coerce.number().default(1),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  AUTH_MOCK_ENABLED: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
  MOCK_TRUST_DB_ROLES: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
  MOCK_SUPER_ADMIN_B0123456789_PASSWORD: z.string().optional(),
  MOCK_SUPER_ADMIN_B0123456789_OTP: z.string().optional(),
  MOCK_SUPER_ADMIN_B6520503525_PASSWORD: z.string().optional(),
  MOCK_SUPER_ADMIN_B6520503525_OTP: z.string().optional(),
  JWT_SECRET: z.string().default('ku_warehouse_jwt_super_secret_key_2026'),
  ADMIN_NONTRI_ACCOUNTS: z.string().default(''),
  KU_AUTH_ENDPOINT: z.string().default('https://alllogin.ku.ac.th/realms/KU-Alllogin/protocol/openid-connect/auth'),
  KU_TOKEN_ENDPOINT: z.string().default('https://alllogin.ku.ac.th/realms/KU-Alllogin/protocol/openid-connect/token'),
  KU_USERINFO_ENDPOINT: z.string().default('https://alllogin.ku.ac.th/realms/KU-Alllogin/protocol/openid-connect/userinfo'),
  KU_LOGOUT_ENDPOINT: z.string().default('https://alllogin.ku.ac.th/realms/KU-Alllogin/protocol/openid-connect/logout'),
  KU_CLIENT_ID: z.string().default('mock_ku_client_id'),
  KU_CLIENT_SECRET: z.string().default('mock_ku_client_secret'),
  KU_REDIRECT_URI: z.string().default('http://localhost:3000/auth/callback'),
  KU_SCOPE: z.string().default('basic openid staff'),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error('❌ ข้อผิดพลาดในการตรวจสอบตัวแปรสภาพแวดล้อม (.env):');
  parsedEnv.error.issues.forEach((issue) => {
    console.error(`  - [${issue.path.join('.')}] ${issue.message}`);
  });
  process.exit(1);
}

// Security assertion: E0.3 check AUTH_SESSION_SECRET strength
const secretVal = parsedEnv.data.AUTH_SESSION_SECRET;
const isWeakSecret =
  !secretVal ||
  secretVal.length < 32 ||
  secretVal === 'ku_warehouse_auth_session_secret_2026_dev_key' ||
  secretVal === 'change_this_to_a_random_32_character_secret_key';

if (parsedEnv.data.NODE_ENV === 'production') {
  if (isWeakSecret) {
    console.error('❌ FATAL: ในโหมด production จำเป็นต้องตั้งค่า AUTH_SESSION_SECRET ที่มีความยาวอย่างน้อย 32 ตัวอักษรและเดายากใน .env');
    process.exit(1);
  }
} else {
  if (isWeakSecret) {
    console.warn('⚠️ WARNING [Security]: AUTH_SESSION_SECRET สั้นกว่า 32 ตัวอักษรหรือเป็นค่าเริ่มต้น (ควรตั้งค่าคีย์ที่ปลอดภัยก่อนขึ้น Production)');
  }
}

// Log warning if mock auth is enabled
if (parsedEnv.data.AUTH_MOCK_ENABLED) {
  if (parsedEnv.data.NODE_ENV === 'production') {
    console.error('❌ FATAL: ไม่อนุญาตให้เปิด AUTH_MOCK_ENABLED ในโหมด production');
    process.exit(1);
  }
  console.warn('⚠️ WARNING [Security]: กำลังทำงานในโหมดทดสอบ AUTH_MOCK_ENABLED=true (ห้ามใช้บน Production)');
  if (parsedEnv.data.MOCK_TRUST_DB_ROLES) {
    console.warn('⚠️ WARNING [Security]: MOCK_TRUST_DB_ROLES=true เปิดใช้งานอยู่ (ใช้สำหรับเดโมในเครือข่ายปิดเท่านั้น)');
  }
}

export const env = parsedEnv.data;

export const adminAccounts = env.ADMIN_NONTRI_ACCOUNTS
  .split(',')
  .map((account) => account.trim().toLowerCase())
  .filter(Boolean);

export const corsOrigins = env.CORS_ORIGIN
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
