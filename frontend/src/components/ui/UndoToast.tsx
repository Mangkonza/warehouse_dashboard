'use client';

import React from 'react';
import { FaUndo, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export interface UndoToastProps {
  message: string | null;
  onUndo?: () => void;
  onDismiss: () => void;
  className?: string;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  message,
  onUndo,
  onDismiss,
  className,
}) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-[1.5rem] left-1/2 -translate-x-1/2 z-[10100] flex items-center gap-[0.75rem] px-[1rem] py-[0.625rem] rounded-xl bg-slate-900 text-white text-[0.875rem] shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150',
        className
      )}
    >
      <FaCheckCircle className="text-emerald-400 text-[0.9375rem] shrink-0" />
      <span className="font-medium">{message}</span>
      {onUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex items-center gap-[0.3125rem] px-[0.625rem] py-[0.25rem] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[0.8125rem] transition-colors cursor-pointer"
        >
          <FaUndo className="text-[0.6875rem]" />
          <span>เลิกทำ</span>
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="ปิดการแจ้งเตือน"
        className="text-slate-400 hover:text-white p-[0.25rem] transition-colors cursor-pointer"
      >
        <FaTimes className="text-[0.75rem]" />
      </button>
    </div>
  );
};
