import type { Metadata } from 'next';
import { ServiceView } from './_components/ServiceView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `งานบริการวิชาการ | ${SITE_CONFIG.name}`,
};

export default function ServicePage() {
  return <ServiceView />;
}
