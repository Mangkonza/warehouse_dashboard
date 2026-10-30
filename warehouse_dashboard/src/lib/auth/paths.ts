/**
 * Single source of truth for app paths and public origin (server-side).
 *
 * `BASE_PATH` is read ONLY here and in `next.config.ts`. Empty/unset = root.
 * All app-relative paths below are WITHOUT the base path; use `withBasePath`
 * when building an absolute URL (e.g. a redirect Location built from the origin).
 */
import { AuthConfigError, isProduction, parseOrigin } from './env';

const BASE_PATH_PATTERN = /^(\/[A-Za-z0-9._~-]+)+$/;

export function getBasePath(): string {
  const raw = (process.env.BASE_PATH ?? '').trim();
  if (raw === '' || raw === '/') return '';
  if (!BASE_PATH_PATTERN.test(raw)) {
    throw new AuthConfigError('BASE_PATH must look like "/segment[/segment]" with no trailing slash');
  }
  return raw;
}

/** App-relative routes (no base path). */
export const APP_ROUTES = {
  ssoLogin: '/sso/login',
  ssoLogout: '/sso/logout',
  admin: '/admin',
  user: '/user',
  forbidden: '/forbidden',
  home: '/',
  portalSession: '/api/auth/portal-session',
  roles: '/api/auth/roles',
  session: '/api/auth/session',
} as const;

/** Prefixes `path` (must start with "/") with the base path. */
export function withBasePath(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error('withBasePath expects an app-relative path starting with "/"');
  }
  const base = getBasePath();
  if (!base) return path;
  return path === '/' ? base : `${base}${path}`;
}

/** Removes the base path from a pathname if present. */
export function stripBasePath(pathname: string): string {
  const base = getBasePath();
  if (!base) return pathname;
  if (pathname === base) return '/';
  if (pathname.startsWith(`${base}/`)) return pathname.slice(base.length);
  return pathname;
}

export type HeaderSource = { get(name: string): string | null };

const HOST_PATTERN = /^[A-Za-z0-9.-]+(:\d{1,5})?$/;

/**
 * Public origin used for redirects/cookies:
 *   1. `PUBLIC_ORIGIN` env (preferred; required in production and for JWT `iss`)
 *   2. Outside production only: `x-forwarded-proto` + `x-forwarded-host` (only trustworthy behind a proxy that overwrites them)
 * Throws if neither yields a valid origin. In production, missing PUBLIC_ORIGIN fails closed immediately.
 */
export function getPublicOrigin(headers?: HeaderSource): string {
  const envOrigin = (process.env.PUBLIC_ORIGIN ?? '').trim();
  if (envOrigin) return parseOrigin(envOrigin);

  if (isProduction()) {
    throw new AuthConfigError('PUBLIC_ORIGIN must be set in production');
  }

  const host = headers?.get('x-forwarded-host')?.split(',')[0]?.trim();
  const proto = headers?.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase();
  if (host && proto && HOST_PATTERN.test(host) && (proto === 'https' || proto === 'http')) {
    return parseOrigin(`${proto}://${host}`, 'x-forwarded-host/x-forwarded-proto');
  }
  throw new AuthConfigError('Cannot determine public origin: set PUBLIC_ORIGIN');
}

/** Absolute URL for an app-relative path, e.g. appUrl('/admin', req.headers). */
export function appUrl(path: string, headers?: HeaderSource): URL {
  return new URL(withBasePath(path), getPublicOrigin(headers));
}
