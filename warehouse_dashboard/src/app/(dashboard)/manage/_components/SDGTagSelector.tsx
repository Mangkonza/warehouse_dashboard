'use client';

import React from 'react';
import { SDGS_DATA } from '@/config/sdgConfig';
import { SdgCard } from '@/components/ui/SdgCard';
import { FaCheck } from 'react-icons/fa';

export interface SDGTagSelectorProps {
  selectedSDGs: string[]; // e.g. ['SDG 6', 'SDG 9']
  onChange: (selected: string[]) => void;
  projectTitle?: string;
  department?: string;
  variant?: 'default' | 'evaluation';
}

export const SDGTagSelector: React.FC<SDGTagSelectorProps> = ({
  selectedSDGs = [],
  onChange,
  variant = 'default',
}) => {
  const toggleSDG = (sdgCode: string) => {
    if (selectedSDGs.includes(sdgCode)) {
      onChange(selectedSDGs.filter((s) => s !== sdgCode));
    } else {
      onChange([...selectedSDGs, sdgCode]);
    }
  };

  const sdgList = Object.values(SDGS_DATA).sort((a, b) => a.number - b.number);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Header Label: สอดคล้องตาม SDGs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          สอดคล้องตาม SDGs
        </label>
        <span style={{ fontSize: '11.5px', color: '#64748b' }}>เลือกได้หลายเป้าหมาย</span>
      </div>

      {/* SDG Multi-Tag Grid: 2 columns, all 17 items, no scroll */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '8px',
        }}
      >
        {sdgList.map((sdg) => {
          const isSelected = selectedSDGs.includes(sdg.code);

          // Evaluation variant: uses SdgCard global component (number + Thai name, no checkmark, white on #006C68 when selected)
          if (variant === 'evaluation') {
            return (
              <SdgCard
                key={sdg.number}
                goalNumber={sdg.number}
                nameTh={sdg.nameTh}
                selected={isSelected}
                onToggle={() => toggleSDG(sdg.code)}
              />
            );
          }

          // Default variant (untouched for backward compatibility with SmartAddEditModal)
          return (
            <button
              key={sdg.number}
              type="button"
              onClick={() => toggleSDG(sdg.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '10px',
                border: isSelected ? '1.5px solid #00A651' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 1px 4px rgba(0, 166, 81, 0.15)' : 'none',
              }}
            >
              {/* Big Number Icon */}
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: 800,
                  flexShrink: 0,
                  backgroundColor: isSelected ? '#00A651' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#334155',
                  border: isSelected ? 'none' : '1px solid #e2e8f0',
                }}
              >
                {sdg.number}
              </div>

              {/* SDG Info */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isSelected ? '#00A651' : '#1e293b',
                    lineHeight: 1.25,
                  }}
                >
                  SDG {sdg.number}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2px',
                  }}
                  title={sdg.nameTh}
                >
                  {sdg.nameTh}
                </span>
              </div>

              {/* Selection Checkmark */}
              {isSelected && (
                <FaCheck
                  style={{
                    fontSize: '11px',
                    color: '#00A651',
                    flexShrink: 0,
                    marginLeft: 'auto',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
