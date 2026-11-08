import type { Metadata } from 'next';
import { MonitoringView } from './_components/MonitoringView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `ติดตามสถานะโครงการ | ${SITE_CONFIG.name}`,
};

export default function MonitoringPage() {
  return <MonitoringView />;
}
