import React from 'react';
import { cardStyle, formatMoney, sectionTitleStyle } from './glanceUtils';

export interface BudgetSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

export function BudgetDonut({ segments }: { segments: BudgetSegment[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const size = 180;
  const stroke = 24;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const center = size / 2;
  const gap = total > 0 ? 3 : 0;

  const visible = segments.filter((s) => s.value > 0);
  const arcs = visible.map((s, i) => {
    const offset = visible.slice(0, i).reduce((sum, prev) => sum + (prev.value / total) * c, 0);
    const len = (s.value / total) * c;
    return { ...s, len: Math.max(0, len - gap), offset };
  });

  const totalLabel = formatMoney(total);

  return (
    <section style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }} aria-label="งบประมาณรวม">
      <h2 style={sectionTitleStyle}>งบประมาณรวม</h2>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 16px' }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`งบประมาณรวม ${totalLabel.num} ${totalLabel.unit}`}>
            <circle cx={center} cy={center} r={r} fill="none" stroke="#eef2f7" strokeWidth={stroke} />
            {arcs.map((a) => (
              <circle
                key={a.key}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke={a.color}
                strokeWidth={stroke}
                strokeDasharray={`${a.len} ${c}`}
                strokeDashoffset={-a.offset}
                transform={`rotate(-90 ${center} ${center})`}
              >
                <title>{`${a.label}: ${formatMoney(a.value).num} ${formatMoney(a.value).unit}`}</title>
              </circle>
            ))}
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {totalLabel.num}
            </span>
            <span style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{totalLabel.unit}</span>
          </div>
        </div>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {segments.map((s) => {
          const share = total > 0 ? Math.round((s.value / total) * 100) : 0;
          const money = formatMoney(s.value);
          return (
            <li key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
              <span style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: s.color, flexShrink: 0 }} />
              <span style={{ flex: 1, color: '#334155', minWidth: 0 }}>{s.label}</span>
              <span style={{ color: '#64748b', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                {money.num} {money.unit === 'ล้านบาท' ? 'ล.' : money.unit}
              </span>
              <strong style={{ width: '42px', textAlign: 'right', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                {share}%
              </strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
