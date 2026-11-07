'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';

export interface StrategyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | number | null;
  className?: string;
  showPrefix?: boolean;
}

/**
 * Strategy & Work Plan Badge
 * Uses the exact same dimensions, height, typography and pill shape as DepartmentBadge,
 * styled with a dark gray background (#334155) and crisp white text.
 */
export function StrategyBadge({
  value,
  className,
  showPrefix = true,
  style,
  ...props
}: StrategyBadgeProps) {
  if (!value && value !== 0) return null;

  const rawStr = String(value).trim();
  const text = showPrefix && !rawStr.startsWith('ยุทธศาสตร์')
    ? `ยุทธศาสตร์ที่ ${rawStr}`
    : rawStr;

  return (
    <span
      className={cn(
        BADGE_BASE_CLASSES,
        "text-white bg-slate-700 shadow-xs border-transparent",
        className
      )}
      style={{
        backgroundColor: '#334155',
        color: '#ffffff',
        ...style,
      }}
      title={text}
      {...props}
    >
      {text}
    </span>
  );
}

export function PlanBadge({
  value,
  className,
  style,
  ...props
}: {
  value?: string | number | null;
  className?: string;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLSpanElement>) {
  if (!value && value !== 0) return null;

  return (
    <span
      className={cn(
        BADGE_BASE_CLASSES,
        "text-white bg-slate-700 shadow-xs border-transparent",
        className
      )}
      style={{
        backgroundColor: '#334155',
        color: '#ffffff',
        ...style,
      }}
      title={String(value)}
      {...props}
    >
      {value}
    </span>
  );
}
