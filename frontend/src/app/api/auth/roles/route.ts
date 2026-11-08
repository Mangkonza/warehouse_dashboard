import { cookies } from 'next/headers';
import { jsonNoStore } from '@/lib/auth/httpResponse';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_INTRANET_TOKEN,
  COOKIE_USER_SESSION,
} from '@/lib/auth/cookies';
import { verifySessionToken } from '@/lib/auth/session';
import { checkAccess, CentralAuthError } from '@/lib/auth/centralClient';
import { AuthConfigError } from '@/lib/auth/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_USER_SESSION)?.value?.trim();
    const ssoToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value?.trim();
    const intranetToken = cookieStore.get(COOKIE_INTRANET_TOKEN)?.value?.trim();

    if (!sessionToken || !ssoToken || !intranetToken) {
      return jsonNoStore({ authenticated: false, roles: [] }, { status: 401 });
    }

    const sessionResult = await verifySessionToken(sessionToken, {
      tokens: { ssoToken, intranetToken },
    });

    if (!sessionResult.ok) {
      return jsonNoStore({ authenticated: false, roles: [] }, { status: 401 });
    }

    const access = await checkAccess({
      nontriId: sessionResult.session.sub,
      ssoToken,
      intranetToken,
    });

    if (!access.authenticated) {
      return jsonNoStore({ authenticated: false, roles: [] }, { status: 401 });
    }

    return jsonNoStore(
      { authenticated: true, roles: access.roles },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof CentralAuthError || err instanceof AuthConfigError) {
      return jsonNoStore({ error: 'Upstream central auth error' }, { status: 500 });
    }
    return jsonNoStore({ error: 'Internal server error' }, { status: 500 });
  }
}
