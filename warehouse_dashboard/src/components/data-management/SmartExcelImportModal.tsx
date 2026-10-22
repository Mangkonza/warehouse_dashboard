'use client';

import React, { useState, useRef } from 'react';
import { CategoryKey, SheetParseResult } from '../../types/dataManagement';
import { CATEGORIES_CONFIG } from '../../config/dataManagementConfig';
import { parseExcelFile, downloadExcelTemplate } from '../../lib/etlEngine';
import { FaFileExcel, FaCloudUploadAlt, FaDownload, FaSpinner, FaCheckCircle } from 'react-icons/fa';

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

  if (!isOpen) return null;

  const currentCategoryConfig = CATEGORIES_CONFIG[activeCategory];

  const handleFileProcess = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
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

  const handleCommit = () => {
    const currentSheet = sheets[activeSheetIndex];
    if (!currentSheet) return;

    // กรองเฉพาะแถวที่ผ่าน (valid หรือ warning) ไม่เอาแถว error
    const usableRows = currentSheet.rows
      .filter((r) => r.status !== 'error')
      .map((r) => r.data);

    if (usableRows.length === 0) {
      alert('ไม่มีแถวข้อมูลที่สมบูรณ์พร้อมนำเข้า');
      return;
    }

    onCommitImport(usableRows, importMode, currentSheet.categoryKey);
    onClose();
  };

  const currentSheet = sheets[activeSheetIndex];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
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
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#00a859',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaFileExcel style={{ fontSize: '24px', color: '#bbf7d0' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                นำเข้าไฟล์ข้อมูล Excel ({currentCategoryConfig.title})
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#dcfce7' }}>
                ระบบตรวจจับโครงสร้าง ล้างข้อมูล ทำความสะอาด และจับคู่ชื่ออาจารย์ 304 ท่านอัตโนมัติ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '22px',
              cursor: 'pointer',
              opacity: 0.8,
            }}
          >
            &times;
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step 1: Upload / Dropzone */}
          {!file ? (
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2px dashed #00a859' : '2px dashed #94a3b8',
                  borderRadius: '12px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: isDragging ? '#f0fdf4' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
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
                <FaCloudUploadAlt style={{ fontSize: '48px', color: '#00a859', marginBottom: '14px' }} />
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1e293b' }}>
                  คลิกเพื่อเลือกไฟล์ หรือลากไฟล์ Excel (.xlsx, .xls) มาวางที่นี่
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  รองรับทั้งไฟล์เฉพาะหมวด (Single Domain) และไฟล์รวมเล่มหลาย Sheet (Master Multi-Sheet)
                </p>
              </div>

              {/* Template download link */}
              <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                ต้องการไฟล์แม่แบบที่ถูกต้อง?{' '}
                <button
                  type="button"
                  onClick={() => downloadExcelTemplate(activeCategory)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#00a859',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <FaDownload style={{ marginRight: '5px', fontSize: '12px' }} />
                  ดาวน์โหลด Template (.xlsx) สำหรับ{currentCategoryConfig.title}
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <FaSpinner style={{ fontSize: '40px', color: '#00a859', marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
                กำลังตรวจสอบและประมวลผลข้อมูล...
              </div>
            </div>
          ) : (
            <div>
              {/* File Info Bar & Change File */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '10px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaFileExcel style={{ color: '#00a859', fontSize: '20px' }} />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
                      {file.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '8px' }}>
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setSheets([]);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: '#475569',
                  }}
                >
                  เปลี่ยนไฟล์
                </button>
              </div>

              {/* Multi-Sheet Selector Tabs if Master Workbook */}
              {sheets.length > 1 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                    ตรวจพบ {sheets.length} แผ่นงาน (Sheets) ในไฟล์รวมเล่ม:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {sheets.map((s, idx) => (
                      <button
                        key={s.sheetName}
                        onClick={() => setActiveSheetIndex(idx)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: activeSheetIndex === idx ? '1px solid #00a859' : '1px solid #cbd5e1',
                          backgroundColor: activeSheetIndex === idx ? '#00a859' : '#ffffff',
                          color: activeSheetIndex === idx ? '#ffffff' : '#334155',
                          fontSize: '12.5px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{s.sheetName}</span>
                        <span style={{ fontSize: '10px', opacity: 0.8 }}>({s.totalRows} แถว)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Summary Stat Chips */}
              {currentSheet && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>รายการทั้งหมด</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                      {currentSheet.totalRows} แถว
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '11px', color: '#166534' }}>✅ แถวสมบูรณ์</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#166534' }}>
                      {currentSheet.validRows} แถว
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '11px', color: '#854d0e' }}>⚠️ มีคำเตือน / Auto-matched</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#854d0e' }}>
                      {currentSheet.warningRows} แถว
                    </div>
                  </div>
                  <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    <div style={{ fontSize: '11px', color: '#991b1b' }}>❌ มีข้อผิดพลาด (ข้าม)</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#991b1b' }}>
                      {currentSheet.errorRows} แถว
                    </div>
                  </div>
                </div>
              )}

              {/* Pre-commit Preview Table */}
              {currentSheet && (
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      backgroundColor: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>ตัวอย่างข้อมูลและผลการตรวจสอบก่อนบันทึก</span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>
                      หมวดเป้าหมาย: <strong>{CATEGORIES_CONFIG[currentSheet.categoryKey].title}</strong>
                    </span>
                  </div>

                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                      <thead style={{ backgroundColor: '#f1f5f9', position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr>
                          <th style={{ width: '50px', padding: '8px', textAlign: 'center' }}>แถว</th>
                          <th style={{ width: '90px', padding: '8px', textAlign: 'center' }}>สถานะ</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left' }}>ชื่อรายการ / โครงการ</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left' }}>อาจารย์ / ผู้รับผิดชอบ</th>
                          <th style={{ padding: '8px 12px', textAlign: 'left' }}>รายละเอียดการตรวจสอบ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSheet.rows.slice(0, 50).map((r) => {
                          const conf = CATEGORIES_CONFIG[currentSheet.categoryKey];
                          const nameVal = r.data[conf.nameKey] || '-';
                          const personVal = conf.personKey ? r.data[conf.personKey] : '-';

                          return (
                            <tr key={r.rowNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ textAlign: 'center', padding: '8px', color: '#94a3b8' }}>
                                {r.rowNumber}
                              </td>
                              <td style={{ textAlign: 'center', padding: '8px' }}>
                                {r.status === 'valid' ? (
                                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                                    ผ่าน
                                  </span>
                                ) : r.status === 'warning' ? (
                                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                                    เตือน
                                  </span>
                                ) : (
                                  <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                                    ผิดพลาด
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '8px 12px', fontWeight: 500, color: '#1e293b' }}>
                                {nameVal}
                              </td>
                              <td style={{ padding: '8px 12px', color: '#475569' }}>
                                {personVal}
                              </td>
                              <td style={{ padding: '8px 12px', fontSize: '11.5px', color: '#64748b' }}>
                                {r.issues.length > 0
                                  ? r.issues.map((i, iIdx) => (
                                      <div key={iIdx} style={{ color: i.level === 'error' ? '#dc2626' : '#d97706' }}>
                                        • {i.message}
                                      </div>
                                    ))
                                  : 'ข้อมูลถูกต้องครบถ้วน'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Mode Selection: Append vs Overwrite */}
              <div
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  โหมดการบันทึกข้อมูล:
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px' }}>
                  <input
                    type="radio"
                    name="importMode"
                    value="append"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                  />
                  <span>เพิ่มต่อท้ายข้อมูลเดิม (Append)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px' }}>
                  <input
                    type="radio"
                    name="importMode"
                    value="overwrite"
                    checked={importMode === 'overwrite'}
                    onChange={() => setImportMode('overwrite')}
                  />
                  <span style={{ color: '#b91c1c' }}>ล้างและเขียนทับทั้งหมด (Overwrite)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ยกเลิก
          </button>

          {file && (
            <button
              type="button"
              onClick={handleCommit}
              disabled={!currentSheet || currentSheet.validRows + currentSheet.warningRows === 0}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#00a859',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 168, 89, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: !currentSheet || currentSheet.validRows + currentSheet.warningRows === 0 ? 0.5 : 1,
              }}
            >
              <FaCheckCircle style={{ fontSize: '15px' }} />
              <span>ยืนยันบันทึกข้อมูลเข้าสู่ระบบ</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
