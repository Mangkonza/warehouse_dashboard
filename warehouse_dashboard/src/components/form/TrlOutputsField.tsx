'use client';

import * as React from 'react';
import { RepeatableList } from './RepeatableList';
import { TrlSelect } from './TrlSelect';
import { cn } from '@/lib/utils';

export interface TrlOutputItem {
  name: string;
  trl: number | null;
  note?: string;
}

export interface TrlOutputsFieldProps {
  items?: TrlOutputItem[];
  onChange: (items: TrlOutputItem[]) => void;
  addLabel?: string;
  emptyMessage?: string;
  maxItems?: number;
  disabled?: boolean;
  className?: string;
}

export function TrlOutputsField({
  items = [],
  onChange,
  addLabel = '+ เพิ่มผลงาน Output / ผลผลิตโครงการ',
  emptyMessage = 'ยังไม่มีผลงาน Output',
  maxItems,
  disabled = false,
  className,
}: TrlOutputsFieldProps) {
  const createItem = (): TrlOutputItem => ({
    name: '',
    trl: 1,
    note: '',
  });

  return (
    <div className={cn('w-full', className)}>
      <RepeatableList<TrlOutputItem>
        items={items}
        onChange={onChange}
        createItem={createItem}
        addLabel={addLabel}
        emptyMessage={emptyMessage}
        maxItems={maxItems}
        renderItem={(item, index, onChangeItem) => (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span className="text-xs font-medium text-slate-500 shrink-0 select-none sm:w-16">
              ผลผลิต {index + 1}
            </span>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => onChangeItem({ ...item, name: e.target.value })}
                  placeholder="ชื่อผลงาน / ชิ้นงาน / ต้นแบบ..."
                  disabled={disabled}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#00A651]"
                />
              </div>

              <div className="sm:col-span-4">
                <TrlSelect
                  value={item.trl}
                  onChange={(lvl) => onChangeItem({ ...item, trl: lvl })}
                  placeholder="เลือกระดับ TRL"
                  disabled={disabled}
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={item.note || ''}
                  onChange={(e) => onChangeItem({ ...item, note: e.target.value })}
                  placeholder="หมายเหตุ (ถ้ามี)"
                  disabled={disabled}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#00A651]"
                />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
