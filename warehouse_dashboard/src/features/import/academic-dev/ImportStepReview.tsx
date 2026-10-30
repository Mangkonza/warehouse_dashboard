'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  FaFileExcel,
  FaRedoAlt,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaSearch,
  FaArrowRight,
  FaEye,
  FaBan,
} from 'react-icons/fa';
import {
  ImportRow,
  Summary,
  SummaryFilterType,
  ParsedSheet,
} from './importAcademicDev.types';
import { ImportReviewTable } from './ImportReviewTable';
import { ImportBulkMenu } from './ImportBulkMenu';
import { cn } from '@/lib/utils';
import { THAI_MONTH_SHORT_MAP } from './importAcademicDev.etl';

interface ImportStepReviewProps {
  fileName: string;
  fileSize: number;
  sheets: ParsedSheet[];
  ignoredSheets: string[];
  rows: ImportRow[];
  summary: Summary;
  onUpdateRowData: (rowId: string, updatedFields: Partial<ImportRow['data']>) => void;
  onToggleExclude: (rowId: string) => void;
  onResetFile: () => void;
  onApplyBatchUpdate: (updater: (row: ImportRow) => Partial<ImportRow['data']> | null) => void;
  onBulkExcludeDuplicates: () => void;
  onBulkExcludeErrors: () => void;
}

