'use client';

import React from 'react';
import { StatFilterCard } from '@/components/ui/StatFilterCard';
import { ImportStatusFilter, ImportSummary } from '../types';

export interface ImportSummaryCardsProps {
  summary: ImportSummary;
  activeStatus: ImportStatusFilter;
  onToggleStatus: (status: ImportStatusFilter) => void;
}

export const ImportSummaryCards: React.FC<ImportSummaryCardsProps> = ({
  summary,
  activeStatus,
  onToggleStatus,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-[0.5rem]">
      <StatFilterCard
        label="ทั้งหมด"
        count={summary.total}
        tone="neutral"
        active={activeStatus === 'all'}
        onClick={() => onToggleStatus('all')}
      />

      <StatFilterCard
        label="พร้อมนำเข้า"
        count={summary.ready}
        tone="emerald"
        active={activeStatus === 'ready'}
        onClick={() => onToggleStatus('ready')}
      />

      <StatFilterCard
        label="ต้องแก้ไข"
        count={summary.needsFix}
        tone="rose"
        active={activeStatus === 'error'}
        onClick={() => onToggleStatus('error')}
      />

      <StatFilterCard
        label="ควรตรวจ"
        count={summary.needsReview}
        tone="amber"
        active={activeStatus === 'warning'}
        onClick={() => onToggleStatus('warning')}
      />

      <StatFilterCard
        label="ซ้ำในระบบ"
        count={summary.duplicate}
        tone="slate"
        active={activeStatus === 'duplicate'}
        onClick={() => onToggleStatus('duplicate')}
      />
    </div>
  );
};
