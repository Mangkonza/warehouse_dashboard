/**
 * Minimal HS256 JWT sign/verify using Web Crypto (works in Node and edge runtimes),
 * plus an explicitly-named UNVERIFIED decoder for third-party tokens whose keys we
 * do not hold (SSO / Intranet). Unverified claims must never be used to authorize.
 */

export type JwtPayload = Record<string, unknown>;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function base64UrlEncode(input: Uint8Array | string): string {
  const bytes = typeof input === 'string' ? encoder.encode(input) : input;
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlDecode(input: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]*$/.test(input)) throw new Error('Invalid base64url');
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function parseJsonSegment(segment: string): unknown {
  return JSON.parse(decoder.decode(base64UrlDecode(segment)));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function hmacKey(secret: string, usage: 'sign' | 'verify'): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [usage]);
}

export async function signHs256(payload: JwtPayload, secret: string): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${header}.${body}`;
  const key = await hmacKey(secret, 'sign');
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput)));
  return `${signingInput}.${base64UrlEncode(sig)}`;
}

export type JwtVerifyFailure =
  | 'malformed'
  | 'bad_header'
  | 'bad_signature'
  | 'missing_exp'
  | 'expired'
  | 'not_yet_valid'
  | 'bad_issuer'
  | 'bad_audience';

export type JwtVerifyResult = { ok: true; payload: JwtPayload } | { ok: false; reason: JwtVerifyFailure };

export interface VerifyOptions {
  issuer: string;
  audience: string;
  /** Current time in seconds (injectable for tests). */
  nowSeconds?: number;
}

/**
 * Verifies an HS256 JWT: header alg/typ, constant-time HMAC signature, `exp` (required),
 * `nbf`/`iat` (not in the future), exact `iss`, and `aud` (string or array containing it).
 */
export async function verifyHs256(token: string, secret: string, opts: VerifyOptions): Promise<JwtVerifyResult> {
  if (typeof token !== 'string' || token.length > 8192) return { ok: false, reason: 'malformed' };
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some((p) => p.length === 0)) return { ok: false, reason: 'malformed' };
  const [headerB64, payloadB64, sigB64] = parts;

  let header: unknown;
  let payload: unknown;
  let signature: Uint8Array;
  try {
    header = parseJsonSegment(headerB64);
    payload = parseJsonSegment(payloadB64);
    signature = base64UrlDecode(sigB64);
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (!isPlainObject(header) || header.alg !== 'HS256' || (header.typ !== undefined && header.typ !== 'JWT')) {
    return { ok: false, reason: 'bad_header' };
  }
  if (!isPlainObject(payload)) return { ok: false, reason: 'malformed' };

  const key = await hmacKey(secret, 'verify');
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    signature as unknown as BufferSource,
    encoder.encode(`${headerB64}.${payloadB64}`),
  );
  if (!valid) return { ok: false, reason: 'bad_signature' };

  const now = opts.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) return { ok: false, reason: 'missing_exp' };
  if (payload.exp <= now) return { ok: false, reason: 'expired' };
  if (typeof payload.nbf === 'number' && payload.nbf > now) return { ok: false, reason: 'not_yet_valid' };
  if (typeof payload.iat === 'number' && payload.iat > now + 60) return { ok: false, reason: 'not_yet_valid' };
  if (payload.iss !== opts.issuer) return { ok: false, reason: 'bad_issuer' };
  const aud = payload.aud;
  const audOk = typeof aud === 'string' ? aud === opts.audience : Array.isArray(aud) && aud.includes(opts.audience);
  if (!audOk) return { ok: false, reason: 'bad_audience' };

  return { ok: true, payload };
}

/**
 * Decodes a JWT payload WITHOUT verifying its signature.
 * Use only for non-authorizing hints (cookie lifetime, identifier cross-checks).
 * Returns null for anything that is not a 3-part JWT with an object payload.
 */
export function decodeJwtPayloadUnverified(token: string | null | undefined): JwtPayload | null {
  if (typeof token !== 'string' || token.length > 16384) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = parseJsonSegment(parts[1]);
    return isPlainObject(payload) ? payload : null;
  } catch {
    return null;
  }
}

/** SHA-256 → base64url. Used to avoid holding raw tokens in keys/claims. */
export async function sha256Base64Url(input: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(input)));
  return base64UrlEncode(digest);
}
