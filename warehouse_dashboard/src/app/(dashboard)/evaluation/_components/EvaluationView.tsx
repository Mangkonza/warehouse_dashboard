'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as XLSX from 'xlsx';
import { CategoryKey } from '@/types/dataManagement';
import { CATEGORIES_CONFIG, DEPARTMENTS, getDepartmentAbbr } from '@/config/dataManagementConfig';
import { EvaluationRecord, EvaluationValue, isEvaluated, formatSdgLabel } from '@/types/evaluation';
import { TopSegmentedTabs, TabItem } from '@/components/ui/TopSegmentedTabs';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { EvaluationTag, EvaluationTags, LevelBadge, SdgTagList } from '@/components/ui/evaluation-tag';
import { formatDateBE } from '@/components/ui/RecordDetailDrawer';
import { FilterModal } from '@/app/(dashboard)/manage/_components/FilterModal';
import { EvaluationDrawer } from './EvaluationDrawer';
import { BulkEvaluationModal } from './BulkEvaluationModal';
import {
  getCachedCategoryData,
  fetchCategoryData,
  fetchEvaluations,
  getCachedEvaluations,
  saveEvaluationRecord,
  bulkSaveEvaluationRecords,
} from '@/lib/dataService';
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaFileExport,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCheckSquare,
  FaSquare,
  FaEdit,
} from 'react-icons/fa';

import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';

const EVAL_CATEGORIES: CategoryKey[] = [
  'research',
  'academic',
  'publications',
  'service',
  'ip',
];

const RAW_FALLBACKS: Record<string, any[]> = {
  research: rawResearch,
  academic: rawAcademic,
  publications: rawPublications,
  service: rawServices,
  ip: rawIP,
};

function getRecordId(item: any): string {
  return String(item.id || item._id || item.name || '').trim();
}

function getRecordEvalKey(category: string, item: any): string {
  return `${category.toLowerCase()}_${getRecordId(item)}`;
}

