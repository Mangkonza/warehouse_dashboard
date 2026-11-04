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
  FaLeaf,
  FaChevronRight,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { ServiceItem } from '../_hooks/useServiceData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';

interface ServiceChartsProps {
  validData: ServiceItem[];
  onSelectDept?: (deptCode: string) => void;
  onSelectType?: (typeName: string) => void;
  onSelectPerson?: (personName: string) => void;
}

export type ServicePerspective = 'timeline_type' | 'department' | 'faculty' | 'sdg';

export function ServiceCharts({
  validData,
  onSelectDept,
  onSelectType,
  onSelectPerson,
}: ServiceChartsProps) {
  const router = useRouter();
  const [activePerspective, setActivePerspective] = useState<ServicePerspective>('timeline_type');
  const [timelineMode, setTimelineMode] = useState<'activities' | 'staff'>('activities');
  const [strategyMetric, setStrategyMetric] = useState<'activities' | 'targets' | 'staff'>('activities');
  const chartInstances = useRef<Chart[]>([]);
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

  // Calculate top contributors
  const topServiceFaculty = useMemo(() => {
    const map: Record<string, { name: string; person_id?: number | string; dept: string; count: number; hours: number; targets: Set<string>; items: ServiceItem[] }> = {};
    validData.forEach((item) => {
      const pName = String(item.person || '').trim();
      if (!pName || pName === '-' || pName === 'nan') return;

      const pId = item.person_id;
      const key = pId ? `id_${pId}` : pName;
      if (!map[key]) {
        map[key] = {
          name: pName,
          person_id: pId,
          dept: item.department || '-',
          count: 0,
          hours: 0,
          targets: new Set<string>(),
          items: [],
        };
      }
      map[key].count++;
      map[key].hours += Number(item.hours_spent) || 0;
      if (item.target_group && item.target_group !== '-' && item.target_group !== 'nan') {
        map[key].targets.add(item.target_group);
      }
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.count - a.count || b.hours - a.hours);
  }, [validData]);

  // Workload tiers
  const workloadTiers = useMemo(() => {
    let t1 = 0; // 1-2
    let t2 = 0; // 3-5
    let t3 = 0; // 6-10
    let t4 = 0; // >10 (Champions)
    topServiceFaculty.forEach((f) => {
      if (f.count <= 2) t1++;
      else if (f.count <= 5) t2++;
      else if (f.count <= 10) t3++;
      else t4++;
    });
    return [
      { tier: '1–2 ครั้ง/ปี (ส่วนใหญ่)', count: t1, pct: topServiceFaculty.length > 0 ? ((t1 / topServiceFaculty.length) * 100).toFixed(1) : '0' },
      { tier: '3–5 ครั้ง/ปี', count: t2, pct: topServiceFaculty.length > 0 ? ((t2 / topServiceFaculty.length) * 100).toFixed(1) : '0' },
      { tier: '6–10 ครั้ง/ปี', count: t3, pct: topServiceFaculty.length > 0 ? ((t3 / topServiceFaculty.length) * 100).toFixed(1) : '0' },
      { tier: '> 10 ครั้ง/ปี (Champions)', count: t4, pct: topServiceFaculty.length > 0 ? ((t4 / topServiceFaculty.length) * 100).toFixed(1) : '0' },
    ];
  }, [topServiceFaculty]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_AMBER = '#f59e0b';
    const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthlyCount = Array(12).fill(0);
    const monthlyStaffSets: Set<string>[] = Array.from({ length: 12 }, () => new Set<string>());
    const monthlyItems: ServiceItem[][] = Array.from({ length: 12 }, () => []);

    const roleGroups: Record<string, { label: string; count: number; items: ServiceItem[] }> = {};
    const deptMap: Record<string, { code: string; name: string; count: number; staffSet: Set<string>; items: ServiceItem[] }> = {};

    validData.forEach((item) => {
      // Date handling
      if (item.date) {
        const str = String(item.date).trim();
        let mIdx = -1;
        const dObj = new Date(str.replace('1968', '2025').replace('1969', '2026').replace('2568', '2025').replace('2569', '2026'));
        if (!isNaN(dObj.getTime())) {
          mIdx = dObj.getMonth();
        } else {
          THAI_MONTHS.forEach((tm, idx) => {
            if (str.includes(tm) || str.includes(tm.replace('.', ''))) {
              mIdx = idx;
            }
          });
        }
        if (mIdx >= 0 && mIdx < 12) {
          monthlyCount[mIdx]++;
          if (item.person && item.person !== '-' && item.person !== 'nan') {
            monthlyStaffSets[mIdx].add(item.person);
          }
          monthlyItems[mIdx].push(item);
        }
      }

      // Smart role group
      const r = item._smartRole || item.service_type || 'งานบริการวิชาการอื่นๆ';
      if (!roleGroups[r]) roleGroups[r] = { label: r, count: 0, items: [] };
      roleGroups[r].count++;
      roleGroups[r].items.push(item);

      // Dept group
      const dept = getDepartment(item.department);
      const code = dept.code !== '-' ? dept.code : 'OTH';
      if (!deptMap[code]) {
        deptMap[code] = { code, name: dept.name, count: 0, staffSet: new Set<string>(), items: [] };
      }
      deptMap[code].count++;
      if (item.person && item.person !== '-' && item.person !== 'nan') {
        deptMap[code].staffSet.add(item.person);
      }
      deptMap[code].items.push(item);
    });

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'timeline_type') {
      // 1. Monthly Area Chart
      const monthlyStaffCount = monthlyStaffSets.map((s) => s.size);
      const isStaffMode = timelineMode === 'staff';
      const chartData = isStaffMode ? monthlyStaffCount : monthlyCount;
      const chartLabel = isStaffMode ? 'จำนวนบุคลากรที่มีส่วนร่วม' : 'จำนวนครั้งที่ให้บริการ';
      const chartUnit = isStaffMode ? 'ท่าน' : 'ครั้ง';

      createChart('c_sv_timeline', {
        type: 'line',
        data: {
          labels: THAI_MONTHS,
          datasets: [
            {
              label: chartLabel,
              data: chartData,
              borderColor: C_AMBER,
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              borderWidth: 2.5,
              tension: 0.35,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: C_AMBER,
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
              const m = THAI_MONTHS[hit.index];
              const items = monthlyItems[hit.index] || [];
              if (items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `งานบริการวิชาการ: เดือน ${m}`,
                  subtitle: `รวม ${items.length} กิจกรรม • บุคลากร ${monthlyStaffSets[hit.index].size} ท่าน`,
                  accentColor: C_AMBER,
                  items,
                });
              }
            }
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: chartUnit } },
            x: { grid: { display: false } },
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#78350f',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (v > 0 ? `${v}` : ''),
            },
          },
        },
      });

      // 2. Smart Activity Breakdown Horizontal Bar
      const sortedRoles = Object.values(roleGroups).sort((a, b) => b.count - a.count);
      const ROLE_PALETTE = ['#f59e0b', '#0ea5e9', '#10b981', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'];

      createChart('c_sv_roles', {
        type: 'bar',
        data: {
          labels: sortedRoles.map((r) => r.label),
          datasets: [
            {
              label: 'จำนวนงาน',
              data: sortedRoles.map((r) => r.count),
              backgroundColor: sortedRoles.map((_, i) => ROLE_PALETTE[i % ROLE_PALETTE.length]),
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
              const r = sortedRoles[hit.index];
              if (r) {
                if (onSelectType) onSelectType(r.label);
                setDrillDown({
                  isOpen: true,
                  title: `บทบาทงาน: ${r.label}`,
                  subtitle: `รวมทั้งสิ้น ${r.count} งาน`,
                  accentColor: ROLE_PALETTE[hit.index % ROLE_PALETTE.length],
                  items: r.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: '#0f172a',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => `${v} งาน`,
            },
          },
          scales: {
            x: { beginAtZero: true, title: { display: true, text: 'จำนวนงาน' } },
            y: { grid: { display: false } },
          },
        },
      });
    }

    if (activePerspective === 'department') {
      const sortedDepts = Object.values(deptMap).sort((a, b) => b.count - a.count);

      // Left: Combo bar & line
      createChart('c_sv_dept_combo', {
        type: 'bar',
        data: {
          labels: sortedDepts.map((d) => d.code),
          datasets: [
            {
              type: 'bar',
              label: 'จำนวนงานบริการ',
              data: sortedDepts.map((d) => d.count),
              backgroundColor: sortedDepts.map((d) => getDepartmentColor(d.code)),
              borderRadius: 6,
              yAxisID: 'y',
            },
            {
              type: 'line',
              label: 'บุคลากรที่ออกงาน',
              data: sortedDepts.map((d) => d.staffSet.size),
              borderColor: '#f43f5e',
              backgroundColor: '#f43f5e',
              borderWidth: 2.5,
              pointRadius: 4,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'จำนวนงาน (กิจกรรม)' },
              beginAtZero: true,
            },
            y1: {
              type: 'linear',
              position: 'right',
              title: { display: true, text: 'จำนวนบุคลากร (ท่าน)' },
              beginAtZero: true,
              grid: { drawOnChartArea: false },
            },
            x: { grid: { display: false } },
          },
          plugins: {
            legend: { display: true, position: 'top' },
            datalabels: {
              display: (ctx: any) => ctx.datasetIndex === 0,
              anchor: 'end',
              align: 'top',
              color: '#0f172a',
              font: { weight: 'bold', size: 10 },
              formatter: (v: number) => `${v}`,
            },
          },
        },
      });

      // Right: Workload per person
      const avgPerStaffData = sortedDepts.map((d) => {
        const staffCount = d.staffSet.size || 1;
        return Number((d.count / staffCount).toFixed(1));
      });

      createChart('c_sv_dept_avg', {
        type: 'bar',
        data: {
          labels: sortedDepts.map((d) => d.code),
          datasets: [
            {
              label: 'ภาระงานเฉลี่ย (งาน/ท่าน)',
              data: avgPerStaffData,
              backgroundColor: sortedDepts.map((d) => (d.code === 'ME' ? '#ef4444' : '#0ea5e9')),
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
              color: '#0f172a',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => `${v} งาน/ท่าน`,
            },
          },
          scales: {
            x: { beginAtZero: true, title: { display: true, text: 'เฉลี่ยงานต่อบุคลากร' } },
            y: { grid: { display: false } },
          },
        },
      });
    }

    if (activePerspective === 'faculty') {
      // Workload distribution donut
      createChart('c_sv_workload_tier', {
        type: 'doughnut',
        data: {
          labels: workloadTiers.map((t) => t.tier),
          datasets: [
            {
              data: workloadTiers.map((t) => t.count),
              backgroundColor: ['#94a3b8', '#0ea5e9', '#10b981', '#f59e0b'],
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { position: 'bottom' },
            datalabels: {
              color: '#ffffff',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number, ctx: any) => {
                const pct = workloadTiers[ctx.dataIndex].pct;
                return v > 2 ? `${pct}%` : '';
              },
            },
          },
        },
      });
    }

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
              backgroundColor: ['#f59e0b', '#10b981', '#0ea5e9', '#f43f5e'],
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
              color: '#0f172a',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => `${v} กิจกรรม`,
            },
          },
          scales: {
            x: { beginAtZero: true },
            y: { grid: { display: false } },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData, activePerspective, timelineMode, strategyMetric, workloadTiers]);

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
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', marginRight: '6px' }}>
          มิติการวิเคราะห์:
        </span>
        {[
          { id: 'timeline_type', label: 'แนวโน้มรายเดือน & บทบาทงานบริการ', icon: <FaChartLine /> },
          { id: 'department', label: 'การกระจายตามภาควิชา/ศูนย์ & ภาระงาน', icon: <FaBuilding /> },
          { id: 'faculty', label: 'อาจารย์ผู้ให้บริการวิชาการสูงสุด (Top Contributors)', icon: <FaUserTie /> },
          { id: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs / ISEE / IAM)', icon: <FaLeaf /> },
        ].map((tab) => {
          const isSel = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePerspective(tab.id as ServicePerspective)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSel ? '1.5px solid #f59e0b' : '1px solid #cbd5e1',
                backgroundColor: isSel ? '#fffbeb' : '#ffffff',
                color: isSel ? '#b45309' : '#475569',
                fontSize: '12.5px',
                fontWeight: isSel ? 700 : 500,
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

      {/* DIMENSION 1: Timeline & Types */}
      {activePerspective === 'timeline_type' && (
        <div className="chart-grid">
          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
                <FaChartLine style={{ color: '#f59e0b', marginRight: '6px' }} /> แนวโน้มการให้บริการรายเดือน (ม.ค. - ธ.ค.)
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
                  onClick={() => setTimelineMode('activities')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: timelineMode === 'activities' ? '#ffffff' : 'transparent',
                    color: timelineMode === 'activities' ? '#b45309' : '#64748b',
                    fontWeight: timelineMode === 'activities' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  จำนวนครั้ง
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineMode('staff')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: timelineMode === 'staff' ? '#ffffff' : 'transparent',
                    color: timelineMode === 'staff' ? '#b45309' : '#64748b',
                    fontWeight: timelineMode === 'staff' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  บุคลากรที่ออกงาน
                </button>
              </div>
            </div>
            <div className="chart-wrapper">
              <canvas id="c_sv_timeline" />
            </div>
          </div>

          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaChartBar style={{ color: '#f59e0b', marginRight: '6px' }} /> จำแนกตามบทบาทงานบริการวิชาการ (Smart Breakdown)
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_sv_roles" />
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Department */}
      {activePerspective === 'department' && (
        <div className="chart-grid">
          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaBuilding style={{ color: '#f59e0b', marginRight: '6px' }} /> ปริมาณงานเทียบจำนวนบุคลากรรายภาควิชา/ศูนย์
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_sv_dept_combo" />
            </div>
          </div>

          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaBuilding style={{ color: '#f59e0b', marginRight: '6px' }} /> ภาระงานเฉลี่ยต่อบุคลากร (งาน/ท่าน)
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_sv_dept_avg" />
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 3: Top Service Faculty */}
      {activePerspective === 'faculty' && (
        <div className="chart-grid">
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
                Top 10 Contributors Leaderboard
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                บุคลากรที่ออกให้บริการวิชาการและเชื่อมโยงเครือข่ายภายนอกสูงสุด
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '40px' }}>#</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>บุคลากร</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>ภาควิชา</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>กิจกรรม</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>เครือข่าย</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '80px' }}>แฟ้ม</th>
                  </tr>
                </thead>
                <tbody>
                  {topServiceFaculty.slice(0, 10).map((s, idx) => (
                    <tr
                      key={`top-fac-${s.person_id || s.name || idx}`}
                      style={{ borderBottom: '1px solid #f1f5f9' }}
                    >
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: idx < 3 ? '#b45309' : '#64748b' }}>
                        {idx + 1}
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
                          onClick={() => {
                            if (s.person_id) router.push(`/personnel/${s.person_id}`);
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

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                การกระจายภาระงานบุคลากร (Workload Tiers)
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                สัดส่วนการมีส่วนร่วมของบุคลากร 85 ท่าน
              </p>
            </div>
            <div style={{ height: '280px', marginTop: '12px' }}>
              <canvas id="c_sv_workload_tier" />
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
