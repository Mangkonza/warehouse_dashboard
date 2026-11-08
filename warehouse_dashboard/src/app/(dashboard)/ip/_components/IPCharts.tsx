'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartBar,
  FaFilter,
  FaCertificate,
  FaBuilding,
  FaUserTie,
  FaLeaf,
  FaChevronRight,
  FaLightbulb,
  FaShieldAlt,
  FaCalendarAlt,
} from 'react-icons/fa';
import { IPItem } from '../_hooks/useIPData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { resolvePersonAvatar } from '@/lib/personnelService';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';
import { CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';
import '../../research/_components/research-redesign.css';
import { YearSelectDropdown } from '@/components/ui/YearSelectDropdown';
import { STANDARD_YEAR_OPTIONS, getDefaultCompareYear } from '@/lib/fiscalYears';

const UCOL: Record<string, string> = {
  AE: '#65B98A',
  CPE: '#5B9BD5',
  IRRE: '#4FA9A0',
  IRE: '#4FA9A0',
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

const ALL_IP_DEPTS = ['AE', 'ME', 'FE', 'CE', 'IRRE', 'CPE', 'IE'];

function getIPFiscalYear(item: IPItem): string {
  if (item._fiscalYear && /^25\d{2}$/.test(String(item._fiscalYear))) {
    return String(item._fiscalYear);
  }
  const rawDate = String(item.filing_date || item.protection_start || item.date || '').trim();
  const isoMatch = rawDate.match(/^(\d{4})-(\d{1,2})/);
  if (isoMatch) {
    let y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    if (y >= 1960 && y <= 1980) y += 600;
    else if (y >= 2000 && y < 2500) y += 543;
    if (y >= 2500 && y <= 2600) {
      return m >= 10 ? String(y + 1) : String(y);
    }
  }
  return item._fiscalYear || '2568';
}

function itemMatchesIPDept(item: IPItem, code: string): boolean {
  const parts: string[] = [String(item.department || '')];
  if (Array.isArray(item.departments)) {
    parts.push(...item.departments.map(String));
  } else if (item.departments) {
    parts.push(String(item.departments));
  }
  if (Array.isArray(item.inventors)) {
    item.inventors.forEach((inv: any) => {
      if (typeof inv === 'object' && inv !== null) {
        if (inv.department) parts.push(String(inv.department));
        if (inv.name) parts.push(String(inv.name));
      } else if (inv) {
        parts.push(String(inv));
      }
    });
  } else if (item.inventors) {
    parts.push(String(item.inventors));
  }
  const allDeptStrings = parts.join(' ');
  return (
    allDeptStrings.includes(code) ||
    (code === 'AE' && allDeptStrings.includes('เกษตร')) ||
    (code === 'ME' && allDeptStrings.includes('เครื่องกล')) ||
    (code === 'FE' && allDeptStrings.includes('อาหาร')) ||
    (code === 'CE' && allDeptStrings.includes('โยธา')) ||
    ((code === 'IRRE' || code === 'IRE') && (allDeptStrings.includes('ชลประทาน') || allDeptStrings.includes('IRE'))) ||
    (code === 'CPE' && allDeptStrings.includes('คอมพิวเตอร์')) ||
    (code === 'IE' && allDeptStrings.includes('อุตสาหการ'))
  );
}

function getIPTypeKey(item: IPItem): 'patent' | 'petty' | 'copyright' {
  const t = String(item.type || '').trim();
  if (t.includes('อนุสิทธิบัตร')) return 'petty';
  if (t.includes('ลิขสิทธิ์')) return 'copyright';
  return 'patent';
}

function getDeltaInfo(cur: number, prev: number) {
  if (cur === 0 && prev === 0) return { label: '–', cls: 'flat' };
  if (prev === 0 && cur > 0) return { label: 'ใหม่', cls: 'new' };
  if (cur === 0 && prev > 0) return { label: '▼ 100%', cls: 'dn' };
  const diff = cur - prev;
  if (Math.abs(diff) < 1e-6) return { label: 'เท่าเดิม', cls: 'same' };
  const pct = Math.round((Math.abs(diff) / Math.abs(prev)) * 100);
  return {
    label: `${diff > 0 ? '▲' : '▼'} ${pct}%`,
    cls: diff > 0 ? 'up' : 'dn',
  };
}

function describeArc(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number): string {
  const span = Math.min(359.99, Math.max(0.01, endAngle - startAngle));
  const eAngle = startAngle + span;
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + rOuter * Math.cos(rad(startAngle));
  const y1 = cy + rOuter * Math.sin(rad(startAngle));
  const x2 = cx + rOuter * Math.cos(rad(eAngle));
  const y2 = cy + rOuter * Math.sin(rad(eAngle));
  const x3 = cx + rInner * Math.cos(rad(eAngle));
  const y3 = cy + rInner * Math.sin(rad(eAngle));
  const x4 = cx + rInner * Math.cos(rad(startAngle));
  const y4 = cy + rInner * Math.sin(rad(startAngle));
  const largeArc = span > 180 ? 1 : 0;
  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

function buildSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

interface IPChartsProps {
  validIpData: IPItem[];
  allItems?: IPItem[];
  currentFiscalYear?: string;
  onSelectDept?: (deptCode: string) => void;
  onSelectType?: (typeName: string) => void;
  activePerspective?: IPPerspective;
  onChangePerspective?: (persp: IPPerspective) => void;
  hideSelector?: boolean;
}

export type IPPerspective = 'types_dept' | 'protection_status' | 'faculty' | 'sdg' | 'table';

export function IPCharts({
  validIpData,
  allItems,
  currentFiscalYear = 'all',
  onSelectDept,
  onSelectType,
  activePerspective: propPerspective,
  onChangePerspective,
  hideSelector = false,
}: IPChartsProps) {
  const router = useRouter();
  const [internalPerspective, setInternalPerspective] = useState<IPPerspective>('types_dept');
  const activePerspective = propPerspective ?? internalPerspective;
  const setActivePerspective = onChangePerspective ?? setInternalPerspective;
  const [strategyMetric, setStrategyMetric] = useState<'count' | 'budget'>('count');
  const [deptStackMode, setDeptStackMode] = useState<'type' | 'stage'>('type');
  const chartInstances = useRef<Chart[]>([]);

  const sourcePool = useMemo(() => (allItems && allItems.length > 0 ? allItems : validIpData), [allItems, validIpData]);

  const availableYears = useMemo(() => {
    return Array.from(STANDARD_YEAR_OPTIONS);
  }, []);

  // ── Chart 1: การกระจายตัวตาม 7 สังกัด (แยกตามประเภท) states ──
  const [ip1Year, setIp1Year] = useState<string>('all');
  const [ip1Mode, setIp1Mode] = useState<'single' | 'yoy'>('single');
  const [ip1CmpYear, setIp1CmpYear] = useState<string>('2567');
  const [ip1Layout, setIp1Layout] = useState<'grouped' | 'stacked'>('stacked');
  const [ip1HoverIdx, setIp1HoverIdx] = useState<number | null>(null);
  const [ip1ShowPetty, setIp1ShowPetty] = useState<boolean>(true);
  const [ip1ShowPatent, setIp1ShowPatent] = useState<boolean>(true);
  const [ip1ShowCopyright, setIp1ShowCopyright] = useState<boolean>(true);
  const [ip1ShowGranted, setIp1ShowGranted] = useState<boolean>(true);
  const [ip1ShowPending, setIp1ShowPending] = useState<boolean>(true);
  const [ip1ShowPrep, setIp1ShowPrep] = useState<boolean>(true);

  // ── Chart 2: สัดส่วนประเภททรัพย์สินทางปัญญา states ──
  const [ip2Year, setIp2Year] = useState<string>('all');
  const [ip2Mode, setIp2Mode] = useState<'single' | 'yoy'>('single');
  const [ip2CmpYear, setIp2CmpYear] = useState<string>('2567');
  const [ip2HoverIdx, setIp2HoverIdx] = useState<number | null>(null);

  // ── Chart 3: สถานะการยื่นคำขอและการคุ้มครอง (3 ระดับ) states ──
  const [ip3Year, setIp3Year] = useState<string>('all');
  const [ip3Mode, setIp3Mode] = useState<'single' | 'yoy'>('single');
  const [ip3CmpYear, setIp3CmpYear] = useState<string>('2567');
  const [ip3Layout, setIp3Layout] = useState<'grouped' | 'stacked'>('stacked');
  const [ip3Metric, setIp3Metric] = useState<'count' | 'support'>('count');
  const [ip3HoverIdx, setIp3HoverIdx] = useState<number | null>(null);

  // ── Chart 4: แนวโน้มการสร้างสรรค์ผลงานตามปีงบประมาณ states ──
  const [ip4Mode, setIp4Mode] = useState<'single' | 'yoy'>('single');
  const [ip4BreakBy, setIp4BreakBy] = useState<'type' | 'dept'>('type');
  const [ip4Layout, setIp4Layout] = useState<'grouped' | 'stacked'>('stacked');
  const [ip4ShowLine, setIp4ShowLine] = useState<boolean>(true);
  const [ip4HoverIdx, setIp4HoverIdx] = useState<number | null>(null);

  // ── Chart 5 & 6: ผู้สร้างผลงานและนวัตกรรม states ──
  const [ip5Year, setIp5Year] = useState<string>('all');
  const [ip5Mode, setIp5Mode] = useState<'single' | 'yoy'>('single');
  const [ip5CmpYear, setIp5CmpYear] = useState<string>('2567');
  const [ip5Layout, setIp5Layout] = useState<'grouped' | 'stacked'>('stacked');
  const [ip5HoverIdx, setIp5HoverIdx] = useState<number | null>(null);

  // Floating dark tooltip state
  const [tip, setTip] = useState<{
    show: boolean;
    x: number;
    y: number;
    title: string;
    color: string;
    val: string;
    sub: string;
  }>({
    show: false,
    x: 0,
    y: 0,
    title: '',
    color: '#8b5cf6',
    val: '',
    sub: '',
  });

  useEffect(() => {
    if (currentFiscalYear && currentFiscalYear !== 'all') {
      setIp1Year(currentFiscalYear);
      setIp2Year(currentFiscalYear);
      setIp3Year(currentFiscalYear);
      setIp5Year(currentFiscalYear);
      const prev = String(Number(currentFiscalYear) - 1);
      setIp1CmpYear(prev);
      setIp2CmpYear(prev);
      setIp3CmpYear(prev);
      setIp5CmpYear(prev);
    } else {
      setIp1Year('all');
      setIp2Year('all');
      setIp3Year('all');
      setIp5Year('all');
    }
  }, [currentFiscalYear]);

  // ── Data Memo 1: 7 Departments Distribution ──
  const ip1DeptData = useMemo(() => {
    const filterByYear = (yr: string) =>
      yr === 'all' ? validIpData : sourcePool.filter((it) => getIPFiscalYear(it) === yr);

    const curPool = filterByYear(ip1Year);
    const cmpYr = ip1Year === 'all' ? '2567' : ip1CmpYear;
    const prevPool = filterByYear(cmpYr);

    const rows = ALL_IP_DEPTS.map((code) => {
      const dInfo = getDepartment(code);
      const cItems = curPool.filter((it) => itemMatchesIPDept(it, code));
      const pItems = prevPool.filter((it) => itemMatchesIPDept(it, code));

      const countSegments = (list: IPItem[]) => {
        let patent = 0;
        let petty = 0;
        let copyright = 0;
        let granted = 0;
        let pending = 0;
        let prep = 0;
        list.forEach((it) => {
          const tk = getIPTypeKey(it);
          if (tk === 'petty') petty++;
          else if (tk === 'copyright') copyright++;
          else patent++;

          if (it._pipelineStage === 'granted') granted++;
          else if (it._pipelineStage === 'pending') pending++;
          else prep++;
        });
        return { patent, petty, copyright, granted, pending, prep };
      };

      const cSeg = countSegments(cItems);
      const pSeg = countSegments(pItems);

      return {
        code,
        name: dInfo.name !== '-' ? dInfo.name : code,
        color: UCOL[code] || UCOL.OTH,
        total: cItems.length,
        prevTotal: pItems.length,
        ...cSeg,
        prevSeg: pSeg,
        items: cItems,
        prevItems: pItems,
      };
    });

    return { rows, cmpYr };
  }, [validIpData, sourcePool, ip1Year, ip1CmpYear]);

  // ── Data Memo 2: IP Types / Stage Donut ──
  const ip2DonutData = useMemo(() => {
    const filterByYear = (yr: string) =>
      yr === 'all' ? validIpData : sourcePool.filter((it) => getIPFiscalYear(it) === yr);

    const curPool = filterByYear(ip2Year);
    const cmpYr = ip2Year === 'all' ? '2567' : ip2CmpYear;
    const prevPool = filterByYear(cmpYr);

    const isType = deptStackMode === 'type';

    const buildSlices = (pool: IPItem[]) => {
      if (isType) {
        const petty = pool.filter((it) => getIPTypeKey(it) === 'petty');
        const patent = pool.filter((it) => getIPTypeKey(it) === 'patent');
        const copy = pool.filter((it) => getIPTypeKey(it) === 'copyright');
        return [
          { key: 'petty', label: 'อนุสิทธิบัตร', color: '#8b5cf6', items: petty, count: petty.length },
          { key: 'patent', label: 'สิทธิบัตรการประดิษฐ์', color: '#3b82f6', items: patent, count: patent.length },
          { key: 'copyright', label: 'ลิขสิทธิ์ / อื่นๆ', color: '#10b981', items: copy, count: copy.length },
        ];
      }
      const granted = pool.filter((it) => it._pipelineStage === 'granted');
      const pending = pool.filter((it) => it._pipelineStage === 'pending');
      const prep = pool.filter((it) => it._pipelineStage !== 'granted' && it._pipelineStage !== 'pending');
      return [
        { key: 'granted', label: 'ได้รับความคุ้มครองแล้ว', color: '#10b981', items: granted, count: granted.length },
        { key: 'pending', label: 'ยื่นคำขอแล้ว', color: '#3b82f6', items: pending, count: pending.length },
        { key: 'prep', label: 'เตรียมความพร้อมยื่นจด', color: '#f59e0b', items: prep, count: prep.length },
      ];
    };

    const curSlices = buildSlices(curPool);
    const prevSlices = buildSlices(prevPool);
    const totalCur = curPool.length;
    const totalPrev = prevPool.length;

    const merged = curSlices.map((s, i) => {
      const pCount = prevSlices[i]?.count || 0;
      return {
        ...s,
        prevCount: pCount,
        pct: totalCur > 0 ? Math.round((s.count / totalCur) * 100) : 0,
        prevPct: totalPrev > 0 ? Math.round((pCount / totalPrev) * 100) : 0,
      };
    });

    return { slices: merged, totalCur, totalPrev, cmpYr };
  }, [validIpData, sourcePool, ip2Year, ip2CmpYear, deptStackMode]);

  // ── Data Memo 3: 3-Level Protection Status ──
  const ip3StatusData = useMemo(() => {
    const filterByYear = (yr: string) =>
      yr === 'all' ? validIpData : sourcePool.filter((it) => getIPFiscalYear(it) === yr);

    const curPool = filterByYear(ip3Year);
    const cmpYr = ip3Year === 'all' ? '2567' : ip3CmpYear;
    const prevPool = filterByYear(cmpYr);

    const stages = [
      {
        key: 'granted',
        label: 'ได้รับความคุ้มครองแล้ว',
        color: '#10b981',
        match: (it: IPItem) => it._pipelineStage === 'granted',
      },
      {
        key: 'pending',
        label: 'ยื่นคำขอแล้ว',
        color: '#3b82f6',
        match: (it: IPItem) => it._pipelineStage === 'pending',
      },
      {
        key: 'prep',
        label: 'เตรียมความพร้อมยื่นจด',
        color: '#f59e0b',
        match: (it: IPItem) => it._pipelineStage !== 'granted' && it._pipelineStage !== 'pending',
      },
    ];

    const getVal = (list: IPItem[]) =>
      ip3Metric === 'support'
        ? list.reduce((s, x) => s + (Number(x.support_amount) || 0), 0)
        : list.length;

    const rows = stages.map((st) => {
      const cList = curPool.filter(st.match);
      const pList = prevPool.filter(st.match);
      const cPetty = cList.filter((x) => getIPTypeKey(x) === 'petty');
      const cPatent = cList.filter((x) => getIPTypeKey(x) === 'patent');
      const cCopy = cList.filter((x) => getIPTypeKey(x) === 'copyright');

      return {
        ...st,
        curVal: getVal(cList),
        prevVal: getVal(pList),
        pettyVal: getVal(cPetty),
        patentVal: getVal(cPatent),
        copyVal: getVal(cCopy),
        count: cList.length,
        supportSum: cList.reduce((s, x) => s + (Number(x.support_amount) || 0), 0),
        items: cList,
      };
    });

    return { rows, cmpYr };
  }, [validIpData, sourcePool, ip3Year, ip3CmpYear, ip3Metric]);

  // ── Data Memo 4: Fiscal Year Trend ──
  const ip4TrendData = useMemo(() => {
    const years = [...STANDARD_YEAR_OPTIONS].reverse();
    const rows = years.map((yr, idx) => {
      const items = sourcePool.filter((it) => getIPFiscalYear(it) === yr);
      const prevYr = idx > 0 ? years[idx - 1] : null;
      const prevItems = prevYr ? sourcePool.filter((it) => getIPFiscalYear(it) === prevYr) : [];

      const petty = items.filter((x) => getIPTypeKey(x) === 'petty').length;
      const patent = items.filter((x) => getIPTypeKey(x) === 'patent').length;
      const copy = items.filter((x) => getIPTypeKey(x) === 'copyright').length;

      const deptCounts = ALL_IP_DEPTS.map((code) => ({
        code,
        color: UCOL[code] || UCOL.OTH,
        count: items.filter((it) => itemMatchesIPDept(it, code)).length,
      })).filter((d) => d.count > 0);

      const supportSum = items.reduce((s, x) => s + (Number(x.support_amount) || 0), 0);
      const prevSupportSum = prevItems.reduce((s, x) => s + (Number(x.support_amount) || 0), 0);

      return {
        year: yr,
        label: `ปีงบ ${yr}`,
        total: items.length,
        prevTotal: prevItems.length,
        hasPrev: idx > 0,
        petty,
        patent,
        copy,
        deptCounts,
        supportSum,
        prevSupportSum,
        items,
      };
    });

    return rows;
  }, [sourcePool]);
  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    items: IPItem[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#8b5cf6',
    items: [],
  });

  // Calculate top inventors & tech clusters (interactive by ip5Year / ip5CmpYear)
  const ipFacultyData = useMemo(() => {
    const filterByYear = (yr: string) =>
      yr === 'all' ? validIpData : sourcePool.filter((it) => getIPFiscalYear(it) === yr);

    const curPool = filterByYear(ip5Year);
    const cmpYr = ip5Year === 'all' ? '2567' : ip5CmpYear;
    const prevPool = filterByYear(cmpYr);

    const buildPeople = (items: IPItem[]) => {
      const map: Record<
        string,
        {
          key: string;
          creator: string;
          person_id?: number | string;
          dept: string;
          deptCode: string;
          count: number;
          petty: number;
          patent: number;
          copy: number;
          support: number;
          items: IPItem[];
          pettyItems: IPItem[];
          patentItems: IPItem[];
          copyItems: IPItem[];
        }
      > = {};

      items.forEach((item) => {
        const cName = String(item.creator || '').trim();
        if (!cName || cName === '-' || cName === 'nan') return;
        const pId = item.person_id;
        const key = pId ? `id_${pId}` : cName;
        if (!map[key]) {
          const d = getDepartment(item.department);
          const deptCode = d.code && d.code !== '-' ? (d.code === 'IRE' ? 'IRRE' : d.code) : 'OTH';
          map[key] = {
            key,
            creator: cName,
            person_id: pId,
            dept: item.department || '-',
            deptCode,
            count: 0,
            petty: 0,
            patent: 0,
            copy: 0,
            support: 0,
            items: [],
            pettyItems: [],
            patentItems: [],
            copyItems: [],
          };
        }
        const tk = getIPTypeKey(item);
        map[key].count++;
        if (tk === 'petty') {
          map[key].petty++;
          map[key].pettyItems.push(item);
        } else if (tk === 'copyright') {
          map[key].copy++;
          map[key].copyItems.push(item);
        } else {
          map[key].patent++;
          map[key].patentItems.push(item);
        }
        map[key].support += Number(item.support_amount) || 0;
        map[key].items.push(item);
      });
      return map;
    };

    const curMap = buildPeople(curPool);
    const prevMap = buildPeople(prevPool);

    const allInventors = Object.values(curMap)
      .map((p) => {
        const prev = prevMap[p.key] || Object.values(prevMap).find((x) => x.creator === p.creator);
        return {
          ...p,
          prevCount: prev ? prev.count : 0,
          color: UCOL[p.deptCode] || UCOL.OTH,
        };
      })
      .sort((a, b) => b.count - a.count || b.support - a.support);

    const CLUSTER_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6'];
    const cSet = new Set<string>();
    curPool.forEach((it) => cSet.add(it._techCluster || 'นวัตกรรมวิศวกรรมอื่นๆ'));
    prevPool.forEach((it) => cSet.add(it._techCluster || 'นวัตกรรมวิศวกรรมอื่นๆ'));

    const clusters = Array.from(cSet)
      .map((cluster, idx) => {
        const cItems = curPool.filter((it) => (it._techCluster || 'นวัตกรรมวิศวกรรมอื่นๆ') === cluster);
        const pItems = prevPool.filter((it) => (it._techCluster || 'นวัตกรรมวิศวกรรมอื่นๆ') === cluster);
        return {
          cluster,
          color: CLUSTER_COLORS[idx % CLUSTER_COLORS.length],
          count: cItems.length,
          prevCount: pItems.length,
          support: cItems.reduce((s, x) => s + (Number(x.support_amount) || 0), 0),
          items: cItems,
        };
      })
      .filter((c) => c.count > 0 || c.prevCount > 0)
      .sort((a, b) => b.count - a.count);

    return {
      allInventors,
      top10: allInventors.slice(0, 10),
      clusters,
      cmpYr,
    };
  }, [validIpData, sourcePool, ip5Year, ip5CmpYear]);

  const topInventors = ipFacultyData.allInventors;

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 13.5;
    Chart.defaults.color = '#0f172a';

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'sdg') {
      // ISEE & IAM breakdown
      const totalSupport = validIpData.reduce((sum, d) => sum + (Number(d.support_amount) || 0), 0);
      const iseeInnovateCount = validIpData.length;
      const iseeExcellenceCount = validIpData.filter((d) => d._pipelineStage === 'granted').length;
      const iamAgilityCount = validIpData.filter((d) => String(d.type || '').includes('อนุสิทธิบัตร')).length;
      const iamMasteryCount = validIpData.filter((d) => (Number(d.support_amount) || 0) > 0).length;

      const countData = [iseeInnovateCount, iamAgilityCount, iseeExcellenceCount, iamMasteryCount];
      const budgetData = [
        totalSupport,
        validIpData.filter((d) => String(d.type || '').includes('อนุสิทธิบัตร')).reduce((s, d) => s + (Number(d.support_amount) || 0), 0),
        validIpData.filter((d) => d._pipelineStage === 'granted').reduce((s, d) => s + (Number(d.support_amount) || 0), 0),
        totalSupport,
      ];

      createChart('c_ip_isee_iam', {
        type: 'bar',
        data: {
          labels: ['I - Innovate (การสร้างสรรค์นวัตกรรม)', 'A - Agility (ความคล่องตัว)', 'E1 - Excellence (ความเป็นเลิศ)', 'M - Mastery (ความเชี่ยวชาญ)'],
          datasets: [
            {
              label: strategyMetric === 'count' ? 'จำนวนผลงาน (รายการ)' : 'งบสนับสนุน (บาท)',
              data: strategyMetric === 'count' ? countData : budgetData,
              backgroundColor: ['#DDD6FE', '#93C5FD', '#86EFAC', '#FDE68A'],
              borderColor: ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B'],
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (strategyMetric === 'count' ? `${v} รายการ` : `${v.toLocaleString()} ฿`),
            },
          },
          scales: {
            x: { beginAtZero: true, grid: { color: CHART_PASTEL_PALETTE.gridLines } },
            y: { grid: { display: false } },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validIpData, activePerspective, strategyMetric]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
      {/* DIMENSION 1: Department Distribution & IP Types Breakdown */}
      {activePerspective === 'types_dept' && (
        <div className="rr-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CHART 1: การกระจายตัวตาม 7 สังกัด (แยกตามประเภท) */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaBuilding style={{ color: '#8b5cf6', marginRight: '8px' }} />
                การกระจายตัวตาม 7 สังกัด ({deptStackMode === 'type' ? 'แยกตามประเภท' : 'แยกตามสถานะ'})
              </h2>
              <div className="rr-ctrls">
                <YearSelectDropdown
                  label="ปี"
                  value={ip1Year}
                  onChange={(v) => {
                    setIp1Year(v);
                    if (v !== 'all') setIp1CmpYear(getDefaultCompareYear(v, availableYears));
                  }}
                  includeAll={true}
                  allPosition="top"
                />

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={ip1Mode === 'single' ? 'on' : ''}
                    onClick={() => setIp1Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={ip1Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setIp1Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                {ip1Mode === 'yoy' ? (
                  <YearSelectDropdown
                    label="เทียบกับปี"
                    value={ip1CmpYear}
                    onChange={(v) => setIp1CmpYear(v)}
                    excludeYear={ip1Year}
                    includeAll={false}
                  />
                ) : (
                  <div className="rr-seg-ctl">
                    <button
                      type="button"
                      className={ip1Layout === 'grouped' ? 'on' : ''}
                      onClick={() => setIp1Layout('grouped')}
                    >
                      แยกแท่ง
                    </button>
                    <button
                      type="button"
                      className={ip1Layout === 'stacked' ? 'on' : ''}
                      onClick={() => setIp1Layout('stacked')}
                    >
                      แท่งซ้อน
                    </button>
                  </div>
                )}

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={deptStackMode === 'type' ? 'on' : ''}
                    onClick={() => setDeptStackMode('type')}
                  >
                    แยกตามประเภท
                  </button>
                  <button
                    type="button"
                    className={deptStackMode === 'stage' ? 'on' : ''}
                    onClick={() => setDeptStackMode('stage')}
                  >
                    แยกตามสถานะ
                  </button>
                </div>
              </div>
            </div>

            <div className="rr-legend">
              {deptStackMode === 'type' ? (
                <>
                  <button
                    type="button"
                    className="rr-pill"
                    style={{ '--c': '#8b5cf6' } as React.CSSProperties}
                    aria-pressed={ip1ShowPetty}
                    onClick={() => {
                      const activeCount = (ip1ShowPetty ? 1 : 0) + (ip1ShowPatent ? 1 : 0) + (ip1ShowCopyright ? 1 : 0);
                      if (ip1ShowPetty && activeCount <= 1) return;
                      setIp1ShowPetty(!ip1ShowPetty);
                    }}
                  >
                    <i />
                    อนุสิทธิบัตร
                  </button>
                  <button
                    type="button"
                    className="rr-pill"
                    style={{ '--c': '#3b82f6' } as React.CSSProperties}
                    aria-pressed={ip1ShowPatent}
                    onClick={() => {
                      const activeCount = (ip1ShowPetty ? 1 : 0) + (ip1ShowPatent ? 1 : 0) + (ip1ShowCopyright ? 1 : 0);
                      if (ip1ShowPatent && activeCount <= 1) return;
                      setIp1ShowPatent(!ip1ShowPatent);
                    }}
                  >
                    <i />
                    สิทธิบัตรการประดิษฐ์
                  </button>
                  <button
                    type="button"
                    className="rr-pill"
                    style={{ '--c': '#10b981' } as React.CSSProperties}
                    aria-pressed={ip1ShowCopyright}
                    onClick={() => {
                      const activeCount = (ip1ShowPetty ? 1 : 0) + (ip1ShowPatent ? 1 : 0) + (ip1ShowCopyright ? 1 : 0);
                      if (ip1ShowCopyright && activeCount <= 1) return;
                      setIp1ShowCopyright(!ip1ShowCopyright);
                    }}
                  >
                    <i />
                    ลิขสิทธิ์ / อื่นๆ
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="rr-pill"
                    style={{ '--c': '#10b981' } as React.CSSProperties}
                    aria-pressed={ip1ShowGranted}
                    onClick={() => {
                      const activeCount = (ip1ShowGranted ? 1 : 0) + (ip1ShowPending ? 1 : 0) + (ip1ShowPrep ? 1 : 0);
                      if (ip1ShowGranted && activeCount <= 1) return;
                      setIp1ShowGranted(!ip1ShowGranted);
                    }}
                  >
                    <i />
                    ได้รับความคุ้มครองแล้ว
                  </button>
                  <button
                    type="button"
                    className="rr-pill"
                    style={{ '--c': '#3b82f6' } as React.CSSProperties}
                    aria-pressed={ip1ShowPending}
                    onClick={() => {
                      const activeCount = (ip1ShowGranted ? 1 : 0) + (ip1ShowPending ? 1 : 0) + (ip1ShowPrep ? 1 : 0);
                      if (ip1ShowPending && activeCount <= 1) return;
                      setIp1ShowPending(!ip1ShowPending);
                    }}
                  >
                    <i />
                    ยื่นคำขอแล้ว
                  </button>
                  <button
                    type="button"
                    className="rr-pill"
                    style={{ '--c': '#f59e0b' } as React.CSSProperties}
                    aria-pressed={ip1ShowPrep}
                    onClick={() => {
                      const activeCount = (ip1ShowGranted ? 1 : 0) + (ip1ShowPending ? 1 : 0) + (ip1ShowPrep ? 1 : 0);
                      if (ip1ShowPrep && activeCount <= 1) return;
                      setIp1ShowPrep(!ip1ShowPrep);
                    }}
                  >
                    <i />
                    เตรียมความพร้อมยื่นจด
                  </button>
                </>
              )}
              {ip1Mode === 'yoy' && (
                <span className="rr-pill st" style={{ '--c': '#cbd5e1' } as React.CSSProperties}>
                  <i />
                  ปี {ip1DeptData.cmpYr}
                </span>
              )}
            </div>

            <div className="rr-scroller">
              {(() => {
                const rows = ip1DeptData.rows;
                const isYoy = ip1Mode === 'yoy';
                const W = 1120;
                const H = isYoy ? 390 : 340;
                const padL = 64;
                const padR = 40;
                const padT = 30;
                const plotB = 260;
                const plotW = W - padL - padR;
                const plotH = plotB - padT;
                const colW = plotW / rows.length;

                const getRowTotal = (r: typeof rows[0]) => {
                  if (deptStackMode === 'type') {
                    return (
                      (ip1ShowPetty ? r.petty : 0) +
                      (ip1ShowPatent ? r.patent : 0) +
                      (ip1ShowCopyright ? r.copyright : 0)
                    );
                  }
                  return (
                    (ip1ShowGranted ? r.granted : 0) +
                    (ip1ShowPending ? r.pending : 0) +
                    (ip1ShowPrep ? r.prep : 0)
                  );
                };

                const getRowPrevTotal = (r: typeof rows[0]) => {
                  if (deptStackMode === 'type') {
                    return (
                      (ip1ShowPetty ? r.prevSeg.petty : 0) +
                      (ip1ShowPatent ? r.prevSeg.patent : 0) +
                      (ip1ShowCopyright ? r.prevSeg.copyright : 0)
                    );
                  }
                  return (
                    (ip1ShowGranted ? r.prevSeg.granted : 0) +
                    (ip1ShowPending ? r.prevSeg.pending : 0) +
                    (ip1ShowPrep ? r.prevSeg.prep : 0)
                  );
                };

                const maxValRaw = Math.max(
                  4,
                  ...rows.map(getRowTotal),
                  ...(isYoy ? rows.map(getRowPrevTotal) : [0])
                );
                const maxVal = Math.ceil(maxValRaw * 1.2);
                const yTicks = [0, Math.round(maxVal / 3), Math.round((maxVal * 2) / 3), maxVal];

                return (
                  <svg className="rr-plot" viewBox={`0 0 ${W} ${H}`}>
                    {yTicks.map((t, idx) => {
                      const y = plotB - (t / maxVal) * plotH;
                      return (
                        <g key={`ip1-grid-${idx}`}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                          <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">
                            {t}
                          </text>
                        </g>
                      );
                    })}

                    <text
                      x={18}
                      y={padT + plotH / 2}
                      transform={`rotate(-90, 18, ${padT + plotH / 2})`}
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="700"
                      fill="#475569"
                    >
                      จำนวนรายการ (รายการ)
                    </text>

                    {rows.map((r, i) => {
                      const cx = padL + i * colW + colW / 2;
                      const isHov = ip1HoverIdx === i;
                      const curTotal = getRowTotal(r);
                      const prevTotal = getRowPrevTotal(r);
                      const segs =
                        deptStackMode === 'type'
                          ? [
                              { key: 'petty', label: 'อนุสิทธิบัตร', val: r.petty, color: '#8b5cf6', visible: ip1ShowPetty },
                              { key: 'patent', label: 'สิทธิบัตรการประดิษฐ์', val: r.patent, color: '#3b82f6', visible: ip1ShowPatent },
                              { key: 'copyright', label: 'ลิขสิทธิ์ / อื่นๆ', val: r.copyright, color: '#10b981', visible: ip1ShowCopyright },
                            ]
                          : [
                              { key: 'granted', label: 'ได้รับความคุ้มครองแล้ว', val: r.granted, color: '#10b981', visible: ip1ShowGranted },
                              { key: 'pending', label: 'ยื่นคำขอแล้ว', val: r.pending, color: '#3b82f6', visible: ip1ShowPending },
                              { key: 'prep', label: 'เตรียมความพร้อมยื่นจด', val: r.prep, color: '#f59e0b', visible: ip1ShowPrep },
                            ];

                      return (
                        <g
                          key={`ip1-col-${r.code}`}
                          style={{ cursor: curTotal > 0 || (isYoy && prevTotal > 0) ? 'pointer' : 'default' }}
                          onMouseEnter={(e) => {
                            setIp1HoverIdx(i);
                            setTip({
                              show: true,
                              x: e.clientX,
                              y: e.clientY,
                              title: `${r.name} (${r.code})`,
                              color: r.color,
                              val: `${curTotal} รายการ`,
                              sub:
                                deptStackMode === 'type'
                                  ? [
                                      ip1ShowPetty ? `อนุสิทธิบัตร ${r.petty}` : null,
                                      ip1ShowPatent ? `สิทธิบัตร ${r.patent}` : null,
                                      ip1ShowCopyright ? `ลิขสิทธิ์ ${r.copyright}` : null,
                                    ]
                                      .filter(Boolean)
                                      .join(' • ')
                                  : [
                                      ip1ShowGranted ? `คุ้มครองแล้ว ${r.granted}` : null,
                                      ip1ShowPending ? `ยื่นคำขอ ${r.pending}` : null,
                                      ip1ShowPrep ? `เตรียมยื่น ${r.prep}` : null,
                                    ]
                                      .filter(Boolean)
                                      .join(' • '),
                            });
                          }}
                          onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                          onMouseLeave={() => {
                            setIp1HoverIdx(null);
                            setTip((prev) => ({ ...prev, show: false }));
                          }}
                          onClick={() => {
                            const filteredItems = r.items.filter((it) => {
                              if (deptStackMode === 'type') {
                                const tk = getIPTypeKey(it);
                                if (tk === 'petty') return ip1ShowPetty;
                                if (tk === 'patent') return ip1ShowPatent;
                                return ip1ShowCopyright;
                              }
                              if (it._pipelineStage === 'granted') return ip1ShowGranted;
                              if (it._pipelineStage === 'pending') return ip1ShowPending;
                              return ip1ShowPrep;
                            });
                            if (filteredItems.length > 0) {
                              setDrillDown({
                                isOpen: true,
                                title: `ทรัพย์สินทางปัญญา: สังกัด ${r.name} (${r.code})`,
                                subtitle: `รวม ${curTotal} รายการ (${deptStackMode === 'type' ? [ip1ShowPetty ? `อนุสิทธิบัตร ${r.petty}` : null, ip1ShowPatent ? `สิทธิบัตร ${r.patent}` : null, ip1ShowCopyright ? `ลิขสิทธิ์ ${r.copyright}` : null].filter(Boolean).join(', ') : [ip1ShowGranted ? `คุ้มครองแล้ว ${r.granted}` : null, ip1ShowPending ? `ยื่นคำขอ ${r.pending}` : null, ip1ShowPrep ? `เตรียมยื่น ${r.prep}` : null].filter(Boolean).join(', ')})`,
                                accentColor: r.color,
                                items: filteredItems,
                              });
                            }
                          }}
                        >
                          <rect
                            x={padL + i * colW + 8}
                            y={padT - 8}
                            width={colW - 16}
                            height={plotH + 14}
                            rx={10}
                            fill="#0f172a"
                            opacity={isHov ? 0.045 : 0}
                          />

                          {isYoy ? (
                            (() => {
                              const bw = 26;
                              const gap = 6;
                              const hP = (prevTotal / maxVal) * plotH;
                              const hC = (curTotal / maxVal) * plotH;
                              return (
                                <>
                                  {prevTotal > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw - gap / 2}
                                        y={plotB - hP}
                                        width={bw}
                                        height={hP}
                                        rx={6}
                                        fill="#cbd5e1"
                                      />
                                      <text
                                        x={cx - bw / 2 - gap / 2}
                                        y={plotB - hP - 6}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontWeight="700"
                                        fill="#64748b"
                                      >
                                        {prevTotal}
                                      </text>
                                    </>
                                  )}
                                  {curTotal > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx + gap / 2}
                                        y={plotB - hC}
                                        width={bw}
                                        height={hC}
                                        rx={6}
                                        fill={r.color}
                                        style={{
                                          filter: isHov ? `drop-shadow(0 4px 10px ${r.color}66)` : 'none',
                                        }}
                                      />
                                      <text
                                        x={cx + bw / 2 + gap / 2}
                                        y={plotB - hC - 6}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fontWeight="800"
                                        fill="#0f172a"
                                      >
                                        {curTotal}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          ) : ip1Layout === 'grouped' ? (
                            (() => {
                              const activeSegs = segs.filter((s) => s.val > 0 && s.visible);
                              const bw = 20;
                              const gap = 4;
                              const totalW = activeSegs.length * bw + Math.max(0, activeSegs.length - 1) * gap;
                              const startX = cx - totalW / 2;
                              return (
                                <>
                                  {activeSegs.map((s, sIdx) => {
                                    const h = (s.val / maxVal) * plotH;
                                    const x = startX + sIdx * (bw + gap);
                                    return (
                                      <g
                                        key={`seg-g-${sIdx}`}
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          setIp1HoverIdx(i);
                                          setTip({
                                            show: true,
                                            x: e.clientX,
                                            y: e.clientY,
                                            title: `${s.label} · ${r.name} (${r.code})`,
                                            color: s.color,
                                            val: `${s.val} รายการ`,
                                            sub: `${curTotal > 0 ? Math.round((s.val / curTotal) * 100) : 0}% ของสังกัดนี้ (${curTotal} รายการ)`,
                                          });
                                        }}
                                      >
                                        <rect
                                          className="rr-rise"
                                          x={x}
                                          y={plotB - h}
                                          width={bw}
                                          height={h}
                                          rx={5}
                                          fill={s.color}
                                        />
                                        <text
                                          x={x + bw / 2}
                                          y={plotB - h - 5}
                                          textAnchor="middle"
                                          fontSize="11"
                                          fontWeight="700"
                                          fill="#0f172a"
                                        >
                                          {s.val}
                                        </text>
                                      </g>
                                    );
                                  })}
                                </>
                              );
                            })()
                          ) : (
                            (() => {
                              const bw = 42;
                              let curY = plotB;
                              return (
                                <>
                                  {segs.map((s, sIdx) => {
                                    if (s.val <= 0 || !s.visible) return null;
                                    const h = (s.val / maxVal) * plotH;
                                    curY -= h;
                                    const hAdj = Math.max(2, h - 1);
                                    return (
                                      <g
                                        key={`seg-s-${sIdx}`}
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          setIp1HoverIdx(i);
                                          setTip({
                                            show: true,
                                            x: e.clientX,
                                            y: e.clientY,
                                            title: `${s.label} · ${r.name} (${r.code})`,
                                            color: s.color,
                                            val: `${s.val} รายการ`,
                                            sub: `${curTotal > 0 ? Math.round((s.val / curTotal) * 100) : 0}% ของสังกัดนี้ (${curTotal} รายการ)`,
                                          });
                                        }}
                                      >
                                        <rect
                                          className="rr-rise"
                                          x={cx - bw / 2}
                                          y={curY}
                                          width={bw}
                                          height={hAdj}
                                          rx={6}
                                          fill={s.color}
                                          style={{
                                            filter: isHov ? `drop-shadow(0 4px 10px ${s.color}55)` : 'none',
                                          }}
                                        />
                                        {hAdj >= 15 && (
                                          <text
                                            x={cx}
                                            y={curY + hAdj / 2 + 4}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fontWeight="700"
                                            fill="#ffffff"
                                            style={{ pointerEvents: 'none' }}
                                          >
                                            {s.val}
                                          </text>
                                        )}
                                      </g>
                                    );
                                  })}
                                  {curTotal > 0 && (
                                    <text
                                      x={cx}
                                      y={curY - 7}
                                      textAnchor="middle"
                                      fontSize="12"
                                      fontWeight="800"
                                      fill="#0f172a"
                                    >
                                      {curTotal}
                                    </text>
                                  )}
                                </>
                              );
                            })()
                          )}

                          {/* Official Department Color Badge on X axis */}
                          <rect x={cx - 24} y={plotB + 10} width={48} height={22} rx={6} fill={r.color} />
                          <text x={cx} y={plotB + 25} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#ffffff">
                            {r.code}
                          </text>

                          {isYoy && (
                            (() => {
                              const d = getDeltaInfo(curTotal, prevTotal);
                              const fillMap: Record<string, string> = {
                                up: '#dcfce7',
                                dn: '#fee2e2',
                                new: '#dbeafe',
                                same: '#e2e8f0',
                                flat: '#f1f5f9',
                              };
                              const txtMap: Record<string, string> = {
                                up: '#15803d',
                                dn: '#b91c1c',
                                new: '#1d4ed8',
                                same: '#334155',
                                flat: '#94a3b8',
                              };
                              return (
                                <>
                                  <rect
                                    x={cx - 28}
                                    y={plotB + 42}
                                    width={56}
                                    height={20}
                                    rx={10}
                                    fill={fillMap[d.cls]}
                                  />
                                  <text
                                    x={cx}
                                    y={plotB + 56}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill={txtMap[d.cls]}
                                  >
                                    {d.label}
                                  </text>
                                </>
                              );
                            })()
                          )}
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* CHART 2: สัดส่วนประเภททรัพย์สินทางปัญญา */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaCertificate style={{ color: '#8b5cf6', marginRight: '8px' }} />
                {deptStackMode === 'type' ? 'สัดส่วนประเภททรัพย์สินทางปัญญา' : 'สัดส่วนตามสถานะความคุ้มครอง'}
              </h2>
              <div className="rr-ctrls">
                <YearSelectDropdown
                  label="ปี"
                  value={ip2Year}
                  onChange={(v) => {
                    setIp2Year(v);
                    if (v !== 'all') setIp2CmpYear(getDefaultCompareYear(v, availableYears));
                  }}
                  includeAll={true}
                  allPosition="top"
                />

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={ip2Mode === 'single' ? 'on' : ''}
                    onClick={() => setIp2Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={ip2Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setIp2Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                {ip2Mode === 'yoy' && (
                  <YearSelectDropdown
                    label="เทียบกับปี"
                    value={ip2CmpYear}
                    onChange={(v) => setIp2CmpYear(v)}
                    excludeYear={ip2Year}
                    includeAll={false}
                  />
                )}
              </div>
            </div>

            <div className="rr-dn">
              {(() => {
                const { slices, totalCur, totalPrev, cmpYr } = ip2DonutData;
                const isYoy = ip2Mode === 'yoy';
                const cx = 120;
                const cy = 120;
                let curAngle = 0;
                let prevAngle = 0;

                return (
                  <>
                    <div className="rr-dn-s">
                      <svg viewBox="0 0 240 240" width="240" height="240">
                        {totalCur === 0 ? (
                          <circle cx={cx} cy={cy} r={88} fill="none" stroke="#e2e8f0" strokeWidth={24} />
                        ) : (
                          slices.map((s, idx) => {
                            if (s.count <= 0) return null;
                            const span = (s.count / totalCur) * 360;
                            const start = curAngle;
                            const end = curAngle + span;
                            curAngle = end;
                            const isHov = ip2HoverIdx === idx;
                            return (
                              <path
                                key={`dn-cur-${s.key}`}
                                d={describeArc(cx, cy, isHov ? 102 : 96, isYoy ? 68 : 60, start, end - 0.8)}
                                fill={s.color}
                                style={{
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  filter: isHov ? `drop-shadow(0 4px 10px ${s.color}66)` : 'none',
                                }}
                                onMouseEnter={(e) => {
                                  setIp2HoverIdx(idx);
                                  setTip({
                                    show: true,
                                    x: e.clientX,
                                    y: e.clientY,
                                    title: s.label,
                                    color: s.color,
                                    val: `${s.count} รายการ (${s.pct}%)`,
                                    sub: isYoy
                                      ? `ปี ${cmpYr}: ${s.prevCount} รายการ (${s.prevPct}%)`
                                      : 'คลิกเพื่อดูรายการทรัพย์สินทางปัญญา',
                                  });
                                }}
                                onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                                onMouseLeave={() => {
                                  setIp2HoverIdx(null);
                                  setTip((prev) => ({ ...prev, show: false }));
                                }}
                                onClick={() => {
                                  if (s.items.length > 0) {
                                    setDrillDown({
                                      isOpen: true,
                                      title: `${deptStackMode === 'type' ? 'ประเภท' : 'สถานะ'}: ${s.label}`,
                                      subtitle: `รวม ${s.count} รายการ (${s.pct}%)`,
                                      accentColor: s.color,
                                      items: s.items,
                                    });
                                  }
                                }}
                              />
                            );
                          })
                        )}

                        {isYoy &&
                          totalPrev > 0 &&
                          slices.map((s) => {
                            if (s.prevCount <= 0) return null;
                            const span = (s.prevCount / totalPrev) * 360;
                            const start = prevAngle;
                            const end = prevAngle + span;
                            prevAngle = end;
                            return (
                              <path
                                key={`dn-prev-${s.key}`}
                                d={describeArc(cx, cy, 62, 44, start, end - 0.8)}
                                fill={s.color}
                                opacity={0.45}
                              />
                            );
                          })}

                        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="24" fontWeight="800" fill="#0f172a">
                          {totalCur}
                        </text>
                        <text x={cx} y={cy + 15} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#64748b">
                          {isYoy ? `รายการ (เทียบ ${totalPrev})` : 'รายการทั้งหมด'}
                        </text>
                      </svg>
                    </div>

                    <div className="rr-dl">
                      {slices.map((s, idx) => {
                        const d = getDeltaInfo(s.count, s.prevCount);
                        return (
                          <div
                            key={`dl-row-${s.key}`}
                            className={`rr-dl-r ${isYoy ? 'cmp' : ''}`}
                            onMouseEnter={(e) => {
                              setIp2HoverIdx(idx);
                              setTip({
                                show: true,
                                x: e.clientX,
                                y: e.clientY,
                                title: s.label,
                                color: s.color,
                                val: `${s.count} รายการ (${s.pct}%)`,
                                sub: isYoy
                                  ? `ปี ${cmpYr}: ${s.prevCount} รายการ (${s.prevPct}%)`
                                  : 'คลิกเพื่อดูรายการทั้งหมด',
                              });
                            }}
                            onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                            onMouseLeave={() => {
                              setIp2HoverIdx(null);
                              setTip((prev) => ({ ...prev, show: false }));
                            }}
                            onClick={() => {
                              if (s.items.length > 0) {
                                setDrillDown({
                                  isOpen: true,
                                  title: `${deptStackMode === 'type' ? 'ประเภท' : 'สถานะ'}: ${s.label}`,
                                  subtitle: `รวม ${s.count} รายการ (${s.pct}%)`,
                                  accentColor: s.color,
                                  items: s.items,
                                });
                              }
                            }}
                          >
                            <span className="rr-d" style={{ backgroundColor: s.color }} />
                            <div className="rr-n">
                              <b>{s.label}</b>
                              <small>
                                {isYoy
                                  ? `ปีปัจจุบัน ${s.count} รายการ • ปี ${cmpYr}: ${s.prevCount} รายการ`
                                  : `จำนวน ${s.count} รายการ`}
                              </small>
                            </div>
                            <div className="rr-v">{s.count} รายการ</div>
                            {isYoy ? (
                              <div className={`rr-d-chip ${d.cls}`}>{d.label}</div>
                            ) : (
                              <div className="rr-p">{s.pct}%</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Application Tracking & Timeline */}
      {activePerspective === 'protection_status' && (
        <div className="rr-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CHART 3: สถานะการยื่นคำขอและการคุ้มครอง (3 ระดับ) */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaShieldAlt style={{ color: '#8b5cf6', marginRight: '8px' }} />
                สถานะการยื่นคำขอและการคุ้มครอง (3 ระดับ)
              </h2>
              <div className="rr-ctrls">
                <YearSelectDropdown
                  label="ปี"
                  value={ip3Year}
                  onChange={(v) => {
                    setIp3Year(v);
                    if (v !== 'all') setIp3CmpYear(getDefaultCompareYear(v, availableYears));
                  }}
                  includeAll={true}
                  allPosition="top"
                />

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={ip3Mode === 'single' ? 'on' : ''}
                    onClick={() => setIp3Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={ip3Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setIp3Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                {ip3Mode === 'yoy' ? (
                  <YearSelectDropdown
                    label="เทียบกับปี"
                    value={ip3CmpYear}
                    onChange={(v) => setIp3CmpYear(v)}
                    excludeYear={ip3Year}
                    includeAll={false}
                  />
                ) : (
                  <div className="rr-seg-ctl">
                    <button
                      type="button"
                      className={ip3Layout === 'grouped' ? 'on' : ''}
                      onClick={() => setIp3Layout('grouped')}
                    >
                      แยกแท่ง
                    </button>
                    <button
                      type="button"
                      className={ip3Layout === 'stacked' ? 'on' : ''}
                      onClick={() => setIp3Layout('stacked')}
                    >
                      แท่งซ้อน
                    </button>
                  </div>
                )}

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={ip3Metric === 'count' ? 'on' : ''}
                    onClick={() => setIp3Metric('count')}
                  >
                    จำนวนรายการ
                  </button>
                  <button
                    type="button"
                    className={ip3Metric === 'support' ? 'on' : ''}
                    onClick={() => setIp3Metric('support')}
                  >
                    งบสนับสนุน (บาท)
                  </button>
                </div>
              </div>
            </div>

            <div className="rr-legend">
              <span className="rr-pill st" style={{ '--c': '#8b5cf6' } as React.CSSProperties}>
                <i />
                อนุสิทธิบัตร
              </span>
              <span className="rr-pill st" style={{ '--c': '#3b82f6' } as React.CSSProperties}>
                <i />
                สิทธิบัตรการประดิษฐ์
              </span>
              <span className="rr-pill st" style={{ '--c': '#10b981' } as React.CSSProperties}>
                <i />
                ลิขสิทธิ์ / อื่นๆ
              </span>
            </div>

            <div className="rr-scroller">
              {(() => {
                const rows = ip3StatusData.rows;
                const isYoy = ip3Mode === 'yoy';
                const W = 1120;
                const H = isYoy ? 375 : 325;
                const padL = 74;
                const padR = 44;
                const padT = 30;
                const plotB = 245;
                const plotW = W - padL - padR;
                const plotH = plotB - padT;
                const colW = plotW / rows.length;

                const maxValRaw = Math.max(
                  4,
                  ...rows.map((r) => r.curVal),
                  ...(isYoy ? rows.map((r) => r.prevVal) : [0])
                );
                const maxVal = Math.ceil(maxValRaw * 1.2);
                const yTicks = [0, Math.round(maxVal / 3), Math.round((maxVal * 2) / 3), maxVal];
                const unitTxt = ip3Metric === 'support' ? 'บาท' : 'รายการ';

                return (
                  <svg className="rr-plot" viewBox={`0 0 ${W} ${H}`}>
                    {yTicks.map((t, idx) => {
                      const y = plotB - (t / maxVal) * plotH;
                      return (
                        <g key={`ip3-grid-${idx}`}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                          <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">
                            {t.toLocaleString()}
                          </text>
                        </g>
                      );
                    })}

                    {rows.map((r, i) => {
                      const cx = padL + i * colW + colW / 2;
                      const isHov = ip3HoverIdx === i;
                      const segs = [
                        { label: 'อนุสิทธิบัตร', val: r.pettyVal, color: '#8b5cf6' },
                        { label: 'สิทธิบัตรการประดิษฐ์', val: r.patentVal, color: '#3b82f6' },
                        { label: 'ลิขสิทธิ์ / อื่นๆ', val: r.copyVal, color: '#10b981' },
                      ];

                      return (
                        <g
                          key={`ip3-col-${r.key}`}
                          style={{ cursor: r.items.length > 0 ? 'pointer' : 'default' }}
                          onMouseEnter={(e) => {
                            setIp3HoverIdx(i);
                            setTip({
                              show: true,
                              x: e.clientX,
                              y: e.clientY,
                              title: r.label,
                              color: r.color,
                              val: `${r.curVal.toLocaleString()} ${unitTxt}`,
                              sub: `รวม ${r.count} รายการ • งบสนับสนุน ${r.supportSum.toLocaleString()} บาท`,
                            });
                          }}
                          onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                          onMouseLeave={() => {
                            setIp3HoverIdx(null);
                            setTip((prev) => ({ ...prev, show: false }));
                          }}
                          onClick={() => {
                            if (r.items.length > 0) {
                              setDrillDown({
                                isOpen: true,
                                title: `สถานะ: ${r.label}`,
                                subtitle: `รวม ${r.count} รายการ • งบสนับสนุน ${r.supportSum.toLocaleString()} บาท`,
                                accentColor: r.color,
                                items: r.items,
                              });
                            }
                          }}
                        >
                          <rect
                            x={padL + i * colW + 18}
                            y={padT - 8}
                            width={colW - 36}
                            height={plotH + 14}
                            rx={10}
                            fill="#0f172a"
                            opacity={isHov ? 0.045 : 0}
                          />

                          {isYoy ? (
                            (() => {
                              const bw = 36;
                              const gap = 8;
                              const hP = (r.prevVal / maxVal) * plotH;
                              const hC = (r.curVal / maxVal) * plotH;
                              return (
                                <>
                                  {r.prevVal > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw - gap / 2}
                                        y={plotB - hP}
                                        width={bw}
                                        height={hP}
                                        rx={6}
                                        fill="#cbd5e1"
                                      />
                                      <text
                                        x={cx - bw / 2 - gap / 2}
                                        y={plotB - hP - 6}
                                        textAnchor="middle"
                                        fontSize="11.5"
                                        fontWeight="700"
                                        fill="#64748b"
                                      >
                                        {r.prevVal.toLocaleString()}
                                      </text>
                                    </>
                                  )}
                                  {r.curVal > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx + gap / 2}
                                        y={plotB - hC}
                                        width={bw}
                                        height={hC}
                                        rx={6}
                                        fill={r.color}
                                        style={{
                                          filter: isHov ? `drop-shadow(0 4px 10px ${r.color}66)` : 'none',
                                        }}
                                      />
                                      <text
                                        x={cx + bw / 2 + gap / 2}
                                        y={plotB - hC - 6}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fontWeight="800"
                                        fill="#0f172a"
                                      >
                                        {r.curVal.toLocaleString()}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          ) : ip3Layout === 'grouped' ? (
                            (() => {
                              const activeSegs = segs.filter((s) => s.val > 0);
                              const bw = 28;
                              const gap = 6;
                              const totalW = activeSegs.length * bw + Math.max(0, activeSegs.length - 1) * gap;
                              const startX = cx - totalW / 2;
                              return (
                                <>
                                  {activeSegs.map((s, sIdx) => {
                                    const h = (s.val / maxVal) * plotH;
                                    const x = startX + sIdx * (bw + gap);
                                    return (
                                      <g
                                        key={`ip3-g-${sIdx}`}
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          setIp3HoverIdx(i);
                                          setTip({
                                            show: true,
                                            x: e.clientX,
                                            y: e.clientY,
                                            title: `${s.label} · ${r.label}`,
                                            color: s.color,
                                            val: `${s.val.toLocaleString()} ${unitTxt}`,
                                            sub: `${r.curVal > 0 ? Math.round((s.val / r.curVal) * 100) : 0}% ของสถานะนี้`,
                                          });
                                        }}
                                      >
                                        <rect
                                          className="rr-rise"
                                          x={x}
                                          y={plotB - h}
                                          width={bw}
                                          height={h}
                                          rx={6}
                                          fill={s.color}
                                        />
                                        <text
                                          x={x + bw / 2}
                                          y={plotB - h - 5}
                                          textAnchor="middle"
                                          fontSize="11"
                                          fontWeight="700"
                                          fill="#0f172a"
                                        >
                                          {s.val.toLocaleString()}
                                        </text>
                                      </g>
                                    );
                                  })}
                                </>
                              );
                            })()
                          ) : (
                            (() => {
                              const bw = 54;
                              let curY = plotB;
                              return (
                                <>
                                  {segs.map((s, sIdx) => {
                                    if (s.val <= 0) return null;
                                    const h = (s.val / maxVal) * plotH;
                                    curY -= h;
                                    const hAdj = Math.max(2, h - 1);
                                    return (
                                      <g
                                        key={`ip3-s-${sIdx}`}
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          setIp3HoverIdx(i);
                                          setTip({
                                            show: true,
                                            x: e.clientX,
                                            y: e.clientY,
                                            title: `${s.label} · ${r.label}`,
                                            color: s.color,
                                            val: `${s.val.toLocaleString()} ${unitTxt}`,
                                            sub: `${r.curVal > 0 ? Math.round((s.val / r.curVal) * 100) : 0}% ของสถานะนี้`,
                                          });
                                        }}
                                      >
                                        <rect
                                          className="rr-rise"
                                          x={cx - bw / 2}
                                          y={curY}
                                          width={bw}
                                          height={hAdj}
                                          rx={7}
                                          fill={s.color}
                                        />
                                        {hAdj >= 15 && (
                                          <text
                                            x={cx}
                                            y={curY + hAdj / 2 + 4}
                                            textAnchor="middle"
                                            fontSize="11.5"
                                            fontWeight="700"
                                            fill="#ffffff"
                                            style={{ pointerEvents: 'none' }}
                                          >
                                            {s.val.toLocaleString()}
                                          </text>
                                        )}
                                      </g>
                                    );
                                  })}
                                  {r.curVal > 0 && (
                                    <text
                                      x={cx}
                                      y={curY - 7}
                                      textAnchor="middle"
                                      fontSize="12.5"
                                      fontWeight="800"
                                      fill="#0f172a"
                                    >
                                      {r.curVal.toLocaleString()}
                                    </text>
                                  )}
                                </>
                              );
                            })()
                          )}

                          <text
                            x={cx}
                            y={plotB + 22}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight={isHov ? '800' : '700'}
                            fill="#334155"
                          >
                            {r.label}
                          </text>

                          {isYoy && (
                            (() => {
                              const d = getDeltaInfo(r.curVal, r.prevVal);
                              const fillMap: Record<string, string> = {
                                up: '#dcfce7',
                                dn: '#fee2e2',
                                new: '#dbeafe',
                                same: '#e2e8f0',
                                flat: '#f1f5f9',
                              };
                              const txtMap: Record<string, string> = {
                                up: '#15803d',
                                dn: '#b91c1c',
                                new: '#1d4ed8',
                                same: '#334155',
                                flat: '#94a3b8',
                              };
                              return (
                                <>
                                  <rect
                                    x={cx - 28}
                                    y={plotB + 36}
                                    width={56}
                                    height={20}
                                    rx={10}
                                    fill={fillMap[d.cls]}
                                  />
                                  <text
                                    x={cx}
                                    y={plotB + 50}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill={txtMap[d.cls]}
                                  >
                                    {d.label}
                                  </text>
                                </>
                              );
                            })()
                          )}
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* CHART 4: แนวโน้มการสร้างสรรค์ผลงานตามปีงบประมาณ */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaCalendarAlt style={{ color: '#8b5cf6', marginRight: '8px' }} />
                แนวโน้มการสร้างสรรค์ผลงานตามปีงบประมาณ
              </h2>
              <div className="rr-ctrls">
                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={ip4Mode === 'single' ? 'on' : ''}
                    onClick={() => setIp4Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={ip4Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setIp4Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={ip4BreakBy === 'type' ? 'on' : ''}
                    onClick={() => setIp4BreakBy('type')}
                  >
                    แยกตามประเภท
                  </button>
                  <button
                    type="button"
                    className={ip4BreakBy === 'dept' ? 'on' : ''}
                    onClick={() => setIp4BreakBy('dept')}
                  >
                    แยกตามสังกัด
                  </button>
                </div>

                {ip4Mode === 'single' && (
                  <div className="rr-seg-ctl">
                    <button
                      type="button"
                      className={ip4Layout === 'grouped' ? 'on' : ''}
                      onClick={() => setIp4Layout('grouped')}
                    >
                      แยกแท่ง
                    </button>
                    <button
                      type="button"
                      className={ip4Layout === 'stacked' ? 'on' : ''}
                      onClick={() => setIp4Layout('stacked')}
                    >
                      แท่งซ้อน
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rr-legend">
              {ip4BreakBy === 'type' ? (
                <>
                  <span className="rr-pill st" style={{ '--c': '#8b5cf6' } as React.CSSProperties}>
                    <i />
                    อนุสิทธิบัตร
                  </span>
                  <span className="rr-pill st" style={{ '--c': '#3b82f6' } as React.CSSProperties}>
                    <i />
                    สิทธิบัตรการประดิษฐ์
                  </span>
                  <span className="rr-pill st" style={{ '--c': '#10b981' } as React.CSSProperties}>
                    <i />
                    ลิขสิทธิ์ / อื่นๆ
                  </span>
                </>
              ) : (
                ALL_IP_DEPTS.map((c) => (
                  <span key={`ip4-leg-${c}`} className="rr-pill st" style={{ '--c': UCOL[c] } as React.CSSProperties}>
                    <i />
                    {c}
                  </span>
                ))
              )}
              <button
                type="button"
                className="rr-pill"
                style={{ '--c': '#f59e0b' } as React.CSSProperties}
                aria-pressed={ip4ShowLine}
                onClick={() => setIp4ShowLine((p) => !p)}
              >
                <i className="ln" />
                งบสนับสนุนรวม (พันบาท)
              </button>
            </div>

            <div className="rr-scroller">
              {(() => {
                const rows = ip4TrendData;
                const isYoy = ip4Mode === 'yoy';
                const W = 1120;
                const H = isYoy ? 395 : 345;
                const padL = 68;
                const padR = 68;
                const padT = 30;
                const plotB = 255;
                const plotW = W - padL - padR;
                const plotH = plotB - padT;
                const colW = plotW / rows.length;

                const maxCountRaw = Math.max(4, ...rows.map((r) => r.total));
                const maxCount = Math.ceil(maxCountRaw * 1.25);
                const maxSupRaw = Math.max(20, ...rows.map((r) => r.supportSum / 1000));
                const maxSup = Math.ceil(maxSupRaw * 1.25);

                const yTicks = [0, Math.round(maxCount / 3), Math.round((maxCount * 2) / 3), maxCount];
                const yRightTicks = [0, Math.round(maxSup / 3), Math.round((maxSup * 2) / 3), maxSup];

                const linePts = rows.map((r, i) => ({
                  x: padL + i * colW + colW / 2,
                  y: plotB - (r.supportSum / 1000 / maxSup) * plotH,
                  val: Number((r.supportSum / 1000).toFixed(1)),
                }));

                return (
                  <svg className="rr-plot" viewBox={`0 0 ${W} ${H}`}>
                    {yTicks.map((t, idx) => {
                      const y = plotB - (t / maxCount) * plotH;
                      return (
                        <g key={`ip4-grid-${idx}`}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                          <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">
                            {t}
                          </text>
                        </g>
                      );
                    })}
                    {yRightTicks.map((t, idx) => {
                      const y = plotB - (t / maxSup) * plotH;
                      return (
                        <text
                          key={`ip4-rgrid-${idx}`}
                          x={W - padR + 10}
                          y={y + 4}
                          textAnchor="start"
                          fontSize="11"
                          fontWeight="700"
                          fill="#d97706"
                        >
                          {t}k
                        </text>
                      );
                    })}

                    {rows.map((r, i) => {
                      const cx = padL + i * colW + colW / 2;
                      const isHov = ip4HoverIdx === i;
                      const segs =
                        ip4BreakBy === 'type'
                          ? [
                              { label: 'อนุสิทธิบัตร', val: r.petty, color: '#8b5cf6' },
                              { label: 'สิทธิบัตร', val: r.patent, color: '#3b82f6' },
                              { label: 'ลิขสิทธิ์', val: r.copy, color: '#10b981' },
                            ]
                          : r.deptCounts.map((dc) => ({
                              label: dc.code,
                              val: dc.count,
                              color: dc.color,
                            }));

                      return (
                        <g
                          key={`ip4-col-${r.year}`}
                          style={{ cursor: r.items.length > 0 ? 'pointer' : 'default' }}
                          onMouseEnter={(e) => {
                            setIp4HoverIdx(i);
                            setTip({
                              show: true,
                              x: e.clientX,
                              y: e.clientY,
                              title: r.label,
                              color: '#8b5cf6',
                              val: `${r.total} รายการ • งบ ${r.supportSum.toLocaleString()} บาท`,
                              sub: `อนุสิทธิบัตร ${r.petty} • สิทธิบัตร ${r.patent} • ลิขสิทธิ์ ${r.copy}`,
                            });
                          }}
                          onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                          onMouseLeave={() => {
                            setIp4HoverIdx(null);
                            setTip((prev) => ({ ...prev, show: false }));
                          }}
                          onClick={() => {
                            if (r.items.length > 0) {
                              setDrillDown({
                                isOpen: true,
                                title: `ทรัพย์สินทางปัญญา: ${r.label}`,
                                subtitle: `รวม ${r.total} รายการ • งบสนับสนุน ${r.supportSum.toLocaleString()} บาท`,
                                accentColor: '#8b5cf6',
                                items: r.items,
                              });
                            }
                          }}
                        >
                          <rect
                            x={padL + i * colW + 18}
                            y={padT - 8}
                            width={colW - 36}
                            height={plotH + 14}
                            rx={10}
                            fill="#0f172a"
                            opacity={isHov ? 0.045 : 0}
                          />

                          {isYoy ? (
                            (() => {
                              const bw = 34;
                              const gap = 8;
                              const hP = (r.prevTotal / maxCount) * plotH;
                              const hC = (r.total / maxCount) * plotH;
                              return (
                                <>
                                  {r.hasPrev && r.prevTotal > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw - gap / 2}
                                        y={plotB - hP}
                                        width={bw}
                                        height={hP}
                                        rx={6}
                                        fill="#cbd5e1"
                                      />
                                      <text
                                        x={cx - bw / 2 - gap / 2}
                                        y={plotB - hP - 6}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontWeight="700"
                                        fill="#64748b"
                                      >
                                        {r.prevTotal}
                                      </text>
                                    </>
                                  )}
                                  {r.total > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={r.hasPrev ? cx + gap / 2 : cx - bw / 2}
                                        y={plotB - hC}
                                        width={bw}
                                        height={hC}
                                        rx={6}
                                        fill="#8b5cf6"
                                        style={{
                                          filter: isHov ? 'drop-shadow(0 4px 10px rgba(139,92,246,0.35))' : 'none',
                                        }}
                                      />
                                      <text
                                        x={r.hasPrev ? cx + bw / 2 + gap / 2 : cx}
                                        y={plotB - hC - 6}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fontWeight="800"
                                        fill="#0f172a"
                                      >
                                        {r.total}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          ) : ip4Layout === 'grouped' ? (
                            (() => {
                              const activeSegs = segs.filter((s) => s.val > 0);
                              const bw = Math.min(26, 90 / Math.max(1, activeSegs.length));
                              const gap = 4;
                              const totalW = activeSegs.length * bw + Math.max(0, activeSegs.length - 1) * gap;
                              const startX = cx - totalW / 2;
                              return (
                                <>
                                  {activeSegs.map((s, sIdx) => {
                                    const h = (s.val / maxCount) * plotH;
                                    const x = startX + sIdx * (bw + gap);
                                    return (
                                      <g key={`ip4-g-${sIdx}`}>
                                        <rect
                                          className="rr-rise"
                                          x={x}
                                          y={plotB - h}
                                          width={bw}
                                          height={h}
                                          rx={5}
                                          fill={s.color}
                                        />
                                        <text
                                          x={x + bw / 2}
                                          y={plotB - h - 5}
                                          textAnchor="middle"
                                          fontSize="10.5"
                                          fontWeight="700"
                                          fill="#0f172a"
                                        >
                                          {s.val}
                                        </text>
                                      </g>
                                    );
                                  })}
                                </>
                              );
                            })()
                          ) : (
                            (() => {
                              const bw = 48;
                              let curY = plotB;
                              return (
                                <>
                                  {segs.map((s, sIdx) => {
                                    if (s.val <= 0) return null;
                                    const h = (s.val / maxCount) * plotH;
                                    curY -= h;
                                    const hAdj = Math.max(2, h - 1);
                                    return (
                                      <g
                                        key={`ip4-s-${sIdx}`}
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          setIp4HoverIdx(i);
                                          setTip({
                                            show: true,
                                            x: e.clientX,
                                            y: e.clientY,
                                            title: `${s.label} · ${r.label}`,
                                            color: s.color,
                                            val: `${s.val} รายการ`,
                                            sub: `${r.total > 0 ? Math.round((s.val / r.total) * 100) : 0}% ของปีนี้ (${r.total} รายการ)`,
                                          });
                                        }}
                                      >
                                        <rect
                                          className="rr-rise"
                                          x={cx - bw / 2}
                                          y={curY}
                                          width={bw}
                                          height={hAdj}
                                          rx={6}
                                          fill={s.color}
                                        />
                                        {hAdj >= 15 && (
                                          <text
                                            x={cx}
                                            y={curY + hAdj / 2 + 4}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fontWeight="700"
                                            fill="#ffffff"
                                            style={{ pointerEvents: 'none' }}
                                          >
                                            {s.val}
                                          </text>
                                        )}
                                      </g>
                                    );
                                  })}
                                  {r.total > 0 && (
                                    <text
                                      x={cx}
                                      y={curY - 7}
                                      textAnchor="middle"
                                      fontSize="12"
                                      fontWeight="800"
                                      fill="#0f172a"
                                    >
                                      {r.total}
                                    </text>
                                  )}
                                </>
                              );
                            })()
                          )}

                          <text
                            x={cx}
                            y={plotB + 22}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="700"
                            fill="#334155"
                          >
                            {r.label}
                          </text>

                          {isYoy && (
                            (() => {
                              const d1 = r.hasPrev ? getDeltaInfo(r.total, r.prevTotal) : { label: 'ปีฐาน', cls: 'same' };
                              const d2 = r.hasPrev
                                ? getDeltaInfo(r.supportSum, r.prevSupportSum)
                                : { label: 'ปีฐาน', cls: 'same' };
                              const fillMap: Record<string, string> = {
                                up: '#dcfce7',
                                dn: '#fee2e2',
                                new: '#dbeafe',
                                same: '#e2e8f0',
                                flat: '#f1f5f9',
                              };
                              const txtMap: Record<string, string> = {
                                up: '#15803d',
                                dn: '#b91c1c',
                                new: '#1d4ed8',
                                same: '#334155',
                                flat: '#94a3b8',
                              };
                              return (
                                <>
                                  <rect
                                    x={cx - 28}
                                    y={plotB + 36}
                                    width={56}
                                    height={20}
                                    rx={10}
                                    fill={fillMap[d1.cls]}
                                  />
                                  <text
                                    x={cx}
                                    y={plotB + 50}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill={txtMap[d1.cls]}
                                  >
                                    {d1.label}
                                  </text>
                                  <rect
                                    x={cx - 28}
                                    y={plotB + 62}
                                    width={56}
                                    height={20}
                                    rx={10}
                                    fill={fillMap[d2.cls]}
                                  />
                                  <text
                                    x={cx}
                                    y={plotB + 76}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill={txtMap[d2.cls]}
                                  >
                                    {d2.label}
                                  </text>
                                </>
                              );
                            })()
                          )}
                        </g>
                      );
                    })}

                    {isYoy && (
                      <>
                        <text x={padL - 8} y={plotB + 50} textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b">
                          ผลงาน
                        </text>
                        <text x={padL - 8} y={plotB + 76} textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b">
                          งบสนับสนุน
                        </text>
                      </>
                    )}

                    {ip4ShowLine && (
                      <>
                        <path
                          d={buildSmoothPath(linePts)}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth={2.5}
                          style={{ pointerEvents: 'none' }}
                        />
                        {linePts.map((pt, i) =>
                          pt.val > 0 ? (
                            <g key={`ip4-lpt-${i}`} style={{ pointerEvents: 'none' }}>
                              <circle cx={pt.x} cy={pt.y} r={4.5} fill="#ffffff" stroke="#f59e0b" strokeWidth={2.5} />
                              <rect
                                x={pt.x - 20}
                                y={pt.y - 24}
                                width={40}
                                height={17}
                                rx={8.5}
                                fill="#ffffff"
                                stroke="#f59e0b"
                                strokeWidth={1.2}
                              />
                              <text
                                x={pt.x}
                                y={pt.y - 12.5}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="700"
                                fill="#b45309"
                              >
                                {pt.val}k
                              </text>
                            </g>
                          ) : null
                        )}
                      </>
                    )}
                  </svg>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 3: Faculty & Tech Clusters */}
      {activePerspective === 'faculty' && (
        <div className="rr-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CHART 5: 10 อันดับอาจารย์และนักประดิษฐ์ที่มีผลงานสูงสุด */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaUserTie style={{ color: '#8b5cf6', marginRight: '8px' }} />
                10 อันดับอาจารย์และนักประดิษฐ์ที่มีผลงานสูงสุด
              </h2>
              <div className="rr-ctrls">
                <YearSelectDropdown
                  label="ปี"
                  value={ip5Year}
                  onChange={(v) => {
                    setIp5Year(v);
                    if (v !== 'all') setIp5CmpYear(getDefaultCompareYear(v, availableYears));
                  }}
                  includeAll={true}
                  allPosition="top"
                />

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={ip5Mode === 'single' ? 'on' : ''}
                    onClick={() => setIp5Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={ip5Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setIp5Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                {ip5Mode === 'yoy' ? (
                  <YearSelectDropdown
                    label="เทียบกับปี"
                    value={ip5CmpYear}
                    onChange={(v) => setIp5CmpYear(v)}
                    excludeYear={ip5Year}
                    includeAll={false}
                  />
                ) : (
                  <div className="rr-seg-ctl">
                    <button
                      type="button"
                      className={ip5Layout === 'grouped' ? 'on' : ''}
                      onClick={() => setIp5Layout('grouped')}
                    >
                      แยกแท่ง
                    </button>
                    <button
                      type="button"
                      className={ip5Layout === 'stacked' ? 'on' : ''}
                      onClick={() => setIp5Layout('stacked')}
                    >
                      แท่งซ้อน
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rr-legend">
              <span className="rr-pill st" style={{ '--c': '#8b5cf6' } as React.CSSProperties}>
                <i />
                อนุสิทธิบัตร
              </span>
              <span className="rr-pill st" style={{ '--c': '#3b82f6' } as React.CSSProperties}>
                <i />
                สิทธิบัตรการประดิษฐ์
              </span>
              <span className="rr-pill st" style={{ '--c': '#10b981' } as React.CSSProperties}>
                <i />
                ลิขสิทธิ์ / อื่นๆ
              </span>
              {ip5Mode === 'yoy' && (
                <span className="rr-pill st" style={{ '--c': '#cbd5e1' } as React.CSSProperties}>
                  <i />
                  ปี {ipFacultyData.cmpYr}
                </span>
              )}
            </div>

            <div className="rr-scroller">
              {(() => {
                const rows = ipFacultyData.top10;
                if (rows.length === 0) {
                  return (
                    <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '13.5px' }}>
                      ไม่พบข้อมูลนักประดิษฐ์ตามตัวกรองที่เลือก
                    </div>
                  );
                }
                const isYoy = ip5Mode === 'yoy';
                const W = 1120;
                const H = isYoy ? 410 : 355;
                const padL = 64;
                const padR = 40;
                const padT = 30;
                const plotB = 260;
                const plotW = W - padL - padR;
                const plotH = plotB - padT;
                const n = Math.max(1, rows.length);
                const colW = plotW / n;

                const maxCountRaw = Math.max(
                  4,
                  ...rows.map((r) => r.count),
                  ...(isYoy ? rows.map((r) => r.prevCount) : [0])
                );
                const maxCount = Math.ceil(maxCountRaw * 1.2);
                const yTicks = [0, Math.round(maxCount / 3), Math.round((maxCount * 2) / 3), maxCount];

                return (
                  <svg className="rr-plot" viewBox={`0 0 ${W} ${H}`}>
                    {yTicks.map((t, idx) => {
                      const y = plotB - (t / maxCount) * plotH;
                      return (
                        <g key={`ip5-grid-${idx}`}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                          <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">
                            {t}
                          </text>
                        </g>
                      );
                    })}

                    {rows.map((r, i) => {
                      const cx = padL + i * colW + colW / 2;
                      const isHov = ip5HoverIdx === i;
                      const shortName = r.creator.length > 16 ? r.creator.slice(0, 15) + '…' : r.creator;
                      const segs = [
                        { label: 'อนุสิทธิบัตร', val: r.petty, color: '#8b5cf6', items: r.pettyItems },
                        { label: 'สิทธิบัตรการประดิษฐ์', val: r.patent, color: '#3b82f6', items: r.patentItems },
                        { label: 'ลิขสิทธิ์ / อื่นๆ', val: r.copy, color: '#10b981', items: r.copyItems },
                      ];

                      return (
                        <g
                          key={`ip5-col-${r.key}-${i}`}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => {
                            setIp5HoverIdx(i);
                            setTip({
                              show: true,
                              x: e.clientX,
                              y: e.clientY,
                              title: `${r.creator} (${r.deptCode})`,
                              color: r.color,
                              val: `${r.count} ผลงาน • งบ ${r.support.toLocaleString()} บาท`,
                              sub: `อนุสิทธิบัตร ${r.petty} • สิทธิบัตร ${r.patent} • ลิขสิทธิ์ ${r.copy}`,
                            });
                          }}
                          onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                          onMouseLeave={() => {
                            setIp5HoverIdx(null);
                            setTip((prev) => ({ ...prev, show: false }));
                          }}
                          onClick={() => {
                            setDrillDown({
                              isOpen: true,
                              title: `นักประดิษฐ์: ${r.creator}`,
                              subtitle: `สังกัด ${r.dept} • รวม ${r.count} ผลงาน`,
                              accentColor: r.color,
                              items: r.items,
                            });
                          }}
                        >
                          <rect
                            x={padL + i * colW + 5}
                            y={padT - 8}
                            width={colW - 10}
                            height={plotH + 14}
                            rx={10}
                            fill="#0f172a"
                            opacity={isHov ? 0.045 : 0}
                          />

                          {isYoy ? (
                            (() => {
                              const bw = 22;
                              const gap = 5;
                              const hP = (r.prevCount / maxCount) * plotH;
                              const hC = (r.count / maxCount) * plotH;
                              return (
                                <>
                                  {r.prevCount > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw - gap / 2}
                                        y={plotB - hP}
                                        width={bw}
                                        height={hP}
                                        rx={5}
                                        fill="#cbd5e1"
                                      />
                                      <text
                                        x={cx - bw / 2 - gap / 2}
                                        y={plotB - hP - 5}
                                        textAnchor="middle"
                                        fontSize="10.5"
                                        fontWeight="700"
                                        fill="#64748b"
                                      >
                                        {r.prevCount}
                                      </text>
                                    </>
                                  )}
                                  {r.count > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx + gap / 2}
                                        y={plotB - hC}
                                        width={bw}
                                        height={hC}
                                        rx={5}
                                        fill={r.color}
                                      />
                                      <text
                                        x={cx + bw / 2 + gap / 2}
                                        y={plotB - hC - 5}
                                        textAnchor="middle"
                                        fontSize="11.5"
                                        fontWeight="800"
                                        fill="#0f172a"
                                      >
                                        {r.count}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          ) : ip5Layout === 'grouped' ? (
                            (() => {
                              const activeSegs = segs.filter((s) => s.val > 0);
                              const bw = 20;
                              const gap = 4;
                              const totalW = activeSegs.length * bw + Math.max(0, activeSegs.length - 1) * gap;
                              const startX = cx - totalW / 2;
                              return (
                                <>
                                  {activeSegs.map((s, sIdx) => {
                                    const h = (s.val / maxCount) * plotH;
                                    const x = startX + sIdx * (bw + gap);
                                    return (
                                      <g key={`ip5-g-${sIdx}`}>
                                        <rect
                                          className="rr-rise"
                                          x={x}
                                          y={plotB - h}
                                          width={bw}
                                          height={h}
                                          rx={4}
                                          fill={s.color}
                                        />
                                        <text
                                          x={x + bw / 2}
                                          y={plotB - h - 5}
                                          textAnchor="middle"
                                          fontSize="10.5"
                                          fontWeight="700"
                                          fill="#0f172a"
                                        >
                                          {s.val}
                                        </text>
                                      </g>
                                    );
                                  })}
                                </>
                              );
                            })()
                          ) : (
                            (() => {
                              const bw = 36;
                              let curY = plotB;
                              return (
                                <>
                                  {segs.map((s, sIdx) => {
                                    if (s.val <= 0) return null;
                                    const h = (s.val / maxCount) * plotH;
                                    curY -= h;
                                    const hAdj = Math.max(2, h - 1);
                                    return (
                                      <g
                                        key={`ip5-s-${sIdx}`}
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          setIp5HoverIdx(i);
                                          setTip({
                                            show: true,
                                            x: e.clientX,
                                            y: e.clientY,
                                            title: `${s.label} · ${r.creator}`,
                                            color: s.color,
                                            val: `${s.val} รายการ`,
                                            sub: `${r.count > 0 ? Math.round((s.val / r.count) * 100) : 0}% ของผลงานทั้งหมด (${r.count} รายการ)`,
                                          });
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDrillDown({
                                            isOpen: true,
                                            title: `${s.label}: ${r.creator}`,
                                            subtitle: `รวม ${s.items.length} รายการ`,
                                            accentColor: s.color,
                                            items: s.items,
                                          });
                                        }}
                                      >
                                        <rect
                                          className="rr-rise"
                                          x={cx - bw / 2}
                                          y={curY}
                                          width={bw}
                                          height={hAdj}
                                          rx={6}
                                          fill={s.color}
                                        />
                                        {hAdj >= 15 && (
                                          <text
                                            x={cx}
                                            y={curY + hAdj / 2 + 4}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fontWeight="700"
                                            fill="#ffffff"
                                            style={{ pointerEvents: 'none' }}
                                          >
                                            {s.val}
                                          </text>
                                        )}
                                      </g>
                                    );
                                  })}
                                  {r.count > 0 && (
                                    <text
                                      x={cx}
                                      y={curY - 7}
                                      textAnchor="middle"
                                      fontSize="12"
                                      fontWeight="800"
                                      fill="#0f172a"
                                    >
                                      {r.count}
                                    </text>
                                  )}
                                </>
                              );
                            })()
                          )}

                          <rect x={cx - 22} y={plotB + 8} width={44} height={18} rx={5} fill={r.color} />
                          <text x={cx} y={plotB + 21} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#ffffff">
                            {r.deptCode}
                          </text>
                          <text x={cx} y={plotB + 40} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">
                            {shortName}
                          </text>

                          {isYoy && (
                            (() => {
                              const d = getDeltaInfo(r.count, r.prevCount);
                              const fillMap: Record<string, string> = {
                                up: '#dcfce7',
                                dn: '#fee2e2',
                                new: '#dbeafe',
                                same: '#e2e8f0',
                                flat: '#f1f5f9',
                              };
                              const txtMap: Record<string, string> = {
                                up: '#15803d',
                                dn: '#b91c1c',
                                new: '#1d4ed8',
                                same: '#334155',
                                flat: '#94a3b8',
                              };
                              return (
                                <>
                                  <rect x={cx - 26} y={plotB + 50} width={52} height={20} rx={10} fill={fillMap[d.cls]} />
                                  <text x={cx} y={plotB + 64} textAnchor="middle" fontSize="10" fontWeight="700" fill={txtMap[d.cls]}>
                                    {d.label}
                                  </text>
                                </>
                              );
                            })()
                          )}
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* CHART 6: กลุ่มเทคโนโลยีและนวัตกรรม (.rr-rows) */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaLightbulb style={{ color: '#8b5cf6', marginRight: '8px' }} />
                กลุ่มเทคโนโลยีและนวัตกรรม
              </h2>
            </div>

            <div className="rr-rows">
              {(() => {
                const rows = ipFacultyData.clusters;
                const isYoy = ip5Mode === 'yoy';
                const maxVal = Math.max(
                  1,
                  ...rows.map((r) => r.count),
                  ...(isYoy ? rows.map((r) => r.prevCount) : [0])
                );

                return rows.map((r, idx) => {
                  const pct = Math.min(100, (r.count / maxVal) * 100);
                  const prevPct = Math.min(100, (r.prevCount / maxVal) * 100);
                  const delta = getDeltaInfo(r.count, r.prevCount);
                  return (
                    <div
                      key={`cluster-row-${idx}`}
                      className={`rr-row ${isYoy ? 'cmp' : ''}`}
                      onMouseEnter={(e) =>
                        setTip({
                          show: true,
                          x: e.clientX,
                          y: e.clientY,
                          title: r.cluster,
                          color: r.color,
                          val: `${r.count} รายการ`,
                          sub: `งบสนับสนุนรวม ${r.support.toLocaleString()} บาท`,
                        })
                      }
                      onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                      onMouseLeave={() => setTip((prev) => ({ ...prev, show: false }))}
                      onClick={() => {
                        if (r.items.length > 0) {
                          setDrillDown({
                            isOpen: true,
                            title: `กลุ่มเทคโนโลยี: ${r.cluster}`,
                            subtitle: `รวม ${r.count} ผลงานทรัพย์สินทางปัญญา`,
                            accentColor: r.color,
                            items: r.items,
                          });
                        }
                      }}
                    >
                      <div className="rr-rk">{idx + 1}</div>
                      <div className="rr-un">
                        <span className="w-3 h-3 rounded shrink-0 inline-block" style={{ backgroundColor: r.color, minWidth: '12px', minHeight: '12px' }} />
                        <div className="rr-ut">
                          <b>{r.cluster}</b>
                          <small>งบสนับสนุน {r.support.toLocaleString()} บาท</small>
                        </div>
                      </div>
                      <div className="rr-tr">
                        {isYoy && r.prevCount > 0 && <div className="rr-bar ghost" style={{ width: `${prevPct}%` }} />}
                        <div className="rr-bar" style={{ width: `${pct}%`, backgroundColor: r.color }} />
                      </div>
                      <div className="rr-vl">
                        <b>{r.count} รายการ</b>
                        <small>{isYoy ? `ปี ${ipFacultyData.cmpYr}: ${r.prevCount} รายการ` : 'คลิกเพื่อดูรายการ'}</small>
                      </div>
                      {isYoy && <div className={`rr-d ${delta.cls}`}>{delta.label}</div>}
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Detailed Top Inventors Table with Circular Avatar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                ตารางทำเนียบ 10 อันดับนักประดิษฐ์
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                รายละเอียดรายชื่อ สังกัด จำนวนผลงาน และงบสนับสนุน พร้อมลิงก์ไปยังประวัติบุคลากร
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '40px' }}>#</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '64px' }}>รูปภาพประจำตัว</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>นักประดิษฐ์</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>สังกัด</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>ผลงาน</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>เงินสนับสนุน</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '70px' }}>แฟ้ม</th>
                  </tr>
                </thead>
                <tbody>
                  {topInventors.slice(0, 10).map((inv, idx) => (
                    <tr
                      key={`top-inv-${inv.person_id || inv.creator || idx}`}
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                      onClick={() => {
                        setDrillDown({
                          isOpen: true,
                          title: `นักประดิษฐ์: ${inv.creator}`,
                          subtitle: `สังกัด ${inv.dept} • รวม ${inv.count} ผลงาน`,
                          accentColor: '#8b5cf6',
                          items: inv.items,
                        });
                      }}
                    >
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: idx < 3 ? '#7c3aed' : '#64748b' }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: '#99b8db',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            border: '1.5px solid #e2e8f0',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={resolvePersonAvatar(inv.person_id, inv.creator)}
                            alt={inv.creator}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src !== '/default-avatar.png' && !target.src.endsWith('/default-avatar.png')) {
                                target.src = '/default-avatar.png';
                              }
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>
                        {inv.creator}
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <DepartmentBadge value={inv.dept} />
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f5f3ff', color: '#6d28d9' }}>
                          {inv.count} รายการ
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: inv.support > 0 ? '#047857' : '#94a3b8' }}>
                        {inv.support > 0 ? `${inv.support.toLocaleString('th-TH')} ฿` : '-'}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (inv.person_id) router.push(`/personnel/${inv.person_id}`);
                            else router.push(`/personnel?q=${encodeURIComponent(inv.creator)}`);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#6d28d9',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>ดู</span>
                          <FaChevronRight style={{ fontSize: '8px' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 4: UN SDGs & ISEE */}
      {activePerspective === 'sdg' && (
        <div className="chart-grid">
          <div>
            <StrategicAlignmentMatrix
          items={validIpData}
          categoryKey="ip"
          missionTitle="งานทรัพย์สินทางปัญญา"
          unitLabel="ผลงาน"
          showBudget={true}
        />
          </div>

          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
                <FaLeaf style={{ color: '#8b5cf6', marginRight: '6px' }} /> ยุทธศาสตร์ ISEE และค่านิยม IAM
              </h3>
              <div
                style={{
                  display: 'inline-flex',
                  backgroundColor: '#f1f5f9',
                  padding: '2px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <button
                  type="button"
                  onClick={() => setStrategyMetric('count')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: strategyMetric === 'count' ? '#ffffff' : 'transparent',
                    color: strategyMetric === 'count' ? '#6d28d9' : '#64748b',
                    fontWeight: strategyMetric === 'count' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  จำนวนผลงาน
                </button>
                <button
                  type="button"
                  onClick={() => setStrategyMetric('budget')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: strategyMetric === 'budget' ? '#ffffff' : 'transparent',
                    color: strategyMetric === 'budget' ? '#6d28d9' : '#64748b',
                    fontWeight: strategyMetric === 'budget' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  งบสนับสนุน
                </button>
              </div>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>
              ทรัพย์สินทางปัญญาขับเคลื่อนยุทธศาสตร์ I (Innovate) 100% ควบคู่กับค่านิยม A (Agility) ในการแปลงผลงาน
            </p>
            <div className="chart-wrapper">
              <canvas id="c_ip_isee_iam" />
            </div>
          </div>
        </div>
      )}

      {tip.show && (
        <div
          className="rr-tip show"
          style={{
            left: `${Math.min(typeof window !== 'undefined' ? window.innerWidth - 270 : 1000, tip.x + 14)}px`,
            top: `${Math.max(12, tip.y - 76)}px`,
          }}
        >
          <div className="rr-tt">
            <span className="rr-d" style={{ backgroundColor: tip.color }} />
            <span>{tip.title}</span>
          </div>
          <div className="rr-tv">{tip.val}</div>
          <div className="rr-ts">{tip.sub}</div>
        </div>
      )}

      <DrillDownProjectDrawer
        isOpen={drillDown.isOpen}
        onClose={() => setDrillDown((prev) => ({ ...prev, isOpen: false }))}
        title={drillDown.title}
        subtitle={drillDown.subtitle}
        accentColor={drillDown.accentColor}
        items={drillDown.items}
        categoryKey="ip"
      />
    </div>
  );
}
