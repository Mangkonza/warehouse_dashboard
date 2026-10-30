'use client';

import React from 'react';
import { FaRedo } from 'react-icons/fa';
import { ImportFailedItem } from '../types';

export interface ImportFailedListProps {
  failedRows: ImportFailedItem[];
  onRetryFailed: () => void;
}

export const ImportFailedList: React.FC<ImportFailedListProps> = ({
  failedRows,
  onRetryFailed,
}) => {
  if (failedRows.length === 0) return null;

  return (
    <div className="w-full max-w-[42rem] rounded-[0.75rem] border border-rose-200 bg-rose-50/40 p-[0.875rem] space-y-[0.625rem]">
      <div className="flex items-center justify-between gap-[0.5rem]">
        <div className="text-[0.8125rem] font-bold text-rose-800">
          รายการที่นำเข้าไม่สำเร็จ ({failedRows.length} รายการ)
        </div>

        <button
          type="button"
          onClick={onRetryFailed}
          className="inline-flex items-center gap-[0.375rem] px-[0.75rem] py-[0.3125rem] rounded-[0.5rem] bg-rose-600 hover:bg-rose-700 text-white text-[0.75rem] font-bold transition-colors cursor-pointer"
        >
          <FaRedo className="text-[0.625rem]" />
          <span>ลองนำเข้าใหม่อีกครั้ง</span>
        </button>
      </div>

      <div className="max-h-[10rem] overflow-y-auto divide-y divide-rose-100 rounded-[0.5rem] border border-rose-200 bg-white">
        {failedRows.map((item) => (
          <div
            key={item.row.rowId}
            className="px-[0.75rem] py-[0.5rem] flex items-center justify-between gap-[0.75rem] text-[0.75rem]"
          >
            <div className="min-w-0">
              <div className="font-bold text-slate-800 truncate">
                {item.row.data.name || `แถว #${item.row.excelRowNumber}`}
              </div>
              <div className="text-[0.6875rem] text-slate-500">
                {item.row.categoryLabel} • ชีต {item.row.sheetName}
              </div>
            </div>
            <span className="text-rose-600 font-semibold shrink-0">{item.reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
