'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  FaBullseye,
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaInfoCircle,
  FaUserCheck,
  FaListUl,
  FaLayerGroup,
  FaEdit,
  FaCalendarCheck,
} from 'react-icons/fa';
import {
  KPIComputedResult,
  KPIReportingRound,
  KPIReportingRoundConfig,
  StrategicStrategyEntity,
} from '@/types/kpi';
import { getStoredStrategies, getStrategyColor } from '@/lib/kpiEngine';
import { CATEGORY_NAMES } from '../_hooks/useKpiData';
import { StrategicKpiModal } from './StrategicKpiFormView';
import { StrategicKpiRoundReportModal } from './StrategicKpiRoundReportView';
import { KpiHoverTooltip } from './KpiHoverTooltip';

interface KpiStrategicTableViewProps {
  filteredKPIs: KPIComputedResult[];
  selectedRound: KPIReportingRound;
  reportingRounds?: KPIReportingRoundConfig[];
}

const PERIOD_BADGE_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  ปีงบประมาณ: { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857' },
  ปีการศึกษา: { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
  ปีปฏิทิน: { bg: '#fefce8', border: '#fde68a', color: '#b45309' },
  ภาคการศึกษา: { bg: '#f5f3ff', border: '#ddd6fe', color: '#6d28d9' },
  ไตรมาส: { bg: '#fff7ed', border: '#fed7aa', color: '#c2410c' },
};

const formatCellVal = (val: any, unit?: string): string => {
  if (val === undefined || val === null || val === '') return '-';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '-') return '-';
    const asNum = Number(trimmed);
    if (!isNaN(asNum) && trimmed !== '') {
      return asNum.toLocaleString('th-TH', { maximumFractionDigits: 2 });
    }
    return trimmed;
  }
  if (typeof val === 'number') {
    if (isNaN(val)) return '-';
    return val.toLocaleString('th-TH', { maximumFractionDigits: 2 });
  }
  return String(val);
};

