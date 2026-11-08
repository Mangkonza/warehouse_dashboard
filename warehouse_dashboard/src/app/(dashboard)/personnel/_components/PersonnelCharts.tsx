'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import '../../research/_components/research-redesign.css';
import { PersonnelWorkMetric, DepartmentPersonnelStat } from '../_hooks/usePersonnelData';
import { getDepartment } from '@/lib/departments';
import { DrillDownProjectDrawer } from '@/components/ui';

export type PersonnelPerspective = 'overview' | 'department' | 'table';

interface PersonnelChartsProps {
  metrics: PersonnelWorkMetric[];
  departmentStats: DepartmentPersonnelStat[];
  onSelectPerson?: (id: number) => void;
  activePerspective?: PersonnelPerspective;
}

const UCOL: Record<string, string> = {
  AE: '#65B98A',
  CPE: '#5B9BD5',
  IRRE: '#4FA9A0',
  FE: '#E88762',
  IE: '#9B78D0',
  ME: '#777ED0',
  CE: '#D96B8A',
  EEEC: '#91B95B',
  TDWCB: '#D5A04F',
  NAMC: '#BB68BC',
  OFS: '#E9A88F',
  OTH: '#64748b',
};

const UFULL: Record<string, string> = {
  AE: 'ภาควิชาวิศวกรรมเกษตร',
  CPE: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
  IRRE: 'ภาควิชาวิศวกรรมชลประทาน',
  FE: 'ภาควิชาวิศวกรรมอาหาร',
  IE: 'ภาควิชาวิศวกรรมอุตสาหการ',
  ME: 'ภาควิชาวิศวกรรมเครื่องกล',
  CE: 'ภาควิชาวิศวกรรมโยธา',
  EEEC: 'ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม',
  TDWCB: 'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร',
  NAMC: 'ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ',
  OFS: 'สำนักงานเลขานุการ',
  OTH: 'อื่น ๆ / ไม่ระบุ',
};

function resolvePersonnelDeptCode(rawDept: unknown): string {
  const str = String(rawDept || '').trim().toUpperCase();
  if (!str) return 'OTH';
  if (str === 'IRE' || str === 'IRRE' || str.includes('ชลประทาน') || str.includes('ทรัพยากรน้ำ')) return 'IRRE';
  if (str === 'FE' || str.includes('อาหาร')) return 'FE';
  if (str === 'IE' || str.includes('อุตสาหการ')) return 'IE';
  if (str === 'ME' || (str.includes('เครื่องกล') && !str.includes('เกษตร'))) return 'ME';
  if (str === 'CE' || str.includes('โยธา')) return 'CE';
  if (str === 'CPE' || str.includes('คอมพิวเตอร์')) return 'CPE';
  if (str === 'AE' || str.includes('วิศวกรรมเกษตร')) return 'AE';
  if (str === 'EEEC' || str.includes('พลังงาน') || str.includes('สิ่งแวดล้อม') || str.includes('ไฟฟ้า')) return 'EEEC';
  if (str === 'TDWCB' || str === 'DWT' || str.includes('กระจก') || str.includes('ประตู')) return 'TDWCB';
  if (str === 'NAMC' || str.includes('ศูนย์เครื่องจักรกล')) return 'NAMC';
  if (str === 'OFS' || str.includes('เลขานุการ') || str.includes('สำนักงาน')) return 'OFS';
  const d = getDepartment(String(rawDept));
  if (d && d.code !== '-' && UCOL[d.code]) return d.code;
  return 'OTH';
}

const MISSION_META = [
  { key: 'research' as const, label: 'โครงการวิจัย', short: 'วิจัย', color: '#10b981' },
  { key: 'academic' as const, label: 'โครงการพัฒนาวิชาการ', short: 'พัฒนาวิชาการ', color: '#0ea5e9' },
  { key: 'publications' as const, label: 'ผลงานตีพิมพ์ทางวิชาการ', short: 'ตีพิมพ์', color: '#e11d48' },
  { key: 'ip' as const, label: 'งานทรัพย์สินทางปัญญา', short: 'ทรัพย์สินฯ', color: '#8b5cf6' },
  { key: 'service' as const, label: 'งานบริการวิชาการ', short: 'บริการวิชาการ', color: '#f59e0b' },
];

