'use client';

import React, { useMemo } from 'react';
import { SDGS_DATA, SDGItem } from '@/config/sdgConfig';
import { detectSDGsFromText } from '@/lib/sdgEngine';
import { FaMagic, FaCheck } from 'react-icons/fa';

interface SDGTagSelectorProps {
  selectedSDGs: string[]; // e.g. ['SDG 6', 'SDG 9']
  onChange: (selected: string[]) => void;
  projectTitle?: string;
  department?: string;
}

export const SDGTagSelector: React.FC<SDGTagSelectorProps> = ({
  selectedSDGs = [],
  onChange,
  projectTitle = '',
  department = '',
}) => {
  // Real-time NLP Detection based on Title & Department
  const detectedSuggestions = useMemo(() => {
    if (!projectTitle || projectTitle.length < 4) return [];
    return detectSDGsFromText(projectTitle, department).slice(0, 3);
  }, [projectTitle, department]);

  const toggleSDG = (sdgCode: string) => {
    if (selectedSDGs.includes(sdgCode)) {
      onChange(selectedSDGs.filter((s) => s !== sdgCode));
    } else {
      onChange([...selectedSDGs, sdgCode]);
    }
  };

  const applySuggestion = (sdgCode: string) => {
    if (!selectedSDGs.includes(sdgCode)) {
      onChange([...selectedSDGs, sdgCode]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          เป้าหมายการพัฒนาที่ยั่งยืน (SDGs) & เกณฑ์มหาวิทยาลัยสีเขียว (UI GreenMetric)
        </label>
        <span style={{ fontSize: '11.5px', color: '#64748b' }}>เลือกได้หลายเป้าหมาย</span>
      </div>

      {/* Auto Suggestion Banner if detected */}
      {detectedSuggestions.length > 0 && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(240, 253, 244, 0.9)',
            border: '1px solid #a7f3d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaMagic style={{ color: '#059669', fontSize: '14px' }} />
            <span style={{ fontSize: '12px', color: '#065f46' }}>
              <strong>แนะนำอัตโนมัติจากชื่อโครงการ:</strong>{' '}
              {detectedSuggestions.map((s) => (
                <span key={s.sdg.code} style={{ fontWeight: 700, marginRight: '6px' }}>
                  {s.sdg.code} ({s.sdg.nameTh})
                </span>
              ))}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {detectedSuggestions.map((s) => {
              const isAlreadySelected = selectedSDGs.includes(s.sdg.code);
              return (
                <button
                  key={s.sdg.code}
                  type="button"
                  onClick={() => applySuggestion(s.sdg.code)}
                  disabled={isAlreadySelected}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: isAlreadySelected ? 'default' : 'pointer',
                    background: isAlreadySelected ? '#e2e8f0' : s.sdg.color,
                    color: isAlreadySelected ? '#94a3b8' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {isAlreadySelected ? <FaCheck /> : '+ ใช้'} {s.sdg.code}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SDG Multi-Tag Grid Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '160px', overflowY: 'auto', padding: '4px 0' }}>
        {Object.values(SDGS_DATA).map((sdg) => {
          const isSelected = selectedSDGs.includes(sdg.code);
          return (
            <button
              key={sdg.number}
              type="button"
              onClick={() => toggleSDG(sdg.code)}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: isSelected ? 700 : 500,
                border: isSelected ? `2px solid ${sdg.color}` : '1px solid rgba(226, 232, 240, 0.9)',
                background: isSelected ? `${sdg.color}20` : '#fff',
                color: isSelected ? sdg.color : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: sdg.color,
                  display: 'inline-block',
                }}
              />
              <span>{sdg.code}: {sdg.nameTh}</span>
              {isSelected && <FaCheck style={{ fontSize: '10px' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
