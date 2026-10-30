'use client';

import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { Spinner } from '@/components/ui/Spinner';

export interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  detail?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'success' | 'info';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  title,
  message,
  detail,
  confirmText = 'ยืนยันการดำเนินการ',
  cancelText = 'ยกเลิก',
  type = 'warning',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FaTrashAlt style={{ color: '#dc2626', fontSize: '26px' }} />;
      case 'success':
        return <FaCheckCircle style={{ color: '#00A651', fontSize: '26px' }} />;
      case 'warning':
      default:
        return <FaExclamationTriangle style={{ color: '#f59e0b', fontSize: '26px' }} />;
    }
  };

  const getConfirmBtnStyle = () => {
    switch (type) {
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #00A651 0%, #00A651 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(0, 166, 81, 0.35)',
        };
      case 'warning':
      default:
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
        };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '460px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: type === 'danger' ? '#fef2f2' : type === 'success' ? '#f0fdf4' : '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {getIcon()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
              {title}
            </h3>
            <p style={{ margin: '6px 0 0 0', fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
              {message}
            </p>
            {detail && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  color: '#64748b',
                  lineHeight: 1.4,
                }}
              >
                {detail}
              </div>
            )}
          </div>
          <button
            onClick={onCancel}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="ปิด"
          >
            <FaTimes style={{ fontSize: '14px' }} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.75 : 1,
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              ...getConfirmBtnStyle(),
            }}
          >
            {isLoading && <Spinner size="sm" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
