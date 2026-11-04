'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { resolveItemStrategicAlignment } from '@/lib/pastelTheme';
import { SDGS_DATA } from '@/config/sdgConfig';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaGlobeAmericas, FaAward, FaCompass, FaSortAmountDown, FaSortNumericDown } from 'react-icons/fa';

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
  const [sdgSortMode, setSdgSortMode] = useState<'desc' | 'number'>('desc');

  // Dynamic Strategic Matrix counts
  const { resIsee, acaIsee, pubIsee, srvIsee, ipIsee } = useMemo(() => {
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

    return {
      resIsee: rCount,
      acaIsee: aCount,
      pubIsee: pCount,
      srvIsee: sCount,
      ipIsee: iCount,
    };
  }, [validResearch, validAcademic, validPub, validService, validIP]);

  // Dynamic SDGs with Sort Toggle (1-17 vs Most to Least)
  const displayedSdgs = useMemo(() => {
    const counts: Record<number, number> = {};
    const allItems = [...validResearch, ...validAcademic, ...validPub, ...validService, ...validIP];
    allItems.forEach((item) => {
      const res = resolveItemStrategicAlignment(item);
      const num = res.sdgNumber;
      if (num >= 1 && num <= 17) {
        counts[num] = (counts[num] || 0) + 1;
      }
    });

    const maxCount = Math.max(...Object.values(counts), 1);

    const activeList = Object.values(SDGS_DATA)
      .map((sdg) => ({
        num: sdg.number,
        name: sdg.nameTh,
        count: counts[sdg.number] || 0,
        color: sdg.color,
        pct: Math.round(((counts[sdg.number] || 0) / maxCount) * 100),
      }))
      .filter((s) => s.count > 0);

    if (sdgSortMode === 'desc') {
      activeList.sort((a, b) => b.count - a.count || a.num - b.num);
    } else {
      activeList.sort((a, b) => a.num - b.num);
    }

    return activeList.slice(0, 6);
  }, [validResearch, validAcademic, validPub, validService, validIP, sdgSortMode]);

  // Dynamic Core Values Metrics
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
            'ด้านที่ 1 ความเป็นนานาชาติ',
            'ด้านที่ 2 รับใช้สังคมและความยั่งยืน',
            'ด้านที่ 3 ความเป็นเลิศทางวิชาการ',
            'ด้านที่ 4 นวัตกรรมและดิจิทัล',
          ],
          datasets: [
            {
              label: 'วิจัย',
              data: resIsee,
              backgroundColor: '#86EFAC',
              stack: 'isee',
              borderRadius: 6,
            },
            {
              label: 'พัฒนาวิชาการ',
              data: acaIsee,
              backgroundColor: '#93C5FD',
              stack: 'isee',
              borderRadius: 6,
            },
            {
              label: 'ตีพิมพ์',
              data: pubIsee,
              backgroundColor: '#FDA4AF',
              stack: 'isee',
              borderRadius: 6,
            },
            {
              label: 'บริการวิชาการ',
              data: srvIsee,
              backgroundColor: '#FDE68A',
              stack: 'isee',
              borderRadius: 6,
            },
            {
              label: 'ทรัพย์สินฯ',
              data: ipIsee,
              backgroundColor: '#C4B5FD',
              stack: 'isee',
              borderRadius: 6,
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
              right: 12,
            },
          },
          scales: {
            x: {
              stacked: true,
              beginAtZero: true,
              title: { display: true, text: 'จำนวนผลงานที่ขับเคลื่อน (รายการ)' },
            },
            y: {
              stacked: true,
              grid: { display: false },
              ticks: {
                autoSkip: false,
                font: { size: 11.5, weight: 600 },
                color: '#334155',
              },
            },
          },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
            datalabels: {
              color: '#1e293b',
              font: { weight: 'bold', size: 9.5 },
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
      {/* Box 1: Strategic Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <FaCompass style={{ color: '#059669', fontSize: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            ความสอดคล้องตามยุทธศาสตร์มหาวิทยาลัย 4 เสาหลัก
          </h3>
        </div>
        <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
          การกระจายตัวของทั้ง 5 พันธกิจใน 4 เสาหลักยุทธศาสตร์
        </p>
        <div style={{ height: '240px', position: 'relative' }}>
          <canvas id="c_overview_isee_matrix" />
        </div>
      </div>

      {/* Box 2: Core Organizational Values */}
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
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            การขับเคลื่อนตามค่านิยมหลักขององค์กร
          </h3>
        </div>
        <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#64748b' }}>
          สัดส่วนผลงานจริงทั้งคณะตามค่านิยมหลัก 3 ประการ
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
          {/* 1. Integrity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
              <span style={{ color: '#047857' }}>หลักที่ 1 ความซื่อสัตย์และจริยธรรม</span>
              <span style={{ color: '#047857' }}>{iamOverview.iCount} ผลงาน ({iamOverview.iPct}%)</span>
            </div>
            <div style={{ height: '9px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${iamOverview.iPct}%`, height: '100%', backgroundColor: '#6EE7B7', borderRadius: '999px' }} />
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              จริยธรรมการวิจัยและการคุ้มครองสิทธิ์ทรัพย์สินทางปัญญา
            </div>
          </div>

          {/* 2. Agility */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
              <span style={{ color: '#0369a1' }}>หลักที่ 2 ความคล่องตัวและการบริการ</span>
              <span style={{ color: '#0369a1' }}>{iamOverview.aCount} ผลงาน ({iamOverview.aPct}%)</span>
            </div>
            <div style={{ height: '9px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${iamOverview.aPct}%`, height: '100%', backgroundColor: '#7DD3FC', borderRadius: '999px' }} />
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              บริการวิชาการ {validService.length || 305} ครั้ง และการพัฒนาสิ่งประดิษฐ์สู่ชุมชน
            </div>
          </div>

          {/* 3. Mastery */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>
              <span style={{ color: '#6d28d9' }}>หลักที่ 3 ความเชี่ยวชาญในวิชาชีพ</span>
              <span style={{ color: '#6d28d9' }}>{iamOverview.mCount} ผลงาน ({iamOverview.mPct}%)</span>
            </div>
            <div style={{ height: '9px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${iamOverview.mPct}%`, height: '100%', backgroundColor: '#C4B5FD', borderRadius: '999px' }} />
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              โครงการวิจัยขนาดใหญ่และบทความตีพิมพ์ระดับนานาชาติ ({validPub.length || 68} เรื่อง)
            </div>
          </div>
        </div>
      </div>

      {/* Box 3: Top SDGs Impact with Sort Toggle */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaGlobeAmericas style={{ color: '#0284c7', fontSize: '16px' }} />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              เป้าหมายการพัฒนาที่ยั่งยืน
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setSdgSortMode((prev) => (prev === 'desc' ? 'number' : 'desc'))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid #BAE6FD',
              backgroundColor: '#F0F9FF',
              color: '#0369A1',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {sdgSortMode === 'desc' ? (
              <>
                <FaSortAmountDown style={{ fontSize: '10px' }} />
                <span>เรียงมากสุดไปน้อยสุด (กดสลับ 1-17)</span>
              </>
            ) : (
              <>
                <FaSortNumericDown style={{ fontSize: '10px' }} />
                <span>เรียงตามลำดับ 1 - 17 (กดสลับมากไปน้อย)</span>
              </>
            )}
          </button>
        </div>
        <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
          เป้าหมายการพัฒนาที่ยั่งยืนที่มีโครงการและผลงานขับเคลื่อนในคณะ
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {displayedSdgs.map((sdg) => (
            <div
              key={`top-sdg-${sdg.num}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '7px 11px',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '26px',
                      borderRadius: '7px',
                      backgroundColor: sdg.color,
                      color: '#1e293b',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {sdg.num}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1e293b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    เป้าหมายที่ {sdg.num}: {sdg.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#334155',
                    backgroundColor: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    flexShrink: 0,
                  }}
                >
                  {sdg.count} ผลงาน
                </span>
              </div>
              <div style={{ height: '5px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ width: `${sdg.pct}%`, height: '100%', backgroundColor: sdg.color, borderRadius: '999px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
