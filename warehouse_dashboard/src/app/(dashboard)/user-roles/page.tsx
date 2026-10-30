import type { Metadata } from 'next';
import { UserRolesView } from './_components/UserRolesView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `การจัดการสิทธิ์ผู้เข้าใช้งาน | ${SITE_CONFIG.name}`,
};

export default function UserRolesPage() {
  return <UserRolesView />;
}
