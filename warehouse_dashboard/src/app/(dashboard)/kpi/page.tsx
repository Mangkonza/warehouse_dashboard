import type { Metadata } from 'next';
import { KPIView } from './_components/KPIView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `ติดตามตัวชี้วัด (KPI) | ${SITE_CONFIG.name}`,
};

export default function KPIPage() {
  return <KPIView />;
}
