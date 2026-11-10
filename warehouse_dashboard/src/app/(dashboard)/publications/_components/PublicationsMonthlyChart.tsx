'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import { PublicationItem } from '../_hooks/usePublicationsData';
import { YearSelectDropdown } from '@/components/ui/YearSelectDropdown';
import { STANDARD_YEAR_OPTIONS, getDefaultCompareYear } from '@/lib/fiscalYears';
import '../../research/_components/research-redesign.css';

export interface PublicationsMonthlyChartProps {
  validData: PublicationItem[];
  currentFiscalYear?: string;
  onSelectPeriod?: (monthIndex: number, year: number | string, items: PublicationItem[]) => void;
}

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export const PUB_LEVELS = [
  { k: 'q1', n: 'Q1', c: '#9f1239' },
  { k: 'q2', n: 'Q2', c: '#e11d48' },
  { k: 'q3', n: 'Q3', c: '#fb7185' },
  { k: 'q4', n: 'Q4', c: '#fecdd3' },
  { k: 't1', n: 'TCI 1', c: '#4338ca' },
  { k: 't2', n: 'TCI 2', c: '#818cf8' },
  { k: 't3', n: 'TCI 3', c: '#c7d2fe' },
] as const;

export const PUB_CHART_COLORS = {
  line: '#0f766e',
  lineInk: '#0f766e',
  g0: '#fb7185',
  g1: '#be123c',
  cur: '#be123c',
  curInk: '#9f1239',
  total: '#e11d48',
};

// Monotone cubic spline curve algorithm (Fritsch-Carlson)
function monoSpline(p: Array<{ x: number; y: number }>): string {
  const n = p.length;
  if (n === 0) return '';
  if (n === 1) return `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`;

  const dx: number[] = [];
  const m: number[] = [];
  const t: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    dx[i] = p[i + 1].x - p[i].x;
    m[i] = (p[i + 1].y - p[i].y) / (dx[i] || 1);
  }

  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) {
    t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  }

  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
    } else {
      const a = t[i] / m[i];
      const b = t[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) {
        const k = 3 / Math.sqrt(s);
        t[i] = k * a * m[i];
        t[i + 1] = k * b * m[i];
      }
    }
  }

  let d = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    d += ` C${(p[i].x + dx[i] / 3).toFixed(1)},${(p[i].y + (t[i] * dx[i]) / 3).toFixed(1)} ` +
      `${(p[i + 1].x - dx[i] / 3).toFixed(1)},${(p[i + 1].y - (t[i + 1] * dx[i]) / 3).toFixed(1)} ` +
      `${p[i + 1].x.toFixed(1)},${p[i + 1].y.toFixed(1)}`;
  }
  return d;
}

const THAI_MONTH_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];
const ENG_MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function parseMonthIndex(raw: unknown): number | null {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase();
  if (!s || s === '-' || s === 'nan' || s === 'nat') return null;

  // 1. Full Thai month name
  for (let i = 0; i < THAI_MONTH_FULL.length; i++) {
    if (s.includes(THAI_MONTH_FULL[i])) return i;
  }

  // 2. Short Thai month name with or without trailing dot (e.g. 'ม.ค.', 'ม.ค.68', 'ม.ค', 'มค')
  for (let i = 0; i < MONTHS.length; i++) {
    const shortM = MONTHS[i];
    const rawShort = shortM.replace(/\./g, '');
    if (s.includes(shortM) || s.includes(shortM.slice(0, -1))) return i;
    const reg = new RegExp(`(^|[^ก-๙])${rawShort}(\\d{2}|\\d{4}|\\s|$)`);
    if (reg.test(s)) return i;
  }

  // 3. English month names
  for (let i = 0; i < ENG_MONTHS.length; i++) {
    const reg = new RegExp(`\\b${ENG_MONTHS[i]}`, 'i');
    if (reg.test(s)) return i;
  }

  // 4. ISO month (e.g. '2025-04' or '2025-04-15' or purely numeric '04')
  const isoMatch = s.match(/(?:^|\D)(\d{4})-(0?[1-9]|1[0-2])(?:\D|$)/);
  if (isoMatch) {
    return parseInt(isoMatch[2], 10) - 1;
  }
  if (/^(0?[1-9]|1[0-2])$/.test(s)) {
    return parseInt(s, 10) - 1;
  }

  return null;
}

function extractItemYearAndMonth(item: PublicationItem): { yearBe: number; monthIdx: number } | null {
  let yearBe = Number(item.fiscal_year_be);
  let monthIdx: number | null = null;

  // 1. Month field (e.g. 'ม.ค.68', 'เม.ย.68', 'มีนาคม')
  if (item.month) {
    monthIdx = parseMonthIndex(item.month);
    const yMatch = String(item.month).match(/(\d{2})$/);
    if (yMatch && (!yearBe || isNaN(yearBe))) {
      const yy = Number(yMatch[1]);
      yearBe = yy >= 50 ? 2500 + yy : 2000 + yy;
    }
  }

  // 2. Month-year field (e.g. 'มีนาคม 2569', '2025-04', 'ม.ค.68 2568')
  if (monthIdx === null && item.month_year) {
    monthIdx = parseMonthIndex(item.month_year);
  }

  // 3. Fallback to date / filing_date / publish_date
  if (monthIdx === null) {
    const rawDate = String(item.date || item.filing_date || item.publish_date || '');
    monthIdx = parseMonthIndex(rawDate);
    const dMatch = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec(rawDate);
    if (dMatch) {
      const y = Number(dMatch[1]);
      if (!yearBe || isNaN(yearBe)) {
        yearBe = y > 2400 ? y : y + 543;
      }
    }
  }

  // 4. Fallback to journal / remarks text (e.g. 'February 2025' or 'มีนาคม 2568')
  if (monthIdx === null && item.journal) {
    monthIdx = parseMonthIndex(item.journal);
  }
  if (monthIdx === null && item.remarks) {
    monthIdx = parseMonthIndex(item.remarks);
  }

  // Resolve Year if still missing or NaN
  if (!yearBe || isNaN(yearBe)) {
    const allText = [item.month_year, item.month, item.date, item.journal, item.remarks].filter(Boolean).join(' ');
    const yBe = allText.match(/(25\d{2})/);
    if (yBe) {
      yearBe = Number(yBe[1]);
    } else {
      const yCe = allText.match(/(20\d{2})/);
      if (yCe) {
        yearBe = Number(yCe[1]) + 543;
      }
    }
  }

  if (monthIdx === null || isNaN(yearBe)) return null;
  return { yearBe, monthIdx };
}

