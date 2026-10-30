/**
 * Auth cookie names and attributes.
 * All: Path=/, SameSite=Lax, no Domain, HttpOnly, Secure in production.
 * (USER_SESSION is HttpOnly too — the client reads the user via GET /api/auth/session.)
 */
import { isProduction } from './env';

export const COOKIE_USER_SESSION = 'USER_SESSION';
export const COOKIE_ACCESS_TOKEN = 'ACCESS_TOKEN';
export const COOKIE_INTRANET_TOKEN = 'INTRANET_TOKEN';

export const AUTH_COOKIES = [COOKIE_USER_SESSION, COOKIE_ACCESS_TOKEN, COOKIE_INTRANET_TOKEN] as const;
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

export function authCookieOptions(maxAge?: number): CookieOptions {
  const opts: CookieOptions = { path: '/', sameSite: 'lax', httpOnly: true, secure: isProduction() };
  if (typeof maxAge === 'number') opts.maxAge = Math.max(0, Math.floor(maxAge));
  return opts;
}

export function setAuthCookies(
  writer: CookieWriter,
  values: { session: string; ssoToken: string; intranetToken: string; maxAge: number },
): void {
  const opts = authCookieOptions(values.maxAge);
  writer.set(COOKIE_USER_SESSION, values.session, opts);
  writer.set(COOKIE_ACCESS_TOKEN, values.ssoToken, opts);
  writer.set(COOKIE_INTRANET_TOKEN, values.intranetToken, opts);
  clearLegacyCookies(writer);
}

export function clearLegacyCookies(writer: CookieWriter): void {
  for (const name of LEGACY_COOKIES) writer.set(name, '', authCookieOptions(0));
}

/** Deletes the three auth cookies (and legacy cookies). */
export function clearAuthCookies(writer: CookieWriter): void {
  for (const name of AUTH_COOKIES) writer.set(name, '', authCookieOptions(0));
  clearLegacyCookies(writer);
}
