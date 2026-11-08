import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/sso/logout/route';
import { checkAccess } from '../centralClient';
import { __clearRoleCacheForTests } from '../roleCache';
import { __resetEnvStateForTests } from '../env';
import { fakeUpstreamJwt, stubCentralEnv, stubSessionEnv } from './helpers';
import {
  clearAuthCookies,
  COOKIE_ACCESS_TOKEN,
  COOKIE_INTRANET_TOKEN,
  COOKIE_USER_SESSION,
  LEGACY_COOKIES,
  type CookieOptions,
} from '../cookies';

describe('clearAuthCookies (SSO logout cookies)', () => {
  it('clears USER_SESSION, ACCESS_TOKEN, INTRANET_TOKEN and legacy cookies with maxAge 0', () => {
    const deleted: Array<{ name: string; value: string; options: CookieOptions }> = [];
    const mockWriter = {
      set: (name: string, value: string, options: CookieOptions) => {
        deleted.push({ name, value, options });
      },
    };

    clearAuthCookies(mockWriter);

    const deletedNames = deleted.map((d) => d.name);

    // Expect all SSO auth cookies
    expect(deletedNames).toContain(COOKIE_USER_SESSION);
    expect(deletedNames).toContain(COOKIE_ACCESS_TOKEN);
    expect(deletedNames).toContain(COOKIE_INTRANET_TOKEN);

    // Expect all legacy cookies
    for (const legacy of LEGACY_COOKIES) {
      expect(deletedNames).toContain(legacy);
    }

    // Must NOT touch ku_session
    expect(deletedNames).not.toContain('ku_session');

    // All must be cleared with empty value and maxAge 0
    for (const entry of deleted) {
      expect(entry.value).toBe('');
      expect(entry.options.maxAge).toBe(0);
      expect(entry.options.path).toBe('/');
      expect(entry.options.httpOnly).toBe(true);
      expect(entry.options.sameSite).toBe('lax');
    }
  });
});

describe('GET /sso/logout route handler', () => {
  const nontriId = 'b6510000001';
  const ssoToken = fakeUpstreamJwt({ sub: nontriId, exp: 9999999999 });
  const intranetToken = fakeUpstreamJwt({ sub: nontriId, exp: 9999999999 });
  const userSessionToken = fakeUpstreamJwt({ sub: nontriId, exp: 9999999999 });

  beforeEach(() => {
    stubSessionEnv(vi);
    stubCentralEnv(vi);
    __resetEnvStateForTests();
    __clearRoleCacheForTests();
  });

  it('invalidates cache entry for that session, clears cookies and redirects with 307 (MOCK)', async () => {
    let fetchCount = 0;
    vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
      fetchCount++;
      const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
      if (url.pathname.endsWith('/verify.php')) {
        return new Response(JSON.stringify({ active: true }), { status: 200 });
      }
      if (url.pathname.endsWith('/get-role')) {
        return new Response(JSON.stringify(['user']), { status: 200 });
      }
      throw new Error(`MOCK: unexpected URL ${url.pathname}`);
    }));

    // 1. Prime the cache via checkAccess
    const access1 = await checkAccess({ nontriId, ssoToken, intranetToken });
    expect(access1.authenticated).toBe(true);
    expect(fetchCount).toBe(2); // 1 verify + 1 get-role

    // Cache hit: subsequent call does NOT hit network
    const access2 = await checkAccess({ nontriId, ssoToken, intranetToken });
    expect(access2.authenticated).toBe(true);
    expect(fetchCount).toBe(2); // Still 2

    // 2. Perform logout request with cookies
    const req = new NextRequest('https://dashboard.example.test/sso/logout', {
      headers: {
        cookie: `${COOKIE_USER_SESSION}=${userSessionToken}; ${COOKIE_ACCESS_TOKEN}=${ssoToken}; ${COOKIE_INTRANET_TOKEN}=${intranetToken}`,
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://office.eng.kps.ku.ac.th/eng-main/useraccess');
    expect(res.headers.get('cache-control')).toContain('no-store');

    // 3. Cache entry for that session must now be gone
    const access3 = await checkAccess({ nontriId, ssoToken, intranetToken });
    expect(access3.authenticated).toBe(true);
    expect(fetchCount).toBe(4); // New fetch calls made (2 more)
  });

  it('logout with no cookies still redirects cleanly without error (MOCK)', async () => {
    const req = new NextRequest('https://dashboard.example.test/sso/logout');
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://office.eng.kps.ku.ac.th/eng-main/useraccess');
    expect(res.headers.get('cache-control')).toContain('no-store');
  });

  it('logout with invalid or malformed cookies does not throw and redirects cleanly (MOCK)', async () => {
    const req = new NextRequest('https://dashboard.example.test/sso/logout', {
      headers: {
        cookie: `${COOKIE_USER_SESSION}=not-a-jwt; ${COOKIE_ACCESS_TOKEN}=bad; ${COOKIE_INTRANET_TOKEN}=bad`,
      },
    });
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('https://office.eng.kps.ku.ac.th/eng-main/useraccess');
  });
});
