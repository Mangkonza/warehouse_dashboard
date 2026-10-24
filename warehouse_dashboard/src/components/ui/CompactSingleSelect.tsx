'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CompactOption<T extends string = string> {
  value: T;
  label: string;
}

export interface CompactSingleSelectProps<T extends string = string> {
  options: CompactOption<T>[];
  value: T | null;
  onChange: (val: T | null) => void;
  activeClassName?: string;
  className?: string;
  itemClassName?: string;
  'aria-label'?: string;
}

/**
 * Compact Single Select component
 * - Fits content width (w-fit) to prevent wasting space
 * - Larger typography
 * - Toggleable: Clicking the active item deselects it (returns null)
 * - Pure UI: receives options, value, and onChange callback
 */
export function CompactSingleSelect<T extends string = string>({
  options,
  value,
  onChange,
  activeClassName = 'tag-iam bg-eval-ia text-white border-eval-ia-border shadow-xs font-bold',
  className,
  itemClassName,
  'aria-label': ariaLabel,
}: CompactSingleSelectProps<T>) {
  const handleToggle = (optValue: T) => {
    if (value === optValue) {
      onChange(null);
    } else {
      onChange(optValue);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1.5 w-fit",
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleToggle(opt.value)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[13.5px] font-semibold transition-all duration-150 text-center cursor-pointer min-w-[64px] select-none",
              isSelected
                ? activeClassName
                : "text-slate-700 hover:text-slate-900 hover:bg-white/80 border border-transparent",
              itemClassName
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
