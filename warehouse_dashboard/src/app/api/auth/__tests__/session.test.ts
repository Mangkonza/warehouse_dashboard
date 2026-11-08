/**
 * Tests for GET /api/auth/session.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../session/route';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_INTRANET_TOKEN,
  COOKIE_USER_SESSION,
} from '@/lib/auth/cookies';
import { createSessionToken } from '@/lib/auth/session';
import { __resetEnvStateForTests } from '@/lib/auth/env';
import {
  fakeUpstreamJwt,
  stubSessionEnv,
} from '@/lib/auth/__tests__/helpers';

const mockCookies = new Map<string, string>();

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) => {
      const val = mockCookies.get(name);
      return val !== undefined ? { name, value: val } : undefined;
    },
    getAll: () => Array.from(mockCookies.entries()).map(([name, value]) => ({ name, value })),
    has: (name: string) => mockCookies.has(name),
    set: (name: string, value: string) => mockCookies.set(name, value),
    delete: (name: string) => mockCookies.delete(name),
  })),
}));

describe('GET /api/auth/session', () => {
  const getNow = () => Math.floor(Date.now() / 1000);
  let mockSsoToken: string;
  let mockIntranetToken: string;

  const mockUser = {
    nontriId: 'b6510000001',
    firstName: 'Somchai',
    lastName: 'Jaidee',
    name: 'Somchai Jaidee',
    email: 'somchai@ku.th',
    faculty: 'Engineering',
  };

  beforeEach(() => {
    mockCookies.clear();
    stubSessionEnv(vi);
    __resetEnvStateForTests();
    mockSsoToken = fakeUpstreamJwt({ exp: getNow() + 3600 });
    mockIntranetToken = fakeUpstreamJwt({ sub: 'b6510000001', exp: getNow() + 3600 });
  });

  it('returns 401 when no cookie is present', async () => {
    const res = await GET();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ authenticated: false });
  });

  it('returns 401 with tampered or invalid cookie', async () => {
    mockCookies.set(COOKIE_USER_SESSION, 'invalid.tampered.token');
    mockCookies.set(COOKIE_ACCESS_TOKEN, mockSsoToken);
    mockCookies.set(COOKIE_INTRANET_TOKEN, mockIntranetToken);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns 200 with user profile and contains no token strings in body', async () => {
    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() }
    );

    mockCookies.set(COOKIE_USER_SESSION, session.token);
    mockCookies.set(COOKIE_ACCESS_TOKEN, mockSsoToken);
    mockCookies.set(COOKIE_INTRANET_TOKEN, mockIntranetToken);

    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({
      authenticated: true,
      user: mockUser,
    });

    const bodyStr = JSON.stringify(body);
    expect(bodyStr).not.toContain(mockSsoToken);
    expect(bodyStr).not.toContain(mockIntranetToken);
    expect(bodyStr).not.toContain(session.token);
  });

  it('returns Cache-Control: no-store header on session response', async () => {
    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() }
    );

    mockCookies.set(COOKIE_USER_SESSION, session.token);
    mockCookies.set(COOKIE_ACCESS_TOKEN, mockSsoToken);
    mockCookies.set(COOKIE_INTRANET_TOKEN, mockIntranetToken);

    const res = await GET();
    expect(res.headers.get('cache-control')).toContain('no-store');
  });
});
