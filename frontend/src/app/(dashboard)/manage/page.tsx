import type { Metadata } from 'next';
import { ManageView } from './_components/ManageView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `ระบบจัดการข้อมูล | ${SITE_CONFIG.name}`,
};

export default function ManagePage() {
  return <ManageView />;
}