export const EvaluationView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Category (default 'research')
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('research');

  // Datasets for the 5 categories
  const [datasets, setDatasets] = useState<Record<string, any[]>>(() => {
    const initial: Record<string, any[]> = {};
    EVAL_CATEGORIES.forEach((cat) => {
      const cached = getCachedCategoryData(cat);
      initial[cat] = cached && Array.isArray(cached) && cached.length > 0
        ? cached
        : RAW_FALLBACKS[cat] || [];
    });
    return initial;
  });

  // Evaluation store
  const [evalMap, setEvalMap] = useState<Record<string, EvaluationRecord>>(() => {
    return getCachedEvaluations();
  });

  // Toolbar filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'unevaluated' | 'evaluated' | 'all'>('all');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Bulk selection
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Drawer state
  const [drawerRecord, setDrawerRecord] = useState<any | null>(null);
  const [drawerIndex, setDrawerIndex] = useState<number>(-1);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Fetch API data on mount
  useEffect(() => {
    let isMounted = true;

    // Load evaluations from server
    fetchEvaluations().then((data) => {
      if (isMounted && data) {
        setEvalMap(data);
      }
    });

    // Load category data
    EVAL_CATEGORIES.forEach((cat) => {
      fetchCategoryData(cat).then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setDatasets((prev) => ({ ...prev, [cat]: data }));
        }
      });
    });

    const handleEvalUpdate = () => {
      setEvalMap(getCachedEvaluations());
    };
    window.addEventListener('ku_evaluations_updated', handleEvalUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('ku_evaluations_updated', handleEvalUpdate);
    };
  }, []);

  // Handle deep link ?category=...&id=...
  useEffect(() => {
    const catParam = searchParams.get('category');
    const idParam = searchParams.get('id');

    if (catParam && EVAL_CATEGORIES.includes(catParam as CategoryKey)) {
      setActiveCategory(catParam as CategoryKey);

      if (idParam) {
        const catList = datasets[catParam] || RAW_FALLBACKS[catParam] || [];
        const found = catList.find((item: any) => {
          const itemKey = getRecordId(item);
          return (
            itemKey === idParam ||
            String(item.id).trim() === idParam.trim() ||
            String(item._id).trim() === idParam.trim() ||
            String(item.name).trim() === idParam.trim()
          );
        });

        if (found) {
          setDrawerRecord(found);
          const idx = catList.indexOf(found);
          setDrawerIndex(idx >= 0 ? idx : 0);
        }
      }
    }
  }, [searchParams, datasets]);

  // Reactive Unevaluated Counts per Category (for top tab badges)
  const unevaluatedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    EVAL_CATEGORIES.forEach((cat) => {
      const list = datasets[cat] || [];
      let unCount = 0;
      list.forEach((item) => {
        const key = getRecordEvalKey(cat, item);
        const ev = evalMap[key];
        if (!isEvaluated(cat, ev)) {
          unCount += 1;
        }
      });
      counts[cat] = unCount;
    });
    return counts;
  }, [datasets, evalMap]);

  // Current list for active category
  const currentCategoryList = useMemo(() => {
    return datasets[activeCategory] || [];
  }, [datasets, activeCategory]);

  // Progress metrics for active category
  const categoryProgress = useMemo(() => {
    const total = currentCategoryList.length;
    let evaluated = 0;
    currentCategoryList.forEach((item) => {
      const key = getRecordEvalKey(activeCategory, item);
      if (isEvaluated(activeCategory, evalMap[key])) {
        evaluated += 1;
      }
    });
    const percent = total > 0 ? Math.round((evaluated / total) * 100) : 0;
    return { evaluated, total, percent };
  }, [currentCategoryList, activeCategory, evalMap]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return currentCategoryList.filter((item: any) => {
      const key = getRecordEvalKey(activeCategory, item);
      const ev = evalMap[key];
      const evaluated = isEvaluated(activeCategory, ev);

      // 1. Status Filter
      if (statusFilter === 'unevaluated' && evaluated) return false;
      if (statusFilter === 'evaluated' && !evaluated) return false;

      // 2. Department Filter
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

      // 3. Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const nameMatch = String(item.name || item.topic_title || '').toLowerCase().includes(q);
        const idMatch = String(item.id || item._id || '').toLowerCase().includes(q);
        const personMatch = String(
          item.head || item.person || item.owner || item.creator || item.inventor || ''
        ).toLowerCase().includes(q);
        const deptMatch = String(item.department || '').toLowerCase().includes(q);
        if (!nameMatch && !idMatch && !personMatch && !deptMatch) {
          return false;
        }
      }

      return true;
    });
  }, [currentCategoryList, activeCategory, evalMap, statusFilter, selectedDept, searchTerm]);

  // Reset page and selection when category or filters change
  const handleTabChange = (cat: CategoryKey) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    setSelectedRowIds(new Set());
    setDrawerRecord(null);
  };

  // Pagination slice
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const pageItems = useMemo(() => {
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, startIndex, itemsPerPage]);

  // Checkbox selection handlers
  const handleToggleSelectRow = (rowId: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const handleToggleSelectAllPage = () => {
    const pageKeys = pageItems.map((r) => getRecordId(r));
    const allSelected = pageKeys.length > 0 && pageKeys.every((k) => selectedRowIds.has(k));

    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageKeys.forEach((k) => next.delete(k));
      } else {
        pageKeys.forEach((k) => next.add(k));
      }
      return next;
    });
  };

  const isAllPageSelected =
    pageItems.length > 0 && pageItems.every((r) => selectedRowIds.has(getRecordId(r)));

  // Selected records array for bulk evaluation
  const selectedRecordsList = useMemo(() => {
    return currentCategoryList.filter((r) => selectedRowIds.has(getRecordId(r)));
  }, [currentCategoryList, selectedRowIds]);

  // Open drawer for a record
  const handleOpenDrawer = (record: any) => {
    const idx = filteredData.findIndex((r) => getRecordId(r) === getRecordId(record));
    setDrawerRecord(record);
    setDrawerIndex(idx >= 0 ? idx : 0);
  };

  // Drawer Prev / Next handlers
  const handleDrawerPrev = () => {
    if (drawerIndex > 0) {
      const prevIdx = drawerIndex - 1;
      setDrawerIndex(prevIdx);
      setDrawerRecord(filteredData[prevIdx]);
    }
  };

  const handleDrawerNext = () => {
    if (drawerIndex < filteredData.length - 1) {
      const nextIdx = drawerIndex + 1;
      setDrawerIndex(nextIdx);
      setDrawerRecord(filteredData[nextIdx]);
    }
  };

  // Single Save Handler
  const handleSaveEvaluation = async (
    record: any,
    val: EvaluationValue
  ) => {
    const recordId = getRecordId(record);
    const result = await saveEvaluationRecord({
      category: activeCategory,
      record_id: recordId,
      sdg_ids: val.sdg_ids || [],
      i_type: val.i_type ?? null,
      journal_index: val.journal_index ?? null,
    });

    if (result.success && result.data) {
      const key = `${activeCategory.toLowerCase()}_${recordId}`;
      setEvalMap((prev) => ({ ...prev, [key]: result.data! }));
      showToast('บันทึกการประเมินเรียบร้อย');
    } else {
      throw new Error(result.error || 'เกิดข้อผิดพลาดในการบันทึกการประเมิน');
    }
  };

  // Bulk Save Handler
  const handleBulkApply = async (draft: EvaluationValue) => {
    if (selectedRecordsList.length === 0) return;

    const itemsToSave: Partial<EvaluationRecord>[] = selectedRecordsList.map((record) => {
      const recordId = getRecordId(record);
      const key = `${activeCategory.toLowerCase()}_${recordId}`;
      const existing = evalMap[key];

      // Merge SDGs (union)
      const existingSdgs = Array.isArray(existing?.sdg_ids) ? existing.sdg_ids : [];
      const newSdgs = Array.isArray(draft.sdg_ids) ? draft.sdg_ids : [];
      const mergedSdgs = Array.from(new Set([...existingSdgs, ...newSdgs])).sort((a, b) => a - b);

      // Merge I am / I see (update if draft set)
      const mergedIType = draft.i_type !== null ? draft.i_type : (existing?.i_type ?? null);

      // Merge Journal Index (update if draft set)
      const mergedJournal = draft.journal_index !== null ? draft.journal_index : (existing?.journal_index ?? null);

      return {
        category: activeCategory,
        record_id: recordId,
        sdg_ids: mergedSdgs,
        i_type: mergedIType,
        journal_index: mergedJournal,
      };
    });

    const result = await bulkSaveEvaluationRecords(itemsToSave);
    if (result.success && result.data) {
      const updatedMap = { ...evalMap };
      result.data.forEach((rec) => {
        const key = `${rec.category.toLowerCase()}_${String(rec.record_id).trim()}`;
        updatedMap[key] = rec;
      });
      setEvalMap(updatedMap);
      setSelectedRowIds(new Set());
      showToast('บันทึกเรียบร้อย');
    } else {
      alert(result.error || 'เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  // Excel Export
  const handleExportExcel = () => {
    const catConfig = CATEGORIES_CONFIG[activeCategory];
    const exportRows = filteredData.map((item, idx) => {
      const key = getRecordEvalKey(activeCategory, item);
      const ev = evalMap[key];
      const evaluated = isEvaluated(activeCategory, ev);

      const row: Record<string, any> = {
        ลำดับที่: idx + 1,
      };

      if (activeCategory === 'research') {
        row['รหัสโครงการ'] = item.id || '-';
        row['ชื่อโครงการ'] = item.name || '-';
        row['หัวหน้าโครงการ'] = item.head || '-';
        row['หน่วยงานรับผิดชอบ'] = item.department || '-';
      } else if (activeCategory === 'academic') {
        row['ชื่อโครงการ'] = item.name || '-';
        row['หัวหน้าโครงการ'] = item.head || '-';
        row['หน่วยงานดำเนินการ'] = item.department || '-';
      } else if (activeCategory === 'publications') {
        row['ชื่อผลงานทางวิชาการ'] = item.name || '-';
        row['ชนิดของผลงาน'] = item.type || '-';
        row['ระดับ'] = item.level || '-';
        row['เจ้าของผลงาน'] = item.owner || '-';
        row['สังกัดภาควิชา/สาขาวิชา'] = item.department || '-';
      } else if (activeCategory === 'service') {
        row['วัน/เดือน/ปี'] = formatDateBE(item.date);
        row['เรื่อง'] = item.name || '-';
        row['ประเภท'] = item.service_type || '-';
        row['ชื่อ - นามสกุล'] = item.person || '-';
        row['ภาควิชา/ศูนย์ฯ'] = item.department || '-';
      } else if (activeCategory === 'ip') {
        row['เรื่อง'] = item.name || '-';
        row['ประเภททรัพย์สินทางปัญญา'] = item.type || '-';
        row['ผู้ประดิษฐ์'] = item.creator || '-';
        row['สังกัด'] = item.department || '-';
      }

      row['SDGs'] =
        ev?.sdg_ids && ev.sdg_ids.length > 0
          ? ev.sdg_ids
              .slice()
              .sort((a, b) => a - b)
              .map((n) => formatSdgLabel(n))
              .join(', ')
          : '-';

      row['I am / I see'] =
        ev?.i_type === 'I_AM' ? 'I am' : ev?.i_type === 'I_SEE' ? 'I see' : '-';

      if (activeCategory === 'publications') {
        row['Q / TCI'] = ev?.journal_index?.value || '-';
      }

      row['สถานะ'] = evaluated ? 'ประเมินแล้ว' : 'ยังไม่ประเมิน';

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `การประเมิน_${catConfig.title}`.substring(0, 31));
    XLSX.writeFile(
      wb,
      `การประเมิน_${catConfig.key}_${new Date().toISOString().substring(0, 10)}.xlsx`
    );
  };

  const tabsConfig: TabItem<CategoryKey>[] = [
    { key: 'research', label: 'โครงการวิจัย', count: unevaluatedCounts['research'] },
    { key: 'academic', label: 'โครงการพัฒนาวิชาการ', count: unevaluatedCounts['academic'] },
    { key: 'publications', label: 'ผลงานตีพิมพ์ทางวิชาการ', count: unevaluatedCounts['publications'] },
    { key: 'service', label: 'งานบริการวิชาการ', count: unevaluatedCounts['service'] },
    { key: 'ip', label: 'งานทรัพย์สินทางปัญญา', count: unevaluatedCounts['ip'] },
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
            การประเมิน
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            ประเมินความสอดคล้องเป้าหมายการพัฒนาที่ยั่งยืน (SDGs), กรอบ I am / I see และคุณภาพผลงานทางวิชาการ
          </div>
        </div>
      </div>

      {/* 2. Top Segmented Horizontal Tabs */}
      <TopSegmentedTabs
        activeCategory={activeCategory}
        onSelectCategory={handleTabChange}
        tabs={tabsConfig}
      />

      {/* 3. Main Card Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Action & Filter Toolbar */}
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
          {/* Left: Search, Filter, Status Toggle, Progress */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              flex: '1 1 auto',
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
                maxWidth: '220px',
                minWidth: '160px',
              }}
            >
              <FaSearch style={{ color: '#94a3b8', marginRight: '8px', fontSize: '13px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="ค้นหา..."
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
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                >
                  <FaTimes style={{ fontSize: '12px' }} />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                border: selectedDept ? '1px solid #00A651' : '1px solid #cbd5e1',
                backgroundColor: selectedDept ? '#f0fdf4' : '#ffffff',
                color: selectedDept ? '#00A651' : '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FaFilter style={{ fontSize: '12px' }} />
              <span>ตัวกรอง</span>
              {selectedDept && (
                <span
                  style={{
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    borderRadius: '10px',
                    fontSize: '10px',
                    padding: '1px 6px',
                    marginLeft: '2px',
                  }}
                >
                  1
                </span>
              )}
            </button>

            {/* Status Toggle Control: ทั้งหมด, ยังไม่ประเมิน, ประเมินแล้ว (default: ยังไม่ประเมิน) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '3px',
                border: '1px solid #e2e8f0',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('unevaluated');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: statusFilter === 'unevaluated' ? '#ffffff' : 'transparent',
                  color: statusFilter === 'unevaluated' ? '#0f172a' : '#64748b',
                  boxShadow: statusFilter === 'unevaluated' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                ยังไม่ประเมิน
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusFilter('evaluated');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: statusFilter === 'evaluated' ? '#ffffff' : 'transparent',
                  color: statusFilter === 'evaluated' ? '#0f172a' : '#64748b',
                  boxShadow: statusFilter === 'evaluated' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                ประเมินแล้ว
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: statusFilter === 'all' ? '#ffffff' : 'transparent',
                  color: statusFilter === 'all' ? '#0f172a' : '#64748b',
                  boxShadow: statusFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                ทั้งหมด
              </button>
            </div>

            {/* Progress Display: ประเมินแล้ว X จาก Y + Thin Progress Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                ประเมินแล้ว {categoryProgress.evaluated} จาก {categoryProgress.total}
              </span>
              <div
                style={{
                  width: '90px',
                  height: '6px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${categoryProgress.percent}%`,
                    height: '100%',
                    backgroundColor: '#00A651',
                    borderRadius: '999px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right: Bulk Action & Export */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {selectedRowIds.size > 0 && (
              <>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#059669',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    padding: '5px 12px',
                    borderRadius: '8px',
                  }}
                >
                  เลือกแล้ว {selectedRowIds.size} รายการ
                </span>

                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
                  }}
                >
                  <FaCheckSquare style={{ fontSize: '13px' }} />
                  <span>ประเมินรายการที่เลือก</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleExportExcel}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FaFileExport style={{ color: '#00A651', fontSize: '13px' }} />
              <span>ส่งออก Excel</span>
            </button>
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
                <th style={{ width: '55px', padding: '12px 8px', textAlign: 'center' }}>
                  ลำดับที่
                </th>

                {/* Category Columns */}
                {activeCategory === 'research' && (
                  <>
                    <th style={{ minWidth: '240px', padding: '12px 12px' }}>
                      ชื่อโครงการ
                    </th>
                    <th style={{ width: '150px', padding: '12px 10px' }}>
                      หัวหน้าโครงการ
                    </th>
                    <th style={{ width: '120px', padding: '12px 10px' }}>
                      สังกัด
                    </th>
                  </>
                )}

                {activeCategory === 'academic' && (
                  <>
                    <th style={{ minWidth: '240px', padding: '12px 12px' }}>
                      ชื่อโครงการ
                    </th>
                    <th style={{ width: '160px', padding: '12px 10px' }}>
                      หัวหน้าโครงการ
                    </th>
                    <th style={{ width: '120px', padding: '12px 10px' }}>
                      สังกัด
                    </th>
                  </>
                )}

                {activeCategory === 'publications' && (
                  <>
                    <th style={{ minWidth: '220px', padding: '12px 12px' }}>
                      ชื่อผลงานทางวิชาการ
                    </th>
                    <th style={{ width: '110px', padding: '12px 10px', textAlign: 'center' }}>
                      ชนิดของผลงาน
                    </th>
                    <th style={{ width: '90px', padding: '12px 8px', textAlign: 'center' }}>
                      ระดับ
                    </th>
                    <th style={{ width: '150px', padding: '12px 10px' }}>
                      เจ้าของผลงาน
                    </th>
                    <th style={{ width: '120px', padding: '12px 10px' }}>
                      สังกัด
                    </th>
                  </>
                )}

                {activeCategory === 'service' && (
                  <>
                    <th style={{ width: '95px', padding: '12px 8px', textAlign: 'center' }}>
                      วัน/เดือน/ปี
                    </th>
                    <th style={{ minWidth: '220px', padding: '12px 12px' }}>
                      เรื่อง
                    </th>
                    <th style={{ width: '110px', padding: '12px 10px', textAlign: 'center' }}>
                      ประเภท
                    </th>
                    <th style={{ width: '150px', padding: '12px 10px' }}>
                      ชื่อ - นามสกุล
                    </th>
                    <th style={{ width: '120px', padding: '12px 10px' }}>
                      สังกัด
                    </th>
                  </>
                )}

                {activeCategory === 'ip' && (
                  <>
                    <th style={{ minWidth: '240px', padding: '12px 12px' }}>
                      เรื่อง
                    </th>
                    <th style={{ width: '140px', padding: '12px 10px', textAlign: 'center' }}>
                      ประเภททรัพย์สินทางปัญญา
                    </th>
                    <th style={{ width: '150px', padding: '12px 10px' }}>
                      ผู้ประดิษฐ์
                    </th>
                    <th style={{ width: '120px', padding: '12px 10px' }}>
                      สังกัด
                    </th>
                  </>
                )}

                {/* Common Evaluation Columns */}
                <th style={{ minWidth: '150px', padding: '12px 10px' }}>
                  SDGs
                </th>
                <th style={{ width: '90px', padding: '12px 10px', textAlign: 'center' }}>
                  I am / I see
                </th>
                {activeCategory === 'publications' && (
                  <th style={{ width: '90px', padding: '12px 10px', textAlign: 'center' }}>
                    Q / TCI
                  </th>
                )}
                <th style={{ width: '100px', padding: '12px 10px', textAlign: 'center' }}>
                  สถานะ
                </th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeCategory === 'publications' ? 9 : 8}
                    style={{
                      textAlign: 'center',
                      padding: '40px 16px',
                      color: '#94a3b8',
                      fontSize: '13px',
                    }}
                  >
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                pageItems.map((item, rowIdx) => {
                  const recordId = getRecordId(item);
                  const key = getRecordEvalKey(activeCategory, item);
                  const ev = evalMap[key];
                  const evaluated = isEvaluated(activeCategory, ev);
                  const actualRowNo = startIndex + rowIdx + 1;

                  return (
                    <tr
                      key={recordId || rowIdx}
                      onClick={() => handleOpenDrawer(item)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#fafbfc',
                        transition: 'background-color 0.12s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ecfdf5')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = rowIdx % 2 === 0 ? '#ffffff' : '#fafbfc')}
                      title="คลิกเพื่อประเมินรายการนี้"
                    >
                      {/* ลำดับที่ */}
                      <td style={{ padding: '10px 8px', textAlign: 'center', color: '#64748b' }}>
                        {actualRowNo}
                      </td>

                      {/* Research columns (without รหัสโครงการ) */}
                      {activeCategory === 'research' && (
                        <>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>
                            <div className="line-clamp-2" title={item.name}>
                              {item.name || '-'}
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px', color: '#334155' }}>
                            {item.head || '-'}
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <DepartmentBadge value={item.department} />
                          </td>
                        </>
                      )}

                      {/* Academic columns */}
                      {activeCategory === 'academic' && (
                        <>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>
                            <div className="line-clamp-2" title={item.name}>
                              {item.name || '-'}
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px', color: '#334155' }}>
                            {item.head || '-'}
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <DepartmentBadge value={item.department} />
                          </td>
                        </>
                      )}

                      {/* Publications columns */}
                      {activeCategory === 'publications' && (
                        <>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>
                            <div className="line-clamp-2" title={item.name}>
                              {item.name || '-'}
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                            <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
                              {item.type || '-'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                            <LevelBadge value={item.level} />
                          </td>
                          <td style={{ padding: '10px 10px', color: '#334155' }}>
                            {item.owner || '-'}
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <DepartmentBadge value={item.department} />
                          </td>
                        </>
                      )}

                      {/* Service columns */}
                      {activeCategory === 'service' && (
                        <>
                          <td style={{ padding: '10px 8px', textAlign: 'center', color: '#64748b' }}>
                            {formatDateBE(item.date)}
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>
                            <div className="line-clamp-2" title={item.name}>
                              {item.name || '-'}
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                            <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
                              {item.service_type || '-'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 10px', color: '#334155' }}>
                            {item.person || '-'}
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <DepartmentBadge value={item.department} />
                          </td>
                        </>
                      )}

                      {/* IP columns */}
                      {activeCategory === 'ip' && (
                        <>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>
                            <div className="line-clamp-2" title={item.name}>
                              {item.name || '-'}
                            </div>
                          </td>
                          <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                            <span className="inline-block px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-700 font-medium">
                              {item.type || '-'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 10px', color: '#334155' }}>
                            {item.creator || '-'}
                          </td>
                          <td style={{ padding: '10px 10px' }}>
                            <DepartmentBadge value={item.department} />
                          </td>
                        </>
                      )}

                      {/* Evaluation: SDGs (Shared global SdgTagList: "SDG 1", "SDG 7" with max 3 and +N) */}
                      <td style={{ padding: '10px 10px' }}>
                        {ev?.sdg_ids && ev.sdg_ids.length > 0 ? (
                          <SdgTagList
                            sdgIds={ev.sdg_ids}
                            maxSdgs={3}
                          />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Evaluation: I am / I see (Tag component with .tag-iam) */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        {ev?.i_type ? (
                          <EvaluationTag
                            kind="iam"
                            label={ev.i_type === 'I_AM' ? 'I AM' : 'I SEE'}
                          />
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Evaluation: Q / TCI (Publications only: Tag component with .tag-journal) */}
                      {activeCategory === 'publications' && (
                        <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                          {ev?.journal_index?.value ? (
                            <EvaluationTag
                              kind="journal"
                              label={ev.journal_index.value}
                            />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      )}

                      {/* Evaluation Status Chip */}
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11.5px] font-bold ${
                            evaluated
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {evaluated ? 'ประเมินแล้ว' : 'ยังไม่ประเมิน'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Footer */}
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

      {/* Right Evaluation Drawer */}
      <EvaluationDrawer
        isOpen={drawerRecord !== null}
        onClose={() => setDrawerRecord(null)}
        category={activeCategory}
        record={drawerRecord}
        evaluation={
          drawerRecord
            ? evalMap[getRecordEvalKey(activeCategory, drawerRecord)] || null
            : null
        }
        onSave={handleSaveEvaluation}
        hasPrev={drawerIndex > 0}
        hasNext={drawerIndex >= 0 && drawerIndex < filteredData.length - 1}
        onPrev={handleDrawerPrev}
        onNext={handleDrawerNext}
        currentIndex={drawerIndex}
        totalInList={filteredData.length}
      />

      {/* Bulk Evaluation Modal */}
      <BulkEvaluationModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        category={activeCategory}
        selectedRecords={selectedRecordsList}
        onApply={handleBulkApply}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeCategory={activeCategory}
        config={CATEGORIES_CONFIG[activeCategory]}
        selectedDept={selectedDept}
        selectedRole={selectedRole}
        selectedImageStatus="all"
        selectedSubFilter=""
        onApply={({ selectedDept: d, selectedRole: r }) => {
          setSelectedDept(d);
          setSelectedRole(r);
          setCurrentPage(1);
          setIsFilterModalOpen(false);
        }}
        onReset={() => {
          setSelectedDept('');
          setSelectedRole('');
          setCurrentPage(1);
          setIsFilterModalOpen(false);
        }}
      />
    </div>
  );
};
