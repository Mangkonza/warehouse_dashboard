'use client';

import React, { useState, useMemo } from 'react';
import { CategoryKey } from '@/types/dataManagement';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { DataTable } from '@/app/(dashboard)/manage/_components/DataTable';
import { FilterPopover, FilterState, ActiveFilterChips, SearchInput } from '@/components/ui';
import {
  itemMatchesDepartmentMulti,
  itemMatchesDateRange,
  itemMatchesNumericRanges,
} from '@/lib/filterMatching';
import { exportTableToExcel } from '@/lib/etlEngine';
import {
  FaFileExport,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaInbox,
} from 'react-icons/fa';

export interface MissionDataTableProps {
  categoryKey: CategoryKey;
  items: any[];
  title?: string;
  initialSearch?: string;
}

const parseBudget = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val || val === '-' || val === 'nan') return 0;
  const cleaned = String(val).replace(/,/g, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

const DEFAULT_FILTER_STATE: FilterState = {
  departments: [],
  deptCustomText: '',
  dateFrom: undefined,
  dateTo: undefined,
  numericRanges: {},
  journals: [],
  role: '',
  imageStatus: 'all',
  completeness: 'all',
  subFilter: '',
  sdgs: [],
  framework: 'all',
};

export const MissionDataTable: React.FC<MissionDataTableProps> = ({
  categoryKey,
  items,
  title,
  initialSearch = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const config = CATEGORIES_CONFIG[categoryKey];
  const tableTitle = title || config?.title || 'รายการข้อมูล';

  const hasActiveFilters = useMemo(() => {
    return (
      filterState.departments.length > 0 ||
      Boolean(filterState.deptCustomText) ||
      Boolean(filterState.dateFrom) ||
      Boolean(filterState.dateTo) ||
      Boolean(filterState.numericRanges && Object.keys(filterState.numericRanges).length > 0) ||
      Boolean(filterState.journals && filterState.journals.length > 0) ||
      Boolean(filterState.role) ||
      filterState.imageStatus !== 'all' ||
      filterState.completeness !== 'all' ||
      Boolean(filterState.subFilter) ||
      Boolean(filterState.sdgs && filterState.sdgs.length > 0) ||
      filterState.framework !== 'all' ||
      Boolean(searchQuery.trim())
    );
  }, [filterState, searchQuery]);

  const handleResetFilters = () => {
    setFilterState(DEFAULT_FILTER_STATE);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Filtered dataset matching DataManagementRoot logic
  const filteredData = useMemo(() => {
    const list = items || [];
    return list.filter((item: any) => {
      // 1. Department filter
      if (filterState.departments.length > 0 || filterState.deptCustomText) {
        if (!itemMatchesDepartmentMulti(item, filterState.departments.join(','), filterState.deptCustomText)) {
          return false;
        }
      }

      // 2. Date Range Filter
      if (filterState.dateFrom || filterState.dateTo) {
        if (!itemMatchesDateRange(item, filterState.dateFrom, filterState.dateTo)) {
          return false;
        }
      }

      // 3. Numeric Ranges Filter
      if (filterState.numericRanges && Object.keys(filterState.numericRanges).length > 0) {
        if (!itemMatchesNumericRanges(item, filterState.numericRanges)) {
          return false;
        }
      }

      // 4. Journals Filter (publications)
      if (categoryKey === 'publications' && filterState.journals && filterState.journals.length > 0) {
        const jVal = String(
          item.journal_index?.value ||
          item.evaluation?.journal_index?.value ||
          item.level ||
          item.journal ||
          item.remarks ||
          ''
        ).toLowerCase();
        const hasMatch = filterState.journals.some((target) => jVal.includes(target.toLowerCase()));
        if (!hasMatch) return false;
      }

      // 5. Dynamic SubFilter
      if (filterState.subFilter) {
        if (categoryKey === 'research') {
          const ext = parseBudget(item.budget_external);
          const int = parseBudget(item.budget_internal);
          if (filterState.subFilter === 'external' && ext <= 0) return false;
          if (filterState.subFilter === 'internal' && int <= 0) return false;
          if (filterState.subFilter === 'high_budget') {
            const tot = ext + int;
            if (tot < 1000000) return false;
          }
        } else if (categoryKey === 'publications') {
          const lvl = String(item.level || '').toLowerCase();
          const jIndexVal = String(item.journal_index?.value || item.evaluation?.journal_index?.value || '').toLowerCase();
          const remarks = String(item.remarks || '').toLowerCase();
          const jName = String(item.journal || '').toLowerCase();

          if (filterState.subFilter === 'q1') {
            const isQ1 = lvl.includes('q1') || jIndexVal.includes('q1') || remarks.includes('q1') || jName.includes('q1');
            if (!isQ1) return false;
          } else if (filterState.subFilter === 'q2') {
            const isQ2 = lvl.includes('q2') || jIndexVal.includes('q2') || remarks.includes('q2') || jName.includes('q2');
            if (!isQ2) return false;
          } else if (filterState.subFilter === 'inter') {
            const isInter = lvl.includes('นานาชาติ') || jIndexVal.startsWith('q') || remarks.includes('นานาชาติ');
            if (!isInter) return false;
          } else if (filterState.subFilter === 'tci') {
            const isTci = (lvl.includes('ชาติ') && !lvl.includes('นานาชาติ')) ||
                          lvl.includes('tci') ||
                          jIndexVal.includes('tci') ||
                          remarks.includes('tci');
            if (!isTci) return false;
          }
        } else if (categoryKey === 'ip') {
          const stat = String(item.status || '').toLowerCase();
          const type = String(item.type || '').toLowerCase();
          const regNo = String(item.registration_number || item.reg_info || item.reg_no || '').trim();
          if (filterState.subFilter === 'granted') {
            const isGranted = stat.includes('คุ้มครอง') || stat.includes('จดทะเบียน') || stat === 'granted' || (regNo !== '' && regNo !== '-');
            if (!isGranted) return false;
          } else if (filterState.subFilter === 'patent') {
            if ((!type.includes('สิทธิบัตร') || type.includes('อนุสิทธิบัตร')) && type !== 'p') return false;
          } else if (filterState.subFilter === 'petty') {
            if (!type.includes('อนุสิทธิบัตร')) return false;
          } else if (filterState.subFilter === 'copyright') {
            if (!type.includes('ลิขสิทธิ์')) return false;
          }
        }
      }

      // 6. Search term filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      if (config?.searchFields) {
        for (const field of config.searchFields) {
          const val = item[field];
          if (val && String(val).toLowerCase().includes(q)) {
            return true;
          }
        }
        return false;
      }

      // Default string match across top values
      return Object.values(item).some((v) =>
        v && typeof v === 'string' && v.toLowerCase().includes(q)
      );
    });
  }, [items, filterState, searchQuery, categoryKey, config]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = useMemo(() => {
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, startIndex, itemsPerPage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Search & Filter Toolbar - Exactly matching manage toolbar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
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
          {/* Left: Search input + FilterPopover + Reset */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              flex: 1,
              minWidth: '280px',
            }}
          >
            <div style={{ width: '100%', maxWidth: '320px' }}>
              <SearchInput
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                placeholder={`ค้นหา${tableTitle}...`}
              />
            </div>

            <FilterPopover
              category={categoryKey}
              categoryTitle={tableTitle}
              totalCount={items.length}
              matchCount={filteredData.length}
              filters={filterState}
              onApply={(newFilters) => {
                setFilterState(newFilters);
                setCurrentPage(1);
              }}
              onReset={handleResetFilters}
            />

            {hasActiveFilters && (
              <button
                type="button"
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
                  fontWeight: 500,
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

          {/* Right: Export Excel ONLY (No Add button, No Import Excel button) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => exportTableToExcel(filteredData, categoryKey)}
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
              title="ส่งออกตารางข้อมูลเป็น Excel"
            >
              <FaFileExport style={{ color: '#64748b', fontSize: '13px' }} />
              <span>ส่งออก Excel</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        <ActiveFilterChips
          filters={filterState}
          category={categoryKey}
          onRemove={(key, extra) => {
            setFilterState((prev) => {
              const updated = { ...prev };
              if (key === 'departments') {
                updated.departments = [];
                updated.deptCustomText = '';
              } else if (key === 'dateFrom') {
                updated.dateFrom = undefined;
              } else if (key === 'dateTo') {
                updated.dateTo = undefined;
              } else if (key === 'numericRanges' && updated.numericRanges && extra) {
                const nextRanges = { ...updated.numericRanges };
                delete nextRanges[extra];
                updated.numericRanges = nextRanges;
              } else if (key === 'journals') {
                updated.journals = [];
              } else if (key === 'role') {
                updated.role = '';
              } else if (key === 'imageStatus') {
                updated.imageStatus = 'all';
              } else if (key === 'completeness') {
                updated.completeness = 'all';
              } else if (key === 'subFilter') {
                updated.subFilter = '';
              } else if (key === 'sdgs') {
                updated.sdgs = [];
              } else if (key === 'framework') {
                updated.framework = 'all';
              }
              return updated;
            });
            setCurrentPage(1);
          }}
          onClearAll={handleResetFilters}
        />
      </div>

      {/* Main Table Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        {config?.columns ? (
          <DataTable
            key={`${categoryKey}-page-${currentPage}`}
            categoryKey={categoryKey}
            currentPage={currentPage}
            columns={config.columns}
            data={paginatedData}
            startIndex={startIndex}
            readOnly={true}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <FaInbox style={{ fontSize: '32px', margin: '0 auto 8px auto', display: 'block' }} />
            <span>ไม่พบโครงสร้างตาราง</span>
          </div>
        )}

        {/* Footer: Pagination & Records summary */}
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>แสดง:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  color: '#334155',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentPage === 1 ? '#f8fafc' : '#ffffff',
                  color: currentPage === 1 ? '#cbd5e1' : '#334155',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                title="หน้าก่อนหน้า"
              >
                <FaChevronLeft style={{ fontSize: '10px' }} />
              </button>

              <span style={{ fontSize: '12px', padding: '0 6px', color: '#475569' }}>
                หน้า <strong>{currentPage}</strong> / {totalPages || 1}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentPage === totalPages || totalPages === 0 ? '#f8fafc' : '#ffffff',
                  color: currentPage === totalPages || totalPages === 0 ? '#cbd5e1' : '#334155',
                  cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                title="หน้าถัดไป"
              >
                <FaChevronRight style={{ fontSize: '10px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
