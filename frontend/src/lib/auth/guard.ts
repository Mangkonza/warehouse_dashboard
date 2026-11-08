/**
 * Server-side authorization guard (server-only).
 * Reads auth cookies, verifies USER_SESSION (signature, exp, iss, aud, token binding),
 * calls central verify + get-role via roleCache/centralClient directly (never fetches own API).
 */
import { cookies } from 'next/headers';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_INTRANET_TOKEN,
  COOKIE_USER_SESSION,
} from './cookies';
import { verifySessionToken } from './session';
import { checkAccess } from './centralClient';
import type { SessionUser } from './profile';

export type GuardResult =
  | { status: 'ok'; roles: string[]; user: SessionUser }
  | { status: 'unauthenticated' }
  | { status: 'error' };

export interface CookieReader {
  get(name: string): { value: string } | undefined;
}

/**
 * Server guard checking session validity and fetching verified roles from the central system.
 * If cookieReader is not provided, reads cookies from `next/headers`.
 */
export async function requireAuth(cookieReader?: CookieReader): Promise<GuardResult> {
  try {
    const store = cookieReader ?? (await cookies());
    const sessionToken = store.get(COOKIE_USER_SESSION)?.value?.trim();
    const ssoToken = store.get(COOKIE_ACCESS_TOKEN)?.value?.trim();
    const intranetToken = store.get(COOKIE_INTRANET_TOKEN)?.value?.trim();

    if (!sessionToken || !ssoToken || !intranetToken) {
      return { status: 'unauthenticated' };
    }

    const sessionResult = await verifySessionToken(sessionToken, {
      tokens: { ssoToken, intranetToken },
    });

    if (!sessionResult.ok) {
      return { status: 'unauthenticated' };
    }

    const access = await checkAccess({
      nontriId: sessionResult.session.sub,
      ssoToken,
      intranetToken,
    });

    if (!access.authenticated) {
      return { status: 'unauthenticated' };
    }

    return {
      status: 'ok',
      roles: access.roles,
      user: sessionResult.session.usr,
    };
  } catch {
    return { status: 'error' };
  }
}
