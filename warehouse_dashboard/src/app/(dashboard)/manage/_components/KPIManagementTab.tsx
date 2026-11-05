'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterPopover, ActiveFilterChips, ConfirmActionModal } from '@/components/ui';
import {
  KPIItem,
  KPICategory,
  KPIReportingRoundConfig,
} from '@/types/kpi';
import {
  getStoredKPIs,
  deleteKPI,
  evaluateKPI,
  getStrategicPillar,
  getStoredReportingRounds,
} from '@/lib/kpiEngine';
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaFileExcel,
  FaFileExport,
  FaTimes,
  FaCalendarCheck,
  FaLink,
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { StrategicKpiModal } from '@/app/(dashboard)/kpi/_components/StrategicKpiFormView';
import { StrategicKpiRoundReportModal } from '@/app/(dashboard)/kpi/_components/StrategicKpiRoundReportView';

interface KPIManagementTabProps {
  datasets: Record<string, any[]>;
  onOpenImportExcel?: () => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const CATEGORY_LABELS: Record<KPICategory, string> = {
  research: 'โครงการวิจัย',
  academic: 'พัฒนาวิชาการ/หลักสูตร',
  publications: 'ผลงานตีพิมพ์ทางวิชาการ',
  service: 'งานบริการวิชาการ',
  ip: 'ทรัพย์สินทางปัญญา/เชิงพาณิชย์',
  personnel: 'บุคลากร/อาจารย์',
  strategy: 'ยุทธศาสตร์และความร่วมมือ',
};

const CATEGORY_STYLES: Record<KPICategory, { bg: string; border: string; color: string }> = {
  research: { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857' },
  academic: { bg: '#eef2ff', border: '#c7d2fe', color: '#4338ca' },
  publications: { bg: '#fffbeb', border: '#fde68a', color: '#b45309' },
  service: { bg: '#f0f9ff', border: '#bae6fd', color: '#0369a1' },
  ip: { bg: '#fff1f2', border: '#fecdd3', color: '#be123c' },
  personnel: { bg: '#faf5ff', border: '#e9d5ff', color: '#7e22ce' },
  strategy: { bg: '#f8fafc', border: '#cbd5e1', color: '#334155' },
};

const cleanSearchText = (str: string) => str.toLowerCase().replace(/[\s.\-_/\\()]/g, '');

export const KPIManagementTab: React.FC<KPIManagementTabProps> = ({
  datasets,
  onOpenImportExcel,
  showToast,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mapKpiIdParam = searchParams.get('mapKpiId');

  const [kpis, setKpis] = useState<KPIItem[]>(() => getStoredKPIs());
  const [reportingRounds, setReportingRounds] = useState<KPIReportingRoundConfig[]>(() =>
    getStoredReportingRounds().filter((r) => r.isActive !== false)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCalcType, setSelectedCalcType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== 'all') ||
    (selectedCalcType && selectedCalcType !== 'all') ||
    (selectedStatus && selectedStatus !== 'all');

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCalcType('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedKpis, setExpandedKpis] = useState<Record<string, boolean>>({});

  // Modal เพิ่ม/แก้ไขตัวชี้วัดตามแผนยุทธศาสตร์ (สไตล์เดียวกับหมวดหมู่อื่น)
  const [isStrategicKpiModalOpen, setIsStrategicKpiModalOpen] = useState(false);
  const [editingStrategicKpiId, setEditingStrategicKpiId] = useState<string | undefined>(undefined);

  // Modal รายงานผลตามรอบ + จัดการโครงการที่ผูกกับตัวชี้วัด (ยุบรวมเข้าด้วยกัน)
  const [roundReportKpiId, setRoundReportKpiId] = useState<string | null>(null);
  const [roundReportInitialRoundId, setRoundReportInitialRoundId] = useState<string | undefined>(
    undefined
  );

  const refreshList = () => {
    const list = getStoredKPIs();
    setKpis(list);
    setReportingRounds(getStoredReportingRounds().filter((r) => r.isActive !== false));
  };

  useEffect(() => {
    refreshList();
    const handleUpdate = () => refreshList();
    window.addEventListener('kpi_updated', handleUpdate);
    window.addEventListener('kpi_rounds_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kpi_updated', handleUpdate);
      window.removeEventListener('kpi_rounds_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Automatically open Unified Round Report & Project Mapping modal if ?mapKpiId=... is passed
  useEffect(() => {
    if (mapKpiIdParam && kpis.length > 0) {
      const target = kpis.find((k) => k.id === mapKpiIdParam);
      if (target) {
        setRoundReportInitialRoundId(undefined);
        setRoundReportKpiId(target.id);
      }
    }
  }, [mapKpiIdParam, kpis]);

  // เปิด Modal เพิ่มตัวชี้วัดตามแผนยุทธศาสตร์ (สไตล์เดียวกับหมวดหมู่อื่น)
  const handleOpenAdd = () => {
    setEditingStrategicKpiId(undefined);
    setIsStrategicKpiModalOpen(true);
  };

  // เปิด Modal แก้ไขตัวชี้วัดตามแผนยุทธศาสตร์ (สไตล์เดียวกับหมวดหมู่อื่น)
  const handleOpenEdit = (item: KPIItem) => {
    setEditingStrategicKpiId(item.id);
    setIsStrategicKpiModalOpen(true);
  };

  // เปิด Modal กรอกผลรายงานตามรอบ + จัดการโครงการที่ผูกกับตัวชี้วัด
  const handleOpenRoundReport = (item: KPIItem, roundId?: string) => {
    setRoundReportInitialRoundId(roundId);
    setRoundReportKpiId(item.id);
  };

  // Delete
  const handleDelete = (id: string) => {
    const item = kpis.find((k) => k.id === id);
    deleteKPI(id);
    setDeleteConfirmId(null);
    if (showToast) {
      showToast('ลบตัวชี้วัด ' + (item?.code || id) + ' เรียบร้อยแล้ว', 'success');
    }
    refreshList();
  };

  // Filtered KPI list
  const filteredKPIs = useMemo(() => {
    return kpis.filter((item) => {
      if (selectedCategory !== 'all') {
        if (
          selectedCategory.startsWith('strat_') &&
          !['strat_y1', 'strat_y2', 'strat_y3', 'strat_y4', 'strat_faculty'].includes(
            selectedCategory
          )
        ) {
          const code = selectedCategory.replace(/^strat_/, '').replace(/_/g, '.');
          if (item.strategyCode !== code && !item.code.startsWith(code)) return false;
        } else if (selectedCategory === 'strat_y1') {
          if (!item.strategyCode?.startsWith('1.') && !item.code.startsWith('ย.1')) return false;
        } else if (selectedCategory === 'strat_y2') {
          if (!item.strategyCode?.startsWith('2.') && !item.code.startsWith('ย.2')) return false;
        } else if (selectedCategory === 'strat_y3') {
          if (!item.strategyCode?.startsWith('3.') && !item.code.startsWith('ย.3')) return false;
        } else if (selectedCategory === 'strat_y4') {
          if (!item.strategyCode?.startsWith('4.') && !item.code.startsWith('ย.4')) return false;
        } else if (selectedCategory === 'strat_faculty') {
          if (!item.code.startsWith('KPI')) return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      if (selectedCalcType !== 'all' && item.calcType !== selectedCalcType) return false;

      if (selectedStatus !== 'all') {
        const evalRes = evaluateKPI(item, datasets);
        if (evalRes.status !== selectedStatus) return false;
      }

      if (!searchQuery.trim()) return true;

      const subStr = (item.subIndicators || [])
        .map(
          (s) =>
            `${s.title} ${s.evidence || ''} ${s.remarks || ''} ${(s.reporters || []).join(' ')} ${
              s.reporter || ''
            }`
        )
        .join(' ');
      const rawContent = [
        item.code,
        item.title,
        item.description || '',
        item.strategyCode || '',
        item.strategyName || '',
        item.planCode || '',
        item.planName || '',
        item.collectionPeriod || '',
        item.evidence || '',
        item.remarks || '',
        item.reporter || '',
        item.responsibleUnit || '',
        item.fiscalYear || '',
        subStr,
      ]
        .join(' ')
        .toLowerCase();
      const cleanedContent = cleanSearchText(rawContent);

      const tokens = searchQuery.trim().split(/\s+/).filter(Boolean);

      return tokens.every((token) => {
        const lowerToken = token.toLowerCase();
        const cleanedToken = cleanSearchText(token);

        const matchRaw = rawContent.includes(lowerToken);
        const matchClean = cleanedToken ? cleanedContent.includes(cleanedToken) : false;

        return matchRaw || matchClean;
      });
    });
  }, [kpis, searchQuery, selectedCategory, selectedCalcType, selectedStatus, datasets]);

  // Pagination
  const totalPages = Math.ceil(filteredKPIs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedKPIs = filteredKPIs.slice(startIndex, startIndex + itemsPerPage);

  const targetToDelete = useMemo(() => {
    if (!deleteConfirmId) return null;
    return kpis.find((k) => k.id === deleteConfirmId) || null;
  }, [deleteConfirmId, kpis]);

  const activeRounds = useMemo(() => {
    if (reportingRounds.length > 0) return reportingRounds;
    return [
      {
        id: 'round-6m',
        name: 'รอบ 6 เดือน',
        periodLabel: 'ต.ค. 68 - มี.ค. 69',
        startDate: '2025-10-01',
        endDate: '2026-03-31',
        isCumulative: true,
        sortOrder: 1,
      },
      {
        id: 'round-9m',
        name: 'รอบ 9 เดือน',
        periodLabel: 'ต.ค. 68 - ก.ค. 69',
        startDate: '2025-10-01',
        endDate: '2026-07-31',
        isCumulative: true,
        sortOrder: 2,
      },
    ];
  }, [reportingRounds]);

  // ส่งออกข้อมูลตัวชี้วัดตามแผนยุทธศาสตร์เป็นไฟล์ Excel (.xlsx)
  const handleExportExcel = () => {
    const rowsToExport = filteredKPIs.map((item, idx) => {
      const evalRes = evaluateKPI(item, datasets);
      const pillar = getStrategicPillar(item.strategyCode);
      const rowData: Record<string, any> = {
        ลำดับที่: idx + 1,
        ปีงบประมาณ: item.fiscalYear || '2569',
        รหัสยุทธศาสตร์: item.strategyCode || pillar?.code || '-',
        ชื่อยุทธศาสตร์: item.strategyName || pillar?.fullName || '-',
        รหัสแผนงาน: item.planCode || '-',
        ชื่อแผนงาน: item.planName || '-',
        รหัสตัวชี้วัด: item.code,
        ชื่อตัวชี้วัดตามแผนยุทธศาสตร์: item.title,
        คำอธิบายตัวชี้วัด: item.description || '-',
        หมวดหมู่ข้อมูลหลัก: CATEGORY_LABELS[item.category] || item.category,
        รอบการเก็บข้อมูล: item.collectionPeriod || 'ปีงบประมาณ',
        หน่วยนับ: item.unit,
        'เป้าหมาย 2569': item.targetLabel || item.targetValue,
        เป้าหมายส่วนงาน: item.departmentTarget !== undefined ? item.departmentTarget : '-',
      };

      activeRounds.forEach((round) => {
        const rVal =
          evalRes.valuesByRound?.[round.id] ??
          (round.id === 'round-6m'
            ? evalRes.value6M
            : round.id === 'round-9m'
            ? evalRes.value9M ?? evalRes.currentValue
            : null);
        const rTxt =
          evalRes.textsByRound?.[round.id] ||
          (round.id === 'round-6m'
            ? item.actual6MText
            : round.id === 'round-9m'
            ? item.actual9MText
            : undefined);
        rowData[`ผลการดำเนินงาน (${round.name})`] =
          rTxt || (rVal !== null && rVal !== undefined ? rVal : '-');
      });

      rowData['ความก้าวหน้า (%)'] = `${evalRes.percentage}%`;
      rowData['สถานะการดำเนินงาน'] = evalRes.statusLabel;
      rowData['จำนวนโครงการที่ผูก'] = (evalRes.matchedProjects || []).length;
      rowData['ผู้รายงาน'] = item.reporter || '-';
      rowData['หน่วยงานผู้รับผิดชอบ'] = item.responsibleUnit || '-';
      rowData['หลักฐานอ้างอิง'] = item.evidence || '-';
      rowData['หมายเหตุ / รายชื่อโครงการ'] = item.remarks || '-';
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ตัวชี้วัดตามแผนยุทธศาสตร์');
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `KU_KPS_Strategic_KPI_${dateStr}.xlsx`);
    if (showToast) {
      showToast(`ส่งออกข้อมูลตัวชี้วัดตามแผนยุทธศาสตร์ (${rowsToExport.length} รายการ) สำเร็จ`, 'success');
    }
  };

  const totalColSpan = 8 + activeRounds.length;

  return (
    <>
      {/* กล่องเนื้อหาหลัก */}
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* ฝั่งซ้าย: ค้นหา + ตัวกรอง */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                width: '280px',
                maxWidth: '100%',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              }}
            >
              <FaSearch style={{ color: '#94a3b8', fontSize: '13px' }} />
              <input
                type="text"
                placeholder="ค้นหา (เช่น 2.1-1, Mega Project, ชื่อตัวชี้วัด, ชื่อผู้รายงาน)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  color: '#1e293b',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
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

            <FilterPopover
              category="kpi"
              categoryTitle="ตัวชี้วัดตามแผนยุทธศาสตร์"
              totalCount={kpis.length}
              matchCount={filteredKPIs.length}
              filters={{
                departments: [],
                kpiStrategy: selectedCategory,
                kpiCalcType: selectedCalcType,
                kpiStatus: selectedStatus,
              }}
              onApply={(newFilters) => {
                setSelectedCategory(newFilters.kpiStrategy || 'all');
                setSelectedCalcType(newFilters.kpiCalcType || 'all');
                setSelectedStatus(newFilters.kpiStatus || 'all');
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
                  fontWeight: 400,
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

          {/* ฝั่งขวา: ปุ่มส่งออก Excel + เพิ่มตัวชี้วัดตามแผนยุทธศาสตร์ + นำเข้าไฟล์ Excel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportExcel}
              style={{
                display: 'flex',
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
              title="ส่งออกข้อมูลตัวชี้วัดตามแผนยุทธศาสตร์เป็นไฟล์ Excel (.xlsx)"
            >
              <FaFileExport style={{ color: '#64748b', fontSize: '12px' }} />
              <span>ส่งออก Excel</span>
            </button>

            <button
              onClick={handleOpenAdd}
              style={{
                display: 'flex',
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
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0fbf5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <FaPlus style={{ fontSize: '12px' }} />
              <span>เพิ่มตัวชี้วัดตามแผนยุทธศาสตร์</span>
            </button>

            {onOpenImportExcel && (
              <button
                onClick={onOpenImportExcel}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 16px',
                  backgroundColor: '#00A651',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0, 166, 81, 0.2)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#008c44')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#00A651')}
              >
                <FaFileExcel style={{ fontSize: '14px' }} />
                <span>นำเข้าไฟล์ Excel</span>
              </button>
            )}
          </div>
        </div>

        {/* แถบชิปแสดงตัวกรองที่เลือก */}
        {hasActiveFilters && (
          <div style={{ padding: '0 20px' }}>
            <ActiveFilterChips
              category="kpi"
              filters={{
                departments: [],
                kpiStrategy: selectedCategory,
                kpiCalcType: selectedCalcType,
                kpiStatus: selectedStatus,
              }}
              onRemove={(key) => {
                if (key === 'kpiStrategy') setSelectedCategory('all');
                if (key === 'kpiCalcType') setSelectedCalcType('all');
                if (key === 'kpiStatus') setSelectedStatus('all');
                setCurrentPage(1);
              }}
              onClearAll={handleResetFilters}
            />
          </div>
        )}

        {/* ตารางจัดการตัวชี้วัดตามแผนยุทธศาสตร์ */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              minWidth: '1260px',
              tableLayout: 'fixed',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#00A651' }}>
                <th
                  style={{
                    width: '4%',
                    minWidth: '50px',
                    textAlign: 'center',
                    padding: '12px 6px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    borderBottom: '2px solid #00A651',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ลำดับ
                </th>
                <th
                  style={{
                    width: '12%',
                    minWidth: '130px',
                    textAlign: 'left',
                    padding: '12px 10px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    borderBottom: '2px solid #00A651',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ยุทธศาสตร์ / แผนงาน
                </th>
                <th
                  style={{
                    width: '25%',
                    minWidth: '250px',
                    textAlign: 'left',
                    padding: '12px 10px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    borderBottom: '2px solid #00A651',
                    whiteSpace: 'nowrap',
                  }}
                >
                  รหัส และชื่อตัวชี้วัดตามแผนยุทธศาสตร์
                </th>
                <th
                  style={{
                    width: '10%',
                    minWidth: '110px',
                    textAlign: 'center',
                    padding: '12px 8px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    borderBottom: '2px solid #00A651',
                    whiteSpace: 'nowrap',
                  }}
                >
                  รอบการเก็บข้อมูล
                </th>
                <th
                  style={{
                    width: '9%',
                    minWidth: '95px',
                    textAlign: 'right',
                    padding: '12px 10px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    borderBottom: '2px solid #00A651',
                    whiteSpace: 'nowrap',
                  }}
                >
                  เป้าหมาย 2569
                </th>
                {activeRounds.map((round) => (
                  <th
                    key={round.id}
                    style={{
                      width: '8%',
                      minWidth: '92px',
                      textAlign: 'right',
                      padding: '12px 10px',
                      backgroundColor: '#00A651',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '12.5px',
                      borderBottom: '2px solid #00A651',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {round.name}
                  </th>
                ))}
                <th
                  style={{
                    width: '8%',
                    minWidth: '95px',
                    textAlign: 'left',
                    padding: '12px 10px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    borderBottom: '2px solid #00A651',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ความก้าวหน้า
                </th>
                <th
                  style={{
                    width: '9%',
                    minWidth: '125px',
                    textAlign: 'left',
                    padding: '12px 8px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    borderBottom: '2px solid #00A651',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ผู้รายงาน
                </th>
                <th
                  style={{
                    width: '8%',
                    minWidth: '105px',
                    textAlign: 'center',
                    padding: '12px 6px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    borderBottom: '2px solid #00A651',
                    whiteSpace: 'nowrap',
                  }}
                >
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedKPIs.length === 0 ? (
                <tr>
                  <td colSpan={totalColSpan} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    ไม่พบตัวชี้วัดที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                paginatedKPIs.map((kpi, idx) => {
                  const rowNum = startIndex + idx + 1;
                  const evalRes = evaluateKPI(kpi, datasets);
                  const catStyle = CATEGORY_STYLES[kpi.category] || {
                    bg: '#f1f5f9',
                    border: '#e2e8f0',
                    color: '#475569',
                  };
                  const pillar = getStrategicPillar(kpi.strategyCode);
                  const isExpanded = Boolean(expandedKpis[kpi.id]);
                  const subCount = kpi.subIndicators?.length || 0;

                  return (
                    <React.Fragment key={kpi.id}>
                      <tr
                        style={{
                          borderBottom: isExpanded ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                          backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fbf5')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            idx % 2 === 1 ? '#fafcfb' : '#ffffff')
                        }
                      >
                        <td
                          style={{
                            textAlign: 'center',
                            padding: '11px 6px',
                            color: '#94a3b8',
                            fontSize: '12.5px',
                            verticalAlign: 'top',
                          }}
                        >
                          {rowNum}
                        </td>

                        {/* ยุทธศาสตร์ / แผนงาน */}
                        <td style={{ padding: '11px 10px', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {pillar || kpi.strategyCode ? (
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: 'fit-content',
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  backgroundColor: pillar?.color.bg || '#ecfdf5',
                                  border: `1px solid ${pillar?.color.border || '#a7f3d0'}`,
                                  color: pillar?.color.text || '#047857',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                }}
                              >
                                ยุทธศาสตร์ที่ {pillar?.code || kpi.strategyCode}
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: 'fit-content',
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  backgroundColor: catStyle.bg,
                                  border: `1px solid ${catStyle.border}`,
                                  color: catStyle.color,
                                  fontSize: '11px',
                                  fontWeight: 600,
                                }}
                              >
                                {CATEGORY_LABELS[kpi.category] || kpi.category}
                              </span>
                            )}
                            {kpi.planCode && (
                              <span style={{ fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>
                                {kpi.planCode}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* รหัส และชื่อตัวชี้วัด */}
                        <td style={{ padding: '11px 10px', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span
                              style={{
                                fontWeight: 700,
                                color: '#00A651',
                                fontFamily: 'monospace',
                                fontSize: '12.5px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {kpi.code}
                            </span>
                            <div
                              onClick={() =>
                                setExpandedKpis((prev) => ({ ...prev, [kpi.id]: !prev[kpi.id] }))
                              }
                              style={{
                                fontWeight: 600,
                                color: '#0f172a',
                                fontSize: '13px',
                                lineHeight: 1.4,
                                cursor: 'pointer',
                              }}
                              title="คลิกเพื่อดูตัวชี้วัดย่อย คำอธิบาย หลักฐาน และหมายเหตุ"
                            >
                              {kpi.title}
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              flexWrap: 'wrap',
                              marginTop: '4px',
                            }}
                          >
                            {subCount > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedKpis((prev) => ({ ...prev, [kpi.id]: !prev[kpi.id] }))
                                }
                                style={{
                                  border: '1px solid #bae6fd',
                                  backgroundColor: '#f0f9ff',
                                  color: '#0369a1',
                                  borderRadius: '4px',
                                  padding: '1px 6px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                ตัวชี้วัดย่อย {subCount} รายการ
                              </button>
                            )}
                            {(kpi.description || kpi.evidence || kpi.remarks) && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedKpis((prev) => ({ ...prev, [kpi.id]: !prev[kpi.id] }))
                                }
                                style={{
                                  border: 'none',
                                  background: 'none',
                                  color: '#64748b',
                                  padding: 0,
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                }}
                              >
                                {isExpanded ? 'ซ่อนรายละเอียด' : 'ดูเกณฑ์/หลักฐาน/หมายเหตุ'}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* รอบการเก็บข้อมูล & หมวดหมู่ */}
                        <td
                          style={{
                            padding: '11px 8px',
                            textAlign: 'center',
                            verticalAlign: 'top',
                          }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                            {kpi.collectionPeriod || 'ปีงบประมาณ'}
                          </div>
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: '3px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              backgroundColor: catStyle.bg,
                              border: `1px solid ${catStyle.border}`,
                              color: catStyle.color,
                              fontSize: '10.5px',
                              fontWeight: 600,
                            }}
                          >
                            {CATEGORY_LABELS[kpi.category] || kpi.category}
                          </span>
                        </td>

                        {/* เป้าหมาย 2569 */}
                        <td
                          style={{
                            padding: '11px 10px',
                            textAlign: 'right',
                            verticalAlign: 'top',
                            fontWeight: 600,
                            color: '#334155',
                          }}
                        >
                          <div>
                            {kpi.targetLabel || kpi.targetValue.toLocaleString('th-TH')} {kpi.unit}
                          </div>
                          {kpi.departmentTarget !== undefined && (
                            <div style={{ fontSize: '10.5px', color: '#c2410c' }}>
                              (ส่วนงาน: {kpi.departmentTarget})
                            </div>
                          )}
                        </td>

                        {/* คอลัมน์ผลตามรอบการรายงานผล (Dynamic - คลิกเพื่อกรอกผลตามรอบได้ทันที) */}
                        {activeRounds.map((round) => {
                          const rVal =
                            evalRes.valuesByRound?.[round.id] ??
                            (round.id === 'round-6m'
                              ? evalRes.value6M
                              : round.id === 'round-9m'
                              ? evalRes.value9M ?? evalRes.currentValue
                              : null);
                          const rTxt =
                            evalRes.textsByRound?.[round.id] ||
                            (round.id === 'round-6m'
                              ? kpi.actual6MText
                              : round.id === 'round-9m'
                              ? kpi.actual9MText
                              : undefined);

                          return (
                            <td
                              key={round.id}
                              onClick={() => handleOpenRoundReport(kpi, round.id)}
                              title={`คลิกเพื่อกรอกผลรายงานหรือผูกโครงการ (${round.name})`}
                              style={{
                                padding: '11px 10px',
                                textAlign: 'right',
                                verticalAlign: 'top',
                                fontWeight: round.id === 'round-9m' ? 700 : 500,
                                color: round.id === 'round-9m' ? evalRes.statusColor : '#475569',
                                cursor: 'pointer',
                              }}
                            >
                              <span
                                style={{
                                  borderBottom: '1px dashed #cbd5e1',
                                  paddingBottom: '1px',
                                }}
                              >
                                {rTxt ||
                                  (rVal !== null && rVal !== undefined
                                    ? `${rVal.toLocaleString('th-TH')} ${kpi.unit}`
                                    : '-')}
                              </span>
                            </td>
                          );
                        })}

                        {/* ความก้าวหน้า */}
                        <td style={{ padding: '11px 10px', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div
                              style={{
                                flex: 1,
                                height: '6px',
                                backgroundColor: '#e2e8f0',
                                borderRadius: '4px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(evalRes.percentage, 100)}%`,
                                  height: '100%',
                                  backgroundColor: evalRes.statusColor,
                                  borderRadius: '4px',
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: '11.5px',
                                fontWeight: 700,
                                color: evalRes.statusColor,
                                minWidth: '34px',
                                textAlign: 'right',
                              }}
                            >
                              {evalRes.percentage}%
                            </span>
                          </div>
                          {(evalRes.matchedProjects || []).length > 0 && (
                            <div
                              onClick={() => handleOpenRoundReport(kpi)}
                              style={{
                                marginTop: '4px',
                                fontSize: '10.5px',
                                color: '#0284c7',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                              title="คลิกเพื่อดูโครงการที่ผูกกับตัวชี้วัดนี้"
                            >
                              <FaLink style={{ fontSize: '9px' }} />
                              <span>ผูก {(evalRes.matchedProjects || []).length} โครงการ</span>
                            </div>
                          )}
                        </td>

                        {/* ผู้รายงาน (แสดงชื่อจริงเต็มของบุคลากร/อาจารย์) */}
                        <td
                          style={{
                            padding: '11px 8px',
                            textAlign: 'left',
                            verticalAlign: 'top',
                          }}
                        >
                          {kpi.reporter ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              {kpi.reporter
                                .split(',')
                                .map((r) => r.trim())
                                .filter(Boolean)
                                .map((repName, rIdx) => (
                                  <span
                                    key={rIdx}
                                    style={{
                                      display: 'inline-block',
                                      width: 'fit-content',
                                      maxWidth: '100%',
                                      padding: '2px 8px',
                                      borderRadius: '6px',
                                      backgroundColor: '#f8fafc',
                                      border: '1px solid #e2e8f0',
                                      color: '#1e293b',
                                      fontSize: '11.5px',
                                      fontWeight: 500,
                                      lineHeight: 1.35,
                                    }}
                                  >
                                    {repName}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                        </td>

                        {/* จัดการ (ยุบรวมรายงานผลตามรอบ + ผูกโครงการ ไว้ในปุ่มเดียว พร้อมปุ่มแก้ไขและลบ) */}
                        <td
                          style={{
                            textAlign: 'center',
                            padding: '8px 6px',
                            whiteSpace: 'nowrap',
                            verticalAlign: 'top',
                          }}
                        >
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleOpenRoundReport(kpi)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                color: '#008c44',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#dcfce7';
                                e.currentTarget.style.borderColor = '#00A651';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f0fdf4';
                                e.currentTarget.style.borderColor = '#bbf7d0';
                              }}
                              title="กรอกผลรายงานตัวชี้วัดตามรอบการรายงานผล และจัดการโครงการที่ผูกกับตัวชี้วัด"
                            >
                              <FaCalendarCheck style={{ fontSize: '12px' }} />
                              <span>รายงานผล</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(kpi)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#e5a812',
                                cursor: 'pointer',
                                padding: '4px 5px',
                                borderRadius: '4px',
                                fontSize: '13px',
                              }}
                              title="แก้ไขโครงสร้างตัวชี้วัดตามแผนยุทธศาสตร์"
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(kpi.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '4px 5px',
                                borderRadius: '4px',
                                fontSize: '13px',
                              }}
                              title="ลบตัวชี้วัด"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* แถวขยายแสดงตัวชี้วัดย่อย + คำอธิบาย + หลักฐาน + หมายเหตุ */}
                      {isExpanded && (
                        <tr
                          style={{
                            backgroundColor: '#f8fafc',
                            borderBottom: '1px solid #cbd5e1',
                          }}
                        >
                          <td colSpan={totalColSpan} style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {kpi.subIndicators && kpi.subIndicators.length > 0 && (
                                <div
                                  style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    padding: '10px 14px',
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: 700,
                                      color: '#0f172a',
                                      marginBottom: '6px',
                                    }}
                                  >
                                    รายการตัวชี้วัดย่อย / โครงการส่วนงาน ({kpi.subIndicators.length}{' '}
                                    รายการ):
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '6px',
                                    }}
                                  >
                                    {kpi.subIndicators.map((sub, sIdx) => (
                                      <div
                                        key={sIdx}
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          flexWrap: 'wrap',
                                          gap: '10px',
                                          fontSize: '12px',
                                          padding: '6px 8px',
                                          borderRadius: '6px',
                                          backgroundColor: sub.title.includes('[โครงการส่วนงาน]')
                                            ? '#fff7ed'
                                            : '#f8fafc',
                                        }}
                                      >
                                        <span style={{ fontWeight: 500, color: '#1e293b', flex: 1 }}>
                                          {sub.title}
                                        </span>
                                        <span style={{ color: '#64748b' }}>
                                          เป้า: {sub.target ?? '-'} {sub.unit || ''}
                                        </span>
                                        {activeRounds.map((round) => {
                                          const val =
                                            sub.resultsByRound?.[round.id] ??
                                            (round.id === 'round-6m'
                                              ? sub.actual6M
                                              : round.id === 'round-9m'
                                              ? sub.actual9M
                                              : '-');
                                          return (
                                            <span key={round.id} style={{ color: '#047857' }}>
                                              {round.name}:{' '}
                                              <strong>
                                                {typeof val === 'number'
                                                  ? val.toLocaleString('th-TH')
                                                  : val ?? '-'}
                                              </strong>
                                            </span>
                                          );
                                        })}
                                        <span style={{ color: '#64748b' }}>
                                          ผู้รายงาน:{' '}
                                          {(sub.reporters && sub.reporters.join(', ')) ||
                                            sub.reporter ||
                                            kpi.reporter ||
                                            '-'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                  gap: '10px',
                                  fontSize: '12px',
                                }}
                              >
                                {kpi.description && (
                                  <div
                                    style={{
                                      backgroundColor: '#ffffff',
                                      padding: '10px 12px',
                                      borderRadius: '8px',
                                      border: '1px solid #e2e8f0',
                                    }}
                                  >
                                    <strong style={{ color: '#0f172a' }}>คำอธิบายตัวชี้วัด: </strong>
                                    <div style={{ color: '#475569', marginTop: '3px' }}>
                                      {kpi.description}
                                    </div>
                                  </div>
                                )}
                                {kpi.evidence && (
                                  <div
                                    style={{
                                      backgroundColor: '#ffffff',
                                      padding: '10px 12px',
                                      borderRadius: '8px',
                                      border: '1px solid #e2e8f0',
                                    }}
                                  >
                                    <strong style={{ color: '#0369a1' }}>หลักฐานอ้างอิง: </strong>
                                    <div style={{ color: '#475569', marginTop: '3px' }}>
                                      {kpi.evidence}
                                    </div>
                                  </div>
                                )}
                                {kpi.remarks && (
                                  <div
                                    style={{
                                      backgroundColor: '#ffffff',
                                      padding: '10px 12px',
                                      borderRadius: '8px',
                                      border: '1px solid #e2e8f0',
                                      gridColumn: '1 / -1',
                                      whiteSpace: 'pre-line',
                                    }}
                                  >
                                    <strong style={{ color: '#b45309' }}>
                                      หมายเหตุ / รายชื่อโครงการและบุคลากร:{' '}
                                    </strong>
                                    <div style={{ color: '#334155', marginTop: '3px' }}>
                                      {kpi.remarks}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: Pagination */}
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
            แสดง {filteredKPIs.length > 0 ? startIndex + 1 : 0} ถึง{' '}
            {Math.min(startIndex + itemsPerPage, filteredKPIs.length)} จากทั้งหมด{' '}
            <strong style={{ color: '#1e293b' }}>{filteredKPIs.length}</strong> ตัวชี้วัด
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>แสดง:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  height: '32px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>
                หน้า {currentPage} จาก {totalPages}
              </span>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentPage <= 1 ? '#f8fafc' : '#ffffff',
                  color: currentPage <= 1 ? '#cbd5e1' : '#334155',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                }}
                title="หน้าก่อนหน้า"
              >
                <FaChevronLeft />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentPage >= totalPages ? '#f8fafc' : '#ffffff',
                  color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                }}
                title="หน้าถัดไป"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal กรอกผลรายงานตัวชี้วัดตามรอบการรายงานผล + จัดการโครงการที่ผูกกับตัวชี้วัด (ยุบรวมเข้าด้วยกัน) */}
      {roundReportKpiId && (
        <StrategicKpiRoundReportModal
          isOpen={Boolean(roundReportKpiId)}
          kpiId={roundReportKpiId}
          initialRoundId={roundReportInitialRoundId}
          onClose={() => {
            setRoundReportKpiId(null);
            setRoundReportInitialRoundId(undefined);
          }}
          onSaved={() => {
            refreshList();
          }}
          showToast={showToast}
        />
      )}

      {/* Modal ยืนยันการลบตัวชี้วัด */}
      <ConfirmActionModal
        isOpen={Boolean(deleteConfirmId && targetToDelete)}
        type="danger"
        title="ยืนยันการลบตัวชี้วัด?"
        message={`คุณกำลังจะลบ ${targetToDelete?.code}: ${targetToDelete?.title} ออกจากระบบ`}
        detail="การกระทำนี้ไม่สามารถย้อนกลับได้"
        confirmText="ยืนยันการลบ"
        cancelText="ยกเลิก"
        onConfirm={() => {
          if (deleteConfirmId) handleDelete(deleteConfirmId);
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* Modal เพิ่ม/แก้ไขตัวชี้วัดตามแผนยุทธศาสตร์ (สไตล์เดียวกับหมวดหมู่อื่น) */}
      <StrategicKpiModal
        isOpen={isStrategicKpiModalOpen}
        onClose={() => {
          setIsStrategicKpiModalOpen(false);
          setEditingStrategicKpiId(undefined);
        }}
        kpiId={editingStrategicKpiId}
        onSaved={() => {
          refreshList();
          setIsStrategicKpiModalOpen(false);
          setEditingStrategicKpiId(undefined);
        }}
        showToast={showToast}
      />
    </>
  );
};
