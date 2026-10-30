'use client';

import React, { RefObject } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImportBulkMenu } from './ImportBulkMenu';
import { ImportListItem } from './ImportListItem';
import { ImportRow, ImportRowData } from '../types';

export interface ImportListPaneProps {
  visibleRows: ImportRow[];
  totalCount: number;
  query: string;
  onQueryChange: (q: string) => void;
  onResetFilters: () => void;
  selectedRowId: string | null;
  recentlyFixedIds: Set<string>;
  onSelectRow: (rowId: string) => void;
  onToggleExclude: (rowId: string) => void;
  onBulkApplyData: (
    targetRowIds: Set<string>,
    updater: (row: ImportRow) => Partial<ImportRowData> | null,
    actionDescription?: string
  ) => number;
  onBulkSetExcluded: (
    targetRowIds: Set<string>,
    excluded: boolean,
    actionDescription?: string
  ) => number;
  listContainerRef: RefObject<HTMLDivElement | null>;
}

export const ImportListPane: React.FC<ImportListPaneProps> = ({
  visibleRows,
  totalCount,
  query,
  onQueryChange,
  onResetFilters,
  selectedRowId,
  recentlyFixedIds,
  onSelectRow,
  onToggleExclude,
  onBulkApplyData,
  onBulkSetExcluded,
  listContainerRef,
}) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white overflow-hidden">
      {/* Sticky Search + Bulk Menu Bar */}
      <div className="shrink-0 px-[0.875rem] py-[0.625rem] border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-[0.625rem] flex-wrap">
        <div className="flex-1 min-w-[12rem]">
          <SearchInput
            value={query}
            onChange={onQueryChange}
            placeholder="ค้นหาชื่อโครงการ, หัวหน้าโครงการ, ภาควิชา, ชีต..."
            width="100%"
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-[0.625rem] shrink-0">
          <span className="text-[0.75rem] text-slate-500 font-medium hidden sm:inline">
            แสดง <strong className="text-slate-800">{visibleRows.length}</strong> จาก {totalCount} แถว
          </span>

          <ImportBulkMenu
            visibleRows={visibleRows}
            onBulkApplyData={onBulkApplyData}
            onBulkSetExcluded={onBulkSetExcluded}
          />
        </div>
      </div>

      {/* Scrollable List */}
      <div
        ref={listContainerRef}
        role="list"
        className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100"
      >
        {visibleRows.length === 0 ? (
          <EmptyState
            title="ไม่พบรายการที่ตรงกับตัวกรอง"
            description="ลองเปลี่ยนหมวดหมู่ สถานะ หรือล้างคำค้นหาเพื่อดูรายการทั้งหมด"
            actionLabel="ล้างตัวกรองทั้งหมด"
            onAction={onResetFilters}
            className="h-full"
          />
        ) : (
          visibleRows.map((row, idx) => (
            <ImportListItem
              key={row.rowId}
              row={row}
              index={idx}
              selected={row.rowId === selectedRowId}
              isRecentlyFixed={recentlyFixedIds.has(row.rowId)}
              onSelect={onSelectRow}
              onToggleExclude={onToggleExclude}
            />
          ))
        )}
      </div>
    </div>
  );
};
