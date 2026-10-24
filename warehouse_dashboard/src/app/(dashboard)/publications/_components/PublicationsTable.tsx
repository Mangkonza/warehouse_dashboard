'use client';

import React, { useState, useMemo } from 'react';
import { FaTable, FaPlus, FaEdit, FaTrashAlt, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { SearchInput, DepartmentBadge, DepartmentSelect, ConfirmActionModal, RecordDetailDrawer } from '@/components/ui';
import { JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PublicationItem } from '../_hooks/usePublicationsData';
import { PublicationForm } from '@/components/form/PublicationForm';

interface PublicationsTableProps {
  filteredData: PublicationItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  levelFilter: string;
  onLevelChange: (value: string) => void;
  selectedDept?: string;
  onDeptChange?: (value: string) => void;
  fiscalYearFilter?: string;
  onFiscalYearChange?: (value: string) => void;
  availableFiscalYears?: string[];
  onSave?: (item: Record<string, any>, isNew: boolean) => Promise<{ success: boolean; error?: string }>;
  onDelete?: (id: string) => Promise<{ success: boolean; error?: string }>;
}

const THAI_MONTH_ORDER: Record<string, number> = {
  'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
  'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12,
};

export function PublicationsTable({
  filteredData,
  searchTerm,
  onSearchChange,
  levelFilter,
  onLevelChange,
  selectedDept = 'all',
  onDeptChange,
  fiscalYearFilter = 'all',
  onFiscalYearChange,
  availableFiscalYears = [],
  onSave,
  onDelete,
}: PublicationsTableProps) {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PublicationItem | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<PublicationItem | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PublicationItem | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Group filtered data by month
  const groupedData = useMemo(() => {
    const groups: Record<string, PublicationItem[]> = {};

    filteredData.forEach((item) => {
      const monthKey = item.month || 'ไม่ระบุเดือน';
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(item);
    });

    // Sort month keys logically
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const orderA = THAI_MONTH_ORDER[a] || 99;
      const orderB = THAI_MONTH_ORDER[b] || 99;
      return orderA - orderB;
    });

    return sortedKeys.map((key) => ({
      month: key,
      items: groups[key],
    }));
  }, [filteredData]);

  // Handle open add modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      type: 'ตีพิมพ์',
      level: 'นานาชาติ',
      budget: 0,
      owner: '',
      department: '',
      journal: '',
      volume: '',
      issue: '',
      page_start: '',
      page_end: '',
      co_authors_foreign: [],
      co_authors_domestic: [],
      remarks: '',
      month: 'ม.ค.',
      month_year: '2025-01',
      fiscal_year_be: 2568,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (item: PublicationItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      co_authors_foreign: Array.isArray(item.co_authors_foreign) ? [...item.co_authors_foreign] : [],
      co_authors_domestic: Array.isArray(item.co_authors_domestic) ? [...item.co_authors_domestic] : [],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleFieldChange = (key: string, val: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: val,
    }));
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formData.name || !String(formData.name).trim()) {
      errs.name = 'กรุณากรอกชื่อผลงานทางวิชาการ';
    }
    if (!formData.type || !String(formData.type).trim()) {
      errs.type = 'กรุณาเลือกชนิดของผลงาน';
    }
    if (!formData.level || !String(formData.level).trim()) {
      errs.level = 'กรุณาเลือกระดับ';
    }
    if (!formData.owner || !String(formData.owner).trim()) {
      errs.owner = 'กรุณาระบุเจ้าของผลงาน';
    }
    if (!formData.department || !String(formData.department).trim()) {
      errs.department = 'กรุณาระบุสังกัดภาควิชา/สาขาวิชา';
    }
    if (formData.budget !== undefined && formData.budget !== null && formData.budget !== '') {
      const bNum = parseFloat(formData.budget);
      if (isNaN(bNum) || bNum < 0) {
        errs.budget = 'จำนวนเงินสนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ';
      }
    }
    if (formData.type !== 'เตรียมความพร้อมจดอนุสิทธิบัตร') {
      const pStart = String(formData.page_start || '').trim();
      const pEnd = String(formData.page_end || '').trim();
      if (pStart && pEnd) {
        const numStart = parseInt(pStart, 10);
        const numEnd = parseInt(pEnd, 10);
        if (!isNaN(numStart) && !isNaN(numEnd) && numEnd < numStart) {
          errs.pages = 'หน้าสิ้นสุดต้องมากกว่าหรือเท่ากับหน้าเริ่มต้น';
        }
      }
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const isNew = !editingItem;
      if (onSave) {
        const res = await onSave(formData, isNew);
        if (res.success) {
          showToast(isNew ? 'เพิ่มผลงานทางวิชาการสำเร็จ' : 'แก้ไขข้อมูลสำเร็จ', 'success');
          setIsModalOpen(false);
        } else {
          showToast(res.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
      } else {
        // Direct API call
        const method = isNew ? 'POST' : 'PUT';
        const res = await fetch('/api/data/publications', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.status === 'success') {
          showToast(isNew ? 'เพิ่มผลงานทางวิชาการสำเร็จ' : 'แก้ไขข้อมูลสำเร็จ', 'success');
          setIsModalOpen(false);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('ku_data_updated'));
          }
        } else {
          showToast(json.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete confirm
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id || deleteTarget.id;
    if (!targetId) return;

    try {
      if (onDelete) {
        const res = await onDelete(targetId);
        if (res.success) {
          showToast('ลบรายการสำเร็จ', 'success');
        } else {
          showToast(res.error || 'เกิดข้อผิดพลาดในการลบรายการ', 'error');
        }
      } else {
        const res = await fetch(`/api/data/publications?id=${targetId}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.status === 'success') {
          showToast('ลบรายการสำเร็จ', 'success');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('ku_data_updated'));
          }
        } else {
          showToast(json.message || 'เกิดข้อผิดพลาดในการลบรายการ', 'error');
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'เกิดข้อผิดพลาดในการลบรายการ', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  // Running sequence counter across groups
  let globalIndex = 0;

  return (
    <div className="table-card relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5 text-sm font-semibold transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div className="flex items-center gap-3">
          <h3 style={{ margin: 0 }} className="text-base font-bold text-slate-800 flex items-center">
            <FaTable style={{ color: '#00A651', marginRight: '8px' }} />
            รายละเอียดผลงานตีพิมพ์ทางวิชาการ
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#00A651] border border-emerald-200">
              {filteredData.length} เรื่อง
            </span>
          </h3>
        </div>

        {/* Filter & Action Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search by title */}
          <SearchInput
            placeholder="ค้นหาชื่อผลงาน, ผู้แต่ง, วารสาร..."
            value={searchTerm}
            onChange={onSearchChange}
            width="190px"
            style={{ padding: '6px 10px' }}
          />

          {/* Department Filter */}
          {onDeptChange && (
            <DepartmentSelect
              value={selectedDept}
              onChange={onDeptChange}
              allowAll
              allLabel="ทุกภาควิชา"
              allValue="all"
              size="sm"
              className="w-[155px]"
            />
          )}

          {/* Level / Tier Filter */}
          <Select value={levelFilter} onValueChange={(val) => onLevelChange(val ?? 'all')}>
            <SelectTrigger className="h-8 text-xs min-w-[130px] bg-white border-slate-300">
              <SelectValue placeholder="ทุกระดับ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกระดับ / ทุกฐานข้อมูล</SelectItem>
              <SelectItem value="Q1">Scopus Q1</SelectItem>
              <SelectItem value="Q2">Scopus Q2-Q4</SelectItem>
              <SelectItem value="TCI">TCI (ระดับชาติ)</SelectItem>
              <SelectItem value="นานาชาติ">ระดับนานาชาติ</SelectItem>
              <SelectItem value="ชาติ">ระดับชาติ</SelectItem>
              <SelectItem value="อนุสิทธิบัตร">เตรียมความพร้อมจดอนุสิทธิบัตร</SelectItem>
            </SelectContent>
          </Select>

          {/* Fiscal Year Filter */}
          {onFiscalYearChange && availableFiscalYears.length > 0 && (
            <Select value={fiscalYearFilter} onValueChange={(val) => onFiscalYearChange(val ?? 'all')}>
              <SelectTrigger className="h-8 text-xs min-w-[125px] bg-white border-slate-300">
                <SelectValue placeholder="ทุกปีงบประมาณ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกปีงบประมาณ</SelectItem>
                {availableFiscalYears.map((fy) => (
                  <SelectItem key={fy} value={fy}>
                    ปีงบประมาณ {fy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {(searchTerm.trim() !== '' || levelFilter !== 'all' || selectedDept !== 'all' || fiscalYearFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onLevelChange('all');
                if (onDeptChange) onDeptChange('all');
                if (onFiscalYearChange) onFiscalYearChange('all');
              }}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #fca5a5',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ล้างตัวกรอง
            </button>
          )}

          {/* Add Button */}
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="h-8 px-3.5 bg-[#00A651] hover:bg-[#008a43] text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FaPlus className="text-[11px]" />
            <span>เพิ่มผลงานทางวิชาการ</span>
          </Button>
        </div>
      </div>

      {/* Grouped Table */}
      <div className="table-scroll" style={{ maxHeight: '560px' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th style={{ width: '45px', textAlign: 'center' }}>ลำดับที่</th>
              <th style={{ minWidth: '240px' }}>ชื่อผลงานทางวิชาการ</th>
              <th style={{ width: '130px' }}>ชนิดของผลงาน</th>
              <th style={{ width: '85px', textAlign: 'center' }}>ระดับ</th>
              <th style={{ width: '115px', textAlign: 'right' }}>จำนวนเงินสนับสนุน</th>
              <th style={{ width: '140px' }}>เจ้าของผลงาน</th>
              <th style={{ width: '130px' }}>ผู้ร่วม</th>
              <th style={{ width: '100px', textAlign: 'left' }}>สังกัดภาควิชา/สาขาวิชา</th>
              <th style={{ width: '160px' }}>รายละเอียดวารสาร/การประชุม</th>
              <th style={{ width: '80px', textAlign: 'center' }}>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-slate-400 text-xs italic">
                  ไม่พบข้อมูลผลงานตีพิมพ์ทางวิชาการตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              groupedData.map((group) => (
                <React.Fragment key={group.month}>
                  {/* Month Group Header */}
                  <tr className="bg-slate-100/80 border-y border-slate-200">
                    <td colSpan={10} className="py-2 px-3 font-bold text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#00A651]" />
                        <span>เดือน {group.month}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          ({group.items.length} เรื่อง)
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Group Items */}
                  {group.items.map((item) => {
                    globalIndex += 1;
                    const fAuthors = Array.isArray(item.co_authors_foreign) ? item.co_authors_foreign.filter(Boolean) : [];
                    const dAuthors = Array.isArray(item.co_authors_domestic) ? item.co_authors_domestic.filter(Boolean) : [];
                    const hasCoAuthors = fAuthors.length > 0 || dAuthors.length > 0;

                    return (
                      <tr
                        key={item._id || item.id || globalIndex}
                        onClick={() => setSelectedDetailItem(item)}
                        style={{ cursor: 'pointer' }}
                        className="hover:bg-[#f0fbf5] transition-colors"
                      >
                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b' }}>
                          {globalIndex}
                        </td>
                        <td style={{ whiteSpace: 'normal', minWidth: '240px', fontWeight: 400, color: '#0f172a' }}>
                          {item.name}
                        </td>
                        <td>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item.type === 'ตีพิมพ์'
                                ? 'bg-emerald-50 text-[#006838] border border-emerald-200'
                                : item.type === 'เตรียมความพร้อมจดอนุสิทธิบัตร'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {item.type || '-'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                item.level === 'นานาชาติ'
                                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {item.level || '-'}
                            </span>
                            {item._detectedTier && JOURNAL_TIER_STYLES[item._detectedTier] && (
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: '6px',
                                  backgroundColor: JOURNAL_TIER_STYLES[item._detectedTier].bg,
                                  color: JOURNAL_TIER_STYLES[item._detectedTier].text,
                                  border: `1px solid ${JOURNAL_TIER_STYLES[item._detectedTier].border}`,
                                }}
                              >
                                {item._detectedTier}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: '#059669' }}>
                          {Number(item.budget || 0).toLocaleString('th-TH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          บาท
                        </td>
                        <td style={{ fontWeight: 400, color: '#334155' }}>
                          {item.owner && item.owner !== 'nan' ? item.owner : '-'}
                        </td>
                        <td>
                          {hasCoAuthors ? (
                            <div className="text-[11px] leading-tight space-y-0.5">
                              {fAuthors.length > 0 && (
                                <div className="text-blue-700">
                                  ต่างชาติ: {fAuthors.join(', ')}
                                </div>
                              )}
                              {dAuthors.length > 0 && (
                                <div className="text-slate-600">
                                  ในประเทศ: {dAuthors.join(', ')}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <DepartmentBadge value={item.department} />
                        </td>
                        <td style={{ fontSize: '12px', color: '#475569' }}>
                          <div>{item.journal || '-'}</div>
                          {item.type !== 'เตรียมความพร้อมจดอนุสิทธิบัตร' && (item.volume || item.issue || item.page_start) && (
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {item.volume ? `Vol. ${item.volume}` : ''}
                              {item.issue ? ` No. ${item.issue}` : ''}
                              {item.page_start ? ` pp. ${item.page_start}-${item.page_end || ''}` : ''}
                            </div>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="size-7 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="แก้ไขข้อมูล"
                            >
                              <FaEdit style={{ fontSize: '13px' }} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="size-7 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="ลบข้อมูล"
                            >
                              <FaTrashAlt style={{ fontSize: '12px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '880px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                backgroundColor: '#00A651',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                {editingItem ? 'แก้ไขข้อมูล: ผลงานตีพิมพ์ทางวิชาการ' : 'เพิ่มข้อมูล: ผลงานตีพิมพ์ทางวิชาการ'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (confirm('คุณต้องการปิดโดยไม่บันทึกการเปลี่ยนแปลงหรือไม่?')) {
                    setIsModalOpen(false);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '22px',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                  opacity: 0.85,
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '20px 24px', flex: 1 }}>
                <PublicationForm
                  formData={formData}
                  onChange={handleFieldChange}
                  setFormData={setFormData}
                  isEdit={Boolean(editingItem)}
                  errors={formErrors}
                />
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '14px 24px',
                  backgroundColor: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (confirm('คุณต้องการยกเลิกโดยไม่บันทึกการเปลี่ยนแปลงหรือไม่?')) {
                      setIsModalOpen(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="h-9 px-4 text-xs font-semibold text-slate-700 bg-white"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-5 text-xs font-semibold text-white bg-[#00A651] hover:bg-[#008a43] shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>กำลังบันทึก...</span>
                  ) : (
                    <span>{editingItem ? 'บันทึกการเปลี่ยนแปลง' : 'บันทึกข้อมูล'}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmActionModal
          isOpen={Boolean(deleteTarget)}
          title="ยืนยันการลบผลงานตีพิมพ์ทางวิชาการ"
          message={`คุณแน่ใจหรือไม่ว่าต้องการลบผลงาน "${deleteTarget.name}"? การดำเนินการนี้ไม่สามารถเรียกคืนได้`}
          confirmText="ลบรายการ"
          cancelText="ยกเลิก"
          type="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Record Detail Drawer */}
      <RecordDetailDrawer
        isOpen={Boolean(selectedDetailItem)}
        onClose={() => setSelectedDetailItem(null)}
        categoryKey="publications"
        record={selectedDetailItem}
        readOnly={true}
      />
    </div>
  );
}
