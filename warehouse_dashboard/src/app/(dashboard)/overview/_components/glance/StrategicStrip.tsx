import React from 'react';
import { ISEE_PILLARS } from '@/lib/pastelTheme';
import { SDG_COLORS, SDG_SHORT_NAMES, cardStyle, sectionTitleStyle } from './glanceUtils';

export interface SdgCount {
  num: number;
  count: number;
}

const ISEE_SHORT: Record<string, { letter: string; name: string }> = {
  I: { letter: 'I', name: 'นานาชาติ' },
  S: { letter: 'S', name: 'สังคม/ยั่งยืน' },
  E1: { letter: 'E', name: 'เลิศวิจัย' },
  E2: { letter: 'E', name: 'ผู้ประกอบการ/ดิจิทัล' },
};

interface StrategicStripProps {
  topSdgs: SdgCount[];
  isee: Record<string, number>;
}

export function StrategicStrip({ topSdgs, isee }: StrategicStripProps) {
  const iseeTotal = Object.values(isee).reduce((a, b) => a + b, 0) || 1;

  return (
    <section
      style={{
        ...cardStyle,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
      }}
      aria-label="ความสอดคล้องเชิงยุทธศาสตร์"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
        <h2 style={sectionTitleStyle}>SDGs ที่ขับเคลื่อนมากที่สุด</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '8px' }}>
          {topSdgs.map((s) => (
            <div
              key={s.num}
              title={`SDG ${s.num} ${SDG_SHORT_NAMES[s.num] || ''}: ${s.count} รายการ`}
              style={{
                backgroundColor: SDG_COLORS[s.num] || '#0ea5e9',
                color: '#ffffff',
                borderRadius: '14px',
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                aspectRatio: '1 / 1',
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.9 }}>SDG {s.num}</span>
              <span style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.1, marginTop: 'auto', fontVariantNumeric: 'tabular-nums' }}>
                {s.count}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {SDG_SHORT_NAMES[s.num]}
              </span>
            </div>
          ))}
          {topSdgs.length === 0 && (
            <span style={{ gridColumn: '1 / -1', fontSize: '13px', color: '#94a3b8' }}>ยังไม่มีข้อมูล SDGs</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
        <h2 style={sectionTitleStyle}>สัดส่วนตามยุทธศาสตร์ ISEE</h2>
        <div
          style={{ display: 'flex', height: '40px', borderRadius: '12px', overflow: 'hidden', gap: '3px' }}
          role="img"
          aria-label={ISEE_PILLARS.map((p) => `${ISEE_SHORT[p.id].name} ${Math.round(((isee[p.id] || 0) / iseeTotal) * 100)}%`).join(', ')}
        >
          {ISEE_PILLARS.map((p) => {
            const share = ((isee[p.id] || 0) / iseeTotal) * 100;
            if (share <= 0) return null;
            return (
              <div
                key={p.id}
                title={`${p.name}: ${isee[p.id]} รายการ`}
                style={{
                  width: `${share}%`,
                  backgroundColor: p.color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  minWidth: share > 6 ? undefined : 0,
                }}
              >
                {share >= 8 ? `${Math.round(share)}%` : ''}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px 16px' }}>
          {ISEE_PILLARS.map((p) => (
            <span key={p.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', minWidth: 0 }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  backgroundColor: p.color,
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {ISEE_SHORT[p.id].letter}
              </span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ISEE_SHORT[p.id].name}</span>
              <strong style={{ marginLeft: 'auto', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>{isee[p.id] || 0}</strong>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
