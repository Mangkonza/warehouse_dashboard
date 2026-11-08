import type { Metadata } from 'next';
import { PublicationsView } from './_components/PublicationsView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `ผลงานตีพิมพ์ทางวิชาการ | ${SITE_CONFIG.name}`,
};

export default function PublicationsPage() {
  return <PublicationsView />;
}
