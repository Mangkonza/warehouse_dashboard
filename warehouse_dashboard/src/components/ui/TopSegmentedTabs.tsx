'use client';

import React from 'react';
import { CategoryKey } from '@/types/dataManagement';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { LiquidButton } from '@/components/ui/liquid-glass';
import { cn } from '@/lib/utils';

export interface TabItem<T = string> {
  key: T;
  label: string;
  count?: number;
}

export interface TopSegmentedTabsProps<T extends string = string> {
  activeCategory: T;
  onSelectCategory: (category: T) => void;
  counts?: Partial<Record<T, number>>;
  tabs?: TabItem<T>[];
}

export const TopSegmentedTabs = <T extends string = CategoryKey>({
  activeCategory,
  onSelectCategory,
  counts = {},
  tabs,
}: TopSegmentedTabsProps<T>) => {
  const defaultCategoryKeys: CategoryKey[] = [
    'research',
    'academic',
    'service',
    'publications',
    'ip',
    'personnel',
    'kpi',
  ];

  const resolvedTabs: TabItem<T>[] = tabs || defaultCategoryKeys.map((key) => {
    const config = CATEGORIES_CONFIG[key as CategoryKey];
    return {
      key: key as unknown as T,
      label: config?.title || key,
      count: counts[key as unknown as T] ?? 0,
    };
  });

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '4px 2px 8px',
        scrollbarWidth: 'none',
        alignItems: 'center',
      }}
    >
      {resolvedTabs.map((tab) => {
        const isActive = activeCategory === tab.key;
        const count = tab.count ?? (counts[tab.key] ?? 0);

        return (
          <LiquidButton
            key={String(tab.key)}
            onClick={() => onSelectCategory(tab.key)}
            variant={isActive ? 'active' : 'tab'}
            size="tab"
            className={cn(
              "cursor-pointer select-none transition-all duration-300",
              isActive
                ? "rounded-full bg-gradient-to-r from-[#00A651] via-[#059669] to-[#008a43] text-white shadow-[0_4px_12px_rgba(0,166,81,0.3)] scale-[1.02] [&>div:nth-child(-n+2)]:hidden"
                : "bg-white/70 hover:bg-white text-slate-700 hover:text-[#00A651] hover:scale-[1.02] border border-slate-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md"
            )}
          >
            <span className="font-semibold text-[13.5px] whitespace-nowrap">
              {tab.label}
            </span>

            {count !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs min-w-[22px] transition-all",
                  isActive
                    ? "bg-white/25 text-white font-bold"
                    : "bg-slate-100 text-slate-600 font-semibold border border-slate-200/60"
                )}
              >
                {count.toLocaleString()}
              </span>
            )}
          </LiquidButton>
        );
      })}
    </div>
  );
};
