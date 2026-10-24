'use client';

import React, { useEffect } from 'react';
import { FaUserPlus, FaTimes } from 'react-icons/fa';

export interface PersonAddConfirmModalProps {
  isOpen: boolean;
  personName: string;
  prefix?: string;
  cleanName?: string;
  onAddAndLink: () => void;
  onKeepPlainText: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PersonAddConfirmModal({
  isOpen,
  personName,
  prefix,
  cleanName,
  onAddAndLink,
  onKeepPlainText,
  onCancel,
  isSubmitting = false,
}: PersonAddConfirmModalProps) {
  // Listen for Esc key to cancel and return to inline form
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // Format display name: when prefix is empty, show name only with no extra space
  const trimmedPrefix = prefix?.trim() || '';
  const baseName = (cleanName || personName).trim();
  const displayName = trimmedPrefix ? `${trimmedPrefix} ${baseName}` : baseName;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header bar with theme's danger/alert red token, white text, icon and close button */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: 'var(--destructive)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUserPlus style={{ color: '#ffffff', fontSize: '18px', flexShrink: 0 }} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
              เพิ่มรายชื่อเข้าข้อมูลบุคลากรและอาจารย์
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '20px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              padding: '4px',
              opacity: 0.85,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.opacity = '0.85';
            }}
            title="ปิด"
          >
            <FaTimes style={{ fontSize: '16px' }} />
          </button>
        </div>

        {/* Body: One short sentence, normal weight, same font size as SmartAddEditModal */}
        <div style={{ padding: '24px' }}>
          <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 400, color: '#334155', lineHeight: 1.6 }}>
            ไม่พบรายชื่อ &quot;<strong style={{ fontWeight: 600, color: '#0f172a' }}>{displayName}</strong>&quot; ในข้อมูลบุคลากรและอาจารย์ ต้องการเพิ่มหรือไม่
          </p>
        </div>

        {/* Footer: Right aligned, two buttons matching SmartAddEditModal's "บันทึกรายการใหม่" button */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          {/* Button 1: ไม่เพิ่ม (secondary outline) */}
          <button
            type="button"
            onClick={onKeepPlainText}
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              padding: '9px 22px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#94a3b8';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }
            }}
          >
            ไม่เพิ่ม
          </button>

          {/* Button 2: เพิ่มในข้อมูลบุคลากร (rightmost, theme black background, white text) */}
          <button
            type="button"
            onClick={onAddAndLink}
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              gap: '8px',
              padding: '9px 22px',
              borderRadius: '8px',
              border: '1px solid var(--foreground)',
              backgroundColor: 'var(--foreground)',
              color: 'var(--background)',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isSubmitting ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.25)';
              }
            }}
          >
            <FaUserPlus style={{ fontSize: '14px', flexShrink: 0, color: 'currentColor' }} />
            <span>{isSubmitting ? 'กำลังบันทึก...' : 'เพิ่มในข้อมูลบุคลากร'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
