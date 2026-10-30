import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/guard';
import { canAccess } from '@/lib/auth/normalizeRoles';
import { APP_ROUTES } from '@/lib/auth/paths';
import { SsoUserProvider } from '@/features/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAuth();

  if (auth.status === 'unauthenticated' || auth.status === 'error') {
    redirect(APP_ROUTES.ssoLogout);
  }

  if (!canAccess('admin', auth.roles)) {
    redirect(APP_ROUTES.forbidden);
  }

  return <SsoUserProvider>{children}</SsoUserProvider>;
}
