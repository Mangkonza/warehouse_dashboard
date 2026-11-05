'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaBuilding, FaCalendarAlt, FaCheckDouble, FaEyeSlash, FaEye } from 'react-icons/fa';
import { DepartmentBadge } from '@/components/ui';
import { matchDepartmentCode } from '@/config/departments';
import { getDepartment } from '@/lib/departments';
import { normalizeAcademicMonth, CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';

interface DepartmentMatrixAndPulseProps {
  departmentStats: any[];
  validResearch: any[];
  validAcademic: any[];
  validPub: any[];
  validService: any[];
  validIP: any[];
}

export function DepartmentMatrixAndPulse({
  departmentStats,
  validResearch,
  validAcademic,
  validPub,
  validService,
  validIP,
}: DepartmentMatrixAndPulseProps) {
  const [subTab, setSubTab] = useState<'matrix' | 'pulse' | 'quality'>('matrix');
  const [hideServices, setHideServices] = useState(false);
  const chartInstances = useRef<Chart[]>([]);

  const DEPTS = ['IRE', 'FE', 'IE', 'ME', 'CE', 'CPE', 'AE'];
  const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  // Helper to get month index 0..11
  const getMonthIndex = (rawDate: any, rawMonthName?: any): number => {
    if (rawMonthName) {
      const nm = normalizeAcademicMonth(rawMonthName);
      const idx = THAI_MONTHS.indexOf(nm);
      if (idx >= 0) return idx;
    }
    if (!rawDate) return -1;
    const str = String(rawDate).trim();
    const dObj = new Date(str.replace('1968', '2025').replace('1969', '2026').replace('2568', '2025').replace('2569', '2026'));
    if (!isNaN(dObj.getTime())) return dObj.getMonth();
    for (let i = 0; i < THAI_MONTHS.length; i++) {
      if (str.includes(THAI_MONTHS[i]) || str.includes(THAI_MONTHS[i].replace('.', ''))) return i;
    }
    return -1;
  };

  // 1. Dynamic budgets per department
  const { resBudgets, acaBudgets, heatmapData } = useMemo(() => {
    const resB: number[] = [];
    const acaB: number[] = [];

    const hData = DEPTS.map((code) => {
      const rItems = validResearch.filter((r) => matchDepartmentCode(r.department) === code);
      const aItems = validAcademic.filter((a) => matchDepartmentCode(a.department) === code);
      const pItems = validPub.filter((p) => matchDepartmentCode(p.department) === code);
      const sItems = validService.filter((s) => matchDepartmentCode(s.department) === code);
      const iItems = validIP.filter((i) => matchDepartmentCode(i.department) === code);

      const rSum = rItems.reduce((acc, r) => acc + (Number(r.budget_external) || 0) + (Number(r.budget_internal) || 0) || Number(r.budget) || 0, 0);
      const aSum = aItems.reduce((acc, a) => acc + (Number(a.budget) || 0), 0);

      const rMillions = Number((rSum / 1000000).toFixed(2));
      const aMillions = Number((aSum / 1000000).toFixed(2));
      resB.push(rMillions);
      acaB.push(aMillions);

      return {
        code,
        name: getDepartment(code).name,
        res: rItems.length,
        aca: aItems.length,
        pub: pItems.length,
        srv: sItems.length,
        ip: iItems.length,
        totalBudget: `${(rMillions + aMillions).toFixed(2)} ล้านบาท`,
      };
    });

    return { resBudgets: resB, acaBudgets: acaB, heatmapData: hData };
  }, [validResearch, validAcademic, validPub, validService, validIP]);

  // 2. Dynamic monthly activity counts & cumulative cash
  const { resMonthly, acaMonthly, pubMonthly, srvMonthly, ipMonthly, cumulativeCash } = useMemo(() => {
    const rM = Array(12).fill(0);
    const aM = Array(12).fill(0);
    const pM = Array(12).fill(0);
    const sM = Array(12).fill(0);
    const iM = Array(12).fill(0);
    const monthlyCash = Array(12).fill(0);

    validResearch.forEach((r) => {
      const m = getMonthIndex(r.start_date || r.date);
      if (m >= 0 && m < 12) {
        rM[m]++;
        const b = (Number(r.budget_external) || 0) + (Number(r.budget_internal) || 0) || Number(r.budget) || 0;
        monthlyCash[m] += b / 1000000;
      }
    });

    validAcademic.forEach((a) => {
      const m = getMonthIndex(a.start_date || a.date, a.month);
      if (m >= 0 && m < 12) {
        aM[m]++;
        const b = Number(a.budget) || 0;
        monthlyCash[m] += b / 1000000;
      }
    });

    validPub.forEach((p) => {
      const m = getMonthIndex(p.month_year || p.pub_date || p.date, p.month);
      if (m >= 0 && m < 12) pM[m]++;
    });

    validService.forEach((s) => {
      const m = getMonthIndex(s.date);
      if (m >= 0 && m < 12) sM[m]++;
    });

    validIP.forEach((i) => {
      const m = getMonthIndex(i.filing_date || i.date);
      if (m >= 0 && m < 12) iM[m]++;
    });

    // Compute cumulative cash
    const cumCash: number[] = [];
    let running = 0;
    for (let idx = 0; idx < monthlyCash.length; idx++) {
      running += monthlyCash[idx];
      cumCash.push(Number(running.toFixed(2)));
    }

    return {
      resMonthly: rM,
      acaMonthly: aM,
      pubMonthly: pM,
      srvMonthly: sM,
      ipMonthly: iM,
      cumulativeCash: cumCash,
    };
  }, [validResearch, validAcademic, validPub, validService, validIP]);

  // 3. Dynamic Quality & Pipeline Completion
  const { q1Data, q2Data, tciData, pubComplete, pubPrep, ipComplete, ipPrep } = useMemo(() => {
    const q1 = DEPTS.map(
      (code) =>
        validPub.filter((p) => {
          if (matchDepartmentCode(p.department) !== code) return false;
          const tier = p.journal_tier || autoDetectJournalRanking(p.journal || '', p.level || '');
          return String(tier).toUpperCase().startsWith('Q1');
        }).length
    );
    const q2 = DEPTS.map(
      (code) =>
        validPub.filter((p) => {
          if (matchDepartmentCode(p.department) !== code) return false;
          const tier = p.journal_tier || autoDetectJournalRanking(p.journal || '', p.level || '');
          return String(tier).toUpperCase().startsWith('Q2');
        }).length
    );
    const tci = DEPTS.map(
      (code) =>
        validPub.filter((p) => {
          if (matchDepartmentCode(p.department) !== code) return false;
          const tier = p.journal_tier || autoDetectJournalRanking(p.journal || '', p.level || '');
          const s = String(tier).toUpperCase();
          return s.startsWith('TCI') || s.startsWith('Q3') || s.startsWith('Q4');
        }).length
    );

    const pDone = validPub.filter((p) => !String(p.status || '').includes('เตรียม') && !String(p.status || '').includes('รอ')).length;
    const pWait = validPub.length - pDone;

    const iDone = validIP.filter((i) => String(i.status || '').includes('คุ้มครอง')).length;
    const iWait = validIP.length - iDone;

    return {
      q1Data: q1,
      q2Data: q2,
      tciData: tci,
      pubComplete: pDone,
      pubPrep: pWait,
      ipComplete: iDone,
      ipPrep: iWait,
    };
  }, [validPub, validIP]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (subTab === 'matrix') {
      createChart('c_ov_dept_budget', {
        type: 'bar',
        data: {
          labels: DEPTS,
          datasets: [
            {
              label: 'โครงการพัฒนาวิชาการ',
              data: acaBudgets,
              backgroundColor: CHART_PASTEL_PALETTE.missions.academic.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.academic.border,
              borderWidth: 1.5,
              borderRadius: 6,
              stack: 'budget',
            },
            {
              label: 'โครงการวิจัย',
              data: resBudgets,
              backgroundColor: CHART_PASTEL_PALETTE.missions.research.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.research.border,
              borderWidth: 1.5,
              borderRadius: 6,
              stack: 'budget',
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
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'งบประมาณ (ล้านบาท)' },
            },
          },
          plugins: {
            legend: { position: 'top' },
            datalabels: {
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 10 },
              formatter: (v: number) => (v > 10 ? `${v.toFixed(1)}M` : ''),
            },
          },
        },
      });
    }

    if (subTab === 'pulse') {
      createChart('c_ov_monthly_pulse', {
        type: 'bar',
        data: {
          labels: THAI_MONTHS,
          datasets: [
            { label: 'วิจัย', data: resMonthly, backgroundColor: CHART_PASTEL_PALETTE.missions.research.fill, borderColor: CHART_PASTEL_PALETTE.missions.research.border, borderWidth: 1, stack: 'm', borderRadius: 6 },
            { label: 'พัฒนาวิชาการ', data: acaMonthly, backgroundColor: CHART_PASTEL_PALETTE.missions.academic.fill, borderColor: CHART_PASTEL_PALETTE.missions.academic.border, borderWidth: 1, stack: 'm', borderRadius: 6 },
            { label: 'ตีพิมพ์', data: pubMonthly, backgroundColor: CHART_PASTEL_PALETTE.missions.publications.fill, borderColor: CHART_PASTEL_PALETTE.missions.publications.border, borderWidth: 1, stack: 'm', borderRadius: 6 },
            ...(!hideServices ? [{ label: 'บริการวิชาการ', data: srvMonthly, backgroundColor: CHART_PASTEL_PALETTE.missions.service.fill, borderColor: CHART_PASTEL_PALETTE.missions.service.border, borderWidth: 1, stack: 'm', borderRadius: 6 }] : []),
            { label: 'ทรัพย์สินฯ', data: ipMonthly, backgroundColor: CHART_PASTEL_PALETTE.missions.ip.fill, borderColor: CHART_PASTEL_PALETTE.missions.ip.border, borderWidth: 1, stack: 'm', borderRadius: 6 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, grid: { color: CHART_PASTEL_PALETTE.gridLines }, title: { display: true, text: 'จำนวนกิจกรรม (รายการ)' } },
          },
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12 } },
            datalabels: { display: false },
          },
        },
      });

      createChart('c_ov_cumulative_cash', {
        type: 'line',
        data: {
          labels: THAI_MONTHS,
          datasets: [
            {
              label: 'เม็ดเงินสะสมทั้งคณะ (ล้านบาท)',
              data: cumulativeCash,
              borderColor: CHART_PASTEL_PALETTE.missions.research.border,
              backgroundColor: 'rgba(134, 239, 172, 0.2)',
              fill: true,
              tension: 0.35,
              borderWidth: 2.5,
              pointRadius: 4,
              pointBackgroundColor: '#059669',
              pointBorderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, grid: { color: CHART_PASTEL_PALETTE.gridLines }, title: { display: true, text: 'ล้านบาท' } },
            x: { grid: { display: false } },
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 10 },
              formatter: (v: number, ctx: any) => (ctx.dataIndex % 2 === 1 || ctx.dataIndex === 11 ? `${v.toFixed(0)}M` : ''),
            },
          },
        },
      });
    }

    if (subTab === 'quality') {
      createChart('c_ov_pub_quality', {
        type: 'bar',
        data: {
          labels: DEPTS,
          datasets: [
            { label: 'นานาชาติ Q1', data: q1Data, backgroundColor: CHART_PASTEL_PALETTE.missions.research.fill, borderColor: '#22C55E', borderWidth: 1, stack: 'q', borderRadius: 6 },
            { label: 'นานาชาติ Q2', data: q2Data, backgroundColor: CHART_PASTEL_PALETTE.missions.academic.fill, borderColor: '#3B82F6', borderWidth: 1, stack: 'q', borderRadius: 6 },
            { label: 'ระดับชาติ TCI', data: tciData, backgroundColor: CHART_PASTEL_PALETTE.missions.service.fill, borderColor: '#F59E0B', borderWidth: 1, stack: 'q', borderRadius: 6 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, grid: { color: CHART_PASTEL_PALETTE.gridLines }, title: { display: true, text: 'เรื่อง' } },
          },
          plugins: {
            legend: { position: 'top' },
            datalabels: { display: false },
          },
        },
      });

      createChart('c_ov_pipeline_completion', {
        type: 'bar',
        data: {
          labels: [`ผลงานตีพิมพ์ (${validPub.length} เรื่อง)`, `ทรัพย์สินทางปัญญา (${validIP.length} รายการ)`],
          datasets: [
            { label: 'สำเร็จเสร็จสิ้น (คุ้มครอง/ตีพิมพ์แล้ว)', data: [pubComplete, ipComplete], backgroundColor: CHART_PASTEL_PALETTE.missions.research.fill, borderColor: '#22C55E', borderWidth: 1, borderRadius: 6 },
            { label: 'อยู่ระหว่างดำเนินการ (เตรียม/ยื่นคำขอ)', data: [pubPrep, ipPrep], backgroundColor: CHART_PASTEL_PALETTE.missions.service.fill, borderColor: '#F59E0B', borderWidth: 1, borderRadius: 6 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 16,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grace: '20%',
              suggestedMax: 60,
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนรายการ' },
            },
            x: { grid: { display: false } },
          },
          plugins: {
            legend: {
              position: 'top',
              labels: { boxWidth: 12, padding: 14, font: { size: 12 } },
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              offset: 4,
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => `${v}`,
            },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [subTab, hideServices, resBudgets, acaBudgets, resMonthly, acaMonthly, pubMonthly, srvMonthly, ipMonthly, cumulativeCash, q1Data, q2Data, tciData, pubComplete, pubPrep, ipComplete, ipPrep, validPub.length, validIP.length]);

  const getHeatmapColor = (val: number, max: number = 30) => {
    if (val === 0) return '#f8fafc';
    const intensity = Math.min(val / max, 1);
    if (intensity > 0.6) return '#bbf7d0';
    if (intensity > 0.3) return '#dcfce7';
    return '#f0fdf4';
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      {/* Sub-Tabs Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '14px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'matrix', label: 'เปรียบเทียบผลงาน 7 สังกัด', icon: <FaBuilding /> },
            { id: 'pulse', label: 'แนวโน้มผลงานและงบประมาณรายเดือน', icon: <FaCalendarAlt /> },
            { id: 'quality', label: 'คุณภาพผลงานตีพิมพ์และสถานะความสำเร็จ', icon: <FaCheckDouble /> },
          ].map((t) => {
            const active = subTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: active ? '1.5px solid #10b981' : '1px solid #cbd5e1',
                  backgroundColor: active ? '#ecfdf5' : '#ffffff',
                  color: active ? '#047857' : '#475569',
                  fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {subTab === 'pulse' && (
          <button
            type="button"
            onClick={() => setHideServices(!hideServices)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: hideServices ? '1px solid #f59e0b' : '1px solid #cbd5e1',
              backgroundColor: hideServices ? '#fffbeb' : '#ffffff',
              color: hideServices ? '#b45309' : '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {hideServices ? <FaEye style={{ color: '#d97706' }} /> : <FaEyeSlash />}
            <span>{hideServices ? 'แสดงงานบริการวิชาการ' : 'ซ่อนงานบริการวิชาการ'}</span>
          </button>
        )}
      </div>

      {/* SUB-TAB 1: Department 360° Matrix */}
      {subTab === 'matrix' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
              งบประมาณรวม 7 สังกัด (วิจัย + พัฒนาวิชาการ)
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
              คำนวณสดจากฐานข้อมูลจริงตามเงื่อนไขตัวกรอง
            </p>
            <div style={{ height: '300px' }}>
              <canvas id="c_ov_dept_budget" />
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
              ตารางสรุปจำนวนผลงาน 5 พันธกิจแยกตามสังกัด
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
              ตารางความร้อนสะท้อนการมีส่วนร่วมครบทุกมิติ (ยิ่งสีเข้มยิ่งมีผลงานมาก)
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ecfdf5', borderBottom: '2px solid #a7f3d0', color: '#065f46' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700 }}>สังกัด</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', color: '#047857', fontWeight: 700 }}>วิจัย</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', color: '#0284c7', fontWeight: 700 }}>พัฒนาวิชาการ</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', color: '#be123c', fontWeight: 700 }}>ตีพิมพ์</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>บริการวิชาการ</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', color: '#6d28d9', fontWeight: 700 }}>ทรัพย์สินฯ</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: '#065f46', fontWeight: 700 }}>งบประมาณรวม</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row) => (
                    <tr key={row.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600 }}>
                        <DepartmentBadge value={row.code} />
                      </td>
                      <td style={{ padding: '8px 8px', textAlign: 'center', backgroundColor: getHeatmapColor(row.res, 10), fontWeight: 700 }}>
                        {row.res}
                      </td>
                      <td style={{ padding: '8px 8px', textAlign: 'center', backgroundColor: getHeatmapColor(row.aca, 40), fontWeight: 700 }}>
                        {row.aca}
                      </td>
                      <td style={{ padding: '8px 8px', textAlign: 'center', backgroundColor: getHeatmapColor(row.pub, 15), fontWeight: 700 }}>
                        {row.pub}
                      </td>
                      <td style={{ padding: '8px 8px', textAlign: 'center', backgroundColor: getHeatmapColor(row.srv, 120), fontWeight: 700 }}>
                        {row.srv}
                      </td>
                      <td style={{ padding: '8px 8px', textAlign: 'center', backgroundColor: getHeatmapColor(row.ip, 10), fontWeight: 700 }}>
                        {row.ip}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        {row.totalBudget}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Monthly Activity Pulse */}
      {subTab === 'pulse' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
              ความเคลื่อนไหวรายเดือนรวม 5 พันธกิจ (ม.ค. - ธ.ค.)
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
              {hideServices ? 'กำลังซ่อนงานบริการวิชาการ เพื่อดูสัดส่วนอีก 4 พันธกิจชัดเจน' : 'แสดงรวมทุกกิจกรรมของทั้ง 5 พันธกิจ'}
            </p>
            <div style={{ height: '300px' }}>
              <canvas id="c_ov_monthly_pulse" />
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
              ยอดงบประมาณสะสมรายเดือน (ล้านบาท)
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
              การทยอยลงนามและรับเงินทุนวิจัย + โครงการพัฒนาวิชาการตลอดทั้งปี
            </p>
            <div style={{ height: '300px' }}>
              <canvas id="c_ov_cumulative_cash" />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Quality & Innovation Snapshot */}
      {subTab === 'quality' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
              คุณภาพผลงานตีพิมพ์รายสังกัด (Q1, Q2, TCI)
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
              นับสดจากฐานข้อมูลตีพิมพ์ตามสังกัด
            </p>
            <div style={{ height: '300px' }}>
              <canvas id="c_ov_pub_quality" />
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
              เปรียบเทียบสถานะผลงานที่สำเร็จแล้วกับกำลังดำเนินการ
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
              เปรียบเทียบสัดส่วนงานสำเร็จและอยู่ระหว่างดำเนินการ
            </p>
            <div style={{ height: '300px' }}>
              <canvas id="c_ov_pipeline_completion" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
