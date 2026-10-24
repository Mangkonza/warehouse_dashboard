'use client';

import * as React from 'react';
import { Search, BookOpen, Check, AlertCircle, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import courseCatalog from '@/data/course_catalog.json';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DepartmentBadge } from '@/components/ui/department-badge';

export interface CourseItem {
  code: string;
  name: string;
  department?: string;
}

export interface CourseCodePickerProps {
  value?: CourseItem | null;
  onChange: (course: CourseItem | null) => void;
  placeholderCode?: string;
  placeholderName?: string;
  disabled?: boolean;
  className?: string;
}

export function CourseCodePicker({
  value,
  onChange,
  placeholderCode = 'รหัส 8 หลัก (เช่น 01204111)',
  placeholderName = 'ชื่อรายวิชา (ภาษาไทยหรืออังกฤษ)',
  disabled = false,
  className,
}: CourseCodePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const currentCode = value?.code || '';
  const currentName = value?.name || '';

  // Validate 8-digit KU course code
  const isValid8Digits = /^[0-9]{8}$/.test(currentCode.trim());
  const isPartiallyTyped = currentCode.trim().length > 0 && !isValid8Digits;

  const filteredCatalog = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courseCatalog.slice(0, 8);
    return courseCatalog
      .filter(
        (c) =>
          c.code.includes(q) ||
          c.nameTh.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          (c.department && c.department.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [search]);

  const handleSelectFromCatalog = (item: (typeof courseCatalog)[0]) => {
    onChange({
      code: item.code,
      name: item.nameTh,
      department: item.department,
    });
    setOpen(false);
    setSearch('');
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextCode = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
    // Check if code matches any catalog item
    const match = courseCatalog.find((c) => c.code === nextCode);
    if (match) {
      onChange({
        code: nextCode,
        name: currentName || match.nameTh,
        department: match.department,
      });
    } else {
      onChange({
        code: nextCode,
        name: currentName,
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      code: currentCode,
      name: e.target.value,
    });
  };

  return (
    <div className={cn('flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full', className)}>
      {/* 8-Digit Course Code with Popover Suggester */}
      <div className="relative w-full sm:w-56 shrink-0">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            disabled={disabled}
            render={
              <div className="relative flex items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={currentCode}
                  onChange={handleCodeChange}
                  onFocus={() => setOpen(true)}
                  placeholder={placeholderCode}
                  disabled={disabled}
                  className={cn(
                    'w-full h-10 pl-8 pr-7 text-xs font-mono font-medium rounded-lg border border-input bg-background shadow-2xs transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
                    isValid8Digits && 'border-emerald-500 text-emerald-900 bg-emerald-50/20',
                    isPartiallyTyped && 'border-amber-400',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                />
                <BookOpen className="absolute left-2.5 size-4 text-slate-400 pointer-events-none" />
                {isValid8Digits && (
                  <Check className="absolute right-2.5 size-3.5 text-emerald-600 stroke-[3] pointer-events-none" />
                )}
                {isPartiallyTyped && (
                  <AlertCircle className="absolute right-2.5 size-3.5 text-amber-500 pointer-events-none" />
                )}
              </div>
            }
          />

          <PopoverContent
            align="start"
            sideOffset={4}
            className="w-80 p-0 rounded-xl shadow-lg border border-slate-200 bg-white overflow-hidden text-slate-900"
          >
            <div className="p-2 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
              <Search className="size-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหารหัส หรือชื่อวิชา..."
                className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
                autoFocus
              />
            </div>

            <div className="max-h-60 overflow-y-auto p-1 text-xs">
              {filteredCatalog.length === 0 ? (
                <div className="p-3 text-center text-slate-400 text-xs">
                  ไม่พบรายวิชาในหลักสูตรแนะนำ (พิมพ์รหัส 8 หลักได้โดยตรง)
                </div>
              ) : (
                filteredCatalog.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectFromCatalog(c)}
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-lg text-left hover:bg-emerald-50/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-700">{c.code}</span>
                        {c.department && <DepartmentBadge value={c.department} showTooltip={false} />}
                      </div>
                      <span className="text-[12px] text-slate-700 truncate group-hover:text-emerald-900 font-medium">
                        {c.nameTh}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">{c.nameEn}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Manual Editable Course Name */}
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          value={currentName}
          onChange={handleNameChange}
          placeholder={placeholderName}
          disabled={disabled}
          className={cn(
            'w-full h-10 px-3 text-xs rounded-lg border border-input bg-background shadow-2xs transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>
    </div>
  );
}
