'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { resolveItemStrategicAlignment, CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaGlobeAmericas, FaAward, FaCompass } from 'react-icons/fa';

interface StrategicCommandPanelProps {
  validResearch?: any[];
  validAcademic?: any[];
  validPub?: any[];
  validService?: any[];
  validIP?: any[];
}

export function StrategicCommandPanel({
  validResearch = [],
  validAcademic = [],
  validPub = [],
  validService = [],
  validIP = [],
}: StrategicCommandPanelProps) {
  const chartRef = useRef<Chart | null>(null);

  // Dynamic ISEE matrix counts
  const { resIsee, acaIsee, pubIsee, srvIsee, ipIsee, totalAllItems } = useMemo(() => {
    // Indexes: [0: I, 1: S, 2: E1, 3: E2]
    const rCount = [0, 0, 0, 0];
    const aCount = [0, 0, 0, 0];
    const pCount = [0, 0, 0, 0];
    const sCount = [0, 0, 0, 0];
    const iCount = [0, 0, 0, 0];

    validResearch.forEach((r) => {
      const res = resolveItemStrategicAlignment(r, 'research');
      if (res.isee === 'I') rCount[0]++;
      else if (res.isee === 'S') rCount[1]++;
      else if (res.isee === 'E1') rCount[2]++;
      else rCount[3]++;
    });

    validAcademic.forEach((a) => {
      const res = resolveItemStrategicAlignment(a, 'academic');
      if (res.isee === 'I') aCount[0]++;
      else if (res.isee === 'S') aCount[1]++;
      else if (res.isee === 'E1') aCount[2]++;
      else aCount[3]++;
    });

    validPub.forEach((p) => {
      const res = resolveItemStrategicAlignment(p, 'publications');
      if (res.isee === 'I') pCount[0]++;
      else if (res.isee === 'S') pCount[1]++;
      else if (res.isee === 'E1') pCount[2]++;
      else pCount[3]++;
    });

    validService.forEach((s) => {
      const res = resolveItemStrategicAlignment(s, 'service');
      if (res.isee === 'I') sCount[0]++;
      else if (res.isee === 'S') sCount[1]++;
      else if (res.isee === 'E1') sCount[2]++;
      else sCount[3]++;
    });

    validIP.forEach((i) => {
      const res = resolveItemStrategicAlignment(i, 'ip');
      if (res.isee === 'I') iCount[0]++;
      else if (res.isee === 'S') iCount[1]++;
      else if (res.isee === 'E1') iCount[2]++;
      else iCount[3]++;
    });

    const total = validResearch.length + validAcademic.length + validPub.length + validService.length + validIP.length;

    return {
      resIsee: rCount,
      acaIsee: aCount,
      pubIsee: pCount,
      srvIsee: sCount,
      ipIsee: iCount,
      totalAllItems: total,
    };
  }, [validResearch, validAcademic, validPub, validService, validIP]);

  // Dynamic Top 5 SDGs
  const topSdgs = useMemo(() => {
    const SDG_NAMES: Record<number, { name: string; color: string }> = {
      1: { name: 'ขจัดความยากจน', color: '#e5243b' },
      2: { name: 'ขจัดความหิวโหยและเกษตรกรรมยั่งยืน', color: '#dda73a' },
      3: { name: 'สุขภาพและความเป็นอยู่ที่ดี', color: '#4c9f38' },
      4: { name: 'การศึกษาที่มีคุณภาพ', color: '#c5192d' },
      5: { name: 'ความเท่าเทียมทางเพศ', color: '#ff3a21' },
      6: { name: 'การจัดการน้ำสะอาดและสุขาภิบาล', color: '#27bfe6' },
      7: { name: 'พลังงานสะอาดที่เข้าถึงได้', color: '#fcc30b' },
      8: { name: 'งานที่มีคุณค่าและการเติบโตทางเศรษฐกิจ', color: '#a21942' },
      9: { name: 'อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน', color: '#f36e25' },
      10: { name: 'ลดความเหลื่อมล้ำ', color: '#dd1367' },
      11: { name: 'เมืองและชุมชนที่ยั่งยืน', color: '#fd9d24' },
      12: { name: 'แบบแผนการผลิตและการบริโภคที่ยั่งยืน', color: '#bf8b2e' },
      13: { name: 'การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ', color: '#3f7e44' },
      14: { name: 'ทรัพยากรทางทะเล', color: '#0a97d9' },
      15: { name: 'ระบบนิเวศบนบก', color: '#56c02b' },
      16: { name: 'สันติภาพและความยุติธรรม', color: '#00689d' },
      17: { name: 'ความร่วมมือเพื่อการพัฒนาที่ยั่งยืน', color: '#19486a' },
    };

    const counts: Record<number, number> = {};
    const allItems = [...validResearch, ...validAcademic, ...validPub, ...validService, ...validIP];
    allItems.forEach((item) => {
      const res = resolveItemStrategicAlignment(item);
      const num = res.sdgNumber;
      if (num >= 1 && num <= 17) {
        counts[num] = (counts[num] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts)
      .map(([k, v]) => ({ num: Number(k), count: v }))
      .sort((a, b) => b.count - a.count);

    return sorted.slice(0, 5).map((s) => ({
      num: s.num,
      name: SDG_NAMES[s.num]?.name || `SDG ${s.num}`,
      count: s.count,
      color: SDG_NAMES[s.num]?.color || '#0ea5e9',
    }));
  }, [validResearch, validAcademic, validPub, validService, validIP]);

  // Dynamic IAM Metrics
  const iamOverview = useMemo(() => {
    const counts = { I: 0, A: 0, M: 0 };
    const allItems = [...validResearch, ...validAcademic, ...validPub, ...validService, ...validIP];
    allItems.forEach((item) => {
      const res = resolveItemStrategicAlignment(item);
      counts[res.iam]++;
    });
    const total = allItems.length || 1;
    return {
      iPct: ((counts.I / total) * 100).toFixed(1),
      iCount: counts.I,
      aPct: ((counts.A / total) * 100).toFixed(1),
      aCount: counts.A,
      mPct: ((counts.M / total) * 100).toFixed(1),
      mCount: counts.M,
    };
  }, [validResearch, validAcademic, validPub, validService, validIP]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";

    const canvas = document.getElementById('c_overview_isee_matrix') as HTMLCanvasElement;
    if (canvas) {
      chartRef.current = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: [
            'I - ความเป็นนานาชาติ',
            'S - สังคมและความยั่งยืน',
            'E - ความเป็นเลิศวิจัย',
            'E - ผู้ประกอบการ/ดิจิทัล',
          ],
          datasets: [
            {
              label: 'วิจัย',
              data: resIsee,
              backgroundColor: CHART_PASTEL_PALETTE.missions.research.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.research.border,
              borderWidth: 1,
              stack: 'isee',
              borderRadius: 4,
            },
            {
              label: 'พัฒนาวิชาการ',
              data: acaIsee,
              backgroundColor: CHART_PASTEL_PALETTE.missions.academic.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.academic.border,
              borderWidth: 1,
              stack: 'isee',
              borderRadius: 4,
            },
            {
              label: 'ตีพิมพ์',
              data: pubIsee,
              backgroundColor: CHART_PASTEL_PALETTE.missions.publications.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.publications.border,
              borderWidth: 1,
              stack: 'isee',
              borderRadius: 4,
            },
            {
              label: 'บริการวิชาการ',
              data: srvIsee,
              backgroundColor: CHART_PASTEL_PALETTE.missions.service.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.service.border,
              borderWidth: 1,
              stack: 'isee',
              borderRadius: 4,
            },
            {
              label: 'ทรัพย์สินฯ',
              data: ipIsee,
              backgroundColor: CHART_PASTEL_PALETTE.missions.ip.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.ip.border,
              borderWidth: 1,
              stack: 'isee',
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          layout: {
            padding: {
              left: 4,
              right: 14,
            },
          },
          scales: {
            x: {
              stacked: true,
              beginAtZero: true,
              grid: {
                color: CHART_PASTEL_PALETTE.gridLines,
              },
              title: {
                display: true,
                text: 'จำนวนผลงานที่ขับเคลื่อน (รายการ)',
                font: { size: 11, family: "'Kanit', sans-serif" },
                color: '#64748b',
              },
            },
            y: {
              stacked: true,
              grid: { display: false },
              ticks: {
                autoSkip: false,
                font: { size: 11.5, weight: 500, family: "'Kanit', sans-serif" },
                color: '#334155',
              },
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                boxHeight: 10,
                borderRadius: 2,
                useBorderRadius: true,
                font: { size: 11, family: "'Kanit', sans-serif" },
                color: '#475569',
              },
            },
            datalabels: {
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 9.5, family: "'Kanit', sans-serif" },
              formatter: (v: number) => (v > 10 ? `${v}` : ''),
            },
          },
        },
      });
    }

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [resIsee, acaIsee, pubIsee, srvIsee, ipIsee]);

  const maxSdgCount = topSdgs[0]?.count || 1;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      {/* Box 1: ISEE Strategic Matrix (35%) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaCompass style={{ color: '#059669', fontSize: '16px' }} />
            <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
              ความสอดคล้องตามยุทธศาสตร์มหาวิทยาลัย (ISEE)
            </h3>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#059669',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            รวม {totalAllItems} ผลงาน
          </span>
        </div>
        <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
          การกระจายตัวของทั้ง 5 พันธกิจใน 4 เสาหลักยุทธศาสตร์
        </p>
        <div style={{ height: '240px', position: 'relative' }}>
          <canvas id="c_overview_isee_matrix" />
        </div>
      </div>

      {/* Box 2: IAM / IDKU Contribution (25%) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '18px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <FaAward style={{ color: '#7c3aed', fontSize: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
            การขับเคลื่อนตามค่านิยมองค์กร (IAM)
          </h3>
        </div>
        <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
          การแสดงออกของค่านิยมผ่านผลงานจริงทั้งคณะ
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
          {/* I - Integrity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', fontWeight: 600, marginBottom: '5px' }}>
              <span style={{ color: '#059669' }}>I - ความถูกต้องและจริยธรรม</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '4px' }}>
                {iamOverview.iCount} ผลงาน ({iamOverview.iPct}%)
              </span>
            </div>
            <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${iamOverview.iPct}%`, height: '100%', backgroundColor: '#86efac', borderRadius: '999px' }} />
            </div>
            {/* Micro-focus Chips replacing verbose text */}
            <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#047857', backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', padding: '1px 6px', borderRadius: '4px' }}>
                จริยธรรมวิจัย
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#047857', backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', padding: '1px 6px', borderRadius: '4px' }}>
                คุ้มครองสิทธิ์ IP
              </span>
            </div>
          </div>

          {/* A - Agility */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', fontWeight: 600, marginBottom: '5px' }}>
              <span style={{ color: '#0284c7' }}>A - ความคล่องตัวและการบริการ</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '1px 6px', borderRadius: '4px' }}>
                {iamOverview.aCount} ผลงาน ({iamOverview.aPct}%)
              </span>
            </div>
            <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${iamOverview.aPct}%`, height: '100%', backgroundColor: '#93c5fd', borderRadius: '999px' }} />
            </div>
            {/* Micro-focus Chips replacing verbose text */}
            <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0369a1', backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe', padding: '1px 6px', borderRadius: '4px' }}>
                บริการวิชาการ {validService.length} ครั้ง
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0369a1', backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe', padding: '1px 6px', borderRadius: '4px' }}>
                อนุสิทธิบัตรคล่องตัว
              </span>
            </div>
          </div>

          {/* M - Mastery */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', fontWeight: 600, marginBottom: '5px' }}>
              <span style={{ color: '#7c3aed' }}>M - ความเป็นมืออาชีพ</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6d28d9', backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', padding: '1px 6px', borderRadius: '4px' }}>
                {iamOverview.mCount} ผลงาน ({iamOverview.mPct}%)
              </span>
            </div>
            <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${iamOverview.mPct}%`, height: '100%', backgroundColor: '#ddd6fe', borderRadius: '999px' }} />
            </div>
            {/* Micro-focus Chips replacing verbose text */}
            <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#6d28d9', backgroundColor: '#f5f3ff', border: '1px solid #ede9fe', padding: '1px 6px', borderRadius: '4px' }}>
                ทุนวิจัยขนาดใหญ่
              </span>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#6d28d9', backgroundColor: '#f5f3ff', border: '1px solid #ede9fe', padding: '1px 6px', borderRadius: '4px' }}>
                บทความ Q1/Q2 ({validPub.length} เรื่อง)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Box 3: Top UN SDGs Impact (40%) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <FaGlobeAmericas style={{ color: '#0284c7', fontSize: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
            5 อันดับเป้าหมายความยั่งยืนสูงสุด (SDGs)
          </h3>
        </div>
        <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
          เป้าหมายการพัฒนาที่ยั่งยืนที่มีโครงการและผลงานขับเคลื่อนสูงสุด
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {topSdgs.map((sdg) => {
            const barWidthPct = Math.round((sdg.count / maxSdgCount) * 100);
            return (
              <div
                key={`top-sdg-${sdg.num}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  gap: '5px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: sdg.color,
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {sdg.num}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                      {sdg.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      backgroundColor: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      border: '1px solid #e2e8f0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {sdg.count} โครงการ
                  </span>
                </div>

                {/* Horizontal Pastel Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '5px',
                    borderRadius: '999px',
                    backgroundColor: '#e2e8f0',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${barWidthPct}%`,
                      height: '100%',
                      backgroundColor: sdg.color,
                      opacity: 0.85,
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
