'use client';

import React from 'react';
import { FaCalendarAlt, FaTimes, FaSlidersH } from 'react-icons/fa';
import { useTimeFilter } from '../context/TimeFilterContext';
import { getTimeFilterLabel, TimeFilterState } from '@/types/timeFilter';
import { QUICK_FISCAL_YEARS } from '../constants/timeFilterPresets';

export interface TimeFilterBarProps {
  value?: TimeFilterState;
  onChange?: React.Dispatch<React.SetStateAction<TimeFilterState>> | ((val: TimeFilterState) => void);
  onReset?: () => void;
  totalCount?: number;
}

export const TimeFilterBar: React.FC<TimeFilterBarProps> = ({ totalCount }) => {
  const { timeFilter, setTimeFilter, resetTimeFilter, setIsTimeModalOpen } = useTimeFilter();

  const quickFiscalYears = QUICK_FISCAL_YEARS;

  const handleSelectQuickYear = (fy: string) => {
    setTimeFilter({
      ...timeFilter,
      mode: 'fiscal',
      fiscalYear: fy,
      fiscalQuarter: 'all',
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#ffffff',
        padding: '10px 18px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: '#334155',
            fontWeight: 600,
          }}
        >
          <FaCalendarAlt style={{ color: '#00A651', fontSize: '14px' }} />
          <span>ช่วงเวลาข้อมูล:</span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: timeFilter.mode === 'all' ? '#f8fafc' : '#f0fbf5',
            color: timeFilter.mode === 'all' ? '#334155' : '#00A651',
            padding: '5px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            border: timeFilter.mode === 'all' ? '1px solid #cbd5e1' : '1.5px solid #00A651',
          }}
        >
          <span>{getTimeFilterLabel(timeFilter)}</span>
          {totalCount !== undefined && (
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>
              ({totalCount} รายการ)
            </span>
          )}
        </div>

        {/* ปุ่มลัดเลือกปีงบประมาณในคลิกเดียว */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '2px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={resetTimeFilter}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: timeFilter.mode === 'all' ? '#00A651' : 'transparent',
              color: timeFilter.mode === 'all' ? '#ffffff' : '#64748b',
              fontSize: '12px',
              fontWeight: timeFilter.mode === 'all' ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            ทั้งหมด
          </button>
          {quickFiscalYears.map((fy) => {
            const isSelected =
              timeFilter.mode === 'fiscal' &&
              timeFilter.fiscalYear === fy &&
              timeFilter.fiscalQuarter === 'all';
            return (
              <button
                key={fy}
                type="button"
                onClick={() => handleSelectQuickYear(fy)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isSelected ? '#00A651' : 'transparent',
                  color: isSelected ? '#ffffff' : '#64748b',
                  fontSize: '12px',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                ปีงบ {fy}
              </button>
            );
          })}
        </div>

        {timeFilter.mode !== 'all' && (
          <button
            type="button"
            onClick={resetTimeFilter}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="ล้างตัวกรองเวลาและแสดงข้อมูลทั้งหมด"
          >
            <FaTimes style={{ fontSize: '10px' }} />
            <span>ล้างตัวกรอง</span>
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsTimeModalOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '7px 14px',
          backgroundColor: '#ffffff',
          border: '1px solid #00A651',
          borderRadius: '8px',
          color: '#00A651',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0fbf5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
        }}
      >
        <FaSlidersH style={{ fontSize: '12px' }} />
        <span>เลือกช่วงเวลาละเอียด</span>
      </button>
    </div>
  );
};