'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryKey, PersonnelRecord } from '@/types/dataManagement';
import { CATEGORIES_CONFIG, DEPARTMENTS, getDepartmentAbbr } from '@/config/dataManagementConfig';
import { TopSegmentedTabs } from './TopSegmentedTabs';
import { DataTable } from './DataTable';
import { PersonnelGrid } from './PersonnelGrid';
import { SmartAddEditModal } from './SmartAddEditModal';
import { SmartExcelImportModal } from './SmartExcelImportModal';
import { ConfirmActionModal, SearchInput } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterModal } from './FilterModal';
import { downloadExcelTemplate, exportTableToExcel } from '@/lib/etlEngine';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaTimes,
  FaList,
  FaThLarge,
  FaDownload,
  FaFileExport,
  FaPlus,
  FaFileExcel,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
} from 'react-icons/fa';

// Initial JSON datasets
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';
import rawPersonnel from '@/data/personnel.json';
import { KPIManagementTab } from './KPIManagementTab';
import { UserRoleManagementTab } from './UserRoleManagementTab';
import { RoleManagementService } from '@/services/roleManagement.service';
import { useAuth } from '@/features/auth';
import { getStoredKPIs } from '@/lib/kpiEngine';
import { ProjectMonitoringView } from './ProjectMonitoringView';
import {
  getCachedCategoryData,
  fetchCategoryData,
  fetchEvaluations,
  getCachedEvaluations,
  saveCategoryRecord,
  deleteCategoryRecord,
  batchImportCategoryRecords,
  bulkSaveEvaluationRecords,
} from '@/lib/dataService';
import { getDepartment } from '@/lib/departments';
import { EvalFramework } from './FilterModal';
import { isEvaluated, parseSdgNumber } from '@/types/evaluation';

interface DataManagementRootProps {
  goBack: () => void;
  onNavigateToMonitoring?: () => void;
}

const sanitizeDataset = (items: any[], categoryKey: string) => {
  return items
    .filter((i: any) => i && i.name && i.name !== 'nan' && i.name !== 'NaT' && i.name !== 'เรื่อง')
    .map((item: any, idx: number) => {
      const cleaned: any = { ...item };
      Object.keys(cleaned).forEach((k) => {
        if (cleaned[k] === 'nan' || cleaned[k] === 'NaT') {
          cleaned[k] = '';
        }
      });
      if (!cleaned._id) {
        const baseId = cleaned.id && cleaned.id !== '' && cleaned.id !== 'nan' ? cleaned.id : idx + 1;
        cleaned._id = `${categoryKey}_${baseId}_${idx}`;
      }
      return cleaned;
    });
};

const getInitialDataset = (key: CategoryKey, fallback: any[]) => {
  const cached = getCachedCategoryData(key);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    return cached;
  }
  return sanitizeDataset(fallback, key);
};

const VALID_CATEGORIES: readonly CategoryKey[] = [
  'research',
  'academic',
  'service',
  'publications',
  'ip',
  'personnel',
  'kpi',
  'monitoring',
  'user_roles',
];

const LS_MANAGE_TAB_KEY = 'ku_dw_manage_active_tab';
const LS_PERSONNEL_VIEW_KEY = 'ku_dw_manage_personnel_view_mode';

function resolveInitialCategory(): CategoryKey {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab') || params.get('category');
      if (urlTab && VALID_CATEGORIES.includes(urlTab as CategoryKey)) {
        return urlTab as CategoryKey;
      }

      const savedTab = localStorage.getItem(LS_MANAGE_TAB_KEY);
      if (savedTab && VALID_CATEGORIES.includes(savedTab as CategoryKey)) {
        return savedTab as CategoryKey;
      }
    } catch (e) {
      console.warn('[DataManagement] Error resolving initial category:', e);
    }
  }
  return 'research';
}

function resolveInitialPersonnelViewMode(): 'grid' | 'table' {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LS_PERSONNEL_VIEW_KEY);
      if (saved === 'grid' || saved === 'table') {
        return saved;
      }
    } catch {
      // ignore
    }
  }
  return 'table';
}


// ---------------------------------------------------------------------------
// Filtering Helper Functions
// ---------------------------------------------------------------------------
const parseBudget = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val || val === '-' || val === 'nan') return 0;
  const cleaned = String(val).replace(/,/g, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

const itemMatchesDepartment = (item: any, selectedDept: string): boolean => {
  if (!selectedDept) return true;
  const target = getDepartment(selectedDept);
  const targetCode = target.code;
  if (!targetCode || targetCode === '-') return true;

  const rawValues: any[] = [];
  if (item.department !== undefined && item.department !== null) {
    if (Array.isArray(item.department)) rawValues.push(...item.department);
    else rawValues.push(item.department);
  }
  if (item.departments !== undefined && item.departments !== null) {
    if (Array.isArray(item.departments)) rawValues.push(...item.departments);
    else rawValues.push(item.departments);
  }

  for (const raw of rawValues) {
    if (!raw) continue;
    const str = String(raw).trim();
    if (!str || str === '-' || str === 'nan') continue;

    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          for (const p of parsed) {
            if (getDepartment(p).code === targetCode) return true;
          }
          continue;
        }
      } catch {}
    }

    const parts = str.split(/[,;\n\r]+/);
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (getDepartment(trimmed).code === targetCode) return true;
    }

    if (getDepartment(str).code === targetCode) return true;
  }

  return false;
};

const getEvaluationForItem = (item: any, category: string): { sdg_ids: number[]; i_type: string | null } => {
  const sdgs: number[] = [];
  if (Array.isArray(item.sdg_ids)) {
    sdgs.push(...item.sdg_ids);
  }
  let iType: string | null = item.i_type || null;

  if (item.evaluation) {
    if (Array.isArray(item.evaluation.sdg_ids)) {
      sdgs.push(...item.evaluation.sdg_ids);
    }
    if (!iType && item.evaluation.i_type) {
      iType = item.evaluation.i_type;
    }
  }

  const cachedEvals = getCachedEvaluations();
  const catKey = category.toLowerCase();
  const idVal = String(item.id || '').trim();
  const idUnderVal = String(item._id || '').trim();
  const nameVal = String(item.name || '').trim();

  const possibleKeys = [
    `${catKey}_${idVal}`,
    `${catKey}_${idUnderVal}`,
    `${catKey}_${nameVal}`,
  ];

  for (const k of possibleKeys) {
    if (k === `${catKey}_`) continue;
    const ev = cachedEvals[k];
    if (ev) {
      if (Array.isArray(ev.sdg_ids)) {
        sdgs.push(...ev.sdg_ids);
      }
      if (!iType && ev.i_type) {
        iType = ev.i_type;
      }
      break;
    }
  }

  const uniqueSdgs = Array.from(new Set(sdgs.map((n) => Number(n)).filter((n) => !isNaN(n) && n >= 1 && n <= 17)));
  return { sdg_ids: uniqueSdgs, i_type: iType };
};

