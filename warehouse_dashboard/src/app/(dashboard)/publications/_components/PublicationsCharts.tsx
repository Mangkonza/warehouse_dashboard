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
import { PublicationItem } from '../_hooks/usePublicationsData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { autoDetectJournalRanking, JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';
import { CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';

interface PublicationsChartsProps {
  validData: PublicationItem[];
  onSelectDept?: (deptCode: string) => void;
  onSelectLevel?: (levelKey: string) => void;
  activePerspective?: PubPerspective;
  onChangePerspective?: (persp: PubPerspective) => void;
  hideSelector?: boolean;
}

export type PubPerspective = 'timeline' | 'quartile_tci' | 'department' | 'faculty' | 'journals' | 'sdg' | 'table';

/** Main journal tiers shown in the quartile donut, in display order. */
const MAIN_PUB_TIERS = [
  { key: 'Q1', label: 'Q1', color: '#86EFAC', border: '#059669' },
  { key: 'Q2', label: 'Q2', color: '#93C5FD', border: '#2563EB' },
  { key: 'Q3', label: 'Q3', color: '#FDE68A', border: '#D97706' },
  { key: 'Q4', label: 'Q4', color: '#FDBA74', border: '#EA580C' },
  { key: 'TCI 1', label: 'TCI 1', color: '#C4B5FD', border: '#7C3AED' },
  { key: 'TCI 2', label: 'TCI 2', color: '#F0ABFC', border: '#9333EA' },
] as const;

export function PublicationsCharts({
  validData,
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

      const pId = item.person_id || item.owner_id;
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
      const tier = autoDetectJournalRanking(item.journal || '', item.level || '');
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
      const tier = autoDetectJournalRanking(item.journal || '', item.level || '');
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
      'Q1': { label: 'Q1', count: 0, items: [], color: '#86EFAC', border: '#059669' },
      'Q2': { label: 'Q2', count: 0, items: [], color: '#93C5FD', border: '#2563EB' },
      'Q3': { label: 'Q3', count: 0, items: [], color: '#FDE68A', border: '#D97706' },
      'Q4': { label: 'Q4', count: 0, items: [], color: '#FDBA74', border: '#EA580C' },
      'TCI 1': { label: 'TCI 1', count: 0, items: [], color: '#C4B5FD', border: '#7C3AED' },
      'TCI 2': { label: 'TCI 2', count: 0, items: [], color: '#F0ABFC', border: '#9333EA' },
      'ประชุมวิชาการ': { label: 'การประชุมวิชาการ', count: 0, items: [], color: '#99F6E4', border: '#0D9488' },
      'อื่นๆ': { label: 'อื่นๆ', count: 0, items: [], color: '#CBD5E1', border: '#64748B' },
    };

    const deptGroups: Record<
      string,
      { code: string; name: string; count: number; q1Count: number; budget: number; items: PublicationItem[] }
    > = {};

    validData.forEach((item) => {
      const budget = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      const detectedTier = String(autoDetectJournalRanking(item.journal || '', item.level || ''));
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

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'timeline' || activePerspective === 'quartile_tci') {
      const openPublicationPeriod = (index: number) => {
        const key = periodKeys[index];
        const bucket = key ? monthBuckets[key] : undefined;
        if (!bucket || bucket.items.length === 0) return;
        const averageSupport = bucket.budget / bucket.count;
        setDrillDown({
          isOpen: true,
          title: `ผลงานตีพิมพ์ทางวิชาการ: ${bucket.label}`,
          subtitle: `รวม ${bucket.count} เรื่อง • เงินสนับสนุน ${bucket.budget.toLocaleString('th-TH')} บาท • เฉลี่ย ${averageSupport.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/เรื่อง`,
          accentColor: '#16a34a',
          items: bucket.items,
        });
      };

      // Combined view: volume as bars, funding as a line on the secondary axis.
      const isTierMode = pubCountMode === 'tier';
      const tierDatasetKeys = ['Q1', 'Q2', 'Q3', 'Q4', 'TCI 1', 'TCI 2', 'ประชุมวิชาการ', 'อื่นๆ'].filter(
        (key) => (levelGroups[key]?.count || 0) > 0
      );
      const budgetMillions = periodKeys.map((key) => Number((monthBuckets[key].budget / 1_000_000).toFixed(3)));

      const volumeDatasets = isTierMode
        ? tierDatasetKeys.map((key) => ({
            type: 'bar' as const,
            label: levelGroups[key].label,
            data: periodKeys.map((period) => monthBuckets[period].tiers[key] || 0),
            backgroundColor: levelGroups[key].color,
            borderColor: levelGroups[key].border,
            borderWidth: 1,
            borderRadius: 3,
            stack: 'pub-tier',
            yAxisID: 'y',
            order: 2,
          }))
        : [
            {
              type: 'bar' as const,
              label: 'จำนวนผลงาน (เรื่อง)',
              data: periodKeys.map((key) => monthBuckets[key].count),
              backgroundColor: CHART_PASTEL_PALETTE.missions.publications.fill,
              borderColor: C_PUB,
              borderWidth: 1,
              borderRadius: 4,
              yAxisID: 'y',
              order: 2,
            },
          ];

      createChart('c_pub_monthly', {
        type: 'bar',
        data: {
          labels: periodLabels,
          datasets: [
            ...volumeDatasets,
            {
              type: 'line' as const,
              label: 'เงินสนับสนุน (ล้านบาท)',
              data: budgetMillions,
              borderColor: '#BE123C',
              backgroundColor: 'rgba(190, 18, 60, 0.08)',
              borderWidth: 2.5,
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: '#BE123C',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 1.5,
              yAxisID: 'y1',
              order: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) {
              openPublicationPeriod(hit.index);
            }
          },
          scales: {
            x: { stacked: isTierMode, grid: { display: false } },
            y: {
              type: 'linear',
              stacked: isTierMode,
              beginAtZero: true,
              grace: '15%',
              ticks: isTierMode ? undefined : { stepSize: 1 },
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนผลงาน (เรื่อง)' },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '20%',
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'เงินสนับสนุน (ล้านบาท)' },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 10,
                font: { size: 10.5 },
                padding: 8,
                sort: (a: any, b: any) => {
                  const aIsLine = a.text.includes('เงินสนับสนุน');
                  const bIsLine = b.text.includes('เงินสนับสนุน');
                  return aIsLine === bIsLine ? 0 : aIsLine ? 1 : -1;
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const key = periodKeys[context.dataIndex];
                  const bucket = key ? monthBuckets[key] : undefined;
                  if (!bucket) return '';
                  if (context.dataset.yAxisID === 'y1') {
                    return `เงินสนับสนุน: ${bucket.budget.toLocaleString('th-TH')} บาท (${(bucket.budget / 1_000_000).toFixed(2)} ล้านบาท)`;
                  }
                  return isTierMode
                    ? `${context.dataset.label}: ${context.raw ?? 0} เรื่อง`
                    : `จำนวนผลงาน: ${bucket.count} เรื่อง`;
                },
                afterBody: (items: any[]) => {
                  const key = periodKeys[items[0]?.dataIndex ?? -1];
                  const bucket = key ? monthBuckets[key] : undefined;
                  if (!bucket || bucket.count === 0) return [];
                  return [
                    `เฉลี่ย: ${(bucket.budget / bucket.count).toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/เรื่อง`,
                  ];
                },
              },
            },
            datalabels: {
              display: (ctx: any) => Number(ctx.dataset.data[ctx.dataIndex]) > 0,
              anchor: 'end',
              align: 'top',
              offset: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? 7 : 1),
              color: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? '#BE123C' : CHART_PASTEL_PALETTE.datalabels.dark,
              backgroundColor: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              borderRadius: 3,
              padding: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? 3 : 0),
              clamp: true,
              font: { weight: 'bold', size: isTierMode ? 9 : 10 },
              formatter: (v: number, ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? `${v.toFixed(2)}` : `${v}`,
            },
          },
        },
      });

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
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (v > 0 ? `${v} เรื่อง` : ''),
            },
          },
        },
      });
    }

    if (activePerspective === 'department') {
      const sortedDepts = Object.values(deptGroups).sort((a, b) => b.count - a.count);
      createChart('c_pub_dept', {
        type: 'bar',
        data: {
          labels: sortedDepts.map((d) => d.code),
          datasets: [
            {
              label: 'ผลงานตีพิมพ์ทั้งหมด',
              data: sortedDepts.map((d) => d.count),
              backgroundColor: sortedDepts.map((d) => getDepartmentColor(d.code)),
              borderRadius: 6,
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
              const d = sortedDepts[hit.index];
              if (d) {
                if (onSelectDept) onSelectDept(d.code);
                const averageSupport = d.count > 0 ? d.budget / d.count : null;
                setDrillDown({
                  isOpen: true,
                  title: `ผลงานตีพิมพ์: สังกัด ${d.name} (${d.code})`,
                  subtitle: `รวม ${d.count} เรื่อง • Q1/Q2: ${d.q1Count} เรื่อง • เงินสนับสนุน ${d.budget.toLocaleString('th-TH')} บาท • เฉลี่ย ${averageSupport === null ? '—' : `${averageSupport.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/เรื่อง`}`,
                  accentColor: getDepartmentColor(d.code),
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
                  const d = sortedDepts[context.dataIndex];
                  if (!d) return '';
                  const averageSupport = d.count > 0 ? d.budget / d.count : null;
                  return [
                    `ผลงาน: ${d.count} เรื่อง`,
                    `Q1/Q2: ${d.q1Count} เรื่อง`,
                    `เงินสนับสนุน: ${d.budget.toLocaleString('th-TH')} บาท`,
                    `เฉลี่ย: ${averageSupport === null ? '—' : `${averageSupport.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/เรื่อง`}`,
                  ];
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => `${v} เรื่อง`,
            },
          },
          scales: {
            y: { beginAtZero: true, grid: { color: CHART_PASTEL_PALETTE.gridLines }, title: { display: true, text: 'เรื่อง' } },
            x: { grid: { display: false } },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData, activePerspective, pubCountMode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            

      {/* DIMENSION 1: Timeline */}
      {activePerspective === 'timeline' && (
        <div className="chart-grid">
            <div className="chart-card chart-full">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <div>
                  <h3 style={{ margin: 0 }}>
                    <FaChartLine style={{ color: '#fb7185' }} /> ผลงานตีพิมพ์และเงินสนับสนุนรายเดือน
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    แท่ง = จำนวนผลงาน • เส้น = เงินสนับสนุน (ล้านบาท) • คลิกที่กราฟเพื่อดูรายการ
                  </p>
                </div>
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
                    onClick={() => setPubCountMode('total')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: pubCountMode === 'total' ? '#ffffff' : 'transparent',
                      color: pubCountMode === 'total' ? '#16a34a' : '#64748b',
                      fontWeight: pubCountMode === 'total' ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    รวมทั้งหมด
                  </button>
                  <button
                    type="button"
                    onClick={() => setPubCountMode('tier')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: pubCountMode === 'tier' ? '#ffffff' : 'transparent',
                      color: pubCountMode === 'tier' ? '#16a34a' : '#64748b',
                      fontWeight: pubCountMode === 'tier' ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    แยกตามระดับ
                  </button>
                </div>
              </div>
              <div className="chart-wrapper" style={{ height: '320px', position: 'relative' }}>
                <canvas id="c_pub_monthly" />
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
            </div>
          </div>
      )}

      {/* DIMENSION 1.5: Dedicated Quartile & TCI */}
      {activePerspective === 'quartile_tci' && (
        <div className="chart-card">
            <h3>
              <FaChartPie style={{ color: '#34d399' }} /> สัดส่วนผลงานตามระดับฐานข้อมูลวารสาร
            </h3>
            <div className="pub-level-layout">
              <div className="chart-wrapper" style={{ position: 'relative', height: '300px' }}>
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
                  <p style={{ margin: '6px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    Q1–Q2 รวม <strong style={{ color: '#0f172a' }}>{levelSummary.topTwo} เรื่อง</strong> ·{' '}
                    {levelSummary.topTwoPct}% ของผลงานที่จำแนกระดับได้
                  </p>
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

      {/* DIMENSION 2: Department */}
      {activePerspective === 'department' && (
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              จำนวนผลงานตีพิมพ์จำแนกตามสังกัด
            </h3>
          </div>
          <div style={{ height: '320px', position: 'relative' }}>
            <canvas id="c_pub_dept" />
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
        </div>
      )}

      {/* DIMENSION 3: Top Publishing Authors */}
      {activePerspective === 'faculty' && (
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              จัดอันดับอาจารย์และนักวิจัยที่มีผลงานตีพิมพ์สูงสุด
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              เรียงลำดับตามจำนวนผลงานและสัดส่วนวารสารชั้นนำ Q1/Q2
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
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
                {topAuthorsRanking.map((a, idx) => (
                  <tr
                    key={idx}
                    onClick={() => {
                      if (a.person_id) router.push(`/personnel/${a.person_id}`);
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
                        onClick={() => {
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIMENSION 4: Top Journals */}
      {activePerspective === 'journals' && (
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              10 อันดับวารสารและแหล่งตีพิมพ์ที่มีผลงานเผยแพร่สูงสุด
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
