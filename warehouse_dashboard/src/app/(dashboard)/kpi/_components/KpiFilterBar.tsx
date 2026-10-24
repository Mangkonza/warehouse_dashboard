'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORY_NAMES } from '../_hooks/useKpiData';

interface KpiFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export function KpiFilterBar({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
}: KpiFilterBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#ffffff',
        padding: '12px 18px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
      }}
    >
      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', marginRight: '4px' }}>
          หมวดยุทธศาสตร์:
        </span>
        {Object.entries(CATEGORY_NAMES).map(([k, lbl]) => {
          const isSel = selectedCategory === k;
          return (
            <button
              key={k}
              onClick={() => onSelectCategory(k)}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: isSel ? 600 : 400,
                border: isSel ? '1px solid #00A651' : '1px solid #e2e8f0',
                backgroundColor: isSel ? '#00A651' : '#ffffff',
                color: isSel ? '#ffffff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {lbl}
            </button>
          );
        })}
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 500 }}>
          สถานะ:
        </span>
        <Select value={selectedStatus} onValueChange={(val) => onSelectStatus(val ?? 'all')}>
          <SelectTrigger className="h-8 text-xs min-w-[140px] bg-white">
            <SelectValue placeholder="ทุกสถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="achieved">บรรลุเป้าหมาย (≥ 100%)</SelectItem>
            <SelectItem value="on_track">เป็นไปตามเป้า (70-99%)</SelectItem>
            <SelectItem value="at_risk">เฝ้าระวัง (40-69%)</SelectItem>
            <SelectItem value="behind">ต้องเร่งรัด (&lt; 40%)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
