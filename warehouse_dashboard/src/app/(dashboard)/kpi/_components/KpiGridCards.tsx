'use client';

import React, { useState } from 'react';
import { FaBullseye, FaBuilding, FaInfoCircle, FaListUl } from 'react-icons/fa';
import { KPIComputedResult } from '@/types/kpi';
import { ENGINEERING_DEPARTMENTS } from '@/config/kpiConfig';
import { CATEGORY_NAMES } from '../_hooks/useKpiData';
import { DepartmentBadge } from '@/components/ui';
import { DrillDownProjectDrawer } from '@/components/data-display';
import { getDepartment } from '@/lib/departments';
import { CategoryKey } from '@/config/dataManagementConfig';

interface KpiGridCardsProps {
  filteredKPIs: KPIComputedResult[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

export function KpiGridCards({ filteredKPIs, expandedId, onToggleExpand }: KpiGridCardsProps) {
  const [drillDownItem, setDrillDownItem] = useState<KPIComputedResult | null>(null);

  const formatValue = (val: number, unit: string) => {
    if (unit === 'บาท') {
      if (val >= 1000000) {
        return `${(val / 1000000).toLocaleString('th-TH', { maximumFractionDigits: 2 })} ล้านบาท`;
      }
      return `${val.toLocaleString('th-TH')} บาท`;
    }
    return `${val.toLocaleString('th-TH')} ${unit}`;
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
        <div style={{ fontSize: '13px', marginTop: '4px' }}>ลองเปลี่ยนตัวกรอง หรือเพิ่มตัวชี้วัดใหม่ในหน้าจัดการข้อมูล</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '18px',
      }}
    >
      {filteredKPIs.map((item) => {
        const { kpi, currentValue, targetValue, percentage, status, statusLabel, statusColor, details } = item;
        const isExpanded = expandedId === kpi.id;

        return (
            <div
            key={kpi.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: `1.5px solid ${statusColor}40`,
              borderLeft: `4px solid ${statusColor}`,
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
                padding: '16px 20px',
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: '#fafbfc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: '#00A651',
                      backgroundColor: '#e8f5e9',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {kpi.code}
                  </span>
                  <span
                    style={{
                      fontSize: '11.5px',
                      color: '#64748b',
                      fontWeight: 500,
                    }}
                  >
                    {CATEGORY_NAMES[kpi.category] || kpi.category}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '14.5px',
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
                      : status === 'on_track'
                      ? '#f0f9ff'
                      : status === 'at_risk'
                      ? '#fffbeb'
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
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {/* Big Number Comparison */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <div>
                    <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      ผลงานปัจจุบัน
                    </span>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: statusColor }}>
                      {formatValue(currentValue, kpi.unit)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                      เป้าหมายยุทธศาสตร์
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#475569' }}>
                      {formatValue(targetValue, kpi.unit)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '9px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    position: 'relative',
                    marginTop: '8px',
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

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px' }}>
                  <span style={{ fontWeight: 700, color: statusColor }}>
                    {percentage}% สำเร็จ
                  </span>
                  <span style={{ color: '#64748b', fontSize: '11.5px' }}>
                    {currentValue >= targetValue
                      ? `เกินเป้าหมาย +${formatValue(currentValue - targetValue, kpi.unit)}`
                      : `ยังขาดอีก ${formatValue(targetValue - currentValue, kpi.unit)}`}
                  </span>
                </div>
              </div>

              {/* Completeness breakdown (สำหรับ 7 ภาควิชา) */}
              {kpi.calcType === 'auto_completeness' && details && (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    marginBottom: '12px',
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

              {/* Responsible Unit */}
              {kpi.responsibleUnit && (
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  <span>ผู้รับผิดชอบ: <strong style={{ color: '#1e293b' }}>{kpi.responsibleUnit}</strong></span>
                </div>
              )}

              {/* Expand details & Drill-Down buttons */}
              <div
                style={{
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {kpi.description ? (
                  <button
                    onClick={() => onToggleExpand(kpi.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <span>{isExpanded ? 'ย่อคำอธิบาย' : 'ดูเกณฑ์ประเมิน'}</span>
                  </button>
                ) : (
                  <span />
                )}

                {details?.sampleMatches && details.sampleMatches.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDrillDownItem(item)}
                    style={{
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
                    <span>ดูผลงานจริง ({details.sampleMatches.length})</span>
                  </button>
                )}
              </div>

              {isExpanded && kpi.description && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#475569',
                    marginTop: '8px',
                    lineHeight: 1.4,
                    backgroundColor: '#f8fafc',
                    padding: '8px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {kpi.description}
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
    </div>
  );
}
