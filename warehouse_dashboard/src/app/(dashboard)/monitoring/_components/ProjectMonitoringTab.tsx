'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { calculateProjectTimeline, STATUS_LABELS } from '@/lib/projectMonitoringEngine';
import { ProjectExtensionRecord, ProjectStatus, ProjectTimelineInfo } from '@/types/projectMonitoring';
import { TopSegmentedTabs, TabItem } from '@/components/ui/TopSegmentedTabs';
import { DepartmentBadge, DepartmentSelect, RecordDetailDrawer } from '@/components/ui';
import { ProjectExtensionModal } from '@/features/monitoring/components/ProjectExtensionModal';
import {
  getCachedCategoryData,
  fetchCategoryData,
  saveCategoryRecord,
  getCachedEvaluations,
  fetchEvaluations,
} from '@/lib/dataService';
import { isEvaluated, EvaluationRecord } from '@/types/evaluation';
import { formatDateBE } from '@/components/ui/RecordDetailDrawer';
import { getDepartment } from '@/lib/departments';
import { isTestRecord } from '@/lib/sdgEngine';
import { TimeFilterBar, useTimeFilter } from '@/features/time-filter';
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import {
  FaSearch,
  FaCalendarAlt,
  FaBuilding,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaArrowRight,
  FaRedo,
  FaHistory,
  FaExternalLinkAlt,
  FaEye,
  FaPlus,
} from 'react-icons/fa';

export type MonitoringTabKey = 'research' | 'academic';

interface ProjectMonitoringTabProps {
  goBack?: () => void;
  onNavigateToManage?: () => void;
}

