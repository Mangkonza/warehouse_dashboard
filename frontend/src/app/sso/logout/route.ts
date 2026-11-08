import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_INTRANET_TOKEN,
  COOKIE_USER_SESSION,
  clearAuthCookies,
} from '@/lib/auth/cookies';
import { getLogoutUrl } from '@/lib/auth/env';
import { redirectNoStore } from '@/lib/auth/httpResponse';
import { decodeJwtPayloadUnverified } from '@/lib/auth/jwt';
import { invalidateAccess } from '@/lib/auth/roleCache';

export const dynamic = 'force-dynamic';

export async function GET(request?: NextRequest) {
  try {
    let sessionToken: string | undefined;
    let ssoToken: string | undefined;
    let intranetToken: string | undefined;

    if (request?.cookies) {
      sessionToken = request.cookies.get(COOKIE_USER_SESSION)?.value?.trim();
      ssoToken = request.cookies.get(COOKIE_ACCESS_TOKEN)?.value?.trim();
      intranetToken = request.cookies.get(COOKIE_INTRANET_TOKEN)?.value?.trim();
    } else {
      try {
        const store = await cookies();
        sessionToken = store.get(COOKIE_USER_SESSION)?.value?.trim();
        ssoToken = store.get(COOKIE_ACCESS_TOKEN)?.value?.trim();
        intranetToken = store.get(COOKIE_INTRANET_TOKEN)?.value?.trim();
      } catch {
        // cookies() store may not be available outside Next.js request context
      }
    }

    if (ssoToken && intranetToken) {
      let nontriId: string | undefined;
      if (sessionToken) {
        const payload = decodeJwtPayloadUnverified(sessionToken);
        if (typeof payload?.sub === 'string' && payload.sub) {
          nontriId = payload.sub;
        }
      }
      if (!nontriId) {
        const intraPayload = decodeJwtPayloadUnverified(intranetToken);
        if (typeof intraPayload?.sub === 'string' && intraPayload.sub) {
          nontriId = intraPayload.sub;
        }
      }
      if (nontriId) {
        await invalidateAccess({ nontriId, ssoToken, intranetToken });
      }
    }
  } catch {
    // Must never throw if cookies are missing or invalid
  }

  const logoutUrl = getLogoutUrl();
  const response = redirectNoStore(logoutUrl, 307);
  clearAuthCookies(response.cookies);
  return response;
}
