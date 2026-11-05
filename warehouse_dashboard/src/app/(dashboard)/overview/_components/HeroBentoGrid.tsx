'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FaFlask,
  FaGraduationCap,
  FaBook,
  FaHandshake,
  FaCertificate,
  FaCoins,
  FaArrowRight,
  FaUsers,
  FaNetworkWired,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';

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
  pubQ3?: number;
  pubQ4?: number;
  pubTci1?: number;
  pubTci2?: number;
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
  pubQ3 = 0,
  pubQ4 = 0,
  pubTci1 = 0,
  pubTci2 = 0,
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

  // Financial calculations
  const totalMillions = (totalFinancialVolume / 1000000).toFixed(2);
  const researchMillions = (researchBudget / 1000000).toFixed(2);
  const academicMillions = (academicBudget / 1000000).toFixed(2);
  const overheadMillions = (facultyOverhead / 1000000).toFixed(2);

  // Proportions
  const academicPct = totalFinancialVolume > 0 ? ((academicBudget / totalFinancialVolume) * 100).toFixed(1) : '81.8';
  const researchPct = totalFinancialVolume > 0 ? ((researchBudget / totalFinancialVolume) * 100).toFixed(1) : '18.2';

  // Research external vs internal
  const extResearchPctNum = researchBudget > 0 ? (externalResearchBudget / researchBudget) * 100 : 99.3;
  const extResearchPct = extResearchPctNum.toFixed(1);
  const intResearchPct = (100 - extResearchPctNum).toFixed(1);

  // Publications quality tier distribution
  const totalPubSafe = pubCount || 1;
  const pubQ1Pct = ((pubQ1 / totalPubSafe) * 100).toFixed(1);
  const pubQ2Pct = ((pubQ2 / totalPubSafe) * 100).toFixed(1);
  const pubTciPct = ((pubTci / totalPubSafe) * 100).toFixed(1);
  const otherPubCount = Math.max(0, pubCount - (pubQ1 + pubQ2 + pubTci));
  const otherPubPct = ((otherPubCount / totalPubSafe) * 100).toFixed(1);

  // IP pipeline distribution
  const totalIpSafe = ipCount || 1;
  const ipProtectedPct = ((ipProtected / totalIpSafe) * 100).toFixed(1);
  const ipPendingPct = ((ipPending / totalIpSafe) * 100).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ROW 1: Financial & Revenue Volume (40% : 30% : 30%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Total Financial Volume (งบประมาณรวมทุกพันธกิจของคณะ) */}
        <div
          style={{
            gridColumn: 'span 1',
            background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(240, 253, 250, 0.6) 50%, #ffffff 100%)',
            border: '1.5px solid #a7f3d0',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#047857', letterSpacing: '0.01em' }}>
                งบประมาณรวมทุกพันธกิจของคณะ
              </span>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: '#d1fae5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                }}
              >
                <FaCoins style={{ fontSize: '18px' }} />
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '36px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
                {totalMillions}
              </span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#047857' }}>
                ล้านบาท
              </span>
            </div>

            {/* Two-Tone Pastel Progress Bar */}
            <div style={{ marginTop: '14px' }}>
              <div
                style={{
                  height: '10px',
                  borderRadius: '999px',
                  backgroundColor: '#e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: `${academicPct}%`,
                    backgroundColor: '#93c5fd', // Pastel Sky
                    borderRadius: '999px 0 0 999px',
                  }}
                  title={`โครงการพัฒนาวิชาการ: ${academicPct}% (${academicMillions} ล้านบาท)`}
                />
                <div
                  style={{
                    width: `${researchPct}%`,
                    backgroundColor: '#86efac', // Pastel Mint
                    borderRadius: '0 999px 999px 0',
                  }}
                  title={`โครงการวิจัย: ${researchPct}% (${researchMillions} ล้านบาท)`}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11.5px', fontWeight: 600 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0369a1' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9' }} />
                  พัฒนาวิชาการ {academicPct}% ({academicMillions} ล้านบาท)
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#047857' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  วิจัย {researchPct}% ({researchMillions} ล้านบาท)
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Micro-stat Bar */}
          <div
            style={{
              marginTop: '18px',
              paddingTop: '14px',
              borderTop: '1px solid #d1fae5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <span>จัดสรรเข้าคณะ (15%):</span>
              <strong style={{ color: '#047857' }}>{overheadMillions} ล้านบาท</strong>
            </div>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #a7f3d0',
                color: '#047857',
                fontWeight: 700,
                fontSize: '11.5px',
                whiteSpace: 'nowrap',
              }}
            >
              รวม {totalItems.toLocaleString('th-TH')} ผลงาน
            </span>
          </div>
        </div>

        {/* Card 2: Research Grants (โครงการวิจัย) */}
        <div
          onClick={() => router.push('/research')}
          style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
            border: '1.5px solid #a7f3d0',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.14)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.06)';
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#047857' }}>
                  โครงการวิจัย
                </span>
                <div style={{ marginTop: '4px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#d1fae5',
                      color: '#065f46',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {researchCount} โครงการ
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#d1fae5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                }}
              >
                <FaFlask style={{ fontSize: '16px' }} />
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {researchMillions}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#047857' }}>
                ล้านบาท
              </span>
            </div>

            {/* Visual 2-Segment Pastel Progress Bar (External vs Internal) */}
            <div style={{ marginTop: '14px' }}>
              <div
                style={{
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: '#e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: `${extResearchPct}%`,
                    backgroundColor: '#86efac', // Pastel Mint
                    borderRadius: '999px 0 0 999px',
                  }}
                  title={`ทุนภายนอก: ${extResearchPct}%`}
                />
                <div
                  style={{
                    width: `${intResearchPct}%`,
                    minWidth: extResearchPctNum < 100 ? '4px' : '0',
                    backgroundColor: '#93c5fd', // Pastel Sky
                    borderRadius: '0 999px 999px 0',
                  }}
                  title={`ทุนภายใน: ${intResearchPct}%`}
                />
              </div>

              {/* Micro-Stat Chips Replacing Dense Sentence */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', gap: '4px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#065f46' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span>ทุนภายนอก {(externalResearchBudget / 1000000).toFixed(2)}M</span>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#ecfdf5', color: '#047857' }}>
                    {extResearchPct}%
                  </span>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#0369a1' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0ea5e9' }} />
                  <span>ทุนภายใน {(internalResearchBudget / 1000000).toFixed(2)}M</span>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#f0f9ff', color: '#0369a1' }}>
                    {intResearchPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '11.5px', fontWeight: 600 }}>
            <span>ดูรายละเอียดโครงการวิจัย</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>

        {/* Card 3: Academic Development (โครงการพัฒนาวิชาการ) */}
        <div
          onClick={() => router.push('/academic')}
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
            border: '1.5px solid #bae6fd',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(14, 165, 233, 0.14)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.06)';
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0369a1' }}>
                  โครงการพัฒนาวิชาการ
                </span>
                <div style={{ marginTop: '4px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#e0f2fe',
                      color: '#075985',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {academicCount} โครงการ
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284c7',
                }}
              >
                <FaGraduationCap style={{ fontSize: '18px' }} />
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {academicMillions}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#0369a1' }}>
                ล้านบาท
              </span>
            </div>

            {/* Visual 2-Segment Pastel Split Bar (85% Operation vs 15% Overhead) */}
            <div style={{ marginTop: '14px' }}>
              <div
                style={{
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: '#e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: '85%',
                    backgroundColor: '#93c5fd', // Pastel Sky
                    borderRadius: '999px 0 0 999px',
                  }}
                  title="งบดำเนินโครงการ: 85%"
                />
                <div
                  style={{
                    width: '15%',
                    backgroundColor: '#86efac', // Pastel Mint
                    borderRadius: '0 999px 999px 0',
                  }}
                  title={`จัดสรรเข้าคณะ: 15% (${overheadMillions} ล้านบาท)`}
                />
              </div>

              {/* Micro-Stat Badges Replacing Dense Sentence */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', gap: '6px' }}>
                <div
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  จัดสรรคณะ 15%: <strong>{overheadMillions}M</strong>
                </div>

                <div
                  style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    color: '#0369a1',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FaUsers style={{ fontSize: '10px' }} />
                  <span>หัวหน้าโครงการ {academicPis} ท่าน</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontSize: '11.5px', fontWeight: 600 }}>
            <span>ดูรายละเอียดโครงการพัฒนาวิชาการ</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>
      </div>

      {/* ROW 2: Output, Society & Innovation (33.3% each) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 4: Academic Publications (ผลงานตีพิมพ์ทางวิชาการ) */}
        <div
          onClick={() => router.push('/publications')}
          style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)',
            border: '1.5px solid #fecdd3',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(244, 63, 94, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 63, 94, 0.14)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 63, 94, 0.06)';
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#be123c' }}>
                ผลงานตีพิมพ์ทางวิชาการ
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#ffe4e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e11d48',
                }}
              >
                <FaBook style={{ fontSize: '16px' }} />
              </div>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {pubCount}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#be123c' }}>
                เรื่อง
              </span>
            </div>

            {/* Visual Multi-Segment Pastel Quality Bar (Q1 / Q2 / TCI / Other) */}
            <div style={{ marginTop: '14px' }}>
              <div
                style={{
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: '#e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{ width: `${pubQ1Pct}%`, backgroundColor: '#fda4af' }} // Pastel Rose
                  title={`Q1: ${pubQ1} เรื่อง (${pubQ1Pct}%)`}
                />
                <div
                  style={{ width: `${pubQ2Pct}%`, backgroundColor: '#93c5fd' }} // Pastel Sky
                  title={`Q2: ${pubQ2} เรื่อง (${pubQ2Pct}%)`}
                />
                <div
                  style={{ width: `${pubTciPct}%`, backgroundColor: '#fde68a' }} // Pastel Amber
                  title={`TCI: ${pubTci} เรื่อง (${pubTciPct}%)`}
                />
                {otherPubCount > 0 && (
                  <div
                    style={{ width: `${otherPubPct}%`, backgroundColor: '#e2e8f0' }}
                    title={`อื่นๆ: ${otherPubCount} เรื่อง (${otherPubPct}%)`}
                  />
                )}
              </div>

              {/* Micro-Stat Chips Under Quality Bar */}
              <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <span style={{ padding: '2px 6px', borderRadius: '5px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: '10.5px', fontWeight: 700 }}>
                  Q1: {pubQ1}
                </span>
                <span style={{ padding: '2px 6px', borderRadius: '5px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1', fontSize: '10.5px', fontWeight: 700 }}>
                  Q2: {pubQ2}
                </span>
                <span style={{ padding: '2px 6px', borderRadius: '5px', backgroundColor: '#fefce8', border: '1px solid #fde68a', color: '#b45309', fontSize: '10.5px', fontWeight: 700 }}>
                  Q3: {pubQ3}
                </span>
                <span style={{ padding: '2px 6px', borderRadius: '5px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#ea580c', fontSize: '10.5px', fontWeight: 700 }}>
                  Q4: {pubQ4}
                </span>
                <span style={{ padding: '2px 6px', borderRadius: '5px', backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', color: '#7c3aed', fontSize: '10.5px', fontWeight: 700 }}>
                  TCI 1: {pubTci1}
                </span>
                <span style={{ padding: '2px 6px', borderRadius: '5px', backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', color: '#9333ea', fontSize: '10.5px', fontWeight: 700 }}>
                  TCI 2: {pubTci2}
                </span>
              </div>

              {/* Financial Support Micro-Badge */}
              <div
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#fff1f2',
                  border: '1px solid #ffe4e6',
                  color: '#9f1239',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>เงินสนับสนุนคณะ:</span>
                <strong style={{ color: '#be123c' }}>฿{pubSupport.toLocaleString('th-TH')}</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: '#e11d48', fontSize: '11.5px', fontWeight: 600 }}>
            <span>ดูผลงานตีพิมพ์</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>

        {/* Card 5: Academic Services (งานบริการวิชาการ) */}
        <div
          onClick={() => router.push('/service')}
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
            border: '1.5px solid #fed7aa',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.14)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.06)';
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#92400e' }}>
                งานบริการวิชาการ
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d97706',
                }}
              >
                <FaHandshake style={{ fontSize: '18px' }} />
              </div>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {serviceCount}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#92400e' }}>
                ครั้ง
              </span>
            </div>

            {/* Dual Micro-Stat Badges Replacing Dense Sentence */}
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div
                style={{
                  padding: '6px 8px',
                  borderRadius: '8px',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FaUsers style={{ color: '#d97706', fontSize: '13px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#92400e', lineHeight: 1.2 }}>บุคลากรออกบริการ</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#78350f' }}>{serviceStaff} ท่าน</div>
                </div>
              </div>

              <div
                style={{
                  padding: '6px 8px',
                  borderRadius: '8px',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FaNetworkWired style={{ color: '#d97706', fontSize: '12px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#92400e', lineHeight: 1.2 }}>เครือข่ายภายนอก</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#78350f' }}>{serviceNetworks} หน่วยงาน</div>
                </div>
              </div>
            </div>

            {/* Sector Coverage Tags Replacing Narrative Sentence */}
            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {['ภาครัฐ', 'ภาคเอกชน', 'ชุมชน/สังคม', 'นานาชาติ'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #fed7aa',
                    color: '#b45309',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontSize: '11.5px', fontWeight: 600 }}>
            <span>ดูงานบริการวิชาการ</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>

        {/* Card 6: Intellectual Property (งานทรัพย์สินทางปัญญา) */}
        <div
          onClick={() => router.push('/ip')}
          style={{
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
            border: '1.5px solid #ddd6fe',
            borderRadius: '24px',
            padding: '22px',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.14)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.06)';
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#6d28d9' }}>
                งานทรัพย์สินทางปัญญา
              </span>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#ede9fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7c3aed',
                }}
              >
                <FaCertificate style={{ fontSize: '16px' }} />
              </div>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {ipCount}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#6d28d9' }}>
                รายการ
              </span>
            </div>

            {/* Visual 2-Segment Pastel Pipeline Bar (Granted vs Pending) */}
            <div style={{ marginTop: '14px' }}>
              <div
                style={{
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: '#e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{ width: `${ipProtectedPct}%`, backgroundColor: '#ddd6fe' }} // Pastel Violet
                  title={`ได้รับความคุ้มครองแล้ว: ${ipProtected} (${ipProtectedPct}%)`}
                />
                <div
                  style={{ width: `${ipPendingPct}%`, backgroundColor: '#ede9fe' }} // Soft Lavender
                  title={`อยู่ระหว่างยื่น/เตรียม: ${ipPending} (${ipPendingPct}%)`}
                />
              </div>

              {/* Micro-Stat Badges Replacing Dense Sentence */}
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: '6px',
                    backgroundColor: '#f5f3ff',
                    border: '1px solid #ddd6fe',
                    color: '#6d28d9',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FaCheckCircle style={{ fontSize: '10px', color: '#7c3aed' }} />
                  คุ้มครองแล้ว: <strong>{ipProtected}</strong> ({ipProtectedPct}%)
                </span>

                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: '6px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FaClock style={{ fontSize: '10px', color: '#94a3b8' }} />
                  ยื่น/เตรียม: <strong>{ipPending}</strong> ({ipPendingPct}%)
                </span>
              </div>

              {/* Incentive Micro-Badge */}
              <div
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#f5f3ff',
                  border: '1px solid #ede9fe',
                  color: '#5b21b6',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>เงินรางวัลสนับสนุน:</span>
                <strong style={{ color: '#6d28d9' }}>฿{ipSupport.toLocaleString('th-TH')}</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: '#7c3aed', fontSize: '11.5px', fontWeight: 600 }}>
            <span>ดูงานทรัพย์สินทางปัญญา</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
