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
      {/* Category Segment Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', marginRight: '2px' }}>
          หมวดยุทธศาสตร์:
        </span>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '9px',
            gap: '3px',
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap',
          }}
        >
          {Object.entries(CATEGORY_NAMES).map(([k, lbl]) => {
            const isSel = selectedCategory === k;
            return (
              <button
                key={k}
                onClick={() => onSelectCategory(k)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '12px',
                  fontWeight: isSel ? 700 : 500,
                  border: 'none',
                  backgroundColor: isSel ? '#ffffff' : 'transparent',
                  color: isSel ? '#00A651' : '#64748b',
                  boxShadow: isSel ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {lbl}
              </button>
            );
          })}
        </div>
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
            <SelectItem value="on_track">เป็นไปตามเป้า (70–99%)</SelectItem>
            <SelectItem value="at_risk">เฝ้าระวัง (40–69%)</SelectItem>
            <SelectItem value="behind">ต้องเร่งรัด (&lt; 40%)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
