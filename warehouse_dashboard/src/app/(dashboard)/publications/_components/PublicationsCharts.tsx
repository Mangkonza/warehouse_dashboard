'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartBar,
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
import { getDepartment, getDepartmentColor, formatChartDeptLabel } from '@/lib/departments';
import { autoDetectJournalRanking, JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';

interface PublicationsChartsProps {
  validData: PublicationItem[];
  onSelectDept?: (deptCode: string) => void;
  onSelectLevel?: (levelKey: string) => void;
}

export type PubPerspective = 'quartile_timeline' | 'department' | 'faculty' | 'journals' | 'sdg';

export function PublicationsCharts({
  validData,
  onSelectDept,
  onSelectLevel,
}: PublicationsChartsProps) {
  const router = useRouter();
  const [activePerspective, setActivePerspective] = useState<PubPerspective>('quartile_timeline');
  const chartInstances = useRef<Chart[]>([]);
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

  // Calculate top publishing authors
  const topAuthorsRanking = useMemo(() => {
    const map: Record<string, { name: string; person_id?: number | string; dept: string; count: number; q1q2: number; tci: number; budget: number; items: PublicationItem[] }> = {};
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
          q1q2: 0,
          tci: 0,
          budget: 0,
          items: [],
        };
      }
      const tier = autoDetectJournalRanking(item.journal || '', item.level || '');
      map[key].count++;
      if (tier === 'Q1' || tier === 'Q2') map[key].q1q2++;
      if (tier === 'TCI 1' || tier === 'TCI 2') map[key].tci++;
      map[key].budget += Number(item.budget) || 0;
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.count - a.count || b.q1q2 - a.q1q2);
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

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_PUB = '#6EE7B7';
    const TIER_COLORS = [
      '#6EE7B7', // นานาชาติ ระดับ 1 (Pastel Mint)
      '#7DD3FC', // นานาชาติ ระดับ 2 (Pastel Sky)
      '#C4B5FD', // ระดับชาติ กลุ่ม 1 / 2 (Pastel Lavender)
      '#FDE68A', // อื่นๆ (Pastel Amber)
    ];

    const ALL_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthBuckets: Record<
      string,
      { q1: number; q2: number; tci: number; other: number; budget: number; items: PublicationItem[] }
    > = {};
    ALL_MONTHS.forEach((m) => {
      monthBuckets[m] = { q1: 0, q2: 0, tci: 0, other: 0, budget: 0, items: [] };
    });

    const levelGroups: Record<string, { label: string; count: number; items: PublicationItem[]; color: string }> = {
      'Q1': { label: 'วารสารนานาชาติ ระดับ 1', count: 0, items: [], color: '#6EE7B7' },
      'Q2': { label: 'วารสารนานาชาติ ระดับ 2', count: 0, items: [], color: '#7DD3FC' },
      'TCI': { label: 'วารสารระดับชาติ กลุ่ม 1 และ 2', count: 0, items: [], color: '#C4B5FD' },
      'อนุสิทธิบัตร': { label: 'เตรียมความพร้อมจดอนุสิทธิบัตร', count: 0, items: [], color: '#FDE68A' },
      'อื่นๆ': { label: 'วารสารวิชาการอื่นๆ', count: 0, items: [], color: '#CBD5E1' },
    };

    const deptGroups: Record<string, { code: string; name: string; count: number; q1Count: number; budget: number; items: PublicationItem[] }> = {};

    validData.forEach((item) => {
      const budget = typeof item.budget === 'number' ? item.budget : Number(item.budget) || Number(item.support_amount) || 0;
      const detectedTier = autoDetectJournalRanking(item.journal || '', item.level || '');
      const rawMonth = String(item.month || '').trim();
      const mKey = ALL_MONTHS.find((m) => rawMonth.includes(m)) || null;

      if (mKey && monthBuckets[mKey]) {
        monthBuckets[mKey].budget += budget;
        monthBuckets[mKey].items.push(item);
        if (detectedTier === 'Q1') monthBuckets[mKey].q1++;
        else if (detectedTier === 'Q2') monthBuckets[mKey].q2++;
        else if (detectedTier === 'TCI 1' || detectedTier === 'TCI 2') monthBuckets[mKey].tci++;
        else monthBuckets[mKey].other++;
      }

      if (detectedTier === 'Q1') {
        levelGroups['Q1'].count++;
        levelGroups['Q1'].items.push(item);
      } else if (detectedTier === 'Q2') {
        levelGroups['Q2'].count++;
        levelGroups['Q2'].items.push(item);
      } else if (detectedTier === 'TCI 1' || detectedTier === 'TCI 2') {
        levelGroups['TCI'].count++;
        levelGroups['TCI'].items.push(item);
      } else if (item.type === 'เตรียมความพร้อมจดอนุสิทธิบัตร') {
        levelGroups['อนุสิทธิบัตร'].count++;
        levelGroups['อนุสิทธิบัตร'].items.push(item);
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

    const activeMonths = ALL_MONTHS.filter((m) => {
      const b = monthBuckets[m];
      return b.q1 + b.q2 + b.tci + b.other > 0 || b.budget > 0;
    });
    const finalMonths = activeMonths.length > 0 ? activeMonths : ALL_MONTHS.slice(0, 6);

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'quartile_timeline') {
      // 1. Dual-Axis Combo Chart: Stacked Bar Monthly Quality + Line Support Budget
      createChart('c_pub_monthly', {
        type: 'bar',
        data: {
          labels: finalMonths,
          datasets: [
            {
              type: 'bar',
              label: 'นานาชาติ ระดับ 1',
              data: finalMonths.map((m) => monthBuckets[m].q1),
              backgroundColor: TIER_COLORS[0],
              borderRadius: 4,
              stack: 'pub_stack',
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'bar',
              label: 'นานาชาติ ระดับ 2',
              data: finalMonths.map((m) => monthBuckets[m].q2),
              backgroundColor: TIER_COLORS[1],
              borderRadius: 4,
              stack: 'pub_stack',
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'bar',
              label: 'ระดับชาติ กลุ่ม 1 / 2',
              data: finalMonths.map((m) => monthBuckets[m].tci),
              backgroundColor: TIER_COLORS[2],
              borderRadius: 4,
              stack: 'pub_stack',
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'bar',
              label: 'อื่นๆ',
              data: finalMonths.map((m) => monthBuckets[m].other),
              backgroundColor: TIER_COLORS[3],
              borderRadius: 4,
              stack: 'pub_stack',
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line',
              label: 'เงินสนับสนุนการตีพิมพ์ (บาท)',
              data: finalMonths.map((m) => monthBuckets[m].budget),
              borderColor: '#FDA4AF',
              backgroundColor: 'rgba(253, 164, 175, 0.22)',
              borderWidth: 2.5,
              tension: 0.35,
              fill: false,
              pointRadius: 4.5,
              pointHoverRadius: 6,
              pointBackgroundColor: '#FB7185',
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
              const m = finalMonths[hit.index];
              const b = monthBuckets[m];
              if (b && b.items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `ผลงานตีพิมพ์ทางวิชาการ: เดือน ${m}`,
                  subtitle: `รวม ${b.items.length} เรื่อง (นานาชาติ ระดับ 1: ${b.q1}, ระดับ 2: ${b.q2}, ระดับชาติ: ${b.tci}) • เงินสนับสนุน ${b.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: '#6EE7B7',
                  items: b.items,
                });
              }
            }
          },
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
              type: 'linear',
              position: 'left',
              stacked: true,
              beginAtZero: true,
              grace: '15%',
              ticks: { stepSize: 1 },
              title: { display: true, text: 'จำนวนผลงาน (เรื่อง)' },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '20%',
              title: { display: true, text: 'เงินสนับสนุน (บาท)' },
              grid: { drawOnChartArea: false },
            },
          },
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            datalabels: {
              anchor: (ctx: any) => (ctx.dataset.type === 'line' ? 'end' : 'center'),
              align: (ctx: any) => (ctx.dataset.type === 'line' ? 'top' : 'center'),
              color: (ctx: any) => (ctx.dataset.type === 'line' ? '#be123c' : '#1e293b'),
              font: { weight: 'bold', size: 10 },
              formatter: (v: number, ctx: any) => {
                if (v <= 0) return '';
                if (ctx.dataset.type === 'line') return `${(v / 1000).toFixed(0)} พันบ.`;
                return `${v}`;
              },
            },
          },
        },
      });

      // 2. Level Doughnut
      const activeLevels = Object.values(levelGroups).filter((g) => g.count > 0);
      createChart('c_pub_level', {
        type: 'doughnut',
        data: {
          labels: activeLevels.map((g) => g.label),
          datasets: [
            {
              data: activeLevels.map((g) => g.count),
              backgroundColor: activeLevels.map((g) => g.color),
              borderWidth: 2,
              borderColor: '#ffffff',
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
              if (grp) {
                setDrillDown({
                  isOpen: true,
                  title: `ผลงานตีพิมพ์: ${grp.label}`,
                  subtitle: `รวมทั้งสิ้น ${grp.count} เรื่อง`,
                  accentColor: grp.color,
                  items: grp.items,
                });
              }
            }
          },
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11.5 } } },
            datalabels: {
              color: '#1e293b',
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
          labels: sortedDepts.map((d) => formatChartDeptLabel(d.code || d.name)),
          datasets: [
            {
              type: 'bar',
              label: 'ผลงานตีพิมพ์ทั้งหมด (เรื่อง)',
              data: sortedDepts.map((d) => d.count),
              backgroundColor: sortedDepts.map((d) => getDepartmentColor(d.code)),
              borderRadius: 6,
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'bar',
              label: 'วารสารนานาชาติชั้นนำ (เรื่อง)',
              data: sortedDepts.map((d) => d.q1Count),
              backgroundColor: '#7DD3FC',
              borderRadius: 6,
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line',
              label: 'เงินสนับสนุนรวม (พันบาท)',
              data: sortedDepts.map((d) => Number((d.budget / 1000).toFixed(1))),
              borderColor: '#FDA4AF',
              backgroundColor: 'rgba(253, 164, 175, 0.22)',
              borderWidth: 2.5,
              tension: 0.35,
              pointRadius: 4.5,
              pointBackgroundColor: '#FB7185',
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
              const d = sortedDepts[hit.index];
              if (d) {
                if (onSelectDept) onSelectDept(d.code);
                setDrillDown({
                  isOpen: true,
                  title: `ผลงานตีพิมพ์: ${d.name}`,
                  subtitle: `รวม ${d.count} เรื่อง • วารสารนานาชาติชั้นนำ: ${d.q1Count} เรื่อง • เงินสนับสนุน ${d.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: getDepartmentColor(d.code),
                  items: d.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: true, position: 'top' },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: (ctx: any) => (ctx.dataset.type === 'line' ? '#be123c' : '#0f172a'),
              font: { weight: 'bold', size: 10 },
              formatter: (v: number, ctx: any) => {
                if (v <= 0) return '';
                if (ctx.dataset.type === 'line') return `${v} พันบ.`;
                return `${v}`;
              },
            },
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              grace: '20%',
              title: { display: true, text: 'จำนวนผลงาน (เรื่อง)' },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '25%',
              title: { display: true, text: 'เงินสนับสนุน (พันบาท)' },
              grid: { drawOnChartArea: false },
            },
            x: { grid: { display: false } },
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
      {/* Perspective Dimension Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ffffff',
          padding: '8px 12px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', marginRight: '6px' }}>
          มิติการวิเคราะห์:
        </span>
        {[
          { id: 'quartile_timeline', label: 'คุณภาพวารสารและแนวโน้มรายเดือน', icon: <FaAward /> },
          { id: 'department', label: 'การผลิตผลงานรายภาควิชา', icon: <FaBuilding /> },
          { id: 'faculty', label: 'อาจารย์และนักวิจัยตีพิมพ์สูงสุด', icon: <FaUserTie /> },
          { id: 'journals', label: 'วารสารและแหล่งตีพิมพ์ยอดนิยม', icon: <FaBookOpen /> },
          { id: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์และเป้าหมายความยั่งยืน', icon: <FaLeaf /> },
        ].map((tab) => {
          const isSel = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePerspective(tab.id as PubPerspective)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSel ? '1px solid #fda4af' : '1px solid #e2e8f0',
                backgroundColor: isSel ? '#ffe4e6' : '#ffffff',
                color: isSel ? '#be123c' : '#475569',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '11.5px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DIMENSION 1: Quartile & Timeline */}
      {activePerspective === 'quartile_timeline' && (
        <div className="chart-grid">
          <div className="chart-card">
            <h3>
              <FaChartBar style={{ color: '#fb7185' }} /> จำนวนผลงานตีพิมพ์รายเดือน (แยกระดับคุณภาพ) เทียบกับเงินสนับสนุน
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_pub_monthly" />
            </div>
          </div>

          <div className="chart-card">
            <h3>
              <FaChartPie style={{ color: '#34d399' }} /> สัดส่วนผลงานตามระดับฐานข้อมูลวารสาร
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_pub_level" />
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
              เปรียบเทียบผลงานตีพิมพ์ทั้งหมด วารสารนานาชาติชั้นนำ และเงินสนับสนุนรายภาควิชา
            </h3>
          </div>
          <div style={{ height: '340px' }}>
            <canvas id="c_pub_dept" />
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
              เรียงลำดับตามจำนวนผลงานและสัดส่วนวารสารนานาชาติชั้นนำ
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>อาจารย์ / นักวิจัย</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>ภาควิชา</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>ผลงานทั้งหมด</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>วารสารนานาชาติ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>วารสารระดับชาติ</th>
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
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>
                      <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        {a.count} เรื่อง
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#00A651' }}>
                      {a.q1q2 > 0 ? `${a.q1q2} เรื่อง` : '-'}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#0284c7', fontWeight: 600 }}>
                      {a.tci > 0 ? `${a.tci} เรื่อง` : '-'}
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
                  <th style={{ padding: '10px 12px', textAlign: 'center', width: '160px' }}>ระดับคุณภาพวารสาร</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', width: '110px' }}>จำนวนผลงาน</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>รายการผลงาน</th>
                </tr>
              </thead>
              <tbody>
                {topJournalsRanking.map((j, idx) => {
                  const tierLabel =
                    j.tier === 'Q1'
                      ? 'นานาชาติ ระดับ 1'
                      : j.tier === 'Q2'
                      ? 'นานาชาติ ระดับ 2'
                      : j.tier === 'TCI 1'
                      ? 'ระดับชาติ กลุ่ม 1'
                      : j.tier === 'TCI 2'
                      ? 'ระดับชาติ กลุ่ม 2'
                      : j.tier;
                  return (
                  <tr
                    key={idx}
                    onClick={() => {
                      setDrillDown({
                        isOpen: true,
                        title: `ผลงานตีพิมพ์: ${j.journal}`,
                        subtitle: `${tierLabel} • รวม ${j.count} เรื่อง`,
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
                        {tierLabel}
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
                            subtitle: `${tierLabel} • รวม ${j.count} เรื่อง`,
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
                );
                })}
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
