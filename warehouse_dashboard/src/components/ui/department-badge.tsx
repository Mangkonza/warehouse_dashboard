'use client';

import React from 'react';
import { getDepartment } from '@/lib/departments';
import { cn } from '@/lib/utils';

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
          "inline-flex items-center justify-center min-w-[56px] px-3 py-[3px] rounded-full text-[12.5px] font-bold text-white whitespace-nowrap bg-slate-400 select-none",
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
        "inline-flex items-center justify-center min-w-[56px] px-3 py-[3px] rounded-full text-[12.5px] font-bold text-white whitespace-nowrap select-none cursor-default shadow-xs",
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
