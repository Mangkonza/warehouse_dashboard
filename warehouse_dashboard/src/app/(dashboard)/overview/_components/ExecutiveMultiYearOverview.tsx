'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { parseNumber } from '@/lib/kpiEngine';
import { FaCoins, FaGraduationCap, FaBook, FaLightbulb, FaChartLine } from 'react-icons/fa';

interface ExecutiveMultiYearOverviewProps {
  researchList: any[];
  academicList: any[];
  pubList: any[];
  serviceList: any[];
  ipList: any[];
  allResearchRaw?: any[];
  allAcademicRaw?: any[];
  allPubRaw?: any[];
  allServiceRaw?: any[];
  allIpRaw?: any[];
}

// ฟังก์ชันสกัดปีงบประมาณอัจฉริยะ รองรับทั้ง id, fund_source, start_date และ 196x
export const extractFiscalYear = (item: any): string => {
  if (!item) return '2568';

  // 1. ตรวจจาก id เช่น "วศ.กพส. 1/2569", "YF(KU) 37.68", "PRP 6805031920"
  const idStr = String(item.id || item._id || '').replace(/\n/g, ' ');
  const idMatch = idStr.match(/(?:25|20)(\d{2})/);
  if (idMatch) {
    return `25${idMatch[1]}`;
  }
  const shortIdMatch = idStr.match(/(?:\/|\.)(6[6-9]|70)\b/);
  if (shortIdMatch) {
    return `25${shortIdMatch[1]}`;
  }

  // 2. ตรวจจากแหล่งทุน fund_source
  const fundStr = String(item.fund_source || '');
  const fundMatch = fundStr.match(/25(6[6-9]|70)/);
  if (fundMatch) {
    return `25${fundMatch[1]}`;
  }

  // 3. ตรวจจาก start_date หรือ date
  const dateStr = String(item.start_date || item.date || item.year || item.academic_year || item.fiscal_year || '');
  // รองรับกรณีปีเพี้ยน 1968 -> 2568
  const legacyMatch = dateStr.match(/19(6[6-9]|70)/);
  if (legacyMatch) {
    return `25${legacyMatch[1]}`;
  }
  const thMatch = dateStr.match(/25(6[6-9]|70)/);
  if (thMatch) {
    return `25${thMatch[1]}`;
  }
  const enMatch = dateStr.match(/20(2[3-7])/);
  if (enMatch) {
    const y = parseInt(enMatch[1], 10) + 43;
    return `25${y}`;
  }

  return '2568';
};

const YEARS = ['2566', '2567', '2568', '2569', '2570'];

