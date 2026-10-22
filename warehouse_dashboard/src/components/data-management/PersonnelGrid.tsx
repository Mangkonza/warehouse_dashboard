'use client';

import React from 'react';
import { PersonnelRecord } from '../../types/dataManagement';
import { getDepartmentAbbr } from '../../config/dataManagementConfig';
import { FaUserTie, FaEnvelope, FaEdit, FaTrashAlt } from 'react-icons/fa';

interface PersonnelGridProps {
  personnel: PersonnelRecord[];
  onEdit: (person: PersonnelRecord) => void;
  onDelete: (person: PersonnelRecord) => void;
}

export const PersonnelGrid: React.FC<PersonnelGridProps> = ({
  personnel,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
        padding: '4px 0',
      }}
    >
      {personnel.map((p) => (
        <div
          key={p._id || p.id}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
          }}
        >
          {/* Top row: Avatar & Basic Info */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '62px',
                height: '62px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#f1f5f9',
                flexShrink: 0,
                border: '2px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <FaUserTie style={{ color: '#94a3b8', fontSize: '24px' }} />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                  {p.id}
                </span>
                {p.title_th && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                    }}
                  >
                    {p.title_th}
                  </span>
                )}
              </div>

              <div
                style={{
                  fontWeight: 400,
                  fontSize: '14.5px',
                  color: '#0f172a',
                  marginTop: '4px',
                  lineHeight: '1.3',
                }}
              >
                {p.name}
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: '#475569',
                  marginTop: '4px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
                title={p.position}
              >
                {p.position}
              </div>
            </div>
          </div>

          {/* Department Badge: ตัวย่อภาษาอังกฤษ + สีเลือดหมู #72242B (ไม่มี icon, เอาเมาส์ชี้แสดงชื่อเต็ม) */}
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12.5px',
                fontWeight: 600,
                fontFamily: "'Kanit', sans-serif",
                backgroundColor: '#990000',
                color: '#ffffff',
                border: '1px solid #990000',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                letterSpacing: '0.3px',
                cursor: 'default',
              }}
              title={p.department}
            >
              {getDepartmentAbbr(p.department)}
            </span>
          </div>

          {/* Footer: Email & Actions */}
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            {p.email && p.email !== '-' ? (
              <a
                href={`mailto:${p.email}`}
                style={{
                  color: '#0284c7',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '180px',
                }}
                title={p.email}
              >
                <FaEnvelope style={{ fontSize: '11px' }} />
                <span>{p.email}</span>
              </a>
            ) : (
              <span style={{ color: '#94a3b8' }}>ไม่มีอีเมล</span>
            )}

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => onEdit(p)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d97706',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '4px',
                }}
                title="แก้ไข"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(p)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '4px',
                }}
                title="ลบ"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
