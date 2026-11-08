import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { ReportingRoundsSettingsView } from '../_components/ReportingRoundsSettingsView';

export const metadata: Metadata = {
  title: `ตั้งค่ารอบการรายงานผล | ${SITE_CONFIG.name}`,
};

export default function KpiReportingRoundsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">กำลังโหลด...</div>}>
      <ReportingRoundsSettingsView />
    </Suspense>
  );
}
