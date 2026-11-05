'use client';

import React, { useState } from 'react';
import {
  FaSyncAlt,
  FaTable,
  FaThLarge,
  FaCalendarCheck,
  FaPlus,
} from 'react-icons/fa';
import { TimeFilterState, getTimeFilterLabel } from '@/types/timeFilter';
import { KPIReportingRound, KPIReportingRoundConfig } from '@/types/kpi';
import { StrategicKpiModal } from './StrategicKpiFormView';

interface KpiHeaderToolbarProps {
  timeFilter?: TimeFilterState;
  isRefreshing: boolean;
  onRefresh: () => void;
  selectedRound: KPIReportingRound;
  onSelectRound: (round: KPIReportingRound) => void;
  reportingRounds?: KPIReportingRoundConfig[];
  viewMode: 'table' | 'cards';
  onSelectViewMode: (mode: 'table' | 'cards') => void;
}

export function KpiHeaderToolbar({
  timeFilter,
  isRefreshing,
  onRefresh,
  selectedRound,
  onSelectRound,
  reportingRounds = [],
  viewMode,
  onSelectViewMode,
}: KpiHeaderToolbarProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeRounds =
    reportingRounds.length > 0
      ? reportingRounds
      : [
          {
            id: 'round-6m',
            name: 'รอบ 6 เดือน',
            periodLabel: 'ต.ค. 68 - มี.ค. 69',
            startDate: '2025-10-01',
            endDate: '2026-03-31',
            isCumulative: true,
            sortOrder: 1,
          },
          {
            id: 'round-9m',
            name: 'รอบ 9 เดือน',
            periodLabel: 'ต.ค. 68 - ก.ค. 69',
            startDate: '2025-10-01',
            endDate: '2026-07-31',
            isCumulative: true,
            sortOrder: 2,
          },
        ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        backgroundColor: '#ffffff',
        padding: '18px 24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '18.5px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            รายงานผลการดำเนินงานตามตัวชี้วัดยุทธศาสตร์ ประจำปีงบประมาณ พ.ศ. 2569
          </h1>
          <span
            style={{
              backgroundColor: '#e8f5e9',
              color: '#007a3e',
              padding: '3px 10px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 700,
            }}
          >
            {timeFilter && timeFilter.mode !== 'all'
              ? getTimeFilterLabel(timeFilter)
              : 'ต.ค. 2568 - ก.ย. 2569'}
          </span>
        </div>
        <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
          มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน • คณะวิศวกรรมศาสตร์ กำแพงแสน (หน่วยวิจัยและนวัตกรรม / งานแผนและประกันคุณภาพ)
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* สลับรอบการรายงานผล (Dynamic จากตั้งค่ารอบการรายงานผล) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '0 8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#475569',
            }}
          >
            <FaCalendarCheck style={{ color: '#00A651', fontSize: '12px' }} />
            <span>รอบการรายงานผล:</span>
          </span>
          {activeRounds.map((r) => {
            const active =
              selectedRound === r.id ||
              (selectedRound === '6M' && r.id === 'round-6m') ||
              (selectedRound === '9M' && r.id === 'round-9m');
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRound(r.id)}
                title={r.periodLabel || `${r.startDate} - ${r.endDate}`}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: active ? 700 : 500,
                  backgroundColor: active ? '#00A651' : 'transparent',
                  color: active ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {r.name}
                {r.periodLabel ? ` (${r.periodLabel})` : ''}
              </button>
            );
          })}
        </div>

        {/* สลับมุมมองตาราง / การ์ด */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <button
            type="button"
            onClick={() => onSelectViewMode('table')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '12px',
              fontWeight: viewMode === 'table' ? 700 : 500,
              backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
              color: viewMode === 'table' ? '#0f172a' : '#64748b',
              boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
            }}
          >
            <FaTable style={{ fontSize: '12px', color: viewMode === 'table' ? '#00A651' : '#64748b' }} />
            <span>ตารางรายงานยุทธศาสตร์</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectViewMode('cards')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '12px',
              fontWeight: viewMode === 'cards' ? 700 : 500,
              backgroundColor: viewMode === 'cards' ? '#ffffff' : 'transparent',
              color: viewMode === 'cards' ? '#0f172a' : '#64748b',
              boxShadow: viewMode === 'cards' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
            }}
          >
            <FaThLarge style={{ fontSize: '12px', color: viewMode === 'cards' ? '#00A651' : '#64748b' }} />
            <span>การ์ดสรุปผล</span>
          </button>
        </div>

        {/* เพิ่มตัวชี้วัดใหม่ (เปิด Modal สไตล์เดียวกับระบบ) */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            backgroundColor: '#00A651',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 166, 81, 0.25)',
          }}
        >
          <FaPlus style={{ fontSize: '11px' }} />
          <span>เพิ่มตัวชี้วัด</span>
        </button>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            color: '#334155',
            fontSize: '12.5px',
            fontWeight: 500,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="ดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์ฐานข้อมูล"
        >
          <FaSyncAlt
            style={{
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              fontSize: '11.5px',
            }}
          />
          <span>{isRefreshing ? 'กำลังอัปเดต...' : 'รีเฟรชข้อมูล DB'}</span>
        </button>
      </div>

      <StrategicKpiModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={() => {
          setIsAddModalOpen(false);
          onRefresh();
        }}
      />
    </div>
  );
}