export const DataManagementRoot: React.FC<DataManagementRootProps> = ({
  goBack,
  onNavigateToMonitoring,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const canManageRoles = user?.role === 'admin';
  const [adminCount, setAdminCount] = useState<number | undefined>(undefined);

  const fetchAdminCount = useCallback(async () => {
    if (!canManageRoles) return;
    try {
      const res = await RoleManagementService.listRoles({ limit: 1 });
      if (res && typeof res.total === 'number') {
        setAdminCount(res.total);
      }
    } catch {
      // Ignore
    }
  }, [canManageRoles]);

  useEffect(() => {
    fetchAdminCount();
    const handleUpdate = () => fetchAdminCount();
    window.addEventListener('ku_roles_updated', handleUpdate);
    return () => window.removeEventListener('ku_roles_updated', handleUpdate);
  }, [fetchAdminCount]);

  // Datasets state with sanitized data and stable unique IDs
  const [datasets, setDatasets] = useState<Record<CategoryKey, any[]>>(() => ({
    monitoring: getInitialDataset('research', rawResearch),
    research: getInitialDataset('research', rawResearch),
    academic: getInitialDataset('academic', rawAcademic),
    service: getInitialDataset('service', rawServices),
    publications: getInitialDataset('publications', rawPublications),
    ip: getInitialDataset('ip', rawIP),
    personnel: getInitialDataset('personnel', rawPersonnel as PersonnelRecord[]),
    kpi: [],
    user_roles: [],
  }));

  // Synchronize with server on mount, tab focus, and evaluation updates
  const isSyncingRef = useRef(false);
  const lastSyncTimeRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const syncServerData = useCallback(async (force = false) => {
    const now = Date.now();
    // Throttle: avoid syncing more often than once every 2 seconds unless forced (initial mount)
    if (!force && now - lastSyncTimeRef.current < 2000) {
      return;
    }
    // In-flight guard: avoid duplicate concurrent syncs
    if (isSyncingRef.current) {
      return;
    }

    isSyncingRef.current = true;
    lastSyncTimeRef.current = now;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // 1. Fetch latest evaluations into cache (read-only, does not broadcast event)
      await fetchEvaluations().catch(() => {});
      if (controller.signal.aborted) return;

      // 2. Fetch fresh category data for all categories
      const categories: CategoryKey[] = ['research', 'academic', 'service', 'publications', 'ip', 'personnel'];
      const updates: Partial<Record<CategoryKey, any[]>> = {};

      for (const cat of categories) {
        if (controller.signal.aborted) return;
        try {
          const fresh = await fetchCategoryData(cat);
          if (fresh && Array.isArray(fresh) && fresh.length > 0) {
            updates[cat] = fresh;
          }
        } catch (err) {
          console.warn('[DataManagement] Error syncing ' + cat + ':', err);
        }
      }

      if (controller.signal.aborted) return;

      // Only setState once, and only if data actually changed
      if (Object.keys(updates).length > 0) {
        setDatasets((prev) => {
          let hasAnyDiff = false;
          for (const [k, newVal] of Object.entries(updates)) {
            const currentVal = prev[k as CategoryKey];
            if (!currentVal || currentVal.length !== newVal.length || JSON.stringify(currentVal) !== JSON.stringify(newVal)) {
              hasAnyDiff = true;
              break;
            }
          }
          if (!hasAnyDiff) return prev;

          const next = { ...prev, ...updates };
          if (updates.research) {
            next.monitoring = updates.research;
          }
          return next;
        });
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  React.useEffect(() => {
    // Initial mount sync (force = true)
    syncServerData(true);

    const handleFocus = () => {
      syncServerData(false);
    };
    const handleEvalUpdate = () => {
      syncServerData(false);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('ku_evaluations_updated', handleEvalUpdate);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('ku_evaluations_updated', handleEvalUpdate);
    };
  }, [syncServerData]);

  const [activeCategory, setActiveCategory] = useState<CategoryKey>(resolveInitialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedImageStatus, setSelectedImageStatus] = useState<'all' | 'has_image' | 'no_image'>('all');
  const [selectedCompleteness, setSelectedCompleteness] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [selectedSubFilter, setSelectedSubFilter] = useState('');
  const [selectedSdgs, setSelectedSdgs] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<EvalFramework>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [personnelViewMode, setPersonnelViewMode] = useState<'grid' | 'table'>(resolveInitialPersonnelViewMode);

  // Ref สำหรับจัดการ Scroll แถบ Bubble
  const tabsScrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // State สำหรับคลิกลากเมาส์ (Mouse Drag to Scroll)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // ฟังก์ชันตรวจสอบตำแหน่ง Scroll เพื่อเปิด/ปิดการแสดงปุ่มลูกศร
  const checkScrollState = () => {
    if (!tabsScrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = tabsScrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, []);

  // เลื่อนตำแหน่ง Scroll อัตโนมัติเมื่อเลือกแท็บ
  useEffect(() => {
    if (!tabsScrollContainerRef.current) return;
    if (activeCategory === 'kpi') {
      tabsScrollContainerRef.current.scrollTo({
        left: tabsScrollContainerRef.current.scrollWidth,
        behavior: 'smooth',
      });
    } else if (activeCategory === 'research' || activeCategory === 'monitoring') {
      tabsScrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
    setTimeout(checkScrollState, 350);
  }, [activeCategory]);

  // Synchronize URL and handle browser back/forward navigation
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const currentTab = params.get('tab') || params.get('category');
      if (currentTab !== activeCategory) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', activeCategory);
        window.history.replaceState(null, '', newUrl.pathname + newUrl.search);
      }
      localStorage.setItem(LS_MANAGE_TAB_KEY, activeCategory);
    } catch (e) {
      console.warn('[DataManagement] Error updating tab in URL/storage:', e);
    }

    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab') || params.get('category');
        if (tab && VALID_CATEGORIES.includes(tab as CategoryKey)) {
          setActiveCategory(tab as CategoryKey);
          localStorage.setItem(LS_MANAGE_TAB_KEY, tab);
        }
      } catch (e) {
        console.warn('[DataManagement] Error handling popstate:', e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeCategory]);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, any> | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ item: any; index: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification System (success, error, warning)
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    action?: { label: string; onClick: () => void } | null;
  } | null>(null);

  const showToast = (
    msg: string,
    typeOrAction?: 'success' | 'error' | 'warning' | { label: string; onClick: () => void },
    action?: { label: string; onClick: () => void }
  ) => {
    let resolvedType: 'success' | 'error' | 'warning' = 'success';
    let resolvedAction: { label: string; onClick: () => void } | null = action || null;

    if (typeof typeOrAction === 'string') {
      resolvedType = typeOrAction;
    } else if (typeOrAction && typeof typeOrAction === 'object') {
      resolvedAction = typeOrAction;
    }

    setToast({ message: msg, type: resolvedType, action: resolvedAction });
    setTimeout(
      () => {
        setToast((cur) => (cur?.message === msg ? null : cur));
      },
      resolvedType === 'error' ? 5500 : resolvedAction ? 6000 : 3500
    );
  };

  const currentConfig = CATEGORIES_CONFIG[activeCategory];
  const currentList = datasets[activeCategory] || [];

  // Filtered dataset
  const filteredData = useMemo(() => {
    return currentList.filter((item: any) => {
      // 1. Department filter
      if (selectedDept) {
        if (!itemMatchesDepartment(item, selectedDept)) {
          return false;
        }
      }

      // 2. Personnel: Role / Position Filter
      if (activeCategory === 'personnel' && selectedRole) {
        const pos = String(item.position || '').toLowerCase();
        const title = String(item.title_th || '').toLowerCase();
        const name = String(item.name || '').toLowerCase();

        const isProf = (title.includes('ศ.') || name.includes('ศ.ดร.') || pos.includes('ศาสตราจารย์')) &&
                       !title.includes('ผศ.') && !title.includes('รศ.') &&
                       !pos.includes('ผู้ช่วย') && !pos.includes('รอง');
        const isAssoc = (title.includes('รศ.') || name.includes('รศ.') || pos.includes('รองศาสตราจารย์')) &&
                        !title.includes('ผศ.') && !pos.includes('ผู้ช่วย');
        const isAsst = (title.includes('ผศ.') || name.includes('ผศ.') || pos.includes('ผู้ช่วยศาสตราจารย์'));
        const isLecturer = !isProf && !isAssoc && !isAsst &&
                           (title.includes('อ.') || title.includes('ดร.') || pos.includes('อาจารย์'));
        const isExecutive = pos.includes('หัวหน้า') || pos.includes('คณบดี') || pos.includes('ประธาน') || pos.includes('ผู้อำนวยการ');
        const isStaff = !isProf && !isAssoc && !isAsst && !isLecturer;

        if (selectedRole === 'professor' && !isProf) return false;
        if (selectedRole === 'assoc_prof' && !isAssoc) return false;
        if (selectedRole === 'asst_prof' && !isAsst) return false;
        if (selectedRole === 'lecturer' && !isLecturer) return false;
        if (selectedRole === 'executive' && !isExecutive) return false;
        if (selectedRole === 'staff' && !isStaff) return false;
      }

      // 3. Personnel: Profile Image Status Filter
      if (activeCategory === 'personnel' && selectedImageStatus !== 'all') {
        const hasImg = Boolean(item.image_url && String(item.image_url).trim() !== '');
        if (selectedImageStatus === 'has_image' && !hasImg) return false;
        if (selectedImageStatus === 'no_image' && hasImg) return false;
      }

      // Personnel: Profile Completeness Filter
      if (activeCategory === 'personnel' && selectedCompleteness !== 'all') {
        const isIncomplete = (
          !item.position || !String(item.position).trim() ||
          !item.email || !String(item.email).trim() || item.email === 'ไม่พบอีเมล' ||
          !item.image_url || !String(item.image_url).trim()
        );
        if (selectedCompleteness === 'incomplete' && !isIncomplete) return false;
        if (selectedCompleteness === 'complete' && isIncomplete) return false;
      }

      // 4. Dynamic SubFilter for categories
      if (selectedSubFilter) {
        if (activeCategory === 'research' || activeCategory === 'monitoring') {
          const ext = parseBudget(item.budget_external);
          const int = parseBudget(item.budget_internal);
          if (selectedSubFilter === 'external' && ext <= 0) return false;
          if (selectedSubFilter === 'internal' && int <= 0) return false;
          if (selectedSubFilter === 'high_budget') {
            const tot = ext + int;
            if (tot < 1000000) return false;
          }
        } else if (activeCategory === 'publications') {
          const lvl = String(item.level || '').toLowerCase();
          const jIndexVal = String(item.journal_index?.value || item.evaluation?.journal_index?.value || '').toLowerCase();
          const remarks = String(item.remarks || '').toLowerCase();
          const jName = String(item.journal || '').toLowerCase();

          if (selectedSubFilter === 'q1') {
            const isQ1 = lvl.includes('q1') || jIndexVal.includes('q1') || remarks.includes('q1') || jName.includes('q1');
            if (!isQ1) return false;
          } else if (selectedSubFilter === 'q2') {
            const isQ2 = lvl.includes('q2') || jIndexVal.includes('q2') || remarks.includes('q2') || jName.includes('q2');
            if (!isQ2) return false;
          } else if (selectedSubFilter === 'inter') {
            const isInter = lvl.includes('นานาชาติ') || jIndexVal.startsWith('q') || remarks.includes('นานาชาติ');
            if (!isInter) return false;
          } else if (selectedSubFilter === 'tci') {
            const isTci = (lvl.includes('ชาติ') && !lvl.includes('นานาชาติ')) ||
                          lvl.includes('tci') ||
                          jIndexVal.includes('tci') ||
                          remarks.includes('tci');
            if (!isTci) return false;
          }
        } else if (activeCategory === 'ip') {
          const stat = String(item.status || '').toLowerCase();
          const type = String(item.type || '').toLowerCase();
          const regNo = String(item.registration_number || item.reg_info || item.reg_no || '').trim();
          if (selectedSubFilter === 'granted') {
            const isGranted = stat.includes('คุ้มครอง') || stat.includes('จดทะเบียน') || stat === 'granted' || (regNo !== '' && regNo !== '-');
            if (!isGranted) return false;
          } else if (selectedSubFilter === 'patent') {
            if ((!type.includes('สิทธิบัตร') || type.includes('อนุสิทธิบัตร')) && type !== 'p') return false;
          } else if (selectedSubFilter === 'petty') {
            if (!type.includes('อนุสิทธิบัตร')) return false;
          } else if (selectedSubFilter === 'copyright') {
            if (!type.includes('ลิขสิทธิ์')) return false;
          }
        } else if (activeCategory === 'academic') {
          const chars = Array.isArray(item.characteristics)
            ? item.characteristics.join(' ')
            : String(item.characteristics || '');
          const resCount = Array.isArray(item.research_projects)
            ? item.research_projects.length
            : (item.research_projects && item.research_projects !== '-' ? 1 : 0);
          const patent = String(item.patent_integration || '').trim();
          const coExt = Number(item.co_members_external) || 0;

          if (selectedSubFilter === 'policy' && !chars.includes('นโยบาย')) return false;
          if (selectedSubFilter === 'value_add' && !chars.includes('เพิ่มมูลค่า')) return false;
          if (selectedSubFilter === 'has_research' && resCount === 0) return false;
          if (selectedSubFilter === 'has_patent' && (!patent || patent === '-')) return false;
          if (selectedSubFilter === 'has_external_members' && coExt === 0) return false;
        }
      }

      // 5. Evaluation filters (SDGs and Framework)
      const isEvaluatedCategory = ['research', 'academic', 'publications', 'service', 'services', 'ip', 'monitoring'].includes(activeCategory);
      if (isEvaluatedCategory) {
        const { sdg_ids, i_type } = getEvaluationForItem(item, activeCategory === 'monitoring' ? 'research' : activeCategory);

        // SDGs Filter (multi-select OR match)
        if (selectedSdgs && selectedSdgs.length > 0) {
          const selectedSdgNums = selectedSdgs.map((s) => Number(s));
          const hasMatchingSdg = selectedSdgNums.some((s) => sdg_ids.includes(s));
          if (!hasMatchingSdg) return false;
        }

        // Framework Filter ('all' | 'i_am' | 'i_see')
        if (selectedFramework && selectedFramework !== 'all') {
          const targetType = selectedFramework === 'i_am' ? 'I_AM' : 'I_SEE';
          if (i_type !== targetType) return false;
        }
      }

      // 6. Search term filter
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();

      for (const field of currentConfig.searchFields) {
        const val = item[field];
        if (val && String(val).toLowerCase().includes(q)) {
          return true;
        }
      }

      return false;
    });
  }, [
    currentList,
    selectedDept,
    selectedRole,
    selectedImageStatus,
    selectedCompleteness,
    selectedSubFilter,
    selectedSdgs,
    selectedFramework,
    searchTerm,
    currentConfig,
    activeCategory,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = useMemo(() => {
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, startIndex, itemsPerPage]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      monitoring: datasets.research.length,
      research: datasets.research.length,
      academic: datasets.academic.length,
      service: datasets.service.length,
      publications: datasets.publications.length,
      ip: datasets.ip.length,
      personnel: datasets.personnel.length,
      kpi: getStoredKPIs().length,
      user_roles: adminCount,
    };
  }, [datasets, adminCount]);

  const managementTabs = useMemo(() => {
    const tabsList: { key: CategoryKey; label: string; count?: number }[] = [
      { key: 'research', label: 'โครงงานวิจัย', count: counts.research },
      { key: 'academic', label: 'โครงการพัฒนาวิชาการ', count: counts.academic },
      { key: 'publications', label: 'ผลงานตีพิมพ์ทางวิชาการ', count: counts.publications },
      { key: 'service', label: 'งานบริการวิชาการ', count: counts.service },
      { key: 'ip', label: 'งานทรัพย์สินทางปัญญา', count: counts.ip },
      { key: 'personnel', label: 'บุคลากรและอาจารย์', count: counts.personnel },
      { key: 'kpi', label: 'ตัวชี้วัดตามแผนยุทธศาสตร์', count: counts.kpi },
    ];

    if (canManageRoles) {
      tabsList.push({
        key: 'user_roles',
        label: 'จัดการสิทธิ์ผู้ใช้',
        count: adminCount,
      });
    }

    return tabsList;
  }, [counts, canManageRoles, adminCount]);

  // Handle Tab Change
  const handleTabChange = (key: CategoryKey) => {
    setActiveCategory(key);
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedDept('');
    setSelectedRole('');
    setSelectedImageStatus('all');
    setSelectedCompleteness('all');
    setSelectedSubFilter('');
    setSelectedSdgs([]);
    setSelectedFramework('all');

    try {
      localStorage.setItem(LS_MANAGE_TAB_KEY, key);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('tab', key);
      window.history.replaceState(null, '', newUrl.pathname + newUrl.search);
    } catch (e) {
      console.warn('[DataManagement] Error persisting tab change:', e);
    }
  };

  const handlePersonnelViewModeChange = (mode: 'grid' | 'table') => {
    setPersonnelViewMode(mode);
    try {
      localStorage.setItem(LS_PERSONNEL_VIEW_KEY, mode);
    } catch {
      // ignore
    }
  };

  // Reset all active filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedRole('');
    setSelectedImageStatus('all');
    setSelectedCompleteness('all');
    setSelectedSubFilter('');
    setSelectedSdgs([]);
    setSelectedFramework('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    selectedDept ||
    (activeCategory === 'personnel' && selectedRole) ||
    (activeCategory === 'personnel' && selectedImageStatus !== 'all') ||
    (activeCategory === 'personnel' && selectedCompleteness !== 'all') ||
    selectedSubFilter ||
    selectedSdgs.length > 0 ||
    selectedFramework !== 'all'
  );

  const activeFilterCount =
    (selectedDept ? 1 : 0) +
    (activeCategory === 'personnel' && selectedRole ? 1 : 0) +
    (activeCategory === 'personnel' && selectedImageStatus !== 'all' ? 1 : 0) +
    (activeCategory === 'personnel' && selectedCompleteness !== 'all' ? 1 : 0) +
    (selectedSubFilter ? 1 : 0) +
    (selectedSdgs.length > 0 ? 1 : 0) +
    (selectedFramework !== 'all' ? 1 : 0);

  // CRUD Operations
  const handleSaveItem = async (record: Record<string, any>) => {
    const isNew = !(editingIndex !== null && editingIndex >= 0);
    const targetCategory = activeCategory === 'monitoring' ? 'research' : activeCategory;

    try {
      setIsSaving(true);
      const saveResult = await saveCategoryRecord(targetCategory, record, isNew);
      if (!saveResult.success) {
        showToast(saveResult.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        return;
      }

      const savedRecord = saveResult.data || record;

      setDatasets((prev) => {
        const list = [...(prev[targetCategory] || [])];
        if (!isNew && editingIndex !== null && editingIndex >= 0) {
          const prevId = list[editingIndex]._id || `${targetCategory}_${editingIndex}`;
          list[editingIndex] = { ...list[editingIndex], ...savedRecord, _id: prevId };
          showToast(`แก้ไขข้อมูล "${record[currentConfig.nameKey] || record.name}" สำเร็จ`, 'success');
        } else {
          list.unshift(savedRecord);
          showToast(`เพิ่มรายการ "${record[currentConfig.nameKey] || record.name}" เรียบร้อยแล้ว`, 'success');
        }
        return {
          ...prev,
          [targetCategory]: list,
          ...(targetCategory === 'research' ? { monitoring: list } : {}),
        };
      });
      setEditingItem(null);
      setEditingIndex(null);
      setIsAddEditModalOpen(false);
      await syncServerData(true);
    } catch (err: any) {
      showToast(err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const targetCategory = activeCategory === 'monitoring' ? 'research' : activeCategory;
    const targetId = deleteTarget.item._id || deleteTarget.item.id;
    const targetName = deleteTarget.item[currentConfig.nameKey] || deleteTarget.item.name || '';

    try {
      setIsDeleting(true);
      if (targetId) {
        const deleteResult = await deleteCategoryRecord(targetCategory, targetId);
        if (!deleteResult.success) {
          showToast(deleteResult.error || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
          return;
        }
      }

      setDatasets((prev) => {
        const list = [...(prev[targetCategory] || [])];
        list.splice(deleteTarget.index, 1);
        showToast(`ลบรายการ "${targetName}" เรียบร้อยแล้ว`, 'success');
        return {
          ...prev,
          [targetCategory]: list,
          ...(targetCategory === 'research' ? { monitoring: list } : {}),
        };
      });
      setDeleteTarget(null);
      await syncServerData(true);
    } catch (err: any) {
      showToast(err?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCommitImport = async (
    importedRows: Record<string, any>[],
    mode: 'append' | 'overwrite',
    targetCategory: CategoryKey
  ) => {
    const resolvedCategory = targetCategory === 'monitoring' ? 'research' : targetCategory;
    const sanitizedImported = importedRows.map((r, i) => {
      const cleaned: any = { ...r };
      Object.keys(cleaned).forEach((k) => {
        if (cleaned[k] === 'nan' || cleaned[k] === 'NaT') {
          cleaned[k] = '';
        }
      });
      cleaned._id = `${resolvedCategory}_import_${Date.now()}_${i}`;
      return cleaned;
    });

    await batchImportCategoryRecords(resolvedCategory, sanitizedImported, mode);

    setDatasets((prev) => {
      const existing = prev[resolvedCategory] || [];
      const updated = mode === 'append' ? [...sanitizedImported, ...existing] : [...sanitizedImported];
      return {
        ...prev,
        [resolvedCategory]: updated,
        ...(resolvedCategory === 'research' ? { monitoring: updated } : {}),
      };
    });
    // Extract optional evaluation fields and report unevaluated count
    let unevaluatedCount = 0;
    const evalItems: any[] = [];

    sanitizedImported.forEach((row) => {
      let sdgs: number[] = [];
      const rawSdg = row.sdg_code || row.sdgs || row.sdg;
      if (rawSdg) {
        if (Array.isArray(rawSdg)) sdgs = rawSdg.map(parseSdgNumber).filter((n): n is number => n !== null);
        else if (typeof rawSdg === 'string') sdgs = rawSdg.split(',').map(parseSdgNumber).filter((n): n is number => n !== null);
      }
      let iType: any = null;
      if (row.i_type === 'I_AM' || row.i_type === 'I_SEE') iType = row.i_type;
      else if (row.i_type === 'I am') iType = 'I_AM';
      else if (row.i_type === 'I see') iType = 'I_SEE';

      let journalIndex: any = null;
      const rawTier = row.quartile || row.tier || row.journal_tier;
      if (rawTier) {
        const clean = String(rawTier).trim();
        if (clean.includes('Q1')) journalIndex = { type: 'Q', value: 'Q1' };
        else if (clean.includes('Q2')) journalIndex = { type: 'Q', value: 'Q2' };
        else if (clean.includes('Q3')) journalIndex = { type: 'Q', value: 'Q3' };
        else if (clean.includes('Q4')) journalIndex = { type: 'Q', value: 'Q4' };
        else if (clean.includes('TCI 1') || clean.includes('TCI1')) journalIndex = { type: 'TCI', value: 'TCI 1' };
        else if (clean.includes('TCI 2') || clean.includes('TCI2')) journalIndex = { type: 'TCI', value: 'TCI 2' };
        else if (clean.includes('TCI 3') || clean.includes('TCI3')) journalIndex = { type: 'TCI', value: 'TCI 3' };
      }

      if (sdgs.length > 0 || iType || journalIndex) {
        evalItems.push({
          category: resolvedCategory,
          record_id: row._id,
          sdg_ids: sdgs,
          i_type: iType,
          journal_index: journalIndex,
        });
      }

      if (!isEvaluated(resolvedCategory, { sdg_ids: sdgs, i_type: iType, journal_index: journalIndex })) {
        unevaluatedCount++;
      }

      delete row.sdg_code;
      delete row.sdgs;
      delete row.sdg;
      delete row.i_type;
      delete row.quartile;
      delete row.tier;
      delete row.journal_tier;
    });

    if (evalItems.length > 0) {
      await bulkSaveEvaluationRecords(evalItems);
    }

    setCurrentPage(1);
    if (unevaluatedCount > 0) {
      showToast(
        `นำเข้าข้อมูลสำเร็จ ${importedRows.length} รายการ (ยังไม่ประเมิน ${unevaluatedCount} รายการ)`,
        'warning',
        {
          label: 'ไปที่หน้าการประเมิน',
          onClick: () => router.push(`/evaluation?category=${resolvedCategory}&status=unevaluated`),
        }
      );
    } else {
      showToast(
        `นำเข้าข้อมูลเข้าหมวด ${CATEGORIES_CONFIG[targetCategory].title} สำเร็จ (${importedRows.length} รายการ - ${
          mode === 'append' ? 'โหมดต่อท้าย' : 'โหมดเขียนทับ'
        })`,
        'success'
      );
    }
    await syncServerData(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {/* Toast Alert */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor:
              toast.type === 'error' ? '#dc2626' : toast.type === 'warning' ? '#d97706' : '#00A651',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow:
              toast.type === 'error'
                ? '0 8px 24px rgba(220, 38, 38, 0.35)'
                : toast.type === 'warning'
                ? '0 8px 24px rgba(217, 119, 6, 0.35)'
                : '0 8px 24px rgba(0, 166, 81, 0.35)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 500,
            fontSize: '13px',
            maxWidth: '460px',
            wordBreak: 'break-word',
          }}
        >
          {toast.type === 'error' ? (
            <FaTimesCircle style={{ fontSize: '18px', flexShrink: 0 }} />
          ) : toast.type === 'warning' ? (
            <FaExclamationTriangle style={{ fontSize: '18px', flexShrink: 0 }} />
          ) : (
            <FaCheckCircle style={{ fontSize: '18px', flexShrink: 0 }} />
          )}
          <span style={{ lineHeight: 1.4 }}>{toast.message}</span>
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              style={{
                marginLeft: '8px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: toast.type === 'warning' ? '#d97706' : '#00A651',
                border: 'none',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}

      {/* 1. Header */}
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
            ระบบจัดการข้อมูล
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            จัดการและนำเข้าข้อมูลโครงการวิจัย โครงการพัฒนาวิชาการ ผลงานตีพิมพ์ทางวิชาการ งานบริการวิชาการ งานทรัพย์สินทางปัญญา ข้อมูลบุคลากรและอาจารย์ ตัวชี้วัดตามแผนยุทธศาสตร์ และจัดการสิทธิ์ผู้ใช้
          </div>
        </div>
      </div>

      {/* 2. Top Segmented Horizontal Tabs (รองรับปุ่มเลื่อน, ลูกกลิ้งเมาส์, และการคลิกลาก) */}
      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        {/* ปุ่มเลื่อนซ้าย */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => {
              tabsScrollContainerRef.current?.scrollBy({ left: -260, behavior: 'smooth' });
            }}
            style={{
              position: 'absolute',
              left: 0,
              zIndex: 20,
              height: '38px',
              width: '32px',
              borderRadius: '8px 0 0 8px',
              border: '1px solid #cbd5e1',
              borderRight: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              color: '#334155',
              boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="เลื่อนไปทางซ้าย"
          >
            <FaChevronLeft style={{ fontSize: '11px' }} />
          </button>
        )}

        {/* คอนเทนเนอร์ Bubble Tabs */}
        <div
          ref={tabsScrollContainerRef}
          onScroll={checkScrollState}
          onWheel={(e) => {
            if (tabsScrollContainerRef.current) {
              tabsScrollContainerRef.current.scrollLeft += e.deltaY;
            }
          }}
          onMouseDown={(e) => {
            if (!tabsScrollContainerRef.current) return;
            isDraggingRef.current = true;
            startXRef.current = e.pageX - tabsScrollContainerRef.current.offsetLeft;
            scrollLeftRef.current = tabsScrollContainerRef.current.scrollLeft;
          }}
          onMouseLeave={() => {
            isDraggingRef.current = false;
          }}
          onMouseUp={() => {
            isDraggingRef.current = false;
          }}
          onMouseMove={(e) => {
            if (!isDraggingRef.current || !tabsScrollContainerRef.current) return;
            e.preventDefault();
            const x = e.pageX - tabsScrollContainerRef.current.offsetLeft;
            const walk = (x - startXRef.current) * 1.5;
            tabsScrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
          }}
          style={{
            width: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            padding: '2px 0px 6px 0px',
            cursor: 'grab',
          }}
        >
          <div style={{ display: 'inline-flex', minWidth: 'max-content' }}>
            <TopSegmentedTabs
              activeCategory={activeCategory}
              onSelectCategory={handleTabChange}
              counts={counts}
              tabs={managementTabs}
            />
          </div>
        </div>

        {/* ปุ่มเลื่อนขวา */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => {
              tabsScrollContainerRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
            }}
            style={{
              position: 'absolute',
              right: 0,
              zIndex: 20,
              height: '38px',
              width: '32px',
              borderRadius: '0 8px 8px 0',
              border: '1px solid #cbd5e1',
              borderLeft: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              color: '#334155',
              boxShadow: '-2px 0 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="เลื่อนไปทางขวา"
          >
            <FaChevronRight style={{ fontSize: '11px' }} />
          </button>
        )}
      </div>

      {activeCategory === 'user_roles' ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            padding: '24px',
          }}
        >
          <UserRoleManagementTab />
        </div>
      ) : activeCategory === 'kpi' ? (
        <KPIManagementTab datasets={datasets} />
      ) : (
        /* 3. กล่องเนื้อหาหลัก */
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Action & Filter Bar */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* ซ้าย: ช่องค้นหา และปุ่มตัวกรอง */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                flex: '1 1 280px',
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
                  maxWidth: '260px',
                  minWidth: '180px',
                  transition: 'border-color 0.15s',
                }}
              >
                <FaSearch style={{ color: '#94a3b8', marginRight: '8px', fontSize: '13px', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder={
                    activeCategory === 'personnel'
                      ? 'ค้นหาชื่อ, ตำแหน่ง, สังกัด...'
                      : `ค้นหา${currentConfig.title}...`
                  }
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
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '0 4px',
                      fontSize: '15px',
                    }}
                    title="ล้างคำค้นหา"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* ปุ่ม Filter */}
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: activeFilterCount > 0 ? '1.5px solid #00A651' : '1px solid #cbd5e1',
                  backgroundColor: activeFilterCount > 0 ? '#f0fbf5' : '#ffffff',
                  color: activeFilterCount > 0 ? '#00A651' : '#334155',
                  fontSize: '13px',
                  fontWeight: activeFilterCount > 0 ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: activeFilterCount > 0 ? '0 1px 3px rgba(0, 166, 81, 0.15)' : 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (activeFilterCount === 0) {
                    e.currentTarget.style.borderColor = '#00A651';
                    e.currentTarget.style.backgroundColor = '#f0fbf5';
                    e.currentTarget.style.color = '#00A651';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilterCount === 0) {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#334155';
                  }
                }}
                title="เปิดหน้าต่างตัวกรองข้อมูล"
              >
                <FaFilter style={{ fontSize: '11px' }} />
                <span>ตัวกรอง</span>
                {activeFilterCount > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '18px',
                      height: '18px',
                      padding: '0 5px',
                      borderRadius: '9px',
                      backgroundColor: '#00A651',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* ปุ่มล้างตัวกรองทั้งหมด */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#b91c1c',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  title="ล้างตัวกรองทั้งหมด"
                >
                  <FaTimes style={{ fontSize: '11px' }} />
                  <span>ล้างตัวกรอง</span>
                </button>
              )}
            </div>

            {/* ขวา: กลุ่มปุ่มคำสั่งงานและสลับมุมมอง */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
              }}
            >
              {/* สลับมุมมองเมื่ออยู่ในแท็บบุคลากร */}
              {activeCategory === 'personnel' && (
                <div
                  style={{
                    display: 'inline-flex',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => handlePersonnelViewModeChange('table')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap',
                      padding: '7px 12px',
                      border: 'none',
                      backgroundColor: personnelViewMode === 'table' ? '#00A651' : '#ffffff',
                      color: personnelViewMode === 'table' ? '#ffffff' : '#64748b',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                    title="มุมมองตาราง"
                  >
                    <FaList style={{ marginRight: '6px', fontSize: '12px' }} />
                    <span>ตาราง</span>
                  </button>
                  <button
                    onClick={() => handlePersonnelViewModeChange('grid')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      whiteSpace: 'nowrap',
                      padding: '7px 12px',
                      border: 'none',
                      backgroundColor: personnelViewMode === 'grid' ? '#00A651' : '#ffffff',
                      color: personnelViewMode === 'grid' ? '#ffffff' : '#64748b',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                    title="มุมมองการ์ด"
                  >
                    <FaThLarge style={{ marginRight: '6px', fontSize: '12px' }} />
                    <span>การ์ด</span>
                  </button>
                </div>
              )}

              {/* ส่งออก Excel */}
              <button
                onClick={() => exportTableToExcel(filteredData, activeCategory)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00A651';
                  e.currentTarget.style.color = '#00A651';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#334155';
                }}
                title="ส่งออกข้อมูลในตารางเป็นไฟล์ Excel"
              >
                <FaFileExport style={{ color: '#64748b', fontSize: '13px' }} />
                <span>ส่งออก Excel</span>
              </button>

              {/* เพิ่มรายการ */}
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditingIndex(null);
                  setIsAddEditModalOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #00A651',
                  borderRadius: '8px',
                  color: '#00A651',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0fbf5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <FaPlus style={{ fontSize: '12px', color: '#00A651' }} />
                <span>เพิ่มรายการ</span>
              </button>

              {/* นำเข้าไฟล์ Excel */}
              <button
                onClick={() => setIsImportModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 18px',
                  backgroundColor: '#00A651',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00A651')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#00A651')}
              >
                <FaFileExcel style={{ fontSize: '14px' }} />
                <span>นำเข้าไฟล์ Excel</span>
              </button>
            </div>
          </div>

          {/* Content: ตารางหรือการ์ด */}
          {activeCategory === 'monitoring' ? (
            <div style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
              <ProjectMonitoringView
                projects={datasets.research}
                onUpdateProject={async (updated) => {
                  await saveCategoryRecord('research', updated, false);
                  const updatedResearch = datasets.research.map((p) =>
                    (p._id && p._id === updated._id) || (p.id && p.id === updated.id) ? updated : p
                  );
                  setDatasets((prev) => ({
                    ...prev,
                    research: updatedResearch,
                    monitoring: updatedResearch,
                  }));
                  showToast('อัปเดตกำหนดการและสถานะโครงการเรียบร้อยแล้ว', 'success');
                }}
              />
            </div>
          ) : activeCategory === 'personnel' && personnelViewMode === 'grid' ? (
            <div style={{ padding: '20px', backgroundColor: '#f8fafc' }}>
              <PersonnelGrid
                personnel={paginatedData as PersonnelRecord[]}
                onEdit={(person) => {
                  const actualIdx = datasets.personnel.findIndex(
                    (p) => (p._id && p._id === person._id) || (p.id && p.id === person.id) || p === person
                  );
                  setEditingItem(person);
                  setEditingIndex(actualIdx);
                  setIsAddEditModalOpen(true);
                }}
                onDelete={(person) => {
                  const actualIdx = datasets.personnel.findIndex(
                    (p) => (p._id && p._id === person._id) || (p.id && p.id === person.id) || p === person
                  );
                  setDeleteTarget({ item: person, index: actualIdx });
                }}
              />
            </div>
          ) : (
            <DataTable
              key={`${activeCategory}-page-${currentPage}`}
              categoryKey={activeCategory}
              currentPage={currentPage}
              columns={currentConfig.columns}
              data={paginatedData}
              startIndex={startIndex}
              onEdit={(item) => {
                const actualIdx = datasets[activeCategory].findIndex(
                  (x) => (x._id && x._id === item._id) || (x.id && x.id === item.id) || x === item
                );
                setEditingItem(item);
                setEditingIndex(actualIdx >= 0 ? actualIdx : currentList.indexOf(item));
                setIsAddEditModalOpen(true);
              }}
              onDelete={(item) => {
                const actualIdx = datasets[activeCategory].findIndex(
                  (x) => (x._id && x._id === item._id) || (x.id && x.id === item.id) || x === item
                );
                setDeleteTarget({ item, index: actualIdx >= 0 ? actualIdx : currentList.indexOf(item) });
              }}
            />
          )}

          {/* Footer: Pagination & ข้อมูลจำนวนรายการ */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px',
              borderTop: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              fontSize: '13px',
              color: '#64748b',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              แสดง {filteredData.length > 0 ? startIndex + 1 : 0} ถึง{' '}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} จากทั้งหมด{' '}
              <strong style={{ color: '#1e293b' }}>{filteredData.length}</strong> รายการ
              {selectedDept && ` (สังกัด: ${selectedDept.replace('ภาควิชา', '')})`}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>แสดง:</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(val) => {
                    if (val) {
                      setItemsPerPage(Number(val));
                      setCurrentPage(1);
                    }
                  }}
                >
                  <SelectTrigger className="h-7 text-xs w-[70px] bg-white">
                    <SelectValue placeholder={String(itemsPerPage)} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ปุ่มเปลี่ยนหน้า */}
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: currentPage === 1 ? '#f8fafc' : '#ffffff',
                    color: currentPage === 1 ? '#cbd5e1' : '#334155',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  title="หน้าก่อนหน้า"
                >
                  <FaChevronLeft style={{ fontSize: '10px' }} />
                </button>

                {/* Dynamic Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 6) return true;
                    if (p === 1 || p === totalPages) return true;
                    return Math.abs(p - currentPage) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const isCurrent = p === currentPage;
                    const prevP = arr[idx - 1];
                    const hasGap = prevP && p - prevP > 1;

                    return (
                      <React.Fragment key={p}>
                        {hasGap && (
                          <span style={{ padding: '0 3px', color: '#94a3b8', fontSize: '12px' }}>…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          style={{
                            minWidth: '28px',
                            height: '28px',
                            padding: '0 6px',
                            borderRadius: '6px',
                            border: isCurrent ? '1px solid #00A651' : '1px solid #e2e8f0',
                            backgroundColor: isCurrent ? '#00A651' : '#ffffff',
                            color: isCurrent ? '#ffffff' : '#334155',
                            fontWeight: isCurrent ? 700 : 500,
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: currentPage === totalPages ? '#f8fafc' : '#ffffff',
                    color: currentPage === totalPages ? '#cbd5e1' : '#334155',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                  title="หน้าถัดไป"
                >
                  <FaChevronRight style={{ fontSize: '10px' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SmartAddEditModal
        isOpen={isAddEditModalOpen}
        isSubmitting={isSaving}
        onClose={() => {
          if (isSaving) return;
          setIsAddEditModalOpen(false);
          setEditingItem(null);
          setEditingIndex(null);
        }}
        onSave={handleSaveItem}
        config={currentConfig}
        initialData={editingItem}
      />

      <SmartExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        activeCategory={activeCategory}
        onCommitImport={handleCommitImport}
        existingDatasets={datasets}
      />

      <ConfirmActionModal
        isOpen={Boolean(deleteTarget)}
        isLoading={isDeleting}
        type="danger"
        title="ยืนยันการลบรายการ?"
        message={`คุณต้องการลบข้อมูล "${deleteTarget ? deleteTarget.item[currentConfig.nameKey] || deleteTarget.item.name || '' : ''}" ในหมวด ${currentConfig.title} ใช่หรือไม่?`}
        detail={
          activeCategory === 'personnel' && deleteTarget ? (() => {
            const pId = Number(deleteTarget.item.id);
            const pName = String(deleteTarget.item.name || '').trim();
            let count = 0;
            ['research', 'academic', 'service', 'publications', 'ip'].forEach((cat) => {
              const list = datasets[cat as CategoryKey] || [];
              list.forEach((it: any) => {
                if (
                  (pId && (it.person_id === pId || it.head_id === pId || it.owner_id === pId)) ||
                  (it.head && it.head === pName) ||
                  (it.person && it.person === pName) ||
                  (it.owner && it.owner === pName) ||
                  (it.creator && String(it.creator).includes(pName))
                ) {
                  count++;
                }
              });
            });
            if (count > 0) {
              return `พบการเชื่อมโยงข้อมูลในระบบ ${count} รายการ (โครงการวิจัย/บริการ/สิ่งประดิษฐ์/บทความ) หากลบ ระบบจะยกเลิกการเชื่อมโยง (un-link) โดยยังคงชื่อข้อความเดิมไว้ในรายการเหล่านั้น`;
            }
            return 'การดำเนินการนี้จะไม่สามารถย้อนกลับได้';
          })() : 'การดำเนินการนี้จะไม่สามารถย้อนกลับได้'
        }
        confirmText={isDeleting ? 'กำลังลบ...' : 'ยืนยันการลบ'}
        cancelText="ยกเลิก"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (isDeleting) return;
          setDeleteTarget(null);
        }}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeCategory={activeCategory}
        config={currentConfig}
        selectedDept={selectedDept}
        selectedRole={selectedRole}
        selectedImageStatus={selectedImageStatus}
        selectedSubFilter={selectedSubFilter}
        selectedCompleteness={selectedCompleteness}
        selectedSdgs={selectedSdgs}
        selectedFramework={selectedFramework}
        onApply={(filters) => {
          setSelectedDept(filters.selectedDept);
          setSelectedRole(filters.selectedRole);
          setSelectedImageStatus(filters.selectedImageStatus);
          setSelectedSubFilter(filters.selectedSubFilter);
          setSelectedCompleteness(filters.selectedCompleteness || 'all');
          setSelectedSdgs(filters.selectedSdgs || []);
          setSelectedFramework(filters.selectedFramework || 'all');
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />
    </div>
  );
};