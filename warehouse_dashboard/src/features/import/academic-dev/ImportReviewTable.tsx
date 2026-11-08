'use client';

import React, { useState, useCallback } from 'react';
import { ImportRow } from './importAcademicDev.types';
import { ImportReviewRow } from './ImportReviewRow';

interface ImportReviewTableProps {
  rows: ImportRow[];
  onUpdateRowData: (rowId: string, updatedFields: Partial<ImportRow['data']>) => void;
  onToggleExclude: (rowId: string) => void;
}

export const ImportReviewTable: React.FC<ImportReviewTableProps> = ({
  rows,
  onUpdateRowData,
  onToggleExclude,
}) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleToggleExpand = useCallback((rowId: string) => {
    setExpandedRowId((prev) => (prev === rowId ? null : rowId));
  }, []);

  if (rows.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <div className="text-3xl mb-2">🔍</div>
        <p className="text-sm font-semibold text-slate-600">ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา/ตัวกรอง</p>
        <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนตัวเลือกเดือน หรือรีเซ็ตการค้นหา</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto border border-slate-200 rounded-xl bg-white shadow-xs">
      <table className="w-full border-collapse text-left text-sm table-fixed">
        <thead className="sticky top-0 z-30 bg-slate-50 text-[13px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 shadow-xs">
          <tr>
            <th className="sticky left-0 z-30 w-[48px] px-2 py-3 text-center bg-slate-50 border-r border-slate-200 shadow-[1px_0_2px_rgba(0,0,0,0.02)]">
              #
            </th>
            <th className="sticky left-[48px] z-30 w-[120px] px-2 py-3 text-center bg-slate-50 border-r border-slate-200 shadow-[2px_0_3px_rgba(0,0,0,0.03)]">
              สถานะ
            </th>
            <th className="w-[80px] px-2 py-3 text-center">เดือน</th>
            <th className="min-w-[280px] px-3 py-3">ชื่อโครงการพัฒนาวิชาการ</th>
            <th className="w-[200px] px-2 py-3">หัวหน้าโครงการ</th>
            <th className="w-[130px] px-2 py-3">สังกัด</th>
            <th className="w-[120px] px-2 py-3 text-right">งบประมาณ (บาท)</th>
            <th className="w-[130px] px-2 py-3">เริ่มดำเนินการ</th>
            <th className="w-[130px] px-2 py-3">สิ้นสุดดำเนินการ</th>
            <th className="w-[96px] px-2 py-3 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, idx) => (
            <ImportReviewRow
              key={row.rowId}
              row={row}
              displayIndex={idx + 1}
              isExpanded={expandedRowId === row.rowId}
              onToggleExpand={handleToggleExpand}
              onUpdateRowData={onUpdateRowData}
              onToggleExclude={onToggleExclude}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
