'use client';

import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { ImportSummary } from '../types';
import { ImportAdvancedOptions } from './ImportAdvancedOptions';
import { cn } from '@/lib/utils';

export interface ImportFooterProps {
  globalSummary: ImportSummary;
  importMode: 'append' | 'overwrite';
  onChangeMode: (mode: 'append' | 'overwrite') => void;
  onCancel: () => void;
  onConfirmImport: () => void;
}

export const ImportFooter: React.FC<ImportFooterProps> = ({
  globalSummary,
  importMode,
  onChangeMode,
  onCancel,
  onConfirmImport,
}) => {
  const skippedCount = globalSummary.duplicate + globalSummary.excluded;

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-[0.75rem]">
      {/* Left: Cancel + Advanced Options */}
      <div className="flex items-center gap-[0.625rem]">
        <button
          type="button"
          onClick={onCancel}
          className="px-[1rem] py-[0.5rem] rounded-[0.625rem] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[0.8125rem] font-semibold transition-colors cursor-pointer"
        >
          ยกเลิก
        </button>

        <ImportAdvancedOptions importMode={importMode} onChangeMode={onChangeMode} />
      </div>

      {/* Right: Summary + Single Confirm Button */}
      <div className="flex items-center gap-[1rem] ml-auto">
        <div className="text-[0.75rem] text-slate-600 hidden sm:block">
          พร้อมนำเข้า{' '}
          <strong className="text-emerald-700 font-bold tabular-nums">
            {globalSummary.willImport}
          </strong>
          {globalSummary.needsFix > 0 && (
            <>
              {' • '}ต้องแก้{' '}
              <strong className="text-rose-600 font-bold tabular-nums">
                {globalSummary.needsFix}
              </strong>
            </>
          )}
          {skippedCount > 0 && (
            <>
              {' • '}ข้าม{' '}
              <strong className="text-slate-500 font-bold tabular-nums">
                {skippedCount}
              </strong>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onConfirmImport}
          disabled={globalSummary.willImport === 0}
          className={cn(
            'inline-flex items-center gap-[0.5rem] px-[1.25rem] py-[0.5625rem] rounded-[0.75rem] text-[0.875rem] font-bold transition-all cursor-pointer',
            globalSummary.willImport > 0
              ? 'bg-[#00A651] hover:bg-[#008f45] active:bg-[#007a3a] text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          <FaCheck className="text-[0.75rem]" />
          <span>ยืนยันนำเข้า {globalSummary.willImport} รายการ</span>
        </button>
      </div>
    </div>
  );
};
