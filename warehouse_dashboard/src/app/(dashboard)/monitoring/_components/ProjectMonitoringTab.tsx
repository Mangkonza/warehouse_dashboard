'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { calculateProjectTimeline, STATUS_LABELS } from '@/lib/projectMonitoringEngine';
import { ProjectExtensionRecord, ProjectStatus, ProjectTimelineInfo } from '@/types/projectMonitoring';
import { TopSegmentedTabs, TabItem } from '@/components/ui/TopSegmentedTabs';
import { DepartmentBadge, RecordDetailDrawer, ConfirmActionModal } from '@/components/ui';
import { FilterPopover, FilterState } from '@/components/ui/FilterPopover';
import {
  itemMatchesDepartmentMulti,
  itemMatchesDateRange,
  itemMatchesEvaluation,
  itemMatchesNumericRanges,
} from '@/lib/filterMatching';
import { ProjectExtensionModal } from '@/features/monitoring/components/ProjectExtensionModal';
import { ChangeStatusModal, ProjectStatusActionType } from '@/features/monitoring/components/ChangeStatusModal';
import {
  getCachedCategoryData,
  fetchCategoryData,
  saveCategoryRecord,
  getCachedEvaluations,
  fetchEvaluations,
} from '@/lib/dataService';
import { isEvaluated, EvaluationRecord } from '@/types/evaluation';
import { formatDateBE } from '@/components/ui/RecordDetailDrawer';
import { isTestRecord } from '@/lib/sdgEngine';
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaExchangeAlt,
} from 'react-icons/fa';

export type MonitoringTabKey = 'research' | 'academic';

interface ProjectMonitoringTabProps {
  goBack?: () => void;
  onNavigateToManage?: () => void;
}

