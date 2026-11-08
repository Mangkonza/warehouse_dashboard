'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import './research-redesign.css';
import { ResearchItem, normalizeFundSource } from '../_hooks/useResearchData';
import { isExternalResearchItem } from './ResearchCharts';
import { DrillDownProjectDrawer } from '@/components/data-display/DrillDownProjectDrawer';

interface Props {
  allItems: ResearchItem[];
  filteredItems?: ResearchItem[];
  currentFiscalYear?: string;
}

const MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const PAL = ['#93c5fd', '#86efac', '#fde68a', '#ddd6fe', '#fda4af', '#99f6e4', '#fed7aa', '#a5b4fc'];

const FUND = {
  ext: { n: 'ทุนภายนอก', c: '#0ea5e9' },
  int: { n: 'ทุนภายใน', c: '#22c55e' },
};

const DIMS: Record<string, { n: string; c: string[] }> = {
  range: { n: 'ช่วงงบประมาณ', c: ['< 5 แสนบาท', '5 แสน - 1 ล้าน', '1 - 5 ล้าน', '5 - 10 ล้าน', '≥ 10 ล้านบาท'] },
  kind: { n: 'ลักษณะโครงการ', c: ['วิจัยพื้นฐาน', 'วิจัยประยุกต์', 'วิจัยและพัฒนา', 'ไม่ระบุ'] },
  collab: { n: 'ความร่วมมือ', c: ['ภายในคณะ', 'ภายในมหาวิทยาลัย', 'ภาครัฐ', 'ภาคเอกชน', 'ไม่ระบุ'] },
  integ: { n: 'การบูรณาการ', c: ['เรียนการสอน', 'บริการวิชาการ', 'ทั้งสองด้าน', 'ไม่ระบุ'] },
  trl: { n: 'ระดับ TRL', c: ['TRL 1', 'TRL 2', 'TRL 3', 'TRL 4', 'TRL 5', 'TRL 6', 'TRL 7', 'TRL 8', 'TRL 9', 'ไม่ระบุ'] },
};

function resolveItemFiscalYear(item: ResearchItem): string {
  const idStr = String(item.id || item._id || '').replace(/\n/g, ' ');
  const beMatch = idStr.match(/25(6[6-9]|7\d)/);
  if (beMatch) return beMatch[0];
  const dotMatch = idStr.match(/(?:\/|\.)(6[6-9]|7\d)\b/);
  if (dotMatch) return '25' + dotMatch[1];

  const explicit = item.fiscal_year_be ?? item.fiscal_year;
  if (explicit !== undefined && explicit !== null && String(explicit).trim() !== '') {
    const s = String(explicit).trim();
    const match = s.match(/25(6[6-9]|7\d)/);
    if (match) return match[0];
    const any4 = s.match(/\d{4}/);
    if (any4) {
      const y = Number(any4[0]);
      if (Number.isFinite(y)) {
        if (y >= 1966 && y <= 1972) return String(y + 600); // 1968 -> 2568
        if (y >= 2020 && y <= 2040) return String(y + 543);
        return String(y >= 2400 ? y : y + 543);
      }
    }
  }

  const sd = String(item.start_date || '').trim();
  if (sd && sd !== '-' && sd !== 'nan') {
    const parts = sd.match(/(\d{4})[-/](\d{1,2})/);
    if (parts) {
      let y = parseInt(parts[1], 10);
      const m = parseInt(parts[2], 10);
      if (y >= 1966 && y <= 1972) y += 57;
      else if (y >= 2500) y -= 543;
      const be = y + 543;
      return String(m >= 10 ? be + 1 : be);
    }
  }

  const fundStr = String(item.fund_source || '');
  const fundMatch = fundStr.match(/25(6[6-9]|7\d)/);
  if (fundMatch) return fundMatch[0];

  return '2568';
}

function resolveMonthIndex(rawDate: unknown): number {
  if (!rawDate) return -1;
  const str = String(rawDate).trim();
  if (str === '-' || str.includes('เดือน') || str.includes('1 ปี')) return -1;
  const m = str.match(/(?:19\d{2}|20\d{2}|25\d{2})[-/](\d{1,2})[-/](\d{1,2})/);
  if (m) {
    return parseInt(m[1], 10) - 1;
  }
  for (let i = 0; i < MON.length; i++) {
    if (str.includes(MON[i]) || str.includes(MON[i].replace('.', ''))) return i;
  }
  return -1;
}

function getItemBudget(item: ResearchItem): { total: number; ext: number; int: number } {
  const ext = Number(item.budget_external ?? item.budgetExternal) || 0;
  const internal = Number(item.budget_internal ?? item.budgetInternal) || 0;
  const rawTot = Number(item.budget) || 0;
  const total = ext + internal > 0 ? ext + internal : rawTot;
  return { total, ext, int: internal };
}

function getDistBucketIndex(it: ResearchItem, d: string): number {
  const cats = DIMS[d].c;
  const b = getItemBudget(it);
  if (d === 'range') {
    const mb = b.total / 1_000_000;
    if (mb < 0.5) return 0;
    if (mb < 1.0) return 1;
    if (mb < 5.0) return 2;
    if (mb < 10.0) return 3;
    return 4;
  }
  if (d === 'kind') {
    const nat = String(it.project_nature || '').toLowerCase();
    if (nat.includes('พื้นฐาน')) return 0;
    if (nat.includes('ประยุกต์')) return 1;
    if (nat.includes('พัฒนา') || nat.includes('ทดลอง')) return 2;
    return 3;
  }
  if (d === 'collab') {
    const col = String(it.collaboration_type || '').toLowerCase();
    if (col.includes('ภายในคณะ') || col.includes('คณะ')) return 0;
    if (col.includes('มหาวิทยาลัย') || col.includes('มก')) return 1;
    if (col.includes('รัฐ') || col.includes('วช') || col.includes('สวก')) return 2;
    if (col.includes('เอกชน') || col.includes('มิตรผล')) return 3;
    return 4;
  }
  if (d === 'integ') {
    const iType = it.evaluation?.i_type || it.i_type || '';
    if (iType === 'I_ED' || String(it.integration || '').includes('สอน')) return 0;
    if (iType === 'I_AM' || String(it.integration || '').includes('บริการ')) return 1;
    if (iType === 'I_ALL' || String(it.integration || '').includes('ทั้งสอง')) return 2;
    return 3;
  }
  if (d === 'trl') {
    const e = it.end_trl ? Number(it.end_trl) : 0;
    return e >= 1 && e <= 9 ? e - 1 : 9;
  }
  return cats.length - 1;
}

function nice(max: number, isN: boolean) {
  if (max <= 0) return { step: 1, top: isN ? 4 : 1 };
  const raw = max / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const factors = [1, 2, 2.5, 5, 10];
  let st = factors.map((f) => f * mag).find((x) => x >= raw) || raw;
  if (isN) st = Math.max(1, Math.ceil(st));
  return { step: st, top: Math.ceil(max / st - 1e-9) * st };
}

