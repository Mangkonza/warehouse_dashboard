/**
 * Guard tests.
 * ALL CENTRAL PORTAL CALLS IN THIS TEST ARE MOCKS (global fetch is stubbed).
 * No live Portal calls are made.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireAuth, type CookieReader } from '../guard';
import { createSessionToken } from '../session';
import { __clearRoleCacheForTests } from '../roleCache';
import { __resetEnvStateForTests } from '../env';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_INTRANET_TOKEN,
  COOKIE_USER_SESSION,
} from '../cookies';
import type { SessionUser } from '../profile';
import {
  fakeUpstreamJwt,
  stubCentralEnv,
  stubSessionEnv,
} from './helpers';

type MockRoute = { status: number; body: unknown };

function mockCentralFetch(routes: Record<string, MockRoute | (() => MockRoute)>) {
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

function makeCookieStore(cookies: Record<string, string>): CookieReader {
  return {
    get: (name: string) => (cookies[name] !== undefined ? { value: cookies[name] } : undefined),
  };
}

const mockUser: SessionUser = {
  nontriId: 'fengtest',
  firstName: 'Somchai',
  lastName: 'Jaidee',
  name: 'สมชาย ใจดี',
  email: 'somchai.j@ku.th',
  faculty: 'Engineering',
};

describe('requireAuth guard (MOCK portal calls)', () => {
  const getNow = () => Math.floor(Date.now() / 1000);
  let mockSsoToken: string;
  let mockIntranetToken: string;

  beforeEach(() => {
    stubSessionEnv(vi);
    stubCentralEnv(vi);
    __resetEnvStateForTests();
    __clearRoleCacheForTests();
    mockSsoToken = fakeUpstreamJwt({ exp: getNow() + 3600 });
    mockIntranetToken = fakeUpstreamJwt({ sub: 'fengtest', exp: getNow() + 3600 });
  });

  it('returns status "ok" with user and roles on successful verification (MOCK)', async () => {
    mockCentralFetch({
      '/verify.php': { status: 200, body: { active: true } },
      '/get-role': { status: 200, body: { roles: ['admin', 'user'] } },
    });

    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() },
    );

    const cookies = makeCookieStore({
      [COOKIE_USER_SESSION]: session.token,
      [COOKIE_ACCESS_TOKEN]: mockSsoToken,
      [COOKIE_INTRANET_TOKEN]: mockIntranetToken,
    });

    const result = await requireAuth(cookies);

    expect(result).toEqual({
      status: 'ok',
      roles: ['admin', 'user'],
      user: mockUser,
    });
  });

  it('returns status "unauthenticated" when verify.php indicates inactive (MOCK)', async () => {
    mockCentralFetch({
      '/verify.php': { status: 200, body: { active: false } },
      '/get-role': { status: 200, body: { roles: ['admin'] } },
    });

    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() },
    );

    const cookies = makeCookieStore({
      [COOKIE_USER_SESSION]: session.token,
      [COOKIE_ACCESS_TOKEN]: mockSsoToken,
      [COOKIE_INTRANET_TOKEN]: mockIntranetToken,
    });

    const result = await requireAuth(cookies);
    expect(result).toEqual({ status: 'unauthenticated' });
  });

  it('returns status "unauthenticated" when any required cookie is missing', async () => {
    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() },
    );

    // Missing ACCESS_TOKEN
    expect(
      await requireAuth(
        makeCookieStore({
          [COOKIE_USER_SESSION]: session.token,
          [COOKIE_INTRANET_TOKEN]: mockIntranetToken,
        }),
      ),
    ).toEqual({ status: 'unauthenticated' });

    // Missing INTRANET_TOKEN
    expect(
      await requireAuth(
        makeCookieStore({
          [COOKIE_USER_SESSION]: session.token,
          [COOKIE_ACCESS_TOKEN]: mockSsoToken,
        }),
      ),
    ).toEqual({ status: 'unauthenticated' });

    // Missing USER_SESSION
    expect(
      await requireAuth(
        makeCookieStore({
          [COOKIE_ACCESS_TOKEN]: mockSsoToken,
          [COOKIE_INTRANET_TOKEN]: mockIntranetToken,
        }),
      ),
    ).toEqual({ status: 'unauthenticated' });
  });

  it('returns status "unauthenticated" for tampered session JWT', async () => {
    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() },
    );

    const parts = session.token.split('.');
    const tampered = `${parts[0]}.${parts[1]}.bad-sig`;

    const cookies = makeCookieStore({
      [COOKIE_USER_SESSION]: tampered,
      [COOKIE_ACCESS_TOKEN]: mockSsoToken,
      [COOKIE_INTRANET_TOKEN]: mockIntranetToken,
    });

    const result = await requireAuth(cookies);
    expect(result).toEqual({ status: 'unauthenticated' });
  });

  it('returns status "unauthenticated" for expired session', async () => {
    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() },
    );

    // Stub time forward by 10 hours (past max session age)
    vi.spyOn(Date, 'now').mockReturnValue((getNow() + 36000) * 1000);

    const cookies = makeCookieStore({
      [COOKIE_USER_SESSION]: session.token,
      [COOKIE_ACCESS_TOKEN]: mockSsoToken,
      [COOKIE_INTRANET_TOKEN]: mockIntranetToken,
    });

    const result = await requireAuth(cookies);
    expect(result).toEqual({ status: 'unauthenticated' });
  });

  it('returns status "unauthenticated" when tokens do not match token binding hash', async () => {
    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() },
    );

    const otherSsoToken = fakeUpstreamJwt({ exp: getNow() + 3600, jti: 'other' });

    const cookies = makeCookieStore({
      [COOKIE_USER_SESSION]: session.token,
      [COOKIE_ACCESS_TOKEN]: otherSsoToken,
      [COOKIE_INTRANET_TOKEN]: mockIntranetToken,
    });

    const result = await requireAuth(cookies);
    expect(result).toEqual({ status: 'unauthenticated' });
  });

  it('returns status "error" on upstream 500 error or network failure (MOCK)', async () => {
    mockCentralFetch({
      '/verify.php': { status: 500, body: { error: 'Internal Error' } },
      '/get-role': { status: 200, body: { roles: ['admin'] } },
    });

    const session = await createSessionToken(
      mockUser,
      { ssoToken: mockSsoToken, intranetToken: mockIntranetToken },
      { nowSeconds: getNow() },
    );

    const cookies = makeCookieStore({
      [COOKIE_USER_SESSION]: session.token,
      [COOKIE_ACCESS_TOKEN]: mockSsoToken,
      [COOKIE_INTRANET_TOKEN]: mockIntranetToken,
    });

    const result = await requireAuth(cookies);
    expect(result).toEqual({ status: 'error' });
  });
});
