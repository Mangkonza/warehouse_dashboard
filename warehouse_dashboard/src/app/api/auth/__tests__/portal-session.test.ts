/**
 * Tests for GET/POST /api/auth/portal-session.
 * ALL CENTRAL PORTAL CALLS IN THIS TEST ARE MOCKS (global fetch is stubbed).
 * No live Portal calls are made.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../portal-session/route';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_INTRANET_TOKEN,
  COOKIE_USER_SESSION,
} from '@/lib/auth/cookies';
import { __resetEnvStateForTests } from '@/lib/auth/env';
import { __clearRoleCacheForTests } from '@/lib/auth/roleCache';
import {
  fakeUpstreamJwt,
  stubCentralEnv,
  stubSessionEnv,
} from '@/lib/auth/__tests__/helpers';

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

describe('/api/auth/portal-session', () => {
  const NOW = Math.floor(Date.now() / 1000);
  const mockSsoToken = fakeUpstreamJwt({ exp: NOW + 3600 });
  const mockIntranetToken = fakeUpstreamJwt({ sub: 'b6510000001', exp: NOW + 3600 });

  beforeEach(() => {
    stubSessionEnv(vi);
    stubCentralEnv(vi);
    __resetEnvStateForTests();
    __clearRoleCacheForTests();
  });

  // ---------------------------------------------------------------------------
  // GET success & next redirect
  // ---------------------------------------------------------------------------
  it('GET success: returns 307 redirect, Location equals validated next without tokens, sets 3 HttpOnly cookies (MOCK)', async () => {
    mockFetch({
      '/exchange-token': { status: 200, body: { status: 'success', ssoToken: mockSsoToken } },
      '/me.php': {
        status: 200,
        body: {
          profile: {
            uid: 'b6510000001',
            'first-name': 'Nontri',
            'last-name': 'Ku',
            'google-mail': 'nontri.k@ku.th',
          },
        },
      },
    });

    const req = new NextRequest(
      'http://localhost:3000/api/auth/portal-session?exchangeToken=MOCK_EX&intranetToken=' +
        encodeURIComponent(mockIntranetToken) +
        '&next=/admin'
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('cache-control')).toContain('no-store');
    const location = res.headers.get('location');
    expect(location).toBeTruthy();
    const locUrl = new URL(location!, 'http://localhost:3000');
    expect(locUrl.pathname).toBe('/admin');
    expect(locUrl.searchParams.has('exchangeToken')).toBe(false);
    expect(locUrl.searchParams.has('intranetToken')).toBe(false);
    expect(locUrl.searchParams.has('accessToken')).toBe(false);

    // Check Set-Cookie attributes
    const sessionCookie = res.cookies.get(COOKIE_USER_SESSION);
    const ssoCookie = res.cookies.get(COOKIE_ACCESS_TOKEN);
    const intranetCookie = res.cookies.get(COOKIE_INTRANET_TOKEN);

    expect(sessionCookie).toBeTruthy();
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(sessionCookie?.sameSite).toBe('lax');

    expect(ssoCookie).toBeTruthy();
    expect(ssoCookie?.httpOnly).toBe(true);
    expect(ssoCookie?.sameSite).toBe('lax');

    expect(intranetCookie).toBeTruthy();
    expect(intranetCookie?.httpOnly).toBe(true);
    expect(intranetCookie?.sameSite).toBe('lax');
  });

  it('GET success: cookies have Secure=true in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    mockFetch({
      '/exchange-token': { status: 200, body: { status: 'success', ssoToken: mockSsoToken } },
      '/me.php': {
        status: 200,
        body: { profile: { uid: 'b6510000001', 'first-name': 'Test' } },
      },
    });

    const req = new NextRequest(
      'https://dashboard.example.test/api/auth/portal-session?exchangeToken=MOCK_EX&intranetToken=' +
        encodeURIComponent(mockIntranetToken) +
        '&next=/user'
    );

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.cookies.get(COOKIE_USER_SESSION)?.secure).toBe(true);
    expect(res.cookies.get(COOKIE_ACCESS_TOKEN)?.secure).toBe(true);
    expect(res.cookies.get(COOKIE_INTRANET_TOKEN)?.secure).toBe(true);
  });

  it('GET with spoofed Host / X-Forwarded-Host: Location uses configured public origin, not evil.com (MOCK)', async () => {
    mockFetch({
      '/exchange-token': { status: 200, body: { status: 'success', ssoToken: mockSsoToken } },
      '/me.php': {
        status: 200,
        body: { profile: { uid: 'b6510000001', 'first-name': 'Test' } },
      },
    });

    const req = new NextRequest(
      'http://evil.com/api/auth/portal-session?exchangeToken=MOCK_EX&intranetToken=' +
        encodeURIComponent(mockIntranetToken) +
        '&next=/admin',
      {
        headers: {
          host: 'evil.com',
          'x-forwarded-host': 'evil.com',
        },
      }
    );

    const res = await GET(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toBe('https://dashboard.example.test/admin');
    expect(location).not.toContain('evil.com');
  });

  // ---------------------------------------------------------------------------
  // GET next attack vectors
  // ---------------------------------------------------------------------------
  it.each([
    '//evil.com',
    'https://evil.com/phishing',
    '/\\evil.com',
    '/%2F%2Fevil.com',
  ])('GET next attack %j falls back to safe path', async (attackNext) => {
    mockFetch({
      '/exchange-token': { status: 200, body: { status: 'success', ssoToken: mockSsoToken } },
      '/me.php': {
        status: 200,
        body: { profile: { uid: 'b6510000001', 'first-name': 'Test' } },
      },
    });

    const req = new NextRequest(
      'http://localhost:3000/api/auth/portal-session?exchangeToken=MOCK_EX&intranetToken=' +
        encodeURIComponent(mockIntranetToken) +
        '&next=' +
        encodeURIComponent(attackNext)
    );

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('cache-control')).toContain('no-store');
    const location = res.headers.get('location');
    expect(location).toBeTruthy();
    expect(location).not.toContain('evil.com');
    const locUrl = new URL(location!, 'http://localhost:3000');
    expect(locUrl.pathname).toBe('/');
  });

  // ---------------------------------------------------------------------------
  // POST success
  // ---------------------------------------------------------------------------
  it('POST success: 200 {session, user}, no roles, no raw tokens in body, sets cookies (MOCK)', async () => {
    mockFetch({
      '/exchange-token': { status: 200, body: { status: 'success', ssoToken: mockSsoToken } },
      '/me.php': {
        status: 200,
        body: {
          profile: {
            uid: 'b6510000001',
            'first-name': 'Kasetsart',
            'last-name': 'Student',
            'google-mail': 'ku.student@ku.th',
          },
        },
      },
    });

    const req = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({
        exchangeToken: 'MOCK_EX',
        intranetToken: mockIntranetToken,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.session).toBeTruthy();
    expect(body.user).toEqual({
      nontriId: 'b6510000001',
      firstName: 'Kasetsart',
      lastName: 'Student',
      name: 'Kasetsart Student',
      email: 'ku.student@ku.th',
      faculty: null,
    });
    // Must NOT return roles in user or root
    expect(body.roles).toBeUndefined();
    expect(body.user.roles).toBeUndefined();
    // Must NOT leak raw tokens in body
    expect(body.ssoToken).toBeUndefined();
    expect(body.exchangeToken).toBeUndefined();
    expect(body.intranetToken).toBeUndefined();

    // Check Set-Cookie
    expect(res.cookies.get(COOKIE_USER_SESSION)).toBeTruthy();
    expect(res.cookies.get(COOKIE_ACCESS_TOKEN)).toBeTruthy();
    expect(res.cookies.get(COOKIE_INTRANET_TOKEN)).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // Missing tokens (400)
  // ---------------------------------------------------------------------------
  it('returns 400 when exchangeToken is missing in GET and POST', async () => {
    const getReq = new NextRequest(
      'http://localhost:3000/api/auth/portal-session?intranetToken=MOCK_IN'
    );
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(400);

    const postReq = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({ intranetToken: 'MOCK_IN' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(400);
  });

  it('returns 400 when intranetToken is missing in GET and POST', async () => {
    const getReq = new NextRequest(
      'http://localhost:3000/api/auth/portal-session?exchangeToken=MOCK_EX'
    );
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(400);

    const postReq = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({ exchangeToken: 'MOCK_EX' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(400);
  });

  // ---------------------------------------------------------------------------
  // accessToken in production vs development (403 vs 200)
  // ---------------------------------------------------------------------------
  it('returns 403 when accessToken is sent in production even with exchangeToken', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const req = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({
        accessToken: mockSsoToken,
        exchangeToken: 'MOCK_EX',
        intranetToken: mockIntranetToken,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('allows direct accessToken flow outside production (MOCK)', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    mockFetch({
      '/me.php': {
        status: 200,
        body: { profile: { uid: 'b6510000001', 'first-name': 'Dev' } },
      },
    });

    const req = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({
        accessToken: mockSsoToken,
        intranetToken: mockIntranetToken,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.nontriId).toBe('b6510000001');
  });

  // ---------------------------------------------------------------------------
  // Exchange errors
  // ---------------------------------------------------------------------------
  it('returns upstream status when exchangeToken call fails with non-2xx (MOCK)', async () => {
    mockFetch({
      '/exchange-token': { status: 401, body: { error: 'Invalid exchange code' } },
    });

    const req = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({
        exchangeToken: 'EXPIRED_CODE',
        intranetToken: mockIntranetToken,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns error status 502 when exchange is 200 but status!=="success" or empty ssoToken (MOCK)', async () => {
    mockFetch({
      '/exchange-token': { status: 200, body: { status: 'failed', message: 'used code' } },
    });

    const req = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({ exchangeToken: 'CODE', intranetToken: mockIntranetToken }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(502);
  });

  // ---------------------------------------------------------------------------
  // me errors and network error handling
  // ---------------------------------------------------------------------------
  it('returns 502 when me response has neither profile nor user (MOCK)', async () => {
    mockFetch({
      '/exchange-token': { status: 200, body: { status: 'success', ssoToken: mockSsoToken } },
      '/me.php': { status: 200, body: { success: true } },
    });

    const req = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({ exchangeToken: 'CODE', intranetToken: mockIntranetToken }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(502);
  });

  it('returns 500 with generic message on thrown network error and does NOT leak token strings (MOCK)', async () => {
    const sensitiveExchangeToken = 'SECRET_EXCHANGE_CODE_12345';
    const sensitiveIntranetToken = 'SECRET_INTRANET_TOKEN_67890';

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('Network Connection Failed');
      })
    );

    const req = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({
        exchangeToken: sensitiveExchangeToken,
        intranetToken: sensitiveIntranetToken,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const text = await res.text();
    expect(text).not.toContain(sensitiveExchangeToken);
    expect(text).not.toContain(sensitiveIntranetToken);
  });

  // ---------------------------------------------------------------------------
  // uid vs intranet sub mismatch
  // ---------------------------------------------------------------------------
  it('rejects login when user.uid and intranet sub mismatch (MOCK)', async () => {
    const mismatchedIntranet = fakeUpstreamJwt({ sub: 'user_different', exp: NOW + 3600 });
    mockFetch({
      '/exchange-token': { status: 200, body: { status: 'success', ssoToken: mockSsoToken } },
      '/me.php': {
        status: 200,
        body: { profile: { uid: 'user_original', 'first-name': 'Test' } },
      },
    });

    const req = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({
        exchangeToken: 'CODE',
        intranetToken: mismatchedIntranet,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(502);
  });

  // ---------------------------------------------------------------------------
  // Cache-Control: no-store
  // ---------------------------------------------------------------------------
  it('returns Cache-Control: no-store header on portal-session response', async () => {
    mockFetch({
      '/exchange-token': { status: 200, body: { status: 'success', ssoToken: mockSsoToken } },
      '/me.php': {
        status: 200,
        body: { profile: { uid: 'b6510000001', 'first-name': 'Test' } },
      },
    });

    const req = new NextRequest('http://localhost:3000/api/auth/portal-session', {
      method: 'POST',
      body: JSON.stringify({ exchangeToken: 'CODE', intranetToken: mockIntranetToken }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.headers.get('cache-control')).toContain('no-store');
  });
});
