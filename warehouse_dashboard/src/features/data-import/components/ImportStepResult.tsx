'use client';

import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ImportOutcome } from '../types';
import { ImportResultSummary } from './ImportResultSummary';
import { ImportFailedList } from './ImportFailedList';

export interface ImportStepResultProps {
  isSaving: boolean;
  saveProgress: { current: number; total: number };
  outcome: ImportOutcome | null;
  onRetryFailed: () => void;
}

export const ImportStepResult: React.FC<ImportStepResultProps> = ({
  isSaving,
  saveProgress,
  outcome,
  onRetryFailed,
}) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center p-[clamp(1.25rem,3vw,2.5rem)] space-y-[1.25rem]">
      {isSaving && (
        <div className="w-full max-w-[30rem] p-[1.75rem] rounded-[1rem] border border-slate-200 bg-slate-50/70 flex flex-col items-center text-center space-y-[1rem]">
          <div className="w-[3.25rem] h-[3.25rem] rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <FaSpinner className="text-[1.5rem] animate-spin" />
          </div>
          <div>
            <h3 className="text-[1rem] font-bold text-slate-900">
              กำลังบันทึกข้อมูลเข้าสู่ระบบ...
            </h3>
            <p className="text-[0.8125rem] text-slate-500 mt-[0.25rem]">
              กรุณาอย่าปิดหน้าต่างนี้ ระบบกำลังประมวลผลทีละชุดข้อมูล
            </p>
          </div>
          <ProgressBar
            current={saveProgress.current}
            total={saveProgress.total}
            label="ความคืบหน้าการนำเข้า"
          />
        </div>
      )}

      {!isSaving && outcome && (
        <>
          <ImportResultSummary outcome={outcome} />
          <ImportFailedList failedRows={outcome.failedRows} onRetryFailed={onRetryFailed} />
        </>
      )}
    </div>
  );
};
