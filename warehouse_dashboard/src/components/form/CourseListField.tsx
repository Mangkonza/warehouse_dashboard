'use client';

import * as React from 'react';
import { RepeatableList } from './RepeatableList';
import { CourseCodePicker, CourseItem } from './CourseCodePicker';
import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';

export interface CourseListFieldProps {
  items?: CourseItem[];
  onChange: (items: CourseItem[]) => void;
  addLabel?: string;
  emptyMessage?: string;
  maxItems?: number;
  disabled?: boolean;
  className?: string;
}

export function CourseListField({
  items = [],
  onChange,
  addLabel = '+ เพิ่มรายวิชา',
  emptyMessage = 'ยังไม่มีรายวิชาที่ระบุ (คลิกเพิ่มเพื่อระบุรายวิชา)',
  maxItems,
  disabled = false,
  className,
}: CourseListFieldProps) {
  const createItem = (): CourseItem => ({
    code: '',
    name: '',
  });

  return (
    <div className={cn('w-full', className)}>
      <RepeatableList<CourseItem>
        items={items}
        onChange={onChange}
        createItem={createItem}
        addLabel={addLabel}
        emptyMessage={emptyMessage}
        maxItems={maxItems}
        renderItem={(item, index, onChangeItem) => (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 shrink-0 select-none pl-1 sm:w-20">
              <GraduationCap className="size-3.5 text-emerald-600" />
              <span>วิชาที่ {index + 1}</span>
            </div>

            <div className="flex-1 min-w-0">
              <CourseCodePicker
                value={item}
                onChange={(c) => {
                  onChangeItem(c || { code: '', name: '' });
                }}
                disabled={disabled}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
