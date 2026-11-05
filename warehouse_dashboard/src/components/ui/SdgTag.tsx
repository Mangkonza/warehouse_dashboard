'use client';

import React from 'react';
import { getSdgInfo, getSdgTextColor, parseSdgNumber, formatSdgLabel } from '@/lib/sdg';
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
 * Universal SDG Tag component matching Image 5:
 * - Perfect capsule pill (rounded-full)
 * - Exact height: 22px
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
          'inline-flex items-center justify-center h-[22px] px-2.5 rounded-full font-bold text-[11px] leading-none bg-slate-100 text-slate-700 border border-slate-300 select-none shrink-0',
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
        'inline-flex items-center justify-center h-[22px] px-2.5 rounded-full font-bold text-[11px] leading-none tracking-tight select-none shrink-0 transition-opacity',
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
