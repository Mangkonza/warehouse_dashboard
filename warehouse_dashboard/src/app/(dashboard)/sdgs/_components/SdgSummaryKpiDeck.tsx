'use client';

import React, { useState, useEffect } from 'react';
import { SdgAggregationResult } from '@/lib/sdgAggregationService';
import { SDG_DEFINITIONS } from '@/lib/sdg';
import { SdgIcon } from '@/components/ui/SdgIcon';

function inkColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#0f172a' : '#ffffff';
}

function useAnimatedNumber(target: number, duration = 900) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * ease));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target, duration]);

  return display;
}

interface SdgSummaryKpiDeckProps {
  data: SdgAggregationResult;
  selectedSdg?: number | null;
  onSelectSdg?: (sdgNum: number) => void;
}

export function SdgSummaryKpiDeck({
  data,
  selectedSdg,
  onSelectSdg,
}: SdgSummaryKpiDeckProps) {
  const curYear = data.targetYearBe;
  const prevYear = data.targetYearBe - 1;

  const curCount = data.kpis.distinctProjectsCount;
  const animatedCurCount = useAnimatedNumber(curCount);

  // 3-year dynamic comparison window ending at curYear: [curYear - 2, prevYear, curYear]
  const years = [curYear - 2, prevYear, curYear];
  const totals: Record<number, number | null> = {
    [curYear - 2]: data.kpis.yearlyTotals?.[curYear - 2] ?? null,
    [prevYear]: data.kpis.yearlyTotals?.[prevYear] ?? null,
    [curYear]: data.kpis.yearlyTotals?.[curYear] ?? curCount,
  };

  const prevCount = totals[prevYear];

  // Delta chip
  let chipEl: React.ReactNode = null;
  if (prevCount !== null && prevCount > 0) {
    const diff = curCount - prevCount;
    if (diff !== 0) {
      const isUp = diff > 0;
      const pct = Math.round((Math.abs(diff) / prevCount) * 100);
      chipEl = (
        <span className={`chip ${isUp ? 'up' : 'down'}`}>
          {isUp ? '▲' : '▼'} {pct}%
        </span>
      );
    }
  }

  // Trend line points
  const maxVal = Math.max(...years.map((y) => totals[y] || 0), 1);
  const X = [24, 120, 224];
  const baseY = 32;
  const Y = (v: number) => Math.round(26 - (v / maxVal) * 14);

  const pts: Array<[number, number]> = [];
  years.forEach((y, i) => {
    const v = totals[y];
    if (v !== null && v !== undefined) pts.push([X[i] || 24 + i * 100, Y(v)]);
  });

  // Top SDG (Card 2)
  const topSdgNum = data.kpis.topSdgNumber || 9;
  const topSdgCount = data.kpis.topSdgCount || 0;
  const animatedTopCount = useAnimatedNumber(topSdgCount);
  const topDef = SDG_DEFINITIONS[topSdgNum] || { nameTh: data.kpis.topSdgNameTh, color: '#FD6925' };
  const topSharePct = curCount > 0 ? Math.round((topSdgCount / curCount) * 100) : 0;

  // Growth SDG (Card 3)
  const growSdgNum = data.kpis.highestGrowingSdgNumber || 11;
  const growDef = SDG_DEFINITIONS[growSdgNum] || { nameTh: data.kpis.highestGrowingSdgNameTh, color: '#FD9D24' };
  const growFrom = data.kpis.highestGrowingFrom ?? 2;
  const growTo = data.kpis.highestGrowingTo ?? 3;
  const growMax = Math.max(growFrom, growTo, 1);
  const growPct = data.kpis.highestGrowingPercent ?? (growFrom > 0 ? Math.round(((growTo - growFrom) / growFrom) * 100) : 0);
  const animatedGrowPct = useAnimatedNumber(Math.abs(growPct));

  // Covered SDGs (Card 4)
  const coveredSet = new Set(data.kpis.coveredSdgNumbers || data.tiles.filter((t) => t.currentCount > 0).map((t) => t.sdgNumber));
  const coveredCount = coveredSet.size;
  const animatedCoveredCount = useAnimatedNumber(coveredCount);

  // Hover state for Card 4 Donut Wheel segments
  const [hoveredSdg, setHoveredSdg] = useState<{
    number: number;
    nameTh: string;
    color: string;
    isCovered: boolean;
  } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // 17-segment circle math
  const C = 90;
  const R = 70;
  const SW = 20;
  const gap = 0.07;
  const n = 17;
  const step = (Math.PI * 2) / n;

  const segments: Array<{ i: number; isCovered: boolean; d: string; color: string; name: string }> = [];

  for (let i = 1; i <= n; i++) {
    const isCovered = coveredSet.has(i);
    const a0 = -Math.PI / 2 + step * (i - 1) + gap / 2;
    const a1 = -Math.PI / 2 + step * i - gap / 2;
    const p0 = [C + R * Math.cos(a0), C + R * Math.sin(a0)];
    const p1 = [C + R * Math.cos(a1), C + R * Math.sin(a1)];
    const dPath = `M ${p0[0]} ${p0[1]} A ${R} ${R} 0 0 1 ${p1[0]} ${p1[1]}`;
    const def = SDG_DEFINITIONS[i] || { nameTh: `SDG ${i}`, color: '#00A651' };

    segments.push({
      i,
      isCovered,
      d: dPath,
      color: def.color,
      name: def.nameTh,
    });
  }

  return (
    <>
      <style>{`
        .sdg-kpi-wrap {
          --ink: #0f172a;
          --muted: #64748b;
          --line: rgba(15, 23, 42, 0.07);
          --card: #ffffff;
          --soft: rgba(15, 23, 42, 0.06);
          --hatch: #cbd5e1;
          --up: #166534;
          --upbg: #dcfce7;
          --down: #991b1b;
          --downbg: #fee2e2;
          --off: #e2e8f0;
          --tint: 13%;
        }
        .dark .sdg-kpi-wrap {
          --ink: #e8edf5;
          --muted: #94a3b8;
          --line: rgba(255, 255, 255, 0.09);
          --card: #121b2b;
          --soft: rgba(255, 255, 255, 0.08);
          --hatch: #475569;
          --up: #bbf7d0;
          --upbg: #14532d;
          --down: #fecaca;
          --downbg: #7f1d1d;
          --off: #243040;
          --tint: 20%;
        }
        .sdg-kpi-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .sdg-kpi-card {
          position: relative;
          isolation: isolate;
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 13px 15px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
          background: radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--ac) var(--tint), var(--card)) 0%, var(--card) 62%);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 18px 36px -24px color-mix(in srgb, var(--ac) 50%, transparent);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: sdgCardIn 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .sdg-kpi-card:nth-child(2) { animation-delay: 0.07s; }
        .sdg-kpi-card:nth-child(3) { animation-delay: 0.14s; }
        .sdg-kpi-card:nth-child(4) { animation-delay: 0.21s; }
        .sdg-kpi-card.interactive:hover {
          transform: translateY(-3px);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 24px 40px -20px color-mix(in srgb, var(--ac) 65%, transparent);
        }
        .sdg-kpi-card.wheel-card {
          overflow: visible;
          z-index: 20;
        }
        .sdg-kpi-card.wheel-card:hover,
        .sdg-kpi-card.wheel-card:focus-within {
          z-index: 50;
        }
        /* Top right faint watermark */
        .sdg-kpi-wm-topright {
          position: absolute;
          right: 12px;
          top: 0px;
          z-index: 0;
          font-size: 58px;
          font-weight: 800;
          line-height: 1;
          color: var(--ac);
          opacity: 0.11;
          letter-spacing: -0.04em;
          pointer-events: none;
          user-select: none;
        }
        .sdg-kpi-lbl {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: var(--ink);
          line-height: 1.35;
          display: flex;
          align-items: center;
        }
        .sdg-kpi-big {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          line-height: 1;
        }
        .sdg-kpi-big b {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
          line-height: 1;
          background: linear-gradient(135deg, var(--ink) 30%, var(--ac));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .sdg-kpi-big span:not(.chip) {
          font-size: 13px;
          color: var(--muted);
          font-weight: 500;
          line-height: 1;
          padding-bottom: 2px;
        }
        .sdg-kpi-big .chip {
          align-self: flex-end;
          margin-left: 2px;
          margin-bottom: 0;
        }
        .sdg-kpi-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: var(--muted);
          min-height: 24px;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12.5px;
          font-weight: 700;
          line-height: 1;
          padding: 4px 9px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .chip.up {
          background: var(--upbg);
          color: var(--up);
        }
        .chip.down {
          background: var(--downbg);
          color: var(--down);
        }
        .sdg-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sdg-badge-sq {
          flex: none;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
          font-weight: 700;
          box-shadow: 0 6px 14px -5px var(--ac), inset 0 -2px 0 rgba(0, 0, 0, 0.12);
        }
        .sdg-badge-sq small {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.08em;
          opacity: 0.9;
          margin-bottom: 1px;
        }
        .sdg-badge-sq b {
          font-size: 19px;
        }
        .sdg-name {
          font-size: 13.5px;
          font-weight: 600;
          line-height: 1.25;
          color: var(--ink);
        }
        .sdg-share-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: auto;
        }
        .sdg-track {
          flex: 1;
          height: 8px;
          border-radius: 999px;
          background: var(--soft);
          overflow: hidden;
        }
        .sdg-track i {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--ac), color-mix(in srgb, var(--ac) 55%, #fff));
          transform-origin: left;
          animation: sdgGrow 0.9s 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .sdg-share-row b {
          font-size: 13.5px;
          font-variant-numeric: tabular-nums;
          color: var(--ink);
        }
        .sdg-trend-svg {
          display: block;
          width: 100%;
          height: 48px;
          overflow: visible;
          margin-top: auto;
        }
        .sdg-trend-svg text {
          font-family: inherit;
          fill: var(--muted);
          font-size: 11.5px;
          font-weight: 500;
        }
        .sdg-trend-svg text.cur-year {
          fill: var(--ink);
          font-weight: 700;
        }
        .sdg-trend-svg text.v {
          fill: var(--ink);
          font-weight: 800;
          font-size: 12.5px;
        }
        .sdg-trend-svg text.nodata {
          fill: var(--muted);
          font-size: 11px;
          font-weight: 500;
        }
        .sdg-ring-svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .sdg-line {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: sdgDraw 1s 0.35s ease-out forwards;
        }
        .sdg-cmp {
          display: grid;
          gap: 6px;
          margin-top: auto;
        }
        .sdg-cmp div {
          display: grid;
          grid-template-columns: 40px 1fr 24px;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          color: var(--muted);
        }
        .sdg-cmp .t {
          height: 10px;
          border-radius: 5px;
          background: var(--soft);
          overflow: hidden;
        }
        .sdg-cmp .t i {
          display: block;
          height: 100%;
          border-radius: 5px;
          background: var(--hatch);
          transform-origin: left;
          animation: sdgGrow 0.9s 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .sdg-cmp .t i.n {
          background: linear-gradient(90deg, var(--ac), color-mix(in srgb, var(--ac) 55%, #fff));
        }
        .sdg-cmp b {
          color: var(--ink);
          font-variant-numeric: tabular-nums;
          text-align: right;
        }
        .ringwrap {
          position: relative;
          width: min(128px, 100%);
          margin: auto auto 0 auto;
        }
        .ringwrap .ring-mid {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
          pointer-events: none;
        }
        .ring-row {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 2px;
          line-height: 1;
        }
        .ring-count {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
          background: linear-gradient(135deg, var(--ink) 25%, #16a34a 65%, #22c55e 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .ring-slash-denom {
          font-size: 14px;
          font-weight: 700;
          color: var(--muted);
          opacity: 0.8;
          margin-left: 2px;
        }
        .ring-label {
          font-size: 10.5px;
          color: var(--muted);
          margin-top: 1px;
          font-weight: 500;
        }
        .sdg-seg {
          animation: sdgPop 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
          transform-box: fill-box;
          transform-origin: center;
          cursor: pointer;
          transition: filter 0.18s ease, stroke-width 0.18s ease, opacity 0.18s ease;
        }
        .sdg-seg:hover {
          filter: brightness(1.15) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
          stroke-width: 24px;
          opacity: 1 !important;
        }
        /* Tooltip styled with SdgIcon (size 86) matching image 3 */
        .sdg-float-tooltip {
          position: absolute;
          transform: translate(-50%, -125%);
          pointer-events: none;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.35)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.15));
          animation: tooltipFadeIn 0.15s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .sdg-float-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 7px;
          border-style: solid;
          border-color: var(--sdg-c, #ffffff) transparent transparent transparent;
        }
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translate(-50%, -115%) scale(0.9); }
          to { opacity: 1; transform: translate(-50%, -125%) scale(1); }
        }
        @keyframes sdgCardIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes sdgGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes sdgDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes sdgPop {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: none; }
        }
        @media (max-width: 1100px) {
          .sdg-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 560px) {
          .sdg-kpi-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .sdg-kpi-big b {
            font-size: 36px;
          }
        }
      `}</style>

      <div className="sdg-kpi-wrap">
        <div className="sdg-kpi-grid" role="list">
          {/* ========================================================================= */}
          {/* Card 1: โครงการทั้งหมด + เส้นแนวโน้ม */}
          {/* ========================================================================= */}
          <section className="sdg-kpi-card" role="listitem" style={{ ['--ac' as any]: '#6366f1' }}>
            <p className="sdg-kpi-lbl">
              โครงการที่เชื่อมโยงกับ SDGs · ปี {curYear}
            </p>
            <div className="sdg-kpi-big">
              <b>{animatedCurCount}</b>
              <span>โครงการ</span>
              {chipEl}
            </div>

            {/* SVG Trendline (Full-width compact matching Card 3) */}
            <svg viewBox="0 0 240 48" className="sdg-trend-svg" role="img" aria-label="แนวโน้มจำนวนโครงการรายปี">
              <defs>
                <linearGradient id="sdg-ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#6366f1" stopOpacity="0.32" />
                  <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>

              {pts.length > 1 && (
                <path
                  d={`M ${pts.map((p) => p.join(',')).join(' L ')} L ${pts[pts.length - 1][0]},${baseY} L ${pts[0][0]},${baseY} Z`}
                  fill="url(#sdg-ga)"
                />
              )}

              {/* Dashed lines for missing historical points */}
              {years.map((y, i) => {
                if (i === 0) return null;
                const prevVal = totals[years[i - 1]];
                const curVal = totals[y];
                if ((prevVal === null || prevVal === undefined) && curVal !== null && curVal !== undefined) {
                  return (
                    <line
                      key={`dash-${y}`}
                      x1={X[i - 1]}
                      y1={baseY}
                      x2={X[i]}
                      y2={Y(curVal)}
                      stroke="var(--hatch)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  );
                }
                if ((prevVal === null || prevVal === undefined) && (curVal === null || curVal === undefined)) {
                  return (
                    <line
                      key={`dash-base-${y}`}
                      x1={X[i - 1]}
                      y1={baseY}
                      x2={X[i]}
                      y2={baseY}
                      stroke="var(--hatch)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  );
                }
                return null;
              })}

              {pts.length > 1 && (
                <polyline
                  className="sdg-line"
                  pathLength={1}
                  points={pts.map((p) => p.join(',')).join(' ')}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {years.map((y, i) => {
                const v = totals[y];
                const x = X[i] || 24 + i * 100;
                const isCurrent = y === curYear;
                if (v === null || v === undefined) {
                  return (
                    <g key={y}>
                      <circle cx={x} cy={baseY} r={3.5} fill="var(--card)" stroke="var(--hatch)" strokeWidth="1.75" />
                      <text className="nodata" x={x} y={23} textAnchor="middle">ไม่มีข้อมูล</text>
                      <text className={isCurrent ? 'cur-year' : ''} x={x} y={46} textAnchor="middle">{y}</text>
                    </g>
                  );
                }
                const yPos = Y(v);
                return (
                  <g key={y}>
                    <circle
                      cx={x}
                      cy={yPos}
                      r={isCurrent ? 4.5 : 3.5}
                      fill={isCurrent ? '#6366f1' : 'var(--card)'}
                      stroke="#6366f1"
                      strokeWidth="2"
                    />
                    <text className="v" x={x} y={yPos - 5} textAnchor="middle">
                      {v}
                    </text>
                    <text className={isCurrent ? 'cur-year' : ''} x={x} y={46} textAnchor="middle">
                      {y}
                    </text>
                  </g>
                );
              })}
            </svg>
          </section>

          {/* ========================================================================= */}
          {/* Card 2: SDG สูงสุด (เอาไว้ดูเฉย ๆ ไม่สามารถกดได้, เลขจางอยู่ขวาบน) */}
          {/* ========================================================================= */}
          <section
            className="sdg-kpi-card"
            role="listitem"
            style={{ ['--ac' as any]: topDef.color }}
          >
            <div className="sdg-kpi-wm-topright" aria-hidden="true">
              {topSdgNum}
            </div>
            <p className="sdg-kpi-lbl">
              SDG ที่มีจำนวนโครงการสูงสุด
            </p>
            <div className="sdg-box">
              <div
                className="sdg-badge-sq"
                style={{
                  background: topDef.color,
                  color: inkColor(topDef.color),
                }}
              >
                <small>SDG</small>
                <b>{topSdgNum}</b>
              </div>
              <div className="sdg-name">{topDef.nameTh}</div>
            </div>
            <div className="sdg-kpi-big">
              <b>{animatedTopCount}</b>
              <span>โครงการ</span>
            </div>
            <div className="sdg-share-row">
              <div className="sdg-track">
                <i style={{ width: `${topSharePct}%` }} />
              </div>
              <b>{topSharePct}%</b>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* Card 3: SDG เติบโตสูงสุด (เอาไว้ดูเฉย ๆ ไม่สามารถกดได้, เลขจางอยู่ขวาบน) */}
          {/* ========================================================================= */}
          <section
            className="sdg-kpi-card"
            role="listitem"
            style={{ ['--ac' as any]: growDef.color }}
          >
            <div className="sdg-kpi-wm-topright" aria-hidden="true">
              {growSdgNum}
            </div>
            <p className="sdg-kpi-lbl">
              SDG ที่เติบโตสูงสุดเทียบปี {prevYear}
            </p>
            <div className="sdg-box">
              <div
                className="sdg-badge-sq"
                style={{
                  background: growDef.color,
                  color: inkColor(growDef.color),
                }}
              >
                <small>SDG</small>
                <b>{growSdgNum}</b>
              </div>
              <div className="sdg-name">{growDef.nameTh}</div>
            </div>
            <div className="sdg-kpi-big">
              <b>+{animatedGrowPct}%</b>
              <span className="chip up">▲ เติบโต</span>
            </div>
            <div className="sdg-cmp">
              <div>
                <em style={{ fontStyle: 'normal' }}>{prevYear}</em>
                <span className="t">
                  <i style={{ width: `${(growFrom / growMax) * 100}%` }} />
                </span>
                <b>{growFrom}</b>
              </div>
              <div>
                <em style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 600 }}>{curYear}</em>
                <span className="t">
                  <i className="n" style={{ width: `${(growTo / growMax) * 100}%` }} />
                </span>
                <b>{growTo}</b>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* Card 4: วงล้อ SDG 17 ช่อง (Tooltip สไตล์ภาพที่ 2 & 3, ตัดส่วนล่างออก) */}
          {/* ========================================================================= */}
          <section className="sdg-kpi-card wheel-card" role="listitem" style={{ ['--ac' as any]: '#16a34a' }}>
            <p className="sdg-kpi-lbl">
              ความครอบคลุมเป้าหมาย SDGs
            </p>
            <div className="ringwrap">
              <svg viewBox="0 0 180 180" className="sdg-ring-svg" role="img" aria-label="วงล้อความครอบคลุม SDGs">
                {segments.map((seg) => (
                  <path
                    key={seg.i}
                    className="sdg-seg"
                    style={{ animationDelay: `${seg.i * 0.03 + 0.15}s` }}
                    d={seg.d}
                    fill="none"
                    stroke={seg.isCovered ? seg.color : 'var(--off)'}
                    opacity={seg.isCovered ? 1 : 0.5}
                    strokeWidth={SW}
                    strokeLinecap="butt"
                    onMouseEnter={(e) => {
                      setHoveredSdg({
                        number: seg.i,
                        nameTh: seg.name,
                        color: seg.color,
                        isCovered: seg.isCovered,
                      });
                      const rect = e.currentTarget.closest('.ringwrap')?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.closest('.ringwrap')?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredSdg(null);
                      setTooltipPos(null);
                    }}
                    onClick={() => onSelectSdg && onSelectSdg(seg.i)}
                  />
                ))}
              </svg>

              {/* Floating Tooltip with SdgIcon (size 86) matching Image 3 */}
              {hoveredSdg && tooltipPos && (
                <div
                  className="sdg-float-tooltip"
                  style={{
                    left: `${tooltipPos.x}px`,
                    top: `${tooltipPos.y}px`,
                    ['--sdg-c' as any]: hoveredSdg.color,
                  }}
                >
                  <div
                    className="w-[86px] h-[86px] rounded-2xl overflow-hidden flex items-center justify-center shadow-xl ring-2 ring-white/90 dark:ring-slate-700 bg-white"
                    style={{ backgroundColor: hoveredSdg.color }}
                  >
                    <SdgIcon n={hoveredSdg.number} size={86} />
                  </div>
                </div>
              )}

              <div className="ring-mid">
                <div className="ring-row">
                  <span className="ring-count">{animatedCoveredCount}</span>
                  <span className="ring-slash-denom">/ 17</span>
                </div>
                <span className="ring-label">เป้าหมาย</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default SdgSummaryKpiDeck;