export const ExecutiveMultiYearOverview: React.FC<ExecutiveMultiYearOverviewProps> = ({
  researchList,
  academicList,
  pubList,
  serviceList,
  ipList,
  allResearchRaw,
  allAcademicRaw,
  allPubRaw,
  allServiceRaw,
  allIpRaw,
}) => {
  const [activeMetricMode, setActiveMetricMode] = useState<'budget' | 'projects' | 'outputs'>('budget');
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // ใช้ข้อมูลดิบทั้งหมดสำหรับกราฟแนวโน้มข้ามปี (ถ้ามี) เพื่อไม่ให้ถูกฟิลเตอร์ตัวเดียวจำกัด
  const sourceResearch = allResearchRaw && allResearchRaw.length > 0 ? allResearchRaw : researchList;
  const sourceAcademic = allAcademicRaw && allAcademicRaw.length > 0 ? allAcademicRaw : academicList;
  const sourcePub = allPubRaw && allPubRaw.length > 0 ? allPubRaw : pubList;
  const sourceService = allServiceRaw && allServiceRaw.length > 0 ? allServiceRaw : serviceList;
  const sourceIP = allIpRaw && allIpRaw.length > 0 ? allIpRaw : ipList;

  // คำนวณสถิติจริงรายปี (2566-2570)
  const yearlyStats = useMemo(() => {
    const data: Record<string, {
      researchExternal: number;
      researchInternal: number;
      researchCount: number;
      academicBudget: number;
      academicCount: number;
      serviceRevenue: number;
      serviceCount: number;
      pubCount: number;
      ipCount: number;
    }> = {};

    YEARS.forEach((y) => {
      data[y] = {
        researchExternal: 0,
        researchInternal: 0,
        researchCount: 0,
        academicBudget: 0,
        academicCount: 0,
        serviceRevenue: 0,
        serviceCount: 0,
        pubCount: 0,
        ipCount: 0,
      };
    });

    sourceResearch.forEach((r) => {
      const y = extractFiscalYear(r);
      if (data[y]) {
        data[y].researchCount += 1;
        data[y].researchExternal += parseNumber(r.budget_external);
        data[y].researchInternal += parseNumber(r.budget_internal);
      }
    });

    sourceAcademic.forEach((a) => {
      const y = extractFiscalYear(a);
      if (data[y]) {
        data[y].academicCount += 1;
        data[y].academicBudget += parseNumber(a.budget);
      }
    });

    sourceService.forEach((s) => {
      const y = extractFiscalYear(s);
      if (data[y]) {
        data[y].serviceCount += 1;
        data[y].serviceRevenue += parseNumber(s.actual_revenue) || parseNumber(s.budget) || 0;
      }
    });

    sourcePub.forEach((p) => {
      const y = extractFiscalYear(p);
      if (data[y]) {
        data[y].pubCount += 1;
      }
    });

    sourceIP.forEach((ip) => {
      const y = extractFiscalYear(ip);
      if (data[y]) {
        data[y].ipCount += 1;
      }
    });

    return data;
  }, [sourceResearch, sourceAcademic, sourcePub, sourceService, sourceIP]);

  // สรุปยอดรวมล่าสุดสำหรับ 4 การ์ดบน
  const currentTotalResearchBudget = useMemo(() => {
    return researchList.reduce((acc, r) => acc + parseNumber(r.budget_external) + parseNumber(r.budget_internal), 0);
  }, [researchList]);

  const currentTotalAcademicService = useMemo(() => {
    const aca = academicList.reduce((acc, a) => acc + parseNumber(a.budget), 0);
    const srv = serviceList.reduce((acc, s) => acc + (parseNumber(s.actual_revenue) || parseNumber(s.budget) || 0), 0);
    return aca + srv;
  }, [academicList, serviceList]);

  // เรนเดอร์กราฟเปรียบเทียบหลายปี
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (!chartCanvasRef.current) return;
    Chart.register(ChartDataLabels);

    let chartData: any;

    if (activeMetricMode === 'budget') {
      chartData = {
        labels: YEARS,
        datasets: [
          {
            type: 'bar',
            label: 'งบวิจัยภายนอก (ล้านบาท)',
            data: YEARS.map((y) => Number((yearlyStats[y].researchExternal / 1000000).toFixed(2))),
            backgroundColor: '#00A651',
            borderRadius: 6,
          },
          {
            type: 'bar',
            label: 'งบวิจัยภายใน (ล้านบาท)',
            data: YEARS.map((y) => Number((yearlyStats[y].researchInternal / 1000000).toFixed(2))),
            backgroundColor: '#86efac',
            borderRadius: 6,
          },
          {
            type: 'bar',
            label: 'งบพัฒนาวิชาการ & บริการ (ล้านบาท)',
            data: YEARS.map((y) => Number(((yearlyStats[y].academicBudget + yearlyStats[y].serviceRevenue) / 1000000).toFixed(2))),
            backgroundColor: '#0284c7',
            borderRadius: 6,
          },
        ],
      };
    } else if (activeMetricMode === 'projects') {
      chartData = {
        labels: YEARS,
        datasets: [
          {
            type: 'bar',
            label: 'โครงการวิจัย (เรื่อง)',
            data: YEARS.map((y) => yearlyStats[y].researchCount),
            backgroundColor: '#00A651',
            borderRadius: 6,
          },
          {
            type: 'bar',
            label: 'โครงการพัฒนาวิชาการ (เรื่อง)',
            data: YEARS.map((y) => yearlyStats[y].academicCount),
            backgroundColor: '#6366f1',
            borderRadius: 6,
          },
          {
            type: 'bar',
            label: 'งานบริการวิชาการ (เรื่อง)',
            data: YEARS.map((y) => yearlyStats[y].serviceCount),
            backgroundColor: '#0284c7',
            borderRadius: 6,
          },
        ],
      };
    } else {
      chartData = {
        labels: YEARS,
        datasets: [
          {
            type: 'bar',
            label: 'ผลงานตีพิมพ์ทางวิชาการ (เรื่อง)',
            data: YEARS.map((y) => yearlyStats[y].pubCount),
            backgroundColor: '#f59e0b',
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: 'ทรัพย์สินทางปัญญา / สิทธิบัตร (เรื่อง)',
            data: YEARS.map((y) => yearlyStats[y].ipCount),
            borderColor: '#e11d48',
            backgroundColor: '#e11d48',
            borderWidth: 3,
            pointRadius: 5,
            tension: 0.3,
            yAxisID: 'y1',
            datalabels: {
                align: 'top',
                offset: 10, // ขยับตัวเลขหนีแท่งกราฟด้านหลัง
                color: '#e11d48',
            }
          },
        ],
      };
    }

    chartInstanceRef.current = new Chart(chartCanvasRef.current, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 14, font: { size: 12 } } },
          datalabels: {
            anchor: 'end',
            align: 'top',
            font: { size: 11, weight: 'bold' },
            formatter: (v) => {
              if (!v || v === 0) return '';
              return activeMetricMode === 'budget' ? `${v}M` : `${v}`;
            },
            display: (context) => {
              const val = context.dataset.data[context.dataIndex];
              return typeof val === 'number' && val > 0;
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            ticks: {
              callback: (val) => (activeMetricMode === 'budget' ? `${val}M ฿` : val),
            },
          },
          ...(activeMetricMode === 'outputs'
            ? {
                y1: {
                  type: 'linear',
                  position: 'right',
                  beginAtZero: true,
                  grid: { display: false },
                  ticks: { precision: 0 },
                },
              }
            : {}),
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [yearlyStats, activeMetricMode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* 1. Executive Summary Cards (4 เสาหลัก) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {/* การ์ดที่ 1: งบวิจัยรวม */}
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>งบประมาณวิจัยรวมสะสม</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaCoins style={{ color: '#00A651', fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {(currentTotalResearchBudget / 1000000).toFixed(2)} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#059669', marginTop: '4px', fontWeight: 500 }}>
            รวม {researchList.length} โครงการ (ทุนภายนอก + ภายใน)
          </div>
        </div>

        {/* การ์ดที่ 2: งบพัฒนาวิชาการและบริการ */}
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>งบพัฒนาวิชาการ & บริการวิชาการ</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaGraduationCap style={{ color: '#0284c7', fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {(currentTotalAcademicService / 1000000).toFixed(2)} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#0284c7', marginTop: '4px', fontWeight: 500 }}>
            {academicList.length} โครงการพัฒนา • {serviceList.length} งานบริการ
          </div>
        </div>

        {/* การ์ดที่ 3: ผลงานตีพิมพ์ */}
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>ผลงานตีพิมพ์ทางวิชาการ</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaBook style={{ color: '#f59e0b', fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {pubList.length} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>เรื่อง</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#b45309', marginTop: '4px', fontWeight: 500 }}>
            ฐานข้อมูล Scopus, WoS และ TCI
          </div>
        </div>

        {/* การ์ดที่ 4: ทรัพย์สินทางปัญญา */}
        <div style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>งานทรัพย์สินทางปัญญา (IP)</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaLightbulb style={{ color: '#e11d48', fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {ipList.length} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>รายการ</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#be123c', marginTop: '4px', fontWeight: 500 }}>
            สิทธิบัตรการประดิษฐ์ และอนุสิทธิบัตร
          </div>
        </div>
      </div>

      {/* 2. Multi-Year Trend Analysis (กราฟเปรียบเทียบรายปี 2566–2570) */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChartLine style={{ color: '#00A651' }} />
              <span>การเติบโตและแนวโน้มเปรียบเทียบรายปีงบประมาณ (2566 – 2570)</span>
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              วิเคราะห์ทิศทางการเติบโตของคณะแบบ Multi-Year จากฐานข้อมูลจริง
            </p>
          </div>

          {/* สวิตช์สลับโหมดกราฟ */}
          <div style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setActiveMetricMode('budget')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeMetricMode === 'budget' ? '#ffffff' : 'transparent',
                color: activeMetricMode === 'budget' ? '#0f172a' : '#64748b',
                fontWeight: activeMetricMode === 'budget' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: activeMetricMode === 'budget' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              ยอดงบประมาณ
            </button>
            <button
              onClick={() => setActiveMetricMode('projects')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeMetricMode === 'projects' ? '#ffffff' : 'transparent',
                color: activeMetricMode === 'projects' ? '#0f172a' : '#64748b',
                fontWeight: activeMetricMode === 'projects' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: activeMetricMode === 'projects' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              จำนวนโครงการ
            </button>
            <button
              onClick={() => setActiveMetricMode('outputs')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeMetricMode === 'outputs' ? '#ffffff' : 'transparent',
                color: activeMetricMode === 'outputs' ? '#0f172a' : '#64748b',
                fontWeight: activeMetricMode === 'outputs' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: activeMetricMode === 'outputs' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              ตีพิมพ์ & ทรัพย์สินทางปัญญา
            </button>
          </div>
        </div>

        {/* กราฟ */}
        <div style={{ height: '320px', width: '100%' }}>
          <canvas ref={chartCanvasRef} />
        </div>
      </div>
    </div>
  );
};