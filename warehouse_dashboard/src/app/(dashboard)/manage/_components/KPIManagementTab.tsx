'use client';

import React, { useState, useMemo } from 'react';
import { ConfirmActionModal } from '@/components/ui';
import { KPIItem, KPICalcType, KPICategory, FilterOperator } from '@/types/kpi';
import {
  getStoredKPIs,
  addKPI,
  updateKPI,
  deleteKPI,
  resetKPIsToDefault,
  evaluateKPI,
  includeProjectInKPI,
  excludeProjectFromKPI,
  ENGINEERING_DEPARTMENTS,
} from '@/lib/kpiEngine';
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaRedoAlt,
  FaSearch,
  FaCalculator,
  FaSave,
  FaBullseye,
  FaChevronLeft,
  FaChevronRight,
  FaFolderOpen,
  FaCheckCircle,
  FaLink,
  FaUnlink,
} from 'react-icons/fa';

interface KPIManagementTabProps {
  datasets: Record<string, any[]>;
}

const CATEGORY_LABELS: Record<KPICategory, string> = {
  research: 'โครงการวิจัย',
  academic: 'โครงการพัฒนาวิชาการ',
  publications: 'ผลงานตีพิมพ์ทางวิชาการ',
  service: 'งานบริการวิชาการ',
  ip: 'งานทรัพย์สินทางปัญญา',
  personnel: 'บุคลากร/อาจารย์',
  strategy: 'ยุทธศาสตร์คณะฯ',
};

