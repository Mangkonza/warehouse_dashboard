'use client';

import React from 'react';
import { FaCalendarAlt, FaSlidersH } from 'react-icons/fa';
import { useTimeFilter } from '../context/TimeFilterContext';
import { getTimeFilterLabel, TimeFilterState } from '@/types/timeFilter';

export interface TimeFilterBarProps {
  value?: TimeFilterState;
  onChange?: React.Dispatch<React.SetStateAction<TimeFilterState>> | ((val: TimeFilterState) => void);
  onReset?: () => void;
  totalCount?: number;
  customCountLabel?: string;
}

export const TimeFilterBar: React.FC<TimeFilterBarProps> = ({ totalCount, customCountLabel }) => {
  const { timeFilter, setIsTimeModalOpen } = useTimeFilter();
  const isFiltered = timeFilter.mode !== 'all';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={() => setIsTimeModalOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          height: '36px',
          minWidth: '240px',
          padding: '0 14px',
          backgroundColor: isFiltered ? '#f0fdf4' : '#f8fafc',
          border: `1px solid ${isFiltered ? '#86efac' : '#e2e8f0'}`,
          borderRadius: '10px',
          color: isFiltered ? '#166534' : '#334155',
          fontSize: '12.5px',
          fontWeight: 600,
          cursor: 'pointer',
          boxSizing: 'border-box',
          transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
        }}
        title="คลิกเพื่อเลือกช่วงเวลาการแสดงผล"
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap' }}>
          <FaCalendarAlt style={{ color: '#10b981', fontSize: '13px', flexShrink: 0 }} />
          <span>ช่วงเวลา: {getTimeFilterLabel(timeFilter)}</span>
          {customCountLabel ? (
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>
              ({customCountLabel})
            </span>
          ) : totalCount !== undefined ? (
            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>
              ({totalCount} รายการ)
            </span>
          ) : null}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#059669',
            fontSize: '11.5px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <FaSlidersH style={{ fontSize: '10px' }} />
          <span>ตั้งค่าเวลา</span>
        </span>
      </button>
    </div>
  );
};