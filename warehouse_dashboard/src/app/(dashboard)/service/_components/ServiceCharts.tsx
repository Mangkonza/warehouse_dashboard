'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaBuilding,
  FaUserTie,
  FaLeaf,
  FaClock,
  FaChevronRight,
} from 'react-icons/fa';
import { ServiceItem } from '../_hooks/useServiceData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { HybridSdgCard } from '@/components/data-display';
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
    accentColor: '#e65100',
    items: [],
  });

  // Calculate top service faculty
  const topServiceFaculty = useMemo(() => {
    const map: Record<string, { name: string; person_id?: number | string; dept: string; count: number; hours: number; items: ServiceItem[] }> = {};
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
          items: [],
        };
      }
      map[key].count++;
      map[key].hours += Number(item.hours_spent) || 0;
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.count - a.count || b.hours - a.hours);
  }, [validData]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_SRV = '#e65100';
    const TYPE_COLOR_MAP: Record<string, string> = {
      'ผู้ทรงคุณวุฒิ': '#d97706',
      'วิชาการ': '#059669',
      'วิทยากร/อาจารย์พิเศษ': '#2563eb',
      'วิทยานิพนธ์ภายนอก': '#0d9488',
      'วิชาชีพ': '#7c3aed',
      'ศึกษาดูงาน วศ.กพส.': '#e11d48',
    };

    const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthlyCount = Array(12).fill(0);
    const monthlyHours = Array(12).fill(0);
    const monthlyItems: ServiceItem[][] = Array.from({ length: 12 }, () => []);

    const typeGroups: Record<string, { label: string; count: number; items: ServiceItem[] }> = {};
    const deptGroups: Record<string, { code: string; name: string; count: number; items: ServiceItem[] }> = {};

    validData.forEach((item) => {
      const d = item.date ? new Date(item.date) : null;
      if (d && !isNaN(d.getTime())) {
        const m = d.getMonth();
        monthlyCount[m]++;
        monthlyHours[m] += Number(item.hours_spent) || 0;
        monthlyItems[m].push(item);
      }

      const t = item._resolvedType || item.service_type || item.service_category || 'วิชาการ';
      if (!typeGroups[t]) typeGroups[t] = { label: t, count: 0, items: [] };
      typeGroups[t].count++;
      typeGroups[t].items.push(item);

      const dept = getDepartment(item.department);
      const code = dept.code !== '-' ? dept.code : 'OTH';
      if (!deptGroups[code]) {
        deptGroups[code] = { code, name: dept.name, count: 0, items: [] };
      }
      deptGroups[code].count++;
      deptGroups[code].items.push(item);
    });

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'timeline_type') {
      // 1. Monthly line
      createChart('c_sv_act', {
        type: 'line',
        data: {
          labels: THAI_MONTHS,
          datasets: [
            {
              label: 'จำนวนงานบริการ',
              data: monthlyCount,
              borderColor: C_SRV,
              backgroundColor: 'rgba(230, 81, 0, 0.12)',
              borderWidth: 2.5,
              tension: 0.3,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: C_SRV,
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
                  subtitle: `รวม ${items.length} กิจกรรม • เวลาสะสม ${monthlyHours[hit.index]} ชั่วโมง`,
                  accentColor: C_SRV,
                  items,
                });
              }
            }
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'กิจกรรม' } },
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

      // 2. Service Types Bar
      const sortedTypes = Object.values(typeGroups).sort((a, b) => b.count - a.count);
      createChart('c_sv_type', {
        type: 'bar',
        data: {
          labels: sortedTypes.map((t) => t.label),
          datasets: [
            {
              label: 'จำนวนงาน',
              data: sortedTypes.map((t) => t.count),
              backgroundColor: sortedTypes.map((t) => TYPE_COLOR_MAP[t.label] || '#e65100'),
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
              const t = sortedTypes[hit.index];
              if (t) {
                if (onSelectType) onSelectType(t.label);
                setDrillDown({
                  isOpen: true,
                  title: `งานบริการวิชาการ: ประเภท ${t.label}`,
                  subtitle: `รวมทั้งสิ้น ${t.count} กิจกรรม`,
                  accentColor: TYPE_COLOR_MAP[t.label] || '#e65100',
                  items: t.items,
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
      const sortedDepts = Object.values(deptGroups).sort((a, b) => b.count - a.count);
      createChart('c_sv_dept', {
        type: 'bar',
        data: {
          labels: sortedDepts.map((d) => d.code),
          datasets: [
            {
              label: 'จำนวนงานบริการ',
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
                setDrillDown({
                  isOpen: true,
                  title: `งานบริการวิชาการ: ภาควิชา ${d.name} (${d.code})`,
                  subtitle: `รวมทั้งสิ้น ${d.count} กิจกรรม`,
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
              align: 'top',
              color: '#0f172a',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => `${v} งาน`,
            },
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'งาน' } },
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
          { id: 'timeline_type', label: 'แนวโน้มรายเดือน & ประเภทงานบริการ', icon: <FaChartLine /> },
          { id: 'department', label: 'การกระจายตามภาควิชา/ศูนย์', icon: <FaBuilding /> },
          { id: 'faculty', label: 'อาจารย์ผู้ให้บริการวิชาการสูงสุด', icon: <FaUserTie /> },
          { id: 'sdg', label: 'เป้าหมายการพัฒนาที่ยั่งยืน (SDG)', icon: <FaLeaf /> },
        ].map((tab) => {
          const isSel = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePerspective(tab.id as ServicePerspective)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSel ? '1.5px solid #e65100' : '1px solid #cbd5e1',
                backgroundColor: isSel ? '#e65100' : '#ffffff',
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

      {/* DIMENSION 1: Timeline & Types */}
      {activePerspective === 'timeline_type' && (
        <div className="chart-grid">
          <div className="chart-card">
            <h3>
              <FaChartLine style={{ color: '#e65100' }} /> จำนวนงานบริการวิชาการรายเดือน
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_sv_act" />
            </div>
          </div>
          <div className="chart-card">
            <h3>
              <FaChartBar style={{ color: '#e65100' }} /> จำแนกตามประเภทงานบริการวิชาการ
            </h3>
            <div className="chart-wrapper">
              <canvas id="c_sv_type" />
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
              จำนวนงานบริการวิชาการจำแนกตามภาควิชา/ศูนย์ฯ
            </h3>
          </div>
          <div style={{ height: '320px' }}>
            <canvas id="c_sv_dept" />
          </div>
        </div>
      )}

      {/* DIMENSION 3: Top Service Faculty */}
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
              จัดอันดับอาจารย์และบุคลากรผู้ให้บริการวิชาการสูงสุด (Top Service Contributors)
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              เรียงตามจำนวนกิจกรรมที่ให้บริการและชั่วโมงการทำงานสะสม
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>อาจารย์ / บุคลากร</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>ภาควิชา / หน่วยงาน</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>จำนวนกิจกรรม</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>ชั่วโมงสะสม</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>แฟ้มผลงาน</th>
                </tr>
              </thead>
              <tbody>
                {topServiceFaculty.slice(0, 15).map((s, idx) => (
                  <tr
                    key={`service-top-fac-${s.person_id || s.name || idx}-${idx}`}
                    onClick={() => {
                      if (s.person_id) router.push(`/personnel/${s.person_id}`);
                      else router.push(`/personnel?q=${encodeURIComponent(s.name)}`);
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
                      {s.name}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <DepartmentBadge value={s.dept} />
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>
                      <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#fffbeb', color: '#d97706' }}>
                        {s.count} กิจกรรม
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                      {s.hours > 0 ? `${s.hours} ชม.` : '-'}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (s.person_id) router.push(`/personnel/${s.person_id}`);
                          else router.push(`/personnel?q=${encodeURIComponent(s.name)}`);
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#d97706',
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
          categoryKey="service"
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
        categoryKey="service"
      />
    </div>
  );
}
