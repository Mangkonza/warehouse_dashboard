import { describe, expect, it } from 'vitest';
import { resolveNontriId } from '../nontriId';
import { fakeUpstreamJwt } from './helpers';

describe('resolveNontriId', () => {
  it('prefers user.uid', () => {
    expect(resolveNontriId({ uid: 'b6500000001', sub: 'ku:other' }, null)).toEqual({
      ok: true,
      nontriId: 'b6500000001',
      source: 'user.uid',
    });
  });

  it('accepts uid when intranet sub matches', () => {
    const intranet = fakeUpstreamJwt({ sub: 'fengabc' });
    expect(resolveNontriId({ uid: 'fengabc' }, intranet)).toMatchObject({ ok: true, nontriId: 'fengabc' });
  });

  it('rejects when uid and intranet sub differ', () => {
    const intranet = fakeUpstreamJwt({ sub: 'someone.else' });
    expect(resolveNontriId({ uid: 'fengabc' }, intranet)).toEqual({ ok: false, reason: 'mismatch' });
  });

  it('falls back to unverified intranet sub only when uid is absent', () => {
    const intranet = fakeUpstreamJwt({ sub: 'fengabc' });
    expect(resolveNontriId({ sub: 'ku:ignored' }, intranet)).toEqual({
      ok: true,
      nontriId: 'fengabc',
      source: 'intranet.sub',
    });
  });

  it('falls back to the part of user.sub after ":"', () => {
    expect(resolveNontriId({ sub: 'ku:nontri:fengabc' }, 'not-a-jwt')).toEqual({
      ok: true,
      nontriId: 'fengabc',
      source: 'user.sub',
    });
  });

  it('treats empty/whitespace uid as absent', () => {
    expect(resolveNontriId({ uid: '   ', sub: 'x:fengabc' }, null)).toMatchObject({ ok: true, source: 'user.sub' });
  });

  it('fails when nothing usable is present', () => {
    expect(resolveNontriId({}, null)).toEqual({ ok: false, reason: 'missing' });
    expect(resolveNontriId(null, undefined)).toEqual({ ok: false, reason: 'missing' });
  });

  it('rejects identifiers with unsafe characters', () => {
    expect(resolveNontriId({ uid: 'a&systemId=evil' }, null)).toEqual({ ok: false, reason: 'invalid_format' });
  });
});
