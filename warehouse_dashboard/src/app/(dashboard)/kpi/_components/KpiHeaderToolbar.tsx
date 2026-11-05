'use client';

import React from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle } from '@/lib/dashboardTheme';

interface KpiHeaderToolbarProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function KpiHeaderToolbar({ isRefreshing, onRefresh }: KpiHeaderToolbarProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
      }}
    >
      <div>
        <h1 style={dashboardPageTitleStyle}>ตัวชี้วัดตามแผนยุทธศาสตร์</h1>
        <p style={dashboardPageSubtitleStyle}>
          ติดตามผลการดำเนินงานของตัวชี้วัดเทียบกับเป้าหมายตามแผนยุทธศาสตร์
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 500,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="ดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์ฐานข้อมูล"
        >
          <FaSyncAlt style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', fontSize: '12px' }} />
          <span>{isRefreshing ? 'กำลังอัปเดต...' : 'รีเฟรชข้อมูล DB'}</span>
        </button>
      </div>
    </div>
  );
}
