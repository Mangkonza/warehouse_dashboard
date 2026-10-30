import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_USER_SESSION } from '@/lib/auth/cookies';
import { getPublicOrigin, stripBasePath } from '@/lib/auth/paths';
import { evaluateSsoRules } from '@/lib/auth/proxyRules';

const SESSION_COOKIE_NAME = 'ku_session';
const AUTH_SESSION_SECRET =
  process.env.AUTH_SESSION_SECRET || 'ku_warehouse_auth_session_secret_2026_dev_key';

// Helper to decode base64url to Uint8Array
function base64UrlToBytes(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  const binaryStr = atob(padded);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

// Verify legacy HMAC-SHA256 signature and expiration for ku_session
async function verifyKuSessionCookie(cookieValue?: string): Promise<{ username: string; expiresAt: number } | null> {
  if (!cookieValue || typeof cookieValue !== 'string') return null;

  const parts = cookieValue.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(AUTH_SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(sigB64) as unknown as BufferSource,
      enc.encode(payloadB64)
    );

    if (!isValid) return null;

    const jsonStr = new TextDecoder().decode(base64UrlToBytes(payloadB64));
    const payload = JSON.parse(jsonStr);

    if (!payload.username || !payload.expiresAt) return null;
    if (payload.expiresAt <= Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

// Protected dashboard routes requiring legacy authentication
const PROTECTED_PREFIXES = [
  '/overview',
  '/research',
  '/academic',
  '/publications',
  '/service',
  '/services',
  '/ip',
  '/kpi',
  '/personnel',
  '/studio',
  '/evaluation',
  '/monitoring',
  '/manage',
  '/user-roles',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const appPath = stripBasePath(pathname);

  // 1. Bypass public paths, Next.js internal, static assets, and auth API
  if (
    appPath.startsWith('/_next') ||
    appPath.startsWith('/api/v1/auth') ||
    appPath.startsWith('/api/health') ||
    appPath.startsWith('/api/auth') ||
    appPath === '/sso/login' ||
    appPath === '/sso/logout' ||
    appPath === '/forbidden' ||
    appPath === '/unauthorized' ||
    appPath === '/favicon.ico' ||
    appPath.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  // 2. SSO rules evaluation for /admin/* and /user/*
  const ssoDecision = evaluateSsoRules({
    pathname,
    searchParams: request.nextUrl.searchParams,
    hasUserSession: Boolean(request.cookies.get(COOKIE_USER_SESSION)?.value),
  });

  if (ssoDecision.action === 'redirect_portal_session' || ssoDecision.action === 'redirect_sso_login') {
    const origin = getPublicOrigin(request.headers);
    return NextResponse.redirect(new URL(ssoDecision.destination, origin), 307);
  }
  if (ssoDecision.action === 'allow') {
    return NextResponse.next();
  }

  // 3. Existing ku_session legacy behavior
  const kuCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifyKuSessionCookie(kuCookie);

  // If already logged in with ku_session, visiting /login or /auth redirects to /overview
  if (session && (appPath === '/login' || appPath === '/auth')) {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  // Check if route requires ku_session
  const isProtected =
    appPath === '/' || PROTECTED_PREFIXES.some((prefix) => appPath.startsWith(prefix));

  if (isProtected && !session) {
    // Open redirect prevention: must start with / and not //
    const returnUrl = appPath.startsWith('/') && !appPath.startsWith('//') ? appPath : '/overview';
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', returnUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
