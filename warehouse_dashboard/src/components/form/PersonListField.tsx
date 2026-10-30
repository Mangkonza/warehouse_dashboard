'use client';

import * as React from 'react';
import { RepeatableList } from './RepeatableList';
import { PersonPicker, PersonValue } from './PersonPicker';
import { cn } from '@/lib/utils';

export interface CoResearcherItem extends PersonValue {
  role?: string;
  contributionPercent?: number | null;
}

export interface PersonListFieldProps {
  items?: CoResearcherItem[] | string | null;
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
  emptyMessage = 'ยังไม่มีผู้ร่วมวิจัย',
  maxItems,
  disabled = false,
  className,
  showContribution = false,
}: PersonListFieldProps) {
  const safeItems: CoResearcherItem[] = React.useMemo(() => {
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') {
      const trimmed = items.trim();
      if (!trimmed) return [];
      return trimmed.split(',').map((name) => ({
        name: name.trim(),
        department: '',
        person_id: null,
        is_custom: true,
        role: 'ผู้ร่วมวิจัย',
        contributionPercent: null,
      })).filter((i) => Boolean(i.name));
    }
    return [];
  }, [items]);

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
        items={safeItems}
        onChange={onChange}
        createItem={createItem}
        addLabel={addLabel}
        emptyMessage={emptyMessage}
        maxItems={maxItems}
        renderItem={(item, index, onChangeItem) => (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span className="text-xs font-medium text-slate-500 shrink-0 select-none sm:w-14">
              ลำดับ {index + 1}
            </span>

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
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-slate-500 whitespace-nowrap">สัดส่วน</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={item.contributionPercent ?? ''}
                  onChange={(e) => {
                    const num = e.target.value === '' ? null : Number(e.target.value);
                    onChangeItem({
                      ...item,
                      contributionPercent: num,
                    });
                  }}
                  disabled={disabled}
                  className="w-16 h-10 px-2.5 text-sm text-right border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#00A651]"
                />
                <span className="text-xs text-slate-500">%</span>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
