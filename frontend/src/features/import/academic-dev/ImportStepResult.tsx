'use client';

import React from 'react';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSpinner,
  FaRedoAlt,
  FaDownload,
  FaTimes,
} from 'react-icons/fa';
import { ImportResultOutcome, ImportRow } from './importAcademicDev.types';
import { cn } from '@/lib/utils';

interface ImportStepResultProps {
  isSaving: boolean;
  saveProgress: { current: number; total: number };
  outcome: ImportResultOutcome | null;
  onRetryFailed: () => void;
  onClose: () => void;
}

export const ImportStepResult: React.FC<ImportStepResultProps> = ({
  isSaving,
  saveProgress,
  outcome,
  onRetryFailed,
  onClose,
}) => {
  // Download excluded/failed rows as CSV
  const handleDownloadCsv = () => {
    if (!outcome) return;
    const header = ['ชื่อโครงการ', 'หัวหน้าโครงการ', 'สังกัด', 'งบประมาณ', 'วันเริ่มต้น', 'วันสิ้นสุด', 'สาเหตุ'];
    const rows = outcome.failedRows.map((f) => [
      `"${(f.row.data.name || '').replace(/"/g, '""')}"`,
      `"${(f.row.data.head_name || '').replace(/"/g, '""')}"`,
      `"${f.row.data.department_code || ''}"`,
      f.row.data.budget || 0,
      `"${f.row.data.start_date || ''}"`,
      `"${f.row.data.end_date || ''}"`,
      `"${f.reason.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `รายการนำเข้าไม่สำเร็จ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // During active saving
  if (isSaving) {
    const percent =
      saveProgress.total > 0
        ? Math.min(100, Math.round((saveProgress.current / saveProgress.total) * 100))
        : 0;

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <FaSpinner className="text-3xl animate-spin text-emerald-600" />
        </div>

        <div className="space-y-2 w-full">
          <h3 className="text-base font-bold text-slate-800">กำลังบันทึกข้อมูลเข้าสู่ระบบ Data Warehouse...</h3>
          <p className="text-xs text-slate-500">
            กำลังประมวลผลและจัดเก็บ: <strong className="text-emerald-700 font-bold">{saveProgress.current}</strong> จาก{' '}
            <strong>{saveProgress.total}</strong> รายการ
          </p>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-4">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">{percent}%</div>
        </div>

        <p className="text-[11px] text-slate-400">กรุณาอย่าปิดหน้าต่างจนกว่าการนำเข้าจะเสร็จสิ้น</p>
      </div>
    );
  }

  // Once finished
  if (!outcome) return null;

  const hasFailed = outcome.failedCount > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-5 p-6 max-w-4xl mx-auto w-full">
      {/* 1. Outcome Alert Banner */}
      <div
        className={cn(
          'p-5 rounded-2xl border text-sm flex items-start gap-4',
          hasFailed
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        )}
      >
        {hasFailed ? (
          <FaExclamationTriangle className="text-2xl text-amber-500 shrink-0 mt-0.5" />
        ) : (
          <FaCheckCircle className="text-2xl text-emerald-500 shrink-0 mt-0.5" />
        )}

        <div className="flex-1 space-y-1">
          <h4 className="text-base font-bold">
            {hasFailed ? 'นำเข้าข้อมูลเสร็จสิ้น โดยมีบางรายการไม่สำเร็จ' : 'นำเข้าข้อมูลเข้าสู่ระบบเรียบร้อยแล้ว'}
          </h4>
          <p className="text-xs opacity-90 leading-relaxed">
            สำเร็จ <strong>{outcome.successCount}</strong> รายการ • ล้มเหลว{' '}
            <strong className={outcome.failedCount > 0 ? 'text-rose-600 font-bold' : ''}>
              {outcome.failedCount}
            </strong>{' '}
            รายการ • ข้าม (ซ้ำ) <strong>{outcome.duplicateSkipped}</strong> รายการ • ไม่นำเข้า (ยกเว้น/ต้องแก้){' '}
            <strong>{outcome.excludedSkipped}</strong> รายการ
          </p>
        </div>
      </div>

      {/* 2. Results Cards Grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-emerald-200 rounded-xl text-center">
          <div className="text-xs text-emerald-700 font-medium">นำเข้าสำเร็จ</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{outcome.successCount}</div>
        </div>

        <div className="p-3 bg-white border border-rose-200 rounded-xl text-center">
          <div className="text-xs text-rose-700 font-medium">ล้มเหลว</div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{outcome.failedCount}</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
          <div className="text-xs text-slate-500 font-medium">ข้ามรายการซ้ำ</div>
          <div className="text-2xl font-bold text-slate-700 mt-1">{outcome.duplicateSkipped}</div>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl text-center">
          <div className="text-xs text-slate-500 font-medium">ยกเว้น / ไม่นำเข้า</div>
          <div className="text-2xl font-bold text-slate-700 mt-1">{outcome.excludedSkipped}</div>
        </div>
      </div>

      {/* 3. Failed Rows Table if any */}
      {hasFailed && (
        <div className="flex-1 min-h-0 flex flex-col space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
              <FaTimesCircle className="text-rose-500" />
              <span>รายการที่ไม่สามารถบันทึกได้ ({outcome.failedRows.length})</span>
            </h5>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <FaDownload className="text-[11px]" />
                <span>ดาวน์โหลด CSV รายการที่ล้มเหลว</span>
              </button>

              <button
                type="button"
                onClick={onRetryFailed}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <FaRedoAlt className="text-[11px]" />
                <span>ลองนำเข้ารายการที่ล้มเหลวอีกครั้ง</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto border border-slate-100 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-3 py-2 w-12">#</th>
                  <th className="px-3 py-2">ชื่อโครงการ</th>
                  <th className="px-3 py-2 w-48">สาเหตุที่ล้มเหลว</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outcome.failedRows.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-2 font-medium text-slate-800 line-clamp-1">{f.row.data.name}</td>
                    <td className="px-3 py-2 text-rose-600 font-medium">{f.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Action buttons at bottom of results */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
        >
          เสร็จสิ้นและปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};
