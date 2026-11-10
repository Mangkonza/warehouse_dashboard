'use client';

import { getClientBasePath } from '@/lib/api';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaCheckCircle, FaChevronDown, FaPlus, FaSlidersH, FaTimes } from 'react-icons/fa';
import {
  KpiLookupCategory,
  getStoredKpiLookupOptions,
  addKpiLookupOption,
} from '@/lib/kpiEngine';

export interface OptionPopoverSelectOption {
  value: string;
  label: string;
  isCustom?: boolean;
}

export interface OptionPopoverSelectProps {
  /** ค่าที่เลือก (string สำหรับ single-select หรือ string[] สำหรับ multiple) */
  value: string | string[];
  /** callback เมื่อค่าเปลี่ยน */
  onChange: (nextValue: any) => void;
  /** หมวดหมู่ lookup กลาง (collection_period | value_type | reporting_level) */
  lookupCategory?: KpiLookupCategory;
  /** รายการตัวเลือกเพิ่มเติม (ถ้าไม่ใช้ lookupCategory หรือต้องการกำหนดเอง) */
  options?: (string | OptionPopoverSelectOption)[];
  /** รองรับการเลือกหลายค่า */
  multiple?: boolean;
  /** รองรับตัวเลือก "อื่นๆ" เพื่อพิมพ์ค่าใหม่และบันทึกลง lookup table กลาง */
  allowCustom?: boolean;
  /** ข้อความหัวข้อใน popover */
  title?: string;
  /** placeholder เมื่อยังไม่เลือกค่า */
  placeholder?: string;
  /** ปิดการใช้งาน */
  disabled?: boolean;
  /** id ของปุ่ม trigger */
  id?: string;
  className?: string;
}

