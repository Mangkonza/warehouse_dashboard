'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaCoins,
  FaBuilding,
  FaUserTie,
  FaLeaf,
  FaChevronRight,
  FaHandshake,
} from 'react-icons/fa';
import { AcademicItem } from '../_hooks/useAcademicData';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { HybridSdgCard } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';

interface AcademicChartsProps {
  validData: AcademicItem[];
  totalAllocFaculty: number;
  totalAllocDept: number;
  totalAllocKu: number;
  totalAllocRemaining: number;
  onSelectClient?: (clientName: string) => void;
}

export type AcademicPerspective = 'timeline_alloc' | 'client_segment' | 'faculty' | 'sdg';

export function AcademicCharts({
  validData,
  totalAllocFaculty,
  totalAllocDept,
  totalAllocKu,
  totalAllocRemaining,
  onSelectClient,
}: AcademicChartsProps) {
  const router = useRouter();
  const [activePerspective, setActivePerspective] = useState<AcademicPerspective>('timeline_alloc');
  const chartInstances = useRef<Chart[]>([]);
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
    accentColor: '#1565c0',
    items: [],
  });

  // Calculate top academic project leads
  const facultyLeadsRanking = useMemo(() => {
    const map: Record<string, { head: string; head_id?: number | string; count: number; totalBudget: number; clients: Set<string>; items: AcademicItem[] }> = {};
    validData.forEach((item) => {
      const headName = String(item.head || '').replace('\n', ' ').trim();
      if (!headName || headName === '-' || headName === 'nan') return;

      const key = item.head_id ? `id_${item.head_id}` : headName;
      if (!map[key]) {
        map[key] = {
          head: headName,
          head_id: item.head_id,
          count: 0,
          totalBudget: 0,
          clients: new Set(),
          items: [],
        };
      }
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      map[key].count++;
      map[key].totalBudget += b;
      if (item.client) map[key].clients.add(item.client);
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.totalBudget - a.totalBudget);
  }, [validData]);

  // Calculate client segments (Government, State Enterprise, Private, Public Org)
  const clientSegments = useMemo(() => {
    const segments: Record<string, { label: string; count: number; budget: number; items: AcademicItem[] }> = {
      gov: { label: 'หน่วยงานภาครัฐ / กรม / กระทรวง', count: 0, budget: 0, items: [] },
      state_enterprise: { label: 'รัฐวิสาหกิจ', count: 0, budget: 0, items: [] },
      private: { label: 'ภาคเอกชน / บริษัทมหาชน', count: 0, budget: 0, items: [] },
      other: { label: 'องค์กรอิสระ / อื่นๆ', count: 0, budget: 0, items: [] },
    };

    validData.forEach((item) => {
      const c = String(item.client || '').toLowerCase();
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;

      if (c.includes('กรม') || c.includes('กระทรวง') || c.includes('สำนักงาน') || c.includes('เทศบาล') || c.includes('อบต') || c.includes('อบจ')) {
        segments.gov.count++;
        segments.gov.budget += b;
        segments.gov.items.push(item);
      } else if (c.includes('การไฟฟ้า') || c.includes('การประปา') || c.includes('การทาง') || c.includes('ปตท') || c.includes('รัฐวิสาหกิจ')) {
        segments.state_enterprise.count++;
        segments.state_enterprise.budget += b;
        segments.state_enterprise.items.push(item);
      } else if (c.includes('บริษัท') || c.includes('จำกัด') || c.includes('บมจ') || c.includes('corp') || c.includes('ltd')) {
        segments.private.count++;
        segments.private.budget += b;
        segments.private.items.push(item);
      } else {
        segments.other.count++;
        segments.other.budget += b;
        segments.other.items.push(item);
      }
    });

    return Object.values(segments);
  }, [validData]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_ACA = '#1565c0';
    const ALLOC_COLORS = ['#0284c7', '#00A651', '#059669', '#6a1b9a'];

    const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.'];
    const monthlyCount = Array(M.length).fill(0);
    const monthlyBudget = Array(M.length).fill(0);
    const monthlyItems: AcademicItem[][] = Array.from({ length: M.length }, () => []);
    const clientGroups: Record<string, { name: string; budget: number; count: number; items: AcademicItem[] }> = {};

    validData.forEach((item) => {
      const budget = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      const mStr = String(item.month || '').trim();
      const monthMap: Record<string, number> = {
        'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4,
        'มิ.ย.': 5, 'ก.ค.': 6, 'ก.ย.': 7, 'ต.ค.': 8, 'พ.ย.': 9,
      };

      if (monthMap[mStr] !== undefined) {
        const mIdx = monthMap[mStr];
        monthlyCount[mIdx] += 1;
        monthlyBudget[mIdx] += budget;
        monthlyItems[mIdx].push(item);
      }

      let client = String(item.client || '').trim();
      if (!client || client === 'nan' || client === '-') client = 'ไม่ระบุหน่วยงาน';
      if (!clientGroups[client]) {
        clientGroups[client] = { name: client, budget: 0, count: 0, items: [] };
      }
      clientGroups[client].budget += budget;
      clientGroups[client].count += 1;
      clientGroups[client].items.push(item);
    });

    const sortedClients = Object.values(clientGroups)
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 7);

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'timeline_alloc') {
      // 1. Monthly count
      createChart('c_ac_cnt', {
        type: 'line',
        data: {
          labels: M,
          datasets: [
            {
              label: 'จำนวนโครงการ',
              data: monthlyCount,
              borderColor: C_ACA,
              backgroundColor: 'rgba(21, 101, 192, 0.12)',
              borderWidth: 2.5,
              tension: 0.3,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: C_ACA,
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
              const m = M[hit.index];
              const items = monthlyItems[hit.index] || [];
              if (items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `โครงการพัฒนาวิชาการ: เดือน ${m}`,
                  subtitle: `รวม ${items.length} โครงการ • งบประมาณรวม ${items.reduce((s, it) => s + (Number(it.budget) || 0), 0).toLocaleString('th-TH')} บาท`,
                  accentColor: C_ACA,
                  items,
                });
              }
            }
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'โครงการ' }, ticks: { stepSize: 2 } },
            x: { grid: { display: false } },
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#0f172a',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (v > 0 ? v : ''),
            },
          },
        },
      });

      // 2. Monthly budget
      const monthlyBudgetM = monthlyBudget.map((b) => Number((b / 1000000).toFixed(2)));
      createChart('c_ac_bud', {
        type: 'line',
        data: {
          labels: M,
          datasets: [
            {
              label: 'งบประมาณ (ล้านบาท)',
              data: monthlyBudgetM,
              borderColor: '#00A651',
              backgroundColor: 'rgba(0, 166, 81, 0.12)',
              borderWidth: 2.5,
              tension: 0.3,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: '#00A651',
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
              const m = M[hit.index];
              const items = monthlyItems[hit.index] || [];
              if (items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `งบประมาณพัฒนาวิชาการ: เดือน ${m}`,
                  subtitle: `รวม ${items.length} โครงการ • งบประมาณรวม ${items.reduce((s, it) => s + (Number(it.budget) || 0), 0).toLocaleString('th-TH')} บาท`,
                  accentColor: '#00A651',
                  items,
                });
              }
            }
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'ล้านบาท' } },
            x: { grid: { display: false } },
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#0f172a',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (v > 0 ? `${v} ลบ.` : ''),
            },
          },
        },
      });

      // 3. Allocation Doughnut
      createChart('c_ac_alloc', {
        type: 'doughnut',
        data: {
          labels: ['เข้าคณะ (5%)', 'เข้าภาควิชา (5%)', 'เข้ามหาวิทยาลัย (5%)', 'ส่วนเหลือดำเนินโครงการ (85%)'],
          datasets: [
            {
              data: [totalAllocFaculty, totalAllocDept, totalAllocKu, totalAllocRemaining],
              backgroundColor: ALLOC_COLORS,
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
              const labels = ['เข้าคณะ (5%)', 'เข้าภาควิชา (5%)', 'เข้ามหาวิทยาลัย (5%)', 'ส่วนเหลือดำเนินโครงการ (85%)'];
              setDrillDown({
                isOpen: true,
                title: `การจัดสรรงบประมาณ: ${labels[hit.index] || 'สัดส่วน'}`,
                subtitle: `รวมทั้งสิ้น ${validData.length} โครงการ`,
                accentColor: ALLOC_COLORS[hit.index % ALLOC_COLORS.length] || '#1565c0',
                items: validData,
              });
            }
          },
          plugins: {
            datalabels: {
              color: '#ffffff',
              font: { weight: 'bold', size: 11 },
              formatter: (value: number, context: any) => {
                const sum = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const pct = (value * 100) / (sum || 1);
                return pct >= 4 ? `${pct.toFixed(0)}%` : '';
              },
            },
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11.5 } } },
          },
        },
      });

      // 4. Top Clients Bar
      createChart('c_ac_client', {
        type: 'bar',
        data: {
          labels: sortedClients.map((c) => (c.name.length > 20 ? c.name.substring(0, 18) + '...' : c.name)),
          datasets: [
            {
              label: 'งบประมาณ (ล้านบาท)',
              data: sortedClients.map((c) => Number((c.budget / 1000000).toFixed(2))),
              backgroundColor: '#0284c7',
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
              const cl = sortedClients[hit.index];
              if (cl) {
                if (onSelectClient) onSelectClient(cl.name);
                setDrillDown({
                  isOpen: true,
                  title: `โครงการพัฒนาวิชาการ: ${cl.name}`,
                  subtitle: `รวม ${cl.count} โครงการ • งบประมาณ ${cl.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: '#0284c7',
                  items: cl.items,
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
              formatter: (v: number) => (v > 0 ? `${v} ลบ.` : ''),
            },
          },
          scales: {
            x: { beginAtZero: true, title: { display: true, text: 'ล้านบาท' } },
            y: { grid: { display: false } },
          },
        },
      });
    }

    if (activePerspective === 'client_segment') {
      createChart('c_ac_segment_bar', {
        type: 'bar',
        data: {
          labels: clientSegments.map((s) => s.label),
          datasets: [
            {
              label: 'งบประมาณรวม (ล้านบาท)',
              data: clientSegments.map((s) => Number((s.budget / 1000000).toFixed(2))),
              backgroundColor: ['#0284c7', '#00A651', '#d97706', '#64748b'],
              borderRadius: 8,
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
              const seg = clientSegments[hit.index];
              if (seg) {
                setDrillDown({
                  isOpen: true,
                  title: `โครงการพัฒนาวิชาการ: กลุ่ม${seg.label}`,
                  subtitle: `รวม ${seg.count} โครงการ • งบประมาณ ${seg.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: '#0284c7',
                  items: seg.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#0f172a',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (v > 0 ? `${v} ลบ.` : ''),
            },
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'ล้านบาท' } },
            x: { grid: { display: false } },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData, activePerspective, totalAllocFaculty, totalAllocDept, totalAllocKu, totalAllocRemaining, clientSegments]);

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
          { id: 'timeline_alloc', label: 'แนวโน้มรายเดือน & การจัดสรรรายรับ', icon: <FaCoins /> },
          { id: 'client_segment', label: 'กลุ่มประเภทผู้ว่าจ้าง & ตลาด', icon: <FaHandshake /> },
          { id: 'faculty', label: 'หัวหน้าโครงการพัฒนาวิชาการ', icon: <FaUserTie /> },
          { id: 'sdg', label: 'เป้าหมายการพัฒนาที่ยั่งยืน (SDG)', icon: <FaLeaf /> },
        ].map((tab) => {
          const isSel = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePerspective(tab.id as AcademicPerspective)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSel ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                backgroundColor: isSel ? '#0284c7' : '#ffffff',
                color: isSel ? '#ffffff' : '#475569',
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

      {/* DIMENSION 1: Timeline & Allocation */}
      {activePerspective === 'timeline_alloc' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="chart-grid">
            <div className="chart-card">
              <h3>
                <FaChartLine style={{ color: '#1565c0' }} /> จำนวนโครงการพัฒนาวิชาการรายเดือน
              </h3>
              <div className="chart-wrapper">
                <canvas id="c_ac_cnt" />
              </div>
            </div>
            <div className="chart-card">
              <h3>
                <FaChartLine style={{ color: '#00A651' }} /> งบประมาณโครงการพัฒนาวิชาการรายเดือน (ล้านบาท)
              </h3>
              <div className="chart-wrapper">
                <canvas id="c_ac_bud" />
              </div>
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-card">
              <h3>
                <FaChartPie style={{ color: '#1565c0' }} /> สัดส่วนการจัดสรรงบประมาณจริง (85% : 5% : 5% : 5%)
              </h3>
              <div className="chart-wrapper">
                <canvas id="c_ac_alloc" />
              </div>
            </div>
            <div className="chart-card">
              <h3>
                <FaChartBar style={{ color: '#1565c0' }} /> หน่วยงานผู้ขอรับบริการหลัก (Top Clients)
              </h3>
              <div className="chart-wrapper">
                <canvas id="c_ac_client" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Client & Industry Segmentation */}
      {activePerspective === 'client_segment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                มูลค่าโครงการจำแนกตามกลุ่มประเภทหน่วยงานผู้ว่าจ้าง
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                เปรียบเทียบสัดส่วนระหว่างหน่วยงานภาครัฐ รัฐวิสาหกิจ และภาคเอกชน
              </p>
            </div>
            <div style={{ height: '300px' }}>
              <canvas id="c_ac_segment_bar" />
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 3: Top Academic Project Leads */}
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
              จัดอันดับอาจารย์หัวหน้าโครงการพัฒนาวิชาการ (Top Academic Leads)
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              อาจารย์ผู้บริหารจัดการสัญญาโครงการพัฒนาวิชาการที่มีมูลค่าสูงสุด
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>หัวหน้าโครงการ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>จำนวนโครงการ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบประมาณสัญญารวม</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>หน่วยงานผู้ว่าจ้าง</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>แฟ้มผลงาน</th>
                </tr>
              </thead>
              <tbody>
                {facultyLeadsRanking.map((f, idx) => (
                  <tr
                    key={`faculty-lead-${f.head_id || f.head || idx}-${idx}`}
                    onClick={() => {
                      if (f.head_id) router.push(`/personnel/${f.head_id}`);
                      else router.push(`/personnel?q=${encodeURIComponent(f.head)}`);
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
                      {f.head}
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
                        onClick={() => {
                          if (f.head_id) router.push(`/personnel/${f.head_id}`);
                          else router.push(`/personnel?q=${encodeURIComponent(f.head)}`);
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIMENSION 4: UN SDGs */}
      {activePerspective === 'sdg' && (
        <HybridSdgCard
          items={validData}
          categoryKey="academic"
          title="เป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs)"
        />
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
