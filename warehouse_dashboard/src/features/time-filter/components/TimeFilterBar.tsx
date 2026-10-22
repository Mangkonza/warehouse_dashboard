'use client';

import React from 'react';
import { FaCalendarAlt, FaUndo } from 'react-icons/fa';
import { useTimeFilter } from '../context/TimeFilterContext';
import { getTimeFilterLabel } from '@/types/timeFilter';

export const TimeFilterBar: React.FC = () => {
  const { timeFilter, resetTimeFilter, setIsTimeModalOpen } = useTimeFilter();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#ffffff',
        padding: '12px 20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: '#64748b',
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
            backgroundColor: timeFilter.mode === 'all' ? '#f1f5f9' : '#e8f5e9',
            color: timeFilter.mode === 'all' ? '#475569' : '#007a3e',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700,
            border: timeFilter.mode === 'all' ? '1px solid #cbd5e1' : '1px solid #86efac',
          }}
        >
          <span>{getTimeFilterLabel(timeFilter)}</span>
        </div>
        {timeFilter.mode !== 'all' && (
          <button
            onClick={resetTimeFilter}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 12px',
              backgroundColor: 'transparent',
              border: '1px dashed #cbd5e1',
              borderRadius: '16px',
              color: '#64748b',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="ล้างตัวกรองและแสดงข้อมูลทั้งหมด"
          >
            <FaUndo style={{ fontSize: '10px' }} />
            <span>แสดงทั้งหมด</span>
          </button>
        )}
      </div>

      <button
        onClick={() => setIsTimeModalOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          backgroundColor: '#00A651',
          border: 'none',
          borderRadius: '8px',
          color: '#ffffff',
          fontSize: '13.5px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
          transition: 'all 0.15s ease',
        }}
      >
        <FaCalendarAlt style={{ fontSize: '13px' }} />
        <span>เลือกช่วงเวลา</span>
      </button>
    </div>
  );
};
