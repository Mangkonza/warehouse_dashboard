'use client';

import React from 'react';
import { FaSearch } from 'react-icons/fa';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'ค้นหา...',
  width = '200px',
  className = '',
  style,
  inputStyle,
}: SearchInputProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '6px 12px',
        fontSize: '13px',
        ...style,
      }}
    >
      <FaSearch style={{ color: '#94a3b8', marginRight: '6px', flexShrink: 0 }} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          fontSize: '12.5px',
          width: typeof width === 'number' ? `${width}px` : width,
          fontFamily: 'inherit',
          background: 'transparent',
          ...inputStyle,
        }}
      />
    </div>
  );
}
