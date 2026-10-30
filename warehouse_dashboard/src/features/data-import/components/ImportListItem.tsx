'use client';

import React from 'react';
import { FaEdit, FaBan, FaUndo } from 'react-icons/fa';
import { StatusBadge } from '@/components/ui/StatusBadge';
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
  isRecentlyFixed = false,
  onSelect,
  onToggleExclude,
}) => {
  const errorIssues = row.issues.filter((i) => i.severity === 'error');
  const warningIssues = row.issues.filter((i) => i.severity === 'warning');

  const formatBudget = (val: number) => {
    if (!val || isNaN(val)) return '—';
    return `฿${val.toLocaleString('th-TH', { maximumFractionDigits: 0 })}`;
  };

  const badgeLabel = row.excluded
    ? 'ไม่นำเข้า'
    : errorIssues.length > 0
    ? `ต้องแก้ ${errorIssues.length} จุด`
    : warningIssues.length > 0
    ? `ควรตรวจ ${warningIssues.length} จุด`
    : undefined;

  return (
    <div
      role="listitem"
      data-row-id={row.rowId}
      onClick={() => onSelect(row.rowId)}
      className={cn(
        'imp-row-item group relative flex items-center justify-between gap-[0.75rem] px-[0.875rem] border-b border-slate-100 transition-colors cursor-pointer select-none',
        selected
          ? 'bg-emerald-50/70 border-l-[3px] border-l-[#00A651]'
          : 'hover:bg-slate-50/90 border-l-[3px] border-l-transparent',
        row.excluded && 'opacity-55 bg-slate-50/50'
      )}
    >
      {/* Left main 3-line summary */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-[0.1875rem]">
        {/* Line 1: #Index + StatusBadge + Category + Sheet + RecentlyFixed badge */}
        <div className="flex items-center gap-[0.375rem] min-w-0 overflow-hidden">
          <span className="text-[0.6875rem] font-bold text-slate-400 tabular-nums shrink-0">
            #{index + 1}
          </span>

          <StatusBadge
            variant={row.excluded ? 'excluded' : row.status}
            label={badgeLabel}
          />

          {isRecentlyFixed && !row.excluded && (
            <StatusBadge variant="fixed" label="แก้ไขแล้ว ✓" />
          )}

          <span className="px-[0.375rem] py-[0.0625rem] rounded-[0.25rem] bg-slate-100 text-slate-600 text-[0.6875rem] font-medium truncate max-w-[9rem] shrink-0">
            {row.categoryLabel}
          </span>

          <span className="text-[0.6875rem] text-slate-400 truncate">
            ชีต: {row.sheetName} (แถว {row.excelRowNumber})
          </span>
        </div>

        {/* Line 2: Title */}
        <div className="truncate text-[0.8125rem] font-bold text-slate-800 leading-snug">
          {row.data.name ? (
            <span className={cn(row.excluded && 'line-through text-slate-400')}>
              {row.data.name}
            </span>
          ) : (
            <span className="text-rose-600 italic font-semibold">
              (ยังไม่ได้ระบุชื่อโครงการ/ผลงาน)
            </span>
          )}
        </div>

        {/* Line 3: Issue summary OR concise metadata */}
        <div className="truncate text-[0.75rem] leading-tight">
          {row.excluded ? (
            <span className="text-slate-400">ยกเว้นการนำเข้าแถวนี้</span>
          ) : row.status === 'duplicate' ? (
            <span className="text-purple-700 font-medium">
              {row.duplicateOf || 'ซ้ำกับข้อมูลที่มีอยู่แล้ว'}
            </span>
          ) : errorIssues.length > 0 ? (
            <span className="text-rose-600 font-semibold">
              ขาดข้อมูลบังคับ: {errorIssues.map((i) => i.label).join(', ')}
            </span>
          ) : warningIssues.length > 0 ? (
            <span className="text-amber-700 font-medium">
              ควรตรวจ: {warningIssues.map((i) => i.label).join(', ')}
            </span>
          ) : (
            <span className="text-slate-500">
              {row.data.head_name || 'ไม่ระบุผู้รับผิดชอบ'} •{' '}
              {row.data.department_code || 'ไม่ระบุภาควิชา'} • {formatBudget(row.data.budget)}
            </span>
          )}
        </div>
      </div>

      {/* Container-query extra columns (visible when left pane is wide) */}
      <div className="imp-row-meta-lg hidden flex-col items-end justify-center text-right shrink-0 w-[9.5rem]">
        <span className="text-[0.75rem] font-semibold text-slate-700 truncate max-w-full">
          {row.data.head_name || '—'}
        </span>
        <span className="text-[0.6875rem] text-slate-400 truncate max-w-full">
          {row.data.start_date ? `${row.data.start_date}` : 'ไม่ระบุวันที่'}
        </span>
      </div>

      <div className="imp-row-meta-md hidden flex-col items-end justify-center text-right shrink-0 w-[6.5rem]">
        <span className="px-[0.375rem] py-[0.0625rem] rounded bg-slate-100 text-slate-700 text-[0.6875rem] font-bold">
          {row.data.department_code || '—'}
        </span>
        <span className="text-[0.75rem] font-bold text-emerald-700 tabular-nums">
          {formatBudget(row.data.budget)}
        </span>
      </div>

      {/* Action buttons: Edit & Exclude */}
      <div className="flex items-center gap-[0.375rem] shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(row.rowId);
          }}
          title="เปิดฟอร์มแก้ไขทางขวา"
          className={cn(
            'inline-flex items-center gap-[0.25rem] px-[0.5rem] py-[0.3125rem] rounded-[0.4375rem] text-[0.75rem] font-semibold transition-colors cursor-pointer',
            selected
              ? 'bg-[#00A651] text-white'
              : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
          )}
        >
          <FaEdit className="text-[0.6875rem]" />
          <span className="hidden sm:inline">แก้ไข</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExclude(row.rowId);
          }}
          title={row.excluded ? 'คืนค่าแถวนี้กลับมานำเข้า' : 'ไม่นำเข้าแถวนี้'}
          className={cn(
            'w-[1.875rem] h-[1.875rem] rounded-[0.4375rem] flex items-center justify-center transition-colors cursor-pointer',
            row.excluded
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'
          )}
        >
          {row.excluded ? (
            <FaUndo className="text-[0.6875rem]" />
          ) : (
            <FaBan className="text-[0.75rem]" />
          )}
        </button>
      </div>
    </div>
  );
};

export const ImportListItem = React.memo(ImportListItemComponent);
