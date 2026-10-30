'use client';

import React from 'react';
import { FaFileExcel, FaExchangeAlt } from 'react-icons/fa';

export interface ImportFileBarProps {
  fileName: string;
  fileSize: number;
  sheetCount: number;
  totalRows: number;
  onResetFile: () => void;
}

export const ImportFileBar: React.FC<ImportFileBarProps> = ({
  fileName,
  fileSize,
  sheetCount,
  totalRows,
  onResetFile,
}) => {
  const sizeKb = fileSize > 0 ? `${(fileSize / 1024).toFixed(1)} KB` : '';

  return (
    <div className="flex items-center justify-between gap-[0.75rem] flex-wrap">
      <div className="flex items-center gap-[0.5rem] min-w-0">
        <FaFileExcel className="text-emerald-600 text-[0.9375rem] shrink-0" />
        <span className="font-bold text-slate-800 text-[0.8125rem] truncate max-w-[24rem]" title={fileName}>
          {fileName}
        </span>
        {sizeKb && (
          <span className="text-[0.75rem] text-slate-400 shrink-0">({sizeKb})</span>
        )}
        <span className="text-[0.75rem] text-slate-500 bg-slate-100 px-[0.5rem] py-[0.125rem] rounded-[0.375rem] shrink-0">
          อ่านได้ {sheetCount} ชีต • {totalRows} แถว
        </span>
      </div>

      <button
        type="button"
        onClick={onResetFile}
        className="inline-flex items-center gap-[0.375rem] px-[0.625rem] py-[0.25rem] rounded-[0.5rem] border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[0.75rem] font-semibold transition-colors cursor-pointer shrink-0"
      >
        <FaExchangeAlt className="text-[0.6875rem]" />
        <span>เปลี่ยนไฟล์</span>
      </button>
    </div>
  );
};
