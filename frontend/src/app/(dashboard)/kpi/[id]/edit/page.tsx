import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { StrategicKpiFormView } from '../../_components/StrategicKpiFormView';

export const metadata: Metadata = {
  title: `แก้ไขตัวชี้วัดตามแผนยุทธศาสตร์ | ${SITE_CONFIG.name}`,
};

interface EditStrategicKpiPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStrategicKpiPage({ params }: EditStrategicKpiPageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">กำลังโหลด...</div>}>
      <StrategicKpiFormView kpiId={id} />
    </Suspense>
  );
}
