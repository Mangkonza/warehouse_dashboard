/**
 * In-process cache for verify + get-role results (TTL ≤ 60s).
 * Key = SHA-256(nontriId, ssoToken, intranetToken) — raw tokens are never used as keys.
 * Only successful upstream results are cached; errors are not.
 * NOTE: per-process — run exactly one frontend replica, or accept up to 60s staleness per replica.
 */
import { sha256Base64Url } from './jwt';

export const ROLE_CACHE_TTL_MS = 60_000;
const MAX_ENTRIES = 1000;

export interface AccessResult {
  authenticated: boolean;
  roles: string[];
}

interface Entry {
  value: AccessResult;
  expiresAt: number;
}

const store = new Map<string, Entry>();
const inflight = new Map<string, Promise<AccessResult>>();

export async function roleCacheKey(nontriId: string, ssoToken: string, intranetToken: string): Promise<string> {
  return sha256Base64Url(`${nontriId}\u0000${ssoToken}\u0000${intranetToken}`);
}

function prune(now: number): void {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
  while (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest === undefined) break;
    store.delete(oldest);
  }
}

export async function getOrLoadAccess(
  parts: { nontriId: string; ssoToken: string; intranetToken: string },
  loader: () => Promise<AccessResult>,
  now: () => number = Date.now,
): Promise<AccessResult> {
  const key = await roleCacheKey(parts.nontriId, parts.ssoToken, parts.intranetToken);
  const hit = store.get(key);
  if (hit && hit.expiresAt > now()) return { authenticated: hit.value.authenticated, roles: [...hit.value.roles] };

  const pending = inflight.get(key);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const value = await loader();
      prune(now());
      store.set(key, { value: { authenticated: value.authenticated, roles: [...value.roles] }, expiresAt: now() + ROLE_CACHE_TTL_MS });
      return value;
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, promise);
  return promise;
}

/** Drops cached entries for these tokens (e.g. on logout). */
export async function invalidateAccess(parts: { nontriId: string; ssoToken: string; intranetToken: string }): Promise<void> {
  store.delete(await roleCacheKey(parts.nontriId, parts.ssoToken, parts.intranetToken));
}

export function __clearRoleCacheForTests(): void {
  store.clear();
  inflight.clear();
}
