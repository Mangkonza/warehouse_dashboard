'use client';

import React, { useState } from 'react';
import { CategoryKey } from '@/types/dataManagement';
import { EvaluationValue } from '@/types/evaluation';
import { EvaluationFields } from '@/components/evaluation/EvaluationFields';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { FaTimes, FaCheckSquare } from 'react-icons/fa';

export interface BulkEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryKey;
  selectedRecords: any[];
  onApply: (draft: EvaluationValue) => Promise<void>;
}

const EMPTY_VALUE: EvaluationValue = {
  sdg_ids: [],
  i_type: null,
  journal_index: null,
};

export const BulkEvaluationModal: React.FC<BulkEvaluationModalProps> = ({
  isOpen,
  onClose,
  category,
  selectedRecords,
  onApply,
}) => {
  const [draft, setDraft] = useState<EvaluationValue>(EMPTY_VALUE);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // For publications: check if all selected items share the same level ('นานาชาติ' or 'ชาติ')
  const sameLevel = React.useMemo(() => {
    if (category !== 'publications' || selectedRecords.length === 0) return '';
    const firstLevel = String(selectedRecords[0]?.level || '').trim();
    if (!firstLevel) return '';
    const allSame = selectedRecords.every(
      (r) => String(r.level || '').trim() === firstLevel
    );
    return allSame ? firstLevel : '';
  }, [category, selectedRecords]);

  const handleOpenConfirm = () => {
    setIsConfirming(true);
  };

  const handlePerformApply = async () => {
    try {
      setIsSubmitting(true);
      await onApply(draft);
      setIsConfirming(false);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      >
        <div
          role="dialog"
          aria-modal="true"
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00A651] flex items-center justify-center text-sm">
                <FaCheckSquare />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ประเมินรายการที่เลือก
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                  เลือกแล้ว {selectedRecords.length} รายการ
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title="ปิดหน้าต่าง"
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            <EvaluationFields
              category={category}
              value={draft}
              onChange={setDraft}
              recordLevel={sameLevel}
              compact={false}
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleOpenConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#00A651] text-white hover:bg-[#008f45] transition-colors shadow-xs cursor-pointer"
            >
              กำหนดค่า
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmActionModal
        isOpen={isConfirming}
        title="ประเมินรายการที่เลือก"
        message={`ต้องการกำหนดค่าการประเมินให้กับ ${selectedRecords.length} รายการที่เลือกหรือไม่`}
        confirmText="กำหนดค่า"
        cancelText="ยกเลิก"
        type="success"
        onConfirm={handlePerformApply}
        onCancel={() => setIsConfirming(false)}
      />
    </>
  );
};
