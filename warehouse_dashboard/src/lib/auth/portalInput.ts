/**
 * Validates portal-session input (GET query or POST body).
 *
 *  - accessToken present while NODE_ENV === "production" → 403 (even if exchangeToken is also sent)
 *  - intranetToken missing → 400
 *  - non-production accessToken → direct flow (accessToken used as ssoToken; dev/test only)
 *  - exchangeToken → normal exchange flow
 *  - neither → 400
 */
import { isProduction } from './env';

const MAX_TOKEN_LENGTH = 8192;

export type PortalInput =
  | { ok: true; mode: 'exchange'; exchangeToken: string; intranetToken: string }
  | { ok: true; mode: 'direct'; ssoToken: string; intranetToken: string }
  | { ok: false; status: 400 | 403; error: string };

function tokenValue(value: unknown): string | null | 'too_long' {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > MAX_TOKEN_LENGTH ? 'too_long' : trimmed;
}

export function parsePortalInput(input: {
  exchangeToken?: unknown;
  intranetToken?: unknown;
  accessToken?: unknown;
}): PortalInput {
  const accessToken = tokenValue(input.accessToken);
  const exchangeToken = tokenValue(input.exchangeToken);
  const intranetToken = tokenValue(input.intranetToken);

  if (accessToken !== null && isProduction()) {
    return { ok: false, status: 403, error: 'accessToken is not accepted in production' };
  }
  if (accessToken === 'too_long' || exchangeToken === 'too_long' || intranetToken === 'too_long') {
    return { ok: false, status: 400, error: 'Token too long' };
  }
  if (!intranetToken) return { ok: false, status: 400, error: 'Missing intranetToken' };
  if (accessToken) return { ok: true, mode: 'direct', ssoToken: accessToken, intranetToken };
  if (exchangeToken) return { ok: true, mode: 'exchange', exchangeToken, intranetToken };
  return { ok: false, status: 400, error: 'Missing exchangeToken' };
}
