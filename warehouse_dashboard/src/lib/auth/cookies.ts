/**
 * Auth cookie names and attributes.
 * Legacy ku_session cookie only — SSO cookies removed.
 */

export const KU_SESSION_COOKIE_NAME = 'ku_session';

export const LEGACY_COOKIES = ['kukps_eng_personnel_user', 'token', 'role_token'] as const;

export interface CookieOptions {
  path: string;
  sameSite: 'lax';
  httpOnly: boolean;
  secure: boolean;
  maxAge?: number;
}

/** Structural subset of Next's ResponseCookies, so this module stays framework-agnostic. */
export interface CookieWriter {
  set(name: string, value: string, options: CookieOptions): unknown;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function kuSessionCookieOptions(maxAge?: number): CookieOptions {
  const isSecure = isProduction();
  const opts: CookieOptions = { path: '/', sameSite: 'lax', httpOnly: false, secure: isSecure };
  if (typeof maxAge === 'number') opts.maxAge = Math.max(0, Math.floor(maxAge));
  return opts;
}

export function clearLegacyCookies(writer: CookieWriter): void {
  for (const name of LEGACY_COOKIES) writer.set(name, '', kuSessionCookieOptions(0));
}
