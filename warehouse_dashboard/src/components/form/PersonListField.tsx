'use client';

import * as React from 'react';
import { RepeatableList } from './RepeatableList';
import { PersonPicker, PersonValue } from './PersonPicker';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

export interface CoResearcherItem extends PersonValue {
  role?: string;
  contributionPercent?: number | null;
}

export interface PersonListFieldProps {
  items?: CoResearcherItem[];
  onChange: (items: CoResearcherItem[]) => void;
  addLabel?: string;
  emptyMessage?: string;
  maxItems?: number;
  disabled?: boolean;
  className?: string;
  showContribution?: boolean;
}

export function PersonListField({
  items = [],
  onChange,
  addLabel = '+ เพิ่มผู้ร่วมวิจัย',
  emptyMessage = 'ยังไม่มีผู้ร่วมวิจัย (คลิกเพิ่มเพื่อระบุผู้ร่วมโครงการ)',
  maxItems,
  disabled = false,
  className,
  showContribution = false,
}: PersonListFieldProps) {
  const createItem = (): CoResearcherItem => ({
    name: '',
    department: '',
    person_id: null,
    is_custom: true,
    role: 'ผู้ร่วมวิจัย',
    contributionPercent: null,
  });

  return (
    <div className={cn('w-full', className)}>
      <RepeatableList<CoResearcherItem>
        items={items}
        onChange={onChange}
        createItem={createItem}
        addLabel={addLabel}
        emptyMessage={emptyMessage}
        maxItems={maxItems}
        renderItem={(item, index, onChangeItem) => (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 shrink-0 select-none pl-1">
              <Users className="size-3.5 text-emerald-600" />
              <span>ลำดับ {index + 1}</span>
            </div>

            <div className="flex-1 min-w-0">
              <PersonPicker
                value={item}
                onChange={(p) => {
                  if (p) {
                    onChangeItem({
                      ...item,
                      ...p,
                    });
                  } else {
                    onChangeItem({
                      name: '',
                      department: '',
                      person_id: null,
                      is_custom: true,
                    });
                  }
                }}
                disabled={disabled}
                placeholder="เลือกหรือระบุชื่อผู้ร่วมวิจัย..."
              />
            </div>

            {showContribution && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-slate-500 whitespace-nowrap">สัดส่วน:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="%"
                  value={item.contributionPercent ?? ''}
                  onChange={(e) => {
                    const num = e.target.value === '' ? null : Number(e.target.value);
                    onChangeItem({
                      ...item,
                      contributionPercent: num,
                    });
                  }}
                  disabled={disabled}
                  className="w-16 h-9 px-2 text-xs text-right border border-input rounded-md bg-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">%</span>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
