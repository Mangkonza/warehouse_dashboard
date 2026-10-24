'use client';

import React from 'react';
import { BlockSingleSelect, BlockSelectOption } from '@/components/ui/BlockSingleSelect';

export interface JournalQualitySelectProps {
  level?: string | null;
  value?: string | null;
  onChange: (val: string | null) => void;
  className?: string;
}

const TCI_OPTIONS: BlockSelectOption[] = [
  { label: 'TCI 1', value: 'TCI 1' },
  { label: 'TCI 2', value: 'TCI 2' },
  { label: 'TCI 3', value: 'TCI 3' },
];

const Q_OPTIONS: BlockSelectOption[] = [
  { label: 'Q1', value: 'Q1' },
  { label: 'Q2', value: 'Q2' },
  { label: 'Q3', value: 'Q3' },
  { label: 'Q4', value: 'Q4' },
];

/**
 * Journal Quality Selector:
 * Automatically provides TCI 1-3 for 'ชาติ' and Q1-Q4 for 'นานาชาติ'.
 * Uses BlockSingleSelect so blocks have identical sizing as I AM / I SEE.
 * If level is empty or unmapped, displays a concise fallback notice without options.
 */
export const JournalQualitySelect: React.FC<JournalQualitySelectProps> = ({
  level,
  value,
  onChange,
  className,
}) => {
  const normLevel = String(level || '').trim();

  if (normLevel === 'ชาติ') {
    return (
      <BlockSingleSelect
        options={TCI_OPTIONS}
        value={value}
        onChange={onChange}
        colorVariant="journal"
        className={className}
        aria-label="เลือกระดับ TCI"
      />
    );
  }

  if (normLevel === 'นานาชาติ') {
    return (
      <BlockSingleSelect
        options={Q_OPTIONS}
        value={value}
        onChange={onChange}
        colorVariant="journal"
        className={className}
        aria-label="เลือกระดับ Q"
      />
    );
  }

  return (
    <div className="text-xs text-slate-400 py-1">
      ยังไม่ระบุระดับ
    </div>
  );
};