function mono(pts: [number, number][]): string {
  const n = pts.length;
  if (n === 0) return '';
  if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
  const d: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
  }
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) {
    m.push(d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]));
  }
  m.push(d[n - 2]);
  let s = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (pts[i + 1][0] - pts[i][0]) / 3;
    s += ` C${pts[i][0] + dx},${pts[i][1] + m[i] * dx} ${pts[i + 1][0] - dx},${pts[i + 1][1] - m[i + 1] * dx} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return s;
}

export function ResearchBudgetFundingOverview({ allItems, filteredItems, currentFiscalYear }: Props) {
  const availableYears = useMemo(() => {
    const s = new Set<string>();
    allItems.forEach((it) => s.add(resolveItemFiscalYear(it)));
    s.add('2568');
    s.add('2569');
    s.add('2567');
    return Array.from(s)
      .filter((y) => /^25[6-7]\d$/.test(y))
      .sort((a, b) => Number(b) - Number(a));
  }, [allItems]);

  const [year, setYear] = useState<string>(() => {
    if (currentFiscalYear && currentFiscalYear !== 'all' && availableYears.includes(currentFiscalYear)) {
      return currentFiscalYear;
    }
    return availableYears.includes('2568') ? '2568' : availableYears[0] || '2568';
  });

  const [cmpYear, setCmpYear] = useState<string>(() => {
    const others = availableYears.filter((y) => y !== year);
    if (others.includes('2567')) return '2567';
    return others[0] || '2567';
  });

  const [isCompare, setIsCompare] = useState<boolean>(false);
  const [barMode, setBarMode] = useState<'group' | 'stack'>('group');
  const [hideExt, setHideExt] = useState(false);
  const [hideInt, setHideInt] = useState(false);
  const [showLine, setShowLine] = useState(true);

  // Distribution controls
  const [dim, setDim] = useState<string>('range');
  const [m4, setM4] = useState<'n' | 'b'>('n');

  // Hover & Animation state for Monthly Chart
  const [activeMonthIdx, setActiveMonthIdx] = useState<number | null>(null);
  const [activeSegKey, setActiveSegKey] = useState<string | null>(null);
  const [activeDotMonth, setActiveDotMonth] = useState<number | null>(null);

  // Hover & Animation state for Distribution Chart
  const [activeDistIdx, setActiveDistIdx] = useState<number | null>(null);
  const [activeDistSeg, setActiveDistSeg] = useState<string | null>(null);

  // Tooltip state
  const [tip, setTip] = useState<{ show: boolean; x: number; y: number; content: React.ReactNode }>({
    show: false,
    x: 0,
    y: 0,
    content: null,
  });

  // Right Slide-over Drawer state
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    title: string;
    items: ResearchItem[];
  }>({
    isOpen: false,
    title: '',
    items: [],
  });

  const openDrawer = (title: string, items: ResearchItem[]) => {
    setTip((t) => ({ ...t, show: false }));
    setDrawerState({
      isOpen: true,
      title,
      items,
    });
  };

  // Dynamic responsive width measurement
  const monthlyScrollerRef = useRef<HTMLDivElement>(null);
  const distScrollerRef = useRef<HTMLDivElement>(null);
  const [monthlyPlotWidth, setMonthlyPlotWidth] = useState<number>(1060);
  const [distPlotWidth, setDistPlotWidth] = useState<number>(1060);

  useEffect(() => {
    const updateWidths = () => {
      if (monthlyScrollerRef.current) {
        setMonthlyPlotWidth(Math.max(760, monthlyScrollerRef.current.clientWidth));
      }
      if (distScrollerRef.current) {
        setDistPlotWidth(Math.max(760, distScrollerRef.current.clientWidth));
      }
    };
    updateWidths();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidths) : null;
    if (ro) {
      if (monthlyScrollerRef.current) ro.observe(monthlyScrollerRef.current);
      if (distScrollerRef.current) ro.observe(distScrollerRef.current);
    }
    window.addEventListener('resize', updateWidths);
    return () => {
      window.removeEventListener('resize', updateWidths);
      ro?.disconnect();
    };
  }, []);

  // Keep year in sync if prop changes
  useEffect(() => {
    if (currentFiscalYear && currentFiscalYear !== 'all' && availableYears.includes(currentFiscalYear)) {
      setYear(currentFiscalYear);
    }
  }, [currentFiscalYear, availableYears]);

  // Split items by year
  const itemsByYear = useMemo(() => {
    const map: Record<string, ResearchItem[]> = {};
    allItems.forEach((it) => {
      const y = resolveItemFiscalYear(it);
      if (!map[y]) map[y] = [];
      map[y].push(it);
    });
    return map;
  }, [allItems]);

  const curItems = useMemo(() => itemsByYear[year] || [], [itemsByYear, year]);
  const cmpItems = useMemo(() => itemsByYear[cmpYear] || [], [itemsByYear, cmpYear]);

  const hasCmpData = cmpItems.length > 0;

  // Helper to get items for a specific month
  const getMonthItems = (items: ResearchItem[], mIdx: number, filterType: 'ext' | 'int' | 'vis' = 'vis') => {
    return items.filter((it) => {
      if (resolveMonthIndex(it.start_date) !== mIdx) return false;
      const isExt = isExternalResearchItem(it);
      if (filterType === 'ext') return isExt;
      if (filterType === 'int') return !isExt;
      if (isExt && hideExt) return false;
      if (!isExt && hideInt) return false;
      return true;
    });
  };

  // Process monthly data for current and compare years
  const getMonthlyStats = (items: ResearchItem[]) => {
    const extN = Array(12).fill(0);
    const intN = Array(12).fill(0);
    const extB = Array(12).fill(0);
    const intB = Array(12).fill(0);
    let miss = 0;
    let missB = 0;

    items.forEach((it) => {
      const mi = resolveMonthIndex(it.start_date);
      const isExt = isExternalResearchItem(it);
      const b = getItemBudget(it);
      const bMillions = b.total / 1_000_000;

      if (mi === -1) {
        miss++;
        missB += bMillions;
      } else {
        if (isExt) {
          extN[mi]++;
          extB[mi] += bMillions;
        } else {
          intN[mi]++;
          intB[mi] += bMillions;
        }
      }
    });

    return { extN, intN, extB, intB, miss, missB: Number(missB.toFixed(2)) };
  };

  const curMonthly = useMemo(() => getMonthlyStats(curItems), [curItems]);
  const cmpMonthly = useMemo(() => getMonthlyStats(cmpItems), [cmpItems]);

  // Funding Sources Donut
  const curSources = useMemo(() => {
    const map: Record<string, number> = {};
    curItems.forEach((it) => {
      const s = normalizeFundSource(it.fund_source);
      const b = getItemBudget(it).total / 1_000_000;
      map[s] = (map[s] || 0) + b;
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, e) => s + e[1], 0);
    return { entries, total };
  }, [curItems]);

  const cmpSources = useMemo(() => {
    const map: Record<string, number> = {};
    cmpItems.forEach((it) => {
      const s = normalizeFundSource(it.fund_source);
      const b = getItemBudget(it).total / 1_000_000;
      map[s] = (map[s] || 0) + b;
    });
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, e) => s + e[1], 0);
    return { entries, total };
  }, [cmpItems]);

  // Distribution aggregates
  const getDistributionStats = (items: ResearchItem[]) => {
    const cats = DIMS[dim].c;
    const ext = Array(cats.length).fill(0);
    const int = Array(cats.length).fill(0);
    const stTrl = Array(cats.length).fill(0);
    const enTrl = Array(cats.length).fill(0);

    items.forEach((it) => {
      const isExt = isExternalResearchItem(it);
      const b = getItemBudget(it);
      const val = m4 === 'n' ? 1 : b.total / 1_000_000;

      const idx = getDistBucketIndex(it, dim);

      if (dim === 'trl') {
        const s = it.start_trl ? Number(it.start_trl) : 0;
        const e = it.end_trl ? Number(it.end_trl) : 0;
        const sIdx = s >= 1 && s <= 9 ? s - 1 : 9;
        const eIdx = e >= 1 && e <= 9 ? e - 1 : 9;
        stTrl[sIdx] += val;
        enTrl[eIdx] += val;
      }

      if (isExt) ext[idx] += val;
      else int[idx] += val;
    });

    return { ext, int, stTrl, enTrl };
  };

  const curDist = useMemo(() => getDistributionStats(curItems), [curItems, dim, m4]);
  const cmpDist = useMemo(() => getDistributionStats(cmpItems), [cmpItems, dim, m4]);

  // Dimension totals for summary
  const totalCurProjects = curItems.length;
  const totalCurBudget = useMemo(() => {
    return curItems.reduce((acc, it) => acc + getItemBudget(it).total, 0) / 1_000_000;
  }, [curItems]);

  const totalCmpProjects = cmpItems.length;
  const totalCmpBudget = useMemo(() => {
    return cmpItems.reduce((acc, it) => acc + getItemBudget(it).total, 0) / 1_000_000;
  }, [cmpItems]);

  // Render Delta Chip Helper (SDGs Page Badge Style)
  const renderChip = (c: number, p: number, metric: 'n' | 'b') => {
    const baseBadgeStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 700,
      padding: '2px 9px',
      borderRadius: '9999px',
      lineHeight: 1.25,
      userSelect: 'none',
      whiteSpace: 'nowrap',
    };

    if (p === 0 && c === 0) {
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            border: '1px solid #e2e8f0',
          }}
        >
          –
        </span>
      );
    }

    if (p === 0 && c > 0) {
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
          }}
        >
          ใหม่
        </span>
      );
    }

    const diff = c - p;
    let t = '';
    let isSame = false;
    if (metric === 'n') {
      const roundedDiff = Math.round(diff);
      t = `${roundedDiff > 0 ? '+' : ''}${Math.abs(roundedDiff)}`;
      isSame = roundedDiff === 0;
    } else {
      const pct = (diff / p) * 100;
      t = `${pct > 0 ? '+' : ''}${Math.abs(pct).toFixed(0)}%`;
      isSame = Math.abs(pct) < 0.5;
    }

    if (isSame) {
      return (
        <span
          style={{
            ...baseBadgeStyle,
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: '1px solid #e2e8f0',
          }}
        >
          เท่าเดิม
        </span>
      );
    }

    const isUp = diff > 0;
    return (
      <span
        style={{
          ...baseBadgeStyle,
          gap: '3px',
          padding: '2px 8px',
          backgroundColor: isUp ? '#dcfce7' : '#fee2e2',
          color: isUp ? '#15803d' : '#b91c1c',
          border: isUp ? '1px solid #bbf7d0' : '1px solid #fecaca',
        }}
      >
        <span style={{ fontSize: '9.5px', lineHeight: 1 }}>{isUp ? '▲' : '▼'}</span>
        <span>{t}</span>
      </span>
    );
  };

  // Dimensions of SVG Month Chart (Full Width Responsive)
  const svgW = monthlyPlotWidth;
  const svgH = 350;
  const L = 56;
  const R = showLine ? 58 : 28;
  const Tp = 34;
  const B = 36;
  const pw = svgW - L - R;
  const ph = svgH - Tp - B;
  const slot = pw / 12;

  // Compute Scales for Month Chart
  const isCmp = isCompare && hasCmpData;
  const visKeys = (['ext', 'int'] as const).filter((k) => (k === 'ext' ? !hideExt : !hideInt));

  let maxN = 0;
  let maxB = 0;
  for (let i = 0; i < 12; i++) {
    const cExtN = !hideExt ? curMonthly.extN[i] : 0;
    const cIntN = !hideInt ? curMonthly.intN[i] : 0;
    const pExtN = isCmp && !hideExt ? cmpMonthly.extN[i] : 0;
    const pIntN = isCmp && !hideInt ? cmpMonthly.intN[i] : 0;

    const cTotN = cExtN + cIntN;
    const pTotN = pExtN + pIntN;

    const cTotB = (!hideExt ? curMonthly.extB[i] : 0) + (!hideInt ? curMonthly.intB[i] : 0);
    const pTotB = isCmp ? (!hideExt ? cmpMonthly.extB[i] : 0) + (!hideInt ? cmpMonthly.intB[i] : 0) : 0;

    if (isCmp) {
      maxN = Math.max(maxN, cTotN, pTotN);
    } else if (barMode === 'group') {
      maxN = Math.max(maxN, cExtN, cIntN);
    } else {
      maxN = Math.max(maxN, cTotN);
    }
    maxB = Math.max(maxB, cTotB, pTotB);
  }

  const nzN = nice(maxN, true);
  const nTicks = Math.round(nzN.top / nzN.step);
  let stepB = 1;
  if (maxB > 0) {
    const rawB = maxB / nTicks;
    const mg = Math.pow(10, Math.floor(Math.log10(rawB)));
    stepB = [1, 2, 2.5, 5, 10].map((f) => f * mg).find((x) => x >= rawB - 1e-9) || 1;
  }
  const topB = stepB * nTicks;

  const yL = (v: number) => Tp + ph - (ph * v) / (nzN.top || 1);
  const yR = (v: number) => Tp + ph - (ph * v) / (topB || 1);

  // Month Points for Line
  const curLinePts: [number, number][] = [];
  const cmpLinePts: [number, number][] = [];
  const topYs: number[] = [];

  for (let i = 0; i < 12; i++) {
    const cx = L + slot * i + slot / 2;
    const cTotB = (!hideExt ? curMonthly.extB[i] : 0) + (!hideInt ? curMonthly.intB[i] : 0);
    const pTotB = (!hideExt ? cmpMonthly.extB[i] : 0) + (!hideInt ? cmpMonthly.intB[i] : 0);
    curLinePts.push([cx, yR(cTotB)]);
    if (isCmp) cmpLinePts.push([cx, yR(pTotB)]);
  }

  const showTooltip = (e: React.MouseEvent | React.PointerEvent, content: React.ReactNode) => {
    setTip({
      show: true,
      x: e.clientX,
      y: e.clientY - 12,
      content,
    });
  };

  const clearMonthlyHover = () => {
    setActiveMonthIdx(null);
    setActiveSegKey(null);
    setActiveDotMonth(null);
    setTip((t) => ({ ...t, show: false }));
  };

  const clearDistHover = () => {
    setActiveDistIdx(null);
    setActiveDistSeg(null);
    setTip((t) => ({ ...t, show: false }));
  };

  return (
    <div className="rr-container" style={{ marginTop: '16px' }}>
      <div className="rr-wrap">
        {/* CARD 1: Monthly Chart */}
        <section className="rr-card rr-full" aria-labelledby="t1">
          <div className="rr-head">
            <h2 className="rr-title-h2" id="t1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M5 20V10M12 20V4M19 20v-7" />
              </svg>
              <span>
                {isCmp
                  ? `เปรียบเทียบโครงการวิจัยรายเดือน (ปี ${year} vs ปี ${cmpYear})`
                  : 'เปรียบเทียบโครงการวิจัยรายเดือน (ทุนภายนอก vs ทุนภายใน)'}
              </span>
            </h2>
            <div className="rr-ctrls">
              <label className="rr-sel">
                <span>ปี</span>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rr-seg-ctl" role="group" aria-label="โหมดการแสดงผล">
                <button type="button" aria-pressed={!isCompare} onClick={() => setIsCompare(false)}>
                  ภาพรวม
                </button>
                <button type="button" aria-pressed={isCompare} onClick={() => setIsCompare(true)}>
                  เปรียบเทียบข้ามปี
                </button>
              </div>

              {isCompare && (
                <label className="rr-sel">
                  <span>เทียบกับปี</span>
                  <select value={cmpYear} onChange={(e) => setCmpYear(e.target.value)}>
                    {availableYears
                      .filter((y) => y !== year)
                      .map((y) => (
                        <option key={y} value={y}>
                          {y}
                          {itemsByYear[y]?.length ? '' : ' (ไม่มีข้อมูล)'}
                        </option>
                      ))}
                  </select>
                </label>
              )}
            </div>
          </div>

          {isCompare && !hasCmpData && (
            <p className="rr-note" style={{ color: '#dc2626' }}>
              ปี {cmpYear} ไม่มีข้อมูล จึงยังเทียบไม่ได้ ลองเลือกปีอื่นที่ช่อง เทียบกับปี
            </p>
          )}

          {!isCmp && (
            <div className="rr-ctrls rr-row2">
              <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                <button type="button" aria-pressed={barMode === 'group'} onClick={() => setBarMode('group')}>
                  แยกแท่ง
                </button>
                <button type="button" aria-pressed={barMode === 'stack'} onClick={() => setBarMode('stack')}>
                  แท่งซ้อน
                </button>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="rr-legend">
            {isCmp && <span className="rr-lbl">นับเฉพาะ</span>}
            <button
              type="button"
              className="rr-pill"
              style={{ '--c': FUND.ext.c } as React.CSSProperties}
              aria-pressed={!hideExt}
              onClick={() => {
                if (!hideExt && hideInt) return;
                setHideExt(!hideExt);
              }}
            >
              <i />
              {FUND.ext.n}
            </button>
            <button
              type="button"
              className="rr-pill"
              style={{ '--c': FUND.int.c } as React.CSSProperties}
              aria-pressed={!hideInt}
              onClick={() => {
                if (!hideInt && hideExt) return;
                setHideInt(!hideInt);
              }}
            >
              <i />
              {FUND.int.n}
            </button>

            {isCmp && (
              <>
                <span className="rr-pill st" style={{ '--c': 'var(--cur)' } as React.CSSProperties}>
                  <i />
                  ปี {year}
                </span>
                <span className="rr-pill st" style={{ '--c': 'var(--ghost)' } as React.CSSProperties}>
                  <i />
                  ปี {cmpYear}
                </span>
              </>
            )}

            <button
              type="button"
              className="rr-pill"
              style={{ '--c': '#f59e0b' } as React.CSSProperties}
              aria-pressed={showLine}
              onClick={() => setShowLine(!showLine)}
            >
              <i className="ln" />
              {isCmp ? `งบประมาณ ปี ${year}` : 'งบประมาณรวม (เส้น)'}
            </button>

            {isCmp && showLine && (
              <span className="rr-pill st" style={{ '--c': '#f59e0b' } as React.CSSProperties}>
                <i className="ln ds" />
                งบประมาณ ปี {cmpYear}
              </span>
            )}
          </div>

          {/* Full-Width Responsive SVG Chart + Aligned Deltas */}
          <div className="rr-scroller" ref={monthlyScrollerRef}>
            <div
              className="rr-plot"
              style={{ minWidth: '760px', width: `${svgW}px` }}
              onPointerLeave={clearMonthlyHover}
            >
              <svg
                width={svgW}
                height={svgH}
                viewBox={`0 0 ${svgW} ${svgH}`}
                style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}
                role="img"
              >
                {/* Horizontal Grid lines */}
                {Array.from({ length: nTicks + 1 }).map((_, i) => {
                  const y = yL(i * nzN.step);
                  const bVal = Math.round(i * stepB * 100) / 100;
                  return (
                    <g key={i}>
                      <line
                        x1={L}
                        x2={svgW - R}
                        y1={y}
                        y2={y}
                        stroke="#e8edf3"
                        strokeWidth={1}
                        strokeDasharray={i === 0 ? 'none' : '3 5'}
                      />
                      <text x={L - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="500" fill="var(--muted)">
                        {i * nzN.step}
                      </text>
                      {showLine && (
                        <text x={svgW - R + 10} y={y + 4} fontSize="12" fill="var(--mt)" fontWeight="600">
                          {bVal}
                        </text>
                      )}
                    </g>
                  );
                })}

                <text
                  transform={`translate(16, ${Tp + ph / 2}) rotate(-90)`}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="var(--muted)"
                >
                  จำนวนโครงการ (โครงการ)
                </text>
                {showLine && (
                  <text
                    transform={`translate(${svgW - 8}, ${Tp + ph / 2}) rotate(90)`}
                    textAnchor="middle"
                    fontSize="12"
                    fill="var(--mt)"
                    fontWeight="600"
                  >
                    งบประมาณ (ล้านบาท)
                  </text>
                )}

                {/* Column Hover Background Highlight */}
                {MON.map((_, i) => {
                  const x0 = L + slot * i;
                  const isOn = activeMonthIdx === i;
                  return (
                    <rect
                      key={`colbg-${i}`}
                      x={x0 + 3}
                      y={Tp - 6}
                      width={slot - 6}
                      height={ph + 6}
                      rx="14"
                      fill="rgba(15, 23, 42, 0.05)"
                      opacity={isOn ? 1 : 0}
                      style={{ transition: 'opacity 0.12s' }}
                      pointerEvents="none"
                    />
                  );
                })}

                {/* Column Hit Areas */}
                {MON.map((mName, i) => {
                  const x0 = L + slot * i;
                  const cExtN = !hideExt ? curMonthly.extN[i] : 0;
                  const cIntN = !hideInt ? curMonthly.intN[i] : 0;
                  const cTotN = cExtN + cIntN;
                  const cExtB = !hideExt ? curMonthly.extB[i] : 0;
                  const cIntB = !hideInt ? curMonthly.intB[i] : 0;
                  const cTotB = cExtB + cIntB;
                  const pTotN = isCmp ? (!hideExt ? cmpMonthly.extN[i] : 0) + (!hideInt ? cmpMonthly.intN[i] : 0) : 0;
                  const pTotB = isCmp ? (!hideExt ? cmpMonthly.extB[i] : 0) + (!hideInt ? cmpMonthly.intB[i] : 0) : 0;

                  return (
                    <rect
                      key={`hit-${i}`}
                      x={x0}
                      y={Tp - 6}
                      width={slot}
                      height={ph + 6}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        const curList = getMonthItems(curItems, i, 'vis');
                        if (isCmp && curList.length === 0) {
                          const cmpList = getMonthItems(cmpItems, i, 'vis');
                          openDrawer(`โครงการวิจัยประจำเดือน${mName} ปีงบประมาณ ${cmpYear}`, cmpList);
                        } else {
                          openDrawer(`โครงการวิจัยประจำเดือน${mName} ปีงบประมาณ ${year}`, curList);
                        }
                      }}
                      onPointerMove={(e) => {
                        setActiveMonthIdx(i);
                        setActiveSegKey(null);
                        setActiveDotMonth(null);
                        const content = isCmp ? (
                          <div>
                            <div className="rr-tt-h">
                              <i style={{ backgroundColor: '#6366f1' }} />
                              <span>
                                {mName} ({year} vs {cmpYear})
                              </span>
                            </div>
                            <div className="rr-tt-r">
                              <span>ปี {year}</span>
                              <b>
                                {cTotN} โครงการ · {cTotB.toFixed(2)} ลบ.
                              </b>
                            </div>
                            <div className="rr-tt-r">
                              <span>ปี {cmpYear}</span>
                              <b>
                                {pTotN} โครงการ · {pTotB.toFixed(2)} ลบ.
                              </b>
                            </div>
                            <div className="rr-tt-s">
                              โครงการ:{' '}
                              {cTotN === pTotN
                                ? `เท่ากับปี ${cmpYear}`
                                : cTotN > pTotN
                                ? `เพิ่มขึ้น +${cTotN - pTotN} โครงการ`
                                : `ลดลง -${pTotN - cTotN} โครงการ`}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="rr-tt-h">
                              <i style={{ backgroundColor: '#0ea5e9' }} />
                              <span>
                                {mName} {year}
                              </span>
                            </div>
                            {!hideExt && (
                              <div className="rr-tt-r">
                                <span>ทุนภายนอก</span>
                                <b>
                                  {cExtN} โครงการ · {cExtB.toFixed(2)} ลบ.
                                </b>
                              </div>
                            )}
                            {!hideInt && (
                              <div className="rr-tt-r">
                                <span>ทุนภายใน</span>
                                <b>
                                  {cIntN} โครงการ · {cIntB.toFixed(2)} ลบ.
                                </b>
                              </div>
                            )}
                            <div className="rr-tt-r">
                              <span>รวมทั้งหมด</span>
                              <b>
                                {cTotN} โครงการ · {cTotB.toFixed(2)} ลบ.
                              </b>
                            </div>
                            <div className="rr-tt-s">
                              เฉลี่ย {cTotN > 0 ? (cTotB / cTotN).toFixed(2) : '0.00'} ลบ./โครงการ · คลิกเพื่อดูรายการ
                            </div>
                          </div>
                        );
                        showTooltip(e, content);
                      }}
                    />
                  );
                })}

                {/* Bars per Month */}
                {MON.map((mName, i) => {
                  const x0 = L + slot * i;
                  const cx = x0 + slot / 2;
                  let colTopY = Tp + ph;

                  const cExtN = !hideExt ? curMonthly.extN[i] : 0;
                  const cIntN = !hideInt ? curMonthly.intN[i] : 0;
                  const cTotN = cExtN + cIntN;

                  const cExtB = !hideExt ? curMonthly.extB[i] : 0;
                  const cIntB = !hideInt ? curMonthly.intB[i] : 0;
                  const cTotB = cExtB + cIntB;

                  const pTotN = isCmp ? (!hideExt ? cmpMonthly.extN[i] : 0) + (!hideInt ? cmpMonthly.intN[i] : 0) : 0;
                  const pTotB = isCmp ? (!hideExt ? cmpMonthly.extB[i] : 0) + (!hideInt ? cmpMonthly.intB[i] : 0) : 0;

                  let barsSvg: React.ReactNode = null;

                  if (isCmp) {
                    const bw = Math.min(34, slot * 0.32);
                    const gap = 5;
                    const hC = (ph * cTotN) / (nzN.top || 1);
                    const hP = (ph * pTotN) / (nzN.top || 1);
                    colTopY = Math.min(Tp + ph - hC, Tp + ph - hP);
                    const isCmpHovered = activeMonthIdx === i && activeSegKey === 'cmp';
                    const isCurHovered = activeMonthIdx === i && activeSegKey === 'cur';

                    barsSvg = (
                      <>
                        {pTotN > 0 && (
                          <g>
                            <rect
                              className="rr-rise"
                              x={cx - bw - gap / 2}
                              y={Tp + ph - hP}
                              width={bw}
                              height={hP}
                              rx={Math.min(8, hP / 2)}
                              fill="var(--ghost)"
                              style={{
                                cursor: 'pointer',
                                filter: isCmpHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.95)' : 'none',
                                opacity: activeSegKey && !isCmpHovered ? 0.6 : 1,
                                transition: 'all 0.15s ease',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openDrawer(`โครงการวิจัยประจำเดือน${mName} ปีงบประมาณ ${cmpYear}`, getMonthItems(cmpItems, i, 'vis'));
                              }}
                              onPointerMove={(e) => {
                                e.stopPropagation();
                                setActiveMonthIdx(i);
                                setActiveSegKey('cmp');
                                setActiveDotMonth(null);
                                showTooltip(
                                  e,
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: '#cbd5e1' }} />
                                      <span>
                                        ปี {cmpYear} · {mName}
                                      </span>
                                    </div>
                                    <div className="rr-tt-v">
                                      <b>{pTotN}</b>
                                      <span>โครงการ</span>
                                    </div>
                                    <div className="rr-tt-s">งบประมาณ {pTotB.toFixed(2)} ล้านบาท · คลิกเพื่อดูรายการ</div>
                                  </div>
                                );
                              }}
                            />
                            <text
                              x={cx - bw / 2 - gap / 2}
                              y={Tp + ph - hP - 7}
                              textAnchor="middle"
                              fontSize="13"
                              fontWeight="800"
                              fill="#64748b"
                              pointerEvents="none"
                            >
                              {pTotN}
                            </text>
                          </g>
                        )}
                        {cTotN > 0 && (
                          <g>
                            <rect
                              className="rr-rise"
                              x={cx + gap / 2}
                              y={Tp + ph - hC}
                              width={bw}
                              height={hC}
                              rx={Math.min(8, hC / 2)}
                              fill="var(--cur)"
                              style={{
                                cursor: 'pointer',
                                filter: isCurHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                opacity: activeSegKey && !isCurHovered ? 0.6 : 1,
                                transition: 'all 0.15s ease',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openDrawer(`โครงการวิจัยประจำเดือน${mName} ปีงบประมาณ ${year}`, getMonthItems(curItems, i, 'vis'));
                              }}
                              onPointerMove={(e) => {
                                e.stopPropagation();
                                setActiveMonthIdx(i);
                                setActiveSegKey('cur');
                                setActiveDotMonth(null);
                                showTooltip(
                                  e,
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: '#6366f1' }} />
                                      <span>
                                        ปี {year} · {mName}
                                      </span>
                                    </div>
                                    <div className="rr-tt-v">
                                      <b>{cTotN}</b>
                                      <span>โครงการ</span>
                                    </div>
                                    <div className="rr-tt-s">งบประมาณ {cTotB.toFixed(2)} ล้านบาท · คลิกเพื่อดูรายการ</div>
                                  </div>
                                );
                              }}
                            />
                            <text
                              x={cx + bw / 2 + gap / 2}
                              y={Tp + ph - hC - 7}
                              textAnchor="middle"
                              fontSize="13.5"
                              fontWeight="800"
                              fill="#0f172a"
                              pointerEvents="none"
                            >
                              {cTotN}
                            </text>
                          </g>
                        )}
                      </>
                    );
                  } else if (barMode === 'group') {
                    const activeCount = visKeys.length;
                    const bw = Math.min(36, slot * 0.34);
                    const gap = 4;
                    const sx = cx - (activeCount * bw + (activeCount - 1) * gap) / 2;
                    const hExt = (ph * cExtN) / (nzN.top || 1);
                    const hInt = (ph * cIntN) / (nzN.top || 1);
                    const isExtHovered = activeMonthIdx === i && activeSegKey === 'ext';
                    const isIntHovered = activeMonthIdx === i && activeSegKey === 'int';

                    barsSvg = (
                      <>
                        {!hideExt && cExtN > 0 && (
                          <g>
                            <rect
                              className="rr-rise"
                              x={sx}
                              y={Tp + ph - hExt}
                              width={bw}
                              height={hExt}
                              rx={Math.min(8, hExt / 2)}
                              fill={FUND.ext.c}
                              style={{
                                cursor: 'pointer',
                                filter: isExtHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                opacity: activeSegKey && !isExtHovered ? 0.6 : 1,
                                transition: 'all 0.15s ease',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openDrawer(`โครงการวิจัย (ทุนภายนอก) — เดือน${mName} ปีงบประมาณ ${year}`, getMonthItems(curItems, i, 'ext'));
                              }}
                              onPointerMove={(e) => {
                                e.stopPropagation();
                                setActiveMonthIdx(i);
                                setActiveSegKey('ext');
                                setActiveDotMonth(null);
                                const pct = cTotN > 0 ? Math.round((cExtN / cTotN) * 100) : 0;
                                showTooltip(
                                  e,
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: FUND.ext.c }} />
                                      <span>
                                        {FUND.ext.n} · {mName} {year}
                                      </span>
                                    </div>
                                    <div className="rr-tt-v">
                                      <b>{cExtN}</b>
                                      <span>โครงการ</span>
                                    </div>
                                    <div className="rr-tt-s">
                                      {pct}% ของเดือนนี้ ({cTotN} โครงการ) · งบ {cExtB.toFixed(2)} ลบ.
                                    </div>
                                  </div>
                                );
                              }}
                            />
                            <text
                              x={sx + bw / 2}
                              y={Tp + ph - hExt - 7}
                              textAnchor="middle"
                              fontSize="13.5"
                              fontWeight="800"
                              fill="#0f172a"
                              pointerEvents="none"
                            >
                              {cExtN}
                            </text>
                          </g>
                        )}
                        {!hideInt && cIntN > 0 && (
                          <g>
                            <rect
                              className="rr-rise"
                              x={sx + (!hideExt ? bw + gap : 0)}
                              y={Tp + ph - hInt}
                              width={bw}
                              height={hInt}
                              rx={Math.min(8, hInt / 2)}
                              fill={FUND.int.c}
                              style={{
                                cursor: 'pointer',
                                filter: isIntHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                opacity: activeSegKey && !isIntHovered ? 0.6 : 1,
                                transition: 'all 0.15s ease',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openDrawer(`โครงการวิจัย (ทุนภายใน) — เดือน${mName} ปีงบประมาณ ${year}`, getMonthItems(curItems, i, 'int'));
                              }}
                              onPointerMove={(e) => {
                                e.stopPropagation();
                                setActiveMonthIdx(i);
                                setActiveSegKey('int');
                                setActiveDotMonth(null);
                                const pct = cTotN > 0 ? Math.round((cIntN / cTotN) * 100) : 0;
                                showTooltip(
                                  e,
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: FUND.int.c }} />
                                      <span>
                                        {FUND.int.n} · {mName} {year}
                                      </span>
                                    </div>
                                    <div className="rr-tt-v">
                                      <b>{cIntN}</b>
                                      <span>โครงการ</span>
                                    </div>
                                    <div className="rr-tt-s">
                                      {pct}% ของเดือนนี้ ({cTotN} โครงการ) · งบ {cIntB.toFixed(2)} ลบ.
                                    </div>
                                  </div>
                                );
                              }}
                            />
                            <text
                              x={sx + (!hideExt ? bw + gap : 0) + bw / 2}
                              y={Tp + ph - hInt - 7}
                              textAnchor="middle"
                              fontSize="13.5"
                              fontWeight="800"
                              fill="#0f172a"
                              pointerEvents="none"
                            >
                              {cIntN}
                            </text>
                          </g>
                        )}
                      </>
                    );
                    colTopY = Math.min(
                      cExtN ? Tp + ph - hExt : Tp + ph,
                      cIntN ? Tp + ph - hInt : Tp + ph
                    );
                  } else {
                    // Stack mode
                    const w2 = Math.min(52, slot * 0.54);
                    const gap = 3;
                    const segs = [
                      !hideExt && cExtN > 0 ? { k: 'ext' as const, n: FUND.ext.n, c: FUND.ext.c, v: cExtN, b: cExtB } : null,
                      !hideInt && cIntN > 0 ? { k: 'int' as const, n: FUND.int.n, c: FUND.int.c, v: cIntN, b: cIntB } : null,
                    ].filter(Boolean) as Array<{ k: 'ext' | 'int'; n: string; c: string; v: number; b: number }>;

                    let cum = 0;
                    colTopY = cTotN > 0 ? yL(cTotN) : Tp + ph;

                    barsSvg = (
                      <>
                        {segs.map((seg) => {
                          const y1 = yL(cum + seg.v);
                          const y0 = yL(cum);
                          const h = Math.max(y0 - y1 - gap, 4);
                          const segY = y1 + gap / 2;
                          const r = Math.min(7, h / 2);
                          const isHovered = activeMonthIdx === i && activeSegKey === seg.k;
                          cum += seg.v;

                          return (
                            <g key={seg.k}>
                              <rect
                                className="rr-rise"
                                x={cx - w2 / 2}
                                y={segY}
                                width={w2}
                                height={h}
                                rx={r}
                                fill={seg.c}
                                style={{
                                  cursor: 'pointer',
                                  filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                  opacity: activeSegKey && !isHovered ? 0.6 : 1,
                                  transition: 'all 0.15s ease',
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDrawer(
                                    `โครงการวิจัย (${seg.n}) — เดือน${mName} ปีงบประมาณ ${year}`,
                                    getMonthItems(curItems, i, seg.k)
                                  );
                                }}
                                onPointerMove={(e) => {
                                  e.stopPropagation();
                                  setActiveMonthIdx(i);
                                  setActiveSegKey(seg.k);
                                  setActiveDotMonth(null);
                                  const pct = cTotN > 0 ? Math.round((seg.v / cTotN) * 100) : 0;
                                  showTooltip(
                                    e,
                                    <div>
                                      <div className="rr-tt-h">
                                        <i style={{ backgroundColor: seg.c }} />
                                        <span>
                                          {seg.n} · {mName} {year}
                                        </span>
                                      </div>
                                      <div className="rr-tt-v">
                                        <b>{seg.v}</b>
                                        <span>โครงการ</span>
                                      </div>
                                      <div className="rr-tt-s">
                                        {pct}% ของเดือนนี้ ({cTotN} โครงการ) · งบ {seg.b.toFixed(2)} ลบ.
                                      </div>
                                    </div>
                                  );
                                }}
                              />
                              {h >= 15 && (
                                <text
                                  x={cx}
                                  y={segY + h / 2 + 5}
                                  textAnchor="middle"
                                  fontSize={h >= 24 ? '13.5' : '12.5'}
                                  fontWeight="800"
                                  fill="#ffffff"
                                  pointerEvents="none"
                                >
                                  {seg.v}
                                </text>
                              )}
                            </g>
                          );
                        })}
                        {cTotN > 0 && (
                          <text
                            x={cx}
                            y={yL(cTotN) - 8}
                            textAnchor="middle"
                            fontSize="14"
                            fontWeight="800"
                            fill="#0f172a"
                            pointerEvents="none"
                          >
                            {cTotN}
                          </text>
                        )}
                      </>
                    );
                  }

                  topYs[i] = colTopY;

                  return (
                    <g key={mName}>
                      {barsSvg}
                      <text
                        x={cx}
                        y={svgH - 12}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="700"
                        fill="#334155"
                      >
                        {mName}
                      </text>
                    </g>
                  );
                })}

                {/* Budget Lines */}
                {showLine && isCmp && (
                  <path
                    d={mono(cmpLinePts)}
                    fill="none"
                    stroke="#f59e0b"
                    strokeOpacity="0.7"
                    strokeWidth="2.5"
                    strokeDasharray="6 5"
                    strokeLinecap="round"
                    pointerEvents="none"
                  />
                )}

                {showLine && (
                  <g pointerEvents="none">
                    <path
                      d={mono(curLinePts)}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.9"
                    />
                    <path
                      className="rr-draw"
                      pathLength="1"
                      d={mono(curLinePts)}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}

                {showLine &&
                  curLinePts.map((pt, j) => {
                    const cExtB = !hideExt ? curMonthly.extB[j] : 0;
                    const cIntB = !hideInt ? curMonthly.intB[j] : 0;
                    const cTotB = cExtB + cIntB;
                    const cTotN = (!hideExt ? curMonthly.extN[j] : 0) + (!hideInt ? curMonthly.intN[j] : 0);
                    if (cTotB <= 0) return null;
                    const textVal = cTotB >= 10 ? cTotB.toFixed(1) : cTotB.toFixed(2);
                    const pillW = Math.max(40, textVal.length * 7 + 14);
                    const pillH = 20;
                    let py = pt[1] - 28;
                    const barTop = topYs[j];
                    if (barTop < Tp + ph && py < barTop - 2 && py + pillH > barTop - 20) {
                      py = pt[1] + 10;
                    }
                    const isDotActive = activeDotMonth === j;

                    return (
                      <g key={j}>
                        <circle
                          cx={pt[0]}
                          cy={pt[1]}
                          r={isDotActive ? 6.5 : 4}
                          fill="#ffffff"
                          stroke="#f59e0b"
                          strokeWidth={2.5}
                          style={{ transition: 'r 0.12s' }}
                          pointerEvents="none"
                        />
                        <rect
                          className="rr-pl"
                          x={pt[0] - pillW / 2}
                          y={py}
                          width={pillW}
                          height={pillH}
                          rx="10"
                        />
                        <text className="rr-pv" x={pt[0]} y={py + 14} textAnchor="middle">
                          {textVal}
                        </text>
                        <circle
                          cx={pt[0]}
                          cy={pt[1]}
                          r={15}
                          fill="transparent"
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDrawer(`โครงการวิจัยประจำเดือน${MON[j]} ปีงบประมาณ ${year}`, getMonthItems(curItems, j, 'vis'));
                          }}
                          onPointerMove={(e) => {
                            e.stopPropagation();
                            setActiveMonthIdx(j);
                            setActiveSegKey(null);
                            setActiveDotMonth(j);
                            showTooltip(
                              e,
                              <div>
                                <div className="rr-tt-h">
                                  <i style={{ backgroundColor: '#f59e0b', height: '4px', width: '12px', borderRadius: '2px' }} />
                                  <span>
                                    งบประมาณ · {MON[j]} {year}
                                  </span>
                                </div>
                                <div className="rr-tt-v">
                                  <b>{cTotB.toFixed(2)}</b>
                                  <span>ล้านบาท</span>
                                </div>
                                <div className="rr-tt-s">
                                  {cTotN} โครงการ · เฉลี่ย {cTotN > 0 ? (cTotB / cTotN).toFixed(2) : '0.00'} ลบ./โครงการ
                                </div>
                              </div>
                            );
                          }}
                        />
                      </g>
                    );
                  })}
              </svg>

              {/* Deltas Row if Compare — 100% Aligned with SVG Columns [L .. svgW - R] */}
              {isCmp && (
                <div style={{ marginTop: '6px', width: `${svgW}px` }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                    <span
                      style={{
                        width: `${L}px`,
                        flex: `0 0 ${L}px`,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--muted)',
                        textAlign: 'right',
                        paddingRight: '10px',
                      }}
                    >
                      โครงการ
                    </span>
                    <div
                      style={{
                        flex: 1,
                        marginRight: `${R}px`,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                      }}
                    >
                      {MON.map((_, i) => {
                        const cN = (!hideExt ? curMonthly.extN[i] : 0) + (!hideInt ? curMonthly.intN[i] : 0);
                        const pN = (!hideExt ? cmpMonthly.extN[i] : 0) + (!hideInt ? cmpMonthly.intN[i] : 0);
                        return (
                          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                            {renderChip(cN, pN, 'n')}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '6px' }}>
                    <span
                      style={{
                        width: `${L}px`,
                        flex: `0 0 ${L}px`,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--muted)',
                        textAlign: 'right',
                        paddingRight: '10px',
                      }}
                    >
                      งบ
                    </span>
                    <div
                      style={{
                        flex: 1,
                        marginRight: `${R}px`,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                      }}
                    >
                      {MON.map((_, i) => {
                        const cB = (!hideExt ? curMonthly.extB[i] : 0) + (!hideInt ? curMonthly.intB[i] : 0);
                        const pB = (!hideExt ? cmpMonthly.extB[i] : 0) + (!hideInt ? cmpMonthly.intB[i] : 0);
                        return (
                          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                            {renderChip(cB, pB, 'b')}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sumline */}
          <div className="rr-sumline">
            <span>
              ปี {year} รวม <b>{totalCurProjects}</b> โครงการ
            </span>
            {isCmp && renderChip(totalCurProjects, totalCmpProjects, 'n')}
            <span>
              งบประมาณ <b>{totalCurBudget.toFixed(2)}</b> ล้านบาท
            </span>
            {isCmp && renderChip(totalCurBudget, totalCmpBudget, 'b')}
            {isCmp ? (
              <span className="muted">
                เทียบปี {cmpYear} ({totalCmpProjects} โครงการ · {totalCmpBudget.toFixed(2)} ล้านบาท)
              </span>
            ) : (
              <span className="muted">
                เฉลี่ย {totalCurProjects > 0 ? (totalCurBudget / totalCurProjects).toFixed(2) : '0.00'} ล้านบาท/โครงการ
              </span>
            )}
          </div>

          {curMonthly.miss > 0 && (
            <p
              className="rr-note"
              style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
              onClick={() => {
                openDrawer(
                  `โครงการวิจัยที่ไม่ระบุเดือนเริ่มต้น — ปีงบประมาณ ${year}`,
                  curItems.filter((it) => resolveMonthIndex(it.start_date) === -1)
                );
              }}
            >
              หมายเหตุ: อีก {curMonthly.miss} โครงการไม่ระบุเดือนที่เริ่มต้น (งบประมาณ {curMonthly.missB.toFixed(2)} ล้านบาท) จึงไม่ปรากฏในกราฟรายเดือน (คลิกเพื่อดูรายการ)
            </p>
          )}
        </section>

        {/* CARD 2: Funding Source Donut */}
        <section className="rr-card rr-full" aria-labelledby="t3">
          <div className="rr-head">
            <h2 className="rr-title-h2" id="t3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M12 3a9 9 0 1 0 9 9h-9z" />
              </svg>
              <span>สัดส่วนงบประมาณตามแหล่งทุนวิจัย</span>
            </h2>
          </div>
          {isCmp && (
            <p className="rr-note">
              วงนอก: ปี {year} · วงใน: ปี {cmpYear}
            </p>
          )}

          <div className="rr-dn">
            <svg viewBox="0 0 260 260" role="img" style={{ width: '260px', height: '260px' }}>
              {/* Outer Ring */}
              {(() => {
                const r = isCmp ? 100 : 92;
                const sw = isCmp ? 34 : 46;
                const C = 2 * Math.PI * r;
                let off = 0;
                return curSources.entries.map(([name, bVal], idx) => {
                  const col = PAL[idx % PAL.length];
                  const len = curSources.total > 0 ? (bVal / curSources.total) * C : 0;
                  const pct = curSources.total > 0 ? (bVal / curSources.total) * 100 : 0;
                  const el = (
                    <circle
                      key={name}
                      className="rr-sg"
                      cx="130"
                      cy="130"
                      r={r}
                      fill="none"
                      stroke={col}
                      strokeWidth={sw}
                      strokeDasharray={`${Math.max(len - 2, 0)} ${C - Math.max(len - 2, 0)}`}
                      strokeDashoffset={-off}
                      transform="rotate(-90 130 130)"
                      onClick={() => {
                        openDrawer(
                          `โครงการวิจัยจากแหล่งทุน: ${name} (ปีงบประมาณ ${year})`,
                          curItems.filter((it) => normalizeFundSource(it.fund_source) === name)
                        );
                      }}
                      onMouseEnter={(e) => {
                        showTooltip(
                          e,
                          <div>
                            <div className="rr-tt-h">
                              <i style={{ backgroundColor: col }} />
                              <span>{name}</span>
                            </div>
                            <div className="rr-tt-r">
                              <span>ปี {year}</span>
                              <b>{bVal.toFixed(2)} ลบ.</b>
                            </div>
                            <div className="rr-tt-r">
                              <span>สัดส่วน</span>
                              <b>{pct.toFixed(1)}%</b>
                            </div>
                            <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                          </div>
                        );
                      }}
                      onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
                    />
                  );
                  off += len;
                  return el;
                });
              })()}

              {/* Inner Ring if Compare */}
              {isCmp &&
                (() => {
                  const r = 62;
                  const sw = 22;
                  const C = 2 * Math.PI * r;
                  let off = 0;
                  return cmpSources.entries.map(([name, bVal], idx) => {
                    const col = PAL[idx % PAL.length];
                    const len = cmpSources.total > 0 ? (bVal / cmpSources.total) * C : 0;
                    const el = (
                      <circle
                        key={name + '_cmp'}
                        className="rr-sg"
                        cx="130"
                        cy="130"
                        r={r}
                        fill="none"
                        stroke={col}
                        strokeWidth={sw}
                        strokeDasharray={`${Math.max(len - 2, 0)} ${C - Math.max(len - 2, 0)}`}
                        strokeDashoffset={-off}
                        transform="rotate(-90 130 130)"
                        onClick={() => {
                          openDrawer(
                            `โครงการวิจัยจากแหล่งทุน: ${name} (ปีงบประมาณ ${cmpYear})`,
                            cmpItems.filter((it) => normalizeFundSource(it.fund_source) === name)
                          );
                        }}
                      />
                    );
                    off += len;
                    return el;
                  });
                })()}

              {/* Center text */}
              <text x="130" y={isCmp ? 124 : 126} textAnchor="middle" fontSize="20" fill="var(--ink)" fontWeight="700">
                {curSources.total.toFixed(1)}
              </text>
              <text x="130" y={isCmp ? 142 : 144} textAnchor="middle" fontSize="11" fill="var(--muted)">
                ล้านบาท
              </text>
            </svg>

            {/* Sources List */}
            <div className="rr-dl">
              {curSources.entries.map(([name, bVal], idx) => {
                const cmpVal = cmpSources.entries.find((e) => e[0] === name)?.[1] || 0;
                return (
                  <div
                    key={name}
                    style={{
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    onClick={() => {
                      openDrawer(
                        `โครงการวิจัยจากแหล่งทุน: ${name} (ปีงบประมาณ ${year})`,
                        curItems.filter((it) => normalizeFundSource(it.fund_source) === name)
                      );
                    }}
                  >
                    <i style={{ backgroundColor: PAL[idx % PAL.length] }} />
                    <span>{name}</span>
                    <b>{bVal.toFixed(1)}</b>
                    {isCmp && renderChip(bVal, cmpVal, 'b')}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CARD 3: Distribution Chart */}
        <section className="rr-card rr-full" aria-labelledby="t4">
          <div className="rr-head">
            <h2 className="rr-title-h2" id="t4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />
              </svg>
              <span>การกระจายโครงการตาม{DIMS[dim]?.n}</span>
            </h2>
            <div className="rr-ctrls">
              <div className="rr-seg-ctl" role="group" aria-label="มิติที่ใช้แบ่งกลุ่มโครงการ">
                {Object.keys(DIMS).map((k) => (
                  <button key={k} type="button" aria-pressed={dim === k} onClick={() => setDim(k)}>
                    {DIMS[k].n}
                  </button>
                ))}
              </div>
              <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัด">
                <button type="button" aria-pressed={m4 === 'n'} onClick={() => setM4('n')}>
                  จำนวนโครงการ
                </button>
                <button type="button" aria-pressed={m4 === 'b'} onClick={() => setM4('b')}>
                  งบประมาณรวม
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="rr-legend">
            {dim === 'trl' && !isCmp ? (
              <>
                <span className="rr-pill st" style={{ '--c': '#c4b5fd' } as React.CSSProperties}>
                  <i />
                  TRL เมื่อเริ่มต้น
                </span>
                <span className="rr-pill st" style={{ '--c': '#8b5cf6' } as React.CSSProperties}>
                  <i />
                  TRL เมื่อสิ้นสุด
                </span>
              </>
            ) : isCmp ? (
              <>
                <span className="rr-pill st" style={{ '--c': 'var(--cur)' } as React.CSSProperties}>
                  <i />
                  ปี {year}
                </span>
                <span className="rr-pill st" style={{ '--c': 'var(--ghost)' } as React.CSSProperties}>
                  <i />
                  ปี {cmpYear}
                </span>
              </>
            ) : (
              <>
                <span className="rr-pill st" style={{ '--c': FUND.ext.c } as React.CSSProperties}>
                  <i />
                  {FUND.ext.n}
                </span>
                <span className="rr-pill st" style={{ '--c': FUND.int.c } as React.CSSProperties}>
                  <i />
                  {FUND.int.n}
                </span>
              </>
            )}
          </div>

          {/* Full-Width Responsive SVG Distribution Chart + Aligned Deltas */}
          {(() => {
            const cats = DIMS[dim].c;
            const N = cats.length;
            const trl2 = dim === 'trl' && !isCmp;

            let mx = 0;
            for (let i = 0; i < N; i++) {
              const curTot = curDist.ext[i] + curDist.int[i];
              const cmpTot = isCmp ? cmpDist.ext[i] + cmpDist.int[i] : 0;
              mx = Math.max(mx, trl2 ? Math.max(curDist.stTrl[i], curDist.enTrl[i]) : Math.max(curTot, cmpTot));
            }

            const nz = nice(mx, m4 === 'n');
            const nT = Math.round(nz.top / nz.step);
            const dW = distPlotWidth;
            const dH = 330;
            const dL = 56;
            const dR = 28;
            const dPw = dW - dL - dR;
            const dPh = dH - Tp - B;
            const dSlot = dPw / N;
            const yDist = (v: number) => Tp + dPh - (dPh * v) / (nz.top || 1);

            return (
              <div className="rr-scroller" ref={distScrollerRef}>
                <div
                  className="rr-plot"
                  style={{ minWidth: '760px', width: `${dW}px` }}
                  onPointerLeave={clearDistHover}
                >
                  <svg
                    width={dW}
                    height={dH}
                    viewBox={`0 0 ${dW} ${dH}`}
                    style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}
                    role="img"
                  >
                    {Array.from({ length: nT + 1 }).map((_, i) => {
                      const tVal = i * nz.step;
                      const y = yDist(tVal);
                      return (
                        <g key={i}>
                          <line
                            x1={dL}
                            x2={dW - dR}
                            y1={y}
                            y2={y}
                            stroke="#e8edf3"
                            strokeWidth={1}
                            strokeDasharray={i === 0 ? 'none' : '3 5'}
                          />
                          <text x={dL - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="500" fill="var(--muted)">
                            {Math.round(tVal * 10) / 10}
                          </text>
                        </g>
                      );
                    })}

                    <text
                      transform={`translate(16, ${Tp + dPh / 2}) rotate(-90)`}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      fill="var(--muted)"
                    >
                      {m4 === 'n' ? 'จำนวนโครงการ (โครงการ)' : 'งบประมาณ (ล้านบาท)'}
                    </text>

                    {/* Column Hover Highlight Rects */}
                    {cats.map((_, i) => {
                      const x0 = dL + dSlot * i;
                      const isOn = activeDistIdx === i;
                      return (
                        <rect
                          key={`distbg-${i}`}
                          x={x0 + 4}
                          y={Tp - 6}
                          width={dSlot - 8}
                          height={dPh + 6}
                          rx="14"
                          fill="rgba(15, 23, 42, 0.05)"
                          opacity={isOn ? 1 : 0}
                          style={{ transition: 'opacity 0.12s' }}
                          pointerEvents="none"
                        />
                      );
                    })}

                    {cats.map((cat, i) => {
                      const x0 = dL + dSlot * i;
                      const cx = x0 + dSlot / 2;
                      const curTot = curDist.ext[i] + curDist.int[i];
                      const cmpTot = isCmp ? cmpDist.ext[i] + cmpDist.int[i] : 0;

                      let barsContent: React.ReactNode = null;

                      if (trl2) {
                        const bw = Math.min(32, dSlot * 0.34);
                        const gap = 4;
                        const hS = (dPh * curDist.stTrl[i]) / (nz.top || 1);
                        const hE = (dPh * curDist.enTrl[i]) / (nz.top || 1);
                        const isSHovered = activeDistIdx === i && activeDistSeg === 'st';
                        const isEHovered = activeDistIdx === i && activeDistSeg === 'en';
                        barsContent = (
                          <>
                            {curDist.stTrl[i] > 0 && (
                              <g>
                                <rect
                                  className="rr-rise"
                                  x={cx - bw - gap / 2}
                                  y={Tp + dPh - hS}
                                  width={bw}
                                  height={hS}
                                  rx={Math.min(8, hS / 2)}
                                  fill="#c4b5fd"
                                  style={{
                                    cursor: 'pointer',
                                    filter: isSHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.95)' : 'none',
                                    opacity: activeDistSeg && !isSHovered ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDrawer(
                                      `โครงการวิจัยระดับเริ่มต้น ${cat} (ปีงบประมาณ ${year})`,
                                      curItems.filter((it) => {
                                        const s = it.start_trl ? Number(it.start_trl) : 0;
                                        return (s >= 1 && s <= 9 ? s - 1 : 9) === i;
                                      })
                                    );
                                  }}
                                  onPointerMove={(e) => {
                                    e.stopPropagation();
                                    setActiveDistIdx(i);
                                    setActiveDistSeg('st');
                                  }}
                                />
                                <text
                                  x={cx - bw / 2 - gap / 2}
                                  y={Tp + dPh - hS - 7}
                                  textAnchor="middle"
                                  fontSize="13"
                                  fontWeight="800"
                                  fill="#475569"
                                  pointerEvents="none"
                                >
                                  {m4 === 'n' ? curDist.stTrl[i] : (Math.round(curDist.stTrl[i] * 10) / 10).toFixed(1)}
                                </text>
                              </g>
                            )}
                            {curDist.enTrl[i] > 0 && (
                              <g>
                                <rect
                                  className="rr-rise"
                                  x={cx + gap / 2}
                                  y={Tp + dPh - hE}
                                  width={bw}
                                  height={hE}
                                  rx={Math.min(8, hE / 2)}
                                  fill="#8b5cf6"
                                  style={{
                                    cursor: 'pointer',
                                    filter: isEHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                    opacity: activeDistSeg && !isEHovered ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDrawer(
                                      `โครงการวิจัยระดับสิ้นสุด ${cat} (ปีงบประมาณ ${year})`,
                                      curItems.filter((it) => {
                                        const en = it.end_trl ? Number(it.end_trl) : 0;
                                        return (en >= 1 && en <= 9 ? en - 1 : 9) === i;
                                      })
                                    );
                                  }}
                                  onPointerMove={(e) => {
                                    e.stopPropagation();
                                    setActiveDistIdx(i);
                                    setActiveDistSeg('en');
                                  }}
                                />
                                <text
                                  x={cx + bw / 2 + gap / 2}
                                  y={Tp + dPh - hE - 7}
                                  textAnchor="middle"
                                  fontSize="13.5"
                                  fontWeight="800"
                                  fill="#0f172a"
                                  pointerEvents="none"
                                >
                                  {m4 === 'n' ? curDist.enTrl[i] : (Math.round(curDist.enTrl[i] * 10) / 10).toFixed(1)}
                                </text>
                              </g>
                            )}
                          </>
                        );
                      } else if (isCmp) {
                        const bw = Math.min(38, dSlot * 0.28);
                        const gap = 5;
                        const hC = (dPh * curTot) / (nz.top || 1);
                        const hP = (dPh * cmpTot) / (nz.top || 1);
                        const isCmpHov = activeDistIdx === i && activeDistSeg === 'cmp';
                        const isCurHov = activeDistIdx === i && activeDistSeg === 'cur';
                        barsContent = (
                          <>
                            {cmpTot > 0 && (
                              <g>
                                <rect
                                  className="rr-rise"
                                  x={cx - bw - gap / 2}
                                  y={Tp + dPh - hP}
                                  width={bw}
                                  height={hP}
                                  rx={Math.min(8, hP / 2)}
                                  fill="var(--ghost)"
                                  style={{
                                    cursor: 'pointer',
                                    filter: isCmpHov ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.95)' : 'none',
                                    opacity: activeDistSeg && !isCmpHov ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDrawer(
                                      `โครงการวิจัยหมวด "${cat}" (${DIMS[dim]?.n} · ปีงบประมาณ ${cmpYear})`,
                                      cmpItems.filter((it) => getDistBucketIndex(it, dim) === i)
                                    );
                                  }}
                                  onPointerMove={(e) => {
                                    e.stopPropagation();
                                    setActiveDistIdx(i);
                                    setActiveDistSeg('cmp');
                                  }}
                                />
                                <text
                                  x={cx - bw / 2 - gap / 2}
                                  y={Tp + dPh - hP - 7}
                                  textAnchor="middle"
                                  fontSize="13"
                                  fontWeight="800"
                                  fill="#64748b"
                                  pointerEvents="none"
                                >
                                  {m4 === 'n' ? cmpTot : (Math.round(cmpTot * 10) / 10).toFixed(1)}
                                </text>
                              </g>
                            )}
                            {curTot > 0 && (
                              <g>
                                <rect
                                  className="rr-rise"
                                  x={cx + gap / 2}
                                  y={Tp + dPh - hC}
                                  width={bw}
                                  height={hC}
                                  rx={Math.min(8, hC / 2)}
                                  fill="var(--cur)"
                                  style={{
                                    cursor: 'pointer',
                                    filter: isCurHov ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                    opacity: activeDistSeg && !isCurHov ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDrawer(
                                      `โครงการวิจัยหมวด "${cat}" (${DIMS[dim]?.n} · ปีงบประมาณ ${year})`,
                                      curItems.filter((it) => getDistBucketIndex(it, dim) === i)
                                    );
                                  }}
                                  onPointerMove={(e) => {
                                    e.stopPropagation();
                                    setActiveDistIdx(i);
                                    setActiveDistSeg('cur');
                                  }}
                                />
                                <text
                                  x={cx + bw / 2 + gap / 2}
                                  y={Tp + dPh - hC - 7}
                                  textAnchor="middle"
                                  fontSize="13.5"
                                  fontWeight="800"
                                  fill="#0f172a"
                                  pointerEvents="none"
                                >
                                  {m4 === 'n' ? curTot : (Math.round(curTot * 10) / 10).toFixed(1)}
                                </text>
                              </g>
                            )}
                          </>
                        );
                      } else {
                        const w2 = Math.min(58, dSlot * 0.45);
                        const gap = 3;
                        const segs = [
                          curDist.ext[i] > 0 ? { k: 'ext' as const, n: FUND.ext.n, c: FUND.ext.c, v: curDist.ext[i] } : null,
                          curDist.int[i] > 0 ? { k: 'int' as const, n: FUND.int.n, c: FUND.int.c, v: curDist.int[i] } : null,
                        ].filter(Boolean) as Array<{ k: 'ext' | 'int'; n: string; c: string; v: number }>;

                        let cum = 0;

                        barsContent = (
                          <>
                            {segs.map((seg) => {
                              const y1 = yDist(cum + seg.v);
                              const y0 = yDist(cum);
                              const h = Math.max(y0 - y1 - gap, 4);
                              const segY = y1 + gap / 2;
                              const r = Math.min(8, h / 2);
                              const isHovered = activeDistIdx === i && activeDistSeg === seg.k;
                              cum += seg.v;

                              return (
                                <g key={seg.k}>
                                  <rect
                                    className="rr-rise"
                                    x={cx - w2 / 2}
                                    y={segY}
                                    width={w2}
                                    height={h}
                                    rx={r}
                                    fill={seg.c}
                                    style={{
                                      cursor: 'pointer',
                                      filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                      opacity: activeDistSeg && !isHovered ? 0.6 : 1,
                                      transition: 'all 0.15s ease',
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDrawer(
                                        `โครงการวิจัยหมวด "${cat}" (${seg.n} · ปีงบประมาณ ${year})`,
                                        curItems.filter(
                                          (it) =>
                                            getDistBucketIndex(it, dim) === i &&
                                            (seg.k === 'ext' ? isExternalResearchItem(it) : !isExternalResearchItem(it))
                                        )
                                      );
                                    }}
                                    onPointerMove={(e) => {
                                      e.stopPropagation();
                                      setActiveDistIdx(i);
                                      setActiveDistSeg(seg.k);
                                      showTooltip(
                                        e,
                                        <div>
                                          <div className="rr-tt-h">
                                            <i style={{ backgroundColor: seg.c }} />
                                            <span>
                                              {seg.n} · {cat}
                                            </span>
                                          </div>
                                          <div className="rr-tt-v">
                                            <b>{m4 === 'n' ? seg.v : seg.v.toFixed(2)}</b>
                                            <span>{m4 === 'n' ? 'โครงการ' : 'ล้านบาท'}</span>
                                          </div>
                                          <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                                        </div>
                                      );
                                    }}
                                  />
                                  {h >= 15 && (
                                    <text
                                      x={cx}
                                      y={segY + h / 2 + 5}
                                      textAnchor="middle"
                                      fontSize="13"
                                      fontWeight="800"
                                      fill="#ffffff"
                                      pointerEvents="none"
                                    >
                                      {m4 === 'n' ? seg.v : seg.v.toFixed(1)}
                                    </text>
                                  )}
                                </g>
                              );
                            })}
                            {curTot > 0 && (
                              <text
                                x={cx}
                                y={yDist(curTot) - 8}
                                textAnchor="middle"
                                fontSize="14"
                                fontWeight="800"
                                fill="#0f172a"
                                pointerEvents="none"
                              >
                                {m4 === 'n' ? curTot : (Math.round(curTot * 10) / 10).toFixed(1)}
                              </text>
                            )}
                          </>
                        );
                      }

                      return (
                        <g
                          key={cat}
                          onClick={() => {
                            const curList = curItems.filter((it) => getDistBucketIndex(it, dim) === i);
                            if (isCmp && curList.length === 0) {
                              openDrawer(
                                `โครงการวิจัยหมวด "${cat}" (${DIMS[dim]?.n} · ปีงบประมาณ ${cmpYear})`,
                                cmpItems.filter((it) => getDistBucketIndex(it, dim) === i)
                              );
                            } else {
                              openDrawer(
                                `โครงการวิจัยหมวด "${cat}" (${DIMS[dim]?.n} · ปีงบประมาณ ${year})`,
                                curList
                              );
                            }
                          }}
                          onPointerMove={(e) => {
                            setActiveDistIdx(i);
                            showTooltip(
                              e,
                              <div>
                                <div className="rr-tt-h">
                                  <i style={{ backgroundColor: isCmp ? '#6366f1' : '#0ea5e9' }} />
                                  <span>{cat}</span>
                                </div>
                                {isCmp ? (
                                  <>
                                    <div className="rr-tt-r">
                                      <span>ปี {year}</span>
                                      <b>{m4 === 'n' ? `${curTot} โครงการ` : `${curTot.toFixed(2)} ลบ.`}</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>ปี {cmpYear}</span>
                                      <b>{m4 === 'n' ? `${cmpTot} โครงการ` : `${cmpTot.toFixed(2)} ลบ.`}</b>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="rr-tt-r">
                                      <span>ทุนภายนอก</span>
                                      <b>{m4 === 'n' ? `${curDist.ext[i]} โครงการ` : `${curDist.ext[i].toFixed(2)} ลบ.`}</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>ทุนภายใน</span>
                                      <b>{m4 === 'n' ? `${curDist.int[i]} โครงการ` : `${curDist.int[i].toFixed(2)} ลบ.`}</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>รวม</span>
                                      <b>{m4 === 'n' ? `${curTot} โครงการ` : `${curTot.toFixed(2)} ลบ.`}</b>
                                    </div>
                                  </>
                                )}
                                <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                              </div>
                            );
                          }}
                        >
                          <rect x={x0} y={Tp - 6} width={dSlot} height={dPh + 6} fill="transparent" style={{ cursor: 'pointer' }} />
                          {barsContent}
                          <text x={cx} y={dH - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">
                            {cat}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Deltas if compare — 100% Aligned with SVG Columns [dL .. dW - dR] */}
                  {isCmp && (
                    <div
                      style={{
                        marginTop: '6px',
                        marginLeft: `${dL}px`,
                        marginRight: `${dR}px`,
                        display: 'grid',
                        gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`,
                      }}
                    >
                      {cats.map((_, i) => {
                        const cv = curDist.ext[i] + curDist.int[i];
                        const pv = cmpDist.ext[i] + cmpDist.int[i];
                        return (
                          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                            {renderChip(cv, pv, m4)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Distribution Summary line */}
          <div className="rr-sumline">
            <span>
              รวม <b>{totalCurProjects}</b> โครงการ
            </span>
            <span>
              งบประมาณ <b>{totalCurBudget.toFixed(2)}</b> ล้านบาท
            </span>
            <span className="muted">
              เฉลี่ย {totalCurProjects > 0 ? (totalCurBudget / totalCurProjects).toFixed(2) : '0.00'} ล้านบาท/โครงการ
            </span>
          </div>
          <p className="rr-note">โครงการที่ยังไม่กรอกข้อมูลจะอยู่ในหมวด ไม่ระบุ</p>
        </section>
      </div>

      {/* Floating Tooltip */}
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

      {/* Slide-over Project Detail Drawer */}
      <DrillDownProjectDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState((prev) => ({ ...prev, isOpen: false }))}
        title={drawerState.title}
        accentColor="#00A651"
        categoryKey="research"
        items={drawerState.items}
      />
    </div>
  );
}