export function PersonnelCharts({
  metrics,
  departmentStats,
}: PersonnelChartsProps) {
  // Chart 1 Controls: 10 อันดับอาจารย์ที่มีผลงานสูงสุด
  const [rankMetric, setRankMetric] = useState<'total' | 'research' | 'academic' | 'publications' | 'service' | 'ip'>('total');
  const [topBarMode, setTopBarMode] = useState<'group' | 'stack'>('stack');
  const [activeTopIdx, setActiveTopIdx] = useState<number | null>(null);
  const [activeTopSeg, setActiveTopSeg] = useState<string | null>(null);

  // Chart 2 Controls: จำนวนผลงานรวมจำแนกตามสังกัด
  const [deptBarMode, setDeptBarMode] = useState<'group' | 'stack'>('stack');
  const [deptMetric, setDeptMetric] = useState<'works' | 'active' | 'budget'>('works');
  const [activeDeptIdx, setActiveDeptIdx] = useState<number | null>(null);
  const [activeDeptSeg, setActiveDeptSeg] = useState<string | null>(null);

  // Chart 3 Controls: สัดส่วนผลงานตาม 5 พันธกิจหลัก (สามารถปรับเป็นเปอร์เซ็นและจำนวนนับได้)
  const [missionDisplayMode, setMissionDisplayMode] = useState<'count' | 'pct'>('count');

  // Floating Tooltip State
  const [tip, setTip] = useState<{ show: boolean; x: number; y: number; content: React.ReactNode }>({
    show: false,
    x: 0,
    y: 0,
    content: null,
  });

  // Slide-over Drawer State
  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    categoryKey?: any;
    items: any[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#00A651',
    items: [],
  });

  const showTooltip = (e: React.MouseEvent | React.PointerEvent, content: React.ReactNode) => {
    setTip({
      show: true,
      x: e.clientX,
      y: e.clientY - 12,
      content,
    });
  };

  // Responsive Plot Widths
  const topScrollerRef = useRef<HTMLDivElement>(null);
  const deptScrollerRef = useRef<HTMLDivElement>(null);
  const [topPlotWidth, setTopPlotWidth] = useState<number>(1060);
  const [deptPlotWidth, setDeptPlotWidth] = useState<number>(1060);

  useEffect(() => {
    const updateWidths = () => {
      if (topScrollerRef.current) setTopPlotWidth(Math.max(820, topScrollerRef.current.clientWidth));
      if (deptScrollerRef.current) setDeptPlotWidth(Math.max(760, deptScrollerRef.current.clientWidth));
    };
    updateWidths();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidths) : null;
    if (ro) {
      if (topScrollerRef.current) ro.observe(topScrollerRef.current);
      if (deptScrollerRef.current) ro.observe(deptScrollerRef.current);
    }
    window.addEventListener('resize', updateWidths);
    return () => {
      window.removeEventListener('resize', updateWidths);
      ro?.disconnect();
    };
  }, []);

  // Helper to get unique works for a person
  const getPersonWorks = (m: PersonnelWorkMetric, filterCat?: 'research' | 'academic' | 'publications' | 'service' | 'ip') => {
    const allWorks = [
      ...(filterCat && filterCat !== 'research' ? [] : m.researchItems.map((it) => ({ ...it, _category: 'research' }))),
      ...(filterCat && filterCat !== 'academic' ? [] : m.academicItems.map((it) => ({ ...it, _category: 'academic' }))),
      ...(filterCat && filterCat !== 'publications' ? [] : m.pubItems.map((it) => ({ ...it, _category: 'publications' }))),
      ...(filterCat && filterCat !== 'ip' ? [] : m.ipItems.map((it) => ({ ...it, _category: 'ip' }))),
      ...(filterCat && filterCat !== 'service' ? [] : m.serviceItems.map((it) => ({ ...it, _category: 'service' }))),
    ];
    const seen = new Set<string>();
    return allWorks.filter((it) => {
      const k = `${it._category}_${it._id || it.id || it.name || it.title || ''}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };

  // 1. Top 10 Faculty List
  const top10Faculty = useMemo(() => {
    return [...metrics]
      .filter((m) => (rankMetric === 'total' ? m.counts.total > 0 : m.counts[rankMetric] > 0))
      .sort((a, b) => {
        if (rankMetric === 'total') return b.counts.total - a.counts.total || b.budgets.total - a.budgets.total;
        return b.counts[rankMetric] - a.counts[rankMetric] || b.counts.total - a.counts.total;
      })
      .slice(0, 10);
  }, [metrics, rankMetric]);

  // 2. Department Aggregated Metrics (using official UCOL colors)
  const deptAggregated = useMemo(() => {
    const map: Record<
      string,
      {
        code: string;
        name: string;
        totalCount: number;
        activeCount: number;
        totalWorks: number;
        totalBudget: number;
        totalBudgetM: number;
        counts: Record<'research' | 'academic' | 'publications' | 'ip' | 'service', number>;
        itemsByCat: Record<'research' | 'academic' | 'publications' | 'ip' | 'service', any[]>;
        allItems: any[];
      }
    > = {};

    const baseCodes = ['IRRE', 'CPE', 'FE', 'CE', 'ME', 'AE', 'IE', 'EEEC', 'TDWCB'];
    baseCodes.forEach((c) => {
      map[c] = {
        code: c,
        name: UFULL[c] || c,
        totalCount: 0,
        activeCount: 0,
        totalWorks: 0,
        totalBudget: 0,
        totalBudgetM: 0,
        counts: { research: 0, academic: 0, publications: 0, ip: 0, service: 0 },
        itemsByCat: { research: [], academic: [], publications: [], ip: [], service: [] },
        allItems: [],
      };
    });

    metrics.forEach((m) => {
      const code = resolvePersonnelDeptCode(m.department);
      if (!map[code]) {
        map[code] = {
          code,
          name: UFULL[code] || m.department || code,
          totalCount: 0,
          activeCount: 0,
          totalWorks: 0,
          totalBudget: 0,
          totalBudgetM: 0,
          counts: { research: 0, academic: 0, publications: 0, ip: 0, service: 0 },
          itemsByCat: { research: [], academic: [], publications: [], ip: [], service: [] },
          allItems: [],
        };
      }
      map[code].totalCount += 1;
      if (m.counts.total > 0) map[code].activeCount += 1;
      map[code].totalBudget += m.budgets.total || 0;

      const addUnique = (cat: 'research' | 'academic' | 'publications' | 'ip' | 'service', list: any[]) => {
        list.forEach((it) => {
          const itemWithCat = { ...it, _category: cat };
          const idKey = `${cat}_${it._id || it.id || it.name || it.title || ''}`;
          if (!map[code].allItems.some((ex) => `${ex._category}_${ex._id || ex.id || ex.name || ex.title || ''}` === idKey)) {
            map[code].allItems.push(itemWithCat);
            map[code].itemsByCat[cat].push(itemWithCat);
            map[code].counts[cat] += 1;
            map[code].totalWorks += 1;
          }
        });
      };

      addUnique('research', m.researchItems);
      addUnique('academic', m.academicItems);
      addUnique('publications', m.pubItems);
      addUnique('ip', m.ipItems);
      addUnique('service', m.serviceItems);
    });

    Object.values(map).forEach((d) => {
      d.totalBudgetM = Number((d.totalBudget / 1_000_000).toFixed(2));
    });

    return Object.values(map)
      .filter((d) => d.totalWorks > 0 || d.totalCount > 0 || ['IRRE', 'CPE', 'FE', 'CE', 'ME', 'AE', 'IE'].includes(d.code))
      .sort((a, b) => {
        if (deptMetric === 'active') return b.activeCount - a.activeCount || b.totalWorks - a.totalWorks;
        if (deptMetric === 'budget') return b.totalBudgetM - a.totalBudgetM || b.totalWorks - a.totalWorks;
        return b.totalWorks - a.totalWorks;
      });
  }, [metrics, deptMetric]);

  // 3. Mission Proportions (5 Missions)
  const missionStats = useMemo(() => {
    const dedupe = (items: any[], cat: string) => {
      const seen = new Set<string>();
      return items
        .filter((it) => {
          const k = String(it._id || it.id || it.name || it.title || '');
          if (!k || seen.has(k)) return false;
          seen.add(k);
          return true;
        })
        .map((it) => ({ ...it, _category: cat }));
    };

    const researchItems = dedupe(metrics.flatMap((m) => m.researchItems), 'research');
    const academicItems = dedupe(metrics.flatMap((m) => m.academicItems), 'academic');
    const pubItems = dedupe(metrics.flatMap((m) => m.pubItems), 'publications');
    const ipItems = dedupe(metrics.flatMap((m) => m.ipItems), 'ip');
    const serviceItems = dedupe(metrics.flatMap((m) => m.serviceItems), 'service');

    const buckets = [
      { ...MISSION_META[0], count: researchItems.length, items: researchItems },
      { ...MISSION_META[1], count: academicItems.length, items: academicItems },
      { ...MISSION_META[2], count: pubItems.length, items: pubItems },
      { ...MISSION_META[3], count: ipItems.length, items: ipItems },
      { ...MISSION_META[4], count: serviceItems.length, items: serviceItems },
    ];
    const total = buckets.reduce((s, b) => s + b.count, 0);
    return {
      total,
      buckets: buckets.map((b) => ({
        ...b,
        pct: total > 0 ? (b.count / total) * 100 : 0,
      })),
    };
  }, [metrics]);

  return (
    <div className="rr-container">
      <div className="rr-wrap">
        {/* CHART 1: 10 อันดับอาจารย์ที่มีผลงานสูงสุด */}
        <section className="rr-card rr-full" aria-labelledby="pers-t1">
          <div className="rr-head">
            <h2 className="rr-title-h2" id="pers-t1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M5 20V10M12 20V4M19 20v-7" />
              </svg>
              <span>10 อันดับอาจารย์ที่มีผลงานสูงสุด</span>
            </h2>
            <div className="rr-ctrls">
              <label className="rr-sel">
                <span>จัดอันดับตาม</span>
                <select value={rankMetric} onChange={(e) => setRankMetric(e.target.value as any)}>
                  <option value="total">ผลงานรวม 5 ด้าน</option>
                  <option value="research">โครงการวิจัย</option>
                  <option value="academic">โครงการพัฒนาวิชาการ</option>
                  <option value="publications">ผลงานตีพิมพ์ทางวิชาการ</option>
                  <option value="service">งานบริการวิชาการ</option>
                  <option value="ip">งานทรัพย์สินทางปัญญา</option>
                </select>
              </label>
              {rankMetric === 'total' && (
                <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                  <button type="button" aria-pressed={topBarMode === 'group'} onClick={() => setTopBarMode('group')}>
                    แยกแท่ง
                  </button>
                  <button type="button" aria-pressed={topBarMode === 'stack'} onClick={() => setTopBarMode('stack')}>
                    แท่งซ้อน
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="rr-legend">
            {MISSION_META.map((ms) => (
              <span
                key={ms.key}
                className="rr-pill st"
                style={{
                  '--c': ms.color,
                  opacity: rankMetric === 'total' || rankMetric === ms.key ? 1 : 0.35,
                  cursor: 'pointer',
                } as React.CSSProperties}
                onClick={() => setRankMetric(rankMetric === ms.key ? 'total' : ms.key)}
              >
                <i />
                {ms.label}
              </span>
            ))}
          </div>

          {(() => {
            const N = Math.max(top10Faculty.length, 1);
            let maxV = 0;
            top10Faculty.forEach((m) => {
              if (rankMetric !== 'total') {
                maxV = Math.max(maxV, m.counts[rankMetric]);
              } else if (topBarMode === 'group') {
                maxV = Math.max(maxV, m.counts.research, m.counts.academic, m.counts.publications, m.counts.ip, m.counts.service);
              } else {
                maxV = Math.max(maxV, m.counts.total);
              }
            });
            const step = Math.max(1, Math.ceil(maxV / 4));
            const top = Math.max(4, step * 4);
            const svgW = Math.max(topPlotWidth, N * 98);
            const svgH = 340;
            const L = 56;
            const R = 28;
            const Tp = 34;
            const B = 54;
            const pw = svgW - L - R;
            const ph = svgH - Tp - B;
            const slot = pw / N;
            const yPos = (v: number) => Tp + ph - (ph * v) / (top || 1);

            return (
              <div className="rr-scroller" ref={topScrollerRef}>
                <div
                  className="rr-plot"
                  style={{ minWidth: '820px', width: `${svgW}px` }}
                  onPointerLeave={() => {
                    setActiveTopIdx(null);
                    setActiveTopSeg(null);
                    setTip((t) => ({ ...t, show: false }));
                  }}
                >
                  <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}>
                    {Array.from({ length: 5 }).map((_, i) => {
                      const v = i * step;
                      const y = yPos(v);
                      return (
                        <g key={i}>
                          <line x1={L} x2={svgW - R} y1={y} y2={y} stroke="#e8edf3" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '3 5'} />
                          <text x={L - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="500" fill="var(--muted)">
                            {v}
                          </text>
                        </g>
                      );
                    })}

                    <text transform={`translate(16, ${Tp + ph / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted)">
                      จำนวนผลงาน (รายการ)
                    </text>

                    {top10Faculty.map((m, i) => {
                      const x0 = L + slot * i;
                      const cx = x0 + slot / 2;
                      const deptCode = resolvePersonnelDeptCode(m.department);
                      const deptCol = UCOL[deptCode] || UCOL.OTH;
                      const dispName = m.cleanName || m.name;
                      const shortName = dispName.length > 15 ? dispName.slice(0, 14) + '…' : dispName;

                      const activeMissions = MISSION_META.filter(
                        (ms) => (rankMetric === 'total' || rankMetric === ms.key) && m.counts[ms.key] > 0
                      );
                      const curTot = rankMetric === 'total' ? m.counts.total : m.counts[rankMetric];

                      let barsSvg: React.ReactNode = null;
                      if (rankMetric === 'total' && topBarMode === 'group') {
                        const bw = Math.min(14, (slot - 16) / Math.max(activeMissions.length, 1));
                        const gap = 3;
                        const totalW = activeMissions.length * bw + Math.max(0, activeMissions.length - 1) * gap;
                        const sx = cx - totalW / 2;
                        barsSvg = (
                          <>
                            {activeMissions.map((ms, idx) => {
                              const v = m.counts[ms.key];
                              const h = (ph * v) / (top || 1);
                              const bx = sx + idx * (bw + gap);
                              return (
                                <g key={ms.key}>
                                  <rect
                                    className="rr-rise"
                                    x={bx}
                                    y={Tp + ph - h}
                                    width={bw}
                                    height={h}
                                    rx={Math.min(5, h / 2)}
                                    fill={ms.color}
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const items = getPersonWorks(m, ms.key);
                                      setTip((t) => ({ ...t, show: false }));
                                      setDrillDown({
                                        isOpen: true,
                                        title: `${ms.label}: ${m.name}`,
                                        subtitle: `สังกัด ${deptCode} • รวม ${items.length} รายการ`,
                                        accentColor: ms.color,
                                        categoryKey: ms.key,
                                        items,
                                      });
                                    }}
                                    onPointerMove={(e) => {
                                      e.stopPropagation();
                                      setActiveTopIdx(i);
                                      setActiveTopSeg(ms.key);
                                      showTooltip(
                                        e,
                                        <div>
                                          <div className="rr-tt-h">
                                            <i style={{ backgroundColor: ms.color }} />
                                            <span>{ms.label} · {m.name}</span>
                                          </div>
                                          <div className="rr-tt-v">
                                            <b>{v}</b>
                                            <span>รายการ</span>
                                          </div>
                                          <div className="rr-tt-s">คลิกเพื่อดูรายการผลงาน</div>
                                        </div>
                                      );
                                    }}
                                  />
                                  <text x={bx + bw / 2} y={Tp + ph - h - 5} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">
                                    {v}
                                  </text>
                                </g>
                              );
                            })}
                          </>
                        );
                      } else {
                        const w2 = Math.min(54, slot * 0.46);
                        const gap = 2.5;
                        let cum = 0;
                        barsSvg = (
                          <>
                            {activeMissions.map((ms) => {
                              const v = m.counts[ms.key];
                              const y1 = yPos(cum + v);
                              const y0 = yPos(cum);
                              const h = Math.max(y0 - y1 - gap, 4);
                              const segY = y1 + gap / 2;
                              const isHovered = activeTopIdx === i && activeTopSeg === ms.key;
                              cum += v;
                              return (
                                <g key={ms.key}>
                                  <rect
                                    className="rr-rise"
                                    x={cx - w2 / 2}
                                    y={segY}
                                    width={w2}
                                    height={h}
                                    rx={Math.min(7, h / 2)}
                                    fill={ms.color}
                                    style={{
                                      cursor: 'pointer',
                                      filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                      opacity: activeTopSeg && !isHovered ? 0.6 : 1,
                                      transition: 'all 0.15s ease',
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const items = getPersonWorks(m, ms.key);
                                      setTip((t) => ({ ...t, show: false }));
                                      setDrillDown({
                                        isOpen: true,
                                        title: `${ms.label}: ${m.name}`,
                                        subtitle: `สังกัด ${deptCode} • รวม ${items.length} รายการ`,
                                        accentColor: ms.color,
                                        categoryKey: ms.key,
                                        items,
                                      });
                                    }}
                                    onPointerMove={(e) => {
                                      e.stopPropagation();
                                      setActiveTopIdx(i);
                                      setActiveTopSeg(ms.key);
                                      showTooltip(
                                        e,
                                        <div>
                                          <div className="rr-tt-h">
                                            <i style={{ backgroundColor: ms.color }} />
                                            <span>{ms.label} · {m.name}</span>
                                          </div>
                                          <div className="rr-tt-v">
                                            <b>{v}</b>
                                            <span>รายการ ({m.counts.total > 0 ? Math.round((v / m.counts.total) * 100) : 0}% ของผลงานอาจารย์ท่านนี้)</span>
                                          </div>
                                          <div className="rr-tt-s">คลิกเพื่อดูรายการผลงาน</div>
                                        </div>
                                      );
                                    }}
                                  />
                                  {h >= 15 && (
                                    <text x={cx} y={segY + h / 2 + 4.5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                      {v}
                                    </text>
                                  )}
                                </g>
                              );
                            })}
                            {curTot > 0 && (
                              <text x={cx} y={yPos(curTot) - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                {curTot}
                              </text>
                            )}
                          </>
                        );
                      }

                      return (
                        <g
                          key={m.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            const items = getPersonWorks(m, rankMetric === 'total' ? undefined : rankMetric);
                            setTip((t) => ({ ...t, show: false }));
                            setDrillDown({
                              isOpen: true,
                              title: `ผลงานสะสม: ${m.name}`,
                              subtitle: `สังกัด ${m.department} (${deptCode}) • รวม ${items.length} รายการ • งบโครงการรวม ${(m.budgets.total / 1_000_000).toFixed(2)} ล้านบาท`,
                              accentColor: deptCol,
                              items,
                            });
                          }}
                          onPointerMove={(e) => {
                            setActiveTopIdx(i);
                            showTooltip(
                              e,
                              <div>
                                <div className="rr-tt-h">
                                  <i style={{ backgroundColor: deptCol }} />
                                  <span>#{i + 1} {m.name}</span>
                                </div>
                                <div className="rr-tt-r">
                                  <span>สังกัด</span>
                                  <b>{deptCode}</b>
                                </div>
                                <div className="rr-tt-r">
                                  <span>ผลงานสะสมรวม 5 ด้าน</span>
                                  <b>{m.counts.total} รายการ</b>
                                </div>
                                <div className="rr-tt-r">
                                  <span>วิจัย / ตีพิมพ์ / บริการ</span>
                                  <b>{m.counts.research} / {m.counts.publications} / {m.counts.service}</b>
                                </div>
                                <div className="rr-tt-r">
                                  <span>พัฒนาวิชาการ / ทรัพย์สินฯ</span>
                                  <b>{m.counts.academic} / {m.counts.ip}</b>
                                </div>
                                <div className="rr-tt-r">
                                  <span>งบประมาณโครงการรวม</span>
                                  <b>{(m.budgets.total / 1_000_000).toFixed(2)} ล้านบาท</b>
                                </div>
                                <div className="rr-tt-s">คลิกเพื่อดูรายการผลงานทั้งหมด</div>
                              </div>
                            );
                          }}
                        >
                          <rect x={x0 + 4} y={Tp - 6} width={slot - 8} height={ph + 6} rx="12" fill="rgba(15, 23, 42, 0.05)" opacity={activeTopIdx === i ? 1 : 0} />
                          <rect x={x0} y={Tp - 6} width={slot} height={ph + 6} fill="transparent" />
                          {barsSvg}
                          <text x={cx} y={svgH - 26} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">
                            {shortName}
                          </text>
                          <rect x={cx - 22} y={svgH - 20} width={44} height={18} rx="5" fill={deptCol} />
                          <text x={cx} y={svgH - 7} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#ffffff">
                            {deptCode}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            );
          })()}
        </section>

        {/* CHART 2: จำนวนผลงานรวมจำแนกตามสังกัด (สีตามสังกัด UCOL) */}
        <section className="rr-card rr-full" aria-labelledby="pers-t2">
          <div className="rr-head">
            <h2 className="rr-title-h2" id="pers-t2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M5 20V10M12 20V4M19 20v-7" />
              </svg>
              <span>จำนวนผลงานรวมจำแนกตามสังกัด</span>
            </h2>
            <div className="rr-ctrls">
              {deptMetric === 'works' && (
                <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                  <button type="button" aria-pressed={deptBarMode === 'group'} onClick={() => setDeptBarMode('group')}>
                    แยกแท่ง
                  </button>
                  <button type="button" aria-pressed={deptBarMode === 'stack'} onClick={() => setDeptBarMode('stack')}>
                    แท่งซ้อน
                  </button>
                </div>
              )}
              <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัดสังกัด">
                <button type="button" aria-pressed={deptMetric === 'works'} onClick={() => setDeptMetric('works')}>
                  ผลงานสะสมรวม (รายการ)
                </button>
                <button type="button" aria-pressed={deptMetric === 'active'} onClick={() => setDeptMetric('active')}>
                  อาจารย์ที่มีผลงาน (ท่าน)
                </button>
                <button type="button" aria-pressed={deptMetric === 'budget'} onClick={() => setDeptMetric('budget')}>
                  งบโครงการรวม (ลบ.)
                </button>
              </div>
            </div>
          </div>

          <div className="rr-legend">
            {deptAggregated.map((d) => (
              <span
                key={d.code}
                className="rr-pill st"
                style={{ '--c': UCOL[d.code] || UCOL.OTH, cursor: 'pointer' } as React.CSSProperties}
                onClick={() => {
                  setTip((t) => ({ ...t, show: false }));
                  setDrillDown({
                    isOpen: true,
                    title: `ผลงานสะสม: ${d.name} (${d.code})`,
                    subtitle: `อาจารย์ที่มีผลงาน ${d.activeCount}/${d.totalCount} ท่าน • รวม ${d.totalWorks} รายการ • งบโครงการรวม ${d.totalBudgetM.toFixed(2)} ล้านบาท`,
                    accentColor: UCOL[d.code] || UCOL.OTH,
                    items: d.allItems,
                  });
                }}
              >
                <i />
                {d.code} ({d.totalWorks})
              </span>
            ))}
            {deptMetric === 'works' && (
              <span className="rr-lbl" style={{ marginLeft: '8px' }}>
                สีเข้ม = งานวิจัย/ตีพิมพ์/ทรัพย์สินฯ · สีอ่อน = งานบริการ/พัฒนาวิชาการ
              </span>
            )}
          </div>

          {(() => {
            const N = Math.max(deptAggregated.length, 1);
            let maxV = 0;
            deptAggregated.forEach((d) => {
              const acadWorks = d.counts.research + d.counts.publications + d.counts.ip;
              const socWorks = d.counts.service + d.counts.academic;
              if (deptMetric === 'active') maxV = Math.max(maxV, d.activeCount);
              else if (deptMetric === 'budget') maxV = Math.max(maxV, d.totalBudgetM);
              else if (deptBarMode === 'group') maxV = Math.max(maxV, acadWorks, socWorks);
              else maxV = Math.max(maxV, d.totalWorks);
            });
            const step = deptMetric === 'budget' ? Math.max(1, Math.ceil(maxV / 4)) : Math.max(1, Math.ceil(maxV / 4));
            const top = Math.max(4, step * 4);
            const svgW = Math.max(deptPlotWidth, N * 92);
            const svgH = 330;
            const L = 56;
            const R = 28;
            const Tp = 34;
            const B = 42;
            const pw = svgW - L - R;
            const ph = svgH - Tp - B;
            const slot = pw / N;
            const yPos = (v: number) => Tp + ph - (ph * v) / (top || 1);

            return (
              <div className="rr-scroller" ref={deptScrollerRef}>
                <div
                  className="rr-plot"
                  style={{ minWidth: '760px', width: `${svgW}px` }}
                  onPointerLeave={() => {
                    setActiveDeptIdx(null);
                    setActiveDeptSeg(null);
                    setTip((t) => ({ ...t, show: false }));
                  }}
                >
                  <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}>
                    {Array.from({ length: 5 }).map((_, i) => {
                      const v = i * step;
                      const y = yPos(v);
                      return (
                        <g key={i}>
                          <line x1={L} x2={svgW - R} y1={y} y2={y} stroke="#e8edf3" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '3 5'} />
                          <text x={L - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="500" fill="var(--muted)">
                            {v}
                          </text>
                        </g>
                      );
                    })}

                    <text transform={`translate(16, ${Tp + ph / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted)">
                      {deptMetric === 'active'
                        ? 'อาจารย์ที่มีผลงาน (ท่าน)'
                        : deptMetric === 'budget'
                        ? 'งบโครงการรวม (ล้านบาท)'
                        : 'จำนวนผลงานรวม (รายการ)'}
                    </text>

                    {deptAggregated.map((d, i) => {
                      const x0 = L + slot * i;
                      const cx = x0 + slot / 2;
                      const col = UCOL[d.code] || UCOL.OTH;
                      const acadWorks = d.counts.research + d.counts.publications + d.counts.ip;
                      const socWorks = d.counts.service + d.counts.academic;
                      const acadItems = [...d.itemsByCat.research, ...d.itemsByCat.publications, ...d.itemsByCat.ip];
                      const socItems = [...d.itemsByCat.service, ...d.itemsByCat.academic];

                      let barsSvg: React.ReactNode = null;
                      if (deptMetric === 'works' && deptBarMode === 'group') {
                        const bw = Math.min(34, slot * 0.28);
                        const gap = 5;
                        const h1 = (ph * acadWorks) / (top || 1);
                        const h2 = (ph * socWorks) / (top || 1);
                        barsSvg = (
                          <>
                            {acadWorks > 0 && (
                              <g>
                                <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + ph - h1} width={bw} height={h1} rx={Math.min(7, h1 / 2)} fill={col} />
                                <text x={cx - bw / 2 - gap / 2} y={Tp + ph - h1 - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a">
                                  {acadWorks}
                                </text>
                              </g>
                            )}
                            {socWorks > 0 && (
                              <g>
                                <rect className="rr-rise" x={cx + gap / 2} y={Tp + ph - h2} width={bw} height={h2} rx={Math.min(7, h2 / 2)} fill={col} fillOpacity={0.55} />
                                <text x={cx + bw / 2 + gap / 2} y={Tp + ph - h2 - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#475569">
                                  {socWorks}
                                </text>
                              </g>
                            )}
                          </>
                        );
                      } else if (deptMetric === 'works') {
                        const w2 = Math.min(54, slot * 0.46);
                        const gap = 3;
                        const segs = [
                          acadWorks > 0 ? { k: 'acad', n: 'งานวิจัย / ตีพิมพ์ / ทรัพย์สินฯ', v: acadWorks, op: 1, items: acadItems } : null,
                          socWorks > 0 ? { k: 'soc', n: 'งานบริการวิชาการ / พัฒนาวิชาการ', v: socWorks, op: 0.58, items: socItems } : null,
                        ].filter(Boolean) as Array<{ k: string; n: string; v: number; op: number; items: any[] }>;
                        let cum = 0;
                        barsSvg = (
                          <>
                            {segs.map((seg) => {
                              const y1 = yPos(cum + seg.v);
                              const y0 = yPos(cum);
                              const h = Math.max(y0 - y1 - gap, 4);
                              const segY = y1 + gap / 2;
                              const isHovered = activeDeptIdx === i && activeDeptSeg === seg.k;
                              cum += seg.v;
                              return (
                                <g key={seg.k}>
                                  <rect
                                    className="rr-rise"
                                    x={cx - w2 / 2}
                                    y={segY}
                                    width={w2}
                                    height={h}
                                    rx={Math.min(8, h / 2)}
                                    fill={col}
                                    fillOpacity={seg.op}
                                    style={{
                                      cursor: 'pointer',
                                      filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                      opacity: activeDeptSeg && !isHovered ? 0.6 : 1,
                                      transition: 'all 0.15s ease',
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTip((t) => ({ ...t, show: false }));
                                      setDrillDown({
                                        isOpen: true,
                                        title: `ผลงานสะสม (${seg.n}): ${d.name} (${d.code})`,
                                        subtitle: `รวม ${seg.v} รายการ`,
                                        accentColor: col,
                                        items: seg.items,
                                      });
                                    }}
                                    onPointerMove={(e) => {
                                      e.stopPropagation();
                                      setActiveDeptIdx(i);
                                      setActiveDeptSeg(seg.k);
                                      showTooltip(
                                        e,
                                        <div>
                                          <div className="rr-tt-h">
                                            <i style={{ backgroundColor: col, opacity: seg.op }} />
                                            <span>{seg.n} · {d.code}</span>
                                          </div>
                                          <div className="rr-tt-v">
                                            <b>{seg.v}</b>
                                            <span>รายการ ({d.totalWorks > 0 ? Math.round((seg.v / d.totalWorks) * 100) : 0}% ของสังกัด)</span>
                                          </div>
                                          <div className="rr-tt-s">{d.name} · คลิกเพื่อดูรายการผลงาน</div>
                                        </div>
                                      );
                                    }}
                                  />
                                  {h >= 15 && (
                                    <text x={cx} y={segY + h / 2 + 5} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                      {seg.v}
                                    </text>
                                  )}
                                </g>
                              );
                            })}
                            {d.totalWorks > 0 && (
                              <text x={cx} y={yPos(d.totalWorks) - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                {d.totalWorks}
                              </text>
                            )}
                          </>
                        );
                      } else {
                        const val = deptMetric === 'active' ? d.activeCount : d.totalBudgetM;
                        const w2 = Math.min(54, slot * 0.46);
                        const h = (ph * val) / (top || 1);
                        barsSvg = val > 0 ? (
                          <g>
                            <rect
                              className="rr-rise"
                              x={cx - w2 / 2}
                              y={Tp + ph - h}
                              width={w2}
                              height={h}
                              rx={Math.min(8, h / 2)}
                              fill={col}
                            />
                            {h >= 18 && (
                              <text x={cx} y={Tp + ph - h / 2 + 5} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                {deptMetric === 'budget' ? val.toFixed(1) : val}
                              </text>
                            )}
                            <text x={cx} y={Tp + ph - h - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">
                              {deptMetric === 'budget' ? val.toFixed(2) : val}
                            </text>
                          </g>
                        ) : null;
                      }

                      return (
                        <g
                          key={d.code}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setTip((t) => ({ ...t, show: false }));
                            setDrillDown({
                              isOpen: true,
                              title: `ผลงานสะสม: ${d.name} (${d.code})`,
                              subtitle: `อาจารย์ที่มีผลงาน ${d.activeCount}/${d.totalCount} ท่าน • รวม ${d.totalWorks} รายการ • งบโครงการรวม ${d.totalBudgetM.toFixed(2)} ล้านบาท`,
                              accentColor: col,
                              items: d.allItems,
                            });
                          }}
                          onPointerMove={(e) => {
                            setActiveDeptIdx(i);
                            showTooltip(
                              e,
                              <div>
                                <div className="rr-tt-h">
                                  <i style={{ backgroundColor: col }} />
                                  <span>{d.code} · {d.name}</span>
                                </div>
                                <div className="rr-tt-r">
                                  <span>ผลงานสะสมรวม</span>
                                  <b>{d.totalWorks} รายการ</b>
                                </div>
                                <div className="rr-tt-r">
                                  <span>อาจารย์ที่มีผลงาน</span>
                                  <b>{d.activeCount} / {d.totalCount} ท่าน</b>
                                </div>
                                <div className="rr-tt-r">
                                  <span>วิจัย / ตีพิมพ์ / ทรัพย์สินฯ</span>
                                  <b>{d.counts.research} / {d.counts.publications} / {d.counts.ip}</b>
                                </div>
                                <div className="rr-tt-r">
                                  <span>บริการวิชาการ / พัฒนาวิชาการ</span>
                                  <b>{d.counts.service} / {d.counts.academic}</b>
                                </div>
                                <div className="rr-tt-r">
                                  <span>งบโครงการรวม</span>
                                  <b>{d.totalBudgetM.toFixed(2)} ล้านบาท</b>
                                </div>
                                <div className="rr-tt-s">คลิกเพื่อดูรายการผลงานของสังกัด</div>
                              </div>
                            );
                          }}
                        >
                          <rect x={x0 + 4} y={Tp - 6} width={slot - 8} height={ph + 6} rx="14" fill="rgba(15, 23, 42, 0.05)" opacity={activeDeptIdx === i ? 1 : 0} />
                          <rect x={x0} y={Tp - 6} width={slot} height={ph + 6} fill="transparent" />
                          {barsSvg}
                          <rect x={cx - 24} y={svgH - 28} width={48} height={22} rx={6} fill={col} />
                          <text x={cx} y={svgH - 13} textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff">
                            {d.code}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            );
          })()}
        </section>

        {/* CHART 3: สัดส่วนผลงานตาม 5 พันธกิจหลัก (สามารถปรับเป็นเปอร์เซ็นและจำนวนนับได้) */}
        <section className="rr-card rr-full" aria-labelledby="pers-t3">
          <div className="rr-head">
            <h2 className="rr-title-h2" id="pers-t3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M12 3a9 9 0 1 0 9 9h-9z" />
              </svg>
              <span>สัดส่วนผลงานตาม 5 พันธกิจหลัก</span>
            </h2>
            <div className="rr-ctrls">
              <div className="rr-seg-ctl" role="group" aria-label="หน่วยการแสดงผลสัดส่วนพันธกิจ">
                <button type="button" aria-pressed={missionDisplayMode === 'count'} onClick={() => setMissionDisplayMode('count')}>
                  จำนวนนับ (รายการ)
                </button>
                <button type="button" aria-pressed={missionDisplayMode === 'pct'} onClick={() => setMissionDisplayMode('pct')}>
                  เปอร์เซ็นต์ (%)
                </button>
              </div>
            </div>
          </div>

          <p className="rr-note">
            คลิกที่ส่วนโค้งหรือรายการด้านขวาเพื่อดูรายละเอียดผลงานแต่ละพันธกิจ · สลับแสดงผลระหว่างจำนวนนับและเปอร์เซ็นต์ได้ที่มุมขวาบน
          </p>

          <div className="rr-dn">
            <svg viewBox="0 0 260 260" role="img" style={{ width: '260px', height: '260px' }}>
              {(() => {
                const r = 92;
                const sw = 48;
                const C = 2 * Math.PI * r;
                let off = 0;
                return missionStats.buckets.map((b) => {
                  if (b.count <= 0) return null;
                  const len = missionStats.total > 0 ? (b.count / missionStats.total) * C : 0;
                  const midAngle = -Math.PI / 2 + ((off + len / 2) / C) * 2 * Math.PI;
                  const lx = 130 + r * Math.cos(midAngle);
                  const ly = 130 + r * Math.sin(midAngle);
                  const currentOff = off;
                  off += len;
                  return (
                    <g key={b.key}>
                      <circle
                        className="rr-sg"
                        cx="130"
                        cy="130"
                        r={r}
                        fill="none"
                        stroke={b.color}
                        strokeWidth={sw}
                        strokeDasharray={`${Math.max(len - 2, 0)} ${C - Math.max(len - 2, 0)}`}
                        strokeDashoffset={-currentOff}
                        transform="rotate(-90 130 130)"
                        onClick={() => {
                          setTip((t) => ({ ...t, show: false }));
                          setDrillDown({
                            isOpen: true,
                            title: `รายการ${b.label}`,
                            subtitle: `รวมทั้งหมด ${b.count} รายการ (${b.pct.toFixed(1)}% ของผลงานรวม 5 พันธกิจ)`,
                            accentColor: b.color,
                            categoryKey: b.key,
                            items: b.items,
                          });
                        }}
                        onMouseEnter={(e) => {
                          showTooltip(
                            e,
                            <div>
                              <div className="rr-tt-h">
                                <i style={{ backgroundColor: b.color }} />
                                <span>{b.label}</span>
                              </div>
                              <div className="rr-tt-r">
                                <span>จำนวนผลงาน</span>
                                <b>{b.count.toLocaleString('th-TH')} รายการ</b>
                              </div>
                              <div className="rr-tt-r">
                                <span>สัดส่วน</span>
                                <b>{b.pct.toFixed(1)}%</b>
                              </div>
                              <div className="rr-tt-s">คลิกเพื่อดูรายการผลงาน</div>
                            </div>
                          );
                        }}
                        onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
                      />
                      {b.pct >= 6 && (
                        <text
                          x={lx}
                          y={ly + 4}
                          textAnchor="middle"
                          fontSize="12.5"
                          fontWeight="800"
                          fill="#ffffff"
                          pointerEvents="none"
                        >
                          {missionDisplayMode === 'pct' ? `${Math.round(b.pct)}%` : b.count}
                        </text>
                      )}
                    </g>
                  );
                });
              })()}

              {/* Center Text */}
              <text x="130" y="125" textAnchor="middle" fontSize="22" fill="var(--ink)" fontWeight="800">
                {missionDisplayMode === 'pct' ? '100%' : missionStats.total.toLocaleString('th-TH')}
              </text>
              <text x="130" y="145" textAnchor="middle" fontSize="11.5" fill="var(--muted)" fontWeight="600">
                {missionDisplayMode === 'pct' ? `จาก ${missionStats.total} รายการ` : 'รายการรวม 5 ด้าน'}
              </text>
            </svg>

            <div className="rr-dl">
              {missionStats.buckets.map((b) => (
                <div
                  key={b.key}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  onClick={() => {
                    setTip((t) => ({ ...t, show: false }));
                    setDrillDown({
                      isOpen: true,
                      title: `รายการ${b.label}`,
                      subtitle: `รวมทั้งหมด ${b.count} รายการ (${b.pct.toFixed(1)}% ของผลงานรวม 5 พันธกิจ)`,
                      accentColor: b.color,
                      categoryKey: b.key,
                      items: b.items,
                    });
                  }}
                >
                  <i style={{ backgroundColor: b.color }} />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{b.label}</span>
                  <b style={{ fontSize: '14px', color: '#0f172a' }}>
                    {missionDisplayMode === 'pct'
                      ? `${b.pct.toFixed(1)}% (${b.count} รายการ)`
                      : `${b.count.toLocaleString('th-TH')} รายการ (${b.pct.toFixed(1)}%)`}
                  </b>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {tip.show && (
        <div
          className="rr-tip show"
          style={{
            left: `${tip.x + 16}px`,
            top: `${tip.y - 40}px`,
          }}
        >
          {tip.content}
        </div>
      )}

      <DrillDownProjectDrawer
        isOpen={drillDown.isOpen}
        onClose={() => setDrillDown((prev) => ({ ...prev, isOpen: false }))}
        title={drillDown.title}
        subtitle={drillDown.subtitle}
        accentColor={drillDown.accentColor}
        items={drillDown.items}
        categoryKey={drillDown.categoryKey}
      />
    </div>
  );
}
