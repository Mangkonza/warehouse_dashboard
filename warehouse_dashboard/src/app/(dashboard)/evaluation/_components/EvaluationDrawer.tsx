'use client';

import React, { useEffect, useState } from 'react';
import { CategoryKey } from '@/types/dataManagement';
import { EvaluationValue, isEvaluated } from '@/types/evaluation';
import { EvaluationFields } from '@/components/evaluation/EvaluationFields';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { LevelBadge } from '@/components/ui/evaluation-tag';
import { ServiceTypeBadge } from '@/components/ui/service-type-badge';
import { IPTypeBadge } from '@/components/ui/ip-type-badge';
import { formatDateBE } from '@/components/ui/RecordDetailDrawer';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/button';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExclamationCircle } from 'react-icons/fa';

export interface EvaluationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryKey;
  record: any | null;
  evaluation: EvaluationValue | null;
  onSave: (record: any, val: EvaluationValue) => Promise<void>;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalInList: number;
}

const EMPTY_VALUE: EvaluationValue = {
  sdg_ids: [],
  i_type: null,
  journal_index: null,
};

export const EvaluationDrawer: React.FC<EvaluationDrawerProps> = ({
  isOpen,
  onClose,
  category,
  record,
  evaluation,
  onSave,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  currentIndex,
  totalInList,
}) => {
  const [draftValue, setDraftValue] = useState<EvaluationValue>(EMPTY_VALUE);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  // Sync draft value whenever record or evaluation changes
  useEffect(() => {
    if (record) {
      setDraftValue({
        sdg_ids: Array.isArray(evaluation?.sdg_ids) ? [...evaluation.sdg_ids] : [],
        i_type: evaluation?.i_type ?? null,
        journal_index: evaluation?.journal_index ? { ...evaluation.journal_index } : null,
      });
      setConfirmCloseOpen(false);
      setErrorMessage(null);
    }
  }, [record, evaluation]);

  // Check unsaved changes
  const hasUnsavedChanges = React.useMemo(() => {
    const origSdgs = Array.isArray(evaluation?.sdg_ids) ? [...evaluation.sdg_ids].sort().join(',') : '';
    const draftSdgs = Array.isArray(draftValue.sdg_ids) ? [...draftValue.sdg_ids].sort().join(',') : '';
    if (origSdgs !== draftSdgs) return true;
    if ((evaluation?.i_type ?? null) !== (draftValue.i_type ?? null)) return true;
    const origJ = evaluation?.journal_index?.value ?? '';
    const draftJ = draftValue.journal_index?.value ?? '';
    if (origJ !== draftJ) return true;
    return false;
  }, [evaluation, draftValue]);

  if (!record) return null;

  const handleRequestClose = () => {
    if (hasUnsavedChanges) {
      setConfirmCloseOpen(true);
    } else {
      onClose();
    }
  };

  const handlePerformSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      await onSave(record, draftValue);
      // On success, close drawer smoothly
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'เกิดข้อผิดพลาดในการบันทึกการประเมิน');
    } finally {
      setIsSaving(false);
    }
  };

  const recordTitle = String(
    record.name || record.title || record.topic_title || record.id || 'รายละเอียด'
  ).replace(/[\r\n]+/g, ' ').trim();

  const evaluated = isEvaluated(category, evaluation);

  // Custom Header Slot
  const headerSlot = (
    <div className="border-b border-slate-200 bg-white px-5 py-4 shrink-0">
      <div className="flex items-center justify-between gap-3 mb-2">
        {/* Prev / Next Navigation */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev || isSaving}
            title="รายการก่อนหน้า"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
          >
            <FaChevronLeft />
          </button>
          {totalInList > 0 && (
            <span className="text-xs font-semibold text-slate-500 px-2 select-none">
              {currentIndex + 1} / {totalInList}
            </span>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext || isSaving}
            title="รายการถัดไป"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs cursor-pointer"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Status chip & Close button */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full ${
              evaluated
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {evaluated ? 'ประเมินแล้ว' : 'ยังไม่ประเมิน'}
          </span>

          <button
            type="button"
            onClick={handleRequestClose}
            title="ปิดหน้าต่าง"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
          >
            <FaTimes className="text-base" />
          </button>
        </div>
      </div>

      {/* Record Title */}
      <h3
        className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-2"
        title={recordTitle}
      >
        {recordTitle}
      </h3>
    </div>
  );

  // Custom Footer Slot: 2 equal-sized buttons (ออกจากหน้านี้ / บันทึกการประเมิน)
  const footerSlot = (
    <div className="space-y-3">
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <FaExclamationCircle className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        {/* Left Button: ออกจากหน้านี้ (Secondary gray, identical dimensions) */}
        <Button
          type="button"
          variant="evalSecondary"
          size="evalAction"
          onClick={handleRequestClose}
          disabled={isSaving}
        >
          ออกจากหน้านี้
        </Button>

        {/* Right Button: บันทึกการประเมิน (Primary green, hover turns black, identical dimensions) */}
        <Button
          type="button"
          variant="evalPrimary"
          size="evalAction"
          onClick={handlePerformSave}
          disabled={isSaving}
        >
          {isSaving ? 'กำลังบันทึก...' : 'บันทึกการประเมิน'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={handleRequestClose}
        width="w-full sm:w-[620px]"
        headerSlot={headerSlot}
        footerSlot={footerSlot}
        closeOnEsc={!isSaving}
        closeOnBackdrop={!isSaving}
        aria-label="การประเมิน"
      >
        <div className="px-6 py-5 space-y-6">
          {/* Section 1: Record summary */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
              <span className="w-1.5 h-3.5 bg-[#00A651] rounded-full" />
              <h4 className="text-xs font-bold text-slate-700 tracking-wide">
                ข้อมูลรายการ
              </h4>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs space-y-2">
            {category === 'research' && (
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                {record.id && (
                  <div>
                    <span className="text-slate-400 font-medium mr-1.5">รหัสโครงการ:</span>
                    <span className="font-semibold text-slate-800">{record.id}</span>
                  </div>
                )}
                {record.head && (
                  <div>
                    <span className="text-slate-400 font-medium mr-1.5">หัวหน้าโครงการ:</span>
                    <span className="font-semibold text-slate-800">{record.head}</span>
                  </div>
                )}
                {record.department && (
                  <div className="col-span-2 flex items-center gap-1.5 pt-0.5">
                    <span className="text-slate-400 font-medium">สังกัดที่รับผิดชอบ:</span>
                    <DepartmentBadge value={record.department} />
                  </div>
                )}
              </div>
            )}

            {category === 'academic' && (
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                {record.head && (
                  <div>
                    <span className="text-slate-400 font-medium mr-1.5">หัวหน้าโครงการ:</span>
                    <span className="font-semibold text-slate-800">{record.head}</span>
                  </div>
                )}
                {record.department && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">สังกัดทีร่วมดำเนินการ:</span>
                    <DepartmentBadge value={record.department} />
                  </div>
                )}
              </div>
            )}

            {category === 'publications' && (
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                {record.type && (
                  <div>
                    <span className="text-slate-400 font-medium mr-1.5">ชนิดของผลงาน:</span>
                    <span className="font-semibold text-slate-800">{record.type}</span>
                  </div>
                )}
                {record.level && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">ระดับ:</span>
                    <LevelBadge value={record.level} />
                  </div>
                )}
                {record.owner && (
                  <div>
                    <span className="text-slate-400 font-medium mr-1.5">เจ้าของผลงาน:</span>
                    <span className="font-semibold text-slate-800">{record.owner}</span>
                  </div>
                )}
                {record.department && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">สังกัด:</span>
                    <DepartmentBadge value={record.department} />
                  </div>
                )}
              </div>
            )}

            {category === 'service' && (
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                {record.date && (
                  <div>
                    <span className="text-slate-400 font-medium mr-1.5">วัน/เดือน/ปี:</span>
                    <span className="font-semibold text-slate-800">{formatDateBE(record.date)}</span>
                  </div>
                )}
                {record.service_type && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium mr-1.5">ประเภท:</span>
                    <ServiceTypeBadge value={record.service_type} />
                  </div>
                )}
                {record.person && (
                  <div>
                    <span className="text-slate-400 font-medium mr-1.5">ชื่อ - นามสกุล:</span>
                    <span className="font-semibold text-slate-800">{record.person}</span>
                  </div>
                )}
                {record.department && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">สังกัด:</span>
                    <DepartmentBadge value={record.department} />
                  </div>
                )}
              </div>
            )}

            {category === 'ip' && (
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                {record.type && (
                  <div>
                    <span className="text-slate-400 font-medium mr-1.5">ประเภท:</span>
                    <IPTypeBadge value={record.type} />
                  </div>
                )}
                {record.creator && (
                  <div>
                    <span className="text-slate-400 font-medium mr-1.5">ผู้ประดิษฐ์:</span>
                    <span className="font-semibold text-slate-800">{record.creator}</span>
                  </div>
                )}
                {record.department && (
                  <div className="col-span-2 flex items-center gap-1.5 pt-0.5">
                    <span className="text-slate-400 font-medium">สังกัด:</span>
                    <DepartmentBadge value={record.department} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Evaluation Form Fields */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
            <span className="w-1.5 h-3.5 bg-[#00A651] rounded-full" />
            <h4 className="text-xs font-bold text-slate-700 tracking-wide">
              การประเมิน
            </h4>
          </div>

          <EvaluationFields
            category={category}
            value={draftValue}
            onChange={setDraftValue}
            recordLevel={record.level}
            projectTitle={recordTitle}
            department={record.department}
          />
        </div>
      </div>
      </Drawer>

      {/* Discard changes confirmation */}
      {confirmCloseOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              ต้องการปิดโดยไม่บันทึกหรือไม่
            </h4>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmCloseOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmCloseOpen(false);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
