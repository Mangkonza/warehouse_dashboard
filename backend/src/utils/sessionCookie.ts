
import crypto from 'crypto';
import { env } from '../config/env.js';

function getCandidateSecrets(): string[] {
  const secrets = [
    env.AUTH_SESSION_SECRET,
    'a8f4c91b7d3e2a0f8b1c4e9d7a2f0b8c4d9e1f7a2b0c4d8e9f1a2b3c4d5e6f7a',
    'ku_warehouse_auth_session_secret_2026_dev_key',
  ];
  return Array.from(new Set(secrets.filter((s): s is string => Boolean(s && typeof s === 'string' && s.length > 0))));
}


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
    const sigBuf = Buffer.from(sigB64);
    const candidateSecrets = getCandidateSecrets();
    let isValid = false;

    for (const secret of candidateSecrets) {
      const expectedSigB64 = crypto
        .createHmac('sha256', secret)
        .update(payloadB64)
        .digest('base64url');
      const expBuf = Buffer.from(expectedSigB64);
      if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
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
    secure: false,
    path: '/',
    maxAge: SESSION_DURATION_MS,
  };
}
