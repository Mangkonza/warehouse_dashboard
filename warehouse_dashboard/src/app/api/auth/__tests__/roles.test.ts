/**
 * Tests for GET /api/auth/roles.
 * ALL CENTRAL PORTAL CALLS IN THIS TEST ARE MOCKS (global fetch is stubbed).
 * No live Portal calls are made.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../roles/route';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_INTRANET_TOKEN,
  COOKIE_USER_SESSION,
} from '@/lib/auth/cookies';
import { createSessionToken } from '@/lib/auth/session';
import { __resetEnvStateForTests } from '@/lib/auth/env';
import { __clearRoleCacheForTests } from '@/lib/auth/roleCache';
import {
  fakeUpstreamJwt,
  stubCentralEnv,
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

type MockRoute = { status: number; body: unknown };

function mockFetch(routes: Record<string, MockRoute | (() => MockRoute)>) {
  const fn = vi.fn(async (input: string | URL | Request) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    const key = Object.keys(routes).find((k) => url.pathname.endsWith(k));
    if (!key) throw new Error(`MOCK: unexpected URL ${url.pathname}`);
    const r = routes[key];
    const { status, body } = typeof r === 'function' ? r() : r;
    return new Response(body === undefined ? 'not json' : JSON.stringify(body), { status });
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('GET /api/auth/roles', () => {
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
    stubCentralEnv(vi);
    __resetEnvStateForTests();
    __clearRoleCacheForTests();
    mockSsoToken = fakeUpstreamJwt({ exp: getNow() + 3600 });
    mockIntranetToken = fakeUpstreamJwt({ sub: 'b6510000001', exp: getNow() + 3600 });
  });

  it('returns 401 when no cookies are provided', async () => {
    const res = await GET();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ authenticated: false, roles: [] });
  });

  it('returns 401 with tampered USER_SESSION', async () => {
    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() }
    );

    const parts = session.token.split('.');
    const tampered = `${parts[0]}.${parts[1]}.tampered-signature`;

    mockCookies.set(COOKIE_USER_SESSION, tampered);
    mockCookies.set(COOKIE_ACCESS_TOKEN, mockSsoToken);
    mockCookies.set(COOKIE_INTRANET_TOKEN, mockIntranetToken);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns 401 with expired USER_SESSION', async () => {
    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() }
    );

    // Fast forward past expiration
    vi.spyOn(Date, 'now').mockReturnValue((getNow() + 36000) * 1000);

    mockCookies.set(COOKIE_USER_SESSION, session.token);
    mockCookies.set(COOKIE_ACCESS_TOKEN, mockSsoToken);
    mockCookies.set(COOKIE_INTRANET_TOKEN, mockIntranetToken);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns 401 with wrong-issuer USER_SESSION', async () => {
    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() }
    );

    // Change expected public origin
    vi.stubEnv('PUBLIC_ORIGIN', 'https://other-origin.example.test');

    mockCookies.set(COOKIE_USER_SESSION, session.token);
    mockCookies.set(COOKIE_ACCESS_TOKEN, mockSsoToken);
    mockCookies.set(COOKIE_INTRANET_TOKEN, mockIntranetToken);

    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns 401 when central verify returns active: false (MOCK)', async () => {
    mockFetch({
      '/verify.php': { status: 200, body: { active: false } },
      '/get-role': { status: 200, body: { roles: ['user'] } },
    });

    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() }
    );

    mockCookies.set(COOKIE_USER_SESSION, session.token);
    mockCookies.set(COOKIE_ACCESS_TOKEN, mockSsoToken);
    mockCookies.set(COOKIE_INTRANET_TOKEN, mockIntranetToken);

    const res = await GET();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.authenticated).toBe(false);
  });

  it('returns 200 {authenticated: true, roles} on happy path (MOCK)', async () => {
    mockFetch({
      '/verify.php': { status: 200, body: { active: true } },
      '/get-role': { status: 200, body: { roles: ['admin', 'user'] } },
    });

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
      roles: ['admin', 'user'],
    });
  });

  it('returns 500 when upstream get-role fails (MOCK)', async () => {
    mockFetch({
      '/verify.php': { status: 200, body: { active: true } },
      '/get-role': { status: 500, body: { error: 'Internal Server Error' } },
    });

    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() }
    );

    mockCookies.set(COOKIE_USER_SESSION, session.token);
    mockCookies.set(COOKIE_ACCESS_TOKEN, mockSsoToken);
    mockCookies.set(COOKIE_INTRANET_TOKEN, mockIntranetToken);

    const res = await GET();
    expect(res.status).toBe(500);
  });

  it('returns Cache-Control: no-store header on roles response', async () => {
    mockFetch({
      '/verify.php': { status: 200, body: { active: true } },
      '/get-role': { status: 200, body: { roles: ['admin'] } },
    });

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
