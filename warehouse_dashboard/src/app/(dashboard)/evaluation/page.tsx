import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { EvaluationView } from './_components/EvaluationView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `การประเมิน | ${SITE_CONFIG.name}`,
};

export default function EvaluationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">กำลังโหลด...</div>}>
      <EvaluationView />
    </Suspense>
  );
}
