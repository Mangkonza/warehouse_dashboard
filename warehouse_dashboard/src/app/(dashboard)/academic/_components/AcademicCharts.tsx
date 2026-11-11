'use client';

import { getAssetUrl, getDefaultAvatar } from '@/lib/api';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaUserTie,
  FaChevronRight,
} from 'react-icons/fa';
import '../../research/_components/research-redesign.css';
import { getDepartment } from '@/lib/departments';
import { AcademicItem } from '../_hooks/useAcademicData';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';
import { CHART_PASTEL_PALETTE, normalizeAcademicMonth } from '@/lib/pastelTheme';
import { resolveItemFiscalYear } from '@/types/timeFilter';
import { isTestRecord } from '@/lib/sdgEngine';
import { resolvePersonAvatar, resolvePersonnelTargetId, resolvePersonnelHref } from '@/lib/personnelService';
import { YearSelectDropdown } from '@/components/ui/YearSelectDropdown';
import { STANDARD_YEAR_OPTIONS, getDefaultCompareYear } from '@/lib/fiscalYears';

interface AcademicChartsProps {
  validData: AcademicItem[];
  allItems?: AcademicItem[];
  currentFiscalYear?: string;
  totalAllocFaculty: number;
  totalAllocDept: number;
  totalAllocKu: number;
  totalAllocRemaining: number;
  hideMissingClient?: boolean;
  onSelectClient?: (clientName: string) => void;
  activePerspective?: AcademicPerspective;
  onChangePerspective?: (persp: AcademicPerspective) => void;
  hideSelector?: boolean;
}

export type AcademicPerspective = 'timeline_alloc' | 'client_segment' | 'faculty' | 'sdg' | 'table';

const MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

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

const CONTRACT_SPLIT = {
  major: { n: 'สัญญาขนาดใหญ่ (≥ 1 ลบ.)', c: '#0ea5e9' },
  std: { n: 'สัญญาทั่วไป (< 1 ลบ.)', c: '#22c55e' },
};

const TIER_CATS = ['< 1 ล้านบาท', '1 - 5 ล้านบาท', '5 - 10 ล้านบาท', '≥ 10 ล้านบาท'];

const SEGMENT_CATS = [
  { key: 'gov', label: 'หน่วยงานภาครัฐ / กรม / กระทรวง', short: 'ภาครัฐ/กระทรวง', c: '#0ea5e9' },
  { key: 'state_enterprise', label: 'รัฐวิสาหกิจ', short: 'รัฐวิสาหกิจ', c: '#22c55e' },
  { key: 'private', label: 'ภาคเอกชน / บริษัทมหาชน', short: 'ภาคเอกชน', c: '#f59e0b' },
  { key: 'independent', label: 'องค์กรอิสระ / อื่นๆ', short: 'องค์กรอิสระ/อื่นๆ', c: '#8b5cf6' },
  { key: 'unspecified', label: 'รอระบุข้อมูลผู้ว่าจ้าง', short: 'รอระบุผู้ว่าจ้าง', c: '#94a3b8' },
];

function resolveAcademicYear(item: AcademicItem): string {
  const nameMatch = String(item.name || '').match(/25(6[6-9]|7\d)/);
  if (nameMatch) return nameMatch[0];
  const fy = resolveItemFiscalYear(item, 'academic');
  if (fy && /^25(6[6-9]|7\d)$/.test(fy)) return fy;
  const rawFy = Number(item.fiscal_year);
  if (rawFy >= 1966 && rawFy <= 1972) return String(rawFy + 600);
  if (rawFy >= 2020 && rawFy <= 2035) return String(rawFy + 543);
  return '2568';
}

function resolveAcademicMonthIdx(item: AcademicItem): number {
  const norm = item.normalizedMonth || normalizeAcademicMonth(item.month);
  const idx = MON.indexOf(norm);
  if (idx !== -1) return idx;
  const sd = String(item.start_date || '').trim();
  const mMatch = sd.match(/^\d{4}-(\d{1,2})/);
  if (mMatch) {
    const m = parseInt(mMatch[1], 10) - 1;
    if (m >= 0 && m < 12) return m;
  }
  return -1;
}

