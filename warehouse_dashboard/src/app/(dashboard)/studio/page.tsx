import type { Metadata } from 'next';
import { StudioView } from './_components/StudioView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `วิเคราะห์ข้อมูล | ${SITE_CONFIG.name}`,
};

export default function StudioPage() {
  return <StudioView />;
}
