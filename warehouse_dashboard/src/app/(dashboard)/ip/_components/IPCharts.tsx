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
      // 1. 7-Department Stacked Bar Chart (AE, ME, FE, CE, IRE, CPE, IE)
      const ALL_DEPTS = ['AE', 'ME', 'FE', 'CE', 'IRE', 'CPE', 'IE'];
      const deptGranted = Array(7).fill(0);
      const deptPending = Array(7).fill(0);
      const deptInPrep = Array(7).fill(0);

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
          }
        });
      });

      createChart('c_ip_dept_stacked', {
        type: 'bar',
        data: {
          labels: ALL_DEPTS,
          datasets: [
            {
              label: 'ได้รับความคุ้มครองแล้ว',
              data: deptGranted,
              backgroundColor: '#10b981',
              borderRadius: 4,
              stack: 'stack1',
            },
            {
              label: 'ยื่นคำขอแล้ว',
              data: deptPending,
              backgroundColor: '#0ea5e9',
              borderRadius: 4,
              stack: 'stack1',
            },
            {
              label: 'เตรียมความพร้อมยื่นจด',
              data: deptInPrep,
              backgroundColor: '#f59e0b',
              borderRadius: 4,
              stack: 'stack1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
              stacked: true,
              beginAtZero: true,
              title: { display: true, text: 'จำนวนรายการ IP' },
            },
          },
          plugins: {
            legend: { position: 'top' },
            datalabels: {
              color: '#ffffff',
              font: { weight: 'bold', size: 10 },
              formatter: (v: number) => (v > 0 ? `${v}` : ''),
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
          labels: ['1. งานเตรียมพร้อม (Pipeline)', '2. ยื่นคำขอแล้ว (Applied)', '3. ได้รับคุ้มครอง (Granted)'],
          datasets: [
            {
              label: 'จำนวนรายการ',
              data: [totalAll, appliedCount, grantedCount],
              backgroundColor: ['#fed7aa', '#bae6fd', '#a7f3d0'],
              borderColor: ['#f59e0b', '#0ea5e9', '#10b981'],
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
                const pct = ((v / totalAll) * 100).toFixed(1);
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
              backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b'],
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
              formatter: (v: number) => (v > 0 ? `${v} (${((v / validIpData.length) * 100).toFixed(1)}%)` : ''),
            },
          },
        },
      });

      // Fiscal Year trend
      const fyCounts: Record<string, number> = { '2568': 0, '2569': 0, '2570': 0 };
      validIpData.forEach((d) => {
        const y = d._fiscalYear || '2568';
        if (fyCounts[y] !== undefined) fyCounts[y]++;
      });
      createChart('c_ip_fy_trend', {
        type: 'bar',
        data: {
          labels: ['ปีงบ 2568', 'ปีงบ 2569', 'ปีงบ 2570'],
          datasets: [
            {
              label: 'จำนวนทรัพย์สินทางปัญญา',
              data: [fyCounts['2568'], fyCounts['2569'], fyCounts['2570']],
              backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'รายการ' } },
            x: { grid: { display: false } },
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#6d28d9',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => `${v} รายการ`,
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
              backgroundColor: ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'],
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
              backgroundColor: ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b'],
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
              formatter: (v: number) => (strategyMetric === 'count' ? `${v} รายการ` : `${v.toLocaleString()} ฿`),
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
          { id: 'types_dept', label: 'ภาพรวมสถานะ & 7 ภาควิชา (Pipeline & Funnel)', icon: <FaChartBar /> },
          { id: 'protection_status', label: 'การติดตามขั้นตอน & หมายเลขคำขอ', icon: <FaCertificate /> },
          { id: 'faculty', label: 'ผู้ประดิษฐ์ชั้นนำ & กลุ่มเทคโนโลยี (Tech Clusters)', icon: <FaUserTie /> },
          { id: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs / ISEE / IAM)', icon: <FaLeaf /> },
        ].map((tab) => {
          const isSel = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePerspective(tab.id as IPPerspective)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSel ? '1.5px solid #8b5cf6' : '1px solid #cbd5e1',
                backgroundColor: isSel ? '#f5f3ff' : '#ffffff',
                color: isSel ? '#6d28d9' : '#475569',
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

      {/* DIMENSION 1: Pipeline & 7-Department Stacked Bar + Funnel */}
      {activePerspective === 'types_dept' && (
        <div className="chart-grid">
          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaBuilding style={{ color: '#8b5cf6', marginRight: '6px' }} /> การกระจายตัวตาม 7 ภาควิชา x สถานะ 3 ระดับ
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
              AE (9), ME (6), FE (5), CE (1) • 🚨 IRE, CPE, IE มีผลงานเป็น "0" แสดงโอกาสขยายผล
            </p>
            <div className="chart-wrapper">
              <canvas id="c_ip_dept_stacked" />
            </div>
          </div>

          <div className="chart-card">
            <h3 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaFilter style={{ color: '#8b5cf6', marginRight: '6px' }} /> IP Conversion Funnel (กระบวนการแปลงผลงาน)
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
              อัตราความสำเร็จจากยื่นคำขอด่านแรกสู่การได้รับคุ้มครอง (Grant Rate) สูงถึง <strong>72.7%</strong>
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
              <FaCertificate style={{ color: '#8b5cf6', marginRight: '6px' }} /> ความพร้อมของหมายเลขคำขอ / เลขทะเบียน
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_ip_readiness" />
            </div>
          </div>

          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaCertificate style={{ color: '#8b5cf6', marginRight: '6px' }} /> แนวโน้มการสร้างสรรค์ผลงานตามปีงบประมาณ
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
                Top 10 Active Inventors Leaderboard
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                นักประดิษฐ์ผู้สร้างสรรค์ทรัพย์สินทางปัญญาสูงสุดของคณะฯ
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '40px' }}>#</th>
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
                        {inv.support > 0 ? `${inv.support.toLocaleString('th-TH')} ฿` : '-'}
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
              <FaLightbulb style={{ color: '#8b5cf6', marginRight: '6px' }} /> Technology & Innovation Domain Clusters
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
              การจัดกลุ่มคลัสเตอร์เทคโนโลยีจากชื่อผลงานการประดิษฐ์จริง
            </p>
            <div className="chart-wrapper">
              <canvas id="c_ip_clusters" />
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
                <FaLeaf style={{ color: '#8b5cf6', marginRight: '6px' }} /> ยุทธศาสตร์ ISEE & ค่านิยม IAM
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
