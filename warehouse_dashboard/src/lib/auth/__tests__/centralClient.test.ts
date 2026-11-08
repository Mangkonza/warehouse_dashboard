/**
 * centralClient tests — ALL PORTAL CALLS ARE MOCKS (global fetch is stubbed).
 * These tests verify our handling of assumed response shapes only; they do NOT
 * prove anything about the real Portal / ALL LOGIN / Intranet behaviour.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkAccess, CentralAuthError, exchangeToken, fetchCentralUser, fetchRoles, verifyLoginStatus } from '../centralClient';
import { __clearRoleCacheForTests } from '../roleCache';
import { __resetEnvStateForTests } from '../env';
import { stubCentralEnv } from './helpers';

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

beforeEach(() => {
  stubCentralEnv(vi);
  __resetEnvStateForTests();
  __clearRoleCacheForTests();
});

describe('exchangeToken (MOCK Portal)', () => {
  it('succeeds only with 2xx + status=success + non-empty ssoToken', async () => {
    const fetchFn = mockFetch({ '/exchange-token': { status: 200, body: { status: 'success', ssoToken: 'MOCK-SSO' } } });
    expect(await exchangeToken('MOCK-CODE')).toEqual({ ok: true, ssoToken: 'MOCK-SSO' });
    const [, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ exchangeToken: 'MOCK-CODE' });
  });

  it('checks the body even when HTTP is 200 → 502', async () => {
    mockFetch({ '/exchange-token': { status: 200, body: { status: 'error', message: 'used' } } });
    expect(await exchangeToken('MOCK-CODE')).toEqual({ ok: false, httpStatus: 502 });
    mockFetch({ '/exchange-token': { status: 200, body: { status: 'success', ssoToken: '' } } });
    expect(await exchangeToken('MOCK-CODE')).toEqual({ ok: false, httpStatus: 502 });
  });

  it('propagates upstream error status', async () => {
    mockFetch({ '/exchange-token': { status: 401, body: { status: 'error' } } });
    expect(await exchangeToken('MOCK-CODE')).toEqual({ ok: false, httpStatus: 401 });
  });

  it('wraps network errors without leaking the token', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('ECONNRESET'); }));
    const err = await exchangeToken('MOCK-CODE-SENSITIVE').catch((e) => e);
    expect(err).toBeInstanceOf(CentralAuthError);
    expect(String(err.message)).not.toContain('MOCK-CODE-SENSITIVE');
  });
});

describe('fetchCentralUser (MOCK me)', () => {
  it('returns profile or user and sends the SSO bearer', async () => {
    const fetchFn = mockFetch({ '/me.php': { status: 200, body: { profile: { uid: 'fengabc' } } } });
    expect(await fetchCentralUser('MOCK-SSO')).toEqual({ ok: true, user: { uid: 'fengabc' } });
    const [, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer MOCK-SSO');
    mockFetch({ '/me.php': { status: 200, body: { user: { uid: 'x' } } } });
    expect(await fetchCentralUser('MOCK-SSO')).toMatchObject({ ok: true });
  });
  it('502 on invalid data, upstream status on non-2xx', async () => {
    mockFetch({ '/me.php': { status: 200, body: { ok: true } } });
    expect(await fetchCentralUser('MOCK-SSO')).toEqual({ ok: false, httpStatus: 502 });
    mockFetch({ '/me.php': { status: 401, body: {} } });
    expect(await fetchCentralUser('MOCK-SSO')).toEqual({ ok: false, httpStatus: 401 });
  });
});

describe('verifyLoginStatus (MOCK verify)', () => {
  it.each([
    [{ active: true }, true],
    [{ authenticated: true }, true],
    [{ active: 'true' }, false],
    [{ authenticated: 1 }, false],
    [{ active: false }, false],
    [{}, false],
  ])('%j → %s', async (body, expected) => {
    mockFetch({ '/verify.php': { status: 200, body } });
    expect(await verifyLoginStatus('MOCK-SSO')).toBe(expected);
  });
  it('throws on non-2xx', async () => {
    mockFetch({ '/verify.php': { status: 500, body: {} } });
    await expect(verifyLoginStatus('MOCK-SSO')).rejects.toBeInstanceOf(CentralAuthError);
  });
});

describe('fetchRoles (MOCK get-role)', () => {
  it('sends intranet bearer + nontriId/systemId and normalizes', async () => {
    const fetchFn = mockFetch({ '/get-role': { status: 200, body: { data: [{ roleName: 'admin' }] } } });
    expect(await fetchRoles('MOCK-INTRANET', 'fengabc')).toEqual(['admin']);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    const parsed = new URL(url);
    expect(parsed.searchParams.get('nontriId')).toBe('fengabc');
    expect(parsed.searchParams.get('systemId')).toBe('mock-system-id');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer MOCK-INTRANET');
  });
});

describe('checkAccess (MOCK verify + get-role, cached)', () => {
  const parts = { nontriId: 'fengabc', ssoToken: 'MOCK-SSO', intranetToken: 'MOCK-INTRANET' };

  it('calls both in parallel and caches for 60s per token set', async () => {
    const fetchFn = mockFetch({
      '/verify.php': { status: 200, body: { active: true } },
      '/get-role': { status: 200, body: { roles: ['user'] } },
    });
    expect(await checkAccess(parts)).toEqual({ authenticated: true, roles: ['user'] });
    expect(await checkAccess(parts)).toEqual({ authenticated: true, roles: ['user'] });
    expect(fetchFn).toHaveBeenCalledTimes(2);
    await checkAccess({ ...parts, intranetToken: 'MOCK-INTRANET-2' });
    expect(fetchFn).toHaveBeenCalledTimes(4);
  });

  it('does not cache upstream errors', async () => {
    let fail = true;
    mockFetch({
      '/verify.php': () => ({ status: fail ? 503 : 200, body: { active: true } }),
      '/get-role': { status: 200, body: { roles: ['admin'] } },
    });
    await expect(checkAccess(parts)).rejects.toBeInstanceOf(CentralAuthError);
    fail = false;
    expect(await checkAccess(parts)).toEqual({ authenticated: true, roles: ['admin'] });
  });

  it('throws config error when role env is missing', async () => {
    vi.stubEnv('ENG_MAIN_ROLE_URL', '');
    await expect(checkAccess(parts)).rejects.toThrow(/ENG_MAIN_ROLE_URL/);
  });
});
