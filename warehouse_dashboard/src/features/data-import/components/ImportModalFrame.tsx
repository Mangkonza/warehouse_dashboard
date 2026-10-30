'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaFileExcel } from 'react-icons/fa';
import { Stepper, StepItem } from '@/components/ui/Stepper';
import { SplitPhase } from '@/hooks/useSplitTransition';

export interface ImportModalFrameProps {
  isOpen: boolean;
  step: 1 | 2 | 3;
  phase: SplitPhase;
  isSaving?: boolean;
  hasDetailOpen?: boolean;
  onEscapeCloseDetail?: () => void;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const IMPORT_STEPS: StepItem[] = [
  { step: 1, label: 'เลือกไฟล์' },
  { step: 2, label: 'ตรวจสอบและแก้ไข' },
  { step: 3, label: 'ผลการนำเข้า' },
];

export const ImportModalFrame: React.FC<ImportModalFrameProps> = ({
  isOpen,
  step,
  phase,
  isSaving = false,
  hasDetailOpen = false,
  onEscapeCloseDetail,
  onClose,
  footer,
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const openPopover = document.querySelector(
          '[data-slot="popover-content"], [data-slot="select-content"]'
        );
        if (openPopover) return;

        e.stopPropagation();
        if (hasDetailOpen && onEscapeCloseDetail) {
          onEscapeCloseDetail();
        } else if (!isSaving) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasDetailOpen, onEscapeCloseDetail, isSaving, onClose]);

  if (!isOpen || !mounted) return null;

  const effectivePhase: SplitPhase = step === 2 ? phase : 'list';

  return createPortal(
    <div
      className="fixed inset-0 z-[9500] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-[clamp(0.5rem,1.5vw,1.25rem)] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div
        data-phase={effectivePhase}
        className="imp-root bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800"
      >
        {/* Header: T1.1 - Vertically centered single title without subtitle */}
        <header className="imp-header shrink-0 border-b border-slate-200 bg-white flex items-center justify-between gap-[1rem]">
          <div className="flex items-center gap-[0.75rem] min-w-0">
            <div className="w-[2.25rem] h-[2.25rem] rounded-[0.625rem] bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <FaFileExcel className="text-[1.125rem]" />
            </div>
            <h2
              id="import-modal-title"
              className="text-[clamp(0.9375rem,0.85rem+0.35vw,1.0625rem)] font-bold text-slate-900 truncate"
            >
              นำเข้าไฟล์ Excel ข้อมูลคณะวิศวกรรมศาสตร์
            </h2>
          </div>

          <div className="hidden md:flex items-center shrink-0">
            <Stepper steps={IMPORT_STEPS} currentStep={step} />
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            aria-label="ปิดหน้าต่างนำเข้าข้อมูล"
            className="w-[2rem] h-[2rem] rounded-[0.5rem] flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
          >
            <FaTimes className="text-[0.875rem]" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <footer className="imp-footer shrink-0 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between gap-[0.75rem]">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
};
