'use client';

import * as React from 'react';
import { Check, ChevronDown, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface ComboboxOption {
  label: string;
  value: string;
}

export interface CreatableComboboxProps {
  options: (string | ComboboxOption)[];
  value?: string | string[] | null;
  onChange: (value: any) => void;
  onCreate?: (newVal: string) => void;
  multiple?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  createPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CreatableCombobox({
  options = [],
  value,
  onChange,
  onCreate,
  multiple = false,
  placeholder = 'เลือกหรือพิมพ์เพิ่ม...',
  searchPlaceholder = 'ค้นหาหรือพิมพ์เพื่อเพิ่ม...',
  createPlaceholder = 'ระบุค่าใหม่...',
  disabled = false,
  className,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);
  const [customInput, setCustomInput] = React.useState('');

  const normalizedOptions: ComboboxOption[] = React.useMemo(() => {
    return options.map((opt) =>
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );
  }, [options]);

  const selectedValues: string[] = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const filteredOptions = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return normalizedOptions;
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q)
    );
  }, [normalizedOptions, search]);

  const canCreateDirectly = search.trim().length > 0 &&
    !normalizedOptions.some(
      (opt) => opt.label.toLowerCase() === search.trim().toLowerCase()
    );

  const handleSelectOption = (optValue: string) => {
    if (multiple) {
      const exists = selectedValues.includes(optValue);
      const next = exists
        ? selectedValues.filter((v) => v !== optValue)
        : [...selectedValues, optValue];
      onChange(next);
    } else {
      onChange(optValue);
      setOpen(false);
      setSearch('');
    }
  };

  const handleCreateNew = (valToCreate: string) => {
    const trimmed = valToCreate.trim();
    if (!trimmed) return;
    if (onCreate) onCreate(trimmed);
    if (multiple) {
      if (!selectedValues.includes(trimmed)) {
        onChange([...selectedValues, trimmed]);
      }
    } else {
      onChange(trimmed);
      setOpen(false);
    }
    setSearch('');
    setCustomInput('');
    setIsCreating(false);
  };

  const handleRemoveChip = (valToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onChange(selectedValues.filter((v) => v !== valToRemove));
    }
  };

  return (
    <div className={cn('relative inline-flex items-center w-full', className)}>
      <Popover open={open} onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setIsCreating(false);
          setSearch('');
        }
      }}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              variant="outline"
              type="button"
              className={cn(
                'w-full justify-between font-normal bg-background border-input hover:bg-accent/40 min-h-[38px] h-auto py-1.5 px-3 text-sm rounded-lg gap-2 cursor-pointer shadow-2xs',
                selectedValues.length === 0 && 'text-muted-foreground'
              )}
            >
              <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                {selectedValues.length === 0 ? (
                  <span className="text-slate-400 text-xs">{placeholder}</span>
                ) : multiple ? (
                  selectedValues.map((val) => {
                    const match = normalizedOptions.find((o) => o.value === val);
                    const label = match ? match.label : val;
                    return (
                      <span
                        key={val}
                        className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[12px] font-medium px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        <span className="truncate max-w-[150px]">{label}</span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => handleRemoveChip(val, e)}
                          className="hover:text-red-600 rounded p-0.5"
                        >
                          <X className="size-3" />
                        </span>
                      </span>
                    );
                  })
                ) : (
                  <span className="truncate text-slate-800 text-xs font-medium">
                    {normalizedOptions.find((o) => o.value === selectedValues[0])?.label || selectedValues[0]}
                  </span>
                )}
              </div>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </Button>
          }
        />
        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-80 p-0 rounded-xl shadow-lg border border-slate-200 bg-white overflow-hidden text-slate-900"
        >
          {isCreating ? (
            <div className="p-3 bg-slate-50 flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-700">เพิ่มรายการใหม่</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateNew(customInput);
                    }
                  }}
                  placeholder={createPlaceholder}
                  className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleCreateNew(customInput)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs px-2.5 font-medium"
                >
                  เพิ่ม
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="self-start text-[11px] text-slate-500 hover:text-slate-800 underline mt-0.5"
              >
                ยกเลิก
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                <Search className="size-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canCreateDirectly) {
                      e.preventDefault();
                      handleCreateNew(search);
                    }
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
                  autoFocus
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="text-xs text-slate-400 hover:text-slate-600 px-1"
                  >
                    ล้าง
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-thin">
                {canCreateDirectly && (
                  <div
                    onClick={() => handleCreateNew(search)}
                    className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 rounded-lg cursor-pointer mb-1 transition-colors"
                  >
                    <Plus className="size-3.5" />
                    <span>เพิ่ม &ldquo;{search.trim()}&rdquo;</span>
                  </div>
                )}

                {filteredOptions.length === 0 && !canCreateDirectly ? (
                  <div className="px-3 py-4 text-center text-xs text-slate-400">
                    ไม่พบรายการ
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = selectedValues.includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value)}
                        className={cn(
                          'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors select-none',
                          isSelected
                            ? 'bg-slate-100 font-semibold text-slate-900'
                            : 'text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <Check className="size-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    );
                  })
                )}

                <div
                  onClick={() => {
                    setIsCreating(true);
                    setCustomInput('');
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-2 text-xs text-slate-600 hover:text-emerald-700 hover:bg-slate-50 rounded-lg cursor-pointer mt-1 border-t border-slate-100 transition-colors font-medium"
                >
                  <Plus className="size-3.5 text-slate-400" />
                  <span>อื่นๆ (เพิ่มใหม่)...</span>
                </div>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
