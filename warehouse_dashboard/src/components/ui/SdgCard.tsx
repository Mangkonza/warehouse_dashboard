'use client';

import React from 'react';
import { getSdgInfo, getSdgTextColor } from '@/lib/sdg';
import { SdgIcon } from './SdgIcon';
import { cn } from '@/lib/utils';

export interface SdgCardProps {
  goalNumber: number; // 1 - 17
  nameTh: string;
  selected: boolean;
  onToggle: (goalNumber: number) => void;
  className?: string;
}

/**
 * Universal SDG Selection Card used in the Project Evaluation Drawer (Task 3).
 * - 2-column multi-select button
 * - Unselected: white background, thin border, colored SdgIcon
 * - Selected: official SDG color background, WCAG contrast text, SdgIcon with ~3px white border
 */
export const SdgCard: React.FC<SdgCardProps> = ({
  goalNumber,
  nameTh,
  selected,
  onToggle,
  className,
}) => {
  const info = getSdgInfo(goalNumber);
  const bgColor = info?.color || '#00A651';
  const textColor = getSdgTextColor(goalNumber);

  return (
    <button
      type="button"
      onClick={() => onToggle(goalNumber)}
      className={cn(
        'group flex items-center gap-2.5 px-3 py-2 min-h-[46px] rounded-xl text-left transition-all duration-150 cursor-pointer select-none',
        selected
          ? 'shadow-sm border border-black/15'
          : 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50/80',
        className
      )}
      style={{
        backgroundColor: selected ? bgColor : '#ffffff',
        borderColor: selected ? 'rgba(0, 0, 0, 0.15)' : '#e2e8f0',
        color: selected ? textColor : '#0f172a',
      }}
      aria-pressed={selected}
      aria-label={`SDG ${goalNumber}: ${nameTh}`}
    >
      {/* SDG Icon with ~3px white border when selected to prevent blending */}
      <div
        className={cn(
          'shrink-0 transition-transform duration-100 flex items-center justify-center',
          selected ? 'rounded-[6px] shadow-[0_0_0_3px_#ffffff]' : ''
        )}
      >
        <SdgIcon n={goalNumber} size={28} />
      </div>

      {/* Goal Number + Thai Title */}
      <div className="flex flex-col min-w-0 leading-tight">
        <span
          className="text-[12px] font-bold"
          style={{ color: selected ? textColor : '#0f172a' }}
        >
          {goalNumber}. {nameTh}
        </span>
      </div>
    </button>
  );
};
