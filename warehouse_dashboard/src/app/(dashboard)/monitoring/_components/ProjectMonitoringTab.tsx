'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { calculateProjectTimeline, STATUS_LABELS } from '@/lib/projectMonitoringEngine';
import { ProjectExtensionRecord, ProjectStatus, ProjectTimelineInfo } from '@/types/projectMonitoring';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import { DEPARTMENTS, getDepartmentAbbr } from '@/config/dataManagementConfig';
import { DepartmentBadge, DepartmentSelect, RecordDetailDrawer, formatDateBE } from '@/components/ui';
import { getDepartment } from '@/lib/departments';
import { isTestRecord } from '@/lib/sdgEngine';
import { TimeFilterBar, useTimeFilter } from '@/features/time-filter';
import {
  FaClock,
  FaFlask,
  FaGraduationCap,
  FaThLarge,
  FaSearch,
  FaFilter,
  FaPlus,
  FaHistory,
  FaCheck,
  FaArrowRight,
  FaUserTie,
  FaBuilding,
  FaDatabase,
  FaHandshake,
  FaCoins,
  FaCheckCircle,
  FaExclamationCircle,
  FaRedo,
} from 'react-icons/fa';

export type MonitoringProjectType = 'research' | 'academic' | 'all';

interface ProjectMonitoringTabProps {
  goBack?: () => void;
  onNavigateToManage?: () => void;
}

