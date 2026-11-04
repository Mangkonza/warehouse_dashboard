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
  FaExternalLinkAlt,
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
        {/* Card 1 (Hero 40%): Total Financial Volume */}
        <div
          style={{
            gridColumn: 'span 1',
            background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.9) 0%, rgba(240, 253, 250, 0.5) 50%, #ffffff 100%)',
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
                    backgroundColor: '#0ea5e9',
                    borderRadius: '999px 0 0 999px',
                  }}
                  title={`โครงการพัฒนาวิชาการ: ${academicPct}% (${academicMillions} ล้านบาท)`}
                />
                <div
                  style={{
                    width: `${researchPct}%`,
                    backgroundColor: '#10b981',
                    borderRadius: '0 999px 999px 0',
                  }}
                  title={`โครงการวิจัย: ${researchPct}% (${researchMillions} ล้านบาท)`}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11.5px', fontWeight: 600 }}>
                <span style={{ color: '#0284c7' }}>● พัฒนาวิชาการ {academicPct}% ({academicMillions} ล้านบาท)</span>
                <span style={{ color: '#059669' }}>● วิจัย {researchPct}% ({researchMillions} ล้านบาท)</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '18px',
              paddingTop: '14px',
              borderTop: '1px solid #d1fae5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
            }}
          >
            <span style={{ color: '#065f46', fontWeight: 600 }}>
              รายได้จัดสรรเข้าคณะ (15%): <strong>{overheadMillions} ล้านบาท</strong>
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #a7f3d0',
                color: '#047857',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              รวม {totalItems} ผลงาน
            </span>
          </div>
        </div>

        {/* Card 2 (30%): Research Grants */}
        <div
          onClick={() => router.push('/research')}
          style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
            border: '1px solid #a7f3d0',
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
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#047857' }}>
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

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#065f46' }}>
              ทุนภายนอก {(externalResearchBudget / 1000000).toFixed(2)} ล้านบาท ({extResearchPct}%) • ทุนภายใน {(internalResearchBudget / 1000000).toFixed(2)} ล้านบาท
            </div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '11.5px', fontWeight: 600 }}>
            <span>ดูรายละเอียดโครงการวิจัย</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>

        {/* Card 3 (30%): Academic Development */}
        <div
          onClick={() => router.push('/academic')}
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
            border: '1px solid #bae6fd',
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
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1' }}>
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

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#075985' }}>
              รายได้เข้าคณะ (15%): <strong>{overheadMillions} ล้านบาท</strong> • หัวหน้าโครงการ {academicPis} ท่าน
            </div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontSize: '11.5px', fontWeight: 600 }}>
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
        {/* Card 4: Publications */}
        <div
          onClick={() => router.push('/publications')}
          style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)',
            border: '1px solid #fecdd3',
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
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#be123c' }}>
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

            <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#ffe4e6', color: '#be123c', fontSize: '11px', fontWeight: 700 }}>
                Q1: {pubQ1}
              </span>
              <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 700 }}>
                Q2: {pubQ2}
              </span>
              <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 700 }}>
                TCI: {pubTci}
              </span>
            </div>

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#9f1239' }}>
              คณะสนับสนุนจริง: <strong>{pubSupport.toLocaleString('th-TH')} บาท</strong>
            </div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: '#e11d48', fontSize: '11.5px', fontWeight: 600 }}>
            <span>ดูผลงานตีพิมพ์</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>

        {/* Card 5: Academic Services */}
        <div
          onClick={() => router.push('/service')}
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
            border: '1px solid #fed7aa',
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
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#92400e' }}>
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

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#78350f' }}>
              บุคลากรออกบริการ <strong>{serviceStaff} ท่าน</strong> • เครือข่ายภายนอก <strong>{serviceNetworks} หน่วยงาน</strong>
            </div>

            <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#b45309' }}>
              ครอบคลุมหน่วยงานรัฐ ชุมชน เอกชน และต่างประเทศ
            </div>
          </div>

          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706', fontSize: '11.5px', fontWeight: 600 }}>
            <span>ดูงานบริการวิชาการ</span>
            <FaArrowRight style={{ fontSize: '10px' }} />
          </div>
        </div>

        {/* Card 6: Intellectual Property */}
        <div
          onClick={() => router.push('/ip')}
          style={{
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
            border: '1px solid #ddd6fe',
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
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#6d28d9' }}>
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

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#5b21b6' }}>
              ได้รับความคุ้มครองแล้ว <strong>{ipProtected}</strong> • อยู่ระหว่างยื่น/เตรียม <strong>{ipPending}</strong>
            </div>

            <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#7c3aed' }}>
              เงินรางวัลสนับสนุน: <strong>{ipSupport.toLocaleString('th-TH')} บาท</strong>
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
