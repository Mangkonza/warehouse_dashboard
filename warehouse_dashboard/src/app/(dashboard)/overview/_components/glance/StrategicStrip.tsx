import React from 'react';
import { IAM_VALUES, ISEE_PILLARS } from '@/lib/pastelTheme';
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

const IAM_SHORT: Record<string, { letter: string; name: string }> = {
  I: { letter: 'I', name: 'ความถูกต้อง/โปร่งใส' },
  A: { letter: 'A', name: 'คล่องตัว/รวดเร็ว' },
  M: { letter: 'M', name: 'ความเป็นมืออาชีพ' },
};

interface ShareItem {
  id: string;
  letter: string;
  name: string;
  color: string;
  count: number;
}

function ShareBreakdown({
  title,
  items,
  legendColumns,
}: {
  title: string;
  items: ShareItem[];
  legendColumns: number;
}) {
  const total = items.reduce((a, b) => a + b.count, 0) || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <div
        style={{ display: 'flex', height: '40px', borderRadius: '12px', overflow: 'hidden', gap: '3px' }}
        role="img"
        aria-label={items.map((it) => `${it.name} ${Math.round((it.count / total) * 100)}%`).join(', ')}
      >
        {items.map((it) => {
          const share = (it.count / total) * 100;
          if (share <= 0) return null;
          return (
            <div
              key={it.id}
              title={`${it.name}: ${it.count} รายการ`}
              style={{
                width: `${share}%`,
                backgroundColor: it.color,
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${legendColumns}, minmax(0, 1fr))`,
          gap: '8px 16px',
        }}
      >
        {items.map((it) => (
          <span key={it.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', minWidth: 0 }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                backgroundColor: it.color,
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {it.letter}
            </span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</span>
            <strong style={{ marginLeft: 'auto', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>{it.count}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

interface StrategicStripProps {
  topSdgs: SdgCount[];
  isee: Record<string, number>;
  iam: Record<string, number>;
}

export function StrategicStrip({ topSdgs, isee, iam }: StrategicStripProps) {
  const iseeItems: ShareItem[] = ISEE_PILLARS.map((p) => ({
    id: p.id,
    letter: ISEE_SHORT[p.id].letter,
    name: ISEE_SHORT[p.id].name,
    color: p.color,
    count: isee[p.id] || 0,
  }));

  const iamItems: ShareItem[] = IAM_VALUES.map((v) => ({
    id: v.id,
    letter: IAM_SHORT[v.id].letter,
    name: IAM_SHORT[v.id].name,
    color: v.color,
    count: iam[v.id] || 0,
  }));

  return (
    <section
      className="glance-strategic"
      style={{
        ...cardStyle,
        display: 'grid',
        gap: '20px 24px',
      }}
      aria-label="ความสอดคล้องเชิงยุทธศาสตร์"
    >
      <div
        className="glance-strategic__sdg"
        style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0, gridColumn: '1 / -1' }}
      >
        <h2 style={sectionTitleStyle}>SDGs ที่ขับเคลื่อนมากที่สุด</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: '8px' }}>
          {topSdgs.map((s) => (
            <div
              key={s.num}
              title={`SDG ${s.num} ${SDG_SHORT_NAMES[s.num] || ''}: ${s.count} รายการ`}
              style={{
                backgroundColor: SDG_COLORS[s.num] || '#0ea5e9',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                minHeight: '96px',
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.9 }}>SDG {s.num}</span>
              <span style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.1, marginTop: 'auto', fontVariantNumeric: 'tabular-nums' }}>
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

      <ShareBreakdown title="สัดส่วนตามยุทธศาสตร์ ISEE" items={iseeItems} legendColumns={2} />
      <ShareBreakdown title="สัดส่วนตามค่านิยมองค์กร IAM" items={iamItems} legendColumns={3} />
    </section>
  );
}
