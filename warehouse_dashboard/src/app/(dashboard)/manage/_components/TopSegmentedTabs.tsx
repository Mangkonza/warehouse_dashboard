'use client';

import React from 'react';
import { CategoryKey } from '@/types/dataManagement';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';

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
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '2px',
        scrollbarWidth: 'none',
      }}
    >
      {categoryKeys.map((key) => {
        const config = CATEGORIES_CONFIG[key];
        const isActive = activeCategory === key;
        const count = counts[key] ?? 0;

        return (
          <button
            key={key}
            onClick={() => onSelectCategory(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              border: isActive ? '1px solid #00A651' : '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: isActive ? '#00A651' : '#ffffff',
              color: isActive ? '#ffffff' : '#475569',
              fontWeight: isActive ? 600 : 500,
              fontSize: '13.5px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              boxShadow: isActive ? '0 2px 6px rgba(0, 166, 81, 0.22)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = '#00A651';
                e.currentTarget.style.color = '#00A651';
                e.currentTarget.style.backgroundColor = '#f0fbf5';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
          >
            <span>{config.title}</span>

            {/* Counter Badge */}
            <span
              style={{
                display: 'inline-block',
                padding: '2px 7px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                color: isActive ? '#ffffff' : '#64748b',
                minWidth: '20px',
                textAlign: 'center',
              }}
            >
              {count.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
};
