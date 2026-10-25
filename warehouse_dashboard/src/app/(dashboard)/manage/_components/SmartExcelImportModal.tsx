'use client';

import React, { useState, useRef, useMemo } from 'react';
import { CategoryKey, SheetParseResult, ParsedRowResult } from '@/types/dataManagement';
import { CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { parseExcelFile, downloadExcelTemplate, transformAndValidateRow } from '@/lib/etlEngine';
import { SmartAddEditModal } from './SmartAddEditModal';
import { DepartmentBadge, SearchInput } from '@/components/ui';
import {
  FaFileExcel,
  FaCloudUploadAlt,
  FaDownload,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaEdit,
  FaTrashAlt,
  FaInfoCircle,
  FaCheck,
  FaListUl,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

interface SmartExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: CategoryKey;
  onCommitImport: (
    importedRows: Record<string, any>[],
    mode: 'append' | 'overwrite',
    targetCategory: CategoryKey
  ) => void;
  existingDatasets?: Partial<Record<CategoryKey, Record<string, any>[]>>;
  existingRecords?: Record<string, any>[];
}

export const SmartExcelImportModal: React.FC<SmartExcelImportModalProps> = ({
  isOpen,
  onClose,
  activeCategory,
  onCommitImport,
  existingDatasets,
  existingRecords,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sheets, setSheets] = useState<SheetParseResult[]>([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [importMode, setImportMode] = useState<'append' | 'overwrite'>('append');
  const [skipExistingDuplicates, setSkipExistingDuplicates] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search & Filter State inside preview
  const [previewSearch, setPreviewSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'warning' | 'error'>('all');

  // Editing row state
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);

  // Expandable row state for inspecting full details
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleExpandRow = (rowNum: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowNum)) next.delete(rowNum);
      else next.add(rowNum);
      return next;
    });
  };

  const currentCategoryConfig = CATEGORIES_CONFIG[activeCategory];
  const currentSheet = sheets[activeSheetIndex];

  const handleFileProcess = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setPreviewSearch('');
    setStatusFilter('all');
    setInlineNotice(null);
    setExpandedRows(new Set());

    try {
      const buffer = await selectedFile.arrayBuffer();
      const recordsToCheck = existingDatasets || existingRecords;
      const result = parseExcelFile(buffer, selectedFile.name, activeCategory, recordsToCheck);
      setSheets(result.sheets);
      const firstNonEmptyIndex = result.sheets.findIndex((s) => s.totalRows > 0);
      setActiveSheetIndex(firstNonEmptyIndex >= 0 ? firstNonEmptyIndex : 0);
      setExpandedRows(new Set());
    } catch (err) {
      console.error('Error parsing Excel:', err);
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel กรุณาตรวจสอบรูปแบบไฟล์');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Save edited row from SmartAddEditModal
  const handleSaveEditedRow = (targetIdx: number, updatedRecord: Record<string, any>) => {
    if (!currentSheet) return;

    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];
      const targetSheet = { ...newSheets[activeSheetIndex] };
      const newRows = [...targetSheet.rows];
      const targetRow = newRows[targetIdx];

      if (!targetRow) return prevSheets;

      // Re-run validation with updated data
      const revalidated = transformAndValidateRow(
        { ...targetRow.data, ...updatedRecord },
        targetRow.rowNumber,
        targetSheet.categoryKey
      );

      newRows[targetIdx] = revalidated;
      targetSheet.rows = newRows;

      // Recalculate stats
      targetSheet.validRows = newRows.filter((r) => r.status === 'valid').length;
      targetSheet.warningRows = newRows.filter((r) => r.status === 'warning').length;
      targetSheet.errorRows = newRows.filter((r) => r.status === 'error').length;
      targetSheet.totalRows = newRows.length;

      newSheets[activeSheetIndex] = targetSheet;
      return newSheets;
    });

    setInlineNotice(`✓ ปรับปรุงข้อมูลแถวที่ ${currentSheet.rows[targetIdx]?.rowNumber || targetIdx + 1} เรียบร้อยแล้ว`);
    setTimeout(() => {
      setInlineNotice(null);
    }, 4000);
  };

  // Remove row from import list
  const handleRemoveRow = (targetIdx: number) => {
    if (!currentSheet) return;
    const removedRow = currentSheet.rows[targetIdx];

    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];
      const targetSheet = { ...newSheets[activeSheetIndex] };
      const newRows = targetSheet.rows.filter((_, idx) => idx !== targetIdx);
      targetSheet.rows = newRows;

      // Recalculate stats
      targetSheet.validRows = newRows.filter((r) => r.status === 'valid').length;
      targetSheet.warningRows = newRows.filter((r) => r.status === 'warning').length;
      targetSheet.errorRows = newRows.filter((r) => r.status === 'error').length;
      targetSheet.totalRows = newRows.length;

      newSheets[activeSheetIndex] = targetSheet;
      return newSheets;
    });

    setInlineNotice(`ลบแถวที่ ${removedRow?.rowNumber || targetIdx + 1} ออกจากรายการนำเข้าแล้ว`);
    setTimeout(() => {
      setInlineNotice(null);
    }, 3000);
  };

  // Final Commit Handler
  const handleCommit = () => {
    if (!currentSheet) return;

    // กรองเฉพาะแถวที่พร้อมนำเข้า (valid หรือ warning) ไม่เอาแถว error
    let usableList = currentSheet.rows.filter((r) => r.status !== 'error');

    // ถ้าอยู่ในโหมด append และเปิดตัวเลือกข้ามข้อมูลที่มีอยู่ในระบบแล้ว
    if (importMode === 'append' && skipExistingDuplicates) {
      usableList = usableList.filter((r) => !r.isExistingDuplicate);
    }

    const usableRows = usableList.map((r) => r.data);

    if (usableRows.length === 0) {
      alert('ไม่มีแถวข้อมูลใหม่พร้อมนำเข้า (รายการทั้งหมดอาจซ้ำกับฐานข้อมูลเดิม หรือมีข้อผิดพลาด)');
      return;
    }

    onCommitImport(usableRows, importMode, currentSheet.categoryKey);
    onClose();
  };

  // Filtered rows for preview table
  const filteredRows = useMemo(() => {
    if (!currentSheet) return [];
    return currentSheet.rows.filter((r) => {
      // 1. Status filter
      if (statusFilter !== 'all' && r.status !== statusFilter) {
        return false;
      }
      // 2. Search query filter
      if (previewSearch.trim()) {
        const query = previewSearch.toLowerCase();
        const conf = CATEGORIES_CONFIG[currentSheet.categoryKey];
        const nameVal = String(r.data[conf.nameKey] || r.data.name || r.data.title || '').toLowerCase();
        const personVal = String(conf.personKey ? r.data[conf.personKey] : '').toLowerCase();
        const deptVal = String(conf.departmentKey ? r.data[conf.departmentKey] : '').toLowerCase();
        const issuesVal = r.issues.map((i) => i.message).join(' ').toLowerCase();

        return (
          nameVal.includes(query) ||
          personVal.includes(query) ||
          deptVal.includes(query) ||
          issuesVal.includes(query) ||
          String(r.rowNumber).includes(query)
        );
      }
      return true;
    });
  }, [currentSheet, statusFilter, previewSearch]);

  const existingDupCount = currentSheet
    ? currentSheet.rows.filter((r) => r.isExistingDuplicate).length
    : 0;

  const willImportCount = currentSheet
    ? currentSheet.rows.filter((r) => {
        if (r.status === 'error') return false;
        if (importMode === 'append' && skipExistingDuplicates && r.isExistingDuplicate) return false;
        return true;
      }).length
    : 0;

  const usableCount = willImportCount;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
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
          maxWidth: '1160px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* 1. Header */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#00A651',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #008f45',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaFileExcel style={{ fontSize: '22px', color: '#ffffff' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em' }}>
                นำเข้าข้อมูล Excel ({currentCategoryConfig.title})
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#dcfce7', opacity: 0.9 }}>
                ระบบ ETL ตรวจสอบความถูกต้อง ทำความสะอาด และจับคู่ชื่อบุคลากรอัตโนมัติก่อนบันทึก
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              opacity: 0.85,
              padding: '4px 8px',
              lineHeight: 1,
            }}
            title="ปิดหน้าต่าง"
          >
            &times;
          </button>
        </div>

        {/* 2. Body Content */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#f8fafc',
          }}
        >
          {/* STEP 1: Upload / Dropzone */}
          {!file ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 'auto 0' }}>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2.5px dashed #00A651' : '2px dashed #cbd5e1',
                  borderRadius: '14px',
                  padding: '52px 24px',
                  textAlign: 'center',
                  backgroundColor: isDragging ? '#f0fdf4' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileProcess(e.target.files[0]);
                    }
                  }}
                />
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#f0fbf5',
                    color: '#00A651',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    fontSize: '28px',
                  }}
                >
                  <FaCloudUploadAlt />
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 600, color: '#1e293b' }}>
                  คลิกเพื่อเลือกไฟล์ หรือลากไฟล์ Excel (.xlsx, .xls) มาวางที่นี่
                </h4>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
                  ระบบจะอ่านโครงสร้างและสรุปรายการที่ตรวจพบ พร้อมให้ตรวจสอบและแก้ไขก่อนกดยืนยัน
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  เลือกไฟล์จากคอมพิวเตอร์
                </span>
              </div>

              {/* Template download link */}
              <div
                style={{
                  padding: '12px 18px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ fontSize: '13px', color: '#475569' }}>
                  ต้องการไฟล์แม่แบบ Excel ที่มีโครงสร้างคอลัมน์ถูกต้อง?
                </div>
                <button
                  type="button"
                  onClick={() => downloadExcelTemplate(activeCategory)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #00A651',
                    backgroundColor: '#f0fbf5',
                    color: '#00A651',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <FaDownload style={{ fontSize: '11px' }} />
                  <span>ดาวน์โหลด Template ({currentCategoryConfig.title})</span>
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', margin: 'auto 0' }}>
              <FaSpinner
                style={{
                  fontSize: '44px',
                  color: '#00A651',
                  marginBottom: '16px',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#1e293b' }}>
                กำลังประมวลผลและตรวจสอบข้อมูลด้วยระบบ ETL...
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                กำลังตรวจสอบความครบถ้วนของข้อมูลและจับคู่ชื่ออาจารย์ 304 ท่าน
              </div>
            </div>
          ) : (
            <>
              {/* STEP 2: File Info Bar */}
              {file && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaFileExcel style={{ color: '#00A651', fontSize: '18px' }} />
                    <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                      {file.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setSheets([]);
                      setPreviewSearch('');
                    }}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      color: '#475569',
                    }}
                  >
                    เปลี่ยนไฟล์
                  </button>
                </div>
              )}

              {/* Multi-Sheet Selector Tabs (if workbook has multiple sheets) */}
              {sheets.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                    ตรวจพบ {sheets.length} แผ่นงาน (Sheets) ในไฟล์รวมเล่ม:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                    {sheets.map((s, idx) => {
                      const isSel = activeSheetIndex === idx;
                      return (
                        <button
                          key={s.sheetName}
                          onClick={() => {
                            setActiveSheetIndex(idx);
                            setPreviewSearch('');
                            setStatusFilter('all');
                            setExpandedRows(new Set());
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: isSel ? '1.5px solid #00A651' : '1px solid #cbd5e1',
                            backgroundColor: isSel ? '#00A651' : '#ffffff',
                            color: isSel ? '#ffffff' : '#334155',
                            fontSize: '12.5px',
                            fontWeight: isSel ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: isSel ? '0 2px 6px rgba(0, 166, 81, 0.25)' : 'none',
                          }}
                        >
                          <span>{s.sheetName}</span>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '1px 6px',
                              borderRadius: '10px',
                              backgroundColor: isSel ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                              color: isSel ? '#ffffff' : '#64748b',
                            }}
                          >
                            {s.totalRows} แถว
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inline Notice Toast */}
              {inlineNotice && (
                <div
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #059669',
                    borderRadius: '8px',
                    color: '#065f46',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaCheck style={{ fontSize: '11px' }} />
                  <span>{inlineNotice}</span>
                </div>
              )}

              {/* STEP 3: Status Stat Chips (Filter buttons) */}
              {currentSheet && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {/* ทั้งหมด */}
                  <div
                    onClick={() => setStatusFilter('all')}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: statusFilter === 'all' ? '#ffffff' : '#ffffff',
                      borderRadius: '10px',
                      border: statusFilter === 'all' ? '2px solid #00A651' : '1px solid #e2e8f0',
                      boxShadow: statusFilter === 'all' ? '0 2px 6px rgba(0, 166, 81, 0.15)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>รายการทั้งหมด</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>
                      {currentSheet.totalRows} แถว
                    </div>
                  </div>

                  {/* ผ่านสมบูรณ์ */}
                  <div
                    onClick={() => setStatusFilter('valid')}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: statusFilter === 'valid' ? '#f0fdf4' : '#ffffff',
                      borderRadius: '10px',
                      border: statusFilter === 'valid' ? '2px solid #16a34a' : '1px solid #bbf7d0',
                      boxShadow: statusFilter === 'valid' ? '0 2px 6px rgba(22, 163, 74, 0.15)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaCheckCircle style={{ fontSize: '11px' }} />
                      <span>ข้อมูลสมบูรณ์</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#15803d', fontVariantNumeric: 'tabular-nums' }}>
                      {currentSheet.validRows} แถว
                    </div>
                  </div>

                  {/* มีคำเตือน / Auto-matched */}
                  <div
                    onClick={() => setStatusFilter('warning')}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: statusFilter === 'warning' ? '#fffbeb' : '#ffffff',
                      borderRadius: '10px',
                      border: statusFilter === 'warning' ? '2px solid #d97706' : '1px solid #fde68a',
                      boxShadow: statusFilter === 'warning' ? '0 2px 6px rgba(217, 119, 6, 0.15)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '11.5px', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaExclamationTriangle style={{ fontSize: '11px' }} />
                      <span>มีข้อควรตรวจทาน</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#b45309', fontVariantNumeric: 'tabular-nums' }}>
                      {currentSheet.warningRows} แถว
                    </div>
                  </div>

                  {/* ข้อผิดพลาด */}
                  <div
                    onClick={() => setStatusFilter('error')}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: statusFilter === 'error' ? '#fef2f2' : '#ffffff',
                      borderRadius: '10px',
                      border: statusFilter === 'error' ? '2px solid #dc2626' : '1px solid #fecaca',
                      boxShadow: statusFilter === 'error' ? '0 2px 6px rgba(220, 38, 38, 0.15)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '11.5px', color: '#b91c1c', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaTimesCircle style={{ fontSize: '11px' }} />
                      <span>ข้อผิดพลาด (ไม่บันทึก)</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#b91c1c', fontVariantNumeric: 'tabular-nums' }}>
                      {currentSheet.errorRows} แถว
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Record Preview Table & Action Controls */}
              {currentSheet && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Toolbar: Search & Filter Summary */}
                  <div
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#ffffff',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaListUl style={{ color: '#00A651', fontSize: '13px' }} />
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
                        รายการข้อมูลที่ตรวจพบ ({filteredRows.length} จาก {currentSheet.rows.length} แถว)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <SearchInput
                        placeholder="ค้นหาชื่อรายการ, ผู้รับผิดชอบ..."
                        value={previewSearch}
                        onChange={setPreviewSearch}
                        width="240px"
                      />
                      {statusFilter !== 'all' && (
                        <button
                          type="button"
                          onClick={() => setStatusFilter('all')}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            backgroundColor: '#f8fafc',
                            fontSize: '12px',
                            color: '#475569',
                            cursor: 'pointer',
                          }}
                        >
                          ล้างตัวกรองสถานะ
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                      <thead
                        style={{
                          backgroundColor: '#f8fafc',
                          color: '#475569',
                          borderBottom: '1px solid #e2e8f0',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        <tr>
                          <th style={{ width: '48px', padding: '11px 6px', textAlign: 'center', fontWeight: 600 }}>แถว</th>
                          <th style={{ width: '80px', padding: '11px 6px', textAlign: 'center', fontWeight: 600 }}>สถานะ</th>
                          <th style={{ padding: '11px 12px', textAlign: 'left', fontWeight: 600 }}>ชื่อรายการ / โครงการ &amp; ข้อมูลจำเพาะ</th>
                          <th style={{ width: '220px', padding: '11px 12px', textAlign: 'left', fontWeight: 600 }}>อาจารย์ / ผู้รับผิดชอบ</th>
                          <th style={{ width: '230px', padding: '11px 12px', textAlign: 'left', fontWeight: 600 }}>ผลการตรวจสอบ &amp; สังเกต</th>
                          <th style={{ width: '135px', padding: '11px 8px', textAlign: 'center', fontWeight: 600 }}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                              ไม่พบแถวข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                            </td>
                          </tr>
                        ) : (
                          filteredRows.map((r) => {
                            const conf = CATEGORIES_CONFIG[currentSheet.categoryKey];
                            const nameVal = r.data[conf.nameKey] || r.data.name || r.data.title || '-';
                            const personVal = conf.personKey ? r.data[conf.personKey] : null;
                            const deptVal = conf.departmentKey ? r.data[conf.departmentKey] : null;
                            const budgetVal = r.data.budget !== undefined ? r.data.budget : r.data.support_amount;
                            const isExpanded = expandedRows.has(r.rowNumber);

                            // Find original index in currentSheet.rows
                            const originalIdx = currentSheet.rows.findIndex((item) => item.rowNumber === r.rowNumber);

                            return (
                              <React.Fragment key={r.rowNumber}>
                                <tr
                                  style={{
                                    borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9',
                                    backgroundColor: isExpanded ? '#f0fdf4' : r.status === 'error' ? '#fef2f233' : '#ffffff',
                                    transition: 'background-color 0.15s ease',
                                  }}
                                >
                                  {/* Row Number */}
                                  <td style={{ textAlign: 'center', padding: '10px 6px', color: '#64748b', fontWeight: 600, fontSize: '12px' }}>
                                    {r.rowNumber}
                                  </td>

                                  {/* Status */}
                                  <td style={{ textAlign: 'center', padding: '10px 6px' }}>
                                    {r.status === 'valid' ? (
                                      <span
                                        style={{
                                          backgroundColor: '#dcfce7',
                                          color: '#166534',
                                          padding: '2.5px 8px',
                                          borderRadius: '6px',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          display: 'inline-block',
                                        }}
                                      >
                                        ผ่าน
                                      </span>
                                    ) : r.status === 'warning' ? (
                                      <span
                                        style={{
                                          backgroundColor: '#fef3c7',
                                          color: '#b45309',
                                          padding: '2.5px 8px',
                                          borderRadius: '6px',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          display: 'inline-block',
                                        }}
                                      >
                                        เตือน
                                      </span>
                                    ) : (
                                      <span
                                        style={{
                                          backgroundColor: '#fee2e2',
                                          color: '#dc2626',
                                          padding: '2.5px 8px',
                                          borderRadius: '6px',
                                          fontSize: '11px',
                                          fontWeight: 700,
                                          display: 'inline-block',
                                        }}
                                      >
                                        ผิดพลาด
                                      </span>
                                    )}
                                  </td>

                                  {/* Title & Metadata Specs */}
                                  <td style={{ padding: '10px 12px' }}>
                                    <div style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.4, fontSize: '13px' }}>
                                      {nameVal}
                                    </div>

                                    {/* Category metadata pills */}
                                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginTop: '5px' }}>
                                      {/* Type badge (สิทธิบัตร / อนุสิทธิบัตร / ลิขสิทธิ์ / วิจัย) */}
                                      {r.data.type && (
                                        <span
                                          style={{
                                            padding: '1.5px 7px',
                                            borderRadius: '4px',
                                            backgroundColor: '#f0f9ff',
                                            color: '#0284c7',
                                            border: '1px solid #bae6fd',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                          }}
                                        >
                                          {r.data.type}
                                        </span>
                                      )}

                                      {/* Patent / Registration No */}
                                      {r.data.reg_info && (
                                        <span style={{ fontSize: '11px', color: '#475569', backgroundColor: '#f1f5f9', padding: '1.5px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                          ทะเบียน: <strong>{r.data.reg_info}</strong>
                                        </span>
                                      )}

                                      {/* Request No */}
                                      {r.data.req_info && !r.data.reg_info && (
                                        <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f8fafc', padding: '1.5px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                          คำขอ: <strong>{r.data.req_info}</strong>
                                        </span>
                                      )}

                                      {/* Project Code */}
                                      {r.data.id && (
                                        <span style={{ fontSize: '11px', color: '#475569', backgroundColor: '#f1f5f9', padding: '1.5px 6px', borderRadius: '4px' }}>
                                          รหัส: <strong>{r.data.id}</strong>
                                        </span>
                                      )}

                                      {/* Fiscal Year / Date */}
                                      {(r.data.fiscal_year_be || r.data.year || r.data.month) && (
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                                          ปี: {r.data.fiscal_year_be || r.data.year || r.data.month}
                                        </span>
                                      )}

                                      {/* Budget */}
                                      {typeof budgetVal === 'number' && budgetVal > 0 && (
                                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                                          งบ: {budgetVal.toLocaleString('th-TH')} ฿
                                        </span>
                                      )}

                                      {/* Journal / Level */}
                                      {r.data.journal && (
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                                          {r.data.journal} {r.data.level ? `(${r.data.level})` : ''}
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Person & Dept */}
                                  <td style={{ padding: '10px 12px', color: '#475569' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '12.5px' }}>
                                      {personVal || '-'}
                                    </div>
                                    {r.matchedPerson ? (
                                      <div style={{ fontSize: '11px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                                        <FaCheckCircle style={{ fontSize: '10px' }} />
                                        <span>ตรงกับฐานข้อมูลบุคลากร</span>
                                      </div>
                                    ) : personVal && personVal !== '-' ? (
                                      <div style={{ fontSize: '11px', color: '#b45309', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                                        <FaExclamationTriangle style={{ fontSize: '10px' }} />
                                        <span>ยังไม่พบใน Master Data</span>
                                      </div>
                                    ) : null}
                                    {deptVal && (
                                      <div style={{ marginTop: '4px' }}>
                                        <DepartmentBadge value={deptVal} />
                                      </div>
                                    )}
                                  </td>

                                  {/* Issues */}
                                  <td style={{ padding: '10px 12px', fontSize: '11.5px', color: '#64748b' }}>
                                    {r.issues.length > 0 ? (
                                      r.issues.map((iss, iIdx) => (
                                        <div
                                          key={iIdx}
                                          style={{
                                            color: iss.level === 'error' ? '#dc2626' : '#d97706',
                                            lineHeight: 1.35,
                                            fontWeight: 500,
                                          }}
                                        >
                                          • {iss.message}
                                        </div>
                                      ))
                                    ) : (
                                      <span style={{ color: '#15803d', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <FaCheckCircle style={{ fontSize: '11px' }} />
                                        <span>ข้อมูลครบถ้วนสมบูรณ์</span>
                                      </span>
                                    )}
                                  </td>

                                  {/* Actions: Edit, Toggle Details, Remove */}
                                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                      {/* Edit Button */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingRowIndex(originalIdx);
                                        }}
                                        title="แก้ไขข้อมูลแถวนี้ก่อนนำเข้า"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          padding: '5px 9px',
                                          borderRadius: '6px',
                                          border: '1px solid #86efac',
                                          backgroundColor: '#f0fdf4',
                                          color: '#15803d',
                                          fontSize: '11.5px',
                                          fontWeight: 600,
                                          cursor: 'pointer',
                                          transition: 'all 0.15s ease',
                                        }}
                                      >
                                        <FaEdit style={{ fontSize: '11px' }} />
                                        <span>แก้ไข</span>
                                      </button>

                                      {/* Toggle Expand / Full Details Button */}
                                      <button
                                        type="button"
                                        onClick={() => toggleExpandRow(r.rowNumber)}
                                        title={isExpanded ? 'ซ่อนรายละเอียด' : 'ดูข้อมูลทุกฟิลด์ที่สกัดได้จาก Excel'}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          padding: '5px 7px',
                                          borderRadius: '6px',
                                          border: '1px solid #cbd5e1',
                                          backgroundColor: isExpanded ? '#e2e8f0' : '#ffffff',
                                          color: '#475569',
                                          fontSize: '11px',
                                          cursor: 'pointer',
                                          transition: 'all 0.15s ease',
                                        }}
                                      >
                                        {isExpanded ? <FaChevronUp style={{ fontSize: '10px' }} /> : <FaChevronDown style={{ fontSize: '10px' }} />}
                                      </button>

                                      {/* Remove Row Button */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveRow(originalIdx);
                                        }}
                                        title="ตัดแถวนี้ออกจากการนำเข้า"
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          padding: '5px 7px',
                                          borderRadius: '6px',
                                          border: '1px solid #fecaca',
                                          backgroundColor: '#fff5f5',
                                          color: '#dc2626',
                                          fontSize: '11px',
                                          cursor: 'pointer',
                                          transition: 'all 0.15s ease',
                                        }}
                                      >
                                        <FaTrashAlt style={{ fontSize: '10px' }} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* Expanded Full Detail Row */}
                                {isExpanded && (
                                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <td colSpan={6} style={{ padding: '14px 20px' }}>
                                      <div
                                        style={{
                                          backgroundColor: '#ffffff',
                                          borderRadius: '10px',
                                          border: '1px solid #cbd5e1',
                                          padding: '14px 18px',
                                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                        }}
                                      >
                                        {/* Drawer Header */}
                                        <div
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '12px',
                                            paddingBottom: '8px',
                                            borderBottom: '1px solid #f1f5f9',
                                          }}
                                        >
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span
                                              style={{
                                                width: '22px',
                                                height: '22px',
                                                borderRadius: '50%',
                                                backgroundColor: '#00A651',
                                                color: '#ffffff',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                              }}
                                            >
                                              {r.rowNumber}
                                            </span>
                                            <span style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>
                                              รายละเอียดข้อมูลทั้งหมดที่สกัดได้จาก Excel (แถวที่ {r.rowNumber})
                                            </span>
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() => setEditingRowIndex(originalIdx)}
                                            style={{
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              gap: '6px',
                                              padding: '5px 12px',
                                              borderRadius: '6px',
                                              backgroundColor: '#00A651',
                                              color: '#ffffff',
                                              fontSize: '12px',
                                              fontWeight: 600,
                                              border: 'none',
                                              cursor: 'pointer',
                                              boxShadow: '0 2px 4px rgba(0,166,81,0.2)',
                                            }}
                                          >
                                            <FaEdit style={{ fontSize: '11px' }} />
                                            <span>แก้ไขข้อมูลแถวนี้ (Smart Edit)</span>
                                          </button>
                                        </div>

                                        {/* Key-Value Grid */}
                                        <div
                                          style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                                            gap: '10px',
                                            fontSize: '12px',
                                          }}
                                        >
                                          {Object.entries(r.data).map(([k, v]) => {
                                            if (k === '_id' || v === undefined || v === null || v === '') return null;
                                            const colDef = conf.columns.find((c) => c.key === k);
                                            const label = colDef?.label || k;

                                            return (
                                              <div
                                                key={k}
                                                style={{
                                                  backgroundColor: '#f8fafc',
                                                  padding: '8px 12px',
                                                  borderRadius: '6px',
                                                  border: '1px solid #e2e8f0',
                                                }}
                                              >
                                                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                                                  {label}
                                                </div>
                                                <div
                                                  style={{
                                                    color: '#0f172a',
                                                    fontWeight: 600,
                                                    marginTop: '2px',
                                                    wordBreak: 'break-word',
                                                  }}
                                                >
                                                  {typeof v === 'number' && (k.toLowerCase().includes('budget') || k.toLowerCase().includes('amount'))
                                                    ? `${v.toLocaleString('th-TH')} ฿`
                                                    : typeof v === 'object'
                                                    ? JSON.stringify(v)
                                                    : String(v)}
                                                </div>
                                              </div>
                                            );
                                          })}
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
                </div>
              )}

              {/* STEP 5: Mode Selection (Append vs Overwrite) & Deduplication */}
              <div
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    โหมดการนำเข้า:
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#1e293b',
                    }}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                    />
                    <span>
                      <strong>เพิ่มต่อท้ายข้อมูลเดิม (Append)</strong>{' '}
                      <span style={{ color: '#64748b', fontSize: '12px' }}>(แนะนำ ไม่ลบข้อมูลเดิม)</span>
                    </span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#b91c1c',
                    }}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="overwrite"
                      checked={importMode === 'overwrite'}
                      onChange={() => setImportMode('overwrite')}
                    />
                    <span>
                      <strong>ล้างและเขียนทับทั้งหมด (Overwrite)</strong>
                    </span>
                  </label>
                </div>

                {importMode === 'append' && existingDupCount > 0 && (
                  <div
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '8px 12px',
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="skipExistingDuplicates"
                      checked={skipExistingDuplicates}
                      onChange={(e) => setSkipExistingDuplicates(e.target.checked)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#00A651' }}
                    />
                    <label
                      htmlFor="skipExistingDuplicates"
                      style={{ cursor: 'pointer', fontSize: '12.5px', color: '#92400e', fontWeight: 600 }}
                    >
                      ข้ามรายการที่มีอยู่ในระบบแล้วอัตโนมัติ ({existingDupCount} รายการ เพื่อป้องกันข้อมูลซ้ำซ้อน)
                    </label>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 3. Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            ยกเลิก
          </button>

          {file && currentSheet && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                พร้อมบันทึก: <strong style={{ color: '#00A651' }}>{usableCount}</strong> รายการ
                {importMode === 'append' && skipExistingDuplicates && existingDupCount > 0 && (
                  <span style={{ color: '#b45309', marginLeft: '6px', fontSize: '12px', fontWeight: 600 }}>
                    (ข้ามข้อมูลซ้ำในระบบ {existingDupCount} รายการ)
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={handleCommit}
                disabled={usableCount === 0}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: usableCount > 0 ? '#00A651' : '#cbd5e1',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: usableCount > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: usableCount > 0 ? '0 4px 12px rgba(0, 166, 81, 0.25)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <FaCheckCircle style={{ fontSize: '14px' }} />
                <span>ยืนยันบันทึกข้อมูลเข้าสู่ระบบ ({usableCount} รายการ)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Edit Row Modal via SmartAddEditModal */}
      {editingRowIndex !== null && currentSheet && currentSheet.rows[editingRowIndex] && (
        <SmartAddEditModal
          isOpen={true}
          onClose={() => setEditingRowIndex(null)}
          config={CATEGORIES_CONFIG[currentSheet.categoryKey]}
          initialData={currentSheet.rows[editingRowIndex].data}
          onSave={(updatedRecord) => {
            handleSaveEditedRow(editingRowIndex, updatedRecord);
            setEditingRowIndex(null);
          }}
        />
      )}
    </div>
  );
};
