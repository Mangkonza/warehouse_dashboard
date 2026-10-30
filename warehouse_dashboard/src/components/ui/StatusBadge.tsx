'use client';

import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaBan } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export type StatusBadgeVariant = 'ready' | 'warning' | 'error' | 'duplicate' | 'excluded' | 'fixed';

export interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  label?: string;
  className?: string;
}

const STATUS_CONFIG: Record<
  StatusBadgeVariant,
  { defaultLabel: string; classes: string; icon: React.ReactNode }
> = {
  ready: {
    defaultLabel: 'พร้อม',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <FaCheckCircle className="text-[0.6875rem] text-emerald-500 shrink-0" />,
  },
  warning: {
    defaultLabel: 'ควรตรวจ',
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: <FaExclamationTriangle className="text-[0.6875rem] text-amber-500 shrink-0" />,
  },
  error: {
    defaultLabel: 'ต้องแก้ไข',
    classes: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: <FaTimesCircle className="text-[0.6875rem] text-rose-500 shrink-0" />,
  },
  duplicate: {
    defaultLabel: 'ซ้ำ',
    classes: 'bg-slate-100 text-slate-600 border-slate-300',
    icon: <FaBan className="text-[0.6875rem] text-slate-400 shrink-0" />,
  },
  excluded: {
    defaultLabel: 'ไม่นำเข้า',
    classes: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: <FaBan className="text-[0.6875rem] text-slate-400 shrink-0" />,
  },
  fixed: {
    defaultLabel: 'แก้ไขแล้ว ✓',
    classes: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: <FaCheckCircle className="text-[0.6875rem] text-emerald-600 shrink-0" />,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label, className }) => {
  const cfg = STATUS_CONFIG[variant] || STATUS_CONFIG.ready;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[0.3125rem] px-[0.5625rem] py-[0.1875rem] rounded-full text-[0.75rem] font-semibold border whitespace-nowrap select-none',
        cfg.classes,
        className
      )}
    >
      {cfg.icon}
      <span>{label || cfg.defaultLabel}</span>
    </span>
  );
};