// 1. ชุดสีพาสเทลเฉพาะสำหรับแต่ละหมวดหมู่ (7 สีไม่ซ้ำกัน)
const CATEGORY_STYLES: Record<KPICategory, { bg: string; border: string; color: string }> = {
  research: { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857' },       // Emerald Pastel
  academic: { bg: '#eef2ff', border: '#c7d2fe', color: '#4338ca' },       // Indigo Pastel
  publications: { bg: '#fffbeb', border: '#fde68a', color: '#b45309' },   // Amber Pastel
  service: { bg: '#f0f9ff', border: '#bae6fd', color: '#0369a1' },        // Sky Pastel
  ip: { bg: '#fff1f2', border: '#fecdd3', color: '#be123c' },             // Rose Pastel
  personnel: { bg: '#faf5ff', border: '#e9d5ff', color: '#7e22ce' },      // Purple Pastel
  strategy: { bg: '#f8fafc', border: '#cbd5e1', color: '#334155' },       // Slate Pastel
};

const CALC_LABELS: Record<KPICalcType, { label: string; desc: string }> = {
  auto_sum: {
    label: 'รวมตัวเลขสะสม',
    desc: 'รวมยอดเงินหรือตัวเลข จากฟิลด์ที่กำหนดแบบอัตโนมัติ',
  },
  auto_count: {
    label: 'นับจำนวนรายการทั้งหมด',
    desc: 'นับจำนวนแถวข้อมูลทั้งหมดในตารางที่เลือก',
  },
  auto_filtered_count: {
    label: 'นับตามเงื่อนไข',
    desc: 'นับเฉพาะรายการที่ตรงตามเงื่อนไขที่กำหนด เช่น งบ > 10 ล้าน',
  },
  auto_completeness: {
    label: 'ตรวจสอบความครบถ้วน 7 ภาควิชา',
    desc: 'ตรวจสอบว่าทุกภาควิชามีการดำเนินงานครบถ้วนหรือไม่',
  },
  manual: {
    label: 'บันทึกผลงานแบบแมนนวล',
    desc: 'สำหรับตัวชี้วัดภายนอกหรือที่ยังไม่มีฐานข้อมูลรองรับ',
  },
};

// 2. ชุดสีพาสเทลสำหรับวิธีการประเมิน (แยกครบ 5 สีเฉพาะตัว ไม่ซ้ำกัน)
const CALC_STYLES: Record<KPICalcType, { bg: string; border: string; color: string }> = {
  auto_count: { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },          // ฟ้าพาสเทล (นับทั้งหมด)
  auto_filtered_count: { bg: '#f5f3ff', border: '#ddd6fe', color: '#6d28d9' }, // ม่วงพาสเทล (นับตามเงื่อนไข)
  auto_sum: { bg: '#fefce8', border: '#fef08a', color: '#a16207' },            // เหลืองทองพาสเทล (รวมยอดเงิน)
  auto_completeness: { bg: '#ecfdf5', border: '#a7f3d0', color: '#047857' },   // เขียวพาสเทล (ครบ 7 ภาควิชา)
  manual: { bg: '#fff7ed', border: '#fed7aa', color: '#c2410c' },              // ส้มพาสเทล (บันทึกแมนนวล)
};

// 3. ตัวเลือกสถานะความสำเร็จ
const STATUS_OPTIONS = [
  { value: 'all', label: 'ทุกสถานะ' },
  { value: 'achieved', label: 'บรรลุเป้าหมาย (≥ 100%)' },
  { value: 'on_track', label: 'เป็นไปตามเป้า (70–99%)' },
  { value: 'at_risk', label: 'เฝ้าระวัง (40–69%)' },
  { value: 'behind', label: 'ต้องเร่งรัด (< 40%)' },
];

// ฟังก์ชันล้างอักขระพิเศษ จุด ขีด ช่องว่าง เพื่อการค้นหาที่ยืดหยุ่น
const cleanSearchText = (str: string) => str.toLowerCase().replace(/[\s.\-_/\\()]/g, '');

export const KPIManagementTab: React.FC<KPIManagementTabProps> = ({ datasets }) => {
  const [kpis, setKpis] = useState<KPIItem[]>(() => getStoredKPIs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCalcType, setSelectedCalcType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KPIItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedKpis, setExpandedKpis] = useState<Record<string, boolean>>({});

  // Mapping Modal State
  const [mappingKpi, setMappingKpi] = useState<KPIItem | null>(null);
  const [mappingSearch, setMappingSearch] = useState('');
  const [activeMappingSubTab, setActiveMappingSubTab] = useState<'matched' | 'all'>('matched');

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<KPICategory>('research');
  const [formFiscalYear, setFormFiscalYear] = useState('2570');
  const [formTargetValue, setFormTargetValue] = useState<number>(100);
  const [formUnit, setFormUnit] = useState('เรื่อง');
  const [formCalcType, setFormCalcType] = useState<KPICalcType>('auto_count');
  const [formDatasetKey, setFormDatasetKey] = useState('research');
  const [formSumField, setFormSumField] = useState('budget_external');
  const [formFilterField, setFormFilterField] = useState('budget_external');
  const [formFilterOperator, setFormFilterOperator] = useState<FilterOperator>('gte');
  const [formFilterValue, setFormFilterValue] = useState<string>('10000000');
  const [formManualProgress, setFormManualProgress] = useState<number>(0);
  const [formDescription, setFormDescription] = useState('');
  const [formResponsibleUnit, setFormResponsibleUnit] = useState('');

  // Reload KPI list
  const refreshList = () => {
    const list = getStoredKPIs();
    setKpis(list);
    if (mappingKpi) {
      const refreshedTarget = list.find((k) => k.id === mappingKpi.id) || null;
      setMappingKpi(refreshedTarget);
    }
  };

  // Open modal for Add
  const handleOpenAdd = () => {
    setEditingKpi(null);
    setFormCode(`KPI 2.1-${kpis.length + 1}`);
    setFormTitle('');
    setFormCategory('research');
    setFormFiscalYear('2570');
    setFormTargetValue(10);
    setFormUnit('โครงการ');
    setFormCalcType('auto_count');
    setFormDatasetKey('research');
    setFormSumField('budget_external');
    setFormFilterField('budget_external');
    setFormFilterOperator('gte');
    setFormFilterValue('10000000');
    setFormManualProgress(0);
    setFormDescription('');
    setFormResponsibleUnit('รองคณบดีฝ่ายวิจัยและนวัตกรรมสากล');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: KPIItem) => {
    setEditingKpi(item);
    setFormCode(item.code);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormFiscalYear(item.fiscalYear || '2570');
    setFormTargetValue(item.targetValue);
    setFormUnit(item.unit);
    setFormCalcType(item.calcType);
    setFormDatasetKey(item.datasetKey);
    setFormSumField(item.sumField || 'budget_external');
    setFormFilterField(item.filterConfig?.field || 'budget_external');
    setFormFilterOperator(item.filterConfig?.operator || 'gte');
    setFormFilterValue(String(item.filterConfig?.value ?? '10000000'));
    setFormManualProgress(item.manualProgress ?? 0);
    setFormDescription(item.description || '');
    setFormResponsibleUnit(item.responsibleUnit || '');
    setIsModalOpen(true);
  };

  // Open Mapping Modal
  const handleOpenMapping = (item: KPIItem) => {
    setMappingKpi(item);
    setMappingSearch('');
    setActiveMappingSubTab('matched');
  };

  // Toggle Project Inclusion / Exclusion
  const handleIncludeProject = (projectId: string) => {
    if (!mappingKpi) return;
    includeProjectInKPI(mappingKpi.id, projectId);
    refreshList();
  };

  const handleExcludeProject = (projectId: string) => {
    if (!mappingKpi) return;
    excludeProjectFromKPI(mappingKpi.id, projectId);
    refreshList();
  };

  // Live Preview inside edit modal
  const livePreview = useMemo(() => {
    const draft: KPIItem = {
      id: 'preview',
      code: formCode || 'KPI TEST',
      title: formTitle || 'ตัวชี้วัดทดสอบ',
      category: formCategory,
      fiscalYear: formFiscalYear,
      targetValue: formTargetValue || 1,
      unit: formUnit,
      calcType: formCalcType,
      datasetKey: formDatasetKey,
      sumField: formSumField,
      filterConfig:
        formCalcType === 'auto_filtered_count'
          ? {
              field: formFilterField,
              operator: formFilterOperator,
              value: formFilterValue,
            }
          : undefined,
      completenessField: 'department',
      completenessExpected: ENGINEERING_DEPARTMENTS,
      manualProgress: formManualProgress,
    };
    return evaluateKPI(draft, datasets);
  }, [
    formCode,
    formTitle,
    formCategory,
    formFiscalYear,
    formTargetValue,
    formUnit,
    formCalcType,
    formDatasetKey,
    formSumField,
    formFilterField,
    formFilterOperator,
    formFilterValue,
    formManualProgress,
    datasets,
  ]);

  // Submit Add/Edit Modal
  const handleSaveKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formTitle.trim()) {
      alert('กรุณากรอกรหัสและชื่อตัวชี้วัดให้ครบถ้วน');
      return;
    }

    const payload: Omit<KPIItem, 'id'> = {
      code: formCode.trim(),
      title: formTitle.trim(),
      category: formCategory,
      fiscalYear: formFiscalYear,
      targetValue: Number(formTargetValue),
      unit: formUnit.trim() || 'หน่วย',
      calcType: formCalcType,
      datasetKey: formDatasetKey,
      sumField: formCalcType === 'auto_sum' ? formSumField : undefined,
      filterConfig:
        formCalcType === 'auto_filtered_count'
          ? {
              field: formFilterField,
              operator: formFilterOperator,
              value: isNaN(Number(formFilterValue)) ? formFilterValue : Number(formFilterValue),
            }
          : undefined,
      completenessField: formCalcType === 'auto_completeness' ? 'department' : undefined,
      completenessExpected: formCalcType === 'auto_completeness' ? ENGINEERING_DEPARTMENTS : undefined,
      manualProgress: formCalcType === 'manual' ? Number(formManualProgress) : undefined,
      description: formDescription.trim(),
      responsibleUnit: formResponsibleUnit.trim(),
    };

    if (editingKpi) {
      updateKPI({ ...editingKpi, ...payload });
    } else {
      addKPI(payload);
    }

    setIsModalOpen(false);
    refreshList();
  };

  // Delete
  const handleDelete = (id: string) => {
    deleteKPI(id);
    setDeleteConfirmId(null);
    refreshList();
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('คุณต้องการคืนค่าตัวชี้วัดเริ่มต้นตามยุทธศาสตร์ของคณะฯ ใช่หรือไม่?')) {
      resetKPIsToDefault();
      refreshList();
    }
  };

  // Filtered KPI list (รองรับทั้ง ค้นหา, ยุทธศาสตร์ ย.1-ย.3, หมวดหมู่, วิธีการประเมิน, และสถานะ)
  const filteredKPIs = useMemo(() => {
    return kpis.filter((item) => {
      // 1. กรองตามหมวดหมู่ / ยุทธศาสตร์
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'strat_y1') {
          if (!item.code.startsWith('ย.1')) return false;
        } else if (selectedCategory === 'strat_y2') {
          if (!item.code.startsWith('ย.2')) return false;
        } else if (selectedCategory === 'strat_y3') {
          if (!item.code.startsWith('ย.3')) return false;
        } else if (selectedCategory === 'strat_faculty') {
          if (!item.code.startsWith('KPI')) return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // 2. กรองตามวิธีการประเมิน
      if (selectedCalcType !== 'all' && item.calcType !== selectedCalcType) return false;

      // 3. กรองตามสถานะความสำเร็จ
      if (selectedStatus !== 'all') {
        const evalRes = evaluateKPI(item, datasets);
        if (evalRes.status !== selectedStatus) return false;
      }

      // 4. กรองตามคำค้นหาแบบยืดหยุ่น
      if (!searchQuery.trim()) return true;

      const rawContent = `${item.code} ${item.title} ${item.description || ''} ${item.responsibleUnit || ''} ${item.fiscalYear || ''}`.toLowerCase();
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

  const currentMappingEvaluation = useMemo(() => {
    if (!mappingKpi) return null;
    return evaluateKPI(mappingKpi, datasets);
  }, [mappingKpi, datasets]);

  const allDatasetItems = useMemo(() => {
    if (!mappingKpi) return [];
    const raw = datasets[mappingKpi.datasetKey] || [];
    return raw.filter((item) => item && (item.name || item.title));
  }, [mappingKpi, datasets]);

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
        {/* Action & Filter Bar (มีตัวกรองครบ 4 ด้าน: ค้นหา, ยุทธศาสตร์/หมวด, วิธีประเมิน, สถานะ) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* ฝั่งซ้าย: ค้นหา + ตัวกรองหมวดยุทธศาสตร์ + ตัวกรองวิธีการประเมิน + ตัวกรองสถานะ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* ค้นหาแบบยืดหยุ่น */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                width: '240px',
                maxWidth: '100%',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              }}
            >
              <FaSearch style={{ color: '#94a3b8', fontSize: '13px' }} />
              <input
                type="text"
                placeholder="ค้นหา (เช่น ย1 ap3)..."
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

            {/* ตัวกรองหมวดยุทธศาสตร์ (รวม ย.1, ย.2, ย.3 และประเภทงานครบถ้วน) */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                height: '38px',
                padding: '0 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">ทุกหมวดยุทธศาสตร์</option>
              <optgroup label="── แผนยุทธศาสตร์ปี 2570 ──">
                <option value="strat_y1">ยุทธศาสตร์ที่ 1 (ย.1 - นวัตกร)</option>
                <option value="strat_y2">ยุทธศาสตร์ที่ 2 (ย.2 - วิจัยและนวัตกรรม)</option>
                <option value="strat_y3">ยุทธศาสตร์ที่ 3 (ย.3 - บริการชุมชน)</option>
                <option value="strat_faculty">ตัวชี้วัดภาพรวมคณะฯ (KPI 2.1-x)</option>
              </optgroup>
              <optgroup label="── จำแนกตามประเภทงาน ──">
                {Object.entries(CATEGORY_LABELS).map(([k, lbl]) => (
                  <option key={k} value={k}>
                    {lbl}
                  </option>
                ))}
              </optgroup>
            </select>

            {/* ตัวกรองวิธีการประเมิน */}
            <select
              value={selectedCalcType}
              onChange={(e) => {
                setSelectedCalcType(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                height: '38px',
                padding: '0 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">ทุกวิธีการประเมิน</option>
              {Object.entries(CALC_LABELS).map(([k, item]) => (
                <option key={k} value={k}>
                  {item.label}
                </option>
              ))}
            </select>

            {/* ตัวกรองสถานะความสำเร็จ (เพิ่มใหม่ให้ครบถ้วน) */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                height: '38px',
                padding: '0 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* ฝั่งขวา: ปุ่มคืนค่ามาตรฐาน + ปุ่มเพิ่มตัวชี้วัด */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleReset}
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
              title="คืนค่าตัวชี้วัดเริ่มต้นตามแผนยุทธศาสตร์"
            >
              <FaRedoAlt style={{ color: '#64748b', fontSize: '11px' }} />
              <span>คืนค่ามาตรฐาน</span>
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
          </div>
        </div>

        {/* ตารางข้อมูล DataTable */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              minWidth: '1120px',
              tableLayout: 'fixed',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '13.5px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#00A651' }}>
                <th style={{ width: '4%', minWidth: '42px', textAlign: 'center', padding: '12px 6px', color: '#ffffff', fontWeight: 600 }}>#</th>
                <th style={{ width: '11%', padding: '12px 10px', color: '#ffffff', fontWeight: 600 }}>รหัส</th>
                <th style={{ width: '27%', padding: '12px 10px', color: '#ffffff', fontWeight: 600 }}>ชื่อตัวชี้วัดตามแผนยุทธศาสตร์</th>
                <th style={{ width: '12%', padding: '12px 10px', color: '#ffffff', fontWeight: 600 }}>หมวดหมู่</th>
                <th style={{ width: '13%', padding: '12px 10px', color: '#ffffff', fontWeight: 600 }}>วิธีการประเมิน</th>
                <th style={{ width: '10%', textAlign: 'right', padding: '12px 10px', color: '#ffffff', fontWeight: 600 }}>เป้าหมาย</th>
                <th style={{ width: '10%', textAlign: 'right', padding: '12px 10px', color: '#ffffff', fontWeight: 600 }}>ผลงานปัจจุบัน</th>
                <th style={{ width: '12%', padding: '12px 10px', color: '#ffffff', fontWeight: 600 }}>ความก้าวหน้า</th>
                <th style={{ width: '8%', minWidth: '85px', textAlign: 'center', padding: '12px 6px', color: '#ffffff', fontWeight: 600 }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {paginatedKPIs.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    ไม่พบตัวชี้วัดที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                paginatedKPIs.map((kpi, idx) => {
                  const rowNum = startIndex + idx + 1;
                  const evalRes = evaluateKPI(kpi, datasets);
                  const catStyle = CATEGORY_STYLES[kpi.category] || { bg: '#f1f5f9', border: '#e2e8f0', color: '#475569' };
                  const calcStyle = CALC_STYLES[kpi.calcType] || { bg: '#f0f4f8', border: '#d9e2ec', color: '#243b53' };

                  return (
                    <tr
                      key={kpi.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fbf5')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = idx % 2 === 1 ? '#fafcfb' : '#ffffff')
                      }
                    >
                      <td style={{ textAlign: 'center', padding: '11px 6px', color: '#94a3b8', fontSize: '13px' }}>
                        {rowNum}
                      </td>

                      <td style={{ padding: '11px 10px', fontWeight: 700, color: '#00A651', fontFamily: 'monospace', fontSize: '13px' }}>
                        {kpi.code}
                      </td>

                      <td style={{ padding: '11px 10px' }}>
                        <div
                          onClick={() => setExpandedKpis((prev) => ({ ...prev, [kpi.id]: !prev[kpi.id] }))}
                          style={{
                            fontWeight: 400,
                            color: '#0f172a',
                            fontSize: '13.5px',
                            lineHeight: '1.4',
                            cursor: kpi.description ? 'pointer' : 'default',
                          }}
                          title={kpi.title}
                        >
                          {kpi.title}
                        </div>
                        {kpi.description && (
                          <div
                            onClick={() => setExpandedKpis((prev) => ({ ...prev, [kpi.id]: !prev[kpi.id] }))}
                            style={{
                              fontSize: '11.5px',
                              color: '#64748b',
                              marginTop: '2px',
                              lineHeight: 1.35,
                              display: expandedKpis[kpi.id] ? 'block' : '-webkit-box',
                              WebkitLineClamp: expandedKpis[kpi.id] ? 'unset' : 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: expandedKpis[kpi.id] ? 'visible' : 'hidden',
                              cursor: 'pointer',
                            }}
                            title={kpi.description}
                          >
                            {kpi.description}
                          </div>
                        )}
                        {kpi.responsibleUnit && (
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                            {kpi.responsibleUnit}
                          </div>
                        )}
                      </td>

                      {/* หมวดหมู่: แสดงสีพาสเทลเฉพาะตามประเภทงาน */}
                      <td style={{ padding: '11px 10px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            backgroundColor: catStyle.bg,
                            border: `1px solid ${catStyle.border}`,
                            color: catStyle.color,
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {CATEGORY_LABELS[kpi.category] || kpi.category}
                        </span>
                      </td>

                      {/* วิธีการประเมิน: แสดงสีพาสเทลครบ 5 สีเฉพาะตัว (ฟ้า/ม่วง/เหลือง/เขียว/ส้ม) */}
                      <td style={{ padding: '11px 10px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            backgroundColor: calcStyle.bg,
                            border: `1px solid ${calcStyle.border}`,
                            color: calcStyle.color,
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {CALC_LABELS[kpi.calcType]?.label || kpi.calcType}
                        </span>
                      </td>

                      <td style={{ padding: '11px 10px', textAlign: 'right', fontWeight: 600, color: '#334155', fontSize: '13.5px' }}>
                        {kpi.targetValue.toLocaleString()} {kpi.unit}
                      </td>

                      <td style={{ padding: '11px 10px', textAlign: 'right', fontWeight: 700, color: evalRes.statusColor, fontSize: '13.5px' }}>
                        {evalRes.currentValue.toLocaleString()} {kpi.unit}
                      </td>

                      <td style={{ padding: '11px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              flex: 1,
                              height: '7px',
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
                              minWidth: '35px',
                              textAlign: 'right',
                            }}
                          >
                            {evalRes.percentage}%
                          </span>
                        </div>
                      </td>

                      {/* จัดการ */}
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '6px 4px',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                        }}
                      >
                        <button
                          onClick={() => handleOpenMapping(kpi)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563eb',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            fontSize: '13px',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          title="ดูและจัดการโครงการที่เข้าเกณฑ์ตัวชี้วัดนี้"
                        >
                          <FaFolderOpen />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(kpi)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#e5a812',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            fontSize: '13px',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef3c7')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          title="แก้ไขข้อมูลตัวชี้วัด"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(kpi.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            fontSize: '13px',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          title="ลบตัวชี้วัด"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
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
            {selectedCategory !== 'all' && ` (กรอง: ${
              selectedCategory === 'strat_y1' ? 'ยุทธศาสตร์ที่ 1' :
              selectedCategory === 'strat_y2' ? 'ยุทธศาสตร์ที่ 2' :
              selectedCategory === 'strat_y3' ? 'ยุทธศาสตร์ที่ 3' :
              selectedCategory === 'strat_faculty' ? 'ตัวชี้วัดภาพรวมคณะ' :
              CATEGORY_LABELS[selectedCategory as KPICategory]
            })`}
            {selectedCalcType !== 'all' && ` (วิธีประเมิน: ${CALC_LABELS[selectedCalcType as KPICalcType]?.label})`}
            {selectedStatus !== 'all' && ` (สถานะ: ${STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label})`}
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

      {/* หน้าที่ 2: Modal จัดการผูกโครงการเข้าตัวชี้วัด */}
      {mappingKpi && currentMappingEvaluation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMappingKpi(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.28)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '18px 24px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#ffffff', color: '#0284c7', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '12px' }}>
                    {mappingKpi.code}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>
                    จัดการโครงการที่ผูกกับตัวชี้วัด
                  </h3>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#e0f2fe' }}>
                  {mappingKpi.title}
                </p>
              </div>
              <button
                onClick={() => setMappingKpi(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '22px',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            {/* สรุปตัวเลข Actual vs Target */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 24px',
                backgroundColor: '#f0f9ff',
                borderBottom: '1px solid #bae6fd',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: '#0369a1', fontWeight: 600 }}>ความคืบหน้ารวม: </span>
                <strong style={{ fontSize: '15px', color: '#0c4a6e' }}>
                  {currentMappingEvaluation.currentValue.toLocaleString()} / {mappingKpi.targetValue.toLocaleString()} {mappingKpi.unit}
                </strong>
                <span style={{ marginLeft: '10px', fontSize: '12px', color: currentMappingEvaluation.statusColor, fontWeight: 700 }}>
                  ({currentMappingEvaluation.percentage}% • {currentMappingEvaluation.statusLabel})
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#0284c7' }}>
                จำนวนโครงการที่เชื่อมโยง: <strong>{(currentMappingEvaluation.matchedProjects || []).length}</strong> รายการ
              </div>
            </div>

            {/* Sub-Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '0 24px' }}>
              <button
                onClick={() => setActiveMappingSubTab('matched')}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: activeMappingSubTab === 'matched' ? '#0284c7' : '#64748b',
                  borderBottom: activeMappingSubTab === 'matched' ? '2px solid #0284c7' : 'none',
                  cursor: 'pointer',
                }}
              >
                โครงการที่เชื่อมโยงอยู่ ({(currentMappingEvaluation.matchedProjects || []).length})
              </button>
              <button
                onClick={() => setActiveMappingSubTab('all')}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  background: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: activeMappingSubTab === 'all' ? '#0284c7' : '#64748b',
                  borderBottom: activeMappingSubTab === 'all' ? '2px solid #0284c7' : 'none',
                  cursor: 'pointer',
                }}
              >
                + ค้นหาและผูกโครงการเพิ่มด้วยมือ
              </button>
            </div>

            {/* ค้นหาใน Modal */}
            <div style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <input
                type="text"
                placeholder="ค้นหาชื่อโครงการ, ผู้รับผิดชอบ หรือหน่วยงาน..."
                value={mappingSearch}
                onChange={(e) => setMappingSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                }}
              />
            </div>

            {/* Body List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {activeMappingSubTab === 'matched' ? (
                <div>
                  {(currentMappingEvaluation.matchedProjects || [])
                    .filter((p: any) => {
                      if (!mappingSearch.trim()) return true;
                      const q = mappingSearch.toLowerCase();
                      const name = (p.name || p.title || '').toLowerCase();
                      const leader = (p.leader || p.author || p.creator || '').toLowerCase();
                      return name.includes(q) || leader.includes(q);
                    })
                    .map((proj: any, idx: number) => {
                      const projId = String(proj.id || proj.code || `idx-${idx}`);
                      const isManuallyAdded = (mappingKpi.manualIncludedProjectIds || []).includes(projId);

                      return (
                        <div
                          key={projId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            marginBottom: '8px',
                            backgroundColor: isManuallyAdded ? '#f0fdf4' : '#ffffff',
                          }}
                        >
                          <div style={{ flex: 1, paddingRight: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: isManuallyAdded ? '#dcfce7' : '#e0f2fe', color: isManuallyAdded ? '#15803d' : '#0369a1', fontWeight: 600 }}>
                                {isManuallyAdded ? 'เพิ่มด้วยมือ' : 'ระบบแนะนำอัตโนมัติ'}
                              </span>
                              {proj.budget && (
                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                  งบประมาณ: {Number(proj.budget).toLocaleString()} บาท
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1e293b', marginTop: '4px' }}>
                              {proj.name || proj.title}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                              {proj.leader || proj.author || proj.creator || proj.department || 'ไม่ระบุผู้รับผิดชอบ'}
                            </div>
                          </div>

                          <button
                            onClick={() => handleExcludeProject(projId)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid #fecaca',
                              backgroundColor: '#fff1f2',
                              color: '#e11d48',
                              fontSize: '12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                            title="คัดโครงการนี้ออกจากตัวชี้วัด"
                          >
                            <FaUnlink />
                            <span>นำออก</span>
                          </button>
                        </div>
                      );
                    })}
                  {(currentMappingEvaluation.matchedProjects || []).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13px' }}>
                      ยังไม่มีโครงการที่เชื่อมโยงกับตัวชี้วัดนี้
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {allDatasetItems
                    .filter((p: any) => {
                      const q = mappingSearch.toLowerCase();
                      const name = (p.name || p.title || '').toLowerCase();
                      const leader = (p.leader || p.author || p.creator || '').toLowerCase();
                      return name.includes(q) || leader.includes(q);
                    })
                    .slice(0, 30)
                    .map((proj: any, idx: number) => {
                      const projId = String(proj.id || proj.code || `idx-${idx}`);
                      const isAlreadyMatched = (currentMappingEvaluation.matchedProjects || []).some(
                        (m: any) => String(m.id || m.code || '') === projId
                      );

                      return (
                        <div
                          key={projId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            marginBottom: '6px',
                            backgroundColor: isAlreadyMatched ? '#f8fafc' : '#ffffff',
                          }}
                        >
                          <div style={{ flex: 1, paddingRight: '12px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>
                              {proj.name || proj.title}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                              {proj.leader || proj.author || proj.creator || proj.department}
                            </div>
                          </div>

                          {isAlreadyMatched ? (
                            <span style={{ fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <FaCheckCircle /> ผูกอยู่แล้ว
                            </span>
                          ) : (
                            <button
                              onClick={() => handleIncludeProject(projId)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid #00A651',
                                backgroundColor: '#f0fdf4',
                                color: '#15803d',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              <FaLink />
                              <span>ผูกโครงการ</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <button
                onClick={() => setMappingKpi(null)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '6px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* หน้าที่ 1: Modal เพิ่ม/แก้ไขตัวชี้วัด */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.28)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                backgroundColor: '#00A651',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaBullseye style={{ fontSize: '20px', color: '#86efac' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                    {editingKpi ? 'แก้ไขตัวชี้วัดตามแผนยุทธศาสตร์' : 'เพิ่มตัวชี้วัดตามแผนยุทธศาสตร์'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '22px',
                  cursor: 'pointer',
                  padding: '4px',
                  opacity: 0.85,
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveKpi} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* รหัส & ชื่อ */}
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      รหัสตัวชี้วัด <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น KPI 2.1-1"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13.5px',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      ชื่อตัวชี้วัดยุทธศาสตร์ <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ระบุชื่อตัวชี้วัดที่ต้องการวัดผล"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13.5px',
                      }}
                    />
                  </div>
                </div>

                {/* หมวดหมู่, ปีงบ, เป้าหมาย, หน่วยนับ */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      หมวดหมู่
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        const newCat = e.target.value as KPICategory;
                        setFormCategory(newCat);
                        if (['research', 'academic', 'publications', 'service', 'ip', 'personnel'].includes(newCat)) {
                          setFormDatasetKey(newCat);
                        }
                      }}
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '13px',
                        color: '#1e293b',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {Object.entries(CATEGORY_LABELS).map(([k, lbl]) => (
                        <option key={k} value={k}>
                          {lbl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      ปีงบประมาณ
                    </label>
                    <input
                      type="text"
                      value={formFiscalYear}
                      onChange={(e) => setFormFiscalYear(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        textAlign: 'center',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      เป้าหมาย <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formTargetValue}
                      onChange={(e) => setFormTargetValue(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      หน่วยนับ
                    </label>
                    <input
                      type="text"
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      placeholder="เช่น เรื่อง, บาท"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </div>

                {/* วิธีการประเมินผล */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '10px',
                    }}
                  >
                    <FaCalculator style={{ color: '#00A651' }} />
                    <span>วิธีการประเมินผลและการคำนวณ</span>
                  </label>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '8px',
                      marginBottom: '14px',
                    }}
                  >
                    {(Object.keys(CALC_LABELS) as KPICalcType[]).map((mode) => {
                      const isSel = formCalcType === mode;
                      return (
                        <div
                          key={mode}
                          onClick={() => setFormCalcType(mode)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: isSel ? '2px solid #00A651' : '1px solid #cbd5e1',
                            backgroundColor: isSel ? '#f0fdf4' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: '12.5px',
                              color: isSel ? '#15803d' : '#334155',
                            }}
                          >
                            {CALC_LABELS[mode].label}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#64748b',
                              marginTop: '3px',
                              lineHeight: 1.3,
                            }}
                          >
                            {CALC_LABELS[mode].desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {formCalcType !== 'manual' && (
                    <div style={{ paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                            เชื่อมโยงตารางข้อมูล
                          </label>
                          <select
                            value={formDatasetKey}
                            onChange={(e) => setFormDatasetKey(e.target.value)}
                            style={{
                              width: '100%',
                              height: '38px',
                              padding: '0 10px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#ffffff',
                              fontSize: '13px',
                              color: '#1e293b',
                              outline: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="research">โครงการวิจัย (research)</option>
                            <option value="academic">โครงการพัฒนาวิชาการ (academic)</option>
                            <option value="publications">ผลงานตีพิมพ์ทางวิชาการ (publications)</option>
                            <option value="service">งานบริการวิชาการ (service)</option>
                            <option value="ip">งานทรัพย์สินทางปัญญา (ip)</option>
                            <option value="personnel">บุคลากร/อาจารย์ (personnel)</option>
                          </select>
                        </div>

                        {formCalcType === 'auto_sum' && (
                          <div>
                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                              ฟิลด์ตัวเลขที่ต้องการรวมยอด
                            </label>
                            <select
                              value={formSumField}
                              onChange={(e) => setFormSumField(e.target.value)}
                              style={{
                                width: '100%',
                                height: '38px',
                                padding: '0 10px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                fontSize: '13px',
                                color: '#1e293b',
                                outline: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="budget_external">งบวิจัยภายนอก (budget_external)</option>
                              <option value="budget_internal">งบวิจัยภายใน (budget_internal)</option>
                              <option value="budget">งบประมาณรวม (budget)</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {formCalcType === 'auto_filtered_count' && (
                        <div style={{ marginTop: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                            เงื่อนไขการกรอง
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '8px' }}>
                            <select
                              value={formFilterField}
                              onChange={(e) => setFormFilterField(e.target.value)}
                              style={{
                                height: '36px',
                                padding: '0 8px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                fontSize: '12.5px',
                                color: '#1e293b',
                                outline: 'none',
                              }}
                            >
                              <option value="budget_external">งบภายนอก</option>
                              <option value="budget_internal">งบภายใน</option>
                              <option value="budget">งบประมาณ</option>
                              <option value="department">ภาควิชา</option>
                              <option value="fund_source">แหล่งทุน</option>
                              <option value="journal">ระดับวารสาร / Quartile</option>
                            </select>

                            <select
                              value={formFilterOperator}
                              onChange={(e) => setFormFilterOperator(e.target.value as FilterOperator)}
                              style={{
                                height: '36px',
                                padding: '0 8px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                fontSize: '12.5px',
                                color: '#1e293b',
                                outline: 'none',
                              }}
                            >
                              <option value="gte">&ge; มากกว่าหรือเท่ากับ</option>
                              <option value="lte">&le; น้อยกว่าหรือเท่ากับ</option>
                              <option value="equals">= เท่ากับ</option>
                              <option value="contains">ประกอบด้วยคำว่า</option>
                              <option value="not_empty">มีข้อมูล (ไม่ว่าง)</option>
                            </select>

                            <input
                              type="text"
                              value={formFilterValue}
                              onChange={(e) => setFormFilterValue(e.target.value)}
                              placeholder="เช่น 10000000"
                              style={{
                                padding: '7px 10px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                fontSize: '12.5px',
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {formCalcType === 'auto_completeness' && (
                        <div style={{ marginTop: '10px' }}>
                          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                            ตรวจสอบการมีส่วนร่วมครบทั้ง 7 ภาควิชา: AE, CPE, IRE, FE, IE, ME, CE
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {formCalcType === 'manual' && (
                    <div style={{ paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                        บันทึกผลงานสะสมปัจจุบัน
                      </label>
                      <input
                        type="number"
                        value={formManualProgress}
                        onChange={(e) => setFormManualProgress(Number(e.target.value))}
                        placeholder="ระบุตัวเลขผลงานปัจจุบัน"
                        style={{
                          width: '240px',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* กล่องคำนวณจำลองผลลัพธ์แบบเรียลไทม์ */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '10px',
                    padding: '12px 18px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600, textTransform: 'uppercase' }}>
                      ผลการคำนวณจำลองแบบเรียลไทม์
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginTop: '2px' }}>
                      {livePreview.currentValue.toLocaleString()} / {formTargetValue.toLocaleString()} {formUnit}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        backgroundColor: livePreview.statusColor,
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      {livePreview.percentage}% • {livePreview.statusLabel}
                    </span>
                  </div>
                </div>

                {/* ผู้รับผิดชอบ & คำอธิบาย */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      หน่วยงานผู้รับผิดชอบหลัก
                    </label>
                    <input
                      type="text"
                      value={formResponsibleUnit}
                      onChange={(e) => setFormResponsibleUnit(e.target.value)}
                      placeholder="เช่น รองคณบดีฝ่ายวิจัยและนวัตกรรมสากล"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      คำอธิบาย / เกณฑ์ตัวชี้วัด
                    </label>
                    <input
                      type="text"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="เกณฑ์ความสำเร็จ หรือคำอธิบายเพิ่มเติม"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '16px 24px',
                  backgroundColor: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
                  }}
                >
                  <FaSave style={{ fontSize: '13px' }} />
                  <span>บันทึกข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
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
    </>
  );
};