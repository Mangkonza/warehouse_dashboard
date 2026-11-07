import React from 'react';
import type { IconType } from 'react-icons';
import { DepartmentBadge } from '@/components/ui';
import { cardStyle, formatMoney, hexToRgba, sectionTitleStyle } from './glanceUtils';

const UNIT_SUFFIX: Record<string, string> = { 'ล้านบาท': ' ล.', 'พันบาท': ' พ.' };

export interface HeatmapColumn {
  key: string;
  label: string;
  icon: IconType;
  /** Accent color used for the column icon and the heat-cell tint. */
  accent: string;
}

export interface HeatmapRow {
  code: string;
  name: string;
  /** Value used by the department filter when the row is clicked. */
  filterValue: string;
  values: Record<string, number>;
  budget: number;
}

interface DepartmentHeatmapProps {
  columns: HeatmapColumn[];
  rows: HeatmapRow[];
  selected: string;
  onSelect: (filterValue: string) => void;
}

export function DepartmentHeatmap({ columns, rows, selected, onSelect }: DepartmentHeatmapProps) {
  const colMax: Record<string, number> = {};
  columns.forEach((c) => {
    colMax[c.key] = Math.max(1, ...rows.map((r) => r.values[c.key] || 0));
  });
  const maxBudget = Math.max(1, ...rows.map((r) => r.budget));
  const gridTemplate = `minmax(140px, 1.2fr) repeat(${columns.length}, minmax(84px, 1fr)) minmax(110px, 1fr)`;

  return (
    <section style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '14px' }} aria-label="ผลงานรายสังกัด">
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
        <h2 style={sectionTitleStyle}>ผลงานรายสังกัด</h2>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#64748b' }}>
          น้อย
          <span
            style={{
              width: 64,
              height: 8,
              borderRadius: 999,
              background: 'linear-gradient(90deg, #f1f5f9, #64748b)',
            }}
          />
          มาก
        </span>
      </header>

      <div style={{ overflowX: 'auto' }}>
        <div role="table" style={{ minWidth: 680, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            role="row"
            style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '4px', alignItems: 'end', paddingBottom: '4px' }}
          >
            <span role="columnheader" />
            {columns.map((c) => {
              const Icon = c.icon;
              return (
                <span
                  key={c.key}
                  role="columnheader"
                  title={c.label}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px', fontSize: '11.5px', fontWeight: 600, color: '#334155', lineHeight: 1.25 }}
                >
                  <Icon style={{ color: c.accent, fontSize: '15px' }} aria-hidden="true" />
                  {c.label}
                </span>
              );
            })}
            <span role="columnheader" style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', paddingLeft: '8px' }}>
              งบประมาณ
            </span>
          </div>

          {rows.map((row) => {
            const isSelected = selected !== 'all' && row.filterValue === selected;
            const budget = formatMoney(row.budget);
            return (
              <button
                key={row.code}
                type="button"
                role="row"
                onClick={() => onSelect(isSelected ? 'all' : row.filterValue)}
                aria-pressed={isSelected}
                className="glance-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridTemplate,
                  gap: '4px',
                  alignItems: 'center',
                  padding: '4px 6px',
                  margin: '0 -4px',
                  borderRadius: '10px',
                  border: `1px solid ${isSelected ? '#94a3b8' : 'transparent'}`,
                  backgroundColor: isSelected ? '#f8fafc' : 'transparent',
                  cursor: 'pointer',
                  font: 'inherit',
                  textAlign: 'left',
                }}
              >
                <span role="cell" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <DepartmentBadge value={row.code} showTooltip={false} />
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.name}
                  </span>
                </span>

                {columns.map((c) => {
                  const v = row.values[c.key] || 0;
                  const intensity = v / colMax[c.key];
                  return (
                    <span
                      key={c.key}
                      role="cell"
                      title={`${row.name} · ${c.label}: ${v}`}
                      style={{
                        height: '36px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        backgroundColor: v === 0 ? '#f8fafc' : hexToRgba(c.accent, 0.15 + intensity * 0.45),
                        color: v === 0 ? '#cbd5e1' : '#0f172a',
                      }}
                    >
                      {v === 0 ? '–' : v}
                    </span>
                  );
                })}

                <span role="cell" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
                  <span style={{ flex: 1, height: '8px', borderRadius: 999, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                    <span
                      style={{
                        display: 'block',
                        height: '100%',
                        width: `${(row.budget / maxBudget) * 100}%`,
                        backgroundColor: '#34D399',
                        borderRadius: 999,
                      }}
                    />
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#475569', width: '58px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {row.budget > 0 ? `${budget.num}${UNIT_SUFFIX[budget.unit] ?? ''}` : '–'}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
