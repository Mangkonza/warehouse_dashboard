'use client';

import React, { useState } from 'react';
import { ExtensionReasonCategory, ProjectExtensionRecord } from '../../types/projectMonitoring';
import { createExtensionRequest } from '../../lib/projectMonitoringEngine';
import {
  FaClock,
  FaFileContract,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaBuilding,
  FaFileAlt,
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
  const [reasonCategory, setReasonCategory] = useState<ExtensionReasonCategory>('lab_analysis_waiting');
  const [reasonDetail, setReasonDetail] = useState<string>('');
  const [documentRefNo, setDocumentRefNo] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen || !projectItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonDetail.trim()) {
      setErrorMsg('กรุณาระบุคำชี้แจงเหตุผลความจำเป็นในการขอขยายเวลาตามระเบียบ มก.');
      return;
    }

    const newExt = createExtensionRequest(projectItem, {
      durationMonths,
      reasonCategory,
      reasonDetail,
      documentRefNo: documentRefNo || `อว 6505/${Date.now().toString().slice(-4)}`,
    });

    const currentExts = Array.isArray(projectItem.extensions) ? [...projectItem.extensions] : [];
    const updated = {
      ...projectItem,
      extensions: [...currentExts, newExt],
      status: 'extension_requested',
    };

    onSaveExtension(updated, newExt);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '28px 32px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', fontSize: '18px' }}>
              <FaClock />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                บันทึกขอขยายระยะเวลาโครงการวิจัย
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                ตามระเบียบมหาวิทยาลัยเกษตรศาสตร์ และ สวพ.มก. (KURDI)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Project Context Box */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px', marginBottom: '20px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b' }}>ชื่อโครงการที่ขอขยายเวลา:</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '2px', lineHeight: 1.4 }}>
            {projectItem.name}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12.5px', color: '#475569' }}>
            <span>รหัส: <strong>{projectItem.id}</strong></span>
            <span>หัวหน้าโครงการ: <strong>{projectItem.head || projectItem.person || '-'}</strong></span>
            <span>ภาควิชา: <strong>{projectItem.department || '-'}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Duration Months */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              ระยะเวลาที่ขอขยายเพิ่ม (เดือน) *
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[1, 2, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDurationMonths(m)}
                  className="glass-btn"
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    border: durationMonths === m ? '2px solid #b45309' : '1px solid #cbd5e1',
                    background: durationMonths === m ? 'rgba(245, 158, 11, 0.15)' : '#fff',
                    color: durationMonths === m ? '#b45309' : '#475569',
                    fontWeight: durationMonths === m ? 700 : 500,
                  }}
                >
                  +{m} เดือน
                </button>
              ))}
            </div>
          </div>

          {/* Reason Category */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              ประเภทเหตุผลความจำเป็น (ตามเกณฑ์ สวพ.มก.) *
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value as ExtensionReasonCategory)}
              className="glass-input"
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value="lab_analysis_waiting">รอผลวิเคราะห์ทางห้องปฏิบัติการ / มาตรฐานภายนอก</option>
              <option value="technical_issue">อุปสรรคทางเทคนิคในการทดลอง / ปรับปรุงเครื่องมือ</option>
              <option value="procurement_delay">กระบวนการจัดซื้อจัดจ้างครุภัณฑ์วิจัยล่าช้า</option>
              <option value="publication_acceptance">รอหนังสือตอบรับการตีพิมพ์ในวารสารนานาชาติ (Acceptance Letter)</option>
              <option value="force_majeure">เหตุสุดวิสัย / ภัยธรรมชาติ / สภาพภูมิอากาศแปรปรวน</option>
              <option value="other">เหตุผลความจำเป็นอื่นๆ</option>
            </select>
          </div>

          {/* Detailed Reason */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
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
              className="glass-input"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Document Reference Number */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              เลขที่บันทึกข้อความ มก. (ถ้ามี)
            </label>
            <input
              type="text"
              value={documentRefNo}
              onChange={(e) => setDocumentRefNo(e.target.value)}
              placeholder="เช่น บันทึกข้อความ อว 6505.01/..."
              className="glass-input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '12.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              style={{ padding: '10px 20px' }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="glass-btn-primary"
              style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaCheck />
              บันทึกคำขอขยายเวลา
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
