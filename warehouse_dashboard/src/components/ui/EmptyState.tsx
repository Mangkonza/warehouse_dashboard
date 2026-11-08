'use client';

import React from 'react';
import { FaInbox } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex-1 flex flex-col items-center justify-center p-[2rem] text-center text-slate-500 min-h-[12rem]',
        className
      )}
    >
      <div className="w-[3rem] h-[3rem] rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-[0.75rem]">
        {icon || <FaInbox className="text-[1.25rem]" />}
      </div>
      <p className="text-[0.9375rem] font-semibold text-slate-700">{title}</p>
      {description && (
        <p className="text-[0.875rem] text-slate-500 mt-[0.25rem] max-w-[24rem]">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          type="button"
          variant="outline"
          onClick={onAction}
          className="mt-[0.875rem] text-[0.875rem] h-[2.25rem] px-[1rem] cursor-pointer"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
