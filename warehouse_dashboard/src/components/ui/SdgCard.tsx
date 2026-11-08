'use client';

import React from 'react';
import { getSdgInfo, getSdgTextColor } from '@/lib/sdg';
import { cn } from '@/lib/utils';

export interface SdgNumberBadgeProps {
  goalNumber: number; // 1 - 17
  selected?: boolean;
  className?: string;
}

/**
 * Shared crisp numeric SDG icon badge component.
 * Used in the Evaluation Drawer and Heatmap row headers.
 */
export const SdgNumberBadge: React.FC<SdgNumberBadgeProps> = ({
  goalNumber,
  selected = false,
  className,
}) => {
  const info = getSdgInfo(goalNumber);
  const bgColor = info?.color || '#00A651';
  const textColor = getSdgTextColor(goalNumber);

  return (
    <span
      className={cn(
        'w-7 h-7 rounded-lg inline-flex items-center justify-center font-bold text-[13px] shrink-0 transition-transform duration-100 shadow-2xs select-none',
        selected ? 'bg-white shadow-sm' : '',
        className
      )}
      style={{
        backgroundColor: selected ? '#ffffff' : bgColor,
        color: selected ? bgColor : textColor,
        lineHeight: 1,
        textAlign: 'center',
      }}
    >
      <span style={{ transform: 'translateY(-0.5px)' }}>{goalNumber}</span>
    </span>
  );
};

export interface SdgCardProps {
  goalNumber: number; // 1 - 17
  nameTh: string;
  selected: boolean;
  onToggle: (goalNumber: number) => void;
  className?: string;
}

/**
 * Universal SDG Selection Card used in the Project Evaluation Drawer.
 * Uses a crisp numeric icon badge instead of photo image as requested.
 * - 2-column multi-select button
 * - Unselected: white button background, colored numeric icon box, dark text
 * - Selected: full SDG color background, contrast text, white numeric icon box
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
        'group flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-xl text-left transition-all duration-150 cursor-pointer select-none',
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
      {/* Numeric Icon Box (Replaces photo image) */}
      <SdgNumberBadge goalNumber={goalNumber} selected={selected} />

      {/* Thai Title (number removed to prevent duplication with icon) */}
      <div className="flex flex-col justify-center min-w-0 leading-tight">
        <span
          className="text-[12.5px] truncate"
          style={{
            color: selected ? textColor : '#0f172a',
            fontWeight: 600,
          }}
          title={nameTh}
        >
          {nameTh}
        </span>
      </div>
    </button>
  );
};
