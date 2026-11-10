import { cookies } from 'next/headers';
import { getBackendUrl } from '@/lib/backendUrl';
import { redirect } from 'next/navigation';
import { AppResource, canAccess } from '@/config/permissions';
import crypto from 'crypto';

const ADMIN_ACCOUNTS = new Set([
  'admin',
  'superadmin',
  'b0123456789',
  'b6520503525',
]);

const CANDIDATE_SECRETS = [
  process.env.AUTH_SESSION_SECRET,
  'a8f4c91b7d3e2a0f8b1c4e9d7a2f0b8c4d9e1f7a2b0c4d8e9f1a2b3c4d5e6f7a',
  'ku_warehouse_auth_session_secret_2026_dev_key',
].filter((s): s is string => Boolean(s && typeof s === 'string' && s.length > 0));

function verifySessionCookieLocally(cookieValue?: string): { username: string; role?: string; expiresAt: number } | null {
  if (!cookieValue || typeof cookieValue !== 'string') return null;
  const parts = cookieValue.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  try {
    const sigBuf = Buffer.from(sigB64, 'base64url');
    let isValid = false;

    for (const secret of Array.from(new Set(CANDIDATE_SECRETS))) {
      const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest();
      if (sigBuf.length === expectedSig.length && crypto.timingSafeEqual(sigBuf, expectedSig)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) return null;

    const json = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!json.username || !json.expiresAt || Number(json.expiresAt) <= Date.now()) return null;

    return {
      username: String(json.username).toLowerCase().trim(),
      role: json.role ? String(json.role) : undefined,
      expiresAt: Number(json.expiresAt),
    };
  } catch {
    return null;
  }
}

/**
 * enforceServerRole: ตรวจสอบสิทธิ์ใน Server Component/Layout
 * - ตรวจสอบความถูกต้องของคุกกี้ ku_session ในหน่วยความจำด้วย HMAC-SHA256 ทันที (ศูนย์ Latency)
 * - ลอง fetch ข้อมูลล่าสุดจาก Backend ด้วย timeout สั้นๆ (2 วินาที)
 * - หาก Backend ติดต่อไม่ได้หรือไม่ตอบสนอง ให้ใช้สิทธิ์ที่ลงนามในคุกกี้/บัญชี Admin ทันทีโดยไม่ค้าง
 */
export async function enforceServerRole(resource: AppResource) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('ku_session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  // 1. ตรวจสอบ Signature ของคุกกี้ทันที
  const verifiedSession = verifySessionCookieLocally(sessionCookie);
  if (!verifiedSession) {
    redirect('/login');
  }

  // 2. ลองดึงข้อมูลผู้ใช้สดจาก Backend (timeout สั้น 2.5 วินาที)
  let userRole: string | undefined = verifiedSession.role;
  let userData: any = null;

  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: `ku_session=${sessionCookie}`,
        'Cache-Control': 'no-store',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    });

    if (res.status === 401 || res.status === 403) {
      redirect('/login');
    }

    if (res.ok) {
      userData = await res.json();
      userRole = userData?.user?.role || userRole;
    }
  } catch (err) {
    // If redirect was already thrown by next/navigation, rethrow it
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err;
    }
    console.warn('[serverAuth] Backend /me fetch failed or timed out, falling back to verified cookie session:', (err as any)?.message || err);
  }

  // 3. หากดึง role จาก Backend ไม่ได้ ให้ใช้ role จาก signed cookie หรือตรวจสอบรายชื่อผู้ดูแลระบบ
  if (!userRole) {
    if (ADMIN_ACCOUNTS.has(verifiedSession.username) || verifiedSession.username === 'admin') {
      userRole = 'admin';
    } else {
      userRole = 'user';
    }
  }

  // 4. ตรวจสอบสิทธิ์ตาม resource
  if (!canAccess(userRole, resource)) {
    redirect('/unauthorized');
  }

  return (
    userData?.user || {
      id: `ku-${verifiedSession.username}`,
      nontriAccount: verifiedSession.username,
      role: userRole,
    }
  );
}
