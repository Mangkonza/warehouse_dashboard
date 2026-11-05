import React from 'react';
import { useRouter } from 'next/navigation';
import type { IconType } from 'react-icons';
import { FISCAL_MONTHS, cardStyle, missionCardTheme } from './glanceUtils';

export interface MissionPulse {
  key: string;
  label: string;
  icon: IconType;
  color: string;
  count: number;
  unit: string;
  route: string;
  monthly: number[];
  /** One supporting fact, e.g. budget or quality share. */
  highlight: { value: string; label: string };
}

function Sparkline({ data, color, currentIndex }: { data: number[]; color: string; currentIndex: number }) {
  const w = 160;
  const h = 40;
  const max = Math.max(1, ...data);
  const step = w / (data.length - 1);
  const points = data.map((v, i) => [i * step, h - 3 - (v / max) * (h - 8)] as const);
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const gradId = `spark-${color.replace('#', '')}`;
  const peakIdx = data.indexOf(Math.max(...data));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {currentIndex >= 0 && currentIndex < data.length && (
        <line
          x1={currentIndex * step}
          x2={currentIndex * step}
          y1={0}
          y2={h}
          stroke="#94a3b8"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {data[peakIdx] > 0 && (
        <circle cx={points[peakIdx][0]} cy={points[peakIdx][1]} r={3} fill={color} />
      )}
    </svg>
  );
}

export function MissionPulseTiles({ missions, currentFiscalMonth }: { missions: MissionPulse[]; currentFiscalMonth: number }) {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '12px',
      }}
    >
      {missions.map((m) => {
        const Icon = m.icon;
        const theme = missionCardTheme(m.key);
        const peak = Math.max(...m.monthly);
        const peakMonth = peak > 0 ? FISCAL_MONTHS[m.monthly.indexOf(peak)] : null;
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => router.push(m.route)}
            className="glance-tile glance-tile--card"
            title={peakMonth ? `${m.label}: เดือนที่มากที่สุดคือ ${peakMonth} (${peak} ${m.unit})` : m.label}
            style={{
              ...cardStyle,
              padding: '16px 16px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              cursor: 'pointer',
              font: 'inherit',
              textAlign: 'left',
              background: `linear-gradient(135deg, ${theme.surface} 0%, #ffffff 100%)`,
              border: `1px solid ${theme.border}`,
              borderRadius: '16px',
              boxShadow: `0 4px 14px ${theme.glow}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '9px',
                    backgroundColor: theme.iconBg,
                    color: theme.icon,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ fontSize: '14px' }} />
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: theme.header, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.label}
                </span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '34px', fontWeight: 700, color: '#1e293b', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>
                {m.count.toLocaleString('th-TH')}
              </span>
              <span style={{ fontSize: '13px', color: theme.header }}>{m.unit}</span>
            </div>

            <div style={{ fontSize: '12.5px', color: theme.subtext }}>
              {m.highlight.label} <strong style={{ color: theme.icon, fontWeight: 700 }}>{m.highlight.value}</strong>
            </div>

            <div style={{ marginTop: '4px' }}>
              <Sparkline data={m.monthly} color={theme.icon} currentIndex={currentFiscalMonth} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: theme.subtext, opacity: 0.8 }}>
                <span>{FISCAL_MONTHS[0]}</span>
                <span>{FISCAL_MONTHS[11]}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
