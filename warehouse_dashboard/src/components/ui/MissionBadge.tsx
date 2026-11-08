'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';
import { CategoryKey } from '@/types/dataManagement';

export interface MissionBadgeStyle {
  label: string;
  bg: string;
  border: string;
  text: string;
}

export const MISSION_BADGE_STYLES: Record<string, MissionBadgeStyle> = {
  research: {
    label: 'โครงการวิจัย',
    bg: '#00A651',
    border: '#008a43',
    text: '#ffffff',
  },
  academic: {
    label: 'โครงการพัฒนาวิชาการ',
    bg: '#1565c0',
    border: '#0d47a1',
    text: '#ffffff',
  },
  publications: {
    label: 'ผลงานตีพิมพ์ทางวิชาการ',
    bg: '#e11d48',
    border: '#be123c',
    text: '#ffffff',
  },
  service: {
    label: 'งานบริการวิชาการ',
    bg: '#e65100',
    border: '#b45309',
    text: '#ffffff',
  },
  ip: {
    label: 'งานทรัพย์สินทางปัญญา',
    bg: '#6a1b9a',
    border: '#4a148c',
    text: '#ffffff',
  },
  monitoring: {
    label: 'ติดตามสถานะโครงการ',
    bg: '#0284c7',
    border: '#0369a1',
    text: '#ffffff',
  },
};

export interface MissionBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category?: CategoryKey | string | null;
  value?: string | null;
  label?: string;
  className?: string;
  showTooltip?: boolean;
}

export function MissionBadge({
  category,
  value,
  label: customLabel,
  className,
  showTooltip = true,
  style,
  ...props
}: MissionBadgeProps) {
  const raw = String(category || value || '').trim();
  if (!raw || raw === '-' || raw === 'nan') return null;

  const lower = raw.toLowerCase();
  let key = 'research';

  if (lower === 'research' || lower.includes('วิจัย')) {
    key = 'research';
  } else if (lower === 'academic' || lower.includes('พัฒนาวิชาการ')) {
    key = 'academic';
  } else if (lower === 'publications' || lower.includes('ตีพิมพ์') || lower.includes('publication')) {
    key = 'publications';
  } else if (lower === 'service' || lower.includes('บริการวิชาการ')) {
    key = 'service';
  } else if (lower === 'ip' || lower.includes('ทรัพย์สิน') || lower.includes('intellectual')) {
    key = 'ip';
  } else if (lower === 'monitoring' || lower.includes('ติดตาม')) {
    key = 'monitoring';
  } else {
    key = 'research';
  }

  const badgeStyle = MISSION_BADGE_STYLES[key] || MISSION_BADGE_STYLES.research;
  const displayLabel = customLabel || badgeStyle.label;

  return (
    <span
      className={cn(BADGE_BASE_CLASSES, 'text-white', className)}
      style={{
        backgroundColor: badgeStyle.bg,
        color: badgeStyle.text,
        border: `1px solid ${badgeStyle.border}`,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
        ...style,
      }}
      title={showTooltip ? displayLabel : undefined}
      {...props}
    >
      {displayLabel}
    </span>
  );
}

// Alias for CategoryBadge
export const CategoryBadge = MissionBadge;
