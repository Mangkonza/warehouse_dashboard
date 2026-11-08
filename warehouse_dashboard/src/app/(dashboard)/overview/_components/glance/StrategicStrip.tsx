import React from 'react';
import { SDG_COLORS, SDG_SHORT_NAMES, cardStyle, sectionTitleStyle } from './glanceUtils';

export interface SdgCount {
  num: number;
  count: number;
  verifiedCount?: number;
  autoDetectedCount?: number;
}

export interface StrategicStripProps {
  topSdgs: SdgCount[];
}

export function StrategicStrip({ topSdgs }: StrategicStripProps) {
  return (
    <section
      className="glance-strategic"
      style={{
        ...cardStyle,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
      aria-label="เป้าหมายการพัฒนาที่ยั่งยืน (SDGs)"
    >
      <h2 style={sectionTitleStyle}>เป้าหมายการพัฒนาที่ยั่งยืน (SDGs) ที่ขับเคลื่อนมากที่สุด</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        {topSdgs.map((s) => (
          <div
            key={s.num}
            title={`SDG ${s.num} ${SDG_SHORT_NAMES[s.num] || ''}: ${s.count} รายการ`}
            style={{
              backgroundColor: SDG_COLORS[s.num] || '#0ea5e9',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minHeight: '100px',
              minWidth: 0,
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 700, opacity: 0.95 }}>SDG {s.num}</span>
            <span style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.1, marginTop: 'auto', fontVariantNumeric: 'tabular-nums' }}>
              {s.count}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {SDG_SHORT_NAMES[s.num]}
            </span>
          </div>
        ))}
        {topSdgs.length === 0 && (
          <span style={{ gridColumn: '1 / -1', fontSize: '13px', color: '#94a3b8' }}>ยังไม่มีข้อมูล SDGs</span>
        )}
      </div>
    </section>
  );
}
