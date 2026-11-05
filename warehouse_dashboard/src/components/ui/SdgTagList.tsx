'use client';

import React, { useState } from 'react';
import { parseSdgNumber, getSdgInfo } from '@/lib/sdg';
import { SdgTag } from './SdgTag';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/lib/utils';

export interface SdgTagListProps {
  sdgs?: (number | string)[] | null;
  sdgIds?: (number | string)[] | null; // backward compatibility
  maxVisible?: number;
  maxSdgs?: number; // backward compatibility
  size?: 'sm' | 'md' | 'lg';
  variant?: 'capsule' | 'square';
  className?: string;
  wrap?: boolean;
}

/**
 * Universal SdgTagList component matching Image 5:
 * - Deduplicates and sorts SDGs ascending (1 to 17)
 * - Displays up to maxVisible tags
 * - Overflow displayed as crisp "+N" rounded-full badge with popover
 */
export const SdgTagList: React.FC<SdgTagListProps> = ({
  sdgs,
  sdgIds,
  maxVisible,
  maxSdgs,
  size = 'md',
  variant = 'capsule',
  className,
  wrap = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const rawList = Array.isArray(sdgs)
    ? sdgs
    : Array.isArray(sdgIds)
    ? sdgIds
    : [];

  const parsedNumbers = rawList
    .map((s) => parseSdgNumber(s))
    .filter((n): n is number => typeof n === 'number' && n >= 1 && n <= 17);

  const sortedSdgs = Array.from(new Set(parsedNumbers)).sort((a, b) => a - b);

  if (sortedSdgs.length === 0) {
    return null;
  }

  const effectiveLimit =
    maxVisible !== undefined ? maxVisible : maxSdgs !== undefined ? maxSdgs : 3;

  const limit = effectiveLimit > 0 ? effectiveLimit : sortedSdgs.length;
  const displaySdgs = sortedSdgs.slice(0, limit);
  const remainingSdgs = sortedSdgs.slice(limit);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5',
        wrap ? 'flex-wrap' : 'flex-nowrap',
        className
      )}
    >
      {displaySdgs.map((goalNum) => (
        <SdgTag
          key={`sdg-tag-${goalNum}`}
          n={goalNum}
          size={size}
          variant={variant}
        />
      ))}

      {remainingSdgs.length > 0 && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger
            nativeButton={true}
            onMouseEnter={() => setIsOpen(true)}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className="h-[22px] px-2 rounded-full text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer select-none transition-colors shrink-0 inline-flex items-center justify-center"
            aria-label={`เป้าหมาย SDGs เพิ่มเติมอีก ${remainingSdgs.length} ข้อ`}
          >
            +{remainingSdgs.length}
          </PopoverTrigger>

          <PopoverContent
            align="start"
            side="bottom"
            sideOffset={4}
            className="w-auto max-w-xs p-2.5 bg-white shadow-lg border border-slate-200 rounded-xl z-[10050]"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
                เป้าหมาย SDGs อื่นๆ ({remainingSdgs.length} ข้อ)
              </div>
              <div className="flex flex-col gap-1.5 pt-0.5">
                {remainingSdgs.map((goalNum) => {
                  const info = getSdgInfo(goalNum);
                  return (
                    <div
                      key={`popover-sdg-${goalNum}`}
                      className="flex items-center gap-2 text-xs text-slate-800"
                    >
                      <SdgTag n={goalNum} size="sm" variant={variant} />
                      <span className="truncate text-[12px] font-medium text-slate-700">
                        {info?.nameTh || ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
