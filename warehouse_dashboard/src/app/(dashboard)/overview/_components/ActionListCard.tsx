'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaExclamationTriangle, FaExternalLinkAlt } from 'react-icons/fa';
import { DepartmentBadge, RecordDetailDrawer } from '@/components/ui';

interface ActionListCardProps {
  actionList: {
    expiringSoon: any[];
    redKpis: any[];
    belowAvgDepts: any[];
  };
}

export const ActionListCard: React.FC<ActionListCardProps> = ({ actionList }) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px 22px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '340px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaExclamationTriangle style={{ color: '#d97706', fontSize: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            รายการที่ต้องเร่งรัด / ติดตาม
          </h3>
        </div>
        <Link
          href="/monitoring"
          style={{ fontSize: '11.5px', fontWeight: 600, color: '#00A651', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <span>ติดตามทั้งหมด</span>
          <FaExternalLinkAlt size={9} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '320px' }}>
        {/* 1. โครงการใกล้ครบกำหนด */}
        <div>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#b45309', marginBottom: '6px' }}>
            โครงการใกล้ครบกำหนดสัญญา (&le; 90 วัน) ({actionList.expiringSoon.length})
          </div>
          {actionList.expiringSoon.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>ไม่มีโครงการที่ใกล้ครบกำหนด</div>
          ) : (
            actionList.expiringSoon.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedItem(item)}
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#fffbeb',
                  borderRadius: '8px',
                  marginBottom: '6px',
                  fontSize: '12px',
                  border: '1px solid #fef3c7',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontWeight: 400, color: '#0f172a', lineHeight: 1.35 }}>
                  {item.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', color: '#92400e', fontSize: '11px' }}>
                  <span style={{ fontWeight: 600 }}>เหลือ {item._tl?.days_remaining} วัน</span>
                  <DepartmentBadge value={item.department} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2. ตัวชี้วัดที่อยู่ในเกณฑ์สีแดง */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#dc2626' }}>
              ตัวชี้วัดที่ต้องเร่งรัด ({actionList.redKpis.length})
            </span>
            <Link href="/kpi" style={{ fontSize: '11px', color: '#dc2626', textDecoration: 'underline' }}>
              ดูหน้า KPI
            </Link>
          </div>
          {actionList.redKpis.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>ไม่มีตัวชี้วัดในระดับวิกฤต</div>
          ) : (
            actionList.redKpis.map((kpi, idx) => (
              <Link
                key={idx}
                href="/kpi"
                style={{
                  display: 'block',
                  padding: '6px 10px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  marginBottom: '4px',
                  color: '#991b1b',
                  border: '1px solid #fee2e2',
                  textDecoration: 'none',
                }}
              >
                {kpi.title}: <strong>{kpi.percent}%</strong> (เป้าเวลา {kpi.proRataTarget}%)
              </Link>
            ))
          )}
        </div>

        {/* 3. ภาควิชาที่งบวิจัยต่ำกว่าเกณฑ์เฉลี่ย */}
        {actionList.belowAvgDepts && actionList.belowAvgDepts.length > 0 && (
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              ภาควิชาที่ควรส่งเสริมการขอทุนวิจัยเพิ่ม ({actionList.belowAvgDepts.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {actionList.belowAvgDepts.map((dept: any) => (
                <div
                  key={dept.code}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                    color: '#334155',
                  }}
                >
                  <DepartmentBadge value={dept.code} />
                  <span>{(dept.budget / 1000000).toFixed(2)} ล้าน</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <RecordDetailDrawer
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        categoryKey="research"
        record={selectedItem}
        readOnly={true}
      />
    </div>
  );
};
