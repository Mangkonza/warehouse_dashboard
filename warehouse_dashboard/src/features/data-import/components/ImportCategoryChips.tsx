'use client';

import React, { useMemo } from 'react';
import { CountChips, CountChipItem } from '@/components/ui/CountChips';
import { ImportCategoryFilter, ImportSummary } from '../types';

export interface ImportCategoryChipsProps {
  globalSummary: ImportSummary;
  activeCategory: ImportCategoryFilter;
  onSelectCategory: (category: ImportCategoryFilter) => void;
}

export const ImportCategoryChips: React.FC<ImportCategoryChipsProps> = ({
  globalSummary,
  activeCategory,
  onSelectCategory,
}) => {
  const items: CountChipItem<ImportCategoryFilter>[] = useMemo(() => {
    const chips: CountChipItem<ImportCategoryFilter>[] = [
      {
        key: 'all',
        label: 'ทุกหมวดหมู่',
        count: globalSummary.total,
      },
    ];

    for (const c of globalSummary.byCategory) {
      chips.push({
        key: c.category,
        label: c.label,
        count: c.count,
      });
    }

    return chips;
  }, [globalSummary]);

  return (
    <CountChips
      items={items}
      selectedKey={activeCategory}
      onSelect={onSelectCategory}
    />
  );
};
