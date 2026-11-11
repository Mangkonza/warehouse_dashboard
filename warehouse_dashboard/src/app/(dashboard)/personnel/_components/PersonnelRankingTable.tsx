'use client';

import { getAssetUrl, getDefaultAvatar } from '@/lib/api';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePerspectiveTab } from '@/hooks/usePerspectiveTab';
import { useDashboardTabFilter } from '@/features/time-filter';
import { PersonnelWorkMetric } from '../_hooks/usePersonnelData';
import { DepartmentBadge, SearchInput, TablePagination } from '@/components/ui';
import { resolvePersonAvatar } from '@/lib/personnelService';
import { DEPARTMENTS } from '@/lib/departments';
import { AVAILABLE_YEARS } from '@/lib/fiscalYears';
import {
  FaSortAmountDown,
  FaFilter,
  FaExternalLinkAlt,
  FaFlask,
  FaGraduationCap,
  FaBook,
  FaHandsHelping,
  FaCertificate,
  FaChevronRight,
  FaChevronDown,
  FaTimes,
  FaBuilding,
  FaCalendarAlt,
} from 'react-icons/fa';

interface PersonnelRankingTableProps {
  metrics: PersonnelWorkMetric[];
}

type SortField =
  | 'total'
  | 'budget'
  | 'research'
  | 'academic'
  | 'publications'
  | 'service'
  | 'ip'
  | 'none';

const VALID_MISSION_FILTERS = ['all', 'research', 'publications', 'ip', 'academic', 'service'] as const;

