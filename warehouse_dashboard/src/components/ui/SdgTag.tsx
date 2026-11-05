'use client';

import React from 'react';
import { getSdgInfo, getSdgTextColor, parseSdgNumber, formatSdgLabel } from '@/lib/sdg';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';
import { cn } from '@/lib/utils';

export interface SdgTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  n: number | string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'capsule' | 'square';
  showIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Universal SDG Tag component.
 * - Capsule height ~24px
 * - Background = official UN SDG color
 * - Text color = WCAG 2.1 contrast ratio >= 4.5:1 (white or dark charcoal)
 * - Tooltip title = Full official Thai goal title
 */
export const SdgTag: React.FC<SdgTagProps> = ({
  n,
  size = 'md',
  variant = 'capsule',
  showIcon = false,
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
          'bg-slate-100 text-slate-700 border border-slate-300',
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

  const sizeClasses = {
    sm: 'h-5 px-2 text-[10.5px]',
    md: 'h-6 px-2.5 text-[11px] leading-none',
    lg: 'h-7 px-3 text-[12px]',
  }[size];

  const variantRadius = variant === 'capsule' ? 'rounded-full' : 'rounded-md';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold tracking-tight select-none transition-transform duration-100 shrink-0 shadow-xs border border-black/10',
        sizeClasses,
        variantRadius,
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
