/**
 * USER_SESSION: our own HS256 JWT carrying user info only (never roles).
 *
 * Claims: iss=<PUBLIC_ORIGIN>, aud=warehouse-dashboard-web, sub=nontriId, iat, exp, usr, tkh.
 *  - exp = min(upstream token exp, now + 8h). Upstream exp prefers the Intranet JWT over the SSO JWT
 *    (both decoded UNVERIFIED — they can only SHORTEN the session, never extend it past 8h).
 *    No upstream exp → 8h (`expSource: "default"`, see UNVERIFIED.md).
 *  - tkh = SHA-256 of both upstream tokens, so a session cannot be paired with other token cookies.
 */
import { getSessionConfig, type SessionConfig } from './env';
import { decodeJwtPayloadUnverified, sha256Base64Url, signHs256, verifyHs256, type JwtVerifyFailure } from './jwt';
import type { SessionUser } from './profile';

export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export interface SessionPayload {
  iss: string;
  aud: string;
  sub: string;
  iat: number;
  exp: number;
  usr: SessionUser;
  tkh: string;
}

export type ExpSource = 'intranet' | 'sso' | 'default';

export interface CreatedSession {
  token: string;
  exp: number;
  /** Seconds until exp — use as cookie maxAge for all three cookies. */
  maxAge: number;
  expSource: ExpSource;
}

export class SessionCreationError extends Error {
  constructor(public readonly reason: 'upstream_token_expired') {
    super('Upstream token already expired');
    this.name = 'SessionCreationError';
  }
}

function numericClaim(payload: Record<string, unknown> | null, key: 'exp' | 'iat'): number | null {
  const value = payload?.[key];
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
}

export function tokenBindingInput(ssoToken: string, intranetToken: string): string {
  return `${ssoToken}\u0000${intranetToken}`;
}

export async function computeTokenBinding(ssoToken: string, intranetToken: string): Promise<string> {
  return sha256Base64Url(tokenBindingInput(ssoToken, intranetToken));
}

export async function createSessionToken(
  user: SessionUser,
  tokens: { ssoToken: string; intranetToken: string },
  options: { nowSeconds?: number; config?: SessionConfig } = {},
): Promise<CreatedSession> {
  const config = options.config ?? getSessionConfig();
  const now = options.nowSeconds ?? Math.floor(Date.now() / 1000);

  const intranetExp = numericClaim(decodeJwtPayloadUnverified(tokens.intranetToken), 'exp');
  const ssoExp = numericClaim(decodeJwtPayloadUnverified(tokens.ssoToken), 'exp');
  const upstreamExp = intranetExp ?? ssoExp;
  const expSource: ExpSource = intranetExp ? 'intranet' : ssoExp ? 'sso' : 'default';

  if (upstreamExp !== null && upstreamExp <= now) throw new SessionCreationError('upstream_token_expired');

  const cap = now + SESSION_MAX_AGE_SECONDS;
  const exp = upstreamExp !== null ? Math.min(upstreamExp, cap) : cap;

  const payload: SessionPayload = {
    iss: config.issuer,
    aud: config.audience,
    sub: user.nontriId,
    iat: now,
    exp,
    usr: user,
    tkh: await computeTokenBinding(tokens.ssoToken, tokens.intranetToken),
  };
  const token = await signHs256(payload as unknown as Record<string, unknown>, config.secret);
  return { token, exp, maxAge: exp - now, expSource };
}

export type SessionVerifyResult =
  | { ok: true; session: SessionPayload }
  | { ok: false; reason: JwtVerifyFailure | 'missing' | 'bad_claims' | 'token_mismatch' };

function isSessionUser(value: unknown, sub: unknown): value is SessionUser {
  if (typeof value !== 'object' || value === null) return false;
  const u = value as Record<string, unknown>;
  const optStr = (v: unknown) => v === null || typeof v === 'string';
  return (
    typeof u.nontriId === 'string' &&
    u.nontriId.length > 0 &&
    u.nontriId === sub &&
    optStr(u.firstName) &&
    optStr(u.lastName) &&
    optStr(u.name) &&
    optStr(u.email) &&
    optStr(u.faculty)
  );
}

/**
 * Verifies signature, exp, iss, aud and claim shape. If `tokens` is given, also checks
 * that the session is bound to exactly these ACCESS_TOKEN / INTRANET_TOKEN values.
 */
export async function verifySessionToken(
  token: string | null | undefined,
  options: { nowSeconds?: number; config?: SessionConfig; tokens?: { ssoToken: string; intranetToken: string } } = {},
): Promise<SessionVerifyResult> {
  if (!token) return { ok: false, reason: 'missing' };
  const config = options.config ?? getSessionConfig();
  const result = await verifyHs256(token, config.secret, {
    issuer: config.issuer,
    audience: config.audience,
    nowSeconds: options.nowSeconds,
  });
  if (!result.ok) return result;

  const p = result.payload;
  if (typeof p.sub !== 'string' || typeof p.tkh !== 'string' || typeof p.iat !== 'number' || !isSessionUser(p.usr, p.sub)) {
    return { ok: false, reason: 'bad_claims' };
  }
  const session = p as unknown as SessionPayload;

  if (options.tokens) {
    const expected = await computeTokenBinding(options.tokens.ssoToken, options.tokens.intranetToken);
    if (expected !== session.tkh) return { ok: false, reason: 'token_mismatch' };
  }
  return { ok: true, session };
}
