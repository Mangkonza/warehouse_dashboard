/**
 * Auth environment configuration (server-only).
 * SSO-related config removed.
 */

export class AuthConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthConfigError';
  }
}

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

/** Validates an origin (scheme + host[:port], no path/query/hash). */
export function parseOrigin(value: string, name = 'PUBLIC_ORIGIN'): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new AuthConfigError(`Environment variable ${name} is not a valid origin`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new AuthConfigError(`Environment variable ${name} must use http(s)`);
  }
  if ((parsed.pathname && parsed.pathname !== '/') || parsed.search || parsed.hash) {
    throw new AuthConfigError(`Environment variable ${name} must be an origin without path, query or hash`);
  }
  if (parsed.username || parsed.password) {
    throw new AuthConfigError(`Environment variable ${name} must not embed credentials`);
  }
  return parsed.origin;
}
