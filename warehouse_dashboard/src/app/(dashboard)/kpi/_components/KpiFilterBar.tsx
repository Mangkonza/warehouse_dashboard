'use client';

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { CATEGORY_NAMES } from '../_hooks/useKpiData';
import { STRATEGIC_PILLARS } from '@/config/kpiConfig';

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
  on_track: 'เป็นไปตามเป้า (70–99%)',
  at_risk: 'เฝ้าระวัง (40–69%)',
  behind: 'ต้องเร่งรัด (< 40%)',
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
      {/* แถวที่ 1: ปุ่มกรองตามยุทธศาสตร์ 1.1 - 4.1 ตามแบบรายงาน มก.กพส. */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', marginRight: '4px' }}>
          ยุทธศาสตร์ มก.กพส.:
        </span>

        <button
          type="button"
          onClick={() => onSelectStrategy('all')}
          style={{
            padding: '5px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: selectedStrategy === 'all' ? 700 : 500,
            border: selectedStrategy === 'all' ? '1px solid #00A651' : '1px solid #e2e8f0',
            backgroundColor: selectedStrategy === 'all' ? '#00A651' : '#ffffff',
            color: selectedStrategy === 'all' ? '#ffffff' : '#475569',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          ทุกยุทธศาสตร์ (1.1 - 4.1)
        </button>

        {STRATEGIC_PILLARS.map((strat) => {
          const isSel = selectedStrategy === strat.code;
          return (
            <button
              key={strat.code}
              type="button"
              onClick={() => onSelectStrategy(strat.code)}
              title={strat.fullName}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: isSel ? 700 : 500,
                border: isSel ? `1px solid ${strat.color.text}` : `1px solid ${strat.color.border}`,
                backgroundColor: isSel ? strat.color.text : strat.color.bg,
                color: isSel ? '#ffffff' : strat.color.text,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ยุทธศาสตร์ที่ {strat.code}
            </button>
          );
        })}
      </div>

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
                <SelectItem value="on_track">เป็นไปตามเป้า (70–99%)</SelectItem>
                <SelectItem value="at_risk">เฝ้าระวัง (40–69%)</SelectItem>
                <SelectItem value="behind">ต้องเร่งรัด (&lt; 40%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
