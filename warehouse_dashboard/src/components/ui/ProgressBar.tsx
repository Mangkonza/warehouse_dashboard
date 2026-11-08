'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  className,
}) => {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className={cn('w-full space-y-[0.5rem]', className)}>
      <div className="flex items-center justify-between text-[0.875rem] text-slate-600">
        <span>{label || `กำลังดำเนินการ ${current} / ${total}`}</span>
        <span className="font-bold text-emerald-700">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-[0.75rem] bg-slate-100 rounded-full overflow-hidden border border-slate-200"
      >
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-200 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
