'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartLine,
  FaChartPie,
  FaAward,
  FaBuilding,
  FaUserTie,
  FaBookOpen,
  FaLeaf,
  FaChevronRight,
} from 'react-icons/fa';
import '../../research/_components/research-redesign.css';
import { PublicationItem } from '../_hooks/usePublicationsData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { autoDetectJournalRanking, JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';
import { CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';
import { PublicationsMonthlyChart } from './PublicationsMonthlyChart';
import { YearSelectDropdown } from '@/components/ui/YearSelectDropdown';
import { STANDARD_YEAR_OPTIONS, getDefaultCompareYear } from '@/lib/fiscalYears';
import { resolveItemFiscalYear } from '@/types/timeFilter';
import { isTestRecord } from '@/lib/sdgEngine';
import { resolvePersonAvatar, matchPerson } from '@/lib/personnelService';

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

function resolvePubDeptCode(rawDept: unknown, rawCode?: unknown): string {
  const cStr = String(rawCode || '').trim().toUpperCase();
  if (cStr === 'IRE' || cStr === 'IRRE') return 'IRRE';
  if (cStr === 'DWT' || cStr === 'TDW' || cStr === 'TDWCB') return 'TDWCB';
  if (UCOL[cStr] && cStr !== 'OTH') return cStr;

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

function resolvePubYear(item: PublicationItem): string {
  if (item.fiscal_year_be) {
    const fy = String(item.fiscal_year_be).trim();
    if (/^25(6[6-9]|7\d)$/.test(fy)) return fy;
  }
  const fy = resolveItemFiscalYear(item, 'publications');
  if (fy && /^25(6[6-9]|7\d)$/.test(fy)) return fy;
  return '2568';
}

interface PublicationsChartsProps {
  validData: PublicationItem[];
  allItems?: PublicationItem[];
  currentFiscalYear?: string;
  onSelectDept?: (deptCode: string) => void;
  onSelectLevel?: (levelKey: string) => void;
  activePerspective?: PubPerspective;
  onChangePerspective?: (persp: PubPerspective) => void;
  hideSelector?: boolean;
}

export type PubPerspective = 'timeline' | 'quartile_tci' | 'department' | 'faculty' | 'journals' | 'sdg' | 'table';

/** Main journal tiers shown in the quartile donut, in display order. */
const MAIN_PUB_TIERS = [
  { key: 'Q1', label: 'Q1', color: '#9F1239', border: '#881337' },
  { key: 'Q2', label: 'Q2', color: '#E11D48', border: '#BE123C' },
  { key: 'Q3', label: 'Q3', color: '#FB7185', border: '#F43F5E' },
  { key: 'Q4', label: 'Q4', color: '#FECDD3', border: '#FDA4AF' },
  { key: 'TCI 1', label: 'TCI 1', color: '#4338CA', border: '#3730A3' },
  { key: 'TCI 2', label: 'TCI 2', color: '#818CF8', border: '#6366F1' },
] as const;

export function PublicationsCharts({
  validData,
  allItems,
  currentFiscalYear,
  onSelectDept,
  onSelectLevel,
  activePerspective: propPerspective,
  onChangePerspective,
  hideSelector = false,
}: PublicationsChartsProps) {
  const router = useRouter();
  const [internalPerspective, setInternalPerspective] = useState<PubPerspective>('timeline');
  const activePerspective = propPerspective ?? internalPerspective;
  const setActivePerspective = onChangePerspective ?? setInternalPerspective;
  const [pubCountMode, setPubCountMode] = useState<'total' | 'tier'>('tier');
  const chartInstances = useRef<Chart[]>([]);
  const hasChartData = validData.length > 0;

  // Department Redesign Controls & States
  const baseAllPubs = useMemo(() => {
    const raw = allItems && allItems.length > 0 ? allItems : validData;
    return raw.filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && !isTestRecord(item));
  }, [allItems, validData]);

  const availableYears = useMemo(() => {
    return Array.from(STANDARD_YEAR_OPTIONS);
  }, []);

  const [deptYear, setDeptYear] = useState<string>(() => {
    if (currentFiscalYear && (currentFiscalYear === 'all' || availableYears.includes(currentFiscalYear))) {
      return currentFiscalYear;
    }
    return availableYears[0] || '2569';
  });

  const [deptCmpYear, setDeptCmpYear] = useState<string>(() => {
    return getDefaultCompareYear(deptYear, availableYears);
  });

  useEffect(() => {
    if (currentFiscalYear && (currentFiscalYear === 'all' || availableYears.includes(currentFiscalYear))) {
      setDeptYear(currentFiscalYear);
    }
  }, [currentFiscalYear, availableYears]);

  const [deptIsCompare, setDeptIsCompare] = useState<boolean>(false);
  const [deptBarMode, setDeptBarMode] = useState<'group' | 'stack'>('stack');
  const [deptMetric, setDeptMetric] = useState<'total' | 'q12' | 'tci' | 'budget'>('total');
  const [activeDeptCol, setActiveDeptCol] = useState<number | null>(null);
  const [activeDeptSeg, setActiveDeptSeg] = useState<string | null>(null);

  const [facultyBarMode, setFacultyBarMode] = useState<'group' | 'stack'>('stack');
  const [facultyMetric, setFacultyMetric] = useState<'total' | 'q12' | 'budget'>('total');
  const [activeFacultyCol, setActiveFacultyCol] = useState<number | null>(null);
  const [activeFacultySeg, setActiveFacultySeg] = useState<string | null>(null);

  const [tip, setTip] = useState<{ show: boolean; x: number; y: number; content: React.ReactNode }>({
    show: false,
    x: 0,
    y: 0,
    content: null,
  });
  const deptScrollerRef = useRef<HTMLDivElement>(null);
  const [deptPlotWidth, setDeptPlotWidth] = useState<number>(1060);

  useEffect(() => {
    const updateW = () => {
      if (deptScrollerRef.current) setDeptPlotWidth(Math.max(760, deptScrollerRef.current.clientWidth));
    };
    updateW();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateW) : null;
    if (ro && deptScrollerRef.current) ro.observe(deptScrollerRef.current);
    window.addEventListener('resize', updateW);
    return () => {
      window.removeEventListener('resize', updateW);
      ro?.disconnect();
    };
  }, [activePerspective]);
  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    items: PublicationItem[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#2e7d32',
    items: [],
  });

  // Calculate top publishing authors (แยกระดับ Q1, Q2, Q3, Q4, TCI 1, TCI 2 ทุกอันแยกกัน)
  const topAuthorsRanking = useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        person_id?: number | string;
        dept: string;
        count: number;
        q1: number;
        q2: number;
        q3: number;
        q4: number;
        tci1: number;
        tci2: number;
        budget: number;
        items: PublicationItem[];
      }
    > = {};
    validData.forEach((item) => {
      const ownerName = String(item.owner || '').trim();
      if (!ownerName || ownerName === '-' || ownerName === 'nan') return;

      const matched = matchPerson(ownerName);
      const pId = item.person_id || item.owner_id || matched?.id || matched?._id || matched?.person_id;
      const key = pId ? `id_${pId}` : ownerName;
      if (!map[key]) {
        map[key] = {
          name: ownerName,
          person_id: pId,
          dept: item.department || '-',
          count: 0,
          q1: 0,
          q2: 0,
          q3: 0,
          q4: 0,
          tci1: 0,
          tci2: 0,
          budget: 0,
          items: [],
        };
      }
      const tier = item._detectedTier || autoDetectJournalRanking(item.journal || '', `${item.level || ''} ${item.remarks || ''}`);
      map[key].count++;
      if (tier === 'Q1') map[key].q1++;
      else if (tier === 'Q2') map[key].q2++;
      else if (tier === 'Q3') map[key].q3++;
      else if (tier === 'Q4') map[key].q4++;
      else if (tier === 'TCI 1') map[key].tci1++;
      else if (tier === 'TCI 2') map[key].tci2++;
      map[key].budget += Number(item.budget) || 0;
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.count - a.count || b.q1 - a.q1 || b.q2 - a.q2);
  }, [validData]);

  // Calculate top journals
  const topJournalsRanking = useMemo(() => {
    const map: Record<string, { journal: string; count: number; tier: string; items: PublicationItem[] }> = {};
    validData.forEach((item) => {
      const jName = String(item.journal || '').trim();
      if (!jName || jName === '-' || jName === 'nan') return;
      if (!map[jName]) {
        const tier = autoDetectJournalRanking(jName, item.level || '');
        map[jName] = { journal: jName, count: 0, tier, items: [] };
      }
      map[jName].count++;
      map[jName].items.push(item);
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [validData]);

  // Tier summary rendered beside the donut so the wide card carries useful detail.
  const levelSummary = useMemo(() => {
    const counts = new Map<string, number>(MAIN_PUB_TIERS.map((tier) => [tier.key, 0]));
    validData.forEach((item) => {
      const tier = item._detectedTier || autoDetectJournalRanking(item.journal || '', `${item.level || ''} ${item.remarks || ''}`);
      if (counts.has(tier)) counts.set(tier, (counts.get(tier) || 0) + 1);
    });
    const total = MAIN_PUB_TIERS.reduce((sum, tier) => sum + (counts.get(tier.key) || 0), 0);
    const topTwo = (counts.get('Q1') || 0) + (counts.get('Q2') || 0);
    return {
      total,
      topTwo,
      topTwoPct: total > 0 ? Math.round((topTwo / total) * 100) : 0,
      rows: MAIN_PUB_TIERS.map((tier) => {
        const count = counts.get(tier.key) || 0;
        return { ...tier, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 };
      }),
    };
  }, [validData]);

  // Qualitative Department Pastel Palette (Soft, high-contrast, WCAG AAA compliant)
  const DEPT_PASTEL_PALETTE = useMemo(
    () => [
      { fill: '#93C5FD', border: '#3B82F6' }, // 1. Soft Sky Blue
      { fill: '#86EFAC', border: '#22C55E' }, // 2. Soft Mint Emerald
      { fill: '#FDE68A', border: '#F59E0B' }, // 3. Soft Amber Peach
      { fill: '#DDD6FE', border: '#8B5CF6' }, // 4. Soft Lavender Violet
      { fill: '#FDA4AF', border: '#F43F5E' }, // 5. Soft Rose Coral
      { fill: '#99F6E4', border: '#0D9488' }, // 6. Soft Aqua Teal
      { fill: '#FED7AA', border: '#F97316' }, // 7. Soft Apricot Orange
      { fill: '#C7D2FE', border: '#6366F1' }, // 8. Soft Periwinkle Indigo
      { fill: '#F5D0FE', border: '#C026D3' }, // 9. Soft Orchid Pink
      { fill: '#E2E8F0', border: '#94A3B8' }, // 10. Soft Slate Gray
    ],
    []
  );

  const deptMetrics = useMemo(() => {
    const map: Record<
      string,
      { code: string; name: string; count: number; q1Count: number; budget: number; items: PublicationItem[] }
    > = {};
    validData.forEach((item) => {
      const budget = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      const detectedTier = String(item._detectedTier || autoDetectJournalRanking(item.journal || '', `${item.level || ''} ${item.remarks || ''}`));
      const d = getDepartment(item.department);
      const code = d.code !== '-' ? d.code : 'OTH';
      if (!map[code]) {
        map[code] = { code, name: d.name, count: 0, q1Count: 0, budget: 0, items: [] };
      }
      map[code].count++;
      map[code].budget += budget;
      if (detectedTier === 'Q1' || detectedTier === 'Q2') {
        map[code].q1Count++;
      }
      map[code].items.push(item);
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [validData]);

  const deptPastelColorMap = useMemo(() => {
    const map = new Map<string, { fill: string; border: string }>();
    deptMetrics.forEach((d, i) => {
      map.set(d.code, DEPT_PASTEL_PALETTE[i % DEPT_PASTEL_PALETTE.length]);
    });
    return map;
  }, [deptMetrics, DEPT_PASTEL_PALETTE]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_PUB = CHART_PASTEL_PALETTE.missions.publications.border;
    const TIER_COLORS = [
      '#86EFAC', // Q1
      '#93C5FD', // Q2
      '#FED7AA', // Q3
      '#FDA4AF', // Q4
      '#DDD6FE', // TCI 1
      '#C7D2FE', // TCI 2
      '#99F6E4', // Conf
      '#CBD5E1', // Other
    ];
    const TIER_BORDERS = [
      '#059669',
      '#2563EB',
      '#EA580C',
      '#E11D48',
      '#7C3AED',
      '#4F46E5',
      '#0D9488',
      '#64748B',
    ];

    const MONTH_LABELS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthBuckets: Record<
      string,
      { label: string; count: number; budget: number; tiers: Record<string, number>; items: PublicationItem[] }
    > = {};
    const levelGroups: Record<string, { label: string; count: number; items: PublicationItem[]; color: string; border: string }> = {
      'Q1': { label: 'Q1', count: 0, items: [], color: '#9F1239', border: '#881337' },
      'Q2': { label: 'Q2', count: 0, items: [], color: '#E11D48', border: '#BE123C' },
      'Q3': { label: 'Q3', count: 0, items: [], color: '#FB7185', border: '#F43F5E' },
      'Q4': { label: 'Q4', count: 0, items: [], color: '#FECDD3', border: '#FDA4AF' },
      'TCI 1': { label: 'TCI 1', count: 0, items: [], color: '#4338CA', border: '#3730A3' },
      'TCI 2': { label: 'TCI 2', count: 0, items: [], color: '#818CF8', border: '#6366F1' },
      'ประชุมวิชาการ': { label: 'การประชุมวิชาการ', count: 0, items: [], color: '#C7D2FE', border: '#818CF8' },
      'อื่นๆ': { label: 'อื่นๆ', count: 0, items: [], color: '#E2E8F0', border: '#94A3B8' },
    };

    const deptGroups: Record<
      string,
      { code: string; name: string; count: number; q1Count: number; budget: number; items: PublicationItem[] }
    > = {};

    validData.forEach((item) => {
      const budget = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      const detectedTier = String(item._detectedTier || autoDetectJournalRanking(item.journal || '', `${item.level || ''} ${item.remarks || ''}`));
      const lvl = String(item.level || '');
      const monthYear = String(item.month_year || '').trim();
      const monthYearMatch = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(monthYear);
      const mKey = monthYearMatch ? monthYear : null;

      let tierKey = 'อื่นๆ';
      if (detectedTier === 'Q1') tierKey = 'Q1';
      else if (detectedTier === 'Q2') tierKey = 'Q2';
      else if (detectedTier === 'Q3') tierKey = 'Q3';
      else if (detectedTier === 'Q4') tierKey = 'Q4';
      else if (detectedTier === 'TCI 1') tierKey = 'TCI 1';
      else if (detectedTier === 'TCI 2') tierKey = 'TCI 2';
      else if (detectedTier.includes('Conference') || detectedTier.includes('ประชุม') || lvl.includes('ประชุม')) tierKey = 'ประชุมวิชาการ';
      else tierKey = 'อื่นๆ';

      if (mKey) {
        if (!monthBuckets[mKey]) {
          const year = Number(monthYearMatch![1]);
          const monthIndex = Number(monthYearMatch![2]) - 1;
          monthBuckets[mKey] = {
            label: `${MONTH_LABELS[monthIndex]} ${year + 543}`,
            count: 0,
            budget: 0,
            tiers: {},
            items: [],
          };
        }
        monthBuckets[mKey].count++;
        monthBuckets[mKey].budget += budget;
        monthBuckets[mKey].tiers[tierKey] = (monthBuckets[mKey].tiers[tierKey] || 0) + 1;
        monthBuckets[mKey].items.push(item);
      }

      if (levelGroups[tierKey]) {
        levelGroups[tierKey].count++;
        levelGroups[tierKey].items.push(item);
      } else {
        levelGroups['อื่นๆ'].count++;
        levelGroups['อื่นๆ'].items.push(item);
      }

      const d = getDepartment(item.department);
      const code = d.code !== '-' ? d.code : 'OTH';
      if (!deptGroups[code]) {
        deptGroups[code] = { code, name: d.name, count: 0, q1Count: 0, budget: 0, items: [] };
      }
      deptGroups[code].count++;
      deptGroups[code].budget += budget;
      if (detectedTier === 'Q1' || detectedTier === 'Q2') {
        deptGroups[code].q1Count++;
      }
      deptGroups[code].items.push(item);
    });

    const periodKeys = Object.keys(monthBuckets).sort();
    const periodLabels = periodKeys.map((key) => monthBuckets[key].label);

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

    if (activePerspective === 'quartile_tci') {
      // 2. Level Doughnut (แสดง Q1, Q2, Q3, Q4, TCI 1, TCI 2 แยกกันทุกอัน)
      const mainTierKeys = ['Q1', 'Q2', 'Q3', 'Q4', 'TCI 1', 'TCI 2'];
      const activeLevels = mainTierKeys.map((k) => levelGroups[k]).filter(Boolean);
      createChart('c_pub_level', {
        type: 'doughnut',
        data: {
          labels: activeLevels.map((g) => `${g.label} (${g.count})`),
          datasets: [
            {
              data: activeLevels.map((g) => g.count),
              backgroundColor: activeLevels.map((g) => g.color),
              borderColor: activeLevels.map((g) => g.border),
              borderWidth: 1.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) {
              const grp = activeLevels[hit.index];
              if (grp && grp.count > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `ผลงานตีพิมพ์: ระดับ ${grp.label}`,
                  subtitle: `รวมทั้งสิ้น ${grp.count} เรื่อง`,
                  accentColor: grp.color,
                  items: grp.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              color: '#ffffff',
              font: { weight: 'bold', size: 14 },
              formatter: (v: number) => (v > 0 ? String(v) : ''),
            },
          },
        },
      });
    }

    if (activePerspective === 'department') {
      createChart('c_pub_dept', {
        type: 'bar',
        data: {
          labels: deptMetrics.map((d) => d.code),
          datasets: [
            {
              label: 'ผลงานตีพิมพ์ทั้งหมด (เรื่อง)',
              data: deptMetrics.map((d) => d.count),
              backgroundColor: deptMetrics.map(
                (d) => (deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).fill
              ),
              borderColor: deptMetrics.map(
                (d) => (deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).border
              ),
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'y');
            if (hit) {
              const d = deptMetrics[hit.index];
              if (d) {
                if (onSelectDept) onSelectDept(d.code);
                const averageSupport = d.count > 0 ? d.budget / d.count : null;
                setDrillDown({
                  isOpen: true,
                  title: `ผลงานตีพิมพ์: สังกัด ${d.name} (${d.code})`,
                  subtitle: `รวม ${d.count} เรื่อง • Q1/Q2: ${d.q1Count} เรื่อง • เงินสนับสนุน ${d.budget.toLocaleString('th-TH')} บาท • เฉลี่ย ${averageSupport === null ? '—' : `${averageSupport.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/เรื่อง`}`,
                  accentColor: (deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).border,
                  items: d.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const d = deptMetrics[context.dataIndex];
                  if (!d) return '';
                  const averageSupport = d.count > 0 ? d.budget / d.count : null;
                  return [
                    `ผลงานรวม: ${d.count} เรื่อง`,
                    `ระดับ Q1/Q2: ${d.q1Count} เรื่อง (${d.count > 0 ? Math.round((d.q1Count / d.count) * 100) : 0}%)`,
                    `เงินสนับสนุน: ${d.budget.toLocaleString('th-TH')} บาท`,
                    `เฉลี่ย: ${averageSupport === null ? '—' : `${averageSupport.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/เรื่อง`}`,
                  ];
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number, ctx: any) => {
                const d = deptMetrics[ctx.dataIndex];
                return `${v} เรื่อง (Q1/Q2: ${d?.q1Count || 0})`;
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '25%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: {
                display: true,
                text: 'จำนวนผลงาน (เรื่อง)',
                font: { size: 13.5, weight: 700 },
              },
              ticks: { font: { size: 12.5 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 13.5, weight: 600 } },
            },
          },
        },
      });
    }

    if (activePerspective === 'faculty') {
      const top10Authors = topAuthorsRanking.slice(0, 10);
      createChart('c_pub_faculty_top10', {
        type: 'bar',
        data: {
          labels: top10Authors.map((a) => {
            const clean = a.name.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
            return clean.length > 22 ? clean.substring(0, 20) + '...' : clean;
          }),
          datasets: [
            {
              label: 'ผลงานตีพิมพ์รวม (เรื่อง)',
              data: top10Authors.map((a) => a.count),
              backgroundColor: CHART_PASTEL_PALETTE.missions.publications.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.publications.border,
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'y');
            if (hit) {
              const a = top10Authors[hit.index];
              if (a) {
                setDrillDown({
                  isOpen: true,
                  title: `ผลงานตีพิมพ์: ${a.name} (${a.dept})`,
                  subtitle: `รวม ${a.count} เรื่อง • Q1: ${a.q1} • Q2: ${a.q2} • Q3: ${a.q3} • Q4: ${a.q4} • TCI: ${a.tci1 + a.tci2} • เงินสนับสนุนรวม ${a.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: CHART_PASTEL_PALETTE.missions.publications.border,
                  items: a.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const a = top10Authors[idx];
                  return a ? `อาจารย์/นักวิจัย: ${a.name} (${a.dept})` : '';
                },
                label: (context: any) => {
                  const a = top10Authors[context.dataIndex];
                  if (!a) return '';
                  return [
                    `ผลงานรวม: ${a.count} เรื่อง`,
                    `Q1: ${a.q1} • Q2: ${a.q2} • Q3: ${a.q3} • Q4: ${a.q4}`,
                    `TCI 1: ${a.tci1} • TCI 2: ${a.tci2}`,
                    `เงินสนับสนุนรวม: ${a.budget.toLocaleString('th-TH')} บาท`,
                  ];
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number, ctx: any) => {
                const a = top10Authors[ctx.dataIndex];
                const topTier = (a?.q1 || 0) + (a?.q2 || 0);
                return `${v} เรื่อง (Q1/Q2: ${topTier})`;
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '25%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: {
                display: true,
                text: 'จำนวนผลงาน (เรื่อง)',
                font: { size: 13.5, weight: 700 },
              },
              ticks: { font: { size: 12.5 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 13.5, weight: 600 } },
            },
          },
        },
      });
    }

    if (activePerspective === 'journals') {
      const top10Journals = topJournalsRanking.slice(0, 10);
      createChart('c_pub_journals_top10', {
        type: 'bar',
        data: {
          labels: top10Journals.map((j) => {
            const clean = j.journal.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
            return clean.length > 28 ? clean.substring(0, 26) + '...' : clean;
          }),
          datasets: [
            {
              label: 'จำนวนผลงาน (เรื่อง)',
              data: top10Journals.map((j) => j.count),
              backgroundColor: top10Journals.map((j) => {
                const tier = j.tier;
                if (tier === 'Q1') return '#86EFAC';
                if (tier === 'Q2') return '#93C5FD';
                if (tier === 'Q3') return '#FDE68A';
                if (tier === 'Q4') return '#FED7AA';
                if (tier === 'TCI 1') return '#DDD6FE';
                if (tier === 'TCI 2') return '#F5D0FE';
                return '#E2E8F0';
              }),
              borderColor: top10Journals.map((j) => {
                const tier = j.tier;
                if (tier === 'Q1') return '#22C55E';
                if (tier === 'Q2') return '#3B82F6';
                if (tier === 'Q3') return '#F59E0B';
                if (tier === 'Q4') return '#F97316';
                if (tier === 'TCI 1') return '#8B5CF6';
                if (tier === 'TCI 2') return '#C026D3';
                return '#94A3B8';
              }),
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'y');
            if (hit) {
              const j = top10Journals[hit.index];
              if (j) {
                setDrillDown({
                  isOpen: true,
                  title: `ผลงานตีพิมพ์: ${j.journal}`,
                  subtitle: `ระดับ ${j.tier} • รวม ${j.count} เรื่อง`,
                  accentColor: JOURNAL_TIER_STYLES[j.tier]?.text || '#F43F5E',
                  items: j.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const j = top10Journals[idx];
                  return j ? j.journal : '';
                },
                label: (context: any) => {
                  const j = top10Journals[context.dataIndex];
                  if (!j) return '';
                  return [`ระดับ: ${j.tier}`, `จำนวนผลงาน: ${j.count} เรื่อง`];
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number, ctx: any) => {
                const j = top10Journals[ctx.dataIndex];
                return `${v} เรื่อง (${j?.tier || '-'})`;
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '25%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: {
                display: true,
                text: 'จำนวนผลงาน (เรื่อง)',
                font: { size: 13.5, weight: 700 },
              },
              ticks: { font: { size: 12.5 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 13.5, weight: 600 } },
            },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [
    validData,
    activePerspective,
    pubCountMode,
    deptMetrics,
    deptPastelColorMap,
    topAuthorsRanking,
    topJournalsRanking,
    onSelectDept,
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            

      {/* DIMENSION 1: Timeline */}
      {activePerspective === 'timeline' && (
        <div style={{ width: '100%' }}>
          <PublicationsMonthlyChart
            validData={allItems && allItems.length > 0 ? allItems : validData}
            currentFiscalYear={currentFiscalYear}
            onSelectPeriod={(monthIdx, year, items) => {
              if (!items || items.length === 0) return;
              const MONTH_LABELS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
              const budget = items.reduce((s, it) => s + (Number(it.budget) || 0), 0);
              const avg = budget / items.length;
              const yearLabel = year === 0 ? 'ทุกปีงบประมาณ' : 'ปี ' + year;
              setDrillDown({
                isOpen: true,
                title: 'ผลงานตีพิมพ์ทางวิชาการ: ' + MONTH_LABELS[monthIdx] + ' (' + yearLabel + ')',
                subtitle: `รวม ${items.length} เรื่อง • เงินสนับสนุน ${budget.toLocaleString('th-TH')} บาท • เฉลี่ย ${avg.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/เรื่อง`,
                accentColor: '#16a34a',
                items,
              });
            }}
          />
        </div>
      )}

      {/* DIMENSION 1.5: Dedicated Quartile & TCI */}
      {activePerspective === 'quartile_tci' && (
        <div className="chart-card">
            <h3>
              <FaChartPie style={{ color: '#E11D48' }} /> สัดส่วนผลงานตามระดับฐานข้อมูลวารสาร
            </h3>
            <div className="pub-level-layout">
              <div className="chart-wrapper" style={{ position: 'relative', height: '360px' }}>
                <canvas id="c_pub_level" />
                {!hasChartData && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.86)',
                      color: '#64748b',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    ไม่พบข้อมูลผลงานตีพิมพ์ในช่วงเวลาที่เลือก
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '34px',
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {levelSummary.total.toLocaleString('th-TH')}
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>เรื่อง</span>
                  </div>
                  
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {levelSummary.rows.map((row) => (
                    <div
                      key={row.key}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '56px minmax(0, 1fr) 44px 44px',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: '#334155',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            backgroundColor: row.color,
                            border: `1px solid ${row.border}`,
                            boxSizing: 'border-box',
                            flexShrink: 0,
                          }}
                        />
                        {row.label}
                      </span>
                      <span
                        style={{
                          height: 10,
                          borderRadius: 999,
                          backgroundColor: '#eef2f7',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            height: '100%',
                            width: `${row.pct}%`,
                            minWidth: row.count > 0 ? 6 : 0,
                            borderRadius: 999,
                            backgroundColor: row.color,
                            border: `1px solid ${row.border}`,
                            boxSizing: 'border-box',
                          }}
                        />
                      </span>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0f172a',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {row.count}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#64748b',
                          textAlign: 'right',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {row.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      )}

      {/* DIMENSION 2: Department (Redesign style matching /research) */}
      {activePerspective === 'department' && (() => {
        const computePubDeptByYear = (yr: string) => {
          const map: Record<
            string,
            {
              code: string;
              name: string;
              total: number;
              q12: number;
              q34: number;
              tci: number;
              intl: number;
              budget: number;
              items: PublicationItem[];
              intlItems: PublicationItem[];
              tciItems: PublicationItem[];
            }
          > = {};
          const codes = ['AE', 'IE', 'FE', 'IRRE', 'ME', 'CE', 'CPE', 'EEEC', 'TDWCB'];
          codes.forEach((c) => {
            map[c] = {
              code: c,
              name: UFULL[c] || c,
              total: 0,
              q12: 0,
              q34: 0,
              tci: 0,
              intl: 0,
              budget: 0,
              items: [],
              intlItems: [],
              tciItems: [],
            };
          });

          baseAllPubs.forEach((it) => {
            if (yr !== 'all' && resolvePubYear(it) !== yr) return;
            const c = resolvePubDeptCode(it.department, (it as any).departmentCode);
            if (!map[c]) {
              map[c] = {
                code: c,
                name: UFULL[c] || c,
                total: 0,
                q12: 0,
                q34: 0,
                tci: 0,
                intl: 0,
                budget: 0,
                items: [],
                intlItems: [],
                tciItems: [],
              };
            }
            const tier = String(it._detectedTier || autoDetectJournalRanking(it.journal || '', `${it.level || ''} ${it.remarks || ''}`));
            map[c].total += 1;
            map[c].budget += Number(it.budget) || 0;
            map[c].items.push(it);
            if (tier === 'Q1' || tier === 'Q2') {
              map[c].q12 += 1;
              map[c].intl += 1;
              map[c].intlItems.push(it);
            } else if (tier === 'Q3' || tier === 'Q4') {
              map[c].q34 += 1;
              map[c].intl += 1;
              map[c].intlItems.push(it);
            } else {
              map[c].tci += 1;
              map[c].tciItems.push(it);
            }
          });
          return map;
        };

        const curDeptMap = computePubDeptByYear(deptYear);
        const cmpDeptMap = computePubDeptByYear(deptCmpYear);
        const hasCmp = Object.values(cmpDeptMap).some((d) => d.total > 0);
        const isCmp = deptIsCompare && hasCmp;

        const getMetricVal = (d?: { total: number; q12: number; tci: number; budget: number }) => {
          if (!d) return 0;
          if (deptMetric === 'q12') return d.q12;
          if (deptMetric === 'tci') return d.tci;
          if (deptMetric === 'budget') return Number((d.budget / 1000).toFixed(1)); // พันบาท
          return d.total;
        };

        const sortedCodes = Object.keys(curDeptMap)
          .filter((c) => curDeptMap[c].total > 0 || (isCmp && cmpDeptMap[c]?.total > 0) || ['AE', 'IE', 'FE', 'IRRE', 'ME', 'CE', 'CPE'].includes(c))
          .sort((a, b) => getMetricVal(curDeptMap[b]) - getMetricVal(curDeptMap[a]));

        const renderChip = (c: number, p: number, isB = false) => {
          const base: React.CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 9px',
            borderRadius: '9999px',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          };
          if (p === 0 && c === 0) return <span style={{ ...base, backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>–</span>;
          if (p === 0 && c > 0) return <span style={{ ...base, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>ใหม่</span>;
          const diff = c - p;
          const isSame = isB ? Math.abs(diff) < 0.5 : Math.round(diff) === 0;
          if (isSame) return <span style={{ ...base, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>เท่าเดิม</span>;
          const isUp = diff > 0;
          const txt = isB && p > 0 ? `${isUp ? '+' : ''}${Math.abs((diff / p) * 100).toFixed(0)}%` : `${isUp ? '+' : ''}${Math.abs(Math.round(diff))}`;
          return (
            <span
              style={{
                ...base,
                gap: '3px',
                padding: '2px 8px',
                backgroundColor: isUp ? '#dcfce7' : '#fee2e2',
                color: isUp ? '#15803d' : '#b91c1c',
                border: isUp ? '1px solid #bbf7d0' : '1px solid #fecaca',
              }}
            >
              <span style={{ fontSize: '9.5px' }}>{isUp ? '▲' : '▼'}</span>
              <span>{txt}</span>
            </span>
          );
        };

        const N = sortedCodes.length;
        let maxV = 0;
        sortedCodes.forEach((c) => {
          const cur = curDeptMap[c];
          const cmp = cmpDeptMap[c];
          if (isCmp) maxV = Math.max(maxV, getMetricVal(cur), getMetricVal(cmp));
          else if (deptBarMode === 'group' && deptMetric === 'total') maxV = Math.max(maxV, cur.intl, cur.tci);
          else maxV = Math.max(maxV, getMetricVal(cur));
        });
        const step = Math.max(1, Math.ceil(maxV / 4));
        const top = Math.max(4, step * 4);
        const svgW = deptPlotWidth;
        const svgH = 340;
        const L = 56;
        const R = 28;
        const Tp = 34;
        const B = 42;
        const pw = svgW - L - R;
        const ph = svgH - Tp - B;
        const slot = pw / Math.max(1, N);
        const yPos = (v: number) => Tp + ph - (ph * v) / (top || 1);

        const totCurPubs = Object.values(curDeptMap).reduce((s, d) => s + d.total, 0);
        const totCurB = Object.values(curDeptMap).reduce((s, d) => s + d.budget, 0);

        return (
          <div className="rr-container">
            <div className="rr-wrap">
              <section className="rr-card rr-full" aria-labelledby="pub-dept-h">
                <div className="rr-head">
                  <h2 className="rr-title-h2" id="pub-dept-h">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                      <path d="M5 20V10M12 20V4M19 20v-7" />
                    </svg>
                    <span>
                      {isCmp
                        ? `จำนวนผลงานตีพิมพ์จำแนกตามสังกัด (ปี ${deptYear} vs ปี ${deptCmpYear})`
                        : 'จำนวนผลงานตีพิมพ์จำแนกตามสังกัด'}
                    </span>
                  </h2>
                  <div className="rr-ctrls">
                    <YearSelectDropdown
                      label="ปี"
                      value={deptYear}
                      onChange={(newY) => {
                        setDeptYear(newY);
                        if (deptCmpYear === newY) {
                          setDeptCmpYear(getDefaultCompareYear(newY, availableYears));
                        }
                      }}
                      includeAll={true}
                      allPosition="top"
                    />
                    <div className="rr-seg-ctl" role="group" aria-label="โหมดการแสดงผล">
                      <button type="button" aria-pressed={!deptIsCompare} onClick={() => setDeptIsCompare(false)}>
                        ภาพรวม
                      </button>
                      <button type="button" aria-pressed={deptIsCompare} onClick={() => setDeptIsCompare(true)}>
                        เปรียบเทียบข้ามปี
                      </button>
                    </div>
                    {deptIsCompare && (
                      <YearSelectDropdown
                        label="เทียบกับปี"
                        value={deptCmpYear}
                        onChange={(newCmp) => setDeptCmpYear(newCmp)}
                        excludeYear={deptYear}
                        includeAll={false}
                      />
                    )}
                  </div>
                </div>

                <div className="rr-ctrls rr-row2">
                  {!isCmp && (
                    <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                      <button type="button" aria-pressed={deptBarMode === 'group'} onClick={() => setDeptBarMode('group')}>
                        แยกแท่ง
                      </button>
                      <button type="button" aria-pressed={deptBarMode === 'stack'} onClick={() => setDeptBarMode('stack')}>
                        แท่งซ้อน
                      </button>
                    </div>
                  )}
                  <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัด">
                    <button type="button" aria-pressed={deptMetric === 'total'} onClick={() => setDeptMetric('total')}>
                      ผลงานรวม
                    </button>
                    <button type="button" aria-pressed={deptMetric === 'q12'} onClick={() => setDeptMetric('q12')}>
                      ระดับ Q1 - Q2
                    </button>
                    <button type="button" aria-pressed={deptMetric === 'tci'} onClick={() => setDeptMetric('tci')}>
                      ระดับ TCI 1 - 2
                    </button>
                    <button type="button" aria-pressed={deptMetric === 'budget'} onClick={() => setDeptMetric('budget')}>
                      เงินสนับสนุน (พันบาท)
                    </button>
                  </div>
                </div>

                {/* Legend with Department Colors */}
                <div className="rr-legend">
                  {sortedCodes.map((c) => (
                    <span
                      key={c}
                      className="rr-pill st"
                      style={{ '--c': UCOL[c] || UCOL.OTH, cursor: 'pointer' } as React.CSSProperties}
                      onClick={() => {
                        const d = curDeptMap[c];
                        if (d && d.items.length > 0) {
                          setDrillDown({
                            isOpen: true,
                            title: `ผลงานตีพิมพ์: สังกัด ${d.name} (${c}) · ปี ${deptYear}`,
                            subtitle: `รวม ${d.total} เรื่อง • Q1/Q2: ${d.q12} เรื่อง • TCI: ${d.tci} เรื่อง • เงินสนับสนุน ${d.budget.toLocaleString('th-TH')} บาท`,
                            accentColor: UCOL[c] || UCOL.OTH,
                            items: d.items,
                          });
                        }
                      }}
                    >
                      <i />
                      {c} ({curDeptMap[c].total})
                    </span>
                  ))}
                  {!isCmp && deptMetric === 'total' && (
                    <span className="rr-lbl" style={{ marginLeft: '8px' }}>
                      {deptBarMode === 'group' ? 'แท่งเข้ม = นานาชาติ (Q1-Q4) · แท่งอ่อน = ระดับชาติ (TCI)' : 'สีเข้ม = นานาชาติ (Q1-Q4) · สีอ่อน = ระดับชาติ (TCI)'}
                    </span>
                  )}
                </div>

                {/* Interactive SVG Chart */}
                <div className="rr-scroller" ref={deptScrollerRef}>
                  <div
                    className="rr-plot"
                    style={{ minWidth: '760px', width: `${svgW}px` }}
                    onPointerLeave={() => {
                      setActiveDeptCol(null);
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
                        {deptMetric === 'budget' ? 'เงินสนับสนุน (พันบาท)' : 'จำนวนผลงาน (เรื่อง)'}
                      </text>

                      {sortedCodes.map((c, i) => {
                        const x0 = L + slot * i;
                        const cx = x0 + slot / 2;
                        const d = curDeptMap[c];
                        const p = cmpDeptMap[c];
                        const col = UCOL[c] || UCOL.OTH;
                        const curV = getMetricVal(d);
                        const cmpV = isCmp ? getMetricVal(p) : 0;

                        let barsSvg: React.ReactNode = null;
                        if (isCmp) {
                          const bw = Math.min(36, slot * 0.3);
                          const gap = 5;
                          const hC = (ph * curV) / (top || 1);
                          const hP = (ph * cmpV) / (top || 1);
                          barsSvg = (
                            <>
                              {cmpV > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + ph - hP} width={bw} height={hP} rx={Math.min(8, hP / 2)} fill="var(--ghost)" />
                                  <text x={cx - bw / 2 - gap / 2} y={Tp + ph - hP - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#64748b">
                                    {cmpV}
                                  </text>
                                </g>
                              )}
                              {curV > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx + gap / 2} y={Tp + ph - hC} width={bw} height={hC} rx={Math.min(8, hC / 2)} fill={col} />
                                  <text x={cx + bw / 2 + gap / 2} y={Tp + ph - hC - 7} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a">
                                    {curV}
                                  </text>
                                </g>
                              )}
                            </>
                          );
                        } else if (deptBarMode === 'group' && deptMetric === 'total') {
                          const bw = Math.min(34, slot * 0.3);
                          const gap = 4;
                          const hIntl = (ph * d.intl) / (top || 1);
                          const hTci = (ph * d.tci) / (top || 1);
                          barsSvg = (
                            <>
                              {d.intl > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + ph - hIntl} width={bw} height={hIntl} rx={Math.min(8, hIntl / 2)} fill={col} />
                                  <text x={cx - bw / 2 - gap / 2} y={Tp + ph - hIntl - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                                    {d.intl}
                                  </text>
                                </g>
                              )}
                              {d.tci > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx + gap / 2} y={Tp + ph - hTci} width={bw} height={hTci} rx={Math.min(8, hTci / 2)} fill={col} fillOpacity={0.5} />
                                  <text x={cx + bw / 2 + gap / 2} y={Tp + ph - hTci - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#475569">
                                    {d.tci}
                                  </text>
                                </g>
                              )}
                            </>
                          );
                        } else if (deptMetric === 'total') {
                          const w2 = Math.min(54, slot * 0.48);
                          const gap = 3;
                          const segs = [
                            d.intl > 0 ? { k: 'intl', n: 'วารสารนานาชาติ (Q1-Q4)', v: d.intl, op: 1, items: d.intlItems } : null,
                            d.tci > 0 ? { k: 'tci', n: 'วารสารระดับชาติ (TCI)', v: d.tci, op: 0.55, items: d.tciItems } : null,
                          ].filter(Boolean) as Array<{ k: string; n: string; v: number; op: number; items: PublicationItem[] }>;
                          let cum = 0;
                          barsSvg = (
                            <>
                              {segs.map((seg) => {
                                const y1 = yPos(cum + seg.v);
                                const y0 = yPos(cum);
                                const h = Math.max(y0 - y1 - gap, 4);
                                const segY = y1 + gap / 2;
                                const isHovered = activeDeptCol === i && activeDeptSeg === seg.k;
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
                                          title: `ผลงานตีพิมพ์ (${seg.n}): สังกัด ${d.name} (${c}) · ปี ${deptYear}`,
                                          subtitle: `รวม ${seg.v} เรื่อง`,
                                          accentColor: col,
                                          items: seg.items,
                                        });
                                      }}
                                      onPointerMove={(e) => {
                                        e.stopPropagation();
                                        setActiveDeptCol(i);
                                        setActiveDeptSeg(seg.k);
                                        setTip({
                                          show: true,
                                          x: e.clientX,
                                          y: e.clientY - 12,
                                          content: (
                                            <div>
                                              <div className="rr-tt-h">
                                                <i style={{ backgroundColor: col, opacity: seg.op }} />
                                                <span>{seg.n} · {c}</span>
                                              </div>
                                              <div className="rr-tt-v">
                                                <b>{seg.v}</b>
                                                <span>เรื่อง</span>
                                              </div>
                                              <div className="rr-tt-s">{d.name} · คลิกเพื่อดูรายการ</div>
                                            </div>
                                          ),
                                        });
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
                              {d.total > 0 && (
                                <text x={cx} y={yPos(d.total) - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                  {d.total}
                                </text>
                              )}
                            </>
                          );
                        } else {
                          const w2 = Math.min(54, slot * 0.48);
                          const h = (ph * curV) / (top || 1);
                          barsSvg = curV > 0 ? (
                            <g>
                              <rect
                                className="rr-rise"
                                x={cx - w2 / 2}
                                y={Tp + ph - h}
                                width={w2}
                                height={h}
                                rx={Math.min(8, h / 2)}
                                fill={col}
                                style={{
                                  filter: activeDeptCol === i ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.25))' : 'none',
                                }}
                              />
                              {h >= 18 && (
                                <text x={cx} y={Tp + ph - h / 2 + 5} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                  {curV}
                                </text>
                              )}
                              <text x={cx} y={Tp + ph - h - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">
                                {curV}
                              </text>
                            </g>
                          ) : null;
                        }

                        return (
                          <g
                            key={c}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setTip((t) => ({ ...t, show: false }));
                              setDrillDown({
                                isOpen: true,
                                title: `ผลงานตีพิมพ์: สังกัด ${d.name} (${c}) · ปี ${deptYear}`,
                                subtitle: `รวม ${d.total} เรื่อง • Q1/Q2: ${d.q12} เรื่อง • TCI: ${d.tci} เรื่อง • เงินสนับสนุน ${d.budget.toLocaleString('th-TH')} บาท`,
                                accentColor: col,
                                items: d.items,
                              });
                            }}
                            onPointerMove={(e) => {
                              setActiveDeptCol(i);
                              setTip({
                                show: true,
                                x: e.clientX,
                                y: e.clientY - 12,
                                content: (
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: col }} />
                                      <span>{c} · {d.name}</span>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>ผลงานตีพิมพ์รวม</span>
                                      <b>{d.total} เรื่อง</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>วารสารนานาชาติ (Q1-Q2)</span>
                                      <b>{d.q12} เรื่อง</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>วารสารระดับชาติ (TCI 1-2)</span>
                                      <b>{d.tci} เรื่อง</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>เงินสนับสนุนรวม</span>
                                      <b>{d.budget.toLocaleString('th-TH')} บาท</b>
                                    </div>
                                    <div className="rr-tt-s">คลิกเพื่อดูรายการผลงานตีพิมพ์</div>
                                  </div>
                                ),
                              });
                            }}
                          >
                            <rect x={x0 + 4} y={Tp - 6} width={slot - 8} height={ph + 6} rx="14" fill="rgba(15, 23, 42, 0.05)" opacity={activeDeptCol === i ? 1 : 0} />
                            <rect x={x0} y={Tp - 6} width={slot} height={ph + 6} fill="transparent" />
                            {barsSvg}
                            <rect x={cx - 24} y={svgH - 28} width={48} height={22} rx={6} fill={col} />
                            <text x={cx} y={svgH - 13} textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff">
                              {c}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {isCmp && (
                      <div style={{ marginTop: '6px', marginLeft: `${L}px`, marginRight: `${R}px`, display: 'grid', gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
                        {sortedCodes.map((c) => (
                          <div key={c} style={{ display: 'flex', justifyContent: 'center' }}>
                            {renderChip(getMetricVal(curDeptMap[c]), getMetricVal(cmpDeptMap[c]), deptMetric === 'budget')}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary Footer */}
                <div className="rr-sumline">
                  <span>
                    ปี {deptYear} รวม <b>{totCurPubs}</b> เรื่อง
                  </span>
                  <span>
                    เงินสนับสนุนรวม <b>{(totCurB / 1_000_000).toFixed(2)}</b> ล้านบาท ({totCurB.toLocaleString('th-TH')} บาท)
                  </span>
                </div>
              </section>
            </div>
          </div>
        );
      })()}

      {/* DIMENSION 3: Top Publishing Authors */}
      {activePerspective === 'faculty' && (() => {
        const computeAuthorsByYear = (yr: string) => {
          const map: Record<
            string,
            {
              key: string;
              name: string;
              person_id?: number | string;
              dept: string;
              deptCode: string;
              count: number;
              q1: number;
              q2: number;
              q3: number;
              q4: number;
              tci1: number;
              tci2: number;
              intl: number;
              tci: number;
              q12: number;
              budget: number;
              budgetK: number;
              items: PublicationItem[];
              intlItems: PublicationItem[];
              tciItems: PublicationItem[];
            }
          > = {};
          baseAllPubs.forEach((item) => {
            if (yr !== 'all' && resolvePubYear(item) !== yr) return;
            const ownerName = String(item.owner || '').trim();
            if (!ownerName || ownerName === '-' || ownerName === 'nan') return;
            const matched = matchPerson(ownerName);
      const pId = item.person_id || item.owner_id || matched?.id || matched?._id || matched?.person_id;
            const key = pId ? `id_${pId}` : ownerName;
            if (!map[key]) {
              map[key] = {
                key,
                name: ownerName,
                person_id: pId,
                dept: item.department || '-',
                deptCode: resolvePubDeptCode(item.department, (item as any).departmentCode),
                count: 0,
                q1: 0,
                q2: 0,
                q3: 0,
                q4: 0,
                tci1: 0,
                tci2: 0,
                intl: 0,
                tci: 0,
                q12: 0,
                budget: 0,
                budgetK: 0,
                items: [],
                intlItems: [],
                tciItems: [],
              };
            }
            const tier = String(item._detectedTier || autoDetectJournalRanking(item.journal || '', `${item.level || ''} ${item.remarks || ''}`));
            map[key].count++;
            if (tier === 'Q1') {
              map[key].q1++;
              map[key].q12++;
              map[key].intl++;
              map[key].intlItems.push(item);
            } else if (tier === 'Q2') {
              map[key].q2++;
              map[key].q12++;
              map[key].intl++;
              map[key].intlItems.push(item);
            } else if (tier === 'Q3') {
              map[key].q3++;
              map[key].intl++;
              map[key].intlItems.push(item);
            } else if (tier === 'Q4') {
              map[key].q4++;
              map[key].intl++;
              map[key].intlItems.push(item);
            } else if (tier === 'TCI 1') {
              map[key].tci1++;
              map[key].tci++;
              map[key].tciItems.push(item);
            } else {
              map[key].tci2++;
              map[key].tci++;
              map[key].tciItems.push(item);
            }
            map[key].budget += Number(item.budget) || 0;
            map[key].budgetK = Number((map[key].budget / 1000).toFixed(1));
            map[key].items.push(item);
          });
          return map;
        };

        const curAuthMap = computeAuthorsByYear(deptYear);
        const cmpAuthMap = computeAuthorsByYear(deptCmpYear);
        const hasCmp = Object.values(cmpAuthMap).some((a) => a.count > 0);
        const isCmp = deptIsCompare && hasCmp;

        const getVal = (a?: { count: number; q12: number; budgetK: number }) => {
          if (!a) return 0;
          if (facultyMetric === 'q12') return a.q12;
          if (facultyMetric === 'budget') return a.budgetK;
          return a.count;
        };

        const top10List = Object.values(curAuthMap)
          .sort((a, b) => getVal(b) - getVal(a) || b.q1 - a.q1 || b.q2 - a.q2)
          .slice(0, 10);

        const renderChip = (c: number, p: number, isB = false) => {
          const base: React.CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 9px',
            borderRadius: '9999px',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          };
          if (p === 0 && c === 0) return <span style={{ ...base, backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>–</span>;
          if (p === 0 && c > 0) return <span style={{ ...base, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>ใหม่</span>;
          const diff = c - p;
          const isSame = isB ? Math.abs(diff) < 0.5 : Math.round(diff) === 0;
          if (isSame) return <span style={{ ...base, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>เท่าเดิม</span>;
          const isUp = diff > 0;
          const txt = isB && p > 0 ? `${isUp ? '+' : ''}${Math.abs((diff / p) * 100).toFixed(0)}%` : `${isUp ? '+' : ''}${Math.abs(Math.round(diff))}`;
          return (
            <span
              style={{
                ...base,
                gap: '3px',
                padding: '2px 8px',
                backgroundColor: isUp ? '#dcfce7' : '#fee2e2',
                color: isUp ? '#15803d' : '#b91c1c',
                border: isUp ? '1px solid #bbf7d0' : '1px solid #fecaca',
              }}
            >
              <span style={{ fontSize: '9.5px' }}>{isUp ? '▲' : '▼'}</span>
              <span>{txt}</span>
            </span>
          );
        };

        const N = Math.max(top10List.length, 1);
        let maxV = 0;
        top10List.forEach((a) => {
          const cmp = cmpAuthMap[a.key];
          if (isCmp) maxV = Math.max(maxV, getVal(a), getVal(cmp));
          else if (facultyBarMode === 'group' && facultyMetric === 'total') maxV = Math.max(maxV, a.intl, a.tci);
          else maxV = Math.max(maxV, getVal(a));
        });
        const step = Math.max(1, Math.ceil(maxV / 4));
        const top = Math.max(4, step * 4);
        const svgW = Math.max(deptPlotWidth, N * 98);
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
          <div className="rr-container">
            <div className="rr-wrap">
              {/* Top 10 Authors Interactive SVG Bar Chart */}
              <section className="rr-card rr-full" aria-labelledby="pub-fac-h">
                <div className="rr-head">
                  <h2 className="rr-title-h2" id="pub-fac-h">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                      <path d="M5 20V10M12 20V4M19 20v-7" />
                    </svg>
                    <span>10 อันดับอาจารย์และนักวิจัยที่มีผลงานตีพิมพ์สูงสุด</span>
                  </h2>
                  <div className="rr-ctrls">
                    <YearSelectDropdown
                      label="ปี"
                      value={deptYear}
                      onChange={(newY) => {
                        setDeptYear(newY);
                        if (deptCmpYear === newY) {
                          setDeptCmpYear(getDefaultCompareYear(newY, availableYears));
                        }
                      }}
                      includeAll={true}
                      allPosition="top"
                    />
                    <div className="rr-seg-ctl" role="group" aria-label="โหมดการแสดงผล">
                      <button type="button" aria-pressed={!deptIsCompare} onClick={() => setDeptIsCompare(false)}>
                        ภาพรวม
                      </button>
                      <button type="button" aria-pressed={deptIsCompare} onClick={() => setDeptIsCompare(true)}>
                        เปรียบเทียบข้ามปี
                      </button>
                    </div>
                    {deptIsCompare && (
                      <YearSelectDropdown
                        label="เทียบกับปี"
                        value={deptCmpYear}
                        onChange={(newCmp) => setDeptCmpYear(newCmp)}
                        excludeYear={deptYear}
                        includeAll={false}
                      />
                    )}
                  </div>
                </div>

                <div className="rr-ctrls rr-row2">
                  {!isCmp && facultyMetric === 'total' && (
                    <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                      <button type="button" aria-pressed={facultyBarMode === 'group'} onClick={() => setFacultyBarMode('group')}>
                        แยกแท่ง
                      </button>
                      <button type="button" aria-pressed={facultyBarMode === 'stack'} onClick={() => setFacultyBarMode('stack')}>
                        แท่งซ้อน
                      </button>
                    </div>
                  )}
                  <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัด">
                    <button type="button" aria-pressed={facultyMetric === 'total'} onClick={() => setFacultyMetric('total')}>
                      ผลงานรวม
                    </button>
                    <button type="button" aria-pressed={facultyMetric === 'q12'} onClick={() => setFacultyMetric('q12')}>
                      ระดับ Q1 - Q2
                    </button>
                    <button type="button" aria-pressed={facultyMetric === 'budget'} onClick={() => setFacultyMetric('budget')}>
                      เงินสนับสนุน (พันบาท)
                    </button>
                  </div>
                </div>

                <div className="rr-legend">
                  {isCmp ? (
                    <>
                      <span className="rr-pill st" style={{ '--c': '#e11d48' } as React.CSSProperties}>
                        <i />
                        ปี {deptYear}
                      </span>
                      <span className="rr-pill st" style={{ '--c': 'var(--ghost)' } as React.CSSProperties}>
                        <i />
                        ปี {deptCmpYear}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="rr-pill st" style={{ '--c': '#e11d48' } as React.CSSProperties}>
                        <i />
                        วารสารนานาชาติ (Q1-Q4)
                      </span>
                      <span className="rr-pill st" style={{ '--c': '#6366f1' } as React.CSSProperties}>
                        <i />
                        วารสารระดับชาติ (TCI 1-2)
                      </span>
                    </>
                  )}
                </div>

                <div className="rr-scroller">
                  <div
                    className="rr-plot"
                    style={{ minWidth: '820px', width: `${svgW}px` }}
                    onPointerLeave={() => {
                      setActiveFacultyCol(null);
                      setActiveFacultySeg(null);
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
                        {facultyMetric === 'budget' ? 'เงินสนับสนุน (พันบาท)' : 'จำนวนผลงาน (เรื่อง)'}
                      </text>

                      {top10List.map((a, i) => {
                        const x0 = L + slot * i;
                        const cx = x0 + slot / 2;
                        const p = cmpAuthMap[a.key];
                        const curV = getVal(a);
                        const cmpV = isCmp ? getVal(p) : 0;
                        const deptCol = UCOL[a.deptCode] || UCOL.OTH;
                        const shortName = a.name.length > 15 ? a.name.slice(0, 14) + '…' : a.name;

                        let barsSvg: React.ReactNode = null;
                        if (isCmp) {
                          const bw = Math.min(34, slot * 0.28);
                          const gap = 5;
                          const hC = (ph * curV) / (top || 1);
                          const hP = (ph * cmpV) / (top || 1);
                          barsSvg = (
                            <>
                              {cmpV > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + ph - hP} width={bw} height={hP} rx={Math.min(7, hP / 2)} fill="var(--ghost)" />
                                  <text x={cx - bw / 2 - gap / 2} y={Tp + ph - hP - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#64748b">
                                    {cmpV}
                                  </text>
                                </g>
                              )}
                              {curV > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx + gap / 2} y={Tp + ph - hC} width={bw} height={hC} rx={Math.min(7, hC / 2)} fill="#e11d48" />
                                  <text x={cx + bw / 2 + gap / 2} y={Tp + ph - hC - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                                    {curV}
                                  </text>
                                </g>
                              )}
                            </>
                          );
                        } else if (facultyBarMode === 'group' && facultyMetric === 'total') {
                          const bw = Math.min(34, slot * 0.28);
                          const gap = 5;
                          const hIntl = (ph * a.intl) / (top || 1);
                          const hTci = (ph * a.tci) / (top || 1);
                          barsSvg = (
                            <>
                              {a.intl > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + ph - hIntl} width={bw} height={hIntl} rx={Math.min(7, hIntl / 2)} fill="#e11d48" />
                                  <text x={cx - bw / 2 - gap / 2} y={Tp + ph - hIntl - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a">
                                    {a.intl}
                                  </text>
                                </g>
                              )}
                              {a.tci > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx + gap / 2} y={Tp + ph - hTci} width={bw} height={hTci} rx={Math.min(7, hTci / 2)} fill="#6366f1" />
                                  <text x={cx + bw / 2 + gap / 2} y={Tp + ph - hTci - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a">
                                    {a.tci}
                                  </text>
                                </g>
                              )}
                            </>
                          );
                        } else if (facultyMetric === 'total') {
                          const w2 = Math.min(54, slot * 0.44);
                          const gap = 3;
                          const segs = [
                            a.intl > 0 ? { k: 'intl', n: 'วารสารนานาชาติ (Q1-Q4)', c: '#e11d48', v: a.intl, items: a.intlItems } : null,
                            a.tci > 0 ? { k: 'tci', n: 'วารสารระดับชาติ (TCI 1-2)', c: '#6366f1', v: a.tci, items: a.tciItems } : null,
                          ].filter(Boolean) as Array<{ k: string; n: string; c: string; v: number; items: PublicationItem[] }>;
                          let cum = 0;
                          barsSvg = (
                            <>
                              {segs.map((seg) => {
                                const y1 = yPos(cum + seg.v);
                                const y0 = yPos(cum);
                                const h = Math.max(y0 - y1 - gap, 4);
                                const segY = y1 + gap / 2;
                                const isHovered = activeFacultyCol === i && activeFacultySeg === seg.k;
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
                                        setTip((t) => ({ ...t, show: false }));
                                        setDrillDown({
                                          isOpen: true,
                                          title: `ผลงานตีพิมพ์ (${seg.n}): ${a.name} · ปี ${deptYear}`,
                                          subtitle: `รวม ${seg.v} เรื่อง`,
                                          accentColor: seg.c,
                                          items: seg.items,
                                        });
                                      }}
                                      onPointerMove={(e) => {
                                        e.stopPropagation();
                                        setActiveFacultyCol(i);
                                        setActiveFacultySeg(seg.k);
                                        setTip({
                                          show: true,
                                          x: e.clientX,
                                          y: e.clientY - 12,
                                          content: (
                                            <div>
                                              <div className="rr-tt-h">
                                                <i style={{ backgroundColor: seg.c }} />
                                                <span>{seg.n} · {a.name}</span>
                                              </div>
                                              <div className="rr-tt-v">
                                                <b>{seg.v}</b>
                                                <span>เรื่อง</span>
                                              </div>
                                              <div className="rr-tt-s">คลิกเพื่อดูรายการผลงานตีพิมพ์</div>
                                            </div>
                                          ),
                                        });
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
                              {a.count > 0 && (
                                <text x={cx} y={yPos(a.count) - 8} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                  {a.count}
                                </text>
                              )}
                            </>
                          );
                        } else {
                          const w2 = Math.min(54, slot * 0.44);
                          const h = (ph * curV) / (top || 1);
                          barsSvg = curV > 0 ? (
                            <g>
                              <rect
                                className="rr-rise"
                                x={cx - w2 / 2}
                                y={Tp + ph - h}
                                width={w2}
                                height={h}
                                rx={Math.min(8, h / 2)}
                                fill="#e11d48"
                              />
                              {h >= 16 && (
                                <text x={cx} y={Tp + ph - h / 2 + 5} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                  {curV}
                                </text>
                              )}
                              <text x={cx} y={Tp + ph - h - 8} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a">
                                {curV}
                              </text>
                            </g>
                          ) : null;
                        }

                        return (
                          <g
                            key={a.key}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setTip((t) => ({ ...t, show: false }));
                              setDrillDown({
                                isOpen: true,
                                title: `ผลงานตีพิมพ์: ${a.name} (${a.deptCode}) · ปี ${deptYear}`,
                                subtitle: `รวม ${a.count} เรื่อง • Q1: ${a.q1} • Q2: ${a.q2} • TCI: ${a.tci} • เงินสนับสนุนรวม ${a.budget.toLocaleString('th-TH')} บาท`,
                                accentColor: deptCol,
                                items: a.items,
                              });
                            }}
                            onPointerMove={(e) => {
                              setActiveFacultyCol(i);
                              setTip({
                                show: true,
                                x: e.clientX,
                                y: e.clientY - 12,
                                content: (
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: deptCol }} />
                                      <span>#{i + 1} {a.name}</span>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>สังกัด</span>
                                      <b>{a.deptCode}</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>ผลงานตีพิมพ์รวม</span>
                                      <b>{a.count} เรื่อง</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>วารสารนานาชาติ (Q1-Q4)</span>
                                      <b>{a.intl} เรื่อง (Q1/Q2: {a.q12})</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>วารสารระดับชาติ (TCI 1-2)</span>
                                      <b>{a.tci} เรื่อง</b>
                                    </div>
                                    <div className="rr-tt-s">คลิกเพื่อดูรายการผลงานตีพิมพ์</div>
                                  </div>
                                ),
                              });
                            }}
                          >
                            <rect x={x0 + 4} y={Tp - 6} width={slot - 8} height={ph + 6} rx="12" fill="rgba(15, 23, 42, 0.05)" opacity={activeFacultyCol === i ? 1 : 0} />
                            <rect x={x0} y={Tp - 6} width={slot} height={ph + 6} fill="transparent" />
                            {barsSvg}
                            <text x={cx} y={svgH - 26} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">
                              {shortName}
                            </text>
                            <rect x={cx - 22} y={svgH - 20} width={44} height={18} rx="5" fill={deptCol} />
                            <text x={cx} y={svgH - 7} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#ffffff">
                              {a.deptCode}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {isCmp && (
                      <div style={{ marginTop: '6px', marginLeft: `${L}px`, marginRight: `${R}px`, display: 'grid', gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
                        {top10List.map((a) => (
                          <div key={a.key} style={{ display: 'flex', justifyContent: 'center' }}>
                            {renderChip(getVal(a), getVal(cmpAuthMap[a.key]), facultyMetric === 'budget')}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Ranking Table with Circular Avatar */}
              <section className="rr-card rr-full">
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    ตารางจัดอันดับอาจารย์และนักวิจัยที่มีผลงานตีพิมพ์สูงสุด
                  </h3>
                  
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center', width: '64px' }}>รูปภาพ</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left' }}>อาจารย์ / นักวิจัย</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left' }}>สังกัด</th>
                        <th style={{ padding: '10px 10px', textAlign: 'center' }}>รวม</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center' }}>Q1</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center' }}>Q2</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center' }}>Q3</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center' }}>Q4</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center' }}>TCI 1</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center' }}>TCI 2</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>เงินสนับสนุนรวม</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>แฟ้มผลงาน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topAuthorsRanking.map((a, idx) => {
                        const avatarSrc = resolvePersonAvatar(a.person_id, a.name);
                        return (
                          <tr
                            key={idx}
                            onClick={() => {
                              const targetId = a.person_id || matchPerson(a.name)?.id || matchPerson(a.name)?._id || matchPerson(a.name)?.person_id;
                              if (targetId) router.push(`/personnel/${targetId}`);
                              else router.push(`/personnel?q=${encodeURIComponent(a.name)}`);
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
                                  alt={a.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                                  onError={(e) => {
                                    const img = e.currentTarget;
                                    if (!img.src.endsWith('/default-avatar.png')) {
                                      img.src = '/default-avatar.png';
                                    }
                                  }}
                                />
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                              {a.name}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <DepartmentBadge value={a.dept} />
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 700 }}>
                              <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                                {a.count} เรื่อง
                              </span>
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700, color: '#059669' }}>
                              {a.q1 > 0 ? a.q1 : '-'}
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700, color: '#2563eb' }}>
                              {a.q2 > 0 ? a.q2 : '-'}
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, color: '#d97706' }}>
                              {a.q3 > 0 ? a.q3 : '-'}
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, color: '#ea580c' }}>
                              {a.q4 > 0 ? a.q4 : '-'}
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, color: '#7c3aed' }}>
                              {a.tci1 > 0 ? a.tci1 : '-'}
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, color: '#9333ea' }}>
                              {a.tci2 > 0 ? a.tci2 : '-'}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#047857' }}>
                              {a.budget > 0 ? `${a.budget.toLocaleString('th-TH')} ` : '-'}
                            </td>
                            <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (a.person_id) router.push(`/personnel/${a.person_id}`);
                                  else router.push(`/personnel?q=${encodeURIComponent(a.name)}`);
                                }}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  color: '#16a34a',
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
        );
      })()}

      {/* DIMENSION 4: Top Journals */}
      {activePerspective === 'journals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top 10 Journals Bar Chart */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBookOpen style={{ color: '#fb7185' }} /> 10 อันดับวารสารและแหล่งตีพิมพ์ที่มีผลงานเผยแพร่สูงสุด
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                แท่งสีกราฟจำแนกตามระดับคุณภาพวารสาร (Q1–Q4, TCI 1–2)
              </p>
            </div>
            <div style={{ height: '420px', cursor: 'pointer' }}>
              <canvas id="c_pub_journals_top10" />
            </div>
          </div>

          {/* Ranking Table */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                ตารางจัดอันดับวารสารและแหล่งตีพิมพ์ที่มีผลงานเผยแพร่สูงสุด
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>ชื่อวารสาร / แหล่งตีพิมพ์</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', width: '140px' }}>ระดับคุณภาพ </th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', width: '110px' }}>จำนวนผลงาน</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>รายการผลงาน</th>
                </tr>
              </thead>
              <tbody>
                {topJournalsRanking.map((j, idx) => (
                  <tr
                    key={idx}
                    onClick={() => {
                      setDrillDown({
                        isOpen: true,
                        title: `ผลงานตีพิมพ์: ${j.journal}`,
                        subtitle: `ระดับ ${j.tier} • รวม ${j.count} เรื่อง`,
                        accentColor: JOURNAL_TIER_STYLES[j.tier]?.text || '#16a34a',
                        items: j.items,
                      });
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
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>
                      {j.journal}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          backgroundColor: JOURNAL_TIER_STYLES[j.tier]?.bg || '#f1f5f9',
                          color: JOURNAL_TIER_STYLES[j.tier]?.text || '#475569',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {j.tier}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>
                      {j.count} เรื่อง
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrillDown({
                            isOpen: true,
                            title: `ผลงานตีพิมพ์: ${j.journal}`,
                            subtitle: `ระดับ ${j.tier} • รวม ${j.count} เรื่อง`,
                            accentColor: JOURNAL_TIER_STYLES[j.tier]?.text || '#16a34a',
                            items: j.items,
                          });
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#16a34a',
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* DIMENSION 5: UN SDGs */}
      {activePerspective === 'sdg' && (
        <StrategicAlignmentMatrix
          items={validData}
          categoryKey="publications"
          missionTitle="ผลงานตีพิมพ์ทางวิชาการ"
          unitLabel="บทความ"
          showBudget={false}
        />
      )}

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
        categoryKey="publications"
      />
    </div>
  );
}
