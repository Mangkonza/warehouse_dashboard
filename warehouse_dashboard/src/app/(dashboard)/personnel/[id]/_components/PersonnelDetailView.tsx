'use client';

const DEFAULT_AVATAR = `${(process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '')}/default-avatar.png`;

import { getAssetUrl } from '@/lib/api';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePersonnelData } from '../../_hooks/usePersonnelData';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import {
  DepartmentBadge,
  PublicationTypeBadge,
  IPTypeBadge,
  ServiceTypeBadge,
  RecordDetailDrawer,
} from '@/components/ui';
import { resolvePersonAvatar } from '@/lib/personnelService';
import { autoDetectJournalRanking, JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
import { JournalTierBadge } from '@/components/ui/JournalTierBadge';
import {
  FaArrowLeft,
  FaFlask,
  FaBook,
  FaCertificate,
  FaGraduationCap,
  FaHandsHelping,
  FaEnvelope,
  FaIdCard,
  FaBuilding,
  FaCoins,
  FaClock,
  FaExternalLinkAlt,
  FaCheckCircle,
} from 'react-icons/fa';

interface PersonnelDetailViewProps {
  personnelId: string;
  fallbackName?: string;
}

type TabKey = 'all' | 'research' | 'publications' | 'ip' | 'academic' | 'service';

function parseItemBudget(item: any): number {
  if (typeof item.budget === 'number') return item.budget;
  if (item.budget && !isNaN(Number(item.budget))) return Number(item.budget);
  const intVal = Number(item.budget_internal) || 0;
  const extVal = Number(item.budget_external) || 0;
  return intVal + extVal;
}

export function PersonnelDetailView({ personnelId, fallbackName }: PersonnelDetailViewProps) {
  const router = useRouter();
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [ignoreTimeFilter, setIgnoreTimeFilter] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<{
    item: any;
    categoryKey: string;
  } | null>(null);

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo') || urlParams.get('from');
      if (returnTo && returnTo.startsWith('/')) {
        router.push(returnTo);
        return;
      }

      const isExternalReferrer =
        typeof document !== 'undefined' &&
        document.referrer &&
        !document.referrer.startsWith(window.location.origin);

      if (!isExternalReferrer && window.history.length > 1) {
        router.back();
        return;
      }

      if (
        typeof document !== 'undefined' &&
        document.referrer &&
        document.referrer.startsWith(window.location.origin)
      ) {
        router.push(document.referrer.replace(window.location.origin, ''));
        return;
      }
    }

    router.push('/personnel');
  };

  useEffect(() => {
    setImageError(false);
  }, [personnelId]);

  // Hook with time filter or undefined when user chooses all-time
  const activeFilter = ignoreTimeFilter ? undefined : timeFilter;
  const { getPersonPortfolio, personnelMetrics, isLoaded } = usePersonnelData(activeFilter);

  const portfolio = useMemo(() => {
    return getPersonPortfolio(personnelId, fallbackName);
  }, [getPersonPortfolio, personnelId, fallbackName]);

  const profileImageUrl =
    portfolio?.imageUrl ||
    portfolio?.personnel?.image_url ||
    resolvePersonAvatar(portfolio?.id || personnelId, portfolio?.name);

  if (!portfolio) {
    if (!isLoaded) {
      return (
        <div
          style={{
            padding: '48px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            fontSize: '14px',
          }}
        >
          กำลังโหลดข้อมูลแฟ้มผลงานบุคลากร...
        </div>
      );
    }
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>
          ไม่พบข้อมูลอาจารย์ / บุคลากร รหัส: {personnelId}
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>
          อาจไม่มีรหัสนี้ในฐานข้อมูล หรือข้อมูลถูกลบไปแล้ว
        </p>
        <button
          type="button"
          onClick={handleBack}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#00A651',
            color: '#ffffff',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
          title="ย้อนกลับไปหน้าเดิม"
        >
          <FaArrowLeft style={{ fontSize: '12px' }} />
          <span>ย้อนกลับ</span>
        </button>
      </div>
    );
  }

  const budgetMillions = (portfolio.budgets.total / 1000000).toFixed(2);
  const researchBudgetM = (portfolio.budgets.research / 1000000).toFixed(2);
  const academicBudgetM = (portfolio.budgets.academic / 1000000).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* 1. Navigation & Actions Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#475569',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
          title="ย้อนกลับไปหน้าเดิม"
        >
          <FaArrowLeft style={{ fontSize: '12px' }} />
          <span>ย้อนกลับ</span>
        </button>

        
      </div>

      {/* TimeFilterBar if not in ignore mode */}
      {!ignoreTimeFilter && (
        <TimeFilterBar
          value={timeFilter}
          onChange={setTimeFilter}
          onReset={resetTimeFilter}
          totalCount={portfolio.counts.total}
        />
      )}

      {/* 2. Personnel Profile Header Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Profile Image (ถ้าไม่พบรูปให้ใช้ default avatar) */}
            <img
              src={
                profileImageUrl && !imageError
                  ? (() => {
                      try {
                        return getAssetUrl(encodeURI(decodeURI(profileImageUrl.trim())));
                      } catch {
                        return getAssetUrl(encodeURI(profileImageUrl.trim()));
                      }
                    })()
                  : DEFAULT_AVATAR
              }
              alt={portfolio.name}
              onError={() => setImageError(true)}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '14px',
                objectFit: 'cover',
                objectPosition: 'top center',
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                flexShrink: 0,
                backgroundColor: '#99b8db',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {portfolio.name}
                </h2>
                <span
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  รหัสบุคลากร: {portfolio.id}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                  marginTop: '6px',
                  fontSize: '13px',
                  color: '#475569',
                }}
              >
                {portfolio.position && (
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    {portfolio.position}
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaBuilding style={{ color: '#94a3b8', fontSize: '12px' }} />
                  <DepartmentBadge value={portfolio.department} />
                </div>
                {portfolio.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaEnvelope style={{ color: '#94a3b8', fontSize: '12px' }} />
                    <span style={{ color: '#0284c7' }}>{portfolio.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Summary Pill Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#f8fafc',
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ผลงานรวม 5 ด้าน</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#00A651', fontVariantNumeric: 'tabular-nums' }}>
                {portfolio.counts.total} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>รายการ</span>
              </div>
            </div>
            <div style={{ width: '1px', height: '36px', backgroundColor: '#cbd5e1' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>งบประมาณโครงการรวม</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                {budgetMillions} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>ล้านบาท</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Mission Metric Chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '16px',
          }}
        >
          {/* Research */}
          <div
            onClick={() => setActiveTab('research')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'research' ? '#ecfdf5' : '#f8fafc',
              border: activeTab === 'research' ? '1.5px solid #00A651' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00A651', fontSize: '12px', fontWeight: 600 }}>
              <FaFlask />
              <span>โครงการวิจัย</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
              {portfolio.counts.research} โครงการ
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>
              งบรวม {researchBudgetM} ล้านบาท
            </div>
          </div>

          {/* Publications */}
          <div
            onClick={() => setActiveTab('publications')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'publications' ? '#fff1f2' : '#f8fafc',
              border: activeTab === 'publications' ? '1.5px solid #e11d48' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontSize: '12px', fontWeight: 600 }}>
              <FaBook />
              <span>ผลงานตีพิมพ์</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
              {portfolio.counts.publications} เรื่อง
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>
              Q1/Q2: {portfolio.pubQuartiles.q1 + portfolio.pubQuartiles.q2} เรื่อง
            </div>
          </div>

          {/* IP */}
          <div
            onClick={() => setActiveTab('ip')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'ip' ? '#f5f3ff' : '#f8fafc',
              border: activeTab === 'ip' ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7c3aed', fontSize: '12px', fontWeight: 600 }}>
              <FaCertificate />
              <span>ทรัพย์สินทางปัญญา</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
              {portfolio.counts.ip} รายการ
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>
              สิทธิบัตร/อนุสิทธิบัตร/ลิขสิทธิ์
            </div>
          </div>

          {/* Academic Development */}
          <div
            onClick={() => setActiveTab('academic')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'academic' ? '#f0f9ff' : '#f8fafc',
              border: activeTab === 'academic' ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '12px', fontWeight: 600 }}>
              <FaGraduationCap />
              <span>พัฒนาวิชาการ</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
              {portfolio.counts.academic} โครงการ
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>
              งบรวม {academicBudgetM} ล้านบาท
            </div>
          </div>

          {/* Services */}
          <div
            onClick={() => setActiveTab('service')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: activeTab === 'service' ? '#fffbeb' : '#f8fafc',
              border: activeTab === 'service' ? '1.5px solid #d97706' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', fontSize: '12px', fontWeight: 600 }}>
              <FaHandsHelping />
              <span>บริการวิชาการ</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
              {portfolio.counts.service} กิจกรรม
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>
              รวม {portfolio.serviceHours} ชั่วโมง
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Portfolio Sections */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Tab Header Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '4px 16px',
            gap: '6px',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'all', label: `แสดงทั้งหมด (${portfolio.counts.total})` },
            { id: 'research', label: `โครงการวิจัย (${portfolio.counts.research})`, icon: <FaFlask /> },
            { id: 'publications', label: `ผลงานตีพิมพ์ (${portfolio.counts.publications})`, icon: <FaBook /> },
            { id: 'ip', label: `ทรัพย์สินทางปัญญา (${portfolio.counts.ip})`, icon: <FaCertificate /> },
            { id: 'academic', label: `พัฒนาวิชาการ (${portfolio.counts.academic})`, icon: <FaGraduationCap /> },
            { id: 'service', label: `บริการวิชาการ (${portfolio.counts.service})`, icon: <FaHandsHelping /> },
          ].map((tab) => {
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                style={{
                  padding: '10px 14px',
                  border: 'none',
                  borderBottom: isSel ? '2px solid #00A651' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: isSel ? '#00A651' : '#64748b',
                  fontSize: '13px',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.icon && <span style={{ fontSize: '12px' }}>{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* SECTION A: โครงการวิจัย */}
          {(activeTab === 'all' || activeTab === 'research') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#00A651',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaFlask />
                  <span>โครงการวิจัย ({portfolio.researchItems.length} รายการ)</span>
                </h3>
              </div>

              {portfolio.researchItems.length === 0 ? (
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
                  ไม่มีข้อมูลโครงการวิจัยในช่วงเวลานี้
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '9px 12px', width: '60px', textAlign: 'center' }}>ลำดับ</th>
                        <th style={{ padding: '9px 12px', width: '38%', minWidth: '380px' }}>ชื่อโครงการวิจัย</th>
                        <th style={{ padding: '9px 12px', width: '130px' }}>บทบาท</th>
                        <th style={{ padding: '9px 12px', width: '130px', textAlign: 'right' }}>งบประมาณ</th>
                        <th style={{ padding: '9px 12px', width: '150px' }}>แหล่งทุน</th>
                        <th style={{ padding: '9px 12px', width: '100px', textAlign: 'center' }}>สถานะ</th>
                        <th style={{ padding: '9px 12px', width: '90px', textAlign: 'center' }}>ดูเพิ่มเติม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.researchItems.map((r, idx) => {
                        const totalB = parseItemBudget(r);
                        return (
                          <tr
                            key={idx}
                            onClick={() => setSelectedDetail({ item: r, categoryKey: 'research' })}
                            style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.1s ease' }}
                            className="hover:bg-emerald-50/50"
                          >
                            <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{r.name}</td>
                            <td style={{ padding: '10px 12px', color: '#475569' }}>
                              {r.head && (r.head.includes(portfolio.cleanName) || r.head.includes(portfolio.name))
                                ? 'หัวหน้าโครงการ'
                                : 'ผู้ร่วมวิจัย'}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#047857' }}>
                              {totalB > 0 ? totalB.toLocaleString('th-TH') + ' บาท' : '-'}
                            </td>
                            <td style={{ padding: '10px 12px', color: '#64748b' }}>{r.fund_source || '-'}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  backgroundColor: r.status?.includes('เสร็จ') ? '#dcfce7' : '#fef3c7',
                                  color: r.status?.includes('เสร็จ') ? '#166534' : '#b45309',
                                }}
                              >
                                {r.status || 'ดำเนินการ'}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetail({ item: r, categoryKey: 'research' });
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  color: '#00A651',
                                  backgroundColor: '#ecfdf5',
                                  border: '1px solid #a7f3d0',
                                  cursor: 'pointer',
                                }}
                                title="คลิกเพื่อดูรายละเอียดเพิ่มเติม"
                              >
                                <FaExternalLinkAlt style={{ fontSize: '10px' }} />
                                <span>ดูเพิ่มเติม</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SECTION B: ผลงานตีพิมพ์ */}
          {(activeTab === 'all' || activeTab === 'publications') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#e11d48',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaBook />
                  <span>ผลงานตีพิมพ์ทางวิชาการ ({portfolio.pubItems.length} รายการ)</span>
                </h3>
              </div>

              {portfolio.pubItems.length === 0 ? (
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
                  ไม่มีข้อมูลผลงานตีพิมพ์ในช่วงเวลานี้
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '9px 12px', width: '60px', textAlign: 'center' }}>ลำดับ</th>
                        <th style={{ padding: '9px 12px', width: '38%', minWidth: '380px' }}>ชื่อบทความ / ผลงาน</th>
                        <th style={{ padding: '9px 12px', width: '130px', textAlign: 'center' }}>สถานะ</th>
                        <th style={{ padding: '9px 12px', width: '220px' }}>วารสาร</th>
                        <th style={{ padding: '9px 12px', width: '110px', textAlign: 'center' }}>ระดับ</th>
                        <th style={{ padding: '9px 12px', width: '90px', textAlign: 'center' }}>ปี / เดือน</th>
                        <th style={{ padding: '9px 12px', width: '110px', textAlign: 'right' }}>เงินสนับสนุน</th>
                        <th style={{ padding: '9px 12px', width: '90px', textAlign: 'center' }}>ดูเพิ่มเติม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.pubItems.map((p, idx) => {
                        const tier = autoDetectJournalRanking(p.journal || '', p.level || '');
                        return (
                          <tr
                            key={idx}
                            onClick={() => setSelectedDetail({ item: p, categoryKey: 'publications' })}
                            style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.1s ease' }}
                            className="hover:bg-rose-50/50"
                          >
                            <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>
                              <div>{p.name}</div>
                              {p.remarks && (
                                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', fontWeight: 400 }}>
                                  {p.remarks}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <PublicationTypeBadge value={p.type || p.status || 'ตีพิมพ์'} />
                            </td>
                            <td style={{ padding: '10px 12px', color: '#475569' }}>
                              {p.journal || '-'}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <JournalTierBadge value={tier} />
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>
                              {p.fiscal_year_be || p.month_year || p.month || '-'}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#e11d48' }}>
                              {p.budget ? Number(p.budget).toLocaleString('th-TH') + ' บาท' : '-'}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetail({ item: p, categoryKey: 'publications' });
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  color: '#e11d48',
                                  backgroundColor: '#fff1f2',
                                  border: '1px solid #fecdd3',
                                  cursor: 'pointer',
                                }}
                                title="คลิกเพื่อดูรายละเอียดเพิ่มเติม"
                              >
                                <FaExternalLinkAlt style={{ fontSize: '10px' }} />
                                <span>ดูเพิ่มเติม</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SECTION C: ทรัพย์สินทางปัญญา */}
          {(activeTab === 'all' || activeTab === 'ip') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaCertificate />
                  <span>งานทรัพย์สินทางปัญญา ({portfolio.ipItems.length} รายการ)</span>
                </h3>
              </div>

              {portfolio.ipItems.length === 0 ? (
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
                  ไม่มีข้อมูลทรัพย์สินทางปัญญาในช่วงเวลานี้
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '9px 12px', width: '60px', textAlign: 'center' }}>ลำดับ</th>
                        <th style={{ padding: '9px 12px', width: '38%', minWidth: '380px' }}>ชื่อการประดิษฐ์ / ผลงาน</th>
                        <th style={{ padding: '9px 12px', width: '130px' }}>ประเภท</th>
                        <th style={{ padding: '9px 12px', width: '140px' }}>เลขที่คำขอ/ทะเบียน</th>
                        <th style={{ padding: '9px 12px', width: '140px' }}>วันที่ยื่นคำขอ/จดทะเบียน</th>
                        <th style={{ padding: '9px 12px', width: '100px', textAlign: 'center' }}>สถานะ</th>
                        <th style={{ padding: '9px 12px', width: '90px', textAlign: 'center' }}>ดูเพิ่มเติม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.ipItems.map((i, idx) => (
                        <tr
                          key={idx}
                          onClick={() => setSelectedDetail({ item: i, categoryKey: 'ip' })}
                          style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.1s ease' }}
                          className="hover:bg-purple-50/50"
                        >
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>
                            {i.name || i.title}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <IPTypeBadge value={i.type} />
                          </td>
                          <td style={{ padding: '10px 12px', color: '#475569', fontFamily: 'monospace' }}>
                            {i.registration_number || i.application_number || i.req_no || '-'}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#64748b' }}>
                            {i.filing_date || i.protection_start || '-'}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            {(() => {
                              const st = String(i.status || '');
                              const isProt = st.includes('คุ้มครอง');
                              const isPend = !isProt && st.includes('ยื่น');
                              const bg = isProt ? '#ecfdf5' : isPend ? '#f0f9ff' : '#fffbeb';
                              const col = isProt ? '#059669' : isPend ? '#0284c7' : '#d97706';
                              const label = isProt ? 'ได้รับความคุ้มครองแล้ว' : isPend ? 'ยื่นคำขอแล้ว' : 'เตรียมความพร้อมยื่นจด';
                              return (
                                <span
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    backgroundColor: bg,
                                    color: col,
                                  }}
                                >
                                  {label}
                                </span>
                              );
                            })()}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDetail({ item: i, categoryKey: 'ip' });
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                color: '#7c3aed',
                                backgroundColor: '#f5f3ff',
                                border: '1px solid #ddd6fe',
                                cursor: 'pointer',
                              }}
                              title="คลิกเพื่อดูรายละเอียดเพิ่มเติม"
                            >
                              <FaExternalLinkAlt style={{ fontSize: '10px' }} />
                              <span>ดูเพิ่มเติม</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SECTION D: โครงการพัฒนาวิชาการ */}
          {(activeTab === 'all' || activeTab === 'academic') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaGraduationCap />
                  <span>โครงการพัฒนาวิชาการ ({portfolio.academicItems.length} รายการ)</span>
                </h3>
              </div>

              {portfolio.academicItems.length === 0 ? (
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
                  ไม่มีข้อมูลโครงการพัฒนาวิชาการในช่วงเวลานี้
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '9px 12px', width: '60px', textAlign: 'center' }}>ลำดับ</th>
                        <th style={{ padding: '9px 12px', width: '38%', minWidth: '380px' }}>ชื่อโครงการ</th>
                        <th style={{ padding: '9px 12px', width: '200px' }}>หน่วยงานผู้ว่าจ้าง</th>
                        <th style={{ padding: '9px 12px', width: '130px', textAlign: 'right' }}>งบประมาณ</th>
                        <th style={{ padding: '9px 12px', width: '110px', textAlign: 'center' }}>ระยะเวลา</th>
                        <th style={{ padding: '9px 12px', width: '90px', textAlign: 'center' }}>ดูเพิ่มเติม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.academicItems.map((a, idx) => {
                        const bVal = parseItemBudget(a);
                        return (
                          <tr
                            key={idx}
                            onClick={() => setSelectedDetail({ item: a, categoryKey: 'academic' })}
                            style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.1s ease' }}
                            className="hover:bg-sky-50/50"
                          >
                            <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{a.name}</td>
                            <td style={{ padding: '10px 12px', color: '#475569' }}>{a.client || '-'}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#0284c7' }}>
                              {bVal > 0 ? bVal.toLocaleString('th-TH') + ' บาท' : '-'}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>
                              {a.month || a.start_date || '-'}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetail({ item: a, categoryKey: 'academic' });
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  color: '#0284c7',
                                  backgroundColor: '#f0f9ff',
                                  border: '1px solid #bae6fd',
                                  cursor: 'pointer',
                                }}
                                title="คลิกเพื่อดูรายละเอียดเพิ่มเติม"
                              >
                                <FaExternalLinkAlt style={{ fontSize: '10px' }} />
                                <span>ดูเพิ่มเติม</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SECTION E: งานบริการวิชาการ */}
          {(activeTab === 'all' || activeTab === 'service') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaHandsHelping />
                  <span>งานบริการวิชาการ ({portfolio.serviceItems.length} รายการ)</span>
                </h3>
              </div>

              {portfolio.serviceItems.length === 0 ? (
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '13px' }}>
                  ไม่มีข้อมูลงานบริการวิชาการในช่วงเวลานี้
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '9px 12px', width: '60px', textAlign: 'center' }}>ลำดับ</th>
                        <th style={{ padding: '9px 12px', width: '38%', minWidth: '380px' }}>หัวข้องานบริการวิชาการ</th>
                        <th style={{ padding: '9px 12px', width: '140px' }}>ประเภทบริการ</th>
                        <th style={{ padding: '9px 12px', width: '180px' }}>หน่วยงาน / กลุ่มเป้าหมาย</th>
                        <th style={{ padding: '9px 12px', width: '100px', textAlign: 'center' }}>วันที่</th>
                        <th style={{ padding: '9px 12px', width: '90px', textAlign: 'center' }}>ชม. ที่ใช้</th>
                        <th style={{ padding: '9px 12px', width: '90px', textAlign: 'center' }}>ดูเพิ่มเติม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.serviceItems.map((s, idx) => (
                        <tr
                          key={idx}
                          onClick={() => setSelectedDetail({ item: s, categoryKey: 'service' })}
                          style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.1s ease' }}
                          className="hover:bg-amber-50/50"
                        >
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>
                            {s.name || s.topic_title}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <ServiceTypeBadge value={s.service_type || s.service_category} />
                          </td>
                          <td style={{ padding: '10px 12px', color: '#475569' }}>
                            {s.target_group || '-'}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>
                            {s.date || s.start_date || '-'}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#d97706' }}>
                            {s.hours_spent ? s.hours_spent + ' ชม.' : '-'}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDetail({ item: s, categoryKey: 'service' });
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                color: '#d97706',
                                backgroundColor: '#fffbeb',
                                border: '1px solid #fde68a',
                                cursor: 'pointer',
                              }}
                              title="คลิกเพื่อดูรายละเอียดเพิ่มเติม"
                            >
                              <FaExternalLinkAlt style={{ fontSize: '10px' }} />
                              <span>ดูเพิ่มเติม</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Drawer for Record Details */}
      <RecordDetailDrawer
        isOpen={Boolean(selectedDetail)}
        onClose={() => setSelectedDetail(null)}
        categoryKey={selectedDetail?.categoryKey}
        record={selectedDetail?.item}
        readOnly={true}
      />
    </div>
  );
}