export function KpiStrategicTableView({
  filteredKPIs,
  selectedRound,
  reportingRounds = [],
}: KpiStrategicTableViewProps) {
  const [expandedDetailIds, setExpandedDetailIds] = useState<Record<string, boolean>>({});
  const [collapsedStrategies, setCollapsedStrategies] = useState<Record<string, boolean>>({});
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [roundReportKpiId, setRoundReportKpiId] = useState<string | null>(null);
  const [strategies, setStrategies] = useState<StrategicStrategyEntity[]>(() => getStoredStrategies());

  useEffect(() => {
    const syncStrategies = () => setStrategies(getStoredStrategies());
    syncStrategies();
    window.addEventListener('kpi_hierarchy_updated', syncStrategies);
    window.addEventListener('kpi_updated', syncStrategies);
    return () => {
      window.removeEventListener('kpi_hierarchy_updated', syncStrategies);
      window.removeEventListener('kpi_updated', syncStrategies);
    };
  }, []);

  const activeRounds = useMemo(() => {
    if (reportingRounds.length > 0) return reportingRounds;
    return [
      {
        id: 'round-6m',
        name: 'รอบ 6 เดือน',
        periodLabel: 'ต.ค. 68 - มี.ค. 69',
        startDate: '2025-10-01',
        endDate: '2026-03-31',
        isCumulative: true,
        sortOrder: 1,
      },
      {
        id: 'round-9m',
        name: 'รอบ 9 เดือน',
        periodLabel: 'ต.ค. 68 - ก.ค. 69',
        startDate: '2025-10-01',
        endDate: '2026-07-31',
        isCumulative: true,
        sortOrder: 2,
      },
    ];
  }, [reportingRounds]);

  const toggleDetail = (id: string) => {
    setExpandedDetailIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStrategyGroup = (code: string) => {
    setCollapsedStrategies((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // จัดกลุ่มตัวชี้วัดตามรหัสยุทธศาสตร์ (รองรับทั้งยุทธศาสตร์มาตรฐานและยุทธศาสตร์ที่ผู้ใช้สร้างใหม่)
  const groupedByStrategy = useMemo(() => {
    const map = new Map<
      string,
      {
        code: string;
        title: string;
        pillarGroup: string;
        color: { bg: string; border: string; text: string };
        items: KPIComputedResult[];
      }
    >();

    strategies.forEach((s) => {
      map.set(s.code, {
        code: s.code,
        title: `ยุทธศาสตร์ที่ ${s.code} : ${s.name}`,
        pillarGroup: s.pillarGroup || `ยุทธศาสตร์ที่ ${s.code}`,
        color: s.color || getStrategyColor(s.code),
        items: [],
      });
    });

    const otherGroup = {
      code: 'other',
      title: 'ตัวชี้วัดตามแผนปฏิบัติการและยุทธศาสตร์อื่นๆ',
      pillarGroup: 'แผนปฏิบัติการส่วนงาน',
      color: { bg: '#f8fafc', border: '#cbd5e1', text: '#334155' },
      items: [] as KPIComputedResult[],
    };

    filteredKPIs.forEach((item) => {
      const sCode = item.kpi.strategyCode;
      if (sCode) {
        if (!map.has(sCode)) {
          map.set(sCode, {
            code: sCode,
            title: item.kpi.strategyName || `ยุทธศาสตร์ที่ ${sCode}`,
            pillarGroup: `ยุทธศาสตร์ที่ ${sCode}`,
            color: getStrategyColor(sCode),
            items: [],
          });
        }
        map.get(sCode)!.items.push(item);
      } else {
        otherGroup.items.push(item);
      }
    });

    const result = Array.from(map.values()).filter((g) => g.items.length > 0);
    if (otherGroup.items.length > 0) {
      result.push(otherGroup);
    }
    return result;
  }, [filteredKPIs, strategies]);

  if (filteredKPIs.length === 0) {
    return (
      <div
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px dashed #cbd5e1',
          color: '#94a3b8',
        }}
      >
        <FaBullseye style={{ fontSize: '32px', marginBottom: '8px' }} />
        <div style={{ fontSize: '15px', fontWeight: 600 }}>ไม่พบตัวชี้วัดที่ตรงกับเงื่อนไขการค้นหา</div>
        <div style={{ fontSize: '13px', marginTop: '4px' }}>
          ลองเปลี่ยนตัวกรองยุทธศาสตร์ หรือค้นหาด้วยคำอื่น
        </div>
      </div>
    );
  }

  const totalColSpan = 7 + activeRounds.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {groupedByStrategy.map((group) => {
        const isCollapsed = Boolean(collapsedStrategies[group.code]);
        const achievedCount = group.items.filter((i) => i.status === 'achieved').length;
        const avgPct =
          group.items.length > 0
            ? Math.round(
                group.items.reduce((acc, cur) => acc + Math.min(cur.percentage, 100), 0) /
                  group.items.length
              )
            : 0;

        return (
          <div
            key={group.code}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            {/* แถบหัวยุทธศาสตร์ */}
            <div
              onClick={() => toggleStrategyGroup(group.code)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                backgroundColor: group.color.bg,
                borderBottom: isCollapsed ? 'none' : `1px solid ${group.color.border}`,
                cursor: 'pointer',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: group.color.text,
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <FaLayerGroup style={{ fontSize: '11px' }} />
                  <span>{group.code === 'other' ? 'แผนปฏิบัติการ' : `ยุทธศาสตร์ที่ ${group.code}`}</span>
                </span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
                  {group.title}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: group.color.text,
                    backgroundColor: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: `1px solid ${group.color.border}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.items.length} ตัวชี้วัด • บรรลุเป้า {achievedCount}/{group.items.length} ({avgPct}%)
                </span>
                <span style={{ color: '#475569', fontSize: '13px' }}>
                  {isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </span>
              </div>
            </div>

            {/* ตารางตัวชี้วัดตามแบบรายงาน มก.กพส. (คอลัมน์รอบการรายงานผลแบบ Dynamic) */}
            {!isCollapsed && (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    minWidth: '1240px',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: '13px',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#00A651', color: '#ffffff' }}>
                      <th
                        style={{
                          width: '15%',
                          padding: '11px 12px',
                          backgroundColor: '#00A651',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '12.5px',
                          borderBottom: '2px solid #00A651',
                          borderRight: '1px solid rgba(255,255,255,0.18)',
                        }}
                      >
                        แผนงาน / โครงการ
                      </th>
                      <th
                        style={{
                          width: '26%',
                          padding: '11px 12px',
                          backgroundColor: '#00A651',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '12.5px',
                          borderBottom: '2px solid #00A651',
                          borderRight: '1px solid rgba(255,255,255,0.18)',
                        }}
                      >
                        ตัวชี้วัดหลัก และตัวชี้วัดย่อย
                      </th>
                      <th
                        style={{
                          width: '8%',
                          padding: '11px 8px',
                          backgroundColor: '#00A651',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '12.5px',
                          textAlign: 'center',
                          borderBottom: '2px solid #00A651',
                          borderRight: '1px solid rgba(255,255,255,0.18)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        รอบการเก็บข้อมูล
                      </th>
                      <th
                        style={{
                          width: '7%',
                          padding: '11px 8px',
                          backgroundColor: '#00A651',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '12.5px',
                          textAlign: 'center',
                          borderBottom: '2px solid #00A651',
                          borderRight: '1px solid rgba(255,255,255,0.18)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        หน่วยนับ
                      </th>
                      <th
                        style={{
                          width: '8%',
                          padding: '11px 10px',
                          backgroundColor: '#00A651',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '12.5px',
                          textAlign: 'right',
                          borderBottom: '2px solid #00A651',
                          borderRight: '1px solid rgba(255,255,255,0.18)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        เป้าหมาย 2569
                      </th>
                      {activeRounds.map((round) => {
                        const isSelectedCol =
                          selectedRound === round.id ||
                          (selectedRound === '6M' && round.id === 'round-6m') ||
                          (selectedRound === '9M' && round.id === 'round-9m');
                        return (
                          <th
                            key={round.id}
                            style={{
                              width: '8%',
                              padding: '11px 10px',
                              fontWeight: 600,
                              fontSize: '12.5px',
                              textAlign: 'right',
                              backgroundColor: isSelectedCol ? '#007a3e' : '#00A651',
                              color: '#ffffff',
                              borderBottom: '2px solid #00A651',
                              borderRight: '1px solid rgba(255,255,255,0.18)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {round.name}
                            {round.periodLabel && (
                              <div style={{ fontSize: '10.5px', fontWeight: 400, opacity: 0.9 }}>
                                ({round.periodLabel})
                              </div>
                            )}
                          </th>
                        );
                      })}
                      <th
                        style={{
                          width: '9%',
                          padding: '11px 10px',
                          backgroundColor: '#00A651',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '12.5px',
                          textAlign: 'center',
                          borderBottom: '2px solid #00A651',
                          borderRight: '1px solid rgba(255,255,255,0.18)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ความก้าวหน้า
                      </th>
                      <th
                        style={{
                          width: '9%',
                          padding: '11px 10px',
                          backgroundColor: '#00A651',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '12.5px',
                          textAlign: 'center',
                          borderBottom: '2px solid #00A651',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ผู้รายงาน / การจัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item, idx) => {
                      const {
                        kpi,
                        value6M,
                        value9M,
                        valuesByRound,
                        textsByRound,
                        currentValue,
                        percentage,
                        statusColor,
                        statusLabel,
                      } = item;
                      const isExpanded = Boolean(expandedDetailIds[kpi.id]);
                      const periodStyle = PERIOD_BADGE_STYLES[kpi.collectionPeriod || ''] || {
                        bg: '#f1f5f9',
                        border: '#cbd5e1',
                        color: '#475569',
                      };
                      const subItems = kpi.subIndicators || [];
                      const hasExtraDetails = Boolean(kpi.description || kpi.evidence || kpi.remarks);

                      return (
                        <React.Fragment key={kpi.id}>
                          {/* แถวตัวชี้วัดหลัก */}
                          <tr
                            style={{
                              borderBottom:
                                subItems.length > 0 || isExpanded
                                  ? '1px dashed #e2e8f0'
                                  : '1px solid #e2e8f0',
                              backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                            }}
                          >
                            {/* แผนงาน / โครงการ */}
                            <td
                              style={{
                                padding: '12px',
                                verticalAlign: 'top',
                                borderRight: '1px solid #f1f5f9',
                                maxWidth: '220px',
                              }}
                            >
                              {kpi.planCode && (
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                    color: '#15803d',
                                    fontSize: '11.5px',
                                    fontWeight: 700,
                                    marginBottom: '4px',
                                  }}
                                >
                                  {kpi.planCode}
                                </span>
                              )}
                              <KpiHoverTooltip
                                badge={kpi.planCode || group.title}
                                fullText={
                                  kpi.planName
                                    ? kpi.planName.replace(/^แผนงาน(ที่)?\s*[0-9.-]+\s*:\s*/, '')
                                    : CATEGORY_NAMES[kpi.category] || kpi.category
                                }
                                style={{
                                  fontSize: '12px',
                                  color: '#475569',
                                  lineHeight: 1.35,
                                }}
                              >
                                {kpi.planName
                                  ? kpi.planName.replace(/^แผนงาน(ที่)?\s*[0-9.-]+\s*:\s*/, '')
                                  : CATEGORY_NAMES[kpi.category] || kpi.category}
                              </KpiHoverTooltip>
                            </td>

                            {/* รหัสและชื่อตัวชี้วัด */}
                            <td
                              style={{
                                padding: '12px',
                                verticalAlign: 'top',
                                borderRight: '1px solid #f1f5f9',
                                maxWidth: '380px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
                                <span
                                  style={{
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    backgroundColor: '#e8f5e9',
                                    color: '#00A651',
                                    fontWeight: 700,
                                    fontSize: '11.5px',
                                    fontFamily: 'monospace',
                                    whiteSpace: 'nowrap',
                                    marginTop: '1px',
                                    flexShrink: 0,
                                  }}
                                >
                                  {kpi.code}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <KpiHoverTooltip
                                    badge={kpi.code}
                                    fullText={kpi.title}
                                    subText={
                                      hasExtraDetails
                                        ? 'คลิกที่ชื่อเพื่อดูคำอธิบายตัวชี้วัด • หลักฐาน • หมายเหตุ'
                                        : undefined
                                    }
                                    onClick={hasExtraDetails ? () => toggleDetail(kpi.id) : undefined}
                                    style={{
                                      fontWeight: 600,
                                      color: '#0f172a',
                                      fontSize: '13.5px',
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {kpi.title}
                                  </KpiHoverTooltip>

                                  {hasExtraDetails && (
                                    <button
                                      type="button"
                                      onClick={() => toggleDetail(kpi.id)}
                                      style={{
                                        marginTop: '5px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        color: '#0284c7',
                                        fontSize: '11.5px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <FaInfoCircle style={{ fontSize: '11px' }} />
                                      <span>
                                        {isExpanded
                                          ? 'ซ่อนคำอธิบาย/หลักฐาน/หมายเหตุ'
                                          : 'ดูคำอธิบายตัวชี้วัด • หลักฐาน • หมายเหตุ'}
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* รอบการเก็บข้อมูล */}
                            <td
                              style={{
                                padding: '12px 8px',
                                textAlign: 'center',
                                verticalAlign: 'top',
                                borderRight: '1px solid #f1f5f9',
                              }}
                            >
                              {kpi.collectionPeriod ? (
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: periodStyle.bg,
                                    border: `1px solid ${periodStyle.border}`,
                                    color: periodStyle.color,
                                    fontSize: '11.5px',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {kpi.collectionPeriod}
                                </span>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>ปีงบประมาณ</span>
                              )}
                            </td>

                            {/* หน่วยนับ */}
                            <td
                              style={{
                                padding: '12px 8px',
                                textAlign: 'center',
                                verticalAlign: 'top',
                                color: '#475569',
                                fontWeight: 500,
                                borderRight: '1px solid #f1f5f9',
                              }}
                            >
                              {kpi.unit}
                            </td>

                            {/* เป้าหมาย 2569 */}
                            <td
                              style={{
                                padding: '12px 10px',
                                textAlign: 'right',
                                verticalAlign: 'top',
                                fontWeight: 700,
                                color: '#1e293b',
                                borderRight: '1px solid #f1f5f9',
                              }}
                            >
                              <div>{kpi.targetLabel || kpi.targetValue.toLocaleString('th-TH')}</div>
                              {kpi.departmentTarget !== undefined && (
                                <div
                                  style={{
                                    fontSize: '11px',
                                    color: '#c2410c',
                                    backgroundColor: '#fff7ed',
                                    border: '1px solid #fed7aa',
                                    borderRadius: '4px',
                                    padding: '1px 5px',
                                    marginTop: '3px',
                                    display: 'inline-block',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  เป้าส่วนงาน: {kpi.departmentTarget}
                                </div>
                              )}
                            </td>

                            {/* คอลัมน์ผลตามรอบการรายงานผล (Dynamic) */}
                            {activeRounds.map((round) => {
                              const isSelectedCol =
                                selectedRound === round.id ||
                                (selectedRound === '6M' && round.id === 'round-6m') ||
                                (selectedRound === '9M' && round.id === 'round-9m');
                              const roundVal =
                                valuesByRound?.[round.id] ??
                                (round.id === 'round-6m'
                                  ? value6M
                                  : round.id === 'round-9m'
                                  ? value9M ?? currentValue
                                  : null);
                              const roundTxt =
                                textsByRound?.[round.id] ||
                                (round.id === 'round-6m'
                                  ? kpi.actual6MText
                                  : round.id === 'round-9m'
                                  ? kpi.actual9MText
                                  : undefined);

                              return (
                                <td
                                  key={round.id}
                                  style={{
                                    padding: '12px 10px',
                                    textAlign: 'right',
                                    verticalAlign: 'top',
                                    fontWeight: isSelectedCol ? 700 : 500,
                                    color: isSelectedCol ? statusColor : '#475569',
                                    backgroundColor: isSelectedCol
                                      ? 'rgba(0, 166, 81, 0.04)'
                                      : 'transparent',
                                    borderRight: '1px solid #f1f5f9',
                                  }}
                                >
                                  {roundTxt || formatCellVal(roundVal, kpi.unit)}
                                </td>
                              );
                            })}

                            {/* ความก้าวหน้า */}
                            <td
                              style={{
                                padding: '12px 10px',
                                verticalAlign: 'top',
                                borderRight: '1px solid #f1f5f9',
                              }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '11.5px',
                                  }}
                                >
                                  <span style={{ fontWeight: 700, color: statusColor }}>
                                    {percentage}%
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '10.5px',
                                      padding: '1px 6px',
                                      borderRadius: '999px',
                                      backgroundColor: `${statusColor}15`,
                                      color: statusColor,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {statusLabel}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    width: '100%',
                                    height: '6px',
                                    backgroundColor: '#e2e8f0',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${Math.min(percentage, 100)}%`,
                                      height: '100%',
                                      backgroundColor: statusColor,
                                      borderRadius: '4px',
                                    }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* ผู้รายงาน / การจัดการ */}
                            <td
                              style={{
                                padding: '10px 8px',
                                textAlign: 'center',
                                verticalAlign: 'top',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                {kpi.reporter ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '2px 8px',
                                      borderRadius: '999px',
                                      backgroundColor: '#f8fafc',
                                      border: '1px solid #cbd5e1',
                                      color: '#334155',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    <FaUserCheck style={{ color: '#00A651', fontSize: '10px' }} />
                                    <span>{kpi.reporter}</span>
                                  </span>
                                ) : null}

                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => setRoundReportKpiId(kpi.id)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '3px 7px',
                                      borderRadius: '5px',
                                      border: '1px solid #86efac',
                                      backgroundColor: '#f0fdf4',
                                      color: '#006838',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                    title="กรอกผลตามรอบการรายงานผล และจัดการโครงการที่ผูกกับตัวชี้วัด"
                                  >
                                    <FaCalendarCheck size={10} />
                                    <span>รายงานผล</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setEditingKpiId(kpi.id)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      padding: '3px 6px',
                                      borderRadius: '5px',
                                      border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff',
                                      color: '#475569',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                    }}
                                    title="แก้ไขโครงสร้างตัวชี้วัด"
                                  >
                                    <FaEdit size={10} />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>

                          {/* แถวย่อย: ตัวชี้วัดย่อย ("- ...") หรือ โครงการส่วนงาน */}
                          {subItems.map((sub, sIdx) => {
                            const isDeptProj = sub.title.includes('[โครงการส่วนงาน]');
                            const isLastSub = sIdx === subItems.length - 1 && !isExpanded;
                            return (
                              <tr
                                key={`${kpi.id}-sub-${sIdx}`}
                                style={{
                                  backgroundColor: isDeptProj ? '#fff7ed' : '#f8fafc',
                                  borderBottom: isLastSub
                                    ? '1px solid #e2e8f0'
                                    : '1px dashed #e2e8f0',
                                  fontSize: '12.5px',
                                }}
                              >
                                <td
                                  style={{
                                    padding: '8px 12px',
                                    textAlign: 'right',
                                    color: isDeptProj ? '#c2410c' : '#64748b',
                                    fontSize: '11.5px',
                                    fontWeight: isDeptProj ? 700 : 500,
                                    borderRight: '1px solid #f1f5f9',
                                  }}
                                >
                                  {isDeptProj ? 'โครงการ/กิจกรรมส่วนงาน' : 'ตัวชี้วัดย่อย'}
                                </td>
                                <td
                                  style={{
                                    padding: '8px 12px 8px 24px',
                                    color: isDeptProj ? '#9a3412' : '#334155',
                                    fontWeight: isDeptProj ? 600 : 400,
                                    borderRight: '1px solid #f1f5f9',
                                    maxWidth: '380px',
                                  }}
                                >
                                  <KpiHoverTooltip
                                    badge={isDeptProj ? 'โครงการ/กิจกรรมส่วนงาน' : `ตัวชี้วัดย่อยของ ${kpi.code}`}
                                    badgeColor={isDeptProj ? 'orange' : 'blue'}
                                    fullText={sub.title}
                                    subText={sub.remarks || undefined}
                                  >
                                    {sub.title}
                                  </KpiHoverTooltip>
                                  {sub.remarks && (
                                    <KpiHoverTooltip
                                      badge="หมายเหตุตัวชี้วัดย่อย"
                                      badgeColor="slate"
                                      fullText={sub.remarks}
                                      style={{
                                        fontSize: '11.5px',
                                        color: '#64748b',
                                        marginTop: '2px',
                                      }}
                                    >
                                      {sub.remarks}
                                    </KpiHoverTooltip>
                                  )}
                                </td>
                                <td
                                  style={{
                                    padding: '8px',
                                    textAlign: 'center',
                                    color: '#94a3b8',
                                    borderRight: '1px solid #f1f5f9',
                                  }}
                                >
                                  -
                                </td>
                                <td
                                  style={{
                                    padding: '8px',
                                    textAlign: 'center',
                                    color: '#475569',
                                    borderRight: '1px solid #f1f5f9',
                                  }}
                                >
                                  {sub.unit || kpi.unit}
                                </td>
                                <td
                                  style={{
                                    padding: '8px 10px',
                                    textAlign: 'right',
                                    color: '#475569',
                                    fontWeight: 600,
                                    borderRight: '1px solid #f1f5f9',
                                  }}
                                >
                                  {sub.target !== undefined ? formatCellVal(sub.target) : '-'}
                                </td>
                                {activeRounds.map((round) => {
                                  const rawSubVal =
                                    sub.resultsByRound?.[round.id] ??
                                    (round.id === 'round-6m'
                                      ? sub.actual6M
                                      : round.id === 'round-9m'
                                      ? sub.actual9M
                                      : '-');
                                  return (
                                    <td
                                      key={round.id}
                                      style={{
                                        padding: '8px 10px',
                                        textAlign: 'right',
                                        color: round.id === 'round-9m' ? '#047857' : '#334155',
                                        fontWeight: round.id === 'round-9m' ? 700 : 600,
                                        borderRight: '1px solid #f1f5f9',
                                      }}
                                    >
                                      {formatCellVal(rawSubVal)}
                                    </td>
                                  );
                                })}
                                <td
                                  style={{
                                    padding: '8px 10px',
                                    textAlign: 'center',
                                    color: '#64748b',
                                    fontSize: '11px',
                                    borderRight: '1px solid #f1f5f9',
                                  }}
                                >
                                  {sub.evidence ? (
                                    <span title={sub.evidence}>มีหลักฐานอ้างอิง</span>
                                  ) : (
                                    '-'
                                  )}
                                </td>
                                <td
                                  style={{
                                    padding: '8px 10px',
                                    textAlign: 'center',
                                    color: '#475569',
                                    fontSize: '11.5px',
                                  }}
                                >
                                  {(sub.reporters && sub.reporters.join(', ')) ||
                                    sub.reporter ||
                                    kpi.reporter ||
                                    '-'}
                                </td>
                              </tr>
                            );
                          })}

                          {/* แถวขยายแสดง คำอธิบายตัวชี้วัด + หลักฐาน + หมายเหตุ (รายชื่อโครงการ/อาจารย์) */}
                          {isExpanded && (
                            <tr
                              style={{
                                backgroundColor: '#f0fdf4',
                                borderBottom: '1px solid #bbf7d0',
                              }}
                            >
                              <td colSpan={totalColSpan} style={{ padding: '14px 20px' }}>
                                <div
                                  style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '14px',
                                  }}
                                >
                                  {kpi.description && (
                                    <div
                                      style={{
                                        backgroundColor: '#ffffff',
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #dcfce7',
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          fontSize: '12px',
                                          fontWeight: 700,
                                          color: '#166534',
                                          marginBottom: '6px',
                                        }}
                                      >
                                        <FaInfoCircle />
                                        <span>คำอธิบายตัวชี้วัด (เกณฑ์ตามแผนยุทธศาสตร์)</span>
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '12.5px',
                                          color: '#334155',
                                          lineHeight: 1.5,
                                          whiteSpace: 'pre-line',
                                        }}
                                      >
                                        {kpi.description}
                                      </div>
                                    </div>
                                  )}

                                  {kpi.evidence && (
                                    <div
                                      style={{
                                        backgroundColor: '#ffffff',
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #dcfce7',
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          fontSize: '12px',
                                          fontWeight: 700,
                                          color: '#0369a1',
                                          marginBottom: '6px',
                                        }}
                                      >
                                        <FaFileAlt />
                                        <span>หลักฐานอ้างอิง / แหล่งข้อมูลตามรอบการรายงานผล</span>
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '12.5px',
                                          color: '#334155',
                                          lineHeight: 1.5,
                                          whiteSpace: 'pre-line',
                                        }}
                                      >
                                        {kpi.evidence}
                                      </div>
                                    </div>
                                  )}

                                  {kpi.remarks && (
                                    <div
                                      style={{
                                        backgroundColor: '#ffffff',
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #dcfce7',
                                        gridColumn: '1 / -1',
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '6px',
                                          fontSize: '12px',
                                          fontWeight: 700,
                                          color: '#b45309',
                                          marginBottom: '6px',
                                        }}
                                      >
                                        <FaListUl />
                                        <span>หมายเหตุ / รายละเอียดผลการดำเนินงานและรายชื่อผลงาน</span>
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '12.5px',
                                          color: '#334155',
                                          lineHeight: 1.55,
                                          whiteSpace: 'pre-line',
                                        }}
                                      >
                                        {kpi.remarks}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal รายงานผลตามรอบ + ผูกโครงการ */}
      {roundReportKpiId && (
        <StrategicKpiRoundReportModal
          isOpen={Boolean(roundReportKpiId)}
          kpiId={roundReportKpiId}
          onClose={() => setRoundReportKpiId(null)}
          onSaved={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('kpi_updated'));
            }
          }}
        />
      )}

      {/* Modal แก้ไขตัวชี้วัดตามแผนยุทธศาสตร์ */}
      <StrategicKpiModal
        isOpen={Boolean(editingKpiId)}
        kpiId={editingKpiId || undefined}
        onClose={() => setEditingKpiId(null)}
        onSaved={() => {
          setEditingKpiId(null);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('kpi_updated'));
          }
        }}
      />
    </div>
  );
}
