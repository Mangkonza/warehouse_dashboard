import { beforeEach, describe, expect, it, vi } from 'vitest';
import { base64UrlDecode, base64UrlEncode, signHs256, verifyHs256 } from '../jwt';
import { createSessionToken, SESSION_MAX_AGE_SECONDS, SessionCreationError, verifySessionToken } from '../session';
import type { SessionUser } from '../profile';
import { fakeUpstreamJwt, stubSessionEnv, TEST_ORIGIN, TEST_SECRET } from './helpers';

const NOW = 1_800_000_000;
const user: SessionUser = {
  nontriId: 'fengabc',
  firstName: 'First',
  lastName: 'Last',
  name: 'ชื่อ นามสกุล',
  email: 'example@ku.th',
  faculty: null,
};
const sso = fakeUpstreamJwt({ exp: NOW + 3600 });
const intranet = fakeUpstreamJwt({ sub: 'fengabc', exp: NOW + 1800 });

function tamperPayload(token: string, patch: Record<string, unknown>): string {
  const [h, p, s] = token.split('.');
  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(p)));
  return `${h}.${base64UrlEncode(JSON.stringify({ ...payload, ...patch }))}.${s}`;
}

beforeEach(() => stubSessionEnv(vi));

describe('verifyHs256', () => {
  const opts = { issuer: TEST_ORIGIN, audience: 'aud', nowSeconds: NOW };
  const base = { iss: TEST_ORIGIN, aud: 'aud', iat: NOW, exp: NOW + 60 };

  it('accepts a valid token', async () => {
    const token = await signHs256(base, TEST_SECRET);
    expect((await verifyHs256(token, TEST_SECRET, opts)).ok).toBe(true);
  });

  it('rejects a tampered payload', async () => {
    const token = await signHs256(base, TEST_SECRET);
    expect(await verifyHs256(tamperPayload(token, { aud: 'aud', sub: 'admin' }), TEST_SECRET, opts)).toEqual({
      ok: false,
      reason: 'bad_signature',
    });
  });

  it('rejects a tampered signature and a wrong secret', async () => {
    const token = await signHs256(base, TEST_SECRET);
    const flipped = token.slice(0, -2) + (token.endsWith('A') ? 'BB' : 'AA');
    expect((await verifyHs256(flipped, TEST_SECRET, opts)).ok).toBe(false);
    expect(await verifyHs256(token, `${TEST_SECRET}-other`, opts)).toEqual({ ok: false, reason: 'bad_signature' });
  });

  it('rejects alg=none and non-HS256 headers', async () => {
    const body = base64UrlEncode(JSON.stringify(base));
    const sig = base64UrlEncode('fake-signature-bytes');
    const none = `${base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }))}.${body}.${sig}`;
    expect(await verifyHs256(none, TEST_SECRET, opts)).toEqual({ ok: false, reason: 'bad_header' });
    const rs = `${base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${body}.${sig}`;
    expect(await verifyHs256(rs, TEST_SECRET, opts)).toEqual({ ok: false, reason: 'bad_header' });
  });

  it('rejects expired, missing exp, and not-yet-valid tokens', async () => {
    expect(await verifyHs256(await signHs256({ ...base, exp: NOW }, TEST_SECRET), TEST_SECRET, opts)).toEqual({
      ok: false,
      reason: 'expired',
    });
    const { exp: _omit, ...noExp } = base;
    expect(await verifyHs256(await signHs256(noExp, TEST_SECRET), TEST_SECRET, opts)).toEqual({
      ok: false,
      reason: 'missing_exp',
    });
    expect(await verifyHs256(await signHs256({ ...base, nbf: NOW + 10 }, TEST_SECRET), TEST_SECRET, opts)).toEqual({
      ok: false,
      reason: 'not_yet_valid',
    });
  });

  it('rejects wrong issuer and audience', async () => {
    expect(await verifyHs256(await signHs256({ ...base, iss: 'https://evil.test' }, TEST_SECRET), TEST_SECRET, opts)).toEqual({
      ok: false,
      reason: 'bad_issuer',
    });
    expect(await verifyHs256(await signHs256({ ...base, aud: 'other' }, TEST_SECRET), TEST_SECRET, opts)).toEqual({
      ok: false,
      reason: 'bad_audience',
    });
    expect((await verifyHs256(await signHs256({ ...base, aud: ['x', 'aud'] }, TEST_SECRET), TEST_SECRET, opts)).ok).toBe(true);
  });

  it('rejects malformed input', async () => {
    for (const bad of ['', 'a.b', 'a.b.c.d', '!!.??.**']) {
      expect((await verifyHs256(bad, TEST_SECRET, opts)).ok).toBe(false);
    }
  });
});

