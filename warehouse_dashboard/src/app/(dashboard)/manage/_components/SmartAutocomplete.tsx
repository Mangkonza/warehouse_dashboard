'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PersonnelRecord } from '@/types/dataManagement';
import { getDepartmentAbbr } from '@/config/dataManagementConfig';
import { searchPersonnel } from '@/lib/personnelService';
import { FaSearch, FaUser } from 'react-icons/fa';

interface SmartAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  onSelectPerson?: (person: PersonnelRecord) => void;
  placeholder?: string;
  required?: boolean;
}

export const SmartAutocomplete: React.FC<SmartAutocompleteProps> = ({
  value,
  onChange,
  onSelectPerson,
  placeholder = 'พิมพ์ค้นหาชื่ออาจารย์/บุคลากร...',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [matches, setMatches] = useState<PersonnelRecord[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && isOpen) {
      const results = searchPersonnel(value, 8);
      setMatches(results);
    } else if (isOpen) {
      setMatches(searchPersonnel('', 8));
    }
  }, [value, isOpen]);

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (person: PersonnelRecord) => {
    onChange(person.name);
    if (onSelectPerson) {
      onSelectPerson(person);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: '10px 36px 10px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
        />
        <FaSearch
          style={{
            position: 'absolute',
            right: '12px',
            color: '#94a3b8',
            fontSize: '13px',
            pointerEvents: 'none',
          }}
        />
      </div>

      {isOpen && matches.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid #e2e8f0',
            zIndex: 9999,
            maxHeight: '280px',
            overflowY: 'auto',
          }}
        >
          {/* Suggestions Dropdown Items */}

          {matches.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              {/* Profile Image Avatar */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#e2e8f0',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={p.image_url ? encodeURI(p.image_url) : '/default-avatar.png'}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', backgroundColor: '#99b8db' }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== '/default-avatar.png' && !target.src.endsWith('/default-avatar.png')) {
                      target.src = '/default-avatar.png';
                    }
                  }}
                />
              </div>

              {/* Text Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13.5px', color: '#1e293b' }}>
                    {p.name}
                  </span>
                  {p.title_th && (
                    <span
                      style={{
                        fontSize: '10.5px',
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
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      backgroundColor: '#fbf0f1',
                      color: '#72242B',
                      border: '1px solid #e8b3b9',
                      cursor: 'default',
                    }}
                    title={p.department}
                  >
                    {getDepartmentAbbr(p.department)}
                  </span>
                  {p.email && p.email !== '-' && (
                    <span style={{ color: '#0284c7' }}>• {p.email}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
