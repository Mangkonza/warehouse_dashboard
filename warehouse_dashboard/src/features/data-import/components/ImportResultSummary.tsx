'use client';

import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { ImportOutcome } from '../types';
import { CATEGORY_LABELS_TH } from '../etl/importEtl';
import { CategoryKey } from '@/types/dataManagement';

export interface ImportResultSummaryProps {
  outcome: ImportOutcome;
}

export const ImportResultSummary: React.FC<ImportResultSummaryProps> = ({ outcome }) => {
  const activeCategories = Object.entries(outcome.byCategoryOutcome).filter(
    ([, stats]) => stats.success > 0 || stats.failed > 0
  );

  return (
    <div className="w-full max-w-[42rem] space-y-[1.25rem]">
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-[3.75rem] h-[3.75rem] rounded-full flex items-center justify-center mb-[0.75rem] ${
            outcome.failedCount === 0
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}
        >
          {outcome.failedCount === 0 ? (
            <FaCheckCircle className="text-[1.75rem]" />
          ) : (
            <FaExclamationTriangle className="text-[1.75rem]" />
          )}
        </div>

        <h3 className="text-[1.125rem] font-extrabold text-slate-900">
          {outcome.failedCount === 0
            ? 'นำเข้าข้อมูลเข้าสู่ฐานข้อมูลสำเร็จ'
            : 'นำเข้าข้อมูลเสร็จสิ้น (มีบางรายการไม่สำเร็จ)'}
        </h3>
        <p className="text-[0.8125rem] text-slate-500 mt-[0.25rem]">
          บันทึกสำเร็จ <strong className="text-emerald-700">{outcome.successCount}</strong> จาก{' '}
          {outcome.total} รายการที่ส่งนำเข้า
        </p>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[0.625rem]">
        <div className="p-[0.875rem] rounded-[0.75rem] bg-emerald-50/70 border border-emerald-200 text-center">
          <div className="text-[1.375rem] font-extrabold text-emerald-700 tabular-nums">
            {outcome.successCount}
          </div>
          <div className="text-[0.75rem] font-semibold text-emerald-800">นำเข้าสำเร็จ</div>
        </div>

        <div className="p-[0.875rem] rounded-[0.75rem] bg-rose-50/70 border border-rose-200 text-center">
          <div className="text-[1.375rem] font-extrabold text-rose-700 tabular-nums">
            {outcome.failedCount}
          </div>
          <div className="text-[0.75rem] font-semibold text-rose-800">ไม่สำเร็จ</div>
        </div>

        <div className="p-[0.875rem] rounded-[0.75rem] bg-purple-50/70 border border-purple-200 text-center">
          <div className="text-[1.375rem] font-extrabold text-purple-700 tabular-nums">
            {outcome.duplicateSkipped}
          </div>
          <div className="text-[0.75rem] font-semibold text-purple-800">ข้ามรายการซ้ำ</div>
        </div>

        <div className="p-[0.875rem] rounded-[0.75rem] bg-slate-50 border border-slate-200 text-center">
          <div className="text-[1.375rem] font-extrabold text-slate-700 tabular-nums">
            {outcome.excludedSkipped}
          </div>
          <div className="text-[0.75rem] font-semibold text-slate-600">ยกเว้นการนำเข้า</div>
        </div>
      </div>

      {/* Breakdown by category */}
      {activeCategories.length > 0 && (
        <div className="rounded-[0.75rem] border border-slate-200 bg-slate-50/60 p-[0.875rem] space-y-[0.5rem]">
          <div className="text-[0.75rem] font-bold text-slate-700">สรุปแยกตามหมวดหมู่</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[0.5rem]">
            {activeCategories.map(([cat, stats]) => (
              <div
                key={cat}
                className="flex items-center justify-between px-[0.75rem] py-[0.5rem] rounded-[0.5rem] bg-white border border-slate-200 text-[0.75rem]"
              >
                <span className="font-semibold text-slate-700 truncate">
                  {CATEGORY_LABELS_TH[cat as CategoryKey] || cat}
                </span>
                <span className="font-bold text-emerald-700 tabular-nums shrink-0">
                  สำเร็จ {stats.success}
                  {stats.failed > 0 && (
                    <span className="text-rose-600 ml-[0.375rem]">• ล้มเหลว {stats.failed}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
