import type { NextRequest } from 'next/server';
import { jsonNoStore, redirectNoStore } from '@/lib/auth/httpResponse';
import { parsePortalInput } from '@/lib/auth/portalInput';
import { exchangeToken, fetchCentralUser } from '@/lib/auth/centralClient';
import { resolveNontriId } from '@/lib/auth/nontriId';
import { buildSessionUser } from '@/lib/auth/profile';
import { createSessionToken } from '@/lib/auth/session';
import { setAuthCookies } from '@/lib/auth/cookies';
import { sanitizeNextPath } from '@/lib/auth/safeRedirect';
import { appUrl, type HeaderSource } from '@/lib/auth/paths';

export const dynamic = 'force-dynamic';

async function handlePortalSession(
  input: { exchangeToken?: unknown; intranetToken?: unknown; accessToken?: unknown },
  nextParam?: string | null,
  isGet: boolean = false,
  headers?: HeaderSource
) {
  const parsed = parsePortalInput(input);
  if (!parsed.ok) {
    return jsonNoStore({ error: parsed.error }, { status: parsed.status });
  }

  let ssoToken = '';
  if (parsed.mode === 'direct') {
    ssoToken = parsed.ssoToken;
  } else {
    const exchangeRes = await exchangeToken(parsed.exchangeToken);
    if (!exchangeRes.ok) {
      return jsonNoStore(
        { error: 'Cannot exchange portal token' },
        { status: exchangeRes.httpStatus }
      );
    }
    ssoToken = exchangeRes.ssoToken;
  }

  const centralUserRes = await fetchCentralUser(ssoToken);
  if (!centralUserRes.ok) {
    return jsonNoStore(
      { error: 'Cannot load central user data' },
      { status: centralUserRes.httpStatus }
    );
  }

  const nontriRes = resolveNontriId(centralUserRes.user, parsed.intranetToken);
  if (!nontriRes.ok) {
    return jsonNoStore({ error: 'Cannot resolve nontriId' }, { status: 502 });
  }

  const sessionUser = buildSessionUser(centralUserRes.user, nontriRes.nontriId);
  const created = await createSessionToken(sessionUser, {
    ssoToken,
    intranetToken: parsed.intranetToken,
  });

  if (isGet) {
    const cleanNext = sanitizeNextPath(nextParam, '/');
    const redirectUrl = appUrl(cleanNext, headers);
    const response = redirectNoStore(redirectUrl, 307);
    setAuthCookies(response.cookies, {
      session: created.token,
      ssoToken,
      intranetToken: parsed.intranetToken,
      maxAge: created.maxAge,
    });
    return response;
  }

  const response = jsonNoStore(
    { session: created.token, user: sessionUser },
    { status: 200 }
  );
  setAuthCookies(response.cookies, {
    session: created.token,
    ssoToken,
    intranetToken: parsed.intranetToken,
    maxAge: created.maxAge,
  });
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    return await handlePortalSession(
      {
        exchangeToken: searchParams.get('exchangeToken'),
        intranetToken: searchParams.get('intranetToken'),
        accessToken: searchParams.get('accessToken'),
      },
      searchParams.get('next'),
      true,
      request.headers
    );
  } catch (err) {
    return jsonNoStore({ error: 'Cannot create portal session' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return jsonNoStore({ error: 'Invalid JSON body' }, { status: 400 });
    }
    return await handlePortalSession(body, null, false);
  } catch (err) {
    return jsonNoStore({ error: 'Cannot create portal session' }, { status: 500 });
  }
}
