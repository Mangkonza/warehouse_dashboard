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
} from 'react-icons/fa';
import { IPItem } from '../_hooks/useIPData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';

interface IPChartsProps {
  validIpData: IPItem[];
  onSelectDept?: (deptCode: string) => void;
  onSelectType?: (typeName: string) => void;
}

export type IPPerspective = 'types_dept' | 'protection_status' | 'faculty' | 'sdg';

export function IPCharts({
  validIpData,
  onSelectDept,
  onSelectType,
}: IPChartsProps) {
  const router = useRouter();
  const [activePerspective, setActivePerspective] = useState<IPPerspective>('types_dept');
  const [strategyMetric, setStrategyMetric] = useState<'count' | 'budget'>('count');
  const chartInstances = useRef<Chart[]>([]);
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

  // Calculate top inventors
  const topInventors = useMemo(() => {
    const map: Record<string, { creator: string; person_id?: number | string; dept: string; count: number; support: number; items: IPItem[] }> = {};
    validIpData.forEach((item) => {
      const cName = String(item.creator || '').trim();
      if (!cName || cName === '-' || cName === 'nan') return;

      const pId = item.person_id;
      const key = pId ? `id_${pId}` : cName;
      if (!map[key]) {
        map[key] = {
          creator: cName,
          person_id: pId,
          dept: item.department || '-',
          count: 0,
          support: 0,
          items: [],
        };
      }
      map[key].count++;
      map[key].support += Number(item.support_amount) || 0;
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.count - a.count || b.support - a.support);
  }, [validIpData]);

  // Technology cluster groups
  const techClusters = useMemo(() => {
    const groups: Record<string, { cluster: string; count: number; items: IPItem[] }> = {};
    validIpData.forEach((item) => {
      const c = item._techCluster || 'นวัตกรรมวิศวกรรมอื่นๆ';
      if (!groups[c]) groups[c] = { cluster: c, count: 0, items: [] };
      groups[c].count++;
      groups[c].items.push(item);
    });
    return Object.values(groups).sort((a, b) => b.count - a.count);
  }, [validIpData]);

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

    if (activePerspective === 'types_dept') {
      // 1. 7-Department Stacked Bar Chart + Support Budget Line
      const ALL_DEPTS = ['AE', 'ME', 'FE', 'CE', 'IRE', 'CPE', 'IE'];
      const ALL_DEPT_LABELS = ['เกษตร', 'เครื่องกล', 'การอาหาร', 'โยธา', 'ชลประทาน', 'คอมพิวเตอร์', 'อุตสาหการ'];
      const deptGranted = Array(7).fill(0);
      const deptPending = Array(7).fill(0);
      const deptInPrep = Array(7).fill(0);
      const deptSupportK = Array(7).fill(0);

      validIpData.forEach((item) => {
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
        const supportVal = (Number(item.support_amount) || 0) / 1000;

        ALL_DEPTS.forEach((code, idx) => {
          if (allDeptStrings.includes(code) || (code === 'AE' && allDeptStrings.includes('เกษตร')) ||
              (code === 'ME' && allDeptStrings.includes('เครื่องกล')) ||
              (code === 'FE' && allDeptStrings.includes('อาหาร')) ||
              (code === 'CE' && allDeptStrings.includes('โยธา')) ||
              (code === 'IRE' && allDeptStrings.includes('ชลประทาน')) ||
              (code === 'CPE' && allDeptStrings.includes('คอมพิวเตอร์')) ||
              (code === 'IE' && allDeptStrings.includes('อุตสาหการ'))) {
            if (item._pipelineStage === 'granted') deptGranted[idx]++;
            else if (item._pipelineStage === 'pending') deptPending[idx]++;
            else deptInPrep[idx]++;
            deptSupportK[idx] += supportVal;
          }
        });
      });

      createChart('c_ip_dept_stacked', {
        type: 'bar',
        data: {
          labels: ALL_DEPT_LABELS,
          datasets: [
            {
              type: 'bar',
              label: 'ได้รับความคุ้มครองแล้ว',
              data: deptGranted,
              backgroundColor: '#86EFAC',
              borderRadius: 4,
              stack: 'stack1',
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'bar',
              label: 'ยื่นคำขอแล้ว',
              data: deptPending,
              backgroundColor: '#93C5FD',
              borderRadius: 4,
              stack: 'stack1',
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'bar',
              label: 'เตรียมความพร้อมยื่นจด',
              data: deptInPrep,
              backgroundColor: '#FDE68A',
              borderRadius: 4,
              stack: 'stack1',
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line',
              label: 'เงินสนับสนุนรวม (พันบาท)',
              data: deptSupportK,
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
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
              type: 'linear',
              position: 'left',
              stacked: true,
              beginAtZero: true,
              grace: '20%',
              title: { display: true, text: 'จำนวนรายการทรัพย์สินทางปัญญา' },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '25%',
              title: { display: true, text: 'เงินสนับสนุน (พันบาท)' },
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
                if (ctx.dataset.type === 'line') return `${v} พันบ.`;
                return `${v}`;
              },
            },
          },
        },
      });

      // 2. IP Conversion Funnel Chart (Horizontal Bar simulating funnel)
      const totalAll = validIpData.length;
      const grantedCount = validIpData.filter((i) => i._pipelineStage === 'granted').length;
      const appliedCount = grantedCount + validIpData.filter((i) => i._pipelineStage === 'pending').length;

      createChart('c_ip_funnel', {
        type: 'bar',
        data: {
          labels: ['1. ขั้นเตรียมความพร้อม', '2. ขั้นยื่นคำขอคุ้มครอง', '3. ขั้นได้รับความคุ้มครอง'],
          datasets: [
            {
              label: 'จำนวนรายการ',
              data: [totalAll, appliedCount, grantedCount],
              backgroundColor: ['#FDE68A', '#BAE6FD', '#A7F3D0'],
              borderColor: ['#FCD34D', '#7DD3FC', '#6EE7B7'],
              borderWidth: 1.5,
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          scales: {
            x: { beginAtZero: true, max: 24, title: { display: true, text: 'จำนวนรายการ' } },
            y: { grid: { display: false } },
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: '#0f172a',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => {
                const pct = totalAll > 0 ? ((v / totalAll) * 100).toFixed(1) : '0.0';
                return `${v} รายการ (${pct}%)`;
              },
            },
          },
        },
      });
    }

    if (activePerspective === 'protection_status') {
      // Readiness & Registration
      let hasReg = 0;
      let hasReqOnly = 0;
      let noReq = 0;
      validIpData.forEach((d) => {
        if (d.registration_number && d.registration_number !== '-' && d.registration_number !== 'nan') hasReg++;
        else if (d.application_number && d.application_number !== '-' && d.application_number !== 'nan') hasReqOnly++;
        else noReq++;
      });

      createChart('c_ip_readiness', {
        type: 'doughnut',
        data: {
          labels: ['มีเลขทะเบียนคุ้มครองสมบูรณ์', 'มีเฉพาะเลขที่คำขอ', 'รอหมายเลขคำขอ'],
          datasets: [
            {
              data: [hasReg, hasReqOnly, noReq],
              backgroundColor: ['#86EFAC', '#93C5FD', '#FDE68A'],
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
              color: '#1e293b',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (v > 0 ? `${v} (${((v / validIpData.length) * 100).toFixed(1)}%)` : ''),
            },
          },
        },
      });

      // Fiscal Year trend Combo Chart (Count Bar + Support Amount Line)
      const fyCounts: Record<string, number> = { '2568': 0, '2569': 0, '2570': 0 };
      const fySupportK: Record<string, number> = { '2568': 0, '2569': 0, '2570': 0 };
      validIpData.forEach((d) => {
        const y = d._fiscalYear || '2568';
        if (fyCounts[y] !== undefined) {
          fyCounts[y]++;
          fySupportK[y] += (Number(d.support_amount) || 0) / 1000;
        }
      });
      createChart('c_ip_fy_trend', {
        type: 'bar',
        data: {
          labels: ['ปี พ.ศ. 2568', 'ปี พ.ศ. 2569', 'ปี พ.ศ. 2570'],
          datasets: [
            {
              type: 'bar',
              label: 'จำนวนทรัพย์สินทางปัญญา (รายการ)',
              data: [fyCounts['2568'], fyCounts['2569'], fyCounts['2570']],
              backgroundColor: ['#C4B5FD', '#DDD6FE', '#EDE9FE'],
              borderColor: ['#A78BFA', '#C4B5FD', '#DDD6FE'],
              borderWidth: 1.5,
              borderRadius: 6,
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line',
              label: 'เงินสนับสนุนรวม (พันบาท)',
              data: [fySupportK['2568'], fySupportK['2569'], fySupportK['2570']],
              borderColor: '#6EE7B7',
              backgroundColor: 'rgba(110, 231, 183, 0.22)',
              borderWidth: 2.5,
              tension: 0.35,
              pointRadius: 4.5,
              pointBackgroundColor: '#34D399',
              yAxisID: 'y1',
              order: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              grace: '20%',
              title: { display: true, text: 'จำนวนผลงาน (รายการ)' },
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
          plugins: {
            legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: (ctx: any) => (ctx.dataset.type === 'line' ? '#047857' : '#5b21b6'),
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number, ctx: any) => {
                if (v <= 0) return '';
                if (ctx.dataset.type === 'line') return `${v} พันบ.`;
                return `${v} รายการ`;
              },
            },
          },
        },
      });
    }

    if (activePerspective === 'faculty') {
      // Tech Clusters Horizontal Bar
      createChart('c_ip_clusters', {
        type: 'bar',
        data: {
          labels: techClusters.map((c) => c.cluster),
          datasets: [
            {
              label: 'จำนวนผลงาน',
              data: techClusters.map((c) => c.count),
              backgroundColor: ['#C4B5FD', '#93C5FD', '#86EFAC', '#FDE68A', '#F9A8D4'],
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
              formatter: (v: number) => `${v} รายการ`,
            },
          },
          scales: {
            x: { beginAtZero: true, max: 12 },
            y: { grid: { display: false } },
          },
        },
      });
    }

    if (activePerspective === 'sdg') {
      // Strategic & Core Values Combo Chart (Count Bar + Support Amount Line)
      const totalSupportK = validIpData.reduce((sum, d) => sum + (Number(d.support_amount) || 0), 0) / 1000;
      const iseeInnovateCount = validIpData.length;
      const iseeExcellenceCount = validIpData.filter((d) => d._pipelineStage === 'granted').length;
      const iamAgilityCount = validIpData.filter((d) => String(d.type || '').includes('อนุสิทธิบัตร')).length;
      const iamMasteryCount = validIpData.filter((d) => (Number(d.support_amount) || 0) > 0).length;

      const countData = [iseeInnovateCount, iamAgilityCount, iseeExcellenceCount, iamMasteryCount];
      const budgetDataK = [
        totalSupportK,
        validIpData.filter((d) => String(d.type || '').includes('อนุสิทธิบัตร')).reduce((s, d) => s + (Number(d.support_amount) || 0), 0) / 1000,
        validIpData.filter((d) => d._pipelineStage === 'granted').reduce((s, d) => s + (Number(d.support_amount) || 0), 0) / 1000,
        totalSupportK,
      ];

      createChart('c_ip_isee_iam', {
        type: 'bar',
        data: {
          labels: ['ด้านการสร้างสรรค์นวัตกรรม', 'หลักความคล่องตัวและยืดหยุ่น', 'ด้านความเป็นเลิศทางวิชาการ', 'หลักความเชี่ยวชาญในวิชาชีพ'],
          datasets: [
            {
              type: 'bar',
              label: 'จำนวนผลงาน (รายการ)',
              data: countData,
              backgroundColor: ['#C4B5FD', '#93C5FD', '#86EFAC', '#FDE68A'],
              borderRadius: 6,
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line',
              label: 'งบสนับสนุนรวม (พันบาท)',
              data: budgetDataK,
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
          plugins: {
            legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: (ctx: any) => (ctx.dataset.type === 'line' ? '#be123c' : '#0f172a'),
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number, ctx: any) => {
                if (v <= 0) return '';
                if (ctx.dataset.type === 'line') return `${v} พันบ.`;
                return `${v} รายการ`;
              },
            },
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              grace: '20%',
              title: { display: true, text: 'จำนวนผลงาน (รายการ)' },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '25%',
              title: { display: true, text: 'งบสนับสนุน (พันบาท)' },
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
  }, [validIpData, activePerspective, strategyMetric, techClusters]);

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
          { id: 'types_dept', label: 'ภาพรวมสถานะและ 7 ภาควิชา', icon: <FaChartBar /> },
          { id: 'protection_status', label: 'การติดตามขั้นตอนและหมายเลขคำขอ', icon: <FaCertificate /> },
          { id: 'faculty', label: 'ผู้ประดิษฐ์ชั้นนำและกลุ่มเทคโนโลยี', icon: <FaUserTie /> },
          { id: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์และความยั่งยืน', icon: <FaLeaf /> },
        ].map((tab) => {
          const isSel = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePerspective(tab.id as IPPerspective)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSel ? '1.5px solid #a78bfa' : '1px solid #cbd5e1',
                backgroundColor: isSel ? '#f5f3ff' : '#ffffff',
                color: isSel ? '#6d28d9' : '#475569',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
              }}
            >
              <span style={{ fontSize: '11.5px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DIMENSION 1: Pipeline & 7-Department Stacked Bar + Funnel */}
      {activePerspective === 'types_dept' && (
        <div className="chart-grid">
          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaBuilding style={{ color: '#a78bfa', marginRight: '6px' }} /> การกระจายตัวตาม 7 ภาควิชา และสถานะ 3 ระดับ
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
              เกษตร (9), เครื่องกล (6), การอาหาร (5), โยธา (1) • ชลประทาน, คอมพิวเตอร์, อุตสาหการ มีโอกาสขยายผลเพิ่มเติม
            </p>
            <div className="chart-wrapper">
              <canvas id="c_ip_dept_stacked" />
            </div>
          </div>

          <div className="chart-card">
            <h3 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaFilter style={{ color: '#a78bfa', marginRight: '6px' }} /> ลำดับขั้นการแปลงผลงานสู่การคุ้มครองสิทธิ์
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
              อัตราความสำเร็จจากยื่นคำขอด่านแรกสู่การได้รับความคุ้มครองสูงถึง <strong>72.7%</strong>
            </p>
            <div className="chart-wrapper">
              <canvas id="c_ip_funnel" />
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Application Tracking & Timeline */}
      {activePerspective === 'protection_status' && (
        <div className="chart-grid">
          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaCertificate style={{ color: '#a78bfa', marginRight: '6px' }} /> ความพร้อมของหมายเลขคำขอและเลขทะเบียน
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_ip_readiness" />
            </div>
          </div>

          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaCertificate style={{ color: '#a78bfa', marginRight: '6px' }} /> แนวโน้มการสร้างสรรค์ผลงานตามปี พ.ศ.
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_ip_fy_trend" />
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 3: Faculty & Tech Clusters */}
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
                ทำเนียบนักประดิษฐ์ดีเด่น 10 อันดับแรก
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                นักประดิษฐ์ผู้สร้างสรรค์ทรัพย์สินทางปัญญาสูงสุดของคณะฯ
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '40px' }}>ลำดับ</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>นักประดิษฐ์</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>ภาควิชา</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>ผลงาน</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>เงินสนับสนุน</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '70px' }}>แฟ้ม</th>
                  </tr>
                </thead>
                <tbody>
                  {topInventors.slice(0, 10).map((inv, idx) => (
                    <tr
                      key={`top-inv-${inv.person_id || inv.creator || idx}`}
                      style={{ borderBottom: '1px solid #f1f5f9' }}
                    >
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: idx < 3 ? '#7c3aed' : '#64748b' }}>
                        {idx + 1}
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
                        {inv.support > 0 ? `${inv.support.toLocaleString('th-TH')} บาท` : '-'}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
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

          <div className="chart-card">
            <h3 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaLightbulb style={{ color: '#a78bfa', marginRight: '6px' }} /> กลุ่มเทคโนโลยีและสาขานวัตกรรม
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
              การจัดกลุ่มเทคโนโลยีจากชื่อผลงานการประดิษฐ์จริง
            </p>
            <div className="chart-wrapper">
              <canvas id="c_ip_clusters" />
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 4: Strategic Alignment */}
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
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaLeaf style={{ color: '#a78bfa', marginRight: '6px' }} /> ยุทธศาสตร์มหาวิทยาลัยและค่านิยมองค์กร เทียบกับงบสนับสนุน
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>
              เปรียบเทียบจำนวนผลงานและงบประมาณสนับสนุนในแต่ละด้านยุทธศาสตร์และค่านิยมองค์กร
            </p>
            <div className="chart-wrapper">
              <canvas id="c_ip_isee_iam" />
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
        categoryKey="ip"
      />
    </div>
  );
}
