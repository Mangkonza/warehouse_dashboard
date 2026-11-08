'use client';

import React from 'react';
import { getSdgInfo, getSdgTextColor, parseSdgNumber, formatSdgLabel } from '@/lib/sdg';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';

export interface SdgTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  n: number | string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'capsule' | 'square';
  showIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Universal SDG Tag component:
 * - Perfectly standardized dimensions, padding, font size, and pill radius matching DepartmentBadge and I AM / I SEE (BADGE_BASE_CLASSES)
 * - Background: official UN SDG color
 * - Text color: contrast-based (White on dark colors, Black on light colors)
 * - Tooltip title: Full official Thai goal title
 */
export const SdgTag: React.FC<SdgTagProps> = ({
  n,
  size = 'md',
  variant = 'capsule',
  className,
  style,
  ...props
}) => {
  const parsedNum = parseSdgNumber(n);
  const info = parsedNum ? getSdgInfo(parsedNum) : null;

  if (!info) {
    return (
      <span
        className={cn(
          BADGE_BASE_CLASSES,
          'bg-slate-100 text-slate-700 border-slate-300',
          className
        )}
        style={style}
        {...props}
      >
        {formatSdgLabel(n)}
      </span>
    );
  }

  const bgColor = info.color;
  const textColor = getSdgTextColor(info.number);

  return (
    <span
      className={cn(
        BADGE_BASE_CLASSES,
        'transition-opacity shrink-0',
        className
      )}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        ...style,
      }}
      title={`${info.code}: ${info.nameTh}`}
      aria-label={`${info.code}: ${info.nameTh}`}
      {...props}
    >
      {info.code}
    </span>
  );
};
