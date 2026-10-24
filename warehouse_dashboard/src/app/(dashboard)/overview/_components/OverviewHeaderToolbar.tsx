'use client';

import React from 'react';
import { FaDatabase, FaSyncAlt, FaCamera, FaDownload } from 'react-icons/fa';

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
  onSnapshot,
  onExportMaster,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isLiveFromDb ? '#059669' : '#0284c7',
              boxShadow: isLiveFromDb ? '0 0 8px #059669' : '0 0 8px #0284c7',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            {isLiveFromDb ? 'เชื่อมต่อฐานข้อมูลจริง (Live DB)' : 'ข้อมูลแคชคลังข้อมูล (Local Cache)'}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="glass-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
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
            padding: '8px 18px',
            backgroundColor: '#00A651',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
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
