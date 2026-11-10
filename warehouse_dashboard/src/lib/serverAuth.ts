import { cookies } from 'next/headers';
import { getBackendUrl } from '@/lib/backendUrl';
import { redirect } from 'next/navigation';
import { AppResource, canAccess } from '@/config/permissions';
import { withBasePath } from '@/lib/auth/paths';

/**
 * enforceServerRole: ตรวจสอบสิทธิ์ใน Server Component/Layout
 * ถ้าไม่มี session -> redirect ไป /login
 * ถ้ามี session แต่สิทธิ์ไม่ถึง -> redirect ไป /unauthorized
 */
export async function enforceServerRole(resource: AppResource) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('ku_session')?.value;

  if (!sessionCookie) {
    redirect(withBasePath('/login'));
  }

  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
      headers: {
        Cookie: `ku_session=${sessionCookie}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      redirect(withBasePath('/login'));
    }

    const data = await res.json();
    const role = data?.user?.role || 'user';

    if (!canAccess(role, resource)) {
      redirect(withBasePath('/unauthorized'));
    }

    return data.user;
  } catch (err) {
    // If redirect was already thrown by next/navigation, rethrow it
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err;
    }
    console.error('[serverAuth] Error verifying session with backend:', err);
    redirect(withBasePath('/unauthorized'));
  }
}
