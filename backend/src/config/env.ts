import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
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

export const env = envSchema.parse(process.env);

export const adminAccounts = env.ADMIN_NONTRI_ACCOUNTS
  .split(',')
  .map((account) => account.trim().toLowerCase())
  .filter(Boolean);
