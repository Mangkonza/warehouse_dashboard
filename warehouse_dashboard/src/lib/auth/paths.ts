/**
 * Single source of truth for app paths (server-side).
 * SSO paths removed.
 */
import { AuthConfigError } from './env';

const BASE_PATH_PATTERN = /^(\/[A-Za-z0-9._~-]+)+$/;

export function getBasePath(): string {
  const raw = (process.env.BASE_PATH ?? process.env.NEXT_PUBLIC_BASE_PATH ?? '').trim();
  if (raw === '' || raw === '/') return '';
  if (!BASE_PATH_PATTERN.test(raw)) {
    throw new AuthConfigError('BASE_PATH must look like "/segment[/segment]" with no trailing slash');
  }
  return raw;
}

/** App-relative routes (no base path). */
export const APP_ROUTES = {
  login: '/login',
  forbidden: '/forbidden',
  home: '/',
  overview: '/overview',
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
 * Public origin used for redirects:
 *   1. `PUBLIC_ORIGIN` env (preferred)
 *   2. Outside production only: `x-forwarded-proto` + `x-forwarded-host`
 */
export function getPublicOrigin(headers?: HeaderSource): string {
  const envOrigin = (process.env.PUBLIC_ORIGIN ?? '').trim();
  if (envOrigin) {
    const parsed = new URL(envOrigin);
    return parsed.origin;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new AuthConfigError('PUBLIC_ORIGIN must be set in production');
  }

  const host = headers?.get('x-forwarded-host')?.split(',')[0]?.trim();
  const proto = headers?.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase();
  if (host && proto && HOST_PATTERN.test(host) && (proto === 'https' || proto === 'http')) {
    return new URL(`${proto}://${host}`).origin;
  }
  return 'http://localhost:3000';
}

/** Absolute URL for an app-relative path. */
export function appUrl(path: string, headers?: HeaderSource): URL {
  return new URL(withBasePath(path), getPublicOrigin(headers));
}
