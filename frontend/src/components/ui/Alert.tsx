'use client';

import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps {
  variant?: AlertVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<AlertVariant, { container: string; icon: React.ReactNode }> = {
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon: <FaCheckCircle className="text-emerald-600 text-[1.125rem] shrink-0 mt-[0.125rem]" />,
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-900',
    icon: <FaExclamationTriangle className="text-amber-500 text-[1.125rem] shrink-0 mt-[0.125rem]" />,
  },
  error: {
    container: 'bg-rose-50 border-rose-200 text-rose-900',
    icon: <FaTimesCircle className="text-rose-600 text-[1.125rem] shrink-0 mt-[0.125rem]" />,
  },
  info: {
    container: 'bg-slate-100 border-slate-200 text-slate-800',
    icon: <FaInfoCircle className="text-slate-600 text-[1.125rem] shrink-0 mt-[0.125rem]" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  action,
  className,
}) => {
  const style = VARIANT_STYLES[variant];

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start justify-between gap-[0.75rem] rounded-xl border p-[0.75rem] text-[0.875rem] leading-relaxed',
        style.container,
        className
      )}
    >
      <div className="flex items-start gap-[0.625rem] min-w-0 flex-1">
        {style.icon}
        <div className="min-w-0 flex-1 space-y-[0.25rem]">
          {title && <div className="font-semibold text-[0.875rem] leading-snug">{title}</div>}
          {children && <div className="text-[0.875rem] opacity-95">{children}</div>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
