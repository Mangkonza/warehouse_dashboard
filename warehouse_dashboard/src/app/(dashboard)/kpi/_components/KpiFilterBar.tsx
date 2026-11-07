'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { CATEGORY_NAMES } from '../_hooks/useKpiData';
import { getStoredStrategies, getStrategyColor } from '@/lib/kpiEngine';
import { StrategicStrategyEntity } from '@/types/kpi';

interface KpiFilterBarProps {
  selectedStrategy: string;
  onSelectStrategy: (strat: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  all: 'ทุกสถานะ',
  achieved: 'บรรลุเป้าหมาย (≥ 100%)',
  in_progress: 'กำลังดำเนินการ (50–99%)',
  behind: 'ต้องเร่งรัด (≤ 49%)',
  on_track: 'กำลังดำเนินการ (50–99%)',
  at_risk: 'กำลังดำเนินการ (50–99%)',
};

export function KpiFilterBar({
  selectedStrategy,
  onSelectStrategy,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
}: KpiFilterBarProps) {
  const [strategies, setStrategies] = useState<StrategicStrategyEntity[]>(() => getStoredStrategies());

  useEffect(() => {
    const syncStrategies = () => {
      setStrategies(getStoredStrategies());
    };
    syncStrategies();
    window.addEventListener('kpi_hierarchy_updated', syncStrategies);
    window.addEventListener('kpi_updated', syncStrategies);
    return () => {
      window.removeEventListener('kpi_hierarchy_updated', syncStrategies);
      window.removeEventListener('kpi_updated', syncStrategies);
    };
  }, []);

  const firstCode = strategies[0]?.code || '1.1';
  const lastCode = strategies[strategies.length - 1]?.code || '4.1';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: '#ffffff',
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
      }}
    >
      
      {/* แถวที่ 2: ค้นหา + ประเภทงาน + สถานะ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          paddingTop: '10px',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        {/* ช่องค้นหา */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            width: '320px',
            maxWidth: '100%',
          }}
        >
          <FaSearch style={{ color: '#94a3b8', fontSize: '12.5px' }} />
          <input
            type="text"
            placeholder="ค้นหาชื่อตัวชี้วัด, แผนงาน, ชื่อผู้รายงาน..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              width: '100%',
              fontSize: '12.5px',
              color: '#1e293b',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
              }}
              title="ล้างคำค้นหา"
            >
              <FaTimes style={{ fontSize: '11px' }} />
            </button>
          )}
        </div>

        {/* ตัวกรองประเภทงาน & สถานะ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ประเภทงาน:</span>
            <Select value={selectedCategory} onValueChange={(val) => onSelectCategory(val ?? 'all')}>
              <SelectTrigger className="h-8 text-xs min-w-[165px] bg-white text-slate-800">
                <span>{CATEGORY_NAMES[selectedCategory as keyof typeof CATEGORY_NAMES] || 'ทุกประเภทงาน'}</span>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_NAMES).map(([k, lbl]) => (
                  <SelectItem key={k} value={k}>
                    {lbl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>สถานะ:</span>
            <Select value={selectedStatus} onValueChange={(val) => onSelectStatus(val ?? 'all')}>
              <SelectTrigger className="h-8 text-xs min-w-[150px] bg-white text-slate-800">
                <span>{STATUS_LABELS[selectedStatus] || 'ทุกสถานะ'}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="achieved">บรรลุเป้าหมาย (≥ 100%)</SelectItem>
                <SelectItem value="in_progress">กำลังดำเนินการ (50–99%)</SelectItem>
                <SelectItem value="behind">ต้องเร่งรัด (≤ 49%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
