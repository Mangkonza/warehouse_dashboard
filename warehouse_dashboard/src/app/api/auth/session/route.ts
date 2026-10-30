import { cookies } from 'next/headers';
import { jsonNoStore } from '@/lib/auth/httpResponse';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_INTRANET_TOKEN,
  COOKIE_USER_SESSION,
} from '@/lib/auth/cookies';
import { verifySessionToken } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_USER_SESSION)?.value?.trim();
  const ssoToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value?.trim();
  const intranetToken = cookieStore.get(COOKIE_INTRANET_TOKEN)?.value?.trim();

  if (!sessionToken || !ssoToken || !intranetToken) {
    return jsonNoStore({ authenticated: false }, { status: 401 });
  }

  const result = await verifySessionToken(sessionToken, {
    tokens: { ssoToken, intranetToken },
  });

  if (!result.ok) {
    return jsonNoStore({ authenticated: false }, { status: 401 });
  }

  return jsonNoStore(
    { authenticated: true, user: result.session.usr },
    { status: 200 }
  );
}