export const ImportStepReview: React.FC<ImportStepReviewProps> = ({
  fileName,
  fileSize,
  sheets,
  ignoredSheets,
  rows,
  summary,
  onUpdateRowData,
  onToggleExclude,
  onResetFile,
  onApplyBatchUpdate,
  onBulkExcludeDuplicates,
  onBulkExcludeErrors,
}) => {
  // Filters state
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<SummaryFilterType>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorFocusIndex, setErrorFocusIndex] = useState(0);

  // Filtered rows for table view
  const visibleRows = useMemo(() => {
    return rows.filter((r) => {
      // 1. Month filter
      if (selectedMonth !== 'all' && r.sheetName !== selectedMonth) {
        return false;
      }

      // 2. Summary Card Status filter
      if (selectedStatusFilter === 'ready') {
        if (r.excluded || (r.status !== 'ready' && r.status !== 'warning')) return false;
      } else if (selectedStatusFilter === 'needsFix') {
        if (r.excluded || r.status !== 'error') return false;
      } else if (selectedStatusFilter === 'needsReview') {
        if (r.excluded || r.status !== 'warning') return false;
      } else if (selectedStatusFilter === 'skipped') {
        if (!r.excluded && r.status !== 'duplicate') return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const pName = (r.data.name || '').toLowerCase();
        const hName = (r.data.head_name || '').toLowerCase();
        const client = (r.data.client || '').toLowerCase();
        const recNum = (r.data.record_number || '').toLowerCase();
        if (!pName.includes(q) && !hName.includes(q) && !client.includes(q) && !recNum.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [rows, selectedMonth, selectedStatusFilter, searchQuery]);

  // Jump to next error row
  const handleJumpToNextError = useCallback(() => {
    const errorRows = rows.filter((r) => !r.excluded && r.status === 'error');
    if (errorRows.length === 0) return;

    const nextIdx = errorFocusIndex >= errorRows.length ? 0 : errorFocusIndex;
    const targetRow = errorRows[nextIdx];
    setErrorFocusIndex((nextIdx + 1) % errorRows.length);

    // If target row is in a different month, switch to that month or "all"
    if (selectedMonth !== 'all' && targetRow.sheetName !== selectedMonth) {
      setSelectedMonth('all');
    }
    if (selectedStatusFilter !== 'all' && selectedStatusFilter !== 'needsFix') {
      setSelectedStatusFilter('needsFix');
    }

    setTimeout(() => {
      const elem = document.getElementById(`row-${targetRow.rowId}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        elem.classList.add('ring-2', 'ring-rose-500', 'ring-offset-2');
        setTimeout(() => {
          elem.classList.remove('ring-2', 'ring-rose-500', 'ring-offset-2');
        }, 1800);
      }
    }, 50);
  }, [rows, errorFocusIndex, selectedMonth, selectedStatusFilter]);

  // Bulk operation handlers
  const handleFillMonthDates = useCallback(() => {
    onApplyBatchUpdate((r) => {
      if (r.data.start_date && r.data.end_date) return null;

      // Extract month number from sheet name
      let monthNum = 1;
      for (const [key, val] of Object.entries(THAI_MONTH_SHORT_MAP)) {
        if (r.sheetName.includes(key)) {
          monthNum = val.monthNumber;
          break;
        }
      }

      const yearBE = r.data.fiscal_year || 2568;
      const yearCE = yearBE - 543;

      // Day 1 to last day of month
      const startDay = '01';
      const mStr = String(monthNum).padStart(2, '0');
      const lastDayNum = new Date(yearCE, monthNum, 0).getDate();
      const endDay = String(lastDayNum).padStart(2, '0');

      return {
        start_date: r.data.start_date || `${yearCE}-${mStr}-${startDay}`,
        end_date: r.data.end_date || `${yearCE}-${mStr}-${endDay}`,
      };
    });
  }, [onApplyBatchUpdate]);

  const handleApplyBatchDate = useCallback(
    (startDate: string, endDate: string) => {
      onApplyBatchUpdate((r) => {
        if (r.data.start_date && r.data.end_date) return null;
        return {
          start_date: r.data.start_date || startDate,
          end_date: r.data.end_date || endDate,
        };
      });
    },
    [onApplyBatchUpdate]
  );

  const handleApplyBatchDept = useCallback(
    (deptCode: string) => {
      onApplyBatchUpdate((r) => {
        if (r.data.department_code) return null;
        return { department_code: deptCode };
      });
    },
    [onApplyBatchUpdate]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden space-y-3">
      {/* 1. Header Toolbar (~190px height reserved) */}
      <div className="shrink-0 space-y-2.5">
        {/* (ก) แถบไฟล์ */}
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div className="flex items-center gap-2 truncate">
            <FaFileExcel className="text-emerald-600 text-sm shrink-0" />
            <span className="font-bold text-slate-800 truncate">{fileName}</span>
            <span className="text-slate-400">({formatFileSize(fileSize)})</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">{sheets.length} แผ่นงานเดือน</span>
          </div>

          <button
            type="button"
            onClick={onResetFile}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg font-semibold transition-colors"
          >
            <FaRedoAlt className="text-[11px]" />
            <span>เปลี่ยนไฟล์</span>
          </button>
        </div>

        {/* (ข) Alert แสดงสถานะที่รุนแรงที่สุด (จองความสูงคงที่) */}
        <div className="h-[52px] flex items-center justify-between px-4 rounded-xl border transition-all text-xs">
          {summary.needsFix > 0 ? (
            <div className="w-full flex items-center justify-between text-rose-800 bg-rose-50/70 border border-rose-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 font-medium">
                <FaTimesCircle className="text-rose-500 text-base shrink-0" />
                <span>
                  พบ <strong className="font-bold text-rose-700 underline">{summary.needsFix} แถว</strong> ข้อมูลไม่ครบถ้วน จะไม่ถูกนำเข้าจนกว่าจะแก้ไข
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleJumpToNextError}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  <FaArrowRight className="text-[10px]" />
                  <span>ไปแถวที่ต้องแก้</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatusFilter('needsFix')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold transition-colors"
                >
                  <FaEye className="text-[10px]" />
                  <span>ดูเฉพาะแถวนี้</span>
                </button>
              </div>
            </div>
          ) : summary.needsReview > 0 ? (
            <div className="w-full flex items-center justify-between text-amber-800 bg-amber-50/70 border border-amber-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 font-medium">
                <FaExclamationTriangle className="text-amber-500 text-base shrink-0" />
                <span>
                  พบ <strong className="font-bold text-amber-700">{summary.needsReview} แถว</strong> ที่ควรตรวจทาน (นำเข้าได้)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStatusFilter('needsReview')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-lg font-semibold transition-colors"
              >
                <span>ดูแถวที่ควรตรวจทาน</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center text-emerald-800 bg-emerald-50/70 border border-emerald-200 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 font-medium">
                <FaCheckCircle className="text-emerald-500 text-base shrink-0" />
                <span>
                  ข้อมูลครบถ้วนสมบูรณ์ พร้อมนำเข้า <strong className="font-bold text-emerald-700">{summary.willImport} รายการ</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Ignored Sheets info line if any */}
        {ignoredSheets.length > 0 && (
          <div className="text-[11px] text-slate-400 px-1 truncate">
            ℹ️ แผ่นงานที่ไม่เข้าข่ายเดือน (ข้าม): {ignoredSheets.join(', ')}
          </div>
        )}

        {/* (ค) การ์ดสรุป 5 ใบ (ตัวกรองในตัว) ความสูง ~64px */}
        <div className="grid grid-cols-5 gap-2 h-[64px]">
          {/* Card 1: ทั้งหมด */}
          <button
            type="button"
            onClick={() => setSelectedStatusFilter('all')}
            className={cn(
              'flex flex-col justify-center items-center rounded-xl p-2 border transition-all text-center',
              selectedStatusFilter === 'all'
                ? 'bg-slate-100 border-slate-400 shadow-xs ring-2 ring-slate-400/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
            )}
          >
            <span className="text-[11px] font-medium text-slate-500">ทั้งหมด</span>
            <span className="text-lg font-bold text-slate-800 leading-tight">{summary.total}</span>
          </button>

          {/* Card 2: พร้อมนำเข้า */}
          <button
            type="button"
            onClick={() => setSelectedStatusFilter('ready')}
            className={cn(
              'flex flex-col justify-center items-center rounded-xl p-2 border transition-all text-center',
              selectedStatusFilter === 'ready'
                ? 'bg-emerald-100/80 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                : 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/60'
            )}
          >
            <span className="text-[11px] font-medium text-emerald-700">พร้อมนำเข้า</span>
            <span className="text-lg font-bold text-emerald-700 leading-tight">{summary.willImport}</span>
          </button>

          {/* Card 3: ต้องแก้ไข (แดง) */}
          <button
            type="button"
            onClick={() => setSelectedStatusFilter('needsFix')}
            className={cn(
              'flex flex-col justify-center items-center rounded-xl p-2 border transition-all text-center',
              selectedStatusFilter === 'needsFix'
                ? 'bg-rose-100/80 border-rose-500 shadow-xs ring-2 ring-rose-500/20'
                : 'bg-rose-50/60 border-rose-200 hover:bg-rose-100/60'
            )}
          >
            <span className="text-[11px] font-medium text-rose-700">ต้องแก้ไข</span>
            <span className="text-lg font-bold text-rose-700 leading-tight">{summary.needsFix}</span>
          </button>

          {/* Card 4: ควรตรวจทาน (เหลือง) */}
          <button
            type="button"
            onClick={() => setSelectedStatusFilter('needsReview')}
            className={cn(
              'flex flex-col justify-center items-center rounded-xl p-2 border transition-all text-center',
              selectedStatusFilter === 'needsReview'
                ? 'bg-amber-100/80 border-amber-500 shadow-xs ring-2 ring-amber-500/20'
                : 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/60'
            )}
          >
            <span className="text-[11px] font-medium text-amber-700">ควรตรวจทาน</span>
            <span className="text-lg font-bold text-amber-700 leading-tight">{summary.needsReview}</span>
          </button>

          {/* Card 5: ซ้ำ / ข้าม (เทา) */}
          <button
            type="button"
            onClick={() => setSelectedStatusFilter('skipped')}
            className={cn(
              'flex flex-col justify-center items-center rounded-xl p-2 border transition-all text-center',
              selectedStatusFilter === 'skipped'
                ? 'bg-slate-200 border-slate-400 shadow-xs ring-2 ring-slate-400/20'
                : 'bg-slate-100/70 border-slate-200 hover:bg-slate-200/60'
            )}
          >
            <span className="text-[11px] font-medium text-slate-500">ซ้ำ / ข้าม</span>
            <span className="text-lg font-bold text-slate-600 leading-tight">
              {summary.duplicate + summary.excluded}
            </span>
          </button>
        </div>

        {/* (ง) แถบเครื่องมือ 1 บรรทัด */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            {/* Month Select */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 shadow-xs focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">ทุกเดือน ({summary.total})</option>
              {sheets.map((s) => (
                <option key={s.sheetName} value={s.sheetName} disabled={s.rowCount === 0}>
                  {s.sheetName} ({s.rowCount}){s.rowCount === 0 ? ' — ไม่มีข้อมูล' : ''}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อโครงการ, หัวหน้าโครงการ, ผู้ว่าจ้าง..."
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Bulk Edit Menu */}
          <ImportBulkMenu
            filteredRows={visibleRows}
            onApplyFillMonthDates={handleFillMonthDates}
            onApplyBatchDate={handleApplyBatchDate}
            onApplyBatchDepartment={handleApplyBatchDept}
            onExcludeDuplicates={onBulkExcludeDuplicates}
            onExcludeErrors={onBulkExcludeErrors}
          />
        </div>
      </div>

      {/* (จ) ตารางหลัก (ยืดหยุ่นเต็มพื้นที่ที่เหลือ) */}
      <ImportReviewTable
        rows={visibleRows}
        onUpdateRowData={onUpdateRowData}
        onToggleExclude={onToggleExclude}
      />
    </div>
  );
};
