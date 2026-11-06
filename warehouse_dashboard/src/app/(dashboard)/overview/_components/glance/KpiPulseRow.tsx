import React from 'react';
import { useRouter } from 'next/navigation';
import type { OverviewKpiScore } from '../../_hooks/useOverviewData';
import { RingGauge } from './RingGauge';
import { cardStyle, formatMoney, missionCardTheme, sectionTitleStyle } from './glanceUtils';

const SHORT_LABELS: Record<string, string> = {
  external_budget: 'ทุนวิจัยภายนอก',
  scopus_pub: 'ตีพิมพ์นานาชาติ',
  mega_projects: 'โครงการ ≥ 10 ล้าน',
  service_revenue: 'งบวิชาการ+บริการ',
  ip_patents: 'ยื่นจด IP',
};

const ROUTES: Record<string, string> = {
  research: '/research',
  academic: '/academic',
  publications: '/publications',
  service: '/service',
  ip: '/ip',
};

const STATUS_ORDER = ['บรรลุเป้าหมาย', 'กำลังดำเนินการ (50–99%)', 'ต้องเร่งรัด', 'บรรลุแล้ว', 'ตามแผน', 'เสี่ยง'];
const STATUS_COLORS: Record<string, string> = {
  'บรรลุเป้าหมาย': '#059669',
  'กำลังดำเนินการ (50–99%)': '#ca8a04',
  'ต้องเร่งรัด': '#dc2626',
  'บรรลุแล้ว': '#059669',
  'ตามแผน': '#0284c7',
  'เสี่ยง': '#d97706',
};

/** Soft pastel versions of the status colors, used for the gauge arcs. */
const STATUS_PASTEL: Record<string, string> = {
  'บรรลุเป้าหมาย': '#34D399',
  'กำลังดำเนินการ (50–99%)': '#FDE047',
  'ต้องเร่งรัด': '#FB7185',
  'บรรลุแล้ว': '#34D399',
  'ตามแผน': '#38BDF8',
  'เสี่ยง': '#FBBF24',
};

function actualVsTarget(k: OverviewKpiScore): string {
  if (k.unit === 'บาท') {
    const a = formatMoney(k.actual);
    const t = formatMoney(k.target);
    return a.unit === t.unit ? `${a.num} / ${t.num} ${t.unit}` : `${a.num} ${a.unit} / ${t.num} ${t.unit}`;
  }
  return `${k.actual.toLocaleString('th-TH')} / ${k.target.toLocaleString('th-TH')} ${k.unit}`;
}

/** Thai national journal count for the counted year, if any. */
function nationalTierCount(k: OverviewKpiScore): number {
  const tiers = k.tierBreakdown || {};
  return (tiers['TCI 1'] || 0) + (tiers['TCI 2'] || 0);
}

function tierTooltip(k: OverviewKpiScore): string | undefined {
  if (!k.tierBreakdown) return undefined;
  return Object.entries(k.tierBreakdown)
    .filter(([, n]) => n > 0)
    .map(([tier, n]) => `${tier} ${n} เรื่อง`)
    .join(' · ');
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

  const years = Array.from(
    new Set(kpis.map((k) => k.fiscalYear).filter((y): y is string => Boolean(y)))
  );
  const sharedYear = years.length === 1 ? years[0] : null;
  const sharedProgress = sharedYear ? kpis[0].proRataTarget : fiscalYearProgress;
  const yearCaption = sharedYear ? `ปีงบ ${sharedYear}` : 'เทียบปีงบประมาณล่าสุดของแต่ละพันธกิจ';

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
          <h2 style={sectionTitleStyle}>
            {isFiltered ? 'สัดส่วนผลงานต่อเป้าหมายคณะ' : 'เป้าหมายปีงบประมาณ'}
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{yearCaption}</span>
          {isFiltered && (
            <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: 600 }}>
              (โหมดแสดงการมีส่วนร่วมของภาควิชาต่อเป้าหมายทั้งคณะ)
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {!isFiltered &&
            statusCounts.map((s) => (
              <span
                key={s.label}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#334155' }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: STATUS_COLORS[s.label] }} />
                {s.label}
                <strong style={{ color: '#0f172a' }}>{s.count}</strong>
              </span>
            ))}
          {sharedYear && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                color: '#334155',
                paddingLeft: isFiltered ? '0' : '14px',
                borderLeft: isFiltered ? 'none' : '1px solid #e2e8f0',
              }}
              title="ขีดดำบนวงแหวน = สัดส่วนเวลาที่ผ่านไปของปีงบประมาณนั้น ถ้าสีเลยขีดแปลว่าเร็วกว่าแผน"
            >
              <span style={{ width: 3, height: 12, borderRadius: 2, backgroundColor: '#0f172a' }} />
              เวลาผ่านไป {sharedProgress}%
            </span>
          )}
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
            title={`${k.code} ${k.title}${tierTooltip(k) ? ` · ${tierTooltip(k)}` : ''}`}
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
            <RingGauge
              percent={k.percent}
              marker={isFiltered ? undefined : k.proRataTarget}
              color={isFiltered ? theme.icon : (STATUS_PASTEL[k.status.label] || k.status.color)}
            >
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
            {k.id === 'scopus_pub' && k.tierBreakdown && (
              <span style={{ fontSize: '11px', color: theme.subtext, fontVariantNumeric: 'tabular-nums' }}>
                TCI 1–2 {nationalTierCount(k)} เรื่อง
              </span>
            )}
            <span style={{ fontSize: '11px', color: theme.subtext, opacity: 0.85 }}>
              {k.fiscalYear ? `ปีงบ ${k.fiscalYear}` : 'ไม่ระบุปีงบ'}
              {k.includesUndated ? ' · รวมข้อมูลไม่ระบุปี' : ''}
            </span>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: isFiltered ? '#0369a1' : k.status.color,
                backgroundColor: isFiltered ? '#f0f9ff' : k.status.bg,
                border: isFiltered ? '1px solid #bae6fd' : 'none',
                padding: '2px 10px',
                borderRadius: '999px',
              }}
            >
              {isFiltered ? `มีส่วนร่วม ${k.percent}%` : k.status.label}
            </span>
          </button>
          );
        })}
      </div>
    </section>
  );
}