export default function ProjectMonitoringTab({
  goBack,
  onNavigateToManage,
}: ProjectMonitoringTabProps) {
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

  // 4. Compute Timelines for Research Projects (กรองข้อมูลทดสอบออกในหน่วยความจำ)
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

  // 5. Compute Timelines for Academic Development Projects (กรองข้อมูลทดสอบออกในหน่วยความจำ)
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
        const id = String(p.id || '').toLowerCase();
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
      {/* Time Filter Bar */}
      <TimeFilterBar totalCount={filteredList.length} />

      {/* ========================================================================= */}
      {/* แท็บสลับแยกระหว่าง: โครงการวิจัย vs โครงการพัฒนาวิชาการ vs ทั้งหมด */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ffffff',
          padding: '8px 12px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          overflowX: 'auto',
        }}
      >
        {/* แท็บ 1: โครงการวิจัย */}
        <button
          onClick={() => {
            setActiveProjectType('research');
            setStatusFilter('all');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: activeProjectType === 'research' ? 700 : 500,
            cursor: 'pointer',
            border: activeProjectType === 'research' ? '1px solid #00A651' : '1px solid transparent',
            backgroundColor: activeProjectType === 'research' ? '#00A651' : '#ffffff',
            color: activeProjectType === 'research' ? '#ffffff' : '#475569',
            boxShadow:
              activeProjectType === 'research'
                ? '0 2px 6px rgba(0, 166, 81, 0.25)'
                : 'none',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <FaFlask style={{ fontSize: '14px' }} />
          <span>โครงการวิจัย</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11.5px',
              fontWeight: 700,
              backgroundColor: activeProjectType === 'research' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
              color: activeProjectType === 'research' ? '#ffffff' : '#64748b',
            }}
          >
            {processedResearch.length} โครงการ
          </span>
        </button>

        {/* แท็บ 2: โครงการพัฒนาวิชาการ */}
        <button
          onClick={() => {
            setActiveProjectType('academic');
            setStatusFilter('all');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: activeProjectType === 'academic' ? 700 : 500,
            cursor: 'pointer',
            border: activeProjectType === 'academic' ? '1px solid #00A651' : '1px solid transparent',
            backgroundColor: activeProjectType === 'academic' ? '#00A651' : '#ffffff',
            color: activeProjectType === 'academic' ? '#ffffff' : '#475569',
            boxShadow:
              activeProjectType === 'academic'
                ? '0 2px 6px rgba(0, 166, 81, 0.25)'
                : 'none',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <FaGraduationCap style={{ fontSize: '15px' }} />
          <span>โครงการพัฒนาวิชาการ</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11.5px',
              fontWeight: 700,
              backgroundColor: activeProjectType === 'academic' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
              color: activeProjectType === 'academic' ? '#ffffff' : '#64748b',
            }}
          >
            {processedAcademic.length} โครงการ
          </span>
        </button>

        {/* แท็บ 3: ทั้งหมด */}
        <button
          onClick={() => {
            setActiveProjectType('all');
            setStatusFilter('all');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: activeProjectType === 'all' ? 700 : 500,
            cursor: 'pointer',
            border: activeProjectType === 'all' ? '1px solid #00A651' : '1px solid transparent',
            backgroundColor: activeProjectType === 'all' ? '#00A651' : '#ffffff',
            color: activeProjectType === 'all' ? '#ffffff' : '#475569',
            boxShadow:
              activeProjectType === 'all'
                ? '0 2px 6px rgba(0, 166, 81, 0.25)'
                : 'none',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <FaThLarge style={{ fontSize: '13px' }} />
          <span>ภาพรวมโครงการทั้งหมด</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11.5px',
              fontWeight: 700,
              backgroundColor: activeProjectType === 'all' ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
              color: activeProjectType === 'all' ? '#ffffff' : '#64748b',
            }}
          >
            {processedResearch.length + processedAcademic.length} โครงการ
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* การ์ดสถิติสถานะโครงการ 6 การ์ด (คลิกเพื่อกรองสถานะได้) */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
        }}
      >
        {/* ทั้งหมด */}
        <div
          onClick={() => setStatusFilter('all')}
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: statusFilter === 'all' ? '#f0fbf5' : '#ffffff',
            border: statusFilter === 'all' ? '2px solid #00A651' : '1.5px solid #00A65155',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#334155', fontWeight: 600 }}>
            {activeProjectType === 'research'
              ? 'โครงการวิจัยทั้งหมด'
              : activeProjectType === 'academic'
              ? 'โครงการพัฒนาวิชาการทั้งหมด'
              : 'โครงการทั้งหมด'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {stats.total} <span style={{ fontSize: '13px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        {/* กำลังดำเนินการ (ตามกำหนด) */}
        <div
          onClick={() => setStatusFilter('active')}
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: statusFilter === 'active' ? '#ecfdf5' : '#ffffff',
            border: statusFilter === 'active' ? '2px solid #059669' : '1.5px solid #05966955',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>
            ตามกำหนดสัญญา
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {stats.onTrack} <span style={{ fontSize: '13px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        {/* ใกล้ครบกำหนด (≤ 90 วัน) */}
        <div
          onClick={() => setStatusFilter('expiring_soon')}
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: statusFilter === 'expiring_soon' ? '#fff7ed' : '#ffffff',
            border: statusFilter === 'expiring_soon' ? '2px solid #ea580c' : '1.5px solid #ea580c55',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#ea580c', fontWeight: 600 }}>
            ใกล้ครบกำหนดสัญญา (&le; 90 วัน)
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#ea580c', marginTop: '4px' }}>
            {stats.expiringSoon} <span style={{ fontSize: '13px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        {/* ยื่นขอขยายเวลา */}
        <div
          onClick={() => setStatusFilter('extension_requested')}
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: statusFilter === 'extension_requested' ? '#fffbeb' : '#ffffff',
            border: statusFilter === 'extension_requested' ? '2px solid #d97706' : '1.5px solid #d9770655',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#d97706', fontWeight: 600 }}>
            ยื่นขอขยายเวลา
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {stats.extensionReq} <span style={{ fontSize: '13px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        {/* อยู่ระหว่างขยายเวลา */}
        <div
          onClick={() => setStatusFilter('extended')}
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: statusFilter === 'extended' ? '#fffbeb' : '#ffffff',
            border: statusFilter === 'extended' ? '2px solid #b45309' : '1.5px solid #b4530955',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#b45309', fontWeight: 600 }}>
            อนุมัติขยายเวลาแล้ว
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
            {stats.extended} <span style={{ fontSize: '13px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        {/* ล่าช้ากว่ากำหนด */}
        <div
          onClick={() => setStatusFilter('delayed')}
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: statusFilter === 'delayed' ? '#fef2f2' : '#ffffff',
            border: statusFilter === 'delayed' ? '2px solid #dc2626' : '1.5px solid #dc262655',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#dc2626', fontWeight: 600 }}>
            ล่าช้ากว่ากำหนดสัญญา
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
            {stats.delayed} <span style={{ fontSize: '13px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        {/* ปิดโครงการแล้ว / ส่งมอบงานแล้ว */}
        <div
          onClick={() => setStatusFilter('completed')}
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            backgroundColor: statusFilter === 'completed' ? '#f8fafc' : '#ffffff',
            border: statusFilter === 'completed' ? '2px solid #475569' : '1.5px solid #94a3b855',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#475569' }} />
            <span>ปิดโครงการแล้ว</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#475569', marginTop: '4px' }}>
            {stats.completed} <span style={{ fontSize: '13px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* แถบค้นหาและตัวกรองภาควิชา */}
      {/* ========================================================================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#ffffff',
          padding: '14px 20px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <FaSearch
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
          <input
            type="text"
            placeholder={
              activeProjectType === 'research'
                ? 'ค้นหาชื่อโครงการวิจัย, หัวหน้าโครงการ, รหัสโครงการ, แหล่งทุน...'
                : activeProjectType === 'academic'
                ? 'ค้นหาชื่อโครงการพัฒนาวิชาการ, หัวหน้าโครงการ, ผู้ว่าจ้าง/ผู้ขอรับบริการ...'
                : 'ค้นหาโครงการวิจัยหรือโครงการพัฒนาวิชาการ...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13.5px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaBuilding style={{ color: '#64748b', fontSize: '13px' }} />
            <DepartmentSelect
              value={deptFilter}
              onChange={setDeptFilter}
              allowAll
              allLabel="ทุกภาควิชา / ศูนย์"
              allValue="all"
              size="sm"
              className="w-[200px]"
            />
          </div>

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

      {/* ========================================================================= */}
      {/* รายการโครงการ (Project Timeline Cards) */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#475569' }}>
            ทั้งหมด <strong style={{ color: '#00A651' }}>{filteredList.length}</strong> โครงการ
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div
            style={{
              padding: '48px',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              color: '#94a3b8',
            }}
          >
            <FaClock style={{ fontSize: '32px', marginBottom: '8px' }} />
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#64748b' }}>
              ไม่พบข้อมูลโครงการตามเงื่อนไขที่เลือก
            </div>
          </div>
        ) : (
          filteredList.map((item, idx) => {
            const tl = item._timeline;
            const statusInfo = (STATUS_LABELS as Record<string, any>)[tl.status] || STATUS_LABELS.active;
            const isResearch = item._projectCategory === 'research';
            const cat = isResearch ? 'research' : 'academic';
            const extensions: ProjectExtensionRecord[] = Array.isArray(item.extensions) ? item.extensions : [];

            return (
              <div
                key={item._uniqueKey || idx}
                onClick={() => setSelectedDetailTarget({ item, category: cat })}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  borderLeft: `5px solid ${statusInfo.color}`,
                  padding: '18px 22px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Header Row: Category Badge, Code/ID, Status, and Overdue Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Category Label Badge */}
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        backgroundColor: isResearch ? '#eff6ff' : '#f5f3ff',
                        color: isResearch ? '#1d4ed8' : '#6d28d9',
                        border: isResearch ? '1px solid #bfdbfe' : '1px solid #ddd6fe',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      {isResearch ? <FaFlask style={{ fontSize: '11px' }} /> : <FaGraduationCap style={{ fontSize: '12px' }} />}
                      <span>{isResearch ? 'โครงการวิจัย' : 'โครงการพัฒนาวิชาการ'}</span>
                    </span>

                    {/* Research Project Code */}
                    {isResearch && item.id && (
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                          fontFamily: 'monospace',
                        }}
                      >
                        {item.id}
                      </span>
                    )}

                    {/* Status Badge */}
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.border}`,
                      }}
                    >
                      {statusInfo.labelTh}
                    </span>
                  </div>

                  {/* Remaining / Overdue Indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: tl.is_overdue ? '#dc2626' : '#059669',
                      }}
                    >
                      {tl.status === 'completed'
                        ? 'ปิดโครงการสมบูรณ์แล้ว'
                        : tl.is_overdue
                        ? `เกินกำหนดสัญญา ${Math.abs(tl.days_remaining)} วัน`
                        : `เหลือเวลา ${tl.days_remaining} วัน`}
                    </span>
                  </div>
                </div>

                {/* Project Title */}
                <div style={{ fontSize: '14.5px', fontWeight: 400, color: '#1e293b', lineHeight: '1.45' }}>
                  {item.name}
                </div>

                {/* Metadata Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px 16px',
                    fontSize: '13px',
                    color: '#475569',
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '8px',
                  }}
                >
                  {/* หัวหน้าโครงการ */}
                  <div>
                    <span style={{ color: '#64748b' }}>หัวหน้าโครงการ: </span>
                    <span style={{ color: '#1e293b', fontWeight: 400 }}>{item.head || item.person || '-'}</span>
                  </div>

                  {/* ภาควิชา */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#64748b' }}>ภาควิชา: </span>
                    <DepartmentBadge value={item.department} />
                  </div>

                  {/* ข้อมูลเฉพาะ: โครงการวิจัย vs โครงการพัฒนาวิชาการ */}
                  {isResearch ? (
                    <>
                      <div>
                        <span style={{ color: '#64748b' }}>แหล่งทุน: </span>
                        <span style={{ color: '#1e293b', fontWeight: 400 }}>{item.fund_source || '-'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>งบประมาณรวม: </span>
                        <span style={{ color: '#059669', fontFamily: 'monospace', fontWeight: 600 }}>
                          {(item.budget_total || item.budget_internal || 0).toLocaleString()} บาท
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span style={{ color: '#64748b' }}>ผู้ว่าจ้าง / ผู้ขอรับบริการ: </span>
                        <span style={{ color: '#1e293b', fontWeight: 400 }}>{item.client || '-'}</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>งบประมาณรวม: </span>
                        <span style={{ color: '#059669', fontFamily: 'monospace', fontWeight: 600 }}>
                          {(Number(item.budget) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
                        </span>
                        {Number(item.budget) > 0 && (() => {
                          const b = Number(item.budget) || 0;
                          const facP = item.percent_faculty !== undefined && item.percent_faculty !== null ? Number(item.percent_faculty) : 5;
                          const depP = item.percent_dept !== undefined && item.percent_dept !== null ? Number(item.percent_dept) : 5;
                          const kuP = item.percent_ku !== undefined && item.percent_ku !== null ? Number(item.percent_ku) : 5;
                          const totalP = facP + depP + kuP;
                          const facAmt = item.alloc_faculty !== undefined && item.alloc_faculty !== null && item.alloc_faculty !== '' ? Number(item.alloc_faculty) : (b * facP) / 100;
                          const depAmt = item.alloc_dept !== undefined && item.alloc_dept !== null && item.alloc_dept !== '' ? Number(item.alloc_dept) : (b * depP) / 100;
                          const kuAmt = item.alloc_ku !== undefined && item.alloc_ku !== null && item.alloc_ku !== '' ? Number(item.alloc_ku) : (b * kuP) / 100;
                          const totalDeduct = facAmt + depAmt + kuAmt;
                          return (
                            <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>
                              (หัก {totalP}%: {totalDeduct.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท)
                            </span>
                          );
                        })()}
                      </div>
                    </>
                  )}

                  {/* ข้อมูลผู้ร่วมโครงการ (ถ้าเป็น academic) */}
                  {!isResearch && (item.co_members_internal || item.co_members_external) ? (
                    <div>
                      <span style={{ color: '#64748b' }}>ผู้ร่วมโครงการ: </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#0369a1' }}>
                        ใน {item.co_members_internal || 0} คน
                      </span>{' '}
                      |{' '}
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#b45309' }}>
                        นอก {item.co_members_external || 0} คน
                      </span>
                    </div>
                  ) : null}

                  {/* ลักษณะโครงการ (ถ้าเป็น academic) */}
                  {!isResearch && item.characteristics && (
                    <div>
                      <span style={{ color: '#64748b' }}>ลักษณะ: </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>
                        {Array.isArray(item.characteristics) ? item.characteristics.join(', ') : item.characteristics}
                      </span>
                    </div>
                  )}

                  {/* กรอบเวลาสัญญา */}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#64748b' }}>กรอบเวลาสัญญา: </span>
                    <strong style={{ color: '#1e293b', fontFamily: 'monospace' }}>
                      {formatDateBE(tl.start_date)} ถึง {formatDateBE(tl.current_end_date || tl.end_date)}
                    </strong>
                    {tl.is_extended && (
                      <span style={{ fontSize: '11.5px', color: '#b45309', fontWeight: 600 }}>
                        (ขยายเวลาจากเดิม {formatDateBE(tl.original_end_date)})
                      </span>
                    )}
                  </div>
                </div>

                {/* Timeline Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748b', marginBottom: '4px' }}>
                    <span>ความก้าวหน้าตามกรอบเวลาสัญญา</span>
                    <span>{tl.progress_percent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', borderRadius: '4px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${tl.progress_percent}%`,
                        height: '100%',
                        backgroundColor: statusInfo.color,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Extension History Box (ถ้ามีประวัติการขอขยายเวลา) */}
                {extensions.length > 0 && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fef3c7',
                      fontSize: '12.5px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
                      <FaHistory style={{ fontSize: '11px' }} />
                      <span>ประวัติการขอขยายเวลา ({extensions.length} ครั้ง):</span>
                    </div>
                    {extensions.map((ext: any, extIdx: number) => (
                      <div key={ext.id || extIdx} style={{ color: '#78350f', marginLeft: '16px', lineHeight: '1.4' }}>
                        • ครั้งที่ {ext.round || ext.extension_number || extIdx + 1}: ขยาย {ext.duration_months} เดือน (ถึง {ext.extended_end_date}) — เหตุผล: {ext.reason_detail}
                      </div>
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
