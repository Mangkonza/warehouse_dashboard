'use client';

import * as React from 'react';
import { Check, ChevronDown, Search, X, Edit3, Plus } from 'lucide-react';
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
import { DepartmentBadge } from '@/components/ui/department-badge';

export interface DepartmentMultiSelectProps {
  value?: string[] | string | null;
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  returnFormat?: 'name' | 'code';
  maxSelections?: number;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return `rgba(100, 116, 139, ${alpha})`;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function DepartmentMultiSelect({
  value = [],
  onChange,
  placeholder = '-- เลือกภาควิชา / หน่วยงานที่รับผิดชอบ --',
  disabled = false,
  className,
  returnFormat = 'name',
  maxSelections,
}: DepartmentMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [hoveredCode, setHoveredCode] = React.useState<string | null>(null);

  // Custom text for OTH
  const [isTypingCustom, setIsTypingCustom] = React.useState(false);
  const [customText, setCustomText] = React.useState('');

  const groups: DepartmentGroup[] = ['ภาควิชา', 'ศูนย์', 'สำนักงาน', 'อื่นๆ'];

  // Normalize value to an array of strings (handles string, comma-separated string, array, null, undefined)
  const safeValue: string[] = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return [];
      return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [value]);

  const selectedDepts = React.useMemo(() => {
    return safeValue.map((val) => {
      const dept = getDepartment(val);
      return {
        raw: val,
        code: dept.code,
        name: dept.name,
        color: dept.color,
      };
    });
  }, [safeValue]);

  const isSelected = (dept: DepartmentInfo) => {
    return safeValue.some((v) => {
      if (v === dept.name || v === dept.code) return true;
      if (dept.code === 'OTH' && v.startsWith('OTH:')) return true;
      return false;
    });
  };

  const handleToggle = (dept: DepartmentInfo) => {
    if (dept.code === 'OTH') {
      setIsTypingCustom(true);
      return;
    }

    const itemVal = returnFormat === 'code' ? dept.code : dept.name;
    const exists = safeValue.some((v) => v === itemVal || v === dept.code || v === dept.name);

    if (exists) {
      onChange(safeValue.filter((v) => v !== itemVal && v !== dept.code && v !== dept.name));
    } else {
      if (maxSelections && safeValue.length >= maxSelections) return;
      onChange([...safeValue, itemVal]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    const customVal = `OTH: ${trimmed}`;
    if (!safeValue.includes(customVal)) {
      if (!maxSelections || safeValue.length < maxSelections) {
        onChange([...safeValue, customVal]);
      }
    }
    setCustomText('');
    setIsTypingCustom(false);
  };

  const handleRemove = (rawVal: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(safeValue.filter((v) => v !== rawVal));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

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

  return (
    <div className={cn('relative inline-flex items-center w-full', className)}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setIsTypingCustom(false);
            setSearch('');
          }
        }}
      >
        <PopoverTrigger
          disabled={disabled}
          nativeButton={false}
          render={
            <div
              tabIndex={disabled ? -1 : 0}
              role="button"
              className={cn(
                'min-h-[40px] w-full flex items-center justify-between gap-2 p-1.5 px-3 rounded-lg border border-input bg-background shadow-2xs hover:bg-accent/40 cursor-pointer transition-colors',
                disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
              )}
            >
              <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 py-0.5">
                {selectedDepts.length === 0 ? (
                  <span className="text-sm text-muted-foreground">{placeholder}</span>
                ) : (
                  selectedDepts.map((d) => (
                    <span
                      key={d.raw}
                      className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 rounded-md text-xs font-medium border animate-in fade-in-50 duration-150"
                      style={{
                        backgroundColor: hexToRgba(d.color, 0.12),
                        borderColor: hexToRgba(d.color, 0.3),
                        color: '#1e293b',
                      }}
                    >
                      <DepartmentBadge value={d.code} showTooltip={false} />
                      <span className="truncate max-w-[150px]">{d.name}</span>
                      <button
                        type="button"
                        onClick={(e) => handleRemove(d.raw, e)}
                        className="text-slate-400 hover:text-red-600 transition-colors rounded-sm ml-0.5"
                        title="ลบออก"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                {selectedDepts.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5 rounded hover:bg-slate-100 transition-colors"
                    title="ล้างทั้งหมด"
                  >
                    ล้าง
                  </button>
                )}
                <ChevronDown className="size-4 text-muted-foreground shrink-0" />
              </div>
            </div>
          }
        />

        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-88 p-0 rounded-xl shadow-lg border border-slate-200 bg-white overflow-hidden text-slate-900"
        >
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
                      handleAddCustom();
                    }
                  }}
                  placeholder="พิมพ์ชื่อภาควิชา หรือสังกัด..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddCustom}
                  className="bg-[#2E3136] text-white hover:bg-slate-800 h-8 text-xs font-medium px-3"
                >
                  เพิ่ม
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
                            const checked = isSelected(dept);
                            const isHovered = hoveredCode === dept.code;
                            const hoverBg = hexToRgba(dept.color, 0.14);

                            return (
                              <div
                                key={dept.code}
                                onClick={() => handleToggle(dept)}
                                onMouseEnter={() => setHoveredCode(dept.code)}
                                onMouseLeave={() => setHoveredCode(null)}
                                style={{
                                  backgroundColor: isHovered
                                    ? hoverBg
                                    : checked
                                    ? hexToRgba(dept.color, 0.08)
                                    : 'transparent',
                                }}
                                className={cn(
                                  'flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors select-none'
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className={cn(
                                      'size-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                                      checked
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'border-slate-300 bg-white'
                                    )}
                                  >
                                    {checked && <Check className="size-3 stroke-[3]" />}
                                  </div>
                                  <DepartmentBadge value={dept.code} showTooltip={false} />
                                  <span
                                    className={cn(
                                      'truncate text-[12.5px]',
                                      checked ? 'font-semibold text-slate-900' : 'text-slate-700'
                                    )}
                                  >
                                    {dept.name}
                                  </span>
                                </div>
                                {dept.code === 'OTH' && (
                                  <span className="text-[10.5px] text-slate-400 flex items-center gap-0.5">
                                    <Plus className="size-3" /> พิมพ์เอง
                                  </span>
                                )}
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
