'use client';

import React, { useState, useEffect } from 'react';
import { CategoryConfig, PersonnelRecord } from '../../types/dataManagement';
import { SmartAutocomplete } from './SmartAutocomplete';
import {
  FaFlask,
  FaGraduationCap,
  FaHandsHelping,
  FaBook,
  FaCertificate,
  FaUsers,
  FaSave,
  FaExclamationCircle,
  FaUserTie,
  FaUpload,
  FaTrashAlt,
} from 'react-icons/fa';
import { MultiMemberSelector } from './MultiMemberSelector';
import { SDGTagSelector } from './SDGTagSelector';
import { JournalQuartileSelector } from './JournalQuartileSelector';
import { STATUS_LABELS } from '../../lib/projectMonitoringEngine';

const getCategoryIcon = (key: string) => {
  switch (key) {
    case 'research':
      return <FaFlask style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'academic':
      return <FaGraduationCap style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'service':
      return <FaHandsHelping style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'publications':
      return <FaBook style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'ip':
      return <FaCertificate style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'personnel':
      return <FaUsers style={{ fontSize: '20px', color: '#86efac' }} />;
    default:
      return <FaFlask style={{ fontSize: '20px', color: '#86efac' }} />;
  }
};

interface SmartAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Record<string, any>) => void;
  config: CategoryConfig;
  initialData?: Record<string, any> | null;
}

