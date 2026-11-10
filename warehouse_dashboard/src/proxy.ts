import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { stripBasePath } from '@/lib/auth/paths';

const SESSION_COOKIE_NAME = 'ku_session';

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

// Verify HMAC-SHA256 signature and expiration for ku_session
async function verifyKuSessionCookie(cookieValue?: string): Promise<{ username: string; expiresAt: number } | null> {
  if (!cookieValue || typeof cookieValue !== 'string') return null;

  const parts = cookieValue.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  try {
    const enc = new TextEncoder();
    const secrets = [
      process.env.AUTH_SESSION_SECRET,
      'a8f4c91b7d3e2a0f8b1c4e9d7a2f0b8c4d9e1f7a2b0c4d8e9f1a2b3c4d5e6f7a',
      'ku_warehouse_auth_session_secret_2026_dev_key',
    ].filter((s): s is string => Boolean(s && typeof s === 'string' && s.length > 0));

    const candidateSecrets = Array.from(new Set(secrets));
    let isValid = false;

    for (const secret of candidateSecrets) {
      try {
        const key = await crypto.subtle.importKey(
          'raw',
          enc.encode(secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['verify']
        );

        const verified = await crypto.subtle.verify(
          'HMAC',
          key,
          base64UrlToBytes(sigB64) as unknown as BufferSource,
          enc.encode(payloadB64)
        );

        if (verified) {
          isValid = true;
          break;
        }
      } catch {
        // try next candidate
      }
    }

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

// Protected dashboard routes requiring authentication
const ADMIN_PROTECTED_PREFIXES = [
  '/kpi',
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
    appPath === '/login' ||
    appPath === '/forbidden' ||
    appPath === '/unauthorized' ||
    appPath === '/favicon.ico' ||
    appPath.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Root path redirects to overview
  if (appPath === '/') {
    const overviewUrl = request.nextUrl.clone();
    overviewUrl.pathname = '/overview';
    return NextResponse.redirect(overviewUrl, 307);
  }

  // 3. Check ku_session cookie for protected routes
  const kuCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifyKuSessionCookie(kuCookie);
  const isAuthenticated = Boolean(session);

  const isAdminProtected = ADMIN_PROTECTED_PREFIXES.some((prefix) => appPath.startsWith(prefix));

  if (isAdminProtected && !isAuthenticated) {
    const returnUrl = appPath && appPath !== '/' && appPath.startsWith('/') && !appPath.startsWith('//') ? appPath : '/overview';
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('returnUrl', returnUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
