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

  const shortThaiName = (() => {
    const n = dept.name || '';
    if (n.includes('ประตู') || n.includes('หน้าต่าง')) return 'ศูนย์ทดสอบประตู-หน้าต่างฯ';
    if (n.includes('พลังงานและสิ่งแวดล้อม')) return 'ศูนย์พลังงานและสิ่งแวดล้อม';
    if (n.includes('เครื่องจักรกลการเกษตร')) return 'ศูนย์เครื่องจักรกลการเกษตรฯ';
    return n.replace(/^ภาควิชา/, '').trim() || n;
  })();

  return (
    <span
      className={cn(BADGE_BASE_CLASSES, className)}
      style={{
        backgroundColor: dept.color,
        color: '#1e293b',
        fontWeight: 600,
        ...style,
      }}
      title={showTooltip ? dept.name : undefined}
      {...props}
    >
      {shortThaiName}
    </span>
  );
}
