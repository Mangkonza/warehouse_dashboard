'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ExtensionReasonCategory, ProjectExtensionRecord } from '@/types/projectMonitoring';
import { calculateProjectTimeline, createExtensionRequest } from '@/lib/projectMonitoringEngine';
import { formatDateBE } from '@/components/ui/RecordDetailDrawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DepartmentBadge } from '@/components/ui';
import {
  FaClock,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaArrowRight,
  FaHistory,
} from 'react-icons/fa';

interface ProjectExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectItem: Record<string, any> | null;
  onSaveExtension: (updatedItem: Record<string, any>, newExtension: ProjectExtensionRecord) => void;
}

export const ProjectExtensionModal: React.FC<ProjectExtensionModalProps> = ({
  isOpen,
  onClose,
  projectItem,
  onSaveExtension,
}) => {
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved'>('pending');
  const [reasonCategory, setReasonCategory] = useState<ExtensionReasonCategory>('lab_analysis_waiting');
  const [reasonDetail, setReasonDetail] = useState<string>('');
  const [documentRefNo, setDocumentRefNo] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // คำนวณข้อมูลเวลาสัญญาปัจจุบัน
  const currentTimeline = useMemo(() => {
    if (!projectItem) return null;
    return calculateProjectTimeline(projectItem);
  }, [projectItem]);

  const currentEndDateStr = currentTimeline?.end_date || '';

  // คำนวณวันสิ้นสุดสัญญาใหม่ตามจำนวนเดือน
  const computeEndDateByMonths = (baseDateStr: string, months: number): string => {
    if (!baseDateStr) return '';
    const d = new Date(baseDateStr);
    if (isNaN(d.getTime())) return '';
    d.setMonth(d.getMonth() + months);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // กำหนดวันสิ้นสุดใหม่เริ่มต้นเมื่อเปิด Modal หรือเปลี่ยนโครงการ
  useEffect(() => {
    if (currentEndDateStr) {
      const initialNewDate = computeEndDateByMonths(currentEndDateStr, 3);
      setCustomEndDate(initialNewDate);
      setDurationMonths(3);
      setErrorMsg('');
      setReasonDetail('');
      setDocumentRefNo('');
      setApprovalStatus('pending');
    }
  }, [currentEndDateStr, isOpen]);

  if (!isOpen || !projectItem || !currentTimeline) return null;

  const extensions: ProjectExtensionRecord[] = Array.isArray(projectItem.extensions) ? projectItem.extensions : [];

  // เมื่อผู้ใช้คลิกปุ่มเลือกจำนวนเดือน
  const handleSelectMonths = (m: number) => {
    setDurationMonths(m);
    if (currentEndDateStr) {
      const newD = computeEndDateByMonths(currentEndDateStr, m);
      setCustomEndDate(newD);
    }
    setErrorMsg('');
  };

  // เมื่อผู้ใช้เปลี่ยนวันที่ใน Date input โดยตรง
  const handleDateChange = (val: string) => {
    setCustomEndDate(val);
    setErrorMsg('');
    if (val && currentEndDateStr) {
      const d1 = new Date(currentEndDateStr).getTime();
      const d2 = new Date(val).getTime();
      if (!isNaN(d1) && !isNaN(d2) && d2 > d1) {
        const approxMonths = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24 * 30.4375)));
        setDurationMonths(approxMonths);
      }
    }
  };

  // ตรวจสอบเงื่อนไข: วันสิ้นสุดใหม่ต้องไม่ซ้ำกับวันสิ้นสุดเดิม/ปัจจุบัน
  const isDateIdentical = Boolean(customEndDate && currentEndDateStr && customEndDate === currentEndDateStr);
  const isDateEarlierOrEqual = Boolean(
    customEndDate &&
      currentEndDateStr &&
      new Date(customEndDate).getTime() <= new Date(currentEndDateStr).getTime()
  );

  let validationNotice = '';
  if (isDateIdentical) {
    validationNotice = '⚠️ วันสิ้นสุดสัญญาใหม่ต้องไม่ซ้ำกับวันสิ้นสุดสัญญาเดิม/ปัจจุบัน (กรุณาเลือกขยายเวลาออกไป)';
  } else if (isDateEarlierOrEqual) {
    validationNotice = '⚠️ วันสิ้นสุดสัญญาใหม่ต้องเป็นวันที่หลังจากวันสิ้นสุดสัญญาปัจจุบัน';
  } else if (!customEndDate) {
    validationNotice = '⚠️ กรุณาระบุวันสิ้นสุดสัญญาใหม่';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDateIdentical || isDateEarlierOrEqual || !customEndDate) {
      setErrorMsg(validationNotice || 'วันสิ้นสุดสัญญาใหม่ไม่ถูกต้อง');
      return;
    }

    if (!reasonDetail.trim()) {
      setErrorMsg('กรุณาระบุคำชี้แจงเหตุผลความจำเป็นในการขอขยายเวลาตามระเบียบ มก.');
      return;
    }

    const newExt = createExtensionRequest(projectItem, {
      durationMonths,
      reasonCategory,
      reasonDetail,
      documentRefNo: documentRefNo || `อว 6505/${Date.now().toString().slice(-4)}`,
      customEndDate,
      approvalStatus,
    });

    const currentExts = Array.isArray(projectItem.extensions) ? [...projectItem.extensions] : [];
    const updated = {
      ...projectItem,
      extensions: [...currentExts, newExt],
      status: approvalStatus === 'approved' ? 'extended' : 'extension_requested',
      ...(approvalStatus === 'approved' ? { end_date: customEndDate } : {}),
      closed_date: undefined,
      is_completed: false,
    };

    onSaveExtension(updated, newExt);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1450,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '16px',
          padding: '26px 32px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '14px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#b45309',
                fontSize: '18px',
              }}
            >
              <FaClock />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                บันทึกขอขยายระยะเวลาโครงการ
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0 0' }}>
                ตามระเบียบมหาวิทยาลัยเกษตรศาสตร์ และ สวพ.มก. (KURDI)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Project Context Box */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '18px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>โครงการที่ขอขยายเวลา:</div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#0f172a',
              marginTop: '2px',
              lineHeight: 1.4,
            }}
          >
            {projectItem.name}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              marginTop: '8px',
              fontSize: '12.5px',
              color: '#475569',
            }}
          >
            {projectItem.id && (
              <span>
                รหัส: <strong>{projectItem.id}</strong>
              </span>
            )}
            <span>
              หัวหน้าโครงการ: <strong>{projectItem.head || projectItem.person || '-'}</strong>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ภาควิชา: <DepartmentBadge value={projectItem.department} />
            </span>
          </div>

          {/* Comparison of Dates Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>วันสิ้นสุดสัญญาปัจจุบัน:</div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
                {formatDateBE(currentEndDateStr)}
              </div>
            </div>

            <FaArrowRight style={{ color: '#94a3b8', fontSize: '12px' }} />

            <div>
              <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>วันสิ้นสุดสัญญาใหม่:</div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: isDateEarlierOrEqual ? '#dc2626' : '#059669',
                }}
              >
                {customEndDate ? formatDateBE(customEndDate) : '-'}
              </div>
            </div>

            <div
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: isDateEarlierOrEqual ? '#dc2626' : '#059669',
                backgroundColor: isDateEarlierOrEqual ? '#fee2e2' : '#ecfdf5',
                padding: '3px 8px',
                borderRadius: '6px',
                border: `1px solid ${isDateEarlierOrEqual ? '#fecaca' : '#a7f3d0'}`,
              }}
            >
              {isDateEarlierOrEqual ? 'เวลาไม่ถูกต้อง' : `+${durationMonths} เดือน`}
            </div>
          </div>

          {/* Extension History Notice if any */}
          {extensions.length > 0 && (
            <div
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                fontSize: '11.5px',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FaHistory />
              <span>
                เคยขอขยายเวลาแล้ว {extensions.length} ครั้ง (วันสิ้นสุดเดิม {formatDateBE(currentTimeline.original_end_date)})
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* 1. เลือกจำนวนเวลาที่จะขยาย (ไม่ซ้ำกับเวลาเดิม) */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                เลือกจำนวนเวลาที่จะขยายเพิ่ม (ต้องไม่ซ้ำกับวันเดิม) *
              </label>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                คลิกปุ่มหรือระบุวันที่โดยตรง
              </span>
            </div>

            {/* Quick Month Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {[1, 2, 3, 6, 12].map((m) => {
                const isSelected = durationMonths === m && !isDateIdentical && !isDateEarlierOrEqual;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectMonths(m)}
                    className="glass-btn"
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #b45309' : '1px solid #cbd5e1',
                      background: isSelected ? 'rgba(245, 158, 11, 0.15)' : '#ffffff',
                      color: isSelected ? '#b45309' : '#475569',
                      fontWeight: isSelected ? 700 : 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    +{m} เดือน
                  </button>
                );
              })}
            </div>

            {/* Custom Date Input Picker & Manual Months */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>
                  <FaCalendarAlt style={{ marginRight: '4px', fontSize: '10px' }} />
                  วันสิ้นสุดสัญญาใหม่ที่ต้องการ:
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  min={currentEndDateStr}
                  onChange={(e) => handleDateChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: isDateEarlierOrEqual ? '2px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: isDateEarlierOrEqual ? '#dc2626' : '#0f172a',
                    backgroundColor: isDateEarlierOrEqual ? '#fff5f5' : '#ffffff',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>
                  จำนวนเดือนที่ขยายเพิ่ม:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={durationMonths}
                    onChange={(e) => handleSelectMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '12.5px', color: '#64748b', whiteSpace: 'nowrap' }}>เดือน</span>
                </div>
              </div>
            </div>

            {/* Validation Notice Banner */}
            {validationNotice && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#b91c1c',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FaExclamationTriangle />
                <span>{validationNotice}</span>
              </div>
            )}
          </div>

          {/* 2. สถานะการขยายเวลา (Approval Status) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              สถานะหลังการบันทึกขยายเวลา *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setApprovalStatus('pending')}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: approvalStatus === 'pending' ? '2px solid #d97706' : '1px solid #cbd5e1',
                  backgroundColor: approvalStatus === 'pending' ? '#fffbeb' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#92400e' }}>
                  ยื่นขอขยายเวลา
                </div>
                <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px' }}>
                  สถานะ: รอการพิจารณาอนุมัติ
                </div>
              </button>

              <button
                type="button"
                onClick={() => setApprovalStatus('approved')}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: approvalStatus === 'approved' ? '2px solid #059669' : '1px solid #cbd5e1',
                  backgroundColor: approvalStatus === 'approved' ? '#ecfdf5' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#065f46' }}>
                  อนุมัติขยายเวลาแล้ว
                </div>
                <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px' }}>
                  สถานะ: อยู่ระหว่างขยายเวลา (มีผลทันที)
                </div>
              </button>
            </div>
          </div>

          {/* 3. ประเภทเหตุผลความจำเป็น */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              ประเภทเหตุผลความจำเป็น (ตามเกณฑ์ สวพ.มก.) *
            </label>
            <Select
              value={reasonCategory}
              onValueChange={(val) => {
                if (val) setReasonCategory(val as ExtensionReasonCategory);
              }}
            >
              <SelectTrigger className="w-full bg-white text-slate-800 text-sm h-10 border-slate-300">
                <SelectValue placeholder="เลือกประเภทเหตุผล" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lab_analysis_waiting">รอผลวิเคราะห์ทางห้องปฏิบัติการ / มาตรฐานภายนอก</SelectItem>
                <SelectItem value="technical_issue">อุปสรรคทางเทคนิคในการทดลอง / ปรับปรุงเครื่องมือ</SelectItem>
                <SelectItem value="procurement_delay">กระบวนการจัดซื้อจัดจ้างครุภัณฑ์วิจัยล่าช้า</SelectItem>
                <SelectItem value="publication_acceptance">
                  รอหนังสือตอบรับการตีพิมพ์ในวารสารนานาชาติ (Acceptance Letter)
                </SelectItem>
                <SelectItem value="force_majeure">เหตุสุดวิสัย / ภัยธรรมชาติ / สภาพภูมิอากาศแปรปรวน</SelectItem>
                <SelectItem value="other">เหตุผลความจำเป็นอื่นๆ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. คำชี้แจงเหตุผลความจำเป็นโดยละเอียด */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              คำชี้แจงเหตุผลความจำเป็นโดยละเอียด *
            </label>
            <textarea
              rows={3}
              value={reasonDetail}
              onChange={(e) => {
                setReasonDetail(e.target.value);
                setErrorMsg('');
              }}
              placeholder="ระบุรายละเอียดปัญหาอุปสรรค แผนงานที่จะดำเนินการในระยะเวลาที่ขยาย และกำหนดวันส่งมอบงาน..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                color: '#1e293b',
                outline: 'none',
                resize: 'vertical',
              }}
              required
            />
          </div>

          {/* 5. เลขที่บันทึกข้อความ */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              เลขที่บันทึกข้อความ มก. (ถ้ามี)
            </label>
            <input
              type="text"
              value={documentRefNo}
              onChange={(e) => setDocumentRefNo(e.target.value)}
              placeholder="เช่น บันทึกข้อความ อว 6505.01/..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                color: '#1e293b',
                outline: 'none',
              }}
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                fontSize: '12.5px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaExclamationTriangle />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="glass-btn"
              style={{ padding: '9px 20px', fontSize: '13px', cursor: 'pointer' }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={Boolean(isDateEarlierOrEqual || isDateIdentical || !customEndDate)}
              style={{
                padding: '9px 22px',
                borderRadius: '8px',
                border: 'none',
                background:
                  isDateEarlierOrEqual || isDateIdentical || !customEndDate
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: isDateEarlierOrEqual || isDateIdentical || !customEndDate ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow:
                  isDateEarlierOrEqual || isDateIdentical || !customEndDate
                    ? 'none'
                    : '0 4px 12px rgba(217, 119, 6, 0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <FaCheck />
              บันทึกการขยายเวลา
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
