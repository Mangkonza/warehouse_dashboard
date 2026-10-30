import { describe, expect, it, vi } from 'vitest';
import { evaluateSsoRules, isSsoPath } from '../proxyRules';

describe('isSsoPath', () => {
  it('identifies /admin and /user routes (and subpaths)', () => {
    expect(isSsoPath('/admin')).toBe(true);
    expect(isSsoPath('/admin/')).toBe(true);
    expect(isSsoPath('/admin/settings')).toBe(true);
    expect(isSsoPath('/user')).toBe(true);
    expect(isSsoPath('/user/')).toBe(true);
    expect(isSsoPath('/user/profile')).toBe(true);
  });

  it('rejects non-SSO routes', () => {
    expect(isSsoPath('/')).toBe(false);
    expect(isSsoPath('/overview')).toBe(false);
    expect(isSsoPath('/login')).toBe(false);
    expect(isSsoPath('/sso/login')).toBe(false);
    expect(isSsoPath('/forbidden')).toBe(false);
    expect(isSsoPath('/administrator')).toBe(false);
    expect(isSsoPath('/username')).toBe(false);
  });

  it('handles custom BASE_PATH', () => {
    vi.stubEnv('BASE_PATH', '/app');
    expect(isSsoPath('/app/admin')).toBe(true);
    expect(isSsoPath('/app/user/profile')).toBe(true);
    expect(isSsoPath('/app/overview')).toBe(false);
  });
});

describe('evaluateSsoRules', () => {
  it('returns pass_to_legacy for non-SSO routes', () => {
    const result = evaluateSsoRules({
      pathname: '/overview',
      searchParams: new URLSearchParams(),
      hasUserSession: false,
    });
    expect(result).toEqual({ action: 'pass_to_legacy' });
  });

  it('redirects to portal-session when exchangeToken and intranetToken are present', () => {
    const params = new URLSearchParams({
      exchangeToken: 'EX_123',
      intranetToken: 'IN_456',
      tab: 'audit',
    });
    const result = evaluateSsoRules({
      pathname: '/admin',
      searchParams: params,
      hasUserSession: false,
    });

    expect(result.action).toBe('redirect_portal_session');
    if (result.action === 'redirect_portal_session') {
      expect(result.next).toBe('/admin?tab=audit');
      const url = new URL(result.destination, 'https://example.test');
      expect(url.pathname).toBe('/api/auth/portal-session');
      expect(url.searchParams.get('exchangeToken')).toBe('EX_123');
      expect(url.searchParams.get('intranetToken')).toBe('IN_456');
      expect(url.searchParams.get('next')).toBe('/admin?tab=audit');
      expect(url.searchParams.get('tab')).toBeNull();
    }
  });

  it('strips accessToken from next query if present', () => {
    const params = new URLSearchParams({
      exchangeToken: 'EX_123',
      intranetToken: 'IN_456',
      accessToken: 'AC_789',
    });
    const result = evaluateSsoRules({
      pathname: '/user',
      searchParams: params,
      hasUserSession: false,
    });

    expect(result.action).toBe('redirect_portal_session');
    if (result.action === 'redirect_portal_session') {
      expect(result.next).toBe('/user');
    }
  });

  it('redirects to /sso/login when USER_SESSION cookie is missing', () => {
    const result = evaluateSsoRules({
      pathname: '/admin/settings',
      searchParams: new URLSearchParams(),
      hasUserSession: false,
    });

    expect(result).toEqual({
      action: 'redirect_sso_login',
      destination: '/sso/login',
    });
  });

  it('allows access when USER_SESSION cookie is present and no tokens', () => {
    const result = evaluateSsoRules({
      pathname: '/user/dashboard',
      searchParams: new URLSearchParams(),
      hasUserSession: true,
    });

    expect(result).toEqual({ action: 'allow' });
  });

  it('redirects to /sso/login if only one token is supplied and no session cookie exists', () => {
    const result = evaluateSsoRules({
      pathname: '/admin',
      searchParams: new URLSearchParams({ exchangeToken: 'ONLY_EX' }),
      hasUserSession: false,
    });

    expect(result).toEqual({
      action: 'redirect_sso_login',
      destination: '/sso/login',
    });
  });

  it('supports BASE_PATH prefix in destination redirects', () => {
    vi.stubEnv('BASE_PATH', '/portal');
    const result = evaluateSsoRules({
      pathname: '/portal/admin',
      searchParams: new URLSearchParams({ exchangeToken: 'EX', intranetToken: 'IN' }),
      hasUserSession: false,
    });

    expect(result.action).toBe('redirect_portal_session');
    if (result.action === 'redirect_portal_session') {
      expect(result.next).toBe('/admin');
      expect(result.destination).toContain('/portal/api/auth/portal-session');
    }

    const loginResult = evaluateSsoRules({
      pathname: '/portal/user',
      searchParams: new URLSearchParams(),
      hasUserSession: false,
    });

    expect(loginResult).toEqual({
      action: 'redirect_sso_login',
      destination: '/portal/sso/login',
    });
  });
});
