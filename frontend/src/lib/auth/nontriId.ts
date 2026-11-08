/**
 * Resolves the nontriId used for `get-role`.
 *
 * Order:
 *   1. `user.uid` from the server-fetched `me` response (trusted transport)
 *   2. `sub` from the Intranet JWT — decoded WITHOUT signature verification — only if uid is absent
 *   3. part of `user.sub` after the last ":" (from `me`) — only if 1 and 2 are absent
 * If uid and the intranet `sub` are both present and differ, resolution FAILS (token/user mismatch).
 * The resolved id is only a lookup key; authorization always comes from `get-role`.
 */
import { decodeJwtPayloadUnverified } from './jwt';

/** Conservative charset for an identifier sent as a query parameter. */
const NONTRI_ID_PATTERN = /^[A-Za-z0-9._@-]{1,128}$/;

export type NontriIdSource = 'user.uid' | 'intranet.sub' | 'user.sub';

export type NontriIdResult =
  | { ok: true; nontriId: string; source: NontriIdSource }
  | { ok: false; reason: 'missing' | 'mismatch' | 'invalid_format' };

function nonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function subSuffix(sub: string | null): string | null {
  if (!sub) return null;
  const idx = sub.lastIndexOf(':');
  return nonEmptyString(idx >= 0 ? sub.slice(idx + 1) : sub);
}

export function resolveNontriId(
  user: Record<string, unknown> | null | undefined,
  intranetToken: string | null | undefined,
): NontriIdResult {
  const uid = nonEmptyString(user?.uid);
  const intranetSub = nonEmptyString(decodeJwtPayloadUnverified(intranetToken)?.sub);

  let candidate: string | null = null;
  let source: NontriIdSource | null = null;

  if (uid) {
    if (intranetSub && intranetSub !== uid) return { ok: false, reason: 'mismatch' };
    candidate = uid;
    source = 'user.uid';
  } else if (intranetSub) {
    candidate = intranetSub;
    source = 'intranet.sub';
  } else {
    const fromUserSub = subSuffix(nonEmptyString(user?.sub));
    if (fromUserSub) {
      candidate = fromUserSub;
      source = 'user.sub';
    }
  }

  if (!candidate || !source) return { ok: false, reason: 'missing' };
  if (!NONTRI_ID_PATTERN.test(candidate)) return { ok: false, reason: 'invalid_format' };
  return { ok: true, nontriId: candidate, source };
}
