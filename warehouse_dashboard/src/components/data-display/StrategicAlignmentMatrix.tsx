'use client';

import React, { useState, useMemo } from 'react';
import {
  FaChartBar,
  FaAward,
  FaGlobeAsia,
  FaChevronRight,
  FaCoins,
  FaCheckCircle,
} from 'react-icons/fa';
import { CategoryKey } from '@/types/dataManagement';
import { resolveItemStrategicAlignment } from '@/lib/pastelTheme';
import { extractItemBudget } from '@/lib/sdgEngine';
import { DrillDownProjectDrawer } from './DrillDownProjectDrawer';
import { SdgsDashboardView } from '@/app/(dashboard)/sdgs/_components/SdgsDashboardView';
import { cn } from '@/lib/utils';

export interface StrategicAlignmentMatrixProps {
  items: any[];
  categoryKey: CategoryKey;
  missionTitle?: string;
  unitLabel?: string;
  showBudget?: boolean;
}

export const StrategicAlignmentMatrix: React.FC<StrategicAlignmentMatrixProps> = ({
  items,
  categoryKey,
  missionTitle = 'พันธกิจ',
  unitLabel = 'โครงการ',
  showBudget = true,
}) => {
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

  // Calculate ISEE & IAM metrics dynamically
  const { iseeStats, iamStats, totalValidCount, totalBudget } = useMemo(() => {
    const iseeMap: Record<
      'I' | 'S' | 'E1' | 'E2',
      { id: 'I' | 'S' | 'E1' | 'E2'; label: string; code: string; color: string; bg: string; count: number; budget: number; items: any[] }
    > = {
      I: { id: 'I', label: 'I - ความเป็นนานาชาติ', code: 'Internationalization', color: '#F43F5E', bg: '#FFF1F2', count: 0, budget: 0, items: [] },
      S: { id: 'S', label: 'S - รับใช้สังคมและความยั่งยืน', code: 'Social Responsibility', color: '#F59E0B', bg: '#FFFBEB', count: 0, budget: 0, items: [] },
      E1: { id: 'E1', label: 'E - ความเป็นเลิศทางวิจัย', code: 'Excellence in Research', color: '#10B981', bg: '#ECFDF5', count: 0, budget: 0, items: [] },
      E2: { id: 'E2', label: 'E - ผู้ประกอบการและดิจิทัล', code: 'Entrepreneurship & Digital', color: '#0EA5E9', bg: '#F0F9FF', count: 0, budget: 0, items: [] },
    };

    const iamMap: Record<
      'I' | 'A' | 'M',
      { id: 'I' | 'A' | 'M'; label: string; code: string; color: string; bg: string; count: number; budget: number; items: any[] }
    > = {
      I: { id: 'I', label: 'I - ความถูกต้องและจริยธรรม', code: 'Integrity', color: '#059669', bg: '#ECFDF5', count: 0, budget: 0, items: [] },
      A: { id: 'A', label: 'A - ความคล่องตัวและการบริการ', code: 'Agility', color: '#0284C7', bg: '#F0F9FF', count: 0, budget: 0, items: [] },
      M: { id: 'M', label: 'M - ความเป็นมืออาชีพ', code: 'Mastery', color: '#7C3AED', bg: '#F5F3FF', count: 0, budget: 0, items: [] },
    };

    let totalB = 0;
    let validC = 0;

    (items || []).forEach((item) => {
      const b = extractItemBudget(item);
      totalB += b;
      validC += 1;

      const resolved = resolveItemStrategicAlignment(item, categoryKey);
      if (iseeMap[resolved.isee]) {
        iseeMap[resolved.isee].count += 1;
        iseeMap[resolved.isee].budget += b;
        iseeMap[resolved.isee].items.push(item);
      }

      if (iamMap[resolved.iam]) {
        iamMap[resolved.iam].count += 1;
        iamMap[resolved.iam].budget += b;
        iamMap[resolved.iam].items.push(item);
      }
    });

    return {
      iseeStats: Object.values(iseeMap),
      iamStats: Object.values(iamMap),
      totalValidCount: validC,
      totalBudget: totalB,
    };
  }, [items, categoryKey]);

  // Temporarily hidden from web display per user request, while preserving code and calculations
  const SHOW_ISEE_IAM = false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* SECTION 1: Dual Executive Alignment Cards (ISEE & IAM) - preserved in code, hidden from UI */}
      {SHOW_ISEE_IAM && (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Box 1: ISEE 4 Pillars */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaChartBar style={{ fontSize: '15px' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: '#0f172a' }}>
                ความสอดคล้องตามยุทธศาสตร์มหาวิทยาลัย (ISEE 4 Pillars)
              </h3>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
              }}
            >
              4 เสาหลัก มก.
            </span>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>
            การกระจายตัวของ{missionTitle}ตามยุทธศาสตร์ 4 เสาหลักของมหาวิทยาลัยเกษตรศาสตร์
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
            {iseeStats.map((pillar) => {
              const pct = totalValidCount > 0 ? ((pillar.count / totalValidCount) * 100).toFixed(1) : '0';
              const budgetM = (pillar.budget / 1000000).toFixed(2);

              return (
                <div
                  key={pillar.id}
                  onClick={() => {
                    if (pillar.items.length > 0) {
                      setDrawerState({
                        isOpen: true,
                        title: `ยุทธศาสตร์ มก. ${pillar.label}`,
                        subtitle: `รวม ${pillar.count} ${unitLabel} (${pct}%) • งบประมาณ ${pillar.budget.toLocaleString('th-TH')} บาท`,
                        accentColor: pillar.color,
                        items: pillar.items,
                      });
                    }
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    cursor: pillar.items.length > 0 ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:bg-slate-100/80 hover:border-slate-300"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: pillar.bg,
                          color: pillar.color,
                          fontWeight: 700,
                          fontSize: '11.5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${pillar.color}40`,
                        }}
                      >
                        {pillar.id}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                        {pillar.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 700, color: pillar.color }}>
                        {pillar.count} {unitLabel}
                      </span>
                      <span style={{ color: '#64748b' }}>({pct}%)</span>
                      {showBudget && pillar.budget > 0 && (
                        <>
                          <span style={{ color: '#cbd5e1' }}>•</span>
                          <span style={{ color: '#047857', fontWeight: 600 }}>{budgetM} ลบ.</span>
                        </>
                      )}
                      <FaChevronRight style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '2px' }} />
                    </div>
                  </div>

                  <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: pillar.color,
                        borderRadius: '999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Box 2: IAM Core Values */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: '#f5f3ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaAward style={{ fontSize: '15px' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: '#0f172a' }}>
                การขับเคลื่อนตามค่านิยมองค์กร (IAM Core Values)
              </h3>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
              }}
            >
              3 ค่านิยมหลัก
            </span>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>
            การแสดงออกของค่านิยมองค์กรผ่านการปฏิบัติงานและผลผลิตจริง
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
            {iamStats.map((val) => {
              const pct = totalValidCount > 0 ? ((val.count / totalValidCount) * 100).toFixed(1) : '0';
              const budgetM = (val.budget / 1000000).toFixed(2);

              return (
                <div
                  key={val.id}
                  onClick={() => {
                    if (val.items.length > 0) {
                      setDrawerState({
                        isOpen: true,
                        title: `ค่านิยมองค์กร ${val.label}`,
                        subtitle: `รวม ${val.count} ${unitLabel} (${pct}%) • งบประมาณ ${val.budget.toLocaleString('th-TH')} บาท`,
                        accentColor: val.color,
                        items: val.items,
                      });
                    }
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    cursor: val.items.length > 0 ? 'pointer' : 'default',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:bg-slate-100/80 hover:border-slate-300"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          backgroundColor: val.bg,
                          color: val.color,
                          fontWeight: 700,
                          fontSize: '11.5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${val.color}40`,
                        }}
                      >
                        {val.id}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                        {val.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 700, color: val.color }}>
                        {val.count} {unitLabel}
                      </span>
                      <span style={{ color: '#64748b' }}>({pct}%)</span>
                      {showBudget && val.budget > 0 && (
                        <>
                          <span style={{ color: '#cbd5e1' }}>•</span>
                          <span style={{ color: '#047857', fontWeight: 600 }}>{budgetM} ลบ.</span>
                        </>
                      )}
                      <FaChevronRight style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '2px' }} />
                    </div>
                  </div>

                  <div style={{ height: '7px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: val.color,
                        borderRadius: '999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* SECTION 2: United Nations SDGs 17 Goals Matrix */}
      <div className="space-y-4">
        <SdgsDashboardView
          embeddedCategory={categoryKey}
          isEmbedded={true}
          embeddedItems={items}
        />
      </div>

      {/* DrillDown Project Drawer */}
      <DrillDownProjectDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState((prev) => ({ ...prev, isOpen: false }))}
        title={drawerState.title}
        subtitle={drawerState.subtitle}
        accentColor={drawerState.accentColor}
        items={drawerState.items}
        categoryKey={categoryKey}
      />
    </div>
  );
};
