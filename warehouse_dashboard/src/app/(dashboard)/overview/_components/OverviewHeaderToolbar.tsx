'use client';

import React from 'react';
import { FaSyncAlt, FaDownload } from 'react-icons/fa';

interface OverviewHeaderToolbarProps {
  isLiveFromDb: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onSnapshot: () => void;
  onExportMaster: () => void;
}

export const OverviewHeaderToolbar: React.FC<OverviewHeaderToolbarProps> = ({
  isLiveFromDb,
  isRefreshing,
  onRefresh,
  onExportMaster,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: isLiveFromDb ? '#059669' : '#0284c7',
              boxShadow: isLiveFromDb ? '0 0 6px #059669' : '0 0 6px #0284c7',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            {isLiveFromDb ? 'เชื่อมต่อฐานข้อมูลจริง (Live DB)' : 'ข้อมูลแคชคลังข้อมูล (Local Cache)'}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            color: '#334155',
            transition: 'all 0.15s ease',
          }}
          title="ซิงค์ข้อมูลล่าสุดจากฐานข้อมูล"
        >
          <FaSyncAlt style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', fontSize: '11px' }} />
          <span>{isRefreshing ? 'กำลังดึงข้อมูล...' : 'รีเฟรช'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onExportMaster}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#00A651',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
            transition: 'all 0.15s ease',
          }}
          title="ดาวน์โหลดไฟล์ Excel สรุปผู้บริหารแบบ Master รวม 5 หมวด"
        >
          <FaDownload style={{ fontSize: '12px' }} />
          <span>ส่งออก Master Excel รายเดือน</span>
        </button>
      </div>
    </div>
  );
};
