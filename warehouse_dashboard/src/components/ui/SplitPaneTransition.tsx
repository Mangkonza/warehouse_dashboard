'use client';

import React, { useEffect } from 'react';
import { useSplitTransition, SplitPhase } from '@/hooks/useSplitTransition';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

export type { SplitPhase };

export interface SplitPaneTransitionProps {
  list: React.ReactNode;
  detail: React.ReactNode;
  isDetailOpen: boolean;
  onPhaseChange?: (phase: SplitPhase) => void;
  detailLabel: string;
  className?: string;
}

export const SplitPaneTransition: React.FC<SplitPaneTransitionProps> = ({
  list,
  detail,
  isDetailOpen,
  onPhaseChange,
  detailLabel,
  className,
}) => {
  const phase = useSplitTransition(isDetailOpen);
  const isCompactOverlay = useMediaQuery('(max-width: 63.9375em)');

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const isTransitioning = phase === 'opening' || phase === 'closing';
  const shouldRenderDetail = phase !== 'list';
  const isListInert = isCompactOverlay && (phase === 'opening' || phase === 'split');
  const isDetailInert = phase === 'closing';

  return (
    <div
      data-phase={phase}
      className={cn(
        'imp-split-container relative flex-1 min-h-0 min-w-0 flex overflow-hidden',
        className
      )}
    >
      {/* โซนซ้าย: รายการ */}
      <div
        inert={isListInert ? true : undefined}
        className="imp-list-wrap flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden"
      >
        {list}
      </div>

      {/* โซนขวา: ฟอร์มแก้ไขรายแถว */}
      {shouldRenderDetail && (
        <aside
          role="complementary"
          aria-label={detailLabel}
          inert={isDetailInert ? true : undefined}
          style={isTransitioning ? { willChange: 'width, transform' } : undefined}
          className="imp-detail-wrap border-l border-slate-200 bg-white flex flex-col min-h-0"
        >
          <div
            style={isTransitioning ? { willChange: 'opacity, transform' } : undefined}
            className="imp-detail-inner flex flex-col min-h-0 min-w-0"
          >
            {detail}
          </div>
        </aside>
      )}
    </div>
  );
};
