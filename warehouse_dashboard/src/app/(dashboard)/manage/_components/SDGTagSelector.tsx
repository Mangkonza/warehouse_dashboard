'use client';

import React from 'react';
import { SDG_LIST } from '@/lib/sdg';
import { SdgCard } from '@/components/ui/SdgCard';

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
}) => {
  const toggleSDG = (sdgCode: string) => {
    if (selectedSDGs.includes(sdgCode)) {
      onChange(selectedSDGs.filter((s) => s !== sdgCode));
    } else {
      onChange([...selectedSDGs, sdgCode]);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Header Label: สอดคล้องตาม SDGs */}
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-bold text-slate-900">
          สอดคล้องตาม SDGs
        </label>
        <span className="text-[11.5px] text-slate-500 font-medium">เลือกได้หลายเป้าหมาย</span>
      </div>

      {/* SDG Multi-Select Grid: 2 columns, all 17 items, no scroll */}
      <div className="grid grid-cols-2 gap-2">
        {SDG_LIST.map((sdg) => {
          const isSelected = selectedSDGs.includes(sdg.code);
          return (
            <SdgCard
              key={sdg.number}
              goalNumber={sdg.number}
              nameTh={sdg.nameTh}
              selected={isSelected}
              onToggle={() => toggleSDG(sdg.code)}
            />
          );
        })}
      </div>
    </div>
  );
};