export function PersonnelRankingTable({ metrics }: PersonnelRankingTableProps) {
  const router = useRouter();
  const { tabFilter, setTabFilter, resetTabFilter } = useDashboardTabFilter('personnel');

  // 1. Search Query with URL query parameter synchronization (?q= or ?search=)
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('q') || p.get('search') || '';
    }
    return '';
  });

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (val.trim()) {
          url.searchParams.set('q', val.trim());
        } else {
          url.searchParams.delete('q');
          url.searchParams.delete('search');
        }
        window.history.replaceState(window.history.state, '', url.pathname + url.search);
      } catch {
        // ignore
      }
    }
  };

  // 2. Mission Filter Tab
  const [activeMissionFilter, setActiveMissionFilter] = usePerspectiveTab<string>(
    'personnel_ranking',
    VALID_MISSION_FILTERS,
    'all',
    'mission'
  );

  // 3. Sort Field ('total' default, clicking sorted column cancels to 'none')
  const [sortField, setSortField] = useState<SortField>('total');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // 4. Filter Popover state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (tabFilter.department && tabFilter.department !== 'all') count++;
    if (tabFilter.fiscalYear && tabFilter.fiscalYear !== 'all') count++;
    if (sortField !== 'total' && sortField !== 'none') count++;
    return count;
  }, [tabFilter.department, tabFilter.fiscalYear, sortField]);

  // Reset all filters & search
  const handleResetAll = () => {
    setSearchTerm('');
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('q');
        url.searchParams.delete('search');
        window.history.replaceState(window.history.state, '', url.pathname + url.search);
      } catch {
        // ignore
      }
    }
    resetTabFilter();
    setSortField('total');
    setActiveMissionFilter('all');
    setCurrentPage(1);
  };

  // Toggle column sort: click sorted header again cancels the sort
  const toggleSortColumn = (field: SortField) => {
    if (sortField === field) {
      // ยกเลิกการจัดอันดับตามคอลัมน์นี้
      setSortField('none');
    } else {
      setSortField(field);
    }
    setCurrentPage(1);
  };

  const filteredMetrics = useMemo(() => {
    let result = metrics.filter((m) => {
      // 1. Active filter (เฉพาะผู้มีผลงาน)
      if (showActiveOnly && m.counts.total === 0) return false;

      // 2. Department filter from tabFilter
      if (tabFilter.department && tabFilter.department !== 'all') {
        const targetDept = tabFilter.department.toLowerCase().replace('ภาควิชา', '').trim();
        const mDept = (m.department || '').toLowerCase().replace('ภาควิชา', '').trim();
        if (!mDept.includes(targetDept)) {
          return false;
        }
      }

      // 3. Mission specific filter tab
      if (activeMissionFilter === 'research' && m.counts.research === 0) return false;
      if (activeMissionFilter === 'academic' && m.counts.academic === 0) return false;
      if (activeMissionFilter === 'publications' && m.counts.publications === 0) return false;
      if (activeMissionFilter === 'service' && m.counts.service === 0) return false;
      if (activeMissionFilter === 'ip' && m.counts.ip === 0) return false;

      // 4. Multi-token comprehensive search query matching
      if (searchTerm.trim()) {
        const tokens = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const personText = [
          m.name,
          m.cleanName,
          m.department,
          m.position,
          m.email,
          ...m.researchItems.map((r) => `${r.title_th || ''} ${r.title_en || ''} ${r.code || ''}`),
          ...m.pubItems.map((p) => `${p.title || ''} ${p.journal || ''} ${p.authors || ''}`),
          ...m.ipItems.map((ip) => `${ip.title || ''} ${ip.request_number || ''} ${ip.registration_number || ''}`),
          ...m.academicItems.map((a) => `${a.title || ''} ${a.name || ''}`),
          ...m.serviceItems.map((s) => `${s.title || ''} ${s.organization || ''}`),
        ]
          .join(' ')
          .toLowerCase();

        const matchesAll = tokens.every((token) => personText.includes(token));
        if (!matchesAll) return false;
      }
      return true;
    });

    // Sorting: when sortField === 'none', cancel sorting and keep natural alphabetical order
    if (sortField === 'none') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'th'));
    } else {
      result.sort((a, b) => {
        if (sortField === 'total') return b.counts.total - a.counts.total || b.budgets.total - a.budgets.total;
        if (sortField === 'budget') return b.budgets.total - a.budgets.total || b.counts.total - a.counts.total;
        if (sortField === 'research') {
          return (
            b.counts.research - a.counts.research ||
            b.budgets.research - a.budgets.research ||
            b.counts.total - a.counts.total
          );
        }
        if (sortField === 'academic') {
          return (
            b.counts.academic - a.counts.academic ||
            b.budgets.academic - a.budgets.academic ||
            b.counts.total - a.counts.total
          );
        }
        if (sortField === 'publications') {
          return (
            b.counts.publications - a.counts.publications ||
            b.pubQuartiles.q1 + b.pubQuartiles.q2 - (a.pubQuartiles.q1 + a.pubQuartiles.q2) ||
            b.counts.total - a.counts.total
          );
        }
        if (sortField === 'service') {
          return (
            b.counts.service - a.counts.service ||
            b.serviceHours - a.serviceHours ||
            b.counts.total - a.counts.total
          );
        }
        if (sortField === 'ip') {
          return b.counts.ip - a.counts.ip || b.counts.total - a.counts.total;
        }
        return 0;
      });
    }

    return result;
  }, [metrics, searchTerm, tabFilter.department, activeMissionFilter, sortField, showActiveOnly]);

  const totalPages = Math.ceil(filteredMetrics.length / pageSize) || 1;
  const paginatedMetrics = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMetrics.slice(start, start + pageSize);
  }, [filteredMetrics, currentPage, pageSize]);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Header Toolbar */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              ตารางจัดอันดับผลงานคณาจารย์และบุคลากร
            </h3>
            
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
              }}
            >
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => {
                  setShowActiveOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                style={{ accentColor: '#0f766e', cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <span>เฉพาะผู้มีผลงาน ({metrics.filter((m) => m.counts.total > 0).length} คน)</span>
            </label>
          </div>
        </div>

        {/* Filters Row: Compact Search + Filter Popover (Department, Time, Sort criterion collapsed inside) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Left: Compact SearchInput + Filter Button + Active Reset Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* ปรับช่องค้นหาให้สั้นลง (กว้าง 240px) และรองรับ query ได้จริง */}
            <div style={{ width: '240px' }}>
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="ค้นหาชื่อ, สังกัด, ผลงาน..."
                width="100%"
              />
            </div>

            {/* ปุ่มตัวกรอง (Filter Popover) */}
            <div style={{ position: 'relative' }} ref={filterPopoverRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: activeFilterCount > 0 ? '1px solid #00A651' : '1px solid #cbd5e1',
                  backgroundColor: activeFilterCount > 0 ? '#f0fdf4' : '#ffffff',
                  color: activeFilterCount > 0 ? '#00A651' : '#334155',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  whiteSpace: 'nowrap',
                }}
              >
                <FaFilter style={{ fontSize: '11px', color: activeFilterCount > 0 ? '#00A651' : '#64748b' }} />
                <span>ตัวกรอง</span>
                {activeFilterCount > 0 && (
                  <span
                    style={{
                      backgroundColor: '#00A651',
                      color: '#ffffff',
                      borderRadius: '999px',
                      padding: '0 6px',
                      fontSize: '11px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
                <FaChevronDown style={{ fontSize: '9px', color: activeFilterCount > 0 ? '#00A651' : '#94a3b8', marginLeft: '2px' }} />
              </button>

              {/* Popover Dropdown Panel */}
              {isFilterOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    zIndex: 50,
                    width: '320px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '10px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                      <span style={{ width: '4px', height: '14px', backgroundColor: '#00A651', borderRadius: '2px' }} />
                      <span>ตัวกรองข้อมูลจัดอันดับ</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '2px 6px',
                        fontSize: '15px',
                        lineHeight: 1,
                      }}
                    >
                      &times;
                    </button>
                  </div>

                  {/* 1. สังกัด */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      <FaBuilding style={{ fontSize: '11px', color: '#00A651' }} />
                      <span>สังกัด / ภาควิชา</span>
                    </label>
                    <select
                      value={tabFilter.department || 'all'}
                      onChange={(e) => {
                        setTabFilter({ department: e.target.value });
                        setCurrentPage(1);
                      }}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        backgroundColor: '#f8fafc',
                        color: '#1e293b',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="all">ทุกสังกัด</option>
                      {DEPARTMENTS.filter((d) => d.code !== 'OTH').map((d) => (
                        <option key={d.code} value={d.name}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. ช่วงเวลา (ปีงบประมาณ) */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      <FaCalendarAlt style={{ fontSize: '11px', color: '#00A651' }} />
                      <span>ช่วงเวลา (ปีงบประมาณ)</span>
                    </label>
                    <select
                      value={tabFilter.fiscalYear || 'all'}
                      onChange={(e) => {
                        setTabFilter({ fiscalYear: e.target.value });
                        setCurrentPage(1);
                      }}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        backgroundColor: '#f8fafc',
                        color: '#1e293b',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="all">ทุกช่วงเวลา (สะสมทั้งหมด)</option>
                      {AVAILABLE_YEARS.map((y) => (
                        <option key={y} value={y}>
                          ปีงบประมาณ {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. ยุบปุ่มเรียงตาม (เกณฑ์จัดอันดับ) เข้ามาไว้ในตัวกรองนี้ */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      <FaSortAmountDown style={{ fontSize: '11px', color: '#00A651' }} />
                      <span>เกณฑ์จัดอันดับ (เรียงตาม)</span>
                    </label>
                    <select
                      value={sortField}
                      onChange={(e) => {
                        setSortField(e.target.value as SortField);
                        setCurrentPage(1);
                      }}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12.5px',
                        backgroundColor: '#f8fafc',
                        color: '#1e293b',
                        outline: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      <option value="total">ผลงานรวม 5 ด้าน</option>
                      <option value="budget">งบประมาณโครงการรวม</option>
                      <option value="research">โครงการวิจัย</option>
                      <option value="publications">ผลงานตีพิมพ์</option>
                      <option value="ip">ทรัพย์สินทางปัญญา</option>
                      <option value="academic">โครงการพัฒนาวิชาการ</option>
                      <option value="service">งานบริการวิชาการ</option>
                      <option value="none">ตามลำดับรายชื่อปกติ (ไม่จัดอันดับ)</option>
                    </select>
                  </div>

                  {/* Footer actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      type="button"
                      onClick={() => {
                        resetTabFilter();
                        setSortField('total');
                        setCurrentPage(1);
                      }}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#64748b',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      ล้างค่าในตัวกรอง
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#00A651',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      เสร็จสิ้น
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ปุ่มล้างตัวกรองด่วนเมื่อมีการกรองหรือค้นหา */}
            {(activeFilterCount > 0 || searchTerm.trim() !== '' || activeMissionFilter !== 'all') && (
              <button
                type="button"
                onClick={handleResetAll}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#b91c1c',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                title="ล้างตัวกรองและการค้นหาทั้งหมด"
              >
                <FaTimes style={{ fontSize: '11px' }} />
                <span>ล้างตัวกรอง</span>
              </button>
            )}
          </div>
        </div>

        {/* Mission Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'ผลงานทั้งหมด', color: '#0f766e' },
            { id: 'research', label: 'โครงการวิจัย', icon: <FaFlask />, color: '#00A651' },
            { id: 'publications', label: 'ผลงานตีพิมพ์', icon: <FaBook />, color: '#e11d48' },
            { id: 'ip', label: 'ทรัพย์สินทางปัญญา', icon: <FaCertificate />, color: '#7c3aed' },
            { id: 'academic', label: 'พัฒนาวิชาการ', icon: <FaGraduationCap />, color: '#0284c7' },
            { id: 'service', label: 'บริการวิชาการ', icon: <FaHandsHelping />, color: '#d97706' },
          ].map((tab) => {
            const isSel = activeMissionFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMissionFilter(tab.id);
                  setSortField(tab.id === 'all' ? 'total' : (tab.id as SortField));
                  setCurrentPage(1);
                }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  border: isSel ? `1px solid ${tab.color}` : '1px solid #cbd5e1',
                  backgroundColor: isSel ? tab.color : '#ffffff',
                  color: isSel ? '#ffffff' : '#334155',
                  fontSize: '13px',
                  fontWeight: isSel ? 700 : 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSel ? `0 2px 6px ${tab.color}35` : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.icon && <span style={{ fontSize: '13px' }}>{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Table Data */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                borderBottom: '2px solid #e2e8f0',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              <th style={{ padding: '12px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
              <th style={{ padding: '12px 14px' }}>อาจารย์ / บุคลากร</th>
              <th style={{ padding: '12px 12px' }}>สังกัด</th>
              <th
                onClick={() => toggleSortColumn('research')}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'research' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'research' ? '#00A651' : undefined,
                  userSelect: 'none',
                }}
                title={sortField === 'research' ? 'คลิกอีกครั้งเพื่อยกเลิกการจัดอันดับ' : 'คลิกเพื่อจัดอันดับตามโครงการวิจัย'}
              >
                วิจัย {sortField === 'research' && '▼'}
              </th>
              <th
                onClick={() => toggleSortColumn('publications')}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'publications' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'publications' ? '#e11d48' : undefined,
                  userSelect: 'none',
                }}
                title={sortField === 'publications' ? 'คลิกอีกครั้งเพื่อยกเลิกการจัดอันดับ' : 'คลิกเพื่อจัดอันดับตามผลงานตีพิมพ์'}
              >
                ตีพิมพ์ {sortField === 'publications' && '▼'}
              </th>
              <th
                onClick={() => toggleSortColumn('ip')}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'ip' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'ip' ? '#7c3aed' : undefined,
                  userSelect: 'none',
                }}
                title={sortField === 'ip' ? 'คลิกอีกครั้งเพื่อยกเลิกการจัดอันดับ' : 'คลิกเพื่อจัดอันดับตามทรัพย์สินทางปัญญา'}
              >
                ทรัพย์สินฯ {sortField === 'ip' && '▼'}
              </th>
              <th
                onClick={() => toggleSortColumn('academic')}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'academic' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'academic' ? '#0284c7' : undefined,
                  userSelect: 'none',
                }}
                title={sortField === 'academic' ? 'คลิกอีกครั้งเพื่อยกเลิกการจัดอันดับ' : 'คลิกเพื่อจัดอันดับตามโครงการพัฒนาวิชาการ'}
              >
                พัฒนาวิชาการ {sortField === 'academic' && '▼'}
              </th>
              <th
                onClick={() => toggleSortColumn('service')}
                style={{
                  padding: '12px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'service' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'service' ? '#d97706' : undefined,
                  userSelect: 'none',
                }}
                title={sortField === 'service' ? 'คลิกอีกครั้งเพื่อยกเลิกการจัดอันดับ' : 'คลิกเพื่อจัดอันดับตามงานบริการวิชาการ'}
              >
                บริการวิชาการ {sortField === 'service' && '▼'}
              </th>
              <th
                onClick={() => toggleSortColumn('total')}
                style={{
                  padding: '12px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'total' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'total' ? '#0f172a' : undefined,
                  userSelect: 'none',
                }}
                title={sortField === 'total' ? 'คลิกอีกครั้งเพื่อยกเลิกการจัดอันดับ' : 'คลิกเพื่อจัดอันดับตามผลงานรวม 5 ด้าน'}
              >
                ผลงานรวม {sortField === 'total' && '▼'}
              </th>
              <th
                onClick={() => toggleSortColumn('budget')}
                style={{
                  padding: '12px 14px',
                  textAlign: 'right',
                  cursor: 'pointer',
                  backgroundColor: sortField === 'budget' ? '#e2e8f0' : 'transparent',
                  color: sortField === 'budget' ? '#047857' : undefined,
                  userSelect: 'none',
                }}
                title={sortField === 'budget' ? 'คลิกอีกครั้งเพื่อยกเลิกการจัดอันดับ' : 'คลิกเพื่อจัดอันดับตามงบประมาณรวม'}
              >
                งบประมาณรวม {sortField === 'budget' && '▼'}
              </th>
              <th style={{ padding: '12px 14px', textAlign: 'center', width: '110px' }}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMetrics.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '14px',
                  }}
                >
                  ไม่พบข้อมูลอาจารย์หรือบุคลากรตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              paginatedMetrics.map((item, idx) => {
                const rank = (currentPage - 1) * pageSize + idx + 1;
                const budgetM = (item.budgets.total / 1000000).toFixed(2);
                const hasWorks = item.counts.total > 0;

                return (
                  <tr
                    key={item.id}
                    onClick={() => router.push(`/personnel/${item.id}`)}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: rank <= 3 ? '#faf5ff15' : idx % 2 === 0 ? '#ffffff' : '#fafafa',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0fdf4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        rank <= 3 ? '#faf5ff15' : idx % 2 === 0 ? '#ffffff' : '#fafafa';
                    }}
                  >
                    {/* Rank */}
                    <td style={{ textAlign: 'center', padding: '12px 10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor:
                            rank === 1
                              ? '#fef08a'
                              : rank === 2
                              ? '#e2e8f0'
                              : rank === 3
                              ? '#fed7aa'
                              : 'transparent',
                          color:
                            rank === 1
                              ? '#854d0e'
                              : rank === 2
                              ? '#334155'
                              : rank === 3
                              ? '#9a3412'
                              : '#64748b',
                          border: rank <= 3 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                        }}
                      >
                        {rank}
                      </span>
                    </td>

                    {/* Personnel Info */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={resolvePersonAvatar(item.id, item.name, item.imageUrl)}
                          alt={item.name}
                          onError={(e) => {
                            const target = e.currentTarget;
                            const fallback = getDefaultAvatar();
                            if (target.src !== fallback && !target.src.endsWith('/default-avatar.png')) {
                              target.src = fallback;
                            }
                          }}
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            objectPosition: 'top center',
                            border: '1.5px solid #e2e8f0',
                            flexShrink: 0,
                            backgroundColor: '#99b8db',
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                            {item.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            {item.position && (
                              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                                {item.position}
                              </span>
                            )}
                            {item.email && (
                              <span style={{ fontSize: '11.5px', color: '#0284c7' }}>
                                {item.email}
                              </span>
                            )}
                          </div>

                          {/* Visual 5-mission distribution bar */}
                          {hasWorks && (
                            <div
                              style={{
                                display: 'flex',
                                height: '5px',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                backgroundColor: '#e2e8f0',
                                marginTop: '6px',
                                maxWidth: '180px',
                              }}
                              title={`สัดส่วน: วิจัย ${item.counts.research}, ตีพิมพ์ ${item.counts.publications}, ทรัพย์สินฯ ${item.counts.ip}, พัฒนาวิชาการ ${item.counts.academic}, บริการ ${item.counts.service}`}
                            >
                              {item.counts.research > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.research / item.counts.total) * 100}%`,
                                    backgroundColor: '#00A651',
                                  }}
                                />
                              )}
                              {item.counts.publications > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.publications / item.counts.total) * 100}%`,
                                    backgroundColor: '#e11d48',
                                  }}
                                />
                              )}
                              {item.counts.ip > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.ip / item.counts.total) * 100}%`,
                                    backgroundColor: '#7c3aed',
                                  }}
                                />
                              )}
                              {item.counts.academic > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.academic / item.counts.total) * 100}%`,
                                    backgroundColor: '#0284c7',
                                  }}
                                />
                              )}
                              {item.counts.service > 0 && (
                                <div
                                  style={{
                                    width: `${(item.counts.service / item.counts.total) * 100}%`,
                                    backgroundColor: '#d97706',
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{ padding: '12px 12px' }}>
                      <DepartmentBadge value={item.department} />
                    </td>

                    {/* Research Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'research' ? '#f0fdf4' : undefined,
                      }}
                    >
                      {item.counts.research > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#00A651',
                            backgroundColor: '#ecfdf5',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                          }}
                        >
                          {item.counts.research}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Publications Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'publications' ? '#fff1f2' : undefined,
                      }}
                    >
                      {item.counts.publications > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#e11d48',
                            backgroundColor: '#fff1f2',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                          }}
                          title={`Q1/Q2: ${item.pubQuartiles.q1 + item.pubQuartiles.q2} เรื่อง`}
                        >
                          {item.counts.publications}
                          {item.pubQuartiles.q1 > 0 && (
                            <span style={{ fontSize: '10px', color: '#be123c', marginLeft: '3px' }}>
                              (Q1)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* IP Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'ip' ? '#f5f3ff' : undefined,
                      }}
                    >
                      {item.counts.ip > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#7c3aed',
                            backgroundColor: '#f5f3ff',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                          }}
                        >
                          {item.counts.ip}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Academic Development Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'academic' ? '#f0f9ff' : undefined,
                      }}
                    >
                      {item.counts.academic > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#0284c7',
                            backgroundColor: '#f0f9ff',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                          }}
                        >
                          {item.counts.academic}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Service Count */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 10px',
                        backgroundColor: sortField === 'service' ? '#fffbeb' : undefined,
                      }}
                    >
                      {item.counts.service > 0 ? (
                        <span
                          style={{
                            fontWeight: 700,
                            color: '#d97706',
                            backgroundColor: '#fffbeb',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                          }}
                          title={`จำนวน ${item.serviceHours} ชั่วโมง`}
                        >
                          {item.counts.service}
                        </span>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Total Combined Works */}
                    <td
                      style={{
                        textAlign: 'center',
                        padding: '12px 12px',
                        backgroundColor: sortField === 'total' ? '#f8fafc' : undefined,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 800,
                          color: hasWorks ? '#0f172a' : '#94a3b8',
                        }}
                      >
                        {item.counts.total}
                      </span>
                    </td>

                    {/* Total Budget */}
                    <td
                      style={{
                        textAlign: 'right',
                        padding: '12px 14px',
                        backgroundColor: sortField === 'budget' ? '#f0fdf4' : undefined,
                      }}
                    >
                      {item.budgets.total > 0 ? (
                        <div>
                          <span style={{ fontWeight: 700, color: '#047857', fontSize: '13px' }}>
                            {budgetM} ลบ.
                          </span>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {item.budgets.total.toLocaleString('th-TH')} 
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>-</span>
                      )}
                    </td>

                    {/* Action: Link to individual portfolio */}
                    <td style={{ textAlign: 'center', padding: '12px 14px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/personnel/${item.id}`);
                        }}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#0f766e',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0f766e';
                          e.currentTarget.style.color = '#ffffff';
                          e.currentTarget.style.borderColor = '#0f766e';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.color = '#0f766e';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                      >
                        <span>ดูผลงาน</span>
                        <FaChevronRight style={{ fontSize: '10px' }} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Pagination Footer */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredMetrics.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[10, 15, 25, 50, 100]}
        unitLabel="ท่าน"
      />
    </div>
  );
}
