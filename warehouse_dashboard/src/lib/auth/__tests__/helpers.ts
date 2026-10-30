/**
 * Test helpers. All tokens here are FAKE fixtures generated in-test — not real Portal tokens.
 */
import { base64UrlEncode } from '../jwt';

/** Builds an UNSIGNED fake JWT-shaped string (mimics an upstream token we cannot verify). */
export function fakeUpstreamJwt(payload: Record<string, unknown>): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  return `${header}.${base64UrlEncode(JSON.stringify(payload))}.fake-signature`;
}

export const TEST_SECRET = 'test-only-secret-not-used-anywhere-real-0123456789';
export const TEST_ORIGIN = 'https://dashboard.example.test';

export function stubSessionEnv(vi: { stubEnv: (k: string, v: string) => unknown }): void {
  vi.stubEnv('JWT_COOKIE_SECRET', TEST_SECRET);
  vi.stubEnv('PUBLIC_ORIGIN', TEST_ORIGIN);
}

export function stubCentralEnv(vi: { stubEnv: (k: string, v: string) => unknown }): void {
  // MOCK endpoints — never contacted; fetch is stubbed in tests.
  vi.stubEnv('ENG_LOGIN_URL', 'https://office.eng.kps.ku.ac.th/eng-main/home');
  vi.stubEnv('ENG_LOGOUT_URL', 'https://office.eng.kps.ku.ac.th/eng-main/useraccess');
  vi.stubEnv('ENG_TOKEN_EXCHANGE_URL', 'https://portal.mock.test/exchange-token');
  vi.stubEnv('ENG_AUTH_ME_URL', 'https://portal.mock.test/me.php');
  vi.stubEnv('ALL_LOGIN_STATUS_URL', 'https://portal.mock.test/verify.php');
  vi.stubEnv('ENG_MAIN_ROLE_URL', 'https://portal.mock.test/get-role');
  vi.stubEnv('ENG_SYSTEM_ID', 'mock-system-id');
  vi.stubEnv('CENTRAL_AUTH_STRICT_TLS', 'true');
}
