'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';

export const TRL_COLOR = '#216B61';

export interface TrlBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number | string | null;
  level?: number | string | null;
  className?: string;
}

/**
 * Normalizes a TRL value (e.g., 3, "3", "TRL 3", "TRL3") into "TRL X".
 */
export function formatTrlLabel(raw?: number | string | null): string | null {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim();
  if (!s || s === '-' || s === '–' || s === 'nan' || s === 'NaT') return null;

  const numMatch = s.match(/^(?:trl\s*)?(\d+)$/i);
  if (numMatch) {
    return `TRL ${numMatch[1]}`;
  }
  if (/^trl/i.test(s)) {
    return s.replace(/^trl\s*/i, 'TRL ');
  }
  return `TRL ${s}`;
}

/**
 * Global component for rendering TRL Badge ("TRL 1" – "TRL 9")
 * Matches DepartmentBadge, ServiceTypeBadge, IPTypeBadge, and PublicationTypeBadge dimensions, padding, pill radius, bold weight, and white text.
 * Background color uses design token --color-trl (#216B61).
 */
export const TrlBadge: React.FC<TrlBadgeProps> = ({
  value,
  level,
  className,
  style,
  ...props
}) => {
  const formatted = formatTrlLabel(level ?? value);

  if (!formatted) {
    return (
      <span
        className={cn('text-slate-400 font-normal select-none', className)}
        style={style}
        {...props}
      >
        –
      </span>
    );
  }

  return (
    <span
      className={cn(
        BADGE_BASE_CLASSES,
        'tag-trl text-white font-bold border-0 shadow-none',
        className
      )}
      style={{
        backgroundColor: 'var(--color-trl, #216B61)',
        color: '#ffffff',
        ...style,
      }}
      title={formatted}
      {...props}
    >
      {formatted}
    </span>
  );
};

export default TrlBadge;
