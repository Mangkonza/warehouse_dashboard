import React from 'react';
import { useRouter } from 'next/navigation';
import type { OverviewKpiScore } from '../../_hooks/useOverviewData';
import { RingGauge } from './RingGauge';
import { cardStyle, formatMoney, missionCardTheme, sectionTitleStyle } from './glanceUtils';

const SHORT_LABELS: Record<string, string> = {
  external_budget: 'ทุนวิจัยภายนอก',
  scopus_pub: 'ตีพิมพ์นานาชาติ',
  mega_projects: 'โครงการ ≥ 10 ล้าน',
  service_revenue: 'รายได้บริการวิชาการ',
  ip_patents: 'ยื่นจด IP',
};

const ROUTES: Record<string, string> = {
  research: '/research',
  academic: '/academic',
  publications: '/publications',
  service: '/service',
  ip: '/ip',
};

const STATUS_ORDER = ['บรรลุแล้ว', 'ตามแผน', 'เสี่ยง', 'ต้องเร่งรัด'];
const STATUS_COLORS: Record<string, string> = {
  'บรรลุแล้ว': '#059669',
  'ตามแผน': '#0284c7',
  'เสี่ยง': '#d97706',
  'ต้องเร่งรัด': '#dc2626',
};

function actualVsTarget(k: OverviewKpiScore): string {
  if (k.unit === 'บาท') {
    const a = formatMoney(k.actual);
    const t = formatMoney(k.target);
    return a.unit === t.unit ? `${a.num} / ${t.num} ${t.unit}` : `${a.num} ${a.unit} / ${t.num} ${t.unit}`;
  }
  return `${k.actual.toLocaleString('th-TH')} / ${k.target.toLocaleString('th-TH')} ${k.unit}`;
}

interface KpiPulseRowProps {
  kpis: OverviewKpiScore[];
  fiscalYearProgress: number;
  isFiltered: boolean;
}

export function KpiPulseRow({ kpis, fiscalYearProgress, isFiltered }: KpiPulseRowProps) {
  const router = useRouter();
  const statusCounts = STATUS_ORDER.map((label) => ({
    label,
    count: kpis.filter((k) => k.status.label === label).length,
  })).filter((s) => s.count > 0);

  return (
    <section style={cardStyle} aria-label="ความคืบหน้าเทียบเป้าหมาย">
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
          <h2 style={sectionTitleStyle}>เป้าหมายปีงบประมาณ</h2>
          {isFiltered && (
            <span style={{ fontSize: '12px', color: '#64748b' }}>เทียบเป้าทั้งคณะ</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {statusCounts.map((s) => (
            <span
              key={s.label}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#334155' }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: STATUS_COLORS[s.label] }} />
              {s.label}
              <strong style={{ color: '#0f172a' }}>{s.count}</strong>
            </span>
          ))}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              color: '#334155',
              paddingLeft: '14px',
              borderLeft: '1px solid #e2e8f0',
            }}
            title="ขีดดำบนวงแหวน = สัดส่วนเวลาที่ผ่านไปของปีงบประมาณ ถ้าสีเลยขีดแปลว่าเร็วกว่าแผน"
          >
            <span style={{ width: 3, height: 12, borderRadius: 2, backgroundColor: '#0f172a' }} />
            เวลาผ่านไป {fiscalYearProgress}%
          </span>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
        }}
      >
        {kpis.map((k) => {
          const theme = missionCardTheme(k.categoryKey);
          return (
          <button
            key={k.id}
            type="button"
            onClick={() => router.push(ROUTES[k.categoryKey] || '/overview')}
            title={`${k.code} ${k.title}`}
            className="glance-tile"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 8px 12px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              font: 'inherit',
              textAlign: 'center',
            }}
          >
            <RingGauge percent={k.percent} marker={fiscalYearProgress} color={k.status.color}>
              <span style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {Math.round(k.percent)}
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>%</span>
              </span>
            </RingGauge>
            <span style={{ fontSize: '14px', fontWeight: 600, color: theme.header, lineHeight: 1.3 }}>
              {SHORT_LABELS[k.id] || k.title}
            </span>
            <span style={{ fontSize: '12px', color: theme.subtext, fontVariantNumeric: 'tabular-nums' }}>
              {actualVsTarget(k)}
            </span>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: k.status.color,
                backgroundColor: k.status.bg,
                padding: '2px 10px',
                borderRadius: '999px',
              }}
            >
              {k.status.label}
            </span>
          </button>
          );
        })}
      </div>
    </section>
  );
}
