'use client';

import React, { useState, useEffect } from 'react';
import { SdgAggregationResult } from '@/lib/sdgAggregationService';

export const SDG_INFO: Record<number, { nameTh: string; color: string }> = {
  1: { nameTh: 'ขจัดความยากจน', color: '#E5243B' },
  2: { nameTh: 'ขจัดความหิวโหย', color: '#DDA63A' },
  3: { nameTh: 'สุขภาพและความเป็นอยู่ที่ดี', color: '#4C9F38' },
  4: { nameTh: 'การศึกษาที่มีคุณภาพ', color: '#C5192D' },
  5: { nameTh: 'ความเท่าเทียมทางเพศ', color: '#FF3A21' },
  6: { nameTh: 'น้ำสะอาดและสุขาภิบาล', color: '#26BDE2' },
  7: { nameTh: 'พลังงานสะอาดที่ทุกคนเข้าถึงได้', color: '#FCC30B' },
  8: { nameTh: 'งานที่มีคุณค่าและเศรษฐกิจเติบโต', color: '#A21942' },
  9: { nameTh: 'อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน', color: '#FD6925' },
  10: { nameTh: 'ลดความเหลื่อมล้ำ', color: '#DD1367' },
  11: { nameTh: 'เมืองและชุมชนที่ยั่งยืน', color: '#FD9D24' },
  12: { nameTh: 'การบริโภคและการผลิตที่รับผิดชอบ', color: '#BF8B2E' },
  13: { nameTh: 'การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ', color: '#3F7E44' },
  14: { nameTh: 'ทรัพยากรทางทะเล', color: '#0A97D9' },
  15: { nameTh: 'ระบบนิเวศบนบก', color: '#56C02B' },
  16: { nameTh: 'สันติภาพ ยุติธรรม และสถาบันเข้มแข็ง', color: '#00689D' },
  17: { nameTh: 'หุ้นส่วนเพื่อการพัฒนา', color: '#19486A' },
};

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

  // Yearly totals for SVG line
  const totals = data.kpis.yearlyTotals || {
    [curYear - 2]: null,
    [prevYear]: data.kpis.distinctProjectsCount,
    [curYear]: data.kpis.distinctProjectsCount,
  };

  const prevCount = totals[prevYear] !== undefined && totals[prevYear] !== null ? totals[prevYear] : null;

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
  const years = Object.keys(totals).map(Number).sort((a, b) => a - b);
  const maxVal = Math.max(...years.map((y) => totals[y] || 0), 1);
  const X = [26, 120, 214];
  const Y = (v: number) => 52 - (v / maxVal) * 38;

  const pts: Array<[number, number]> = [];
  years.forEach((y, i) => {
    const v = totals[y];
    if (v !== null && v !== undefined) pts.push([X[i] || 26 + i * 94, Y(v)]);
  });

  // Top SDG
  const topSdgNum = data.kpis.topSdgNumber || 9;
  const topSdgCount = data.kpis.topSdgCount || 0;
  const animatedTopCount = useAnimatedNumber(topSdgCount);
  const topInfo = SDG_INFO[topSdgNum] || { nameTh: data.kpis.topSdgNameTh, color: '#FD6925' };
  const topSharePct = curCount > 0 ? Math.round((topSdgCount / curCount) * 100) : 0;

  // Growth SDG
  const growSdgNum = data.kpis.highestGrowingSdgNumber || 11;
  const growInfo = SDG_INFO[growSdgNum] || { nameTh: data.kpis.highestGrowingSdgNameTh, color: '#FD9D24' };
  const growFrom = data.kpis.highestGrowingFrom ?? 2;
  const growTo = data.kpis.highestGrowingTo ?? 3;
  const growMax = Math.max(growFrom, growTo, 1);
  const growPct = data.kpis.highestGrowingPercent ?? (growFrom > 0 ? Math.round(((growTo - growFrom) / growFrom) * 100) : 0);
  const animatedGrowPct = useAnimatedNumber(Math.abs(growPct));

  // Covered SDGs (Card 4)
  const coveredSet = new Set(data.kpis.coveredSdgNumbers || data.tiles.filter((t) => t.currentCount > 0).map((t) => t.sdgNumber));
  const coveredCount = coveredSet.size;
  const animatedCoveredCount = useAnimatedNumber(coveredCount);

  // 17-segment circle math
  const C = 90;
  const R = 70;
  const SW = 20;
  const gap = 0.07;
  const n = 17;
  const step = (Math.PI * 2) / n;

  const segments: Array<{ i: number; isCovered: boolean; d: string; color: string; name: string }> = [];
  const missingList: number[] = [];

  for (let i = 1; i <= n; i++) {
    const isCovered = coveredSet.has(i);
    const a0 = -Math.PI / 2 + step * (i - 1) + gap / 2;
    const a1 = -Math.PI / 2 + step * i - gap / 2;
    const p0 = [C + R * Math.cos(a0), C + R * Math.sin(a0)];
    const p1 = [C + R * Math.cos(a1), C + R * Math.sin(a1)];
    const dPath = `M ${p0[0]} ${p0[1]} A ${R} ${R} 0 0 1 ${p1[0]} ${p1[1]}`;
    const info = SDG_INFO[i] || { nameTh: `SDG ${i}`, color: '#00A651' };

    if (!isCovered) {
      missingList.push(i);
    }

    segments.push({
      i,
      isCovered,
      d: dPath,
      color: info.color,
      name: info.nameTh,
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
          gap: 16px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .sdg-kpi-card {
          position: relative;
          isolation: isolate;
          border: 1px solid var(--line);
          border-radius: 26px;
          padding: 20px 22px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;
          overflow: hidden;
          background: radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--ac) var(--tint), var(--card)) 0%, var(--card) 62%);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 22px 40px -26px color-mix(in srgb, var(--ac) 55%, transparent);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: sdgCardIn 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .sdg-kpi-card:nth-child(2) { animation-delay: 0.07s; }
        .sdg-kpi-card:nth-child(3) { animation-delay: 0.14s; }
        .sdg-kpi-card:nth-child(4) { animation-delay: 0.21s; }
        .sdg-kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 30px 48px -24px color-mix(in srgb, var(--ac) 70%, transparent);
        }
        .sdg-kpi-card::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 5px;
          background: linear-gradient(90deg, var(--ac), color-mix(in srgb, var(--ac) 45%, #fff));
        }
        .sdg-kpi-wm {
          position: absolute;
          right: -8px;
          bottom: -34px;
          z-index: -1;
          font-size: 150px;
          font-weight: 800;
          line-height: 1;
          color: var(--ac);
          opacity: 0.1;
          letter-spacing: -0.04em;
          pointer-events: none;
          user-select: none;
        }
        .sdg-kpi-lbl {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: var(--muted);
          line-height: 1.35;
          min-height: 35px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .sdg-kpi-lbl i {
          flex: none;
          width: 8px;
          height: 8px;
          margin-top: 5px;
          border-radius: 50%;
          background: var(--ac);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--ac) 22%, transparent);
        }
        .sdg-kpi-big {
          display: flex;
          align-items: baseline;
          gap: 8px;
          line-height: 1;
        }
        .sdg-kpi-big b {
          font-size: 46px;
          font-weight: 800;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
          background: linear-gradient(135deg, var(--ink) 30%, var(--ac));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .sdg-kpi-big span {
          font-size: 14px;
          color: var(--muted);
          font-weight: 500;
        }
        .sdg-kpi-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px 10px;
          font-size: 13px;
          color: var(--muted);
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12.5px;
          font-weight: 700;
          line-height: 1;
          padding: 6px 11px;
          border-radius: 999px;
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
          gap: 12px;
        }
        .sdg-badge-sq {
          flex: none;
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
          font-weight: 700;
          box-shadow: 0 10px 18px -8px var(--ac), inset 0 -3px 0 rgba(0, 0, 0, 0.12);
        }
        .sdg-badge-sq small {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          opacity: 0.9;
          margin-bottom: 2px;
        }
        .sdg-badge-sq b {
          font-size: 26px;
        }
        .sdg-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1.3;
          color: var(--ink);
        }
        .sdg-share-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sdg-track {
          flex: 1;
          height: 10px;
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
          font-size: 14px;
          font-variant-numeric: tabular-nums;
          color: var(--ink);
        }
        .sdg-foot {
          margin-top: auto;
          font-size: 12.5px;
          color: var(--muted);
          line-height: 1.5;
        }
        .sdg-foot b {
          color: var(--ink);
          font-weight: 600;
        }
        .sdg-svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .sdg-svg text {
          font-family: inherit;
          fill: var(--muted);
          font-size: 11px;
        }
        .sdg-svg text.v {
          fill: var(--ink);
          font-weight: 700;
        }
        .sdg-line {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: sdgDraw 1s 0.35s ease-out forwards;
        }
        .sdg-cmp {
          display: grid;
          gap: 8px;
        }
        .sdg-cmp div {
          display: grid;
          grid-template-columns: 44px 1fr 26px;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
        }
        .sdg-cmp .t {
          height: 14px;
          border-radius: 7px;
          background: var(--soft);
          overflow: hidden;
        }
        .sdg-cmp .t i {
          display: block;
          height: 100%;
          border-radius: 7px;
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
          width: min(168px, 100%);
          margin: 0 auto;
        }
        .ringwrap .mid {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .ringwrap .mid b {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .ringwrap .mid span {
          font-size: 12px;
          color: var(--muted);
          margin-top: 4px;
          font-weight: 500;
        }
        .sdg-seg {
          animation: sdgPop 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
          transform-box: fill-box;
          transform-origin: center;
          cursor: pointer;
          transition: filter 0.2s ease, stroke-width 0.2s ease;
        }
        .sdg-seg:hover {
          filter: brightness(1.12) drop-shadow(0 2px 5px rgba(0, 0, 0, 0.25));
          stroke-width: 22px;
        }
        .sdg-miss {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 6px;
        }
        .sdg-miss i {
          font-style: normal;
          font-size: 11px;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
          padding: 3px 6px;
          border-radius: 7px;
          background: var(--off);
          color: var(--muted);
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .sdg-miss i:hover {
          background: #cbd5e1;
          color: #0f172a;
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
            font-size: 40px;
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
              <i />
              โครงการที่เชื่อมโยงกับ SDGs · ปี {curYear}
            </p>
            <div className="sdg-kpi-big">
              <b>{animatedCurCount}</b>
              <span>โครงการ</span>
            </div>
            <div className="sdg-kpi-row">
              {chipEl}
              {prevCount !== null ? (
                <span>จาก {prevCount} โครงการ ในปี {prevYear}</span>
              ) : (
                <span>เปรียบเทียบย้อนหลัง 3 ปี</span>
              )}
            </div>

            {/* SVG Trendline */}
            <svg viewBox="0 0 240 84" className="sdg-svg" role="img" aria-label="แนวโน้มจำนวนโครงการรายปี">
              <defs>
                <linearGradient id="sdg-ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>

              {pts.length > 1 && (
                <path
                  d={`M ${pts.map((p) => p.join(',')).join(' L ')} L ${pts[pts.length - 1][0]},60 L ${pts[0][0]},60 Z`}
                  fill="url(#sdg-ga)"
                />
              )}

              {totals[years[0]] == null && pts.length > 0 && (
                <line
                  x1={X[0]}
                  y1={60}
                  x2={pts[0][0]}
                  y2={pts[0][1]}
                  stroke="var(--hatch)"
                  strokeWidth="2"
                  strokeDasharray="3 4"
                />
              )}

              {pts.length > 1 && (
                <polyline
                  className="sdg-line"
                  pathLength={1}
                  points={pts.map((p) => p.join(',')).join(' ')}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {years.map((y, i) => {
                const v = totals[y];
                const x = X[i] || 26 + i * 94;
                if (v === null || v === undefined) {
                  return (
                    <g key={y}>
                      <circle cx={x} cy={60} r={5} fill="var(--card)" stroke="var(--hatch)" strokeWidth="2" />
                      <text x={x} y={48} textAnchor="middle">ไม่มีข้อมูล</text>
                      <text x={x} y={78} textAnchor="middle">{y}</text>
                    </g>
                  );
                }
                const yPos = Y(v);
                const isCurrent = y === curYear;
                return (
                  <g key={y}>
                    <circle
                      cx={x}
                      cy={yPos}
                      r={isCurrent ? 6 : 4.5}
                      fill={isCurrent ? '#6366f1' : 'var(--card)'}
                      stroke="#6366f1"
                      strokeWidth="2.5"
                    />
                    <text className="v" x={x} y={yPos - 12} textAnchor="middle">
                      {v}
                    </text>
                    <text x={x} y={78} textAnchor="middle">
                      {y}
                    </text>
                  </g>
                );
              })}
            </svg>
          </section>

          {/* ========================================================================= */}
          {/* Card 2: SDG สูงสุด */}
          {/* ========================================================================= */}
          <section
            className="sdg-kpi-card cursor-pointer"
            role="listitem"
            style={{ ['--ac' as any]: topInfo.color }}
            onClick={() => onSelectSdg && onSelectSdg(topSdgNum)}
            title={`คลิกเพื่อกรอง SDG ${topSdgNum}`}
          >
            <div className="sdg-kpi-wm" aria-hidden="true">
              {topSdgNum}
            </div>
            <p className="sdg-kpi-lbl">
              <i />
              SDG ที่มีจำนวนโครงการสูงสุด
            </p>
            <div className="sdg-box">
              <div
                className="sdg-badge-sq"
                style={{
                  background: topInfo.color,
                  color: inkColor(topInfo.color),
                }}
              >
                <small>SDG</small>
                <b>{topSdgNum}</b>
              </div>
              <div className="sdg-name">{topInfo.nameTh}</div>
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
            <div className="sdg-foot">ของโครงการทั้งหมด · 1 โครงการอาจเชื่อมได้หลาย SDG</div>
          </section>

          {/* ========================================================================= */}
          {/* Card 3: SDG เติบโตสูงสุด */}
          {/* ========================================================================= */}
          <section
            className="sdg-kpi-card cursor-pointer"
            role="listitem"
            style={{ ['--ac' as any]: growInfo.color }}
            onClick={() => onSelectSdg && onSelectSdg(growSdgNum)}
            title={`คลิกเพื่อกรอง SDG ${growSdgNum}`}
          >
            <div className="sdg-kpi-wm" aria-hidden="true">
              {growSdgNum}
            </div>
            <p className="sdg-kpi-lbl">
              <i />
              SDG ที่เติบโตสูงสุดเทียบปี {prevYear}
            </p>
            <div className="sdg-box">
              <div
                className="sdg-badge-sq"
                style={{
                  background: growInfo.color,
                  color: inkColor(growInfo.color),
                }}
              >
                <small>SDG</small>
                <b>{growSdgNum}</b>
              </div>
              <div className="sdg-name">{growInfo.nameTh}</div>
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
            <div className="sdg-foot">จำนวนโครงการ · เฉพาะ SDG ที่มีโครงการในปีก่อนหน้า</div>
          </section>

          {/* ========================================================================= */}
          {/* Card 4: วงล้อ SDG 17 ช่อง */}
          {/* ========================================================================= */}
          <section className="sdg-kpi-card" role="listitem" style={{ ['--ac' as any]: '#16a34a' }}>
            <p className="sdg-kpi-lbl">
              <i />
              ความครอบคลุมเป้าหมาย SDGs
            </p>
            <div className="ringwrap">
              <svg viewBox="0 0 180 180" className="sdg-svg" role="img" aria-label="วงล้อความครอบคลุม SDGs">
                {segments.map((seg) => (
                  <path
                    key={seg.i}
                    className="sdg-seg"
                    style={{ animationDelay: `${seg.i * 0.04 + 0.2}s` }}
                    d={seg.d}
                    fill="none"
                    stroke={seg.isCovered ? seg.color : 'var(--off)'}
                    strokeWidth={SW}
                    strokeLinecap="butt"
                    onClick={() => onSelectSdg && onSelectSdg(seg.i)}
                  >
                    <title>
                      {`SDG ${seg.i} · ${seg.name}${seg.isCovered ? '' : ' (ยังไม่มีโครงการ)'}`}
                    </title>
                  </path>
                ))}
              </svg>
              <div className="mid">
                <b>
                  <span>{animatedCoveredCount}</span>
                  <small style={{ fontSize: '18px', color: 'var(--muted)' }}> / 17</small>
                </b>
                <span>เป้าหมาย</span>
              </div>
            </div>
            <div className="sdg-foot">
              <b>ยังไม่มีโครงการ {missingList.length} เป้าหมาย</b>
              <div className="sdg-miss">
                {missingList.map((missNum) => (
                  <i
                    key={missNum}
                    title={SDG_INFO[missNum]?.nameTh || `SDG ${missNum}`}
                    onClick={() => onSelectSdg && onSelectSdg(missNum)}
                  >
                    {missNum}
                  </i>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default SdgSummaryKpiDeck;
