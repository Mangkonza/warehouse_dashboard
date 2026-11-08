'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FaCheckCircle,
  FaChevronDown,
  FaEdit,
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrashAlt,
} from 'react-icons/fa';

export interface HierarchyEntityOption {
  id: string;
  code: string;
  name: string;
}

export interface CreatableHierarchySelectProps {
  /** รายการยุทธศาสตร์หรือแผนงาน (อ้างอิงด้วย id ภายใน) */
  options: HierarchyEntityOption[];
  /** id ภายในที่เลือกอยู่ */
  valueId: string;
  /** callback เมื่อเลือก id ภายใน */
  onChange: (selectedId: string, selectedOption: HierarchyEntityOption) => void;
  /** callback เมื่อกดสร้างรายการใหม่แบบ inline (คืนค่า { ok, data, error }) */
  onCreateNew: (
    code: string,
    name: string
  ) => { ok: true; data: HierarchyEntityOption } | { ok: false; error: string };
  /** callback เมื่อแก้ไขรายการ (เฉพาะยุทธศาสตร์กับแผนงาน) */
  onUpdate?: (
    id: string,
    code: string,
    name: string
  ) => { ok: true; data: HierarchyEntityOption } | { ok: false; error: string };
  /** callback เมื่อลบรายการ (เฉพาะยุทธศาสตร์กับแผนงาน) */
  onDelete?: (id: string) => { ok: true } | { ok: false; error: string };
  /** ป้ายกำกับระดับ เช่น "ยุทธศาสตร์" หรือ "แผนงาน" */
  entityLabel: string;
  /** ตัวอย่างเลข เช่น "2.1" หรือ "2.1-1" */
  codePlaceholder?: string;
  /** ตัวอย่างชื่อ */
  namePlaceholder?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export const CreatableHierarchySelect: React.FC<CreatableHierarchySelectProps> = ({
  options,
  valueId,
  onChange,
  onCreateNew,
  onUpdate,
  onDelete,
  entityLabel,
  codePlaceholder = 'เช่น 2.1',
  namePlaceholder = 'ระบุชื่อ...',
  placeholder = 'เลือก...',
  disabled = false,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddingInline, setIsAddingInline] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [inlineError, setInlineError] = useState('');

  // State สำหรับ Delete Modal
  const [itemToDelete, setItemToDelete] = useState<HierarchyEntityOption | null>(null);
  const [deleteError, setDeleteError] = useState('');

  // State สำหรับ Edit Modal
  const [itemToEdit, setItemToEdit] = useState<HierarchyEntityOption | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // กรองตัวเลือกที่ไม่มีเครื่องหมาย ?
  const cleanOptions = useMemo(() => {
    return options.filter((o) => !o.code.includes('?') && !o.name.includes('?'));
  }, [options]);

  const selectedOption = useMemo(
    () => cleanOptions.find((o) => o.id === valueId) || null,
    [cleanOptions, valueId]
  );

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cleanOptions;
    return cleanOptions.filter(
      (o) => o.code.toLowerCase().includes(q) || o.name.toLowerCase().includes(q)
    );
  }, [cleanOptions, search]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      // หากกำลังเปิด modal ยืนยัน ไม่ให้ปิด dropdown จากภายนอก
      if (itemToDelete || itemToEdit) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsAddingInline(false);
        setInlineError('');
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !itemToDelete && !itemToEdit) {
        setIsOpen(false);
        setIsAddingInline(false);
        setInlineError('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, itemToDelete, itemToEdit]);

  useEffect(() => {
    if (isAddingInline) {
      setTimeout(() => codeInputRef.current?.focus(), 30);
    }
  }, [isAddingInline]);

  const handleConfirmCreate = () => {
    setInlineError('');
    const result = onCreateNew(newCode, newName);
    if (!result.ok) {
      setInlineError(result.error);
      return;
    }
    onChange(result.data.id, result.data);
    setNewCode('');
    setNewName('');
    setIsAddingInline(false);
    setIsOpen(false);
  };

  const handleStartEdit = (opt: HierarchyEntityOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToEdit(opt);
    setEditCode(opt.code);
    setEditName(opt.name);
    setEditError('');
  };

  const handleConfirmEdit = () => {
    if (!itemToEdit || !onUpdate) return;
    setEditError('');
    const result = onUpdate(itemToEdit.id, editCode, editName);
    if (!result.ok) {
      setEditError(result.error);
      return;
    }
    if (valueId === itemToEdit.id) {
      onChange(result.data.id, result.data);
    }
    setItemToEdit(null);
  };

  const handleStartDelete = (opt: HierarchyEntityOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(opt);
    setDeleteError('');
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete || !onDelete) return;
    setDeleteError('');
    const result = onDelete(itemToDelete.id);
    if (!result.ok) {
      setDeleteError(result.error);
      return;
    }
    if (valueId === itemToDelete.id) {
      const remaining = cleanOptions.filter((o) => o.id !== itemToDelete.id);
      if (remaining.length > 0) {
        onChange(remaining[0].id, remaining[0]);
      } else {
        onChange('', { id: '', code: '', name: '' });
      }
    }
    setItemToDelete(null);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {/* ปุ่มความสูงคงที่ 38px */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        style={{
          width: '100%',
          height: '38px',
          minHeight: '38px',
          maxHeight: '38px',
          padding: '0 12px',
          borderRadius: '8px',
          border: isOpen ? '1.5px solid #00A651' : '1px solid #cbd5e1',
          backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
          color: selectedOption ? '#0f172a' : '#64748b',
          fontSize: '13px',
          fontWeight: selectedOption ? 600 : 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          overflow: 'hidden',
          boxShadow: isOpen ? '0 0 0 3px rgba(0, 166, 81, 0.12)' : '0 1px 2px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          {selectedOption ? (
            <>
              <span
                style={{
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#047857',
                  borderRadius: '5px',
                  padding: '1px 7px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {selectedOption.code}
              </span>
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedOption.name}
              </span>
            </>
          ) : (
            <span style={{ color: '#94a3b8' }}>{placeholder}</span>
          )}
        </div>
        <FaChevronDown
          style={{
            fontSize: '11px',
            color: '#64748b',
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease',
          }}
        />
      </button>

      {/* Dropdown ลอยทับด้านล่าง */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '100%',
            minWidth: '380px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 20px 38px -10px rgba(15, 23, 42, 0.22)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {/* ช่องค้นหาใน Dropdown */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <FaSearch style={{ color: '#94a3b8', fontSize: '12px', flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`ค้นหาเลขหรือชื่อ${entityLabel}...`}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '12.5px',
                color: '#0f172a',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                }}
              >
                <FaTimes style={{ fontSize: '11px' }} />
              </button>
            )}
          </div>

          {/* รายการตัวเลือก */}
          <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '6px' }}>
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#94a3b8',
                }}
              >
                ไม่พบ{entityLabel}ที่ค้นหา
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === valueId;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onChange(opt.id, opt);
                      setIsOpen(false);
                      setIsAddingInline(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#f0fbf5' : 'transparent',
                      color: isSelected ? '#047857' : '#1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      marginBottom: '2px',
                      transition: 'background-color 0.12s ease',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: isSelected ? '#00A651' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#334155',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {opt.code}
                      </span>
                      <span
                        style={{
                          lineHeight: 1.4,
                          fontWeight: isSelected ? 600 : 400,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {opt.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      {isSelected && (
                        <FaCheckCircle
                          style={{ color: '#00A651', fontSize: '13px', marginRight: '4px' }}
                        />
                      )}

                      {/* ปุ่มแก้ไข (ภาพที่ 4) */}
                      {onUpdate && (
                        <button
                          type="button"
                          onClick={(e) => handleStartEdit(opt, e)}
                          title={`แก้ไข${entityLabel}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            padding: '4px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.15s ease, background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#00A651';
                            e.currentTarget.style.backgroundColor = '#ecfdf5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#94a3b8';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <FaEdit style={{ fontSize: '12px' }} />
                        </button>
                      )}

                      {/* ปุ่มลบ (ภาพที่ 4) */}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={(e) => handleStartDelete(opt, e)}
                          title={`ลบ${entityLabel}`}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            padding: '4px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.15s ease, background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#dc2626';
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#94a3b8';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <FaTrashAlt style={{ fontSize: '12px' }} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* รายการสุดท้าย: "+ เพิ่มใหม่" แบบ inline ในตัว dropdown */}
          <div style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '8px 10px' }}>
            {!isAddingInline ? (
              <button
                type="button"
                onClick={() => {
                  setIsAddingInline(true);
                  setInlineError('');
                }}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: '1px dashed #00A651',
                  backgroundColor: '#ffffff',
                  color: '#00A651',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <FaPlus style={{ fontSize: '11px' }} />
                <span>+ เพิ่มใหม่ ({entityLabel})</span>
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#047857',
                  }}
                >
                  <span>เพิ่ม{entityLabel}ใหม่ (กรอกเลขและชื่อด้วยตนเอง)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingInline(false);
                      setInlineError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    ยกเลิก
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '6px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#475569',
                        marginBottom: '3px',
                      }}
                    >
                      เลข{entityLabel} *
                    </label>
                    <input
                      ref={codeInputRef}
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder={codePlaceholder}
                      style={{
                        width: '100%',
                        height: '32px',
                        padding: '0 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#00A651')}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#475569',
                        marginBottom: '3px',
                      }}
                    >
                      ชื่อ{entityLabel} *
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={namePlaceholder}
                      style={{
                        width: '100%',
                        height: '32px',
                        padding: '0 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#00A651')}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleConfirmCreate();
                        }
                      }}
                    />
                  </div>
                </div>

                {inlineError && (
                  <div style={{ color: '#dc2626', fontSize: '11.5px', fontWeight: 500 }}>
                    {inlineError}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingInline(false);
                      setInlineError('');
                    }}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCreate}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#00A651',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    เพิ่ม{entityLabel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal ยืนยันการลบ (ภาพที่ 4) */}
      {itemToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Header สีแดงเตือน */}
            <div
              style={{
                padding: '18px 22px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaTrashAlt style={{ fontSize: '18px' }} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                  ยืนยันการลบ{entityLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                &times;
              </button>
            </div>

            {/* เนื้อหา */}
            <div style={{ padding: '22px' }}>
              <p style={{ margin: '0 0 14px', fontSize: '13.5px', color: '#1e293b', lineHeight: 1.5 }}>
                คุณต้องการลบ{entityLabel}นี้ออกจากระบบใช่หรือไม่?
              </p>
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>
                  {itemToDelete.code}: {itemToDelete.name}
                </div>
                <div style={{ fontSize: '12px', color: '#b91c1c' }}>
                  ⚠️ ข้อควรระวัง: หากลบ{entityLabel}นี้ แผนงานหรือตัวชี้วัดที่ผูกอยู่ใต้{entityLabel}นี้จะได้รับผลกระทบ
                </div>
              </div>

              {deleteError && (
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    borderRadius: '6px',
                    fontSize: '12px',
                    marginBottom: '14px',
                  }}
                >
                  {deleteError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ยืนยันการลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal ยืนยันการแก้ไข (ภาพที่ 4) */}
      {itemToEdit && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Header สีเขียว KU */}
            <div
              style={{
                padding: '18px 22px',
                backgroundColor: '#00A651',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaEdit style={{ fontSize: '18px' }} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                  แก้ไขข้อมูล{entityLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setItemToEdit(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                &times;
              </button>
            </div>

            {/* เนื้อหาฟอร์มแก้ไข */}
            <div style={{ padding: '22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '5px',
                    }}
                  >
                    เลข{entityLabel} <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#00A651')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '5px',
                    }}
                  >
                    ชื่อ{entityLabel} <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#00A651')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                </div>
              </div>

              {editError && (
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    borderRadius: '6px',
                    fontSize: '12px',
                    marginBottom: '14px',
                  }}
                >
                  {editError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setItemToEdit(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEdit}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