function resolveDeptCode(rawDept: unknown, rawCode?: unknown): string {
  const cStr = String(rawCode || '').trim().toUpperCase();
  if (cStr === 'IRE' || cStr === 'IRRE') return 'IRRE';
  if (cStr === 'DWT' || cStr === 'TDW' || cStr === 'TDWCB') return 'TDWCB';
  if (UCOL[cStr] && cStr !== 'OTH') return cStr;

  const str = String(rawDept || '').trim().toUpperCase();
  if (!str) return 'OTH';
  if (str === 'IRE' || str === 'IRRE' || str.includes('ชลประทาน') || str.includes('ทรัพยากรน้ำ')) return 'IRRE';
  if (str === 'FE' || str.includes('อาหาร')) return 'FE';
  if (str === 'IE' || str.includes('อุตสาหการ')) return 'IE';
  if (str === 'ME' || str.includes('เครื่องกล') && !str.includes('เกษตร')) return 'ME';
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

function getTierIdx(budget: number): number {
  if (budget < 1_000_000) return 0;
  if (budget < 5_000_000) return 1;
  if (budget < 10_000_000) return 2;
  return 3;
}

function getClientSegKey(clientRaw?: string): string {
  const raw = String(clientRaw || '').trim();
  const c = raw.toLowerCase();
  if (!raw || raw === '-' || raw === 'nan' || raw === 'ไม่ระบุ' || raw.includes('ไม่ระบุผู้ว่าจ้าง')) {
    return 'unspecified';
  }
  if (c.includes('กรม') || c.includes('กระทรวง') || c.includes('สำนักงาน') || c.includes('เทศบาล') || c.includes('อบต') || c.includes('อบจ') || c.includes('ภาครัฐ') || c.includes('จังหวัด')) {
    return 'gov';
  }
  if (c.includes('การไฟฟ้า') || c.includes('การประปา') || c.includes('การทาง') || c.includes('ปตท') || c.includes('รัฐวิสาหกิจ')) {
    return 'state_enterprise';
  }
  if (c.includes('บริษัท') || c.includes('จำกัด') || c.includes('บมจ') || c.includes('corp') || c.includes('ltd') || c.includes('ผู้ประกอบการ') || c.includes('หจก')) {
    return 'private';
  }
  if (c.includes('มูลนิธิ') || c.includes('สมาคม') || c.includes('สถาบัน') || c.includes('มหาวิทยาลัย')) {
    return 'independent';
  }
  return 'gov';
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

export function AcademicCharts({
  validData,
  allItems,
  currentFiscalYear,
  hideMissingClient = false,
  onSelectClient,
  activePerspective: propPerspective,
  onChangePerspective,
}: AcademicChartsProps) {
  const router = useRouter();
  const [internalPerspective, setInternalPerspective] = useState<AcademicPerspective>('timeline_alloc');
  const activePerspective = propPerspective ?? internalPerspective;
  const _setActivePerspective = onChangePerspective ?? setInternalPerspective;

  const baseAllItems = useMemo(() => {
    const raw = allItems && allItems.length > 0 ? allItems : validData;
    return raw
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .map((item) => ({
        ...item,
        normalizedMonth: item.normalizedMonth || normalizeAcademicMonth(item.month),
      }));
  }, [allItems, validData]);

  const availableYears = useMemo(() => {
    return Array.from(STANDARD_YEAR_OPTIONS);
  }, []);

  const [year, setYear] = useState<string>(() => {
    if (currentFiscalYear && (currentFiscalYear === 'all' || availableYears.includes(currentFiscalYear))) {
      return currentFiscalYear;
    }
    return availableYears[0] || '2569';
  });

  const [cmpYear, setCmpYear] = useState<string>(() => {
    return getDefaultCompareYear(year, availableYears);
  });

  useEffect(() => {
    if (currentFiscalYear && (currentFiscalYear === 'all' || availableYears.includes(currentFiscalYear))) {
      setYear(currentFiscalYear);
    }
  }, [currentFiscalYear, availableYears]);

  // Shared / Per-chart Controls
  const [isCompare, setIsCompare] = useState<boolean>(false);
  const [barMode, setBarMode] = useState<'group' | 'stack'>('stack');
  const [hideMajor, setHideMajor] = useState<boolean>(false);
  const [hideStd, setHideStd] = useState<boolean>(false);
  const [showLine, setShowLine] = useState<boolean>(true);

  // Contract Tier Controls
  const [tierBarMode, setTierBarMode] = useState<'group' | 'stack'>('stack');
  const [tierMetric, setTierMetric] = useState<'n' | 'b'>('n');

  // Department Ranking Controls
  const [deptMetric, setDeptMetric] = useState<'b' | 'n' | 'a' | 'alloc'>('b');

  // Client Segment Controls
  const [segBarMode, setSegBarMode] = useState<'group' | 'stack'>('stack');
  const [segMetric, setSegMetric] = useState<'b' | 'n'>('b');
  const [clientValueMetric, setClientValueMetric] = useState<'total' | 'average' | 'count'>('total');

  // Faculty Controls
  const [facultyBarMode, setFacultyBarMode] = useState<'group' | 'stack'>('stack');
  const [facultyMetric, setFacultyMetric] = useState<'b' | 'n'>('b');

  // Hover states
  const [activeMonthIdx, setActiveMonthIdx] = useState<number | null>(null);
  const [activeSegKey, setActiveSegKey] = useState<string | null>(null);
  const [activeDotMonth, setActiveDotMonth] = useState<number | null>(null);

  const [activeTierIdx, setActiveTierIdx] = useState<number | null>(null);
  const [activeTierSeg, setActiveTierSeg] = useState<string | null>(null);

  const [activeClientSegIdx, setActiveClientSegIdx] = useState<number | null>(null);
  const [activeClientSegPart, setActiveClientSegPart] = useState<string | null>(null);

  const [activeFacultyIdx, setActiveFacultyIdx] = useState<number | null>(null);
  const [activeFacultySeg, setActiveFacultySeg] = useState<string | null>(null);

  // Tooltip state
  const [tip, setTip] = useState<{ show: boolean; x: number; y: number; content: React.ReactNode }>({
    show: false,
    x: 0,
    y: 0,
    content: null,
  });

  // Slide-over Drawer state
  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    items: AcademicItem[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#0284c7',
    items: [],
  });

  const openDrawer = (title: string, items: AcademicItem[], accentColor = '#0284c7') => {
    setTip((t) => ({ ...t, show: false }));
    const budgetSum = items.reduce((s, it) => s + (Number(it.budget) || 0), 0);
    const avg = items.length > 0 ? budgetSum / items.length : 0;
    setDrillDown({
      isOpen: true,
      title,
      subtitle: `รวม ${items.length} โครงการ • งบประมาณรวม ${budgetSum.toLocaleString('th-TH')} บาท • เฉลี่ย ${avg.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/โครงการ`,
      accentColor,
      items,
    });
  };

  const showTooltip = (e: React.MouseEvent | React.PointerEvent, content: React.ReactNode) => {
    setTip({
      show: true,
      x: e.clientX,
      y: e.clientY - 12,
      content,
    });
  };

  // Responsive Plot Widths
  const monthlyScrollerRef = useRef<HTMLDivElement>(null);
  const tierScrollerRef = useRef<HTMLDivElement>(null);
  const segScrollerRef = useRef<HTMLDivElement>(null);
  const [monthlyPlotWidth, setMonthlyPlotWidth] = useState<number>(1060);
  const [tierPlotWidth, setTierPlotWidth] = useState<number>(1060);
  const [segPlotWidth, setSegPlotWidth] = useState<number>(1060);

  useEffect(() => {
    const updateWidths = () => {
      if (monthlyScrollerRef.current) setMonthlyPlotWidth(Math.max(760, monthlyScrollerRef.current.clientWidth));
      if (tierScrollerRef.current) setTierPlotWidth(Math.max(720, tierScrollerRef.current.clientWidth));
      if (segScrollerRef.current) setSegPlotWidth(Math.max(720, segScrollerRef.current.clientWidth));
    };
    updateWidths();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateWidths) : null;
    if (ro) {
      if (monthlyScrollerRef.current) ro.observe(monthlyScrollerRef.current);
      if (tierScrollerRef.current) ro.observe(tierScrollerRef.current);
      if (segScrollerRef.current) ro.observe(segScrollerRef.current);
    }
    window.addEventListener('resize', updateWidths);
    return () => {
      window.removeEventListener('resize', updateWidths);
      ro?.disconnect();
    };
  }, [activePerspective]);

  // Split items by year
  const itemsByYear = useMemo(() => {
    const map: Record<string, AcademicItem[]> = {};
    baseAllItems.forEach((it) => {
      const y = resolveAcademicYear(it);
      if (!map[y]) map[y] = [];
      map[y].push(it);
    });
    return map;
  }, [baseAllItems]);

  const curItems = useMemo(() => (year === 'all' ? baseAllItems : itemsByYear[year] || []), [itemsByYear, year, baseAllItems]);
  const cmpItems = useMemo(() => (cmpYear === 'all' ? baseAllItems : itemsByYear[cmpYear] || []), [itemsByYear, cmpYear, baseAllItems]);
  const hasCmpData = cmpItems.length > 0;
  const isCmp = isCompare && hasCmpData;

  // Render Delta Chip (SDGs Badge Style)
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
        <span style={{ ...baseBadgeStyle, backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
          –
        </span>
      );
    }
    if (p === 0 && c > 0) {
      return (
        <span style={{ ...baseBadgeStyle, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
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
      const pct = p > 0 ? (diff / p) * 100 : 0;
      t = `${pct > 0 ? '+' : ''}${Math.abs(pct).toFixed(0)}%`;
      isSame = Math.abs(pct) < 0.5;
    }
    if (isSame) {
      return (
        <span style={{ ...baseBadgeStyle, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
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

  // Monthly Statistics
  const getMonthlyStats = (items: AcademicItem[]) => {
    const majN = Array(12).fill(0);
    const stdN = Array(12).fill(0);
    const majB = Array(12).fill(0);
    const stdB = Array(12).fill(0);
    let miss = 0;
    let missB = 0;

    items.forEach((it) => {
      const mi = resolveAcademicMonthIdx(it);
      const b = Number(it.budget) || 0;
      const bM = b / 1_000_000;
      const isMaj = b >= 1_000_000;
      if (mi === -1) {
        miss++;
        missB += bM;
      } else {
        if (isMaj) {
          majN[mi]++;
          majB[mi] += bM;
        } else {
          stdN[mi]++;
          stdB[mi] += bM;
        }
      }
    });
    return { majN, stdN, majB, stdB, miss, missB: Number(missB.toFixed(2)) };
  };

  const curMonthly = useMemo(() => getMonthlyStats(curItems), [curItems]);
  const cmpMonthly = useMemo(() => getMonthlyStats(cmpItems), [cmpItems]);

  const getMonthItems = (items: AcademicItem[], mIdx: number, filterType: 'maj' | 'std' | 'vis' = 'vis') => {
    return items.filter((it) => {
      if (resolveAcademicMonthIdx(it) !== mIdx) return false;
      const isMaj = (Number(it.budget) || 0) >= 1_000_000;
      if (filterType === 'maj') return isMaj;
      if (filterType === 'std') return !isMaj;
      if (isMaj && hideMajor) return false;
      if (!isMaj && hideStd) return false;
      return true;
    });
  };

  // Contract Size Tier Stats (split by Specified Client vs Unspecified Client for group/stack)
  const getTierStats = (items: AcademicItem[]) => {
    const spec = Array(4).fill(0);
    const unspec = Array(4).fill(0);
    const totN = Array(4).fill(0);
    const totB = Array(4).fill(0);
    items.forEach((it) => {
      const b = Number(it.budget) || 0;
      const idx = getTierIdx(b);
      const val = tierMetric === 'n' ? 1 : b / 1_000_000;
      const isUnspec = getClientSegKey(it.client) === 'unspecified';
      if (isUnspec) unspec[idx] += val;
      else spec[idx] += val;
      totN[idx] += 1;
      totB[idx] += b / 1_000_000;
    });
    return { spec, unspec, totN, totB };
  };

  const curTierStats = useMemo(() => getTierStats(curItems), [curItems, tierMetric]);
  const cmpTierStats = useMemo(() => getTierStats(cmpItems), [cmpItems, tierMetric]);

  // Department Metrics (using official UCOL colors)
  const computeDeptMetrics = (items: AcademicItem[]) => {
    const map: Record<string, { code: string; name: string; b: number; n: number; a: number; alloc: number; items: AcademicItem[] }> = {};
    const baseDepts = ['IRRE', 'CPE', 'FE', 'CE', 'ME', 'AE', 'IE', 'EEEC', 'TDWCB', 'OTH'];
    baseDepts.forEach((c) => {
      map[c] = { code: c, name: UFULL[c] || c, b: 0, n: 0, a: 0, alloc: 0, items: [] };
    });

    items.forEach((it) => {
      const code = resolveDeptCode(it.department, (it as any).departmentCode);
      if (!map[code]) {
        map[code] = { code, name: UFULL[code] || code, b: 0, n: 0, a: 0, alloc: 0, items: [] };
      }
      const b = Number(it.budget) || 0;
      const bM = b / 1_000_000;
      map[code].b += bM;
      map[code].n += 1;
      map[code].alloc += bM * 0.15;
      map[code].items.push(it);
    });

    Object.values(map).forEach((d) => {
      d.b = Number(d.b.toFixed(2));
      d.alloc = Number(d.alloc.toFixed(2));
      d.a = d.n > 0 ? Number((d.b / d.n).toFixed(2)) : 0;
    });

    return map;
  };

  const curDepts = useMemo(() => computeDeptMetrics(curItems), [curItems]);
  const cmpDepts = useMemo(() => computeDeptMetrics(cmpItems), [cmpItems]);

  const rankedDeptCodes = useMemo(() => {
    return Object.keys(curDepts)
      .filter((c) => curDepts[c].n > 0 || (isCmp && cmpDepts[c]?.n > 0) || ['IRRE', 'CPE', 'FE', 'CE', 'ME', 'AE', 'IE'].includes(c))
      .sort((a, b) => (curDepts[b][deptMetric] || 0) - (curDepts[a][deptMetric] || 0));
  }, [curDepts, cmpDepts, deptMetric, isCmp]);

  const maxDeptVal = useMemo(() => {
    let mx = 0;
    rankedDeptCodes.forEach((c) => {
      mx = Math.max(mx, curDepts[c]?.[deptMetric] || 0, isCmp ? cmpDepts[c]?.[deptMetric] || 0 : 0);
    });
    return mx || 1;
  }, [rankedDeptCodes, curDepts, cmpDepts, deptMetric, isCmp]);

  // Client Segments Stats
  const displaySegCats = useMemo(() => {
    return hideMissingClient ? SEGMENT_CATS.filter((s) => s.key !== 'unspecified') : SEGMENT_CATS;
  }, [hideMissingClient]);

  const getClientSegStats = (items: AcademicItem[]) => {
    const maj = Array(displaySegCats.length).fill(0);
    const std = Array(displaySegCats.length).fill(0);
    const totN = Array(displaySegCats.length).fill(0);
    const totB = Array(displaySegCats.length).fill(0);
    const bucketItems: AcademicItem[][] = Array.from({ length: displaySegCats.length }, () => []);

    items.forEach((it) => {
      const k = getClientSegKey(it.client);
      const idx = displaySegCats.findIndex((s) => s.key === k);
      if (idx === -1) return;
      const b = Number(it.budget) || 0;
      const val = segMetric === 'n' ? 1 : b / 1_000_000;
      if (b >= 1_000_000) maj[idx] += val;
      else std[idx] += val;
      totN[idx] += 1;
      totB[idx] += b / 1_000_000;
      bucketItems[idx].push(it);
    });

    return { maj, std, totN, totB, bucketItems };
  };

  const curSegStats = useMemo(() => getClientSegStats(curItems), [curItems, displaySegCats, segMetric]);
  const cmpSegStats = useMemo(() => getClientSegStats(cmpItems), [cmpItems, displaySegCats, segMetric]);

  // Top 7 Clients Ranking
  const computeClientsMap = (items: AcademicItem[]) => {
    const map: Record<string, { name: string; segKey: string; budgetM: number; avgM: number; count: number; items: AcademicItem[] }> = {};
    items.forEach((it) => {
      let c = String(it.client || '').replace(/\r?\n/g, ' ').trim();
      if (!c || c === 'nan' || c === '-') c = 'ไม่ระบุผู้ว่าจ้าง';
      if (hideMissingClient && (c === 'ไม่ระบุผู้ว่าจ้าง' || c === 'ไม่ระบุหน่วยงาน')) return;
      if (!map[c]) {
        map[c] = { name: c, segKey: getClientSegKey(c), budgetM: 0, avgM: 0, count: 0, items: [] };
      }
      map[c].budgetM += (Number(it.budget) || 0) / 1_000_000;
      map[c].count += 1;
      map[c].items.push(it);
    });
    Object.values(map).forEach((cl) => {
      cl.budgetM = Number(cl.budgetM.toFixed(2));
      cl.avgM = cl.count > 0 ? Number((cl.budgetM / cl.count).toFixed(2)) : 0;
    });
    return map;
  };

  const curClientsMap = useMemo(() => computeClientsMap(curItems), [curItems, hideMissingClient]);
  const cmpClientsMap = useMemo(() => computeClientsMap(cmpItems), [cmpItems, hideMissingClient]);

  const top7Clients = useMemo(() => {
    return Object.values(curClientsMap)
      .sort((a, b) => {
        if (clientValueMetric === 'average') return b.avgM - a.avgM;
        if (clientValueMetric === 'count') return b.count - a.count;
        return b.budgetM - a.budgetM;
      })
      .slice(0, 7);
  }, [curClientsMap, clientValueMetric]);

  // Faculty leads ranking (for `faculty` tab)
  const computeFacultyLeadsMap = (items: AcademicItem[]) => {
    const map: Record<
      string,
      {
        key: string;
        head: string;
        head_id?: number | string;
        deptCode: string;
        count: number;
        totalBudget: number;
        totalBudgetM: number;
        majN: number;
        stdN: number;
        majB: number;
        stdB: number;
        clients: Set<string>;
        items: AcademicItem[];
      }
    > = {};
    items.forEach((item) => {
      const headName = String(item.head || '').replace(/\r?\n/g, ' ').trim();
      if (!headName || headName === '-' || headName === 'nan') return;
      const headId = resolvePersonnelTargetId(item.head_id, headName) ?? undefined;
      const key = headId ? `id_${headId}` : headName;
      if (!map[key]) {
        map[key] = {
          key,
          head: headName,
          head_id: headId || item.head_id,
          deptCode: resolveDeptCode(item.department, (item as any).departmentCode),
          count: 0,
          totalBudget: 0,
          totalBudgetM: 0,
          majN: 0,
          stdN: 0,
          majB: 0,
          stdB: 0,
          clients: new Set(),
          items: [],
        };
      }
      const b = Number(item.budget) || 0;
      const bM = b / 1_000_000;
      map[key].count++;
      map[key].totalBudget += b;
      map[key].totalBudgetM += bM;
      if (b >= 1_000_000) {
        map[key].majN++;
        map[key].majB += bM;
      } else {
        map[key].stdN++;
        map[key].stdB += bM;
      }
      if (item.client) map[key].clients.add(item.client);
      map[key].items.push(item);
    });
    Object.values(map).forEach((f) => {
      f.totalBudgetM = Number(f.totalBudgetM.toFixed(2));
      f.majB = Number(f.majB.toFixed(2));
      f.stdB = Number(f.stdB.toFixed(2));
    });
    return map;
  };

  const curFacultyLeadsMap = useMemo(() => computeFacultyLeadsMap(curItems), [curItems]);
  const cmpFacultyLeadsMap = useMemo(() => computeFacultyLeadsMap(cmpItems), [cmpItems]);

  const top10FacultyLeads = useMemo(() => {
    return Object.values(curFacultyLeadsMap)
      .sort((a, b) => (facultyMetric === 'n' ? b.count - a.count || b.totalBudget - a.totalBudget : b.totalBudget - a.totalBudget))
      .slice(0, 10);
  }, [curFacultyLeadsMap, facultyMetric]);

  const facultyLeadsRanking = useMemo(() => {
    return Object.values(computeFacultyLeadsMap(validData)).sort((a, b) => b.totalBudget - a.totalBudget);
  }, [validData]);

  // Totals for sumline
  const totalCurProjects = curItems.length;
  const totalCurBudget = useMemo(
    () => curItems.reduce((s, it) => s + (Number(it.budget) || 0), 0) / 1_000_000,
    [curItems]
  );
  const totalCmpProjects = cmpItems.length;
  const totalCmpBudget = useMemo(
    () => cmpItems.reduce((s, it) => s + (Number(it.budget) || 0), 0) / 1_000_000,
    [cmpItems]
  );

  // Reusable Year & Compare Controls Header
  const renderYearControls = (extraControls?: React.ReactNode) => (
    <div className="rr-ctrls">
      <YearSelectDropdown
        label="ปี"
        value={year}
        onChange={(newY) => {
          setYear(newY);
          if (cmpYear === newY) {
            setCmpYear(getDefaultCompareYear(newY, availableYears));
          }
        }}
        includeAll={true}
        allPosition="top"
      />

      <div className="rr-seg-ctl" role="group" aria-label="โหมดการแสดงผล">
        <button type="button" aria-pressed={!isCompare} onClick={() => setIsCompare(false)}>
          ภาพรวม
        </button>
        <button type="button" aria-pressed={isCompare} onClick={() => setIsCompare(true)}>
          เปรียบเทียบข้ามปี
        </button>
      </div>

      {isCompare && (
        <YearSelectDropdown
          label="เทียบกับปี"
          value={cmpYear}
          onChange={(newCmp) => setCmpYear(newCmp)}
          excludeYear={year}
          includeAll={false}
          hasDataByYear={availableYears.reduce<Record<string, boolean>>((acc, y) => {
            acc[y] = Boolean(itemsByYear[y]?.length);
            return acc;
          }, {})}
        />
      )}
      {extraControls}
    </div>
  );

  // Monthly SVG Dimensions & Scales
  const svgW = monthlyPlotWidth;
  const svgH = 350;
  const L = 56;
  const R = showLine ? 58 : 28;
  const Tp = 34;
  const B = 36;
  const pw = svgW - L - R;
  const ph = svgH - Tp - B;
  const slot = pw / 12;

  const visKeys = (['maj', 'std'] as const).filter((k) => (k === 'maj' ? !hideMajor : !hideStd));
  let maxN = 0;
  let maxB = 0;
  for (let i = 0; i < 12; i++) {
    const cMajN = !hideMajor ? curMonthly.majN[i] : 0;
    const cStdN = !hideStd ? curMonthly.stdN[i] : 0;
    const pMajN = isCmp && !hideMajor ? cmpMonthly.majN[i] : 0;
    const pStdN = isCmp && !hideStd ? cmpMonthly.stdN[i] : 0;
    const cTotN = cMajN + cStdN;
    const pTotN = pMajN + pStdN;
    const cTotB = (!hideMajor ? curMonthly.majB[i] : 0) + (!hideStd ? curMonthly.stdB[i] : 0);
    const pTotB = isCmp ? (!hideMajor ? cmpMonthly.majB[i] : 0) + (!hideStd ? cmpMonthly.stdB[i] : 0) : 0;

    if (isCmp) maxN = Math.max(maxN, cTotN, pTotN);
    else if (barMode === 'group') maxN = Math.max(maxN, cMajN, cStdN);
    else maxN = Math.max(maxN, cTotN);
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

  const curLinePts: [number, number][] = [];
  const cmpLinePts: [number, number][] = [];
  const topYs: number[] = [];
  for (let i = 0; i < 12; i++) {
    const cx = L + slot * i + slot / 2;
    const cTotB = (!hideMajor ? curMonthly.majB[i] : 0) + (!hideStd ? curMonthly.stdB[i] : 0);
    const pTotB = (!hideMajor ? cmpMonthly.majB[i] : 0) + (!hideStd ? cmpMonthly.stdB[i] : 0);
    curLinePts.push([cx, yR(cTotB)]);
    if (isCmp) cmpLinePts.push([cx, yR(pTotB)]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
      {/* DIMENSION 1: Timeline & Allocation */}
      {activePerspective === 'timeline_alloc' && (
        <div className="rr-container">
          <div className="rr-wrap">
            {/* CHART 1: กราฟจำนวนโครงการและงบประมาณสัญญารายเดือน */}
            <section className="rr-card rr-full" aria-labelledby="ac-t1">
              <div className="rr-head">
                <h2 className="rr-title-h2" id="ac-t1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M5 20V10M12 20V4M19 20v-7" />
                  </svg>
                  <span>
                    {isCmp
                      ? `กราฟจำนวนโครงการและงบประมาณสัญญารายเดือน (ปี ${year} vs ปี ${cmpYear})`
                      : 'กราฟจำนวนโครงการและงบประมาณสัญญารายเดือน'}
                  </span>
                </h2>
                {renderYearControls(
                  !isCmp ? (
                    <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                      <button type="button" aria-pressed={barMode === 'group'} onClick={() => setBarMode('group')}>
                        แยกแท่ง
                      </button>
                      <button type="button" aria-pressed={barMode === 'stack'} onClick={() => setBarMode('stack')}>
                        แท่งซ้อน
                      </button>
                    </div>
                  ) : undefined
                )}
              </div>

              {isCompare && !hasCmpData && (
                <p className="rr-note" style={{ color: '#dc2626' }}>
                  ปี {cmpYear} ไม่มีข้อมูลในฐานข้อมูล จึงแสดงเฉพาะข้อมูลปี {year}
                </p>
              )}

              <div className="rr-legend">
                {isCmp && <span className="rr-lbl">นับเฉพาะ</span>}
                <button
                  type="button"
                  className="rr-pill"
                  style={{ '--c': CONTRACT_SPLIT.major.c } as React.CSSProperties}
                  aria-pressed={!hideMajor}
                  onClick={() => {
                    if (!hideMajor && hideStd) return;
                    setHideMajor(!hideMajor);
                  }}
                >
                  <i />
                  {CONTRACT_SPLIT.major.n}
                </button>
                <button
                  type="button"
                  className="rr-pill"
                  style={{ '--c': CONTRACT_SPLIT.std.c } as React.CSSProperties}
                  aria-pressed={!hideStd}
                  onClick={() => {
                    if (!hideStd && hideMajor) return;
                    setHideStd(!hideStd);
                  }}
                >
                  <i />
                  {CONTRACT_SPLIT.std.n}
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
                  {isCmp ? `งบประมาณสัญญา ปี ${year}` : 'งบประมาณสัญญารวม (เส้น)'}
                </button>

                {isCmp && showLine && (
                  <span className="rr-pill st" style={{ '--c': '#f59e0b' } as React.CSSProperties}>
                    <i className="ln ds" />
                    งบประมาณสัญญา ปี {cmpYear}
                  </span>
                )}
              </div>

              <div className="rr-scroller" ref={monthlyScrollerRef}>
                <div
                  className="rr-plot"
                  style={{ minWidth: '760px', width: `${svgW}px` }}
                  onPointerLeave={() => {
                    setActiveMonthIdx(null);
                    setActiveSegKey(null);
                    setActiveDotMonth(null);
                    setTip((t) => ({ ...t, show: false }));
                  }}
                >
                  <svg
                    width={svgW}
                    height={svgH}
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}
                    role="img"
                  >
                    {Array.from({ length: nTicks + 1 }).map((_, i) => {
                      const y = yL(i * nzN.step);
                      const bVal = Math.round(i * stepB * 100) / 100;
                      return (
                        <g key={i}>
                          <line x1={L} x2={svgW - R} y1={y} y2={y} stroke="#e8edf3" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '3 5'} />
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

                    <text transform={`translate(16, ${Tp + ph / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted)">
                      จำนวนโครงการ (โครงการ)
                    </text>
                    {showLine && (
                      <text transform={`translate(${svgW - 8}, ${Tp + ph / 2}) rotate(90)`} textAnchor="middle" fontSize="12" fill="var(--mt)" fontWeight="600">
                        งบประมาณสัญญา (ล้านบาท)
                      </text>
                    )}

                    {/* Column Hover Background Highlight */}
                    {MON.map((_, i) => (
                      <rect
                        key={`colbg-${i}`}
                        x={L + slot * i + 3}
                        y={Tp - 6}
                        width={slot - 6}
                        height={ph + 6}
                        rx="14"
                        fill="rgba(15, 23, 42, 0.05)"
                        opacity={activeMonthIdx === i ? 1 : 0}
                        style={{ transition: 'opacity 0.12s' }}
                        pointerEvents="none"
                      />
                    ))}

                    {/* Column Hit Areas */}
                    {MON.map((mName, i) => {
                      const x0 = L + slot * i;
                      const cMajN = !hideMajor ? curMonthly.majN[i] : 0;
                      const cStdN = !hideStd ? curMonthly.stdN[i] : 0;
                      const cTotN = cMajN + cStdN;
                      const cMajB = !hideMajor ? curMonthly.majB[i] : 0;
                      const cStdB = !hideStd ? curMonthly.stdB[i] : 0;
                      const cTotB = cMajB + cStdB;
                      const pTotN = isCmp ? (!hideMajor ? cmpMonthly.majN[i] : 0) + (!hideStd ? cmpMonthly.stdN[i] : 0) : 0;
                      const pTotB = isCmp ? (!hideMajor ? cmpMonthly.majB[i] : 0) + (!hideStd ? cmpMonthly.stdB[i] : 0) : 0;

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
                              openDrawer(`โครงการพัฒนาวิชาการประจำเดือน${mName} ปีงบประมาณ ${cmpYear}`, getMonthItems(cmpItems, i, 'vis'));
                            } else {
                              openDrawer(`โครงการพัฒนาวิชาการประจำเดือน${mName} ปีงบประมาณ ${year}`, curList);
                            }
                          }}
                          onPointerMove={(e) => {
                            setActiveMonthIdx(i);
                            setActiveSegKey(null);
                            setActiveDotMonth(null);
                            showTooltip(
                              e,
                              isCmp ? (
                                <div>
                                  <div className="rr-tt-h">
                                    <i style={{ backgroundColor: '#6366f1' }} />
                                    <span>{mName} ({year} vs {cmpYear})</span>
                                  </div>
                                  <div className="rr-tt-r">
                                    <span>ปี {year}</span>
                                    <b>{cTotN} โครงการ · {cTotB.toFixed(2)} ลบ.</b>
                                  </div>
                                  <div className="rr-tt-r">
                                    <span>ปี {cmpYear}</span>
                                    <b>{pTotN} โครงการ · {pTotB.toFixed(2)} ลบ.</b>
                                  </div>
                                  <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                                </div>
                              ) : (
                                <div>
                                  <div className="rr-tt-h">
                                    <i style={{ backgroundColor: '#0ea5e9' }} />
                                    <span>{mName} {year}</span>
                                  </div>
                                  {!hideMajor && (
                                    <div className="rr-tt-r">
                                      <span>สัญญา ≥ 1 ลบ.</span>
                                      <b>{cMajN} โครงการ · {cMajB.toFixed(2)} ลบ.</b>
                                    </div>
                                  )}
                                  {!hideStd && (
                                    <div className="rr-tt-r">
                                      <span>สัญญา &lt; 1 ลบ.</span>
                                      <b>{cStdN} โครงการ · {cStdB.toFixed(2)} ลบ.</b>
                                    </div>
                                  )}
                                  <div className="rr-tt-r">
                                    <span>รวมทั้งหมด</span>
                                    <b>{cTotN} โครงการ · {cTotB.toFixed(2)} ลบ.</b>
                                  </div>
                                  <div className="rr-tt-s">
                                    เฉลี่ย {cTotN > 0 ? (cTotB / cTotN).toFixed(2) : '0.00'} ลบ./โครงการ · คลิกเพื่อดูรายการ
                                  </div>
                                </div>
                              )
                            );
                          }}
                        />
                      );
                    })}

                    {/* Bars per Month */}
                    {MON.map((mName, i) => {
                      const x0 = L + slot * i;
                      const cx = x0 + slot / 2;
                      let colTopY = Tp + ph;

                      const cMajN = !hideMajor ? curMonthly.majN[i] : 0;
                      const cStdN = !hideStd ? curMonthly.stdN[i] : 0;
                      const cTotN = cMajN + cStdN;
                      const cMajB = !hideMajor ? curMonthly.majB[i] : 0;
                      const cStdB = !hideStd ? curMonthly.stdB[i] : 0;
                      const cTotB = cMajB + cStdB;
                      const pTotN = isCmp ? (!hideMajor ? cmpMonthly.majN[i] : 0) + (!hideStd ? cmpMonthly.stdN[i] : 0) : 0;
                      const pTotB = isCmp ? (!hideMajor ? cmpMonthly.majB[i] : 0) + (!hideStd ? cmpMonthly.stdB[i] : 0) : 0;

                      let barsSvg: React.ReactNode = null;

                      if (isCmp) {
                        const bw = Math.min(34, slot * 0.32);
                        const gap = 5;
                        const hC = (ph * cTotN) / (nzN.top || 1);
                        const hP = (ph * pTotN) / (nzN.top || 1);
                        colTopY = Math.min(Tp + ph - hC, Tp + ph - hP);
                        const isCmpHov = activeMonthIdx === i && activeSegKey === 'cmp';
                        const isCurHov = activeMonthIdx === i && activeSegKey === 'cur';

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
                                    filter: isCmpHov ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.95)' : 'none',
                                    opacity: activeSegKey && !isCmpHov ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDrawer(`โครงการพัฒนาวิชาการประจำเดือน${mName} ปีงบประมาณ ${cmpYear}`, getMonthItems(cmpItems, i, 'vis'));
                                  }}
                                  onPointerMove={(e) => {
                                    e.stopPropagation();
                                    setActiveMonthIdx(i);
                                    setActiveSegKey('cmp');
                                    showTooltip(
                                      e,
                                      <div>
                                        <div className="rr-tt-h">
                                          <i style={{ backgroundColor: '#cbd5e1' }} />
                                          <span>ปี {cmpYear} · {mName}</span>
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
                                <text x={cx - bw / 2 - gap / 2} y={Tp + ph - hP - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#64748b" pointerEvents="none">
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
                                    filter: isCurHov ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                    opacity: activeSegKey && !isCurHov ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDrawer(`โครงการพัฒนาวิชาการประจำเดือน${mName} ปีงบประมาณ ${year}`, getMonthItems(curItems, i, 'vis'));
                                  }}
                                  onPointerMove={(e) => {
                                    e.stopPropagation();
                                    setActiveMonthIdx(i);
                                    setActiveSegKey('cur');
                                    showTooltip(
                                      e,
                                      <div>
                                        <div className="rr-tt-h">
                                          <i style={{ backgroundColor: '#6366f1' }} />
                                          <span>ปี {year} · {mName}</span>
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
                                <text x={cx + bw / 2 + gap / 2} y={Tp + ph - hC - 7} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a" pointerEvents="none">
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
                        const hMaj = (ph * cMajN) / (nzN.top || 1);
                        const hStd = (ph * cStdN) / (nzN.top || 1);
                        const isMajHov = activeMonthIdx === i && activeSegKey === 'maj';
                        const isStdHov = activeMonthIdx === i && activeSegKey === 'std';

                        barsSvg = (
                          <>
                            {!hideMajor && cMajN > 0 && (
                              <g>
                                <rect
                                  className="rr-rise"
                                  x={sx}
                                  y={Tp + ph - hMaj}
                                  width={bw}
                                  height={hMaj}
                                  rx={Math.min(8, hMaj / 2)}
                                  fill={CONTRACT_SPLIT.major.c}
                                  style={{
                                    cursor: 'pointer',
                                    filter: isMajHov ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                    opacity: activeSegKey && !isMajHov ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDrawer(`โครงการพัฒนาวิชาการ (สัญญา ≥ 1 ลบ.) — เดือน${mName} ปี ${year}`, getMonthItems(curItems, i, 'maj'));
                                  }}
                                  onPointerMove={(e) => {
                                    e.stopPropagation();
                                    setActiveMonthIdx(i);
                                    setActiveSegKey('maj');
                                    showTooltip(
                                      e,
                                      <div>
                                        <div className="rr-tt-h">
                                          <i style={{ backgroundColor: CONTRACT_SPLIT.major.c }} />
                                          <span>{CONTRACT_SPLIT.major.n} · {mName} {year}</span>
                                        </div>
                                        <div className="rr-tt-v">
                                          <b>{cMajN}</b>
                                          <span>โครงการ</span>
                                        </div>
                                        <div className="rr-tt-s">งบ {cMajB.toFixed(2)} ลบ. · คลิกเพื่อดูรายการ</div>
                                      </div>
                                    );
                                  }}
                                />
                                <text x={sx + bw / 2} y={Tp + ph - hMaj - 7} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                  {cMajN}
                                </text>
                              </g>
                            )}
                            {!hideStd && cStdN > 0 && (
                              <g>
                                <rect
                                  className="rr-rise"
                                  x={sx + (!hideMajor ? bw + gap : 0)}
                                  y={Tp + ph - hStd}
                                  width={bw}
                                  height={hStd}
                                  rx={Math.min(8, hStd / 2)}
                                  fill={CONTRACT_SPLIT.std.c}
                                  style={{
                                    cursor: 'pointer',
                                    filter: isStdHov ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                    opacity: activeSegKey && !isStdHov ? 0.6 : 1,
                                    transition: 'all 0.15s ease',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDrawer(`โครงการพัฒนาวิชาการ (สัญญา < 1 ลบ.) — เดือน${mName} ปี ${year}`, getMonthItems(curItems, i, 'std'));
                                  }}
                                  onPointerMove={(e) => {
                                    e.stopPropagation();
                                    setActiveMonthIdx(i);
                                    setActiveSegKey('std');
                                    showTooltip(
                                      e,
                                      <div>
                                        <div className="rr-tt-h">
                                          <i style={{ backgroundColor: CONTRACT_SPLIT.std.c }} />
                                          <span>{CONTRACT_SPLIT.std.n} · {mName} {year}</span>
                                        </div>
                                        <div className="rr-tt-v">
                                          <b>{cStdN}</b>
                                          <span>โครงการ</span>
                                        </div>
                                        <div className="rr-tt-s">งบ {cStdB.toFixed(2)} ลบ. · คลิกเพื่อดูรายการ</div>
                                      </div>
                                    );
                                  }}
                                />
                                <text x={sx + (!hideMajor ? bw + gap : 0) + bw / 2} y={Tp + ph - hStd - 7} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                  {cStdN}
                                </text>
                              </g>
                            )}
                          </>
                        );
                        colTopY = Math.min(cMajN ? Tp + ph - hMaj : Tp + ph, cStdN ? Tp + ph - hStd : Tp + ph);
                      } else {
                        const w2 = Math.min(52, slot * 0.54);
                        const gap = 3;
                        const segs = [
                          !hideMajor && cMajN > 0 ? { k: 'maj' as const, n: CONTRACT_SPLIT.major.n, c: CONTRACT_SPLIT.major.c, v: cMajN, b: cMajB } : null,
                          !hideStd && cStdN > 0 ? { k: 'std' as const, n: CONTRACT_SPLIT.std.n, c: CONTRACT_SPLIT.std.c, v: cStdN, b: cStdB } : null,
                        ].filter(Boolean) as Array<{ k: 'maj' | 'std'; n: string; c: string; v: number; b: number }>;

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
                                      openDrawer(`โครงการพัฒนาวิชาการ (${seg.n}) — เดือน${mName} ปี ${year}`, getMonthItems(curItems, i, seg.k));
                                    }}
                                    onPointerMove={(e) => {
                                      e.stopPropagation();
                                      setActiveMonthIdx(i);
                                      setActiveSegKey(seg.k);
                                      showTooltip(
                                        e,
                                        <div>
                                          <div className="rr-tt-h">
                                            <i style={{ backgroundColor: seg.c }} />
                                            <span>{seg.n} · {mName} {year}</span>
                                          </div>
                                          <div className="rr-tt-v">
                                            <b>{seg.v}</b>
                                            <span>โครงการ</span>
                                          </div>
                                          <div className="rr-tt-s">งบ {seg.b.toFixed(2)} ลบ. · คลิกเพื่อดูรายการ</div>
                                        </div>
                                      );
                                    }}
                                  />
                                  {h >= 15 && (
                                    <text x={cx} y={segY + h / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                      {seg.v}
                                    </text>
                                  )}
                                </g>
                              );
                            })}
                            {cTotN > 0 && (
                              <text x={cx} y={yL(cTotN) - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a" pointerEvents="none">
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
                          <text x={cx} y={svgH - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">
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
                        <path d={mono(curLinePts)} fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                        <path className="rr-draw" pathLength="1" d={mono(curLinePts)} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    )}
                    {showLine &&
                      curLinePts.map((pt, j) => {
                        const cTotB = (!hideMajor ? curMonthly.majB[j] : 0) + (!hideStd ? curMonthly.stdB[j] : 0);
                        const cTotN = (!hideMajor ? curMonthly.majN[j] : 0) + (!hideStd ? curMonthly.stdN[j] : 0);
                        if (cTotB <= 0) return null;
                        const textVal = cTotB >= 10 ? cTotB.toFixed(1) : cTotB.toFixed(2);
                        const pillW = Math.max(40, textVal.length * 7 + 14);
                        const pillH = 20;
                        let py = pt[1] - 28;
                        const barTop = topYs[j];
                        if (barTop < Tp + ph && py < barTop - 2 && py + pillH > barTop - 20) {
                          py = pt[1] + 10;
                        }
                        return (
                          <g key={j}>
                            <circle cx={pt[0]} cy={pt[1]} r={activeDotMonth === j ? 6.5 : 4} fill="#ffffff" stroke="#f59e0b" strokeWidth={2.5} pointerEvents="none" />
                            <rect className="rr-pl" x={pt[0] - pillW / 2} y={py} width={pillW} height={pillH} rx="10" />
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
                                openDrawer(`โครงการพัฒนาวิชาการประจำเดือน${MON[j]} ปีงบประมาณ ${year}`, getMonthItems(curItems, j, 'vis'));
                              }}
                              onPointerMove={(e) => {
                                e.stopPropagation();
                                setActiveMonthIdx(j);
                                setActiveDotMonth(j);
                                showTooltip(
                                  e,
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: '#f59e0b', height: '4px', width: '12px', borderRadius: '2px' }} />
                                      <span>งบประมาณสัญญา · {MON[j]} {year}</span>
                                    </div>
                                    <div className="rr-tt-v">
                                      <b>{cTotB.toFixed(2)}</b>
                                      <span>ล้านบาท</span>
                                    </div>
                                    <div className="rr-tt-s">{cTotN} โครงการ · คลิกเพื่อดูรายการ</div>
                                  </div>
                                );
                              }}
                            />
                          </g>
                        );
                      })}
                  </svg>

                  {/* YoY Delta Rows */}
                  {isCmp && (
                    <div style={{ marginTop: '6px', width: `${svgW}px` }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ width: `${L}px`, flex: `0 0 ${L}px`, fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textAlign: 'right', paddingRight: '10px' }}>
                          โครงการ
                        </span>
                        <div style={{ flex: 1, marginRight: `${R}px`, display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
                          {MON.map((_, i) => {
                            const cN = (!hideMajor ? curMonthly.majN[i] : 0) + (!hideStd ? curMonthly.stdN[i] : 0);
                            const pN = (!hideMajor ? cmpMonthly.majN[i] : 0) + (!hideStd ? cmpMonthly.stdN[i] : 0);
                            return (
                              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                                {renderChip(cN, pN, 'n')}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ width: `${L}px`, flex: `0 0 ${L}px`, fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textAlign: 'right', paddingRight: '10px' }}>
                          งบ
                        </span>
                        <div style={{ flex: 1, marginRight: `${R}px`, display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
                          {MON.map((_, i) => {
                            const cB = (!hideMajor ? curMonthly.majB[i] : 0) + (!hideStd ? curMonthly.stdB[i] : 0);
                            const pB = (!hideMajor ? cmpMonthly.majB[i] : 0) + (!hideStd ? cmpMonthly.stdB[i] : 0);
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

              <div className="rr-sumline">
                <span>
                  ปี {year} รวม <b>{totalCurProjects}</b> โครงการ
                </span>
                {isCmp && renderChip(totalCurProjects, totalCmpProjects, 'n')}
                <span>
                  งบประมาณสัญญารวม <b>{totalCurBudget.toFixed(2)}</b> ล้านบาท
                </span>
                {isCmp && renderChip(totalCurBudget, totalCmpBudget, 'b')}
                <span className="muted">
                  เฉลี่ย {totalCurProjects > 0 ? (totalCurBudget / totalCurProjects).toFixed(2) : '0.00'} ล้านบาท/โครงการ
                </span>
              </div>

              {curMonthly.miss > 0 && (
                <p
                  className="rr-note"
                  style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                  onClick={() =>
                    openDrawer(
                      `โครงการพัฒนาวิชาการที่ไม่ระบุเดือน — ปีงบประมาณ ${year}`,
                      curItems.filter((it) => resolveAcademicMonthIdx(it) === -1)
                    )
                  }
                >
                  หมายเหตุ: อีก {curMonthly.miss} โครงการไม่ระบุเดือนในสัญญา (งบประมาณ {curMonthly.missB.toFixed(2)} ล้านบาท) จึงไม่ปรากฏในกราฟรายเดือน (คลิกเพื่อดูรายการ)
                </p>
              )}
            </section>

            {/* CHART 2: การกระจายตัวตามขนาดมูลค่าสัญญา */}
            <section className="rr-card rr-full" aria-labelledby="ac-t2">
              <div className="rr-head">
                <h2 className="rr-title-h2" id="ac-t2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />
                  </svg>
                  <span>การกระจายตัวตามขนาดมูลค่าสัญญา</span>
                </h2>
                {renderYearControls(
                  <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัด">
                    <button type="button" aria-pressed={tierMetric === 'n'} onClick={() => setTierMetric('n')}>
                      จำนวนโครงการ
                    </button>
                    <button type="button" aria-pressed={tierMetric === 'b'} onClick={() => setTierMetric('b')}>
                      งบประมาณรวม
                    </button>
                  </div>
                )}
              </div>

              {!isCmp && (
                <div className="rr-ctrls rr-row2">
                  <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                    <button type="button" aria-pressed={tierBarMode === 'group'} onClick={() => setTierBarMode('group')}>
                      แยกแท่ง
                    </button>
                    <button type="button" aria-pressed={tierBarMode === 'stack'} onClick={() => setTierBarMode('stack')}>
                      แท่งซ้อน
                    </button>
                  </div>
                </div>
              )}

              <div className="rr-legend">
                {isCmp ? (
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
                    <span className="rr-pill st" style={{ '--c': '#0ea5e9' } as React.CSSProperties}>
                      <i />
                      ระบุหน่วยงานผู้ว่าจ้างชัดเจน
                    </span>
                    <span className="rr-pill st" style={{ '--c': '#22c55e' } as React.CSSProperties}>
                      <i />
                      รอระบุผู้ว่าจ้าง / ทั่วไป
                    </span>
                  </>
                )}
              </div>

              {(() => {
                const N = TIER_CATS.length;
                let mx = 0;
                for (let i = 0; i < N; i++) {
                  const cTot = curTierStats.spec[i] + curTierStats.unspec[i];
                  const pTot = isCmp ? cmpTierStats.spec[i] + cmpTierStats.unspec[i] : 0;
                  if (isCmp) mx = Math.max(mx, cTot, pTot);
                  else if (tierBarMode === 'group') mx = Math.max(mx, curTierStats.spec[i], curTierStats.unspec[i]);
                  else mx = Math.max(mx, cTot);
                }
                const nz = nice(mx, tierMetric === 'n');
                const nT = Math.round(nz.top / nz.step);
                const dW = tierPlotWidth;
                const dH = 320;
                const dL = 56;
                const dR = 28;
                const dPw = dW - dL - dR;
                const dPh = dH - Tp - B;
                const dSlot = dPw / N;
                const yTier = (v: number) => Tp + dPh - (dPh * v) / (nz.top || 1);

                return (
                  <div className="rr-scroller" ref={tierScrollerRef}>
                    <div
                      className="rr-plot"
                      style={{ minWidth: '720px', width: `${dW}px` }}
                      onPointerLeave={() => {
                        setActiveTierIdx(null);
                        setActiveTierSeg(null);
                        setTip((t) => ({ ...t, show: false }));
                      }}
                    >
                      <svg width={dW} height={dH} viewBox={`0 0 ${dW} ${dH}`} style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}>
                        {Array.from({ length: nT + 1 }).map((_, i) => {
                          const tVal = i * nz.step;
                          const y = yTier(tVal);
                          return (
                            <g key={i}>
                              <line x1={dL} x2={dW - dR} y1={y} y2={y} stroke="#e8edf3" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '3 5'} />
                              <text x={dL - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="500" fill="var(--muted)">
                                {Math.round(tVal * 10) / 10}
                              </text>
                            </g>
                          );
                        })}

                        <text transform={`translate(16, ${Tp + dPh / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted)">
                          {tierMetric === 'n' ? 'จำนวนโครงการ (โครงการ)' : 'งบประมาณสัญญา (ล้านบาท)'}
                        </text>

                        {TIER_CATS.map((cat, i) => {
                          const x0 = dL + dSlot * i;
                          const cx = x0 + dSlot / 2;
                          const cSpec = curTierStats.spec[i];
                          const cUnspec = curTierStats.unspec[i];
                          const curTot = cSpec + cUnspec;
                          const cmpTot = isCmp ? cmpTierStats.spec[i] + cmpTierStats.unspec[i] : 0;

                          let barsNode: React.ReactNode = null;
                          if (isCmp) {
                            const bw = Math.min(42, dSlot * 0.28);
                            const gap = 6;
                            const hC = (dPh * curTot) / (nz.top || 1);
                            const hP = (dPh * cmpTot) / (nz.top || 1);
                            barsNode = (
                              <>
                                {cmpTot > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + dPh - hP} width={bw} height={hP} rx={Math.min(8, hP / 2)} fill="var(--ghost)" />
                                    <text x={cx - bw / 2 - gap / 2} y={Tp + dPh - hP - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#64748b">
                                      {tierMetric === 'n' ? cmpTot : cmpTot.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                                {curTot > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx + gap / 2} y={Tp + dPh - hC} width={bw} height={hC} rx={Math.min(8, hC / 2)} fill="var(--cur)" />
                                    <text x={cx + bw / 2 + gap / 2} y={Tp + dPh - hC - 7} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a">
                                      {tierMetric === 'n' ? curTot : curTot.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                              </>
                            );
                          } else if (tierBarMode === 'group') {
                            const bw = Math.min(40, dSlot * 0.28);
                            const gap = 5;
                            const h1 = (dPh * cSpec) / (nz.top || 1);
                            const h2 = (dPh * cUnspec) / (nz.top || 1);
                            barsNode = (
                              <>
                                {cSpec > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + dPh - h1} width={bw} height={h1} rx={Math.min(8, h1 / 2)} fill="#0ea5e9" />
                                    <text x={cx - bw / 2 - gap / 2} y={Tp + dPh - h1 - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                                      {tierMetric === 'n' ? cSpec : cSpec.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                                {cUnspec > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx + gap / 2} y={Tp + dPh - h2} width={bw} height={h2} rx={Math.min(8, h2 / 2)} fill="#22c55e" />
                                    <text x={cx + bw / 2 + gap / 2} y={Tp + dPh - h2 - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                                      {tierMetric === 'n' ? cUnspec : cUnspec.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                              </>
                            );
                          } else {
                            const w2 = Math.min(64, dSlot * 0.42);
                            const gap = 3;
                            const segs = [
                              cSpec > 0 ? { k: 'spec', n: 'ระบุหน่วยงานผู้ว่าจ้างชัดเจน', c: '#0ea5e9', v: cSpec } : null,
                              cUnspec > 0 ? { k: 'unspec', n: 'รอระบุผู้ว่าจ้าง / ทั่วไป', c: '#22c55e', v: cUnspec } : null,
                            ].filter(Boolean) as Array<{ k: string; n: string; c: string; v: number }>;
                            let cum = 0;
                            barsNode = (
                              <>
                                {segs.map((seg) => {
                                  const y1 = yTier(cum + seg.v);
                                  const y0 = yTier(cum);
                                  const h = Math.max(y0 - y1 - gap, 4);
                                  const segY = y1 + gap / 2;
                                  const isHovered = activeTierIdx === i && activeTierSeg === seg.k;
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
                                        fill={seg.c}
                                        style={{
                                          cursor: 'pointer',
                                          filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                          opacity: activeTierSeg && !isHovered ? 0.6 : 1,
                                          transition: 'all 0.15s ease',
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openDrawer(
                                            `สัญญาพัฒนาวิชาการ (${seg.n}): ขนาดมูลค่า ${cat} (ปี ${year})`,
                                            curItems.filter((it) => {
                                              if (getTierIdx(Number(it.budget) || 0) !== i) return false;
                                              const isUnspec = getClientSegKey(it.client) === 'unspecified';
                                              return seg.k === 'unspec' ? isUnspec : !isUnspec;
                                            }),
                                            seg.c
                                          );
                                        }}
                                        onPointerMove={(e) => {
                                          e.stopPropagation();
                                          setActiveTierIdx(i);
                                          setActiveTierSeg(seg.k);
                                          showTooltip(
                                            e,
                                            <div>
                                              <div className="rr-tt-h">
                                                <i style={{ backgroundColor: seg.c }} />
                                                <span>{seg.n} · {cat}</span>
                                              </div>
                                              <div className="rr-tt-v">
                                                <b>{tierMetric === 'n' ? seg.v : seg.v.toFixed(2)}</b>
                                                <span>{tierMetric === 'n' ? 'โครงการ' : 'ล้านบาท'}</span>
                                              </div>
                                              <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                                            </div>
                                          );
                                        }}
                                      />
                                      {h >= 15 && (
                                        <text x={cx} y={segY + h / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                          {tierMetric === 'n' ? seg.v : seg.v.toFixed(1)}
                                        </text>
                                      )}
                                    </g>
                                  );
                                })}
                                {curTot > 0 && (
                                  <text x={cx} y={yTier(curTot) - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                    {tierMetric === 'n' ? curTot : curTot.toFixed(1)}
                                  </text>
                                )}
                              </>
                            );
                          }

                          return (
                            <g
                              key={cat}
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                openDrawer(
                                  `สัญญาพัฒนาวิชาการ: ขนาดมูลค่า ${cat} (ปี ${year})`,
                                  curItems.filter((it) => getTierIdx(Number(it.budget) || 0) === i)
                                )
                              }
                              onPointerMove={(e) => {
                                setActiveTierIdx(i);
                                showTooltip(
                                  e,
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: '#0ea5e9' }} />
                                      <span>ขนาดสัญญา: {cat}</span>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>จำนวนสัญญา</span>
                                      <b>{curTierStats.totN[i]} โครงการ</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>มูลค่าสัญญารวม</span>
                                      <b>{curTierStats.totB[i].toFixed(2)} ล้านบาท</b>
                                    </div>
                                    <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                                  </div>
                                );
                              }}
                            >
                              <rect x={x0 + 6} y={Tp - 6} width={dSlot - 12} height={dPh + 6} rx="14" fill="rgba(15, 23, 42, 0.05)" opacity={activeTierIdx === i ? 1 : 0} />
                              <rect x={x0} y={Tp - 6} width={dSlot} height={dPh + 6} fill="transparent" />
                              {barsNode}
                              <text x={cx} y={dH - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">
                                {cat}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {isCmp && (
                        <div style={{ marginTop: '6px', marginLeft: `${dL}px`, marginRight: `${dR}px`, display: 'grid', gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
                          {TIER_CATS.map((_, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                              {renderChip(curTierStats.spec[i] + curTierStats.unspec[i], cmpTierStats.spec[i] + cmpTierStats.unspec[i], tierMetric)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* CHART 3: งบประมาณโครงการพัฒนาวิชาการตามสังกัด (สีตามสังกัด UCOL) */}
            <section className="rr-card rr-full" aria-labelledby="ac-t3">
              <div className="rr-head">
                <h2 className="rr-title-h2" id="ac-t3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M4 6h12M4 12h16M4 18h8" />
                  </svg>
                  <span>งบประมาณโครงการพัฒนาวิชาการตามสังกัด</span>
                </h2>
                {renderYearControls(
                  <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัดสังกัด">
                    <button type="button" aria-pressed={deptMetric === 'b'} onClick={() => setDeptMetric('b')}>
                      งบรวม (ลบ.)
                    </button>
                    <button type="button" aria-pressed={deptMetric === 'n'} onClick={() => setDeptMetric('n')}>
                      จำนวนโครงการ
                    </button>
                    <button type="button" aria-pressed={deptMetric === 'a'} onClick={() => setDeptMetric('a')}>
                      เฉลี่ย/โครงการ
                    </button>
                    <button type="button" aria-pressed={deptMetric === 'alloc'} onClick={() => setDeptMetric('alloc')}>
                      รายได้จัดสรร 15%
                    </button>
                  </div>
                )}
              </div>

              <p className="rr-note">
                แสดงสีประจำสังกัดตามมาตรฐานคณะวิศวกรรมศาสตร์ กำแพงแสน · คลิกที่แถบสังกัดเพื่อดูรายการโครงการพัฒนาวิชาการ
              </p>

              <div className="rr-rows">
                {rankedDeptCodes.map((c) => {
                  const cur = curDepts[c];
                  const prev = isCmp ? cmpDepts[c] : null;
                  const v = cur?.[deptMetric] || 0;
                  const pv = prev ? prev[deptMetric] || 0 : 0;
                  const w = maxDeptVal > 0 ? (v / maxDeptVal) * 100 : 0;
                  const pw = maxDeptVal > 0 ? (pv / maxDeptVal) * 100 : 0;
                  const col = UCOL[c] || UCOL.OTH;

                  const fmtDeptVal = (val: number) => {
                    if (deptMetric === 'n') return `${val} โครงการ`;
                    if (deptMetric === 'a') return `${val.toFixed(2)} ลบ./โครงการ`;
                    return `${val.toFixed(2)} ลบ. (${cur.n} โครงการ)`;
                  };

                  return (
                    <div
                      key={c}
                      className="rr-row"
                      style={{ cursor: 'pointer' }}
                      onClick={() => openDrawer(`โครงการพัฒนาวิชาการ: สังกัด ${cur.name} (${c}) · ปี ${year}`, cur.items, col)}
                      onMouseEnter={(e) => {
                        showTooltip(
                          e,
                          <div>
                            <div className="rr-tt-h">
                              <i style={{ backgroundColor: col }} />
                              <span>{c} · {cur.name}</span>
                            </div>
                            <div className="rr-tt-r">
                              <span>งบสัญญารวม</span>
                              <b>{cur.b.toFixed(2)} ลบ.</b>
                            </div>
                            <div className="rr-tt-r">
                              <span>จำนวนโครงการ</span>
                              <b>{cur.n} โครงการ</b>
                            </div>
                            <div className="rr-tt-r">
                              <span>เฉลี่ยต่อสัญญา</span>
                              <b>{cur.a.toFixed(2)} ลบ./โครงการ</b>
                            </div>
                            <div className="rr-tt-r">
                              <span>รายได้จัดสรร 15%</span>
                              <b>{cur.alloc.toFixed(2)} ลบ.</b>
                            </div>
                            <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                          </div>
                        );
                      }}
                      onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
                    >
                      <span className="rr-uc" style={{ backgroundColor: col }}>
                        {c}
                      </span>
                      <div className="rr-trk">
                        <i className="rr-bar" style={{ width: `${w}%`, backgroundColor: col }} />
                        {isCmp && <i className="rr-bar gh" style={{ width: `${pw}%` }} />}
                      </div>
                      <span className="rr-vl">
                        {fmtDeptVal(v)}
                        {isCmp && renderChip(v, pv, deptMetric === 'n' ? 'n' : 'b')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Client & Industry Segmentation */}
      {activePerspective === 'client_segment' && (
        <div className="rr-container">
          <div className="rr-wrap">
            {/* CHART 4: มูลค่าโครงการจำแนกตามกลุ่มประเภทหน่วยงานผู้ว่าจ้าง */}
            <section className="rr-card rr-full" aria-labelledby="ac-c1">
              <div className="rr-head">
                <h2 className="rr-title-h2" id="ac-c1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M5 20V10M12 20V4M19 20v-7" />
                  </svg>
                  <span>มูลค่าโครงการจำแนกตามกลุ่มประเภทหน่วยงานผู้ว่าจ้าง</span>
                </h2>
                {renderYearControls(
                  <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัดกลุ่มผู้ว่าจ้าง">
                    <button type="button" aria-pressed={segMetric === 'b'} onClick={() => setSegMetric('b')}>
                      งบประมาณรวม
                    </button>
                    <button type="button" aria-pressed={segMetric === 'n'} onClick={() => setSegMetric('n')}>
                      จำนวนโครงการ
                    </button>
                  </div>
                )}
              </div>

              {!isCmp && (
                <div className="rr-ctrls rr-row2">
                  <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                    <button type="button" aria-pressed={segBarMode === 'group'} onClick={() => setSegBarMode('group')}>
                      แยกแท่ง
                    </button>
                    <button type="button" aria-pressed={segBarMode === 'stack'} onClick={() => setSegBarMode('stack')}>
                      แท่งซ้อน
                    </button>
                  </div>
                </div>
              )}

              <div className="rr-legend">
                {isCmp ? (
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
                    <span className="rr-pill st" style={{ '--c': CONTRACT_SPLIT.major.c } as React.CSSProperties}>
                      <i />
                      {CONTRACT_SPLIT.major.n}
                    </span>
                    <span className="rr-pill st" style={{ '--c': CONTRACT_SPLIT.std.c } as React.CSSProperties}>
                      <i />
                      {CONTRACT_SPLIT.std.n}
                    </span>
                  </>
                )}
              </div>

              {(() => {
                const N = displaySegCats.length;
                let mx = 0;
                for (let i = 0; i < N; i++) {
                  const cTot = curSegStats.maj[i] + curSegStats.std[i];
                  const pTot = isCmp ? cmpSegStats.maj[i] + cmpSegStats.std[i] : 0;
                  if (isCmp) mx = Math.max(mx, cTot, pTot);
                  else if (segBarMode === 'group') mx = Math.max(mx, curSegStats.maj[i], curSegStats.std[i]);
                  else mx = Math.max(mx, cTot);
                }
                const nz = nice(mx, segMetric === 'n');
                const nT = Math.round(nz.top / nz.step);
                const dW = segPlotWidth;
                const dH = 330;
                const dL = 56;
                const dR = 28;
                const dPw = dW - dL - dR;
                const dPh = dH - Tp - B;
                const dSlot = dPw / N;
                const ySeg = (v: number) => Tp + dPh - (dPh * v) / (nz.top || 1);

                return (
                  <div className="rr-scroller" ref={segScrollerRef}>
                    <div
                      className="rr-plot"
                      style={{ minWidth: '720px', width: `${dW}px` }}
                      onPointerLeave={() => {
                        setActiveClientSegIdx(null);
                        setActiveClientSegPart(null);
                        setTip((t) => ({ ...t, show: false }));
                      }}
                    >
                      <svg width={dW} height={dH} viewBox={`0 0 ${dW} ${dH}`} style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}>
                        {Array.from({ length: nT + 1 }).map((_, i) => {
                          const tVal = i * nz.step;
                          const y = ySeg(tVal);
                          return (
                            <g key={i}>
                              <line x1={dL} x2={dW - dR} y1={y} y2={y} stroke="#e8edf3" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '3 5'} />
                              <text x={dL - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="500" fill="var(--muted)">
                                {Math.round(tVal * 10) / 10}
                              </text>
                            </g>
                          );
                        })}

                        <text transform={`translate(16, ${Tp + dPh / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted)">
                          {segMetric === 'n' ? 'จำนวนโครงการ (โครงการ)' : 'มูลค่าสัญญา (ล้านบาท)'}
                        </text>

                        {displaySegCats.map((segInfo, i) => {
                          const x0 = dL + dSlot * i;
                          const cx = x0 + dSlot / 2;
                          const cMaj = curSegStats.maj[i];
                          const cStd = curSegStats.std[i];
                          const curTot = cMaj + cStd;
                          const cmpTot = isCmp ? cmpSegStats.maj[i] + cmpSegStats.std[i] : 0;

                          let barsNode: React.ReactNode = null;
                          if (isCmp) {
                            const bw = Math.min(40, dSlot * 0.28);
                            const gap = 5;
                            const hC = (dPh * curTot) / (nz.top || 1);
                            const hP = (dPh * cmpTot) / (nz.top || 1);
                            barsNode = (
                              <>
                                {cmpTot > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + dPh - hP} width={bw} height={hP} rx={Math.min(8, hP / 2)} fill="var(--ghost)" />
                                    <text x={cx - bw / 2 - gap / 2} y={Tp + dPh - hP - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#64748b">
                                      {segMetric === 'n' ? cmpTot : cmpTot.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                                {curTot > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx + gap / 2} y={Tp + dPh - hC} width={bw} height={hC} rx={Math.min(8, hC / 2)} fill="var(--cur)" />
                                    <text x={cx + bw / 2 + gap / 2} y={Tp + dPh - hC - 7} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a">
                                      {segMetric === 'n' ? curTot : curTot.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                              </>
                            );
                          } else if (segBarMode === 'group') {
                            const bw = Math.min(38, dSlot * 0.28);
                            const gap = 5;
                            const h1 = (dPh * cMaj) / (nz.top || 1);
                            const h2 = (dPh * cStd) / (nz.top || 1);
                            barsNode = (
                              <>
                                {cMaj > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + dPh - h1} width={bw} height={h1} rx={Math.min(8, h1 / 2)} fill={CONTRACT_SPLIT.major.c} />
                                    <text x={cx - bw / 2 - gap / 2} y={Tp + dPh - h1 - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                                      {segMetric === 'n' ? cMaj : cMaj.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                                {cStd > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx + gap / 2} y={Tp + dPh - h2} width={bw} height={h2} rx={Math.min(8, h2 / 2)} fill={CONTRACT_SPLIT.std.c} />
                                    <text x={cx + bw / 2 + gap / 2} y={Tp + dPh - h2 - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                                      {segMetric === 'n' ? cStd : cStd.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                              </>
                            );
                          } else {
                            const w2 = Math.min(62, dSlot * 0.42);
                            const gap = 3;
                            const segs = [
                              cMaj > 0 ? { k: 'maj', n: CONTRACT_SPLIT.major.n, c: CONTRACT_SPLIT.major.c, v: cMaj } : null,
                              cStd > 0 ? { k: 'std', n: CONTRACT_SPLIT.std.n, c: CONTRACT_SPLIT.std.c, v: cStd } : null,
                            ].filter(Boolean) as Array<{ k: string; n: string; c: string; v: number }>;
                            let cum = 0;
                            barsNode = (
                              <>
                                {segs.map((seg) => {
                                  const y1 = ySeg(cum + seg.v);
                                  const y0 = ySeg(cum);
                                  const h = Math.max(y0 - y1 - gap, 4);
                                  const segY = y1 + gap / 2;
                                  const isHovered = activeClientSegIdx === i && activeClientSegPart === seg.k;
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
                                        fill={seg.c}
                                        style={{
                                          cursor: 'pointer',
                                          filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                          opacity: activeClientSegPart && !isHovered ? 0.6 : 1,
                                          transition: 'all 0.15s ease',
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openDrawer(
                                            `โครงการพัฒนาวิชาการ (${seg.n}): ${segInfo.label} (ปี ${year})`,
                                            curSegStats.bucketItems[i].filter((it) =>
                                              seg.k === 'maj' ? (Number(it.budget) || 0) >= 1_000_000 : (Number(it.budget) || 0) < 1_000_000
                                            ),
                                            seg.c
                                          );
                                        }}
                                        onPointerMove={(e) => {
                                          e.stopPropagation();
                                          setActiveClientSegIdx(i);
                                          setActiveClientSegPart(seg.k);
                                          showTooltip(
                                            e,
                                            <div>
                                              <div className="rr-tt-h">
                                                <i style={{ backgroundColor: seg.c }} />
                                                <span>{seg.n} · {segInfo.short}</span>
                                              </div>
                                              <div className="rr-tt-v">
                                                <b>{segMetric === 'n' ? seg.v : seg.v.toFixed(2)}</b>
                                                <span>{segMetric === 'n' ? 'โครงการ' : 'ล้านบาท'}</span>
                                              </div>
                                              <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                                            </div>
                                          );
                                        }}
                                      />
                                      {h >= 15 && (
                                        <text x={cx} y={segY + h / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                          {segMetric === 'n' ? seg.v : seg.v.toFixed(1)}
                                        </text>
                                      )}
                                    </g>
                                  );
                                })}
                                {curTot > 0 && (
                                  <text x={cx} y={ySeg(curTot) - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                    {segMetric === 'n' ? curTot : curTot.toFixed(1)}
                                  </text>
                                )}
                              </>
                            );
                          }

                          return (
                            <g
                              key={segInfo.key}
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                openDrawer(
                                  `โครงการพัฒนาวิชาการ: ${segInfo.label} (ปี ${year})`,
                                  curSegStats.bucketItems[i],
                                  segInfo.c
                                )
                              }
                              onPointerMove={(e) => {
                                setActiveClientSegIdx(i);
                                showTooltip(
                                  e,
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: segInfo.c }} />
                                      <span>{segInfo.label}</span>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>จำนวนโครงการ</span>
                                      <b>{curSegStats.totN[i]} โครงการ</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>งบประมาณสัญญารวม</span>
                                      <b>{curSegStats.totB[i].toFixed(2)} ล้านบาท</b>
                                    </div>
                                    <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                                  </div>
                                );
                              }}
                            >
                              <rect x={x0 + 6} y={Tp - 6} width={dSlot - 12} height={dPh + 6} rx="14" fill="rgba(15, 23, 42, 0.05)" opacity={activeClientSegIdx === i ? 1 : 0} />
                              <rect x={x0} y={Tp - 6} width={dSlot} height={dPh + 6} fill="transparent" />
                              {barsNode}
                              <text x={cx} y={dH - 12} textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">
                                {segInfo.short}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {isCmp && (
                        <div style={{ marginTop: '6px', marginLeft: `${dL}px`, marginRight: `${dR}px`, display: 'grid', gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
                          {displaySegCats.map((_, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                              {renderChip(curSegStats.maj[i] + curSegStats.std[i], cmpSegStats.maj[i] + cmpSegStats.std[i], segMetric)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* CHART 5: 7 อันดับหน่วยงานผู้ว่าจ้างสูงสุด */}
            <section className="rr-card rr-full" aria-labelledby="ac-c2">
              <div className="rr-head">
                <h2 className="rr-title-h2" id="ac-c2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M4 6h12M4 12h16M4 18h8" />
                  </svg>
                  <span>7 อันดับหน่วยงานผู้ว่าจ้างสูงสุด</span>
                </h2>
                {renderYearControls(
                  <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัดผู้ว่าจ้าง">
                    <button type="button" aria-pressed={clientValueMetric === 'total'} onClick={() => setClientValueMetric('total')}>
                      มูลค่ารวม
                    </button>
                    <button type="button" aria-pressed={clientValueMetric === 'average'} onClick={() => setClientValueMetric('average')}>
                      เฉลี่ย/สัญญา
                    </button>
                    <button type="button" aria-pressed={clientValueMetric === 'count'} onClick={() => setClientValueMetric('count')}>
                      จำนวนสัญญา
                    </button>
                  </div>
                )}
              </div>

              <p className="rr-note">
                {clientValueMetric === 'average'
                  ? 'เรียงตามมูลค่าเฉลี่ยต่อสัญญาจากมากไปน้อย · คลิกแถวเพื่อดูรายการโครงการ'
                  : clientValueMetric === 'count'
                  ? 'เรียงตามจำนวนสัญญาจากมากไปน้อย · คลิกแถวเพื่อดูรายการโครงการ'
                  : 'เรียงตามมูลค่าสัญญารวมจากมากไปน้อย · คลิกแถวเพื่อดูรายการโครงการ'}
              </p>

              <div className="rr-rows">
                {(() => {
                  const getVal = (cl?: { budgetM: number; avgM: number; count: number }) => {
                    if (!cl) return 0;
                    if (clientValueMetric === 'average') return cl.avgM;
                    if (clientValueMetric === 'count') return cl.count;
                    return cl.budgetM;
                  };
                  const maxVal = Math.max(...top7Clients.map((c) => Math.max(getVal(c), isCmp ? getVal(cmpClientsMap[c.name]) : 0)), 1);

                  return top7Clients.map((cl, idx) => {
                    const segInfo = SEGMENT_CATS.find((s) => s.key === cl.segKey) || SEGMENT_CATS[0];
                    const v = getVal(cl);
                    const pv = isCmp ? getVal(cmpClientsMap[cl.name]) : 0;
                    const w = maxVal > 0 ? (v / maxVal) * 100 : 0;
                    const pw = maxVal > 0 ? (pv / maxVal) * 100 : 0;
                    const shortName = cl.name.length > 34 ? cl.name.slice(0, 32) + '...' : cl.name;

                    return (
                      <div
                        key={cl.name}
                        className="rr-row"
                        style={{ gridTemplateColumns: '240px 1fr auto', cursor: 'pointer' }}
                        onClick={() => {
                          openDrawer(`โครงการพัฒนาวิชาการ: ${cl.name} (ปี ${year})`, cl.items, segInfo.c);
                        }}
                        onMouseEnter={(e) => {
                          showTooltip(
                            e,
                            <div>
                              <div className="rr-tt-h">
                                <i style={{ backgroundColor: segInfo.c }} />
                                <span>{cl.name}</span>
                              </div>
                              <div className="rr-tt-r">
                                <span>กลุ่มผู้ว่าจ้าง</span>
                                <b>{segInfo.short}</b>
                              </div>
                              <div className="rr-tt-r">
                                <span>มูลค่าสัญญารวม</span>
                                <b>{cl.budgetM.toFixed(2)} ล้านบาท</b>
                              </div>
                              <div className="rr-tt-r">
                                <span>จำนวนสัญญา</span>
                                <b>{cl.count} สัญญา</b>
                              </div>
                              <div className="rr-tt-r">
                                <span>เฉลี่ยต่อสัญญา</span>
                                <b>{cl.avgM.toFixed(2)} ลบ./สัญญา</b>
                              </div>
                              <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                            </div>
                          );
                        }}
                        onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <span
                            className="rr-uc"
                            style={{ backgroundColor: segInfo.c, minWidth: '30px', padding: '3px 7px', fontSize: '11px' }}
                          >
                            #{idx + 1}
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: 700,
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={cl.name}
                          >
                            {shortName}
                          </span>
                        </div>
                        <div className="rr-trk">
                          <i className="rr-bar" style={{ width: `${w}%`, backgroundColor: segInfo.c }} />
                          {isCmp && <i className="rr-bar gh" style={{ width: `${pw}%` }} />}
                        </div>
                        <span className="rr-vl">
                          {clientValueMetric === 'count'
                            ? `${cl.count} สัญญา (${cl.budgetM.toFixed(2)} ลบ.)`
                            : clientValueMetric === 'average'
                            ? `${cl.avgM.toFixed(2)} ลบ./สัญญา`
                            : `${cl.budgetM.toFixed(2)} ลบ. (${cl.count} สัญญา)`}
                          {isCmp && renderChip(v, pv, clientValueMetric === 'count' ? 'n' : 'b')}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* DIMENSION 3: Top Academic Project Leads */}
      {activePerspective === 'faculty' && (
        <div className="rr-container">
          <div className="rr-wrap">
            {/* CHART: 10 อันดับอาจารย์หัวหน้าโครงการพัฒนาวิชาการที่มีมูลค่าสัญญารวมสูงสุด */}
            <section className="rr-card rr-full" aria-labelledby="ac-fac-t1">
              <div className="rr-head">
                <h2 className="rr-title-h2" id="ac-fac-t1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M5 20V10M12 20V4M19 20v-7" />
                  </svg>
                  <span>10 อันดับอาจารย์หัวหน้าโครงการพัฒนาวิชาการที่มีมูลค่าสัญญารวมสูงสุด</span>
                </h2>
                {renderYearControls(
                  <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัดหัวหน้าโครงการ">
                    <button type="button" aria-pressed={facultyMetric === 'b'} onClick={() => setFacultyMetric('b')}>
                      มูลค่าสัญญารวม (ลบ.)
                    </button>
                    <button type="button" aria-pressed={facultyMetric === 'n'} onClick={() => setFacultyMetric('n')}>
                      จำนวนโครงการ
                    </button>
                  </div>
                )}
              </div>

              {!isCmp && (
                <div className="rr-ctrls rr-row2">
                  <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                    <button type="button" aria-pressed={facultyBarMode === 'group'} onClick={() => setFacultyBarMode('group')}>
                      แยกแท่ง
                    </button>
                    <button type="button" aria-pressed={facultyBarMode === 'stack'} onClick={() => setFacultyBarMode('stack')}>
                      แท่งซ้อน
                    </button>
                  </div>
                </div>
              )}

              <div className="rr-legend">
                {isCmp ? (
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
                    <span className="rr-pill st" style={{ '--c': CONTRACT_SPLIT.major.c } as React.CSSProperties}>
                      <i />
                      {CONTRACT_SPLIT.major.n}
                    </span>
                    <span className="rr-pill st" style={{ '--c': CONTRACT_SPLIT.std.c } as React.CSSProperties}>
                      <i />
                      {CONTRACT_SPLIT.std.n}
                    </span>
                  </>
                )}
              </div>

              {(() => {
                const list = top10FacultyLeads;
                const N = Math.max(list.length, 1);
                let mx = 0;
                list.forEach((f) => {
                  const cMaj = facultyMetric === 'n' ? f.majN : f.majB;
                  const cStd = facultyMetric === 'n' ? f.stdN : f.stdB;
                  const cTot = cMaj + cStd;
                  const pLead = isCmp ? cmpFacultyLeadsMap[f.key] : undefined;
                  const pTot = pLead ? (facultyMetric === 'n' ? pLead.count : pLead.totalBudgetM) : 0;
                  if (isCmp) mx = Math.max(mx, cTot, pTot);
                  else if (facultyBarMode === 'group') mx = Math.max(mx, cMaj, cStd);
                  else mx = Math.max(mx, cTot);
                });
                const nz = nice(mx, facultyMetric === 'n');
                const nT = Math.round(nz.top / nz.step);
                const dW = Math.max(segPlotWidth, N * 98);
                const dH = 340;
                const dL = 56;
                const dR = 28;
                const dB = 54;
                const dPw = dW - dL - dR;
                const dPh = dH - Tp - dB;
                const dSlot = dPw / N;
                const yFac = (v: number) => Tp + dPh - (dPh * v) / (nz.top || 1);

                return (
                  <div className="rr-scroller">
                    <div
                      className="rr-plot"
                      style={{ minWidth: '820px', width: `${dW}px` }}
                      onPointerLeave={() => {
                        setActiveFacultyIdx(null);
                        setActiveFacultySeg(null);
                        setTip((t) => ({ ...t, show: false }));
                      }}
                    >
                      <svg width={dW} height={dH} viewBox={`0 0 ${dW} ${dH}`} style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}>
                        {Array.from({ length: nT + 1 }).map((_, i) => {
                          const tVal = i * nz.step;
                          const y = yFac(tVal);
                          return (
                            <g key={i}>
                              <line x1={dL} x2={dW - dR} y1={y} y2={y} stroke="#e8edf3" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '3 5'} />
                              <text x={dL - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="500" fill="var(--muted)">
                                {Math.round(tVal * 10) / 10}
                              </text>
                            </g>
                          );
                        })}

                        <text transform={`translate(16, ${Tp + dPh / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted)">
                          {facultyMetric === 'n' ? 'จำนวนโครงการ (โครงการ)' : 'มูลค่าสัญญารวม (ล้านบาท)'}
                        </text>

                        {list.map((f, i) => {
                          const x0 = dL + dSlot * i;
                          const cx = x0 + dSlot / 2;
                          const cMaj = facultyMetric === 'n' ? f.majN : f.majB;
                          const cStd = facultyMetric === 'n' ? f.stdN : f.stdB;
                          const curTot = Number((cMaj + cStd).toFixed(2));
                          const pLead = isCmp ? cmpFacultyLeadsMap[f.key] : undefined;
                          const cmpTot = pLead ? (facultyMetric === 'n' ? pLead.count : pLead.totalBudgetM) : 0;
                          const deptCol = UCOL[f.deptCode] || UCOL.OTH;
                          const shortName = f.head.length > 15 ? f.head.slice(0, 14) + '…' : f.head;

                          let barsNode: React.ReactNode = null;
                          if (isCmp) {
                            const bw = Math.min(34, dSlot * 0.28);
                            const gap = 5;
                            const hC = (dPh * curTot) / (nz.top || 1);
                            const hP = (dPh * cmpTot) / (nz.top || 1);
                            barsNode = (
                              <>
                                {cmpTot > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + dPh - hP} width={bw} height={hP} rx={Math.min(7, hP / 2)} fill="var(--ghost)" />
                                    <text x={cx - bw / 2 - gap / 2} y={Tp + dPh - hP - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#64748b">
                                      {facultyMetric === 'n' ? cmpTot : cmpTot.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                                {curTot > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx + gap / 2} y={Tp + dPh - hC} width={bw} height={hC} rx={Math.min(7, hC / 2)} fill="var(--cur)" />
                                    <text x={cx + bw / 2 + gap / 2} y={Tp + dPh - hC - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                                      {facultyMetric === 'n' ? curTot : curTot.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                              </>
                            );
                          } else if (facultyBarMode === 'group') {
                            const bw = Math.min(34, dSlot * 0.28);
                            const gap = 5;
                            const h1 = (dPh * cMaj) / (nz.top || 1);
                            const h2 = (dPh * cStd) / (nz.top || 1);
                            barsNode = (
                              <>
                                {cMaj > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + dPh - h1} width={bw} height={h1} rx={Math.min(7, h1 / 2)} fill={CONTRACT_SPLIT.major.c} />
                                    <text x={cx - bw / 2 - gap / 2} y={Tp + dPh - h1 - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a">
                                      {facultyMetric === 'n' ? cMaj : cMaj.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                                {cStd > 0 && (
                                  <g>
                                    <rect className="rr-rise" x={cx + gap / 2} y={Tp + dPh - h2} width={bw} height={h2} rx={Math.min(7, h2 / 2)} fill={CONTRACT_SPLIT.std.c} />
                                    <text x={cx + bw / 2 + gap / 2} y={Tp + dPh - h2 - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a">
                                      {facultyMetric === 'n' ? cStd : cStd.toFixed(1)}
                                    </text>
                                  </g>
                                )}
                              </>
                            );
                          } else {
                            const w2 = Math.min(54, dSlot * 0.44);
                            const gap = 3;
                            const segs = [
                              cMaj > 0 ? { k: 'maj', n: CONTRACT_SPLIT.major.n, c: CONTRACT_SPLIT.major.c, v: cMaj } : null,
                              cStd > 0 ? { k: 'std', n: CONTRACT_SPLIT.std.n, c: CONTRACT_SPLIT.std.c, v: cStd } : null,
                            ].filter(Boolean) as Array<{ k: string; n: string; c: string; v: number }>;
                            let cum = 0;
                            barsNode = (
                              <>
                                {segs.map((seg) => {
                                  const y1 = yFac(cum + seg.v);
                                  const y0 = yFac(cum);
                                  const h = Math.max(y0 - y1 - gap, 4);
                                  const segY = y1 + gap / 2;
                                  const isHovered = activeFacultyIdx === i && activeFacultySeg === seg.k;
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
                                        fill={seg.c}
                                        style={{
                                          cursor: 'pointer',
                                          filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                          opacity: activeFacultySeg && !isHovered ? 0.6 : 1,
                                          transition: 'all 0.15s ease',
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openDrawer(
                                            `อาจารย์หัวหน้าโครงการ: ${f.head} (${seg.n} · ปี ${year})`,
                                            f.items.filter((it) =>
                                              seg.k === 'maj' ? (Number(it.budget) || 0) >= 1_000_000 : (Number(it.budget) || 0) < 1_000_000
                                            ),
                                            seg.c
                                          );
                                        }}
                                        onPointerMove={(e) => {
                                          e.stopPropagation();
                                          setActiveFacultyIdx(i);
                                          setActiveFacultySeg(seg.k);
                                          showTooltip(
                                            e,
                                            <div>
                                              <div className="rr-tt-h">
                                                <i style={{ backgroundColor: seg.c }} />
                                                <span>{seg.n} · {f.head}</span>
                                              </div>
                                              <div className="rr-tt-v">
                                                <b>{facultyMetric === 'n' ? seg.v : seg.v.toFixed(2)}</b>
                                                <span>{facultyMetric === 'n' ? 'โครงการ' : 'ล้านบาท'}</span>
                                              </div>
                                              <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                                            </div>
                                          );
                                        }}
                                      />
                                      {h >= 15 && (
                                        <text x={cx} y={segY + h / 2 + 5} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                          {facultyMetric === 'n' ? seg.v : seg.v.toFixed(1)}
                                        </text>
                                      )}
                                    </g>
                                  );
                                })}
                                {curTot > 0 && (
                                  <text x={cx} y={yFac(curTot) - 8} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                    {facultyMetric === 'n' ? curTot : curTot.toFixed(2)}
                                  </text>
                                )}
                              </>
                            );
                          }

                          return (
                            <g
                              key={f.key}
                              style={{ cursor: 'pointer' }}
                              onClick={() => openDrawer(`อาจารย์หัวหน้าโครงการ: ${f.head} (ปี ${year})`, f.items, deptCol)}
                              onPointerMove={(e) => {
                                setActiveFacultyIdx(i);
                                showTooltip(
                                  e,
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: deptCol }} />
                                      <span>#{i + 1} {f.head}</span>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>สังกัด</span>
                                      <b>{f.deptCode}</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>มูลค่าสัญญารวม</span>
                                      <b>{f.totalBudgetM.toFixed(2)} ล้านบาท</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>จำนวนโครงการ</span>
                                      <b>{f.count} โครงการ</b>
                                    </div>
                                    <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการ</div>
                                  </div>
                                );
                              }}
                            >
                              <rect x={x0 + 4} y={Tp - 6} width={dSlot - 8} height={dPh + 6} rx="12" fill="rgba(15, 23, 42, 0.05)" opacity={activeFacultyIdx === i ? 1 : 0} />
                              <rect x={x0} y={Tp - 6} width={dSlot} height={dPh + 6} fill="transparent" />
                              {barsNode}
                              <text x={cx} y={dH - 26} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">
                                {shortName}
                              </text>
                              <rect x={cx - 22} y={dH - 20} width={44} height={18} rx="5" fill={deptCol} />
                              <text x={cx} y={dH - 7} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#ffffff">
                                {f.deptCode}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {isCmp && (
                        <div style={{ marginTop: '6px', marginLeft: `${dL}px`, marginRight: `${dR}px`, display: 'grid', gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
                          {list.map((f, i) => {
                            const cVal = facultyMetric === 'n' ? f.count : f.totalBudgetM;
                            const pLead = cmpFacultyLeadsMap[f.key];
                            const pVal = pLead ? (facultyMetric === 'n' ? pLead.count : pLead.totalBudgetM) : 0;
                            return (
                              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                                {renderChip(cVal, pVal, facultyMetric)}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* TABLE: ตารางจัดอันดับอาจารย์หัวหน้าโครงการพัฒนาวิชาการ */}
            <section className="rr-card rr-full">
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  ตารางจัดอันดับอาจารย์หัวหน้าโครงการพัฒนาวิชาการ
                </h3>
                <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                  อาจารย์ผู้บริหารจัดการสัญญาโครงการพัฒนาวิชาการทั้งหมด • คลิกแถวหรือปุ่มเพื่อดูแฟ้มผลงาน
                </p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table table-sky" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>
                      <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                      <th style={{ padding: '10px 8px', textAlign: 'center', width: '64px' }}>รูปภาพ</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left' }}>หัวหน้าโครงการ</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>สังกัด</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>จำนวนโครงการ</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบประมาณสัญญารวม</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>หน่วยงานผู้ว่าจ้าง</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>แฟ้มผลงาน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyLeadsRanking.map((f, idx) => {
                      const avatarSrc = resolvePersonAvatar(f.head_id, f.head);
                      return (
                        <tr
                          key={`faculty-lead-${f.head_id || f.head || idx}-${idx}`}
                          onClick={() => {
                            const href = resolvePersonnelHref(f.head_id, f.head);
                            if (href) router.push(href);
                          }}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0fdf4';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 700, color: idx < 3 ? '#b45309' : '#64748b' }}>
                            {idx + 1}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                margin: '0 auto',
                                backgroundColor: '#99b8db',
                                border: '1.5px solid #e2e8f0',
                                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
                              }}
                            >
                              <img
                                src={avatarSrc}
                                alt={f.head}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  if (!img.src.endsWith('/default-avatar.png')) {
                                    img.src = getDefaultAvatar();
                                  }
                                }}
                              />
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                            {f.head}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <DepartmentBadge value={f.deptCode} />
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>
                            <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f0f9ff', color: '#0284c7' }}>
                              {f.count}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>
                            {(f.totalBudget / 1000000).toFixed(2)} ลบ.
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>
                            {f.clients.size} หน่วยงาน
                          </td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const href = resolvePersonnelHref(f.head_id, f.head);
                            if (href) router.push(href);
                              }}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#0284c7',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <span>ดูผลงาน</span>
                              <FaChevronRight style={{ fontSize: '9px' }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* DIMENSION 4: UN SDGs */}
      {activePerspective === 'sdg' && (
        <StrategicAlignmentMatrix
          items={validData}
          categoryKey="academic"
          missionTitle="โครงการพัฒนาวิชาการ"
          unitLabel="โครงการ"
          showBudget={true}
        />
      )}

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

      <DrillDownProjectDrawer
        isOpen={drillDown.isOpen}
        onClose={() => setDrillDown((prev) => ({ ...prev, isOpen: false }))}
        title={drillDown.title}
        subtitle={drillDown.subtitle}
        accentColor={drillDown.accentColor}
        items={drillDown.items}
        categoryKey="academic"
      />
    </div>
  );
}
