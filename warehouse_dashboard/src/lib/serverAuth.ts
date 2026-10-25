import { cookies } from 'next/headers';
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

  try {
    const backendUrl = process.env.INTERNAL_BACKEND_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
      headers: {
        Cookie: `ku_session=${sessionCookie}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      redirect('/login');
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
    redirect('/unauthorized');
  }
}
