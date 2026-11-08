'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';

export const STANDARD_UNITS = [
  'ผลงาน',
  'ร้อยละ',
  'หลักสูตร',
  'ราย',
  'โครงการ',
  'ผลงาน/รางวัล',
  'แห่ง',
  'บาท',
  'คน',
  'คะแนน',
  'ฉบับ',
  'บทความ',
];

interface UnitSelectInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const UnitSelectInput: React.FC<UnitSelectInputProps> = ({
  value,
  onChange,
  placeholder = 'เช่น ร้อยละ, ผลงาน, โครงการ',
  id,
  required = false,
  disabled = false,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectOption = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          disabled={disabled}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '38px',
            padding: '0 32px 0 12px',
            borderRadius: '8px',
            border: isOpen ? '1.5px solid #00A651' : '1px solid #cbd5e1',
            backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
            color: '#0f172a',
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: isOpen ? '0 0 0 3px rgba(0, 166, 81, 0.12)' : 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setIsOpen((prev) => !prev);
            inputRef.current?.focus();
          }}
          style={{
            position: 'absolute',
            right: '8px',
            background: 'none',
            border: 'none',
            color: isOpen ? '#00A651' : '#64748b',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease, color 0.15s ease',
          }}
          title="เลือกหน่วยนับ"
        >
          <FaChevronDown style={{ fontSize: '11px' }} />
        </button>
      </div>

      {/* Dropdown Menu สไตล์ขาวมน สวยงาม ตรงตามธีมระบบ */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.18)',
            zIndex: 99999,
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          <div
            style={{
              padding: '4px 8px 6px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#64748b',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '2px',
            }}
          >
            หน่วยนับมาตรฐาน (หรือพิมพ์ค่าใหม่ในช่องได้)
          </div>
          {STANDARD_UNITS.map((opt) => {
            const isSelected = value.trim() === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                  color: isSelected ? '#047857' : '#1e293b',
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '12.5px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{opt}</span>
                {isSelected && <FaCheck style={{ color: '#00A651', fontSize: '11px' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
