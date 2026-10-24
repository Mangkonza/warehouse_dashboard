'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export interface RepeatableListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    onChangeItem: (updated: T) => void,
    onRemove: () => void
  ) => React.ReactNode;
  createItem: () => T;
  addLabel?: string;
  emptyMessage?: string;
  maxItems?: number;
  minItems?: number;
  className?: string;
  itemContainerClassName?: string;
}

export function RepeatableList<T>({
  items = [],
  onChange,
  renderItem,
  createItem,
  addLabel = '+ เพิ่มรายการ',
  emptyMessage = 'ยังไม่มีรายการ (คลิกเพิ่มเพื่อเริ่มกรอก)',
  maxItems,
  minItems = 0,
  className,
  itemContainerClassName,
}: RepeatableListProps<T>) {
  const handleAdd = () => {
    if (maxItems && items.length >= maxItems) return;
    onChange([...items, createItem()]);
  };

  const handleRemove = (index: number) => {
    if (items.length <= minItems) return;
    const next = [...items];
    next.splice(index, 1);
    onChange(next);
  };

  const handleChangeItem = (index: number, updated: T) => {
    const next = [...items];
    next[index] = updated;
    onChange(next);
  };

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {items.length === 0 ? (
        <div className="text-xs text-slate-400 italic py-2 px-3 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/50">
          {emptyMessage}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2 group/row transition-all duration-150',
                itemContainerClassName
              )}
            >
              <div className="flex-1 min-w-0">
                {renderItem(
                  item,
                  index,
                  (updated) => handleChangeItem(index, updated),
                  () => handleRemove(index)
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemove(index)}
                className="size-8 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 rounded-md transition-colors"
                title="ลบรายการนี้"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {(!maxItems || items.length < maxItems) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="self-start text-xs text-emerald-700 hover:text-emerald-800 border-dashed border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50/50 h-8 font-medium mt-1 gap-1.5"
        >
          <Plus className="size-3.5" />
          <span>{addLabel}</span>
        </Button>
      )}
    </div>
  );
}