export default function ProjectMonitoringTab({}: ProjectMonitoringTabProps) {
  const router = useRouter();
  const { filterProjectsByTime } = useTimeFilter();

  // 1. Datasets State
  const [researchList, setResearchList] = useState<any[]>(() => {
    return getCachedCategoryData('research') || rawResearch;
  });
  const [academicList, setAcademicList] = useState<any[]>(() => {
    return getCachedCategoryData('academic') || rawAcademic;
  });

  // 2. Evaluations State
  const [evalMap, setEvalMap] = useState<Record<string, EvaluationRecord>>(() => {
    return getCachedEvaluations();
  });

  // 3. Tab State: exactly two tabs (research & academic)
  const [activeTab, setActiveTab] = useState<MonitoringTabKey>('research');

  // 4. Filters & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  // 5. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // 6. Modals & Drawer State
  const [selectedDetailTarget, setSelectedDetailTarget] = useState<{
    item: Record<string, any>;
    category: MonitoringTabKey;
  } | null>(null);
  const [extensionTarget, setExtensionTarget] = useState<Record<string, any> | null>(null);

  // 7. Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Sync data on mount
  useEffect(() => {
    let isMounted = true;

    // Load category data
    fetchCategoryData('research').then((freshRes) => {
      if (isMounted && Array.isArray(freshRes) && freshRes.length > 0) {
        setResearchList(freshRes);
      }
    });

    fetchCategoryData('academic').then((freshAca) => {
      if (isMounted && Array.isArray(freshAca) && freshAca.length > 0) {
        setAcademicList(freshAca);
      }
    });

    // Load evaluation data
    fetchEvaluations().then((evalData) => {
      if (isMounted && evalData) {
        setEvalMap(evalData);
      }
    });

    const handleDataUpdate = () => {
      const r = getCachedCategoryData('research');
      if (r && Array.isArray(r)) setResearchList(r);
      const a = getCachedCategoryData('academic');
      if (a && Array.isArray(a)) setAcademicList(a);
    };

    const handleEvalUpdate = () => {
      setEvalMap(getCachedEvaluations());
    };

    window.addEventListener('ku_data_updated', handleDataUpdate);
    window.addEventListener('ku_evaluations_updated', handleEvalUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('ku_data_updated', handleDataUpdate);
      window.removeEventListener('ku_evaluations_updated', handleEvalUpdate);
    };
  }, []);

  // Helper to check evaluation status
  const checkIsProjectEvaluated = useCallback(
    (category: MonitoringTabKey, project: any): boolean => {
      const recordId = String(project.id || project._id || project.name || '').trim();
      const key = `${category}_${recordId}`;
      return isEvaluated(category, evalMap[key]);
    },
    [evalMap]
  );

  // 8. Processed Research Projects with Live Timelines
  const processedResearch = useMemo(() => {
    const clean = researchList.filter(
      (p) => !isTestRecord(p) && p.name && p.name !== 'nan' && p.name !== 'NaT' && p.name !== 'เรื่อง'
    );
    const timeFiltered = filterProjectsByTime(clean, 'start_date');
    return timeFiltered.map((p, idx) => {
      const isEval = checkIsProjectEvaluated('research', p);
      const timeline = calculateProjectTimeline(p, undefined, isEval);
      return {
        ...p,
        _projectCategory: 'research' as const,
        _uniqueKey: `research_${p.id || p._id || idx}`,
        _timeline: timeline,
        _isEvaluated: isEval,
      };
    });
  }, [researchList, filterProjectsByTime, checkIsProjectEvaluated]);

  // 9. Processed Academic Projects with Live Timelines
  const processedAcademic = useMemo(() => {
    const clean = academicList.filter(
      (p) => !isTestRecord(p) && p.name && p.name !== 'nan' && p.name !== 'NaT' && p.name !== 'เรื่อง'
    );
    const timeFiltered = filterProjectsByTime(clean, 'start_date');
    return timeFiltered.map((p, idx) => {
      const isEval = checkIsProjectEvaluated('academic', p);
      const timeline = calculateProjectTimeline(p, undefined, isEval);
      return {
        ...p,
        _projectCategory: 'academic' as const,
        _uniqueKey: `academic_${p._id || p.name || idx}`,
        _timeline: timeline,
        _isEvaluated: isEval,
      };
    });
  }, [academicList, filterProjectsByTime, checkIsProjectEvaluated]);

  // Active dataset according to activeTab
  const currentDataset = useMemo(() => {
    return activeTab === 'research' ? processedResearch : processedAcademic;
  }, [activeTab, processedResearch, processedAcademic]);

  // 10. Summary Statistics for active tab
  const stats = useMemo(() => {
    let total = currentDataset.length;
    let onTrack = 0;
    let expiringSoon = 0;
    let extensionReq = 0;
    let extended = 0;
    let delayed = 0;
    let waitingEval = 0;
    let evaluated = 0;

    currentDataset.forEach((p) => {
      const st = p._timeline.status;
      const days = p._timeline.days_remaining;
      const isOverdue = p._timeline.is_overdue;

      if (st !== 'completed' && st !== 'waiting_eval' && st !== 'evaluated' && !isOverdue && days >= 0 && days <= 90) {
        expiringSoon++;
      }

      if (st === 'active') onTrack++;
      else if (st === 'extension_requested') extensionReq++;
      else if (st === 'extended') extended++;
      else if (st === 'delayed') delayed++;
      else if (st === 'waiting_eval') waitingEval++;
      else if (st === 'evaluated') evaluated++;
    });

    return { total, onTrack, expiringSoon, extensionReq, extended, delayed, waitingEval, evaluated };
  }, [currentDataset]);

  // 11. Filtered Projects List
  const filteredList = useMemo(() => {
    const filtered = currentDataset.filter((p) => {
      // Status Filter
      if (statusFilter === 'expiring_soon') {
        const isExpiring =
          p._timeline.status !== 'completed' &&
          p._timeline.status !== 'waiting_eval' &&
          p._timeline.status !== 'evaluated' &&
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
      if (
        st !== 'completed' &&
        st !== 'waiting_eval' &&
        st !== 'evaluated' &&
        !p._timeline.is_overdue &&
        p._timeline.days_remaining >= 0 &&
        p._timeline.days_remaining <= 90
      ) {
        return 2;
      }
      if (st === 'extension_requested') return 3;
      if (st === 'extended') return 4;
      if (st === 'waiting_eval') return 5;
      if (st === 'active') return 6;
      return 7;
    };

    return [...filtered].sort((a, b) => {
      const rankA = getUrgencyRank(a);
      const rankB = getUrgencyRank(b);
      if (rankA !== rankB) return rankA - rankB;
      return (a._timeline.days_remaining ?? 9999) - (b._timeline.days_remaining ?? 9999);
    });
  }, [currentDataset, statusFilter, deptFilter, searchTerm]);

  // Tab switch handler
  const handleTabChange = (key: string) => {
    setActiveTab(key as MonitoringTabKey);
    setCurrentPage(1);
    setStatusFilter('all');
    setDeptFilter('all');
    setSearchTerm('');
  };

  // Pagination Slice
  const totalItems = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const pageItems = useMemo(() => {
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, startIndex, itemsPerPage]);

  // Extension Save Handler
  const handleSaveExtension = async (
    updatedItem: Record<string, any>,
    newExtension: ProjectExtensionRecord
  ) => {
    const isResearch = activeTab === 'research';
    const cat = isResearch ? 'research' : 'academic';

    // Reopening if was closed
    const itemToSave: Record<string, any> = {
      ...updatedItem,
      closed_date: undefined,
      status: 'extension_requested',
    };

    const res = await saveCategoryRecord(cat, itemToSave, false);
    if (res.success) {
      if (isResearch) {
        setResearchList((prev) =>
          prev.map((p) =>
            p.id === itemToSave.id || p._id === itemToSave._id ? { ...p, ...itemToSave } : p
          )
        );
      } else {
        setAcademicList((prev) =>
          prev.map((p) =>
            p._id === itemToSave._id || p.name === itemToSave.name ? { ...p, ...itemToSave } : p
          )
        );
      }
      setExtensionTarget(null);
      showToast('บันทึกเรียบร้อย');
    } else {
      alert(res.error || 'เกิดข้อผิดพลาดในการบันทึกคำขอขยายเวลา');
    }
  };

  // Manual Close / Reopen Project
  const handleToggleCloseProject = async (item: any) => {
    const isResearch = activeTab === 'research';
    const cat = isResearch ? 'research' : 'academic';
    const isClosed = Boolean(
      item.closed_date ||
      item.is_completed ||
      item.status === 'completed' ||
      item.status === 'waiting_eval' ||
      item.status === 'evaluated'
    );

    let updatedItem: Record<string, any>;
    if (isClosed) {
      // Reopen project
      updatedItem = {
        ...item,
        closed_date: undefined,
        status: 'active',
      };
    } else {
      // Close project
      updatedItem = {
        ...item,
        closed_date: new Date().toISOString(),
        status: 'completed',
      };
    }

    const res = await saveCategoryRecord(cat, updatedItem, false);
    if (res.success) {
      if (isResearch) {
        setResearchList((prev) =>
          prev.map((p) =>
            p.id === updatedItem.id || p._id === updatedItem._id ? { ...p, ...updatedItem } : p
          )
        );
      } else {
        setAcademicList((prev) =>
          prev.map((p) =>
            p._id === updatedItem._id || p.name === updatedItem.name ? { ...p, ...updatedItem } : p
          )
        );
      }
      showToast('บันทึกเรียบร้อย');
    } else {
      alert(res.error || 'เกิดข้อผิดพลาดในการปรับปรุงสถานะโครงการ');
    }
  };

  // Tabs configuration (exactly two tabs)
  const tabsConfig: TabItem<MonitoringTabKey>[] = [
    { key: 'research', label: 'โครงการวิจัย', count: processedResearch.length },
    { key: 'academic', label: 'โครงการพัฒนาวิชาการ', count: processedAcademic.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#00A651',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 166, 81, 0.3)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 500,
            fontSize: '13px',
          }}
        >
          <FaCheckCircle style={{ fontSize: '16px' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Standard Shell */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          paddingBottom: '2px',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: '#1e293b',
              letterSpacing: '-0.3px',
            }}
          >
            ติดตามสถานะโครงการ
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            ติดตามกำหนดการ วันเริ่ม-สิ้นสุด การขอขยายเวลา และสถานะการดำเนินงานตามระเบียบ มก.
          </div>
        </div>
      </div>

      {/* Time Filter Bar */}
      <TimeFilterBar totalCount={filteredList.length} />

      {/* 2. Top Segmented Horizontal Tabs (2 Tabs Only) */}
      <TopSegmentedTabs<MonitoringTabKey>
        activeCategory={activeTab}
        onSelectCategory={handleTabChange}
        tabs={tabsConfig}
      />

      {/* 3. Status Summary Cards (Clickable to Filter) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
          gap: '10px',
        }}
      >
        {/* ทั้งหมด */}
        <div
          onClick={() => setStatusFilter('all')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: statusFilter === 'all' ? '2px solid #00A651' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ทั้งหมด</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            {stats.total}
          </div>
        </div>

        {/* ตามกำหนดสัญญา */}
        <div
          onClick={() => setStatusFilter('active')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: statusFilter === 'active' ? '2px solid #059669' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#059669' }} />
            <span>ตามกำหนดสัญญา</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
            {stats.onTrack}
          </div>
        </div>

        {/* ใกล้ครบกำหนด */}
        <div
          onClick={() => setStatusFilter('expiring_soon')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: statusFilter === 'expiring_soon' ? '2px solid #ea580c' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12px', color: '#ea580c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ea580c' }} />
            <span>ใกล้ครบกำหนด</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ea580c', marginTop: '2px' }}>
            {stats.expiringSoon}
          </div>
        </div>

        {/* ยื่นขอขยายเวลา */}
        <div
          onClick={() => setStatusFilter('extension_requested')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: statusFilter === 'extension_requested' ? '2px solid #d97706' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12px', color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#d97706' }} />
            <span>ยื่นขอขยายเวลา</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
            {stats.extensionReq}
          </div>
        </div>

        {/* อยู่ระหว่างขยายเวลา */}
        <div
          onClick={() => setStatusFilter('extended')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: statusFilter === 'extended' ? '2px solid #b45309' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12px', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#b45309' }} />
            <span>อยู่ระหว่างขยายเวลา</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#b45309', marginTop: '2px' }}>
            {stats.extended}
          </div>
        </div>

        {/* เกินกำหนดสัญญา */}
        <div
          onClick={() => setStatusFilter('delayed')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: statusFilter === 'delayed' ? '2px solid #dc2626' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#dc2626' }} />
            <span>เกินกำหนดสัญญา</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
            {stats.delayed}
          </div>
        </div>

        {/* รอประเมิน */}
        <div
          onClick={() => setStatusFilter('waiting_eval')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: statusFilter === 'waiting_eval' ? '2px solid #d97706' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12px', color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#d97706' }} />
            <span>รอประเมิน</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
            {stats.waitingEval}
          </div>
        </div>

        {/* ประเมินแล้ว */}
        <div
          onClick={() => setStatusFilter('evaluated')}
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: statusFilter === 'evaluated' ? '2px solid #059669' : '1px solid #e2e8f0',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#059669' }} />
            <span>ประเมินแล้ว</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
            {stats.evaluated}
          </div>
        </div>
      </div>

      {/* 4. Main Card Container (Toolbar + Table + Pagination) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '7px 12px',
              width: '100%',
              maxWidth: '280px',
              minWidth: '200px',
            }}
          >
            <FaSearch style={{ color: '#94a3b8', marginRight: '8px', fontSize: '13px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงการ, รหัส, หัวหน้า..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                border: 'none',
                background: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                fontFamily: 'inherit',
                color: '#1e293b',
              }}
            />
          </div>

          {/* Filters: Department & Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaBuilding style={{ color: '#64748b', fontSize: '13px' }} />
              <DepartmentSelect
                value={deptFilter}
                onChange={(val) => {
                  setDeptFilter(val);
                  setCurrentPage(1);
                }}
                allowAll
                allLabel="ทุกภาควิชา / ศูนย์"
                allValue="all"
                size="sm"
                className="w-[190px]"
              />
            </div>

            {/* Status Filter Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '13px',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="all">สถานะ: ทั้งหมด</option>
              <option value="active">กำลังดำเนินการตามแผน</option>
              <option value="expiring_soon">ใกล้ครบกำหนด (≤ 90 วัน)</option>
              <option value="extension_requested">ยื่นขอขยายเวลา</option>
              <option value="extended">อยู่ระหว่างขยายเวลา</option>
              <option value="delayed">เกินกำหนดสัญญา</option>
              <option value="waiting_eval">รอประเมิน</option>
              <option value="evaluated">ประเมินแล้ว</option>
              <option value="proposed">รออนุมัติโครงการ</option>
              <option value="completed">ปิดโครงการแล้ว</option>
              <option value="cancelled">ยกเลิกโครงการ</option>
            </select>

            {(statusFilter !== 'all' || deptFilter !== 'all' || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setDeptFilter('all');
                  setSearchTerm('');
                  setCurrentPage(1);
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

        {/* Table */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                <th style={{ width: '55px', padding: '12px 10px', textAlign: 'center' }}>
                  ลำดับที่
                </th>

                {/* Research only: รหัสโครงการ */}
                {activeTab === 'research' && (
                  <th style={{ width: '110px', padding: '12px 10px', textAlign: 'center' }}>
                    รหัสโครงการ
                  </th>
                )}

                <th style={{ minWidth: '240px', padding: '12px 12px' }}>
                  ชื่อโครงการ
                </th>

                <th style={{ width: '160px', padding: '12px 10px' }}>
                  หัวหน้าโครงการ
                </th>

                <th style={{ width: '140px', padding: '12px 10px', textAlign: 'center' }}>
                  สถานะ
                </th>

                <th style={{ width: '140px', padding: '12px 10px', textAlign: 'center' }}>
                  วันที่สิ้นสุด
                </th>

                <th style={{ width: '140px', padding: '12px 10px', textAlign: 'center' }}>
                  การขยายเวลา
                </th>

                <th style={{ width: '160px', padding: '12px 10px', textAlign: 'center' }}>
                  จัดการ
                </th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === 'research' ? 8 : 7}
                    style={{
                      textAlign: 'center',
                      padding: '48px 16px',
                      color: '#94a3b8',
                      fontSize: '13px',
                    }}
                  >
                    ไม่พบข้อมูลโครงการตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                pageItems.map((item, rowIdx) => {
                  const tl = item._timeline;
                  const statusInfo = (STATUS_LABELS as Record<string, any>)[tl.status] || STATUS_LABELS.active;
                  const actualRowNo = startIndex + rowIdx + 1;
                  const extensions: ProjectExtensionRecord[] = Array.isArray(item.extensions) ? item.extensions : [];
                  const isClosed = Boolean(
                    item.closed_date ||
                    item.is_completed ||
                    item.status === 'completed' ||
                    item.status === 'waiting_eval' ||
                    item.status === 'evaluated'
                  );
                  const isWaitingEval = tl.status === 'waiting_eval';
                  const recordId = String(item.id || item._id || item.name || '').trim();

                  return (
                    <tr
                      key={item._uniqueKey || rowIdx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#fafbfc',
                        transition: 'background-color 0.12s',
                      }}
                    >
                      {/* ลำดับที่ */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', color: '#64748b' }}>
                        {actualRowNo}
                      </td>

                      {/* รหัสโครงการ (Research only) */}
                      {activeTab === 'research' && (
                        <td style={{ padding: '10px 10px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                          {item.id || '-'}
                        </td>
                      )}

                      {/* ชื่อโครงการ */}
                      <td style={{ padding: '10px 12px' }}>
                        <div
                          onClick={() => setSelectedDetailTarget({ item, category: activeTab })}
                          className="font-semibold text-slate-800 hover:text-[#00A651] cursor-pointer line-clamp-2"
                          title={item.name}
                        >
                          {item.name || '-'}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <DepartmentBadge value={item.department} />
                          {item.fund_source && (
                            <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.fund_source}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* หัวหน้าโครงการ */}
                      <td style={{ padding: '10px 10px', color: '#334155' }}>
                        {item.head || item.person || '-'}
                      </td>

                      {/* สถานะ */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: '999px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: statusInfo.color,
                            backgroundColor: statusInfo.bg,
                            border: `1px solid ${statusInfo.border}`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {statusInfo.labelTh}
                        </span>
                      </td>

                      {/* วันที่สิ้นสุด */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>
                          {formatDateBE(tl.end_date)}
                        </div>
                        {tl.is_overdue && (
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: '#dc2626',
                              backgroundColor: '#fee2e2',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              marginTop: '2px',
                            }}
                          >
                            เกินกำหนด {Math.abs(tl.days_remaining)} วัน
                          </span>
                        )}
                        {!tl.is_overdue && !isClosed && tl.days_remaining <= 90 && tl.days_remaining >= 0 && (
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: '#d97706',
                              backgroundColor: '#fef3c7',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              marginTop: '2px',
                            }}
                          >
                            เหลือ {tl.days_remaining} วัน
                          </span>
                        )}
                      </td>

                      {/* การขยายเวลา */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <div className="flex flex-col items-center gap-1">
                          {extensions.length > 0 ? (
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              ขอขยาย {extensions.length} ครั้ง
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </div>
                      </td>

                      {/* รายละเอียด */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Direct action if รอประเมิน */}
                          {isWaitingEval && (
                            <button
                              type="button"
                              onClick={() => {
                                router.push(
                                  `/evaluation?category=${activeTab}&id=${encodeURIComponent(recordId)}`
                                );
                              }}
                              title="ไปที่หน้าการประเมินโครงการนี้"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#00A651] text-white hover:bg-[#008f45] transition-colors cursor-pointer shadow-xs"
                            >
                              <span>การประเมิน</span>
                              <FaArrowRight className="text-[10px]" />
                            </button>
                          )}

                          {/* Details Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedDetailTarget({ item, category: activeTab })}
                            title="ดูรายละเอียดโครงการ"
                            className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer gap-1"
                          >
                            <FaEye className="text-[11px]" />
                            <span>ดูข้อมูล</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Footer */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          <div>
            แสดง{' '}
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              {totalItems === 0 ? 0 : startIndex + 1}
            </span>{' '}
            -{' '}
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{' '}
            จากทั้งหมด{' '}
            <span style={{ fontWeight: 600, color: '#1e293b' }}>
              {totalItems.toLocaleString()}
            </span>{' '}
            รายการ
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>รายการต่อหน้า:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  cursor: 'pointer',
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                title="ก่อนหน้า"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: currentPage <= 1 ? '#cbd5e1' : '#475569',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <FaChevronLeft style={{ fontSize: '11px' }} />
              </button>

              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', padding: '0 4px' }}>
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                title="ถัดไป"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: currentPage >= totalPages ? '#cbd5e1' : '#475569',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                <FaChevronRight style={{ fontSize: '11px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Record Detail Drawer (Read-Only) */}
      {selectedDetailTarget && (
        <RecordDetailDrawer
          isOpen={true}
          onClose={() => setSelectedDetailTarget(null)}
          item={selectedDetailTarget.item}
          categoryKey={selectedDetailTarget.category}
          readOnly={true}
        />
      )}

      {/* Project Extension Modal */}
      {extensionTarget && (
        <ProjectExtensionModal
          isOpen={true}
          onClose={() => setExtensionTarget(null)}
          projectItem={extensionTarget}
          onSaveExtension={handleSaveExtension}
        />
      )}
    </div>
  );
}
