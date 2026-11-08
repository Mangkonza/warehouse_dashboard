'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import type { OverviewKpiScore } from '../../_hooks/useOverviewData';
import { cardStyle } from './glanceUtils';

interface AtRiskAlertStripProps {
  kpis: OverviewKpiScore[];
  isFiltered?: boolean;
}

const ROUTES: Record<string, string> = {
  research: '/research',
  academic: '/academic',
  publications: '/publications',
  service: '/service',
  ip: '/ip',
};

export function AtRiskAlertStrip({ kpis, isFiltered }: AtRiskAlertStripProps) {
  const router = useRouter();

  // In filtered-by-department mode, targets are faculty-wide, so do not trigger urgent red alerts for single departments
  if (isFiltered) return null;

  const urgentKpis = kpis.filter(
    (k) => k.status.label === 'ต้องเร่งรัด' || k.status.label === 'เสี่ยง'
  );

  if (urgentKpis.length === 0) return null;

  return (
    <section
      style={{
        ...cardStyle,
        backgroundColor: '#fff7ed',
        border: '1.5px solid #ffedd5',
        boxShadow: '0 2px 8px rgba(234, 88, 12, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px 20px',
      }}
      aria-label="ประเด็นที่ต้องเร่งรัดและติดตาม"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: '8px',
              backgroundColor: '#fed7aa',
              color: '#c2410c',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
            }}
          >
            <FaExclamationTriangle />
          </span>
          <h2 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#9a3412' }}>
            ประเด็นที่ต้องเร่งรัดและติดตาม ({urgentKpis.length} ตัวชี้วัด)
          </h2>
        </div>
        <span style={{ fontSize: '12px', color: '#9a3412', opacity: 0.85 }}>
          ตัวชี้วัดที่มีผลงานต่ำกว่าเป้าหมายตามสัดส่วนเวลา
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '10px',
        }}
      >
        {urgentKpis.map((k) => {
          const isCritical = k.status.label === 'ต้องเร่งรัด';
          const badgeBg = isCritical ? '#fef2f2' : '#fffbeb';
          const badgeBorder = isCritical ? '#fecaca' : '#fde68a';
          const badgeColor = isCritical ? '#b91c1c' : '#b45309';

          return (
            <button
              key={k.id}
              type="button"
              onClick={() => router.push(ROUTES[k.categoryKey] || '/overview')}
              className="glance-tile"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: `1px solid ${badgeBorder}`,
                cursor: 'pointer',
                font: 'inherit',
                textAlign: 'left',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {isCritical ? (
                  <FaExclamationCircle style={{ color: '#dc2626', fontSize: '16px', flexShrink: 0 }} />
                ) : (
                  <FaExclamationTriangle style={{ color: '#d97706', fontSize: '16px', flexShrink: 0 }} />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {k.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    ทำได้ <strong style={{ color: '#0f172a' }}>{k.actualFormatted}</strong> / เป้า {k.targetFormatted}
                    {k.gapFormatted && k.gapFormatted !== 'บรรลุเป้าหมายแล้ว' && (
                      <span style={{ color: badgeColor, fontWeight: 700, marginLeft: '6px' }}>
                        ({k.gapFormatted})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    backgroundColor: badgeBg,
                    border: `1px solid ${badgeBorder}`,
                    color: badgeColor,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {k.percent}% ({k.status.label})
                </span>
                <FaArrowRight style={{ fontSize: '10px', color: '#94a3b8' }} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
