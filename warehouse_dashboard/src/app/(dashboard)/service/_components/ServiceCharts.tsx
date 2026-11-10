'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartLine,
  FaChartBar,
  FaBuilding,
  FaUserTie,
  FaUsers,
  FaLeaf,
  FaChevronRight,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { ServiceItem } from '../_hooks/useServiceData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { resolvePersonAvatar, matchPerson } from '@/lib/personnelService';
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

const THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

function getServiceFiscalYear(item: ServiceItem): string {
  if (item._fiscalYear && /^25\d{2}$/.test(String(item._fiscalYear))) {
    return String(item._fiscalYear);
  }
  const fyRaw = Number(item.fiscal_year);
  if (fyRaw >= 2500 && fyRaw <= 2600) return String(fyRaw);
  if (fyRaw >= 1960 && fyRaw <= 1980) return String(fyRaw + 600);
  if (fyRaw >= 2020 && fyRaw <= 2035) return String(fyRaw + 543);

  const dStr = String(item.date || item.start_date || '').trim();
  const m = dStr.match(/^(\d{4})-(\d{1,2})/);
  if (m) {
    let y = parseInt(m[1], 10);
    const mo = parseInt(m[2], 10);
    if (y >= 1960 && y <= 1980) y += 600;
    else if (y >= 2000 && y < 2500) y += 543;
    if (y >= 2500 && y <= 2600) {
      return mo >= 10 ? String(y + 1) : String(y);
    }
  }
  return item._fiscalYear || '2568';
}

function getServiceMonthIndex(item: ServiceItem): number {
  const dStr = String(item.date || item.start_date || '').trim();
  if (!dStr) return -1;
  const iso = dStr.match(/^\d{4}-(\d{1,2})/);
  if (iso) {
    const mo = parseInt(iso[1], 10);
    if (mo >= 1 && mo <= 12) return mo - 1;
  }
  const slash = dStr.match(/^\d{1,2}\/(\d{1,2})\/\d{2,4}/);
  if (slash) {
    const mo = parseInt(slash[1], 10);
    if (mo >= 1 && mo <= 12) return mo - 1;
  }
  for (let i = 0; i < THAI_MONTHS_SHORT.length; i++) {
    const tm = THAI_MONTHS_SHORT[i];
    if (dStr.includes(tm) || dStr.includes(tm.replace('.', ''))) return i;
  }
  return -1;
}

function isExpertService(item: ServiceItem): boolean {
  const t = `${item._resolvedType || ''} ${item.service_type || ''} ${item._smartRole || ''}`;
  return t.includes('ผู้ทรงคุณวุฒิ') || t.includes('ประเมิน') || t.includes('กรรมการ') || t.includes('วิทยานิพนธ์');
}