export const SmartAddEditModal: React.FC<SmartAddEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  config,
  initialData,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState('');

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      // Default empty values based on schema
      const initial: Record<string, any> = {};
      config.columns.forEach((col) => {
        if (col.editable !== false) {
          initial[col.key] = col.type === 'currency' || col.type === 'number' ? 0 : '';
        }
      });
      setFormData(initial);
    }
    setErrorMsg('');
  }, [initialData, config, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (key: string, val: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handlePersonSelect = (person: PersonnelRecord) => {
    setFormData((prev) => {
      const updated = { ...prev };
      // Auto-fill department if department field exists in this schema
      if (config.departmentKey) {
        updated[config.departmentKey] = person.department;
      }
      // Auto-fill email if email field exists
      if (prev.email !== undefined || config.columns.some((c) => c.key === 'email')) {
        updated.email = person.email;
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // ตรวจสอบ required fields
    for (const col of config.columns) {
      if (col.required) {
        const val = formData[col.key];
        if (!val || String(val).trim() === '') {
          setErrorMsg(`กรุณากรอกข้อมูล "${col.label}"`);
          return;
        }
      }
    }

    onSave(formData);
    onClose();
  };

  // กรองเฉพาะคอลัมน์ที่แก้ไขได้
  const editableCols = config.columns.filter((c) => c.editable !== false);

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
        zIndex: 10000,
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
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
            {getCategoryIcon(config.key)}
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                {isEdit ? `แก้ไขข้อมูล: ${config.title}` : `เพิ่มรายการใหม่: ${config.title}`}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#dcfce7' }}>
                {config.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              opacity: 0.8,
            }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {errorMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FaExclamationCircle />
                <span>{errorMsg}</span>
              </div>
            )}

            {editableCols.map((col) => {
              const val = formData[col.key] !== undefined ? formData[col.key] : '';

              return (
                <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                    {col.key === 'image_url' ? 'รูปภาพประจำตัว' : col.label.replace('\n', ' ')}
                    {col.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                  </label>

                  {/* Field Renderer based on schema */}
                  {col.type === 'avatar' ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {/* Avatar circular preview */}
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: '#f1f5f9',
                            flexShrink: 0,
                            border: '2px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          }}
                        >
                          {val ? (
                            <img
                              src={val}
                              alt="Preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <FaUserTie style={{ color: '#94a3b8', fontSize: '26px' }} />
                          )}
                        </div>

                        {/* File Upload and Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <label
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                backgroundColor: '#00a859',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '12.5px',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                            >
                              <FaUpload style={{ fontSize: '11px' }} />
                              <span>เลือกรูปภาพจากเครื่อง</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (uploadEvt) => {
                                      const res = uploadEvt.target?.result as string;
                                      handleFieldChange(col.key, res);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>

                            {val && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange(col.key, '')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#ffffff',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  fontSize: '12.5px',
                                  cursor: 'pointer',
                                }}
                              >
                                <FaTrashAlt style={{ fontSize: '11px' }} />
                                <span>ลบรูป</span>
                              </button>
                            )}
                          </div>
                          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                            รองรับไฟล์ภาพ .jpg, .png จากเครื่อง หรือพิมพ์ Path / URL ในช่องด้านล่าง
                          </span>
                        </div>
                      </div>

                      {/* Direct URL / Path input */}
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        placeholder={col.placeholder || '/profile_images/... หรือ https://...'}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          outline: 'none',
                          fontFamily: 'inherit',
                          backgroundColor: '#ffffff',
                        }}
                      />
                    </div>
                  ) : col.autocomplete === 'personnel' ? (
                    <SmartAutocomplete
                      value={val}
                      onChange={(newVal) => handleFieldChange(col.key, newVal)}
                      onSelectPerson={handlePersonSelect}
                      placeholder={col.placeholder}
                      required={col.required}
                    />
                  ) : col.selectOptions ? (
                    <select
                      value={val}
                      onChange={(e) => handleFieldChange(col.key, e.target.value)}
                      required={col.required}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <option value="">-- กรุณาเลือก --</option>
                      {col.selectOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : col.type === 'currency' || col.type === 'number' ? (
                    <input
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) => handleFieldChange(col.key, parseFloat(e.target.value) || 0)}
                      placeholder={col.placeholder || '0'}
                      required={col.required}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  ) : col.type === 'date' ? (
                    <input
                      type="date"
                      value={val}
                      onChange={(e) => handleFieldChange(col.key, e.target.value)}
                      required={col.required}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  ) : col.type === 'sdg' ? (
                    <SDGTagSelector
                      selectedSDGs={typeof val === 'string' ? val.split(',').map((s) => s.trim()).filter(Boolean) : Array.isArray(val) ? val : []}
                      onChange={(sdgs) => handleFieldChange(col.key, sdgs.join(', '))}
                      projectTitle={formData.name || ''}
                      department={formData.department || ''}
                    />
                  ) : col.type === 'quartile' ? (
                    <JournalQuartileSelector
                      value={val}
                      onChange={(q) => handleFieldChange(col.key, q)}
                      journalName={formData.journal || ''}
                      onJournalMetadataFetched={(meta) => {
                        if (meta.journal) handleFieldChange('journal', meta.journal);
                        if (meta.title && !formData.name) handleFieldChange('name', meta.title);
                      }}
                    />
                  ) : col.type === 'members' ? (
                    <MultiMemberSelector
                      members={
                        Array.isArray(val)
                          ? val
                          : [
                              {
                                name: formData.head || formData.person || formData.owner || 'หัวหน้าโครงการ',
                                role: 'PI',
                                affiliation_type: 'eng_kps',
                                organization: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
                                contribution_percent: 100,
                              },
                            ]
                      }
                      onChange={(mems) => handleFieldChange(col.key, mems)}
                    />
                  ) : col.type === 'status' ? (
                    <select
                      value={val || 'active'}
                      onChange={(e) => handleFieldChange(col.key, e.target.value)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, info]) => (
                        <option key={k} value={k}>
                          {info.labelTh}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange(col.key, e.target.value)}
                      placeholder={col.placeholder}
                      required={col.required}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: '16px 24px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
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
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
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
              }}
            >
              <FaSave style={{ marginRight: '6px' }} />
              {isEdit ? 'บันทึกการแก้ไข' : 'บันทึกรายการใหม่'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
