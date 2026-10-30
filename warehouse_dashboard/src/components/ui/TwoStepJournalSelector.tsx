'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';

export type JournalCategory = 'Q' | 'TCI';

export interface JournalValue {
  type: JournalCategory;
  value: string;
}

export interface TwoStepJournalSelectorProps {
  value?: JournalValue | null;
  onChange: (val: JournalValue | null) => void;
  recordLevel?: string; // 'ชาติ' | 'นานาชาติ' | ''
  className?: string;
}

const Q_OPTIONS = ['Q1', 'Q2', 'Q3', 'Q4'];
const TCI_OPTIONS = ['TCI 1', 'TCI 2', 'TCI 3'];

/**
 * 2-Step Journal Quality Selector:
 * Step 1: Select type ("Q" or "TCI")
 * Step 2: Select rank number (Q1-Q4 or TCI 1-3)
 * Changing category automatically clears previous number selection.
 * TCI 1-3 buttons are sized smaller than standard tags.
 */
export const TwoStepJournalSelector: React.FC<TwoStepJournalSelectorProps> = ({
  value,
  onChange,
  recordLevel = '',
  className,
}) => {
  // Infer active type from current value or local selection
  const [activeType, setActiveType] = useState<JournalCategory | null>(() => {
    if (value?.type === 'Q' || value?.type === 'TCI') return value.type;
    if (value?.value?.startsWith('Q')) return 'Q';
    if (value?.value?.startsWith('TCI')) return 'TCI';
    if (recordLevel === 'นานาชาติ') return 'Q';
    if (recordLevel === 'ชาติ') return 'TCI';
    return null;
  });

  useEffect(() => {
    if (value?.type === 'Q' || value?.type === 'TCI') {
      setActiveType(value.type);
    } else if (value?.value?.startsWith('Q')) {
      setActiveType('Q');
    } else if (value?.value?.startsWith('TCI')) {
      setActiveType('TCI');
    }
  }, [value]);

  const handleTypeSelect = (type: JournalCategory) => {
    if (activeType === type) {
      // Deselect type completely
      setActiveType(null);
      onChange(null);
    } else {
      // Switch type and clear previous number
      setActiveType(type);
      onChange(null);
    }
  };

  const handleNumberSelect = (numVal: string) => {
    if (!activeType) return;
    if (value?.value === numVal) {
      // Deselect number
      onChange(null);
    } else {
      onChange({
        type: activeType,
        value: numVal,
      });
    }
  };

  // Determine which type buttons to display based on level if specified
  const showQ = recordLevel !== 'ชาติ';
  const showTCI = recordLevel !== 'นานาชาติ';

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {/* Step 1: Category Selection ("Q" or "TCI") */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">
            ขั้นที่ 1: เลือกประเภทวารสาร (Q หรือ TCI)
          </span>
          <span className="text-[11px] text-slate-400">เลือก 1 ประเภท</span>
        </div>

        <div className="flex items-center gap-2">
          {showQ && (
            <button
              type="button"
              onClick={() => handleTypeSelect('Q')}
              className={cn(
                BADGE_BASE_CLASSES,
                "transition-all cursor-pointer select-none",
                activeType === 'Q'
                  ? "tag-journal bg-eval-journal text-white border border-eval-journal-border shadow-xs"
                  : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900"
              )}
            >
              Q (นานาชาติ)
            </button>
          )}

          {showTCI && (
            <button
              type="button"
              onClick={() => handleTypeSelect('TCI')}
              className={cn(
                BADGE_BASE_CLASSES,
                "transition-all cursor-pointer select-none",
                activeType === 'TCI'
                  ? "tag-journal bg-eval-journal text-white border border-eval-journal-border shadow-xs"
                  : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900"
              )}
            >
              TCI (ชาติ)
            </button>
          )}
        </div>
      </div>

      {/* Step 2: Number Selection based on category */}
      {activeType && (
        <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              ขั้นที่ 2: เลือกระดับ {activeType}
            </span>
            <span className="text-[11px] text-slate-400">คลิกซ้ำเพื่อยกเลิก</span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {activeType === 'Q' &&
              Q_OPTIONS.map((opt) => {
                const isSelected = value?.value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleNumberSelect(opt)}
                    className={cn(
                      BADGE_BASE_CLASSES,
                      "transition-all cursor-pointer select-none",
                      isSelected
                        ? "tag-journal bg-eval-journal text-white border border-eval-journal-border shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}

            {activeType === 'TCI' &&
              TCI_OPTIONS.map((opt) => {
                const isSelected = value?.value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleNumberSelect(opt)}
                    className={cn(
                      "inline-flex items-center justify-center min-w-[46px] px-2.5 py-[2px] rounded-full text-[11px] font-semibold transition-all cursor-pointer select-none shadow-xs text-center",
                      isSelected
                        ? "tag-journal bg-eval-journal text-white border border-eval-journal-border font-bold"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