export function PublicationsMonthlyChart({ validData, currentFiscalYear, onSelectPeriod }: PublicationsMonthlyChartProps) {
  // 1. Group records by Year and Month into structured buckets
  const datasetByYear = useMemo(() => {
    const map: Record<
      number,
      {
        levels: Record<string, number[]>;
        fund: number[];
        items: PublicationItem[][];
      }
    > = {};

    validData.forEach((item) => {
      const info = extractItemYearAndMonth(item);
      if (!info) return;
      const { yearBe, monthIdx } = info;

      if (!map[yearBe]) {
        map[yearBe] = {
          levels: {
            q1: Array(12).fill(0),
            q2: Array(12).fill(0),
            q3: Array(12).fill(0),
            q4: Array(12).fill(0),
            t1: Array(12).fill(0),
            t2: Array(12).fill(0),
            t3: Array(12).fill(0),
          },
          fund: Array(12).fill(0),
          items: Array.from({ length: 12 }, () => []),
        };
      }

      const budget = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      const tier = String(autoDetectJournalRanking(item.journal || '', item.level || ''));
      let lKey = 'q1';
      if (tier === 'Q1') lKey = 'q1';
      else if (tier === 'Q2') lKey = 'q2';
      else if (tier === 'Q3') lKey = 'q3';
      else if (tier === 'Q4') lKey = 'q4';
      else if (tier === 'TCI 1' || tier === 'TCI') lKey = 't1';
      else if (tier === 'TCI 2') lKey = 't2';
      else if (tier === 'TCI 3') lKey = 't3';
      else lKey = 't1';

      if (map[yearBe].levels[lKey]) {
        map[yearBe].levels[lKey][monthIdx]++;
      }
      map[yearBe].fund[monthIdx] += budget;
      map[yearBe].items[monthIdx].push(item);
    });

    return map;
  }, [validData]);

  const availableYears = useMemo(() => Array.from(STANDARD_YEAR_OPTIONS), []);

  const hasDataByYear = useMemo(() => {
    return availableYears.reduce<Record<string, boolean>>((acc, y) => {
      const d = datasetByYear[Number(y)];
      acc[y] = Boolean(d && d.items.some((arr) => arr.length > 0));
      return acc;
    }, {});
  }, [availableYears, datasetByYear]);

  // States
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    if (currentFiscalYear && (currentFiscalYear === 'all' || availableYears.includes(currentFiscalYear))) {
      return currentFiscalYear;
    }
    return availableYears[0] || '2569';
  });
  const [compareYear, setCompareYear] = useState<string>(() => {
    return getDefaultCompareYear(selectedYear, availableYears);
  });

  useEffect(() => {
    if (currentFiscalYear && (currentFiscalYear === 'all' || availableYears.includes(currentFiscalYear))) {
      setSelectedYear(currentFiscalYear);
    }
  }, [currentFiscalYear, availableYears]);

  const [mode, setMode] = useState<'total' | 'level' | 'compare'>('level');
  const [metric, setMetric] = useState<'count' | 'fund'>('count');
  const [hiddenLevels, setHiddenLevels] = useState<Record<string, boolean>>({});
  const [showFundLine, setShowFundLine] = useState<boolean>(true);

  // Active year datasets
  const currentData = useMemo(() => {
    if (selectedYear === 'all') {
      const allLevels: Record<string, number[]> = {
        q1: Array(12).fill(0),
        q2: Array(12).fill(0),
        q3: Array(12).fill(0),
        q4: Array(12).fill(0),
        t1: Array(12).fill(0),
        t2: Array(12).fill(0),
        t3: Array(12).fill(0),
      };
      const allFund = Array(12).fill(0);
      const allItems: PublicationItem[][] = Array.from({ length: 12 }, () => []);

      Object.values(datasetByYear).forEach((yData) => {
        for (let i = 0; i < 12; i++) {
          Object.keys(allLevels).forEach((k) => {
            allLevels[k][i] += yData.levels[k]?.[i] || 0;
          });
          allFund[i] += yData.fund[i] || 0;
          allItems[i].push(...yData.items[i]);
        }
      });

      return {
        levels: allLevels,
        fund: allFund,
        items: allItems,
      };
    }

    return (
      datasetByYear[Number(selectedYear)] || {
        levels: {
          q1: Array(12).fill(0),
          q2: Array(12).fill(0),
          q3: Array(12).fill(0),
          q4: Array(12).fill(0),
          t1: Array(12).fill(0),
          t2: Array(12).fill(0),
          t3: Array(12).fill(0),
        },
        fund: Array(12).fill(0),
        items: Array.from({ length: 12 }, () => []),
      }
    );
  }, [datasetByYear, selectedYear]);

  const compareData = useMemo(() => {
    if (compareYear === 'all') {
      const allLevels: Record<string, number[]> = {
        q1: Array(12).fill(0),
        q2: Array(12).fill(0),
        q3: Array(12).fill(0),
        q4: Array(12).fill(0),
        t1: Array(12).fill(0),
        t2: Array(12).fill(0),
        t3: Array(12).fill(0),
      };
      const allFund = Array(12).fill(0);
      const allItems: PublicationItem[][] = Array.from({ length: 12 }, () => []);

      Object.values(datasetByYear).forEach((yData) => {
        for (let i = 0; i < 12; i++) {
          Object.keys(allLevels).forEach((k) => {
            allLevels[k][i] += yData.levels[k]?.[i] || 0;
          });
          allFund[i] += yData.fund[i] || 0;
          allItems[i].push(...yData.items[i]);
        }
      });

      return {
        levels: allLevels,
        fund: allFund,
        items: allItems,
      };
    }
    return datasetByYear[Number(compareYear)] || null;
  }, [datasetByYear, compareYear]);

  const hasCompareData = Boolean(compareData);

  const prevTotals = useMemo(() => {
    if (!compareData) return Array(12).fill(0);
    return MONTHS.map((_, i) => {
      return PUB_LEVELS.reduce((sum, l) => sum + (compareData.levels[l.k]?.[i] || 0), 0);
    });
  }, [compareData]);

  // Monthly sums for current year
  const currentTotalsAll = useMemo(() => {
    return MONTHS.map((_, i) => {
      return PUB_LEVELS.reduce((sum, l) => sum + (currentData.levels[l.k]?.[i] || 0), 0);
    });
  }, [currentData]);

  const currentTotalsVis = useMemo(() => {
    return MONTHS.map((_, i) => {
      return PUB_LEVELS.reduce((sum, l) => {
        if (hiddenLevels[l.k]) return sum;
        return sum + (currentData.levels[l.k]?.[i] || 0);
      }, 0);
    });
  }, [currentData, hiddenLevels]);

  // Tooltip & hover states
  const [activeMonthIdx, setActiveMonthIdx] = useState<number | null>(null);
  const [activeSegKey, setActiveSegKey] = useState<string | null>(null);
  const [activeDotMonth, setActiveDotMonth] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  const scrollerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  // Resize handler for SVG width
  const [plotWidth, setPlotWidth] = useState<number>(760);
  useEffect(() => {
    const updateW = () => {
      if (scrollerRef.current) {
        setPlotWidth(Math.max(720, scrollerRef.current.clientWidth - 32));
      }
    };
    updateW();
    window.addEventListener('resize', updateW);
    return () => window.removeEventListener('resize', updateW);
  }, []);

  // Geometry calculations
  const isCompare = mode === 'compare';
  const showRightAxis = !isCompare && showFundLine;
  const H = 370;
  const ml = 46;
  const mr = showRightAxis ? 56 : 24;
  const mt = 32;
  const mb = 36;
  const pw = plotWidth - ml - mr;
  const ph = H - mt - mb;
  const cw = pw / 12;

  // Left Y-axis scale calculation
  const { lmax, lstep, ldec } = useMemo(() => {
    const vals: number[] = [];
    if (isCompare) {
      for (let i = 0; i < 12; i++) {
        const c = metric === 'count' ? currentTotalsAll[i] : currentData.fund[i] / 1e6;
        vals.push(c);
        if (hasCompareData && compareData) {
          const p = metric === 'count' ? prevTotals[i] : compareData.fund[i] / 1e6;
          vals.push(p);
        }
      }
    } else {
      for (let i = 0; i < 12; i++) {
        vals.push(mode === 'total' ? currentTotalsAll[i] : currentTotalsVis[i]);
      }
    }
    const vmax = Math.max(0, ...vals);
    if (isCompare && metric === 'fund') {
      const step = Math.max(0.04, Math.ceil(vmax / 4 / 0.01) * 0.01);
      return { lstep: step, lmax: step * 4, ldec: 2 };
    }
    const step = Math.max(1, Math.ceil(vmax / 4));
    return { lstep: step, lmax: step * 4, ldec: 0 };
  }, [isCompare, metric, currentTotalsAll, currentTotalsVis, currentData, hasCompareData, compareData, prevTotals, mode]);

  const yv = (val: number) => mt + ph - (lmax > 0 ? (val / lmax) * ph : 0);

  // Right Y-axis scale calculation (funding in millions)
  const { rmax, rstep } = useMemo(() => {
    const fmaxVal = Math.max(0, ...currentData.fund) / 1e6;
    const step = Math.max(0.04, Math.ceil(fmaxVal / 4 / 0.01) * 0.01);
    return { rstep: step, rmax: step * 4 };
  }, [currentData.fund]);

  const yf = (mil: number) => mt + ph - (rmax > 0 ? (mil / rmax) * ph : 0);

  // Spline points for funding line
  const fundPoints = useMemo(() => {
    return MONTHS.map((_, i) => ({
      x: ml + i * cw + cw / 2,
      y: yf(currentData.fund[i] / 1e6),
    }));
  }, [currentData.fund, ml, cw, yf]);

  const splinePath = useMemo(() => {
    return monoSpline(fundPoints);
  }, [fundPoints]);

  // Tooltip positioning helper
  const handlePointerMove = (e: React.PointerEvent, content: React.ReactNode) => {
    if (!plotRef.current) return;
    const box = plotRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(box.width - 190, e.clientX - box.left + 16));
    const y = Math.max(10, e.clientY - box.top - 80);
    setTooltip({ visible: true, x, y, content });
  };

  const handlePointerLeave = () => {
    setActiveMonthIdx(null);
    setActiveSegKey(null);
    setActiveDotMonth(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Level toggle handler (safeguard: keep at least 1 visible)
  const toggleLevel = (key: string) => {
    const visibleCount = PUB_LEVELS.filter((l) => !hiddenLevels[l.k]).length;
    if (!hiddenLevels[key] && visibleCount <= 1) return;
    setHiddenLevels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Comparison summary calculation
  const comparisonSummary = useMemo(() => {
    if (!isCompare || !hasCompareData || !compareData) return null;
    const curSum = metric === 'count'
      ? currentTotalsAll.reduce((a, b) => a + b, 0)
      : currentData.fund.reduce((a, b) => a + b, 0);
    const prevSum = metric === 'count'
      ? prevTotals.reduce((a, b) => a + b, 0)
      : compareData.fund.reduce((a, b) => a + b, 0);

    const unit = metric === 'count' ? 'เรื่อง' : 'ล้านบาท';
    const cVal = metric === 'count' ? curSum : (curSum / 1e6).toFixed(2);
    const pVal = metric === 'count' ? prevSum : (prevSum / 1e6).toFixed(2);

    let diffText = '';
    let isUp = true;
    if (metric === 'count') {
      const d = curSum - prevSum;
      isUp = d >= 0;
      diffText = `${isUp ? '▲ +' : '▼ −'}${Math.abs(d)} ${unit}`;
    } else {
      const pct = prevSum > 0 ? ((curSum - prevSum) / prevSum) * 100 : 0;
      isUp = pct >= 0;
      diffText = `${isUp ? '▲ +' : '▼ −'}${Math.abs(pct).toFixed(1)}%`;
    }

    return { cVal, pVal, unit, diffText, isUp };
  }, [isCompare, hasCompareData, compareData, metric, currentTotalsAll, currentData.fund, prevTotals]);

  return (
    <div
      className="rr-card"
      style={{
        position: 'relative',
        width: '100%',
        ['--acc' as any]: '#be123c',
        ['--seg' as any]: '#eef2f6',
        ['--segon' as any]: '#ffffff',
        ['--muted' as any]: '#64748b',
        ['--ink' as any]: '#0f172a',
      }}
    >
      {/* HEADER & CONTROLS */}
      <div className="rr-head">
        <div>
          <h2 className="rr-title-h2">
            <FaChartLine style={{ color: '#fb7185', fontSize: '18px' }} /> ผลงานตีพิมพ์และเงินสนับสนุนรายเดือน
          </h2>
          
        </div>

        <div className="rr-ctrls">
          <YearSelectDropdown
            label="ปี"
            value={selectedYear}
            onChange={(newY) => {
              setSelectedYear(newY);
              if (compareYear === newY) {
                setCompareYear(getDefaultCompareYear(newY, availableYears));
              }
            }}
            includeAll={true}
            allPosition="top"
          />

          {/* Compare Year Selector (shown only in compare mode) */}
          {isCompare && (
            <YearSelectDropdown
              label="เทียบกับปี"
              value={compareYear}
              onChange={(newCmp) => setCompareYear(newCmp)}
              excludeYear={selectedYear}
              includeAll={false}
              hasDataByYear={hasDataByYear}
            />
          )}

          {/* Mode Segmented Controls */}
          <div className="rr-seg-ctl">
            {[
              { k: 'total', label: 'รวมทั้งหมด' },
              { k: 'level', label: 'แยกตามระดับ' },
              { k: 'compare', label: 'เทียบข้ามปี' },
            ].map((m) => {
              const active = mode === m.k;
              return (
                <button
                  key={m.k}
                  type="button"
                  aria-pressed={active}
                  className={active ? 'on' : ''}
                  onClick={() => setMode(m.k as any)}
                  style={
                    active
                      ? {
                          color: '#be123c',
                          fontWeight: 700,
                          backgroundColor: '#ffffff',
                          boxShadow: '0 1px 2px rgba(15,23,42,.12), 0 4px 10px -4px rgba(15,23,42,.14)',
                        }
                      : undefined
                  }
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Metric Segmented Controls (compare mode only) */}
          {isCompare && (
            <div className="rr-seg-ctl">
              {[
                { k: 'count', label: 'จำนวนผลงาน' },
                { k: 'fund', label: 'เงินสนับสนุน' },
              ].map((m) => {
                const active = metric === m.k;
                return (
                  <button
                    key={m.k}
                    type="button"
                    aria-pressed={active}
                    className={active ? 'on' : ''}
                    onClick={() => setMetric(m.k as any)}
                    style={
                      active
                        ? {
                            color: '#be123c',
                            fontWeight: 700,
                            backgroundColor: '#ffffff',
                            boxShadow: '0 1px 2px rgba(15,23,42,.12), 0 4px 10px -4px rgba(15,23,42,.14)',
                          }
                        : undefined
                    }
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* INTERACTIVE LEGEND */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          margin: '18px 0 6px',
        }}
      >
        {mode === 'level' &&
          PUB_LEVELS.map((lvl) => {
            const isHidden = Boolean(hiddenLevels[lvl.k]);
            return (
              <button
                key={lvl.k}
                type="button"
                onClick={() => toggleLevel(lvl.k)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  font: 'inherit',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  minHeight: '34px',
                  padding: '4px 12px 4px 10px',
                  borderRadius: '999px',
                  border: '1px solid #e3e9f0',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  cursor: 'pointer',
                  opacity: isHidden ? 0.45 : 1,
                  transition: 'opacity 0.15s, background-color 0.15s',
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '4px',
                    backgroundColor: isHidden ? 'transparent' : lvl.c,
                    boxShadow: isHidden ? `inset 0 0 0 2px ${lvl.c}` : 'none',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                {lvl.n}
              </button>
            );
          })}

        {mode === 'total' && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13.5px',
              fontWeight: 600,
              minHeight: '34px',
              padding: '4px 12px 4px 10px',
              borderRadius: '999px',
              border: '1px solid #e3e9f0',
              backgroundColor: '#ffffff',
              color: '#0f172a',
            }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '4px',
                backgroundColor: PUB_CHART_COLORS.total,
                display: 'inline-block',
              }}
            />
            ผลงานรวม
          </span>
        )}

        {isCompare && (
          <>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13.5px',
                fontWeight: 600,
                minHeight: '34px',
                padding: '4px 12px 4px 10px',
                borderRadius: '999px',
                border: '1px solid #e3e9f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
              }}
            >
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '4px',
                  backgroundColor: '#cbd5e1',
                  display: 'inline-block',
                }}
              />
              ปี {compareYear} {!hasCompareData && <small style={{ color: '#94a3b8', fontWeight: 400 }}>(ไม่มีข้อมูล)</small>}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13.5px',
                fontWeight: 600,
                minHeight: '34px',
                padding: '4px 12px 4px 10px',
                borderRadius: '999px',
                border: '1px solid #e3e9f0',
                backgroundColor: '#ffffff',
                color: '#0f172a',
              }}
            >
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '4px',
                  backgroundColor: PUB_CHART_COLORS.cur,
                  display: 'inline-block',
                }}
              />
              {selectedYear === 'all' ? 'รวมทุกปี' : `ปี ${selectedYear}`}
            </span>
          </>
        )}

        {/* Toggle Funding line pill */}
        {!isCompare && (
          <button
            type="button"
            onClick={() => setShowFundLine((prev) => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              font: 'inherit',
              fontSize: '13.5px',
              fontWeight: 600,
              minHeight: '34px',
              padding: '4px 12px 4px 10px',
              borderRadius: '999px',
              border: '1px solid #e3e9f0',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              opacity: showFundLine ? 1 : 0.45,
              transition: 'opacity 0.15s',
            }}
          >
            <span
              style={{
                height: '4px',
                width: '16px',
                borderRadius: '2px',
                backgroundColor: PUB_CHART_COLORS.line,
                display: 'inline-block',
                boxShadow: showFundLine ? `0 0 6px rgba(244, 63, 94, 0.4)` : 'none',
              }}
            />
            เงินสนับสนุน (ล้านบาท)
          </button>
        )}
      </div>

      {/* SUMMARY LINE (compare mode) */}
      {comparisonSummary && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px 12px',
            margin: '10px 0 2px',
            fontSize: '14.5px',
            color: '#0f172a',
          }}
        >
          <span>
            {selectedYear === 'all' ? 'รวมทุกปี' : `ปี ${selectedYear}`} รวม <b>{comparisonSummary.cVal}</b> {comparisonSummary.unit}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '12.5px',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '999px',
              backgroundColor: comparisonSummary.isUp ? '#dcfce7' : '#fee2e2',
              color: comparisonSummary.isUp ? '#166534' : '#991b1b',
            }}
          >
            {comparisonSummary.diffText}
          </span>
          <span style={{ color: '#64748b' }}>
            เทียบปี {compareYear} ({comparisonSummary.pVal} {comparisonSummary.unit})
          </span>
        </div>
      )}

      {/* CHART SCROLLER & PLOT */}
      <div
        ref={scrollerRef}
        style={{
          overflowX: 'auto',
          margin: '6px -8px 0',
          padding: '0 8px',
        }}
      >
        <div
          ref={plotRef}
          style={{
            position: 'relative',
            minWidth: '720px',
            width: `${plotWidth}px`,
          }}
          onPointerLeave={handlePointerLeave}
        >
          <svg
            width={plotWidth}
            height={H}
            viewBox={`0 0 ${plotWidth} ${H}`}
            style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}
          >
            <defs>
              <linearGradient id="gPubGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={PUB_CHART_COLORS.g0} />
                <stop offset="1" stopColor={PUB_CHART_COLORS.g1} />
              </linearGradient>
            </defs>

            {/* Grid lines and Left Y-Axis */}
            {[0, 1, 2, 3, 4].map((i) => {
              const gy = mt + ph - (i * ph) / 4;
              const val = ldec ? (lstep * i).toFixed(ldec) : lstep * i;
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1={ml}
                    x2={plotWidth - mr}
                    y1={gy}
                    y2={gy}
                    stroke="#e8edf3"
                    strokeWidth={1}
                    strokeDasharray={i === 0 ? 'none' : '3 5'}
                  />
                  <text
                    x={ml - 12}
                    y={gy + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#64748b"
                    fontFamily="'Kanit', sans-serif"
                    fontWeight="500"
                  >
                    {val}
                  </text>
                  {showRightAxis && (
                    <text
                      x={plotWidth - mr + 12}
                      y={gy + 4}
                      fontSize="12"
                      fill="#64748b"
                      fontFamily="'Kanit', sans-serif"
                      fontWeight="500"
                    >
                      {(rstep * i).toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Axis Unit Labels */}
            <text x={ml} y={mt - 14} textAnchor="start" fontSize="12" fontWeight="600" fill="#64748b">
              {isCompare && metric === 'fund' ? 'ล้านบาท' : 'เรื่อง'}
            </text>
            {showRightAxis && (
              <text x={plotWidth - mr} y={mt - 14} textAnchor="end" fontSize="12" fontWeight="600" fill="#64748b">
                ล้านบาท
              </text>
            )}

            {/* Column Background hover highlight rects */}
            {MONTHS.map((_, i) => {
              const x0 = ml + i * cw;
              const isOn = activeMonthIdx === i;
              return (
                <rect
                  key={`colbg-${i}`}
                  x={x0 + 3}
                  y={mt - 6}
                  width={cw - 6}
                  height={ph + 6}
                  rx="14"
                  fill="rgba(15, 23, 42, 0.05)"
                  opacity={isOn ? 1 : 0}
                  style={{ transition: 'opacity 0.12s' }}
                  pointerEvents="none"
                />
              );
            })}

            {/* Month Column hit areas */}
            {MONTHS.map((mName, i) => {
              const x1 = ml + i * cw;
              return (
                <rect
                  key={`mhit-${i}`}
                  x={x1}
                  y={mt - 6}
                  width={cw}
                  height={ph + 6}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onPointerMove={(e) => {
                    setActiveMonthIdx(i);
                    const tot = currentTotalsAll[i];
                    const fVal = (currentData.fund[i] / 1e6).toFixed(2);
                    const content = isCompare ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: PUB_CHART_COLORS.cur }} />
                          {mName} · {metric === 'count' ? 'จำนวนผลงาน' : 'เงินสนับสนุน'}
                        </div>
                        <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '14px' }}>
                          <span style={{ color: '#cbd5e1' }}>{selectedYear === 'all' ? 'รวมทุกปี' : `ปี ${selectedYear}`}</span>
                          <b>{metric === 'count' ? `${tot} เรื่อง` : `${fVal} ล้านบาท`}</b>
                        </div>
                        {hasCompareData && (
                          <div style={{ marginTop: '3px', display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '14px' }}>
                            <span style={{ color: '#cbd5e1' }}>ปี {compareYear}</span>
                            <b>
                              {metric === 'count'
                                ? `${prevTotals[i]} เรื่อง`
                                : `${(compareData!.fund[i] / 1e6).toFixed(2)} ล้านบาท`}
                            </b>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: PUB_CHART_COLORS.total }} />
                          {mName} {selectedYear}
                        </div>
                        <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '14px' }}>
                          <span style={{ color: '#cbd5e1' }}>ผลงานรวม</span>
                          <b>{tot} เรื่อง</b>
                        </div>
                        <div style={{ marginTop: '3px', display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '14px' }}>
                          <span style={{ color: '#cbd5e1' }}>เงินสนับสนุน</span>
                          <b>{fVal} ล้านบาท</b>
                        </div>
                      </div>
                    );
                    handlePointerMove(e, content);
                  }}
                  onClick={() => {
                    onSelectPeriod?.(i, selectedYear, currentData.items[i]);
                  }}
                />
              );
            })}

            {/* BARS */}
            {MONTHS.map((mName, i) => {
              const cx = ml + i * cw + cw / 2;

              if (mode === 'level') {
                const bw = Math.min(52, cw * 0.56);
                let cum = 0;
                const totVis = currentTotalsVis[i];
                const totAll = currentTotalsAll[i];
                const gap = 3;

                return (
                  <g key={`bar-lvl-${i}`}>
                    {PUB_LEVELS.map((lvl) => {
                      if (hiddenLevels[lvl.k]) return null;
                      const v = currentData.levels[lvl.k]?.[i] || 0;
                      if (!v) return null;
                      const y1 = yv(cum + v);
                      const y0 = yv(cum);
                      const h = Math.max(y0 - y1 - gap, 3);
                      const r = Math.min(7, h / 2);
                      const isHovered = activeMonthIdx === i && activeSegKey === lvl.k;
                      const segY = y1 + gap / 2;
                      cum += v;

                      return (
                        <g key={`seg-${lvl.k}-${i}`}>
                          <rect
                            x={cx - bw / 2}
                            y={segY}
                            width={bw}
                            height={h}
                            rx={r}
                            fill={lvl.c}
                            style={{
                              cursor: 'pointer',
                              filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                              opacity: activeSegKey && !isHovered ? 0.6 : 1,
                              transition: 'all 0.15s ease',
                            }}
                            onPointerMove={(e) => {
                              e.stopPropagation();
                              setActiveMonthIdx(i);
                              setActiveSegKey(lvl.k);
                              const pct = totAll > 0 ? Math.round((v / totAll) * 100) : 0;
                              const content = (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                                    <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: lvl.c }} />
                                    {lvl.n} · {mName} {selectedYear}
                                  </div>
                                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <b style={{ fontSize: '24px', fontWeight: 800 }}>{v}</b>
                                    <span style={{ fontSize: '13px', color: '#cbd5e1' }}>เรื่อง</span>
                                  </div>
                                  <div style={{ marginTop: '2px', fontSize: '12.5px', color: '#94a3b8' }}>
                                    {pct}% ของเดือนนี้ ({totAll} เรื่อง)
                                  </div>
                                </div>
                              );
                              handlePointerMove(e, content);
                            }}
                            onClick={() => {
                              onSelectPeriod?.(i, selectedYear, currentData.items[i]);
                            }}
                          />
                          {h >= 14 && (
                            <text
                              x={cx}
                              y={segY + h / 2 + 5}
                              textAnchor="middle"
                              fontSize={h >= 24 ? "14" : "13"}
                              fontWeight="800"
                              fill={
                                lvl.k === 'q4'
                                  ? '#881337'
                                  : lvl.k === 't3'
                                  ? '#1e1b4b'
                                  : '#ffffff'
                              }
                              pointerEvents="none"
                              style={{ textShadow: lvl.k === 'q3' ? '0 1px 2px rgba(0,0,0,0.35)' : 'none' }}
                            >
                              {v}
                            </text>
                          )}
                        </g>
                      );
                    })}
                    {totVis > 0 && (
                      <text
                        x={cx}
                        y={yv(totVis) - 8}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="800"
                        fill="#0f172a"
                        pointerEvents="none"
                      >
                        {totVis}
                      </text>
                    )}
                  </g>
                );
              }

              if (mode === 'total') {
                const bw2 = Math.min(46, cw * 0.5);
                const tv = currentTotalsAll[i];
                if (tv <= 0) return null;
                const yy = yv(tv);
                const hh = Math.max(yv(0) - yy, 0);
                const isHovered = activeMonthIdx === i;

                return (
                  <g key={`bar-tot-${i}`}>
                    <rect
                      x={cx - bw2 / 2}
                      y={yy}
                      width={bw2}
                      height={hh}
                      rx={Math.min(10, hh / 2)}
                      fill="url(#gPubGreen)"
                      style={{
                        cursor: 'pointer',
                        filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.95)' : 'none',
                        transition: 'filter 0.15s',
                      }}
                      onPointerMove={(e) => {
                        e.stopPropagation();
                        setActiveMonthIdx(i);
                        const fVal = (currentData.fund[i] / 1e6).toFixed(2);
                        const content = (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: PUB_CHART_COLORS.total }} />
                              {mName} {selectedYear}
                            </div>
                            <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '14px' }}>
                              <span style={{ color: '#cbd5e1' }}>ผลงานรวม</span>
                              <b>{tv} เรื่อง</b>
                            </div>
                            <div style={{ marginTop: '3px', display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '14px' }}>
                              <span style={{ color: '#cbd5e1' }}>เงินสนับสนุน</span>
                              <b>{fVal} ล้านบาท</b>
                            </div>
                          </div>
                        );
                        handlePointerMove(e, content);
                      }}
                      onClick={() => {
                        onSelectPeriod?.(i, selectedYear, currentData.items[i]);
                      }}
                    />
                    <text
                      x={cx}
                      y={yy - 8}
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="700"
                      fill="#475569"
                      pointerEvents="none"
                    >
                      {tv}
                    </text>
                  </g>
                );
              }

              // mode === 'compare'
              const cv = metric === 'count' ? currentTotalsAll[i] : currentData.fund[i] / 1e6;
              const pv = hasCompareData && compareData
                ? metric === 'count'
                  ? prevTotals[i]
                  : compareData.fund[i] / 1e6
                : 0;
              const bw3 = Math.min(30, cw * 0.32);
              const g2 = 5;
              const xc = hasCompareData ? cx + g2 / 2 : cx - bw3 / 2;
              const xp = cx - g2 / 2 - bw3;

              return (
                <g key={`bar-cmp-${i}`}>
                  {hasCompareData && pv > 0 && (
                    <>
                      <rect
                        x={xp}
                        y={yv(pv)}
                        width={bw3}
                        height={yv(0) - yv(pv)}
                        rx={Math.min(9, (yv(0) - yv(pv)) / 2)}
                        fill="#cbd5e1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          onSelectPeriod?.(i, compareYear, compareData?.items[i] || []);
                        }}
                      />
                      <text
                        x={xp + bw3 / 2}
                        y={yv(pv) - 8}
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight="700"
                        fill="#475569"
                        pointerEvents="none"
                      >
                        {metric === 'count' ? pv : pv.toFixed(2)}
                      </text>
                    </>
                  )}
                  {cv > 0 && (
                    <>
                      <rect
                        x={xc}
                        y={yv(cv)}
                        width={bw3}
                        height={yv(0) - yv(cv)}
                        rx={Math.min(9, (yv(0) - yv(cv)) / 2)}
                        fill="url(#gPubGreen)"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          onSelectPeriod?.(i, selectedYear, currentData.items[i]);
                        }}
                      />
                      <text
                        x={xc + bw3 / 2}
                        y={yv(cv) - 8}
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight="700"
                        fill={PUB_CHART_COLORS.curInk}
                        pointerEvents="none"
                      >
                        {metric === 'count' ? cv : cv.toFixed(2)}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {/* FUNDING LINE */}
            {showRightAxis && (
              <g pointerEvents="none">
                {/* White outline path */}
                <path
                  d={splinePath}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={0.9}
                />
                {/* Colored spline line */}
                <path
                  d={splinePath}
                  fill="none"
                  stroke={PUB_CHART_COLORS.line}
                  strokeWidth={3}
                  strokeLinecap="round"
                />

                {/* Dots and Floating Value Badges */}
                {fundPoints.map((pt, i) => {
                  const tv2 = mode === 'level' ? currentTotalsVis[i] : currentTotalsAll[i];
                  const tTop = yv(tv2) - 22;
                  const tBot = yv(tv2) - 6;
                  const hasT = tv2 > 0;
                  const LW = 40;
                  const LH = 20;

                  let cyL = pt.y - 18;
                  let lx = pt.x;

                  const over = (cy: number) => hasT && cy + LH / 2 + 3 > tTop && cy - LH / 2 - 3 < tBot;
                  if (cyL - LH / 2 < mt - 14 || over(cyL)) {
                    cyL = pt.y + 18;
                    if (over(cyL)) {
                      cyL = pt.y;
                      lx = pt.x + LW / 2 + 12;
                      if (lx + LW / 2 > plotWidth - mr + 8) lx = pt.x - LW / 2 - 12;
                    }
                  }

                  const isDotActive = activeDotMonth === i;
                  const fMillion = (currentData.fund[i] / 1e6).toFixed(2);

                  return (
                    <g key={`fpt-${i}`}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isDotActive ? 6 : 3.5}
                        fill="#ffffff"
                        stroke={PUB_CHART_COLORS.line}
                        strokeWidth={2.5}
                        style={{ transition: 'r 0.12s' }}
                      />
                      <rect
                        x={lx - LW / 2}
                        y={cyL - LH / 2}
                        width={LW}
                        height={LH}
                        rx="10"
                        fill="#ffffff"
                        stroke={PUB_CHART_COLORS.line}
                        strokeOpacity={0.35}
                      />
                      <text
                        x={lx}
                        y={cyL + 4.2}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fill={PUB_CHART_COLORS.lineInk}
                      >
                        {fMillion}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Funding Line Interactive hit circles */}
            {showRightAxis &&
              fundPoints.map((pt, i) => (
                <circle
                  key={`fhit-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={15}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onPointerMove={(e) => {
                    e.stopPropagation();
                    setActiveMonthIdx(i);
                    setActiveDotMonth(i);
                    const f = currentData.fund[i];
                    const t = currentTotalsAll[i];
                    const content = (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                          <span style={{ width: '12px', height: '3px', borderRadius: '1.5px', background: PUB_CHART_COLORS.line }} />
                          เงินสนับสนุน · {MONTHS[i]} {selectedYear}
                        </div>
                        <div style={{ marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <b style={{ fontSize: '24px', fontWeight: 800 }}>{f.toLocaleString('en-US')}</b>
                          <span style={{ fontSize: '13px', color: '#cbd5e1' }}>บาท</span>
                        </div>
                        <div style={{ marginTop: '2px', fontSize: '12.5px', color: '#94a3b8' }}>
                          ≈ {(f / 1e6).toFixed(2)} ล้านบาท
                          {t > 0 && ` · เฉลี่ย ${(f / t).toLocaleString('en-US', { maximumFractionDigits: 0 })} บาท/เรื่อง`}
                        </div>
                      </div>
                    );
                    handlePointerMove(e, content);
                  }}
                />
              ))}

            {/* X-AXIS MONTH LABELS (แสดงเฉพาะชื่อเดือน ไม่แสดงปี เพราะด้านบนมีปุ่มเลือกปีและคำอธิบายกำกับอยู่แล้ว) */}
            {MONTHS.map((mName, i) => (
              <text
                key={`m-lbl-${i}`}
                x={ml + i * cw + cw / 2}
                y={H - 12}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#334155"
                fontFamily="'Kanit', sans-serif"
              >
                {mName}
              </text>
            ))}
          </svg>

          {/* DELTAS IN COMPARE MODE */}
          {isCompare && (
            <div style={{ marginTop: '2px' }}>
              {hasCompareData ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                    marginLeft: `${ml}px`,
                    marginRight: `${mr}px`,
                  }}
                >
                  {MONTHS.map((_, i) => {
                    const c = metric === 'count' ? currentTotalsAll[i] : currentData.fund[i];
                    const p = metric === 'count' ? prevTotals[i] : compareData?.fund[i] || 0;

                    if (p === 0 && c > 0) {
                      return (
                        <div key={`d-${i}`} style={{ display: 'flex', justifyContent: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontSize: '12px',
                              fontWeight: 700,
                              padding: '4px 8px',
                              borderRadius: '999px',
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                            }}
                          >
                            ใหม่
                          </span>
                        </div>
                      );
                    }
                    if (p === 0 && c === 0) {
                      return (
                        <div key={`d-${i}`} style={{ display: 'flex', justifyContent: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontSize: '12px',
                              fontWeight: 600,
                              padding: '4px 8px',
                              borderRadius: '999px',
                              backgroundColor: '#f1f5f9',
                              color: '#64748b',
                            }}
                          >
                            –
                          </span>
                        </div>
                      );
                    }

                    let isUp = true;
                    let text = '';
                    if (metric === 'count') {
                      const d = c - p;
                      if (d === 0) {
                        return (
                          <div key={`d-${i}`} style={{ display: 'flex', justifyContent: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                fontSize: '12px',
                                fontWeight: 600,
                                padding: '4px 8px',
                                borderRadius: '999px',
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                              }}
                            >
                              เท่าเดิม
                            </span>
                          </div>
                        );
                      }
                      isUp = d > 0;
                      text = `${Math.abs(d)}`;
                    } else {
                      const pc = p > 0 ? ((c - p) / p) * 100 : 0;
                      if (Math.abs(pc) < 0.5) {
                        return (
                          <div key={`d-${i}`} style={{ display: 'flex', justifyContent: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                fontSize: '12px',
                                fontWeight: 600,
                                padding: '4px 8px',
                                borderRadius: '999px',
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                              }}
                            >
                              เท่าเดิม
                            </span>
                          </div>
                        );
                      }
                      isUp = pc > 0;
                      text = `${Math.abs(pc).toFixed(0)}%`;
                    }

                    return (
                      <div key={`d-${i}`} style={{ display: 'flex', justifyContent: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            borderRadius: '999px',
                            backgroundColor: isUp ? '#dcfce7' : '#fee2e2',
                            color: isUp ? '#166534' : '#991b1b',
                          }}
                        >
                          <span>{isUp ? '▲' : '▼'}</span>
                          {text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginLeft: `${ml}px`,
                    marginRight: `${mr}px`,
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: '#f1f5f9',
                    color: '#475569',
                    fontSize: '13.5px',
                    fontWeight: 500,
                  }}
                >
                  ยังไม่มีข้อมูลปี {compareYear} สำหรับเปรียบเทียบ — แสดงเฉพาะข้อมูล{selectedYear === 'all' ? 'รวมทุกปี' : `ปี ${selectedYear}`}
                </div>
              )}
            </div>
          )}

          {/* FLOATING DARK BLUR TOOLTIP */}
          {tooltip.visible && (
            <div
              style={{
                position: 'absolute',
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                zIndex: 40,
                pointerEvents: 'none',
                minWidth: '160px',
                whiteSpace: 'nowrap',
                background: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#ffffff',
                borderRadius: '14px',
                padding: '10px 14px 11px',
                boxShadow: '0 18px 36px -12px rgba(15, 23, 42, 0.55)',
                animation: 'popoverFadeIn 0.12s ease-out',
              }}
            >
              {tooltip.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
