import crypto from 'crypto';
import { env } from '../config/env.js';

export interface SessionPayload {
  username: string; // nontriAccount
  issuedAt: number; // Unix timestamp ms
  expiresAt: number; // Unix timestamp ms
  isMock: boolean;
  version: number;
}

export const SESSION_COOKIE_NAME = 'ku_session';
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

export function signSession(username: string, isMock = false): { cookieValue: string; payload: SessionPayload } {
  const now = Date.now();
  const payload: SessionPayload = {
    username: username.toLowerCase().trim(),
    issuedAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    isMock,
    version: Number(env.AUTH_SESSION_VERSION),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', env.AUTH_SESSION_SECRET).update(payloadB64).digest('base64url');

  return {
    cookieValue: `${payloadB64}.${hmac}`,
    payload,
  };
}

export function verifySession(cookieValue?: string): SessionPayload | null {
  if (!cookieValue || typeof cookieValue !== 'string') return null;

  const parts = cookieValue.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  try {
    const expectedSigB64 = crypto
      .createHmac('sha256', env.AUTH_SESSION_SECRET)
      .update(payloadB64)
      .digest('base64url');

    const sigBuf = Buffer.from(sigB64);
    const expBuf = Buffer.from(expectedSigB64);

    // Constant-time comparison
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as SessionPayload;

    if (!payload.username || typeof payload.username !== 'string') return null;
    if (!payload.expiresAt || typeof payload.expiresAt !== 'number') return null;
    if (payload.expiresAt <= Date.now()) return null;
    if (Number(payload.version) !== Number(env.AUTH_SESSION_VERSION)) return null;
    // Reject mock sessions if mock auth is disabled
    if (payload.isMock && !env.AUTH_MOCK_ENABLED) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DURATION_MS,
  };
}
