'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaSyncAlt, FaCog } from 'react-icons/fa';
import { TimeFilterState, getTimeFilterLabel } from '@/types/timeFilter';

interface KpiHeaderToolbarProps {
  timeFilter?: TimeFilterState;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function KpiHeaderToolbar({ timeFilter, isRefreshing, onRefresh }: KpiHeaderToolbarProps) {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        backgroundColor: '#ffffff',
        padding: '20px 24px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
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
            {timeFilter && timeFilter.mode !== 'all' ? getTimeFilterLabel(timeFilter) : 'ทุกช่วงเวลา'}
          </span>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          ระบบติดตามตัวชี้วัดตามแผนยุทธศาสตร์
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
          ประมวลผลสถานะความสำเร็จและเปรียบเทียบกับเป้าหมายแบบเรียลไทม์จากคลังข้อมูลวิจัย
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

        <button
          onClick={() => router.push('/manage')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '9px 18px',
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
          <FaCog style={{ fontSize: '13px' }} />
          <span>จัดการตัวชี้วัดตามแผนยุทธศาสตร์ (เพิ่ม/แก้ไข/ลบ)</span>
        </button>
      </div>
    </div>
  );
}
