'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { type MissionKey } from '@/lib/pastelTheme';
import { FaTimes } from 'react-icons/fa';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { getDepartment } from '@/lib/departments';

export interface DepartmentBreakdownItem {
  code: string;
  name: string;
  count: number;
  percent: number;
  color: string;
}

export interface BlueprintSegment {
  key?: string;
  label: string;
  value: number | string;
  displayValue?: string;
  unit?: string;
  percent: number;
  color: string;
}

export interface BlueprintCardData {
  label: string;
  value: string | number;
  unit: string;
  splitRatio?: number; // 0 to 1 fallback
  segments?: BlueprintSegment[];
  primaryLegend?: {
    label: string;
    value: string;
    percent?: string;
    color?: string;
  };
  secondaryLegend?: {
    label: string;
    value: string;
    percent?: string;
    color?: string;
  };
}

export interface GearCardData {
  label: string;
  value: string | number;
  unit: string;
  gearValue?: string | number;
  gearLabel?: string;
  departments?: DepartmentBreakdownItem[];
  popoverTitle?: string;
  popoverSubtitle?: string;
  items?: any[];
}

export interface TallyCardData {
  label: string;
  chip: string;
  value: string | number;
  unit: string;
  percent?: number;
  totalCount?: number;
  activeCount?: number;
}

export interface RulerCardData {
  label: string;
  value: string | number;
  unit: string;
  current: number;
  max: number;
  marks?: Array<{ label: string; positionPercent: number }>;
}

export interface ExecutiveKpiDeckProps {
  mission: MissionKey;
  blueprintCard: BlueprintCardData;
  gearCard: GearCardData;
  tallyCard: TallyCardData;
  rulerCard: RulerCardData;
  items?: any[];
  className?: string;
  style?: React.CSSProperties;
}

interface MissionVisualTokens {
  blueprintGrad: string;
  blueprintGlow: string;
  blueprintSubtext: string;
  blueprintUnit: string;
  surface: string;
  border: string;
  textLabel: string;
  unitColor: string;
  tallyOn: string;
  tallyTrack: string;
  rulerColor: string;
  rulerMajor: string;
  pinColor: string;
  gearColor: string;
  gearInner: string;
  gearText: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
  engBadgeBg?: string;
  engBadgeText?: string;
}

