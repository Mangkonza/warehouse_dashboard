'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { calculateProjectTimeline, STATUS_LABELS } from '@/lib/projectMonitoringEngine';
import { ProjectExtensionRecord } from '@/types/projectMonitoring';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import { DepartmentBadge, DepartmentSelect, RecordDetailDrawer, formatDateBE } from '@/components/ui';
import { getDepartment } from '@/lib/departments';
import { isTestRecord } from '@/lib/sdgEngine';
import { TimeFilterBar, useTimeFilter } from '@/features/time-filter';
import { FaSearch } from 'react-icons/fa';

export type MonitoringProjectType = 'research' | 'academic' | 'all';

interface ProjectMonitoringTabProps {
  goBack?: () => void;
  onNavigateToManage?: () => void;
}

export default function ProjectMonitoringTab({}: ProjectMonitoringTabProps) {
  const { filterProjectsByTime } = useTimeFilter();

  // 1. Datasets State
  const [researchList, setResearchList] = useState<any[]>(() => {
    return getCachedCategoryData('research') || rawResearch;
  });
  const [academicList, setAcademicList] = useState<any[]>(() => {
    return getCachedCategoryData('academic') || rawAcademic;
  });

  // 2. Fetch fresh data on mount and listen to updates
  useEffect(() => {
    const loadFresh = async () => {
      try {
        const freshRes = await fetchCategoryData('research');
        if (freshRes && Array.isArray(freshRes) && freshRes.length > 0) {
          setResearchList(freshRes);
        }
        const freshAca = await fetchCategoryData('academic');
        if (freshAca && Array.isArray(freshAca) && freshAca.length > 0) {
          setAcademicList(freshAca);
        }
      } catch (err) {
        console.warn('[ProjectMonitoringTab] Sync error:', err);
      }
    };
    loadFresh();

    const handleUpdate = () => {
      const r = getCachedCategoryData('research');
      if (r && Array.isArray(r)) setResearchList(r);
      const a = getCachedCategoryData('academic');
      if (a && Array.isArray(a)) setAcademicList(a);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  // 3. Tab & Filter State (แยกโครงการวิจัย และ โครงการพัฒนาวิชาการ)
  const [activeProjectType, setActiveProjectType] = useState<MonitoringProjectType>('research');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [selectedDetailTarget, setSelectedDetailTarget] = useState<{
    item: Record<string, any>;
    category: 'research' | 'academic';
  } | null>(null);

  // 4. Compute Timelines for Research Projects
  const processedResearch = useMemo(() => {
    const clean = researchList.filter(
      (p) => !isTestRecord(p) && p.name && p.name !== 'nan' && p.name !== 'NaT' && p.name !== 'เรื่อง'
    );
    const timeFiltered = filterProjectsByTime(clean, 'start_date');
    return timeFiltered.map((p, idx) => {
      const timeline = calculateProjectTimeline(p);
      return {
        ...p,
        _projectCategory: 'research' as const,
        _uniqueKey: `research_${p.id || p._id || idx}`,
        _timeline: timeline,
      };
    });
  }, [researchList, filterProjectsByTime]);

  // 5. Compute Timelines for Academic Projects
  const processedAcademic = useMemo(() => {
    const clean = academicList.filter(
      (p) => !isTestRecord(p) && p.name && p.name !== 'nan' && p.name !== 'NaT' && p.name !== 'เรื่อง'
    );
    const timeFiltered = filterProjectsByTime(clean, 'start_date');
    return timeFiltered.map((p, idx) => {
      const timeline = calculateProjectTimeline(p);
      return {
        ...p,
        _projectCategory: 'academic' as const,
        _uniqueKey: `academic_${p._id || p.name || idx}`,
        _timeline: timeline,
      };
    });
  }, [academicList, filterProjectsByTime]);

  // Combined Dataset
  const currentDataset = useMemo(() => {
    if (activeProjectType === 'research') return processedResearch;
    if (activeProjectType === 'academic') return processedAcademic;
    return [...processedResearch, ...processedAcademic];
  }, [activeProjectType, processedResearch, processedAcademic]);

  // 6. Statistics Calculation for the currently active project type
  const stats = useMemo(() => {
    let total = currentDataset.length;
    let onTrack = 0;
    let expiringSoon = 0;
    let extensionReq = 0;
    let extended = 0;
    let delayed = 0;
    let completed = 0;

    currentDataset.forEach((p) => {
      const st = p._timeline.status;
      const days = p._timeline.days_remaining;
      const isOverdue = p._timeline.is_overdue;

      if (st !== 'completed' && !isOverdue && days >= 0 && days <= 90) {
        expiringSoon++;
      }

      if (st === 'active') onTrack++;
      else if (st === 'extension_requested') extensionReq++;
      else if (st === 'extended') extended++;
      else if (st === 'delayed') delayed++;
      else if (st === 'completed') completed++;
    });

    return { total, onTrack, expiringSoon, extensionReq, extended, delayed, completed };
  }, [currentDataset]);

  // 7. Filtered Projects List (เรียงลำดับตามความเร่งด่วน: ล่าช้า -> ใกล้ครบกำหนด -> ขอขยายเวลา -> ตามกำหนด -> ปิดโครงการแล้ว)
  const filteredList = useMemo(() => {
    const filtered = currentDataset.filter((p) => {
      // Status Filter
      if (statusFilter === 'expiring_soon') {
        const isExpiring =
          p._timeline.status !== 'completed' &&
          !p._timeline.is_overdue &&
          p._timeline.days_remaining >= 0 &&
          p._timeline.days_remaining <= 90;
        if (!isExpiring) return false;
      } else if (statusFilter !== 'all' && p._timeline.status !== statusFilter) {
        return false;
      }
      // Department Filter
      if (deptFilter !== 'all') {
        const itemDept = getDepartment(p.department);
        const filterDept = getDepartment(deptFilter);
        if (itemDept.code !== filterDept.code && !String(p.department || '').includes(deptFilter)) {
          return false;
        }
      }
      // Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const name = String(p.name || '').toLowerCase();
        const head = String(p.head || p.person || '').toLowerCase();
        const id = String(p.id || p.record_number || '').toLowerCase();
        const client = String(p.client || '').toLowerCase();
        const fund = String(p.fund_source || '').toLowerCase();
        if (
          !name.includes(q) &&
          !head.includes(q) &&
          !id.includes(q) &&
          !client.includes(q) &&
          !fund.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });

    const getUrgencyRank = (p: any): number => {
      const st = p._timeline.status;
      if (st === 'delayed') return 1;
      if (st !== 'completed' && !p._timeline.is_overdue && p._timeline.days_remaining >= 0 && p._timeline.days_remaining <= 90) {
        return 2;
      }
      if (st === 'extension_requested') return 3;
      if (st === 'extended') return 4;
      if (st === 'active') return 5;
      return 6;
    };

    return [...filtered].sort((a, b) => {
      const rankA = getUrgencyRank(a);
      const rankB = getUrgencyRank(b);
      if (rankA !== rankB) return rankA - rankB;
      return (a._timeline.days_remaining ?? 9999) - (b._timeline.days_remaining ?? 9999);
    });
  }, [currentDataset, statusFilter, deptFilter, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Time Filter Bar */}
      <TimeFilterBar totalCount={filteredList.length} />

      {/* 2. Project Type Segment Switcher (คลีน สลับง่าย ไม่มีไอคอนรก) */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '10px',
          gap: '4px',
          border: '1px solid #e2e8f0',
          alignSelf: 'flex-start',
        }}
      >
        {[
          { id: 'research', label: 'โครงการวิจัย', count: processedResearch.length },
          { id: 'academic', label: 'โครงการพัฒนาวิชาการ', count: processedAcademic.length },
          { id: 'all', label: 'โครงการทั้งหมด', count: processedResearch.length + processedAcademic.length },
        ].map((tab) => {
          const isSelected = activeProjectType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveProjectType(tab.id as MonitoringProjectType);
                setStatusFilter('all');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                borderRadius: '7px',
                fontSize: '13px',
                fontWeight: isSelected ? 700 : 500,
                border: 'none',
                backgroundColor: isSelected ? '#ffffff' : 'transparent',
                color: isSelected ? '#00A651' : '#64748b',
                boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#e6f4ea' : '#e2e8f0',
                  color: isSelected ? '#00A651' : '#64748b',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Status Summary Cards (กรอบสี คลีน หัวเรื่องอยู่บนสุด ไม่มีไอคอนหรืออิโมจิ) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
        }}
      >
        {[
          {
            key: 'all',
            label:
              activeProjectType === 'research'
                ? 'โครงการวิจัยทั้งหมด'
                : activeProjectType === 'academic'
                ? 'โครงการพัฒนาวิชาการทั้งหมด'
                : 'โครงการทั้งหมด',
            count: stats.total,
            color: '#00A651',
          },
          {
            key: 'active',
            label: 'ตามกำหนดสัญญา',
            count: stats.onTrack,
            color: '#059669',
          },
          {
            key: 'expiring_soon',
            label: 'ใกล้ครบกำหนด (≤ 90 วัน)',
            count: stats.expiringSoon,
            color: '#ea580c',
          },
          {
            key: 'extension_requested',
            label: 'ยื่นขอขยายเวลา',
            count: stats.extensionReq,
            color: '#d97706',
          },
          {
            key: 'extended',
            label: 'อนุมัติขยายเวลาแล้ว',
            count: stats.extended,
            color: '#b45309',
          },
          {
            key: 'delayed',
            label: 'ล่าช้ากว่ากำหนด',
            count: stats.delayed,
            color: '#dc2626',
          },
          {
            key: 'completed',
            label: 'ปิดโครงการแล้ว',
            count: stats.completed,
            color: '#475569',
          },
        ].map((item) => {
          const isSelected = statusFilter === item.key;
          return (
            <div
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: isSelected ? `${item.color}10` : '#ffffff',
                border: isSelected ? `2px solid ${item.color}` : `1.5px solid ${item.color}50`,
                cursor: 'pointer',
                boxShadow: isSelected ? `0 4px 12px ${item.color}20` : '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '76px',
              }}
            >
              <div style={{ fontSize: '11.5px', color: '#475569', fontWeight: 600, lineHeight: 1.3 }}>
                {item.label}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: isSelected ? item.color : '#0f172a',
                  fontVariantNumeric: 'tabular-nums',
                  marginTop: '4px',
                }}
              >
                {item.count}{' '}
                <span style={{ fontSize: '11.5px', fontWeight: 500, color: '#64748b' }}>โครงการ</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Search and Department Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <FaSearch
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '13px',
            }}
          />
          <input
            type="text"
            placeholder={
              activeProjectType === 'research'
                ? 'ค้นหาชื่อโครงการวิจัย, หัวหน้าโครงการ, แหล่งทุน...'
                : activeProjectType === 'academic'
                ? 'ค้นหาชื่อโครงการพัฒนาวิชาการ, หัวหน้าโครงการ, ผู้ว่าจ้าง...'
                : 'ค้นหาชื่อโครงการ, หัวหน้าโครงการ, หน่วยงาน...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <DepartmentSelect
            value={deptFilter}
            onChange={setDeptFilter}
            allowAll
            allLabel="ทุกภาควิชา / ศูนย์"
            allValue="all"
            size="sm"
            className="w-[190px]"
          />

          {(statusFilter !== 'all' || deptFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setDeptFilter('all');
                setSearchTerm('');
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {/* 5. Project Timeline Cards List (สะอาด อ่านง่าย กวาดสายตารู้เรื่องทันที) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>
            แสดงผล <strong style={{ color: '#0f172a' }}>{filteredList.length}</strong> โครงการ
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              color: '#94a3b8',
              fontSize: '13.5px',
            }}
          >
            ไม่พบข้อมูลโครงการตามเงื่อนไขที่เลือก
          </div>
        ) : (
          filteredList.map((item, idx) => {
            const tl = item._timeline;
            const statusInfo = (STATUS_LABELS as Record<string, any>)[tl.status] || STATUS_LABELS.active;
            const isResearch = item._projectCategory === 'research';
            const cat = isResearch ? 'research' : 'academic';
            const extensions: ProjectExtensionRecord[] = Array.isArray(item.extensions) ? item.extensions : [];
            const budgetVal = isResearch
              ? item.budget_total || item.budget_internal || 0
              : Number(item.budget) || 0;

            return (
              <div
                key={item._uniqueKey || idx}
                onClick={() => setSelectedDetailTarget({ item, category: cat })}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  borderLeft: `4px solid ${statusInfo.color}`,
                  padding: '14px 18px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafcfb';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                }}
              >
                {/* แถวบน: หมวดหมู่ + รหัส + สถานะสัญญา + ระยะเวลาคงเหลือ */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {/* Category Tag */}
                    <span
                      style={{
                        padding: '1px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isResearch ? '#eff6ff' : '#f5f3ff',
                        color: isResearch ? '#1d4ed8' : '#6d28d9',
                        border: isResearch ? '1px solid #bfdbfe' : '1px solid #ddd6fe',
                      }}
                    >
                      {isResearch ? 'วิจัย' : 'พัฒนาวิชาการ'}
                    </span>

                    {/* Code ID */}
                    {(item.id || item.record_number) && (
                      <span
                        style={{
                          padding: '1px 7px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          fontFamily: 'monospace',
                        }}
                      >
                        {item.id || item.record_number}
                      </span>
                    )}

                    {/* Status Badge */}
                    <span
                      style={{
                        padding: '1px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.border}`,
                      }}
                    >
                      {statusInfo.labelTh}
                    </span>

                    {extensions.length > 0 && (
                      <span
                        style={{
                          padding: '1px 7px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#fffbeb',
                          color: '#b45309',
                          border: '1px solid #fef3c7',
                        }}
                      >
                        ขยายเวลา {extensions.length} ครั้ง
                      </span>
                    )}
                  </div>

                  {/* Urgency / Remaining Days Badge */}
                  <div>
                    {tl.status === 'completed' ? (
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                        ปิดโครงการสมบูรณ์
                      </span>
                    ) : tl.is_overdue ? (
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                        }}
                      >
                        เกินสัญญา {Math.abs(tl.days_remaining)} วัน
                      </span>
                    ) : tl.days_remaining <= 90 ? (
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          backgroundColor: '#fff7ed',
                          color: '#ea580c',
                          border: '1px solid #fed7aa',
                        }}
                      >
                        เหลือ {tl.days_remaining} วัน
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>
                        เหลือ {tl.days_remaining} วัน
                      </span>
                    )}
                  </div>
                </div>

                {/* ชื่อโครงการ ชัดเจน อ่านสบายตา */}
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#0f172a',
                    lineHeight: 1.4,
                  }}
                >
                  {item.name}
                </div>

                {/* ข้อมูลสรุปสำคัญ (หัวหน้า, ภาควิชา, แหล่งทุน/ผู้ว่าจ้าง, งบประมาณ, สัญญา) */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '6px 20px',
                    fontSize: '12px',
                    color: '#475569',
                    paddingTop: '2px',
                  }}
                >
                  {/* หัวหน้าโครงการ + ภาควิชา */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#64748b' }}>หัวหน้า:</span>
                    <strong style={{ fontWeight: 600, color: '#1e293b' }}>
                      {item.head || item.person || '-'}
                    </strong>
                    {item.department && <DepartmentBadge value={item.department} />}
                  </div>

                  {/* แหล่งทุน / ผู้ว่าจ้าง */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#64748b' }}>{isResearch ? 'แหล่งทุน:' : 'ผู้ว่าจ้าง:'}</span>
                    <span style={{ color: '#334155' }}>{item.fund_source || item.client || '-'}</span>
                  </div>

                  {/* งบประมาณ */}
                  {budgetVal > 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ color: '#64748b' }}>งบประมาณ:</span>
                      <strong style={{ color: '#059669', fontFamily: 'monospace' }}>
                        {budgetVal.toLocaleString('th-TH')} บาท
                      </strong>
                    </div>
                  )}

                  {/* กรอบเวลาสัญญา */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#64748b' }}>กรอบสัญญา:</span>
                    <span style={{ color: '#1e293b', fontFamily: 'monospace' }}>
                      {formatDateBE(tl.start_date)} – {formatDateBE(tl.current_end_date || tl.end_date)}
                    </span>
                  </div>
                </div>

                {/* หลอดความก้าวหน้าตามเวลาสัญญา (Minimalist Progress Bar) */}
                <div style={{ marginTop: '2px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '11px',
                      color: '#64748b',
                      marginBottom: '3px',
                    }}
                  >
                    <span>ความก้าวหน้าตามเวลา {tl.progress_percent}%</span>
                    <span>
                      {tl.status === 'completed'
                        ? 'ครบสัญญา'
                        : tl.is_overdue
                        ? 'เกินกำหนด'
                        : `${tl.days_remaining} วันคงเหลือ`}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      borderRadius: '999px',
                      backgroundColor: '#e2e8f0',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(tl.progress_percent, 100)}%`,
                        height: '100%',
                        backgroundColor: statusInfo.color,
                        borderRadius: '999px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* ประวัติการขอขยายเวลา (แสดงแบบกระชับ ถ้ามี) */}
                {extensions.length > 0 && (
                  <div
                    style={{
                      marginTop: '4px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fef3c7',
                      fontSize: '11.5px',
                      color: '#92400e',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px 12px',
                    }}
                  >
                    {extensions.map((ext: any, extIdx: number) => (
                      <span key={ext.id || extIdx}>
                        ครั้งที่ {ext.round || ext.extension_number || extIdx + 1}: ขยาย {ext.duration_months} เดือน (ถึง {ext.extended_end_date})
                        {ext.reason_detail ? ` — ${ext.reason_detail}` : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Record Detail Drawer (Read-Only) */}
      <RecordDetailDrawer
        isOpen={Boolean(selectedDetailTarget)}
        onClose={() => setSelectedDetailTarget(null)}
        categoryKey={selectedDetailTarget?.category || 'research'}
        record={selectedDetailTarget?.item || null}
        readOnly={true}
      />
    </div>
  );
}