function getServiceDeptCode(item: ServiceItem): string {
  const raw = String(item.department_code || item.departmentCode || item.department || '').trim();
  if (raw.toUpperCase() === 'IRE') return 'IRRE';
  const d = getDepartment(raw);
  if (d.code && d.code !== '-') return d.code === 'IRE' ? 'IRRE' : d.code;
  return 'OTH';
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

interface ServiceChartsProps {
  validData: ServiceItem[];
  allItems?: ServiceItem[];
  currentFiscalYear?: string;
  onSelectDept?: (deptCode: string) => void;
  onSelectType?: (typeName: string) => void;
  onSelectPerson?: (personName: string) => void;
  activePerspective?: ServicePerspective;
  onChangePerspective?: (persp: ServicePerspective) => void;
  hideSelector?: boolean;
}

export type ServicePerspective = 'timeline_type' | 'department' | 'faculty' | 'sdg' | 'table';

export function ServiceCharts({
  validData,
  allItems,
  currentFiscalYear = 'all',
  onSelectDept,
  onSelectType,
  onSelectPerson,
  activePerspective: propPerspective,
  onChangePerspective,
  hideSelector = false,
}: ServiceChartsProps) {
  const router = useRouter();
  const [internalPerspective, setInternalPerspective] = useState<ServicePerspective>('timeline_type');
  const activePerspective = propPerspective ?? internalPerspective;
  const setActivePerspective = onChangePerspective ?? setInternalPerspective;
  const [strategyMetric, setStrategyMetric] = useState<'activities' | 'targets' | 'staff'>('activities');
  const [deptChartMode, setDeptChartMode] = useState<'grouped' | 'combo'>('grouped');
  const chartInstances = useRef<Chart[]>([]);

  const sourcePool = useMemo(() => (allItems && allItems.length > 0 ? allItems : validData), [allItems, validData]);

  const availableYears = useMemo(() => {
    return Array.from(STANDARD_YEAR_OPTIONS);
  }, []);

  // ── Chart 1: จำนวนครั้งและบุคลากรที่ให้บริการรายเดือน states ──
  const [m1Year, setM1Year] = useState<string>(STANDARD_YEAR_OPTIONS[0] || '2569');
  const [m1Mode, setM1Mode] = useState<'single' | 'yoy'>('single');
  const [m1CmpYear, setM1CmpYear] = useState<string>('2567');
  const [m1Layout, setM1Layout] = useState<'grouped' | 'stacked'>('stacked');
  const [m1ShowDirect, setM1ShowDirect] = useState<boolean>(true);
  const [m1ShowExpert, setM1ShowExpert] = useState<boolean>(true);
  const [m1ShowLine, setM1ShowLine] = useState<boolean>(true);
  const [m1HoverIdx, setM1HoverIdx] = useState<number | null>(null);

  // ── Chart 2: จำนวนงานบริการวิชาการจำแนกตามลักษณะบทบาทหน้าที่ states ──
  const [m2Year, setM2Year] = useState<string>('all');
  const [m2Mode, setM2Mode] = useState<'single' | 'yoy'>('single');
  const [m2CmpYear, setM2CmpYear] = useState<string>('2567');
  const [m2Metric, setM2Metric] = useState<'count' | 'staff' | 'hours'>('count');
  const [m2Layout, setM2Layout] = useState<'grouped' | 'stacked'>('stacked');
  const [m2HoverIdx, setM2HoverIdx] = useState<number | null>(null);

  // ── Chart 3: เปรียบเทียบจำนวนงานบริการและบุคลากรรายสังกัด states ──
  const [m3Year, setM3Year] = useState<string>('all');
  const [m3Mode, setM3Mode] = useState<'single' | 'yoy'>('single');
  const [m3CmpYear, setM3CmpYear] = useState<string>('2567');
  const [m3Layout, setM3Layout] = useState<'grouped' | 'stacked'>('grouped');
  const [m3ShowLine, setM3ShowLine] = useState<boolean>(true);
  const [m3HoverIdx, setM3HoverIdx] = useState<number | null>(null);

  // ── Chart 4: ภาระงานเฉลี่ยต่อบุคลากรที่พบในบันทึก (งาน/ท่าน) states ──
  const [m4Year, setM4Year] = useState<string>('all');
  const [m4Mode, setM4Mode] = useState<'single' | 'yoy'>('single');
  const [m4CmpYear, setM4CmpYear] = useState<string>('2567');
  const [m4Metric, setM4Metric] = useState<'avg' | 'count' | 'staff' | 'hours'>('avg');

  // ── Chart 5 & 6: บุคลากรผู้ให้บริการสูงสุด (Top 10 & Workload Tiers) states ──
  const [m5Year, setM5Year] = useState<string>('all');
  const [m5Mode, setM5Mode] = useState<'single' | 'yoy'>('single');
  const [m5CmpYear, setM5CmpYear] = useState<string>('2567');
  const [m5Layout, setM5Layout] = useState<'grouped' | 'stacked'>('stacked');
  const [m5HoverIdx, setM5HoverIdx] = useState<number | null>(null);
  const [m6DisplayMode, setM6DisplayMode] = useState<'count' | 'pct'>('count');
  const [m6HoverIdx, setM6HoverIdx] = useState<number | null>(null);

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
    color: '#f59e0b',
    val: '',
    sub: '',
  });

  useEffect(() => {
    if (currentFiscalYear && currentFiscalYear !== 'all') {
      setM1Year(currentFiscalYear);
      setM2Year(currentFiscalYear);
      setM3Year(currentFiscalYear);
      setM4Year(currentFiscalYear);
      setM5Year(currentFiscalYear);
      const prev = String(Number(currentFiscalYear) - 1);
      setM1CmpYear(prev);
      setM2CmpYear(prev);
      setM3CmpYear(prev);
      setM4CmpYear(prev);
      setM5CmpYear(prev);
    } else {
      setM1Year(STANDARD_YEAR_OPTIONS[0] || '2569');
      setM2Year('all');
      setM3Year('all');
      setM4Year('all');
      setM5Year('all');
    }
  }, [currentFiscalYear]);

  // ── Data Memo 1: Monthly Service & Staff ──
  const monthlyServiceData = useMemo(() => {
    const filterByYear = (yr: string) =>
      yr === 'all' ? validData : sourcePool.filter((it) => getServiceFiscalYear(it) === yr);

    const buildYearMonths = (items: ServiceItem[]) => {
      const months = Array.from({ length: 12 }, (_, i) => ({
        idx: i,
        label: THAI_MONTHS_SHORT[i],
        direct: 0,
        expert: 0,
        total: 0,
        staffSet: new Set<string>(),
        items: [] as ServiceItem[],
        directItems: [] as ServiceItem[],
        expertItems: [] as ServiceItem[],
      }));
      let undatedCount = 0;
      const totalUniqueStaff = new Set<string>();

      items.forEach((it) => {
        const exp = isExpertService(it);
        if (exp && !m1ShowExpert) return;
        if (!exp && !m1ShowDirect) return;

        const p = String(it.person || '').trim();
        if (p && p !== '-' && p !== 'nan') totalUniqueStaff.add(p);

        const mIdx = getServiceMonthIndex(it);
        if (mIdx >= 0 && mIdx < 12) {
          if (exp) {
            months[mIdx].expert++;
            months[mIdx].expertItems.push(it);
          } else {
            months[mIdx].direct++;
            months[mIdx].directItems.push(it);
          }
          months[mIdx].total++;
          if (p && p !== '-' && p !== 'nan') months[mIdx].staffSet.add(p);
          months[mIdx].items.push(it);
        } else {
          undatedCount++;
        }
      });

      return {
        months: months.map((m) => ({ ...m, staffCount: m.staffSet.size })),
        totalCount: months.reduce((s, m) => s + m.total, 0),
        totalStaff: totalUniqueStaff.size,
        undatedCount,
        allItems: items,
      };
    };

    const cur = buildYearMonths(filterByYear(m1Year));
    const cmpYr = m1Year === 'all' ? '2567' : m1CmpYear;
    const prev = buildYearMonths(filterByYear(cmpYr));
    return { cur, prev, cmpYr };
  }, [validData, sourcePool, m1Year, m1CmpYear, m1ShowDirect, m1ShowExpert]);

  // ── Data Memo 2: Service Breakdown by Role / Activity Type ──
  const roleChartData = useMemo(() => {
    const filterByYear = (yr: string) =>
      yr === 'all' ? validData : sourcePool.filter((it) => getServiceFiscalYear(it) === yr);

    const curItems = filterByYear(m2Year);
    const cmpYr = m2Year === 'all' ? '2567' : m2CmpYear;
    const prevItems = filterByYear(cmpYr);

    const roleSet = new Set<string>();
    curItems.forEach((it) => roleSet.add(it._smartRole || it.service_type || 'งานบริการวิชาการอื่นๆ'));
    prevItems.forEach((it) => roleSet.add(it._smartRole || it.service_type || 'งานบริการวิชาการอื่นๆ'));

    const ROLE_COLORS = ['#f59e0b', '#0284c7', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1', '#f97316'];

    const rows = Array.from(roleSet).map((label, idx) => {
      const cList = curItems.filter((it) => (it._smartRole || it.service_type || 'งานบริการวิชาการอื่นๆ') === label);
      const pList = prevItems.filter((it) => (it._smartRole || it.service_type || 'งานบริการวิชาการอื่นๆ') === label);

      const cDirect = cList.filter((it) => !isExpertService(it));
      const cExpert = cList.filter((it) => isExpertService(it));

      const getVal = (list: ServiceItem[]) => {
        if (m2Metric === 'staff') {
          const s = new Set(list.map((x) => String(x.person || '').trim()).filter((p) => p && p !== '-' && p !== 'nan'));
          return s.size;
        }
        if (m2Metric === 'hours') {
          return list.reduce((sum, x) => sum + (Number(x.hours_spent ?? x.hours ?? 0) || 0), 0);
        }
        return list.length;
      };

      const curVal = getVal(cList);
      const prevVal = getVal(pList);
      const directVal = getVal(cDirect);
      const expertVal = getVal(cExpert);
      const staffCount = new Set(cList.map((x) => String(x.person || '').trim()).filter((p) => p && p !== '-' && p !== 'nan')).size;
      const hoursSum = cList.reduce((sum, x) => sum + (Number(x.hours_spent ?? x.hours ?? 0) || 0), 0);

      return {
        label,
        shortLabel: label.length > 22 ? label.slice(0, 20) + '…' : label,
        color: ROLE_COLORS[idx % ROLE_COLORS.length],
        curVal,
        prevVal,
        directVal,
        expertVal,
        count: cList.length,
        staffCount,
        hoursSum,
        items: cList,
        prevItems: pList,
      };
    });

    rows.sort((a, b) => b.curVal - a.curVal || b.prevVal - a.prevVal);
    return { rows, cmpYr };
  }, [validData, sourcePool, m2Year, m2CmpYear, m2Metric]);

  // ── Data Memo 3 & 4: Department Service Comparison & Workload Ranking ──
  const DEPT_ORDER = ['AE', 'ME', 'FE', 'CE', 'IRRE', 'CPE', 'IE'];

  const deptComparisonData = useMemo(() => {
    const filterByYear = (yr: string) =>
      yr === 'all' ? validData : sourcePool.filter((it) => getServiceFiscalYear(it) === yr);

    const buildDepts = (items: ServiceItem[], yr: string) => {
      const cmpYr = yr === 'all' ? '2567' : m3CmpYear;
      const prevPool = filterByYear(cmpYr);

      const codes = new Set<string>(DEPT_ORDER);
      items.forEach((it) => codes.add(getServiceDeptCode(it)));

      const list = Array.from(codes).map((code) => {
        const dInfo = getDepartment(code);
        const cItems = items.filter((it) => getServiceDeptCode(it) === code);
        const pItems = prevPool.filter((it) => getServiceDeptCode(it) === code);

        const cDirect = cItems.filter((it) => !isExpertService(it));
        const cExpert = cItems.filter((it) => isExpertService(it));

        const cStaff = new Set(cItems.map((x) => String(x.person || '').trim()).filter((p) => p && p !== '-' && p !== 'nan'));
        const pStaff = new Set(pItems.map((x) => String(x.person || '').trim()).filter((p) => p && p !== '-' && p !== 'nan'));

        const cHours = cItems.reduce((s, x) => s + (Number(x.hours_spent ?? x.hours ?? 0) || 0), 0);
        const pHours = pItems.reduce((s, x) => s + (Number(x.hours_spent ?? x.hours ?? 0) || 0), 0);

        const cAvg = cStaff.size > 0 ? Number((cItems.length / cStaff.size).toFixed(1)) : 0;
        const pAvg = pStaff.size > 0 ? Number((pItems.length / pStaff.size).toFixed(1)) : 0;

        return {
          code,
          name: dInfo.name !== '-' ? dInfo.name : code,
          color: UCOL[code] || UCOL.OTH,
          count: cItems.length,
          prevCount: pItems.length,
          directCount: cDirect.length,
          expertCount: cExpert.length,
          staffCount: cStaff.size,
          prevStaffCount: pStaff.size,
          hours: cHours,
          prevHours: pHours,
          avg: cAvg,
          prevAvg: pAvg,
          items: cItems,
          prevItems: pItems,
        };
      });

      return list.filter((d) => DEPT_ORDER.includes(d.code) || d.count > 0 || d.prevCount > 0);
    };

    const m3Rows = buildDepts(filterByYear(m3Year), m3Year).sort((a, b) => b.count - a.count || b.staffCount - a.staffCount);

    // Chart 4 uses m4Year and m4CmpYear
    const m4CurPool = filterByYear(m4Year);
    const m4CmpYr = m4Year === 'all' ? '2567' : m4CmpYear;
    const m4PrevPool = filterByYear(m4CmpYr);

    const m4Codes = new Set<string>(DEPT_ORDER);
    m4CurPool.forEach((it) => m4Codes.add(getServiceDeptCode(it)));

    const m4Rows = Array.from(m4Codes)
      .map((code) => {
        const dInfo = getDepartment(code);
        const cItems = m4CurPool.filter((it) => getServiceDeptCode(it) === code);
        const pItems = m4PrevPool.filter((it) => getServiceDeptCode(it) === code);
        const cStaff = new Set(cItems.map((x) => String(x.person || '').trim()).filter((p) => p && p !== '-' && p !== 'nan'));
        const pStaff = new Set(pItems.map((x) => String(x.person || '').trim()).filter((p) => p && p !== '-' && p !== 'nan'));
        const cHours = cItems.reduce((s, x) => s + (Number(x.hours_spent ?? x.hours ?? 0) || 0), 0);
        const pHours = pItems.reduce((s, x) => s + (Number(x.hours_spent ?? x.hours ?? 0) || 0), 0);
        const cAvg = cStaff.size > 0 ? Number((cItems.length / cStaff.size).toFixed(1)) : 0;
        const pAvg = pStaff.size > 0 ? Number((pItems.length / pStaff.size).toFixed(1)) : 0;

        const getVal = (cnt: number, stf: number, hrs: number, avg: number) => {
          if (m4Metric === 'count') return cnt;
          if (m4Metric === 'staff') return stf;
          if (m4Metric === 'hours') return hrs;
          return avg;
        };

        return {
          code,
          name: dInfo.name !== '-' ? dInfo.name : code,
          color: UCOL[code] || UCOL.OTH,
          count: cItems.length,
          prevCount: pItems.length,
          staffCount: cStaff.size,
          prevStaffCount: pStaff.size,
          hours: cHours,
          prevHours: pHours,
          avg: cAvg,
          prevAvg: pAvg,
          curVal: getVal(cItems.length, cStaff.size, cHours, cAvg),
          prevVal: getVal(pItems.length, pStaff.size, pHours, pAvg),
          items: cItems,
        };
      })
      .filter((d) => DEPT_ORDER.includes(d.code) || d.count > 0 || d.prevCount > 0)
      .sort((a, b) => b.curVal - a.curVal || b.count - a.count);

    return {
      m3Rows,
      m3CmpYr: m3Year === 'all' ? '2567' : m3CmpYear,
      m4Rows,
      m4CmpYr,
    };
  }, [validData, sourcePool, m3Year, m3CmpYear, m4Year, m4CmpYear, m4Metric]);
  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    items: ServiceItem[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#f59e0b',
    items: [],
  });

  // Calculate top contributors (interactive by m5Year / m5CmpYear)
  const facultyChartData = useMemo(() => {
    const filterByYear = (yr: string) =>
      yr === 'all' ? validData : sourcePool.filter((it) => getServiceFiscalYear(it) === yr);

    const curPool = filterByYear(m5Year);
    const cmpYr = m5Year === 'all' ? '2567' : m5CmpYear;
    const prevPool = filterByYear(cmpYr);

    const buildPeople = (items: ServiceItem[]) => {
      const map: Record<
        string,
        {
          key: string;
          name: string;
          person_id?: number | string;
          dept: string;
          deptCode: string;
          count: number;
          directCount: number;
          expertCount: number;
          hours: number;
          targets: Set<string>;
          items: ServiceItem[];
          directItems: ServiceItem[];
          expertItems: ServiceItem[];
        }
      > = {};

      items.forEach((item) => {
        const pName = String(item.person || '').trim();
        if (!pName || pName === '-' || pName === 'nan') return;
        const matched = matchPerson(pName);
        const pId = item.person_id || matched?.id || matched?._id || matched?.person_id;
        const key = pId ? `id_${pId}` : pName;
        if (!map[key]) {
          const deptCode = getServiceDeptCode(item);
          map[key] = {
            key,
            name: pName,
            person_id: pId,
            dept: item.department || deptCode,
            deptCode,
            count: 0,
            directCount: 0,
            expertCount: 0,
            hours: 0,
            targets: new Set<string>(),
            items: [],
            directItems: [],
            expertItems: [],
          };
        }
        const exp = isExpertService(item);
        map[key].count++;
        if (exp) {
          map[key].expertCount++;
          map[key].expertItems.push(item);
        } else {
          map[key].directCount++;
          map[key].directItems.push(item);
        }
        map[key].hours += Number(item.hours_spent ?? item.hours ?? 0) || 0;
        if (item.target_group && item.target_group !== '-' && item.target_group !== 'nan') {
          map[key].targets.add(item.target_group);
        }
        map[key].items.push(item);
      });
      return map;
    };

    const curMap = buildPeople(curPool);
    const prevMap = buildPeople(prevPool);

    const allPeople = Object.values(curMap)
      .map((p) => {
        const prev = prevMap[p.key] || Object.values(prevMap).find((x) => x.name === p.name);
        return {
          ...p,
          prevCount: prev ? prev.count : 0,
          prevHours: prev ? prev.hours : 0,
          prevItems: prev ? prev.items : [],
          color: UCOL[p.deptCode] || UCOL.OTH,
        };
      })
      .sort((a, b) => b.count - a.count || b.hours - a.hours);

    // Workload Tiers
    const tierDefs = [
      { key: 't1', label: '1–2 ครั้ง/ปี (ทั่วไป)', color: '#64748b', min: 1, max: 2 },
      { key: 't2', label: '3–5 ครั้ง/ปี (สม่ำเสมอ)', color: '#0284c7', min: 3, max: 5 },
      { key: 't3', label: '6–10 ครั้ง/ปี (เชี่ยวชาญ)', color: '#10b981', min: 6, max: 10 },
      { key: 't4', label: '> 10 ครั้ง/ปี (โดดเด่น)', color: '#f59e0b', min: 11, max: 9999 },
    ];

    const prevPeopleList = Object.values(prevMap);
    const tiers = tierDefs.map((td) => {
      const matched = allPeople.filter((p) => p.count >= td.min && p.count <= td.max);
      const prevMatched = prevPeopleList.filter((p) => p.count >= td.min && p.count <= td.max);
      const items = matched.flatMap((p) => p.items);
      const pct = allPeople.length > 0 ? Number(((matched.length / allPeople.length) * 100).toFixed(1)) : 0;
      return {
        ...td,
        count: matched.length,
        prevCount: prevMatched.length,
        pct,
        items,
      };
    });

    return {
      allPeople,
      top10: allPeople.slice(0, 10),
      tiers,
      totalPeople: allPeople.length,
      cmpYr,
    };
  }, [validData, sourcePool, m5Year, m5CmpYear]);

  const topServiceFaculty = facultyChartData.allPeople;

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'sdg') {
      // ISEE / IAM Chart dynamically calculated from validData
      let sCount = 0;
      let e1Count = 0;
      let e2Count = 0;
      let iCount = 0;
      validData.forEach((d) => {
        const text = `${d.name || ''} ${d.topic_title || ''} ${d.target_group || ''}`.toLowerCase();
        if (text.includes('ต่างประเทศ') || text.includes('สากล') || text.includes('inter') || text.includes('cau') || text.includes('japan')) iCount++;
        else if (text.includes('ดิจิทัล') || text.includes('ธุรกิจ') || text.includes('ผู้ประกอบการ') || text.includes('ระบบ')) e2Count++;
        else if (text.includes('ประเมิน') || text.includes('วิทยานิพนธ์') || text.includes('ผู้ทรงคุณวุฒิ') || text.includes('บรรยาย')) e1Count++;
        else sCount++;
      });

      createChart('c_sv_isee_iam', {
        type: 'bar',
        data: {
          labels: ['S (สังคมและความยั่งยืน)', 'E1 (ความเป็นเลิศวิชาการ)', 'E2 (ดิจิทัล/ผู้ประกอบการ)', 'I (นานาชาติ)'],
          datasets: [
            {
              label: 'ยุทธศาสตร์ ISEE',
              data: [sCount, e1Count, e2Count, iCount],
              backgroundColor: ['#FDE68A', '#86EFAC', '#93C5FD', '#FDA4AF'],
              borderColor: ['#F59E0B', '#22C55E', '#3B82F6', '#F43F5E'],
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
              formatter: (v: number) => `${v} กิจกรรม`,
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
  }, [validData, activePerspective]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            

      {/* DIMENSION 1: Timeline & Types */}
      {activePerspective === 'timeline_type' && (
        <div className="rr-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CHART 1: จำนวนครั้งและบุคลากรที่ให้บริการรายเดือน */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaChartLine style={{ color: '#f59e0b', marginRight: '8px' }} />
                {m1Mode === 'yoy'
                  ? `จำนวนครั้งและบุคลากรที่ให้บริการรายเดือน (ปี ${m1Year === 'all' ? 'ทั้งหมด' : m1Year} vs ปี ${monthlyServiceData.cmpYr})`
                  : 'จำนวนครั้งและบุคลากรที่ให้บริการรายเดือน'}
              </h2>
              <div className="rr-ctrls">
                <YearSelectDropdown
                  label="ปี"
                  value={m1Year}
                  onChange={(v) => {
                    setM1Year(v);
                    if (v !== 'all') setM1CmpYear(getDefaultCompareYear(v, availableYears));
                  }}
                  includeAll={true}
                  allPosition="top"
                />

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={m1Mode === 'single' ? 'on' : ''}
                    onClick={() => setM1Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={m1Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setM1Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                {m1Mode === 'yoy' ? (
                  <YearSelectDropdown
                    label="เทียบกับปี"
                    value={m1CmpYear}
                    onChange={(v) => setM1CmpYear(v)}
                    excludeYear={m1Year}
                    includeAll={false}
                  />
                ) : (
                  <div className="rr-seg-ctl">
                    <button
                      type="button"
                      className={m1Layout === 'grouped' ? 'on' : ''}
                      onClick={() => setM1Layout('grouped')}
                    >
                      แยกแท่ง
                    </button>
                    <button
                      type="button"
                      className={m1Layout === 'stacked' ? 'on' : ''}
                      onClick={() => setM1Layout('stacked')}
                    >
                      แท่งซ้อน
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rr-legend">
              {m1Mode === 'yoy' && <span className="rr-lbl">นับเฉพาะ:</span>}
              <button
                type="button"
                className="rr-pill"
                style={{ '--c': '#f59e0b' } as React.CSSProperties}
                aria-pressed={m1ShowDirect}
                onClick={() => {
                  if (m1ShowDirect && !m1ShowExpert) return;
                  setM1ShowDirect(!m1ShowDirect);
                }}
              >
                <i />
                วิชาการ
              </button>
              <button
                type="button"
                className="rr-pill"
                style={{ '--c': '#0284c7' } as React.CSSProperties}
                aria-pressed={m1ShowExpert}
                onClick={() => {
                  if (m1ShowExpert && !m1ShowDirect) return;
                  setM1ShowExpert(!m1ShowExpert);
                }}
              >
                <i />
                ผู้ทรงคุณวุฒิ
              </button>
              {m1Mode === 'yoy' && (
                <>
                  <span className="rr-pill st" style={{ '--c': '#f59e0b' } as React.CSSProperties}>
                    <i />
                    ปี {m1Year === 'all' ? 'ปัจจุบัน' : m1Year}
                  </span>
                  <span className="rr-pill st" style={{ '--c': '#cbd5e1' } as React.CSSProperties}>
                    <i />
                    ปี {monthlyServiceData.cmpYr}
                  </span>
                </>
              )}
              <button
                type="button"
                className="rr-pill"
                style={{ '--c': '#e11d48' } as React.CSSProperties}
                aria-pressed={m1ShowLine}
                onClick={() => setM1ShowLine(!m1ShowLine)}
              >
                <i className="ln" />
                บุคลากรที่ร่วมให้บริการ (ท่าน)
              </button>
              {m1Mode === 'yoy' && m1ShowLine && (
                <span className="rr-pill st" style={{ '--c': '#e11d48' } as React.CSSProperties}>
                  <i className="ln ds" />
                  บุคลากร ปี {monthlyServiceData.cmpYr}
                </span>
              )}
            </div>

            <div className="rr-scroller">
              {(() => {
                const W = 1120;
                const isYoy = m1Mode === 'yoy';
                const H = isYoy ? 430 : 355;
                const padL = 64;
                const padR = 64;
                const padT = 30;
                const plotB = 275;
                const plotW = W - padL - padR;
                const plotH = plotB - padT;
                const colW = plotW / 12;

                const curM = monthlyServiceData.cur.months;
                const prevM = monthlyServiceData.prev.months;

                const maxCountRaw = Math.max(
                  4,
                  ...curM.map((m) => (m1Layout === 'grouped' && !isYoy ? Math.max(m.direct, m.expert) : m.total)),
                  ...(isYoy ? prevM.map((m) => m.total) : [0])
                );
                const maxCount = Math.ceil(maxCountRaw * 1.2);

                const maxStaffRaw = Math.max(
                  4,
                  ...curM.map((m) => m.staffCount),
                  ...(isYoy ? prevM.map((m) => m.staffCount) : [0])
                );
                const maxStaff = Math.ceil(maxStaffRaw * 1.25);

                const yTicks = [0, Math.round(maxCount / 3), Math.round((maxCount * 2) / 3), maxCount];
                const yRightTicks = [0, Math.round(maxStaff / 3), Math.round((maxStaff * 2) / 3), maxStaff];

                const curLinePts = curM.map((m, i) => ({
                  x: padL + i * colW + colW / 2,
                  y: plotB - (m.staffCount / maxStaff) * plotH,
                  val: m.staffCount,
                }));
                const prevLinePts = prevM.map((m, i) => ({
                  x: padL + i * colW + colW / 2,
                  y: plotB - (m.staffCount / maxStaff) * plotH,
                  val: m.staffCount,
                }));

                return (
                  <svg className="rr-plot" viewBox={`0 0 ${W} ${H}`}>
                    {/* Grid lines & axes */}
                    {yTicks.map((t, idx) => {
                      const y = plotB - (t / maxCount) * plotH;
                      return (
                        <g key={`grid-${idx}`}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                          <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">
                            {t}
                          </text>
                        </g>
                      );
                    })}
                    {yRightTicks.map((t, idx) => {
                      const y = plotB - (t / maxStaff) * plotH;
                      return (
                        <text
                          key={`rgrid-${idx}`}
                          x={W - padR + 10}
                          y={y + 4}
                          textAnchor="start"
                          fontSize="11"
                          fontWeight="700"
                          fill="#e11d48"
                        >
                          {t}
                        </text>
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
                      จำนวนครั้งที่ให้บริการ (ครั้ง)
                    </text>
                    <text
                      x={W - 14}
                      y={padT + plotH / 2}
                      transform={`rotate(90, ${W - 14}, ${padT + plotH / 2})`}
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="700"
                      fill="#e11d48"
                    >
                      บุคลากร (ท่าน)
                    </text>

                    {/* Columns */}
                    {curM.map((m, i) => {
                      const pm = prevM[i];
                      const cx = padL + i * colW + colW / 2;
                      const isHov = m1HoverIdx === i;

                      return (
                        <g
                          key={`col-${i}`}
                          style={{ cursor: m.items.length > 0 || (isYoy && pm.items.length > 0) ? 'pointer' : 'default' }}
                          onMouseEnter={(e) => {
                            setM1HoverIdx(i);
                            setTip({
                              show: true,
                              x: e.clientX,
                              y: e.clientY,
                              title: `เดือน ${m.label} (${m1Year === 'all' ? 'ทั้งหมด' : `ปี ${m1Year}`})`,
                              color: '#f59e0b',
                              val: `${m.total} ครั้ง • บุคลากร ${m.staffCount} ท่าน`,
                              sub: isYoy
                                ? `ปี ${monthlyServiceData.cmpYr}: ${pm.total} ครั้ง • บุคลากร ${pm.staffCount} ท่าน`
                                : `วิชาการ ${m.direct} ครั้ง • ผู้ทรงคุณวุฒิ ${m.expert} ครั้ง`,
                            });
                          }}
                          onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                          onMouseLeave={() => {
                            setM1HoverIdx(null);
                            setTip((prev) => ({ ...prev, show: false }));
                          }}
                          onClick={() => {
                            const combined = isYoy && m.items.length === 0 ? pm.items : m.items;
                            if (combined.length > 0) {
                              setDrillDown({
                                isOpen: true,
                                title: `งานบริการวิชาการ: เดือน ${m.label}`,
                                subtitle: `รวม ${combined.length} กิจกรรม • บุคลากร ${m.staffCount || pm.staffCount} ท่าน`,
                                accentColor: '#f59e0b',
                                items: combined,
                              });
                            }
                          }}
                        >
                          {/* Hover Column Highlight */}
                          <rect
                            x={padL + i * colW + 4}
                            y={padT - 8}
                            width={colW - 8}
                            height={plotH + 14}
                            rx={10}
                            fill="#0f172a"
                            opacity={isHov ? 0.045 : 0}
                            style={{ transition: 'opacity 0.18s ease' }}
                          />

                          {isYoy ? (
                            (() => {
                              const bw = 20;
                              const gap = 5;
                              const hPrev = (pm.total / maxCount) * plotH;
                              const hCur = (m.total / maxCount) * plotH;
                              const xPrev = cx - bw - gap / 2;
                              const xCur = cx + gap / 2;
                              return (
                                <>
                                  {pm.total > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={xPrev}
                                        y={plotB - hPrev}
                                        width={bw}
                                        height={hPrev}
                                        rx={5}
                                        fill="#cbd5e1"
                                      />
                                      <text
                                        x={xPrev + bw / 2}
                                        y={plotB - hPrev - 6}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontWeight="700"
                                        fill="#64748b"
                                      >
                                        {pm.total}
                                      </text>
                                    </>
                                  )}
                                  {m.total > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={xCur}
                                        y={plotB - hCur}
                                        width={bw}
                                        height={hCur}
                                        rx={5}
                                        fill="#f59e0b"
                                        style={{
                                          filter: isHov ? 'drop-shadow(0 4px 10px rgba(245,158,11,0.35))' : 'none',
                                        }}
                                      />
                                      <text
                                        x={xCur + bw / 2}
                                        y={plotB - hCur - 6}
                                        textAnchor="middle"
                                        fontSize="11.5"
                                        fontWeight="800"
                                        fill="#0f172a"
                                      >
                                        {m.total}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          ) : m1Layout === 'stacked' ? (
                            (() => {
                              const bw = 34;
                              const hDirect = (m.direct / maxCount) * plotH;
                              const hExpert = (m.expert / maxCount) * plotH;
                              const yDirect = plotB - hDirect;
                              const hExpertAdj = Math.max(0, hExpert - (m.direct > 0 ? 1.5 : 0));
                              const yExpert = yDirect - hExpert;
                              return (
                                <>
                                  {m.direct > 0 && (
                                    <g
                                      onMouseEnter={(e) => {
                                        e.stopPropagation();
                                        setM1HoverIdx(i);
                                        const pct = m.total > 0 ? Math.round((m.direct / m.total) * 100) : 0;
                                        setTip({
                                          show: true,
                                          x: e.clientX,
                                          y: e.clientY,
                                          title: `วิชาการ · ${m.label} ${m1Year === 'all' ? '' : m1Year}`,
                                          color: '#f59e0b',
                                          val: `${m.direct} ครั้ง`,
                                          sub: `${pct}% ของเดือนนี้ (${m.total} ครั้ง) • บุคลากร ${m.staffCount} ท่าน`,
                                        });
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (m.directItems.length > 0) {
                                          setDrillDown({
                                            isOpen: true,
                                            title: `งานบริการวิชาการ (วิชาการ): เดือน ${m.label}`,
                                            subtitle: `รวม ${m.directItems.length} กิจกรรม`,
                                            accentColor: '#f59e0b',
                                            items: m.directItems,
                                          });
                                        }
                                      }}
                                    >
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw / 2}
                                        y={yDirect}
                                        width={bw}
                                        height={hDirect}
                                        rx={5}
                                        fill="#f59e0b"
                                        style={{
                                          filter: isHov ? 'drop-shadow(0 4px 10px rgba(245,158,11,0.3))' : 'none',
                                        }}
                                      />
                                      {hDirect >= 15 && (
                                        <text
                                          x={cx}
                                          y={yDirect + hDirect / 2 + 4}
                                          textAnchor="middle"
                                          fontSize="11"
                                          fontWeight="700"
                                          fill="#ffffff"
                                          style={{ pointerEvents: 'none' }}
                                        >
                                          {m.direct}
                                        </text>
                                      )}
                                    </g>
                                  )}
                                  {m.expert > 0 && (
                                    <g
                                      onMouseEnter={(e) => {
                                        e.stopPropagation();
                                        setM1HoverIdx(i);
                                        const pct = m.total > 0 ? Math.round((m.expert / m.total) * 100) : 0;
                                        setTip({
                                          show: true,
                                          x: e.clientX,
                                          y: e.clientY,
                                          title: `ผู้ทรงคุณวุฒิ · ${m.label} ${m1Year === 'all' ? '' : m1Year}`,
                                          color: '#0284c7',
                                          val: `${m.expert} ครั้ง`,
                                          sub: `${pct}% ของเดือนนี้ (${m.total} ครั้ง) • บุคลากร ${m.staffCount} ท่าน`,
                                        });
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (m.expertItems.length > 0) {
                                          setDrillDown({
                                            isOpen: true,
                                            title: `งานบริการวิชาการ (ผู้ทรงคุณวุฒิ): เดือน ${m.label}`,
                                            subtitle: `รวม ${m.expertItems.length} กิจกรรม`,
                                            accentColor: '#0284c7',
                                            items: m.expertItems,
                                          });
                                        }
                                      }}
                                    >
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw / 2}
                                        y={yExpert}
                                        width={bw}
                                        height={hExpertAdj}
                                        rx={5}
                                        fill="#0284c7"
                                        style={{
                                          filter: isHov ? 'drop-shadow(0 4px 10px rgba(2,132,199,0.3))' : 'none',
                                        }}
                                      />
                                      {hExpertAdj >= 15 && (
                                        <text
                                          x={cx}
                                          y={yExpert + hExpertAdj / 2 + 4}
                                          textAnchor="middle"
                                          fontSize="11"
                                          fontWeight="700"
                                          fill="#ffffff"
                                          style={{ pointerEvents: 'none' }}
                                        >
                                          {m.expert}
                                        </text>
                                      )}
                                    </g>
                                  )}
                                  {m.total > 0 && (
                                    <text
                                      x={cx}
                                      y={plotB - ((m.direct + m.expert) / maxCount) * plotH - 7}
                                      textAnchor="middle"
                                      fontSize="12"
                                      fontWeight="800"
                                      fill="#0f172a"
                                    >
                                      {m.total}
                                    </text>
                                  )}
                                </>
                              );
                            })()
                          ) : (
                            (() => {
                              const bw = 18;
                              const gap = 4;
                              const hDirect = (m.direct / maxCount) * plotH;
                              const hExpert = (m.expert / maxCount) * plotH;
                              const xD = cx - bw - gap / 2;
                              const xE = cx + gap / 2;
                              return (
                                <>
                                  {m.direct > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={xD}
                                        y={plotB - hDirect}
                                        width={bw}
                                        height={hDirect}
                                        rx={4}
                                        fill="#f59e0b"
                                      />
                                      <text
                                        x={xD + bw / 2}
                                        y={plotB - hDirect - 5}
                                        textAnchor="middle"
                                        fontSize="10.5"
                                        fontWeight="700"
                                        fill="#b45309"
                                      >
                                        {m.direct}
                                      </text>
                                    </>
                                  )}
                                  {m.expert > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={xE}
                                        y={plotB - hExpert}
                                        width={bw}
                                        height={hExpert}
                                        rx={4}
                                        fill="#0284c7"
                                      />
                                      <text
                                        x={xE + bw / 2}
                                        y={plotB - hExpert - 5}
                                        textAnchor="middle"
                                        fontSize="10.5"
                                        fontWeight="700"
                                        fill="#0369a1"
                                      >
                                        {m.expert}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          )}

                          {/* Month label */}
                          <text
                            x={cx}
                            y={plotB + 22}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight={isHov ? '800' : '700'}
                            fill={isHov ? '#0f172a' : '#334155'}
                          >
                            {m.label}
                          </text>

                          {/* YoY Delta Chips */}
                          {isYoy && (
                            <>
                              {(() => {
                                const d1 = getDeltaInfo(m.total, pm.total);
                                const d2 = getDeltaInfo(m.staffCount, pm.staffCount);
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
                                      x={cx - 26}
                                      y={plotB + 36}
                                      width={52}
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
                                      x={cx - 26}
                                      y={plotB + 64}
                                      width={52}
                                      height={20}
                                      rx={10}
                                      fill={fillMap[d2.cls]}
                                    />
                                    <text
                                      x={cx}
                                      y={plotB + 78}
                                      textAnchor="middle"
                                      fontSize="10"
                                      fontWeight="700"
                                      fill={txtMap[d2.cls]}
                                    >
                                      {d2.label}
                                    </text>
                                  </>
                                );
                              })()}
                            </>
                          )}
                        </g>
                      );
                    })}

                    {isYoy && (
                      <>
                        <text x={padL - 8} y={plotB + 50} textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b">
                          งานบริการ
                        </text>
                        <text x={padL - 8} y={plotB + 78} textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b">
                          บุคลากร
                        </text>
                      </>
                    )}

                    {/* Staff Line Overlay */}
                    {m1ShowLine && isYoy && (
                      <path
                        d={buildSmoothPath(prevLinePts)}
                        fill="none"
                        stroke="#e11d48"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        opacity={0.5}
                        style={{ pointerEvents: 'none' }}
                      />
                    )}
                    {m1ShowLine && (
                      <>
                        <path
                          d={buildSmoothPath(curLinePts)}
                          fill="none"
                          stroke="#e11d48"
                          strokeWidth={2.5}
                          style={{ pointerEvents: 'none' }}
                        />
                        {curLinePts.map((pt, i) =>
                          pt.val > 0 ? (
                            <g key={`lpt-${i}`} style={{ pointerEvents: 'none' }}>
                              <circle cx={pt.x} cy={pt.y} r={4.5} fill="#ffffff" stroke="#e11d48" strokeWidth={2.5} />
                              <rect
                                x={pt.x - 16}
                                y={pt.y - 24}
                                width={32}
                                height={17}
                                rx={8.5}
                                fill="#ffffff"
                                stroke="#e11d48"
                                strokeWidth={1.2}
                              />
                              <text
                                x={pt.x}
                                y={pt.y - 12.5}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="700"
                                fill="#be123c"
                              >
                                {pt.val}
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

            <div className="rr-sum" style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span>
                {m1Year === 'all' ? 'ทุกปีงบประมาณ' : `ปี ${m1Year}`} รวม{' '}
                <b>{monthlyServiceData.cur.totalCount} ครั้ง</b>
              </span>
              <span>
                บุคลากรที่ร่วมให้บริการ <b>{monthlyServiceData.cur.totalStaff} ท่าน</b>
              </span>
              <span className="rr-avg">
                เฉลี่ย{' '}
                {monthlyServiceData.cur.totalStaff > 0
                  ? (monthlyServiceData.cur.totalCount / monthlyServiceData.cur.totalStaff).toFixed(1)
                  : '0'}{' '}
                ครั้ง/ท่าน
              </span>
            </div>
          </div>

          {/* CHART 2: จำนวนงานบริการวิชาการจำแนกตามลักษณะบทบาทหน้าที่ */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaChartBar style={{ color: '#0284c7', marginRight: '8px' }} />
                จำนวนงานบริการวิชาการจำแนกตามลักษณะบทบาทหน้าที่
              </h2>
              <div className="rr-ctrls">
                <YearSelectDropdown
                  label="ปี"
                  value={m2Year}
                  onChange={(v) => {
                    setM2Year(v);
                    if (v !== 'all') setM2CmpYear(getDefaultCompareYear(v, availableYears));
                  }}
                  includeAll={true}
                  allPosition="top"
                />

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={m2Mode === 'single' ? 'on' : ''}
                    onClick={() => setM2Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={m2Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setM2Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                {m2Mode === 'yoy' ? (
                  <YearSelectDropdown
                    label="เทียบกับปี"
                    value={m2CmpYear}
                    onChange={(v) => setM2CmpYear(v)}
                    excludeYear={m2Year}
                    includeAll={false}
                  />
                ) : (
                  <div className="rr-seg-ctl">
                    <button
                      type="button"
                      className={m2Layout === 'grouped' ? 'on' : ''}
                      onClick={() => setM2Layout('grouped')}
                    >
                      แยกแท่ง
                    </button>
                    <button
                      type="button"
                      className={m2Layout === 'stacked' ? 'on' : ''}
                      onClick={() => setM2Layout('stacked')}
                    >
                      แท่งซ้อน
                    </button>
                  </div>
                )}

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={m2Metric === 'count' ? 'on' : ''}
                    onClick={() => setM2Metric('count')}
                  >
                    จำนวนงาน
                  </button>
                  <button
                    type="button"
                    className={m2Metric === 'staff' ? 'on' : ''}
                    onClick={() => setM2Metric('staff')}
                  >
                    บุคลากร (ท่าน)
                  </button>
                  <button
                    type="button"
                    className={m2Metric === 'hours' ? 'on' : ''}
                    onClick={() => setM2Metric('hours')}
                  >
                    ชั่วโมงบริการ
                  </button>
                </div>
              </div>
            </div>

            {m2Mode === 'yoy' && (
              <div className="rr-legend">
                <span className="rr-pill st" style={{ '--c': '#0284c7' } as React.CSSProperties}>
                  <i />
                  ปี {m2Year === 'all' ? 'ปัจจุบัน' : m2Year}
                </span>
                <span className="rr-pill st" style={{ '--c': '#cbd5e1' } as React.CSSProperties}>
                  <i />
                  ปี {roleChartData.cmpYr}
                </span>
              </div>
            )}

            <div className="rr-scroller">
              {(() => {
                const rows = roleChartData.rows;
                const W = 1120;
                const isYoy = m2Mode === 'yoy';
                const H = isYoy ? 380 : 335;
                const padL = 68;
                const padR = 40;
                const padT = 30;
                const plotB = 250;
                const plotW = W - padL - padR;
                const plotH = plotB - padT;
                const n = Math.max(1, rows.length);
                const colW = plotW / n;

                const maxValRaw = Math.max(
                  4,
                  ...rows.map((r) => r.curVal),
                  ...(isYoy ? rows.map((r) => r.prevVal) : [0])
                );
                const maxVal = Math.ceil(maxValRaw * 1.2);
                const yTicks = [0, Math.round(maxVal / 3), Math.round((maxVal * 2) / 3), maxVal];
                const unitTxt = m2Metric === 'staff' ? 'ท่าน' : m2Metric === 'hours' ? 'ชม.' : 'งาน';

                return (
                  <svg className="rr-plot" viewBox={`0 0 ${W} ${H}`}>
                    {yTicks.map((t, idx) => {
                      const y = plotB - (t / maxVal) * plotH;
                      return (
                        <g key={`r2-grid-${idx}`}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                          <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">
                            {t}
                          </text>
                        </g>
                      );
                    })}

                    {rows.map((r, i) => {
                      const cx = padL + i * colW + colW / 2;
                      const isHov = m2HoverIdx === i;
                      const bw = Math.min(44, colW * 0.48);

                      return (
                        <g
                          key={`role-col-${i}`}
                          style={{ cursor: r.items.length > 0 ? 'pointer' : 'default' }}
                          onMouseEnter={(e) => {
                            setM2HoverIdx(i);
                            setTip({
                              show: true,
                              x: e.clientX,
                              y: e.clientY,
                              title: r.label,
                              color: r.color,
                              val: `${r.curVal.toLocaleString()} ${unitTxt}`,
                              sub: `รวม ${r.count} งาน • บุคลากร ${r.staffCount} ท่าน • ${r.hoursSum.toLocaleString()} ชม.`,
                            });
                          }}
                          onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                          onMouseLeave={() => {
                            setM2HoverIdx(null);
                            setTip((prev) => ({ ...prev, show: false }));
                          }}
                          onClick={() => {
                            if (r.items.length > 0) {
                              setDrillDown({
                                isOpen: true,
                                title: `บทบาทหน้าที่: ${r.label}`,
                                subtitle: `รวม ${r.count} งาน • บุคลากร ${r.staffCount} ท่าน`,
                                accentColor: r.color,
                                items: r.items,
                              });
                            }
                          }}
                        >
                          <rect
                            x={padL + i * colW + 6}
                            y={padT - 8}
                            width={colW - 12}
                            height={plotH + 14}
                            rx={10}
                            fill="#0f172a"
                            opacity={isHov ? 0.045 : 0}
                          />

                          {isYoy ? (
                            (() => {
                              const b2 = Math.min(26, colW * 0.28);
                              const gap = 5;
                              const hPrev = (r.prevVal / maxVal) * plotH;
                              const hCur = (r.curVal / maxVal) * plotH;
                              const xP = cx - b2 - gap / 2;
                              const xC = cx + gap / 2;
                              return (
                                <>
                                  {r.prevVal > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={xP}
                                        y={plotB - hPrev}
                                        width={b2}
                                        height={hPrev}
                                        rx={6}
                                        fill="#cbd5e1"
                                      />
                                      <text
                                        x={xP + b2 / 2}
                                        y={plotB - hPrev - 6}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontWeight="700"
                                        fill="#64748b"
                                      >
                                        {r.prevVal}
                                      </text>
                                    </>
                                  )}
                                  {r.curVal > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={xC}
                                        y={plotB - hCur}
                                        width={b2}
                                        height={hCur}
                                        rx={6}
                                        fill={r.color}
                                        style={{
                                          filter: isHov ? `drop-shadow(0 4px 10px ${r.color}66)` : 'none',
                                        }}
                                      />
                                      <text
                                        x={xC + b2 / 2}
                                        y={plotB - hCur - 6}
                                        textAnchor="middle"
                                        fontSize="11.5"
                                        fontWeight="800"
                                        fill="#0f172a"
                                      >
                                        {r.curVal}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          ) : m2Layout === 'grouped' && (r.directVal > 0 && r.expertVal > 0) ? (
                            (() => {
                              const b2 = Math.min(24, colW * 0.26);
                              const gap = 4;
                              const hD = (r.directVal / maxVal) * plotH;
                              const hE = (r.expertVal / maxVal) * plotH;
                              const xD = cx - b2 - gap / 2;
                              const xE = cx + gap / 2;
                              return (
                                <>
                                  <rect
                                    className="rr-rise"
                                    x={xD}
                                    y={plotB - hD}
                                    width={b2}
                                    height={hD}
                                    rx={5}
                                    fill={r.color}
                                  />
                                  <text
                                    x={xD + b2 / 2}
                                    y={plotB - hD - 5}
                                    textAnchor="middle"
                                    fontSize="10.5"
                                    fontWeight="700"
                                    fill={r.color}
                                  >
                                    {r.directVal}
                                  </text>
                                  <rect
                                    className="rr-rise"
                                    x={xE}
                                    y={plotB - hE}
                                    width={b2}
                                    height={hE}
                                    rx={5}
                                    fill="#0284c7"
                                  />
                                  <text
                                    x={xE + b2 / 2}
                                    y={plotB - hE - 5}
                                    textAnchor="middle"
                                    fontSize="10.5"
                                    fontWeight="700"
                                    fill="#0284c7"
                                  >
                                    {r.expertVal}
                                  </text>
                                </>
                              );
                            })()
                          ) : (
                            (() => {
                              const hCur = (r.curVal / maxVal) * plotH;
                              return (
                                <>
                                  {r.curVal > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw / 2}
                                        y={plotB - hCur}
                                        width={bw}
                                        height={hCur}
                                        rx={6}
                                        fill={r.color}
                                        style={{
                                          filter: isHov ? `drop-shadow(0 4px 10px ${r.color}66)` : 'none',
                                        }}
                                      />
                                      {hCur >= 18 && (
                                        <text
                                          x={cx}
                                          y={plotB - hCur / 2 + 4}
                                          textAnchor="middle"
                                          fontSize="11"
                                          fontWeight="700"
                                          fill="#ffffff"
                                          style={{ pointerEvents: 'none' }}
                                        >
                                          {r.curVal}
                                        </text>
                                      )}
                                      <text
                                        x={cx}
                                        y={plotB - hCur - 7}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fontWeight="800"
                                        fill="#0f172a"
                                      >
                                        {r.curVal}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          )}

                          <text
                            x={cx}
                            y={plotB + 22}
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight={isHov ? '800' : '700'}
                            fill="#334155"
                          >
                            {r.shortLabel}
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
        </div>
      )}

      {/* DIMENSION 2: Department */}
      {activePerspective === 'department' && (
        <div className="rr-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CHART 3: เปรียบเทียบจำนวนงานบริการและบุคลากรรายสังกัด */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaBuilding style={{ color: '#f59e0b', marginRight: '8px' }} />
                เปรียบเทียบจำนวนงานบริการและบุคลากรรายสังกัด
              </h2>
              <div className="rr-ctrls">
                <YearSelectDropdown
                  label="ปี"
                  value={m3Year}
                  onChange={(v) => {
                    setM3Year(v);
                    if (v !== 'all') setM3CmpYear(getDefaultCompareYear(v, availableYears));
                  }}
                  includeAll={true}
                  allPosition="top"
                />

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={m3Mode === 'single' ? 'on' : ''}
                    onClick={() => setM3Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={m3Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setM3Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                {m3Mode === 'yoy' ? (
                  <YearSelectDropdown
                    label="เทียบกับปี"
                    value={m3CmpYear}
                    onChange={(v) => setM3CmpYear(v)}
                    excludeYear={m3Year}
                    includeAll={false}
                  />
                ) : (
                  <div className="rr-seg-ctl">
                    <button
                      type="button"
                      className={m3Layout === 'grouped' ? 'on' : ''}
                      onClick={() => setM3Layout('grouped')}
                    >
                      แยกแท่ง
                    </button>
                    <button
                      type="button"
                      className={m3Layout === 'stacked' ? 'on' : ''}
                      onClick={() => setM3Layout('stacked')}
                    >
                      แท่งซ้อน
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rr-legend">
              {m3Layout === 'stacked' && m3Mode === 'single' ? (
                <>
                  <span className="rr-pill st" style={{ '--c': '#f59e0b' } as React.CSSProperties}>
                    <i />
                    วิชาการ
                  </span>
                  <span className="rr-pill st" style={{ '--c': '#0284c7' } as React.CSSProperties}>
                    <i />
                    ผู้ทรงคุณวุฒิ
                  </span>
                </>
              ) : (
                deptComparisonData.m3Rows.map((d) => (
                  <span key={`leg-${d.code}`} className="rr-pill st" style={{ '--c': d.color } as React.CSSProperties}>
                    <i />
                    {d.code}
                  </span>
                ))
              )}
              <button
                type="button"
                className="rr-pill"
                style={{ '--c': '#e11d48' } as React.CSSProperties}
                aria-pressed={m3ShowLine}
                onClick={() => setM3ShowLine((p) => !p)}
              >
                <i className="ln" />
                บุคลากรที่พบในบันทึก (ท่าน)
              </button>
            </div>

            <div className="rr-scroller">
              {(() => {
                const rows = deptComparisonData.m3Rows;
                const isYoy = m3Mode === 'yoy';
                const W = 1120;
                const H = isYoy ? 420 : 350;
                const padL = 64;
                const padR = 64;
                const padT = 30;
                const plotB = 265;
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
                const maxStaffRaw = Math.max(
                  4,
                  ...rows.map((r) => r.staffCount),
                  ...(isYoy ? rows.map((r) => r.prevStaffCount) : [0])
                );
                const maxStaff = Math.ceil(maxStaffRaw * 1.25);

                const yTicks = [0, Math.round(maxCount / 3), Math.round((maxCount * 2) / 3), maxCount];
                const yRightTicks = [0, Math.round(maxStaff / 3), Math.round((maxStaff * 2) / 3), maxStaff];

                const linePts = rows.map((r, i) => ({
                  x: padL + i * colW + colW / 2,
                  y: plotB - (r.staffCount / maxStaff) * plotH,
                  val: r.staffCount,
                }));

                return (
                  <svg className="rr-plot" viewBox={`0 0 ${W} ${H}`}>
                    {yTicks.map((t, idx) => {
                      const y = plotB - (t / maxCount) * plotH;
                      return (
                        <g key={`d3-grid-${idx}`}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                          <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">
                            {t}
                          </text>
                        </g>
                      );
                    })}
                    {yRightTicks.map((t, idx) => {
                      const y = plotB - (t / maxStaff) * plotH;
                      return (
                        <text
                          key={`d3-rgrid-${idx}`}
                          x={W - padR + 10}
                          y={y + 4}
                          textAnchor="start"
                          fontSize="11"
                          fontWeight="700"
                          fill="#e11d48"
                        >
                          {t}
                        </text>
                      );
                    })}

                    {rows.map((r, i) => {
                      const cx = padL + i * colW + colW / 2;
                      const isHov = m3HoverIdx === i;

                      return (
                        <g
                          key={`d3-col-${r.code}`}
                          style={{ cursor: r.items.length > 0 ? 'pointer' : 'default' }}
                          onMouseEnter={(e) => {
                            setM3HoverIdx(i);
                            setTip({
                              show: true,
                              x: e.clientX,
                              y: e.clientY,
                              title: `${r.name} (${r.code})`,
                              color: r.color,
                              val: `${r.count} งานบริการ • บุคลากร ${r.staffCount} ท่าน`,
                              sub: `วิชาการ ${r.directCount} • ผู้ทรงคุณวุฒิ ${r.expertCount} • เฉลี่ย ${r.avg} งาน/ท่าน`,
                            });
                          }}
                          onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                          onMouseLeave={() => {
                            setM3HoverIdx(null);
                            setTip((prev) => ({ ...prev, show: false }));
                          }}
                          onClick={() => {
                            if (r.items.length > 0) {
                              setDrillDown({
                                isOpen: true,
                                title: `งานบริการวิชาการ: สังกัด ${r.name} (${r.code})`,
                                subtitle: `รวม ${r.count} กิจกรรม • บุคลากร ${r.staffCount} ท่าน • เฉลี่ย ${r.avg} งาน/ท่าน`,
                                accentColor: r.color,
                                items: r.items,
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
                                        {r.count}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          ) : m3Layout === 'grouped' ? (
                            (() => {
                              const bw = 24;
                              const gap = 6;
                              const hC = (r.count / maxCount) * plotH;
                              const hS = (r.staffCount / maxCount) * plotH;
                              return (
                                <>
                                  {r.count > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw - gap / 2}
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
                                        x={cx - bw / 2 - gap / 2}
                                        y={plotB - hC - 6}
                                        textAnchor="middle"
                                        fontSize="11.5"
                                        fontWeight="800"
                                        fill="#0f172a"
                                      >
                                        {r.count}
                                      </text>
                                    </>
                                  )}
                                  {r.staffCount > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx + gap / 2}
                                        y={plotB - hS}
                                        width={bw}
                                        height={hS}
                                        rx={6}
                                        fill={r.color}
                                        opacity={0.45}
                                      />
                                      <text
                                        x={cx + bw / 2 + gap / 2}
                                        y={plotB - hS - 6}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fontWeight="700"
                                        fill="#475569"
                                      >
                                        {r.staffCount}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          ) : (
                            (() => {
                              const bw = 42;
                              const hD = (r.directCount / maxCount) * plotH;
                              const hE = (r.expertCount / maxCount) * plotH;
                              const yD = plotB - hD;
                              const hEAdj = Math.max(0, hE - (r.directCount > 0 ? 1.5 : 0));
                              const yE = yD - hE;
                              return (
                                <>
                                  {r.directCount > 0 && (
                                    <g
                                      onMouseEnter={(e) => {
                                        e.stopPropagation();
                                        setM3HoverIdx(i);
                                        setTip({
                                          show: true,
                                          x: e.clientX,
                                          y: e.clientY,
                                          title: `วิชาการ · ${r.name} (${r.code})`,
                                          color: '#f59e0b',
                                          val: `${r.directCount} งานบริการ`,
                                          sub: `${r.count > 0 ? Math.round((r.directCount / r.count) * 100) : 0}% ของสังกัดนี้ (${r.count} งาน)`,
                                        });
                                      }}
                                    >
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw / 2}
                                        y={yD}
                                        width={bw}
                                        height={hD}
                                        rx={6}
                                        fill="#f59e0b"
                                      />
                                      {hD >= 15 && (
                                        <text
                                          x={cx}
                                          y={yD + hD / 2 + 4}
                                          textAnchor="middle"
                                          fontSize="11"
                                          fontWeight="700"
                                          fill="#ffffff"
                                          style={{ pointerEvents: 'none' }}
                                        >
                                          {r.directCount}
                                        </text>
                                      )}
                                    </g>
                                  )}
                                  {r.expertCount > 0 && (
                                    <g
                                      onMouseEnter={(e) => {
                                        e.stopPropagation();
                                        setM3HoverIdx(i);
                                        setTip({
                                          show: true,
                                          x: e.clientX,
                                          y: e.clientY,
                                          title: `ผู้ทรงคุณวุฒิ · ${r.name} (${r.code})`,
                                          color: '#0284c7',
                                          val: `${r.expertCount} งานบริการ`,
                                          sub: `${r.count > 0 ? Math.round((r.expertCount / r.count) * 100) : 0}% ของสังกัดนี้ (${r.count} งาน)`,
                                        });
                                      }}
                                    >
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw / 2}
                                        y={yE}
                                        width={bw}
                                        height={hEAdj}
                                        rx={6}
                                        fill="#0284c7"
                                      />
                                      {hEAdj >= 15 && (
                                        <text
                                          x={cx}
                                          y={yE + hEAdj / 2 + 4}
                                          textAnchor="middle"
                                          fontSize="11"
                                          fontWeight="700"
                                          fill="#ffffff"
                                          style={{ pointerEvents: 'none' }}
                                        >
                                          {r.expertCount}
                                        </text>
                                      )}
                                    </g>
                                  )}
                                  {r.count > 0 && (
                                    <text
                                      x={cx}
                                      y={plotB - ((r.directCount + r.expertCount) / maxCount) * plotH - 7}
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

                          {/* Department pill badge on X axis */}
                          <rect
                            x={cx - 24}
                            y={plotB + 10}
                            width={48}
                            height={22}
                            rx={6}
                            fill={r.color}
                          />
                          <text
                            x={cx}
                            y={plotB + 25}
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight="800"
                            fill="#ffffff"
                          >
                            {r.code}
                          </text>

                          {isYoy && (
                            (() => {
                              const d1 = getDeltaInfo(r.count, r.prevCount);
                              const d2 = getDeltaInfo(r.staffCount, r.prevStaffCount);
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
                                    fill={fillMap[d1.cls]}
                                  />
                                  <text
                                    x={cx}
                                    y={plotB + 56}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="700"
                                    fill={txtMap[d1.cls]}
                                  >
                                    {d1.label}
                                  </text>
                                  <rect
                                    x={cx - 28}
                                    y={plotB + 68}
                                    width={56}
                                    height={20}
                                    rx={10}
                                    fill={fillMap[d2.cls]}
                                  />
                                  <text
                                    x={cx}
                                    y={plotB + 82}
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
                        <text x={padL - 8} y={plotB + 56} textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b">
                          งานบริการ
                        </text>
                        <text x={padL - 8} y={plotB + 82} textAnchor="end" fontSize="11" fontWeight="700" fill="#64748b">
                          บุคลากร
                        </text>
                      </>
                    )}

                    {m3ShowLine && (
                      <>
                        <path
                          d={buildSmoothPath(linePts)}
                          fill="none"
                          stroke="#e11d48"
                          strokeWidth={2.5}
                          style={{ pointerEvents: 'none' }}
                        />
                        {linePts.map((pt, i) =>
                          pt.val > 0 ? (
                            <g key={`d3-lpt-${i}`} style={{ pointerEvents: 'none' }}>
                              <circle cx={pt.x} cy={pt.y} r={4.5} fill="#ffffff" stroke="#e11d48" strokeWidth={2.5} />
                              <rect
                                x={pt.x - 16}
                                y={pt.y - 24}
                                width={32}
                                height={17}
                                rx={8.5}
                                fill="#ffffff"
                                stroke="#e11d48"
                                strokeWidth={1.2}
                              />
                              <text
                                x={pt.x}
                                y={pt.y - 12.5}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="700"
                                fill="#be123c"
                              >
                                {pt.val}
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

          {/* CHART 4: ภาระงานเฉลี่ยต่อบุคลากรที่พบในบันทึก (งาน/ท่าน) */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaBuilding style={{ color: '#f59e0b', marginRight: '8px' }} />
                ภาระงานเฉลี่ยต่อบุคลากรที่พบในบันทึก (งาน/ท่าน)
              </h2>
              <div className="rr-ctrls">
                <YearSelectDropdown
                  label="ปี"
                  value={m4Year}
                  onChange={(v) => {
                    setM4Year(v);
                    if (v !== 'all') setM4CmpYear(getDefaultCompareYear(v, availableYears));
                  }}
                  includeAll={true}
                  allPosition="top"
                />

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={m4Mode === 'single' ? 'on' : ''}
                    onClick={() => setM4Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={m4Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setM4Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                {m4Mode === 'yoy' && (
                  <YearSelectDropdown
                    label="เทียบกับปี"
                    value={m4CmpYear}
                    onChange={(v) => setM4CmpYear(v)}
                    excludeYear={m4Year}
                    includeAll={false}
                  />
                )}

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={m4Metric === 'avg' ? 'on' : ''}
                    onClick={() => setM4Metric('avg')}
                  >
                    ภาระงานเฉลี่ย (งาน/ท่าน)
                  </button>
                  <button
                    type="button"
                    className={m4Metric === 'count' ? 'on' : ''}
                    onClick={() => setM4Metric('count')}
                  >
                    จำนวนงานบริการ
                  </button>
                  <button
                    type="button"
                    className={m4Metric === 'staff' ? 'on' : ''}
                    onClick={() => setM4Metric('staff')}
                  >
                    บุคลากร (ท่าน)
                  </button>
                  <button
                    type="button"
                    className={m4Metric === 'hours' ? 'on' : ''}
                    onClick={() => setM4Metric('hours')}
                  >
                    ชั่วโมงบริการ
                  </button>
                </div>
              </div>
            </div>

            <div className="rr-rows">
              {(() => {
                const rows = deptComparisonData.m4Rows;
                const isYoy = m4Mode === 'yoy';
                const maxVal = Math.max(
                  1,
                  ...rows.map((r) => r.curVal),
                  ...(isYoy ? rows.map((r) => r.prevVal) : [0])
                );
                const unitLabel =
                  m4Metric === 'avg'
                    ? 'งาน/ท่าน'
                    : m4Metric === 'count'
                    ? 'งาน'
                    : m4Metric === 'staff'
                    ? 'ท่าน'
                    : 'ชม.';

                return rows.map((r, idx) => {
                  const pct = Math.min(100, (r.curVal / maxVal) * 100);
                  const prevPct = Math.min(100, (r.prevVal / maxVal) * 100);
                  const delta = getDeltaInfo(r.curVal, r.prevVal);

                  return (
                    <div
                      key={`m4-row-${r.code}`}
                      className={`rr-row ${isYoy ? 'cmp' : ''}`}
                      onMouseEnter={(e) =>
                        setTip({
                          show: true,
                          x: e.clientX,
                          y: e.clientY,
                          title: `${r.name} (${r.code})`,
                          color: r.color,
                          val: `${r.curVal.toLocaleString()} ${unitLabel}`,
                          sub: `งานบริการ ${r.count} งาน • บุคลากร ${r.staffCount} ท่าน • เฉลี่ย ${r.avg} งาน/ท่าน`,
                        })
                      }
                      onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                      onMouseLeave={() => setTip((prev) => ({ ...prev, show: false }))}
                      onClick={() => {
                        if (r.items.length > 0) {
                          setDrillDown({
                            isOpen: true,
                            title: `ภาระงานบริการวิชาการ: ${r.name} (${r.code})`,
                            subtitle: `รวม ${r.count} งาน • บุคลากร ${r.staffCount} ท่าน • เฉลี่ย ${r.avg} งาน/ท่าน`,
                            accentColor: r.color,
                            items: r.items,
                          });
                        }
                      }}
                    >
                      <div className="rr-rk">{idx + 1}</div>
                      <div className="rr-un">
                        <span className="rr-uc" style={{ backgroundColor: r.color }}>
                          {r.code}
                        </span>
                        <div className="rr-ut">
                          <b>{r.name}</b>
                          <small>
                            {r.count} งาน • บุคลากร {r.staffCount} ท่าน
                          </small>
                        </div>
                      </div>
                      <div className="rr-tr">
                        {isYoy && r.prevVal > 0 && (
                          <div className="rr-bar ghost" style={{ width: `${prevPct}%` }} />
                        )}
                        <div
                          className="rr-bar"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: r.color,
                          }}
                        />
                      </div>
                      <div className="rr-vl">
                        <b>
                          {r.curVal.toLocaleString()} {unitLabel}
                        </b>
                        <small>{isYoy ? `ปี ${deptComparisonData.m4CmpYr}: ${r.prevVal} ${unitLabel}` : `เฉลี่ย ${r.avg} งาน/ท่าน`}</small>
                      </div>
                      {isYoy && <div className={`rr-d ${delta.cls}`}>{delta.label}</div>}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 3: Top Service Faculty */}
      {activePerspective === 'faculty' && (
        <div className="rr-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CHART 5: 10 อันดับผู้ให้บริการสูงสุด */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaUserTie style={{ color: '#f59e0b', marginRight: '8px' }} />
                10 อันดับบุคลากรผู้ให้บริการสูงสุด
              </h2>
              <div className="rr-ctrls">
                <YearSelectDropdown
                  label="ปี"
                  value={m5Year}
                  onChange={(v) => {
                    setM5Year(v);
                    if (v !== 'all') setM5CmpYear(getDefaultCompareYear(v, availableYears));
                  }}
                  includeAll={true}
                  allPosition="top"
                />

                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={m5Mode === 'single' ? 'on' : ''}
                    onClick={() => setM5Mode('single')}
                  >
                    ภาพรวม
                  </button>
                  <button
                    type="button"
                    className={m5Mode === 'yoy' ? 'on' : ''}
                    onClick={() => setM5Mode('yoy')}
                  >
                    เปรียบเทียบข้ามปี
                  </button>
                </div>

                {m5Mode === 'yoy' ? (
                  <YearSelectDropdown
                    label="เทียบกับปี"
                    value={m5CmpYear}
                    onChange={(v) => setM5CmpYear(v)}
                    excludeYear={m5Year}
                    includeAll={false}
                  />
                ) : (
                  <div className="rr-seg-ctl">
                    <button
                      type="button"
                      className={m5Layout === 'grouped' ? 'on' : ''}
                      onClick={() => setM5Layout('grouped')}
                    >
                      แยกแท่ง
                    </button>
                    <button
                      type="button"
                      className={m5Layout === 'stacked' ? 'on' : ''}
                      onClick={() => setM5Layout('stacked')}
                    >
                      แท่งซ้อน
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rr-legend">
              <span className="rr-pill st" style={{ '--c': '#f59e0b' } as React.CSSProperties}>
                <i />
                วิชาการ
              </span>
              <span className="rr-pill st" style={{ '--c': '#0284c7' } as React.CSSProperties}>
                <i />
                ผู้ทรงคุณวุฒิ
              </span>
              {m5Mode === 'yoy' && (
                <span className="rr-pill st" style={{ '--c': '#cbd5e1' } as React.CSSProperties}>
                  <i />
                  ปี {facultyChartData.cmpYr}
                </span>
              )}
            </div>

            <div className="rr-scroller">
              {(() => {
                const rows = facultyChartData.top10;
                if (rows.length === 0) {
                  return (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', fontSize: '13.5px' }}>
                      ไม่พบข้อมูลผู้ให้บริการวิชาการในช่วงเวลาที่เลือก
                    </div>
                  );
                }
                const isYoy = m5Mode === 'yoy';
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
                        <g key={`f5-grid-${idx}`}>
                          <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                          <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fontWeight="600" fill="#64748b">
                            {t}
                          </text>
                        </g>
                      );
                    })}

                    {rows.map((r, i) => {
                      const cx = padL + i * colW + colW / 2;
                      const isHov = m5HoverIdx === i;
                      const shortName = r.name.length > 16 ? r.name.slice(0, 15) + '…' : r.name;

                      return (
                        <g
                          key={`f5-col-${r.key}-${i}`}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => {
                            setM5HoverIdx(i);
                            setTip({
                              show: true,
                              x: e.clientX,
                              y: e.clientY,
                              title: `${r.name} (${r.deptCode})`,
                              color: r.color,
                              val: `${r.count} งานบริการ • เครือข่าย ${r.targets.size} แห่ง`,
                              sub: `วิชาการ ${r.directCount} • ผู้ทรงคุณวุฒิ ${r.expertCount} • ${r.hours.toLocaleString()} ชม.`,
                            });
                          }}
                          onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                          onMouseLeave={() => {
                            setM5HoverIdx(null);
                            setTip((prev) => ({ ...prev, show: false }));
                          }}
                          onClick={() => {
                            setDrillDown({
                              isOpen: true,
                              title: `ผู้ให้บริการวิชาการ: ${r.name}`,
                              subtitle: `สังกัด ${r.deptCode} • รวม ${r.count} งาน • เครือข่าย ${r.targets.size} แห่ง`,
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
                          ) : m5Layout === 'grouped' ? (
                            (() => {
                              const bw = 20;
                              const gap = 4;
                              const hD = (r.directCount / maxCount) * plotH;
                              const hE = (r.expertCount / maxCount) * plotH;
                              return (
                                <>
                                  {r.directCount > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw - gap / 2}
                                        y={plotB - hD}
                                        width={bw}
                                        height={hD}
                                        rx={4}
                                        fill="#f59e0b"
                                      />
                                      <text
                                        x={cx - bw / 2 - gap / 2}
                                        y={plotB - hD - 5}
                                        textAnchor="middle"
                                        fontSize="10.5"
                                        fontWeight="700"
                                        fill="#b45309"
                                      >
                                        {r.directCount}
                                      </text>
                                    </>
                                  )}
                                  {r.expertCount > 0 && (
                                    <>
                                      <rect
                                        className="rr-rise"
                                        x={cx + gap / 2}
                                        y={plotB - hE}
                                        width={bw}
                                        height={hE}
                                        rx={4}
                                        fill="#0284c7"
                                      />
                                      <text
                                        x={cx + bw / 2 + gap / 2}
                                        y={plotB - hE - 5}
                                        textAnchor="middle"
                                        fontSize="10.5"
                                        fontWeight="700"
                                        fill="#0369a1"
                                      >
                                        {r.expertCount}
                                      </text>
                                    </>
                                  )}
                                </>
                              );
                            })()
                          ) : (
                            (() => {
                              const bw = 36;
                              const hD = (r.directCount / maxCount) * plotH;
                              const hE = (r.expertCount / maxCount) * plotH;
                              const yD = plotB - hD;
                              const hEAdj = Math.max(0, hE - (r.directCount > 0 ? 1.5 : 0));
                              const yE = yD - hE;
                              return (
                                <>
                                  {r.directCount > 0 && (
                                    <g
                                      onMouseEnter={(e) => {
                                        e.stopPropagation();
                                        setM5HoverIdx(i);
                                        setTip({
                                          show: true,
                                          x: e.clientX,
                                          y: e.clientY,
                                          title: `วิชาการ · ${r.name}`,
                                          color: '#f59e0b',
                                          val: `${r.directCount} งาน`,
                                          sub: `${r.count > 0 ? Math.round((r.directCount / r.count) * 100) : 0}% ของผลงานทั้งหมด (${r.count} งาน)`,
                                        });
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDrillDown({
                                          isOpen: true,
                                          title: `วิชาการ: ${r.name}`,
                                          subtitle: `รวม ${r.directItems.length} งาน`,
                                          accentColor: '#f59e0b',
                                          items: r.directItems,
                                        });
                                      }}
                                    >
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw / 2}
                                        y={yD}
                                        width={bw}
                                        height={hD}
                                        rx={6}
                                        fill="#f59e0b"
                                      />
                                      {hD >= 15 && (
                                        <text
                                          x={cx}
                                          y={yD + hD / 2 + 4}
                                          textAnchor="middle"
                                          fontSize="11"
                                          fontWeight="700"
                                          fill="#ffffff"
                                          style={{ pointerEvents: 'none' }}
                                        >
                                          {r.directCount}
                                        </text>
                                      )}
                                    </g>
                                  )}
                                  {r.expertCount > 0 && (
                                    <g
                                      onMouseEnter={(e) => {
                                        e.stopPropagation();
                                        setM5HoverIdx(i);
                                        setTip({
                                          show: true,
                                          x: e.clientX,
                                          y: e.clientY,
                                          title: `ผู้ทรงคุณวุฒิ · ${r.name}`,
                                          color: '#0284c7',
                                          val: `${r.expertCount} งาน`,
                                          sub: `${r.count > 0 ? Math.round((r.expertCount / r.count) * 100) : 0}% ของผลงานทั้งหมด (${r.count} งาน)`,
                                        });
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDrillDown({
                                          isOpen: true,
                                          title: `ผู้ทรงคุณวุฒิ: ${r.name}`,
                                          subtitle: `รวม ${r.expertItems.length} งาน`,
                                          accentColor: '#0284c7',
                                          items: r.expertItems,
                                        });
                                      }}
                                    >
                                      <rect
                                        className="rr-rise"
                                        x={cx - bw / 2}
                                        y={yE}
                                        width={bw}
                                        height={hEAdj}
                                        rx={6}
                                        fill="#0284c7"
                                      />
                                      {hEAdj >= 15 && (
                                        <text
                                          x={cx}
                                          y={yE + hEAdj / 2 + 4}
                                          textAnchor="middle"
                                          fontSize="11"
                                          fontWeight="700"
                                          fill="#ffffff"
                                          style={{ pointerEvents: 'none' }}
                                        >
                                          {r.expertCount}
                                        </text>
                                      )}
                                    </g>
                                  )}
                                  {r.count > 0 && (
                                    <text
                                      x={cx}
                                      y={plotB - ((r.directCount + r.expertCount) / maxCount) * plotH - 7}
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

          {/* CHART 6: การกระจายภาระงานบุคลากร (Interactive Donut + List) */}
          <div className="rr-card">
            <div className="rr-head">
              <h2 className="rr-title-h2">
                <FaUsers style={{ color: '#0284c7', marginRight: '8px' }} />
                การกระจายภาระงานบุคลากร
              </h2>
              <div className="rr-ctrls">
                <div className="rr-seg-ctl">
                  <button
                    type="button"
                    className={m6DisplayMode === 'count' ? 'on' : ''}
                    onClick={() => setM6DisplayMode('count')}
                  >
                    จำนวนนับ (ท่าน)
                  </button>
                  <button
                    type="button"
                    className={m6DisplayMode === 'pct' ? 'on' : ''}
                    onClick={() => setM6DisplayMode('pct')}
                  >
                    เปอร์เซ็นต์ (%)
                  </button>
                </div>
              </div>
            </div>

            <div className="rr-dn">
              <div className="rr-dw">
                {(() => {
                  const tiers = facultyChartData.tiers;
                  const total = Math.max(1, facultyChartData.totalPeople);
                  const R = 74;
                  const C = 2 * Math.PI * R;
                  let acc = 0;

                  return (
                    <>
                      <svg viewBox="0 0 210 210" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx={105} cy={105} r={R} fill="none" stroke="#f1f5f9" strokeWidth={30} />
                        {tiers.map((t, idx) => {
                          if (t.count <= 0) return null;
                          const frac = t.count / total;
                          const len = frac * C;
                          const offset = -acc * C;
                          acc += frac;
                          const isHov = m6HoverIdx === idx;
                          return (
                            <circle
                              key={`tier-arc-${t.key}`}
                              cx={105}
                              cy={105}
                              r={R}
                              fill="none"
                              stroke={t.color}
                              strokeWidth={isHov ? 36 : 30}
                              strokeDasharray={`${Math.max(0, len - 2)} ${C}`}
                              strokeDashoffset={offset}
                              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
                              onMouseEnter={(e) => {
                                setM6HoverIdx(idx);
                                setTip({
                                  show: true,
                                  x: e.clientX,
                                  y: e.clientY,
                                  title: t.label,
                                  color: t.color,
                                  val: `${t.count} ท่าน (${t.pct}%)`,
                                  sub: `รวม ${t.items.length} กิจกรรมในกลุ่มนี้`,
                                });
                              }}
                              onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                              onMouseLeave={() => {
                                setM6HoverIdx(null);
                                setTip((prev) => ({ ...prev, show: false }));
                              }}
                              onClick={() => {
                                if (t.items.length > 0) {
                                  setDrillDown({
                                    isOpen: true,
                                    title: `กลุ่มภาระงาน: ${t.label}`,
                                    subtitle: `บุคลากร ${t.count} ท่าน • รวม ${t.items.length} งาน`,
                                    accentColor: t.color,
                                    items: t.items,
                                  });
                                }
                              }}
                            />
                          );
                        })}
                      </svg>
                      <div className="rr-dc">
                        <b>{facultyChartData.totalPeople}</b>
                        <small>บุคลากร (ท่าน)</small>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="rr-dl">
                {facultyChartData.tiers.map((t, idx) => {
                  const delta = getDeltaInfo(t.count, t.prevCount);
                  return (
                    <div
                      key={`tier-item-${t.key}`}
                      className={`rr-di ${m5Mode === 'yoy' ? 'cmp' : ''}`}
                      onMouseEnter={(e) => {
                        setM6HoverIdx(idx);
                        setTip({
                          show: true,
                          x: e.clientX,
                          y: e.clientY,
                          title: t.label,
                          color: t.color,
                          val: `${t.count} ท่าน (${t.pct}%)`,
                          sub: `รวม ${t.items.length} กิจกรรม`,
                        });
                      }}
                      onMouseMove={(e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))}
                      onMouseLeave={() => {
                        setM6HoverIdx(null);
                        setTip((prev) => ({ ...prev, show: false }));
                      }}
                      onClick={() => {
                        if (t.items.length > 0) {
                          setDrillDown({
                            isOpen: true,
                            title: `กลุ่มภาระงาน: ${t.label}`,
                            subtitle: `บุคลากร ${t.count} ท่าน • รวม ${t.items.length} งาน`,
                            accentColor: t.color,
                            items: t.items,
                          });
                        }
                      }}
                    >
                      <span className="w-3 h-3 rounded shrink-0 inline-block" style={{ backgroundColor: t.color, minWidth: '12px', minHeight: '12px' }} />
                      <div className="rr-dn-nm">
                        <b>{t.label}</b>
                        <small>รวม {t.items.length} กิจกรรมบริการวิชาการ</small>
                      </div>
                      <div className="rr-dbar">
                        <i style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                      </div>
                      <div className="rr-dp">
                        <b>{m6DisplayMode === 'pct' ? `${t.pct}%` : `${t.count} ท่าน`}</b>
                        <small>{m6DisplayMode === 'pct' ? `${t.count} ท่าน` : `${t.pct}%`}</small>
                      </div>
                      {m5Mode === 'yoy' && <div className={`rr-d ${delta.cls}`}>{delta.label}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Table with Circular Avatar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                รายละเอียด 10 อันดับผู้ให้บริการสูงสุด
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                สรุปจำนวนกิจกรรม เครือข่ายภายนอก และลิงก์เชื่อมโยงไปยังแฟ้มประวัติบุคลากร
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '40px' }}>#</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '64px' }}>รูปภาพประจำตัว</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>บุคลากร</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>สังกัด</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>กิจกรรม</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>เครือข่าย</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '80px' }}>แฟ้ม</th>
                  </tr>
                </thead>
                <tbody>
                  {topServiceFaculty.slice(0, 10).map((s, idx) => (
                    <tr
                      key={`top-fac-${s.person_id || s.name || idx}`}
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                      onClick={() => {
                        setDrillDown({
                          isOpen: true,
                          title: `ผู้ให้บริการวิชาการ: ${s.name}`,
                          subtitle: `สังกัด ${s.dept} • รวม ${s.count} งาน • เครือข่าย ${s.targets.size} แห่ง`,
                          accentColor: '#f59e0b',
                          items: s.items,
                        });
                      }}
                    >
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: idx < 3 ? '#b45309' : '#64748b' }}>
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
                            src={resolvePersonAvatar(s.person_id, s.name)}
                            alt={s.name}
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
                        {s.name}
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <DepartmentBadge value={s.dept} />
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#fffbeb', color: '#d97706' }}>
                          {s.count} งาน
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: '#475569' }}>
                        {s.targets.size} แห่ง
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const targetId = s.person_id || matchPerson(s.name)?.id || matchPerson(s.name)?._id || matchPerson(s.name)?.person_id;
                            if (targetId) router.push(`/personnel/${targetId}`);
                            else router.push(`/personnel?q=${encodeURIComponent(s.name)}`);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#b45309',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>ดูผลงาน</span>
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
          items={validData}
          categoryKey="service"
          missionTitle="งานบริการวิชาการ"
          unitLabel="กิจกรรม"
          showBudget={true}
        />
          </div>

          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaLeaf style={{ color: '#f59e0b', marginRight: '6px' }} /> การขับเคลื่อนยุทธศาสตร์ ISEE (มก.)
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>
              บทบาทงานบริการวิชาการมุ่งเน้นยุทธศาสตร์ S (Social Responsibility) สร้าง Impact สู่ 232 เครือข่ายภายนอก
            </p>
            <div className="chart-wrapper">
              <canvas id="c_sv_isee_iam" />
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
        categoryKey="service"
      />
    </div>
  );
}