const MISSION_VISUAL_TOKENS: Record<MissionKey, MissionVisualTokens> = {
  research: {
    blueprintGrad: 'linear-gradient(150deg, #05603a 0%, #07743c 55%, #098443 100%)',
    blueprintGlow: 'rgba(5, 96, 58, 0.45)',
    blueprintSubtext: '#c8f3da',
    blueprintUnit: '#a7f3d0',
    surface: '#ecfaf2',
    border: '#c4e8d3',
    textLabel: '#067a3a',
    unitColor: '#067a3a',
    tallyOn: 'linear-gradient(180deg, #38bdf8, #0ea5e9)',
    tallyTrack: '#d3eede',
    rulerColor: '#6fbf93',
    rulerMajor: '#2f9d63',
    pinColor: '#078a3c',
    gearColor: '#fbbf24',
    gearInner: '#fde68a',
    gearText: '#5c3d00',
    chipBg: '#e0f2fe',
    chipText: '#075985',
    chipBorder: '#bae6fd',
    engBadgeBg: 'rgba(6, 122, 58, 0.08)',
    engBadgeText: '#067a3a',
  },
  academic: {
    blueprintGrad: 'linear-gradient(150deg, #0369a1 0%, #0284c7 55%, #0ea5e9 100%)',
    blueprintGlow: 'rgba(2, 132, 199, 0.45)',
    blueprintSubtext: '#bae6fd',
    blueprintUnit: '#7dd3fc',
    surface: '#f0f9ff',
    border: '#bae6fd',
    textLabel: '#0369a1',
    unitColor: '#0369a1',
    tallyOn: 'linear-gradient(180deg, #38bdf8, #0284c7)',
    tallyTrack: '#e0f2fe',
    rulerColor: '#7dd3fc',
    rulerMajor: '#0284c7',
    pinColor: '#0284c7',
    gearColor: '#fbbf24',
    gearInner: '#fde68a',
    gearText: '#5c3d00',
    chipBg: '#e0f2fe',
    chipText: '#0369a1',
    chipBorder: '#7dd3fc',
    engBadgeBg: 'rgba(3, 105, 161, 0.08)',
    engBadgeText: '#0369a1',
  },
  publications: {
    blueprintGrad: 'linear-gradient(150deg, #9f1239 0%, #be123c 55%, #e11d48 100%)',
    blueprintGlow: 'rgba(190, 18, 60, 0.45)',
    blueprintSubtext: '#fecdd3',
    blueprintUnit: '#fda4af',
    surface: '#fff1f2',
    border: '#fecdd3',
    textLabel: '#be123c',
    unitColor: '#be123c',
    tallyOn: 'linear-gradient(180deg, #fb7185, #e11d48)',
    tallyTrack: '#ffe4e6',
    rulerColor: '#fda4af',
    rulerMajor: '#e11d48',
    pinColor: '#e11d48',
    gearColor: '#fbbf24',
    gearInner: '#fde68a',
    gearText: '#5c3d00',
    chipBg: '#ffe4e6',
    chipText: '#9f1239',
    chipBorder: '#fecdd3',
    engBadgeBg: 'rgba(190, 18, 60, 0.08)',
    engBadgeText: '#be123c',
  },
  service: {
    blueprintGrad: 'linear-gradient(150deg, #92400e 0%, #b45309 55%, #d97706 100%)',
    blueprintGlow: 'rgba(180, 83, 9, 0.45)',
    blueprintSubtext: '#fde68a',
    blueprintUnit: '#fef3c7',
    surface: '#fffbeb',
    border: '#fed7aa',
    textLabel: '#92400e',
    unitColor: '#92400e',
    tallyOn: 'linear-gradient(180deg, #fbbf24, #d97706)',
    tallyTrack: '#fef3c7',
    rulerColor: '#fcd34d',
    rulerMajor: '#d97706',
    pinColor: '#d97706',
    gearColor: '#f59e0b',
    gearInner: '#fef3c7',
    gearText: '#78350f',
    chipBg: '#fef3c7',
    chipText: '#78350f',
    chipBorder: '#fde68a',
    engBadgeBg: 'rgba(146, 64, 14, 0.08)',
    engBadgeText: '#92400e',
  },
  ip: {
    blueprintGrad: 'linear-gradient(150deg, #5b21b6 0%, #6d28d9 55%, #7c3aed 100%)',
    blueprintGlow: 'rgba(109, 40, 217, 0.45)',
    blueprintSubtext: '#ddd6fe',
    blueprintUnit: '#c4b5fd',
    surface: '#f5f3ff',
    border: '#ddd6fe',
    textLabel: '#6d28d9',
    unitColor: '#6d28d9',
    tallyOn: 'linear-gradient(180deg, #a78bfa, #7c3aed)',
    tallyTrack: '#ede9fe',
    rulerColor: '#c4b5fd',
    rulerMajor: '#7c3aed',
    pinColor: '#7c3aed',
    gearColor: '#fbbf24',
    gearInner: '#fde68a',
    gearText: '#5c3d00',
    chipBg: '#ede9fe',
    chipText: '#5b21b6',
    chipBorder: '#c4b5fd',
    engBadgeBg: 'rgba(109, 40, 217, 0.08)',
    engBadgeText: '#6d28d9',
  },
  monitoring: {
    blueprintGrad: 'linear-gradient(150deg, #312e81 0%, #3730a3 55%, #4338ca 100%)',
    blueprintGlow: 'rgba(55, 48, 163, 0.45)',
    blueprintSubtext: '#c7d2fe',
    blueprintUnit: '#a5b4fc',
    surface: '#eef2ff',
    border: '#c7d2fe',
    textLabel: '#3730a3',
    unitColor: '#3730a3',
    tallyOn: 'linear-gradient(180deg, #818cf8, #4f46e5)',
    tallyTrack: '#e0e7ff',
    rulerColor: '#a5b4fc',
    rulerMajor: '#4f46e5',
    pinColor: '#4f46e5',
    gearColor: '#fbbf24',
    gearInner: '#fde68a',
    gearText: '#5c3d00',
    chipBg: '#e0e7ff',
    chipText: '#312e81',
    chipBorder: '#c7d2fe',
    engBadgeBg: 'rgba(55, 48, 163, 0.08)',
    engBadgeText: '#3730a3',
  },
};

/**
 * Engineering Drafting Corner Registration Ticks (CAD Style)
 */
