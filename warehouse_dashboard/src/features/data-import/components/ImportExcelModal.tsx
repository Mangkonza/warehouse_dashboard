'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaCheck, FaFileUpload } from 'react-icons/fa';
import { CategoryKey } from '@/types/dataManagement';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { saveCategoryRecord } from '@/lib/dataService';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SplitPhase } from '@/hooks/useSplitTransition';
import {
  ImportRow,
  ParsedImportSheet,
  ImportOutcome,
  ImportFailedItem,
} from '../types';
import { parseWorkbookUniversal, buildCategoryPayload } from '../etl/importEtl';
import { useImportRows } from '../hooks/useImportRows';
import { useImportFilters } from '../hooks/useImportFilters';
import { ImportModalFrame } from './ImportModalFrame';
import { ImportStepUpload } from './ImportStepUpload';
import { ImportStepReview } from './ImportStepReview';
import { ImportStepResult } from './ImportStepResult';
import { ImportFooter } from './ImportFooter';

export interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory?: CategoryKey;
  existingDatasets?: Partial<Record<CategoryKey, Record<string, any>[]>>;
  onCommitSuccess: () => Promise<void> | void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({
  isOpen,
  onClose,
  activeCategory = 'academic',
  existingDatasets = {},
  onCommitSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [sheets, setSheets] = useState<ParsedImportSheet[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'overwrite'>('append');

  // Split-pane selection state & phase
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [lastSelectedRow, setLastSelectedRow] = useState<ImportRow | null>(null);
  const [phase, setPhase] = useState<SplitPhase>('list');

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [outcome, setOutcome] = useState<ImportOutcome | null>(null);

  // Confirm Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    action: () => {},
  });

  // Feature hooks
  const {
    rows,
    resetRows,
    isDirty,
    recentlyFixedIds,
    clearRecentlyFixed,
    updateRowData,
    toggleExclude,
    bulkApplyData,
    bulkSetExcluded,
    undoState,
    undoLastAction,
    dismissUndo,
    globalSummary,
  } = useImportRows([]);

  const {
    filters,
    setCategory,
    toggleStatus,
    setQuery,
    resetFilters,
    categorySummary,
    visibleRows,
  } = useImportFilters(rows, recentlyFixedIds, clearRecentlyFixed);

  const reducedMotion = useReducedMotion();

  // Keep lastSelectedRow updated while a row is selected so closing animation preserves content
  useEffect(() => {
    if (selectedRowId) {
      const found = rows.find((r) => r.rowId === selectedRowId);
      if (found) {
        setLastSelectedRow(found);
      }
    }
  }, [selectedRowId, rows]);

  const resetAllState = useCallback(() => {
    setStep(1);
    setSelectedFile(null);
    setIsParsing(false);
    setParseError(null);
    setSheets([]);
    resetRows([]);
    resetFilters();
    setSelectedRowId(null);
    setLastSelectedRow(null);
    setPhase('list');
    setImportMode('append');
    setOutcome(null);
    setIsSaving(false);
    setSaveProgress({ current: 0, total: 0 });
  }, [resetRows, resetFilters]);

  useEffect(() => {
    if (isOpen) {
      resetAllState();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, resetAllState]);

  const handleSelectRow = useCallback(
    (rowId: string | null) => {
      if (rowId !== selectedRowId) {
        clearRecentlyFixed();
      }
      setSelectedRowId(rowId);
    },
    [selectedRowId, clearRecentlyFixed]
  );

  // Step 1: File selection
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);
    setParseError(null);

    try {
      const result = await parseWorkbookUniversal(
        file,
        activeCategory,
        existingDatasets,
        file.name
      );

      if (result.rows.length === 0 && result.sheets.length === 0) {
        setParseError('ไม่พบข้อมูลหรือแผ่นงานที่ตรงกับโครงสร้างในไฟล์นี้');
        setIsParsing(false);
        return;
      }

      setSheets(result.sheets);
      resetRows(result.rows);
      resetFilters();
      setSelectedRowId(null);
      setLastSelectedRow(null);
      setPhase('list');
      setStep(2);
    } catch (err: any) {
      setParseError(
        err?.message || 'เกิดข้อผิดพลาดในการอ่านไฟล์ Excel กรุณาตรวจสอบความถูกต้องของไฟล์'
      );
    } finally {
      setIsParsing(false);
    }
  };

  const handleResetFile = () => {
    if (isDirty) {
      setConfirmDialog({
        isOpen: true,
        title: 'ยืนยันการเปลี่ยนไฟล์',
        message:
          'คุณได้แก้ไขข้อมูลในตารางไปแล้ว หากเปลี่ยนไฟล์ ข้อมูลที่แก้ไขไว้จะหายไป ต้องการเปลี่ยนไฟล์หรือไม่?',
        type: 'warning',
        action: () => {
          resetAllState();
        },
      });
      return;
    }
    resetAllState();
  };

  // Save Execution (closes right pane with animation first per T9)
  const executeSave = async (eligibleRows: ImportRow[]) => {
    if (selectedRowId !== null) {
      setSelectedRowId(null);
      const waitMs = reducedMotion ? 0 : 210;
      if (waitMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }

    setIsSaving(true);
    setStep(3);
    setSaveProgress({ current: 0, total: eligibleRows.length });

    const failedItems: ImportFailedItem[] = [];
    let successCount = 0;
    const byCat: Record<CategoryKey, { success: number; failed: number }> = {
      monitoring: { success: 0, failed: 0 },
      research: { success: 0, failed: 0 },
      academic: { success: 0, failed: 0 },
      service: { success: 0, failed: 0 },
      publications: { success: 0, failed: 0 },
      ip: { success: 0, failed: 0 },
      personnel: { success: 0, failed: 0 },
      kpi: { success: 0, failed: 0 },
      user_roles: { success: 0, failed: 0 },
    };

    const CONCURRENCY_LIMIT = 5;
    const queue = [...eligibleRows];
    let processed = 0;

    const worker = async () => {
      while (queue.length > 0) {
        const row = queue.shift();
        if (!row) break;

        try {
          const payload = buildCategoryPayload(row);
          const res = await saveCategoryRecord(row.category, payload, false);
          if (res && res.error) {
            failedItems.push({ row, reason: res.error });
            if (byCat[row.category]) byCat[row.category].failed++;
          } else {
            successCount++;
            if (byCat[row.category]) byCat[row.category].success++;
          }
        } catch (err: any) {
          failedItems.push({
            row,
            reason: err?.message || 'เกิดข้อผิดพลาดในการส่งข้อมูลไปยังระบบ',
          });
          if (byCat[row.category]) byCat[row.category].failed++;
        } finally {
          processed++;
          setSaveProgress({ current: processed, total: eligibleRows.length });
        }
      }
    };

    const workers = Array.from(
      { length: Math.min(CONCURRENCY_LIMIT, eligibleRows.length) },
      () => worker()
    );
    await Promise.all(workers);

    const duplicateSkipped = rows.filter(
      (r) => r.status === 'duplicate' && !r.excluded
    ).length;
    const excludedSkipped = rows.filter((r) => r.excluded).length;

    setOutcome({
      total: eligibleRows.length,
      successCount,
      failedCount: failedItems.length,
      duplicateSkipped,
      excludedSkipped,
      byCategoryOutcome: byCat,
      failedRows: failedItems,
    });
    setIsSaving(false);
  };

  const proceedWithValidationCheck = (eligibleRows: ImportRow[]) => {
    if (globalSummary.needsFix > 0) {
      setConfirmDialog({
        isOpen: true,
        title: 'มีรายการที่ข้อมูลไม่ครบถ้วน',
        message: `ยังมี ${globalSummary.needsFix} รายการที่ข้อมูลบังคับไม่ครบถ้วนและจะไม่ถูกนำเข้า ต้องการนำเข้า ${eligibleRows.length} รายการที่พร้อมสมบูรณ์ใช่หรือไม่?`,
        type: 'warning',
        action: () => {
          executeSave(eligibleRows);
        },
      });
      return;
    }

    executeSave(eligibleRows);
  };

  const handleConfirmImport = () => {
    const eligibleRows = rows.filter(
      (r) => !r.excluded && (r.status === 'ready' || r.status === 'warning')
    );

    if (eligibleRows.length === 0) return;

    if (importMode === 'overwrite') {
      setConfirmDialog({
        isOpen: true,
        title: 'คำเตือน: โหมดเขียนทับข้อมูล (Overwrite)',
        message:
          'คุณกำลังเลือกโหมด "เขียนทับข้อมูลเดิม" ต้องการดำเนินการต่อหรือไม่?',
        type: 'danger',
        action: () => {
          proceedWithValidationCheck(eligibleRows);
        },
      });
      return;
    }

    proceedWithValidationCheck(eligibleRows);
  };

  const handleCloseModal = () => {
    if (isSaving) return;

    if (step === 3 && outcome) {
      onCommitSuccess();
      resetAllState();
      onClose();
      return;
    }

    if (isDirty) {
      setConfirmDialog({
        isOpen: true,
        title: 'ยืนยันการปิดหน้าต่าง',
        message:
          'คุณได้แก้ไขข้อมูลไปแล้ว หากปิดหน้าต่าง ข้อมูลที่แก้ไขไว้จะหายไป ต้องการปิดหรือไม่?',
        type: 'warning',
        action: () => {
          resetAllState();
          onClose();
        },
      });
      return;
    }

    resetAllState();
    onClose();
  };

  // Footer rendering for Step 2 and Step 3
  const modalFooter =
    step === 2 ? (
      <ImportFooter
        globalSummary={globalSummary}
        importMode={importMode}
        onChangeMode={setImportMode}
        onCancel={handleCloseModal}
        onConfirmImport={handleConfirmImport}
      />
    ) : step === 3 && !isSaving && outcome ? (
      <div className="w-full flex items-center justify-between gap-[0.75rem]">
        <button
          type="button"
          onClick={resetAllState}
          className="inline-flex items-center gap-[0.375rem] px-[1rem] py-[0.5rem] rounded-[0.625rem] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[0.8125rem] font-semibold transition-colors cursor-pointer"
        >
          <FaFileUpload className="text-[0.75rem]" />
          <span>นำเข้าไฟล์อื่นต่อ</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onCommitSuccess();
            resetAllState();
            onClose();
          }}
          className="inline-flex items-center gap-[0.5rem] px-[1.5rem] py-[0.5625rem] rounded-[0.75rem] bg-[#00A651] hover:bg-[#008f45] text-white text-[0.875rem] font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer ml-auto"
        >
          <FaCheck className="text-[0.75rem]" />
          <span>เสร็จสิ้น</span>
        </button>
      </div>
    ) : undefined;

  return (
    <>
      <ImportModalFrame
        isOpen={isOpen}
        step={step}
        phase={phase}
        isSaving={isSaving}
        hasDetailOpen={Boolean(selectedRowId) && step === 2}
        onEscapeCloseDetail={() => handleSelectRow(null)}
        onClose={handleCloseModal}
        footer={modalFooter}
      >
        {step === 1 && (
          <ImportStepUpload
            onFileSelect={handleFileSelect}
            isLoading={isParsing}
            errorMessage={parseError}
            onClearError={() => setParseError(null)}
            activeCategory={activeCategory}
          />
        )}

        {step === 2 && (
          <ImportStepReview
            fileName={selectedFile?.name || 'excel_file.xlsx'}
            fileSize={selectedFile?.size || 0}
            sheetCount={sheets.length}
            rows={rows}
            visibleRows={visibleRows}
            globalSummary={globalSummary}
            categorySummary={categorySummary}
            filters={filters}
            onSelectCategory={setCategory}
            onToggleStatus={toggleStatus}
            onQueryChange={setQuery}
            onResetFilters={resetFilters}
            onResetFile={handleResetFile}
            selectedRowId={selectedRowId}
            lastSelectedRow={lastSelectedRow}
            onSelectRow={handleSelectRow}
            onPhaseChange={setPhase}
            recentlyFixedIds={recentlyFixedIds}
            onUpdateRowData={updateRowData}
            onToggleExclude={toggleExclude}
            onBulkApplyData={bulkApplyData}
            onBulkSetExcluded={bulkSetExcluded}
            undoMessage={undoState?.message || null}
            onUndo={undoLastAction}
            onDismissUndo={dismissUndo}
          />
        )}

        {step === 3 && (
          <ImportStepResult
            isSaving={isSaving}
            saveProgress={saveProgress}
            outcome={outcome}
            onRetryFailed={() => {
              if (outcome && outcome.failedRows.length > 0) {
                executeSave(outcome.failedRows.map((f) => f.row));
              }
            }}
          />
        )}
      </ImportModalFrame>

      <ConfirmActionModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        onConfirm={() => {
          const act = confirmDialog.action;
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          act();
        }}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
