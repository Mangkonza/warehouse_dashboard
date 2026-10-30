'use client';

import React from 'react';
import {
  FaArrowUp,
  FaArrowDown,
  FaBan,
  FaUndo,
  FaTimes,
  FaArrowLeft,
} from 'react-icons/fa';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ImportRow } from '../types';
import { cn } from '@/lib/utils';

export interface ImportDetailHeaderProps {
  row: ImportRow;
  rowIndex: number;
  totalVisible: number;
  onPrev: () => void;
  onNext: () => void;
  onToggleExclude: (rowId: string) => void;
  onClose: () => void;
}

export const ImportDetailHeader: React.FC<ImportDetailHeaderProps> = ({
  row,
  rowIndex,
  totalVisible,
  onPrev,
  onNext,
  onToggleExclude,
  onClose,
}) => {
  return (
    <div className="shrink-0 px-[1rem] py-[0.75rem] border-b border-slate-200 bg-white flex items-center justify-between gap-[0.5rem]">
      {/* Left: Back button on mobile/tablet + Row info */}
      <div className="flex items-center gap-[0.5rem] min-w-0">
        <button
          type="button"
          onClick={onClose}
          className="imp-detail-back-btn inline-flex items-center gap-[0.375rem] px-[0.625rem] py-[0.3125rem] rounded-[0.5rem] border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[0.75rem] font-bold cursor-pointer shrink-0"
        >
          <FaArrowLeft className="text-[0.6875rem]" />
          <span>กลับไปรายการ</span>
        </button>

        <div className="flex items-center gap-[0.375rem] min-w-0 flex-wrap">
          <span className="text-[0.8125rem] font-extrabold text-slate-900 tabular-nums">
            แถว #{rowIndex >= 0 ? rowIndex + 1 : row.excelRowNumber}
          </span>
          <span className="text-[0.75rem] text-slate-400">•</span>
          <span className="text-[0.75rem] font-bold text-emerald-700 truncate">
            {row.categoryLabel}
          </span>
          <span className="text-[0.75rem] text-slate-400">•</span>
          <span className="text-[0.75rem] text-slate-500 truncate">
            ชีต {row.sheetName}
          </span>
          <StatusBadge variant={row.excluded ? 'excluded' : row.status} />
        </div>
      </div>

      {/* Right controls: Prev/Next + Exclude + Close */}
      <div className="flex items-center gap-[0.375rem] shrink-0">
        <div className="flex items-center rounded-[0.5rem] border border-slate-200 bg-slate-50 p-[0.125rem]">
          <button
            type="button"
            disabled={totalVisible <= 1}
            onClick={onPrev}
            title="แถวก่อนหน้า (↑)"
            className="w-[1.625rem] h-[1.625rem] rounded-[0.375rem] flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-40 cursor-pointer"
          >
            <FaArrowUp className="text-[0.6875rem]" />
          </button>
          <button
            type="button"
            disabled={totalVisible <= 1}
            onClick={onNext}
            title="แถวถัดไป (↓)"
            className="w-[1.625rem] h-[1.625rem] rounded-[0.375rem] flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-40 cursor-pointer"
          >
            <FaArrowDown className="text-[0.6875rem]" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onToggleExclude(row.rowId)}
          className={cn(
            'inline-flex items-center gap-[0.3125rem] px-[0.625rem] py-[0.3125rem] rounded-[0.5rem] border text-[0.75rem] font-bold transition-colors cursor-pointer',
            row.excluded
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
          )}
        >
          {row.excluded ? (
            <>
              <FaUndo className="text-[0.6875rem]" />
              <span>คืนค่า</span>
            </>
          ) : (
            <>
              <FaBan className="text-[0.6875rem]" />
              <span>ไม่นำเข้า</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          title="ปิดแผงแก้ไข (Esc)"
          className="w-[1.875rem] h-[1.875rem] rounded-[0.5rem] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <FaTimes className="text-[0.875rem]" />
        </button>
      </div>
    </div>
  );
};
