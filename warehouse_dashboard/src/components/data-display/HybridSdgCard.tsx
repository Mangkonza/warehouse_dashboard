'use client';

import React, { useState, useMemo } from 'react';
import {
  aggregateSDGMetrics,
  AggregatedSDGEntry,
  AggregatedClusterEntry,
  extractItemBudget,
} from '@/lib/sdgEngine';
import { formatMoney } from '@/components/ui/RecordDetailDrawer';
import { DrillDownProjectDrawer } from './DrillDownProjectDrawer';
import { CategoryKey } from '@/types/dataManagement';
import { FaGlobeAsia, FaLayerGroup, FaThLarge, FaTrophy, FaChevronRight } from 'react-icons/fa';

export type SdgViewMode = 'active' | 'cluster' | 'matrix17';

export interface HybridSdgCardProps {
  title?: string;
  subtitle?: string;
  items: any[];
  categoryKey?: CategoryKey;
  unitLabel?: string;
  showBudget?: boolean;
  defaultMode?: SdgViewMode;
  selectedSdgCode?: string;
  onSelectSdgCode?: (sdgCode: string) => void;
}

export const HybridSdgCard: React.FC<HybridSdgCardProps> = ({
  title = 'เป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs)',
  items,
  categoryKey = 'research',
  unitLabel = 'รายการ',
  showBudget = true,
  defaultMode = 'active',
  selectedSdgCode,
  onSelectSdgCode,
}) => {
  const [viewMode, setViewMode] = useState<SdgViewMode>(defaultMode);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    accentColor?: string;
    items: any[];
  }>({
    isOpen: false,
    title: '',
    items: [],
  });

  const summary = useMemo(() => aggregateSDGMetrics(items), [items]);
  const maxActiveCount = useMemo(
    () => Math.max(...summary.activeSDGs.map((s) => s.count), 1),
    [summary.activeSDGs]
  );
  const maxClusterCount = useMemo(
    () => Math.max(...summary.byCluster.map((c) => c.count), 1),
    [summary.byCluster]
  );

  const handleOpenSdgDrawer = (entry: AggregatedSDGEntry) => {
    if (onSelectSdgCode) {
      const nextCode = selectedSdgCode === entry.sdg.code ? '' : entry.sdg.code;
      onSelectSdgCode(nextCode);
    }
    if (entry.items.length > 0) {
      setDrawerState({
        isOpen: true,
        title: `${entry.sdg.code}: ${entry.sdg.nameTh} (${entry.sdg.nameEn})`,
        subtitle: `หมวดหมู่: ${entry.cluster.nameTh}`,
        accentColor: entry.sdg.color,
        items: entry.items,
      });
    }
  };

  const handleOpenClusterDrawer = (entry: AggregatedClusterEntry) => {
    if (entry.items.length > 0) {
      setDrawerState({
        isOpen: true,
        title: `หมวดหมู่ยุทธศาสตร์: ${entry.cluster.nameTh}`,
        subtitle: `ครอบคลุม ${entry.cluster.sdgNumbers.map((n) => `SDG ${n}`).join(', ')}`,
        accentColor: entry.cluster.color,
        items: entry.items,
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        padding: '20px',
      }}
    >
      {/* Top Header & 3-Mode View Switcher */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          paddingBottom: '14px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <FaGlobeAsia style={{ color: '#00A651', fontSize: '16px' }} />
            <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 600, color: '#1e293b' }}>
              {title}
            </h3>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 600,
                backgroundColor: '#f0fbf5',
                color: '#00A651',
                border: '1px solid #a7f3d0',
              }}
            >
              {summary.coveredCount} / 17 เป้าหมาย
            </span>
          </div>
        </div>

        {/* Segmented Mode Buttons (อ้างอิงโทนสีหน้า /manage) */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '3px',
            gap: '3px',
          }}
        >
          {[
            {
              key: 'active' as SdgViewMode,
              label: `เป้าหมายหลัก (${summary.activeSDGs.length})`,
              icon: <FaTrophy style={{ fontSize: '11px' }} />,
            },
            {
              key: 'cluster' as SdgViewMode,
              label: '4 หมวดหมู่',
              icon: <FaLayerGroup style={{ fontSize: '11px' }} />,
            },
            {
              key: 'matrix17' as SdgViewMode,
              label: 'ครบ 17 ข้อ',
              icon: <FaThLarge style={{ fontSize: '11px' }} />,
            },
          ].map((tab) => {
            const isActive = viewMode === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setViewMode(tab.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isActive ? '#00A651' : 'transparent',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODE 1: Top Active SDGs (เฉพาะเป้าหมายที่มีผลงานจริง) */}
      {viewMode === 'active' && (
        <div>
          {summary.activeSDGs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13.5px' }}>
              ไม่มีรายการข้อมูลในช่วงเวลาที่เลือก
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {summary.activeSDGs.map((entry) => {
                const widthPct = Math.max(8, Math.round((entry.count / maxActiveCount) * 100));
                const isSelected = selectedSdgCode === entry.sdg.code;
                const isHovered = hoveredKey === entry.sdg.code;
                const top3 = [...entry.items]
                  .sort((a, b) => extractItemBudget(b) - extractItemBudget(a))
                  .slice(0, 3);

                return (
                  <div
                    key={entry.sdg.code}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHoveredKey(entry.sdg.code)}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <div
                      onClick={() => handleOpenSdgDrawer(entry)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: isSelected
                          ? '1.5px solid #00A651'
                          : isHovered
                          ? `1px solid ${entry.sdg.color}`
                          : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#f0fbf5' : isHovered ? '#fafcfb' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px',
                          flexWrap: 'wrap',
                          marginBottom: '6px',
                        }}
                      >
                        {/* Left: SDG Badge + Thai Title + Cluster Pill */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '58px',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: entry.sdg.color,
                              color: '#ffffff',
                              fontSize: '11.5px',
                              fontWeight: 600,
                            }}
                          >
                            {entry.sdg.code}
                          </span>
                          <span style={{ fontSize: '13.5px', fontWeight: 400, color: '#0f172a' }}>
                            {entry.sdg.nameTh}
                          </span>
                          <span
                            style={{
                              padding: '1px 8px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: entry.cluster.bgTint,
                              color: entry.cluster.color,
                              border: `1px solid ${entry.cluster.borderTint}`,
                            }}
                          >
                            {entry.cluster.shortNameTh}
                          </span>
                        </div>

                        {/* Right: Count + Budget */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>
                            {entry.count.toLocaleString()} {unitLabel}{' '}
                            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 400 }}>
                              ({entry.percentOfCount.toFixed(1)}%)
                            </span>
                          </span>
                          {showBudget && entry.budget > 0 && (
                            <span
                              style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#059669',
                                fontFamily: 'monospace',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {formatMoney(entry.budget)} บาท
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Horizontal Progress Bar */}
                      <div
                        style={{
                          height: '7px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: '999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${widthPct}%`,
                            height: '100%',
                            backgroundColor: entry.sdg.color,
                            borderRadius: '999px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* Smart Rich Tooltip on Hover (แสดง Top 3 โครงการโดยไม่ให้กราฟรก) */}
                    {isHovered && top3.length > 0 && (
                      <div
                        style={{
                          marginTop: '4px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          color: '#334155',
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                          ตัวอย่างรายการใน {entry.sdg.code} (คลิกเพื่อดูครบทั้ง {entry.count} {unitLabel}):
                        </div>
                        {top3.map((it, idx) => {
                          const itemName = String(it.name || it.title || it.topic_title || '-').replace(/[\r\n]+/g, ' ').trim();
                          const b = extractItemBudget(it);
                          return (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '12px',
                                padding: '2px 0',
                                color: '#0f172a',
                              }}
                            >
                              <span
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                • {itemName}
                              </span>
                              {showBudget && b > 0 && (
                                <span
                                  style={{
                                    color: '#059669',
                                    fontFamily: 'monospace',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                  }}
                                >
                                  {formatMoney(b)} บาท
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: แยกตามหมวดหมู่ยุทธศาสตร์ 4 ด้าน & UI GreenMetric */}
      {viewMode === 'cluster' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* 4 คลัสเตอร์ยุทธศาสตร์วิศวกรรมศาสตร์ */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
            }}
          >
            {summary.byCluster.map((entry) => {
              const widthPct = Math.max(6, Math.round((entry.count / maxClusterCount) * 100));
              return (
                <div
                  key={entry.cluster.key}
                  onClick={() => handleOpenClusterDrawer(entry)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    cursor: entry.count > 0 ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (entry.count > 0) {
                      e.currentTarget.style.borderColor = entry.cluster.color;
                      e.currentTarget.style.backgroundColor = '#fafcfb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: entry.cluster.bgTint,
                          color: entry.cluster.color,
                          border: `1px solid ${entry.cluster.borderTint}`,
                          marginBottom: '6px',
                        }}
                      >
                        {entry.cluster.sdgNumbers.map((n) => `SDG ${n}`).join(', ')}
                      </span>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                        {entry.cluster.nameTh}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: entry.cluster.color, lineHeight: 1.1 }}>
                        {entry.count.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 400 }}>{unitLabel}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {entry.percentOfCount.toFixed(1)}% ของทั้งหมด
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      height: '6px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      margin: '10px 0 8px 0',
                    }}
                  >
                    <div
                      style={{
                        width: `${widthPct}%`,
                        height: '100%',
                        backgroundColor: entry.cluster.color,
                        borderRadius: '999px',
                      }}
                    />
                  </div>

                  {showBudget && entry.budget > 0 && (
                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, fontFamily: 'monospace' }}>
                      {formatMoney(entry.budget)} บาท
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ความเชื่อมโยงกับเกณฑ์มหาวิทยาลัยสีเขียว (UI GreenMetric Categories) */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '10px' }}>
              เกณฑ์มหาวิทยาลัยสีเขียว (UI GreenMetric)
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '8px',
              }}
            >
              {summary.byGreenMetric.map((gm) => (
                <div
                  key={gm.code}
                  onClick={() => {
                    if (gm.items.length > 0) {
                      setDrawerState({
                        isOpen: true,
                        title: `UI GreenMetric [${gm.code}]: ${gm.nameTh}`,
                        accentColor: gm.color,
                        items: gm.items,
                      });
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: gm.items.length > 0 ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: `${gm.color}18`,
                        color: gm.color,
                        fontSize: '11px',
                        fontWeight: 600,
                        marginRight: '6px',
                      }}
                    >
                      {gm.code}
                    </span>
                    <span style={{ fontSize: '12px', color: '#334155' }}>
                      {gm.nameTh.split(' (')[0]}
                    </span>
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: gm.count > 0 ? '#0f172a' : '#94a3b8', whiteSpace: 'nowrap' }}>
                    {gm.count} {unitLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: ครบ 17 เป้าหมาย & วิเคราะห์ช่องว่าง (Full 17 SDGs Gap Matrix) */}
      {viewMode === 'matrix17' && (
        <div>
          <div
            style={{
              marginBottom: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#f0fbf5',
              border: '1px solid #a7f3d0',
              fontSize: '12.5px',
              color: '#1e293b',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span>
              มีผลงาน <strong style={{ color: '#00A651' }}>{summary.coveredCount} เป้าหมาย</strong> • ยังว่าง{' '}
              <strong style={{ color: '#dc2626' }}>{summary.gapSDGs.length} เป้าหมาย</strong>
            </span>
            {summary.gapSDGs.length > 0 && (
              <span style={{ color: '#64748b' }}>
                ว่าง: {summary.gapSDGs.map((g) => g.sdg.code).join(', ')}
              </span>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
              gap: '10px',
            }}
          >
            {summary.all17.map((entry) => {
              const hasData = entry.count > 0;
              return (
                <div
                  key={entry.sdg.number}
                  onClick={() => hasData && handleOpenSdgDrawer(entry)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: hasData ? `1.5px solid ${entry.sdg.color}55` : '1px dashed #cbd5e1',
                    backgroundColor: hasData ? '#ffffff' : '#f8fafc',
                    opacity: hasData ? 1 : 0.72,
                    cursor: hasData ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '5px',
                          backgroundColor: hasData ? entry.sdg.color : '#cbd5e1',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {entry.sdg.code}
                      </span>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: hasData ? '#0f172a' : '#94a3b8',
                        }}
                      >
                        {entry.count} {unitLabel}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: hasData ? '#1e293b' : '#64748b', lineHeight: 1.35 }}>
                      {entry.sdg.nameTh}
                    </div>
                  </div>

                  {hasData && showBudget && entry.budget > 0 && (
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '4px', fontSize: '11px' }}>
                      <span style={{ color: '#059669', fontFamily: 'monospace', fontWeight: 600 }}>
                        {formatMoney(entry.budget)} บาท
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Slide-over Project Drawer เมื่อคลิกที่แท่งกราฟหรือหมวดหมู่ */}
      <DrillDownProjectDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState((prev) => ({ ...prev, isOpen: false }))}
        title={drawerState.title}
        subtitle={drawerState.subtitle}
        accentColor={drawerState.accentColor}
        categoryKey={categoryKey}
        items={drawerState.items}
      />
    </div>
  );
};
