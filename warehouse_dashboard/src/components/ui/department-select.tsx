'use client';

import * as React from 'react';
import { Check, ChevronDown, Search, PlusCircle, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DEPARTMENTS,
  getDepartment,
  DepartmentInfo,
  DepartmentGroup,
} from '@/lib/departments';
import { DepartmentBadge } from './department-badge';

export interface DepartmentSelectProps {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowAll?: boolean;
  allLabel?: string;
  allValue?: string;
  returnFormat?: 'name' | 'code';
  size?: 'default' | 'sm';
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return `rgba(100, 116, 139, ${alpha})`;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function DepartmentSelect({
  value,
  onChange,
  placeholder = '-- เลือกสังกัด --',
  disabled = false,
  className,
  allowAll = false,
  allLabel = 'ทุกภาควิชา / ศูนย์',
  allValue = 'all',
  returnFormat = 'name',
  size = 'default',
}: DepartmentSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [hoveredCode, setHoveredCode] = React.useState<string | null>(null);

  // State for typing custom other department
  const [isTypingCustom, setIsTypingCustom] = React.useState(false);
  const [customText, setCustomText] = React.useState('');

  // Determine current selection
  const isAllSelected = allowAll && (value === allValue || (!value && allowAll));
  const selectedDept: DepartmentInfo | null = React.useMemo(() => {
    if (!value || isAllSelected) return null;
    const resolved = getDepartment(value);
    return resolved.code !== '-' ? resolved : null;
  }, [value, isAllSelected]);

  // Group departments
  const groups: DepartmentGroup[] = ['ภาควิชา', 'ศูนย์', 'สำนักงาน', 'อื่นๆ'];

  // Filtered options based on search query
  const filteredDepartments = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return DEPARTMENTS;
    return DEPARTMENTS.filter(
      (d) =>
        d.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.group.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (dept: DepartmentInfo) => {
    if (dept.code === 'OTH') {
      setIsTypingCustom(true);
      setCustomText(selectedDept?.code === 'OTH' && selectedDept.name !== 'อื่นๆ (ระบุเอง)' ? selectedDept.name : '');
      return;
    }
    setOpen(false);
    setSearch('');
    setIsTypingCustom(false);
    if (onChange) {
      onChange(returnFormat === 'code' ? dept.code : dept.name);
    }
  };

  const handleConfirmCustom = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    setOpen(false);
    setSearch('');
    setIsTypingCustom(false);
    if (onChange) {
      onChange(`OTH: ${trimmed}`);
    }
  };

  const handleSelectAll = () => {
    setOpen(false);
    setSearch('');
    setIsTypingCustom(false);
    if (onChange) {
      onChange(allValue);
    }
  };

  return (
    <div className={cn('relative inline-flex items-center w-full', className)}>
      <Popover open={open} onOpenChange={(next) => {
        setOpen(next);
        if (!next) setIsTypingCustom(false);
      }}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              variant="outline"
              type="button"
              className={cn(
                'w-full justify-between font-normal bg-background border-input hover:bg-accent/40 rounded-lg gap-2 cursor-pointer shadow-2xs',
                size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-10 px-3 text-sm min-h-[40px]',
                (!selectedDept && !isAllSelected) && 'text-muted-foreground'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {selectedDept ? (
                  <>
                    <DepartmentBadge value={selectedDept.code} showTooltip={false} />
                    <span className={cn('truncate text-slate-800 font-medium', size === 'sm' ? 'text-[12.5px]' : 'text-sm')}>
                      {selectedDept.name}
                    </span>
                  </>
                ) : isAllSelected ? (
                  <span className={cn('truncate text-slate-800 font-medium', size === 'sm' ? 'text-[12.5px]' : 'text-sm')}>
                    {allLabel}
                  </span>
                ) : (
                  <span className={cn('truncate', size === 'sm' ? 'text-xs' : 'text-sm')}>{placeholder}</span>
                )}
              </div>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </Button>
          }
        />
        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-84 p-0 rounded-xl shadow-lg border border-slate-200 bg-white overflow-hidden text-slate-900"
        >
          {/* Custom Text Mode */}
          {isTypingCustom ? (
            <div className="p-3 bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <DepartmentBadge value="OTH" showTooltip={false} />
                <span className="text-xs font-semibold text-slate-700">ระบุชื่อภาควิชา / สังกัดอื่น ๆ</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmCustom();
                    }
                  }}
                  placeholder="พิมพ์ชื่อภาควิชา หรือสังกัด..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmCustom}
                  className="bg-[#2E3136] text-white hover:bg-slate-800 h-8 text-xs font-medium px-3"
                >
                  ตกลง
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
                <span>ใช้รหัส OTH อัตโนมัติ</span>
                <button
                  type="button"
                  onClick={() => setIsTypingCustom(false)}
                  className="text-slate-500 hover:text-slate-800 underline"
                >
                  กลับไปเลือกจากรายการ
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Search bar inside popover */}
              <div className="flex items-center px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                <Search className="size-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหารหัสย่อ หรือชื่อภาควิชา..."
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

              {/* Department options list */}
              <div className="max-h-72 overflow-y-auto p-1.5 scrollbar-thin">
                {allowAll && (!search || allLabel.toLowerCase().includes(search.toLowerCase())) && (
                  <div
                    onClick={handleSelectAll}
                    className={cn(
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors font-medium mb-1',
                      isAllSelected
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    <span>{allLabel}</span>
                    {isAllSelected && <Check className="size-3.5 text-emerald-600 shrink-0" />}
                  </div>
                )}

                {filteredDepartments.length === 0 ? (
                  <div className="px-3 py-6 text-center text-xs text-slate-400">
                    ไม่พบข้อมูลภาควิชาที่ค้นหา
                  </div>
                ) : (
                  groups.map((group) => {
                    const groupItems = filteredDepartments.filter((d) => d.group === group);
                    if (groupItems.length === 0) return null;

                    return (
                      <div key={group} className="mb-2 last:mb-0">
                        <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {group}
                        </div>
                        <div className="space-y-0.5">
                          {groupItems.map((dept) => {
                            const isSelected =
                              selectedDept?.code === dept.code ||
                              selectedDept?.name === dept.name;
                            const isHovered = hoveredCode === dept.code;
                            const hoverBg = hexToRgba(dept.color, 0.14);

                            return (
                              <div
                                key={dept.code}
                                onClick={() => handleSelect(dept)}
                                onMouseEnter={() => setHoveredCode(dept.code)}
                                onMouseLeave={() => setHoveredCode(null)}
                                style={{
                                  backgroundColor: isHovered
                                    ? hoverBg
                                    : isSelected
                                    ? hexToRgba(dept.color, 0.08)
                                    : 'transparent',
                                }}
                                className={cn(
                                  'flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors select-none'
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <DepartmentBadge value={dept.code} showTooltip={false} />
                                  <span
                                    className={cn(
                                      'truncate text-[12.5px]',
                                      isSelected ? 'font-semibold text-slate-900' : 'text-slate-700'
                                    )}
                                  >
                                    {dept.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {dept.code === 'OTH' && (
                                    <span className="text-[10.5px] text-slate-400 flex items-center gap-0.5">
                                      <Edit3 className="size-3" /> พิมพ์เอง
                                    </span>
                                  )}
                                  {isSelected && (
                                    <Check className="size-3.5 text-emerald-600 shrink-0" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
