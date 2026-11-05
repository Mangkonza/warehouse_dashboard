'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  KPIItem,
  KPIReportingRoundConfig,
  KPIRoundResultEntry,
  KPISubIndicator,
  KPISubFormulaRole,
} from '@/types/kpi';
import {
  getKPIById,
  updateKPI,
  getStoredReportingRounds,
  formatRoundDateRange,
  evaluateKPI,
  includeProjectInKPI,
  excludeProjectFromKPI,
} from '@/lib/kpiEngine';
import { getCachedCategoryData } from '@/lib/dataService';
import { isTestRecord } from '@/lib/sdgEngine';
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';
import rawPersonnel from '@/data/personnel.json';
import {
  FaSave,
  FaCheckCircle,
  FaCalendarCheck,
  FaCalculator,
  FaFolderOpen,
  FaInfoCircle,
  FaUserCheck,
  FaLink,
  FaUnlink,
  FaSearch,
  FaMagic,
} from 'react-icons/fa';

export interface StrategicKpiRoundReportViewProps {
  kpiId: string;
  initialRoundId?: string;
  isModal?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const ROLE_BADGE: Record<
  KPISubFormulaRole,
  { label: string; bg: string; color: string; border: string }
> = {
  sum_part: { label: 'ส่วนของผลรวม (SUM)', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  numerator: { label: 'ตัวตั้ง (A)', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  denominator: { label: 'ตัวหาร (B)', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
};

const DATASET_LABELS: Record<string, string> = {
  research: 'โครงการวิจัย',
  academic: 'โครงการพัฒนาวิชาการ',
  publications: 'ผลงานตีพิมพ์ทางวิชาการ',
  service: 'งานบริการวิชาการ',
  ip: 'งานทรัพย์สินทางปัญญา',
  personnel: 'บุคลากรและอาจารย์',
};

export function StrategicKpiRoundReportView({
  kpiId,
  initialRoundId,
  onClose,
  onSaved,
  showToast,
}: StrategicKpiRoundReportViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/manage?tab=kpi';
  const initialRoundParam = initialRoundId || searchParams.get('roundId');

  const [kpi, setKpi] = useState<KPIItem | null>(null);
  const [rounds, setRounds] = useState<KPIReportingRoundConfig[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState<string>('round-9m');

  // Form states for current round
  const [mainActualVal, setMainActualVal] = useState<string>('');
  const [mainActualText, setMainActualText] = useState<string>('');
  const [roundEvidence, setRoundEvidence] = useState<string>('');
  const [roundRemarks, setRoundRemarks] = useState<string>('');
  const [subDrafts, setSubDrafts] = useState<
    Record<number, { val: string; evidence: string; remarks: string }>
  >({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Unified Project Mapping states (ยุบรวมจากหน้าต่างผูกโครงการเดิม)
  const [activeMappingSubTab, setActiveMappingSubTab] = useState<'matched' | 'all'>('matched');
  const [mappingSearch, setMappingSearch] = useState<string>('');
  const [selectedDatasetCat, setSelectedDatasetCat] = useState<string>('research');

  const datasets = useMemo<Record<string, any[]>>(
    () => ({
      research: getCachedCategoryData('research') || (rawResearch as any[]),
      academic: getCachedCategoryData('academic') || (rawAcademic as any[]),
      publications: getCachedCategoryData('publications') || (rawPublications as any[]),
      service: getCachedCategoryData('service') || (rawServices as any[]),
      ip: getCachedCategoryData('ip') || (rawIP as any[]),
      personnel: getCachedCategoryData('personnel') || (rawPersonnel as any[]),
    }),
    []
  );

  useEffect(() => {
    const allRounds = getStoredReportingRounds().filter((r) => r.isActive !== false);
    const loadedKpi = getKPIById(kpiId);
    if (!loadedKpi) return;

    setKpi(loadedKpi);
    setSelectedDatasetCat(
      (loadedKpi.datasetKeys && loadedKpi.datasetKeys[0]) || loadedKpi.datasetKey || 'research'
    );

    const allowedRoundIds =
      loadedKpi.activeRoundIds && loadedKpi.activeRoundIds.length > 0
        ? loadedKpi.activeRoundIds
        : loadedKpi.reportingRoundIds && loadedKpi.reportingRoundIds.length > 0
        ? loadedKpi.reportingRoundIds
        : allRounds.map((r) => r.id);
    const activeRoundsForKpi = allRounds.filter((r) => allowedRoundIds.includes(r.id));
    const effectiveRounds = activeRoundsForKpi.length > 0 ? activeRoundsForKpi : allRounds;
    setRounds(effectiveRounds);

    const defaultRoundId =
      initialRoundParam && effectiveRounds.some((r) => r.id === initialRoundParam)
        ? initialRoundParam
        : effectiveRounds[effectiveRounds.length - 1]?.id || 'round-9m';
    setSelectedRoundId(defaultRoundId);
  }, [kpiId, initialRoundParam]);

  // Populate inputs when selectedRoundId or kpi changes
  useEffect(() => {
    if (!kpi || !selectedRoundId) return;
    const roundEntry: KPIRoundResultEntry | undefined = (kpi.resultsByRound || []).find(
      (r) => r.roundId === selectedRoundId
    );
    setMainActualVal(
      roundEntry?.actualValue !== undefined && roundEntry?.actualValue !== null
        ? String(roundEntry.actualValue)
        : ''
    );
    setMainActualText(roundEntry?.actualText || '');
    setRoundEvidence(roundEntry?.evidence || kpi.evidence || '');
    setRoundRemarks(roundEntry?.remarks || kpi.remarks || '');

    const nextSubDrafts: Record<number, { val: string; evidence: string; remarks: string }> = {};
    (kpi.subIndicators || []).forEach((sub, idx) => {
      const subRoundVal = sub.resultsByRound?.[selectedRoundId];
      let fallbackVal = '';
      if (subRoundVal !== undefined && subRoundVal !== null) {
        fallbackVal = String(subRoundVal);
      } else if (selectedRoundId === 'round-6m' && sub.actual6M !== undefined) {
        fallbackVal = String(sub.actual6M);
      } else if (selectedRoundId === 'round-9m' && sub.actual9M !== undefined) {
        fallbackVal = String(sub.actual9M);
      }
      nextSubDrafts[idx] = {
        val: fallbackVal === '-' ? '' : fallbackVal,
        evidence: sub.evidence || '',
        remarks: sub.remarks || '',
      };
    });
    setSubDrafts(nextSubDrafts);
  }, [kpi, selectedRoundId]);

  const activeRound = useMemo(
    () => rounds.find((r) => r.id === selectedRoundId) || rounds[0],
    [rounds, selectedRoundId]
  );

  // Auto-calculate formula preview from sub-indicators
  const formulaComputedPreview = useMemo(() => {
    if (!kpi) return null;
    const subs = kpi.subIndicators || [];
    if (subs.length === 0) return null;

    const method = (kpi.formulaMethod || 'DIRECT').toUpperCase();
    if (method === 'DIRECT') return null;

    const parsedSubs = subs.map((s, idx) => {
      const raw = subDrafts[idx]?.val ?? '';
      const num = Number(raw);
      return {
        role: s.formulaRole || 'sum_part',
        num: raw.trim() !== '' && !isNaN(num) ? num : null,
      };
    });

    const validNums = parsedSubs.filter((p) => p.num !== null);
    if (validNums.length === 0) return null;

    if (method === 'SUM') {
      const sum = validNums.reduce((acc, cur) => acc + (cur.num || 0), 0);
      return { value: Number(sum.toFixed(2)), text: `${sum.toLocaleString('th-TH')} ${kpi.unit}` };
    }
    if (method === 'AVERAGE') {
      const avg = validNums.reduce((acc, cur) => acc + (cur.num || 0), 0) / validNums.length;
      return { value: Number(avg.toFixed(2)), text: `${avg.toFixed(2)} ${kpi.unit}` };
    }
    if (method === 'LATEST') {
      const last = validNums[validNums.length - 1]?.num || 0;
      return { value: last, text: `${last.toLocaleString('th-TH')} ${kpi.unit}` };
    }
    if (method === 'PERCENTAGE' || method === 'RATIO') {
      const numSum = parsedSubs
        .filter((p) => p.role === 'numerator' && p.num !== null)
        .reduce((acc, cur) => acc + (cur.num || 0), 0);
      const denSum = parsedSubs
        .filter((p) => p.role === 'denominator' && p.num !== null)
        .reduce((acc, cur) => acc + (cur.num || 0), 0);
      if (denSum > 0) {
        if (method === 'PERCENTAGE') {
          const pct = Number(((numSum / denSum) * 100).toFixed(2));
          return { value: pct, text: `${pct}% (${numSum} ÷ ${denSum} × 100)` };
        } else {
          const ratio = Number((numSum / denSum).toFixed(2));
          return { value: ratio, text: `${ratio} : 1 (${numSum} : ${denSum})` };
        }
      }
    }
    return null;
  }, [kpi, subDrafts]);

  const evaluation = useMemo(() => {
    if (!kpi) return null;
    return evaluateKPI(kpi, datasets, selectedRoundId);
  }, [kpi, datasets, selectedRoundId]);

  const allDatasetItems = useMemo(() => {
    if (!kpi) return [];
    const raw = datasets[selectedDatasetCat] || [];
    return raw.filter(
      (item: any) =>
        item &&
        (item.name || item.title) &&
        item.name !== 'nan' &&
        item.name !== 'เรื่อง' &&
        !isTestRecord(item)
    );
  }, [kpi, datasets, selectedDatasetCat]);

  const handleIncludeProject = (projId: string) => {
    if (!kpi) return;
    const updated = includeProjectInKPI(kpi.id, projId);
    if (updated) {
      setKpi(updated);
      if (showToast) showToast('ผูกโครงการเข้ากับตัวชี้วัดเรียบร้อยแล้ว', 'success');
      if (onSaved) onSaved();
    }
  };

  const handleExcludeProject = (projId: string) => {
    if (!kpi) return;
    const updated = excludeProjectFromKPI(kpi.id, projId);
    if (updated) {
      setKpi(updated);
      if (showToast) showToast('นำโครงการออกจากตัวชี้วัดเรียบร้อยแล้ว', 'warning');
      if (onSaved) onSaved();
    }
  };

  const handleAutoFillFromProjects = () => {
    const matched = evaluation?.matchedProjects || [];
    if (matched.length === 0) return;
    setMainActualVal(String(matched.length));
    const lines = matched.map(
      (p: any, idx: number) =>
        `${idx + 1}. ${p.name || p.title}${p.leader || p.author ? ` (${p.leader || p.author})` : ''}`
    );
    setRoundRemarks(lines.join('\n'));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push(returnTo);
    }
  };

  const handleSaveRoundReport = (status: 'draft' | 'submitted') => {
    if (!kpi || !selectedRoundId) return;

    const effectiveNum =
      mainActualVal.trim() !== '' && !isNaN(Number(mainActualVal))
        ? Number(mainActualVal)
        : formulaComputedPreview?.value ?? null;

    const existingEntries = (kpi.resultsByRound || []).filter((r) => r.roundId !== selectedRoundId);
    const updatedRoundResults: KPIRoundResultEntry[] = [
      ...existingEntries,
      {
        roundId: selectedRoundId,
        actualValue: effectiveNum,
        actualText: mainActualText.trim() || undefined,
        status,
        evidence: roundEvidence.trim() || undefined,
        remarks: roundRemarks.trim() || undefined,
        updatedAt: new Date().toISOString(),
      },
    ];

    const updatedSubs: KPISubIndicator[] = (kpi.subIndicators || []).map((sub, idx) => {
      const draft = subDrafts[idx] || { val: '', evidence: '', remarks: '' };
      const isNum = draft.val.trim() !== '' && !isNaN(Number(draft.val));
      const parsedVal = isNum ? Number(draft.val) : draft.val.trim() || '-';

      const nextSubRounds: Record<string, string | number> = {
        ...(sub.resultsByRound || {}),
        [selectedRoundId]: parsedVal,
      };

      return {
        ...sub,
        actual6M: selectedRoundId === 'round-6m' ? parsedVal : sub.actual6M,
        actual9M: selectedRoundId === 'round-9m' ? parsedVal : sub.actual9M,
        evidence: draft.evidence.trim() || sub.evidence,
        remarks: draft.remarks.trim() || sub.remarks,
        resultsByRound: nextSubRounds,
      };
    });

    const updatedKpi: KPIItem = {
      ...kpi,
      actual6M: selectedRoundId === 'round-6m' ? effectiveNum : kpi.actual6M,
      actual6MText:
        selectedRoundId === 'round-6m' ? mainActualText.trim() || undefined : kpi.actual6MText,
      actual9M: selectedRoundId === 'round-9m' ? effectiveNum : kpi.actual9M,
      actual9MText:
        selectedRoundId === 'round-9m' ? mainActualText.trim() || undefined : kpi.actual9MText,
      manualProgress: effectiveNum !== null ? effectiveNum : kpi.manualProgress,
      evidence: roundEvidence.trim() || kpi.evidence,
      remarks: roundRemarks.trim() || kpi.remarks,
      resultsByRound: updatedRoundResults,
      subIndicators: updatedSubs,
    };

    updateKPI(updatedKpi);
    setKpi(updatedKpi);

    const msg =
      status === 'submitted'
        ? `ยืนยันส่งผลรายงาน "${activeRound?.name || selectedRoundId}" เรียบร้อยแล้ว`
        : `บันทึกร่างผลรายงาน "${activeRound?.name || selectedRoundId}" เรียบร้อยแล้ว`;

    if (showToast) {
      showToast(msg, 'success');
    } else {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3500);
    }

    if (onSaved) {
      onSaved();
    }
    if (status === 'submitted' && onClose) {
      onClose();
    }
  };

  if (!kpi) return null;

  const availableCategories = Array.from(
    new Set([
      ...(kpi.datasetKeys || []),
      kpi.datasetKey || 'research',
      'research',
      'academic',
      'publications',
      'service',
      'ip',
      'personnel',
    ])
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '980px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.22)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header เขียวมาตรฐาน KU */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#00A651',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#86efac',
                fontSize: '18px',
              }}
            >
              <FaCalendarCheck />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#006838',
                    padding: '2px 8px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 800,
                    fontFamily: 'monospace',
                  }}
                >
                  {kpi.code}
                </span>
                <h3 style={{ margin: 0, fontSize: '17.5px', fontWeight: 700 }}>
                  รายงานผลตัวชี้วัดตามรอบ และผูกผลงาน/โครงการ
                </h3>
              </div>
              <p
                style={{
                  margin: '3px 0 0 0',
                  fontSize: '12.5px',
                  color: '#dcfce7',
                  lineHeight: 1.35,
                }}
              >
                {kpi.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '26px',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1,
              opacity: 0.85,
            }}
            title="ปิดหน้าต่าง"
          >
            &times;
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {toastMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #6ee7b7',
                color: '#065f46',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <FaCheckCircle style={{ color: '#00A651', fontSize: '15px' }} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* แถบสรุปข้อมูลตัวชี้วัดและผู้รายงาน (ชื่อจริง) */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '14px 18px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                ยุทธศาสตร์ / แผนงาน
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                ยุทธศาสตร์ {kpi.strategyCode || '-'}: {kpi.planCode || '-'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                เป้าหมายปี {kpi.fiscalYear || '2569'} ({kpi.collectionPeriod || 'ปีงบประมาณ'})
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#006838', marginTop: '2px' }}>
                {kpi.targetLabel || kpi.targetValue.toLocaleString('th-TH')} {kpi.unit}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                ผู้รายงานข้อมูลหลัก (ชื่อจริง)
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '3px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#1e293b',
                }}
              >
                <FaUserCheck style={{ color: '#00A651', flexShrink: 0 }} />
                <span>
                  {(kpi.reporters && kpi.reporters.length > 0
                    ? kpi.reporters.join(' / ')
                    : kpi.reporter) || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* ส่วนที่ 1: เลือกรอบการรายงานผลที่ต้องการบันทึกข้อมูล */}
          {/* =============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
              <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
                1. เลือกรอบการรายงานผลที่ต้องการบันทึกข้อมูล
              </h4>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px',
              }}
            >
              {rounds.map((r) => {
                const isSelected = r.id === selectedRoundId;
                const entry = (kpi.resultsByRound || []).find((x) => x.roundId === r.id);
                const valDisplay =
                  entry?.actualText ||
                  (entry?.actualValue !== undefined && entry?.actualValue !== null
                    ? `${entry.actualValue.toLocaleString('th-TH')} ${kpi.unit}`
                    : 'ยังไม่รายงาน');

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoundId(r.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #00A651' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#f0fbf5' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: isSelected ? '#006838' : '#0f172a',
                        }}
                      >
                        {r.name}
                      </span>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor:
                            entry?.status === 'submitted'
                              ? '#dcfce7'
                              : entry?.status === 'draft'
                              ? '#fef3c7'
                              : '#f1f5f9',
                          color:
                            entry?.status === 'submitted'
                              ? '#15803d'
                              : entry?.status === 'draft'
                              ? '#b45309'
                              : '#64748b',
                        }}
                      >
                        {entry?.status === 'submitted'
                          ? 'ส่งแล้ว'
                          : entry?.status === 'draft'
                          ? 'ร่าง'
                          : 'รอรายงาน'}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                      ช่วงข้อมูล: {r.periodLabel || formatRoundDateRange(r, true)}
                    </div>
                    <div
                      style={{
                        marginTop: '6px',
                        paddingTop: '6px',
                        borderTop: '1px dashed #cbd5e1',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: '#64748b' }}>ผลในรอบนี้:</span>
                      <strong style={{ color: '#0f172a', fontSize: '12.5px' }}>{valDisplay}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =============================================================== */}
          {/* ส่วนที่ 2: กรอกผลตัวชี้วัดย่อย (ถ้ามี) และผลรวมตัวชี้วัดหลัก */}
          {/* =============================================================== */}
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
                <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
                  2. บันทึกผลการดำเนินงานและหลักฐาน ({activeRound?.name || selectedRoundId})
                </h4>
              </div>

              {formulaComputedPreview && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #6ee7b7',
                    color: '#065f46',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  <FaCalculator />
                  <span>ผลคำนวณตามสูตร: {formulaComputedPreview.text}</span>
                  <button
                    type="button"
                    onClick={() => setMainActualVal(String(formulaComputedPreview.value))}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '5px',
                      border: '1px solid #059669',
                      backgroundColor: '#00A651',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    นำค่าไปใช้
                  </button>
                </div>
              )}
            </div>

