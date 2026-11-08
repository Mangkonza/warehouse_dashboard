'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BlockSelectOption<T extends string = string> {
  label: string;
  value: T;
}

export type BlockColorVariant = 'iam' | 'journal';

export interface BlockSingleSelectProps<T extends string = string> {
  options: BlockSelectOption<T>[];
  value: T | null | undefined;
  onChange: (val: T | null) => void;
  colorVariant: BlockColorVariant;
  className?: string;
  'aria-label'?: string;
}

/**
 * Global single-select block component used for both:
 * 1. I AM / I SEE (colorVariant="iam")
 * 2. Q / TCI (colorVariant="journal")
 *
 * Requirements:
 * - Every block has identical width (w-[76px]), height (h-[36px]), font-size (13px), and padding
 * - Fits content width (w-fit) without stretching full width
 * - Click again to deselect
 * - Pure UI: receives options, value, and onChange callback
 */
export function BlockSingleSelect<T extends string = string>({
  options,
  value,
  onChange,
  colorVariant,
  className,
  'aria-label': ariaLabel,
}: BlockSingleSelectProps<T>) {
  const handleToggle = (optValue: T) => {
    if (value === optValue) {
      onChange(null);
    } else {
      onChange(optValue);
    }
  };

  const selectedClasses =
    colorVariant === 'iam'
      ? 'tag-iam bg-eval-ia text-white border border-eval-ia-border font-bold shadow-xs'
      : 'tag-journal bg-eval-journal text-white border border-eval-journal-border font-bold shadow-xs';

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("inline-flex items-center gap-2 flex-wrap w-fit", className)}
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
              "w-[76px] h-[36px] px-3 py-1.5 rounded-lg text-[13px] font-semibold text-center select-none transition-all cursor-pointer flex items-center justify-center shrink-0",
              isSelected
                ? selectedClasses
                : "bg-slate-100 text-slate-700 border border-slate-200/90 hover:bg-slate-200 hover:text-slate-900"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
