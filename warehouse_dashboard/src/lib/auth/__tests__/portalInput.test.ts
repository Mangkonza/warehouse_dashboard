import { describe, expect, it, vi } from 'vitest';
import { parsePortalInput } from '../portalInput';

// All token values below are FAKE placeholders.
describe('parsePortalInput', () => {
  it('rejects accessToken in production with 403, even alongside exchangeToken', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(parsePortalInput({ accessToken: 'FAKE', intranetToken: 'FAKE' })).toMatchObject({ ok: false, status: 403 });
    expect(parsePortalInput({ accessToken: 'FAKE', exchangeToken: 'FAKE', intranetToken: 'FAKE' })).toMatchObject({
      ok: false,
      status: 403,
    });
  });

  it('accepts exchangeToken in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(parsePortalInput({ exchangeToken: 'FAKE-X', intranetToken: 'FAKE-I' })).toEqual({
      ok: true,
      mode: 'exchange',
      exchangeToken: 'FAKE-X',
      intranetToken: 'FAKE-I',
    });
  });

  it('allows the direct accessToken flow outside production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(parsePortalInput({ accessToken: 'FAKE-A', exchangeToken: 'FAKE-X', intranetToken: 'FAKE-I' })).toEqual({
      ok: true,
      mode: 'direct',
      ssoToken: 'FAKE-A',
      intranetToken: 'FAKE-I',
    });
  });

  it('returns 400 for missing tokens', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(parsePortalInput({})).toMatchObject({ ok: false, status: 400 });
    expect(parsePortalInput({ exchangeToken: 'FAKE' })).toMatchObject({ ok: false, status: 400 });
    expect(parsePortalInput({ intranetToken: 'FAKE' })).toMatchObject({ ok: false, status: 400 });
    expect(parsePortalInput({ exchangeToken: '  ', intranetToken: 'FAKE' })).toMatchObject({ ok: false, status: 400 });
    expect(parsePortalInput({ exchangeToken: 123, intranetToken: 'FAKE' })).toMatchObject({ ok: false, status: 400 });
  });

  it('returns 400 for oversized tokens', () => {
    expect(parsePortalInput({ exchangeToken: 'x'.repeat(9000), intranetToken: 'FAKE' })).toMatchObject({ ok: false, status: 400 });
  });

  it('never echoes token values in errors', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const result = parsePortalInput({ accessToken: 'SECRET-LIKE-FAKE', intranetToken: 'FAKE' });
    expect(JSON.stringify(result)).not.toContain('SECRET-LIKE-FAKE');
  });
});