// Icons for Status Cards (SVG path identical to status-cards.html)
const STATUS_ICONS: Record<string, React.ReactNode> = {
  all: (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  ),
  overdue: (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  near: (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l9 16H3z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  ),
  ontrack: (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l4 4 10-10" />
    </svg>
  ),
  request: (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h12M13 6l6 6-6 6" />
    </svg>
  ),
  extend: (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
    </svg>
  ),
  closed: (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  cancel: (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  ),
};

export default function ProjectMonitoringTab({}: ProjectMonitoringTabProps) {
  const router = useRouter();

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
  const [filters, setFilters] = useState<FilterState>({
    departments: [],
    deptCustomText: '',
    dateFrom: '',
    dateTo: '',
    numericRanges: {},
    sdgs: [],
    framework: 'all',
  });

  // 5. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // 6. Modals & Drawer State
  const [selectedDetailTarget, setSelectedDetailTarget] = useState<{
    item: Record<string, any>;
    category: MonitoringTabKey;
  } | null>(null);
  const [extensionTarget, setExtensionTarget] = useState<Record<string, any> | null>(null);
  const [statusModalTarget, setStatusModalTarget] = useState<Record<string, any> | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    detail?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'success' | 'info';
    onConfirm: () => void;
  } | null>(null);

  // 7. Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Fetch fresh data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [resResearch, resAcademic, resEval] = await Promise.all([
          fetchCategoryData('research'),
          fetchCategoryData('academic'),
          fetchEvaluations(),
        ]);
        if (Array.isArray(resResearch) && resResearch.length > 0) {
          setResearchList(resResearch);
        }
        if (Array.isArray(resAcademic) && resAcademic.length > 0) {
          setAcademicList(resAcademic);
        }
        if (resEval && typeof resEval === 'object') {
          setEvalMap(resEval);
        }
      } catch (e) {
        console.error('Error fetching monitoring data:', e);
      }
    }
    loadData();
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
    return clean.map((p, idx) => {
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
  }, [researchList, checkIsProjectEvaluated]);

  // 9. Processed Academic Projects with Live Timelines
  const processedAcademic = useMemo(() => {
    const clean = academicList.filter(
      (p) => !isTestRecord(p) && p.name && p.name !== 'nan' && p.name !== 'NaT' && p.name !== 'เรื่อง'
    );
    return clean.map((p, idx) => {
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
  }, [academicList, checkIsProjectEvaluated]);

  // Active dataset according to activeTab
  const currentDataset = useMemo(() => {
    return activeTab === 'research' ? processedResearch : processedAcademic;
  }, [activeTab, processedResearch, processedAcademic]);

  // 10. Summary Statistics for active tab (เฉพาะ 8 สถานะตาม status-cards.html)
  const stats = useMemo(() => {
    let total = currentDataset.length;
    let onTrack = 0;
    let expiringSoon = 0;
    let extensionReq = 0;
    let extended = 0;
    let delayed = 0;
    let completed = 0;
    let cancelled = 0;

    currentDataset.forEach((p) => {
      const st = p._timeline.status;
      const days = p._timeline.days_remaining;
      const isOverdue = p._timeline.is_overdue;

      // สถานะใกล้ครบกำหนด: เหลือน้อยกว่าหรือเท่ากับ 30 วันก่อนวันที่สิ้นสุด
      if (
        st !== 'completed' &&
        st !== 'cancelled' &&
        st !== 'waiting_eval' &&
        st !== 'evaluated' &&
        !isOverdue &&
        days >= 0 &&
        days <= 30
      ) {
        expiringSoon++;
      }

      if (st === 'active') onTrack++;
      else if (st === 'extension_requested') extensionReq++;
      else if (st === 'extended') extended++;
      else if (st === 'delayed') delayed++;
      else if (st === 'completed') completed++;
      else if (st === 'cancelled') cancelled++;
    });

    return {
      total,
      onTrack,
      expiringSoon,
      extensionReq,
      extended,
      delayed,
      completed,
      cancelled,
    };
  }, [currentDataset]);

  // Group definitions exactly following status-cards.html
  const statusGroups = [
    {
      name: 'ต้องเร่งจัดการ',
      n: 2,
      items: [
        { key: 'overdue', filterKey: 'delayed', label: 'เกินกำหนดสัญญา', tone: 't-overdue', count: stats.delayed },
        { key: 'near', filterKey: 'expiring_soon', label: 'ใกล้ครบกำหนด', tone: 't-near', count: stats.expiringSoon },
      ],
    },
    {
      name: 'กำลังดำเนินการ',
      n: 3,
      items: [
        { key: 'ontrack', filterKey: 'active', label: 'ตามกำหนดสัญญา', tone: 't-ontrack', count: stats.onTrack },
        { key: 'request', filterKey: 'extension_requested', label: 'ยื่นขอขยายเวลา', tone: 't-request', count: stats.extensionReq },
        { key: 'extend', filterKey: 'extended', label: 'อยู่ระหว่างขยายเวลา', tone: 't-extend', count: stats.extended },
      ],
    },
    {
      name: 'สิ้นสุดแล้ว',
      n: 2,
      items: [
        { key: 'closed', filterKey: 'completed', label: 'ปิดโครงการแล้ว', tone: 't-closed', count: stats.completed },
        { key: 'cancel', filterKey: 'cancelled', label: 'ยกเลิกโครงการ', tone: 't-cancel', count: stats.cancelled },
      ],
    },
  ];

  // 11. Filtered Projects List (รองรับสถานะ, ตัวกรอง FilterPopover, ค้นหา)
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
          p._timeline.days_remaining <= 30; // <= 30 วัน
        if (!isExpiring) return false;
      } else if (statusFilter !== 'all' && p._timeline.status !== statusFilter) {
        return false;
      }

      // Department Filter (จาก FilterPopover)
      const deptStr = (filters.departments || []).join(',');
      if (deptStr || filters.deptCustomText) {
        if (!itemMatchesDepartmentMulti(p, deptStr, filters.deptCustomText)) {
          return false;
        }
      }

      // Date Range Filter (จาก FilterPopover)
      if (filters.dateFrom || filters.dateTo) {
        if (!itemMatchesDateRange(p, filters.dateFrom, filters.dateTo)) {
          return false;
        }
      }

      // Numeric Ranges Filter (จาก FilterPopover)
      if (filters.numericRanges && Object.keys(filters.numericRanges).length > 0) {
        if (!itemMatchesNumericRanges(p, filters.numericRanges)) {
          return false;
        }
      }

      // SDGs & Framework Filter (จาก FilterPopover)
      if (
        (filters.sdgs && filters.sdgs.length > 0) ||
        (filters.framework && filters.framework !== 'all')
      ) {
        if (
          !itemMatchesEvaluation(
            p,
            activeTab === 'academic' ? 'academic' : 'research',
            evalMap,
            filters.sdgs,
            filters.framework
          )
        ) {
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
        p._timeline.days_remaining <= 30
      ) {
        return 2;
      }
      if (st === 'extension_requested') return 3;
      if (st === 'extended') return 4;
      if (st === 'active') return 5;
      return 6;
    };

    return filtered.sort((a, b) => {
      const rankA = getUrgencyRank(a);
      const rankB = getUrgencyRank(b);
      if (rankA !== rankB) return rankA - rankB;
      return (a._timeline.days_remaining ?? 9999) - (b._timeline.days_remaining ?? 9999);
    });
  }, [currentDataset, statusFilter, filters, searchTerm, activeTab, evalMap]);

  // 12. Pagination
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = useMemo(() => {
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, startIndex, itemsPerPage]);

  const handleTabChange = (key: MonitoringTabKey) => {
    setActiveTab(key);
    setCurrentPage(1);
    setStatusFilter('all');
  };

  // Extension Save Handler
  const handleSaveExtension = async (
    updatedItem: Record<string, any>,
    newExtension: ProjectExtensionRecord
  ) => {
    const isResearch = activeTab === 'research';
    const cat = isResearch ? 'research' : 'academic';

    const res = await saveCategoryRecord(cat, updatedItem, false);
    if (res.success) {
      if (isResearch) {
        setResearchList((prev) =>
          prev.map((p) =>
            p.id === updatedItem.id || p._id === updatedItem._id || (p.name && updatedItem.name && p.name === updatedItem.name)
              ? { ...p, ...updatedItem }
              : p
          )
        );
      } else {
        setAcademicList((prev) =>
          prev.map((p) =>
            p._id === updatedItem._id || p.name === updatedItem.name ? { ...p, ...updatedItem } : p
          )
        );
      }
      setExtensionTarget(null);
      showToast(
        updatedItem.status === 'extended'
          ? 'บันทึกอนุมัติขยายระยะเวลาโครงการเรียบร้อยแล้ว'
          : 'บันทึกคำขอขยายระยะเวลาเรียบร้อยแล้ว'
      );
    } else {
      alert(res.error || 'เกิดข้อผิดพลาดในการบันทึกคำขอขยายเวลา');
    }
  };

  // 1. ปิดโครงการ (ข้อมูลสำคัญ - มี Alert ขึ้นให้กดยืนยัน)
  const requestCloseProject = (item: Record<string, any>) => {
    setConfirmModal({
      isOpen: true,
      title: 'ยืนยันการปิดโครงการ (ข้อมูลสำคัญ)',
      message: `คุณต้องการบันทึกปิดโครงการ "${item.name}" ใช่หรือไม่?`,
      detail:
        '⚠️ ข้อมูลนี้เป็นข้อมูลสำคัญ: การปิดโครงการจะบันทึกวันปิดโครงการจริง และเปลี่ยนสถานะโครงการเป็นปิดโครงการแล้ว กรุณาตรวจสอบให้แน่ใจว่าได้ดำเนินงานและส่งมอบรายงานเสร็จสิ้นแล้ว',
      confirmText: 'ยืนยันปิดโครงการ',
      cancelText: 'ยกเลิก',
      type: 'warning',
      onConfirm: () => handleCloseProject(item),
    });
  };

  const handleCloseProject = async (item: Record<string, any>) => {
    const isResearch = activeTab === 'research';
    const cat = isResearch ? 'research' : 'academic';
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedItem: Record<string, any> = {
      ...item,
      status: 'completed',
      closed_date: todayStr,
      is_completed: true,
    };

    const res = await saveCategoryRecord(cat, updatedItem, false);
    if (res.success) {
      if (isResearch) {
        setResearchList((prev) =>
          prev.map((p) =>
            p.id === updatedItem.id || p._id === updatedItem._id || (p.name && updatedItem.name && p.name === updatedItem.name)
              ? { ...p, ...updatedItem }
              : p
          )
        );
      } else {
        setAcademicList((prev) =>
          prev.map((p) => (p._id === updatedItem._id || p.name === updatedItem.name ? { ...p, ...updatedItem } : p))
        );
      }
      setConfirmModal(null);
      setStatusModalTarget(null);
      showToast('บันทึกปิดโครงการเรียบร้อยแล้ว');
    } else {
      alert(res.error || 'เกิดข้อผิดพลาดในการบันทึกปิดโครงการ');
    }
  };

  // 2. ขอยกเลิกโครงการ (ไม่ลบข้อมูลแต่เปลี่ยนสถานะ)
  const requestCancelProject = (item: Record<string, any>) => {
    setConfirmModal({
      isOpen: true,
      title: 'ยืนยันการยกเลิกโครงการ',
      message: `คุณต้องการเปลี่ยนสถานะโครงการ "${item.name}" เป็น "ยกเลิกโครงการ" ใช่หรือไม่?`,
      detail:
        '🛡️ ข้อมูลจะไม่ถูกลบ: การดำเนินการนี้จะไม่เป็นการลบข้อมูลออกจากฐานข้อมูล โดยข้อมูลโครงการจะยังคงถูกจัดเก็บไว้อย่างครบถ้วนในระบบ แต่จะแสดงสถานะเป็นยกเลิกโครงการตามระเบียบ',
      confirmText: 'ยืนยันยกเลิกโครงการ',
      cancelText: 'ย้อนกลับ',
      type: 'danger',
      onConfirm: () => handleCancelProject(item),
    });
  };

  const handleCancelProject = async (item: Record<string, any>) => {
    const isResearch = activeTab === 'research';
    const cat = isResearch ? 'research' : 'academic';
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedItem: Record<string, any> = {
      ...item,
      status: 'cancelled',
      cancelled_date: todayStr,
      is_completed: false,
    };

    const res = await saveCategoryRecord(cat, updatedItem, false);
    if (res.success) {
      if (isResearch) {
        setResearchList((prev) =>
          prev.map((p) =>
            p.id === updatedItem.id || p._id === updatedItem._id || (p.name && updatedItem.name && p.name === updatedItem.name)
              ? { ...p, ...updatedItem }
              : p
          )
        );
      } else {
        setAcademicList((prev) =>
          prev.map((p) => (p._id === updatedItem._id || p.name === updatedItem.name ? { ...p, ...updatedItem } : p))
        );
      }
      setConfirmModal(null);
      setStatusModalTarget(null);
      showToast('บันทึกยกเลิกโครงการเรียบร้อยแล้ว (ข้อมูลยังคงอยู่ในระบบ)');
    } else {
      alert(res.error || 'เกิดข้อผิดพลาดในการยกเลิกโครงการ');
    }
  };

  // 3. เปิดโครงการอีกครั้ง (คืนสถานะกำลังดำเนินการ)
  const requestReopenProject = (item: Record<string, any>) => {
    setConfirmModal({
      isOpen: true,
      title: 'ยืนยันการเปิดโครงการอีกครั้ง',
      message: `คุณต้องการเปลี่ยนสถานะโครงการ "${item.name}" กลับเป็น "กำลังดำเนินการตามแผน" ใช่หรือไม่?`,
      detail: 'ระบบจะยกเลิกสถานะปิด/ยกเลิก และคืนสถานะโครงการเข้าสู่การติดตามผลตามปกติ',
      confirmText: 'ยืนยันเปิดโครงการ',
      cancelText: 'ยกเลิก',
      type: 'info',
      onConfirm: () => handleReopenProject(item),
    });
  };

  const handleReopenProject = async (item: Record<string, any>) => {
    const isResearch = activeTab === 'research';
    const cat = isResearch ? 'research' : 'academic';

    const updatedItem: Record<string, any> = {
      ...item,
      status: 'active',
      closed_date: undefined,
      cancelled_date: undefined,
      is_completed: false,
    };

    const res = await saveCategoryRecord(cat, updatedItem, false);
    if (res.success) {
      if (isResearch) {
        setResearchList((prev) =>
          prev.map((p) =>
            p.id === updatedItem.id || p._id === updatedItem._id || (p.name && updatedItem.name && p.name === updatedItem.name)
              ? { ...p, ...updatedItem }
              : p
          )
        );
      } else {
        setAcademicList((prev) =>
          prev.map((p) => (p._id === updatedItem._id || p.name === updatedItem.name ? { ...p, ...updatedItem } : p))
        );
      }
      setConfirmModal(null);
      setStatusModalTarget(null);
      showToast('เปิดโครงการกลับเป็นสถานะกำลังดำเนินการเรียบร้อยแล้ว');
    } else {
      alert(res.error || 'เกิดข้อผิดพลาดในการเปิดโครงการ');
    }
  };

  // Status Action dispatcher from ChangeStatusModal
  const handleSelectStatusAction = (action: ProjectStatusActionType, item: Record<string, any>) => {
    setStatusModalTarget(null);
    if (action === 'extend') {
      setExtensionTarget(item);
    } else if (action === 'close') {
      requestCloseProject(item);
    } else if (action === 'cancel') {
      requestCancelProject(item);
    } else if (action === 'reopen') {
      requestReopenProject(item);
    }
  };

  // Tabs configuration (exactly two tabs)
  const tabsConfig: TabItem<MonitoringTabKey>[] = [
    { key: 'research', label: 'โครงการวิจัย', count: processedResearch.length },
    { key: 'academic', label: 'โครงการพัฒนาวิชาการ', count: processedAcademic.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Scoped CSS for Modern Status Cards Board from status-cards.html */}
      <style jsx global>{`
        /* Global font normal for monitoring */
        .monitoring-scope * {
          font-weight: 400 !important;
        }
        .status-board {
          display: flex;
          flex-wrap: wrap;
          gap: 16px 20px;
          align-items: stretch;
          width: 100%;
        }
        .status-hero-col {
          flex: 0 0 220px;
          display: flex;
          flex-direction: column;
        }
        .status-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }
        .status-group[data-n="2"] {
          flex: 2 1 260px;
        }
        .status-group[data-n="3"] {
          flex: 3 1 390px;
        }
        .status-group-label {
          font-size: 12px;
          font-weight: 400;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-group-label::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }
        .status-cards-grid {
          display: grid;
          gap: 10px;
          flex: 1;
        }
        .status-group[data-n="2"] .status-cards-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .status-group[data-n="3"] .status-cards-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        /* Card Button - Stable Dimensions, No Bouncing, Elevated Floating Shadow */
        .status-card-btn {
          --c1: #475569;
          --c2: #334155;
          --soft: #f1f5f9;
          --soft-ink: #334155;
          position: relative;
          appearance: none;
          border: 1px solid rgba(0, 0, 0, 0.06);
          text-align: left;
          cursor: pointer;
          color: #ffffff;
          border-radius: 14px;
          padding: 14px 16px 12px;
          min-height: 112px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(145deg, var(--c1), var(--c2));
          box-shadow: 0 6px 18px -2px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          box-sizing: border-box;
          transition: box-shadow 0.15s ease, filter 0.15s ease;
        }
        .status-card-btn:hover {
          box-shadow: 0 8px 24px -2px rgba(0, 0, 0, 0.16), 0 3px 8px rgba(0, 0, 0, 0.06);
        }
        .status-card-btn::before {
          content: "";
          position: absolute;
          right: -25px;
          top: -25px;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.14);
          pointer-events: none;
        }
        .status-card-btn .card-label {
          font-size: 13px;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 7px;
          line-height: 1.3;
          position: relative;
        }
        .status-card-btn .card-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          flex: none;
          background: rgba(255, 255, 255, 0.22);
          display: grid;
          place-items: center;
        }
        .status-card-btn .card-num {
          font-size: 42px;
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
          position: relative;
          display: flex;
          align-items: baseline;
          gap: 5px;
        }
        .status-card-btn .card-unit {
          font-size: 12px;
          font-weight: 400;
          opacity: 0.85;
          letter-spacing: 0;
        }

        /* Zero state: Soft tint with elevated floating shadow so pastel cards don't blend into background */
        .status-card-btn.is-zero {
          background: var(--soft);
          color: var(--soft-ink);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
        }
        .status-card-btn.is-zero:hover {
          box-shadow: 0 9px 24px rgba(0, 0, 0, 0.11), 0 3px 8px rgba(0, 0, 0, 0.05);
        }
        .status-card-btn.is-zero::before {
          background: rgba(255, 255, 255, 0.55);
        }
        .status-card-btn.is-zero .card-icon {
          background: rgba(255, 255, 255, 0.7);
        }
        .status-card-btn.is-zero .card-num {
          opacity: 0.55;
        }

        /* Active / Selected state: Outline via box-shadow ring (Strictly NO shift/bounce) */
        .status-card-btn[aria-pressed="true"] {
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--c1), 0 10px 24px -2px rgba(0, 0, 0, 0.22);
        }
        .status-card-btn.is-zero[aria-pressed="true"] {
          box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--c1), 0 8px 22px rgba(0, 0, 0, 0.15);
        }

        /* Hero (Total) card */
        .status-card-btn.hero {
          flex: 1;
          min-height: 130px;
          --c1: #0f766e;
          --c2: #064e3b;
        }
        .status-card-btn.hero .card-num {
          font-size: 58px;
        }
        .status-card-btn.hero .card-label {
          font-size: 14px;
        }

        /* Color Tones from status-cards.html */
        .t-overdue { --c1: #ef4444; --c2: #b91c1c; --soft: #fee2e2; --soft-ink: #991b1b; }
        .t-near    { --c1: #f97316; --c2: #c2410c; --soft: #ffedd5; --soft-ink: #9a3412; }
        .t-ontrack { --c1: #16a34a; --c2: #15803d; --soft: #dcfce7; --soft-ink: #166534; }
        .t-request { --c1: #f59e0b; --c2: #b45309; --soft: #fef3c7; --soft-ink: #92400e; }
        .t-extend  { --c1: #0ea5e9; --c2: #0369a1; --soft: #e0f2fe; --soft-ink: #075985; }
        .t-closed  { --c1: #64748b; --c2: #334155; --soft: #e2e8f0; --soft-ink: #334155; }
        .t-cancel  { --c1: #9f7aea; --c2: #6b46c1; --soft: #ede9fe; --soft-ink: #5b21b6; }

        @media (max-width: 900px) {
          .status-hero-col { flex: 1 1 100%; }
          .status-group[data-n] { flex: 1 1 100%; }
        }
      `}</style>

      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: '#00A651',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '13px',
            fontWeight: 400,
          }}
        >
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
              fontWeight: 400,
              color: '#1e293b',
              letterSpacing: '-0.3px',
            }}
          >
            ติดตามสถานะโครงการ
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: 400 }}>
            ติดตามกำหนดการ วันเริ่ม-สิ้นสุด การขอขยายเวลา และสถานะการดำเนินงานตามระเบียบ มก.
          </div>
        </div>
      </div>

      {/* 2. Top Segmented Horizontal Tabs (2 Tabs Only) */}
      <TopSegmentedTabs<MonitoringTabKey>
        activeCategory={activeTab}
        onSelectCategory={handleTabChange}
        tabs={tabsConfig}
      />

      {/* 3. Status Cards Board (นำมาจาก status-cards.html แบบไม่เด้งและขนาดคงที่) */}
      <div className="status-board monitoring-scope" role="group" aria-label="กรองตามสถานะโครงการ">
        {/* Hero Column: โครงการทั้งหมด */}
        <div className="status-hero-col">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`status-card-btn hero ${stats.total === 0 ? 'is-zero' : ''}`}
            aria-pressed={statusFilter === 'all'}
            title="ดูโครงการทั้งหมด"
          >
            <span className="card-label">
              <span className="card-icon">{STATUS_ICONS.all}</span>
              <span>โครงการทั้งหมด</span>
            </span>
            <span className="card-num">
              {stats.total.toLocaleString()}
              <span className="card-unit">โครงการ</span>
            </span>
          </button>
        </div>

        {/* 3 Groups: ต้องเร่งจัดการ, กำลังดำเนินการ, สิ้นสุดแล้ว */}
        {statusGroups.map((g) => (
          <section key={g.name} className="status-group" data-n={g.n}>
            <div className="status-group-label">{g.name}</div>
            <div className="status-cards-grid">
              {g.items.map((item) => {
                const isSelected = statusFilter === item.filterKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setStatusFilter(item.filterKey)}
                    className={`status-card-btn ${item.tone} ${item.count === 0 ? 'is-zero' : ''}`}
                    aria-pressed={isSelected}
                    title={`ดูโครงการสถานะ: ${item.label}`}
                  >
                    <span className="card-label">
                      <span className="card-icon">{STATUS_ICONS[item.key]}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="card-num">
                      {item.count.toLocaleString()}
                      <span className="card-unit">โครงการ</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* 4. Action & Table Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'visible',
          position: 'relative',
          zIndex: 20,
        }}
      >
        {/* Action & Filter Toolbar (ช่องค้นหา และ ตัวกรอง อยู่บรรทัดเดียวกันเสมอ) */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            overflow: 'visible',
            position: 'relative',
            zIndex: 30,
            borderRadius: '12px 12px 0 0',
          }}
        >
          {/* ซ้าย: ช่องค้นหา และปุ่มตัวกรอง (อยู่บรรทัดเดียวกันเสมอ ไม่ขึ้นบรรทัดใหม่) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'nowrap',
              flexShrink: 0,
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
                width: '240px',
                height: '36px',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            >
              <FaSearch style={{ color: '#94a3b8', marginRight: '8px', fontSize: '13px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={activeTab === 'research' ? 'ค้นหาโครงการวิจัย...' : 'ค้นหาโครงการพัฒนาวิชาการ...'}
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
                  color: '#1e293b',
                  fontWeight: 400,
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  title="ล้างคำค้นหา"
                >
                  ✕
                </button>
              )}
            </div>

            {/* นำ FilterPopover มาใช้ (อยู่บรรทัดเดียวกับช่องค้นหา) */}
            <FilterPopover
              category={activeTab === 'academic' ? 'academic' : 'research'}
              categoryTitle={activeTab === 'academic' ? 'โครงการพัฒนาวิชาการ' : 'โครงการวิจัย'}
              totalCount={currentDataset.length}
              matchCount={filteredList.length}
              filters={filters}
              onApply={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }}
              onReset={() => {
                setFilters({
                  departments: [],
                  deptCustomText: '',
                  dateFrom: '',
                  dateTo: '',
                  numericRanges: {},
                  sdgs: [],
                  framework: 'all',
                });
                setCurrentPage(1);
              }}
            />

            {(statusFilter !== 'all' || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
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
                  fontWeight: 400,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span>ล้างตัวกรองสถานะ</span>
              </button>
            )}
          </div>

          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 400, whiteSpace: 'nowrap', flexShrink: 0 }}>
            พบ <span style={{ color: '#00A651', fontWeight: 400 }}>{filteredList.length}</span> โครงการ
          </div>
        </div>

        {/* Table Container */}
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
                  fontWeight: 400,
                  fontSize: '12.5px',
                }}
              >
                <th style={{ width: '55px', padding: '12px 10px', textAlign: 'center', fontWeight: 400 }}>
                  ลำดับที่
                </th>

                <th style={{ minWidth: '260px', padding: '12px 12px', fontWeight: 400 }}>
                  ชื่อโครงการ
                </th>

                <th style={{ width: '160px', padding: '12px 10px', fontWeight: 400 }}>
                  หัวหน้าโครงการ
                </th>

                {/* สังกัด แยกออกมาแสดงอีก column หลังหัวหน้าโครงการ */}
                <th style={{ width: '110px', padding: '12px 10px', textAlign: 'center', fontWeight: 400 }}>
                  สังกัด
                </th>

                <th style={{ width: '140px', padding: '12px 10px', textAlign: 'center', fontWeight: 400 }}>
                  สถานะ
                </th>

                <th style={{ width: '130px', padding: '12px 10px', textAlign: 'center', fontWeight: 400 }}>
                  วันที่สิ้นสุด
                </th>

                <th style={{ width: '130px', padding: '12px 10px', textAlign: 'center', fontWeight: 400 }}>
                  การขยายเวลา
                </th>

                <th style={{ width: '150px', padding: '12px 10px', textAlign: 'center', fontWeight: 400 }}>
                  จัดการ
                </th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: 'center',
                      padding: '48px 16px',
                      color: '#94a3b8',
                      fontSize: '13px',
                      fontWeight: 400,
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

                  return (
                    <tr
                      key={item._uniqueKey || rowIdx}
                      onClick={() => setSelectedDetailTarget({ item, category: activeTab })}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#fafbfc',
                        transition: 'background-color 0.12s',
                        cursor: 'pointer',
                      }}
                      className="hover:bg-emerald-50/40"
                    >
                      {/* 1. ลำดับที่ */}
                      <td style={{ padding: '10px 10px', textAlign: 'center', color: '#64748b', fontWeight: 400 }}>
                        {actualRowNo}
                      </td>

                      {/* 2. ชื่อโครงการ (ไม่มีแทรกสังกัด และไม่มีแหล่งทุนในช่องนี้) */}
                      <td style={{ padding: '10px 12px' }}>
                        <div
                          style={{
                            fontWeight: 400,
                            color: '#1e293b',
                            lineHeight: 1.5,
                            fontSize: '13px',
                          }}
                          title={item.name}
                        >
                          {item.name || '-'}
                        </div>
                      </td>

                      {/* 3. หัวหน้าโครงการ */}
                      <td style={{ padding: '10px 10px', color: '#334155', fontWeight: 400, fontSize: '13px' }}>
                        {item.head || item.person || '-'}
                      </td>

                      {/* 4. สังกัด (แยกออกมาแสดงอีก column หลังหัวหน้าโครงการ) */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <DepartmentBadge value={item.department} />
                      </td>

                      {/* 5. สถานะ */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatusModalTarget(item);
                          }}
                          title="คลิกเพื่อจัดการและเปลี่ยนสถานะโครงการ"
                          style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: '999px',
                            fontSize: '11.5px',
                            fontWeight: 400,
                            color: statusInfo.color,
                            backgroundColor: statusInfo.bg,
                            border: `1px solid ${statusInfo.border}`,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {statusInfo.labelTh}
                        </span>
                      </td>

                      {/* 6. วันที่สิ้นสุด */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <div style={{ fontWeight: 400, color: '#1e293b', fontSize: '13px' }}>
                          {formatDateBE(tl.end_date)}
                        </div>
                        {tl.is_overdue && (
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '10.5px',
                              fontWeight: 400,
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
                        {!tl.is_overdue && tl.days_remaining >= 0 && tl.days_remaining <= 30 && tl.status !== 'completed' && tl.status !== 'cancelled' && (
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '10.5px',
                              fontWeight: 400,
                              color: '#ea580c',
                              backgroundColor: '#ffedd5',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              marginTop: '2px',
                            }}
                          >
                            เหลือ {tl.days_remaining} วัน
                          </span>
                        )}
                      </td>

                      {/* 7. การขยายเวลา */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <div className="flex flex-col items-center gap-1">
                          {extensions.length > 0 ? (
                            <span
                              style={{ fontWeight: 400 }}
                              className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"
                            >
                              ขอขยาย {extensions.length} ครั้ง
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs" style={{ fontWeight: 400 }}>-</span>
                          )}
                        </div>
                      </td>

                      {/* 8. จัดการ: เหลือเพียงปุ่ม เปลี่ยนสถานะโครงการ */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setStatusModalTarget(item);
                            }}
                            title="จัดการสถานะโครงการ (ขยายเวลา, ปิดโครงการ, ยกเลิกโครงการ)"
                            className="inline-flex items-center justify-center px-2.5 py-1 text-xs rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer gap-1"
                            style={{ fontWeight: 400 }}
                          >
                            <FaExchangeAlt className="text-[10px]" />
                            <span style={{ fontWeight: 400 }}>เปลี่ยนสถานะโครงการ</span>
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
            borderRadius: '0 0 12px 12px',
          }}
        >
          <div>
            แสดง{' '}
            <span style={{ fontWeight: 400, color: '#1e293b' }}>
              {totalItems === 0 ? 0 : startIndex + 1}
            </span>{' '}
            -{' '}
            <span style={{ fontWeight: 400, color: '#1e293b' }}>
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{' '}
            จากทั้งหมด{' '}
            <span style={{ fontWeight: 400, color: '#1e293b' }}>
              {totalItems.toLocaleString()}
            </span>{' '}
            รายการ
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 400 }}>รายการต่อหน้า:</span>
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
                  fontWeight: 400,
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

              <span style={{ fontSize: '12px', fontWeight: 400, color: '#334155', padding: '0 4px' }}>
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

      {/* Change Status Modal */}
      {statusModalTarget && (
        <ChangeStatusModal
          isOpen={true}
          onClose={() => setStatusModalTarget(null)}
          projectItem={statusModalTarget}
          onSelectAction={handleSelectStatusAction}
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

      {/* Action Confirmation Modal (Alert สำหรับปิดโครงการ / ยกเลิกโครงการ) */}
      {confirmModal && (
        <ConfirmActionModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          detail={confirmModal.detail}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          type={confirmModal.type}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
