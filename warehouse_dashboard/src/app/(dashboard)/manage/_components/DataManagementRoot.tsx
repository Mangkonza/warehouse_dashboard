'use client';

import React, { useState, useMemo } from 'react';
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
import { getStoredKPIs } from '@/lib/kpiEngine';
import { ProjectMonitoringView } from './ProjectMonitoringView';
import {
  getCachedCategoryData,
  fetchCategoryData,
  saveCategoryRecord,
  deleteCategoryRecord,
  batchImportCategoryRecords,
} from '@/lib/dataService';

interface DataManagementRootProps {
  goBack: () => void;
  onNavigateToMonitoring?: () => void;
}

const sanitizeDataset = (items: any[], categoryKey: string) => {
  return items
    .filter((i: any) => i.name && i.name !== 'nan' && i.name !== 'NaT' && i.name !== 'เรื่อง')
    .map((item: any, idx: number) => {
      const cleaned: any = { ...item };
      Object.keys(cleaned).forEach((k) => {
        if (cleaned[k] === 'nan' || cleaned[k] === 'NaT') {
          cleaned[k] = '';
        }
      });
      const baseId = cleaned.id && cleaned.id !== '' && cleaned.id !== 'nan' ? cleaned.id : idx + 1;
      cleaned._id = `${categoryKey}_${baseId}_${idx}`;
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
];

const LS_MANAGE_TAB_KEY = 'ku_dw_manage_active_tab';
const LS_PERSONNEL_VIEW_KEY = 'ku_dw_manage_personnel_view_mode';

function resolveInitialCategory(): CategoryKey {
  if (typeof window !== 'undefined') {
    try {
      // 1. URL search param has highest priority (?tab=... or ?category=...)
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab') || params.get('category');
      if (urlTab && VALID_CATEGORIES.includes(urlTab as CategoryKey)) {
        return urlTab as CategoryKey;
      }

      // 2. LocalStorage has second priority
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

export const DataManagementRoot: React.FC<DataManagementRootProps> = ({
  goBack,
  onNavigateToMonitoring,
}) => {
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
  }));

  // Synchronize with server on mount
  React.useEffect(() => {
    const categories: CategoryKey[] = ['research', 'academic', 'service', 'publications', 'ip', 'personnel'];
    categories.forEach(async (cat) => {
      try {
        const fresh = await fetchCategoryData(cat);
        if (fresh && Array.isArray(fresh) && fresh.length > 0) {
          setDatasets((prev) => ({
            ...prev,
            [cat]: fresh,
            ...(cat === 'research' ? { monitoring: fresh } : {}),
          }));
        }
      } catch (err) {
        console.warn(`[DataManagement] Error syncing ${cat}:`, err);
      }
    });
  }, []);

  const [activeCategory, setActiveCategory] = useState<CategoryKey>(resolveInitialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedImageStatus, setSelectedImageStatus] = useState<'all' | 'has_image' | 'no_image'>('all');
  const [selectedCompleteness, setSelectedCompleteness] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [selectedSubFilter, setSelectedSubFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [personnelViewMode, setPersonnelViewMode] = useState<'grid' | 'table'>(resolveInitialPersonnelViewMode);

  // Synchronize URL and handle browser back/forward navigation
  React.useEffect(() => {
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

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentConfig = CATEGORIES_CONFIG[activeCategory];
  const currentList = datasets[activeCategory] || [];

  // Filtered dataset
  const filteredData = useMemo(() => {
    return currentList.filter((item: any) => {
      // 1. Department filter (matched against full name or abbreviation)
      if (selectedDept) {
        const itemDept = item.department || '';
        const selectedAbbr = getDepartmentAbbr(selectedDept);
        const cleanSelected = selectedDept.replace('ภาควิชา', '');
        if (
          !itemDept.includes(cleanSelected) &&
          getDepartmentAbbr(itemDept) !== selectedAbbr &&
          !itemDept.includes(selectedDept)
        ) {
          return false;
        }
      }

      // 2. Personnel: Role / Position Filter
      if (activeCategory === 'personnel' && selectedRole) {
        const pos = String(item.position || '').toLowerCase();
        const title = String(item.title_th || '').toLowerCase();
        const name = String(item.name || '').toLowerCase();

        if (selectedRole === 'professor') {
          if (!title.includes('ศ.') && !name.includes('ศ.ดร.') && !pos.includes('ศาสตราจารย์')) return false;
        } else if (selectedRole === 'assoc_prof') {
          if (!title.includes('รศ.') && !name.includes('รศ.') && !pos.includes('รองศาสตราจารย์')) return false;
        } else if (selectedRole === 'asst_prof') {
          if (!title.includes('ผศ.') && !name.includes('ผศ.') && !pos.includes('ผู้ช่วยศาสตราจารย์')) return false;
        } else if (selectedRole === 'lecturer') {
          if (!title.includes('อ.') && !title.includes('ดร.') && !pos.includes('อาจารย์')) return false;
        } else if (selectedRole === 'executive') {
          if (
            !pos.includes('หัวหน้า') &&
            !pos.includes('คณบดี') &&
            !pos.includes('ประธาน') &&
            !pos.includes('ผู้อำนวยการ')
          ) {
            return false;
          }
        } else if (selectedRole === 'staff') {
          if (
            title.includes('ศ.') ||
            title.includes('รศ.') ||
            title.includes('ผศ.') ||
            pos.includes('อาจารย์') ||
            pos.includes('ศาสตราจารย์')
          ) {
            return false;
          }
        }
      }

      // 3. Personnel: Profile Image Status Filter
      if (activeCategory === 'personnel' && selectedImageStatus !== 'all') {
        const hasImg = Boolean(item.image_url && String(item.image_url).trim() !== '');
        if (selectedImageStatus === 'has_image' && !hasImg) return false;
        if (selectedImageStatus === 'no_image' && hasImg) return false;
      }

      // Personnel: Profile Completeness Filter (ข้อมูลไม่ครบ: ขาด ตำแหน่ง, อีเมล, หรือ รูปภาพ)
      if (activeCategory === 'personnel' && selectedCompleteness !== 'all') {
        const isIncomplete = (
          !item.position || !String(item.position).trim() ||
          !item.email || !String(item.email).trim() || item.email === 'ไม่พบอีเมล' ||
          !item.image_url || !String(item.image_url).trim()
        );
        if (selectedCompleteness === 'incomplete' && !isIncomplete) return false;
        if (selectedCompleteness === 'complete' && isIncomplete) return false;
      }

      // 4. Dynamic SubFilter for other categories
      if (selectedSubFilter) {
        if (activeCategory === 'research') {
          if (selectedSubFilter === 'external' && (!item.budget_external || Number(item.budget_external) === 0)) return false;
          if (selectedSubFilter === 'internal' && (!item.budget_internal || Number(item.budget_internal) === 0)) return false;
          if (selectedSubFilter === 'high_budget') {
            const tot = (Number(item.budget_internal) || 0) + (Number(item.budget_external) || 0);
            if (tot < 1000000) return false;
          }
        } else if (activeCategory === 'publications') {
          const lvl = String(item.level || '').toLowerCase();
          if (selectedSubFilter === 'q1' && !lvl.includes('q1')) return false;
          if (selectedSubFilter === 'q2' && !lvl.includes('q2')) return false;
          if (selectedSubFilter === 'inter' && !lvl.includes('นานาชาติ')) return false;
          if (selectedSubFilter === 'tci' && !lvl.includes('tci') && !lvl.includes('ระดับชาติ')) return false;
        } else if (activeCategory === 'ip') {
          const stat = String(item.status || '').toLowerCase();
          const type = String(item.type || '').toLowerCase();
          if (selectedSubFilter === 'granted' && !stat.includes('จดทะเบียน') && !stat.includes('สิทธิบัตร')) return false;
          if (selectedSubFilter === 'patent' && !type.includes('สิทธิบัตรการประดิษฐ์')) return false;
          if (selectedSubFilter === 'petty' && !type.includes('อนุสิทธิบัตร')) return false;
        } else if (activeCategory === 'academic') {
          const chars = Array.isArray(item.characteristics)
            ? item.characteristics.join(' ')
            : String(item.characteristics || '');
          const resCount = Array.isArray(item.research_projects) ? item.research_projects.length : 0;
          const patent = String(item.patent_integration || '').trim();
          if (selectedSubFilter === 'policy' && !chars.includes('นโยบาย')) return false;
          if (selectedSubFilter === 'value_add' && !chars.includes('เพิ่มมูลค่า')) return false;
          if (selectedSubFilter === 'has_research' && resCount === 0) return false;
          if (selectedSubFilter === 'has_patent' && !patent) return false;
          if (selectedSubFilter === 'has_external_members' && (!item.co_members_external || Number(item.co_members_external) === 0)) return false;
        }
      }

      // 5. Search term filter
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
    };
  }, [datasets]);

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
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    selectedDept ||
    selectedRole ||
    selectedImageStatus !== 'all' ||
    selectedCompleteness !== 'all' ||
    selectedSubFilter
  );

  const activeFilterCount =
    (selectedDept ? 1 : 0) +
    (selectedRole ? 1 : 0) +
    (selectedImageStatus !== 'all' ? 1 : 0) +
    (selectedCompleteness !== 'all' ? 1 : 0) +
    (selectedSubFilter ? 1 : 0);

  // CRUD Operations
  const handleSaveItem = async (record: Record<string, any>) => {
    const isNew = !(editingIndex !== null && editingIndex >= 0);
    const targetCategory = activeCategory === 'monitoring' ? 'research' : activeCategory;

    const saveResult = await saveCategoryRecord(targetCategory, record, isNew);
    if (!saveResult.success) {
      showToast(saveResult.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      return;
    }

    const savedRecord = saveResult.data || record;

    setDatasets((prev) => {
      const list = [...(prev[targetCategory] || [])];
      if (!isNew && editingIndex !== null && editingIndex >= 0) {
        const prevId = list[editingIndex]._id || `${targetCategory}_${editingIndex}`;
        list[editingIndex] = { ...list[editingIndex], ...savedRecord, _id: prevId };
        showToast(`แก้ไขข้อมูล "${record[currentConfig.nameKey] || record.name}" สำเร็จ`);
      } else {
        list.unshift(savedRecord);
        showToast(`เพิ่มรายการ "${record[currentConfig.nameKey] || record.name}" เรียบร้อยแล้ว`);
      }
      return {
        ...prev,
        [targetCategory]: list,
        ...(targetCategory === 'research' ? { monitoring: list } : {}),
      };
    });
    setEditingItem(null);
    setEditingIndex(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const targetCategory = activeCategory === 'monitoring' ? 'research' : activeCategory;
    const targetId = deleteTarget.item._id || deleteTarget.item.id;
    if (targetId) {
      await deleteCategoryRecord(targetCategory, targetId);
    }

    setDatasets((prev) => {
      const list = [...(prev[targetCategory] || [])];
      const targetName = deleteTarget.item[currentConfig.nameKey] || deleteTarget.item.name || '';
      list.splice(deleteTarget.index, 1);
      showToast(`ลบรายการ "${targetName}" เรียบร้อยแล้ว`);
      return {
        ...prev,
        [targetCategory]: list,
        ...(targetCategory === 'research' ? { monitoring: list } : {}),
      };
    });
    setDeleteTarget(null);
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
    setCurrentPage(1);
    showToast(
      `นำเข้าข้อมูลเข้าหมวด ${CATEGORIES_CONFIG[targetCategory].title} สำเร็จ (${importedRows.length} รายการ - ${
        mode === 'append' ? 'โหมดต่อท้าย' : 'โหมดเขียนทับ'
      })`
    );
  };

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

      {/* 1. Header แบนราบ สะอาด คุมโทนระบบ */}
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
            จัดการและนำเข้าข้อมูลโครงการวิจัย โครงการพัฒนาวิชาการ ผลงานตีพิมพ์ทางวิชาการ งานบริการวิชาการ งานทรัพย์สินทางปัญญา และฐานข้อมูลบุคลากร
          </div>
        </div>
      </div>

      {/* 2. Top Segmented Horizontal Tabs */}
      <TopSegmentedTabs
        activeCategory={activeCategory}
        onSelectCategory={handleTabChange}
        counts={counts}
      />

      {activeCategory === 'kpi' ? (
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
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#008f44')}
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
                  showToast('อัปเดตกำหนดการและสถานะโครงการเรียบร้อยแล้ว');
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
        onClose={() => {
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
      />

      <ConfirmActionModal
        isOpen={Boolean(deleteTarget)}
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
        confirmText="ยืนยันการลบ"
        cancelText="ยกเลิก"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
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
        onApply={(filters) => {
          setSelectedDept(filters.selectedDept);
          setSelectedRole(filters.selectedRole);
          setSelectedImageStatus(filters.selectedImageStatus);
          setSelectedSubFilter(filters.selectedSubFilter);
          setSelectedCompleteness(filters.selectedCompleteness || 'all');
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />
    </div>
  );
};