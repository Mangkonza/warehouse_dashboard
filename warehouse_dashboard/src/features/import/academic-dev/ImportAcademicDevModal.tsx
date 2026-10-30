'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FaTimes,
  FaFileExcel,
  FaCheck,
  FaChevronRight,
  FaExclamationTriangle,
  FaCog,
  FaQuestionCircle,
} from 'react-icons/fa';
import {
  ImportRow,
  Summary,
  ParsedSheet,
  ImportResultOutcome,
  ImportFailedRowItem,
} from './importAcademicDev.types';
import {
  parseWorkbook,
  computeSummary,
  validateRow,
  enrichRow,
  calculateRowStatus,
} from './importAcademicDev.etl';
import { ImportStepUpload } from './ImportStepUpload';
import { ImportStepReview } from './ImportStepReview';
import { ImportStepResult } from './ImportStepResult';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { saveCategoryRecord } from '@/lib/dataService';
import { cn } from '@/lib/utils';

export interface ImportAcademicDevModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommitSuccess: () => void;
  existingRecords?: Record<string, any>[];
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

export const ImportAcademicDevModal: React.FC<ImportAcademicDevModalProps> = ({
  isOpen,
  onClose,
  onCommitSuccess,
  existingRecords = [],
  showToast,
}) => {
  // Stepper state: 1 = Upload, 2 = Review & Edit, 3 = Result
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // ETL Data state
  const [sheets, setSheets] = useState<ParsedSheet[]>([]);
  const [ignoredSheets, setIgnoredSheets] = useState<string[]>([]);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [importMode, setImportMode] = useState<'append' | 'overwrite'>('append');

  // Confirmation dialog state
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

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [outcome, setOutcome] = useState<ImportResultOutcome | null>(null);

  // Background scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Derived Summary
  const summary: Summary = useMemo(() => {
    return computeSummary(rows);
  }, [rows]);

  // Handle file select in Step 1
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);
    setParseError(null);

    try {
      const result = await parseWorkbook(file, existingRecords);
      if (result.rows.length === 0 && result.sheets.length === 0) {
        setParseError('ไม่พบข้อมูลหรือแผ่นงานที่ตรงกับรูปแบบเดือนในไฟล์นี้');
        setIsParsing(false);
        return;
      }

      setSheets(result.sheets);
      setIgnoredSheets(result.ignoredSheets);
      setRows(result.rows);
      setIsDirty(false);
      setStep(2);
    } catch (err: any) {
      console.error('Failed to parse workbook:', err);
      setParseError(err?.message || 'เกิดข้อผิดพลาดในการอ่านไฟล์ Excel กรุณาตรวจสอบความถูกต้องของไฟล์');
    } finally {
      setIsParsing(false);
    }
  };

  // Reset file and return to Step 1
  const handleResetFile = () => {
    if (isDirty) {
      setConfirmDialog({
        isOpen: true,
        title: 'ยืนยันการเปลี่ยนไฟล์',
        message: 'คุณได้แก้ไขข้อมูลในตารางไปแล้ว หากเปลี่ยนไฟล์ ข้อมูลที่แก้ไขไว้จะหายไป ต้องการเปลี่ยนไฟล์หรือไม่?',
        type: 'warning',
        action: () => {
          setSelectedFile(null);
          setRows([]);
          setSheets([]);
          setIsDirty(false);
          setStep(1);
        },
      });
      return;
    }

    setSelectedFile(null);
    setRows([]);
    setSheets([]);
    setIsDirty(false);
    setStep(1);
  };

  // Update single row data cell inline
  const handleUpdateRowData = useCallback(
    (rowId: string, updatedFields: Partial<ImportRow['data']>) => {
      setRows((prev) =>
        prev.map((r) => {
          if (r.rowId !== rowId) return r;

          let nextData = { ...r.data, ...updatedFields };

          // If head_name changed, re-enrich with personnel directory
          if (updatedFields.head_name !== undefined) {
            nextData = enrichRow(nextData);
          }

          // Re-validate row issues
          const issues = validateRow(nextData);
          const isDuplicate = Boolean(r.duplicateOf);
          const status = calculateRowStatus(issues, isDuplicate, r.excluded);

          return {
            ...r,
            data: nextData,
            issues,
            status,
          };
        })
      );
      setIsDirty(true);
    },
    []
  );

  // Toggle Exclude / Include row
  const handleToggleExclude = useCallback((rowId: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.rowId !== rowId) return r;
        const nextExcluded = !r.excluded;
        const status = calculateRowStatus(r.issues, Boolean(r.duplicateOf), nextExcluded);
        return {
          ...r,
          excluded: nextExcluded,
          status,
        };
      })
    );
    setIsDirty(true);
  }, []);

  // Batch update rows
  const handleApplyBatchUpdate = useCallback(
    (updater: (row: ImportRow) => Partial<ImportRow['data']> | null) => {
      setRows((prev) =>
        prev.map((r) => {
          const patch = updater(r);
          if (!patch) return r;

          let nextData = { ...r.data, ...patch };
          if (patch.head_name !== undefined) {
            nextData = enrichRow(nextData);
          }
          const issues = validateRow(nextData);
          const status = calculateRowStatus(issues, Boolean(r.duplicateOf), r.excluded);

          return {
            ...r,
            data: nextData,
            issues,
            status,
          };
        })
      );
      setIsDirty(true);
      if (showToast) {
        showToast('ปรับปรุงข้อมูลหลายแถวเรียบร้อยแล้ว', 'success');
      }
    },
    [showToast]
  );

  // Bulk exclude duplicates
  const handleBulkExcludeDuplicates = useCallback(() => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.status === 'duplicate') {
          return {
            ...r,
            excluded: true,
            status: 'excluded',
          };
        }
        return r;
      })
    );
    setIsDirty(true);
    if (showToast) {
      showToast('ยกเว้นแถวที่ซ้ำทั้งหมดเรียบร้อยแล้ว', 'warning');
    }
  }, [showToast]);

  // Bulk exclude errors
  const handleBulkExcludeErrors = useCallback(() => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.status === 'error') {
          return {
            ...r,
            excluded: true,
            status: 'excluded',
          };
        }
        return r;
      })
    );
    setIsDirty(true);
    if (showToast) {
      showToast('ยกเว้นแถวที่ต้องแก้ไขทั้งหมดเรียบร้อยแล้ว', 'warning');
    }
  }, [showToast]);

  // Cancel / Close modal handler
  const handleCloseModal = () => {
    if (isSaving) return; // Prevent closing while saving

    if (step === 2 && isDirty) {
      setConfirmDialog({
        isOpen: true,
        title: 'ยืนยันการยกเลิก',
        message: 'คุณได้แก้ไขข้อมูลไปแล้ว ต้องการยกเลิกและปิดหน้าต่างการนำเข้านี้ใช่หรือไม่?',
        type: 'warning',
        action: () => {
          onClose();
        },
      });
      return;
    }

    onClose();
  };

  // Commit and Save Rows to Backend
  const executeSave = async (rowsToSave: ImportRow[]) => {
    setStep(3);
    setIsSaving(true);
    setSaveProgress({ current: 0, total: rowsToSave.length });

    const failedRows: ImportFailedRowItem[] = [];
    let successCount = 0;

    // Concurrency control: batch of 5 requests
    const BATCH_SIZE = 5;

    for (let i = 0; i < rowsToSave.length; i += BATCH_SIZE) {
      const chunk = rowsToSave.slice(i, i + BATCH_SIZE);

      await Promise.all(
        chunk.map(async (row) => {
          try {
            const b = row.data.budget || 0;
            const round2 = (val: number) => Math.round((val + Number.EPSILON) * 100) / 100;
            const allocFaculty = round2(b * 0.05);
            const allocDept = round2(b * 0.05);
            const allocKu = round2(b * 0.05);
            const allocRemaining = Math.max(0, round2(b - (allocFaculty + allocDept + allocKu)));

            // Payload structure matching backend and academic form
            const payload = {
              name: row.data.name,
              head_name: row.data.head_name,
              head: row.data.head_name,
              head_personnel_id: row.data.head_personnel_id,
              department_code: row.data.department_code,
              department: row.data.department_code,
              client: row.data.client || '',
              budget: b,
              percent_faculty: 5,
              percent_dept: 5,
              percent_ku: 5,
              alloc_faculty: allocFaculty,
              alloc_dept: allocDept,
              alloc_ku: allocKu,
              alloc_remaining: allocRemaining,
              start_date: row.data.start_date,
              end_date: row.data.end_date,
              month: row.data.month,
              fiscal_year: row.data.fiscal_year,
              record_number: row.data.record_number || '',
              remarks: row.data.remarks || '',
              research_projects: row.data.research_projects || '',
              patent_integration: row.data.patent_integration || '',
              integration_start_date: row.data.integration_start_date || null,
              integration_end_date: row.data.integration_end_date || null,
            };

            const res = await saveCategoryRecord('academic', payload, true);
            if (!res.success) {
              failedRows.push({
                row,
                reason: res.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
              });
            } else {
              successCount++;
            }
          } catch (err: any) {
            failedRows.push({
              row,
              reason: err?.message || 'การเชื่อมต่อระบบล้มเหลว',
            });
          } finally {
            setSaveProgress((prev) => ({
              ...prev,
              current: prev.current + 1,
            }));
          }
        })
      );
    }

    const outcomeResult: ImportResultOutcome = {
      total: rows.length,
      successCount,
      failedCount: failedRows.length,
      duplicateSkipped: summary.duplicate,
      excludedSkipped: summary.excluded + (rows.length - rowsToSave.length - summary.duplicate),
      failedRows,
    };

    setOutcome(outcomeResult);
    setIsSaving(false);
    onCommitSuccess();
  };

  // Confirm Import Button Click
  const handleConfirmImport = () => {
    // Only import rows that are ready or warning and not excluded
    const eligibleRows = rows.filter(
      (r) => !r.excluded && (r.status === 'ready' || r.status === 'warning')
    );

    if (eligibleRows.length === 0) return;

    // Check if Overwrite mode is selected
    if (importMode === 'overwrite') {
      setConfirmDialog({
        isOpen: true,
        title: 'คำเตือน: โหมดเขียนทับข้อมูล (Overwrite)',
        message: 'คุณกำลังเลือกโหมด "เขียนทับข้อมูลทั้งหมด" ข้อมูลโครงการเดิมในระบบอาจถูกลบหรือเขียนทับ ต้องการดำเนินการต่อหรือไม่?',
        type: 'danger',
        action: () => {
          proceedWithValidationCheck(eligibleRows);
        },
      });
      return;
    }

    proceedWithValidationCheck(eligibleRows);
  };

  const proceedWithValidationCheck = (eligibleRows: ImportRow[]) => {
    // If there are still error rows
    if (summary.needsFix > 0) {
      setConfirmDialog({
        isOpen: true,
        title: 'มีรายการที่ข้อมูลไม่ครบถ้วน',
        message: `ยังมี ${summary.needsFix} รายการที่ข้อมูลไม่ครบถ้วนและจะไม่ถูกนำเข้า ต้องการนำเข้า ${eligibleRows.length} รายการที่พร้อมสมบูรณ์ใช่หรือไม่?`,
        type: 'warning',
        action: () => {
          executeSave(eligibleRows);
        },
      });
      return;
    }

    // Direct save if no errors
    executeSave(eligibleRows);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
        <div
          style={{
            width: 'min(1200px, 96vw)',
            height: 'min(860px, 92vh)',
          }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800"
        >
          {/* 1. Header (Fixed Height) */}
          <div className="shrink-0 h-[64px] px-6 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                <FaFileExcel className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  นำเข้าไฟล์ Excel — โครงการพัฒนาวิชาการ
                </h3>
                <p className="text-xs text-slate-500">
                  รองรับสมุดงานรายปี (ม.ค. - ธ.ค.) นำเข้าพร้อมกันในครั้งเดียว
                </p>
              </div>
            </div>

            {/* Stepper Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors',
                  step === 1
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                )}
              >
                <span className="w-4 h-4 rounded-full bg-current/15 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>เลือกไฟล์</span>
              </div>

              <FaChevronRight className="text-slate-300 text-[10px]" />

              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors',
                  step === 2
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                )}
              >
                <span className="w-4 h-4 rounded-full bg-current/15 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>ตรวจสอบและแก้ไข</span>
              </div>

              <FaChevronRight className="text-slate-300 text-[10px]" />

              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors',
                  step === 3
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                )}
              >
                <span className="w-4 h-4 rounded-full bg-current/15 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>ผลการนำเข้า</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              disabled={isSaving}
              onClick={handleCloseModal}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30"
              title="ปิดหน้าต่าง"
            >
              <FaTimes className="text-base" />
            </button>
          </div>

          {/* 2. Body (Flex 1, min-height 0, overflow hidden) */}
          <div className="flex-1 min-h-0 overflow-hidden p-5 flex flex-col bg-slate-50/40">
            {step === 1 && (
              <ImportStepUpload
                onFileSelect={handleFileSelect}
                isLoading={isParsing}
                errorMessage={parseError}
                onClearError={() => setParseError(null)}
              />
            )}

            {step === 2 && (
              <ImportStepReview
                fileName={selectedFile?.name || 'โครงการพัฒนาวิชาการ.xlsx'}
                fileSize={selectedFile?.size || 0}
                sheets={sheets}
                ignoredSheets={ignoredSheets}
                rows={rows}
                summary={summary}
                onUpdateRowData={handleUpdateRowData}
                onToggleExclude={handleToggleExclude}
                onResetFile={handleResetFile}
                onApplyBatchUpdate={handleApplyBatchUpdate}
                onBulkExcludeDuplicates={handleBulkExcludeDuplicates}
                onBulkExcludeErrors={handleBulkExcludeErrors}
              />
            )}

            {step === 3 && (
              <ImportStepResult
                isSaving={isSaving}
                saveProgress={saveProgress}
                outcome={outcome}
                onRetryFailed={() => {
                  if (outcome && outcome.failedRows.length > 0) {
                    const failedItems = outcome.failedRows.map((f) => f.row);
                    executeSave(failedItems);
                  }
                }}
                onClose={() => {
                  onClose();
                }}
              />
            )}
          </div>

          {/* 3. Footer (Fixed Height) - Step 2 only */}
          {step === 2 && (
            <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                {/* Left: Cancel button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    ยกเลิก
                  </button>

                  {/* Advanced Options Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                  >
                    <FaCog className="text-[11px]" />
                    <span>ตัวเลือกขั้นสูง</span>
                  </button>
                </div>

                {/* Center / Right: Summary & Single Confirm Button */}
                <div className="flex items-center gap-4">
                  <div className="text-xs font-medium text-slate-600">
                    พร้อมนำเข้า <strong className="text-emerald-700 font-bold">{summary.willImport}</strong>
                    {' • '}
                    ต้องแก้{' '}
                    <strong
                      className={cn(
                        summary.needsFix > 0 ? 'text-rose-600 font-bold' : 'text-slate-600'
                      )}
                    >
                      {summary.needsFix}
                    </strong>
                    {' • '}
                    ข้าม <strong className="text-slate-500">{summary.duplicate + summary.excluded}</strong>
                  </div>

                  <button
                    type="button"
                    disabled={summary.willImport === 0}
                    onClick={handleConfirmImport}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                    title={
                      summary.willImport === 0
                        ? 'ไม่มีรายการที่พร้อมนำเข้า กรุณาแก้ไขข้อผิดพลาดหรือกดยกเลิกการข้ามแถว'
                        : undefined
                    }
                  >
                    <FaCheck />
                    <span>ยืนยันนำเข้า {summary.willImport} รายการ</span>
                  </button>
                </div>
              </div>

              {/* Advanced options collapsed section */}
              {showAdvanced && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-600 animate-in fade-in">
                  <span className="font-semibold text-slate-700">โหมดการนำเข้า:</span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>เพิ่มต่อท้าย (Append - ค่าเริ่มต้น, ข้ามรายการซ้ำ)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-rose-700">
                    <input
                      type="radio"
                      name="importMode"
                      value="overwrite"
                      checked={importMode === 'overwrite'}
                      onChange={() => setImportMode('overwrite')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>เขียนทับทั้งหมด (Overwrite - มีการยืนยันก่อนบันทึก)</span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmActionModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="ยืนยันดำเนินการ"
        cancelText="ยกเลิก"
        onConfirm={() => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          confirmDialog.action();
        }}
        onCancel={() => {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }}
      />
    </>
  );
};
