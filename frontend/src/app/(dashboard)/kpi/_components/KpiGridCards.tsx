'use client';

import React, { useState } from 'react';
import {
  FaBullseye,
  FaBuilding,
  FaInfoCircle,
  FaListUl,
  FaUserCheck,
  FaCalendarAlt,
  FaFileAlt,
  FaCalendarCheck,
  FaEdit,
} from 'react-icons/fa';
import { KPIComputedResult, KPIReportingRoundConfig } from '@/types/kpi';
import { ENGINEERING_DEPARTMENTS, getStrategicPillar } from '@/lib/kpiEngine';
import { CATEGORY_NAMES } from '../_hooks/useKpiData';
import { DepartmentBadge, StrategyBadge } from '@/components/ui';
import { DrillDownProjectDrawer } from '@/components/data-display';
import { getDepartment } from '@/lib/departments';
import { CategoryKey } from '@/config/dataManagementConfig';
import { StrategicKpiModal } from './StrategicKpiFormView';
import { StrategicKpiRoundReportModal } from './StrategicKpiRoundReportView';

interface KpiGridCardsProps {
  filteredKPIs: KPIComputedResult[];
  reportingRounds?: KPIReportingRoundConfig[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

export function KpiGridCards({
  filteredKPIs,
  reportingRounds = [],
  expandedId,
  onToggleExpand,
}: KpiGridCardsProps) {
  const [drillDownItem, setDrillDownItem] = useState<KPIComputedResult | null>(null);
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [roundReportKpiId, setRoundReportKpiId] = useState<string | null>(null);

  const activeRounds =
    reportingRounds.length > 0
      ? reportingRounds
      : [
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

  const formatValue = (val: number | null | undefined, unit: string) => {
    if (val === null || val === undefined) return '-';
    if (unit === 'บาท') {
      if (val >= 1000000) {
        return `${(val / 1000000).toLocaleString('th-TH', { maximumFractionDigits: 2 })} ล้านบาท`;
      }
      return `${val.toLocaleString('th-TH')} บาท`;
    }
    return `${val.toLocaleString('th-TH', { maximumFractionDigits: 2 })} ${unit}`;
  };

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
        <div style={{ fontSize: '15px', fontWeight: 600 }}>ไม่พบตัวชี้วัดในหมวดหมู่นี้</div>
        <div style={{ fontSize: '13px', marginTop: '4px' }}>
          ลองเปลี่ยนตัวกรอง หรือเพิ่มตัวชี้วัดใหม่ในหน้าจัดการข้อมูล
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(365px, 1fr))',
        gap: '18px',
      }}
    >
      {filteredKPIs.map((item) => {
        const {
          kpi,
          currentValue,
          value6M,
          value9M,
          valuesByRound,
          textsByRound,
          targetValue,
          percentage,
          status,
          statusLabel,
          statusColor,
          details,
        } = item;
        const isExpanded = expandedId === kpi.id;
        const pillar = getStrategicPillar(kpi.strategyCode);
        const subItems = kpi.subIndicators || [];

        return (
          <div
            key={kpi.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                padding: '15px 18px',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#fafbfc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#00A651',
                      backgroundColor: '#e8f5e9',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {kpi.code}
                  </span>

                  {(pillar || kpi.strategyCode) && (
                    <StrategyBadge value={pillar?.code || kpi.strategyCode} />
                  )}

                  {kpi.planCode && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#475569',
                        backgroundColor: '#f1f5f9',
                        padding: '2px 7px',
                        borderRadius: '4px',
                      }}
                    >
                      {kpi.planCode}
                    </span>
                  )}

                  {kpi.collectionPeriod && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '11px',
                        color: '#64748b',
                      }}
                      title="รอบการเก็บข้อมูล"
                    >
                      <FaCalendarAlt style={{ fontSize: '10px' }} />
                      <span>รอบการเก็บข้อมูล: {kpi.collectionPeriod}</span>
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#1e293b',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {kpi.title}
                </h3>
              </div>

              {/* Status Badge */}
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  backgroundColor:
                    status === 'achieved'
                      ? '#ecfdf5'
                      : status === 'in_progress' || status === 'on_track' || status === 'at_risk'
                      ? '#fefce8'
                      : '#fef2f2',
                  color: statusColor,
                  border: `1px solid ${statusColor}33`,
                  whiteSpace: 'nowrap',
                }}
              >
                {statusLabel}
              </span>
            </div>

            {/* Card Body */}
            <div
              style={{
                padding: '18px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              {/* Big Number Comparison */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '6px',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      ผลการดำเนินงานปัจจุบัน
                    </span>
                    <div style={{ fontSize: '21px', fontWeight: 800, color: statusColor }}>
                      {kpi.actual9MText || formatValue(currentValue, kpi.unit)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      ค่าเป้าหมาย ปี 2569
                    </span>
                    <div style={{ fontSize: '15.5px', fontWeight: 700, color: '#475569' }}>
                      {kpi.targetLabel
                        ? `${kpi.targetLabel} (${kpi.unit})`
                        : formatValue(targetValue, kpi.unit)}
                    </div>
                  </div>
                </div>

                {/* สรุปผลตามรอบการรายงานผล (Dynamic) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '8px',
                    padding: '8px 10px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    marginBottom: '8px',
                  }}
                >
                  {activeRounds.map((r) => {
                    const rVal =
                      valuesByRound?.[r.id] ??
                      (r.id === 'round-6m' ? value6M : r.id === 'round-9m' ? value9M : null);
                    const rTxt =
                      textsByRound?.[r.id] ||
                      (r.id === 'round-6m'
                        ? kpi.actual6MText
                        : r.id === 'round-9m'
                        ? kpi.actual9MText
                        : undefined);
                    return (
                      <div key={r.id}>
                        <span style={{ color: '#64748b' }}>{r.name}: </span>
                        <strong style={{ color: r.id === 'round-9m' ? '#047857' : '#334155' }}>
                          {rTxt || formatValue(rVal, kpi.unit)}
                        </strong>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      height: '100%',
                      backgroundColor: statusColor,
                      borderRadius: '6px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                    fontSize: '12px',
                  }}
                >
                  <span style={{ fontWeight: 700, color: statusColor }}>{percentage}% สำเร็จ</span>
                  <span style={{ color: '#64748b', fontSize: '11.5px' }}>
                    {CATEGORY_NAMES[kpi.category] || kpi.category}
                  </span>
                </div>
              </div>

              {/* ตัวชี้วัดย่อย (Sub-indicators) */}
              {subItems.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    ตัวชี้วัดย่อย ({subItems.length} รายการ):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {subItems.map((sub, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          gap: '8px',
                          fontSize: '11.5px',
                          color: '#475569',
                          borderBottom:
                            idx < subItems.length - 1 ? '1px dashed #e2e8f0' : 'none',
                          paddingBottom: idx < subItems.length - 1 ? '4px' : 0,
                        }}
                      >
                        <span style={{ flex: 1 }}>{sub.title}</span>
                        <strong style={{ color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {sub.actual9M !== undefined && sub.actual9M !== ''
                            ? typeof sub.actual9M === 'number'
                              ? sub.actual9M.toLocaleString('th-TH')
                              : sub.actual9M
                            : '-'}{' '}
                          {sub.unit || ''}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completeness breakdown (สำหรับ 7 ภาควิชา) */}
              {kpi.calcType === 'auto_completeness' && details && (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    สถานะการมีส่วนร่วม 7 ภาควิชา: ({details.completedDepartments?.length || 0}/7)
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {ENGINEERING_DEPARTMENTS.map((dept) => {
                      const isDone = details.completedDepartments?.includes(dept);
                      if (isDone) {
                        return <DepartmentBadge key={dept} value={dept} />;
                      }

                      return (
                        <span
                          key={dept}
                          title={`${dept} (ยังไม่ครบ)`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '56px',
                            padding: '3px 12px',
                            borderRadius: '9999px',
                            fontSize: '12.5px',
                            fontWeight: 500,
                            backgroundColor: '#f1f5f9',
                            color: '#94a3b8',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          {getDepartment(dept).code}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ผู้รับผิดชอบ & ผู้รายงานข้อมูล */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#64748b',
                }}
              >
                {kpi.responsibleUnit && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaBuilding style={{ color: '#94a3b8' }} />
                    <span>
                      ส่วนงาน: <strong>{kpi.responsibleUnit}</strong>
                    </span>
                  </div>
                )}

                {kpi.reporter && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      color: '#15803d',
                      fontSize: '11.5px',
                      fontWeight: 600,
                    }}
                  >
                    <FaUserCheck style={{ fontSize: '10px' }} />
                    <span>ผู้รายงาน: {kpi.reporter}</span>
                  </div>
                )}
              </div>

              {/* Expand details & Action buttons */}
              <div
                style={{
                  paddingTop: '10px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {kpi.description || kpi.evidence || kpi.remarks ? (
                  <button
                    onClick={() => onToggleExpand(kpi.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <FaInfoCircle />
                    <span>{isExpanded ? 'ย่อรายละเอียด' : 'ดูเกณฑ์ประเมิน • หลักฐาน • หมายเหตุ'}</span>
                  </button>
                ) : (
                  <span />
                )}

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setRoundReportKpiId(kpi.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      border: '1px solid #86efac',
                      backgroundColor: '#f0fdf4',
                      color: '#006838',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <FaCalendarCheck size={11} />
                    <span>รายงานผลรายรอบ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingKpiId(kpi.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <FaEdit size={11} />
                    <span>แก้ไข</span>
                  </button>

                  {details?.sampleMatches && details.sampleMatches.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setDrillDownItem(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #00A651',
                        backgroundColor: '#f0fbf5',
                        color: '#006838',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <FaListUl size={11} />
                      <span>ดูรายการในระบบ ({details.sampleMatches.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#334155',
                    backgroundColor: '#f8fafc',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {kpi.description && (
                    <div>
                      <strong style={{ color: '#0f172a' }}>คำอธิบายตัวชี้วัด: </strong>
                      <span>{kpi.description}</span>
                    </div>
                  )}
                  {kpi.evidence && (
                    <div>
                      <strong style={{ color: '#0369a1' }}>
                        <FaFileAlt style={{ display: 'inline', marginRight: '4px' }} />
                        หลักฐานอ้างอิง:{' '}
                      </strong>
                      <span>{kpi.evidence}</span>
                    </div>
                  )}
                  {kpi.remarks && (
                    <div style={{ whiteSpace: 'pre-line' }}>
                      <strong style={{ color: '#b45309' }}>หมายเหตุ / รายชื่อผลงาน: </strong>
                      <div>{kpi.remarks}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <DrillDownProjectDrawer
        isOpen={Boolean(drillDownItem)}
        onClose={() => setDrillDownItem(null)}
        title={drillDownItem ? `${drillDownItem.kpi.code}: ${drillDownItem.kpi.title}` : ''}
        subtitle={
          drillDownItem
            ? `ผลงานปัจจุบัน ${formatValue(drillDownItem.currentValue, drillDownItem.kpi.unit)} / เป้าหมาย ${formatValue(drillDownItem.targetValue, drillDownItem.kpi.unit)} (${drillDownItem.percentage}%)`
            : ''
        }
        accentColor={drillDownItem?.statusColor || '#00A651'}
        categoryKey={(drillDownItem?.kpi.datasetKey as CategoryKey) || 'research'}
        items={drillDownItem?.details?.sampleMatches || []}
      />

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
