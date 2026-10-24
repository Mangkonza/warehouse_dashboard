'use client';

import React from 'react';
import { CategoryKey } from '@/types/dataManagement';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { LiquidButton } from '@/components/ui/liquid-glass';
import { cn } from '@/lib/utils';

interface TopSegmentedTabsProps {
  activeCategory: CategoryKey;
  onSelectCategory: (category: CategoryKey) => void;
  counts: Record<CategoryKey, number>;
}

export const TopSegmentedTabs: React.FC<TopSegmentedTabsProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const categoryKeys: CategoryKey[] = [
    'research',
    'academic',
    'service',
    'publications',
    'ip',
    'personnel',
    'kpi',
  ];

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
      {categoryKeys.map((key) => {
        const config = CATEGORIES_CONFIG[key];
        const isActive = activeCategory === key;
        const count = counts[key] ?? 0;

        return (
          <LiquidButton
            key={key}
            onClick={() => onSelectCategory(key)}
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
              {config.title}
            </span>

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
          </LiquidButton>
        );
      })}
    </div>
  );
};