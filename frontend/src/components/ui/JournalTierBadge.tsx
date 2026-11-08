'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';
import { JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';

export interface JournalTierBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | null;
  className?: string;
  showTooltip?: boolean;
}

export function JournalTierBadge({
  value,
  className,
  showTooltip = true,
  style,
  ...props
}: JournalTierBadgeProps) {
  if (!value || value === '-' || value === 'nan' || value === 'NaT') return null;

  const raw = String(value).trim();
  let tierKey = raw;

  if (/^q1$/i.test(raw) || raw.includes('Q1') || raw.includes('Quartile 1')) tierKey = 'Q1';
  else if (/^q2$/i.test(raw) || raw.includes('Q2') || raw.includes('Quartile 2')) tierKey = 'Q2';
  else if (/^q3$/i.test(raw) || raw.includes('Q3') || raw.includes('Quartile 3')) tierKey = 'Q3';
  else if (/^q4$/i.test(raw) || raw.includes('Q4') || raw.includes('Quartile 4')) tierKey = 'Q4';
  else if (/tci\s*1/i.test(raw) || raw.includes('TCI 1') || raw.includes('กลุ่ม 1') || raw.includes('กลุ่มที่ 1')) tierKey = 'TCI 1';
  else if (/tci\s*2/i.test(raw) || raw.includes('TCI 2') || raw.includes('กลุ่ม 2') || raw.includes('กลุ่มที่ 2')) tierKey = 'TCI 2';
  else if (/tci\s*3/i.test(raw) || raw.includes('TCI 3') || raw.includes('กลุ่ม 3') || raw.includes('กลุ่มที่ 3')) tierKey = 'TCI 3';
  else if (/tci/i.test(raw)) tierKey = 'TCI 1';

  const tierStyle = JOURNAL_TIER_STYLES[tierKey] || {
    bg: '#4338ca',
    text: '#ffffff',
    border: '#3730a3',
    glow: 'rgba(67, 56, 202, 0.35)',
  };

  return (
    <span
      className={cn(BADGE_BASE_CLASSES, className)}
      style={{
        backgroundColor: tierStyle.bg,
        color: tierStyle.text,
        border: `1px solid ${tierStyle.border}`,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
        ...style,
      }}
      title={showTooltip ? `ระดับฐานข้อมูลวารสาร: ${tierKey}` : undefined}
      {...props}
    >
      {tierKey}
    </span>
  );
}
