'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CountChipItem<T extends string = string> {
  key: T;
  label: string;
  count: number;
}

export interface CountChipsProps<T extends string = string> {
  items: CountChipItem<T>[];
  selectedKey: T;
  onSelect: (key: T) => void;
  className?: string;
}

export function CountChips<T extends string = string>({
  items,
  selectedKey,
  onSelect,
  className,
}: CountChipsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label="ตัวกรองหมวดหมู่"
      className={cn('flex items-center gap-[0.375rem] flex-wrap', className)}
    >
      {items.map((item) => {
        const isSelected = item.key === selectedKey;

        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(item.key)}
            className={cn(
              'px-[0.6875rem] py-[0.25rem] rounded-full text-[0.8125rem] font-semibold border transition-all cursor-pointer inline-flex items-center gap-[0.375rem] whitespace-nowrap',
              isSelected
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            )}
          >
            <span>{item.label}</span>
            <span
              className={cn(
                'text-[0.6875rem] px-[0.4375rem] py-[0.0625rem] rounded-full font-bold leading-tight',
                isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
              )}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
