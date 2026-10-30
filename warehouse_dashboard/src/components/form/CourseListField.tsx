'use client';

import * as React from 'react';
import { RepeatableList } from './RepeatableList';
import { CourseCodePicker, CourseItem } from './CourseCodePicker';
import { cn } from '@/lib/utils';

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
  emptyMessage = 'ยังไม่มีรายวิชาที่ระบุ',
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span className="text-xs font-medium text-slate-500 shrink-0 select-none sm:w-14">
              วิชาที่ {index + 1}
            </span>

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
