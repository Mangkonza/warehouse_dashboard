'use client';

import React from 'react';
import { getDepartment } from '@/lib/departments';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';

export interface DepartmentBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | null;
  className?: string;
  showTooltip?: boolean;
}

export function DepartmentBadge({
  value,
  className,
  showTooltip = true,
  style,
  ...props
}: DepartmentBadgeProps) {
  if (!value || value === '-' || value === 'nan' || value === 'NaT' || value === 'ü' || value === 'P') {
    return (
      <span
        className={cn(
          cn(BADGE_BASE_CLASSES, "text-white bg-slate-400"),
          className
        )}
        title="ไม่ระบุสังกัด"
        style={style}
        {...props}
      >
        -
      </span>
    );
  }

  // Handle multi-department strings separated by comma (e.g. "ภาควิชาวิศวกรรมโยธา, ภาควิชาวิศวกรรมการอาหาร")
  const rawList = String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (rawList.length > 1) {
    return (
      <span className="inline-flex items-center gap-1.5 flex-wrap">
        {rawList.map((item, idx) => (
          <DepartmentBadge
            key={idx}
            value={item}
            showTooltip={showTooltip}
            className={className}
          />
        ))}
      </span>
    );
  }

  const dept = getDepartment(rawList[0] || value);

  return (
    <span
      className={cn(
        cn(BADGE_BASE_CLASSES, "text-white"),
        className
      )}
      style={{
        backgroundColor: dept.color,
        color: '#ffffff',
        ...style,
      }}
      title={showTooltip ? dept.name : undefined}
      {...props}
    >
      {dept.code}
    </span>
  );
}
