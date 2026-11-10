import { cookies } from 'next/headers';
import { getBackendUrl } from '@/lib/backendUrl';
import { redirect } from 'next/navigation';
import { AppResource, canAccess } from '@/config/permissions';

/**
 * enforceServerRole: ตรวจสอบสิทธิ์ใน Server Component/Layout
 * ถ้าไม่มี session -> redirect ไป /login
 * ถ้ามี session แต่สิทธิ์ไม่ถึง -> redirect ไป /unauthorized
 */
export async function enforceServerRole(resource: AppResource) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('ku_session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  let backendUrl: string;
  try {
    backendUrl = getBackendUrl();
  } catch {
    // In production without BACKEND_URL, cannot verify → redirect to login
    console.error('[serverAuth] BACKEND_URL not configured');
    redirect('/login');
  }

  try {
    const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        Cookie: `ku_session=${sessionCookie}`,
        'Cache-Control': 'no-store',
      },
      cache: 'no-store',
      // Timeout via signal
      signal: AbortSignal.timeout(10000),
    });

    if (res.status === 401 || res.status === 403) {
      // Session expired or invalid → go to login
      redirect('/login');
    }

    if (!res.ok) {
      console.error(`[serverAuth] Backend /me returned ${res.status}`);
      redirect('/unauthorized');
    }

    const data = await res.json();
    const role = data?.user?.role || 'user';

    if (!canAccess(role, resource)) {
      redirect('/unauthorized');
    }

    return data.user;
  } catch (err) {
    // If redirect was already thrown by next/navigation, rethrow it
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err;
    }
    console.error('[serverAuth] Error verifying session with backend:', err);
    // Network error or timeout → redirect to login (not unauthorized)
    redirect('/login');
  }
}
