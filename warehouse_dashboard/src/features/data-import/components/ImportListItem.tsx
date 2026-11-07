'use client';

import React from 'react';
import {
  FaEdit,
  FaBan,
  FaUndo,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaCopy,
} from 'react-icons/fa';
import { ImportRow } from '../types';
import { cn } from '@/lib/utils';

export interface ImportListItemProps {
  row: ImportRow;
  index: number;
  selected: boolean;
  isRecentlyFixed?: boolean;
  onSelect: (rowId: string) => void;
  onToggleExclude: (rowId: string) => void;
}

const ImportListItemComponent: React.FC<ImportListItemProps> = ({
  row,
  index,
  selected,
  onSelect,
  onToggleExclude,
}) => {
  const errorIssues = row.issues.filter((i) => i.severity === 'error');
  const warningIssues = row.issues.filter((i) => i.severity === 'warning');

  const isError = !row.excluded && (row.status === 'error' || errorIssues.length > 0);
  const isWarning =
    !row.excluded && !isError && (row.status === 'warning' || warningIssues.length > 0);
  const isDuplicate = !row.excluded && row.status === 'duplicate';
  const isReady = !row.excluded && !isError && !isWarning && !isDuplicate;

  // Reason texts exactly following Image 2 design
  const errorReason =
    errorIssues.length > 0
      ? errorIssues.map((i) => i.message || `ขาดข้อมูล: ${i.label}`).join(', ')
      : 'มีข้อผิดพลาดที่ต้องแก้ไข';

  const warningReason =
    warningIssues.length > 0
      ? warningIssues.map((i) => i.message || `ควรตรวจ: ${i.label}`).join(', ')
      : 'มีข้อควรตรวจสอบ';

  const duplicateReason = row.duplicateOf || 'มีในระบบแล้ว (จะถูกข้าม)';

  return (
    <div
      role="listitem"
      data-row-id={row.rowId}
      onClick={() => onSelect(row.rowId)}
      className={cn(
        'group relative flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none',
        // 1. ต้องแก้ไข: พื้นแดงจาง + ไอคอนวงกลมแดง + เหตุผลสีแดงเข้ม
        isError && 'bg-[#fff5f5] border-[#fed7d7] hover:border-rose-300',
        // 2. ควรตรวจ: พื้นส้มจาง + ไอคอนสามเหลี่ยมส้ม + เหตุผล
        isWarning && 'bg-[#fffaf0] border-[#feebc8] hover:border-amber-300',
        // 3. ซ้ำในระบบ: ตัวหนังสือเทา + ไอคอนสำเนา (จะถูกข้าม)
        isDuplicate && 'bg-slate-50/70 border-slate-200 hover:border-slate-300 opacity-80',
        // 4. พร้อมนำเข้า: เงียบที่สุด มีแค่จุดเขียวเล็ก ๆ
        isReady && 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs',
        // Excluded state
        row.excluded && 'opacity-50 bg-slate-100/60 border-slate-200 line-through',
        // Selected highlight
        selected &&
          (isError
            ? 'ring-2 ring-rose-500 border-rose-500 bg-[#ffebeb]'
            : isWarning
            ? 'ring-2 ring-amber-500 border-amber-500 bg-[#fff5e0]'
            : isDuplicate
            ? 'ring-2 ring-slate-400 border-slate-400'
            : 'ring-2 ring-[#00A651] border-[#00A651] bg-emerald-50/20')
      )}
    >
      {/* Left content: 3 lines clean layout matching Image 2 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Top: Icon + #Index */}
        <div className="flex items-center gap-1.5">
          {isError && <FaExclamationCircle className="text-rose-500 text-sm shrink-0" />}
          {isWarning && <FaExclamationTriangle className="text-amber-500 text-sm shrink-0" />}
          {isDuplicate && <FaCopy className="text-slate-400 text-sm shrink-0" />}
          {isReady && <span className="size-2 rounded-full bg-emerald-500 shrink-0" />}
          {row.excluded && <FaBan className="text-slate-400 text-xs shrink-0" />}

          <span className="text-xs font-mono font-semibold text-slate-400 tabular-nums">
            #{index + 1}
          </span>
        </div>

        {/* Middle: Title */}
        <div className="text-[13.5px] font-semibold leading-snug line-clamp-2">
          {row.data.name ? (
            <span className={cn(isDuplicate ? 'text-slate-500' : 'text-slate-800')}>
              {row.data.name}
            </span>
          ) : (
            <span className="text-rose-600 font-semibold">
              (ยังไม่ได้ระบุชื่อโครงการ/ผลงาน)
            </span>
          )}
        </div>

        {/* Bottom: Reason (only for non-ready states, matching Image 2) */}
        {isError && (
          <div className="text-xs font-medium text-rose-600 truncate mt-0.5">
            {errorReason}
          </div>
        )}

        {isWarning && (
          <div className="text-xs font-medium text-amber-700 truncate mt-0.5">
            {warningReason}
          </div>
        )}

        {isDuplicate && (
          <div className="text-xs font-normal text-slate-400 truncate mt-0.5">
            {duplicateReason}
          </div>
        )}

        {row.excluded && (
          <div className="text-xs font-normal text-slate-400 truncate mt-0.5">
            ยกเว้นการนำเข้าแถวนี้
          </div>
        )}
      </div>

      {/* Right actions: Edit & Exclude buttons */}
      <div className="flex items-center gap-1.5 shrink-0 pl-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(row.rowId);
          }}
          title="แก้ไขรายการนี้"
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs',
            selected || isReady
              ? 'bg-[#00A651] text-white hover:bg-[#008f45]'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
          )}
        >
          <FaEdit className="text-[11px]" />
          <span>แก้ไข</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExclude(row.rowId);
          }}
          title={row.excluded ? 'คืนค่าแถวนี้กลับมานำเข้า' : 'ไม่นำเข้าแถวนี้'}
          className={cn(
            'size-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer',
            row.excluded
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'
          )}
        >
          {row.excluded ? <FaUndo className="text-xs" /> : <FaBan className="text-xs" />}
        </button>
      </div>
    </div>
  );
};

export const ImportListItem = React.memo(ImportListItemComponent);
