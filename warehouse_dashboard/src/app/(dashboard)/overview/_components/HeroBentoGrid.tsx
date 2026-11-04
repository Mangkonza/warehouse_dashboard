'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';

interface HeroBentoGridProps {
  totalItems: number;
  totalFinancialVolume: number;
  facultyOverhead: number;
  researchCount: number;
  researchBudget: number;
  externalResearchBudget: number;
  internalResearchBudget: number;
  academicCount: number;
  academicBudget: number;
  academicPis: number;
  pubCount: number;
  pubQ1: number;
  pubQ2: number;
  pubTci: number;
  pubSupport: number;
  serviceCount: number;
  serviceStaff: number;
  serviceNetworks: number;
  ipCount: number;
  ipProtected: number;
  ipPending: number;
  ipSupport: number;
}

export function HeroBentoGrid({
  totalItems,
  totalFinancialVolume,
  facultyOverhead,
  researchCount,
  researchBudget,
  externalResearchBudget,
  internalResearchBudget,
  academicCount,
  academicBudget,
  academicPis,
  pubCount,
  pubQ1,
  pubQ2,
  pubTci,
  pubSupport,
  serviceCount,
  serviceStaff,
  serviceNetworks,
  ipCount,
  ipProtected,
  ipPending,
  ipSupport,
}: HeroBentoGridProps) {
  const router = useRouter();

  const totalMillions = (totalFinancialVolume / 1000000).toFixed(2);
  const researchMillions = (researchBudget / 1000000).toFixed(2);
  const academicMillions = (academicBudget / 1000000).toFixed(2);
  const overheadMillions = (facultyOverhead / 1000000).toFixed(2);

  const academicPct = totalFinancialVolume > 0 ? ((academicBudget / totalFinancialVolume) * 100).toFixed(1) : '81.8';
  const researchPct = totalFinancialVolume > 0 ? ((researchBudget / totalFinancialVolume) * 100).toFixed(1) : '18.2';
  const extResearchPct = researchBudget > 0 ? ((externalResearchBudget / researchBudget) * 100).toFixed(1) : '99.3';
  const intResearchPct = researchBudget > 0 ? ((internalResearchBudget / researchBudget) * 100).toFixed(1) : '0.7';

  const pubTotalForBars = Math.max(pubCount, 1);
  const q1Pct = Math.round((pubQ1 / pubTotalForBars) * 100);
  const q2Pct = Math.round((pubQ2 / pubTotalForBars) * 100);
  const tciPct = Math.round((pubTci / pubTotalForBars) * 100);

  const ipTotalForBars = Math.max(ipCount, 1);
  const ipProtectedPct = Math.round((ipProtected / ipTotalForBars) * 100);
  const ipPendingPct = Math.round((ipPending / ipTotalForBars) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ROW 1: Financial & Revenue Volume */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Total Financial Volume */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDFA 55%, #FFFFFF 100%)',
            border: '1.5px solid #A7F3D0',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.07)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Pastel Illustration */}
          <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '120px', height: '120px', pointerEvents: 'none', opacity: 0.9 }}>
            <svg viewBox="0 0 120 120" fill="none">
              <circle cx="88" cy="34" r="44" fill="#A7F3D0" fillOpacity="0.4" />
              <circle cx="52" cy="24" r="24" fill="#99F6E4" fillOpacity="0.45" />
              <rect x="52" y="42" width="10" height="28" rx="4" fill="#34D399" />
              <rect x="66" y="30" width="10" height="40" rx="4" fill="#10B981" />
              <rect x="80" y="20" width="10" height="50" rx="4" fill="#059669" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#047857' }}>
                งบประมาณรวมทุกพันธกิจของคณะ
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#D1FAE5',
                  color: '#065F46',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                รวม {totalItems} ผลงาน
              </span>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                {totalMillions}
              </span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#047857' }}>
                ล้านบาท
              </span>
            </div>

            {/* Visual Proportional Stacked Bar + Split Cards */}
            <div style={{ marginTop: '12px' }}>
              <div
                style={{
                  height: '12px',
                  borderRadius: '999px',
                  backgroundColor: '#E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  padding: '2px',
                  gap: '2px',
                }}
              >
                <div
                  style={{
                    width: `${academicPct}%`,
                    backgroundColor: '#7DD3FC',
                    borderRadius: '999px 4px 4px 999px',
                  }}
                />
                <div
                  style={{
                    width: `${researchPct}%`,
                    backgroundColor: '#6EE7B7',
                    borderRadius: '4px 999px 999px 4px',
                  }}
                />
              </div>

              {/* 2-Column Visual Proportion Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    border: '1px solid #BAE6FD',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#7DD3FC', display: 'inline-block' }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0369A1' }}>พัฒนาวิชาการ</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{academicPct}%</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    border: '1px solid #A7F3D0',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#6EE7B7', display: 'inline-block' }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#047857' }}>งานวิจัย</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{researchPct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Visual Ring + Overhead Box */}
          <div
            style={{
              marginTop: '12px',
              padding: '10px 12px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="34" height="34" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="4"
                  strokeDasharray="88"
                  strokeDashoffset="74"
                  strokeLinecap="round"
                />
                <text x="18" y="21" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#047857">
                  15%
                </text>
              </svg>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>เงินรายได้จัดสรรเข้าคณะ</div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#065F46' }}>{overheadMillions} ล้านบาท</div>
              </div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', backgroundColor: '#ECFDF5', padding: '4px 8px', borderRadius: '8px' }}>
              บำรุงคณะ
            </span>
          </div>
        </div>

        {/* Card 2: Research Grants */}
        <div
          onClick={() => router.push('/research')}
          style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
            border: '1px solid #BBF7D0',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.06)';
          }}
        >
          {/* Decorative SVG */}
          <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '110px', height: '110px', pointerEvents: 'none', opacity: 0.9 }}>
            <svg viewBox="0 0 110 110" fill="none">
              <circle cx="82" cy="30" r="38" fill="#BBF7D0" fillOpacity="0.45" />
              <circle cx="55" cy="48" r="14" fill="#6EE7B7" fillOpacity="0.5" />
              <path d="M68 20L76 38H60L68 20Z" fill="#34D399" fillOpacity="0.7" />
              <circle cx="82" cy="52" r="8" fill="#10B981" fillOpacity="0.6" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#047857' }}>
                โครงการวิจัย
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {researchCount} โครงการ
              </span>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
                {researchMillions}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#047857' }}>
                ล้านบาท
              </span>
            </div>

            {/* Visual Funding Source Comparison Bars */}
            <div
              style={{
                marginTop: '12px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: '1px solid #DCFCE7',
                borderRadius: '14px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700, marginBottom: '4px' }}>
                  <span style={{ color: '#065F46' }}>แหล่งทุนภายนอก</span>
                  <span style={{ color: '#047857' }}>{(externalResearchBudget / 1000000).toFixed(2)} ล้านบาท ({extResearchPct}%)</span>
                </div>
                <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(Number(extResearchPct), 6)}%`, height: '100%', backgroundColor: '#6EE7B7', borderRadius: '999px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700, marginBottom: '4px' }}>
                  <span style={{ color: '#475569' }}>แหล่งทุนภายใน</span>
                  <span style={{ color: '#334155' }}>{(internalResearchBudget / 1000000).toFixed(2)} ล้านบาท ({intResearchPct}%)</span>
                </div>
                <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(Number(intResearchPct), 6)}%`, height: '100%', backgroundColor: '#93C5FD', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#059669', fontSize: '11.5px', fontWeight: 700 }}>
            <span>ดูรายละเอียดโครงการวิจัย</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>

        {/* Card 3: Academic Development */}
        <div
          onClick={() => router.push('/academic')}
          style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)',
            border: '1px solid #BAE6FD',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(14, 165, 233, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.06)';
          }}
        >
          {/* Decorative SVG */}
          <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '110px', height: '110px', pointerEvents: 'none', opacity: 0.9 }}>
            <svg viewBox="0 0 110 110" fill="none">
              <circle cx="82" cy="30" r="38" fill="#BAE6FD" fillOpacity="0.45" />
              <rect x="48" y="24" width="38" height="28" rx="8" fill="#7DD3FC" fillOpacity="0.6" />
              <circle cx="56" cy="54" r="10" fill="#38BDF8" fillOpacity="0.5" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0369A1' }}>
                โครงการพัฒนาวิชาการ
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#E0F2FE',
                  color: '#075985',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {academicCount} โครงการ
              </span>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
                {academicMillions}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0369A1' }}>
                ล้านบาท
              </span>
            </div>

            {/* Visual 2-Box Metric Split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: '1px solid #BAE6FD',
                  borderRadius: '12px',
                  padding: '10px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>จัดสรรเข้าคณะ (15%)</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0369A1', marginTop: '2px' }}>
                  {overheadMillions} ล้าน
                </div>
                <div style={{ height: '5px', borderRadius: '999px', backgroundColor: '#E0F2FE', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', backgroundColor: '#7DD3FC', borderRadius: '999px' }} />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: '1px solid #BAE6FD',
                  borderRadius: '12px',
                  padding: '10px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>หัวหน้าโครงการ</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  {academicPis} ท่าน
                </div>
                {/* Visual Avatar Dots */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  {[0, 1, 2, 3, 4].map((dot) => (
                    <span
                      key={dot}
                      style={{
                        width: '10px',
                        height: '6px',
                        borderRadius: '999px',
                        backgroundColor: dot < 4 ? '#7DD3FC' : '#E2E8F0',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0284C7', fontSize: '11.5px', fontWeight: 700 }}>
            <span>ดูรายละเอียดโครงการพัฒนาวิชาการ</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>
      </div>

      {/* ROW 2: Output, Society & Innovation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 4: Publications */}
        <div
          onClick={() => router.push('/publications')}
          style={{
            background: 'linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%)',
            border: '1px solid #FECDD3',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(244, 63, 94, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 63, 94, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 63, 94, 0.06)';
          }}
        >
          {/* Decorative SVG */}
          <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '110px', height: '110px', pointerEvents: 'none', opacity: 0.9 }}>
            <svg viewBox="0 0 110 110" fill="none">
              <circle cx="82" cy="30" r="38" fill="#FECDD3" fillOpacity="0.45" />
              <rect x="52" y="20" width="32" height="40" rx="6" fill="#FDA4AF" fillOpacity="0.65" />
              <line x1="58" y1="30" x2="76" y2="30" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="58" y1="38" x2="72" y2="38" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#BE123C' }}>
                ผลงานตีพิมพ์ทางวิชาการ
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#FFE4E6',
                  color: '#9F1239',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                สนับสนุน {pubSupport.toLocaleString('th-TH')} บาท
              </span>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
                {pubCount}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#BE123C' }}>
                เรื่อง
              </span>
            </div>

            {/* Visual 3-Tier Horizontal Mini Bar Chart */}
            <div
              style={{
                marginTop: '12px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: '1px solid #FECDD3',
                borderRadius: '14px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '7px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '105px 1fr 36px', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#9F1239' }}>นานาชาติกลุ่มที่ 1</span>
                <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(q1Pct, 6)}%`, height: '100%', backgroundColor: '#FDA4AF', borderRadius: '999px' }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', textAlign: 'right' }}>{pubQ1}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '105px 1fr 36px', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369A1' }}>นานาชาติกลุ่มที่ 2</span>
                <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(q2Pct, 6)}%`, height: '100%', backgroundColor: '#93C5FD', borderRadius: '999px' }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', textAlign: 'right' }}>{pubQ2}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '105px 1fr 36px', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>วารสารระดับชาติ</span>
                <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.max(tciPct, 6)}%`, height: '100%', backgroundColor: '#FCD34D', borderRadius: '999px' }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', textAlign: 'right' }}>{pubTci}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#E11D48', fontSize: '11.5px', fontWeight: 700 }}>
            <span>ดูผลงานตีพิมพ์ทั้งหมด</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>

        {/* Card 5: Academic Services */}
        <div
          onClick={() => router.push('/service')}
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)',
            border: '1px solid #FDE68A',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.06)';
          }}
        >
          {/* Decorative SVG */}
          <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '110px', height: '110px', pointerEvents: 'none', opacity: 0.9 }}>
            <svg viewBox="0 0 110 110" fill="none">
              <circle cx="82" cy="30" r="38" fill="#FDE68A" fillOpacity="0.5" />
              <circle cx="58" cy="32" r="10" fill="#FBBF24" fillOpacity="0.65" />
              <circle cx="78" cy="40" r="8" fill="#F59E0B" fillOpacity="0.6" />
              <path d="M44 58C44 50 52 46 60 46C68 46 76 50 76 58" fill="#FCD34D" fillOpacity="0.7" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#92400E' }}>
                งานบริการวิชาการ
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                บริการสังคมและชุมชน
              </span>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
                {serviceCount}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#92400E' }}>
                ครั้ง
              </span>
            </div>

            {/* Visual Impact Infographics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: '1px solid #FDE68A',
                  borderRadius: '12px',
                  padding: '10px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>บุคลากรร่วมบริการ</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#92400E', marginTop: '2px' }}>
                  {serviceStaff} ท่าน
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: '1px solid #FDE68A',
                  borderRadius: '12px',
                  padding: '10px',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>เครือข่ายภายนอก</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  {serviceNetworks} แห่ง
                </div>
              </div>
            </div>

            {/* 4-Sector Visual Pill Strip */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
              {[
                { label: 'ภาครัฐ', bg: '#DBEAFE', text: '#1E40AF' },
                { label: 'ชุมชน', bg: '#DCFCE7', text: '#166534' },
                { label: 'เอกชน', bg: '#FEF3C7', text: '#92400E' },
                { label: 'นานาชาติ', bg: '#F3E8FF', text: '#6B21A8' },
              ].map((s) => (
                <span
                  key={s.label}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '3px 4px',
                    borderRadius: '6px',
                    backgroundColor: s.bg,
                    color: s.text,
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#D97706', fontSize: '11.5px', fontWeight: 700 }}>
            <span>ดูงานบริการวิชาการ</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>

        {/* Card 6: Intellectual Property */}
        <div
          onClick={() => router.push('/ip')}
          style={{
            background: 'linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 100%)',
            border: '1px solid #DDD6FE',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.06)';
          }}
        >
          {/* Decorative SVG */}
          <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '110px', height: '110px', pointerEvents: 'none', opacity: 0.9 }}>
            <svg viewBox="0 0 110 110" fill="none">
              <circle cx="82" cy="30" r="38" fill="#DDD6FE" fillOpacity="0.5" />
              <path d="M68 18L88 26V42C88 54 79 64 68 68C57 64 48 54 48 42V26L68 18Z" fill="#C4B5FD" fillOpacity="0.7" />
              <path d="M62 42L66 46L75 36" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#6D28D9' }}>
                งานทรัพย์สินทางปัญญา
              </span>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: '#EDE9FE',
                  color: '#5B21B6',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                สนับสนุน {ipSupport.toLocaleString('th-TH')} บาท
              </span>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
                {ipCount}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#6D28D9' }}>
                รายการ
              </span>
            </div>

            {/* Visual Pipeline Progress Gauge */}
            <div
              style={{
                marginTop: '12px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: '1px solid #DDD6FE',
                borderRadius: '14px',
                padding: '10px 12px',
              }}
            >
              <div
                style={{
                  height: '10px',
                  borderRadius: '999px',
                  backgroundColor: '#F1F5F9',
                  overflow: 'hidden',
                  display: 'flex',
                  gap: '2px',
                }}
              >
                <div style={{ width: `${ipProtectedPct}%`, backgroundColor: '#86EFAC', borderRadius: '999px 0 0 999px' }} />
                <div style={{ width: `${ipPendingPct}%`, backgroundColor: '#C4B5FD', borderRadius: '0 999px 999px 0' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#047857' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#86EFAC' }} />
                    คุ้มครองแล้ว
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{ipProtected}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#6D28D9' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C4B5FD' }} />
                    รอดำเนินการ
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{ipPending}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#7C3AED', fontSize: '11.5px', fontWeight: 700 }}>
            <span>ดูงานทรัพย์สินทางปัญญา</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
