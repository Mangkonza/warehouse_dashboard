'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartBar,
  FaChartPie,
  FaCertificate,
  FaBuilding,
  FaUserTie,
  FaShieldAlt,
  FaLeaf,
  FaChevronRight,
} from 'react-icons/fa';
import { IPItem } from '../_hooks/useIPData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { HybridSdgCard } from '@/components/data-display';
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
    accentColor: '#6a1b9a',
    items: [],
  });

  // Calculate top inventors
  const topInventors = useMemo(() => {
    const map: Record<string, { creator: string; person_id?: number | string; dept: string; count: number; patents: number; pettyPatents: number; copyrights: number; items: IPItem[] }> = {};
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
          patents: 0,
          pettyPatents: 0,
          copyrights: 0,
          items: [],
        };
      }
      map[key].count++;
      const t = String(item.type || '');
      if (t.includes('สิทธิบัตรการประดิษฐ์') || t.includes('สิทธิบัตรการออกแบบ') || t === 'สิทธิบัตร') {
        map[key].patents++;
      } else if (t.includes('อนุสิทธิบัตร')) {
        map[key].pettyPatents++;
      } else if (t.includes('ลิขสิทธิ์')) {
        map[key].copyrights++;
      }
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [validIpData]);

  // Protection stage breakdown
  const protectionStage = useMemo(() => {
    let registered = 0;
    let pending = 0;
    const regItems: IPItem[] = [];
    const penItems: IPItem[] = [];

    validIpData.forEach((item) => {
      const isReg =
        String(item.status || '').includes('คุ้มครอง') ||
        Boolean(item.registration_number && String(item.registration_number).trim() && item.registration_number !== '-');

      if (isReg) {
        registered++;
        regItems.push(item);
      } else {
        pending++;
        penItems.push(item);
      }
    });

    return { registered, pending, regItems, penItems };
  }, [validIpData]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const deptGroups: Record<string, { code: string; name: string; count: number; items: IPItem[] }> = {};
    const typeGroups: Record<string, { label: string; count: number; items: IPItem[]; color: string }> = {
      'อนุสิทธิบัตร': { label: 'อนุสิทธิบัตร', count: 0, items: [], color: '#6a1b9a' },
      'สิทธิบัตร': { label: 'สิทธิบัตรการประดิษฐ์', count: 0, items: [], color: '#00A651' },
      'ลิขสิทธิ์': { label: 'ลิขสิทธิ์', count: 0, items: [], color: '#0284c7' },
    };

    validIpData.forEach((item) => {
      const rawParts = String(item.department || item.creator || '').split(',');
      const seenCodes = new Set<string>();
      rawParts.forEach((part) => {
        const d = getDepartment(part.trim());
        const code = d.code !== '-' ? d.code : 'OTH';
        if (!seenCodes.has(code)) {
          seenCodes.add(code);
          if (!deptGroups[code]) {
            deptGroups[code] = { code, name: d.name, count: 0, items: [] };
          }
          deptGroups[code].count += 1;
          deptGroups[code].items.push(item);
        }
      });

      const rawType = String(item.type || '').trim();
      let matched = false;
      for (const key of Object.keys(typeGroups)) {
        if (rawType.includes(key)) {
          typeGroups[key].count += 1;
          typeGroups[key].items.push(item);
          matched = true;
          break;
        }
      }
      if (!matched) {
        if (rawType) {
          typeGroups[rawType] = { label: rawType, count: 1, items: [item], color: '#f59e0b' };
        } else {
          typeGroups['อนุสิทธิบัตร'].count += 1;
          typeGroups['อนุสิทธิบัตร'].items.push(item);
        }
      }
    });

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'types_dept') {
      // 1. Dept bar
      const sortedDepts = Object.values(deptGroups).sort((a, b) => b.count - a.count);
      createChart('c_ip_dept', {
        type: 'bar',
        data: {
          labels: sortedDepts.map((d) => d.code),
          datasets: [
            {
              label: 'จำนวนงาน (รายการ)',
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
                  title: `งานทรัพย์สินทางปัญญา: ภาควิชา ${d.name} (${d.code})`,
                  subtitle: `รวมทั้งสิ้น ${d.count} รายการ`,
                  accentColor: getDepartmentColor(d.code),
                  items: d.items,
                });
              }
            }
          },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'รายการ' }, ticks: { stepSize: 1 } },
            x: { grid: { display: false } },
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: '#0f172a',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (v > 0 ? `${v}` : ''),
            },
          },
        },
      });

      // 2. Types doughnut
      const activeTypes = Object.entries(typeGroups).filter(([, val]) => val.count > 0);
      createChart('c_ip_type', {
        type: 'doughnut',
        data: {
          labels: activeTypes.map(([, val]) => val.label),
          datasets: [
            {
              data: activeTypes.map(([, val]) => val.count),
              backgroundColor: activeTypes.map(([, val]) => val.color),
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
              const entry = activeTypes[hit.index];
              if (entry) {
                if (onSelectType) onSelectType(entry[1].label);
                setDrillDown({
                  isOpen: true,
                  title: `งานทรัพย์สินทางปัญญา: ประเภท ${entry[1].label}`,
                  subtitle: `รวมทั้งสิ้น ${entry[1].count} รายการ`,
                  accentColor: entry[1].color,
                  items: entry[1].items,
                });
              }
            }
          },
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11.5 } } },
            datalabels: {
              color: '#ffffff',
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (v > 0 ? `${v} รายการ` : ''),
            },
          },
        },
      });
    }

    if (activePerspective === 'protection_status') {
      createChart('c_ip_protection', {
        type: 'pie',
        data: {
          labels: ['จดทะเบียนได้รับความคุ้มครองแล้ว', 'อยู่ระหว่างยื่นคำขอรับความคุ้มครอง'],
          datasets: [
            {
              data: [protectionStage.registered, protectionStage.pending],
              backgroundColor: ['#00A651', '#d97706'],
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
              const isReg = hit.index === 0;
              const items = isReg ? protectionStage.regItems : protectionStage.penItems;
              setDrillDown({
                isOpen: true,
                title: isReg ? 'งานทรัพย์สินทางปัญญา: จดทะเบียนได้รับความคุ้มครองแล้ว' : 'งานทรัพย์สินทางปัญญา: อยู่ระหว่างยื่นคำขอ',
                subtitle: `รวมทั้งสิ้น ${items.length} รายการ`,
                accentColor: isReg ? '#00A651' : '#d97706',
                items,
              });
            }
          },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } },
            datalabels: {
              color: '#ffffff',
              font: { weight: 'bold', size: 12 },
              formatter: (v: number, ctx: any) => {
                const sum = protectionStage.registered + protectionStage.pending || 1;
                return `${v} รายการ (${((v / sum) * 100).toFixed(0)}%)`;
              },
            },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validIpData, activePerspective, protectionStage]);

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
          { id: 'types_dept', label: 'ประเภททรัพย์สินทางปัญญา & ภาควิชา', icon: <FaCertificate /> },
          { id: 'protection_status', label: 'ขั้นตอน & สถานะการคุ้มครอง', icon: <FaShieldAlt /> },
          { id: 'faculty', label: 'อาจารย์ผู้ประดิษฐ์และสร้างสรรค์สูงสุด', icon: <FaUserTie /> },
          { id: 'sdg', label: 'เป้าหมายการพัฒนาที่ยั่งยืน (SDG)', icon: <FaLeaf /> },
        ].map((tab) => {
          const isSel = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePerspective(tab.id as IPPerspective)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSel ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                backgroundColor: isSel ? '#7c3aed' : '#ffffff',
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

      {/* DIMENSION 1: Types & Dept */}
      {activePerspective === 'types_dept' && (
        <div className="chart-grid">
          <div className="chart-card">
            <h3>
              <FaChartBar style={{ marginRight: 8, color: '#6a1b9a' }} /> จำนวนงานทรัพย์สินทางปัญญาตามภาควิชา
            </h3>
            <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
              <canvas id="c_ip_dept" />
            </div>
          </div>

          <div className="chart-card">
            <h3>
              <FaChartPie style={{ marginRight: 8, color: '#6a1b9a' }} /> สัดส่วนตามประเภททรัพย์สินทางปัญญา
            </h3>
            <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
              <canvas id="c_ip_type" />
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Protection Status */}
      {activePerspective === 'protection_status' && (
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
              สัดส่วนขั้นตอนและสถานะการได้รับความคุ้มครอง
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              จำแนกระหว่างงานที่ได้รับเลขทะเบียนคุ้มครองแล้ว กับงานที่อยู่ระหว่างขั้นตอนยื่นคำขอ
            </p>
          </div>
          <div style={{ height: '300px', cursor: 'pointer' }}>
            <canvas id="c_ip_protection" />
          </div>
        </div>
      )}

      {/* DIMENSION 3: Top Inventors */}
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
              จัดอันดับอาจารย์และนักวิจัยผู้ประดิษฐ์สูงสุด (Top Inventors & Creators)
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              อาจารย์ผู้ยื่นขอรับความคุ้มครองสิทธิบัตร อนุสิทธิบัตร และลิขสิทธิ์
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>ผู้ประดิษฐ์ / เจ้าของผลงาน</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>ภาควิชา</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>รวมผลงาน IP</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>สิทธิบัตร</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>อนุสิทธิบัตร</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>แฟ้มผลงาน</th>
                </tr>
              </thead>
              <tbody>
                {topInventors.map((inv, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 700, color: idx < 3 ? '#b45309' : '#64748b' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                      {inv.creator}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <DepartmentBadge value={inv.dept} />
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>
                      <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                        {inv.count} รายการ
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#00A651' }}>
                      {inv.patents > 0 ? `${inv.patents}` : '-'}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#6a1b9a' }}>
                      {inv.pettyPatents > 0 ? `${inv.pettyPatents}` : '-'}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (inv.person_id) router.push(`/personnel/${inv.person_id}`);
                          else router.push(`/personnel?q=${encodeURIComponent(inv.creator)}`);
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#7c3aed',
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
          items={validIpData}
          categoryKey="ip"
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
        categoryKey="ip"
      />
    </div>
  );
}