function EngineeringCornerTicks({ color = 'rgba(0, 0, 0, 0.12)' }: { color?: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '7px',
          height: '7px',
          borderTop: `1.5px solid ${color}`,
          borderLeft: `1.5px solid ${color}`,
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '7px',
          height: '7px',
          borderTop: `1.5px solid ${color}`,
          borderRight: `1.5px solid ${color}`,
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '7px',
          height: '7px',
          borderBottom: `1.5px solid ${color}`,
          borderLeft: `1.5px solid ${color}`,
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '7px',
          height: '7px',
          borderBottom: `1.5px solid ${color}`,
          borderRight: `1.5px solid ${color}`,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

export function ExecutiveKpiDeck({
  mission,
  blueprintCard,
  gearCard,
  tallyCard,
  rulerCard,
  items,
  className = '',
  style,
}: ExecutiveKpiDeckProps) {
  const tokens = MISSION_VISUAL_TOKENS[mission] || MISSION_VISUAL_TOKENS.research;

  const [isGearPopoverOpen, setIsGearPopoverOpen] = useState(false);
  const gearRef = useRef<HTMLDivElement>(null);

  const [hoveredSegmentIdx, setHoveredSegmentIdx] = useState<number | null>(null);
  const [isMoreCategoriesOpen, setIsMoreCategoriesOpen] = useState(false);
  const moreCategoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMoreCategoriesOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (moreCategoriesRef.current && !moreCategoriesRef.current.contains(e.target as Node)) {
        setIsMoreCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreCategoriesOpen]);

  useEffect(() => {
    if (!isGearPopoverOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (gearRef.current && !gearRef.current.contains(e.target as Node)) {
        setIsGearPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGearPopoverOpen]);

  const departmentBreakdown: DepartmentBreakdownItem[] = useMemo(() => {
    if (gearCard.departments && gearCard.departments.length > 0) {
      return gearCard.departments;
    }
    const rawItems = gearCard.items || items || [];
    if (!rawItems || rawItems.length === 0) return [];

    const counts: Record<string, number> = {};
    let total = 0;

    rawItems.forEach((it: any) => {
      const rawDept = String(
        it.department ||
        it.department_clean ||
        it.departmentCode ||
        it.dept ||
        it.alloc_faculty ||
        it.creator_dept ||
        it.faculty ||
        it.department_name ||
        ''
      ).trim();
      if (!rawDept || rawDept === '-' || rawDept === 'nan' || rawDept === 'NaT') {
        const dept = getDepartment('-');
        counts[dept.code] = (counts[dept.code] || 0) + 1;
        total++;
        return;
      }
      const depts = rawDept.split(',').map((s) => s.trim()).filter(Boolean);
      depts.forEach((d) => {
        const dept = getDepartment(d);
        counts[dept.code] = (counts[dept.code] || 0) + 1;
        total++;
      });
    });

    if (total === 0) return [];

    return Object.entries(counts)
      .map(([code, count]) => {
        const dept = getDepartment(code);
        const percent = (count / total) * 100;
        return {
          code,
          name: code === 'OTH' ? 'อื่น ๆ' : dept.name,
          count,
          percent,
          color: dept.color,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [gearCard.departments, gearCard.items, items]);

  const gearValueDisplay =
    gearCard.gearValue !== undefined && gearCard.gearValue !== null
      ? gearCard.gearValue
      : departmentBreakdown.length > 0
      ? departmentBreakdown.length
      : 0;

  const defaultPopoverTitle = useMemo(() => {
    if (gearCard.popoverTitle) return gearCard.popoverTitle;
    switch (mission) {
      case 'publications':
        return 'สังกัดที่มีผลงาน';
      case 'ip':
        return 'สังกัดที่มีทรัพย์สินทางปัญญา';
      case 'service':
        return 'สังกัดที่มีงานบริการ';
      case 'research':
      case 'academic':
      default:
        return 'สังกัดที่มีโครงการ';
    }
  }, [gearCard.popoverTitle, mission]);

  const defaultPopoverSubtitle = useMemo(() => {
    if (gearCard.popoverSubtitle) return gearCard.popoverSubtitle;
    switch (mission) {
      case 'publications':
        return 'สัดส่วนผลงานแยกตามสังกัด';
      case 'ip':
        return 'สัดส่วนทรัพย์สินทางปัญญาแยกตามสังกัด';
      case 'service':
        return 'สัดส่วนงานบริการแยกตามสังกัด';
      case 'research':
      case 'academic':
      default:
        return 'สัดส่วนโครงการแยกตามสังกัด';
    }
  }, [gearCard.popoverSubtitle, mission]);

  // Multi-segment Blueprint Card data calculation (with backwards compatibility)
  const cardSegments: BlueprintSegment[] = useMemo(() => {
    if (blueprintCard.segments && blueprintCard.segments.length > 0) {
      return blueprintCard.segments;
    }
    if (blueprintCard.primaryLegend && blueprintCard.secondaryLegend) {
      const s1Pct = Math.max(0, Math.min(100, (blueprintCard.splitRatio ?? 0.5) * 100));
      const s2Pct = Math.max(0, 100 - s1Pct);
      return [
        {
          label: blueprintCard.primaryLegend.label,
          value: typeof blueprintCard.primaryLegend.value === 'number' ? blueprintCard.primaryLegend.value : parseFloat(String(blueprintCard.primaryLegend.value)) || 0,
          displayValue: String(blueprintCard.primaryLegend.value),
          unit: blueprintCard.unit,
          percent: blueprintCard.primaryLegend.percent ? parseFloat(blueprintCard.primaryLegend.percent) : s1Pct,
          color: blueprintCard.primaryLegend.color || '#38bdf8',
        },
        {
          label: blueprintCard.secondaryLegend.label,
          value: typeof blueprintCard.secondaryLegend.value === 'number' ? blueprintCard.secondaryLegend.value : parseFloat(String(blueprintCard.secondaryLegend.value)) || 0,
          displayValue: String(blueprintCard.secondaryLegend.value),
          unit: blueprintCard.unit,
          percent: blueprintCard.secondaryLegend.percent ? parseFloat(blueprintCard.secondaryLegend.percent) : s2Pct,
          color: blueprintCard.secondaryLegend.color || '#86efac',
        },
      ];
    }
    return [];
  }, [blueprintCard]);

  const segmentPositions = useMemo(() => {
    let current = 0;
    return cardSegments.map((seg) => {
      const start = current;
      const width = seg.percent;
      const center = start + width / 2;
      current += width;
      return { start, width, center };
    });
  }, [cardSegments]);

  const activeSegment = hoveredSegmentIdx !== null ? cardSegments[hoveredSegmentIdx] : null;
  const activePos = hoveredSegmentIdx !== null ? segmentPositions[hoveredSegmentIdx] : null;
  const centerPct = activePos ? Math.max(22, Math.min(78, activePos.center)) : 50;
  const arrowOffset = activePos ? Math.max(-42, Math.min(42, (activePos.center - centerPct) * 1.8)) : 0;

  // Split Bar calculations
  const splitAWidth = Math.max(0, Math.min(100, (blueprintCard.splitRatio ?? 0.5) * 100));
  const splitBWidth = Math.max(0, 100 - splitAWidth);

  // Tally Bars calculations (24 bars matching progress-card.html)
  const TALLY_TOTAL = 24;
  const tallyPercent =
    tallyCard.percent !== undefined
      ? tallyCard.percent
      : tallyCard.totalCount && tallyCard.totalCount > 0
        ? ((Number(tallyCard.activeCount || tallyCard.value) || 0) / tallyCard.totalCount) * 100
        : 50;
  const activeTallyCount = Math.round((Math.max(0, Math.min(100, tallyPercent)) / 100) * TALLY_TOTAL);
  const numericTallyPercent = Math.max(0, Math.min(100, Number(tallyPercent) || 0));
  const pinPos = Math.max(6, Math.min(94, numericTallyPercent));
  const displayTallyPercent =
    Number(numericTallyPercent.toFixed(1)) % 1 === 0
      ? `${Math.round(numericTallyPercent)}%`
      : `${numericTallyPercent.toFixed(1)}%`;

  // Ruler pin position calculation
  const rulerRatio = rulerCard.max > 0 ? Math.max(0, Math.min(1, rulerCard.current / rulerCard.max)) : 0;
  const pinLeftPercent = Math.max(2, Math.min(98, rulerRatio * 100));

  return (
    <div
      className={`exec-kpi-deck-wrap ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '16px',
        width: '100%',
        ...style,
      }}
    >
      {/* CARD 1: Blueprint Card (Hero Metric & Multi-segment Dimension - Engineering CAD Drafting) */}
      <div
        className="exec-card exec-c1"
        style={{
          position: 'relative',
          overflow: hoveredSegmentIdx !== null || isMoreCategoriesOpen ? 'visible' : 'hidden',
          zIndex: hoveredSegmentIdx !== null || isMoreCategoriesOpen ? 45 : 1,
          minHeight: '215px',
          padding: '20px 22px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
          background: tokens.blueprintGrad,
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: `0 16px 32px -16px ${tokens.blueprintGlow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        <EngineeringCornerTicks color="rgba(255, 255, 255, 0.35)" />

        {/* Precision Blueprint CAD Drafting Grid Overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            overflow: 'hidden',
            pointerEvents: 'none',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            WebkitMaskImage: 'radial-gradient(circle at 100% 0%, #000 0%, transparent 80%)',
            maskImage: 'radial-gradient(circle at 100% 0%, #000 0%, transparent 80%)',
          }}
        />

        {/* Header */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: tokens.blueprintSubtext }}>
            {blueprintCard.label}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: '8px', marginTop: '6px', position: 'relative' }}>
          <span style={{ fontSize: '48px', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums' }}>
            {blueprintCard.value}
          </span>
          <span style={{ fontSize: '17px', fontWeight: 600, color: tokens.blueprintUnit }}>
            {blueprintCard.unit}
          </span>
        </div>

        <div style={{ position: 'relative', marginTop: 'auto', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Engineering CAD Split Bar with Dual End Caps & Hover Tooltip */}
          <div style={{ position: 'relative', height: '14px' }}>
            {/* FLOATING HOVER TOOLTIP (matches requested UI with down arrow) */}
            {hoveredSegmentIdx !== null && activeSegment && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 12px)',
                  left: `${centerPct}%`,
                  transform: 'translateX(-50%)',
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '9px 14px',
                  boxShadow: '0 14px 30px -4px rgba(0, 0, 0, 0.35), 0 4px 12px -2px rgba(0, 0, 0, 0.18)',
                  minWidth: '175px',
                  whiteSpace: 'nowrap',
                  zIndex: 70,
                  pointerEvents: 'none',
                  animation: 'popoverFadeIn 0.15s ease-out',
                }}
              >
                {/* Pointer arrow pointing down towards the segment */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: `calc(50% + ${arrowOffset}px)`,
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: '12px',
                    height: '12px',
                    background: '#ffffff',
                  }}
                />

                {/* Row 1: Bullet + Category Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      borderRadius: '4px',
                      border: `2px solid ${activeSegment.color}`,
                      background: `${activeSegment.color}33`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                    {activeSegment.label}
                  </span>
                </div>

                {/* Row 2: Big count + Unit + Percentage Chip */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginTop: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      {typeof activeSegment.value === 'number' && Number.isInteger(activeSegment.value)
                        ? activeSegment.value.toLocaleString()
                        : activeSegment.displayValue || activeSegment.value}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                      {activeSegment.unit || blueprintCard.unit}
                    </span>
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      background: `${activeSegment.color}25`,
                      color: activeSegment.color,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {activeSegment.percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            {/* Left and right CAD end caps */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'rgba(255, 255, 255, 0.8)' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '2px', background: 'rgba(255, 255, 255, 0.8)' }} />
            
            {/* The segmented bar track */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '2px',
                height: '10px',
                borderRadius: '999px',
                display: 'flex',
                gap: '2px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.18)',
              }}
            >
              {cardSegments.map((seg, idx) => {
                const isHovered = hoveredSegmentIdx === idx;
                return (
                  <div
                    key={seg.key || seg.label || idx}
                    onMouseEnter={() => setHoveredSegmentIdx(idx)}
                    onMouseLeave={() => setHoveredSegmentIdx(null)}
                    style={{
                      width: `${Math.max(seg.percent, 1.5)}%`,
                      minWidth: seg.percent > 0 ? '4px' : '0px',
                      background: seg.color,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'width 0.6s ease, filter 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease',
                      filter: isHovered ? 'brightness(1.3)' : 'none',
                      boxShadow: isHovered ? '0 0 12px rgba(255, 255, 255, 0.95), inset 0 0 4px #ffffff' : 'none',
                      transform: isHovered ? 'scaleY(1.2)' : 'none',
                      zIndex: isHovered ? 5 : 1,
                    }}
                    title={`${seg.label}: ${seg.displayValue || seg.value} (${seg.percent.toFixed(1)}%)`}
                  />
                );
              })}
            </div>
          </div>

          {/* Legends */}
          {cardSegments.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
              {/* Row 1 */}
              {cardSegments[0] && (
                <div
                  onMouseEnter={() => setHoveredSegmentIdx(0)}
                  onMouseLeave={() => setHoveredSegmentIdx(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12.5px',
                    color: '#e6fbee',
                    cursor: 'pointer',
                    opacity: hoveredSegmentIdx === null || hoveredSegmentIdx === 0 ? 1 : 0.6,
                    transition: 'opacity 0.15s',
                  }}
                >
                  <span
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '2.5px',
                      flexShrink: 0,
                      background: cardSegments[0].color,
                      boxShadow: hoveredSegmentIdx === 0 ? '0 0 8px #ffffff' : 'none',
                    }}
                  />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cardSegments[0].label} <b style={{ fontWeight: 700, color: '#ffffff' }}>{cardSegments[0].displayValue || cardSegments[0].value}</b>
                    {` (${cardSegments[0].percent.toFixed(1)}%)`}
                  </span>
                </div>
              )}

              {/* Row 2 (with +N ประเภท button if more than 2 categories) */}
              {cardSegments[1] && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    fontSize: '12.5px',
                    color: '#e6fbee',
                  }}
                >
                  <div
                    onMouseEnter={() => setHoveredSegmentIdx(1)}
                    onMouseLeave={() => setHoveredSegmentIdx(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: 0,
                      cursor: 'pointer',
                      opacity: hoveredSegmentIdx === null || hoveredSegmentIdx === 1 ? 1 : 0.6,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    <span
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '2.5px',
                        flexShrink: 0,
                        background: cardSegments[1].color,
                        boxShadow: hoveredSegmentIdx === 1 ? '0 0 8px #ffffff' : 'none',
                      }}
                    />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cardSegments[1].label} <b style={{ fontWeight: 700, color: '#ffffff' }}>{cardSegments[1].displayValue || cardSegments[1].value}</b>
                      {` (${cardSegments[1].percent.toFixed(1)}%)`}
                    </span>
                  </div>

                  {cardSegments.length > 2 && (
                    <div ref={moreCategoriesRef} style={{ position: 'relative', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => setIsMoreCategoriesOpen((prev) => !prev)}
                        style={{
                          background: isMoreCategoriesOpen ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.18)',
                          border: '1px solid rgba(255, 255, 255, 0.35)',
                          color: '#ffffff',
                          borderRadius: '999px',
                          padding: '2px 9px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          lineHeight: 1.2,
                          transition: 'all 0.15s',
                        }}
                        title="ดูประเภททั้งหมด"
                      >
                        +{cardSegments.length - 2} ประเภท
                      </button>

                      {/* Dropdown list of remaining categories */}
                      {isMoreCategoriesOpen && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: 0,
                            background: '#ffffff',
                            borderRadius: '16px',
                            padding: '12px 14px',
                            boxShadow: '0 16px 36px -4px rgba(15, 23, 42, 0.3), 0 4px 12px -2px rgba(15, 23, 42, 0.15)',
                            zIndex: 70,
                            minWidth: '230px',
                            color: '#1e293b',
                            animation: 'popoverFadeIn 0.15s ease-out',
                          }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                            ประเภททั้งหมด ({cardSegments.length})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                            {cardSegments.map((seg, idx) => (
                              <div
                                key={seg.key || seg.label || idx}
                                onMouseEnter={() => setHoveredSegmentIdx(idx)}
                                onMouseLeave={() => setHoveredSegmentIdx(null)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  padding: '4px 6px',
                                  borderRadius: '6px',
                                  background: hoveredSegmentIdx === idx ? '#f1f5f9' : 'transparent',
                                  transition: 'background 0.15s',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: seg.color, flexShrink: 0 }} />
                                  <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {seg.label}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{seg.displayValue || seg.value}</span>
                                  <span style={{ color: '#64748b', fontSize: '11px' }}>({seg.percent.toFixed(1)}%)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CARD 2: Total Items + Animated Mechanical Gearbox & Calibrated Dial */}
      <div
        className="exec-card exec-c2"
        style={{
          position: 'relative',
          overflow: isGearPopoverOpen ? 'visible' : 'hidden',
          zIndex: isGearPopoverOpen ? 50 : 1,
          minHeight: '215px',
          padding: '20px 22px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: '12px',
          background: `linear-gradient(165deg, #ffffff 0%, ${tokens.surface} 100%)`,
          border: `1px solid ${tokens.border}`,
          boxShadow: isGearPopoverOpen
            ? '0 20px 36px -12px rgba(0, 0, 0, 0.16), inset 0 1px 0 #ffffff'
            : '0 12px 28px -18px rgba(0, 0, 0, 0.12), inset 0 1px 0 #ffffff',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        <EngineeringCornerTicks color={tokens.border} />

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'space-between', position: 'relative' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: tokens.textLabel }}>
              {gearCard.label}
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '60px', lineHeight: 1, fontWeight: 700, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', color: '#1e293b' }}>
              {gearCard.value}
            </div>
            <div style={{ fontSize: '17px', fontWeight: 600, color: tokens.textLabel, marginTop: '3px' }}>
              {gearCard.unit}
            </div>
          </div>
        </div>

        {/* Mechanical Cog Box Badge with Calibrated Tachometer Dial Ring & Dropdown Popover */}
        <div
          ref={gearRef}
          style={{
            position: 'relative',
            width: '98px',
            flexShrink: 0,
            alignSelf: 'center',
            textAlign: 'center',
          }}
        >
          {/* Clickable trigger area */}
          <div
            onClick={() => setIsGearPopoverOpen((prev) => !prev)}
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: '16px',
              padding: '4px 2px',
              transition: 'transform 0.18s ease',
            }}
            title="คลิกเพื่อดูสัดส่วนแยกตามสังกัด"
          >
            {/* Radial amber glow */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '44px',
                width: '120px',
                height: '120px',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.38), rgba(251, 191, 36, 0) 68%)',
                pointerEvents: 'none',
              }}
            />

            {/* Calibrated dial ticks ring around the gear */}
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', left: '1px', top: '1px', width: '96px', height: '96px', pointerEvents: 'none' }}>
              <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(245, 158, 11, 0.35)" strokeWidth="1" strokeDasharray="3 5" />
            </svg>

            <svg viewBox="0 0 100 100" aria-hidden="true" style={{ position: 'relative', width: '86px', height: '86px', display: 'block', margin: '5px auto 0 auto', filter: 'drop-shadow(0 6px 10px rgba(180, 120, 0, 0.24))' }}>
              <g className="gear-spin-anim" style={{ transformOrigin: '50px 50px' }}>
                <path
                  fill={tokens.gearColor}
                  d="M41.68 13.95 L43.60 4.45 A46 46 0 0 1 56.40 4.45 L58.32 13.95 A37 37 0 0 1 66.80 17.03 L74.38 10.99 A46 46 0 0 1 84.18 19.22 L79.55 27.73 A37 37 0 0 1 84.06 35.54 L93.75 35.79 A46 46 0 0 1 95.97 48.39 L86.95 51.94 A37 37 0 0 1 85.38 60.82 L92.65 67.23 A46 46 0 0 1 86.25 78.32 L77.06 75.23 A37 37 0 0 1 70.15 81.03 L71.60 90.62 A46 46 0 0 1 59.56 94.99 L54.51 86.72 A37 37 0 0 1 45.49 86.72 L40.44 94.99 A46 46 0 0 1 28.40 90.62 L29.85 81.03 A37 37 0 0 1 22.94 75.23 L13.75 78.32 A46 46 0 0 1 7.35 67.23 L14.62 60.82 A37 37 0 0 1 13.05 51.94 L4.03 48.39 A46 46 0 0 1 6.25 35.79 L15.94 35.54 A37 37 0 0 1 20.45 27.73 L15.82 19.22 A46 46 0 0 1 25.62 10.99 L33.20 17.03 A37 37 0 0 1 41.68 13.95 Z"
                />
                <circle cx="50" cy="50" r="27" fill={tokens.gearInner} />
              </g>
            </svg>

            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '5px',
                height: '86px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                fontWeight: 700,
                color: tokens.gearText,
                lineHeight: 1,
              }}
            >
              {gearValueDisplay}
            </div>

            <div
              style={{
                position: 'relative',
                marginTop: '2px',
                fontSize: '15px',
                fontWeight: 700,
                color: tokens.gearText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <span>{gearCard.gearLabel || 'สังกัด'}</span>
              <span style={{ fontSize: '11px', lineHeight: 1 }}>{isGearPopoverOpen ? '▲' : '▼'}</span>
            </div>
          </div>

          {/* Interactive Popover Dropdown matching requested UI */}
          {isGearPopoverOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: 'calc(100% + 14px)',
                right: '-16px',
                width: '360px',
                background: '#ffffff',
                borderRadius: '18px',
                padding: '18px 20px',
                boxShadow: '0 20px 42px -8px rgba(15, 23, 42, 0.22), 0 6px 18px -4px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.06)',
                zIndex: 60,
                textAlign: 'left',
                animation: 'popoverFadeIn 0.18s ease-out',
              }}
            >
              {/* Pointer triangle arrow pointing directly up to the gear */}
              <div
                style={{
                  position: 'absolute',
                  top: '-7px',
                  right: '58px',
                  width: '14px',
                  height: '14px',
                  background: '#ffffff',
                  transform: 'rotate(45deg)',
                  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                  borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              />

              {/* Popover Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {defaultPopoverTitle}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: '#e0f2fe',
                      color: '#0284c7',
                      border: '1px solid #bae6fd',
                      lineHeight: 1.2,
                    }}
                  >
                    {departmentBreakdown.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGearPopoverOpen(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                  }}
                  title="ปิด"
                  aria-label="ปิด"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Multi-segment Department Progress Bar */}
              <div
                style={{
                  display: 'flex',
                  height: '9px',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                  gap: '2px',
                  marginBottom: '8px',
                }}
              >
                {departmentBreakdown.map((dept, idx) => (
                  <div
                    key={dept.code || idx}
                    style={{
                      width: `${Math.max(dept.percent, 1.5)}%`,
                      backgroundColor: dept.color || '#0284c7',
                      transition: 'width 0.4s ease',
                    }}
                    title={`${dept.name}: ${dept.count} (${dept.percent.toFixed(1)}%)`}
                  />
                ))}
              </div>

              {/* Subtitle */}
              <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px', fontWeight: 500 }}>
                {defaultPopoverSubtitle}
              </div>

              {/* Department breakdown rows */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  maxHeight: '340px',
                  overflowY: 'auto',
                  paddingRight: departmentBreakdown.length > 5 ? '4px' : '0px',
                }}
              >
                {departmentBreakdown.map((dept) => (
                  <div
                    key={dept.code}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      alignItems: 'center',
                      columnGap: '12px',
                    }}
                  >
                    {/* 1. Department Badge */}
                    <div style={{ width: '56px', flexShrink: 0 }}>
                      <DepartmentBadge
                        value={dept.code}
                        style={{
                          display: 'inline-flex',
                          width: '100%',
                          justifyContent: 'center',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          padding: '3px 0',
                          borderRadius: '10px',
                        }}
                      />
                    </div>

                    {/* 2. Department Name & mini progress bar */}
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: '#1e293b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={dept.name}
                      >
                        {dept.name}
                      </span>
                      <div
                        style={{
                          height: '5px',
                          width: '100%',
                          borderRadius: '999px',
                          backgroundColor: '#e2e8f0',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.max(dept.percent, 2)}%`,
                            backgroundColor: dept.color,
                            borderRadius: '999px',
                          }}
                        />
                      </div>
                    </div>

                    {/* 3. Count & Percentage */}
                    <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '48px' }}>
                      <div
                        style={{
                          fontSize: '19px',
                          fontWeight: 700,
                          color: '#1e293b',
                          lineHeight: 1.1,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {dept.count}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: 500,
                          marginTop: '2px',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {dept.percent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}

                {departmentBreakdown.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '13px' }}>
                    ไม่มีข้อมูลสังกัด
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CARD 3: Target/Proportion with Pill Chip & Segmented LED Oscilloscope Bars */}
      <div
        className="exec-card exec-c3"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '215px',
          padding: '20px 22px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(165deg, #ffffff 0%, ${tokens.surface} 100%)`,
          border: `1px solid ${tokens.border}`,
          boxShadow: '0 12px 28px -18px rgba(0, 0, 0, 0.12), inset 0 1px 0 #ffffff',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        <EngineeringCornerTicks color={tokens.border} />

        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: tokens.textLabel }}>
            {tallyCard.label}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: '8px', marginTop: '6px', position: 'relative' }}>
          <span style={{ fontSize: '48px', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums', color: '#1e293b' }}>
            {tallyCard.value}
          </span>
          <span style={{ fontSize: '17px', fontWeight: 600, color: tokens.textLabel }}>
            {tallyCard.unit}
          </span>
        </div>

        {/* Digital Segmented LED Bar with Progress Badge matching progress-card.html */}
        <div style={{ position: 'relative', marginTop: 'auto', paddingTop: '32px' }}>
          {/* Progress Badge Callout: style directly from progress-card.html */}
          <div
            style={{
              position: 'absolute',
              left: `${pinPos}%`,
              top: '-6px',
              transform: 'translateX(-50%)',
              padding: '4px 13px',
              fontSize: '15px',
              fontWeight: 700,
              lineHeight: 1.2,
              color: '#ffffff',
              background: '#1f2a44',
              border: '2px solid #ffffff',
              borderRadius: '999px',
              boxShadow: '0 4px 10px rgba(31, 42, 68, 0.35)',
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
              transition: 'left 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {displayTallyPercent}
            {/* Arrow pointer matching .progress-badge::after in progress-card.html */}
            <div
              style={{
                content: '""',
                position: 'absolute',
                left: '50%',
                bottom: '-6px',
                width: '9px',
                height: '9px',
                background: '#1f2a44',
                borderRight: '2px solid #ffffff',
                borderBottom: '2px solid #ffffff',
                transform: 'translateX(-50%) rotate(45deg)',
              }}
            />
          </div>

          <div
            role="img"
            aria-label={tallyCard.label}
            style={{
              display: 'flex',
              gap: '3px',
              height: '20px',
            }}
          >
            {Array.from({ length: TALLY_TOTAL }).map((_, i) => (
              <i
                key={i}
                style={{
                  flex: 1,
                  borderRadius: '4px',
                  background: i < activeTallyCount ? tokens.tallyOn : tokens.tallyTrack,
                  boxShadow: i < activeTallyCount ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Technical Telemetry Step Markers */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '10px',
              fontWeight: 500,
              color: '#8b93a7',
              marginTop: '6px',
            }}
          >
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* CARD 4: Benchmark Scale with Precision Vernier Caliper Gauge */}
      <div
        className="exec-card exec-c4"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '215px',
          padding: '20px 22px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(165deg, #ffffff 0%, ${tokens.surface} 100%)`,
          border: `1px solid ${tokens.border}`,
          boxShadow: '0 12px 28px -18px rgba(0, 0, 0, 0.12), inset 0 1px 0 #ffffff',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        <EngineeringCornerTicks color={tokens.border} />

        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: tokens.textLabel }}>
            {rulerCard.label}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: '8px', marginTop: '6px', position: 'relative' }}>
          <span style={{ fontSize: '48px', lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums', color: '#1e293b' }}>
            {rulerCard.value}
          </span>
          <span style={{ fontSize: '17px', fontWeight: 600, color: tokens.textLabel }}>
            {rulerCard.unit}
          </span>
        </div>

        {/* Vernier Caliper Precision Scale Graphic */}
        <div style={{ position: 'relative', marginTop: 'auto', height: '54px' }}>

          {/* Minor Ticks repeating (1mm divisions) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '20px',
              height: '7px',
              borderRight: `1px solid ${tokens.rulerColor}`,
              backgroundImage: `repeating-linear-gradient(90deg, ${tokens.rulerColor} 0, ${tokens.rulerColor} 1px, transparent 1px, transparent calc(100%/18))`,
            }}
          />
          {/* Major tick lines (5mm / 10mm divisions) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '20px',
              height: '14px',
              borderRight: `1.5px solid ${tokens.rulerMajor}`,
              backgroundImage: `repeating-linear-gradient(90deg, ${tokens.rulerMajor} 0, ${tokens.rulerMajor} 1.5px, transparent 1.5px, transparent calc(100%/3))`,
            }}
          />
          {/* Baseline */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: '19px',
              height: '1.5px',
              background: tokens.rulerMajor,
            }}
          />

          {/* Animated Vernier Caliper Pin Marker */}
          <div
            style={{
              position: 'absolute',
              left: `${pinLeftPercent}%`,
              bottom: '20px',
              width: 0,
              transition: 'left 1s cubic-bezier(0.2, 0.7, 0.2, 1)',
            }}
          >
            {/* Needle stem */}
            <div
              style={{
                position: 'absolute',
                left: '-1.5px',
                bottom: 0,
                width: '3px',
                height: '26px',
                borderRadius: '2px',
                background: tokens.pinColor,
              }}
            />
            {/* Circular pin head */}
            <div
              style={{
                position: 'absolute',
                left: '-7px',
                bottom: '22px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#ffffff',
                border: `3.5px solid ${tokens.pinColor}`,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
              }}
            />
          </div>

          {/* Numbers scale along bottom */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '16px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: tokens.textLabel,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {rulerCard.marks && rulerCard.marks.length > 0 ? (
              rulerCard.marks.map((m, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === rulerCard.marks!.length - 1;
                return (
                  <span
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${m.positionPercent}%`,
                      transform: isFirst ? 'none' : isLast ? 'translateX(-100%)' : 'translateX(-50%)',
                      fontWeight: isLast ? 700 : 600,
                      color: isLast ? '#0f172a' : tokens.textLabel,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.label}
                  </span>
                );
              })
            ) : (
              <>
                <span style={{ position: 'absolute', left: 0 }}>0</span>
                <span style={{ position: 'absolute', left: '33.333%', transform: 'translateX(-50%)' }}>
                  {(rulerCard.max / 3).toFixed(1)}
                </span>
                <span style={{ position: 'absolute', left: '66.666%', transform: 'translateX(-50%)' }}>
                  {((rulerCard.max * 2) / 3).toFixed(1)}
                </span>
                <span style={{ position: 'absolute', right: 0, transform: 'translateX(0)', fontWeight: 700, color: '#0f172a' }}>
                  สูงสุด {rulerCard.max.toFixed(2)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .gear-spin-anim {
          animation: spin 35s linear infinite;
        }
        .exec-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 36px -18px rgba(0, 0, 0, 0.18), inset 0 1px 0 #ffffff;
        }
        @media (prefers-reduced-motion: reduce) {
          .gear-spin-anim {
            animation: none;
          }
          .exec-card {
            transition: none;
          }
        }
        @media (max-width: 1100px) {
          .exec-kpi-deck-wrap {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .exec-kpi-deck-wrap {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
