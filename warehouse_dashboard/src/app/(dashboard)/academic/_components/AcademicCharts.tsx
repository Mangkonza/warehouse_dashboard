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
  FaLayerGroup,
} from 'react-icons/fa';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { AcademicItem } from '../_hooks/useAcademicData';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';

interface AcademicChartsProps {
  validData: AcademicItem[];
  totalAllocFaculty: number;
  totalAllocDept: number;
  totalAllocKu: number;
  totalAllocRemaining: number;
  hideMissingClient?: boolean;
  onSelectClient?: (clientName: string) => void;
}

export type AcademicPerspective = 'timeline_alloc' | 'client_segment' | 'faculty' | 'sdg';

export function AcademicCharts({
  validData,
  totalAllocFaculty,
  totalAllocDept,
  totalAllocKu,
  totalAllocRemaining,
  hideMissingClient = false,
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

  // Calculate contract size tiers
  const contractSizeData = useMemo(() => {
    const tiers = [
      { key: 't1', label: '< 1 ล้านบาท', min: 0, max: 1000000, count: 0, total: 0, items: [] as AcademicItem[] },
      { key: 't2', label: '1 - 5 ล้านบาท', min: 1000000, max: 5000000, count: 0, total: 0, items: [] as AcademicItem[] },
      { key: 't3', label: '5 - 10 ล้านบาท', min: 5000000, max: 10000000, count: 0, total: 0, items: [] as AcademicItem[] },
      { key: 't4', label: '≥ 10 ล้านบาท', min: 10000000, max: Infinity, count: 0, total: 0, items: [] as AcademicItem[] },
    ];

    validData.forEach((item) => {
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      for (const tier of tiers) {
        if (b >= tier.min && (tier.max === Infinity || b < tier.max)) {
          tier.count++;
          tier.total += b;
          tier.items.push(item);
          break;
        }
      }
    });

    return tiers;
  }, [validData]);

  // Calculate client segments
  const clientSegments = useMemo(() => {
    const segments: Record<string, { key: string; label: string; count: number; budget: number; items: AcademicItem[] }> = {
      gov: { key: 'gov', label: 'หน่วยงานภาครัฐ / กรม / กระทรวง', count: 0, budget: 0, items: [] },
      state_enterprise: { key: 'state_enterprise', label: 'รัฐวิสาหกิจ', count: 0, budget: 0, items: [] },
      private: { key: 'private', label: 'ภาคเอกชน / บริษัทมหาชน', count: 0, budget: 0, items: [] },
      independent: { key: 'independent', label: 'องค์กรอิสระ / อื่นๆ', count: 0, budget: 0, items: [] },
      unspecified: { key: 'unspecified', label: 'รอระบุข้อมูลผู้ว่าจ้าง', count: 0, budget: 0, items: [] },
    };

    validData.forEach((item) => {
      const raw = String(item.client || '').trim();
      const c = raw.toLowerCase();
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;

      if (!raw || raw === '-' || raw === 'nan' || raw === 'ไม่ระบุ') {
        segments.unspecified.count++;
        segments.unspecified.budget += b;
        segments.unspecified.items.push(item);
      } else if (c.includes('กรม') || c.includes('กระทรวง') || c.includes('สำนักงาน') || c.includes('เทศบาล') || c.includes('อบต') || c.includes('อบจ') || c.includes('ภาครัฐ')) {
        segments.gov.count++;
        segments.gov.budget += b;
        segments.gov.items.push(item);
      } else if (c.includes('การไฟฟ้า') || c.includes('การประปา') || c.includes('การทาง') || c.includes('ปตท') || c.includes('รัฐวิสาหกิจ')) {
        segments.state_enterprise.count++;
        segments.state_enterprise.budget += b;
        segments.state_enterprise.items.push(item);
      } else if (c.includes('บริษัท') || c.includes('จำกัด') || c.includes('บมจ') || c.includes('corp') || c.includes('ltd') || c.includes('ผู้ประกอบการ')) {
        segments.private.count++;
        segments.private.budget += b;
        segments.private.items.push(item);
      } else if (c.includes('มูลนิธิ') || c.includes('สมาคม')) {
        segments.independent.count++;
        segments.independent.budget += b;
        segments.independent.items.push(item);
      } else {
        segments.unspecified.count++;
        segments.unspecified.budget += b;
        segments.unspecified.items.push(item);
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

    const C_ACA = '#0EA5E9';
    const ALLOC_COLORS = ['#0EA5E9', '#10B981', '#059669', '#8B5CF6'];

    const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthlyCount = Array(M.length).fill(0);
    const monthlyBudget = Array(M.length).fill(0);
    const monthlyItems: AcademicItem[][] = Array.from({ length: M.length }, () => []);
    const clientGroups: Record<string, { name: string; budget: number; count: number; items: AcademicItem[] }> = {};

    validData.forEach((item) => {
      const budget = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      const mStr = item.normalizedMonth || String(item.month || '').trim();
      const monthMap: Record<string, number> = {
        'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
        'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11,
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
      // 1. Monthly Combo Chart (Bar count + Line budget)
      const monthlyBudgetM = monthlyBudget.map((b) => Number((b / 1000000).toFixed(2)));
      createChart('c_ac_monthly_combo', {
        type: 'bar',
        data: {
          labels: M,
          datasets: [
            {
              type: 'bar',
              label: 'จำนวนโครงการ (โครงการ)',
              data: monthlyCount,
              backgroundColor: 'rgba(56, 189, 248, 0.55)',
              borderColor: '#0284c7',
              borderWidth: 1.5,
              borderRadius: 6,
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line',
              label: 'งบประมาณ (ล้านบาท)',
              data: monthlyBudgetM,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2.5,
              tension: 0.35,
              pointRadius: 4.5,
              pointHoverRadius: 6,
              pointBackgroundColor: '#10B981',
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
              const m = M[hit.index];
              const items = monthlyItems[hit.index] || [];
              if (items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `โครงการพัฒนาวิชาการ: เดือน ${m}`,
                  subtitle: `รวม ${items.length} โครงการ • งบประมาณรวม ${items.reduce((s, it) => s + (Number(it.budget) || 0), 0).toLocaleString('th-TH')} บาท`,
                  accentColor: '#0ea5e9',
                  items,
                });
              }
            }
          },
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11.5, weight: 500 }, padding: 10 } },
            datalabels: {
              display: (ctx: any) => {
                const val = ctx.dataset.data[ctx.dataIndex];
                return val > 0;
              },
              anchor: 'end',
              align: 'top',
              offset: (ctx: any) => (ctx.dataset.type === 'line' ? 3 : 1),
              color: (ctx: any) => (ctx.dataset.type === 'line' ? '#047857' : '#0369a1'),
              font: { weight: 'bold', size: 10 },
              formatter: (v: number, ctx: any) => {
                if (ctx.dataset.type === 'line') return `${v.toFixed(1)} ลบ.`;
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
              title: { display: true, text: 'จำนวนโครงการ' },
              ticks: { stepSize: 2 },
              grid: { color: '#f1f5f9' },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '25%',
              title: { display: true, text: 'ล้านบาท' },
              grid: { drawOnChartArea: false },
            },
            x: { grid: { display: false } },
          },
        },
      });

      // 2. Contract Size Tiers Chart
      const TIER_COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#A78BFA'];
      createChart('c_ac_contract_tiers', {
        type: 'bar',
        data: {
          labels: contractSizeData.map((t) => t.label),
          datasets: [
            {
              label: 'จำนวนโครงการ (โครงการ)',
              data: contractSizeData.map((t) => t.count),
              backgroundColor: TIER_COLORS,
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
              const tier = contractSizeData[hit.index];
              if (tier) {
                const totalAcB = validData.reduce((s, it) => s + (Number(it.budget) || 0), 0);
                const pct = totalAcB > 0 ? ((tier.total / totalAcB) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `สัญญาพัฒนาวิชาการ: ขนาดมูลค่า ${tier.label}`,
                  subtitle: `สัดส่วน ${pct}% ของมูลค่าทั้งหมด • รวม ${tier.count} โครงการ • งบประมาณรวม ${tier.total.toLocaleString('th-TH')} บาท`,
                  accentColor: TIER_COLORS[hit.index % TIER_COLORS.length],
                  items: tier.items,
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
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number, ctx: any) => {
                const tier = contractSizeData[ctx.dataIndex];
                if (v <= 0) return '';
                return `${v} โครงการ (${(tier.total / 1000000).toFixed(1)} ลบ.)`;
              },
            },
          },
          scales: {
            y: { beginAtZero: true, grace: '25%', title: { display: true, text: 'จำนวนโครงการ' } },
            x: { grid: { display: false } },
          },
        },
      });

      // 3. Top Clients Bar
      const clientList = Object.values(clientGroups)
        .filter((c) => !hideMissingClient || (c.name !== 'ไม่ระบุหน่วยงาน' && c.name !== '-'))
        .sort((a, b) => b.budget - a.budget)
        .slice(0, 7);

      createChart('c_ac_client', {
        type: 'bar',
        data: {
          labels: clientList.map((c) => {
            const clean = c.name.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
            return clean.length > 24 ? clean.substring(0, 22) + '...' : clean;
          }),
          datasets: [
            {
              label: 'งบประมาณ (ล้านบาท)',
              data: clientList.map((c) => Number((c.budget / 1000000).toFixed(2))),
              backgroundColor: '#38BDF8',
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
              const cl = clientList[hit.index];
              if (cl) {
                if (onSelectClient) onSelectClient(cl.name);
                setDrillDown({
                  isOpen: true,
                  title: `โครงการพัฒนาวิชาการ: ${cl.name.replace(/\r?\n/g, ' ')}`,
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
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number) => (v > 0 ? `${v} ลบ.` : ''),
            },
          },
          scales: {
            x: { beginAtZero: true, grace: '25%', title: { display: true, text: 'ล้านบาท' } },
            y: { grid: { display: false } },
          },
        },
      });

      // 4. Academic Projects by Department
      const deptMap: Record<string, { code: string; name: string; budget: number; count: number; items: AcademicItem[] }> = {};
      validData.forEach((item) => {
        const dInfo = getDepartment(item.department);
        const code = dInfo.code !== '-' ? dInfo.code : 'OTH';
        if (!deptMap[code]) {
          deptMap[code] = { code, name: dInfo.name, budget: 0, count: 0, items: [] };
        }
        const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
        deptMap[code].budget += b;
        deptMap[code].count++;
        deptMap[code].items.push(item);
      });
      const sortedDepts = Object.values(deptMap).sort((a, b) => b.budget - a.budget);

      createChart('c_ac_dept', {
        type: 'bar',
        data: {
          labels: sortedDepts.map((d) => d.code),
          datasets: [
            {
              label: 'งบประมาณพัฒนาวิชาการ (ล้านบาท)',
              data: sortedDepts.map((d) => Number((d.budget / 1000000).toFixed(2))),
              backgroundColor: sortedDepts.map((d) => getDepartmentColor(d.code)),
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
              const d = sortedDepts[hit.index];
              if (d) {
                const totalAcB = validData.reduce((s, it) => s + (Number(it.budget) || 0), 0);
                const pct = totalAcB > 0 ? ((d.budget / totalAcB) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `โครงการพัฒนาวิชาการ: ภาควิชา${d.name} (${d.code})`,
                  subtitle: `สัดส่วน ${pct}% ของมูลค่าทั้งหมด • รวม ${d.count} โครงการ • งบประมาณรวม ${d.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: getDepartmentColor(d.code),
                  items: d.items,
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
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number, ctx: any) => {
                const d = sortedDepts[ctx.dataIndex];
                return `${v} ลบ. (${d?.count || 0} เรื่อง)`;
              },
            },
          },
          scales: {
            x: { beginAtZero: true, grace: '25%', title: { display: true, text: 'ล้านบาท' } },
            y: { grid: { display: false } },
          },
        },
      });
    }

    if (activePerspective === 'client_segment') {
      const displaySegments = hideMissingClient
        ? clientSegments.filter((s) => s.key !== 'unspecified')
        : clientSegments;

      createChart('c_ac_segment_bar', {
        type: 'bar',
        data: {
          labels: displaySegments.map((s) => s.label),
          datasets: [
            {
              label: 'งบประมาณรวม (ล้านบาท)',
              data: displaySegments.map((s) => Number((s.budget / 1000000).toFixed(2))),
              backgroundColor: ['#0284c7', '#00A651', '#f59e0b', '#8b5cf6', '#94a3b8'],
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
              const displaySegments = hideMissingClient ? clientSegments.filter((s) => s.key !== 'unspecified') : clientSegments;
              const seg = displaySegments[hit.index];
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
          { id: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs / ISEE / IAM)', icon: <FaLeaf /> },
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
                <FaChartLine style={{ color: '#0284c7' }} /> แนวโน้มจำนวนโครงการและงบประมาณพัฒนาวิชาการรายเดือน
              </h3>
              <div className="chart-wrapper">
                <canvas id="c_ac_monthly_combo" />
              </div>
            </div>
            <div className="chart-card">
              <h3>
                <FaLayerGroup style={{ color: '#059669' }} /> การกระจายตัวตามขนาดมูลค่าสัญญา (Contract Size Tiers)
              </h3>
              <div className="chart-wrapper">
                <canvas id="c_ac_contract_tiers" />
              </div>
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-card">
              <h3>
                <FaHandshake style={{ color: '#0284c7' }} /> อันดับหน่วยงานผู้ว่าจ้างสูงสุด
              </h3>
              <div className="chart-wrapper">
                <canvas id="c_ac_client" />
              </div>
            </div>
            <div className="chart-card">
              <h3>
                <FaBuilding style={{ color: '#00A651' }} /> งบประมาณโครงการพัฒนาวิชาการตามภาควิชา
              </h3>
              <div className="chart-wrapper">
                <canvas id="c_ac_dept" />
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
            <table className="data-table table-sky" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>
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
        <StrategicAlignmentMatrix
          items={validData}
          categoryKey="academic"
          missionTitle="โครงการพัฒนาวิชาการ"
          unitLabel="โครงการ"
          showBudget={true}
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
