import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';
import { COOKIE_USER_SESSION } from '../cookies';
import { stubCentralEnv, stubSessionEnv, TEST_ORIGIN } from './helpers';

describe('src/proxy.ts host spoofing protection', () => {
  beforeEach(() => {
    stubSessionEnv(vi);
    stubCentralEnv(vi);
  });

  it('SSO redirect to /sso/login uses configured public origin, not spoofed Host / X-Forwarded-Host', async () => {
    const req = new NextRequest('http://evil.com/admin', {
      headers: {
        host: 'evil.com',
        'x-forwarded-host': 'evil.com',
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toBe(`${TEST_ORIGIN}/sso/login`);
    expect(location).not.toContain('evil.com');
  });

  it('SSO redirect to portal-session uses configured public origin, not spoofed Host / X-Forwarded-Host', async () => {
    const req = new NextRequest(
      'http://evil.com/admin?exchangeToken=EX_123&intranetToken=IN_456',
      {
        headers: {
          host: 'evil.com',
          'x-forwarded-host': 'evil.com',
        },
      }
    );

    const res = await proxy(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain(`${TEST_ORIGIN}/api/auth/portal-session?`);
    expect(location).toContain('exchangeToken=EX_123');
    expect(location).toContain('intranetToken=IN_456');
    expect(location).toContain('next=%2Fadmin');
    expect(location).not.toContain('evil.com');
  });

  it('allows request when USER_SESSION cookie is present', async () => {
    const req = new NextRequest('http://evil.com/admin', {
      headers: {
        cookie: `${COOKIE_USER_SESSION}=some-session-token`,
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });
});
