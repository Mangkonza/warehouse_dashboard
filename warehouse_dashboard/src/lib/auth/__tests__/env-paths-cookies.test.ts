import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __resetEnvStateForTests,
  AuthConfigError,
  getPortalConfig,
  getRoleConfig,
  getSessionConfig,
  isStrictTls,
} from '../env';
import { appUrl, getBasePath, getPublicOrigin, stripBasePath, withBasePath } from '../paths';
import { authCookieOptions, clearAuthCookies, setAuthCookies } from '../cookies';
import { stubCentralEnv, stubSessionEnv, TEST_ORIGIN } from './helpers';

beforeEach(() => __resetEnvStateForTests());

describe('env (lazy, no defaults)', () => {
  it('throws naming the missing variable without leaking values', () => {
    vi.stubEnv('JWT_COOKIE_SECRET', '');
    vi.stubEnv('PUBLIC_ORIGIN', TEST_ORIGIN);
    expect(() => getSessionConfig()).toThrow(/JWT_COOKIE_SECRET/);
    vi.stubEnv('ENG_TOKEN_EXCHANGE_URL', '');
    expect(() => getPortalConfig()).toThrow(AuthConfigError);
    vi.stubEnv('ENG_SYSTEM_ID', '');
    stubCentralEnv(vi);
    vi.stubEnv('ENG_SYSTEM_ID', '');
    expect(() => getRoleConfig()).toThrow(/ENG_SYSTEM_ID/);
  });

  it('rejects a short secret and non-origin PUBLIC_ORIGIN', () => {
    vi.stubEnv('JWT_COOKIE_SECRET', 'short');
    vi.stubEnv('PUBLIC_ORIGIN', TEST_ORIGIN);
    expect(() => getSessionConfig()).toThrow(/at least/);
    stubSessionEnv(vi);
    vi.stubEnv('PUBLIC_ORIGIN', 'https://x.test/path');
    expect(() => getSessionConfig()).toThrow(AuthConfigError);
  });

  it('requires https URLs in production', () => {
    stubCentralEnv(vi);
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ENG_AUTH_ME_URL', 'http://portal.mock.test/me.php');
    expect(() => getPortalConfig()).toThrow(/https/);
  });
});

describe('CENTRAL_AUTH_STRICT_TLS', () => {
  it('defaults to strict', () => {
    vi.stubEnv('CENTRAL_AUTH_STRICT_TLS', '');
    expect(isStrictTls()).toBe(true);
  });
  it('throws for "false" in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('CENTRAL_AUTH_STRICT_TLS', 'false');
    expect(() => isStrictTls()).toThrow(/not allowed in production/);
  });
  it('allows "false" in development with a warning', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('CENTRAL_AUTH_STRICT_TLS', 'false');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(isStrictTls()).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);
  });
  it('rejects other values', () => {
    vi.stubEnv('CENTRAL_AUTH_STRICT_TLS', 'yes');
    expect(() => isStrictTls()).toThrow(AuthConfigError);
  });
});

describe('paths', () => {
  it('root base path', () => {
    vi.stubEnv('BASE_PATH', '');
    expect(getBasePath()).toBe('');
    expect(withBasePath('/admin')).toBe('/admin');
  });
  it('custom base path', () => {
    vi.stubEnv('BASE_PATH', '/warehouse');
    expect(withBasePath('/admin')).toBe('/warehouse/admin');
    expect(withBasePath('/')).toBe('/warehouse');
    expect(stripBasePath('/warehouse/user')).toBe('/user');
    expect(stripBasePath('/warehouse')).toBe('/');
    expect(stripBasePath('/warehousex')).toBe('/warehousex');
  });
  it('rejects malformed base path', () => {
    vi.stubEnv('BASE_PATH', 'warehouse/');
    expect(() => getBasePath()).toThrow(AuthConfigError);
  });
  it('origin from PUBLIC_ORIGIN, else forwarded headers, else throws', () => {
    vi.stubEnv('BASE_PATH', '/w');
    vi.stubEnv('PUBLIC_ORIGIN', TEST_ORIGIN);
    expect(appUrl('/admin').toString()).toBe(`${TEST_ORIGIN}/w/admin`);
    vi.stubEnv('PUBLIC_ORIGIN', '');
    const h = new Headers({ 'x-forwarded-host': 'proxy.example.test', 'x-forwarded-proto': 'https' });
    expect(getPublicOrigin(h)).toBe('https://proxy.example.test');
    expect(() => getPublicOrigin(new Headers())).toThrow(/PUBLIC_ORIGIN/);
    expect(() => getPublicOrigin(new Headers({ 'x-forwarded-host': 'evil.test/x', 'x-forwarded-proto': 'https' }))).toThrow();
  });
  it('production fail-closed: throws clear error if PUBLIC_ORIGIN is unset, ignoring forwarded headers', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('PUBLIC_ORIGIN', '');
    const h = new Headers({ 'x-forwarded-host': 'proxy.example.test', 'x-forwarded-proto': 'https' });
    expect(() => getPublicOrigin(h)).toThrow(AuthConfigError);
    expect(() => getPublicOrigin(h)).toThrow(/PUBLIC_ORIGIN must be set in production/);
    expect(() => getPublicOrigin(new Headers())).toThrow(AuthConfigError);
  });
});

describe('cookies', () => {
  it('uses Path=/, SameSite=Lax, HttpOnly, no Domain; Secure only in production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(authCookieOptions(10)).toEqual({ path: '/', sameSite: 'lax', httpOnly: true, secure: false, maxAge: 10 });
    vi.stubEnv('NODE_ENV', 'production');
    expect(authCookieOptions().secure).toBe(true);
    expect(authCookieOptions()).not.toHaveProperty('domain');
  });

  it('sets the three cookies and clears legacy ones; clear deletes all', () => {
    const calls: Array<[string, string, { maxAge?: number }]> = [];
    const writer = { set: (n: string, v: string, o: { maxAge?: number }) => calls.push([n, v, o]) };
    setAuthCookies(writer, { session: 'S', ssoToken: 'A', intranetToken: 'I', maxAge: 100 });
    expect(calls.map((c) => c[0])).toEqual([
      'USER_SESSION',
      'ACCESS_TOKEN',
      'INTRANET_TOKEN',
      'kukps_eng_personnel_user',
      'token',
      'role_token',
    ]);
    calls.length = 0;
    clearAuthCookies(writer);
    expect(calls.every(([, v, o]) => v === '' && o.maxAge === 0)).toBe(true);
    expect(calls).toHaveLength(6);
  });
});