describe('USER_SESSION create/verify', () => {
  it('round-trips with iss/aud and token binding', async () => {
    const created = await createSessionToken(user, { ssoToken: sso, intranetToken: intranet }, { nowSeconds: NOW });
    const result = await verifySessionToken(created.token, { nowSeconds: NOW + 1, tokens: { ssoToken: sso, intranetToken: intranet } });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.session.iss).toBe(TEST_ORIGIN);
      expect(result.session.aud).toBe('warehouse-dashboard-web');
      expect(result.session.usr).toEqual(user);
      expect(JSON.stringify(result.session)).not.toContain(sso);
      expect(JSON.stringify(result.session)).not.toContain(intranet);
    }
  });

  it('prefers the intranet exp over the SSO exp', async () => {
    const created = await createSessionToken(user, { ssoToken: sso, intranetToken: intranet }, { nowSeconds: NOW });
    expect(created).toMatchObject({ exp: NOW + 1800, maxAge: 1800, expSource: 'intranet' });
  });

  it('caps exp at 8h and defaults to 8h when no upstream exp', async () => {
    const longSso = fakeUpstreamJwt({ exp: NOW + 999_999 });
    const capped = await createSessionToken(user, { ssoToken: longSso, intranetToken: 'opaque' }, { nowSeconds: NOW });
    expect(capped).toMatchObject({ exp: NOW + SESSION_MAX_AGE_SECONDS, expSource: 'sso' });
    const none = await createSessionToken(user, { ssoToken: 'opaque-a', intranetToken: 'opaque-b' }, { nowSeconds: NOW });
    expect(none).toMatchObject({ exp: NOW + SESSION_MAX_AGE_SECONDS, expSource: 'default' });
  });

  it('refuses to create a session from an already-expired upstream token', async () => {
    const expired = fakeUpstreamJwt({ exp: NOW - 1 });
    await expect(createSessionToken(user, { ssoToken: sso, intranetToken: expired }, { nowSeconds: NOW })).rejects.toBeInstanceOf(
      SessionCreationError,
    );
  });

  it('rejects an expired session', async () => {
    const created = await createSessionToken(user, { ssoToken: sso, intranetToken: intranet }, { nowSeconds: NOW });
    expect(await verifySessionToken(created.token, { nowSeconds: created.exp })).toEqual({ ok: false, reason: 'expired' });
  });

  it('rejects a tampered session (e.g. swapped nontriId)', async () => {
    const created = await createSessionToken(user, { ssoToken: sso, intranetToken: intranet }, { nowSeconds: NOW });
    const forged = tamperPayload(created.token, { sub: 'victim', usr: { ...user, nontriId: 'victim' } });
    expect(await verifySessionToken(forged, { nowSeconds: NOW })).toEqual({ ok: false, reason: 'bad_signature' });
  });

  it('rejects a session signed for another issuer/audience', async () => {
    const created = await createSessionToken(user, { ssoToken: sso, intranetToken: intranet }, { nowSeconds: NOW });
    vi.stubEnv('PUBLIC_ORIGIN', 'https://other.example.test');
    expect(await verifySessionToken(created.token, { nowSeconds: NOW })).toEqual({ ok: false, reason: 'bad_issuer' });
  });

  it('rejects a session paired with different token cookies', async () => {
    const created = await createSessionToken(user, { ssoToken: sso, intranetToken: intranet }, { nowSeconds: NOW });
    const other = fakeUpstreamJwt({ sub: 'fengabc', exp: NOW + 100, jti: 'different' });
    expect(await verifySessionToken(created.token, { nowSeconds: NOW, tokens: { ssoToken: sso, intranetToken: other } })).toEqual({
      ok: false,
      reason: 'token_mismatch',
    });
  });

  it('reports missing token', async () => {
    expect(await verifySessionToken(undefined)).toEqual({ ok: false, reason: 'missing' });
  });
});
