import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { StrategicKpiRoundReportView } from '../../_components/StrategicKpiRoundReportView';

export const metadata: Metadata = {
  title: `กรอกผลรายงานตัวชี้วัดตามรอบการรายงานผล | ${SITE_CONFIG.name}`,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StrategicKpiRoundReportPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div style={{ padding: '32px', textAlign: 'center' }}>กำลังโหลดแบบฟอร์มรายงานผล...</div>}>
      <StrategicKpiRoundReportView kpiId={decodeURIComponent(id)} />
    </Suspense>
  );
}
