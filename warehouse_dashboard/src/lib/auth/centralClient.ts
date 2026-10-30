/**
 * Server-to-server client for the central Portal / ALL LOGIN / Intranet endpoints.
 *
 * - Tokens are only ever placed in request bodies/Authorization headers — never in logs,
 *   error messages, or returned objects other than the exchanged ssoToken itself.
 * - TLS verification is ON unless CENTRAL_AUTH_STRICT_TLS=false outside production (see env.ts).
 * - Every call has a timeout and `cache: "no-store"`.
 */
import { Agent, fetch as undiciFetch } from 'undici';
import { getPortalConfig, getRoleConfig, isStrictTls } from './env';
import { normalizeRoles } from './normalizeRoles';
import { extractCentralUser } from './profile';
import { getOrLoadAccess, type AccessResult } from './roleCache';

const TIMEOUT_MS = 10_000;

export type CentralEndpoint = 'exchange' | 'me' | 'verify' | 'get-role';

export class CentralAuthError extends Error {
  constructor(
    public readonly endpoint: CentralEndpoint,
    public readonly kind: 'upstream_http' | 'invalid_response' | 'network',
    public readonly upstreamStatus?: number,
  ) {
    super(`Central auth ${endpoint} failed: ${kind}${upstreamStatus ? ` (HTTP ${upstreamStatus})` : ''}`);
    this.name = 'CentralAuthError';
  }
}

let insecureAgent: Agent | null = null;

async function centralFetch(endpoint: CentralEndpoint, url: string, init: RequestInit): Promise<Response> {
  const strict = isStrictTls();
  const merged: RequestInit = {
    ...init,
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  };
  try {
    if (strict) return await fetch(url, merged);
    insecureAgent ??= new Agent({ connect: { rejectUnauthorized: false } });
    // Development-only path (env.ts throws for this in production).
    return (await undiciFetch(url, { ...(merged as object), dispatcher: insecureAgent } as never)) as unknown as Response;
  } catch {
    throw new CentralAuthError(endpoint, 'network');
  }
}

async function readJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function bearer(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}`, Accept: 'application/json' };
}

// ---------------------------------------------------------------------------
// exchange-token
// ---------------------------------------------------------------------------

export type ExchangeResult = { ok: true; ssoToken: string } | { ok: false; httpStatus: number };

/**
 * POST {exchangeToken}. Success requires HTTP 2xx AND body.status === "success" AND non-empty ssoToken.
 * Failure status: upstream HTTP status when non-2xx; 502 when upstream said 2xx but the body failed checks.
 */
export async function exchangeToken(exchangeTokenValue: string): Promise<ExchangeResult> {
  const { exchangeUrl } = getPortalConfig();
  const res = await centralFetch('exchange', exchangeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ exchangeToken: exchangeTokenValue }),
  });
  const body = await readJson(res);
  if (!res.ok) return { ok: false, httpStatus: res.status >= 400 && res.status <= 599 ? res.status : 502 };
  if (!isPlainObject(body) || body.status !== 'success' || typeof body.ssoToken !== 'string' || body.ssoToken.trim() === '') {
    return { ok: false, httpStatus: 502 };
  }
  return { ok: true, ssoToken: body.ssoToken };
}

// ---------------------------------------------------------------------------
// me
// ---------------------------------------------------------------------------

export type MeResult = { ok: true; user: Record<string, unknown> } | { ok: false; httpStatus: number };

/** GET me (Bearer ssoToken). Non-2xx → upstream status; 2xx without profile/user → 502. */
export async function fetchCentralUser(ssoToken: string): Promise<MeResult> {
  const { meUrl } = getPortalConfig();
  const res = await centralFetch('me', meUrl, { method: 'GET', headers: bearer(ssoToken) });
  const body = await readJson(res);
  if (!res.ok) return { ok: false, httpStatus: res.status >= 400 && res.status <= 599 ? res.status : 502 };
  const user = extractCentralUser(body);
  if (!user) return { ok: false, httpStatus: 502 };
  return { ok: true, user };
}

// ---------------------------------------------------------------------------
// verify + get-role
// ---------------------------------------------------------------------------

/** GET verify (Bearer ssoToken). true iff active===true or authenticated===true (strict booleans). */
export async function verifyLoginStatus(ssoToken: string): Promise<boolean> {
  const { statusUrl } = getRoleConfig();
  const res = await centralFetch('verify', statusUrl, { method: 'GET', headers: bearer(ssoToken) });
  const body = await readJson(res);
  if (!res.ok) throw new CentralAuthError('verify', 'upstream_http', res.status);
  if (!isPlainObject(body)) throw new CentralAuthError('verify', 'invalid_response', res.status);
  return body.active === true || body.authenticated === true;
}

/** GET get-role?nontriId=&systemId= (Bearer intranetToken) → normalized roles. */
export async function fetchRoles(intranetToken: string, nontriId: string): Promise<string[]> {
  const { roleUrl, systemId } = getRoleConfig();
  const url = new URL(roleUrl);
  url.searchParams.set('nontriId', nontriId);
  url.searchParams.set('systemId', systemId);
  const res = await centralFetch('get-role', url.toString(), { method: 'GET', headers: bearer(intranetToken) });
  const body = await readJson(res);
  if (!res.ok) throw new CentralAuthError('get-role', 'upstream_http', res.status);
  if (body === undefined) throw new CentralAuthError('get-role', 'invalid_response', res.status);
  return normalizeRoles(body);
}

/**
 * verify + get-role in parallel, cached ≤60s per (nontriId, ssoToken, intranetToken).
 * Throws AuthConfigError (missing env) or CentralAuthError (upstream failure) — callers map to 500.
 */
export async function checkAccess(parts: { nontriId: string; ssoToken: string; intranetToken: string }): Promise<AccessResult> {
  getRoleConfig(); // fail fast on missing env before touching the cache
  return getOrLoadAccess(parts, async () => {
    const [authenticated, roles] = await Promise.all([
      verifyLoginStatus(parts.ssoToken),
      fetchRoles(parts.intranetToken, parts.nontriId),
    ]);
    return { authenticated, roles };
  });
}
