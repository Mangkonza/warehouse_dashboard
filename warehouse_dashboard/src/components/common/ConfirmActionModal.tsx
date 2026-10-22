'use client';

import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaTrashAlt, FaTimes } from 'react-icons/fa';

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  detail?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'success' | 'info';
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
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FaTrashAlt style={{ color: '#dc2626', fontSize: '26px' }} />;
      case 'success':
        return <FaCheckCircle style={{ color: '#00a859', fontSize: '26px' }} />;
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
          background: 'linear-gradient(135deg, #00a859 0%, #006838 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(0, 168, 89, 0.35)',
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
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(30px) saturate(200%)',
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.6)',
          borderRadius: '24px',
          padding: '26px 28px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaTimes />
        </button>

        {/* Status Icon */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background:
              type === 'danger'
                ? 'rgba(239, 68, 68, 0.12)'
                : type === 'success'
                ? 'rgba(0, 168, 89, 0.12)'
                : 'rgba(245, 158, 11, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          {getIcon()}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5', marginBottom: detail ? '12px' : '22px' }}>
          {message}
        </p>

        {/* Detail Box (Optional) */}
        {detail && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '12.5px',
              color: '#334155',
              textAlign: 'left',
              marginBottom: '22px',
            }}
          >
            {detail}
          </div>
        )}

        {/* Buttons Action */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onCancel}
            className="glass-btn"
            style={{
              flex: 1,
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 600,
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              ...getConfirmBtnStyle(),
              transition: 'all 0.18s ease',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
