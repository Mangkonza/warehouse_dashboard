'use client';

import React from 'react';
import { FaExclamationTriangle, FaClock, FaArrowRight } from 'react-icons/fa';
import { DepartmentBadge } from '@/components/ui';

interface ActionListCardProps {
  actionList: {
    expiringSoon: any[];
    redKpis: any[];
    belowAvgDepts: any[];
  };
}

export const ActionListCard: React.FC<ActionListCardProps> = ({ actionList }) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '20px 22px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '320px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        <FaExclamationTriangle style={{ color: '#d97706', fontSize: '16px' }} />
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
          รายการที่ต้องเร่งรัด / ติดตาม
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '310px' }}>
        {/* 1. โครงการใกล้ครบกำหนด */}
        <div>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#b45309', marginBottom: '6px' }}>
            โครงการใกล้ครบกำหนดสัญญา (&le; 90 วัน) ({actionList.expiringSoon.length})
          </div>
          {actionList.expiringSoon.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>ไม่มีโครงการที่ใกล้ครบกำหนด</div>
          ) : (
            actionList.expiringSoon.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#fffbeb',
                  borderRadius: '8px',
                  marginBottom: '6px',
                  fontSize: '12px',
                  border: '1px solid #fef3c7',
                }}
              >
                <div style={{ fontWeight: 600, color: '#78350f', lineHeight: 1.3 }}>
                  {item.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', color: '#92400e', fontSize: '11px' }}>
                  <span>เหลือ {item._tl?.days_remaining} วัน</span>
                  <DepartmentBadge value={item.department} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. ตัวชี้วัดที่อยู่ในเกณฑ์สีแดง */}
        <div>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#dc2626', marginBottom: '6px' }}>
            ตัวชี้วัดที่ต้องเร่งรัด ({actionList.redKpis.length})
          </div>
          {actionList.redKpis.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>ไม่มีตัวชี้วัดในระดับวิกฤต</div>
          ) : (
            actionList.redKpis.map((kpi, idx) => (
              <div
                key={idx}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  marginBottom: '4px',
                  color: '#991b1b',
                  border: '1px solid #fee2e2',
                }}
              >
                {kpi.title}: <strong>{kpi.percent}%</strong>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
