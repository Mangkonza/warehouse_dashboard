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
  fieldKey?: string;
  id?: string;
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
  fieldKey,
  id,
  children,
}: FormFieldProps) {
  const containerId = id || (fieldKey ? `field-${fieldKey}` : undefined);

  return (
    <div
      id={containerId}
      data-field={fieldKey}
      className={cn('flex flex-col gap-1.5 w-full', className)}
    >
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
            {required && (
              <span className="text-rose-500 font-bold text-sm leading-none ml-0.5" title="จำเป็นต้องระบุ">*</span>
            )}
          </label>
          {hint && !error && (
            <span className="text-[11.5px] text-slate-400 font-normal">{hint}</span>
          )}
        </div>
      )}

      <div className="relative">
        {children}

        {error && (
          <div className="absolute top-[calc(100%+6px)] left-0 z-40 pointer-events-none animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-rose-300 shadow-xl shadow-rose-950/10 text-xs font-medium text-slate-800 pointer-events-auto whitespace-nowrap">
              {/* Top caret arrow pointing up to input */}
              <span className="absolute -top-1.5 left-4 size-2.5 bg-white border-t border-l border-rose-300 rotate-45 transform" />
              <div className="size-4 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                !
              </div>
              <span className="text-rose-700 font-normal">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
