'use client';

import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10001,
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '440px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            fontSize: '22px',
          }}
        >
          <FaTrashAlt />
        </div>

        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>
          ยืนยันการลบรายการ?
        </h3>

        <p style={{ margin: '0 0 16px 0', fontSize: '13.5px', color: '#64748b', lineHeight: '1.5' }}>
          คุณต้องการลบข้อมูล <strong style={{ color: '#0f172a' }}>&ldquo;{itemName}&rdquo;</strong> ในหมวด {title} ใช่หรือไม่?
          การดำเนินการนี้จะไม่สามารถย้อนกลับได้
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)',
            }}
          >
            ยืนยันลบ
          </button>
        </div>
      </div>
    </div>
  );
};
