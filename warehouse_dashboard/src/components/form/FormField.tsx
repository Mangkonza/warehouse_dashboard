'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label?: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string | null;
  className?: string;
  labelClassName?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required = false,
  hint,
  error,
  className,
  labelClassName,
  htmlFor,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={htmlFor}
            className={cn(
              'text-[13px] font-semibold text-slate-700 flex items-center gap-1 select-none',
              labelClassName
            )}
          >
            <span>{label}</span>
            {required && <span className="text-red-500 font-bold">*</span>}
          </label>
          {hint && !error && (
            <span className="text-[11.5px] text-slate-400 font-normal">{hint}</span>
          )}
        </div>
      )}

      <div>{children}</div>

      {error && (
        <div className="flex items-center gap-1 text-[11.5px] font-medium text-red-600 mt-0.5 animate-in fade-in-50 duration-150">
          <AlertCircle className="size-3.5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