export const OptionPopoverSelect: React.FC<OptionPopoverSelectProps> = ({
  value,
  onChange,
  lookupCategory,
  options: propOptions,
  multiple = false,
  allowCustom = true,
  title = 'เลือกตัวเลือก',
  placeholder = 'เลือก...',
  disabled = false,
  id,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'list' | 'custom'>('list');
  const [customText, setCustomText] = useState('');
  const [customError, setCustomError] = useState('');
  const [lookupList, setLookupList] = useState<string[]>(() =>
    lookupCategory ? getStoredKpiLookupOptions(lookupCategory) : []
  );
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  // ซิงค์รายการตัวเลือกจาก lookup table (localStorage + API)
  useEffect(() => {
    if (!lookupCategory) return;
    const syncLocal = () => {
      setLookupList(getStoredKpiLookupOptions(lookupCategory));
    };
    syncLocal();

    // ดึงข้อมูลจาก API lookup table กลางเพิ่มเติม
    fetch(`${getClientBasePath()}/api/lookups/kpi-options?fieldKey=${encodeURIComponent(lookupCategory)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (res && Array.isArray(res.data)) {
          const fromServer = res.data
            .map((item: any) => String(item.value || item.label || '').trim())
            .filter((s: string) => s && !s.includes('?'));
          setLookupList((prev) => Array.from(new Set([...prev.filter((x) => !x.includes('?')), ...fromServer])));
        }
      })
      .catch(() => {});

    window.addEventListener('kpi_lookups_updated', syncLocal);
    return () => window.removeEventListener('kpi_lookups_updated', syncLocal);
  }, [lookupCategory]);

  // รวมรายการตัวเลือกทั้งหมด (ไม่รวม "อื่นๆ" ซึ่งจะถูกแสดงเป็นปุ่มแยกท้ายสุดเมื่อ allowCustom=true)
  const normalizedOptions: OptionPopoverSelectOption[] = useMemo(() => {
    const baseList: OptionPopoverSelectOption[] = [];
    const seen = new Set<string>();

    const addOpt = (val: string, label: string, isCustom = false) => {
      const cleanVal = val.trim();
      if (!cleanVal || cleanVal === 'อื่นๆ' || seen.has(cleanVal) || cleanVal.includes('?')) return;
      seen.add(cleanVal);
      baseList.push({ value: cleanVal, label: label.trim() || cleanVal, isCustom });
    };

    if (propOptions && propOptions.length > 0) {
      propOptions.forEach((o) => {
        if (typeof o === 'string') addOpt(o, o);
        else addOpt(o.value, o.label, o.isCustom);
      });
    }

    if (lookupCategory) {
      lookupList.forEach((item) => addOpt(item, item));
    }

    // หากมีค่าที่ถูกเลือกอยู่แต่ไม่อยู่ในรายการ ให้แสดงด้วยเสมอ
    const currentSelected = Array.isArray(value) ? value : value ? [value] : [];
    currentSelected.forEach((v) => {
      if (v && v !== 'อื่นๆ') addOpt(v, v, true);
    });

    return baseList;
  }, [propOptions, lookupCategory, lookupList, value]);

  const selectedArray: string[] = useMemo(() => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string' && value.trim() !== '') return [value.trim()];
    return [];
  }, [value]);

  // ปิด popover เมื่อคลิกนอกหรือกด Esc
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveSegment('list');
        setCustomError('');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        setActiveSegment('list');
        setCustomError('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeSegment === 'custom') {
      setTimeout(() => customInputRef.current?.focus(), 30);
    }
  }, [isOpen, activeSegment]);

  // ข้อความสั้นในปุ่ม Trigger ความสูงคงที่ (ห้ามขยายหรือดัน layout)
  const triggerDisplayText = useMemo(() => {
    if (selectedArray.length === 0) return placeholder;
    if (!multiple) {
      const found = normalizedOptions.find((o) => o.value === selectedArray[0]);
      return found ? found.label : selectedArray[0];
    }
    if (selectedArray.length === 1) {
      const found = normalizedOptions.find((o) => o.value === selectedArray[0]);
      return found ? found.label : selectedArray[0];
    }
    if (selectedArray.length === 2) {
      const joined = selectedArray
        .map((v) => normalizedOptions.find((o) => o.value === v)?.label || v)
        .join(', ');
      if (joined.length <= 22) return joined;
    }
    return `${selectedArray.length} รายการ (${selectedArray.join(', ')})`;
  }, [selectedArray, normalizedOptions, multiple, placeholder]);

  const handleToggleOption = (optVal: string) => {
    if (optVal === '__OTHER__') {
      setActiveSegment('custom');
      setCustomError('');
      return;
    }

    if (multiple) {
      const exists = selectedArray.includes(optVal);
      const next = exists
        ? selectedArray.filter((v) => v !== optVal)
        : [...selectedArray, optVal];
      onChange(next);
    } else {
      onChange(optVal);
      setIsOpen(false);
      setActiveSegment('list');
    }
  };

  const handleSaveCustomOption = async () => {
    const clean = customText.trim();
    if (!clean) {
      setCustomError('กรุณาระบุชื่อตัวเลือกที่ต้องการเพิ่ม');
      return;
    }
    if (clean === 'อื่นๆ') {
      setCustomError('กรุณาระบุชื่อตัวเลือกที่ชัดเจน');
      return;
    }

    if (lookupCategory) {
      const updated = await addKpiLookupOption(lookupCategory, clean);
      setLookupList(updated);
    }

    if (multiple) {
      if (!selectedArray.includes(clean)) {
        onChange([...selectedArray, clean]);
      }
    } else {
      onChange(clean);
      setIsOpen(false);
    }

    setCustomText('');
    setCustomError('');
    setActiveSegment('list');
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handlePopoverKeyDown = (e: React.KeyboardEvent) => {
    if (activeSegment === 'custom') return;
    const totalItems = normalizedOptions.length + (allowCustom ? 1 : 0);
    if (totalItems === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex < normalizedOptions.length) {
        handleToggleOption(normalizedOptions[focusedIndex].value);
      } else if (allowCustom) {
        setActiveSegment('custom');
      }
    }
  };

  const hasSelection = selectedArray.length > 0;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        display: 'inline-block',
      }}
      onKeyDown={handlePopoverKeyDown}
    >
      {/* ปุ่ม Trigger ความสูงคงที่ 38px เสมอ ห้ามขยายหรือดัน layout ด้านล่าง */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        style={{
          width: '100%',
          height: '38px',
          minHeight: '38px',
          maxHeight: '38px',
          padding: '0 12px',
          borderRadius: '8px',
          border: isOpen
            ? '1.5px solid #00A651'
            : hasSelection
            ? '1px solid #86efac'
            : '1px solid #cbd5e1',
          backgroundColor: disabled ? '#f1f5f9' : hasSelection ? '#f0fbf5' : '#ffffff',
          color: hasSelection ? '#0f172a' : '#64748b',
          fontSize: '13px',
          fontWeight: hasSelection ? 600 : 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          overflow: 'hidden',
          boxShadow: isOpen ? '0 0 0 3px rgba(0, 166, 81, 0.12)' : '0 1px 2px rgba(0, 0, 0, 0.02)',
          transition: 'border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <FaSlidersH
            style={{
              color: hasSelection ? '#00A651' : '#94a3b8',
              fontSize: '12px',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: '36px',
            }}
          >
            {triggerDisplayText}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {multiple && selectedArray.length > 0 && (
            <span
              style={{
                backgroundColor: '#00A651',
                color: '#ffffff',
                borderRadius: '999px',
                padding: '1px 7px',
                fontSize: '11px',
                fontWeight: 700,
                lineHeight: '16px',
              }}
            >
              {selectedArray.length} รายการ
            </span>
          )}
          <FaChevronDown
            style={{
              fontSize: '11px',
              color: '#64748b',
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          />
        </div>
      </button>

      {/* Popover ลอยทับใต้ช่อง (position: absolute, z-index สูง, ไม่ดันเนื้อหาด้านล่าง) */}
      {isOpen && (
        <div
          role="listbox"
          aria-multiselectable={multiple}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: 'max(100%, 340px)',
            maxWidth: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 20px 38px -10px rgba(15, 23, 42, 0.22), 0 4px 12px rgba(0, 166, 81, 0.08)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {/* Header สไตล์เดียวกับตัวกรอง "เลือกช่วงเวลาการแสดงผล" */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: '#f0fbf5',
                  border: '1px solid #bbf7d0',
                  color: '#00A651',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                }}
              >
                <FaSlidersH />
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{title}</span>
              {multiple && (
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                  (เลือกได้หลายรายการ)
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setActiveSegment('list');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '3px',
                display: 'flex',
              }}
              title="ปิด (Esc)"
            >
              <FaTimes style={{ fontSize: '13px' }} />
            </button>
          </div>

          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Segmented Tabs เหมือน TimeFilterModal */}
            {allowCustom && (
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  backgroundColor: '#f1f5f9',
                  padding: '3px',
                  borderRadius: '9px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveSegment('list');
                    setCustomError('');
                  }}
                  style={{
                    flex: 1,
                    height: '30px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: activeSegment === 'list' ? 700 : 500,
                    border: 'none',
                    backgroundColor: activeSegment === 'list' ? '#ffffff' : 'transparent',
                    color: activeSegment === 'list' ? '#00A651' : '#64748b',
                    boxShadow: activeSegment === 'list' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  รายการตัวเลือก ({normalizedOptions.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSegment('custom');
                    setCustomError('');
                  }}
                  style={{
                    flex: 1,
                    height: '30px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: activeSegment === 'custom' ? 700 : 500,
                    border: 'none',
                    backgroundColor: activeSegment === 'custom' ? '#ffffff' : 'transparent',
                    color: activeSegment === 'custom' ? '#00A651' : '#64748b',
                    boxShadow: activeSegment === 'custom' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <FaPlus style={{ fontSize: '10px' }} />
                  <span>อื่นๆ (เพิ่มตัวเลือกใหม่)</span>
                </button>
              </div>
            )}

            {/* โหมดที่ 1: Grid ตัวเลือกพร้อมติ๊กเขียว */}
            {activeSegment === 'list' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '8px',
                  maxHeight: '230px',
                  overflowY: 'auto',
                  paddingRight: '2px',
                }}
              >
                {normalizedOptions.map((opt, idx) => {
                  const isSelected = selectedArray.includes(opt.value);
                  const isFocused = focusedIndex === idx;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleToggleOption(opt.value)}
                      style={{
                        width: '100%',
                        minWidth: 0,
                        height: '38px',
                        padding: '0 10px',
                        borderRadius: '8px',
                        border: isSelected
                          ? '1.5px solid #00A651'
                          : isFocused
                          ? '1px solid #94a3b8'
                          : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#f0fbf5' : '#f8fafc',
                        color: isSelected ? '#00A651' : '#334155',
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        boxSizing: 'border-box',
                        boxShadow: isSelected ? '0 1px 2px rgba(0, 166, 81, 0.12)' : 'none',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <FaCheckCircle
                          style={{ color: '#00A651', fontSize: '13px', flexShrink: 0 }}
                        />
                      )}
                    </button>
                  );
                })}

                {/* ปุ่ม "อื่นๆ" ในตาราง Grid */}
                {allowCustom && (
                  <button
                    type="button"
                    onClick={() => handleToggleOption('__OTHER__')}
                    style={{
                      width: '100%',
                      minWidth: 0,
                      height: '38px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      border: '1px dashed #00A651',
                      backgroundColor: '#ffffff',
                      color: '#00A651',
                      fontWeight: 600,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <FaPlus style={{ fontSize: '10px' }} />
                    <span>อื่นๆ...</span>
                  </button>
                )}
              </div>
            ) : (
              /* โหมดที่ 2: พิมพ์ค่าใหม่ใน Popover แล้วบันทึกลงรายการตัวเลือกกลาง (lookup table) */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  backgroundColor: '#f8fafc',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                  ระบุตัวเลือกใหม่ (บันทึกเข้ารายการตัวเลือกกลางเพื่อให้เลือกซ้ำได้):
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    ref={customInputRef}
                    type="text"
                    value={customText}
                    onChange={(e) => {
                      setCustomText(e.target.value);
                      setCustomError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveCustomOption();
                      }
                    }}
                    placeholder="พิมพ์ชื่อตัวเลือกใหม่..."
                    style={{
                      flex: 1,
                      height: '36px',
                      padding: '0 10px',
                      borderRadius: '7px',
                      border: customError ? '1px solid #ef4444' : '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '13px',
                      color: '#0f172a',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveCustomOption}
                    style={{
                      height: '36px',
                      padding: '0 14px',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: '#00A651',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    + บันทึกและเลือก
                  </button>
                </div>
                {customError && (
                  <span style={{ fontSize: '11.5px', color: '#dc2626', fontWeight: 500 }}>
                    {customError}
                  </span>
                )}
              </div>
            )}

            {/* Footer สำหรับโหมด Multiple */}
            {multiple && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid #f1f5f9',
                  fontSize: '12px',
                }}
              >
                <span style={{ color: '#64748b' }}>
                  เลือกแล้ว <strong style={{ color: '#00A651' }}>{selectedArray.length}</strong> รายการ
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#00A651',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ตกลง
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
