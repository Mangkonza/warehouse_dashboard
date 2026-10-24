'use client';

import React from 'react';
import { EvaluationValue, IType, parseSdgNumber, formatSdgLabel } from '@/types/evaluation';
import { SDGTagSelector } from '@/app/(dashboard)/manage/_components/SDGTagSelector';
import { BlockSingleSelect, BlockSelectOption } from '@/components/ui/BlockSingleSelect';
import { JournalQualitySelect } from '@/components/ui/JournalQualitySelect';
import { cn } from '@/lib/utils';

export interface EvaluationFieldsProps {
  category: string;
  value: EvaluationValue;
  onChange: (val: EvaluationValue) => void;
  compact?: boolean;
  recordLevel?: string; // 'ชาติ' | 'นานาชาติ' | '' (for publications)
  projectTitle?: string;
  department?: string;
  className?: string;
}

const IA_OPTIONS: BlockSelectOption<IType>[] = [
  { label: 'I AM', value: 'I_AM' },
  { label: 'I SEE', value: 'I_SEE' },
];

export const EvaluationFields: React.FC<EvaluationFieldsProps> = ({
  category,
  value,
  onChange,
  compact = false,
  recordLevel = '',
  projectTitle = '',
  department = '',
  className,
}) => {
  const isPublication = category.toLowerCase() === 'publications';

  // 1. SDGs handler
  const currentSdgStrings = (value.sdg_ids || []).map((num) => formatSdgLabel(num));

  const handleSdgChange = (selectedCodes: string[]) => {
    const ids = selectedCodes
      .map((code) => parseSdgNumber(code))
      .filter((n): n is number => n !== null && n >= 1 && n <= 17)
      .sort((a, b) => a - b);
    onChange({
      ...value,
      sdg_ids: ids,
    });
  };

  // 2. I AM / I SEE handler
  const handleITypeChange = (nextVal: IType | null) => {
    onChange({
      ...value,
      i_type: nextVal,
    });
  };

  // 3. Q / TCI handler (Auto-determined by level)
  const handleJournalChange = (valStr: string | null) => {
    if (!valStr) {
      onChange({ ...value, journal_index: null });
      return;
    }
    const type = valStr.startsWith('TCI') ? 'TCI' : 'Q';
    onChange({
      ...value,
      journal_index: { type: type as any, value: valStr },
    });
  };

  return (
    <div className={cn("flex flex-col gap-5", compact && "gap-3.5", className)}>
      {/* Field 1: SDGs (Evaluation variant: SdgCard with number prefix, no icons, white on #006C68 when selected) */}
      <div className="flex flex-col gap-1.5">
        <SDGTagSelector
          selectedSDGs={currentSdgStrings}
          onChange={handleSdgChange}
          projectTitle={projectTitle}
          department={department}
          variant="evaluation"
        />
      </div>

      {/* Field 2: I AM / I SEE (BlockSingleSelect with colorVariant="iam") */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800">
            กรอบประเมิน I am / I see
          </label>
          <span className="text-[11px] text-slate-500">เลือกได้ 1 รายการ (คลิกซ้ำเพื่อยกเลิก)</span>
        </div>

        <BlockSingleSelect<IType>
          options={IA_OPTIONS}
          value={value.i_type ?? null}
          onChange={handleITypeChange}
          colorVariant="iam"
          aria-label="กรอบประเมิน I am / I see"
        />
      </div>

      {/* Field 3: Q / TCI (Publications only: Auto-determined by recordLevel, exact same block sizing as I AM / I SEE) */}
      {isPublication && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              ระดับคุณภาพวารสาร (Q / TCI)
            </label>
            <span className="text-[11px] text-slate-500">
              {recordLevel ? `ระดับ: ${recordLevel}` : 'ยังไม่ระบุระดับ'}
            </span>
          </div>

          <JournalQualitySelect
            level={recordLevel}
            value={value.journal_index?.value ?? null}
            onChange={handleJournalChange}
          />
        </div>
      )}
    </div>
  );
};
