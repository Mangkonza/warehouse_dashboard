'use client';

import React from 'react';
import { calculateProjectTimeline, STATUS_LABELS } from '@/lib/projectMonitoringEngine';
import { DepartmentBadge } from '@/components/ui';
import { formatDateBE } from '@/components/ui/RecordDetailDrawer';
import {
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaBan,
  FaRedo,
  FaExchangeAlt,
  FaCalendarAlt,
  FaHistory,
} from 'react-icons/fa';

export type ProjectStatusActionType = 'extend' | 'close' | 'cancel' | 'reopen';

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectItem: Record<string, any> | null;
  onSelectAction: (action: ProjectStatusActionType, item: Record<string, any>) => void;
}

export const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  isOpen,
  onClose,
  projectItem,
  onSelectAction,
}) => {
  if (!isOpen || !projectItem) return null;

  const timeline = calculateProjectTimeline(projectItem);
  const statusInfo = (STATUS_LABELS as Record<string, any>)[timeline.status] || STATUS_LABELS.active;
  const extensions = Array.isArray(projectItem.extensions) ? projectItem.extensions : [];
  const isClosedOrCancelled =
    timeline.status === 'completed' ||
    timeline.status === 'cancelled' ||
    timeline.status === 'waiting_eval' ||
    timeline.status === 'evaluated';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
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
          maxWidth: '580px',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '16px',
          padding: '26px 30px',
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
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(2, 132, 199, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
                fontSize: '18px',
              }}
            >
              <FaExchangeAlt />
            </div>
            <div>
              <h2 style={{ fontSize: '17.5px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                จัดการและเปลี่ยนแปลงสถานะโครงการ
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                เลือกดำเนินการขยายเวลาสัญญา, ปิดโครงการ หรือขอยกเลิกโครงการ
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
            padding: '14px 16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>โครงการ:</div>
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
              gap: '12px',
              marginTop: '10px',
              fontSize: '12px',
              color: '#475569',
              alignItems: 'center',
            }}
          >
            {projectItem.id && (
              <span>
                รหัส: <strong>{projectItem.id}</strong>
              </span>
            )}
            <span>
              หัวหน้า: <strong>{projectItem.head || projectItem.person || '-'}</strong>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              สังกัด: <DepartmentBadge value={projectItem.department} />
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px dashed #cbd5e1',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>สถานะปัจจุบัน:</span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: statusInfo.color,
                  backgroundColor: statusInfo.bg,
                  border: `1px solid ${statusInfo.border}`,
                }}
              >
                {statusInfo.labelTh}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#334155', fontWeight: 600 }}>
              <FaCalendarAlt style={{ color: '#0284c7', fontSize: '11px' }} />
              <span>วันสิ้นสุดปัจจุบัน: {formatDateBE(timeline.end_date)}</span>
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
              <span>เคยขอขยายระยะเวลามาแล้ว {extensions.length} ครั้ง (วันสิ้นสุดเดิม {formatDateBE(timeline.original_end_date)})</span>
            </div>
          )}
        </div>

        {/* Action Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
            เลือกการดำเนินการที่ต้องการ:
          </div>

          {/* 1. ขอขยายระยะเวลาโครงการ */}
          <div
            onClick={() => onSelectAction('extend', projectItem)}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid #fde68a',
              backgroundColor: '#fffbeb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef3c7';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fffbeb';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                fontSize: '17px',
                flexShrink: 0,
              }}
            >
              <FaClock />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400e' }}>
                ขอขยายระยะเวลาโครงการ (Extension)
              </div>
              <div style={{ fontSize: '12px', color: '#b45309', marginTop: '3px', lineHeight: 1.4 }}>
                กำหนดวันสิ้นสุดสัญญาใหม่ที่ไม่ซ้ำกับเวลาเดิม พร้อมเลือกจำนวนเวลาที่ขยาย (+เดือน หรือระบุวันที่) และระบุเหตุผลความจำเป็นตามเกณฑ์ มก.
              </div>
            </div>
          </div>

          {/* 2. ปิดโครงการ (ข้อมูลสำคัญ - มี Alert ยืนยัน) */}
          <div
            onClick={() => onSelectAction('close', projectItem)}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#0f766e';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 118, 110, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#f0fdfa',
                border: '1px solid #99f6e4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f766e',
                fontSize: '17px',
                flexShrink: 0,
              }}
            >
              <FaCheckCircle />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>ปิดโครงการ (เสร็จสิ้นสัญญา)</span>
                <span style={{ fontSize: '10.5px', color: '#b91c1c', background: '#fee2e2', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  ข้อมูลสำคัญ
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', lineHeight: 1.4 }}>
                บันทึกปิดโครงการเมื่อส่งมอบงานสมบูรณ์ เพื่อส่งต่อเข้าสู่กระบวนการประเมินผลโครงการ (Evaluation) ตามระเบียบ <strong>(จะมี Alert ขึ้นให้กดยืนยันก่อนบันทึก)</strong>
              </div>
            </div>
          </div>

          {/* 3. ขอยกเลิกโครงการ (ไม่ลบข้อมูลแต่เปลี่ยนสถานะ) */}
          <div
            onClick={() => onSelectAction('cancel', projectItem)}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid #fecaca',
              backgroundColor: '#fff5f5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff5f5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                border: '1px solid #fca5a5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
                fontSize: '17px',
                flexShrink: 0,
              }}
            >
              <FaBan />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>ขอยกเลิกโครงการ</span>
                <span style={{ fontSize: '10.5px', color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  ไม่ลบข้อมูล
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '3px', lineHeight: 1.4 }}>
                เปลี่ยนสถานะเป็นยกเลิกโครงการตามระเบียบ <strong>โดยข้อมูลโครงการจะยังคงถูกจัดเก็บไว้อย่างครบถ้วนในระบบ ไม่มีการลบข้อมูลใดๆ</strong> (จะมี Alert ให้กดยืนยัน)
              </div>
            </div>
          </div>

          {/* 4. เปิดโครงการอีกครั้ง (คืนสถานะกำลังดำเนินการ) - แสดงเฉพาะกรณีที่ถูกปิดหรือยกเลิก */}
          {isClosedOrCancelled && (
            <div
              onClick={() => onSelectAction('reopen', projectItem)}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid #a7f3d0',
                backgroundColor: '#ecfdf5',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d1fae5';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 150, 105, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ecfdf5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  fontSize: '17px',
                  flexShrink: 0,
                }}
              >
                <FaRedo />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#065f46' }}>
                  เปิดโครงการอีกครั้ง (กำลังดำเนินการตามแผน)
                </div>
                <div style={{ fontSize: '12px', color: '#047857', marginTop: '3px', lineHeight: 1.4 }}>
                  ยกเลิกสถานะปิด/ยกเลิก และคืนสถานะโครงการกลับเข้าสู่การดำเนินงานตามแผนปกติ
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            type="button"
            onClick={onClose}
            className="glass-btn"
            style={{ padding: '8px 20px', fontSize: '13px', cursor: 'pointer' }}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
