'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type StatCardTone = 'neutral' | 'emerald' | 'rose' | 'amber' | 'slate';

export interface StatFilterCardProps {
  label: string;
  count: number;
  tone?: StatCardTone;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const TONE_STYLES: Record<StatCardTone, { idle: string; active: string }> = {
  neutral: {
    idle: 'bg-white text-slate-800 border-slate-200 hover:border-slate-400',
    active: 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20 shadow-xs',
  },
  emerald: {
    idle: 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400',
    active: 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-600/25 shadow-xs',
  },
  rose: {
    idle: 'bg-white text-rose-700 border-rose-200 hover:border-rose-400',
    active: 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-600/25 shadow-xs',
  },
  amber: {
    idle: 'bg-white text-amber-800 border-amber-200 hover:border-amber-400',
    active: 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-500/25 shadow-xs',
  },
  slate: {
    idle: 'bg-white text-slate-600 border-slate-200 hover:border-slate-400',
    active: 'bg-slate-600 text-white border-slate-600 ring-2 ring-slate-600/25 shadow-xs',
  },
};

export const StatFilterCard: React.FC<StatFilterCardProps> = ({
  label,
  count,
  tone = 'neutral',
  active = false,
  onClick,
  className,
}) => {
  const styles = TONE_STYLES[tone];

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'px-[0.75rem] py-[0.4375rem] rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between gap-[0.5rem] text-left min-h-[3rem] min-w-0',
        active ? styles.active : styles.idle,
        className
      )}
    >
      <span className="text-[0.8125rem] font-semibold truncate opacity-90">{label}</span>
      <span className="text-[1.125rem] font-bold leading-none shrink-0">{count}</span>
    </button>
  );
};
