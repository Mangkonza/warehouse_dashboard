'use client';

import React, { useState, useMemo, useEffect, useRef, useId } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  YEARS,
  calcYoYGrowth,
  filterByDepartment,
  extractFiscalYear,
} from '@/lib/yoyComparisonEngine';
import { CHART_PASTEL_PALETTE, MISSION_THEMES } from '@/lib/pastelTheme';
import { parseNumber } from '@/lib/kpiEngine';
import { getDepartment } from '@/lib/departments';
import {
  FaExchangeAlt,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from 'react-icons/fa';

const compactButtonStyle: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#f8fafc',
  fontSize: '13px',
  fontWeight: 600,
  color: '#334155',
  cursor: 'pointer',
  transition: 'all 0.15s ease-in-out',
};

export interface MissionYoYControlsProps {
  missionKey: 'research' | 'academic' | 'publications' | 'service' | 'ip';
  missionTitle: string;
  allItemsRaw: any[];
  activeDepartment?: string;
  primaryMetricLabel?: string;
  secondaryMetricLabel?: string;
  hasBudgetMetric?: boolean;
  defaultBaseYear?: string;
  defaultTargetYear?: string;
  subCategoryExtractor?: (item: any) => string;
}

export function MissionYoYControls({
  missionKey,
  missionTitle,
  allItemsRaw,
  activeDepartment = 'all',
  primaryMetricLabel,
  secondaryMetricLabel,
  hasBudgetMetric = true,
  defaultBaseYear = '2567',
  defaultTargetYear = '2568',
  subCategoryExtractor,
}: MissionYoYControlsProps) {
  const [baseYear, setBaseYear] = useState<string>(defaultBaseYear);
  const [targetYear, setTargetYear] = useState<string>(defaultTargetYear);
  const [metricMode, setMetricMode] = useState<'count' | 'budget'>('count');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState<boolean>(false);
  const [showAllRows, setShowAllRows] = useState<boolean>(false);

  const summaryId = useId();
  const detailId = useId();
  const expandedContentId = useId();

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Unit and button labels
  const countUnit = missionKey === 'publications' ? 'ผลงาน' : missionKey === 'ip' ? 'รายการ' : 'โครงการ';
  const metricUnit = metricMode === 'count' ? countUnit : 'ล้านบาท';
  const countBtnLabel = primaryMetricLabel ? primaryMetricLabel.replace(/\s*\(.*?\)\s*/g, '').trim() : `จำนวน${countUnit}`;
  const budgetBtnLabel = secondaryMetricLabel ? secondaryMetricLabel.replace(/\s*\(.*?\)\s*/g, '').trim() : (
    missionKey === 'service' ? 'มูลค่าบริการวิชาการ' :
    missionKey === 'publications' || missionKey === 'ip' ? 'เงินสนับสนุน' : 'งบประมาณ'
  );

  // Department-filtered multi-year items
  const deptFilteredItems = useMemo(() => {
    return filterByDepartment(allItemsRaw, activeDepartment);
  }, [allItemsRaw, activeDepartment]);

  // Items partitioned by year
  const baseItems = useMemo(() => {
    return deptFilteredItems.filter((it) => extractFiscalYear(it) === baseYear);
  }, [deptFilteredItems, baseYear]);

  const targetItems = useMemo(() => {
    return deptFilteredItems.filter((it) => extractFiscalYear(it) === targetYear);
  }, [deptFilteredItems, targetYear]);

  // Calculate budget helper based on mission
  const getItemBudget = (item: any): number => {
    if (missionKey === 'research') {
      const ext = parseNumber(item.budget_external);
      const int = parseNumber(item.budget_internal);
      return ext + int > 0 ? ext + int : parseNumber(item.budget);
    }
    if (missionKey === 'academic') {
      return parseNumber(item.budget);
    }
    if (missionKey === 'publications') {
      return parseNumber(item.support_amount) || parseNumber(item.budget) || 0;
    }
    if (missionKey === 'service') {
      return parseNumber(item.actual_revenue) || parseNumber(item.budget) || parseNumber(item.revenue) || 0;
    }
    if (missionKey === 'ip') {
      return parseNumber(item.support_amount) || parseNumber(item.budget) || 0;
    }
    return 0;
  };

  // Base metrics
  const baseCount = baseItems.length;
  const baseBudget = baseItems.reduce((acc, it) => acc + getItemBudget(it), 0);
  const baseBudgetM = Number((baseBudget / 1000000).toFixed(2));

  // Target metrics
  const targetCount = targetItems.length;
  const targetBudget = targetItems.reduce((acc, it) => acc + getItemBudget(it), 0);
  const targetBudgetM = Number((targetBudget / 1000000).toFixed(2));

  // YoY calculations
  const countYoY = useMemo(() => calcYoYGrowth(baseCount, targetCount), [baseCount, targetCount]);
  const budgetYoY = useMemo(() => calcYoYGrowth(baseBudgetM, targetBudgetM), [baseBudgetM, targetBudgetM]);

  const activeYoY = metricMode === 'count' ? countYoY : budgetYoY;
  const activeBaseValue = metricMode === 'count' ? baseCount : baseBudgetM;
  const activeTargetValue = metricMode === 'count' ? targetCount : targetBudgetM;
  const formatMetricValue = (value: number) => metricMode === 'count'
    ? value.toLocaleString('th-TH')
    : value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatDeltaValue = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${formatMetricValue(value)}`;
  };
  const formatDelta = (value: number) => `${formatDeltaValue(value)} ${metricUnit}`;
  const getGrowthValue = (baseValue: number, targetValue: number) => {
    const growth = calcYoYGrowth(baseValue, targetValue);
    if (baseValue === 0 && targetValue > 0) return 'เริ่มใหม่ (ฐาน 0)';
    if (baseValue === 0) return '0.0% (ฐาน 0)';
    return growth.badgeText;
  };

  // Mission pastel styling
  const missionTheme = CHART_PASTEL_PALETTE.missions[missionKey] || {
    fill: '#93C5FD',
    border: '#3B82F6',
    text: '#1D4ED8',
  };
  const cardTheme = MISSION_THEMES[missionKey].card;

  // Breakdown across categories/departments
  const breakdownData = useMemo(() => {
    const defaultExtractor = (it: any) => {
      if (subCategoryExtractor) return subCategoryExtractor(it);
      const rawDept = String(it.department || it.dept || '').trim();
      if (!rawDept) return 'OTH';
      const d = getDepartment(rawDept);
      return d.code !== '-' ? d.code : rawDept;
    };

    const categoriesSet = new Set<string>();
    baseItems.forEach((it) => categoriesSet.add(defaultExtractor(it)));
    targetItems.forEach((it) => categoriesSet.add(defaultExtractor(it)));

    const categories = Array.from(categoriesSet);
    if (categories.length === 0) categories.push('ภาพรวม');

    const categoryRows = categories.map((cat) => {
      const match = baseItems.filter((it) => defaultExtractor(it) === cat);
      const baseValue = metricMode === 'count'
        ? match.length
        : Number((match.reduce((acc, it) => acc + getItemBudget(it), 0) / 1000000).toFixed(2));
      const targetMatch = targetItems.filter((it) => defaultExtractor(it) === cat);
      const targetValue = metricMode === 'count'
        ? targetMatch.length
        : Number((targetMatch.reduce((acc, it) => acc + getItemBudget(it), 0) / 1000000).toFixed(2));

      return { label: cat, baseValue, targetValue };
    });

    categoryRows.sort((a, b) =>
      Math.abs(b.targetValue - b.baseValue) - Math.abs(a.targetValue - a.baseValue)
    );

    return {
      labels: categoryRows.map((row) => row.label),
      baseValues: categoryRows.map((row) => row.baseValue),
      targetValues: categoryRows.map((row) => row.targetValue),
    };
  }, [baseItems, targetItems, metricMode, subCategoryExtractor]);

  // One row per department, sorted by absolute change by the chart above.
  const detailRows = breakdownData.labels.map((cat, idx) => {
    const baseValue = breakdownData.baseValues[idx];
    const targetValue = breakdownData.targetValues[idx];
    const department = getDepartment(cat);
    const label = department.name && department.name !== '-' ? department.name : cat;
    return {
      cat,
      label,
      baseValue,
      targetValue,
      delta: targetValue - baseValue,
      growth: getGrowthValue(baseValue, targetValue),
    };
  });

  const upCount = detailRows.filter((row) => row.delta > 0).length;
  const downCount = detailRows.filter((row) => row.delta < 0).length;
  const flatCount = detailRows.length - upCount - downCount;

  const topRow = detailRows.length > 0
    ? detailRows.reduce((best, row) => (Math.abs(row.delta) > Math.abs(best.delta) ? row : best))
    : null;

  const summaryText = detailRows.length === 0
    ? `ไม่พบข้อมูลสำหรับปี ${baseYear} และ ${targetYear}`
    : `ในปี ${targetYear} มี ${formatMetricValue(activeTargetValue)} ${metricUnit} เทียบกับ ${formatMetricValue(activeBaseValue)} ${metricUnit} ในปี ${baseYear} ผลต่าง ${formatDelta(activeYoY.absDiff)}${detailRows.length > 1 && topRow && Math.abs(topRow.delta) > 0 ? ` · เปลี่ยนแปลงมากที่สุด: ${topRow.label} (${formatDeltaValue(topRow.delta)} ${metricUnit})` : ''}`;

  const nonZeroRows = detailRows.filter((row) => row.baseValue !== 0 || row.targetValue !== 0);
  const defaultVisibleRows = nonZeroRows.slice(0, 8);
  const visibleRows = showAllRows ? detailRows : defaultVisibleRows;
  const hasRowToggle = detailRows.length > defaultVisibleRows.length;
  const chartHeight = Math.min(520, Math.max(340, breakdownData.labels.length * 44));

  const handleDownloadCsv = () => {
    const escapeCsv = (value: string | number) => {
      const text = String(value);
      return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const header = ['สังกัด', `ปีฐาน ${baseYear}`, `ปีเปรียบเทียบ ${targetYear}`, 'ผลต่าง', 'เปลี่ยนแปลง (%)'];
    const rows = detailRows.map((row) => [
      row.label,
      formatMetricValue(row.baseValue),
      formatMetricValue(row.targetValue),
      formatDeltaValue(row.delta),
      row.growth,
    ]);
    const csv = '\uFEFF' + [header, ...rows]
      .map((cells) => cells.map(escapeCsv).join(','))
      .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yoy-${missionKey}-${baseYear}-${targetYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Chart Rendering
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (!chartCanvasRef.current || !isExpanded) return;
    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 13.5;

    const canvas = chartCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: breakdownData.labels,
        datasets: [
          {
            label: `ปีฐาน ${baseYear}`,
            data: breakdownData.baseValues,
            backgroundColor: '#94A3B8', // Soft slate
            borderColor: '#64748B',
            borderWidth: 1.5,
            borderRadius: 6,
            maxBarThickness: 22,
          },
          {
            label: `ปีเปรียบเทียบ ${targetYear}`,
            data: breakdownData.targetValues,
            backgroundColor: missionTheme.fill,
            borderColor: missionTheme.border,
            borderWidth: 1.5,
            borderRadius: 6,
            maxBarThickness: 22,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              padding: 14,
              font: { size: 13.5, weight: 600, family: "'Kanit', sans-serif" },
              color: '#0F172A',
            },
          },
          datalabels: {
            color: '#0F172A',
            font: { family: "'Kanit', sans-serif", weight: 'bold', size: 12.5 },
            anchor: 'end',
            align: 'end',
            formatter: (v: number) => {
              if (v <= 0) return '';
              return metricMode === 'budget' ? `${v} ล้านบาท` : `${v}`;
            },
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems: any[]) => {
                if (!tooltipItems.length) return '';
                const code = tooltipItems[0].label;
                const d = getDepartment(code);
                return d.name && d.name !== '-' ? `${d.name} (${code})` : code;
              },
              label: (context: any) => {
                return ` ${context.dataset.label}: ${context.raw} ${metricUnit}`;
              },
            },
          },
        },
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            grace: '20%',
            title: {
              display: true,
              text: metricMode === 'budget' ? 'งบประมาณ (ล้านบาท)' : `จำนวน (${countUnit})`,
              color: '#0F172A',
              font: { size: 13.5, weight: 700, family: "'Kanit', sans-serif" },
            },
            ticks: {
              font: { size: 12.5, weight: 600, family: "'Kanit', sans-serif" },
              color: '#334155',
            },
            grid: { color: CHART_PASTEL_PALETTE.gridLines },
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 13, weight: 600, family: "'Kanit', sans-serif" },
              color: '#0F172A',
              callback: (value: string | number, index: number) => {
                const raw = breakdownData.labels[index] ?? String(value);
                const department = getDepartment(raw);
                const full = department.name && department.name !== '-' ? department.name : raw;
                const chartWidth = chartCanvasRef.current?.clientWidth ?? 0;
                if (chartWidth >= 900) return full;
                if (chartWidth >= 480) {
                  const short = full.replace(/^ภาควิชา/, '').replace(/^ศูนย์/, '').trim();
                  return short.length > 22 ? `${short.slice(0, 21)}…` : short;
                }
                return raw;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [breakdownData, baseYear, targetYear, metricMode, isExpanded, missionTheme]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '100%',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: missionTheme.fill,
              border: `1px solid ${missionTheme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: missionTheme.text,
            }}
          >
            <FaExchangeAlt style={{ fontSize: '14px' }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              เปรียบเทียบข้อมูลรายปี • {missionTitle}
            </h3>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              {activeDepartment !== 'all' ? `กรองเฉพาะ: ${activeDepartment}` : 'ครอบคลุมทั้งคณะ'}
            </span>
          </div>
        </div>

        {/* Year Selectors & Metric Mode Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Base Year Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>ปีฐาน:</span>
            <select
              value={baseYear}
              onChange={(e) => setBaseYear(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              {YEARS.map((y) => (
                <option key={`base-${y}`} value={y}>
                  ปีงบประมาณ {y}
                </option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>เทียบกับ</span>

          {/* Target Year Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>ปีเปรียบเทียบ:</span>
            <select
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: `1.5px solid ${missionTheme.border}`,
                backgroundColor: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                color: missionTheme.text,
                cursor: 'pointer',
              }}
            >
              {YEARS.map((y) => (
                <option key={`target-${y}`} value={y}>
                  ปีงบประมาณ {y}
                </option>
              ))}
            </select>
          </div>

          {/* Metric Toggle + Collapse/Expand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {hasBudgetMetric && (
              <div
                style={{
                  display: 'inline-flex',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  padding: '3px 4px',
                  backgroundColor: '#f1f5f9',
                }}
              >
                <button
                  type="button"
                  onClick={() => setMetricMode('count')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: metricMode === 'count' ? '#ffffff' : 'transparent',
                    color: metricMode === 'count' ? '#0f172a' : '#64748b',
                    fontSize: '13px',
                    fontWeight: metricMode === 'count' ? 700 : 600,
                    cursor: 'pointer',
                    boxShadow: metricMode === 'count' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease-in-out',
                  }}
                >
                  {countBtnLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setMetricMode('budget')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: metricMode === 'budget' ? '#ffffff' : 'transparent',
                    color: metricMode === 'budget' ? '#0f172a' : '#64748b',
                    fontSize: '13px',
                    fontWeight: metricMode === 'budget' ? 700 : 600,
                    cursor: 'pointer',
                    boxShadow: metricMode === 'budget' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease-in-out',
                  }}
                >
                  {budgetBtnLabel}
                </button>
              </div>
            )}

            {/* Collapse/Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls={expandedContentId}
              style={compactButtonStyle}
            >
              {isExpanded ? 'ย่อมุมมอง' : 'ดูกราฟและรายละเอียด'}
            </button>
          </div>
        </div>
      </div>

      {!isExpanded && (
        <div
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            padding: '12px 16px',
            borderRadius: '12px',
            border: `1px solid ${cardTheme.border}`,
            background: `linear-gradient(135deg, ${cardTheme.surface} 0%, #ffffff 100%)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
              ปีฐาน {baseYear}
            </span>
            <strong style={{ fontSize: '22px', fontWeight: 800, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
              {formatMetricValue(activeBaseValue)}
            </strong>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{metricUnit}</span>
          </div>

          <span aria-hidden="true" style={{ color: '#94a3b8', fontWeight: 700 }}>→</span>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: cardTheme.header, whiteSpace: 'nowrap' }}>
              ปีเปรียบเทียบ {targetYear}
            </span>
            <strong style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
              {formatMetricValue(activeTargetValue)}
            </strong>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{metricUnit}</span>
          </div>

          <span aria-hidden="true" style={{ width: '1px', height: '28px', backgroundColor: '#e2e8f0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: `1px solid ${cardTheme.border}`,
                backgroundColor: cardTheme.iconBg,
                color: cardTheme.icon,
                fontSize: '13px',
              }}
            >
              {activeYoY.trend === 'up' && <FaArrowUp />}
              {activeYoY.trend === 'down' && <FaArrowDown />}
              {activeYoY.trend === 'neutral' && <FaMinus />}
            </span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                {formatDelta(activeYoY.absDiff)}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                เปลี่ยนแปลง {getGrowthValue(activeBaseValue, activeTargetValue)}
                {activeBaseValue > 0 && activeBaseValue < 5 ? ' · ฐานต่ำ' : ''}
              </div>
            </div>
          </div>

          {topRow && Math.abs(topRow.delta) > 0 && (
            <div className="hidden md:block" style={{ marginLeft: 'auto', fontSize: '12.5px', color: '#475569' }}>
              เปลี่ยนแปลงมากที่สุด: <strong style={{ color: cardTheme.header }}>{topRow.label}</strong>{' '}
              ({formatDeltaValue(topRow.delta)} {metricUnit})
            </div>
          )}
        </div>
      )}

      {isExpanded && (
        <div
          id={expandedContentId}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {/* Quick Stats Summary Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            {/* Base Year Card */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '14px 16px',
              }}
            >
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                ปีฐาน {baseYear}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#334155', marginTop: '4px' }}>
                {metricMode === 'count' ? (
                  `${baseCount.toLocaleString()} ${metricUnit}`
                ) : (
                  `${baseBudgetM.toFixed(2)} ล้านบาท`
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {metricMode === 'count'
                  ? `งบประมาณ ${baseBudgetM.toFixed(2)} ล้านบาท`
                  : `${baseCount.toLocaleString()} ${countUnit}`}
              </div>
            </div>

            {/* Target Year Card */}
            <div
              style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                border: `1px solid ${missionTheme.border}`,
                padding: '14px 16px',
              }}
            >
              <div style={{ fontSize: '13px', color: missionTheme.text, fontWeight: 700 }}>
                ปีเปรียบเทียบ {targetYear}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {metricMode === 'count' ? (
                  `${targetCount.toLocaleString()} ${metricUnit}`
                ) : (
                  `${targetBudgetM.toFixed(2)} ล้านบาท`
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '2px' }}>
                {metricMode === 'count'
                  ? `งบประมาณ ${targetBudgetM.toFixed(2)} ล้านบาท`
                  : `${targetCount.toLocaleString()} ${countUnit}`}
              </div>
            </div>

            {/* Absolute change leads; percentage stays secondary because small baselines inflate growth. */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                ผลต่างระหว่างปี
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: '#0f172a',
                  }}
                >
                  {activeYoY.trend === 'up' && <FaArrowUp aria-hidden="true" style={{ fontSize: '16px', color: '#64748b' }} />}
                  {activeYoY.trend === 'down' && <FaArrowDown aria-hidden="true" style={{ fontSize: '16px', color: '#64748b' }} />}
                  {activeYoY.trend === 'neutral' && <FaMinus aria-hidden="true" style={{ fontSize: '16px', color: '#64748b' }} />}
                  <span>{formatDelta(activeYoY.absDiff)}</span>
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                เปลี่ยนแปลง {getGrowthValue(activeBaseValue, activeTargetValue)}
                {activeBaseValue > 0 && activeBaseValue < 5 && (
                  <span> · ฐานต่ำ ({formatMetricValue(activeBaseValue)} {metricUnit})</span>
                )}
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart Canvas */}
          <div
            style={{
              height: `${chartHeight}px`,
              width: '100%',
              position: 'relative',
              marginTop: '8px',
            }}
          >
            <canvas
              ref={chartCanvasRef}
              role="img"
              aria-label={`กราฟแท่งเปรียบเทียบ${metricUnit}ตามสังกัด ปี ${baseYear} กับ ${targetYear}`}
              aria-describedby={summaryId}
            />
          </div>

          {/* Visible takeaway doubles as the chart's text alternative and keeps the detail table optional. */}
          <p id={summaryId} aria-live="polite" style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#334155' }}>
            {summaryText}
          </p>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                  รายละเอียดตามสังกัด
                </h4>
                <div style={{ marginTop: '2px', fontSize: '12.5px', color: '#64748b' }}>
                  {detailRows.length} สังกัด · ↑{upCount} ↓{downCount} –{flatCount}
                  {activeDepartment !== 'all' ? ` · กรองเฉพาะ ${activeDepartment}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  aria-label="ดาวน์โหลดรายละเอียดตามสังกัดเป็นไฟล์ CSV"
                  style={compactButtonStyle}
                >
                  ดาวน์โหลด CSV
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailExpanded((prev) => !prev)}
                  aria-expanded={isDetailExpanded}
                  aria-controls={detailId}
                  style={compactButtonStyle}
                >
                  {isDetailExpanded ? 'ย่อรายละเอียด' : 'ดูรายละเอียด'}
                </button>
              </div>
            </div>

            <div id={detailId} style={{ marginTop: '12px', display: isDetailExpanded ? 'block' : 'none' }}>
              <div className="hidden sm:block" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', maxWidth: '820px', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <caption className="sr-only">
                    เปรียบเทียบข้อมูลตามสังกัดระหว่างปีฐาน {baseYear} กับปีเปรียบเทียบ {targetYear} หน่วย{metricUnit}
                  </caption>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#334155', textAlign: 'left' }}>
                      <th scope="col" style={{ padding: '10px 12px 10px 0', fontWeight: 700, fontSize: '13px' }}>สังกัด</th>
                      <th scope="col" style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap' }}>
                        ปี {baseYear} → {targetYear}
                      </th>
                      <th scope="col" style={{ padding: '10px 0 10px 12px', textAlign: 'right', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap' }}>เปลี่ยนแปลง</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row) => (
                      <tr key={row.cat} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                        <th scope="row" style={{ padding: '10px 12px 10px 0', fontWeight: 600, textAlign: 'left', overflowWrap: 'anywhere' }}>
                          {row.label}
                        </th>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                          <span className="sr-only">ปีฐาน </span>
                          <span style={{ color: '#64748b' }}>{formatMetricValue(row.baseValue)}</span>
                          <span aria-hidden="true" style={{ color: '#94a3b8', margin: '0 4px' }}>→</span>
                          <span className="sr-only"> ปีเปรียบเทียบ </span>
                          <strong>{formatMetricValue(row.targetValue)}</strong>
                          <span style={{ marginLeft: '6px', fontSize: '12px', color: '#64748b' }}>
                            (<span className="sr-only">ผลต่าง </span>{formatDeltaValue(row.delta)})
                          </span>
                        </td>
                        <td style={{ padding: '10px 0 10px 12px', textAlign: 'right', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                          <div>{row.growth}</div>
                          {row.baseValue > 0 && row.baseValue < 5 && (
                            <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>ฐานต่ำ</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '1px solid #cbd5e1', color: '#1e293b', fontWeight: 700 }}>
                      <th scope="row" style={{ padding: '10px 12px 10px 0', textAlign: 'left' }}>รวมทั้งหมด</th>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#64748b' }}>{formatMetricValue(activeBaseValue)}</span>
                        <span aria-hidden="true" style={{ color: '#94a3b8', margin: '0 4px' }}>→</span>
                        <strong>{formatMetricValue(activeTargetValue)}</strong>
                        <span style={{ marginLeft: '6px', fontSize: '12px', color: '#64748b' }}>
                          ({formatDeltaValue(activeTargetValue - activeBaseValue)})
                        </span>
                      </td>
                      <td style={{ padding: '10px 0 10px 12px', textAlign: 'right', color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
                        <div>{getGrowthValue(activeBaseValue, activeTargetValue)}</div>
                        {activeBaseValue > 0 && activeBaseValue < 5 && (
                          <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>ฐานต่ำ</div>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="grid sm:hidden">
                {visibleRows.map((row) => (
                  <div key={row.cat} style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{row.label}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                        <div>{row.growth}</div>
                        {row.baseValue > 0 && row.baseValue < 5 && (
                          <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>ฐานต่ำ</div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: '3px', fontSize: '12px', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                      {baseYear}: <strong style={{ color: '#334155' }}>{formatMetricValue(row.baseValue)}</strong>
                      <span aria-hidden="true" style={{ margin: '0 4px', color: '#94a3b8' }}>→</span>
                      {targetYear}: <strong style={{ color: '#334155' }}>{formatMetricValue(row.targetValue)}</strong>
                      <span style={{ marginLeft: '6px' }}>({formatDeltaValue(row.delta)})</span>
                    </div>
                  </div>
                ))}

                <div style={{ padding: '12px 0 0', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    <span>รวมทั้งหมด</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{getGrowthValue(activeBaseValue, activeTargetValue)}</span>
                  </div>
                  <div style={{ marginTop: '2px', fontSize: '12px', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
                    {baseYear}: <strong style={{ color: '#334155' }}>{formatMetricValue(activeBaseValue)}</strong>
                    <span aria-hidden="true" style={{ margin: '0 4px', color: '#94a3b8' }}>→</span>
                    {targetYear}: <strong style={{ color: '#334155' }}>{formatMetricValue(activeTargetValue)}</strong>
                    <span style={{ marginLeft: '6px' }}>({formatDeltaValue(activeTargetValue - activeBaseValue)})</span>
                  </div>
                  {activeBaseValue > 0 && activeBaseValue < 5 && (
                    <div style={{ marginTop: '2px', fontSize: '11px', color: '#475569' }}>
                      ฐานต่ำ (ปีฐานมี {formatMetricValue(activeBaseValue)} {metricUnit})
                    </div>
                  )}
                </div>
              </div>

              {metricMode === 'budget' && (
                <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#94a3b8' }}>
                  ผลรวมอาจไม่เท่ากับผลบวกของแต่ละแถวเนื่องจากการปัดเศษ
                </div>
              )}

              {hasRowToggle && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAllRows((prev) => !prev)}
                    style={compactButtonStyle}
                  >
                    {showAllRows ? 'แสดงน้อยลง' : `แสดงทั้งหมด (${detailRows.length})`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
