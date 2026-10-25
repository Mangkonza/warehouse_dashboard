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
}

export const SmartExcelImportModal: React.FC<SmartExcelImportModalProps> = ({
  isOpen,
  onClose,
  activeCategory,
  onCommitImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sheets, setSheets] = useState<SheetParseResult[]>([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [importMode, setImportMode] = useState<'append' | 'overwrite'>('append');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search & Filter State inside preview
  const [previewSearch, setPreviewSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'warning' | 'error'>('all');

  // Editing row state
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCategoryConfig = CATEGORIES_CONFIG[activeCategory];
  const currentSheet = sheets[activeSheetIndex];

  const handleFileProcess = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setPreviewSearch('');
    setStatusFilter('all');
    setInlineNotice(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const result = parseExcelFile(buffer, selectedFile.name, activeCategory);
      setSheets(result.sheets);
      setActiveSheetIndex(0);
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
    const usableRows = currentSheet.rows
      .filter((r) => r.status !== 'error')
      .map((r) => r.data);

    if (usableRows.length === 0) {
      alert('ไม่มีแถวข้อมูลที่สมบูรณ์พร้อมนำเข้า กรุณาแก้ไขแถวที่มีข้อผิดพลาดก่อนบันทึก');
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

  const usableCount = currentSheet
    ? currentSheet.rows.filter((r) => r.status !== 'error').length
    : 0;

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
          maxWidth: '1060px',
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
              {/* STEP 2: Alert Notification Banner (แจ้งเตือนข้อมูล) */}
              {currentSheet && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1.5px solid #00A651',
                    boxShadow: '0 2px 8px rgba(0, 166, 81, 0.08)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* Row 1: File info bar & switch button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaFileExcel style={{ color: '#00A651', fontSize: '18px' }} />
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
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

                  {/* Row 2: Headline & Summary Message */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#f0fbf5',
                        color: '#00A651',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <FaInfoCircle style={{ fontSize: '13px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                        ตรวจพบข้อมูลทั้งหมด {currentSheet.totalRows} รายการ ในหมวด &quot;{CATEGORIES_CONFIG[currentSheet.categoryKey].title}&quot;
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '3px' }}>
                        พร้อมนำเข้าเข้าสู่ระบบ <strong>{usableCount} รายการ</strong> (ผ่านสมบูรณ์ {currentSheet.validRows} รายการ, มีข้อควรตรวจทาน {currentSheet.warningRows} รายการ, ข้อผิดพลาด {currentSheet.errorRows} รายการ)
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#059669',
                          fontWeight: 600,
                          marginTop: '6px',
                          backgroundColor: '#f0fdf4',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          display: 'inline-block',
                        }}
                      >
                        💡 ท่านสามารถตรวจสอบรายการในตารางด้านล่าง และคลิกปุ่ม <strong>&quot;แก้ไข&quot;</strong> เพื่อปรับปรุงข้อมูล หรือกด <strong>&quot;ลบ&quot;</strong> เพื่อตัดรายการที่ไม่ต้องการออกได้ ก่อนกดยืนยันบันทึก
                      </div>
                    </div>
                  </div>
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
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
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
                          <th style={{ width: '50px', padding: '10px 8px', textAlign: 'center', fontWeight: 600 }}>แถว</th>
                          <th style={{ width: '80px', padding: '10px 8px', textAlign: 'center', fontWeight: 600 }}>สถานะ</th>
                          <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>ชื่อรายการ / โครงการ</th>
                          <th style={{ width: '180px', padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>ผู้รับผิดชอบ / สังกัด</th>
                          <th style={{ width: '120px', padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>งบประมาณ</th>
                          <th style={{ width: '220px', padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>รายละเอียดการตรวจสอบ</th>
                          <th style={{ width: '110px', padding: '10px 8px', textAlign: 'center', fontWeight: 600 }}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
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

                            // Find original index in currentSheet.rows
                            const originalIdx = currentSheet.rows.findIndex((item) => item.rowNumber === r.rowNumber);

                            return (
                              <tr
                                key={r.rowNumber}
                                style={{
                                  borderBottom: '1px solid #f1f5f9',
                                  backgroundColor: r.status === 'error' ? '#fef2f233' : '#ffffff',
                                  transition: 'background-color 0.1s ease',
                                }}
                              >
                                <td style={{ textAlign: 'center', padding: '10px 8px', color: '#64748b', fontWeight: 500 }}>
                                  {r.rowNumber}
                                </td>

                                {/* Status */}
                                <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                                  {r.status === 'valid' ? (
                                    <span
                                      style={{
                                        backgroundColor: '#dcfce7',
                                        color: '#166534',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 600,
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
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 600,
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
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        display: 'inline-block',
                                      }}
                                    >
                                      ผิดพลาด
                                    </span>
                                  )}
                                </td>

                                {/* Name */}
                                <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b', lineHeight: 1.35 }}>
                                  <div>{nameVal}</div>
                                  {r.data.id && (
                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400, marginTop: '2px' }}>
                                      รหัส: {r.data.id}
                                    </div>
                                  )}
                                </td>

                                {/* Person & Dept */}
                                <td style={{ padding: '10px 12px', color: '#475569' }}>
                                  <div style={{ fontWeight: 500, color: '#1e293b' }}>{personVal || '-'}</div>
                                  {r.matchedPerson && (
                                    <div style={{ fontSize: '11px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                                      <FaCheckCircle style={{ fontSize: '10px' }} />
                                      <span>ตรงกับฐานข้อมูลบุคลากร</span>
                                    </div>
                                  )}
                                  {deptVal && (
                                    <div style={{ marginTop: '3px' }}>
                                      <DepartmentBadge value={deptVal} />
                                    </div>
                                  )}
                                </td>

                                {/* Budget */}
                                <td
                                  style={{
                                    padding: '10px 12px',
                                    textAlign: 'right',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    fontVariantNumeric: 'tabular-nums',
                                  }}
                                >
                                  {typeof budgetVal === 'number' && budgetVal > 0
                                    ? `${budgetVal.toLocaleString('th-TH')} ฿`
                                    : '-'}
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
                                        }}
                                      >
                                        • {iss.message}
                                      </div>
                                    ))
                                  ) : (
                                    <span style={{ color: '#15803d' }}>✓ ข้อมูลครบถ้วนสมบูรณ์</span>
                                  )}
                                </td>

                                {/* Actions: Edit & Remove */}
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <button
                                      type="button"
                                      onClick={() => setEditingRowIndex(originalIdx)}
                                      title="แก้ไขข้อมูลแถวนี้ก่อนนำเข้า"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        color: '#00A651',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <FaEdit style={{ fontSize: '10px' }} />
                                      <span>แก้ไข</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveRow(originalIdx)}
                                      title="ตัดแถวนี้ออกจากการนำเข้า"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '4px 6px',
                                        borderRadius: '6px',
                                        border: '1px solid #fecaca',
                                        backgroundColor: '#fff5f5',
                                        color: '#dc2626',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <FaTrashAlt style={{ fontSize: '10px' }} />
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
                </div>
              )}

              {/* STEP 5: Mode Selection (Append vs Overwrite) */}
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
