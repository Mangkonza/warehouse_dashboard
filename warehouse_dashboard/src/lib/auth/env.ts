/**
 * SSO environment configuration (server-only).
 *
 * Values are validated lazily on first use (never at import/build time).
 * Missing or malformed values throw `AuthConfigError` naming the variable —
 * the value itself is never included in messages or logs.
 * There are intentionally NO defaults: URLs live only in `.env.example`.
 */

export class AuthConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthConfigError';
  }
}

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

function readRequired(name: string): string {
  const raw = process.env[name];
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) {
    throw new AuthConfigError(`Missing required environment variable ${name}`);
  }
  return value;
}

function readUrl(name: string): string {
  const value = readRequired(name);
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new AuthConfigError(`Environment variable ${name} is not a valid absolute URL`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new AuthConfigError(`Environment variable ${name} must use http(s)`);
  }
  if (isProduction() && parsed.protocol !== 'https:') {
    throw new AuthConfigError(`Environment variable ${name} must use https in production`);
  }
  if (parsed.username || parsed.password) {
    throw new AuthConfigError(`Environment variable ${name} must not embed credentials`);
  }
  return parsed.toString();
}

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
  if (isProduction() && parsed.protocol !== 'https:') {
    throw new AuthConfigError(`Environment variable ${name} must use https in production`);
  }
  return parsed.origin;
}

const MIN_SECRET_LENGTH = 32;

export interface SessionConfig {
  /** HS256 secret for USER_SESSION. */
  secret: string;
  /** JWT `iss` — the public origin. */
  issuer: string;
  /** JWT `aud`. */
  audience: string;
}

export const SESSION_AUDIENCE = 'warehouse-dashboard-web';

export function getSessionConfig(): SessionConfig {
  const secret = readRequired('JWT_COOKIE_SECRET');
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new AuthConfigError(`JWT_COOKIE_SECRET must be at least ${MIN_SECRET_LENGTH} characters`);
  }
  const issuer = parseOrigin(readRequired('PUBLIC_ORIGIN'));
  return { secret, issuer, audience: SESSION_AUDIENCE };
}

export interface PortalConfig {
  exchangeUrl: string;
  meUrl: string;
}

export function getPortalConfig(): PortalConfig {
  return {
    exchangeUrl: readUrl('ENG_TOKEN_EXCHANGE_URL'),
    meUrl: readUrl('ENG_AUTH_ME_URL'),
  };
}

export interface RoleConfig {
  statusUrl: string;
  roleUrl: string;
  systemId: string;
}

export function getRoleConfig(): RoleConfig {
  return {
    statusUrl: readUrl('ALL_LOGIN_STATUS_URL'),
    roleUrl: readUrl('ENG_MAIN_ROLE_URL'),
    systemId: readRequired('ENG_SYSTEM_ID'),
  };
}

export function getLoginUrl(): string {
  return readUrl('ENG_LOGIN_URL');
}

export function getLogoutUrl(): string {
  return readUrl('ENG_LOGOUT_URL');
}

let tlsWarningShown = false;

/**
 * TLS verification mode for central-auth calls.
 * - unset / "true"  → strict (default)
 * - "false"         → allowed ONLY outside production (warns once); throws in production
 * - anything else   → throws
 */
export function isStrictTls(): boolean {
  const raw = (process.env.CENTRAL_AUTH_STRICT_TLS ?? '').trim();
  if (raw === '' || raw === 'true') return true;
  if (raw !== 'false') {
    throw new AuthConfigError('CENTRAL_AUTH_STRICT_TLS must be "true" or "false"');
  }
  if (isProduction()) {
    throw new AuthConfigError('CENTRAL_AUTH_STRICT_TLS=false is not allowed in production');
  }
  if (!tlsWarningShown) {
    tlsWarningShown = true;
    console.warn(
      '[auth] CENTRAL_AUTH_STRICT_TLS=false: TLS certificate verification for central auth calls is DISABLED (development only).',
    );
  }
  return false;
}

/** Test helper: resets the one-time TLS warning flag. */
export function __resetEnvStateForTests(): void {
  tlsWarningShown = false;
}
