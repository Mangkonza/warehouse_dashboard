/**
 * Open-redirect protection for the `next` parameter.
 *
 * `next` is an APP-RELATIVE path (no origin, no base path). Anything that could
 * leave the origin — absolute URLs, scheme-relative `//host`, backslash tricks,
 * control characters, encoded variants of these — falls back to `fallback`.
 * Token query params are stripped, and auth-callback paths are refused (loop guard).
 */
import { APP_ROUTES } from './paths';

export const TOKEN_QUERY_PARAMS = ['exchangeToken', 'intranetToken', 'accessToken'] as const;

const SENTINEL_ORIGIN = 'http://sentinel.invalid';
const MAX_NEXT_LENGTH = 2048;
const REFUSED_PREFIXES = [APP_ROUTES.portalSession, APP_ROUTES.ssoLogout, APP_ROUTES.ssoLogin];

function hasUnsafeChars(value: string): boolean {
  // Backslashes and ASCII control chars / whitespace are never legitimate here.
  return /[\\\u0000-\u001F\u007F\s]/.test(value);
}

export function sanitizeNextPath(raw: unknown, fallback: string = APP_ROUTES.home): string {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > MAX_NEXT_LENGTH) return fallback;
  if (!raw.startsWith('/') || raw.startsWith('//') || hasUnsafeChars(raw)) return fallback;

  // Reject encoded attempts like /%2F%2Fevil.com or /%5Cevil.com once decoded.
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return fallback;
  }
  // Decoded form may legitimately contain spaces (%20) but never backslashes/control chars.
  if (decoded.startsWith('//') || /[\\\u0000-\u001F\u007F]/.test(decoded)) return fallback;

  let url: URL;
  try {
    url = new URL(raw, SENTINEL_ORIGIN);
  } catch {
    return fallback;
  }
  if (url.origin !== SENTINEL_ORIGIN) return fallback;

  for (const param of TOKEN_QUERY_PARAMS) url.searchParams.delete(param);

  const path = url.pathname;
  if (REFUSED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return fallback;

  return `${path}${url.search}${url.hash}`;
}

/** Returns a copy of `params` without token query params. */
export function stripTokenParams(params: URLSearchParams): URLSearchParams {
  const copy = new URLSearchParams(params);
  for (const param of TOKEN_QUERY_PARAMS) copy.delete(param);
  return copy;
}
