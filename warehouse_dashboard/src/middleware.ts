import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'ku_session';
const AUTH_SESSION_SECRET =
  process.env.AUTH_SESSION_SECRET || 'ku_warehouse_auth_session_secret_2026_dev_key';

// Helper to decode base64url to Uint8Array in Edge runtime
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

// Verify HMAC-SHA256 signature and expiration
async function verifySessionCookie(cookieValue?: string): Promise<{ username: string; expiresAt: number } | null> {
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

// Protected dashboard routes requiring authentication
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
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ยกเว้น public paths, Next.js internal, static assets, และ auth API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/v1/auth') ||
    pathname.startsWith('/api/health') ||
    pathname === '/unauthorized' ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionCookie(sessionCookie);

  // 2. ถ้าล็อกอินแล้ว แล้วเข้ามาที่ /login หรือ /auth ให้ redirect ไปที่ /overview
  if (session && (pathname === '/login' || pathname === '/auth')) {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  // 3. ตรวจสอบว่าเส้นทางนี้ต้องล็อกอินหรือไม่
  const isProtected =
    pathname === '/' || PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !session) {
    // ป้องกัน open redirect: ต้องขึ้นต้นด้วย / และไม่ใช่ //
    const returnUrl = pathname.startsWith('/') && !pathname.startsWith('//') ? pathname : '/overview';
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
