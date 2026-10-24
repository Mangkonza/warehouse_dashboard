'use client';

import * as React from 'react';
import { RepeatableList } from './RepeatableList';
import { TrlSelect } from './TrlSelect';
import { cn } from '@/lib/utils';
import { PackageCheck } from 'lucide-react';

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
  emptyMessage = 'ยังไม่มีผลงาน Output (คลิกเพิ่มเพื่อระบุผลงานและระดับ TRL)',
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
          <div className="flex flex-col gap-2 p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 select-none">
              <PackageCheck className="size-3.5 text-emerald-600" />
              <span>ผลผลิตที่ {index + 1}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              {/* Output name */}
              <div className="sm:col-span-7">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => onChangeItem({ ...item, name: e.target.value })}
                  placeholder="ชื่อผลงาน / ชิ้นงาน / ต้นแบบ..."
                  disabled={disabled}
                  className="w-full h-10 px-3 text-xs rounded-lg border border-input bg-background focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>

              {/* TRL level select */}
              <div className="sm:col-span-5">
                <TrlSelect
                  value={item.trl}
                  onChange={(lvl) => onChangeItem({ ...item, trl: lvl })}
                  placeholder="เลือกระดับ TRL"
                  disabled={disabled}
                />
              </div>
            </div>

            {/* Note / description */}
            <div>
              <input
                type="text"
                value={item.note || ''}
                onChange={(e) => onChangeItem({ ...item, note: e.target.value })}
                placeholder="หมายเหตุ หรือคำอธิบายเพิ่มเติม (ถ้ามี)"
                disabled={disabled}
                className="w-full h-8 px-2.5 text-[11.5px] rounded-md border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
