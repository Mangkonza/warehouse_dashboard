'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CategoryKey } from '@/types/dataManagement';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { LiquidButton } from '@/components/ui/liquid-glass';
import { cn } from '@/lib/utils';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const hasScroll = el.scrollWidth > el.clientWidth;
    setCanScrollLeft(hasScroll && el.scrollLeft > 6);
    setCanScrollRight(hasScroll && el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    // Recheck after fonts and layout settle
    const timer = setTimeout(checkScroll, 200);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(checkScroll);
      ro.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
      if (ro) ro.disconnect();
    };
  }, [checkScroll, resolvedTabs]);

  // Auto-scroll active tab into view when changed
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const activeEl = el.querySelector('[data-active="true"]') as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const step = 320;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  return (
    <div className="relative flex items-center w-full group/tabs">
      <style>{`
        .no-scrollbar::-webkit-scrollbar,
        .scrollbar-none::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          aria-label="เลื่อนแท็บไปทางซ้าย"
          className="absolute left-0 z-30 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-slate-200/90 hover:bg-white hover:text-slate-900 hover:scale-110 active:scale-95 transition-all -translate-x-1"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <FaChevronLeft className="text-[11px]" />
        </button>
      )}

      {/* Tabs Container */}
      <div
        ref={scrollContainerRef}
        onWheel={(e) => {
          if (e.deltaY !== 0 && scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += e.deltaY;
          }
        }}
        className={cn(
          'flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none no-scrollbar scroll-smooth w-full',
          className
        )}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {resolvedTabs.map((tab) => {
          const isActive = activeCategory === tab.key;
          const count = tab.count ?? (counts[tab.key] ?? undefined);

          return (
            <LiquidButton
              key={String(tab.key)}
              onClick={() => onSelectCategory(tab.key)}
              data-active={isActive ? 'true' : 'false'}
              variant="default"
              size="tab"
              className={cn(
                'cursor-pointer select-none transition-all duration-300 h-11 px-5 py-2 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent active:outline-none active:ring-0 border shrink-0',
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

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          aria-label="เลื่อนแท็บไปทางขวา"
          className="absolute right-0 z-30 flex items-center justify-center w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-slate-200/90 hover:bg-white hover:text-slate-900 hover:scale-110 active:scale-95 transition-all translate-x-1"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <FaChevronRight className="text-[11px]" />
        </button>
      )}
    </div>
  );
};
