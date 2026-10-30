import { describe, expect, it } from 'vitest';
import { sanitizeNextPath, stripTokenParams } from '../safeRedirect';

describe('sanitizeNextPath (open-redirect protection)', () => {
  it('keeps same-origin app paths with query and hash', () => {
    expect(sanitizeNextPath('/admin')).toBe('/admin');
    expect(sanitizeNextPath('/user/profile?tab=1#top')).toBe('/user/profile?tab=1#top');
    expect(sanitizeNextPath('/%E0%B8%97%E0%B8%94')).toBe('/%E0%B8%97%E0%B8%94');
  });

  it.each([
    'https://evil.example',
    'http://evil.example/admin',
    '//evil.example',
    '//evil.example/admin',
    '/\\evil.example',
    '\\\\evil.example',
    '/%2F%2Fevil.example',
    '/%2fevil.example/..//x',
    '/%5Cevil.example',
    'javascript:alert(1)',
    'data:text/html,x',
    'admin',
    '',
    ' /admin',
    '/admin\n',
    '/\tadmin',
    '/%0d%0aSet-Cookie:x=y',
  ])('rejects %j', (value) => {
    expect(sanitizeNextPath(value)).toBe('/');
  });

  it('rejects non-strings and very long values', () => {
    expect(sanitizeNextPath(undefined)).toBe('/');
    expect(sanitizeNextPath(['/admin'])).toBe('/');
    expect(sanitizeNextPath(`/${'a'.repeat(3000)}`)).toBe('/');
  });

  it('uses the provided fallback', () => {
    expect(sanitizeNextPath('//evil', '/user')).toBe('/user');
  });

  it('strips token query params', () => {
    expect(sanitizeNextPath('/admin?exchangeToken=FAKE&intranetToken=FAKE&accessToken=FAKE&x=1')).toBe('/admin?x=1');
  });

  it('refuses auth-callback paths (redirect loop guard)', () => {
    expect(sanitizeNextPath('/api/auth/portal-session?next=/admin')).toBe('/');
    expect(sanitizeNextPath('/sso/logout')).toBe('/');
    expect(sanitizeNextPath('/sso/login')).toBe('/');
  });
});

describe('stripTokenParams', () => {
  it('removes only token params', () => {
    const out = stripTokenParams(new URLSearchParams('exchangeToken=FAKE&intranetToken=FAKE&keep=1'));
    expect(out.toString()).toBe('keep=1');
  });
});
