'use client';

import React from 'react';
import { CategoryKey } from '@/types/dataManagement';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { LiquidButton } from '@/components/ui/liquid-glass';
import { cn } from '@/lib/utils';

export type TabColorTheme = 'emerald' | 'blue' | 'rose' | 'purple' | 'amber' | 'teal';

export interface TabItem<T = string> {
  key: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TopSegmentedTabsProps<T extends string = string> {
  activeCategory: T;
  onSelectCategory: (category: T) => void;
  counts?: Partial<Record<T, number>>;
  tabs?: TabItem<T>[];
  colorTheme?: TabColorTheme;
  className?: string;
}

const THEME_CLASSES: Record<TabColorTheme, { active: string; hover: string }> = {
  emerald: {
    active:
      'bg-gradient-to-r from-[#00A651] via-[#059669] to-[#008a43] text-white shadow-[0_4px_12px_rgba(0,166,81,0.3)]',
    hover: 'hover:text-[#00A651]',
  },
  blue: {
    active:
      'bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#075985] text-white shadow-[0_4px_12px_rgba(2,132,199,0.3)]',
    hover: 'hover:text-[#0284c7]',
  },
  rose: {
    active:
      'bg-gradient-to-r from-[#e11d48] via-[#be123c] to-[#9f1239] text-white shadow-[0_4px_12px_rgba(225,29,72,0.3)]',
    hover: 'hover:text-[#e11d48]',
  },
  purple: {
    active:
      'bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]',
    hover: 'hover:text-[#7c3aed]',
  },
  amber: {
    active:
      'bg-[linear-gradient(150deg,#92400e_0%,#b45309_55%,#d97706_100%)] text-white shadow-[0_4px_16px_rgba(180,83,9,0.38)] border border-amber-500/40',
    hover: 'hover:text-[#b45309]',
  },
  teal: {
    active:
      'bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59] text-white shadow-[0_4px_12px_rgba(13,148,136,0.3)]',
    hover: 'hover:text-[#0d9488]',
  },
};

export const TopSegmentedTabs = <T extends string = CategoryKey>({
  activeCategory,
  onSelectCategory,
  counts = {},
  tabs,
  colorTheme = 'emerald',
  className,
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

  const resolvedTabs: TabItem<T>[] =
    tabs ||
    defaultCategoryKeys.map((key) => {
      const config = CATEGORIES_CONFIG[key as CategoryKey];
      return {
        key: key as unknown as T,
        label: config?.title || key,
        count: counts[key as unknown as T] ?? 0,
      };
    });

  const theme = THEME_CLASSES[colorTheme] || THEME_CLASSES.emerald;

  return (
    <div
      className={cn('flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-none', className)}
      style={{
        scrollbarWidth: 'none',
      }}
    >
      {resolvedTabs.map((tab) => {
        const isActive = activeCategory === tab.key;
        const count = tab.count ?? (counts[tab.key] ?? undefined);

        return (
          <LiquidButton
            key={String(tab.key)}
            onClick={() => onSelectCategory(tab.key)}
            variant="default"
            size="tab"
            className={cn(
              'cursor-pointer select-none transition-all duration-300 h-11 px-5 py-2 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent active:outline-none active:ring-0 border',
              isActive
                ? cn(
                    'rounded-full text-white scale-[1.02] [&>div:nth-child(-n+2)]:hidden',
                    theme.active
                  )
                : cn(
                    'bg-white/70 hover:bg-white text-slate-700 hover:scale-[1.02] border-slate-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-md',
                    theme.hover
                  )
            )}
          >
            {tab.icon && (
              <span className="text-[15px] shrink-0 mr-2 opacity-90">
                {tab.icon}
              </span>
            )}

            <span className="font-bold text-[14.5px] whitespace-nowrap">
              {tab.label}
            </span>

            {count !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs min-w-[24px] ml-2 transition-all',
                  isActive
                    ? 'bg-white/25 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 font-semibold border border-slate-200/60'
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
