'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SdgCardProps {
  goalNumber: number; // 1 - 17
  nameTh: string;
  selected: boolean;
  onToggle: (goalNumber: number) => void;
  className?: string;
}

/**
 * Single-layer compact SDG selection card.
 * - Shows plain number 1-17 on the left followed by Thai title
 * - No inner boxes, no "SDG 1", no checkmarks
 * - Selected state: full background #006C68, border #004E4B, all text turns white
 * - Unselected state: white background, black text, light gray border
 */
export const SdgCard: React.FC<SdgCardProps> = ({
  goalNumber,
  nameTh,
  selected,
  onToggle,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(goalNumber)}
      className={cn(
        "flex items-center gap-2 px-2.5 py-1.5 min-h-[36px] rounded-lg text-left transition-all duration-150 cursor-pointer select-none",
        selected
          ? "tag-sdg bg-eval-sdg border border-eval-sdg-border text-white shadow-xs"
          : "bg-white text-black border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        className
      )}
      style={{
        backgroundColor: selected ? '#006C68' : '#ffffff',
        borderColor: selected ? '#004E4B' : '#e2e8f0',
      }}
    >
      {/* Raw number icon-like prefix (plain text, no circle/nested box) */}
      <span
        className={cn(
          "text-[13px] font-semibold min-w-[18px] shrink-0 text-center",
          selected ? "text-white" : "text-black"
        )}
      >
        {goalNumber}
      </span>

      {/* Thai SDG Name: 13px normal weight */}
      <span
        className={cn(
          "text-[13px] font-normal leading-snug whitespace-nowrap overflow-hidden text-ellipsis",
          selected ? "text-white" : "text-black"
        )}
        title={nameTh}
      >
        {nameTh}
      </span>
    </button>
  );
};
