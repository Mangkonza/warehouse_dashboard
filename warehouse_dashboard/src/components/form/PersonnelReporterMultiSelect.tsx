'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaCheckCircle, FaPlus, FaSearch, FaTimes, FaUserCheck } from 'react-icons/fa';
import { searchPersonnel } from '@/lib/personnelService';
import { DepartmentBadge } from '@/components/ui/department-badge';

export interface PersonnelReporterMultiSelectProps {
  value?: string[];
  onChange: (nextList: string[]) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export const PersonnelReporterMultiSelect: React.FC<PersonnelReporterMultiSelectProps> = ({
  value = [],
  onChange,
  placeholder = '+ เลือกบุคลากรและอาจารย์',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedList = useMemo(() => (Array.isArray(value) ? value.filter(Boolean) : []), [value]);

  const personnelMatches = useMemo(() => {
    return searchPersonnel(query, 15);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const toggleReporter = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    if (selectedList.includes(clean)) {
      onChange(selectedList.filter((r) => r !== clean));
    } else {
      onChange([...selectedList, clean]);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* แสดงชิปผู้รายงานที่เลือก + ปุ่มเปิดเลือกจากข้อมูลบุคลากรและอาจารย์ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
          minHeight: '38px',
        }}
      >
        {selectedList.map((rep) => (
          <span
            key={rep}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              backgroundColor: '#00A651',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            <FaUserCheck style={{ fontSize: '11px' }} />
            <span>{rep}</span>
            <button
              type="button"
              onClick={() => toggleReporter(rep)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                opacity: 0.9,
              }}
              title={`นำ ${rep} ออก`}
            >
              <FaTimes style={{ fontSize: '10px' }} />
            </button>
          </span>
        ))}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '999px',
            border: '1px dashed #00A651',
            backgroundColor: '#ffffff',
            color: '#00A651',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <FaPlus style={{ fontSize: '10px' }} />
          <span>{placeholder}</span>
        </button>
      </div>

      {/* Popover ค้นหาจากฐานข้อมูลบุคลากรและอาจารย์ */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '380px',
            maxWidth: '92vw',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 20px 38px -10px rgba(15, 23, 42, 0.22)',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {/* ช่องค้นหาบุคลากรและอาจารย์ */}
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
            <FaSearch style={{ color: '#94a3b8', fontSize: '12px' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  e.preventDefault();
                  toggleReporter(query.trim());
                  setQuery('');
                }
              }}
              placeholder="ค้นหาชื่ออาจารย์ / บุคลากร / ภาควิชา..."
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '12.5px',
                color: '#0f172a',
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
              }}
            >
              <FaTimes style={{ fontSize: '12px' }} />
            </button>
          </div>

          {/* รายชื่อบุคลากรและอาจารย์จากฐานข้อมูล */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '6px' }}>
            {personnelMatches.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                ไม่พบข้อมูลบุคลากรหรืออาจารย์ที่ค้นหา
              </div>
            ) : (
              personnelMatches.map((person) => {
                const isSel = selectedList.includes(person.name);
                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => toggleReporter(person.name)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isSel ? '#f0fbf5' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '12.5px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span
                        style={{
                          fontWeight: isSel ? 700 : 500,
                          color: isSel ? '#047857' : '#0f172a',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {person.name}
                      </span>
                      {person.position && (
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{person.position}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {person.department && <DepartmentBadge value={person.department} />}
                      {isSel && <FaCheckCircle style={{ color: '#00A651', fontSize: '13px' }} />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
