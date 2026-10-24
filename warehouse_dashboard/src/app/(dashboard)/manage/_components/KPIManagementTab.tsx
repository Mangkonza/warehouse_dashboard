'use client';

import React, { useState, useMemo } from 'react';
import { ConfirmActionModal } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KPIItem, KPICalcType, KPICategory, FilterOperator } from '@/types/kpi';
import {
  getStoredKPIs,
  addKPI,
  updateKPI,
  deleteKPI,
  resetKPIsToDefault,
  evaluateKPI,
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
  FaExclamationTriangle,
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

export const KPIManagementTab: React.FC<KPIManagementTabProps> = ({ datasets }) => {
  const [kpis, setKpis] = useState<KPIItem[]>(() => getStoredKPIs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KPIItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [expandedKpis, setExpandedKpis] = useState<Record<string, boolean>>({});

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<KPICategory>('research');
  const [formFiscalYear, setFormFiscalYear] = useState('2569');
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
    setKpis(getStoredKPIs());
  };

  // Open modal for Add
  const handleOpenAdd = () => {
    setEditingKpi(null);
    setFormCode(`KPI 2.1-${kpis.length + 1}`);
    setFormTitle('');
    setFormCategory('research');
    setFormFiscalYear('2569');
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
    setFormResponsibleUnit('คณะวิศวกรรมศาสตร์ กำแพงแสน');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: KPIItem) => {
    setEditingKpi(item);
    setFormCode(item.code);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormFiscalYear(item.fiscalYear || '2569');
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

  // Live Preview inside modal
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

  // Submit Modal
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
      updateKPI({ ...payload, id: editingKpi.id });
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
    if (confirm('คุณต้องการคืนค่าตัวชี้วัดเริ่มต้นตามยุทธศาสตร์ 2568-2569 ของคณะฯ ใช่หรือไม่?')) {
      resetKPIsToDefault();
      refreshList();
    }
  };

  // Filtered KPI list
  const filteredKPIs = useMemo(() => {
    return kpis.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.responsibleUnit && item.responsibleUnit.toLowerCase().includes(q))
      );
    });
  }, [kpis, searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredKPIs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedKPIs = filteredKPIs.slice(startIndex, startIndex + itemsPerPage);

  const targetToDelete = useMemo(() => {
    if (!deleteConfirmId) return null;
    return kpis.find((k) => k.id === deleteConfirmId) || null;
  }, [deleteConfirmId, kpis]);

  return (
    <>
      {/* กล่องเนื้อหาหลัก (Single Unified Modern Surface ตาม Major Style ของทุกแท็บ) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Action & Filter Bar (แถบควบคุมตาม Major Style) */}
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
          {/* ฝั่งซ้าย: ค้นหา + ตัวกรองหมวดหมู่ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* กล่องค้นหา */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                width: '320px',
                maxWidth: '100%',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              }}
            >
              <FaSearch style={{ color: '#94a3b8', fontSize: '13px' }} />
              <input
                type="text"
                placeholder="ค้นหาตัวชี้วัด, รหัส, ยุทธศาสตร์..."
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

            {/* ตัวกรองหมวดหมู่ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory(val ?? 'all');
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] bg-white text-slate-800 text-xs h-9">
                  <SelectValue placeholder="ทุกหมวดยุทธศาสตร์" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกหมวดยุทธศาสตร์</SelectItem>
                  {Object.entries(CATEGORY_LABELS).map(([k, lbl]) => (
                    <SelectItem key={k} value={k}>
                      {lbl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ฝั่งขวา: ปุ่มคืนค่ามาตรฐาน + ปุ่มเพิ่มตัวชี้วัด (สไตล์เดียวกับ Major Tabs) */}
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00A651';
                e.currentTarget.style.color = '#00A651';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#334155';
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

        {/* ตารางข้อมูล (DataTable Major Style: thead สีเขียว KU #00a859, สลับแถวขาว/เทาอ่อน) */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              minWidth: '1100px',
              tableLayout: 'fixed',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '13.5px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#00A651' }}>
                <th
                  style={{
                    width: '4%',
                    minWidth: '42px',
                    textAlign: 'center',
                    padding: '12px 6px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    whiteSpace: 'nowrap',
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    width: '11%',
                    padding: '12px 10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    whiteSpace: 'nowrap',
                  }}
                >
                  รหัส
                </th>
                <th
                  style={{
                    width: '28%',
                    padding: '12px 10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ชื่อตัวชี้วัดตามแผนยุทธศาสตร์
                </th>
                <th
                  style={{
                    width: '12%',
                    padding: '12px 10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    whiteSpace: 'nowrap',
                  }}
                >
                  หมวดหมู่
                </th>
                <th
                  style={{
                    width: '14%',
                    padding: '12px 10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    whiteSpace: 'nowrap',
                  }}
                >
                  วิธีการประเมิน
                </th>
                <th
                  style={{
                    width: '10%',
                    textAlign: 'right',
                    padding: '12px 10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    whiteSpace: 'nowrap',
                  }}
                >
                  เป้าหมาย
                </th>
                <th
                  style={{
                    width: '10%',
                    textAlign: 'right',
                    padding: '12px 10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ผลงานปัจจุบัน
                </th>
                <th
                  style={{
                    width: '13%',
                    padding: '12px 10px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ความก้าวหน้า
                </th>
                <th
                  style={{
                    width: '6%',
                    minWidth: '70px',
                    textAlign: 'center',
                    padding: '12px 6px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    backgroundColor: '#00A651',
                    borderBottom: '2px solid #008f44',
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
                  <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    ไม่พบตัวชี้วัดที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                paginatedKPIs.map((kpi, idx) => {
                  const rowNum = startIndex + idx + 1;
                  const evalRes = evaluateKPI(kpi, datasets);

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
                      {/* ลำดับ */}
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '11px 6px',
                          color: '#94a3b8',
                          fontSize: '13px',
                        }}
                      >
                        {rowNum}
                      </td>

                      {/* รหัส */}
                      <td
                        style={{
                          padding: '11px 10px',
                          fontWeight: 700,
                          color: '#00A651',
                          fontFamily: 'monospace',
                          fontSize: '13px',
                        }}
                      >
                        {kpi.code}
                      </td>

                      {/* ชื่อตัวชี้วัด */}
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

                      {/* หมวดหมู่ */}
                      <td style={{ padding: '11px 10px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f1f5f9',
                            color: '#475569',
                            border: '1px solid #e2e8f0',
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {CATEGORY_LABELS[kpi.category] || kpi.category}
                        </span>
                      </td>

                      {/* วิธีการประเมิน */}
                      <td style={{ padding: '11px 10px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            fontSize: '12px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {kpi.calcType === 'auto_completeness'
                            ? 'ครบ 7 ภาค'
                            : kpi.calcType === 'auto_sum'
                            ? 'รวมยอดเงิน'
                            : kpi.calcType === 'auto_count'
                            ? 'นับทั้งหมด'
                            : kpi.calcType === 'auto_filtered_count'
                            ? 'นับตามเงื่อนไข'
                            : 'บันทึกแมนนวล'}
                        </span>
                      </td>

                      {/* เป้าหมาย */}
                      <td
                        style={{
                          padding: '11px 10px',
                          textAlign: 'right',
                          fontWeight: 600,
                          color: '#334155',
                          fontSize: '13.5px',
                        }}
                      >
                        {kpi.targetValue.toLocaleString()} {kpi.unit}
                      </td>

                      {/* ผลงานปัจจุบัน */}
                      <td
                        style={{
                          padding: '11px 10px',
                          textAlign: 'right',
                          fontWeight: 700,
                          color: evalRes.statusColor,
                          fontSize: '13.5px',
                        }}
                      >
                        {evalRes.currentValue.toLocaleString()} {kpi.unit}
                      </td>

                      {/* ความก้าวหน้า */}
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

                      {/* จัดการ (Major Style: ปุ่มแก้ไขสีทอง #e5a812 และปุ่มลบสีแดง #ef4444 ไร้กรอบ) */}
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '6px 4px',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                        }}
                      >
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

        {/* Footer: Pagination & ข้อมูลจำนวนรายการ (ตาม Major Style) */}
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
            {selectedCategory !== 'all' && ` (หมวด: ${CATEGORY_LABELS[selectedCategory as KPICategory]})`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                <SelectTrigger className="w-[70px] bg-white text-slate-800 text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Modal เพิ่ม/แก้ไขตัวชี้วัด (ตาม Major Style ของ SmartAddEditModal: ส่วนหัวสีเขียว KU #00a859) */}
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
              animation: 'modalFadeIn 0.2s ease-out',
            }}
          >
            {/* Modal Header (Major Style: สีเขียว KU #00A651) */}
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
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#dcfce7' }}>
                    กำหนดการประเมินผลและการเชื่อมโยงข้อมูลกับคลังข้อมูลโดยตรง
                  </p>
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

            {/* Modal Body Form */}
            <form onSubmit={handleSaveKpi} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* แถว 1: รหัสตัวชี้วัด และ ชื่อตัวชี้วัด */}
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

                {/* แถว 2: หมวดหมู่, ปีงบประมาณ, เป้าหมาย, หน่วยนับ */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      หมวดหมู่
                    </label>
                    <Select
                      value={formCategory}
                      onValueChange={(val) => {
                        if (val) setFormCategory(val as KPICategory);
                      }}
                    >
                      <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9">
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORY_LABELS).map(([k, lbl]) => (
                          <SelectItem key={k} value={k}>
                            {lbl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

                {/* โหมดการประเมินและการคำนวณ */}
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

                  {/* ตัวเลือกตามประเภทคำนวณ */}
                  {formCalcType !== 'manual' && (
                    <div style={{ paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '12.5px',
                              fontWeight: 600,
                              color: '#334155',
                              marginBottom: '6px',
                            }}
                          >
                            เชื่อมโยงตารางข้อมูล
                          </label>
                          <Select value={formDatasetKey} onValueChange={(val) => { if (val) setFormDatasetKey(val); }}>
                            <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9">
                              <SelectValue placeholder="เลือกตารางข้อมูล" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="research">โครงการวิจัย</SelectItem>
                              <SelectItem value="academic">โครงการพัฒนาวิชาการ</SelectItem>
                              <SelectItem value="publications">ผลงานตีพิมพ์ทางวิชาการ</SelectItem>
                              <SelectItem value="service">งานบริการวิชาการ</SelectItem>
                              <SelectItem value="ip">งานทรัพย์สินทางปัญญา</SelectItem>
                              <SelectItem value="personnel">บุคลากร/อาจารย์</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {formCalcType === 'auto_sum' && (
                          <div>
                            <label
                              style={{
                                display: 'block',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                color: '#334155',
                                marginBottom: '6px',
                              }}
                            >
                              ฟิลด์ตัวเลขที่ต้องการรวมยอด
                            </label>
                            <Select value={formSumField} onValueChange={(val) => { if (val) setFormSumField(val); }}>
                              <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9">
                                <SelectValue placeholder="เลือกฟิลด์ตัวเลข" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="budget_external">งบวิจัยภายนอก (budget_external)</SelectItem>
                                <SelectItem value="budget_internal">งบวิจัยภายใน (budget_internal)</SelectItem>
                                <SelectItem value="budget">งบประมาณรวม (budget)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* การกรองเงื่อนไข Filter Rule */}
                      {formCalcType === 'auto_filtered_count' && (
                        <div style={{ marginTop: '12px' }}>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#475569',
                              marginBottom: '8px',
                            }}
                          >
                            เงื่อนไขการกรอง
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '8px' }}>
                            <Select value={formFilterField} onValueChange={(val) => { if (val) setFormFilterField(val); }}>
                              <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-8">
                                <SelectValue placeholder="ฟิลด์" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="budget_external">งบภายนอก</SelectItem>
                                <SelectItem value="budget_internal">งบภายใน</SelectItem>
                                <SelectItem value="department">ภาควิชา</SelectItem>
                                <SelectItem value="fund_source">แหล่งทุน</SelectItem>
                                <SelectItem value="journal">ระดับวารสาร / Quartile</SelectItem>
                              </SelectContent>
                            </Select>

                            <Select value={formFilterOperator} onValueChange={(val) => { if (val) setFormFilterOperator(val as FilterOperator); }}>
                              <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-8">
                                <SelectValue placeholder="เงื่อนไข" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gte">มากกว่าหรือเท่ากับ (&ge;)</SelectItem>
                                <SelectItem value="lte">น้อยกว่าหรือเท่ากับ (&le;)</SelectItem>
                                <SelectItem value="equals">เท่ากับ (=)</SelectItem>
                                <SelectItem value="contains">ประกอบด้วยคำว่า</SelectItem>
                              </SelectContent>
                            </Select>

                            <input
                              type="text"
                              value={formFilterValue}
                              onChange={(e) => setFormFilterValue(e.target.value)}
                              placeholder="ค่าเปรียบเทียบ เช่น 10000000 หรือ Q1"
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
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#475569',
                          marginBottom: '4px',
                        }}
                      >
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
                    <div
                      style={{
                        fontSize: '11.5px',
                        color: '#15803d',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
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

                {/* ผู้รับผิดชอบ และ รายละเอียด */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '6px',
                      }}
                    >
                      หน่วยงานผู้รับผิดชอบหลัก
                    </label>
                    <input
                      type="text"
                      value={formResponsibleUnit}
                      onChange={(e) => setFormResponsibleUnit(e.target.value)}
                      placeholder="เช่น ฝ่ายวิจัย, คณาจารย์ทุกภาควิชา"
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
                    <label
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '6px',
                      }}
                    >
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

              {/* Modal Footer (Major Style: ยกเลิก / บันทึกข้อมูล) */}
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
