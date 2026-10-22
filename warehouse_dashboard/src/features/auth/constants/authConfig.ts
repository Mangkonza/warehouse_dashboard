/**
 * Authentication Configuration & Test Credentials
 *
 * // SECURITY: HIGH SEVERITY FINDING (A3)
 * These mock credentials and hard-coded account whitelists are client-side values originally
 * embedded in AuthModal and authContext. In a production environment, validation MUST occur
 * server-side (e.g., via a Route Handler or backend LDAP/OAuth endpoint) with secrets stored
 * securely in environment variables (.env.local) rather than bundled into client JavaScript.
 */

// SECURITY: Whitelisted administrator account usernames
export const ADMIN_ACCOUNTS: readonly string[] = [
  'b6520503525',
  'b6400000000',
  'admin.eng',
  'admin',
  'test_admin',
];

// SECURITY: Hard-coded fallback credentials and OTP simulation
export const ADMIN_TEST_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
  otp: '111111',
} as const;

export const SESSION_STORAGE_KEYS = {
  token: 'ku_token',
  user: 'ku_user',
} as const;