            {/* ตารางตัวชี้วัดย่อย (ถ้ามี) */}
            {(kpi.subIndicators || []).length > 0 && (
              <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12.5px',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#eaf4ee', color: '#14532d' }}>
                      <th style={{ padding: '9px 12px', textAlign: 'left' }}>ตัวชี้วัดย่อย</th>
                      <th style={{ padding: '9px 8px', textAlign: 'center', width: '130px' }}>
                        บทบาทในสูตร
                      </th>
                      <th style={{ padding: '9px 8px', textAlign: 'center', width: '80px' }}>
                        เป้าหมาย
                      </th>
                      <th style={{ padding: '9px 10px', textAlign: 'right', width: '150px' }}>
                        ผลใน {activeRound?.name || 'รอบนี้'}
                      </th>
                      <th style={{ padding: '9px 10px', textAlign: 'left', width: '220px' }}>
                        หลักฐาน / หมายเหตุย่อย
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(kpi.subIndicators || []).map((sub, idx) => {
                      const roleInfo = ROLE_BADGE[sub.formulaRole || 'sum_part'];
                      const draft = subDrafts[idx] || { val: '', evidence: '', remarks: '' };
                      return (
                        <tr key={sub.id || idx} style={{ borderTop: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '9px 12px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{sub.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              หน่วย: {sub.unit || kpi.unit} • ผู้รายงาน:{' '}
                              {(sub.reporters && sub.reporters.join(' / ')) ||
                                sub.reporter ||
                                kpi.reporter ||
                                '-'}
                            </div>
                          </td>
                          <td style={{ padding: '9px 8px', textAlign: 'center', verticalAlign: 'top' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                backgroundColor: roleInfo.bg,
                                border: `1px solid ${roleInfo.border}`,
                                color: roleInfo.color,
                                fontSize: '10.5px',
                                fontWeight: 700,
                              }}
                            >
                              {roleInfo.label}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '9px 8px',
                              textAlign: 'center',
                              verticalAlign: 'top',
                              fontWeight: 600,
                              color: '#475569',
                            }}
                          >
                            {sub.target ?? '-'}
                          </td>
                          <td style={{ padding: '9px 10px', verticalAlign: 'top' }}>
                            <input
                              type="text"
                              placeholder={`ระบุผล (${sub.unit || kpi.unit})`}
                              value={draft.val}
                              onChange={(e) =>
                                setSubDrafts((prev) => ({
                                  ...prev,
                                  [idx]: { ...draft, val: e.target.value },
                                }))
                              }
                              style={{
                                width: '100%',
                                height: '34px',
                                padding: '0 10px',
                                borderRadius: '7px',
                                border: '1.5px solid #86efac',
                                backgroundColor: '#f0fdf4',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                textAlign: 'right',
                                color: '#065f46',
                              }}
                            />
                          </td>
                          <td style={{ padding: '9px 10px', verticalAlign: 'top' }}>
                            <input
                              type="text"
                              placeholder="ระบุหลักฐานหรือรายชื่อโครงการ..."
                              value={draft.remarks}
                              onChange={(e) =>
                                setSubDrafts((prev) => ({
                                  ...prev,
                                  [idx]: { ...draft, remarks: e.target.value },
                                }))
                              }
                              style={{
                                width: '100%',
                                height: '34px',
                                padding: '0 10px',
                                borderRadius: '7px',
                                border: '1px solid #cbd5e1',
                                fontSize: '12px',
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ฟอร์มผลรวมตัวชี้วัดหลัก */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#006838] mb-1.5">
                  ผลการดำเนินงานรวมในรอบนี้ ({kpi.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="เช่น 12"
                  value={mainActualVal}
                  onChange={(e) => setMainActualVal(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border-2 border-[#00A651] bg-[#f0fbf5] text-sm font-extrabold text-[#065f46] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ข้อความแสดงผลพิเศษ (ถ้ามี เช่น 0.6 : 1)
                </label>
                <input
                  type="text"
                  placeholder="เช่น 0.56 : 1 หรือ 934,540 บาท"
                  value={mainActualText}
                  onChange={(e) => setMainActualText(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#00A651]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  หลักฐานอ้างอิง / แหล่งข้อมูลในรอบนี้
                </label>
                <input
                  type="text"
                  placeholder="เช่น 1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก."
                  value={roundEvidence}
                  onChange={(e) => setRoundEvidence(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#00A651]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                หมายเหตุ / รายชื่อโครงการวิจัย ผลงานตีพิมพ์ หรือบุคลากรที่ดำเนินงานในรอบนี้
              </label>
              <textarea
                rows={3}
                placeholder="บันทึกรายละเอียดผลการดำเนินงาน รายชื่อโครงการ หรือหมายเหตุประกอบการรายงานผล..."
                value={roundRemarks}
                onChange={(e) => setRoundRemarks(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#00A651]"
              />
            </div>
          </section>

          {/* =============================================================== */}
          {/* ส่วนที่ 3: จัดการโครงการและผลงานที่ผูกกับตัวชี้วัด (ยุบรวมเข้าด้วยกัน) */}
          {/* =============================================================== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
                <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
                  3. จัดการโครงการและผลงานที่ผูกกับตัวชี้วัด ({(evaluation?.matchedProjects || []).length}{' '}
                  รายการที่เชื่อมโยง)
                </h4>
              </div>

              {(evaluation?.matchedProjects || []).length > 0 && (
                <button
                  type="button"
                  onClick={handleAutoFillFromProjects}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00A651] bg-[#f0fbf5] hover:bg-[#dcfce7] text-[#006838] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FaMagic className="text-[11px]" />
                  <span>ดึงจำนวนและรายชื่อโครงการใส่ผลรายงานอัตโนมัติ</span>
                </button>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden">
              {/* Sub-navigation & Category Selector */}
              <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 bg-slate-100/80 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMappingSubTab('matched')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeMappingSubTab === 'matched'
                        ? 'bg-[#00A651] text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    โครงการที่เชื่อมโยงอยู่ ({(evaluation?.matchedProjects || []).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMappingSubTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeMappingSubTab === 'all'
                        ? 'bg-[#00A651] text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    + ค้นหาและผูกโครงการเพิ่มด้วยมือ
                  </button>
                </div>

                {activeMappingSubTab === 'all' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-medium">หมวดข้อมูล:</span>
                    <select
                      value={selectedDatasetCat}
                      onChange={(e) => setSelectedDatasetCat(e.target.value)}
                      className="h-8 px-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#00A651]"
                    >
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {DATASET_LABELS[cat] || cat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="p-3 border-b border-slate-200 bg-white">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อโครงการ, ผลงานตีพิมพ์, ผู้รับผิดชอบ หรือหน่วยงาน..."
                    value={mappingSearch}
                    onChange={(e) => setMappingSearch(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#00A651]"
                  />
                </div>
              </div>

              {/* List */}
              <div className="max-h-60 overflow-y-auto p-3 space-y-2 bg-white">
                {activeMappingSubTab === 'matched' ? (
                  <>
                    {(evaluation?.matchedProjects || [])
                      .filter((p: any) => {
                        if (!mappingSearch.trim()) return true;
                        const q = mappingSearch.toLowerCase();
                        const name = (p.name || p.title || '').toLowerCase();
                        const leader = (p.leader || p.author || p.creator || '').toLowerCase();
                        return name.includes(q) || leader.includes(q);
                      })
                      .map((proj: any, idx: number) => {
                        const projId = String(proj.id || proj.code || `idx-${idx}`);
                        const isManuallyAdded = (kpi.manualIncludedProjectIds || []).includes(
                          projId
                        );

                        return (
                          <div
                            key={projId}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10.5px] px-2 py-0.5 rounded font-semibold ${
                                    isManuallyAdded
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-sky-100 text-sky-800'
                                  }`}
                                >
                                  {isManuallyAdded ? 'ผูกด้วยมือ' : 'เชื่อมโยงอัตโนมัติ'}
                                </span>
                                {proj.budget && (
                                  <span className="text-[11px] text-slate-500">
                                    งบประมาณ: {Number(proj.budget).toLocaleString('th-TH')} บาท
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-semibold text-slate-800 mt-1 truncate">
                                {proj.name || proj.title}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {proj.leader ||
                                  proj.author ||
                                  proj.creator ||
                                  proj.department ||
                                  'ไม่ระบุผู้รับผิดชอบ'}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleExcludeProject(projId)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold shrink-0 cursor-pointer"
                            >
                              <FaUnlink size={10} />
                              <span>นำออก</span>
                            </button>
                          </div>
                        );
                      })}
                    {(evaluation?.matchedProjects || []).length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400">
                        <FaFolderOpen className="mx-auto mb-1.5 text-lg text-slate-300" />
                        <div>ยังไม่มีโครงการหรือผลงานที่ผูกกับตัวชี้วัดนี้</div>
                        <button
                          type="button"
                          onClick={() => setActiveMappingSubTab('all')}
                          className="mt-2 text-[#00A651] font-semibold hover:underline cursor-pointer"
                        >
                          + คลิกเพื่อค้นหาและผูกโครงการจากคลังข้อมูล
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {allDatasetItems
                      .filter((p: any) => {
                        if (!mappingSearch.trim()) return true;
                        const q = mappingSearch.toLowerCase();
                        const name = (p.name || p.title || '').toLowerCase();
                        const leader = (p.leader || p.author || p.creator || '').toLowerCase();
                        return name.includes(q) || leader.includes(q);
                      })
                      .slice(0, 35)
                      .map((proj: any, idx: number) => {
                        const projId = String(proj.id || proj.code || `idx-${idx}`);
                        const isAlreadyMatched = (evaluation?.matchedProjects || []).some(
                          (m: any) => String(m.id || m.code || '') === projId
                        );

                        return (
                          <div
                            key={projId}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200 hover:border-slate-300"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold text-slate-800 truncate">
                                {proj.name || proj.title}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {proj.leader || proj.author || proj.creator || proj.department}
                              </div>
                            </div>

                            {isAlreadyMatched ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 shrink-0">
                                <FaCheckCircle size={11} /> ผูกอยู่แล้ว
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleIncludeProject(projId)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#00A651] bg-[#f0fdf4] text-[#006838] hover:bg-[#dcfce7] text-xs font-semibold shrink-0 cursor-pointer"
                              >
                                <FaLink size={10} />
                                <span>ผูกโครงการ</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <FaInfoCircle className="text-[#00A651] shrink-0" />
            <span>
              บันทึกผลแยกตามรอบ ({activeRound?.name || selectedRoundId}) โดยไม่ทับรอบอื่น
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ยกเลิก
            </button>

            <button
              type="button"
              onClick={() => handleSaveRoundReport('draft')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1px solid #00A651',
                backgroundColor: '#ffffff',
                color: '#00A651',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <FaSave />
              <span>บันทึกร่าง</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveRoundReport('submitted')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#00A651',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
              }}
            >
              <FaCheckCircle />
              <span>ยืนยันส่งผลรายงานรอบนี้</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const StrategicKpiRoundReportModal: React.FC<{
  isOpen: boolean;
  kpiId?: string;
  initialRoundId?: string;
  onClose: () => void;
  onSaved?: () => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}> = ({ isOpen, kpiId, ...props }) => {
  if (!isOpen || !kpiId) return null;
  return <StrategicKpiRoundReportView kpiId={kpiId} {...props} isModal={true} />;
};
