'use client';

import React, { useRef, useMemo } from 'react';
import { SplitPaneTransition, SplitPhase } from '@/components/ui/SplitPaneTransition';
import { UndoToast } from '@/components/ui/UndoToast';
import { ImportFileBar } from './ImportFileBar';
import { ImportCategoryChips } from './ImportCategoryChips';
import { ImportSummaryCards } from './ImportSummaryCards';
import { ImportListPane } from './ImportListPane';
import { ImportDetailPane } from './ImportDetailPane';
import {
  ImportRow,
  ImportRowData,
  ImportSummary,
  ImportFiltersState,
  ImportCategoryFilter,
  ImportStatusFilter,
} from '../types';
import { useListKeyboardNav } from '../hooks/useListKeyboardNav';

export interface ImportStepReviewProps {
  fileName: string;
  fileSize: number;
  sheetCount: number;
  rows: ImportRow[];
  visibleRows: ImportRow[];
  globalSummary: ImportSummary;
  categorySummary: ImportSummary;
  filters: ImportFiltersState;
  onSelectCategory: (category: ImportCategoryFilter) => void;
  onToggleStatus: (status: ImportStatusFilter) => void;
  onQueryChange: (q: string) => void;
  onResetFilters: () => void;
  onResetFile: () => void;
  selectedRowId: string | null;
  lastSelectedRow: ImportRow | null;
  onSelectRow: (rowId: string | null) => void;
  onPhaseChange?: (phase: SplitPhase) => void;
  recentlyFixedIds: Set<string>;
  onUpdateRowData: (rowId: string, updatedFields: Partial<ImportRowData>) => void;
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
  undoMessage: string | null;
  onUndo: () => void;
  onDismissUndo: () => void;
}

export const ImportStepReview: React.FC<ImportStepReviewProps> = ({
  fileName,
  fileSize,
  sheetCount,
  rows,
  visibleRows,
  globalSummary,
  categorySummary,
  filters,
  onSelectCategory,
  onToggleStatus,
  onQueryChange,
  onResetFilters,
  onResetFile,
  selectedRowId,
  lastSelectedRow,
  onSelectRow,
  onPhaseChange,
  recentlyFixedIds,
  onUpdateRowData,
  onToggleExclude,
  onBulkApplyData,
  onBulkSetExcluded,
  undoMessage,
  onUndo,
  onDismissUndo,
}) => {
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  const { selectPrev, selectNext, selectNextNeedsFix } = useListKeyboardNav({
    visibleRows,
    selectedRowId,
    onSelectRow,
    listContainerRef,
    enabled: true,
  });

  // Active row for detail pane (preserve lastSelectedRow during 'closing' phase per T4)
  const activeDetailRow = useMemo(() => {
    if (selectedRowId) {
      const found = rows.find((r) => r.rowId === selectedRowId);
      if (found) return found;
    }
    return lastSelectedRow;
  }, [rows, selectedRowId, lastSelectedRow]);

  const activeRowIndex = useMemo(() => {
    if (!activeDetailRow) return -1;
    return visibleRows.findIndex((r) => r.rowId === activeDetailRow.rowId);
  }, [visibleRows, activeDetailRow]);

  const remainingErrorCount = useMemo(() => {
    return visibleRows.filter((r) => !r.excluded && r.status === 'error').length;
  }, [visibleRows]);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
      {/* Top Control Section: FileBar + CategoryChips + SummaryCards */}
      <div className="shrink-0 px-[clamp(0.875rem,1.5vw,1.25rem)] py-[0.75rem] border-b border-slate-200 bg-slate-50/50 space-y-[0.625rem]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-[0.625rem]">
          <ImportFileBar
            fileName={fileName}
            fileSize={fileSize}
            sheetCount={sheetCount}
            totalRows={rows.length}
            onResetFile={onResetFile}
          />

          <ImportCategoryChips
            globalSummary={globalSummary}
            activeCategory={filters.category}
            onSelectCategory={onSelectCategory}
          />
        </div>

        <ImportSummaryCards
          summary={categorySummary}
          activeStatus={filters.status}
          onToggleStatus={onToggleStatus}
        />
      </div>

      {/* Split Pane Body */}
      <SplitPaneTransition
        isDetailOpen={Boolean(selectedRowId)}
        onPhaseChange={onPhaseChange}
        detailLabel="ฟอร์มแก้ไขข้อมูลรายแถว"
        list={
          <ImportListPane
            visibleRows={visibleRows}
            totalCount={categorySummary.total}
            query={filters.query}
            onQueryChange={onQueryChange}
            onResetFilters={onResetFilters}
            selectedRowId={selectedRowId}
            recentlyFixedIds={recentlyFixedIds}
            onSelectRow={(id) => onSelectRow(id)}
            onToggleExclude={onToggleExclude}
            onBulkApplyData={onBulkApplyData}
            onBulkSetExcluded={onBulkSetExcluded}
            listContainerRef={listContainerRef}
          />
        }
        detail={
          activeDetailRow ? (
            <ImportDetailPane
              row={activeDetailRow}
              rowIndex={activeRowIndex}
              totalVisible={visibleRows.length}
              remainingErrorCount={remainingErrorCount}
              onUpdateRowData={onUpdateRowData}
              onToggleExclude={onToggleExclude}
              onPrev={selectPrev}
              onNext={selectNext}
              onNextNeedsFix={selectNextNeedsFix}
              onClose={() => onSelectRow(null)}
            />
          ) : null
        }
      />

      {/* Undo Toast */}
      <UndoToast
        message={undoMessage}
        onUndo={onUndo}
        onDismiss={onDismissUndo}
      />
    </div>
  );
};
